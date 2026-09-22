import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Nosotros from '@/pages/Nosotros';
import Servicios from '@/pages/Servicios';
import Contacto from '@/pages/Contacto';
import CatalogPage from '@/pages/CatalogPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import AdminLoginPage from '@/pages/Admin/AdminLoginPage';
import ResetPasswordPage from '@/pages/Admin/ResetPasswordPage';
import AdminDashboardPage from '@/pages/Admin/AdminDashboardPage';
import ProtectedRoute from '@/routes/ProtectedRoute';

export default function AppRoutes() {
    return (
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
        </Routes>
    );
}