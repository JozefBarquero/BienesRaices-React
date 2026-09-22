import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '@/services/api';

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await api.auth.verify();
                setIsAuth(true);
            } catch (error) {
                setIsAuth(false);
            }
        };
        verifyAuth();
    }, []);

    if (isAuth === null) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/admin" replace />;
    }

    return children;
} 