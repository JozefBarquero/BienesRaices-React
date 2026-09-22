import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import transporter from '../config/mailer.js';
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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM usuarios_admin WHERE email = ?', [email]);
        if (!users || users.length === 0) return res.status(401).json({ error: 'Credenciales invalidas' });

        const admin = users[0];
        const esValida = await bcrypt.compare(password, admin.password_hash);

        if (esValida) {
            const token = jwt.sign(
                { id: admin.id, email: admin.email, rol: admin.rol },
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

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: admin.email,
                subject: 'Alerta de Inicio de Sesión - Bienes Raíces',
                html: `
                    <h2>Nuevo inicio de sesión detectado</h2>
                    <p>Hola ${admin.nombre},</p>
                    <p>Se ha registrado un inicio de sesión exitoso en tu cuenta el <strong>${fechaInicio}</strong>.</p>
                    <p>Si no fuiste tú quien inició sesión, por favor cambia tu contraseña de inmediato haciendo clic en el siguiente botón:</p>
                    <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#0d6efd;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:15px;">Cambiar Contraseña</a>
                `
            });

            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 8 * 60 * 60 * 1000
            });

            return res.json({ success: true, user: { id: admin.id, email: admin.email, nombre: admin.nombre, rol: admin.rol } });
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

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM usuarios_admin WHERE email = ? AND activo = true', [email]);
        
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o inactivo.' });
        }

        const user = users[0];
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Bienes Raíces - Recuperación de contraseña',
            html: `
                <h2>Hola ${user.nombre},</h2>
                <p>Se ha solicitado un restablecimiento de contraseña o se ha detectado un inicio de sesión sospechoso.</p>
                <p>Si no fuiste tú, por favor ignora este correo y contáctanos.</p>
                <p>Para establecer una nueva contraseña, haz clic en el siguiente enlace:</p>
                <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#0d6efd;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:15px;">Establecer Nueva Contraseña</a>
            `
        });

        res.json({ success: true, message: 'Enlace enviado al correo electrónico.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'UPDATE usuarios_admin SET password_hash = ? WHERE email = ?',
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