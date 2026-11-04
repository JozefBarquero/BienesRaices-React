import express from 'express';
import { addClient, removeClient } from '../sse/catalogoBus.js';

const router = express.Router();

router.get('/catalogo', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    res.write(': connected\n\n');

    addClient(res);

    const heartbeat = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 20000);

    req.on('close', () => {
        clearInterval(heartbeat);
        removeClient(res);
    });
});

export default router;