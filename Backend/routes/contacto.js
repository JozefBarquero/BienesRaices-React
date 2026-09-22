import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import transporter from '../config/mailer.js';
import { verifyToken } from './auth.js';
import 'dotenv/config';

const router = express.Router();

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
            'SELECT id, nombre, apellidos, email, rol, activo, fecha_contratacion, fecha_fin_contratacion, creado_en FROM usuarios_admin ORDER BY creado_en DESC'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { id, nombre, apellidos, email, rol, fecha_contratacion, fecha_fin_contratacion } = req.body;
    try {
        await db.query(
            'INSERT INTO usuarios_admin (id, nombre, apellidos, email, rol, activo, fecha_contratacion, fecha_fin_contratacion) VALUES (?, ?, ?, ?, ?, true, ?, ?)',
            [id, nombre, apellidos, email, rol || 'agente_inmobiliario', fecha_contratacion, fecha_fin_contratacion || null]
        );

        const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Bienvenido a Bienes Raíces - Establece tu contraseña',
            html: `
                <h2>¡Bienvenido ${nombre} ${apellidos}!</h2>
                <p>Tu cuenta ha sido creada exitosamente en el sistema de administración de Bienes Raíces.</p>
                <p>Tu usuario (Cédula) es: <strong>${id}</strong></p>
                <p>Para establecer tu contraseña y acceder al sistema, haz clic en el siguiente enlace:</p>
                <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#0d6efd;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:15px;">Establecer Contraseña</a>
            `
        });

        res.json({ success: true, message: 'Usuario creado y correo de bienvenida enviado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { nombre, apellidos, email, rol, activo, fecha_contratacion, fecha_fin_contratacion } = req.body;
    const { id } = req.params;
    
    try {
        await db.query(
            'UPDATE usuarios_admin SET nombre = ?, apellidos = ?, email = ?, rol = ?, activo = ?, fecha_contratacion = ?, fecha_fin_contratacion = ? WHERE id = ?',
            [nombre, apellidos, email, rol, activo !== undefined ? activo : true, fecha_contratacion, fecha_fin_contratacion || null, id]
        );
        res.json({ success: true, message: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (String(id) === String(req.user.id)) {
        return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta.' });
    }
    
    try {
        await db.query('UPDATE usuarios_admin SET activo = FALSE WHERE id = ?', [id]);
        res.json({ success: true, message: 'Usuario desactivado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;