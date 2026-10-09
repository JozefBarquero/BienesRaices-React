import { toast } from '@/components/ui/Toast';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_URL = import.meta.env.VITE_API_URL;

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

const fetchOptions = (options = {}) => ({
    ...options,
    credentials: 'include'
});

const handleResponse = async (res, defaultMessage = 'Error en la solicitud') => {
    if (res.status === 401) {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/admin';
        toast.error('Sesión expirada');
        const err = new Error('Sesión expirada');
        err.toastShown = true;
        throw err;
    }

    if (!res.ok) {
        let msg = defaultMessage;
        try {
            const data = await res.clone().json();
            if (data?.error) {
                msg = data.error;
            } else if (data?.message) {
                msg = data.message;
            }
        } catch {
        }
        toast.error(msg);
        const err = new Error(msg);
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
    const res = await fetch(url, options);
    return await handleResponse(res, defaultMessage);
};

export const api = {
    propiedades: {
        toggleActiva: async (id, activa) => {
            const res = await customFetch(
                `${API_URL}/propiedades/${id}/estado`,
                fetchOptions({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ activa })
                }),
                'Error al cambiar el estado de la propiedad'
            );
            return await res.json();
        },

        getAll: async () => {
            const res = await directFetch(`${API_URL}/propiedades`, fetchOptions(), 'Error al obtener propiedades');
            return await res.json();
        },
        getById: async (id) => {
            const res = await directFetch(`${API_URL}/propiedades/${id}`, fetchOptions(), 'Propiedad no encontrada');
            return await res.json();
        },
        create: async (data) => {
            const formData = toFormData(data);
            const res = await customFetch(
                `${API_URL}/propiedades`,
                fetchOptions({
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
                fetchOptions({
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
                fetchOptions({
                    method: 'DELETE'
                }),
                'Error al eliminar la propiedad'
            );
            return true;
        }
    },
    propietarios: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/propietarios`, fetchOptions(), 'Error al obtener propietarios');
            return await res.json();
        },
        getActivos: async () => {
            const res = await customFetch(`${API_URL}/propietarios/activos`, fetchOptions(), 'Error al obtener propietarios activos');
            return await res.json();
        },
        getById: async (id) => {
            const res = await customFetch(`${API_URL}/propietarios/${id}`, fetchOptions(), 'Propietario no encontrado');
            return await res.json();
        },
        create: async (data) => {
            const res = await customFetch(
                `${API_URL}/propietarios`,
                fetchOptions({
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
                fetchOptions({
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
                fetchOptions({
                    method: 'DELETE'
                }),
                'Error al desactivar propietario'
            );
            return await res.json();
        }
    },
    usuarios: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/usuarios`, fetchOptions(), 'Error al obtener usuarios');
            return await res.json();
        },
        create: async (data) => {
            const res = await customFetch(
                `${API_URL}/usuarios`,
                fetchOptions({
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
                fetchOptions({
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
                fetchOptions({
                    method: 'DELETE'
                }),
                'Error al desactivar usuario'
            );
            return await res.json();
        }
    },
    mensajes: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/contacto`, fetchOptions(), 'Error al obtener mensajes');
            return await res.json();
        },
        update: async (id, data) => {
            const res = await customFetch(
                `${API_URL}/contacto/${id}`,
                fetchOptions({
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
                fetchOptions({
                    method: 'POST'
                }),
                'Error al registrar contacto'
            );
            return await res.json();
        },
        delete: async (id) => {
            const res = await customFetch(
                `${API_URL}/contacto/${id}`,
                fetchOptions({
                    method: 'DELETE'
                }),
                'Error al desactivar mensaje'
            );
            return await res.json();
        }
    },
    diccionarios: {
        getTiposInmueble: async () => {
            const res = await directFetch(`${API_URL}/tipos-inmueble`, fetchOptions(), 'Error al obtener tipos de inmueble');
            return await res.json();
        }
    },
    contacto: {
        enviar: async (data) => {
            const res = await directFetch(
                `${API_URL}/contacto`,
                fetchOptions({
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
                fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }),
                'Error al generar resumen IA'
            );
            return await res.json();
        }
    },
    auth: {
        needsBootstrap: async () => {
            const res = await fetch(`${API_URL}/auth/needs-bootstrap`, fetchOptions());
            if (!res.ok) throw new Error('Error verificando estado del sistema');
            return await res.json();
        },
        bootstrap: async (data) => {
            const res = await directFetch(
                `${API_URL}/auth/bootstrap`,
                fetchOptions({
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
                fetchOptions({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                }),
                'Credenciales inválidas'
            );
            const data = await res.json();
            localStorage.setItem('isAuthenticated', 'true');
            return data;
        },
        logout: async () => {
            await fetch(`${API_URL}/auth/logout`, fetchOptions({ method: 'POST' }));
            localStorage.removeItem('isAuthenticated');
        },
        isAuthenticated: () => {
            return localStorage.getItem('isAuthenticated') === 'true';
        },
        verify: async () => {
            const res = await customFetch(`${API_URL}/auth/verify`, fetchOptions(), 'Error al verificar sesión');
            return await res.json();
        },
        forgotPassword: async (email) => {
            const res = await directFetch(
                `${API_URL}/auth/forgot-password`,
                fetchOptions({
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
                fetchOptions({
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