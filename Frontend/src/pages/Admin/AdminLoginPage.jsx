import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import BootstrapAdminForm from '@/components/Admin/AdminDashboard/BootstrapAdminForm';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import '@/assets/styles/admin.css';

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
            <div className="admin-loading justify-content-center">
                <span className="admin-spinner" aria-hidden="true" />
            </div>
        );
    }

    if (needsBootstrap) {
        return <BootstrapAdminForm onSuccess={handleBootstrapSuccess} />;
    }

    return (
        <main className="admin-auth-wrap">
            <LiquidGlassPanel liquid className="admin-auth-card">
                <h2 className="admin-auth-title">
                    {isForgotPassword ? 'Recuperar Contraseña' : 'Acceso Administrativo'}
                </h2>

                <form onSubmit={handleSubmit} className="lg-form">
                    <div className="mb-3">
                        <label className="form-label" htmlFor="login-email">Correo Electrónico</label>
                        <input
                            id="login-email"
                            type="email"
                            required
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {!isForgotPassword && (
                        <div className="mb-4">
                            <div className="admin-label-row">
                                <label className="form-label mb-0" htmlFor="login-password">Contraseña</label>
                                <button
                                    type="button"
                                    className="admin-link"
                                    onClick={() => setIsForgotPassword(true)}
                                >
                                    ¿Olvidó su contraseña?
                                </button>
                            </div>
                            <input
                                id="login-password"
                                type="password"
                                required
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <LiquidGlassButton
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : isForgotPassword ? 'Enviar Enlace' : 'Iniciar Sesión'}
                    </LiquidGlassButton>

                    {isForgotPassword && (
                        <div className="mt-3">
                            <LiquidGlassButton
                                variant="ghost"
                                className="w-100"
                                onClick={() => setIsForgotPassword(false)}
                            >
                                Volver al Login
                            </LiquidGlassButton>
                        </div>
                    )}
                </form>
            </LiquidGlassPanel>
        </main>
    );
}