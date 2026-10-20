import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, getImageUrl } from '@/services/api';
import NotFound from '@/pages/NotFound';
import { LiquidGlassPanel } from '@/components/ui/LiquidGlass';
import {
    PropertyGallery,
    PropertyHeader,
    PropertyInfoCard,
    PropertyFeatures,
    PropertyDescription,
    PropertyLocation,
    PropertyVideo,
    PropertyContactForm,
} from '@/components/common/property';

export default function PropertyDetailPage() {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchPropiedad = async () => {
            try {
                const data = await api.propiedades.getById(id);
                const urlPrincipal = getImageUrl(data.imagen_principal);
                const urlsSecundarias = data.imagenes_secundarias
                    ? data.imagenes_secundarias.map(getImageUrl)
                    : [];
                const galeriaCompleta = [urlPrincipal, ...urlsSecundarias].filter(Boolean);

                setPropiedad({
                    ...data,
                    imagen: urlPrincipal,
                    galeria: galeriaCompleta,
                });
            } catch (err) {
                if (err.status === 404) {
                    setNotFound(true);
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPropiedad();
    }, [id]);

    if (loading) {
        return (
            <div className="property-loading">
                <div className="property-loading-spinner" role="status" aria-label="Cargando" />
                <span>Cargando propiedad...</span>
            </div>
        );
    }

    if (notFound) {
        return <NotFound />;
    }

    if (error) {
        return (
            <div className="property-error-wrap">
                <div className="property-error lg lg--soft property-error--danger">
                    <span className="property-error-icon" aria-hidden="true">!</span>
                    <h2 className="property-error-title">No pudimos cargar la propiedad</h2>
                    <p className="property-error-text">{error}</p>
                </div>
            </div>
        );
    }

    if (!propiedad) {
        return (
            <div className="property-error-wrap">
                <div className="property-error lg lg--soft">
                    <span className="property-error-icon" aria-hidden="true">?</span>
                    <h2 className="property-error-title">Propiedad no encontrada</h2>
                    <p className="property-error-text">
                        La propiedad que buscas no está disponible o fue removida del catálogo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="property-detail">
            <div className="container">
                <PropertyHeader title={propiedad.titulo} />

                <div className="mb-4">
                    <PropertyGallery
                        title={propiedad.titulo}
                        image={propiedad.imagen}
                        gallery={propiedad.galeria}
                    />
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <LiquidGlassPanel liquid className="property-section">
                            <PropertyFeatures propiedad={propiedad} />
                        </LiquidGlassPanel>

                        <LiquidGlassPanel liquid className="property-section">
                            <PropertyDescription description={propiedad.descripcion_larga} />
                        </LiquidGlassPanel>

                        <LiquidGlassPanel liquid className="property-section">
                            <PropertyLocation propiedad={propiedad} />
                        </LiquidGlassPanel>

                        {propiedad.url_video && (
                            <LiquidGlassPanel liquid className="property-section">
                                <PropertyVideo url={propiedad.url_video} title={propiedad.titulo} />
                            </LiquidGlassPanel>
                        )}
                    </div>

                    <div className="col-lg-4">
                        <div className="property-sidebar">
                            <LiquidGlassPanel liquid className="property-section">
                                <PropertyInfoCard propiedad={propiedad} />
                            </LiquidGlassPanel>

                            <LiquidGlassPanel liquid className="property-section">
                                <PropertyContactForm
                                    propertyId={propiedad.id}
                                    propertyTitle={propiedad.titulo}
                                />
                            </LiquidGlassPanel>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
