import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const handler = (req, res) => {
    res.status(429).json({
        error: 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.'
    });
};

const base = {
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler
};

export const globalLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 300
});

export const loginLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 10,
    keyGenerator: (req) => {
        const email = String(req.body?.email || '').toLowerCase().trim();
        // Normaliza la IP (maneja IPv6 correctamente)
        const ip = ipKeyGenerator(req);
        return email ? `${ip}|${email}` : ip;
    }
});

export const forgotPasswordLimiter = rateLimit({
    ...base,
    windowMs: 60 * 60 * 1000,
    limit: 3,
    keyGenerator: (req) => {
        const email = String(req.body?.email || '').toLowerCase().trim();
        const ip = ipKeyGenerator(req);
        return email ? `${ip}|${email}` : ip;
    }
});

export const resetPasswordLimiter = rateLimit({
    ...base,
    windowMs: 60 * 60 * 1000,
    limit: 10
});

export const bootstrapLimiter = rateLimit({
    ...base,
    windowMs: 60 * 60 * 1000,
    limit: 5
});

export const contactLimiter = rateLimit({
    ...base,
    windowMs: 60 * 60 * 1000,
    limit: 5
});

export const uploadLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 30
});