import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
    <section className="mb-5">
        <h2 className="h4 fw-bold text-body-emphasis mb-3">{title}</h2>
        <div className="text-body-secondary" style={{ lineHeight: 1.7 }}>{children}</div>
    </section>
);

export default function Terminos() {
    return (
        <motion.main
            className="py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="container py-lg-4" style={{ maxWidth: '880px' }}>
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-5"
                >
                    <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                        Legal
                    </span>
                    <h1 className="display-5 fw-bold text-body-emphasis mb-3">Términos y Condiciones</h1>
                    <p className="text-body-secondary lead">
                        Última actualización: {new Date().toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </motion.div>

                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                    <Section title="1. Aceptación de los términos">
                        <p>
                            El acceso y uso del sitio web de <strong className="text-body-emphasis">Bienes Raíces Horquetas de Sarapiquí</strong>{' '}
                            implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. Si no está de acuerdo con ellos,
                            le solicitamos abstenerse de utilizar el sitio.
                        </p>
                    </Section>

                    <Section title="2. Descripción del servicio">
                        <p>
                            Este sitio tiene como finalidad la publicación, difusión y promoción de propiedades inmobiliarias disponibles
                            para venta o alquiler, así como la recepción de consultas de clientes interesados. La información mostrada es
                            de carácter informativo y no constituye una oferta vinculante en los términos del artículo 46 del Código de Comercio de Costa Rica.
                        </p>
                    </Section>

                    <Section title="3. Requisitos de uso">
                        <p>El usuario se compromete a:</p>
                        <ul>
                            <li>Proporcionar información veraz, exacta y actualizada en los formularios.</li>
                            <li>No utilizar el sitio para fines ilícitos, fraudulentos o contrarios al orden público.</li>
                            <li>No intentar acceder a áreas restringidas, alterar el funcionamiento del sitio ni interferir con su seguridad.</li>
                            <li>No reproducir, distribuir ni explotar comercialmente el contenido sin autorización previa y por escrito.</li>
                            <li>Ser mayor de edad y tener capacidad legal para contratar.</li>
                        </ul>
                    </Section>

                    <Section title="4. Propiedad intelectual">
                        <p>
                            Todos los contenidos del sitio —incluyendo textos, imágenes, logotipos, código fuente, diseño gráfico y bases de datos—
                            son propiedad de Bienes Raíces Horquetas de Sarapiquí o de terceros que han autorizado su uso. Están protegidos por la
                            Ley de Derechos de Autor y Derechos Conexos N.º 6683 de Costa Rica y por tratados internacionales aplicables.
                        </p>
                        <p>
                            El usuario no adquiere ningún derecho de propiedad intelectual por el simple uso del sitio. Los contenidos de
                            terceros (imágenes de Pexels, íconos de Simple Icons, carruseles de Swiper) se utilizan bajo sus respectivas licencias
                            y se atribuyen en el pie de página.
                        </p>
                    </Section>

                    <Section title="5. Publicaciones y veracidad de la información">
                        <p>
                            La información de las propiedades es proporcionada por los propietarios y verificada en la medida de lo posible
                            por nuestro equipo. No obstante, no garantizamos la exactitud total de precios, áreas, disponibilidad ni condiciones
                            legales de cada inmueble. El interesado debe realizar su propia debida diligencia antes de cualquier transacción.
                        </p>
                        <p>
                            Las imágenes son ilustrativas y pueden no reflejar exactamente el estado actual del inmueble. Los precios están sujetos
                            a cambio sin previo aviso y pueden variar según la moneda y el tipo de cambio vigente.
                        </p>
                    </Section>

                    <Section title="6. Limitación de responsabilidad">
                        <p>
                            En la máxima medida permitida por la ley, Bienes Raíces Horquetas de Sarapiquí no será responsable por:
                        </p>
                        <ul>
                            <li>Daños directos, indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso del sitio.</li>
                            <li>Interrupciones del servicio, errores técnicos, virus o accesos no autorizados ajenos a nuestro control razonable.</li>
                            <li>Decisiones tomadas por el usuario basándose exclusivamente en la información publicada.</li>
                            <li>Contenido de sitios de terceros enlazados desde nuestras páginas.</li>
                        </ul>
                    </Section>

                    <Section title="7. Enlaces a terceros">
                        <p>
                            El sitio puede contener enlaces a sitios externos (redes sociales, herramientas de mapas, proveedores de servicios).
                            No controlamos ni nos hacemos responsables por sus políticas de privacidad, contenido o prácticas. Le recomendamos
                            revisar los términos de cada sitio antes de interactuar con ellos.
                        </p>
                    </Section>

                    <Section title="8. Modificaciones">
                        <p>
                            Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones
                            entrarán en vigor desde su publicación en el sitio. El uso continuado del servicio después de una modificación
                            constituye aceptación de los nuevos términos.
                        </p>
                    </Section>

                    <Section title="9. Terminación">
                        <p>
                            Podemos suspender o cancelar el acceso al sitio, sin previo aviso, a cualquier usuario que incumpla estos términos
                            o realice actividades que puedan perjudicar a la empresa, a otros usuarios o a terceros.
                        </p>
                    </Section>

                    <Section title="10. Legislación aplicable y jurisdicción">
                        <p>
                            Estos términos se rigen por las leyes de la República de Costa Rica. Cualquier controversia derivada de su
                            interpretación o aplicación se someterá a la jurisdicción de los Tribunales de Justicia de San José, Costa Rica,
                            renunciando las partes a cualquier otro fuero que pudiera corresponderles.
                        </p>
                    </Section>

                    <Section title="11. Contacto">
                        <p>
                            Para consultas sobre estos términos puede escribirnos a{' '}
                            <a href="mailto:contacto@bienesraices.com" className="link-primary">contacto@bienesraices.com</a>.
                        </p>
                    </Section>
                </div>

                <div className="text-center mt-5">
                    <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </motion.main>
    );
}