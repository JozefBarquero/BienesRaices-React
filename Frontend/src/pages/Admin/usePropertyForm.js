// @ts-check
import { useState, useEffect, useRef } from 'react';
import { api, BACKEND_URL } from '@/services/api';
import { DATOS_UBICACION } from '@/data/ubicaciones';
import { PropertySchema } from '@bienesraices/shared';
import { toast } from '@/components/ui/Toast';

/**
 * @typedef {import('react').ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} FormChangeEvent
 * @typedef {import('react').ChangeEvent<HTMLInputElement>} InputChangeEvent
 * @typedef {import('react').FormEvent<HTMLFormElement>} FormSubmitEvent
 * @typedef {import('zod').ZodIssue} ZodIssue
 */

/**
 * @typedef {Object} PropertyFormState
 * @property {string} titulo
 * @property {string} descripcion_corta
 * @property {string} descripcion_larga
 * @property {string} provincia
 * @property {string} canton
 * @property {string} distrito
 * @property {string} direccion_exacta
 * @property {string} latitud
 * @property {string} longitud
 * @property {string} tipo_inmueble_id
 * @property {string} tipo_operacion
 * @property {string} precio
 * @property {string} moneda
 * @property {string} tipo_precio
 * @property {string} habitaciones
 * @property {string} banos
 * @property {string} estacionamientos
 * @property {string} area_construida
 * @property {string} area_terreno
 * @property {string} url_video
 * @property {boolean} destacada
 * @property {boolean} activa
 * @property {string} propietario_id
 */

/**
 * @typedef {Object} InitialPropertyData
 * @property {number} [id]
 * @property {string} [titulo]
 * @property {string} [descripcion_corta]
 * @property {string} [descripcion_larga]
 * @property {string} [ubicacion]
 * @property {string} [direccion_exacta]
 * @property {string | number | null} [latitud]
 * @property {string | number | null} [longitud]
 * @property {string | number} [tipo_inmueble_id]
 * @property {string} [tipo_operacion]
 * @property {string | number} [precio]
 * @property {string} [moneda]
 * @property {string} [tipo_precio]
 * @property {string | number | null} [habitaciones]
 * @property {string | number | null} [banos]
 * @property {string | number | null} [estacionamientos]
 * @property {string | number | null} [area_construida]
 * @property {string | number | null} [area_terreno]
 * @property {string} [url_video]
 * @property {boolean | number} [destacada]
 * @property {boolean | number} [activa]
 * @property {string | number} [propietario_id]
 * @property {string} [imagen_principal]
 * @property {string[]} [imagenes_secundarias]
 */

/**
 * @typedef {Object} SecondaryExisting
 * @property {string} id
 * @property {'existente'} type
 * @property {string} url
 * @property {string} [preview]
 */

/**
 * @typedef {Object} SecondaryNew
 * @property {string} id
 * @property {'nueva'} type
 * @property {File} file
 * @property {string} preview
 */

/** @typedef {SecondaryExisting | SecondaryNew} SecondaryItem */

/**
 * @callback OnSubmitProperty
 * @param {any} payload
 * @returns {void | Promise<void>}
 */

/** @type {Record<string, Record<string, string[]>>} */
const UBICACIONES = /** @type {Record<string, Record<string, string[]>>} */ (
    /** @type {unknown} */ (DATOS_UBICACION)
);

const NUMERIC_FIELDS = new Set([
    'precio',
    'habitaciones',
    'banos',
    'estacionamientos',
    'area_construida',
    'area_terreno',
]);

/** @type {Record<string, string>} */
const FIELD_LABELS = {
    titulo: 'El título',
    descripcion_corta: 'La descripción corta',
    descripcion_larga: 'La descripción detallada',
    provincia: 'La provincia',
    canton: 'El cantón',
    distrito: 'El distrito',
    direccion_exacta: 'La dirección exacta',
    latitud: 'La latitud',
    longitud: 'La longitud',
    tipo_inmueble_id: 'El tipo de inmueble',
    tipo_operacion: 'El tipo de operación',
    precio: 'El precio',
    moneda: 'La moneda',
    tipo_precio: 'El tipo de precio',
    habitaciones: 'El número de habitaciones',
    banos: 'El número de baños',
    estacionamientos: 'El número de parqueos',
    area_construida: 'El área construida',
    area_terreno: 'El área del terreno',
    url_video: 'La URL del video',
    propietario_id: 'El propietario',
};

