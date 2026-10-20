import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassCard, LiquidGlassPanel } from '@/components/ui/LiquidGlass';

const DronGallery = lazy(() => import('@/components/common/DronGallery'));

const SERVICIOS = [
    {
        img: 'ForSale2.webp',
        tag: 'Ventas',
        title: 'Compra y Venta de Propiedades',
        text: 'Te asesoramos de principio a fin para encontrar la propiedad ideal o comercializar tu inmueble al mejor precio del mercado.',
    },
    {
        img: 'Alquiler.webp',
        tag: 'Rentas',
        title: 'Alquileres Residenciales y Comerciales',
        text: 'Conectamos propietarios e inquilinos mediante contratos claros, seguros y adaptados a las necesidades de cada parte.',
    },
    {
        img: 'asesoria.webp',
        tag: 'Consultoría',
        title: 'Asesoría Legal e Inmobiliaria',
        text: 'Guía experta en trámites legales, avalúos y gestión financiera para garantizar transacciones fluidas y sin sorpresas.',
    },
];

const FOTOS_DRON = [
    { src: '/img/Foto1.webp', alt: 'Fotografía con dron 1' },
    { src: '/img/Foto2.webp', alt: 'Fotografía con dron 2' },
    { src: '/img/Foto3.webp', alt: 'Fotografía con dron 3' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.18 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Servicios() {
    const [indexLightbox, setIndexLightbox] = useState(-1);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <section className="page-hero">
                <div className="container">
                    <motion.div
                        className="section-head"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        <span className="section-badge">Soluciones Inmobiliarias</span>
                        <h1 className="section-title">Nuestros Servicios</h1>
                        <p className="section-subtitle">
                            En Bienes Raíces Horquetas de Sarapiquí ofrecemos soluciones integrales para acompañarte con seguridad, transparencia y profesionalismo en cada fase de tu operación inmobiliaria.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="pb-5">
                <div className="container">
                    <motion.div
                        className="row g-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {SERVICIOS.map((servicio, idx) => (
                            <motion.div key={idx} className="col-md-4" variants={cardVariants}>
                                <LiquidGlassCard liquid className="feature-card">
                                    <div className="feature-card-img">
                                        <img src={`/img/${servicio.img}`} alt={servicio.title} loading="lazy" />
                                    </div>
                                    <div className="feature-card-body">
                                        <span className="feature-card-tag">{servicio.tag}</span>
                                        <h2 className="feature-card-title">{servicio.title}</h2>
                                        <p className="feature-card-text">{servicio.text}</p>
                                    </div>
                                </LiquidGlassCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="pb-5">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <LiquidGlassPanel liquid className="p-4 p-lg-5">
                            <div className="row align-items-center g-4 g-lg-5">
                                <div className="col-lg-6">
                                    <div className="media-frame lg lg--flat">
                                        <div className="swiper-frame">
                                            <Suspense
                                                fallback={
                                                    <img
                                                        src={FOTOS_DRON[0].src}
                                                        alt={FOTOS_DRON[0].alt}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            display: 'block',
                                                        }}
                                                    />
                                                }
                                            >
                                                <DronGallery
                                                    photos={FOTOS_DRON}
                                                    indexLightbox={indexLightbox}
                                                    setIndexLightbox={setIndexLightbox}
                                                />
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <span className="section-badge">Innovación Visual</span>
                                    <h2 className="section-title">Fotografía Aérea de Alto Impacto</h2>
                                    <p className="section-subtitle mb-3">
                                        Destacamos el verdadero potencial de tu propiedad con capturas profesionales y tomas panorámicas con dron.
                                    </p>
                                    <p className="section-subtitle mb-4">
                                        Una presentación visual de máxima calidad incrementa el interés de compradores potenciales y acelera el tiempo de venta o alquiler en el mercado.
                                    </p>

                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <motion.div whileHover={{ x: 6 }} className="mini-stat" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid var(--color-accent)', borderRadius: '0.75rem', background: 'rgba(197, 155, 39, 0.08)' }}>
                                                <span className="mini-stat-value" style={{ fontSize: '1rem' }}>Alta Resolución</span>
                                                <span className="mini-stat-label">Detalles nítidos</span>
                                            </motion.div>
                                        </div>
                                        <div className="col-sm-6">
                                            <motion.div whileHover={{ x: 6 }} className="mini-stat" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid var(--color-accent)', borderRadius: '0.75rem', background: 'rgba(197, 155, 39, 0.08)' }}>
                                                <span className="mini-stat-value" style={{ fontSize: '1rem' }}>Tomas Perimetrales</span>
                                                <span className="mini-stat-label">Perspectiva completa</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LiquidGlassPanel>
                    </motion.div>
                </div>
            </section>
        </motion.main>
    );
}