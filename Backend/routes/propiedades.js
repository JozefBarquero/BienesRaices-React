import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { uploadMiddleware, procesarYGuardarImagen } from '../utils/imageProcessor.js';
import { verifyToken } from './auth.js';
import { broadcast } from '../sse/catalogoBus.js';
import { uploadLimiter } from '../middlewares/rateLimiters.js';
import { PropertySchema } from '../schemas/index.js';

const router = express.Router();

router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

const getSessionUser = (req) => {
    const token = req.cookies?.adminToken;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
        return null;
    }
};

const getPropiedadCompleta = async (id) => {
    const [rows] = await db.query(`
        SELECT p.*,
               ti.nombre AS tipo_inmueble_texto,
               prop.id AS propietario_ref_id,
               per.nombre AS propietario_nombre,
               per.apellidos AS propietario_apellidos,
               per.razon_social AS propietario_razon_social,
               per.documento_identidad AS propietario_documento,
               JSON_ARRAYAGG(i.url_imagen) AS imagenes_secundarias
        FROM propiedades p
        LEFT JOIN tipos_inmueble ti ON p.tipo_inmueble_id = ti.id
        LEFT JOIN propietarios prop ON p.propietario_id = prop.id
        LEFT JOIN personas per ON prop.persona_id = per.id
        LEFT JOIN imagenes_propiedad i ON p.id = i.propiedad_id
        WHERE p.id = ?
        GROUP BY p.id
    `, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
        ...row,
        imagenes_secundarias: row.imagenes_secundarias[0] === null ? [] : row.imagenes_secundarias
    };
};

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.id, p.titulo, p.descripcion_corta, p.descripcion_larga,
                   p.ubicacion, p.direccion_exacta, p.latitud, p.longitud,
                   p.tipo_inmueble_id, p.tipo_operacion, p.precio, p.moneda,
                   p.tipo_precio, p.habitaciones, p.banos, p.estacionamientos,
                   p.area_construida, p.area_terreno, p.imagen_principal, p.url_video,
                   p.destacada, p.activa, p.estado_comercial, p.fecha_creacion,
                   ti.nombre AS tipo_inmueble_texto,
                   JSON_ARRAYAGG(i.url_imagen) AS imagenes_secundarias
            FROM propiedades p
            LEFT JOIN tipos_inmueble ti ON p.tipo_inmueble_id = ti.id
            LEFT JOIN imagenes_propiedad i ON p.id = i.propiedad_id
            WHERE p.activa = TRUE
            GROUP BY p.id
            ORDER BY p.fecha_creacion DESC
        `);

        const propiedadesLimpias = rows.map(row => ({
            ...row,
            imagenes_secundarias: row.imagenes_secundarias[0] === null ? [] : row.imagenes_secundarias
        }));

        res.json(propiedadesLimpias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*,
                   ti.nombre AS tipo_inmueble_texto,
                   prop.id AS propietario_ref_id,
                   per.nombre AS propietario_nombre,
                   per.apellidos AS propietario_apellidos,
                   per.razon_social AS propietario_razon_social,
                   per.documento_identidad AS propietario_documento,
                   JSON_ARRAYAGG(i.url_imagen) AS imagenes_secundarias
            FROM propiedades p
            LEFT JOIN tipos_inmueble ti ON p.tipo_inmueble_id = ti.id
            LEFT JOIN propietarios prop ON p.propietario_id = prop.id
            LEFT JOIN personas per ON prop.persona_id = per.id
            LEFT JOIN imagenes_propiedad i ON p.id = i.propiedad_id
            GROUP BY p.id
            ORDER BY p.fecha_creacion DESC
        `);

        const propiedadesAdmin = rows.map(row => ({
            ...row,
            imagenes_secundarias: row.imagenes_secundarias[0] === null ? [] : row.imagenes_secundarias
        }));

        res.json(propiedadesAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/metricas', verifyToken, async (req, res) => {
    try {
        const [propStats] = await db.query(`
            SELECT
                COUNT(CASE WHEN activa = TRUE THEN 1 END) AS props_activas,
                COUNT(CASE WHEN destacada = 1 AND activa = TRUE THEN 1 END) AS props_destacadas,
                SUM(CASE WHEN activa = TRUE AND moneda = 'USD' THEN precio ELSE 0 END) AS total_usd,
                SUM(CASE WHEN activa = TRUE AND moneda = 'CRC' THEN precio ELSE 0 END) AS total_crc
            FROM propiedades
        `);

        const [ownerStats] = await db.query('SELECT COUNT(*) AS total_propietarios FROM propietarios WHERE activo = TRUE');

        const [msgStats] = await db.query(`
            SELECT
                COUNT(CASE WHEN estado = 'nuevo' AND activo = TRUE THEN 1 END) AS msgs_nuevos,
                COUNT(CASE WHEN prioridad = 'alta' AND activo = TRUE THEN 1 END) AS msgs_alta
            FROM mensajes_contacto
        `);

        res.json({
            props_activas: Number(propStats[0]?.props_activas || 0),
            props_destacadas: Number(propStats[0]?.props_destacadas || 0),
            total_usd: Number(propStats[0]?.total_usd || 0),
            total_crc: Number(propStats[0]?.total_crc || 0),
            total_propietarios: Number(ownerStats[0]?.total_propietarios || 0),
            msgs_nuevos: Number(msgStats[0]?.msgs_nuevos || 0),
            msgs_alta: Number(msgStats[0]?.msgs_alta || 0)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = getSessionUser(req);

        let query = `
            SELECT p.*,
                   ti.nombre AS tipo_inmueble_texto
            FROM propiedades p
            LEFT JOIN tipos_inmueble ti ON p.tipo_inmueble_id = ti.id
            WHERE p.id = ?
        `;

        if (user) {
            query = `
                SELECT p.*,
                       ti.nombre AS tipo_inmueble_texto,
                       prop.id AS propietario_ref_id,
                       per.nombre AS propietario_nombre,
                       per.apellidos AS propietario_apellidos,
                       per.razon_social AS propietario_razon_social,
                       per.documento_identidad AS propietario_documento
                FROM propiedades p
                LEFT JOIN tipos_inmueble ti ON p.tipo_inmueble_id = ti.id
                LEFT JOIN propietarios prop ON p.propietario_id = prop.id
                LEFT JOIN personas per ON prop.persona_id = per.id
                WHERE p.id = ?
            `;
        }

        const [rows] = await db.query(query, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }

        const propiedad = rows[0];

        if (!propiedad.activa && !user) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }

        const [imagenes] = await db.query('SELECT url_imagen FROM imagenes_propiedad WHERE propiedad_id = ? ORDER BY orden ASC', [req.params.id]);

        res.json({
            ...propiedad,
            imagenes_secundarias: imagenes.map(img => img.url_imagen)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', verifyToken, uploadLimiter, (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    const rawData = { ...req.body };
    const parseResult = PropertySchema.safeParse(rawData);

    if (!parseResult.success) {
        const issues = parseResult.error?.issues || parseResult.error?.errors || [];
        return res.status(400).json({
            error: issues[0]?.message || 'Datos de propiedad inválidos.',
            details: issues
        });
    }

    const data = parseResult.data;
    let imagen_principal = null;

    if (req.files && req.files['imagen_principal']) {
        imagen_principal = await procesarYGuardarImagen(req.files['imagen_principal'][0].buffer, 'imagen_principal');
    }

    if (!imagen_principal) {
        return res.status(400).json({ error: 'La imagen principal es requerida' });
    }

    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        const ubicacionCompleta = [data.distrito, data.canton, data.provincia].filter(Boolean).join(', ') || rawData.ubicacion || '';

        const [result] = await conexion.query(
            `INSERT INTO propiedades
             (titulo, descripcion_corta, descripcion_larga, ubicacion, direccion_exacta, latitud, longitud,
              tipo_inmueble_id, tipo_operacion, precio, moneda, tipo_precio, habitaciones, banos,
              estacionamientos, area_construida, area_terreno, imagen_principal, url_video,
              destacada, activa, estado_comercial, creado_por, propietario_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'disponible', ?, ?)`,
            [
                data.titulo, data.descripcion_corta || null, data.descripcion_larga, ubicacionCompleta, data.direccion_exacta,
                data.latitud ?? null, data.longitud ?? null, data.tipo_inmueble_id, data.tipo_operacion,
                data.precio, data.moneda, data.tipo_precio, data.habitaciones ?? null, data.banos ?? null,
                data.estacionamientos ?? 0, data.area_construida ?? null, data.area_terreno ?? null, imagen_principal,
                data.url_video || null, data.destacada ? 1 : 0,
                data.activa ? 1 : 0,
                req.user.id || null,
                data.propietario_id || null
            ]
        );

        const propiedadId = result.insertId;

        if (rawData.orden_galeria) {
            let ordenGaleria = [];
            try {
                ordenGaleria = JSON.parse(rawData.orden_galeria);
            } catch {
                ordenGaleria = [];
            }
            let newFileIndex = 0;

            for (let i = 0; i < ordenGaleria.length; i++) {
                const item = ordenGaleria[i];

                if (item.type === 'nueva' && req.files && req.files['imagenes_secundarias']) {
                    const file = req.files['imagenes_secundarias'][newFileIndex++];

                    if (file) {
                        const urlImagen = await procesarYGuardarImagen(file.buffer, 'imagenes_secundarias');
                        await conexion.query(
                            `INSERT INTO imagenes_propiedad (propiedad_id, url_imagen, orden) VALUES (?, ?, ?)`,
                            [propiedadId, urlImagen, i]
                        );
                    }
                }
            }
        } else if (req.files && req.files['imagenes_secundarias']) {
            for (let i = 0; i < req.files['imagenes_secundarias'].length; i++) {
                const file = req.files['imagenes_secundarias'][i];
                const urlImagen = await procesarYGuardarImagen(file.buffer, 'imagenes_secundarias');
                await conexion.query(
                    `INSERT INTO imagenes_propiedad (propiedad_id, url_imagen, orden) VALUES (?, ?, ?)`,
                    [propiedadId, urlImagen, i]
                );
            }
        }

        await conexion.commit();
        const propiedadCompleta = await getPropiedadCompleta(propiedadId);
        if (propiedadCompleta) {
            broadcast('propiedad:creada', propiedadCompleta);
        }
        res.status(201).json({ id: propiedadId, success: true });

    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.put('/:id', verifyToken, uploadLimiter, (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    const rawData = { ...req.body };
    const parseResult = PropertySchema.safeParse(rawData);

    if (!parseResult.success) {
        const issues = parseResult.error?.issues || parseResult.error?.errors || [];
        return res.status(400).json({
            error: issues[0]?.message || 'Datos de propiedad inválidos.',
            details: issues
        });
    }

    const data = parseResult.data;
    const { id } = req.params;
    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        const [propiedadActual] = await conexion.query('SELECT imagen_principal FROM propiedades WHERE id = ?', [id]);

        if (propiedadActual.length === 0) {
            await conexion.rollback();
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }

        let imagen_principal = propiedadActual[0].imagen_principal;

        if (req.files && req.files['imagen_principal']) {
            imagen_principal = await procesarYGuardarImagen(req.files['imagen_principal'][0].buffer, 'imagen_principal');
        }

        const ubicacionCompleta = [data.distrito, data.canton, data.provincia].filter(Boolean).join(', ') || rawData.ubicacion || '';

        await conexion.query(
            `UPDATE propiedades
             SET titulo=?, descripcion_corta=?, descripcion_larga=?, ubicacion=?, direccion_exacta=?,
                 latitud=?, longitud=?, tipo_inmueble_id=?, tipo_operacion=?, precio=?, moneda=?,
                 tipo_precio=?, habitaciones=?, banos=?, estacionamientos=?, area_construida=?,
                 area_terreno=?, imagen_principal=?, url_video=?, destacada=?, activa=?, propietario_id=?
             WHERE id=?`,
            [
                data.titulo, data.descripcion_corta || null, data.descripcion_larga, ubicacionCompleta, data.direccion_exacta,
                data.latitud ?? null, data.longitud ?? null, data.tipo_inmueble_id, data.tipo_operacion,
                data.precio, data.moneda, data.tipo_precio, data.habitaciones ?? null, data.banos ?? null,
                data.estacionamientos ?? 0, data.area_construida ?? null, data.area_terreno ?? null, imagen_principal,
                data.url_video || null, data.destacada ? 1 : 0,
                data.activa ? 1 : 0,
                data.propietario_id || null,
                id
            ]
        );

        if (rawData.orden_galeria) {
            await conexion.query('DELETE FROM imagenes_propiedad WHERE propiedad_id = ?', [id]);
            let ordenGaleria = [];
            try {
                ordenGaleria = JSON.parse(rawData.orden_galeria);
            } catch {
                ordenGaleria = [];
            }
            let newFileIndex = 0;

            for (let i = 0; i < ordenGaleria.length; i++) {
                const item = ordenGaleria[i];
                let urlImagen = null;

                if (item.type === 'existente') {
                    urlImagen = item.url;
                } else if (item.type === 'nueva' && req.files && req.files['imagenes_secundarias']) {
                    const file = req.files['imagenes_secundarias'][newFileIndex++];
                    if (file) {
                        urlImagen = await procesarYGuardarImagen(file.buffer, 'imagenes_secundarias');
                    }
                }

                if (urlImagen) {
                    await conexion.query(
                        `INSERT INTO imagenes_propiedad (propiedad_id, url_imagen, orden) VALUES (?, ?, ?)`,
                        [id, urlImagen, i]
                    );
                }
            }
        } else if (req.files && req.files['imagenes_secundarias']) {
            await conexion.query('DELETE FROM imagenes_propiedad WHERE propiedad_id = ?', [id]);
            for (let i = 0; i < req.files['imagenes_secundarias'].length; i++) {
                const file = req.files['imagenes_secundarias'][i];
                const urlImagen = await procesarYGuardarImagen(file.buffer, 'imagenes_secundarias');
                await conexion.query(
                    `INSERT INTO imagenes_propiedad (propiedad_id, url_imagen, orden) VALUES (?, ?, ?)`,
                    [id, urlImagen, i]
                );
            }
        }

        await conexion.commit();
        const propiedadCompleta = await getPropiedadCompleta(id);
        if (propiedadCompleta) {
            broadcast('propiedad:actualizada', propiedadCompleta);
        }
        res.json({ success: true, id: parseInt(id) });

    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await db.query('UPDATE propiedades SET activa = false WHERE id = ?', [req.params.id]);
        broadcast('propiedad:desactivada', { id: req.params.id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/estado', verifyToken, async (req, res) => {
    const { activa } = req.body;
    if (typeof activa !== 'boolean') {
        return res.status(400).json({ error: 'El campo activa debe ser un booleano.' });
    }
    try {
        const [result] = await db.query('UPDATE propiedades SET activa = ? WHERE id = ?', [activa, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Propiedad no encontrada' });
        if (activa) {
            const propiedadCompleta = await getPropiedadCompleta(req.params.id);
            broadcast('propiedad:estado', propiedadCompleta ?? { id: req.params.id, activa });
        } else {
            broadcast('propiedad:estado', { id: req.params.id, activa });
        }
        res.json({ success: true, activa });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;