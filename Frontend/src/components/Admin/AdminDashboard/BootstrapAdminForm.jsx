import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';

export default function BootstrapAdminForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: '',
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
                password: formData.password,
            });
            onSuccess();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-auth-wrap">
            <LiquidGlassPanel liquid className="admin-auth-card admin-auth-card--wide">
                <h2 className="admin-auth-title">Configuración Inicial</h2>
                <p className="admin-auth-subtitle">
                    No existen trabajadores registrados. Crea la primera cuenta de administrador.
                </p>

                <div className="admin-alert admin-alert--info">
                    Esta pantalla solo estará disponible mientras no exista ningún trabajador en el sistema.
                    Una vez creada la primera cuenta, el acceso a este formulario se deshabilitará automáticamente.
                </div>

                <form onSubmit={handleSubmit} className="lg-form mt-3">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="bs-id">Cédula</label>
                            <input
                                id="bs-id"
                                type="text"
                                name="id"
                                className="form-control"
                                value={formData.id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="bs-email">Correo Electrónico</label>
                            <input
                                id="bs-email"
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="bs-nombre">Nombre</label>
                            <input
                                id="bs-nombre"
                                type="text"
                                name="nombre"
                                className="form-control"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="bs-apellidos">Apellidos</label>
                            <input
                                id="bs-apellidos"
                                type="text"
                                name="apellidos"
                                className="form-control"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="bs-password">Contraseña</label>
                            <input
                                id="bs-password"
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
                            <label className="form-label" htmlFor="bs-confirm">Confirmar Contraseña</label>
                            <input
                                id="bs-confirm"
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

                    <LiquidGlassButton
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta de Administrador'}
                    </LiquidGlassButton>
                </form>
            </LiquidGlassPanel>
        </main>
    );
}