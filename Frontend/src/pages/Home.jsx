import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DisclaimerModal from '@/components/common/DisclaimerModal';

export default function Home() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <>
            <DisclaimerModal />
            <main>
                <section className="py-5 overflow-hidden">
                    <div className="container py-lg-4">
                        <div className="row align-items-center g-5">
                            <motion.div 
                                className="col-lg-6"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                                    Bienvenidos
                                </span>
                                <h1 className="display-5 fw-bold text-body-emphasis mb-4">
                                    Tu aliado de confianza en bienes raíces
                                </h1>
                                <p className="lead text-body-secondary mb-4">
                                    En <strong className="text-body-emphasis">Bienes Raíces Horquetas de Sarapiquí</strong>, nos apasiona conectar a cada cliente con el espacio idóneo para su hogar o proyecto.
                                </p>
                                <p className="text-body-secondary mb-4">
                                    Te brindamos un acompañamiento integral durante todo el proceso de compra, venta o alquiler, respaldado por una profunda asesoría y un trato personalizado.
                                </p>
                                <div className="d-flex flex-column flex-sm-row gap-3">
                                    <Link to="/contacto" className="btn btn-primary btn-lg px-4 rounded-pill fw-semibold shadow-sm">
                                        Contactar ahora
                                    </Link>
                                    <Link to="/catalogo" className="btn btn-outline-secondary btn-lg px-4 rounded-pill fw-semibold">
                                        Ver propiedades
                                    </Link>
                                </div>
                            </motion.div>
                            <motion.div 
                                className="col-lg-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="ratio ratio-4x3 rounded-4 shadow overflow-hidden">
                                    <motion.img 
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        src="/img/casa-jardin.webp" 
                                        alt="Propiedad destacada" 
                                        className="w-100 h-100 object-fit-cover" 
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-body-tertiary overflow-hidden">
                    <div className="container py-lg-4">
                        <div className="row align-items-center g-5">
                            <motion.div 
                                className="col-lg-6"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeUp}
                            >
                                <div className="ratio ratio-4x3 rounded-4 shadow overflow-hidden">
                                    <img 
                                        src="/img/vecindario.webp" 
                                        alt="Historia de la empresa" 
                                        className="w-100 h-100 object-fit-cover" 
                                    />
                                </div>
                            </motion.div>

                            <motion.div 
                                className="col-lg-6"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={{
                                    hidden: { opacity: 0, x: 50 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                                }}
                            >
                                <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                                    Sobre Nosotros
                                </span>
                                
                                <h2 className="display-6 fw-bold text-body-emphasis mb-4">
                                    Nuestra Historia
                                </h2>

                                <p className="lead text-body-secondary mb-3">
                                    Fundada con la visión de revolucionar el sector inmobiliario, 
                                    <strong className="text-body-emphasis"> Bienes Raíces Horquetas de Sarapiquí</strong> ha crecido hasta convertirse en un referente de confianza en la región.
                                </p>

                                <p className="text-body-secondary mb-4 fs-6">
                                    Nuestro recorrido inició con un propósito claro: hacer que la búsqueda del lugar ideal sea una experiencia transparente, ágil y sin estrés. Hoy nos enorgullece conectar a familias y emprendedores con sus futuros hogares y espacios comerciales.
                                </p>

                                <div className="row g-3 pt-2">
                                    <div className="col-12 col-sm-6">
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="p-3 bg-body rounded-3 border-start border-primary border-4 shadow-sm h-100"
                                        >
                                            <span className="fw-bold fs-4 d-block text-body-emphasis mb-1">+100</span>
                                            <small className="text-body-secondary d-block">Propiedades conectadas</small>
                                        </motion.div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="p-3 bg-body rounded-3 border-start border-primary border-4 shadow-sm h-100"
                                        >
                                            <span className="fw-bold fs-4 d-block text-body-emphasis mb-1">100%</span>
                                            <small className="text-body-secondary d-block">Asesoría transparente</small>
                                        </motion.div>
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
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="text-center mx-auto mb-5" style={{ maxWidth: '650px' }}>
                            <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                                Principios
                            </span>
                            <h2 className="display-6 fw-bold text-body-emphasis">Nuestros Valores</h2>
                            <p className="text-body-secondary fs-5 mt-2">
                                Pilares fundamentales que guían cada una de nuestras gestiones e interacciones.
                            </p>
                        </motion.div>

                        <div className="row g-4">
                            {[
                                { img: "handshake.webp", title: "Confianza", text: "Actuamos con total integridad para construir relaciones transparentes y sólidas a largo plazo con cada cliente." },
                                { img: "keys.webp", title: "Excelencia", text: "Buscamos la perfección en cada transacción, desde la valoración de la propiedad hasta la entrega de llaves." },
                                { img: "family.webp", title: "Empatía", text: "Comprendemos el valor emocional y financiero de cada inmueble, priorizando siempre tus necesidades reales." }
                            ].map((val, idx) => (
                                <motion.div key={idx} className="col-md-4" variants={fadeUp}>
                                    <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="ratio ratio-16x9">
                                            <motion.img 
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.4 }}
                                                src={`/img/${val.img}`} 
                                                alt={val.title} 
                                                className="w-100 h-100 object-fit-cover" 
                                            />
                                        </div>
                                        <div className="card-body p-4">
                                            <h3 className="h4 fw-bold card-title mb-3 text-body-emphasis">{val.title}</h3>
                                            <p className="card-text text-body-secondary">{val.text}</p>
                                        </div>
                                    </article>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <section className="py-5 bg-body-tertiary">
                    <motion.div 
                        className="container py-lg-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-5">
                            <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                                Trayectoria
                            </span>
                            <h2 className="display-6 fw-bold text-body-emphasis">Nuestro Impacto</h2>
                        </motion.div>
                        <div className="row g-4 text-center">
                            {[
                                { num: "500+", text: "Propiedades Vendidas" },
                                { num: "1000+", text: "Familias Satisfechas" },
                                { num: "15+", text: "Años de Experiencia" }
                            ].map((impact, idx) => (
                                <motion.div key={idx} className="col-md-4" variants={fadeUp}>
                                    <div className="p-4 bg-body rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center border border-light-subtle">
                                        <motion.span 
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: "spring", delay: 0.2 + (idx * 0.1) }}
                                            className="display-4 fw-bold text-primary mb-2"
                                        >
                                            {impact.num}
                                        </motion.span>
                                        <span className="fs-5 fw-semibold text-body-secondary">{impact.text}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <section className="py-5">
                    <motion.div 
                        className="container py-lg-4"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-primary bg-gradient text-white rounded-4 p-5 text-center shadow-lg">
                            <h2 className="display-6 fw-bold mb-3 text-white">¿Deseas encontrar tu propiedad ideal?</h2>
                            <p className="fs-5 opacity-90 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                                Ponte en contacto con nuestro equipo de asesores y da el primer paso hacia tu próximo hogar o inversión.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/contacto" className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow-sm">
                                    Solicitar asesoría
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>
            </main>
        </>
    );
}