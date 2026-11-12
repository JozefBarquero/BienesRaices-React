import { toast } from '@/components/ui/Toast';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_URL = import.meta.env.VITE_API_URL;

let csrfTokenMemory = '';

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const toFormData = (data) => {
    if (data instanceof FormData) return data;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
            if (Array.isArray(data[key])) {
                data[key].forEach((item) => {
                    formData.append(key, item);
                });
            } else {
                formData.append(key, data[key]);
            }
        }
    });
    return formData;
};

const getCsrfToken = async () => {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
        if (match) return decodeURIComponent(match[1]);
    }
    
    if (csrfTokenMemory) return csrfTokenMemory;

    try {
        const res = await fetch(`${API_URL}/auth/csrf-token`, { credentials: 'include' });
        const data = await res.json();
        if (data.token) {
            csrfTokenMemory = data.token;
        }
    } catch (error) {
        console.error('Error al obtener CSRF token', error);
    }
    
    return csrfTokenMemory;
};

const fetchOptions = async (options = {}) => {
    const headers = { ...(options.headers || {}) };
    const method = (options.method || 'GET').toUpperCase();
    
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const token = await getCsrfToken();
        if (token) {
            headers['X-XSRF-TOKEN'] = token;
        }
    }
    
    return {
        ...options,
        headers,
        credentials: 'include',
        cache: 'no-store'
    };
};

const handleResponse = async (res, defaultMessage = 'Error en la solicitud') => {
    if (res.status === 401) {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/admin';
        toast.error('Sesión expirada');
        const err = new Error('Sesión expirada');
        err.status = 401;
        err.toastShown = true;
        throw err;
    }

    if (!res.ok) {
        let msg = defaultMessage;
        try {
            const data = await res.clone().json();
            if (data?.error) {
                msg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            } else if (data?.message) {
                msg = data.message;
            }
        } catch {
            msg = `Error del servidor (${res.status}): ${res.statusText}`;
        }
        toast.error(msg);
        console.error('Error detallado del servidor:', msg);
        const err = new Error(msg);
        err.status = res.status;
        err.toastShown = true;
        throw err;
    }

    return res;
};

const customFetch = async (url, options, defaultMessage) => {
    const res = await fetch(url, options);
    return await handleResponse(res, defaultMessage);
};

const directFetch = async (url, options, defaultMessage) => {
    try {
        const res = await fetch(url, options);
        return await handleResponse(res, defaultMessage);
    } catch (err) {
        if (err.name === 'AbortError') throw err;
        throw err;
    }
};

