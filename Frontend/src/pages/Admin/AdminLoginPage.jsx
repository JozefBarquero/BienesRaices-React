import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import BootstrapAdminForm from '@/components/Admin/AdminDashboard/BootstrapAdminForm';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [needsBootstrap, setNeedsBootstrap] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const check = async () => {
            try {
                const data = await api.auth.needsBootstrap();
                setNeedsBootstrap(data.needsBootstrap);
            } catch {
                setNeedsBootstrap(false);
            }
        };
        if (!api.auth.isAuthenticated()) {
            check();
        } else {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isForgotPassword) {
                await api.auth.forgotPassword(email);
                toast.success('Se ha enviado un enlace de recuperación a su correo electrónico.');
                setIsForgotPassword(false);
            } else {
                await api.auth.login(email, password);
                toast.success('Sesión iniciada correctamente.');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBootstrapSuccess = () => {
        setNeedsBootstrap(false);
        toast.success('Cuenta creada. Ahora inicia sesión con tus credenciales.');
    };

    if (needsBootstrap === null) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (needsBootstrap) {
        return <BootstrapAdminForm onSuccess={handleBootstrapSuccess} />;
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center py-4 py-md-5">
                <div className="col-md-8 col-lg-5 col-xl-4">
                    <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
                        <h2 className="h3 fw-bold text-center mb-4">
                            {isForgotPassword ? 'Recuperar Contraseña' : 'Admin Login'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    className="form-control form-control-lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {!isForgotPassword && (
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="form-label fw-semibold mb-0">Contraseña</label>
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 text-decoration-none"
                                            onClick={() => setIsForgotPassword(true)}
                                        >
                                            ¿Olvidó su contraseña?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="form-control form-control-lg mt-2"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary btn-lg w-100 fw-semibold py-3 shadow-sm mb-3"
                            >
                                {loading ? (
                                    <span className="d-flex align-items-center justify-content-center gap-2">
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        Procesando...
                                    </span>
                                ) : (
                                    isForgotPassword ? 'Enviar Enlace' : 'Iniciar Sesión'
                                )}
                            </button>

                            {isForgotPassword && (
                                <button
                                    type="button"
                                    className="btn btn-light btn-lg w-100 fw-semibold py-3 shadow-sm"
                                    onClick={() => setIsForgotPassword(false)}
                                >
                                    Volver al Login
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}