/**
 * @param {ZodIssue} issue
 * @returns {string}
 */
const getFriendlyErrorMessage = (issue) => {
    if (!issue) return 'Datos del formulario inválidos.';

    const path = Array.isArray(issue.path) ? issue.path : [];
    const field = path.length > 0 ? String(path[0]) : null;
    const label = (field && FIELD_LABELS[field]) || 'El campo';

    switch (issue.code) {
        case 'too_small':
            if (issue.origin === 'number') {
                if (field === 'propietario_id') {
                    return 'Selecciona un propietario o deja el campo vacío para "Sin asignar".';
                }
                return `${label} debe ser mayor que ${issue.minimum}.`;
            }
            return `${label} debe tener al menos ${issue.minimum} caracteres.`;

        case 'too_big':
            if (issue.origin === 'number') {
                return `${label} no puede ser mayor que ${issue.maximum}.`;
            }
            return `${label} no puede tener más de ${issue.maximum} caracteres.`;

        case 'invalid_type':
            if (issue.input === undefined || issue.input === null) {
                return `${label} es obligatorio.`;
            }
            return `${label} no tiene un formato válido.`;

        case 'invalid_format':
            return `${label} tiene un formato inválido.`;

        case 'invalid_value':
            return `${label} tiene un valor no permitido.`;

        default:
            return issue.message || `${label} no es válido.`;
    }
};

/**
 * @param {InitialPropertyData | null | undefined} initialData
 * @param {OnSubmitProperty} onSubmit
 */
