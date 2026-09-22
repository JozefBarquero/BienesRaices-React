import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useCurrency } from '@/context/CurrencyContext';

export default function Header() {


    
    const [isDark, setIsDark] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    


    const { userCurrency, setUserCurrency } = useCurrency();



    useEffect(() => {

        const savedTheme = localStorage.getItem('theme') || 'light';
        const isDarkMode = savedTheme === 'dark';
        setIsDark(isDarkMode);
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        setIsAuthenticated(api.auth.isAuthenticated());
    }, []);





    const toggleTheme = () => {

        const nextTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-bs-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);

    };




    const handleLogout = () => {


        api.auth.logout();
        setIsAuthenticated(false);
        navigate('/admin');
    };



    return (
        <header className="sticky-top shadow-sm">


            <nav className="navbar navbar-expand-lg bg-body-tertiary transition-theme">


                <div className="container">

        



                    <Link 
                        to="/" 
                        className="navbar-brand fw-bold text-primary text-truncate flex-shrink-1 me-2 my-0"
                        style={{ fontSize: 'clamp(0.95rem, 3.8vw, 1.25rem)' }}
                    >
                        Bienes Raíces Horquetas
                    </Link>




                    <div className="d-flex align-items-center gap-1 gap-sm-2 order-lg-last ms-auto flex-shrink-0">



                        <select 
                            className="form-select form-select-sm" 
                            style={{ width: 'auto', cursor: 'pointer', fontSize: '0.85rem' }}
                            value={userCurrency}
                            onChange={(e) => setUserCurrency(e.target.value)}
                            aria-label="Moneda"
                        >
                            <option value="CRC">CRC (₡)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>




                        <button 
                            onClick={toggleTheme} 
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center p-2 rounded-circle"
                            aria-label="Cambiar tema"
                        >
                            <img
                                src={isDark ? "/svg/light-mode-outline.svg" : "/svg/dark-mode-outline.svg"}
                                alt={isDark ? "Modo claro" : "Modo oscuro"}
                                width="18" 
                                height="18"
                                className="icon-theme"
                            />
                        </button>



                        <button 
                            className="navbar-toggler border-0 p-1" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarMain" 
                            aria-controls="navbarMain" 
                            aria-expanded="false" 
                            aria-label="Navegación principal"
                        >
                            <span className="navbar-toggler-icon"></span>


                        </button>


                    </div>





        
                    <div className="collapse navbar-collapse w-100" id="navbarMain">


                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fw-semibold align-items-lg-center pt-3 pt-lg-0 text-end">

                            <li className="nav-item">
                                <Link to="/" className="nav-link">Inicio</Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/nosotros" className="nav-link">Nosotros</Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/servicios" className="nav-link">Servicios</Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/catalogo" className="nav-link">Catálogo</Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/contacto" className="nav-link">Contacto</Link>
                            </li>


                        </ul>


                    </div>


                </div>
            </nav>


        </header>


    );
}