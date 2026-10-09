import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
    <section className="mb-5">
        <h2 className="h4 fw-bold text-body-emphasis mb-3">{title}</h2>
        <div className="text-body-secondary" style={{ lineHeight: 1.7 }}>{children}</div>
    </section>
);

export default function Privacidad() {
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
                    <h1 className="display-5 fw-bold text-body-emphasis mb-3">Política de Privacidad</h1>
                    <p className="text-body-secondary lead">
                        Última actualización: {new Date().toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </motion.div>

                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                    <Section title="1. Identidad del responsable">
                        <p>
                            El responsable del tratamiento de sus datos personales es{' '}
                            <strong className="text-body-emphasis">Bienes Raíces Horquetas de Sarapiquí</strong>,
                            con domicilio en Sarapiquí, Heredia, Costa Rica. Puede contactarnos a través del correo{' '}
                            <a href="mailto:contacto@bienesraices.com" className="link-primary">contacto@bienesraices.com</a>{' '}
                            o al teléfono <strong>+506 8888-8888</strong>.
                        </p>
                    </Section>

                    <Section title="2. Datos personales que recopilamos">
                        <p>Recopilamos únicamente los datos necesarios para las siguientes finalidades:</p>
                        <ul>
                            <li><strong className="text-body-emphasis">Formularios de contacto:</strong> nombre completo, correo electrónico, teléfono y el contenido del mensaje.</li>
                            <li><strong className="text-body-emphasis">Cuentas internas de trabajo:</strong> nombre, apellidos, cédula, correo corporativo, teléfono, dirección, cargo y fechas laborales.</li>
                            <li><strong className="text-body-emphasis">Datos de navegación:</strong> dirección IP, tipo de navegador, sistema operativo y páginas visitadas, recopilados a través de registros del servidor con finalidad de seguridad.</li>
                        </ul>
                    </Section>

                    <Section title="3. Finalidad del tratamiento">
                        <p>Sus datos se utilizan exclusivamente para:</p>
                        <ul>
                            <li>Atender consultas y solicitudes de información enviadas mediante los formularios.</li>
                            <li>Gestionar la relación laboral con trabajadores y colaboradores.</li>
                            <li>Administrar la publicación y el mantenimiento de propiedades listadas en el sitio.</li>
                            <li>Garantizar la seguridad del sitio, prevenir fraudes y abusos.</li>
                            <li>Cumplir con obligaciones legales aplicables en Costa Rica.</li>
                        </ul>
                        <p>No realizamos perfilado automatizado ni tomamos decisiones automatizadas con efectos legales sobre el usuario.</p>
                    </Section>

                    <Section title="4. Base legal">
                        <p>El tratamiento se fundamenta en:</p>
                        <ul>
                            <li><strong className="text-body-emphasis">Consentimiento:</strong> al enviar un formulario de contacto.</li>
                            <li><strong className="text-body-emphasis">Ejecución de un contrato:</strong> relación laboral o de servicios.</li>
                            <li><strong className="text-body-emphasis">Interés legítimo:</strong> seguridad del sitio y prevención de abusos.</li>
                            <li><strong className="text-body-emphasis">Obligación legal:</strong> cuando la normativa costarricense lo exija.</li>
                        </ul>
                    </Section>

                    <Section title="5. Conservación de datos">
                        <p>
                            Los datos de contacto se conservan durante <strong>24 meses</strong> desde su recepción, salvo que el usuario solicite
                            su supresión antes. Los datos laborales se conservan mientras dure la relación laboral y hasta <strong>5 años</strong> después
                            de su finalización, conforme a las obligaciones contables y fiscales costarricenses. Los registros del servidor se eliminan
                            automáticamente tras <strong>12 meses</strong>.
                        </p>
                    </Section>

                    <Section title="6. Destinatarios y transferencias internacionales">
                        <p>
                            Sus datos no son vendidos ni cedidos a terceros con fines comerciales. Únicamente podrán acceder a ellos:
                        </p>
                        <ul>
                            <li>Proveedores de infraestructura de hosting y correo electrónico, sujetos a contratos de encargado del tratamiento.</li>
                            <li>Autoridades públicas cuando exista requerimiento legal debidamente fundamentado.</li>
                        </ul>
                        <p>
                            Cuando un proveedor procese datos fuera del Espacio Económico Europeo o Costa Rica, se aplicarán
                            cláusulas contractuales tipo u otros mecanismos de transferencia reconocidos internacionalmente.
                        </p>
                    </Section>

                    <Section title="7. Derechos del usuario">
                        <p>Usted puede ejercer en cualquier momento los siguientes derechos:</p>
                        <ul>
                            <li><strong className="text-body-emphasis">Acceso:</strong> conocer qué datos tratamos sobre usted.</li>
                            <li><strong className="text-body-emphasis">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                            <li><strong className="text-body-emphasis">Supresión:</strong> solicitar la eliminación cuando ya no sean necesarios.</li>
                            <li><strong className="text-body-emphasis">Portabilidad:</strong> recibir sus datos en formato estructurado.</li>
                            <li><strong className="text-body-emphasis">Oposición y limitación:</strong> restringir el tratamiento en determinadas circunstancias.</li>
                            <li><strong className="text-body-emphasis">Retirar el consentimiento:</strong> sin que ello afecte la licitud previa.</li>
                        </ul>
                        <p>
                            Para ejercer estos derechos escriba a{' '}
                            <a href="mailto:contacto@bienesraices.com" className="link-primary">contacto@bienesraices.com</a>.
                            Responderemos en un plazo máximo de <strong>30 días naturales</strong>. También puede presentar una reclamación ante la
                            Agencia de Protección de Datos de los Habitantes (PRODHAB) de Costa Rica.
                        </p>
                    </Section>

                    <Section title="8. Cookies y tecnologías similares">
                        <p>
                            Este sitio utiliza cookies y almacenamiento local estrictamente necesarios para el funcionamiento
                            de la autenticación de usuarios internos (cookie <code>adminToken</code>, con atributos <code>HttpOnly</code>,{' '}
                            <code>Secure</code> y <code>SameSite</code>). Estas cookies están exentas de consentimiento por ser imprescindibles.
                        </p>
                        <p>
                            Puede gestionar sus preferencias sobre cookies no esenciales desde el enlace{' '}
                            <button
                                type="button"
                                className="btn btn-link p-0 align-baseline"
                                onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                            >
                                «Configurar cookies»
                            </button>{' '}
                            disponible en el pie de página.
                        </p>
                    </Section>

                    <Section title="9. Seguridad">
                        <p>
                            Aplicamos medidas técnicas y organizativas apropiadas para proteger sus datos: cifrado TLS en tránsito,
                            contraseñas hasheadas con bcrypt, limitación de tasa en endpoints sensibles, validación estricta de entradas
                            y control de acceso basado en roles. Ningún sistema es 100% infalible, por lo que le recomendamos no compartir
                            credenciales y mantener sus dispositivos actualizados.
                        </p>
                    </Section>

                    <Section title="10. Menores de edad">
                        <p>
                            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos conscientemente datos de menores.
                            Si detectamos que hemos recibido datos de un menor sin autorización parental, procederemos a su eliminación inmediata.
                        </p>
                    </Section>

                    <Section title="11. Cambios a esta política">
                        <p>
                            Podemos actualizar esta política para reflejar cambios legales, técnicos u operativos. La fecha de última
                            actualización aparece al inicio del documento. Los cambios sustanciales se comunicarán mediante un aviso destacado
                            en el sitio.
                        </p>
                    </Section>

                    <Section title="12. Contacto">
                        <p>
                            Para cualquier consulta relacionada con esta política puede escribirnos a{' '}
                            <a href="mailto:contacto@bienesraices.com" className="link-primary">contacto@bienesraices.com</a>{' '}
                            o visitarnos durante nuestro horario de atención.
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