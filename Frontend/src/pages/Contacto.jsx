import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';

export default function Contacto() {
    const [form, setForm] = useState({
        nombre_cliente: '',
        email_cliente: '',
        telefono_cliente: '',
        mensaje: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.contacto.enviar({
                ...form,
                origen: 'general'
            });
            toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
            setForm({ nombre_cliente: '', email_cliente: '', telefono_cliente: '', mensaje: '' });
        } catch (error) {
            toast.error(error.message || 'Error al enviar el mensaje.');
        } finally {
            setLoading(false);
        }
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
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="badge bg-primary-subtle text-primary-emphasis fw-semibold text-uppercase px-3 py-2 rounded-pill mb-3">
                        Atención Personalizada
                    </span>
                    <h1 className="display-5 fw-bold text-body-emphasis mb-3">
                        Ponte en Contacto
                    </h1>
                    <p className="lead text-body-secondary">
                        ¿Tienes alguna consulta o deseas agendar una visita? Escríbenos y un asesor inmobiliario te atenderá a la brevedad.
                    </p>
                </motion.div>

                <div className="row g-5 align-items-start">
                    <motion.div
                        className="col-lg-5"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="bg-body-tertiary p-4 p-md-5 rounded-4 border border-light-subtle shadow-sm mb-4">
                            <h2 className="h4 fw-bold text-body-emphasis mb-4">
                                Horario de Atención
                            </h2>

                            <ul className="list-unstyled mb-0">
                                <li className="d-flex justify-content-between py-2 border-bottom border-light-subtle">
                                    <span className="fw-semibold text-body-secondary">Lunes a Viernes:</span>
                                    <span className="text-body-emphasis fw-semibold">8:00 AM - 5:00 PM</span>
                                </li>
                                <li className="d-flex justify-content-between py-2 border-bottom border-light-subtle">
                                    <span className="fw-semibold text-body-secondary">Sábados:</span>
                                    <span className="text-body-emphasis fw-semibold">8:00 AM - 12:00 PM</span>
                                </li>
                                <li className="d-flex justify-content-between py-2 pt-3">
                                    <span className="fw-semibold text-body-secondary">Domingos:</span>
                                    <span className="badge bg-secondary-subtle text-secondary-emphasis px-3 py-2 rounded-pill">Cerrado</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 p-md-5 bg-body-tertiary text-white rounded-4 shadow-sm" style={{ backgroundColor: 'var(--bs-primary)' }}>
                            <h3 className="h4 fw-bold mb-3 text-white">¿Prefieres atención directa?</h3>
                            <p className="opacity-90 mb-4 text-white">
                                Puedes comunicarte directamente a nuestra línea telefónica o visitarnos durante el horario comercial.
                            </p>
                            <div className="border-start border-white border-3 ps-3">
                                <span className="d-block fw-semibold opacity-75 small text-uppercase text-white">Teléfono de contacto</span>
                                <span className="fs-5 fw-bold text-white">+ (506) 8888-8888</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="col-lg-7"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
                            <h2 className="h4 fw-bold text-body-emphasis mb-4">
                                Envíanos un mensaje
                            </h2>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-body-emphasis">Nombre completo:</label>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre completo"
                                        className="form-control form-control-lg rounded-3"
                                        required
                                        value={form.nombre_cliente}
                                        onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-body-emphasis">Correo electrónico:</label>
                                    <input
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        className="form-control form-control-lg rounded-3"
                                        required
                                        value={form.email_cliente}
                                        onChange={(e) => setForm({ ...form, email_cliente: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-body-emphasis">Teléfono de contacto:</label>
                                    <input
                                        type="text"
                                        placeholder="+(506) 8888-8888"
                                        className="form-control form-control-lg rounded-3"
                                        value={form.telefono_cliente}
                                        onChange={(e) => setForm({ ...form, telefono_cliente: e.target.value })}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold text-body-emphasis">Mensaje o propiedad de interés:</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Escribe tu mensaje aquí..."
                                        className="form-control form-control-lg rounded-3"
                                        required
                                        value={form.mensaje}
                                        onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="col-12 mt-4">
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary btn-lg w-100 py-3 fw-semibold rounded-pill shadow-sm"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {loading ? 'Enviando...' : 'Enviar Consulta'}
                                    </motion.button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </motion.main>
    );
}