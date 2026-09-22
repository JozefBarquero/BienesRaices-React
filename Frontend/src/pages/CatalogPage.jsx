import { useState, useEffect } from 'react';
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
                    .filter(p => p.activa)
                    .map(p => ({
                        ...p,
                        imagen: getImageUrl(p.imagen_principal)
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




    const propiedadesFiltradas = propiedades.filter(p =>
        p.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        (p.ubicacion_completa && p.ubicacion_completa.toLowerCase().includes(filtro.toLowerCase())) ||
        (p.tipo_inmueble_texto && p.tipo_inmueble_texto.toLowerCase().includes(filtro.toLowerCase()))
    );



    return (


        <div className="container py-5">

            <h1 className="display-5 fw-bold text-primary mb-4">Catálogo de Propiedades</h1>

            {showDisclaimer && (

                <div className="alert alert-warning alert-dismissible fade show shadow-sm" role="alert">


                    <strong>Nota sobre precios:</strong> Los valores expresados con la etiqueta "Aprox" son conversiones estimadas según el tipo de cambio actual y pueden variar. El precio legal vinculante es el original fijado en la propiedad.
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => {
                            setShowDisclaimer(false);
                            localStorage.setItem('hideCurrencyDisclaimer', 'true');
                        }}
                        aria-label="Close"
                    ></button>


                </div>
            )}



            <div className="row mb-4">

                <div className="col-md-6 col-lg-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, ubicación o tipo..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="form-control form-control-lg shadow-sm"
                    />
                </div>

            </div>

            {loading ? (

                <div className="d-flex align-items-center gap-3 text-secondary py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <span className="fs-5">Cargando propiedades...</span>
                    
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {propiedadesFiltradas.length > 0 ? (
                        propiedadesFiltradas.map(p => (
                            <div className="col" key={p.id}>
                                <PropiedadCard propiedad={p} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 py-5 text-center text-body-secondary">
                            <p className="fs-5 mb-0">No se encontraron propiedades que coincidan con la búsqueda.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}