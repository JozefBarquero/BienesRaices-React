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

    const shareUrl = window.location.href;
    const shareText = propiedad ? `¡Mira esta propiedad en Bienes Raíces Las Horquetas! ${propiedad.titulo}` : '';

    const handleShareWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    };

    const handleShareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const handleShareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

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

                <div className="d-flex gap-2 mb-4 align-items-center flex-wrap">
                    <span className="text-body-secondary fw-semibold me-2">Compartir:</span>
                    <button
                        onClick={handleShareWhatsApp}
                        className="btn btn-sm btn-outline-success d-flex align-items-center gap-2 rounded-pill px-3"
                        type="button"
                        aria-label="Compartir en WhatsApp"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                        WhatsApp
                    </button>
                    <button
                        onClick={handleShareFacebook}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 rounded-pill px-3"
                        type="button"
                        aria-label="Compartir en Facebook"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                        </svg>
                        Facebook
                    </button>
                    <button
                        onClick={handleShareTwitter}
                        className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2 rounded-pill px-3"
                        type="button"
                        aria-label="Compartir en X"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                        </svg>
                        X
                    </button>
                </div>

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