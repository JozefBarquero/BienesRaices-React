import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { api, getImageUrl } from '@/services/api';
import PropiedadCard from '@/components/ui/PropiedadCard';

export default function CatalogPage() {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('');
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    const [globalMin, setGlobalMin] = useState(0);
    const [globalMax, setGlobalMax] = useState(1000000);
    const [minPrecio, setMinPrecio] = useState(0);
    const [maxPrecio, setMaxPrecio] = useState(1000000);
    const [operacion, setOperacion] = useState('todas');
    const [tipoInmueble, setTipoInmueble] = useState('todos');
    const [orden, setOrden] = useState('recientes');

    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 9;

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

                const precios = propiedadesNormalizadas
                    .map((p) => Number(p.precio))
                    .filter((n) => !isNaN(n) && n > 0);

                if (precios.length > 0) {
                    const min = Math.min(...precios);
                    const max = Math.max(...precios);
                    setGlobalMin(min);
                    setGlobalMax(max);
                    setMinPrecio(min);
                    setMaxPrecio(max);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPropiedades();
    }, []);

    useEffect(() => {
        setPaginaActual(1);
    }, [filtro, minPrecio, maxPrecio, operacion, tipoInmueble, orden]);

    const tiposDisponibles = useMemo(() => {
        const tipos = new Set(propiedades.map((p) => p.tipo_inmueble_texto).filter(Boolean));
        return Array.from(tipos).sort();
    }, [propiedades]);

    const propiedadesFiltradas = useMemo(() => {
        let result = propiedades.filter((p) => {
            const matchText =
                p.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
                (p.ubicacion && p.ubicacion.toLowerCase().includes(filtro.toLowerCase())) ||
                (p.tipo_inmueble_texto && p.tipo_inmueble_texto.toLowerCase().includes(filtro.toLowerCase()));

            const matchOperacion = operacion === 'todas' || p.tipo_operacion.toLowerCase() === operacion;
            const matchTipo = tipoInmueble === 'todos' || p.tipo_inmueble_texto === tipoInmueble;

            const price = Number(p.precio) || 0;
            const matchMin = price >= minPrecio;
            const matchMax = price <= maxPrecio;

            return matchText && matchOperacion && matchTipo && matchMin && matchMax;
        });

        result.sort((a, b) => {
            if (orden === 'precio_asc') return Number(a.precio) - Number(b.precio);
            if (orden === 'precio_desc') return Number(b.precio) - Number(a.precio);
            return b.id - a.id;
        });

        return result;
    }, [propiedades, filtro, operacion, tipoInmueble, minPrecio, maxPrecio, orden]);

    const totalPaginas = Math.ceil(propiedadesFiltradas.length / itemsPorPagina);
    const indexUltimo = paginaActual * itemsPorPagina;
    const indexPrimero = indexUltimo - itemsPorPagina;
    const propiedadesPaginadas = propiedadesFiltradas.slice(indexPrimero, indexUltimo);

    const leftPercent = globalMax === globalMin ? 0 : ((minPrecio - globalMin) / (globalMax - globalMin)) * 100;
    const rightPercent = globalMax === globalMin ? 0 : 100 - ((maxPrecio - globalMin) / (globalMax - globalMin)) * 100;

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrecio - 1);
        setMinPrecio(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minPrecio + 1);
        setMaxPrecio(value);
    };

    const formatRangePrice = (val) => {
        return new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(val);
    };

    return (
        <section className="page-hero">
            <div className="container overflow-hidden">
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

                <div className="catalog-search-wrap mb-3">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, ubicación o tipo..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="catalog-search"
                    />
                </div>

                <div className="row g-3 mb-4 align-items-center">
                    <div className="col-12 col-lg-4">
                        <div className="dual-slider-container">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="small fw-semibold text-body-secondary">Rango de precio</span>
                                <span className="small fw-bold" style={{ color: 'var(--color-heading)' }}>
                                    {formatRangePrice(minPrecio)} - {formatRangePrice(maxPrecio)}
                                </span>
                            </div>
                            <div className="dual-slider-wrap">
                                <div className="slider-track" />
                                <div className="slider-range" style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }} />
                                <input
                                    type="range"
                                    min={globalMin}
                                    max={globalMax}
                                    value={minPrecio}
                                    onChange={handleMinChange}
                                    className="slider-input"
                                />
                                <input
                                    type="range"
                                    min={globalMin}
                                    max={globalMax}
                                    value={maxPrecio}
                                    onChange={handleMaxChange}
                                    className="slider-input"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <select
                            className="form-select"
                            value={operacion}
                            onChange={(e) => setOperacion(e.target.value)}
                        >
                            <option value="todas">Operación: Todas</option>
                            <option value="venta">Venta</option>
                            <option value="alquiler">Alquiler</option>
                        </select>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <select
                            className="form-select"
                            value={tipoInmueble}
                            onChange={(e) => setTipoInmueble(e.target.value)}
                        >
                            <option value="todos">Tipo: Todos</option>
                            {tiposDisponibles.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-4 col-lg-4">
                        <select
                            className="form-select"
                            value={orden}
                            onChange={(e) => setOrden(e.target.value)}
                        >
                            <option value="recientes">Ordenar por: Más recientes</option>
                            <option value="precio_asc">Precio: Menor a Mayor</option>
                            <option value="precio_desc">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="catalog-loading">
                        <span className="catalog-spinner" aria-hidden="true" />
                        <span>Cargando propiedades...</span>
                    </div>
                ) : propiedadesFiltradas.length > 0 ? (
                    <>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5 justify-content-center">
                            {propiedadesPaginadas.map((p) => (
                                <div className="col d-flex" key={p.id} style={{ minWidth: 0 }}>
                                    <PropiedadCard propiedad={p} />
                                </div>
                            ))}
                        </div>

                        {totalPaginas > 1 && (
                            <nav aria-label="Navegación de páginas" className="d-flex justify-content-center mt-4">
                                <ul className="pagination flex-wrap justify-content-center gap-1">
                                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                                            aria-label="Página anterior"
                                        >
                                            Anterior
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                                        <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => setPaginaActual(num)}
                                                aria-label={`Página ${num}`}
                                                aria-current={paginaActual === num ? 'page' : undefined}
                                            >
                                                {num}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                                            aria-label="Página siguiente"
                                        >
                                            Siguiente
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="catalog-empty">
                        <p className="mb-0">No se encontraron propiedades que coincidan con los filtros actuales.</p>
                    </div>
                )}
            </div>
        </section>
    );
}