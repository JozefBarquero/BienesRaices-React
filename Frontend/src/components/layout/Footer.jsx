import { Link } from 'react-router-dom';
import '@/assets/styles/layout.css';

export default function Footer() {
    const abrirCookies = (e) => {
        e.preventDefault();
        window.dispatchEvent(new Event('open-cookie-settings'));
    };

    return (
        <footer className="site-footer">
            <div className="container site-footer-inner">
                <div className="row gy-5">
                    <div className="col-lg-5">
                        <Link to="/" className="site-brand">
                            <span className="site-brand-mark">
                                <img src="/ico/icon.svg" alt="" />
                            </span>
                            <span className="site-brand-text">
                                <span className="site-brand-eyebrow">Bienes Raíces</span>
                                <span className="site-brand-name">Las Horquetas de Sarapiquí</span>
                            </span>
                        </Link>

                        <p className="site-footer-tagline">
                            Expertos en bienes raíces en Sarapiquí, Costa Rica. Compra, venta y alquiler con asesoría personalizada.
                        </p>

                        <div className="site-social">
                            <a href="#" aria-label="Facebook">
                                <img src="/svg/facebook.svg" alt="" />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <img src="/svg/instagram.svg" alt="" />
                            </a>
                        </div>
                    </div>

                    <div className="col-6 col-lg-3">
                        <h6 className="site-footer-title">Legal</h6>
                        <ul className="site-footer-links">
                            <li><Link to="/privacidad">Política de Privacidad</Link></li>
                            <li><Link to="/terminos">Términos y Condiciones</Link></li>
                            <li><a href="#" onClick={abrirCookies}>Configurar Cookies</a></li>
                        </ul>
                    </div>

                    <div className="col-6 col-lg-4">
                        <h6 className="site-footer-title">Proyecto Académico</h6>
                        <p className="site-footer-credits">
                            <strong>Curso:</strong> Programación III<br />
                            <strong>Profesor:</strong> Enrique Gómez<br />
                            <strong>Integrantes:</strong> Jozéf Barquero · Fabricio Méndez
                        </p>
                    </div>
                </div>

                <div className="site-footer-bottom">
                    <span>© 2026 Bienes Raíces Horquetas de Sarapiquí</span>
                    <span>
                        <span className="dot" aria-hidden="true"></span>
                        Agradecimientos a&nbsp;
                        <a href="https://swiperjs.com/" target="_blank" rel="noopener noreferrer">Swiper</a>,
                        <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer">Pexels</a> y
                        <a href="https://github.com/simple-icons/simple-icons" target="_blank" rel="noopener noreferrer">Simple Icons</a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
