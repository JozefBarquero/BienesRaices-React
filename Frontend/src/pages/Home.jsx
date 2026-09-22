import { Link } from 'react-router-dom';
import DisclaimerModal from '@/components/common/DisclaimerModal';

export default function Home() {
    return (
        <>
            <DisclaimerModal />
            <main>
                <section className="py-5">
                    <div className="container py-4">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-6">
                                <h1 className="display-5 fw-bold text-primary mb-3">Sobre Nosotros</h1>
                                <p className="lead text-body-secondary mb-0">
                                    En Bienes Raíces Horquetas de Sarapiquí, somos especialistas en encontrar la propiedad de tus sueños. Te acompañamos en cada etapa de la compra, venta o alquiler con profesionalismo, dedicación y un profundo conocimiento del mercado inmobiliario actual.
                                </p>
                            </div>
                            <div className="col-lg-6">
                                <div className="aspect-landscape rounded-4 shadow-sm">
                                    <img src="/img/casa-jardin.webp" alt="Propiedad destacada" className="img-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-body-tertiary">
                    <div className="container py-4">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 text-center">
                                <h2 className="fw-bold mb-3">Nuestra Historia</h2>
                                <p className="text-body-secondary fs-5 mb-4">
                                    Fundada con la visión de revolucionar el sector de bienes raíces, Bienes Raíces Horquetas de Sarapiquí ha crecido hasta convertirse en un referente de confianza. Nuestro recorrido inició con el propósito de hacer que la búsqueda del lugar ideal sea una experiencia transparente y sin estrés. Hoy, conectamos a miles de personas con sus futuros hogares y espacios comerciales.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <div className="aspect-landscape rounded-4 shadow-sm">
                                    <img src="/img/vecindario.webp" alt="Historia de la empresa" className="img-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5">
                    <div className="container py-4">
                        <h2 className="fw-bold text-center mb-5">Nuestros Valores</h2>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <article className="card h-100 border-0 shadow-sm overflow-hidden">
                                    <div className="aspect-landscape">
                                        <img src="/img/handshake.webp" alt="Confianza" className="img-cover" />
                                    </div>
                                    <div className="card-body p-4">
                                        <h3 className="h4 fw-bold card-title mb-2">Confianza</h3>
                                        <p className="card-text text-body-secondary">
                                            Actuamos con total integridad para construir relaciones a largo plazo con cada persona que busca su nuevo hogar o local.
                                        </p>
                                    </div>
                                </article>
                            </div>

                            <div className="col-md-4">
                                <article className="card h-100 border-0 shadow-sm overflow-hidden">
                                    <div className="aspect-landscape">
                                        <img src="/img/keys.webp" alt="Excelencia" className="img-cover" />
                                    </div>
                                    <div className="card-body p-4">
                                        <h3 className="h4 fw-bold card-title mb-2">Excelencia</h3>
                                        <p className="card-text text-body-secondary">
                                            Buscamos la perfección en cada transacción, desde la valoración inicial de la propiedad hasta la entrega de las llaves.
                                        </p>
                                    </div>
                                </article>
                            </div>

                            <div className="col-md-4">
                                <article className="card h-100 border-0 shadow-sm overflow-hidden">
                                    <div className="aspect-landscape">
                                        <img src="/img/family.webp" alt="Empatía" className="img-cover" />
                                    </div>
                                    <div className="card-body p-4">
                                        <h3 className="h4 fw-bold card-title mb-2">Empatía</h3>
                                        <p className="card-text text-body-secondary">
                                            Comprendemos que comprar o vender una propiedad es una decisión importante; por ello, escuchamos y priorizamos tus necesidades reales.
                                        </p>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-body-tertiary">
                    <div className="container py-4 text-center">
                        <h2 className="fw-bold mb-5">Nuestro Impacto</h2>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="p-4 bg-body rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
                                    <span className="display-4 fw-bold text-primary mb-2">500+</span>
                                    <span className="fs-5 fw-semibold text-body-secondary">Propiedades Vendidas</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-4 bg-body rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
                                    <span className="display-4 fw-bold text-primary mb-2">1000+</span>
                                    <span className="fs-5 fw-semibold text-body-secondary">Familias Satisfechas</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-4 bg-body rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
                                    <span className="display-4 fw-bold text-primary mb-2">15+</span>
                                    <span className="fs-5 fw-semibold text-body-secondary">Años de Experiencia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-primary text-white text-center">
                    <div className="container py-4">
                        <h2 className="display-6 fw-bold mb-4">¿Desea encontrar su propiedad ideal?</h2>
                        <Link to="/contacto" className="btn btn-warning btn-lg px-4 py-2 fw-semibold shadow-sm">
                            Solicitar asesoría
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}