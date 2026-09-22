import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'yet-another-react-lightbox/styles.css';

export default function Servicios() {
    const [indexLightbox, setIndexLightbox] = useState(-1);

    const fotosDron = [
        { src: '/img/Foto1.webp', alt: 'Fotografía con dron 1' },
        { src: '/img/Foto2.webp', alt: 'Fotografía con dron 2' },
        { src: '/img/Foto3.webp', alt: 'Fotografía con dron 3' }
    ];

    return (
        <main className="py-5">
            <div className="container py-4">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-lg-8">
                        <h1 className="display-5 fw-bold text-primary mb-3">Nuestros Servicios</h1>
                        <p className="lead text-body-secondary">
                            En Bienes Raíces Horquetas de Sarapiquí ofrecemos soluciones completas en bienes raíces para ayudarte a comprar, vender o alquilar propiedades de forma segura y eficiente.
                        </p>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <article className="card h-100 border-0 shadow-sm overflow-hidden rounded-4">
                            <div className="ratio ratio-16x9">
                                <img src="/img/ForSale2.webp" alt="Servicios de Compra y Venta de Propiedades" className="object-fit-cover" />
                            </div>
                            <div className="card-body p-4">
                                <h2 className="h4 fw-bold card-title mb-2">Compra y Venta de Propiedades</h2>
                                <p className="card-text text-body-secondary">
                                    Te acompañamos en la búsqueda de tu nuevo hogar y en la venta rápida de tu propiedad actual al mejor precio.
                                </p>
                            </div>
                        </article>
                    </div>

                    <div className="col-md-4">
                        <article className="card h-100 border-0 shadow-sm overflow-hidden rounded-4">
                            <div className="ratio ratio-16x9">
                                <img src="/img/Alquiler.webp" alt="Alquileres" className="object-fit-cover" />
                            </div>
                            <div className="card-body p-4">
                                <h2 className="h4 fw-bold card-title mb-2">Alquileres</h2>
                                <p className="card-text text-body-secondary">
                                    Opciones de renta seguras y adaptadas a lo que buscas.
                                </p>
                            </div>
                        </article>
                    </div>

                    <div className="col-md-4">
                        <article className="card h-100 border-0 shadow-sm overflow-hidden rounded-4">
                            <div className="ratio ratio-16x9">
                                <img src="/img/asesoria.webp" alt="Asesoría" className="object-fit-cover" />
                            </div>
                            <div className="card-body p-4">
                                <h2 className="h4 fw-bold card-title mb-2">Asesoría Inmobiliaria</h2>
                                <p className="card-text text-body-secondary">
                                    Te guiamos en todo el proceso legal y financiero.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>

                <div className="card border-0 shadow-sm overflow-hidden rounded-4">
                    <div className="ratio ratio-16x9">
                        <Swiper 
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            className="w-100 h-100"
                        >
                            {fotosDron.map((foto, idx) => (
                                <SwiperSlide key={idx} className="w-100 h-100">
                                    <img 
                                        src={foto.src} 
                                        alt={foto.alt} 
                                        className="w-100 h-100 object-fit-cover d-block"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setIndexLightbox(idx)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    
                    <div className="card-body p-4 p-md-5">
                        <h2 className="h3 fw-bold mb-2">Fotografías de Alto Impacto</h2>
                        <p className="card-text text-body-secondary fs-5 mb-0">
                            Mostramos tu propiedad con imágenes profesionales y tomas aéreas para destacar frente a otras en el mercado.
                        </p>
                    </div>
                </div>
            </div>

            <Lightbox
                open={indexLightbox >= 0}
                index={indexLightbox}
                close={() => setIndexLightbox(-1)}
                slides={fotosDron.map(f => ({ src: f.src, alt: f.alt }))}
            />
        </main>
    );
}