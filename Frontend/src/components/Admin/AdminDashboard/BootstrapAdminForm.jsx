import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';

export default function BootstrapAdminForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }
        if (formData.password.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await api.auth.bootstrap({
                id: formData.id,
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                email: formData.email,
                password: formData.password
            });
            onSuccess();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center py-4 py-md-5">
                <div className="col-md-9 col-lg-7 col-xl-6">
                    <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
                        <div className="text-center mb-4">
                            <h2 className="h3 fw-bold mb-2">Configuración Inicial</h2>
                            <p className="text-muted mb-0">
                                No existen trabajadores registrados. Crea la primera cuenta de administrador.
                            </p>
                        </div>

                        <div className="alert alert-info small mb-4" role="alert">
                            Esta pantalla solo estará disponible mientras no exista ningún trabajador en el sistema.
                            Una vez creada la primera cuenta, el acceso a este formulario se deshabilitará automáticamente.
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Cédula</label>
                                    <input
                                        type="text"
                                        name="id"
                                        className="form-control"
                                        value={formData.id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form-control"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Apellidos</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        className="form-control"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary btn-lg w-100 fw-semibold py-3 shadow-sm"
                            >
                                {loading ? (
                                    <span className="d-flex align-items-center justify-content-center gap-2">
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        Creando cuenta...
                                    </span>
                                ) : (
                                    'Crear Cuenta de Administrador'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}