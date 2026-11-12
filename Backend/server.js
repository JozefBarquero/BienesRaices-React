import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cron from 'node-cron';

import tiposInmuebleRoutes from './routes/tipos-inmueble.js';
import propiedadesRoutes from './routes/propiedades.js';
import contactoRoutes from './routes/contacto.js';
import authRoutes from './routes/auth.js';
import iaRoutes from './routes/ia.js';
import usuariosRoutes from './routes/usuarios.js';
import propietariosRoutes from './routes/propietarios.js';
import clientesRoutes from './routes/clientes.js';
import transaccionesRoutes from './routes/transacciones.js';
import sseRoutes from './routes/sse.js';
import { globalLimiter } from './middlewares/rateLimiters.js';
import { generateCsrfToken, csrfProtection } from './middlewares/csrfMiddleware.js';
import { broadcast } from './sse/catalogoBus.js';
import db from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

const allowedOrigins = (process.env.FRONTEND_URL || process.env.SITE_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  ['http://localhost:5173', 'http://127.0.0.1:5173'].forEach((origin) => {
    if (!allowedOrigins.includes(origin)) allowedOrigins.push(origin);
  });
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));

app.use(compression({
  filter: (req, res) => {
    const type = res.getHeader('Content-Type');
    if (type && String(type).includes('text/event-stream')) return false;
    return true;
  }
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/uploads', express.static('uploads', {
  maxAge: '30d',
  immutable: true,
  etag: true
}));

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({
      status: 'pass',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status: 'fail',
      message: 'Base de datos no disponible.'
    });
  }
});

app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !req.cookies?.['XSRF-TOKEN']) {
    const xsrfToken = generateCsrfToken();
    res.cookie('XSRF-TOKEN', xsrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 8 * 60 * 60 * 1000
    });
  }
  next();
});

const PUBLIC_CSRF_EXEMPT = new Set([
  '/auth/login',
  '/auth/bootstrap',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/logout',
  '/auth/csrf-token',
  '/auth/needs-bootstrap',
  '/contacto',
  '/ia/resumen'
]);

const csrfMiddleware = csrfProtection(allowedOrigins);

app.use('/api/sse', sseRoutes);
app.use('/api', globalLimiter);
app.use('/api', (req, res, next) => {
  if (PUBLIC_CSRF_EXEMPT.has(req.path)) return next();
  return csrfMiddleware(req, res, next);
});

app.use('/api/tipos-inmueble', tiposInmuebleRoutes);
app.use('/api/propiedades', propiedadesRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/propietarios', propietariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/transacciones', transaccionesRoutes);

cron.schedule('0 2 * * *', async () => {
  try {
    const [antes] = await db.query(
      `SELECT id FROM propiedades
       WHERE fecha_desactivacion_programada IS NOT NULL
         AND fecha_desactivacion_programada <= NOW()
         AND activa = TRUE`
    );
    if (antes.length === 0) return;

    const [result] = await db.query(
      `UPDATE propiedades
       SET activa = FALSE
       WHERE fecha_desactivacion_programada IS NOT NULL
         AND fecha_desactivacion_programada <= NOW()
         AND activa = TRUE`
    );

    if (result.affectedRows > 0) {
      for (const fila of antes) {
        broadcast('propiedad:estado', { id: fila.id, activa: false });
      }
      console.log(`[CRON] Propiedades desactivadas automáticamente: ${result.affectedRows}`);
    }
  } catch (error) {
    console.error('[CRON] Error al desactivar propiedades:', error.message);
  }
});

process.on('uncaughtException', (err) => { console.error('Error crítico:', err); });
process.on('unhandledRejection', (reason) => { console.error('Promesa rechazada:', reason); });

app.listen(PORT, () => {});