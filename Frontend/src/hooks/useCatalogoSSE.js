import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function useCatalogoSSE(callbacks) {
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const isPausedRef = useRef(false);
    const callbacksRef = useRef(callbacks);

    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    useEffect(() => {
        const connect = () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            const es = new EventSource(`${API_URL}/sse/catalogo`);
            eventSourceRef.current = es;

            es.onopen = () => {
                retryCountRef.current = 0;
            };

            es.addEventListener('propiedad:creada', (e) => {
                const data = JSON.parse(e.data);
                callbacksRef.current.onPropiedadCreada?.(data);
            });

            es.addEventListener('propiedad:actualizada', (e) => {
                const data = JSON.parse(e.data);
                callbacksRef.current.onPropiedadActualizada?.(data);
            });

            es.addEventListener('propiedad:desactivada', (e) => {
                const data = JSON.parse(e.data);
                callbacksRef.current.onPropiedadDesactivada?.(data);
            });

            es.addEventListener('propiedad:estado', (e) => {
                const data = JSON.parse(e.data);
                callbacksRef.current.onPropiedadEstado?.(data);
            });

            es.onerror = () => {
                es.close();
                eventSourceRef.current = null;
                if (!isPausedRef.current) {
                    const delay = Math.min(1000 * 2 ** retryCountRef.current, 30000);
                    retryCountRef.current += 1;
                    reconnectTimeoutRef.current = setTimeout(connect, delay);
                }
            };
        };

        connect();

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isPausedRef.current = true;
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                }
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            } else {
                isPausedRef.current = false;
                retryCountRef.current = 0;
                connect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, []);
}