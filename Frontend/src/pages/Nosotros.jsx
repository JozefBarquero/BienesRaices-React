import { motion } from 'framer-motion';

export default function Nosotros() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const slideRight = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    const slideLeft = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    return (
        <main>
            <section className="py-5 overflow-hidden">
                <div className="container py-lg-4">
                    <div className="row align-items-center g-5">
                        <motion.div 
                            className="col-lg-6"
                            initial="hidden"
                            animate="visible"
                            variants={slideRight}
                        >
                            <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                                Conócenos
                            </span>
                            <h1 className="display-5 fw-bold text-body-emphasis mb-4">
                                Nuestra Esencia y Trayectoria
                            </h1>
                            <p className="lead text-body-secondary mb-3">
                                En <strong className="text-body-emphasis">Bienes Raíces Horquetas de Sarapiquí</strong> nos apasiona conectar personas con espacios únicos.
                            </p>
                            <p className="text-body-secondary mb-4">
                                Más que comercializar propiedades, construimos relaciones duraderas basadas en la confianza, la transparencia y un compromiso absoluto con los objetivos de cada uno de nuestros clientes.
                            </p>
                            <div className="row g-3 pt-2">
                                <div className="col-12 col-sm-6">
                                    <motion.div whileHover={{ scale: 1.03 }} className="p-3 bg-body-tertiary rounded-3 border-start border-primary border-4 h-100">
                                        <span className="fw-bold fs-5 d-block text-body-emphasis mb-1">Trato Cercano</span>
                                        <small className="text-body-secondary d-block">Atención personalizada</small>
                                    </motion.div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <motion.div whileHover={{ scale: 1.03 }} className="p-3 bg-body-tertiary rounded-3 border-start border-primary border-4 h-100">
                                        <span className="fw-bold fs-5 d-block text-body-emphasis mb-1">Seguridad Jurídica</span>
                                        <small className="text-body-secondary d-block">Procesos transparentes</small>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div 
                            className="col-lg-6"
                            initial="hidden"
                            animate="visible"
                            variants={slideLeft}
                        >
                            <div className="ratio ratio-4x3 rounded-4 shadow overflow-hidden">
                                <motion.img 
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    src="/img/equipo.webp" 
                                    alt="Equipo de trabajo de la inmobiliaria" 
                                    className="w-100 h-100 object-fit-cover" 
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-body-tertiary">
                <motion.div 
                    className="container py-lg-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                >
                    <motion.div variants={fadeUp} className="text-center mx-auto mb-5" style={{ maxWidth: '650px' }}>
                        <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                            Filosofía
                        </span>
                        <h2 className="display-6 fw-bold text-body-emphasis">Nuestros Pilares Fundamentales</h2>
                        <p className="text-body-secondary fs-5 mt-2">
                            Los valores y principios que orientan nuestra labor diaria e inspiran nuestra excelencia.
                        </p>
                    </motion.div>

                    <div className="row g-4">
                        {[
                            { badge: "Propósito", title: "Misión", text: "Brindar asesoría inmobiliaria de excelencia, guiando de forma ética y transparente cada proceso de inversión o compra de vivienda." },
                            { badge: "Futuro", title: "Visión", text: "Consolidarnos como la agencia de bienes raíces referente a nivel regional y nacional gracias a nuestra innovación y calidad humana." },
                            { badge: "Garantía", title: "Compromiso", text: "Velar siempre por la seguridad jurídica y la satisfacción total de nuestros clientes antes, durante y después de cerrar cada trato." }
                        ].map((pillar, idx) => (
                            <motion.div key={idx} className="col-md-4" variants={fadeUp}>
                                <article className="card h-100 border-0 shadow-sm rounded-4 p-4">
                                    <div className="card-body p-0">
                                        <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold mb-3">{pillar.badge}</span>
                                        <h3 className="h4 fw-bold text-body-emphasis mb-3">{pillar.title}</h3>
                                        <p className="card-text text-body-secondary">{pillar.text}</p>
                                    </div>
                                </article>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section className="py-5 overflow-hidden">
                <div className="container py-lg-4">
                    <div className="row align-items-center g-5">
                        <motion.div 
                            className="col-lg-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideRight}
                        >
                            <div className="ratio ratio-4x3 rounded-4 shadow overflow-hidden">
                                <motion.img 
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    src="/img/oficina.webp" 
                                    alt="Oficinas de Bienes Raíces Horquetas de Sarapiquí" 
                                    className="w-100 h-100 object-fit-cover" 
                                />
                            </div>
                        </motion.div>
                        <motion.div 
                            className="col-lg-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideLeft}
                        >
                            <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                                Experiencia
                            </span>
                            <h2 className="display-6 fw-bold text-body-emphasis mb-4">
                                Respaldados por Años de Trayectoria
                            </h2>
                            <p className="lead text-body-secondary mb-3">
                                En <strong className="text-body-emphasis">Bienes Raíces Horquetas de Sarapiquí</strong> entendemos que encontrar un hogar o espacio comercial es una decisión trascendental.
                            </p>
                            <p className="text-body-secondary mb-4">
                                Por ello, hemos consolidado un equipo de profesionales apasionados del sector inmobiliario, orientados a brindar soluciones ágiles, cercanas y adaptadas a tus metas.
                            </p>
                            <div className="row g-3 pt-2">
                                <div className="col-12 col-sm-6">
                                    <motion.div whileHover={{ y: -5 }} className="p-3 bg-body-secondary bg-opacity-50 rounded-3 border-start border-primary border-4 h-100">
                                        <span className="fw-bold fs-4 d-block text-body-emphasis lh-1 mb-1">100%</span>
                                        <small className="text-body-secondary fw-medium">Acompañamiento legal</small>
                                    </motion.div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <motion.div whileHover={{ y: -5 }} className="p-3 bg-body-secondary bg-opacity-50 rounded-3 border-start border-primary border-4 h-100">
                                        <span className="fw-bold fs-4 d-block text-body-emphasis lh-1 mb-1">Asesoría</span>
                                        <small className="text-body-secondary fw-medium">Integral y personalizada</small>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}