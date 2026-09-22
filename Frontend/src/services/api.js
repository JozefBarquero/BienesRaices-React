export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

const customFetch = async (url, options) => {
    const res = await fetch(url, options);
    if (res.status === 401) {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/admin';
        throw new Error('Sesión expirada');
    }
    return res;
};

export const api = {
    propiedades: {
        getAll: async () => {
            const res = await fetch(`${API_URL}/propiedades`, fetchOptions());
            if (!res.ok) throw new Error('Error al obtener propiedades');
            return await res.json();
        },
        getById: async (id) => {
            const res = await fetch(`${API_URL}/propiedades/${id}`, fetchOptions());
            if (!res.ok) throw new Error('Propiedad no encontrada');
            return await res.json();
        },
        create: async (data) => {
            const formData = toFormData(data);
            const res = await customFetch(`${API_URL}/propiedades`, fetchOptions({
                method: 'POST',
                body: formData
            }));
            if (!res.ok) throw new Error('Error al crear la propiedad');
            return await res.json();
        },
        update: async (id, data) => {
            const formData = toFormData(data);
            const res = await customFetch(`${API_URL}/propiedades/${id}`, fetchOptions({
                method: 'PUT',
                body: formData
            }));
            if (!res.ok) throw new Error('Error al actualizar la propiedad');
            return await res.json();
        },
        delete: async (id) => {
            const res = await customFetch(`${API_URL}/propiedades/${id}`, fetchOptions({
                method: 'DELETE'
            }));
            if (!res.ok) throw new Error('Error al eliminar la propiedad');
            return true;
        }
    },
    usuarios: {
        getAll: async () => {
            const res = await customFetch(`${API_URL}/usuarios`, fetchOptions());
            if (!res.ok) throw new Error('Error al obtener usuarios');
            return await res.json();
        },
        create: async (data) => {
            const res = await customFetch(`${API_URL}/usuarios`, fetchOptions({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }));
            if (!res.ok) throw new Error('Error al crear usuario');
            return await res.json();
        },
        update: async (id, data) => {
            const res = await customFetch(`${API_URL}/usuarios/${id}`, fetchOptions({
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }));
            if (!res.ok) throw new Error('Error al actualizar usuario');
            return await res.json();
        },
        delete: async (id) => {
            const res = await customFetch(`${API_URL}/usuarios/${id}`, fetchOptions({
                method: 'DELETE'
            }));
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al desactivar usuario');
            }
            return await res.json();
        }
    },
    diccionarios: {
        getTiposInmueble: async () => {
            const res = await fetch(`${API_URL}/tipos-inmueble`, fetchOptions());
            return await res.json();
        }
    },
    contacto: {
        enviar: async (data) => {
            const res = await fetch(`${API_URL}/contacto`, fetchOptions({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }));
            if (!res.ok) throw new Error('Error al enviar mensaje');
            return await res.json();
        }
    },
    ia: {
        getResumen: async (data) => {
            const res = await customFetch(`${API_URL}/ia/resumen`, fetchOptions({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }));
            if (!res.ok) throw new Error('Error al generar resumen IA');
            return await res.json();
        }
    },
    auth: {
        login: async (email, password) => {
            const res = await fetch(`${API_URL}/auth/login`, fetchOptions({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            }));
            if (!res.ok) throw new Error('Credenciales inválidas');
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
            const res = await customFetch(`${API_URL}/auth/verify`, fetchOptions());
            return await res.json();
        },
        forgotPassword: async (email) => {
            const res = await fetch(`${API_URL}/auth/forgot-password`, fetchOptions({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            }));
            if (!res.ok) throw new Error('Error al solicitar cambio de contraseña');
            return await res.json();
        },
        resetPassword: async (token, password) => {
            const res = await fetch(`${API_URL}/auth/reset-password`, fetchOptions({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            }));
            if (!res.ok) throw new Error('Error al restablecer contraseña');
            return await res.json();
        }
    }
};