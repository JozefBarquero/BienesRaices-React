import express from 'express';
import db from '../config/db.js';




const router = express.Router();




router.get('/', async (req, res) => {


    try {


        const [rows] = await db.query('SELECT * FROM tipos_inmueble ORDER BY nombre ASC');
        res.json(rows);


    } catch (error) { 


        res.status(500).json({ error: error.message }); 

    }
});





export default router;