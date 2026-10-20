import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import '@/assets/styles/admin.css';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('Token inválido o ausente.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await api.auth.resetPassword(token, password);
            setIsSuccess(true);
            toast.success('Contraseña actualizada correctamente. Redirigiendo...');
            setTimeout(() => navigate('/admin'), 3000);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-auth-wrap">
            <LiquidGlassPanel liquid className="admin-auth-card">
                <h2 className="admin-auth-title">Establecer Contraseña</h2>

                <form onSubmit={handleSubmit} className="lg-form">
                    <div className="mb-3">
                        <label className="form-label" htmlFor="reset-password">Nueva Contraseña</label>
                        <input
                            id="reset-password"
                            type="password"
                            required
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label" htmlFor="reset-confirm">Confirmar Contraseña</label>
                        <input
                            id="reset-confirm"
                            type="password"
                            required
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <LiquidGlassButton
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={loading || isSuccess}
                    >
                        {loading ? 'Guardando...' : 'Guardar Contraseña'}
                    </LiquidGlassButton>
                </form>
            </LiquidGlassPanel>
        </main>
    );
}