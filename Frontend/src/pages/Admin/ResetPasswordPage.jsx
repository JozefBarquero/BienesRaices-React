import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError('Token inválido o ausente.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await api.auth.resetPassword(token, password);
            setSuccess('Contraseña actualizada correctamente. Redirigiendo...');
            setTimeout(() => navigate('/admin'), 3000);
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
                        <h2 className="h3 fw-bold text-primary text-center mb-4">Establecer Contraseña</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    className="form-control form-control-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    className="form-control form-control-lg"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

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
                                disabled={loading || success} 
                                className="btn btn-primary btn-lg w-100 fw-semibold py-3 shadow-sm"
                            >
                                {loading ? (
                                    <span className="d-flex align-items-center justify-content-center gap-2">
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        Guardando...
                                    </span>
                                ) : (
                                    'Guardar Contraseña'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}