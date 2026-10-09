import express from 'express';
import db from '../config/db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

const TIPOS_DOCUMENTO_VALIDOS = ['cedula', 'pasaporte', 'ruc', 'otro'];
const TIPOS_PERSONA_VALIDOS = ['fisica', 'juridica'];

const validarDatosPropietario = (data) => {
    const errores = [];
    if (!data.documento_identidad) errores.push('El documento de identidad es obligatorio.');
    if (!data.tipo_documento || !TIPOS_DOCUMENTO_VALIDOS.includes(data.tipo_documento)) {
        errores.push('Tipo de documento inválido.');
    }
    if (!data.tipo_persona || !TIPOS_PERSONA_VALIDOS.includes(data.tipo_persona)) {
        errores.push('Tipo de persona inválido.');
    }
    if (data.tipo_persona === 'fisica') {
        if (!data.nombre) errores.push('El nombre es obligatorio.');
        if (!data.apellidos) errores.push('Los apellidos son obligatorios.');
    }
    if (data.tipo_persona === 'juridica') {
        if (!data.razon_social) errores.push('La razón social es obligatoria.');
    }
    return errores;
};

const contarPropiedadesActivas = async (conexion, propietarioId) => {
    const [rows] = await conexion.query(
        'SELECT COUNT(*) AS total FROM propiedades WHERE propietario_id = ? AND activa = TRUE',
        [propietarioId]
    );
    return rows[0].total;
};

router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT pr.id, pr.persona_id, pr.notas, pr.activo,
                    pe.tipo_persona, pe.nombre, pe.apellidos, pe.razon_social,
                    pe.documento_identidad, pe.tipo_documento, pe.email, pe.telefono, pe.direccion,
                    pe.creado_en, pe.actualizado_en
             FROM propietarios pr
             INNER JOIN personas pe ON pr.persona_id = pe.id
             ORDER BY COALESCE(pe.razon_social, CONCAT(pe.nombre, ' ', COALESCE(pe.apellidos, ''))) ASC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/activos', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT pr.id, pe.tipo_persona, pe.nombre, pe.apellidos, pe.razon_social, pe.documento_identidad
             FROM propietarios pr
             INNER JOIN personas pe ON pr.persona_id = pe.id
             WHERE pr.activo = TRUE
             ORDER BY COALESCE(pe.razon_social, CONCAT(pe.nombre, ' ', COALESCE(pe.apellidos, ''))) ASC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT pr.id, pr.persona_id, pr.notas, pr.activo,
                    pe.tipo_persona, pe.nombre, pe.apellidos, pe.razon_social,
                    pe.documento_identidad, pe.tipo_documento, pe.email, pe.telefono, pe.direccion
             FROM propietarios pr
             INNER JOIN personas pe ON pr.persona_id = pe.id
             WHERE pr.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Propietario no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const data = req.body;
    const errores = validarDatosPropietario(data);
    if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [existing] = await conexion.query(
            'SELECT id FROM personas WHERE documento_identidad = ? LIMIT 1',
            [data.documento_identidad]
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
                data.tipo_persona,
                data.tipo_persona === 'fisica' ? data.nombre : null,
                data.tipo_persona === 'fisica' ? data.apellidos : null,
                data.tipo_persona === 'juridica' ? data.razon_social : null,
                data.documento_identidad,
                data.tipo_documento,
                data.email || null,
                data.telefono || null,
                data.direccion || null
            ]
        );

        const persona_id = personaResult.insertId;

        const [propResult] = await conexion.query(
            'INSERT INTO propietarios (persona_id, notas, activo) VALUES (?, ?, TRUE)',
            [persona_id, data.notas || null]
        );

        await conexion.commit();
        res.status(201).json({ success: true, id: propResult.insertId });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.put('/:id', async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    const errores = validarDatosPropietario(data);
    if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });

    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [propRows] = await conexion.query('SELECT persona_id, activo FROM propietarios WHERE id = ?', [id]);
        if (propRows.length === 0) {
            await conexion.rollback();
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }
        const persona_id = propRows[0].persona_id;
        const estabaActivo = Boolean(propRows[0].activo);
        const quiereDesactivar = data.activo === false || data.activo === 0;

        if (estabaActivo && quiereDesactivar) {
            const total = await contarPropiedadesActivas(conexion, id);
            if (total > 0) {
                await conexion.rollback();
                return res.status(409).json({
                    error: `No se puede desactivar el propietario: tiene ${total} propiedad(es) activa(s). Desactiva primero todas sus propiedades.`
                });
            }
        }

        const [dup] = await conexion.query(
            'SELECT id FROM personas WHERE documento_identidad = ? AND id <> ? LIMIT 1',
            [data.documento_identidad, persona_id]
        );
        if (dup.length > 0) {
            await conexion.rollback();
            return res.status(409).json({ error: 'Ya existe otra persona con ese documento de identidad.' });
        }

        await conexion.query(
            `UPDATE personas
             SET tipo_persona = ?, nombre = ?, apellidos = ?, razon_social = ?,
                 documento_identidad = ?, tipo_documento = ?, email = ?, telefono = ?, direccion = ?
             WHERE id = ?`,
            [
                data.tipo_persona,
                data.tipo_persona === 'fisica' ? (data.nombre || null) : null,
                data.tipo_persona === 'fisica' ? (data.apellidos || null) : null,
                data.tipo_persona === 'juridica' ? (data.razon_social || null) : null,
                data.documento_identidad,
                data.tipo_documento,
                data.email || null,
                data.telefono || null,
                data.direccion || null,
                persona_id
            ]
        );

        await conexion.query(
            'UPDATE propietarios SET notas = ?, activo = ? WHERE id = ?',
            [data.notas || null, data.activo !== undefined ? data.activo : true, id]
        );

        await conexion.commit();
        res.json({ success: true, message: 'Propietario actualizado' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.delete('/:id', async (req, res) => {
    const conexion = await db.getConnection();
    try {
        await conexion.beginTransaction();

        const [propRows] = await conexion.query('SELECT activo FROM propietarios WHERE id = ?', [req.params.id]);
        if (propRows.length === 0) {
            await conexion.rollback();
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }

        const total = await contarPropiedadesActivas(conexion, req.params.id);
        if (total > 0) {
            await conexion.rollback();
            return res.status(409).json({
                error: `No se puede desactivar el propietario: tiene ${total} propiedad(es) activa(s). Desactiva primero todas sus propiedades.`
            });
        }

        await conexion.query('UPDATE propietarios SET activo = FALSE WHERE id = ?', [req.params.id]);
        await conexion.commit();
        res.json({ success: true, message: 'Propietario desactivado' });
    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

export default router;