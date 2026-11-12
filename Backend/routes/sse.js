import express from 'express';
import { addClient, removeClient } from '../sse/catalogoBus.js';

const router = express.Router();

router.get('/catalogo', (req, res) => {
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    res.write('retry: 3000\n\n');
    res.write(': ' + ' '.repeat(2048) + '\n\n');
    res.write('event: heartbeat\ndata: {}\n\n');

    addClient(res);

    const heartbeat = setInterval(() => {
        try {
            res.write('event: heartbeat\ndata: {}\n\n');
        } catch {
            clearInterval(heartbeat);
            removeClient(res);
        }
    }, 20000);

    const cleanup = () => {
        clearInterval(heartbeat);
        removeClient(res);
    };

    req.on('close', cleanup);
    req.on('aborted', cleanup);
    res.on('error', cleanup);
});

export default router;