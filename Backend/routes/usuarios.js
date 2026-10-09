import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import transporter from '../config/mailer.js';
import { verifyToken } from './auth.js';
import 'dotenv/config';

const router = express.Router();

const TIPOS_DOCUMENTO_VALIDOS = ['cedula', 'pasaporte', 'ruc', 'otro'];

const verifyAdmin = (req, res, next) => {
    if (req.user.rol !== 'Administrador') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador.' });
    }
    next();
};

router.use(verifyToken, verifyAdmin);

router.get('/', async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT t.id, p.nombre, p.apellidos, p.documento_identidad, p.tipo_documento,
                    p.telefono, p.direccion,
                    t.email, t.rol, t.cargo, t.activo, t.fecha_ingreso, t.fecha_salida, t.creado_en
             FROM trabajadores t
             INNER JOIN personas p ON t.persona_id = p.id
             ORDER BY t.creado_en DESC`
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const {
        id, nombre, apellidos, email, password, rol, cargo,
        tipo_documento, telefono, direccion,
        fecha_contratacion, fecha_fin_contratacion
    } = req.body;

    if (!id || !nombre || !apellidos || !email || !password) {
        return res.status(400).json({ error: 'Cédula, nombre, apellidos, email y contraseña son obligatorios.' });
    }
    if (String(password).length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    if (tipo_documento && !TIPOS_DOCUMENTO_VALIDOS.includes(tipo_documento)) {
        return res.status(400).json({ error: 'Tipo de documento inválido.' });
    }

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [existing] = await conexion.query(
            'SELECT id FROM personas WHERE documento_identidad = ? OR email = ? LIMIT 1',
            [id, email]
        );
        if (existing.length > 0) {
            await conexion.rollback();
            return res.status(409).json({ error: 'Ya existe una persona con ese documento o email.' });
        }

        const [personaResult] = await conexion.query(
            `INSERT INTO personas (tipo_persona, nombre, apellidos, documento_identidad, tipo_documento, email, telefono, direccion)
             VALUES ('fisica', ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre, apellidos, id,
                tipo_documento || 'cedula',
                email,
                telefono || null,
                direccion || null
            ]
        );

        const persona_id = personaResult.insertId;
        const hash = await bcrypt.hash(password, 10);

        await conexion.query(
            `INSERT INTO trabajadores (id, persona_id, email, password_hash, rol, cargo, activo, fecha_ingreso, fecha_salida)
             VALUES (?, ?, ?, ?, ?, ?, true, ?, ?)`,
            [
                id, persona_id, email, hash,
                rol || 'agente_inmobiliario',
                cargo || null,
                fecha_contratacion,
                fecha_fin_contratacion || null
            ]
        );

        await conexion.commit();

        try {
            const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${resetToken}`;

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Bienvenido a Bienes Raíces - Establece tu contraseña',
                html: `
                    <h2>¡Bienvenido ${nombre} ${apellidos}!</h2>
                    <p>Tu cuenta ha sido creada exitosamente en el sistema de administración de Bienes Raíces.</p>
                    <p>Tu usuario (Cédula) es: <strong>${id}</strong></p>
                    <p>Por seguridad, te recomendamos establecer una contraseña personal haciendo clic en el siguiente enlace:</p>
                    <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#0d6efd;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:15px;">Establecer Contraseña</a>
                `
            });
        } catch (mailError) {
            console.error('Error enviando correo de bienvenida:', mailError.message);
        }

        res.json({ success: true, message: 'Usuario creado y correo de bienvenida enviado' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: 'Error al crear usuario. Verifica que el email o ID no estén duplicados.' });
    } finally {
        conexion.release();
    }
});

router.put('/:id', async (req, res) => {
    const {
        nombre, apellidos, email, rol, cargo, password, activo,
        tipo_documento, telefono, direccion,
        fecha_contratacion, fecha_fin_contratacion
    } = req.body;
    const { id } = req.params;

    if (tipo_documento && !TIPOS_DOCUMENTO_VALIDOS.includes(tipo_documento)) {
        return res.status(400).json({ error: 'Tipo de documento inválido.' });
    }
    if (password && String(password).length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        const [trabajadorRows] = await conexion.query('SELECT persona_id FROM trabajadores WHERE id = ?', [id]);
        if (trabajadorRows.length === 0) {
            await conexion.rollback();
            return res.status(404).json({ error: 'Trabajador no encontrado' });
        }
        const persona_id = trabajadorRows[0].persona_id;

        const [dup] = await conexion.query(
            'SELECT id FROM personas WHERE email = ? AND id <> ? LIMIT 1',
            [email, persona_id]
        );
        if (dup.length > 0) {
            await conexion.rollback();
            return res.status(409).json({ error: 'Ese email ya está en uso por otra persona.' });
        }

        await conexion.query(
            `UPDATE personas
             SET nombre = ?, apellidos = ?, email = ?,
                 tipo_documento = COALESCE(?, tipo_documento),
                 telefono = ?, direccion = ?
             WHERE id = ?`,
            [
                nombre, apellidos, email,
                tipo_documento || null,
                telefono || null,
                direccion || null,
                persona_id
            ]
        );

        let query = 'UPDATE trabajadores SET email = ?, rol = ?, cargo = ?, activo = ?, fecha_ingreso = ?, fecha_salida = ?';
        let params = [
            email, rol, cargo || null,
            activo !== undefined ? activo : true,
            fecha_contratacion,
            fecha_fin_contratacion || null
        ];

        if (password) {
            const hash = await bcrypt.hash(password, 10);
            query += ', password_hash = ?';
            params.push(hash);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await conexion.query(query, params);
        await conexion.commit();
        res.json({ success: true, message: 'Usuario actualizado' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (String(id) === String(req.user.id)) {
        return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta.' });
    }

    try {
        await db.query('UPDATE trabajadores SET activo = FALSE WHERE id = ?', [id]);
        res.json({ success: true, message: 'Usuario desactivado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;