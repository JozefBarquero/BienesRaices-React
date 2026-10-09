import { useState } from 'react';
import { motion } from 'framer-motion';
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.main 
            className="py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container py-lg-4">
                <motion.div 
                    className="text-center mx-auto mb-5" 
                    style={{ maxWidth: '750px' }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                >
                    <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                        Soluciones Inmobiliarias
                    </span>
                    <h1 className="display-5 fw-bold text-body-emphasis mb-3">
                        Nuestros Servicios
                    </h1>
                    <p className="lead text-body-secondary">
                        En Bienes Raíces Horquetas de Sarapiquí ofrecemos soluciones integrales para acompañarte con seguridad, transparencia y profesionalismo en cada fase de tu operación inmobiliaria.
                    </p>
                </motion.div>

                <motion.div 
                    className="row g-4 mb-5 pb-lg-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="col-md-4" variants={cardVariants}>
                        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="ratio ratio-16x9 overflow-hidden">
                                <motion.img 
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                    src="/img/ForSale2.webp" 
                                    alt="Compra y Venta de Propiedades" 
                                    className="w-100 h-100 object-fit-cover" 
                                />
                            </div>
                            <div className="card-body p-4">
                                <span className="badge bg-secondary-subtle text-secondary-emphasis fw-semibold mb-2">Ventas</span>
                                <h2 className="h4 fw-bold card-title text-body-emphasis mb-3">Compra y Venta de Propiedades</h2>
                                <p className="card-text text-body-secondary">
                                    Te asesoramos de principio a fin para encontrar la propiedad ideal o comercializar tu inmueble al mejor precio del mercado.
                                </p>
                            </div>
                        </article>
                    </motion.div>

                    <motion.div className="col-md-4" variants={cardVariants}>
                        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="ratio ratio-16x9 overflow-hidden">
                                <motion.img 
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                    src="/img/Alquiler.webp" 
                                    alt="Alquileres" 
                                    className="w-100 h-100 object-fit-cover" 
                                />
                            </div>
                            <div className="card-body p-4">
                                <span className="badge bg-secondary-subtle text-secondary-emphasis fw-semibold mb-2">Rentas</span>
                                <h2 className="h4 fw-bold card-title text-body-emphasis mb-3">Alquileres Residenciales y Comerciales</h2>
                                <p className="card-text text-body-secondary">
                                    Conectamos propietarios e inquilinos mediante contratos claros, seguros y adaptados a las necesidades de cada parte.
                                </p>
                            </div>
                        </article>
                    </motion.div>

                    <motion.div className="col-md-4" variants={cardVariants}>
                        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="ratio ratio-16x9 overflow-hidden">
                                <motion.img 
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                    src="/img/asesoria.webp" 
                                    alt="Asesoría Inmobiliaria" 
                                    className="w-100 h-100 object-fit-cover" 
                                />
                            </div>
                            <div className="card-body p-4">
                                <span className="badge bg-secondary-subtle text-secondary-emphasis fw-semibold mb-2">Consultoría</span>
                                <h2 className="h4 fw-bold card-title text-body-emphasis mb-3">Asesoría Legal e Inmobiliaria</h2>
                                <p className="card-text text-body-secondary">
                                    Guía experta en trámites legales, avalúos y gestión financiera para garantizar transacciones fluidas y sin sorpresas.
                                </p>
                            </div>
                        </article>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="bg-body-tertiary rounded-4 p-4 p-lg-5 shadow-sm border border-light-subtle"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="ratio ratio-4x3 rounded-4 shadow overflow-hidden">
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
                                            <motion.img 
                                                whileHover={{ scale: 1.05 }}
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
                        </div>

                        <div className="col-lg-6">
                            <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                                Innovación Visual
                            </span>
                            <h2 className="display-6 fw-bold text-body-emphasis mb-3">
                                Fotografía Aérea de Alto Impacto
                            </h2>
                            <p className="lead text-body-secondary mb-3">
                                Destacamos el verdadero potencial de tu propiedad con capturas profesionales y tomas panorámicas con dron.
                            </p>
                            <p className="text-body-secondary mb-4">
                                Una presentación visual de máxima calidad incrementa el interés de compradores potenciales y acelera el tiempo de venta o alquiler en el mercado.
                            </p>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <motion.div whileHover={{ x: 5 }} className="border-start border-primary border-3 ps-3">
                                        <span className="fw-bold fs-5 d-block text-body-emphasis">Alta Resolución</span>
                                        <small className="text-body-secondary">Detalles nítidos</small>
                                    </motion.div>
                                </div>
                                <div className="col-sm-6">
                                    <motion.div whileHover={{ x: 5 }} className="border-start border-primary border-3 ps-3">
                                        <span className="fw-bold fs-5 d-block text-body-emphasis">Tomas Perimetrales</span>
                                        <small className="text-body-secondary">Perspectiva completa</small>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Lightbox
                open={indexLightbox >= 0}
                index={indexLightbox}
                close={() => setIndexLightbox(-1)}
                slides={fotosDron.map(f => ({ src: f.src, alt: f.alt }))}
            />
        </motion.main>
    );
}