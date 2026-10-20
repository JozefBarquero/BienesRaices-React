import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, getImageUrl } from '@/services/api';
import PropiedadCard from '@/components/ui/PropiedadCard';

export default function CatalogPage() {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('');
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('hideCurrencyDisclaimer')) {
            setShowDisclaimer(true);
        }

        const fetchPropiedades = async () => {
            try {
                const data = await api.propiedades.getAll();
                const propiedadesNormalizadas = data
                    .filter((p) => p.activa)
                    .map((p) => ({
                        ...p,
                        imagen: getImageUrl(p.imagen_principal),
                    }));
                setPropiedades(propiedadesNormalizadas);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPropiedades();
    }, []);

    const propiedadesFiltradas = propiedades.filter((p) =>
        p.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        (p.ubicacion_completa && p.ubicacion_completa.toLowerCase().includes(filtro.toLowerCase())) ||
        (p.tipo_inmueble_texto && p.tipo_inmueble_texto.toLowerCase().includes(filtro.toLowerCase()))
    );

    return (
        <section className="page-hero">
            <div className="container">
                <motion.div
                    className="catalog-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-badge">Portafolio</span>
                    <h1 className="catalog-title">Catálogo de Propiedades</h1>
                    <p className="catalog-subtitle">
                        Explora nuestra selección curada de propiedades activas y encuentra el espacio que mejor se adapte a tus planes.
                    </p>
                </motion.div>

                {showDisclaimer && (
                    <motion.div
                        className="catalog-disclaimer lg lg--soft"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="catalog-disclaimer-icon" aria-hidden="true">!</span>
                        <p className="catalog-disclaimer-body">
                            <strong>Nota sobre precios:</strong> Los valores expresados con la etiqueta &quot;Aprox&quot; son conversiones estimadas según el tipo de cambio actual y pueden variar. El precio legal vinculante es el original fijado en la propiedad.
                        </p>
                        <button
                            type="button"
                            className="catalog-disclaimer-close"
                            onClick={() => {
                                setShowDisclaimer(false);
                                localStorage.setItem('hideCurrencyDisclaimer', 'true');
                            }}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </motion.div>
                )}

                <div className="catalog-search-wrap">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, ubicación o tipo..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="catalog-search"
                    />
                </div>

                {loading ? (
                    <div className="catalog-loading">
                        <span className="catalog-spinner" aria-hidden="true" />
                        <span>Cargando propiedades...</span>
                    </div>
                ) : propiedadesFiltradas.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {propiedadesFiltradas.map((p) => (
                            <div className="col" key={p.id}>
                                <PropiedadCard propiedad={p} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="catalog-empty">
                        <p className="mb-0">No se encontraron propiedades que coincidan con la búsqueda.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
