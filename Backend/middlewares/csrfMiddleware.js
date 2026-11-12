import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET || 'bienes_raices_csrf_default_secret_key_32';

export const generateCsrfToken = () => {
    const nonce = crypto.randomBytes(16).toString('hex');
    const signature = crypto.createHmac('sha256', CSRF_SECRET).update(nonce).digest('hex');
    return `${nonce}.${signature}`;
};

export const verifyCsrfToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [nonce, signature] = parts;
    const expected = crypto.createHmac('sha256', CSRF_SECRET).update(nonce).digest('hex');
    if (signature.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

export const csrfProtection = (allowedOrigins) => (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const origin = req.headers.origin || req.headers.referer;
    if (origin) {
        const isOriginAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));
        if (!isOriginAllowed) {
            return res.status(403).json({ error: 'Acceso denegado por política de origen.' });
        }
    }

    const headerToken = req.headers?.['x-xsrf-token'];

    if (!headerToken) {
        return res.status(403).json({ error: 'Token CSRF ausente.' });
    }

    if (!verifyCsrfToken(headerToken)) {
        return res.status(403).json({ error: 'Firma de token CSRF inválida.' });
    }

    next();
};