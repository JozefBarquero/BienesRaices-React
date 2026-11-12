const clients = new Set();

export const addClient = (res) => {
    clients.add(res);
};

export const removeClient = (res) => {
    clients.delete(res);
};

export const broadcast = (event, data) => {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) {
        try {
            if (res.writableEnded || res.destroyed) {
                clients.delete(res);
                continue;
            }
            res.write(payload);
        } catch {
            clients.delete(res);
        }
    }
};