export const api = {
    propiedades: {
        toggleActiva: async (id, activa) => {
            const res = await customFetch(
                `${API_URL}/propiedades/${id}/estado`,
                await fetchOptions({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ activa })
                }),
                'Error al cambiar el estado de la propiedad'
            );
            return await res.json();
        },
        getAll: async (signal) => {
            const options = signal ? { ...(await fetchOptions()), signal } : await fetchOptions();
            const res = await directFetch(`${API_URL}/propiedades`, options, 'Error al obtener propiedades');
            return await res.json();
        },
        getAllAdmin: async () => {
            const res = await directFetch(`${API_URL}/propiedades/admin`, await fetchOptions(), 'Error al obtener propiedades');
            return await res.json();
        },
        getMetricas: async () => {
            const res = await directFetch(`${API_URL}/propiedades/admin/metricas`, await fetchOptions(), 'Error al obtener métricas');
            return await res.json();
        },
        getById: async (id) => {
            const res = await directFetch(`${API_URL}/propiedades/${id}`, await fetchOptions(), 'Propiedad no encontrada');
            return await res.json();
        },
        create: async (data) => {
            const formData = toFormData(data);
            const res = await customFetch(
                `${API_URL}/propiedades`,
                await fetchOptions({
                    method: 'POST',
                    body: formData
                }),
                'Error al crear la propiedad'
            );
            return await res.json();
        },
        update: async (id, data) => {
            const formData = toFormData(data);
            const res = await customFetch(
                `${API_URL}/propiedades/${id}`,
                await fetchOptions({
                    method: 'PUT',
                    body: formData
                }),
                'Error al actualizar la propiedad'
            );
            return await res.json();
        },
        delete: async (id) => {
            await customFetch(
                `${API_URL}/propiedades/${id}`,
                await fetchOptions({
                    method: 'DELETE'
                }),
                'Error al eliminar la propiedad'
            );
            return true;
        }
    },
    propietarios: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/propietarios`, await fetchOptions(), 'Error al obtener propietarios');
            return await res.json();
        },
        getActivos: async () => {
            const res = await customFetch(`${API_URL}/propietarios/activos`, await fetchOptions(), 'Error al obtener propietarios activos');
            return await res.json();
        },
        getById: async (id) => {
            const res = await customFetch(`${API_URL}/propietarios/${id}`, await fetchOptions(), 'Propietario no encontrado');
            return await res.json();
        },
        create: async (data) => {
            const res = await customFetch(
                `${API_URL}/propietarios`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al crear propietario'
            );
            return await res.json();
        },
        update: async (id, data) => {
            const res = await customFetch(
                `${API_URL}/propietarios/${id}`,
                await fetchOptions({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al actualizar propietario'
            );
            return await res.json();
        },
        delete: async (id) => {
            const res = await customFetch(
                `${API_URL}/propietarios/${id}`,
                await fetchOptions({
                    method: 'DELETE'
                }),
                'Error al desactivar propietario'
            );
            return await res.json();
        }
    },
    usuarios: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/usuarios`, await fetchOptions(), 'Error al obtener usuarios');
            return await res.json();
        },
        create: async (data) => {
            const res = await customFetch(
                `${API_URL}/usuarios`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al crear usuario'
            );
            return await res.json();
        },
        update: async (id, data) => {
            const res = await customFetch(
                `${API_URL}/usuarios/${id}`,
                await fetchOptions({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al actualizar usuario'
            );
            return await res.json();
        },
        delete: async (id) => {
            const res = await customFetch(
                `${API_URL}/usuarios/${id}`,
                await fetchOptions({
                    method: 'DELETE'
                }),
                'Error al desactivar usuario'
            );
            return await res.json();
        }
    },
    mensajes: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/contacto`, await fetchOptions(), 'Error al obtener mensajes');
            return await res.json();
        },
        update: async (id, data) => {
            const res = await customFetch(
                `${API_URL}/contacto/${id}`,
                await fetchOptions({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al actualizar mensaje'
            );
            return await res.json();
        },
        registrarContacto: async (id) => {
            const res = await customFetch(
                `${API_URL}/contacto/${id}/contacto`,
                await fetchOptions({
                    method: 'POST'
                }),
                'Error al registrar contacto'
            );
            return await res.json();
        },
        delete: async (id) => {
            const res = await customFetch(
                `${API_URL}/contacto/${id}`,
                await fetchOptions({
                    method: 'DELETE'
                }),
                'Error al desactivar mensaje'
            );
            return await res.json();
        }
    },
    diccionarios: {
        getTiposInmueble: async () => {
            const res = await directFetch(`${API_URL}/tipos-inmueble`, await fetchOptions(), 'Error al obtener tipos de inmueble');
            return await res.json();
        }
    },
    contacto: {
        enviar: async (data) => {
            const res = await directFetch(
                `${API_URL}/contacto`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al enviar mensaje'
            );
            return await res.json();
        }
    },
    ia: {
        getResumen: async (data) => {
            const res = await customFetch(
                `${API_URL}/ia/resumen`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al generar resumen IA'
            );
            return await res.json();
        }
    },
    clientes: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/clientes`, await fetchOptions(), 'Error al obtener clientes');
            return await res.json();
        },
        getById: async (id) => {
            const res = await customFetch(`${API_URL}/clientes/${id}`, await fetchOptions(), 'Cliente no encontrado');
            return await res.json();
        },
        create: async (data) => {
            const res = await customFetch(
                `${API_URL}/clientes`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al crear cliente'
            );
            return await res.json();
        },
        update: async (id, data) => {
            const res = await customFetch(
                `${API_URL}/clientes/${id}`,
                await fetchOptions({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al actualizar cliente'
            );
            return await res.json();
        },
        delete: async (id) => {
            const res = await customFetch(
                `${API_URL}/clientes/${id}`,
                await fetchOptions({
                    method: 'DELETE'
                }),
                'Error al desactivar cliente'
            );
            return await res.json();
        }
    },
    transacciones: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/transacciones`, await fetchOptions(), 'Error al obtener transacciones');
            return await res.json();
        },
        getById: async (id) => {
            const res = await customFetch(`${API_URL}/transacciones/${id}`, await fetchOptions(), 'Transacción no encontrada');
            return await res.json();
        },
        create: async (data) => {
            const res = await customFetch(
                `${API_URL}/transacciones`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al crear transacción'
            );
            return await res.json();
        },
        cerrar: async (id) => {
            const res = await customFetch(
                `${API_URL}/transacciones/${id}/cerrar`,
                await fetchOptions({
                    method: 'PATCH'
                }),
                'Error al cerrar transacción'
            );
            return await res.json();
        },
        cancelar: async (id) => {
            const res = await customFetch(
                `${API_URL}/transacciones/${id}/cancelar`,
                await fetchOptions({
                    method: 'PATCH'
                }),
                'Error al cancelar transacción'
            );
            return await res.json();
        }
    },
    auth: {
        needsBootstrap: async () => {
            const res = await fetch(`${API_URL}/auth/needs-bootstrap`, await fetchOptions());
            if (!res.ok) throw new Error('Error verificando estado del sistema');
            return await res.json();
        },
        bootstrap: async (data) => {
            const res = await directFetch(
                `${API_URL}/auth/bootstrap`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al crear administrador inicial'
            );
            return await res.json();
        },
        login: async (email, password) => {
            const res = await directFetch(
                `${API_URL}/auth/login`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                }),
                'Credenciales inválidas'
            );
            const data = await res.json();
            localStorage.setItem('isAuthenticated', 'true');
            csrfTokenMemory = '';
            return data;
        },
        logout: async () => {
            await fetch(`${API_URL}/auth/logout`, await fetchOptions({ method: 'POST' }));
            localStorage.removeItem('isAuthenticated');
            csrfTokenMemory = '';
        },
        isAuthenticated: () => {
            return localStorage.getItem('isAuthenticated') === 'true';
        },
        verify: async () => {
            const res = await customFetch(`${API_URL}/auth/verify`, await fetchOptions(), 'Error al verificar sesión');
            return await res.json();
        },
        forgotPassword: async (email) => {
            const res = await directFetch(
                `${API_URL}/auth/forgot-password`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                }),
                'Error al solicitar cambio de contraseña'
            );
            return await res.json();
        },
        resetPassword: async (token, password) => {
            const res = await directFetch(
                `${API_URL}/auth/reset-password`,
                await fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, password })
                }),
                'Error al restablecer contraseña'
            );
            return await res.json();
        }
    }
};