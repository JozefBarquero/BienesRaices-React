import { motion } from 'framer-motion';
import { LiquidGlassCard } from '@/components/ui/LiquidGlass';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideRight = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const slideLeft = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const PILARES = [
    {
        badge: 'Propósito',
        title: 'Misión',
        text: 'Brindar asesoría inmobiliaria de excelencia, guiando de forma ética y transparente cada proceso de inversión o compra de vivienda.',
    },
    {
        badge: 'Futuro',
        title: 'Visión',
        text: 'Consolidarnos como la agencia de bienes raíces referente a nivel regional y nacional gracias a nuestra innovación y calidad humana.',
    },
    {
        badge: 'Garantía',
        title: 'Compromiso',
        text: 'Velar siempre por la seguridad jurídica y la satisfacción total de nuestros clientes antes, durante y después de cerrar cada trato.',
    },
];

export default function Nosotros() {
    return (
        <main>
            <section className="page-hero">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <motion.div
                            className="col-lg-6"
                            initial="hidden"
                            animate="visible"
                            variants={slideRight}
                        >
                            <span className="section-badge">Conócenos</span>
                            <h1 className="section-title">Nuestra Esencia y Trayectoria</h1>
                            <p className="section-subtitle mb-3">
                                En <strong style={{ color: 'var(--color-heading)' }}>Bienes Raíces Horquetas de Sarapiquí</strong> nos apasiona conectar personas con espacios únicos.
                            </p>
                            <p className="section-subtitle mb-4">
                                Más que comercializar propiedades, construimos relaciones duraderas basadas en la confianza, la transparencia y un compromiso absoluto con los objetivos de cada uno de nuestros clientes.
                            </p>

                            <div className="row g-3">
                                <div className="col-12 col-sm-6">
                                    <LiquidGlassCard className="mini-stat" strength="soft" interactive={false}>
                                        <span className="mini-stat-value">Trato Cercano</span>
                                        <span className="mini-stat-label">Atención personalizada</span>
                                    </LiquidGlassCard>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <LiquidGlassCard className="mini-stat" strength="soft" interactive={false}>
                                        <span className="mini-stat-value">Seguridad Jurídica</span>
                                        <span className="mini-stat-label">Procesos transparentes</span>
                                    </LiquidGlassCard>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="col-lg-6"
                            initial="hidden"
                            animate="visible"
                            variants={slideLeft}
                        >
                            <div className="media-frame lg lg--liquid">
                                <motion.img
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.6 }}
                                    src="/img/equipo.webp"
                                    alt="Equipo de trabajo de la inmobiliaria"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="page-strip">
                <motion.div
                    className="container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
                >
                    <motion.div variants={fadeUp} className="section-head">
                        <span className="section-badge">Filosofía</span>
                        <h2 className="section-title">Nuestros Pilares Fundamentales</h2>
                        <p className="section-subtitle">
                            Los valores y principios que orientan nuestra labor diaria e inspiran nuestra excelencia.
                        </p>
                    </motion.div>

                    <div className="row g-4">
                        {PILARES.map((pillar, idx) => (
                            <motion.div key={idx} className="col-md-4" variants={fadeUp}>
                                <LiquidGlassCard liquid className="feature-card">
                                    <div className="feature-card-body" style={{ paddingTop: '0.5rem' }}>
                                        <span className="feature-card-tag">{pillar.badge}</span>
                                        <h3 className="feature-card-title">{pillar.title}</h3>
                                        <p className="feature-card-text">{pillar.text}</p>
                                    </div>
                                </LiquidGlassCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section className="py-5">
                <div className="container py-lg-4">
                    <div className="row align-items-center g-5">
                        <motion.div
                            className="col-lg-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={slideRight}
                        >
                            <div className="media-frame lg lg--liquid">
                                <motion.img
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 0.6 }}
                                    src="/img/oficina.webp"
                                    alt="Oficinas de Bienes Raíces Horquetas de Sarapiquí"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            className="col-lg-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={slideLeft}
                        >
                            <span className="section-badge">Experiencia</span>
                            <h2 className="section-title">Respaldados por Años de Trayectoria</h2>
                            <p className="section-subtitle mb-3">
                                En <strong style={{ color: 'var(--color-heading)' }}>Bienes Raíces Horquetas de Sarapiquí</strong> entendemos que encontrar un hogar o espacio comercial es una decisión trascendental.
                            </p>
                            <p className="section-subtitle mb-4">
                                Por ello, hemos consolidado un equipo de profesionales apasionados del sector inmobiliario, orientados a brindar soluciones ágiles, cercanas y adaptadas a tus metas.
                            </p>

                            <div className="row g-3">
                                <div className="col-12 col-sm-6">
                                    <LiquidGlassCard className="mini-stat" strength="soft" interactive={false}>
                                        <span className="mini-stat-value">100%</span>
                                        <span className="mini-stat-label">Acompañamiento legal</span>
                                    </LiquidGlassCard>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <LiquidGlassCard className="mini-stat" strength="soft" interactive={false}>
                                        <span className="mini-stat-value">Asesoría</span>
                                        <span className="mini-stat-label">Integral y personalizada</span>
                                    </LiquidGlassCard>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}