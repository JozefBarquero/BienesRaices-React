import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { iaLimiter } from '../middlewares/rateLimiters.js';
import 'dotenv/config';

const router = express.Router();

router.post('/resumen', iaLimiter, async (req, res) => {
    const { lat, lng, propertyType, operationType } = req.body;

    const numLat = Number(lat);
    const numLng = Number(lng);

    if (isNaN(numLat) || isNaN(numLng) || numLat < 8.0 || numLat > 11.3 || numLng < -86.0 || numLng > -82.5) {
        return res.status(400).json({ error: 'Coordenadas geográficas inválidas o fuera de Costa Rica.' });
    }

    const cleanPropType = String(propertyType || 'inmueble').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 50);
    const cleanOpType = String(operationType || 'venta').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 50);

    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Falta configurar la variable GEMINI_API_KEY en el servidor.' });
        }

        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const [weatherRes, geoRes] = await Promise.all([
            fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${numLat}&longitude=${numLng}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`),
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${numLat}&lon=${numLng}&format=json`, {
                headers: { 'User-Agent': 'BienesRaicesApp/1.0 (contact@bienesraices.com)' }
            })
        ]);

        const weatherData = await weatherRes.json();
        const geoData = await geoRes.json();

        let maxTempAvg = 'N/A';
        let minTempAvg = 'N/A';
        let totalRain = 'N/A';

        if (weatherData && weatherData.daily) {
            if (weatherData.daily.temperature_2m_max?.length) {
                maxTempAvg = (weatherData.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / weatherData.daily.temperature_2m_max.length).toFixed(1);
            }
            if (weatherData.daily.temperature_2m_min?.length) {
                minTempAvg = (weatherData.daily.temperature_2m_min.reduce((a, b) => a + b, 0) / weatherData.daily.temperature_2m_min.length).toFixed(1);
            }
            if (weatherData.daily.precipitation_sum?.length) {
                totalRain = weatherData.daily.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1);
            }
        }

        const address = geoData.address || {};
        const provincia = address.state || address.region || '';
        const canton = address.county || address.city || '';
        const distrito = address.suburb || address.neighbourhood || address.town || address.village || '';
        const areaName = [distrito, canton, provincia].filter(Boolean).join(', ') || 'la zona seleccionada';

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

        const prompt = `Eres un asesor inmobiliario profesional en Costa Rica. Describe en un párrafo persuasivo y profesional los beneficios de ubicación y clima de esta propiedad tipo "${cleanPropType}" disponible para "${cleanOpType}" en ${areaName}. Datos climáticos recientes: Temperatura máxima: ${maxTempAvg}°C, mínima: ${minTempAvg}°C, lluvia acumulada: ${totalRain} mm. Responde únicamente con el párrafo descriptivo.`;

        const result = await model.generateContent(prompt);
        const summaryText = result.response.text();

        res.json({
            text: summaryText,
            stats: { maxTempAvg, minTempAvg, totalRain, areaName }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
