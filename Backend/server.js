import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import tiposInmuebleRoutes from './routes/tipos-inmueble.js';
import propiedadesRoutes from './routes/propiedades.js';
import contactoRoutes from './routes/contacto.js';
import authRoutes from './routes/auth.js';
import iaRoutes from './routes/ia.js';
import usuariosRoutes from './routes/usuarios.js';
import propietariosRoutes from './routes/propietarios.js';
import { globalLimiter } from './middlewares/rateLimiters.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/uploads', express.static('uploads'));

app.use('/api', globalLimiter);

app.use('/api/tipos-inmueble', tiposInmuebleRoutes);
app.use('/api/propiedades', propiedadesRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/propietarios', propietariosRoutes);

process.on('uncaughtException', (err) => { console.error('Error crítico:', err); });
process.on('unhandledRejection', (reason) => { console.error('Promesa rechazada:', reason); });

app.listen(PORT, () => {});