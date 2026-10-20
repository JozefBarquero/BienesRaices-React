import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { LiquidGlassButton } from '@/components/ui/LiquidGlass';

export default function PropertyContactForm({ propertyId }) {
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
                propiedad_id: propertyId,
                origen: 'propiedad',
            });

            toast.success('¡Mensaje enviado! Nos comunicaremos contigo pronto.');
            setForm({ nombre_cliente: '', email_cliente: '', telefono_cliente: '', mensaje: '' });
        } catch (err) {
            toast.error(err.message || 'Error al enviar el mensaje.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="prop-contact-head">
                <h4 className="prop-contact-title">¿Te interesa?</h4>
                <p className="prop-contact-text">
                    Déjanos tus datos y un asesor se comunicará contigo pronto.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="lg-form">
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label" htmlFor="prop-nombre">Nombre completo</label>
                        <input
                            type="text"
                            id="prop-nombre"
                            className="form-control"
                            placeholder="Tu nombre completo"
                            required
                            value={form.nombre_cliente}
                            onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label" htmlFor="prop-email">Correo electrónico</label>
                        <input
                            type="email"
                            id="prop-email"
                            className="form-control"
                            placeholder="correo@ejemplo.com"
                            required
                            value={form.email_cliente}
                            onChange={(e) => setForm({ ...form, email_cliente: e.target.value })}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label" htmlFor="prop-telefono">
                            Teléfono <span style={{ color: 'var(--color-muted)', fontWeight: 500 }}>(opcional)</span>
                        </label>
                        <input
                            type="text"
                            id="prop-telefono"
                            className="form-control"
                            placeholder="+(506) 8888-8888"
                            value={form.telefono_cliente}
                            onChange={(e) => setForm({ ...form, telefono_cliente: e.target.value })}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label" htmlFor="prop-mensaje">Mensaje o consulta</label>
                        <textarea
                            id="prop-mensaje"
                            className="form-control"
                            placeholder="Escribe tu mensaje aquí..."
                            required
                            rows="4"
                            value={form.mensaje}
                            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                        />
                    </div>

                    <div className="col-12 mt-4">
                        <LiquidGlassButton
                            type="submit"
                            variant="primary"
                            className="prop-contact-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="d-inline-flex align-items-center gap-2">
                                    <span className="prop-contact-btn-spinner" aria-hidden="true" />
                                    Enviando...
                                </span>
                            ) : (
                                'Enviar mensaje'
                            )}
                        </LiquidGlassButton>
                    </div>
                </div>
            </form>
        </div>
    );
}