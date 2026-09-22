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

            <div className="container py-5">

                <div className="d-flex align-items-center gap-3 text-secondary">
                    <div className="spinner-border text-primary" role="status"></div>
                    <span className="fs-5">Cargando detalles de la propiedad...</span>
                </div>

            </div>

        );
    }

    if (error) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>

            </div>
        );
    }




    if (!propiedad) {

        return (

            <div className="container py-5">

                <div className="alert alert-warning" role="alert">
                    Propiedad no encontrada.
                </div>

            </div>

        );
    }




    return (

        <div className="container py-5">


            <PropertyHeader title={propiedad.titulo} />

            <PropertyGallery
                title={propiedad.titulo}
                image={propiedad.imagen}
                gallery={propiedad.galeria}
            />

            <PropertyInfoCard propiedad={propiedad} />

            <PropertyFeatures propiedad={propiedad} />

            <PropertyDescription description={propiedad.descripcion_larga} />

            <PropertyLocation propiedad={propiedad} />

            <PropertyVideo url={propiedad.url_video} title={propiedad.titulo} />

            <PropertyContactForm
                propertyId={propiedad.id}
                propertyTitle={propiedad.titulo}
            />


            
        </div>
    );
}