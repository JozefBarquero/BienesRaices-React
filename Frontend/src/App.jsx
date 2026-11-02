import { BrowserRouter } from 'react-router-dom';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ConsentProvider } from '@/context/ConsentContext';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmDialogProvider } from '@/components/ui/ConfirmDialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AppRoutes from '@/routes/AppRoutes';
import ConsentBanner from '@/components/ui/ConsentBanner/ConsentBanner';
import { LiquidGlassFilter } from '@/components/ui/LiquidGlass';

export default function App() {
    return (
        <BrowserRouter>
            <ConsentProvider>
                <CurrencyProvider>
                    <ToastProvider>
                        <ConfirmDialogProvider>
                            <LiquidGlassFilter />
                            <div className="d-flex flex-column min-vh-100">
                                <Header />
                                <AppRoutes />
                                <Footer />
                            </div>
                            <ConsentBanner />
                        </ConfirmDialogProvider>
                    </ToastProvider>
                </CurrencyProvider>
            </ConsentProvider>
        </BrowserRouter>
    );
}