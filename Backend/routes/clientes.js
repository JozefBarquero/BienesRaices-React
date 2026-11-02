import express from 'express';
import db from '../config/db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

const TIPOS_CLIENTE_VALIDOS = ['comprador', 'inquilino', 'inversionista'];
const MONEDAS_VALIDAS = ['USD', 'CRC', 'EUR'];

const sanitizeDecimal = (val) => {
    if (val === undefined || val === null) return null;
    const str = String(val).trim();
    if (str === '') return null;
    const n = Number(str);
    if (isNaN(n) || !isFinite(n)) return null;
    return n;
};

const sanitizeIntOrNull = (val) => {
    if (val === undefined || val === null) return null;
    const str = String(val).trim();
    if (str === '') return null;
    const n = Number(str);
    if (isNaN(n) || !isFinite(n) || !Number.isInteger(n)) return null;
    return n;
};

const validarRangoPresupuesto = (min, max) => {
    if (min !== null && max !== null && min > max) {
        return 'El presupuesto mínimo no puede ser mayor al máximo.';
    }
    return null;
};

router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.id, c.persona_id, c.tipo_cliente, c.presupuesto_min, c.presupuesto_max,
                    c.moneda_presupuesto, c.zonas_interes, c.tipo_inmueble_preferido,
                    c.notas_seguimiento, c.activo,
                    p.tipo_persona, p.nombre, p.apellidos, p.razon_social,
                    p.documento_identidad, p.tipo_documento, p.email, p.telefono, p.direccion,
                    ti.nombre AS tipo_inmueble_texto
             FROM clientes c
             INNER JOIN personas p ON c.persona_id = p.id
             LEFT JOIN tipos_inmueble ti ON c.tipo_inmueble_preferido = ti.id
             ORDER BY COALESCE(p.razon_social, CONCAT(p.nombre, ' ', COALESCE(p.apellidos, ''))) ASC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.id, c.persona_id, c.tipo_cliente, c.presupuesto_min, c.presupuesto_max,
                    c.moneda_presupuesto, c.zonas_interes, c.tipo_inmueble_preferido,
                    c.notas_seguimiento, c.activo,
                    p.tipo_persona, p.nombre, p.apellidos, p.razon_social,
                    p.documento_identidad, p.tipo_documento, p.email, p.telefono, p.direccion
             FROM clientes c
             INNER JOIN personas p ON c.persona_id = p.id
             WHERE c.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const {
        tipo_persona, nombre, apellidos, razon_social, documento_identidad, tipo_documento,
        email, telefono, direccion, tipo_cliente, presupuesto_min, presupuesto_max,
        moneda_presupuesto, zonas_interes, tipo_inmueble_preferido, notas_seguimiento
    } = req.body;

    if (!documento_identidad || !tipo_documento || !tipo_cliente) {
        return res.status(400).json({ error: 'Documento, tipo de documento y tipo de cliente son obligatorios.' });
    }
    if (!TIPOS_CLIENTE_VALIDOS.includes(tipo_cliente)) {
        return res.status(400).json({ error: 'Tipo de cliente inválido.' });
    }
    if (moneda_presupuesto && !MONEDAS_VALIDAS.includes(moneda_presupuesto)) {
        return res.status(400).json({ error: 'Moneda de presupuesto inválida.' });
    }
    if (tipo_persona === 'fisica' && (!nombre || !apellidos)) {
        return res.status(400).json({ error: 'Nombre y apellidos son obligatorios para persona física.' });
    }
    if (tipo_persona === 'juridica' && !razon_social) {
        return res.status(400).json({ error: 'La razón social es obligatoria para persona jurídica.' });
    }

    const minNum = sanitizeDecimal(presupuesto_min);
    const maxNum = sanitizeDecimal(presupuesto_max);
    const tipoInmuebleNum = sanitizeIntOrNull(tipo_inmueble_preferido);

    const rangoError = validarRangoPresupuesto(minNum, maxNum);
    if (rangoError) {
        return res.status(400).json({ error: rangoError });
    }

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [existing] = await conexion.query(
            'SELECT id FROM personas WHERE documento_identidad = ? LIMIT 1',
            [documento_identidad]
        );
        if (existing.length > 0) {
            await conexion.rollback();
            return res.status(409).json({ error: 'Ya existe una persona con ese documento de identidad.' });
        }

        const [personaResult] = await conexion.query(
            `INSERT INTO personas (tipo_persona, nombre, apellidos, razon_social,
                                   documento_identidad, tipo_documento, email, telefono, direccion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                tipo_persona || 'fisica',
                tipo_persona === 'fisica' ? nombre : null,
                tipo_persona === 'fisica' ? apellidos : null,
                tipo_persona === 'juridica' ? razon_social : null,
                documento_identidad,
                tipo_documento,
                email || null,
                telefono || null,
                direccion || null
            ]
        );

        const persona_id = personaResult.insertId;

        const [clienteResult] = await conexion.query(
            `INSERT INTO clientes (persona_id, tipo_cliente, presupuesto_min, presupuesto_max,
                                   moneda_presupuesto, zonas_interes, tipo_inmueble_preferido,
                                   notas_seguimiento, creado_por)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                persona_id,
                tipo_cliente,
                minNum,
                maxNum,
                moneda_presupuesto || 'USD',
                zonas_interes || null,
                tipoInmuebleNum,
                notas_seguimiento || null,
                req.user.id || null
            ]
        );

        await conexion.commit();
        res.status(201).json({ success: true, id: clienteResult.insertId });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.put('/:id', async (req, res) => {
    const {
        nombre, apellidos, razon_social, email, telefono, direccion,
        tipo_cliente, presupuesto_min, presupuesto_max, moneda_presupuesto,
        zonas_interes, tipo_inmueble_preferido, notas_seguimiento, activo
    } = req.body;
    const { id } = req.params;

    if (moneda_presupuesto && !MONEDAS_VALIDAS.includes(moneda_presupuesto)) {
        return res.status(400).json({ error: 'Moneda de presupuesto inválida.' });
    }

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [clienteRows] = await conexion.query(
            'SELECT persona_id, presupuesto_min, presupuesto_max FROM clientes WHERE id = ?',
            [id]
        );
        if (clienteRows.length === 0) {
            await conexion.rollback();
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        const persona_id = clienteRows[0].persona_id;

        const minProvided = presupuesto_min !== undefined;
        const maxProvided = presupuesto_max !== undefined;
        const incomingMin = minProvided ? sanitizeDecimal(presupuesto_min) : null;
        const incomingMax = maxProvided ? sanitizeDecimal(presupuesto_max) : null;

        const currentMin = clienteRows[0].presupuesto_min !== null
            ? Number(clienteRows[0].presupuesto_min) : null;
        const currentMax = clienteRows[0].presupuesto_max !== null
            ? Number(clienteRows[0].presupuesto_max) : null;

        const finalMin = minProvided ? incomingMin : currentMin;
        const finalMax = maxProvided ? incomingMax : currentMax;

        const rangoError = validarRangoPresupuesto(finalMin, finalMax);
        if (rangoError) {
            await conexion.rollback();
            return res.status(400).json({ error: rangoError });
        }

        await conexion.query(
            `UPDATE personas SET nombre = COALESCE(?, nombre), apellidos = COALESCE(?, apellidos),
             razon_social = COALESCE(?, razon_social), email = COALESCE(?, email),
             telefono = COALESCE(?, telefono), direccion = COALESCE(?, direccion) WHERE id = ?`,
            [nombre, apellidos, razon_social, email, telefono, direccion, persona_id]
        );

        const updates = [];
        const params = [];

        if (tipo_cliente !== undefined) {
            updates.push('tipo_cliente = ?');
            params.push(tipo_cliente);
        }
        if (minProvided) {
            updates.push('presupuesto_min = ?');
            params.push(incomingMin);
        }
        if (maxProvided) {
            updates.push('presupuesto_max = ?');
            params.push(incomingMax);
        }
        if (moneda_presupuesto !== undefined) {
            updates.push('moneda_presupuesto = ?');
            params.push(moneda_presupuesto);
        }
        if (zonas_interes !== undefined) {
            updates.push('zonas_interes = ?');
            params.push(zonas_interes === '' ? null : zonas_interes);
        }
        if (tipo_inmueble_preferido !== undefined) {
            updates.push('tipo_inmueble_preferido = ?');
            params.push(sanitizeIntOrNull(tipo_inmueble_preferido));
        }
        if (notas_seguimiento !== undefined) {
            updates.push('notas_seguimiento = ?');
            params.push(notas_seguimiento === '' ? null : notas_seguimiento);
        }
        if (activo !== undefined) {
            updates.push('activo = ?');
            params.push(activo);
        }

        if (updates.length > 0) {
            params.push(id);
            await conexion.query(
                `UPDATE clientes SET ${updates.join(', ')} WHERE id = ?`,
                params
            );
        }

        await conexion.commit();
        res.json({ success: true, message: 'Cliente actualizado' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('UPDATE clientes SET activo = FALSE WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json({ success: true, message: 'Cliente desactivado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;