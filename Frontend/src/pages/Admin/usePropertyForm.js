import { useState, useEffect } from 'react';
import { api, BACKEND_URL } from '@/services/api';
import { DATOS_UBICACION } from '@/data/ubicaciones';

export default function usePropertyForm(initialData, onSubmit) {
    const ObjectKeys = Object.keys;

    const [formData, setFormData] = useState({
        titulo: '', descripcion_corta: '', descripcion_larga: '',
        provincia: '', canton: '', distrito: '',
        direccion_exacta: '', latitud: '', longitud: '',
        tipo_inmueble_id: '', tipo_operacion: 'venta', precio: '',
        moneda: 'USD', tipo_precio: 'fijo', habitaciones: '',
        banos: '', estacionamientos: '0', area_construida: '',
        area_terreno: '', url_video: '', url_tour_360: '',
        destacada: false, activa: true
    });

    const [provincias] = useState(ObjectKeys(DATOS_UBICACION));
    const [cantones, setCantones] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [tiposInmueble, setTiposInmueble] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [secondaryItems, setSecondaryItems] = useState([]);

    useEffect(() => {
        const fetchInicial = async () => {
            const tipos = await api.diccionarios.getTiposInmueble();
            setTiposInmueble(tipos);
        };
        fetchInicial();
    }, []);

    useEffect(() => {
        if (formData.provincia && DATOS_UBICACION[formData.provincia]) {
            setCantones(ObjectKeys(DATOS_UBICACION[formData.provincia]));
        } else {
            setCantones([]);
        }
    }, [formData.provincia]);

    useEffect(() => {
        if (formData.provincia && formData.canton && DATOS_UBICACION[formData.provincia][formData.canton]) {
            setDistritos(DATOS_UBICACION[formData.provincia][formData.canton]);
        } else {
            setDistritos([]);
        }
    }, [formData.provincia, formData.canton]);

    useEffect(() => {
        if (initialData) {
            let prov = '', cant = '', dist = '';
            if (initialData.ubicacion) {
                const partes = initialData.ubicacion.split(', ');
                if (partes.length >= 3) {
                    [prov, cant, dist] = partes;
                }
            }

            setFormData({
                ...initialData,
                provincia: prov,
                canton: cant,
                distrito: dist,
                tipo_operacion: initialData.tipo_operacion || 'venta',
                moneda: initialData.moneda || 'USD',
                tipo_precio: initialData.tipo_precio || 'fijo',
                estacionamientos: initialData.estacionamientos || '0',
                destacada: initialData.destacada === 1 || initialData.destacada === true,
                activa: initialData.activa !== undefined ? Boolean(initialData.activa) : true
            });

            if (initialData.imagen_principal) {
                const fullUrl = initialData.imagen_principal.startsWith('http')
                    ? initialData.imagen_principal
                    : `${BACKEND_URL}${initialData.imagen_principal}`;
                setPreviewUrl(fullUrl);
            }

            if (initialData.imagenes_secundarias?.length > 0) {
                const items = initialData.imagenes_secundarias.map((img, idx) => ({
                    id: `ext_${idx}_${Date.now()}`,
                    type: 'existente',
                    url: img,
                    preview: img.startsWith('http') ? img : `${BACKEND_URL}${img}`
                }));
                setSecondaryItems(items);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            if (name === 'provincia') { newData.canton = ''; newData.distrito = ''; }
            if (name === 'canton') { newData.distrito = ''; }
            return newData;
        });
    };

    const handleLocationSelect = (lat, lng) => {
        setFormData((prev) => ({
            ...prev,
            latitud: lat.toString(),
            longitud: lng.toString()
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSecondaryFilesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newItems = files.map((file, idx) => ({
                id: `new_${Date.now()}_${idx}`,
                type: 'nueva',
                file: file,
                preview: URL.createObjectURL(file)
            }));
            setSecondaryItems((prev) => [...prev, ...newItems]);
        }
    };

    const handleRemoveSecondaryImage = (index) => {
        setSecondaryItems((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleReorderSecondaryImages = (fromIndex, toIndex) => {
        setSecondaryItems((prev) => {
            const updated = Array.from(prev);
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = { ...formData };

        finalData.ubicacion = `${formData.provincia}, ${formData.canton}, ${formData.distrito}`;

        delete finalData.provincia;
        delete finalData.canton;
        delete finalData.distrito;

        const newFiles = [];
        const ordenGaleria = secondaryItems.map((item) => {
            if (item.type === 'existente') {
                return { type: 'existente', url: item.url };
            } else {
                newFiles.push(item.file);
                return { type: 'nueva' };
            }
        });

        onSubmit({
            ...finalData,
            imagen_principal: selectedFile || initialData?.imagen_principal,
            imagenes_secundarias: newFiles.length > 0 ? newFiles : undefined,
            orden_galeria: JSON.stringify(ordenGaleria)
        });
    };

    return {
        formData, provincias, cantones, distritos, tiposInmueble,
        previewUrl, secondaryPreviewUrls: secondaryItems,
        handleChange, handleLocationSelect, handleCheckboxChange, handleFileChange,
        handleSecondaryFilesChange, handleRemoveSecondaryImage,
        handleReorderSecondaryImages, handleSubmit
    };
}