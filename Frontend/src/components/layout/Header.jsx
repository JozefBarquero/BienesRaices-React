import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import '@/assets/styles/layout.css';

const NAV_LINKS = [
    { to: '/', label: 'Inicio' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
    const [isDark, setIsDark] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { userCurrency, setUserCurrency } = useCurrency();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setIsDark(savedTheme === 'dark');
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [navigate]);

    const toggleTheme = () => {
        const nextTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-bs-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="site-header">
            <div className="container">
                <div className="site-nav-inner">
                    <Link to="/" className="site-brand" onClick={closeMenu}>
                        <span className="site-brand-mark">
                            <img src="/ico/icon.svg" alt="" />
                        </span>
                        <span className="site-brand-text">
                            <span className="site-brand-eyebrow">Bienes Raíces</span>
                            <span className="site-brand-name">Las Horquetas de Sarapiquí</span>
                        </span>
                    </Link>

                    <nav className="site-nav-links" aria-label="Navegación principal">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="site-actions">
                        <select
                            className="site-currency"
                            value={userCurrency}
                            onChange={(e) => setUserCurrency(e.target.value)}
                            aria-label="Moneda"
                        >
                            <option value="CRC">CRC ₡</option>
                            <option value="USD">USD $</option>
                            <option value="EUR">EUR €</option>
                        </select>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="site-icon-btn"
                            aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
                        >
                            <img
                                src={isDark ? '/svg/light-mode-outline.svg' : '/svg/dark-mode-outline.svg'}
                                alt=""
                                width="18"
                                height="18"
                                className="icon-theme"
                            />
                        </button>

                        <button
                            type="button"
                            className="site-menu-btn"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-expanded={menuOpen}
                            aria-controls="site-mobile-menu"
                            aria-label="Alternar menú"
                        >
                            {menuOpen ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="4" y1="7" x2="20" y2="7" />
                                    <line x1="4" y1="12" x2="20" y2="12" />
                                    <line x1="4" y1="17" x2="20" y2="17" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div id="site-mobile-menu" className={`site-mobile${menuOpen ? ' open' : ''}`}>
                    <ul className="site-mobile-list">
                        {NAV_LINKS.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    end={link.to === '/'}
                                    onClick={closeMenu}
                                    className="site-mobile-link"
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
}