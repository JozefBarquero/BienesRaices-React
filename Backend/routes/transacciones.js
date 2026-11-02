import express from 'express';
import db from '../config/db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

const METODOS_PAGO_VALIDOS = ['escrow', 'transferencia', 'financiamiento', 'mixto', 'deposito_garantia'];

router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, p.titulo AS propiedad_titulo,
                    c.id AS cliente_id, per.nombre AS cliente_nombre, per.apellidos AS cliente_apellidos,
                    per.razon_social AS cliente_razon_social
             FROM transacciones t
             INNER JOIN propiedades p ON t.propiedad_id = p.id
             INNER JOIN clientes c ON t.cliente_id = c.id
             INNER JOIN personas per ON c.persona_id = per.id
             ORDER BY t.creado_en DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT t.*, p.titulo AS propiedad_titulo
             FROM transacciones t
             INNER JOIN propiedades p ON t.propiedad_id = p.id
             WHERE t.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Transacción no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const {
        propiedad_id, cliente_id, tipo_transaccion, fecha_inicio, fecha_fin,
        plazo_meses, monto_total, moneda, metodo_pago, notas
    } = req.body;

    if (!propiedad_id || !cliente_id || !tipo_transaccion || !fecha_inicio || !monto_total || !metodo_pago) {
        return res.status(400).json({ error: 'Propiedad, cliente, tipo, fecha de inicio, monto y método de pago son obligatorios.' });
    }
    if (!['venta', 'alquiler'].includes(tipo_transaccion)) {
        return res.status(400).json({ error: 'Tipo de transacción inválido.' });
    }
    if (!METODOS_PAGO_VALIDOS.includes(metodo_pago)) {
        return res.status(400).json({ error: 'Método de pago inválido.' });
    }

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [propRows] = await conexion.query(
            'SELECT id, estado_comercial, activa FROM propiedades WHERE id = ? FOR UPDATE',
            [propiedad_id]
        );
        if (propRows.length === 0) {
            await conexion.rollback();
            return res.status(404).json({ error: 'Propiedad no encontrada.' });
        }
        if (propRows[0].estado_comercial !== 'disponible') {
            await conexion.rollback();
            return res.status(409).json({ error: 'La propiedad ya no está disponible para una nueva transacción.' });
        }

        const [result] = await conexion.query(
            `INSERT INTO transacciones
             (propiedad_id, cliente_id, tipo_transaccion, fecha_inicio, fecha_fin, plazo_meses,
              monto_total, moneda, metodo_pago, estado, notas, creado_por)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_proceso', ?, ?)`,
            [
                propiedad_id, cliente_id, tipo_transaccion, fecha_inicio, fecha_fin || null,
                plazo_meses || null, monto_total, moneda || 'USD', metodo_pago,
                notas || null, req.user.id || null
            ]
        );

        const transaccionId = result.insertId;

        if (tipo_transaccion === 'alquiler' && !plazo_meses) {
            await conexion.rollback();
            return res.status(400).json({ error: 'Para alquileres debe indicar el plazo en meses.' });
        }

        await conexion.commit();
        res.status(201).json({ success: true, id: transaccionId });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.patch('/:id/cerrar', async (req, res) => {
    const { id } = req.params;

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [transRows] = await conexion.query(
            'SELECT propiedad_id, tipo_transaccion, estado FROM transacciones WHERE id = ? FOR UPDATE',
            [id]
        );
        if (transRows.length === 0) {
            await conexion.rollback();
            return res.status(404).json({ error: 'Transacción no encontrada.' });
        }
        if (transRows[0].estado !== 'en_proceso') {
            await conexion.rollback();
            return res.status(409).json({ error: 'La transacción ya fue cerrada o cancelada.' });
        }

        const { propiedad_id, tipo_transaccion } = transRows[0];
        const nuevoEstado = tipo_transaccion === 'venta' ? 'vendida' : 'alquilada';

        await conexion.query(
            `UPDATE transacciones SET estado = 'cerrada' WHERE id = ?`,
            [id]
        );

        await conexion.query(
            `UPDATE propiedades
             SET estado_comercial = ?,
                 fecha_cambio_estado = NOW(),
                 fecha_desactivacion_programada = DATE_ADD(NOW(), INTERVAL 7 DAY)
             WHERE id = ?`,
            [nuevoEstado, propiedad_id]
        );

        await conexion.commit();
        res.json({ success: true, message: 'Transacción cerrada. La propiedad se desactivará automáticamente en 7 días.' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.patch('/:id/cancelar', async (req, res) => {
    try {
        const [result] = await db.query(
            `UPDATE transacciones SET estado = 'cancelada' WHERE id = ? AND estado = 'en_proceso'`,
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transacción no encontrada o ya procesada.' });
        }
        res.json({ success: true, message: 'Transacción cancelada.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;