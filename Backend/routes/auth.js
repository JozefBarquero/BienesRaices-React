import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import transporter from '../config/mailer.js';
import { emailLoginAlert, emailForgotPassword } from '../templates/emailTemplates.js';
import { loginLimiter, forgotPasswordLimiter, resetPasswordLimiter, bootstrapLimiter } from '../middlewares/rateLimiters.js';
import 'dotenv/config';

const router = express.Router();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

router.get('/verify', verifyToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/needs-bootstrap', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM trabajadores');
        res.json({ needsBootstrap: rows[0].total === 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/bootstrap', bootstrapLimiter, async (req, res) => {
    const { id, nombre, apellidos, email, password } = req.body;

    if (!id || !nombre || !apellidos || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    if (String(password).length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Correo electrónico inválido.' });
    }

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [countRows] = await conexion.query('SELECT COUNT(*) AS total FROM trabajadores FOR UPDATE');
        if (countRows[0].total > 0) {
            await conexion.rollback();
            return res.status(403).json({ error: 'El sistema ya cuenta con trabajadores registrados.' });
        }

        const [existing] = await conexion.query(
            'SELECT id FROM personas WHERE documento_identidad = ? OR email = ? LIMIT 1',
            [id, email]
        );
        if (existing.length > 0) {
            await conexion.rollback();
            return res.status(409).json({ error: 'Ya existe una persona con ese documento o email.' });
        }

        const [personaResult] = await conexion.query(
            `INSERT INTO personas (tipo_persona, nombre, apellidos, documento_identidad, tipo_documento, email)
             VALUES ('fisica', ?, ?, ?, 'cedula', ?)`,
            [nombre, apellidos, id, email]
        );

        const persona_id = personaResult.insertId;
        const hash = await bcrypt.hash(password, 10);
        const hoy = new Date().toISOString().split('T')[0];

        await conexion.query(
            `INSERT INTO trabajadores (id, persona_id, email, password_hash, rol, cargo, activo, fecha_ingreso)
             VALUES (?, ?, ?, ?, 'Administrador', 'Administrador del sistema', true, ?)`,
            [id, persona_id, email, hash, hoy]
        );

        await conexion.commit();
        res.json({ success: true, message: 'Cuenta de administrador creada correctamente.' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query(
            `SELECT t.id, t.email, t.password_hash, t.rol, t.activo,
                    p.nombre, p.apellidos
             FROM trabajadores t
             INNER JOIN personas p ON t.persona_id = p.id
             WHERE t.email = ?`,
            [email]
        );
        if (!users || users.length === 0) return res.status(401).json({ error: 'Credenciales invalidas' });

        const admin = users[0];
        if (!admin.password_hash || admin.activo === 0) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const esValida = await bcrypt.compare(password, admin.password_hash);

        if (esValida) {
            const token = jwt.sign(
                { id: admin.id, email: admin.email, nombre: admin.nombre, apellidos: admin.apellidos, rol: admin.rol },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            const resetToken = jwt.sign(
                { email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${resetToken}`;

            const fechaInicio = new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' });

            const template = emailLoginAlert({ nombre: admin.nombre, fechaInicio, resetLink });

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: admin.email,
                subject: template.subject,
                html: template.html
            });

            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 8 * 60 * 60 * 1000
            });

            return res.json({ success: true, user: { id: admin.id, email: admin.email, nombre: admin.nombre, apellidos: admin.apellidos, rol: admin.rol } });
        } else {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return res.json({ success: true, message: 'Sesión cerrada exitosamente' });
});

router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.query(
            `SELECT t.id, t.email, p.nombre
             FROM trabajadores t
             INNER JOIN personas p ON t.persona_id = p.id
             WHERE t.email = ? AND t.activo = true`,
            [email]
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o inactivo.' });
        }

        const user = users[0];
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${token}`;

        const template = emailForgotPassword({ nombre: user.nombre, resetLink });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: template.subject,
            html: template.html
        });

        res.json({ success: true, message: 'Enlace enviado al correo electrónico.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reset-password', resetPasswordLimiter, async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (String(password).length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'UPDATE trabajadores SET password_hash = ? WHERE email = ?',
            [hashedPassword, decoded.email]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'No se pudo actualizar la contraseña.' });
        }

        res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        res.status(400).json({ error: 'Token inválido o expirado.' });
    }
});

export default router;