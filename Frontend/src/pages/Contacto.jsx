import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';

export default function Contacto() {
    const [form, setForm] = useState({
        nombre_cliente: '',
        email_cliente: '',
        telefono_cliente: '',
        mensaje: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.contacto.enviar({
                ...form,
                origen: 'general',
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <section className="page-hero">
                <div className="container">
                    <motion.div
                        className="section-head"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        <span className="section-badge">Atención Personalizada</span>
                        <h1 className="section-title">Ponte en Contacto</h1>
                        <p className="section-subtitle">
                            ¿Tienes alguna consulta o deseas agendar una visita? Escríbenos y un asesor inmobiliario te atenderá a la brevedad.
                        </p>
                    </motion.div>

                    <div className="row g-4 align-items-start">
                        <motion.div
                            className="col-lg-5"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="contact-info-card lg lg--soft">
                                <h2 className="contact-info-title">Horario de Atención</h2>
                                <ul className="contact-list">
                                    <li>
                                        <span className="contact-list-label">Lunes a Viernes</span>
                                        <span className="contact-list-value">8:00 AM - 5:00 PM</span>
                                    </li>
                                    <li>
                                        <span className="contact-list-label">Sábados</span>
                                        <span className="contact-list-value">8:00 AM - 12:00 PM</span>
                                    </li>
                                    <li>
                                        <span className="contact-list-label">Domingos</span>
                                        <span className="contact-list-value" style={{ color: 'var(--color-accent)' }}>
                                            Cerrado
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="contact-phone-card">
                                <h3 className="contact-phone-title">¿Prefieres atención directa?</h3>
                                <p className="contact-phone-text">
                                    Puedes comunicarte directamente a nuestra línea telefónica o visitarnos durante el horario comercial.
                                </p>
                                <div className="contact-phone-divider">
                                    <span className="contact-phone-label">Teléfono de contacto</span>
                                    <span className="contact-phone-number">+ (506) 8888-8888</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="col-lg-7"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <LiquidGlassPanel liquid className="contact-form">
                                <h2 className="contact-info-title">Envíanos un mensaje</h2>
                                <form onSubmit={handleSubmit} className="lg-form">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Nombre completo</label>
                                            <input
                                                type="text"
                                                placeholder="Tu nombre completo"
                                                className="form-control"
                                                required
                                                value={form.nombre_cliente}
                                                onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Correo electrónico</label>
                                            <input
                                                type="email"
                                                placeholder="correo@ejemplo.com"
                                                className="form-control"
                                                required
                                                value={form.email_cliente}
                                                onChange={(e) => setForm({ ...form, email_cliente: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Teléfono de contacto</label>
                                            <input
                                                type="text"
                                                placeholder="+(506) 8888-8888"
                                                className="form-control"
                                                value={form.telefono_cliente}
                                                onChange={(e) => setForm({ ...form, telefono_cliente: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Mensaje o propiedad de interés</label>
                                            <textarea
                                                rows="5"
                                                placeholder="Escribe tu mensaje aquí..."
                                                className="form-control"
                                                required
                                                value={form.mensaje}
                                                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-12 mt-4">
                                            <LiquidGlassButton
                                                type="submit"
                                                variant="primary"
                                                className="btn-submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Enviando...' : 'Enviar Consulta'}
                                            </LiquidGlassButton>
                                        </div>
                                    </div>
                                </form>
                            </LiquidGlassPanel>
                        </motion.div>
                    </div>
                </div>
            </section>
        </motion.main>
    );
}