export default function usePropertyForm(initialData, onSubmit) {
    const ObjectKeys = Object.keys;

    const [formData, setFormData] = useState(/** @type {PropertyFormState} */ ({
        titulo: '', descripcion_corta: '', descripcion_larga: '',
        provincia: '', canton: '', distrito: '',
        direccion_exacta: '', latitud: '', longitud: '',
        tipo_inmueble_id: '', tipo_operacion: 'venta', precio: '',
        moneda: 'USD', tipo_precio: 'fijo', habitaciones: '',
        banos: '', estacionamientos: '0', area_construida: '',
        area_terreno: '', url_video: '',
        destacada: false, activa: true, propietario_id: ''
    }));

    const [provincias] = useState(ObjectKeys(UBICACIONES));
    const [cantones, setCantones] = useState(/** @type {string[]} */ ([]));
    const [distritos, setDistritos] = useState(/** @type {string[]} */ ([]));
    const [tiposInmueble, setTiposInmueble] = useState(/** @type {Array<{ id: number, nombre: string }>} */ ([]));
    const [propietarios, setPropietarios] = useState(/** @type {Array<Record<string, any>>} */ ([]));
    const [selectedFile, setSelectedFile] = useState(/** @type {File | null} */ (null));
    const [previewUrl, setPreviewUrl] = useState('');
    const [secondaryItems, setSecondaryItems] = useState(/** @type {SecondaryItem[]} */ ([]));

    const skipGeocodeRef = useRef(false);
    const geocodeControllerRef = useRef(/** @type {AbortController | null} */ (null));
    const createdUrlsRef = useRef(/** @type {Set<string>} */ (new Set()));

    /**
     * @param {File} file
     * @returns {string}
     */
    const createTrackedBlobUrl = (file) => {
        const url = URL.createObjectURL(file);
        createdUrlsRef.current.add(url);
        return url;
    };

    /** @param {string} url */
    const revokeTrackedBlobUrl = (url) => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
            createdUrlsRef.current.delete(url);
        }
    };

    useEffect(() => {
        return () => {
            createdUrlsRef.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });
            createdUrlsRef.current.clear();
        };
    }, []);

    useEffect(() => {
        if (!initialData) {
            const draft = sessionStorage.getItem('property_form_draft');
            if (draft) {
                try {
                    const parsed = JSON.parse(draft);
                    setFormData((prev) => ({ ...prev, ...parsed }));
                } catch {}
            }
        }
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            const timeout = setTimeout(() => {
                sessionStorage.setItem('property_form_draft', JSON.stringify(formData));
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [formData, initialData]);

    useEffect(() => {
        const fetchInicial = async () => {
            try {
                const [tipos, props] = await Promise.all([
                    api.diccionarios.getTiposInmueble(),
                    api.propietarios.getActivos()
                ]);
                setTiposInmueble(tipos);
                setPropietarios(props);
            } catch (err) {
                console.error(err);
            }
        };
        fetchInicial();
    }, []);

    useEffect(() => {
        if (formData.provincia && UBICACIONES[formData.provincia]) {
            setCantones(ObjectKeys(UBICACIONES[formData.provincia]));
        } else {
            setCantones([]);
        }
    }, [formData.provincia]);

    useEffect(() => {
        if (formData.provincia && formData.canton && UBICACIONES[formData.provincia]?.[formData.canton]) {
            setDistritos(UBICACIONES[formData.provincia][formData.canton]);
        } else {
            setDistritos([]);
        }
    }, [formData.provincia, formData.canton]);

    useEffect(() => {
        if (initialData) {
            let prov = '', cant = '', dist = '';
            if (initialData.ubicacion) {
                const partes = initialData.ubicacion.split(',').map((s) => s.trim());
                if (partes.length === 3) {
                    [prov, cant, dist] = partes;
                }
            }

            setFormData({
                titulo: initialData.titulo || '',
                descripcion_corta: initialData.descripcion_corta || '',
                descripcion_larga: initialData.descripcion_larga || '',
                provincia: prov, canton: cant, distrito: dist,
                direccion_exacta: initialData.direccion_exacta || '',
                latitud: initialData.latitud !== null && initialData.latitud !== undefined ? String(initialData.latitud) : '',
                longitud: initialData.longitud !== null && initialData.longitud !== undefined ? String(initialData.longitud) : '',
                tipo_inmueble_id: initialData.tipo_inmueble_id !== null && initialData.tipo_inmueble_id !== undefined ? String(initialData.tipo_inmueble_id) : '',
                tipo_operacion: initialData.tipo_operacion || 'venta',
                precio: initialData.precio !== null && initialData.precio !== undefined ? String(initialData.precio) : '',
                moneda: initialData.moneda || 'USD',
                tipo_precio: initialData.tipo_precio || 'fijo',
                habitaciones: initialData.habitaciones !== null && initialData.habitaciones !== undefined ? String(initialData.habitaciones) : '',
                banos: initialData.banos !== null && initialData.banos !== undefined ? String(initialData.banos) : '',
                estacionamientos: initialData.estacionamientos !== null && initialData.estacionamientos !== undefined ? String(initialData.estacionamientos) : '0',
                area_construida: initialData.area_construida !== null && initialData.area_construida !== undefined ? String(initialData.area_construida) : '',
                area_terreno: initialData.area_terreno !== null && initialData.area_terreno !== undefined ? String(initialData.area_terreno) : '',
                url_video: initialData.url_video || '',
                destacada: Boolean(initialData.destacada),
                activa: initialData.activa !== undefined ? Boolean(initialData.activa) : true,
                propietario_id: initialData.propietario_id !== null && initialData.propietario_id !== undefined ? String(initialData.propietario_id) : ''
            });

            if (initialData.latitud && initialData.longitud && prov && cant && dist) {
                skipGeocodeRef.current = true;
            }

            if (initialData.imagen_principal) {
                const fullUrl = initialData.imagen_principal.startsWith('http')
                    ? initialData.imagen_principal
                    : `${BACKEND_URL}${initialData.imagen_principal}`;
                setPreviewUrl(fullUrl);
            }

            if (initialData.imagenes_secundarias && Array.isArray(initialData.imagenes_secundarias)) {
                const items = initialData.imagenes_secundarias.map((url, idx) => ({
                    id: `existing_${idx}`,
                    type: /** @type {'existente'} */ ('existente'),
                    url: url,
                    preview: url.startsWith('http') ? url : `${BACKEND_URL}${url}`
                }));
                setSecondaryItems(items);
            }
        }
    }, [initialData]);

    useEffect(() => {
        const { provincia, canton, distrito } = formData;

        if (!provincia || !canton || !distrito) {
            return;
        }

        if (skipGeocodeRef.current) {
            skipGeocodeRef.current = false;
            return;
        }

        geocodeControllerRef.current?.abort();
        const controller = new AbortController();
        geocodeControllerRef.current = controller;

        const timeout = setTimeout(async () => {
            try {
                const q = `${distrito}, ${canton}, ${provincia}, Costa Rica`;
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
                    { signal: controller.signal }
                );
                const data = await res.json();
                if (data && data.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        latitud: String(data[0].lat),
                        longitud: String(data[0].lon),
                    }));
                }
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error(err);
                }
            }
        }, 400);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [formData.provincia, formData.canton, formData.distrito]);

    /** @param {FormChangeEvent} e */
    const handleChange = (e) => {
        const { name, value } = e.target;

        let nextValue = value;
        if (NUMERIC_FIELDS.has(name) && value !== '') {
            const num = Number(value);
            if (!Number.isNaN(num) && num < 0) {
                nextValue = '0';
            }
        }

        setFormData((prev) => {
            /** @type {PropertyFormState} */
            const newData = { ...prev, [name]: nextValue };
            if (name === 'provincia') { newData.canton = ''; newData.distrito = ''; }
            if (name === 'canton') { newData.distrito = ''; }
            return newData;
        });
    };

    /**
     * @param {number | string} lat
     * @param {number | string} lng
     */
    const handleLocationSelect = (lat, lng) => {
        setFormData((prev) => ({
            ...prev,
            latitud: lat.toString(),
            longitud: lng.toString()
        }));
    };

    /** @param {InputChangeEvent} e */
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    /** @param {InputChangeEvent} e */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                revokeTrackedBlobUrl(previewUrl);
            }
            setSelectedFile(file);
            setPreviewUrl(createTrackedBlobUrl(file));
        }
    };

    /** @param {InputChangeEvent} e */
    const handleSecondaryFilesChange = (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            /** @type {SecondaryItem[]} */
            const newItems = files.map((file, idx) => ({
                id: `new_${Date.now()}_${idx}`,
                type: /** @type {'nueva'} */ ('nueva'),
                file: file,
                preview: createTrackedBlobUrl(file)
            }));
            setSecondaryItems((prev) => [...prev, ...newItems]);
        }
    };

    /** @param {number} index */
    const handleRemoveSecondaryImage = (index) => {
        setSecondaryItems((prev) => {
            const item = prev[index];
            if (item && item.type === 'nueva' && item.preview) {
                revokeTrackedBlobUrl(item.preview);
            }
            return prev.filter((_, idx) => idx !== index);
        });
    };

    /**
     * @param {number} fromIndex
     * @param {number} toIndex
     */
    const handleReorderSecondaryImages = (fromIndex, toIndex) => {
        setSecondaryItems((prev) => {
            const updated = Array.from(prev);
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            return updated;
        });
    };

    /** @param {FormSubmitEvent} e */
    const handleSubmit = (e) => {
        e.preventDefault();

        /** @param {string} v */
        const emptyToUndefined = (v) => (v === '' ? undefined : v);

        const payloadForValidation = {
            ...formData,
            propietario_id: emptyToUndefined(formData.propietario_id),
            habitaciones: emptyToUndefined(formData.habitaciones),
            banos: emptyToUndefined(formData.banos),
            area_construida: emptyToUndefined(formData.area_construida),
            area_terreno: emptyToUndefined(formData.area_terreno),
        };

        const validation = PropertySchema.safeParse(payloadForValidation);
        if (!validation.success) {
            toast.error(getFriendlyErrorMessage(validation.error.issues[0]));
            return;
        }

        const { provincia, canton, distrito, ...rest } = formData;
        const finalData = { ...rest, ubicacion: `${provincia}, ${canton}, ${distrito}` };

        /** @type {File[]} */
        const newFiles = [];
        /** @type {Array<{ type: 'existente' | 'nueva', url?: string }>} */
        const ordenGaleria = secondaryItems.map((item) => {
            if (item.type === 'existente') {
                return { type: 'existente', url: item.url };
            } else {
                newFiles.push(item.file);
                return { type: 'nueva' };
            }
        });

        sessionStorage.removeItem('property_form_draft');

        onSubmit({
            ...finalData,
            imagen_principal: selectedFile || initialData?.imagen_principal,
            imagenes_secundarias: newFiles.length > 0 ? newFiles : undefined,
            orden_galeria: JSON.stringify(ordenGaleria)
        });
    };

    return {
        formData, provincias, cantones, distritos, tiposInmueble, propietarios,
        previewUrl, secondaryPreviewUrls: secondaryItems,
        handleChange, handleLocationSelect, handleCheckboxChange, handleFileChange,
        handleSecondaryFilesChange, handleRemoveSecondaryImage,
        handleReorderSecondaryImages, handleSubmit
    };
}