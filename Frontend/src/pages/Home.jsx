import { motion } from 'framer-motion';
import DisclaimerModal from '@/components/common/DisclaimerModal';
import {
    LiquidGlassCard,
    LiquidGlassButton,
} from '@/components/ui/LiquidGlass';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.18 },
    },
};

const VALORES = [
    {
        img: 'handshake.webp',
        title: 'Confianza',
        text: 'Actuamos con total integridad para construir relaciones transparentes y sólidas a largo plazo con cada cliente.',
    },
    {
        img: 'keys.webp',
        title: 'Excelencia',
        text: 'Buscamos la perfección en cada transacción, desde la valoración de la propiedad hasta la entrega de llaves.',
    },
    {
        img: 'family.webp',
        title: 'Empatía',
        text: 'Comprendemos el valor emocional y financiero de cada inmueble, priorizando siempre tus necesidades reales.',
    },
];

const IMPACTO = [
    { num: '500+', text: 'Propiedades Vendidas' },
    { num: '1000+', text: 'Familias Satisfechas' },
    { num: '15+', text: 'Años de Experiencia' },
];

export default function Home() {
    return (
        <>
            <DisclaimerModal />
            <main>
                <section className="page-hero">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <motion.div
                                className="col-lg-6"
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                            >
                                <span className="section-badge">Bienvenidos</span>
                                <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                                    Tu aliado de confianza en bienes raíces
                                </h1>
                                <p className="section-subtitle mb-3">
                                    En <strong style={{ color: 'var(--color-heading)' }}>Bienes Raíces Horquetas de Sarapiquí</strong>, nos apasiona conectar a cada cliente con el espacio idóneo para su hogar o proyecto.
                                </p>
                                <p className="section-subtitle mb-4">
                                    Te brindamos un acompañamiento integral durante todo el proceso de compra, venta o alquiler, respaldado por una profunda asesoría y un trato personalizado.
                                </p>
                                <div className="d-flex flex-column flex-sm-row gap-3">
                                    <LiquidGlassButton variant="primary" to="/contacto">
                                        Contactar ahora
                                    </LiquidGlassButton>
                                    <LiquidGlassButton variant="ghost" to="/catalogo">
                                        Ver propiedades
                                    </LiquidGlassButton>
                                </div>
                            </motion.div>

                            <motion.div
                                className="col-lg-6"
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.15 }}
                            >
                                <div className="hero-media-wrap">
                                    <div className="media-frame lg lg--liquid">
                                        <motion.img
                                            whileHover={{ scale: 1.04 }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            src="/img/casa-jardin.webp"
                                            alt="Propiedad destacada"
                                            fetchpriority="high"
                                        />
                                    </div>
                                    <div className="hero-float-card lg lg--soft">
                                        <span className="hero-float-value">+100</span>
                                        <span className="hero-float-label">Propiedades activas</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="page-strip">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <motion.div
                                className="col-lg-6"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-100px' }}
                                variants={fadeUp}
                            >
                                <div className="media-frame lg lg--liquid">
                                    <img src="/img/vecindario.webp" alt="Historia de la empresa" loading="lazy" />
                                </div>
                            </motion.div>

                            <motion.div
                                className="col-lg-6"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-100px' }}
                                variants={{
                                    hidden: { opacity: 0, x: 40 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                                }}
                            >
                                <span className="section-badge">Sobre Nosotros</span>
                                <h2 className="section-title">Nuestra Historia</h2>
                                <p className="section-subtitle mb-3">
                                    Fundada con la visión de revolucionar el sector inmobiliario, <strong style={{ color: 'var(--color-heading)' }}>Bienes Raíces Horquetas de Sarapiquí</strong> ha crecido hasta convertirse en un referente de confianza en la región.
                                </p>
                                <p className="section-subtitle mb-4">
                                    Nuestro recorrido inició con un propósito claro: hacer que la búsqueda del lugar ideal sea una experiencia transparente, ágil y sin estrés. Hoy nos enorgullece conectar a familias y emprendedores con sus futuros hogares y espacios comerciales.
                                </p>

                                <div className="row g-3">
                                    <div className="col-12 col-sm-6">
                                        <LiquidGlassCard className="mini-stat" strength="soft" interactive={false}>
                                            <span className="mini-stat-value">+100</span>
                                            <span className="mini-stat-label">Propiedades conectadas</span>
                                        </LiquidGlassCard>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <LiquidGlassCard className="mini-stat" strength="soft" interactive={false}>
                                            <span className="mini-stat-value">100%</span>
                                            <span className="mini-stat-label">Asesoría transparente</span>
                                        </LiquidGlassCard>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-5">
                    <motion.div
                        className="container py-lg-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="section-head">
                            <span className="section-badge">Principios</span>
                            <h2 className="section-title">Nuestros Valores</h2>
                            <p className="section-subtitle">
                                Pilares fundamentales que guían cada una de nuestras gestiones e interacciones.
                            </p>
                        </motion.div>

                        <div className="row g-4">
                            {VALORES.map((val, idx) => (
                                <motion.div key={idx} className="col-md-4" variants={fadeUp}>
                                    <LiquidGlassCard liquid className="feature-card">
                                        <div className="feature-card-img">
                                            <img src={`/img/${val.img}`} alt={val.title} loading="lazy" />
                                        </div>
                                        <div className="feature-card-body">
                                            <h3 className="feature-card-title">{val.title}</h3>
                                            <p className="feature-card-text">{val.text}</p>
                                        </div>
                                    </LiquidGlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <section className="page-strip">
                    <motion.div
                        className="container py-lg-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="section-head">
                            <span className="section-badge">Trayectoria</span>
                            <h2 className="section-title">Nuestro Impacto</h2>
                        </motion.div>

                        <div className="stat-grid">
                            {IMPACTO.map((impact, idx) => (
                                <motion.div key={idx} variants={fadeUp}>
                                    <LiquidGlassCard liquid className="stat-card" interactive={false}>
                                        <motion.span
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: 'spring', delay: 0.15 + idx * 0.1 }}
                                            className="stat-value"
                                        >
                                            {impact.num}
                                        </motion.span>
                                        <span className="stat-label">{impact.text}</span>
                                    </LiquidGlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <section className="py-5">
                    <div className="container py-lg-4">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="cta-panel lg lg--liquid">
                                <h2 className="cta-title">¿Deseas encontrar tu propiedad ideal?</h2>
                                <p className="cta-text">
                                    Ponte en contacto con nuestro equipo de asesores y da el primer paso hacia tu próximo hogar o inversión.
                                </p>
                                <LiquidGlassButton variant="accent" to="/contacto">
                                    Solicitar asesoría
                                </LiquidGlassButton>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    );
}