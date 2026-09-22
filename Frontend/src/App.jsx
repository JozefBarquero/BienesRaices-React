import { BrowserRouter as Router } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AppRoutes from '@/routes/AppRoutes';
import { CurrencyProvider } from '@/context/CurrencyContext';

export default function App() {
    return (
        <Router>
            <CurrencyProvider>
                <div className="d-flex flex-column min-vh-100">
                    <Header />
                    <main className="flex-grow-1">
                        <AppRoutes />
                    </main>
                    <Footer />
                </div>
            </CurrencyProvider>
        </Router>
    );
}