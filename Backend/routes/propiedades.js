import express from 'express';
import db from '../config/db.js';
import { uploadMiddleware, procesarYGuardarImagen } from '../utils/imageProcessor.js';
import { verifyToken } from './auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*,
                   ti.nombre AS tipo_inmueble_texto,
                   JSON_ARRAYAGG(i.url_imagen) AS imagenes_secundarias
            FROM propiedades p
            LEFT JOIN tipos_inmueble ti ON p.tipo_inmueble_id = ti.id
            LEFT JOIN imagenes_propiedad i ON p.id = i.propiedad_id
            GROUP BY p.id
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

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*,
                   ti.nombre AS tipo_inmueble_texto
            FROM propiedades p
            LEFT JOIN tipos_inmueble ti ON p.tipo_inmueble_id = ti.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }

        const [imagenes] = await db.query('SELECT url_imagen FROM imagenes_propiedad WHERE propiedad_id = ? ORDER BY orden ASC', [req.params.id]);

        res.json({
            ...rows[0],
            imagenes_secundarias: imagenes.map(img => img.url_imagen)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', verifyToken, (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    const data = req.body;
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

        const [result] = await conexion.query(
            `INSERT INTO propiedades 
             (titulo, descripcion_corta, descripcion_larga, ubicacion, direccion_exacta, latitud, longitud, 
              tipo_inmueble_id, tipo_operacion, precio, moneda, tipo_precio, habitaciones, banos, 
              estacionamientos, area_construida, area_terreno, imagen_principal, url_video, 
              destacada, activa, creado_por)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.titulo, data.descripcion_corta, data.descripcion_larga, data.ubicacion, data.direccion_exacta,
                data.latitud || null, data.longitud || null, data.tipo_inmueble_id || null, data.tipo_operacion || 'venta',
                data.precio, data.moneda || 'USD', data.tipo_precio || 'fijo', data.habitaciones || null, data.banos || null,
                data.estacionamientos || 0, data.area_construida || null, data.area_terreno || null, imagen_principal,
                data.url_video || null, data.destacada === 'true' ? 1 : 0,
                data.activa === 'true' || data.activa === true ? 1 : 0, data.creado_por || null
            ]
        );

        const propiedadId = result.insertId;

        if (data.orden_galeria) {
            const ordenGaleria = JSON.parse(data.orden_galeria);
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
        res.status(201).json({ id: propiedadId, success: true });

    } catch (error) {
        await conexion.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
});

router.put('/:id', verifyToken, (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    const data = req.body;
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

        await conexion.query(
            `UPDATE propiedades 
             SET titulo=?, descripcion_corta=?, descripcion_larga=?, ubicacion=?, direccion_exacta=?, 
                 latitud=?, longitud=?, tipo_inmueble_id=?, tipo_operacion=?, precio=?, moneda=?, 
                 tipo_precio=?, habitaciones=?, banos=?, estacionamientos=?, area_construida=?, 
                 area_terreno=?, imagen_principal=?, url_video=?, destacada=?, activa=?
             WHERE id=?`,
            [
                data.titulo, data.descripcion_corta, data.descripcion_larga, data.ubicacion, data.direccion_exacta,
                data.latitud || null, data.longitud || null, data.tipo_inmueble_id || null, data.tipo_operacion,
                data.precio, data.moneda, data.tipo_precio, data.habitaciones || null, data.banos || null,
                data.estacionamientos || 0, data.area_construida || null, data.area_terreno || null, imagen_principal,
                data.url_video || null, data.destacada === 'true' ? 1 : 0,
                data.activa === 'true' || data.activa === true ? 1 : 0, id
            ]
        );

        if (data.orden_galeria) {
            await conexion.query('DELETE FROM imagenes_propiedad WHERE propiedad_id = ?', [id]);
            const ordenGaleria = JSON.parse(data.orden_galeria);
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
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;