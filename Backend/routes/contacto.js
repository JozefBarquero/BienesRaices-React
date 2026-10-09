import express from 'express';
import db from '../config/db.js';
import transporter from '../config/mailer.js';
import { emailNuevoMensajePropiedad } from '../templates/emailTemplates.js';
import { contactLimiter } from '../middlewares/rateLimiters.js';
import { verifyToken } from './auth.js';

const router = express.Router();

const verifyAdmin = (req, res, next) => {
    if (req.user.rol !== 'Administrador') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador.' });
    }
    next();
};

const notificarCreadorPropiedad = async ({ propiedadId, clienteNombre, clienteEmail, clienteTelefono, mensaje }) => {
    try {
        const [rows] = await db.query(
            `SELECT p.titulo AS propiedad_titulo,
                    t.email AS creador_email,
                    pe.nombre AS creador_nombre,
                    pe.apellidos AS creador_apellidos
             FROM propiedades p
             INNER JOIN trabajadores t ON p.creado_por = t.id
             INNER JOIN personas pe ON t.persona_id = pe.id
             WHERE p.id = ? AND t.activo = TRUE`,
            [propiedadId]
        );

        if (rows.length === 0 || !rows[0].creador_email) return;

        const row = rows[0];
        const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/dashboard`;

        const template = emailNuevoMensajePropiedad({
            trabajadorNombre: `${row.creador_nombre} ${row.creador_apellidos || ''}`.trim(),
            propiedadTitulo: row.propiedad_titulo,
            propiedadId,
            clienteNombre,
            clienteEmail,
            clienteTelefono,
            mensaje,
            dashboardUrl
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: row.creador_email,
            subject: template.subject,
            html: template.html
        });
    } catch (error) {
        console.error('Error al notificar al creador de la propiedad:', error.message);
    }
};

router.post('/', contactLimiter, async (req, res) => {
    const { propiedad_id, nombre_cliente, email_cliente, telefono_cliente, mensaje, origen, prioridad } = req.body;

    if (!nombre_cliente || !email_cliente || !mensaje) {
        return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_cliente)) {
        return res.status(400).json({ error: 'Correo electrónico inválido.' });
    }
    if (String(mensaje).length > 5000) {
        return res.status(400).json({ error: 'El mensaje es demasiado largo.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO mensajes_contacto
             (propiedad_id, nombre_cliente, email_cliente, telefono_cliente, mensaje, origen, prioridad, estado, activo)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'nuevo', TRUE)`,
            [
                propiedad_id || null,
                nombre_cliente,
                email_cliente,
                telefono_cliente || null,
                mensaje,
                origen || 'web',
                prioridad || 'media'
            ]
        );

        res.status(201).json({ success: true, id: result.insertId });

        if (propiedad_id) {
            notificarCreadorPropiedad({
                propiedadId: propiedad_id,
                clienteNombre: nombre_cliente,
                clienteEmail: email_cliente,
                clienteTelefono: telefono_cliente,
                mensaje
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.use(verifyToken, verifyAdmin);

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT m.*, p.titulo AS propiedad_titulo,
                    t.id AS asignado_id, pe.nombre AS asignado_nombre, pe.apellidos AS asignado_apellidos
             FROM mensajes_contacto m
             LEFT JOIN propiedades p ON m.propiedad_id = p.id
             LEFT JOIN trabajadores t ON m.asignado_a = t.id
             LEFT JOIN personas pe ON t.persona_id = pe.id
             ORDER BY m.fecha_envio DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT m.*, p.titulo AS propiedad_titulo
             FROM mensajes_contacto m
             LEFT JOIN propiedades p ON m.propiedad_id = p.id
             WHERE m.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Mensaje no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { estado, asignado_a, notas_internas, prioridad, activo } = req.body;
    const { id } = req.params;

    try {
        await db.query(
            `UPDATE mensajes_contacto
             SET estado = COALESCE(?, estado),
                 asignado_a = ?,
                 notas_internas = COALESCE(?, notas_internas),
                 prioridad = COALESCE(?, prioridad),
                 activo = COALESCE(?, activo)
             WHERE id = ?`,
            [
                estado || null,
                asignado_a || null,
                notas_internas || null,
                prioridad || null,
                activo !== undefined ? activo : null,
                id
            ]
        );
        res.json({ success: true, message: 'Mensaje actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/contacto', async (req, res) => {
    try {
        await db.query(
            `UPDATE mensajes_contacto
             SET fecha_ultimo_contacto = CURRENT_TIMESTAMP,
                 intentos_contacto = intentos_contacto + 1,
                 estado = CASE WHEN estado = 'nuevo' THEN 'en_proceso' ELSE estado END
             WHERE id = ?`,
            [req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('UPDATE mensajes_contacto SET activo = FALSE WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Mensaje no encontrado' });
        res.json({ success: true, message: 'Mensaje desactivado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;