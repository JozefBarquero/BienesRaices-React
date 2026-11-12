import { useEffect, useRef, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const MAX_BACKOFF_MS = 10000;
const HEARTBEAT_TIMEOUT_MS = 45000;
const STUCK_CONNECTING_MS = 5000;
const WATCHDOG_INTERVAL_MS = 5000;

export default function useCatalogoSSE(callbacks, onReconnect, isFetchingRef) {
    const callbacksRef = useRef(callbacks);
    callbacksRef.current = callbacks;

    const onReconnectRef = useRef(onReconnect);
    onReconnectRef.current = onReconnect;

    const isFetchingRefProp = useRef(isFetchingRef);
    isFetchingRefProp.current = isFetchingRef;

    const eventSourceRef = useRef(null);
    const isPausedRef = useRef(false);
    const eventBufferRef = useRef([]);

    const flushBuffer = useCallback(() => {
        const buffered = eventBufferRef.current.splice(0);
        for (const { type, data } of buffered) {
            try {
                const cbs = callbacksRef.current;
                if (type === 'propiedad:creada') cbs.onPropiedadCreada?.(data);
                else if (type === 'propiedad:actualizada') cbs.onPropiedadActualizada?.(data);
                else if (type === 'propiedad:desactivada') cbs.onPropiedadDesactivada?.(data);
                else if (type === 'propiedad:estado') cbs.onPropiedadEstado?.(data);
            } catch (err) {
                console.error('[SSE] Error al hacer flush de buffer', type, err);
            }
        }
    }, []);

    useEffect(() => {
        let isCleanedUp = false;
        let es = null;
        let reconnectTimer = null;
        let retryCount = 0;
        let lastActivity = Date.now();
        let hasConnectedOnce = false;

        const dispatchOrBuffer = (type, data) => {
            const fetchingRef = isFetchingRefProp.current;
            const isFetching = fetchingRef?.current === true;

            if (isFetching) {
                eventBufferRef.current.push({ type, data });
                return;
            }

            try {
                const cbs = callbacksRef.current;
                if (type === 'propiedad:creada') cbs.onPropiedadCreada?.(data);
                else if (type === 'propiedad:actualizada') cbs.onPropiedadActualizada?.(data);
                else if (type === 'propiedad:desactivada') cbs.onPropiedadDesactivada?.(data);
                else if (type === 'propiedad:estado') cbs.onPropiedadEstado?.(data);
            } catch (err) {
                console.error('[SSE] Error al procesar evento', type, err);
            }
        };

        const teardown = () => {
            if (es) {
                try {
                    es.close();
                } catch {}
                es = null;
                eventSourceRef.current = null;
            }
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
        };

        const scheduleReconnect = (reason) => {
            if (isPausedRef.current || isCleanedUp) return;
            const delay = Math.min(1000 * 2 ** retryCount, MAX_BACKOFF_MS);
            retryCount += 1;
            console.warn(`[SSE] ${reason}. Reintentando en ${delay}ms (intento ${retryCount}).`);
            if (reconnectTimer) clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(connect, delay);
        };

        const connect = () => {
            if (isCleanedUp) return;

            teardown();

            const url = `${API_URL}/sse/catalogo?t=${Date.now()}`;
            const newEs = new EventSource(url);
            es = newEs;
            eventSourceRef.current = newEs;
            lastActivity = Date.now();

            newEs.onopen = () => {
                retryCount = 0;
                lastActivity = Date.now();
                if (hasConnectedOnce) {
                    onReconnectRef.current?.();
                }
                hasConnectedOnce = true;
            };

            newEs.addEventListener('heartbeat', () => {
                lastActivity = Date.now();
            });

            newEs.addEventListener('propiedad:creada', (e) => {
                lastActivity = Date.now();
                try {
                    dispatchOrBuffer('propiedad:creada', JSON.parse(e.data));
                } catch (err) {
                    console.error('[SSE] propiedad:creada payload inválido', err);
                }
            });

            newEs.addEventListener('propiedad:actualizada', (e) => {
                lastActivity = Date.now();
                try {
                    dispatchOrBuffer('propiedad:actualizada', JSON.parse(e.data));
                } catch (err) {
                    console.error('[SSE] propiedad:actualizada payload inválido', err);
                }
            });

            newEs.addEventListener('propiedad:desactivada', (e) => {
                lastActivity = Date.now();
                try {
                    dispatchOrBuffer('propiedad:desactivada', JSON.parse(e.data));
                } catch (err) {
                    console.error('[SSE] propiedad:desactivada payload inválido', err);
                }
            });

            newEs.addEventListener('propiedad:estado', (e) => {
                lastActivity = Date.now();
                try {
                    dispatchOrBuffer('propiedad:estado', JSON.parse(e.data));
                } catch (err) {
                    console.error('[SSE] propiedad:estado payload inválido', err);
                }
            });

            newEs.onerror = () => {
                if (newEs !== es) return;
                try {
                    newEs.close();
                } catch {}
                es = null;
                if (eventSourceRef.current === newEs) eventSourceRef.current = null;
                scheduleReconnect('Error de conexión');
            };
        };

        connect();

        const watchdog = setInterval(() => {
            if (isCleanedUp || isPausedRef.current) return;
            if (!es) {
                scheduleReconnect('Sin instancia activa');
                return;
            }

            const state = es.readyState;
            const elapsed = Date.now() - lastActivity;

            if (state === EventSource.CLOSED) {
                try {
                    es.close();
                } catch {}
                es = null;
                eventSourceRef.current = null;
                scheduleReconnect('Conexión cerrada');
                return;
            }

            if (state === EventSource.CONNECTING && elapsed > STUCK_CONNECTING_MS) {
                try {
                    es.close();
                } catch {}
                es = null;
                eventSourceRef.current = null;
                scheduleReconnect('Conexión atascada en CONNECTING');
                return;
            }

            if (state === EventSource.OPEN && elapsed > HEARTBEAT_TIMEOUT_MS) {
                try {
                    es.close();
                } catch {}
                es = null;
                eventSourceRef.current = null;
                scheduleReconnect('Sin actividad en conexión abierta');
            }
        }, WATCHDOG_INTERVAL_MS);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isPausedRef.current = true;
                teardown();
            } else {
                isPausedRef.current = false;
                retryCount = 0;
                lastActivity = Date.now();
                if (!es && !isCleanedUp) {
                    connect();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isCleanedUp = true;
            clearInterval(watchdog);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            teardown();
            eventBufferRef.current = [];
        };
    }, []);

    return { flushBuffer };
}
