import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (api.auth.isAuthenticated()) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            if (isForgotPassword) {
                await api.auth.forgotPassword(email);
                setSuccess('Se ha enviado un enlace de recuperación a su correo electrónico.');
                setIsForgotPassword(false);
            } else {
                await api.auth.login(email, password);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center py-4 py-md-5">
                <div className="col-md-8 col-lg-5 col-xl-4">
                    <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
                        <h2 className="h3 fw-bold text-primary text-center mb-4">
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
                                            onClick={() => {
                                                setIsForgotPassword(true);
                                                setError('');
                                                setSuccess('');
                                            }}
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

                            {error && (
                                <div className="alert alert-danger text-center py-2 mb-4" role="alert">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success text-center py-2 mb-4" role="alert">
                                    {success}
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
                                    onClick={() => {
                                        setIsForgotPassword(false);
                                        setError('');
                                        setSuccess('');
                                    }}
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