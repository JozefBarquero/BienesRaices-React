import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { verifyToken } from './auth.js';

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
            'SELECT id, nombre, email, rol, activo, creado_en FROM usuarios_admin ORDER BY id DESC'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO usuarios_admin (nombre, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, true)',
            [nombre, email, hash, rol || 'agente_inmobiliario']
        );
        res.json({ success: true, message: 'Usuario creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario. Verifica que el email no esté duplicado.' });
    }
});

router.put('/:id', async (req, res) => {
    const { nombre, email, rol, password, activo } = req.body;
    const { id } = req.params;
    
    try {
        let query = 'UPDATE usuarios_admin SET nombre = ?, email = ?, rol = ?, activo = ?';
        let params = [nombre, email, rol, activo !== undefined ? activo : true];

        if (password) {
            const hash = await bcrypt.hash(password, 10);
            query += ', password_hash = ?';
            params.push(hash);
        }
        
        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);
        res.json({ success: true, message: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (parseInt(id) === req.user.id) {
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