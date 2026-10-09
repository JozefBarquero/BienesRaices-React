import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, getImageUrl } from '@/services/api';
import {
    PropertyGallery,
    PropertyHeader,
    PropertyInfoCard,
    PropertyFeatures,
    PropertyDescription,
    PropertyLocation,
    PropertyVideo,
    PropertyContactForm
} from '@/components/common/property';

export default function PropertyDetailPage() {
    const { id } = useParams();
    const [propiedad, setPropiedad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    galeria: galeriaCompleta
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPropiedad();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5 d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger shadow-sm rounded-4">{error}</div>
            </div>
        );
    }

    if (!propiedad) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning shadow-sm rounded-4">Propiedad no encontrada.</div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Plus Ultra Jakarta Sans', 'Poppins', sans-serif", minHeight: "100vh", paddingBottom: "3rem" }}>
            <div className="container pt-4">
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
                        <PropertyFeatures propiedad={propiedad} />
                        
                        <div className="card border-0 p-4 p-md-5 rounded-4 shadow-sm mb-4">
                            <PropertyDescription description={propiedad.descripcion_larga} />
                        </div>
                        
                        <div className="card border-0 p-4 p-md-5 rounded-4 shadow-sm mb-4">
                            <PropertyLocation propiedad={propiedad} />
                        </div>
                        
                        {propiedad.url_video && (
                            <div className="card border-0 p-4 p-md-5 rounded-4 shadow-sm mb-4">
                                <PropertyVideo url={propiedad.url_video} title={propiedad.titulo} />
                            </div>
                        )}
                    </div>

                    <div className="col-lg-4">
                        <div className="sticky-top" style={{ top: '2rem', zIndex: 10 }}>
                            <PropertyInfoCard propiedad={propiedad} />
                            <PropertyContactForm
                                propertyId={propiedad.id}
                                propertyTitle={propiedad.titulo}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}