import { BrowserRouter } from 'react-router-dom';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmDialogProvider } from '@/components/ui/ConfirmDialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
    return (
        <BrowserRouter>
            <CurrencyProvider>
                <ToastProvider>
                    <ConfirmDialogProvider>
                        <div className="d-flex flex-column min-vh-100">
                            <Header />
                            <AppRoutes />
                            <Footer />
                        </div>
                    </ConfirmDialogProvider>
                </ToastProvider>
            </CurrencyProvider>
        </BrowserRouter>
    );
}