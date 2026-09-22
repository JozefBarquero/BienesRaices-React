import { useState } from 'react';
import { api } from '@/services/api';

export default function Contacto() {
    const [form, setForm] = useState({ nombre: '', correo: '', telefono_cliente: '', mensaje: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando...');
        try {
            await api.contacto.enviar({
                ...form,
                tipo_consulta: 'general'
            });
            setStatus('¡Mensaje enviado con éxito!');
            setForm({ nombre: '', correo: '', telefono_cliente: '', mensaje: '' });
        } catch (error) {
            setStatus('Error al enviar el mensaje.');
        }
    };

    return (
        <main className="py-5">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h1 className="display-5 fw-bold text-primary text-center mb-3">Contáctanos</h1>
                        <p className="lead text-body-secondary text-center mb-2">
                            ¿Tienes alguna consulta o deseas agendar una visita a una propiedad?
                        </p>
                        <p className="text-body-secondary text-center mb-5">
                            Escríbenos y un asesor se comunicará contigo lo antes posible.
                        </p>

                        <form className="card border-0 shadow-sm p-4 p-md-5 rounded-4" onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Nombre completo:</label>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre completo"
                                        className="form-control form-control-lg"
                                        required
                                        value={form.nombre}
                                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Correo electrónico:</label>
                                    <input
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        className="form-control form-control-lg"
                                        required
                                        value={form.correo}
                                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Teléfono de contacto:</label>
                                    <input
                                        type="text"
                                        placeholder="+(506) 8888-8888"
                                        className="form-control form-control-lg"
                                        value={form.telefono_cliente}
                                        onChange={(e) => setForm({ ...form, telefono_cliente: e.target.value })}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Mensaje o propiedad de interés:</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Escribe tu mensaje aquí..."
                                        className="form-control form-control-lg"
                                        required
                                        value={form.mensaje}
                                        onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="col-12 mt-4">
                                    <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-semibold shadow-sm">
                                        Enviar Consulta
                                    </button>
                                </div>
                            </div>

                            {status && (
                                <div className="alert alert-info text-center mt-4 mb-0" role="alert">
                                    {status}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}