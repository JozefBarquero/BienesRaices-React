import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';

export default function PropertyContactForm({ propertyId }) {
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
                propiedad_id: propertyId,
                origen: 'propiedad'
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
        <div className="card border-0 shadow-sm p-4 rounded-4">
            <div className="text-center mb-4">
                <h4 className="fw-bolder text-body mb-2">¿Te interesa?</h4>
                <p className="text-body-secondary small m-0">Déjanos tus datos y un asesor se comunicará contigo pronto.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-12">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control rounded-3"
                                id="nombreInput"
                                placeholder="Tu Nombre Completo"
                                required
                                value={form.nombre_cliente}
                                onChange={(e) => setForm({ ...form, nombre_cliente: e.target.value })}
                            />
                            <label htmlFor="nombreInput" className="text-body-secondary">Nombre completo</label>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="form-floating">
                            <input
                                type="email"
                                className="form-control rounded-3"
                                id="correoInput"
                                placeholder="Tu Correo Electrónico"
                                required
                                value={form.email_cliente}
                                onChange={(e) => setForm({ ...form, email_cliente: e.target.value })}
                            />
                            <label htmlFor="correoInput" className="text-body-secondary">Correo electrónico</label>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control rounded-3"
                                id="telefonoInput"
                                placeholder="Tu Teléfono (Opcional)"
                                value={form.telefono_cliente}
                                onChange={(e) => setForm({ ...form, telefono_cliente: e.target.value })}
                            />
                            <label htmlFor="telefonoInput" className="text-body-secondary">Teléfono (Opcional)</label>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="form-floating">
                            <textarea
                                className="form-control rounded-3"
                                id="mensajeInput"
                                placeholder="Mensaje o consulta"
                                required
                                style={{ height: '100px' }}
                                value={form.mensaje}
                                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                            ></textarea>
                            <label htmlFor="mensajeInput" className="text-body-secondary">Mensaje o consulta</label>
                        </div>
                    </div>

                    <div className="col-12 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-100 py-3 rounded-3 fw-bold text-white shadow-sm transition-theme"
                        >
                            {loading ? (
                                <span className="d-flex align-items-center justify-content-center gap-2">
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                    Enviando...
                                </span>
                            ) : (
                                'Enviar mensaje'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}