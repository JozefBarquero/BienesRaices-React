import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
    <section className="mb-5">
        <h2 className="h4 fw-bold text-body-emphasis mb-3">{title}</h2>
        <div className="text-body-secondary" style={{ lineHeight: 1.7 }}>{children}</div>
    </section>
);

export default function PoliticaCookies() {
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
                    <h1 className="display-5 fw-bold text-body-emphasis mb-3">Política de Cookies</h1>
                    <p className="text-body-secondary lead">
                        Última actualización: {new Date().toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </motion.div>

                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                    <Section title="1. ¿Qué son las cookies?">
                        <p>
                            Las cookies y tecnologías similares (almacenamiento local, píxeles) son pequeños archivos que se descargan en tu dispositivo al acceder a nuestro sitio web. Permiten recordar información entre sesiones, garantizar la seguridad del sitio y medir su uso.
                        </p>
                    </Section>

                    <Section title="2. Base legal">
                        <p>
                            Esta política se rige por la Ley N.º 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales y su Reglamento. Costa Rica no cuenta con una norma específica sobre cookies, por lo que se aplican las disposiciones de la Ley 8968 a la información personal identificable que puedan recoger. Las cookies no estrictamente necesarias solo se instalan con tu consentimiento previo, libre, específico e informado, el cual puedes retirar en cualquier momento.
                        </p>
                    </Section>

                    <Section title="3. Tipos de cookies que utilizamos">
                        <p>Clasificamos las cookies en las siguientes categorías:</p>
                        <ul>
                            <li><strong className="text-body-emphasis">Estrictamente necesarias (técnicas):</strong> son imprescindibles para el funcionamiento del sitio. Incluyen la cookie de sesión de administración (<code>adminToken</code>) y las cookies de seguridad de Cloudflare. No requieren consentimiento.</li>
                            <li><strong className="text-body-emphasis">Preferencias:</strong> permiten recordar tu moneda seleccionada (CRC, USD, EUR) y tu preferencia de tema (claro/oscuro). Requieren consentimiento.</li>
                            <li><strong className="text-body-emphasis">Analíticas:</strong> nos ayudan a entender cómo los visitantes interactúan con el sitio (páginas visitadas, tiempo de permanencia) para mejorar su rendimiento. Requieren consentimiento.</li>
                            <li><strong className="text-body-emphasis">De terceros:</strong> pueden ser instaladas por servicios integrados como OpenStreetMap (mapas), Open-Meteo (datos meteorológicos), Exchange Rate API (tipos de cambio) o Gemini IA (asistente). Estas cookies son gestionadas por dichos terceros y requieren consentimiento.</li>
                        </ul>
                    </Section>

                    <Section title="4. Cookies de terceros y servicios integrados">
                        <p>Algunos servicios de terceros que utilizamos pueden instalar cookies propias:</p>
                        <ul>
                            <li><strong className="text-body-emphasis">OpenStreetMap / Leaflet:</strong> utilizados para mostrar la ubicación de las propiedades en mapas interactivos. Pueden establecer cookies técnicas para el funcionamiento del mapa.</li>
                            <li><strong className="text-body-emphasis">Open-Meteo:</strong> servicio de datos meteorológicos. No suele instalar cookies de seguimiento, pero puede hacer peticiones con tu dirección IP.</li>
                            <li><strong className="text-body-emphasis">Exchange Rate API:</strong> utilizado para la conversión de divisas. No instala cookies en tu navegador, pero procesa la solicitud desde nuestro servidor.</li>
                            <li><strong className="text-body-emphasis">Gemini IA (Google):</strong> el asistente de IA puede procesar el texto que le envías. No instala cookies directamente en tu navegador a través de nuestro sitio, pero el servicio es prestado por Google.</li>
                            <li><strong className="text-body-emphasis">Cloudflare:</strong> utilizado para la seguridad y el rendimiento del sitio. Puede instalar cookies estrictamente necesarias para la protección contra ataques.</li>
                        </ul>
                        <p>
                            Te recomendamos revisar las políticas de privacidad de estos terceros para obtener más información sobre cómo tratan tus datos.
                        </p>
                    </Section>

                    <Section title="5. ¿Cómo gestionar tus preferencias?">
                        <p>
                            Puedes aceptar todas las cookies, rechazar las no esenciales o configurarlas individualmente desde nuestro panel de consentimiento, que aparece al acceder al sitio por primera vez. También puedes cambiar tus preferencias en cualquier momento haciendo clic en el enlace «Configurar cookies» disponible en el pie de página.
                        </p>
                        <p>
                            Además, puedes gestionar o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que rechazar las cookies no esenciales no impide el uso de las funciones básicas del sitio.
                        </p>
                    </Section>

                    <Section title="6. Conservación">
                        <p>
                            Las cookies técnicas se conservan mientras dura la sesión o el tiempo necesario para su finalidad. Las cookies de preferencias se conservan hasta por 12 meses. Las cookies analíticas y de terceros se conservan según lo indicado por sus proveedores, y nunca más de 24 meses, salvo renovación de tu consentimiento.
                        </p>
                    </Section>

                    <Section title="7. Actualizaciones de esta política">
                        <p>
                            Podemos actualizar esta política para reflejar cambios técnicos o legales. La fecha de última actualización aparece al inicio del documento. Los cambios sustanciales se comunicarán mediante un aviso destacado en el sitio.
                        </p>
                    </Section>

                    <Section title="8. Contacto">
                        <p>
                            Para cualquier consulta sobre esta política, puedes escribirnos a{' '}
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