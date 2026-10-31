import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import ProtectedRoute from '@/routes/ProtectedRoute';

const Nosotros = lazy(() => import('@/pages/Nosotros'));
const Servicios = lazy(() => import('@/pages/Servicios'));
const Contacto = lazy(() => import('@/pages/Contacto'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage'));
const AdminLoginPage = lazy(() => import('@/pages/Admin/AdminLoginPage'));
const ResetPasswordPage = lazy(() => import('@/pages/Admin/ResetPasswordPage'));
const AdminDashboardPage = lazy(() => import('@/pages/Admin/AdminDashboardPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Privacidad = lazy(() => import('@/pages/Privacidad'));
const Terminos = lazy(() => import('@/pages/Terminos'));

function RouteFallback() {
    return (
        <div className="catalog-loading" role="status" aria-label="Cargando">
            <span className="catalog-spinner" aria-hidden="true" />
            <span>Cargando...</span>
        </div>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<RouteFallback />}>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/contacto" element={<Contacto />} />

                <Route path="/catalogo" element={<CatalogPage />} />
                <Route path="/catalogo/:id" element={<PropertyDetailPage />} />

                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />

                <Route path="/privacidad" element={<Privacidad />} />
                <Route path="/terminos" element={<Terminos />} />
            </Routes>
        </Suspense>
    );
}