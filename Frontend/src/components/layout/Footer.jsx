import { Link } from 'react-router-dom';

export default function Footer() {

    return (


        <footer className="bg-body-tertiary text-body py-5 mt-auto border-top transition-theme">

            <div className="container">

                <div className="row gy-4 align-items-center">

                    <div className="col-lg-8 text-center text-lg-start">


                        <p className="small mb-2">
                            &copy; 2026 Bienes Raíces Horquetas de Sarapiquí. Expertos en Bienes Raíces. Todos los derechos reservados.
                        </p>
                        <p className="small text-body-secondary mb-1">
                            <strong className="text-body">Curso:</strong> Programación III | <strong className="text-body">Profesor:</strong> Enrique Gómez
                        </p>
                        <p className="small text-body-secondary mb-2">
                            <strong className="text-body">Integrantes:</strong> Jozéf Barquero - Fabricio Méndez
                        </p>
                        <p className="small text-body-secondary mb-0">
                            Agradecimientos a <a href="https://swiperjs.com/" target="_blank" rel="noopener noreferrer" className="link-primary text-decoration-underline">Swiper</a> por los carruseles, a <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer" className="link-primary text-decoration-underline">Pexels</a> por las imágenes y a <a href="https://github.com/simple-icons/simple-icons" target="_blank" rel="noopener noreferrer" className="link-primary text-decoration-underline">Simple Icons</a> por los íconos.
                        </p>


                    </div>

                    <div className="col-lg-4 text-center text-lg-end">


                        <div className="d-flex justify-content-center justify-content-lg-end gap-3">

                            <a href="#" className="btn btn-outline-secondary rounded-circle p-2 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <img src="/svg/facebook.svg" alt="Facebook" width="20" height="20" className="icon-theme" />
                            </a>
                            <a href="#" className="btn btn-outline-secondary rounded-circle p-2 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <img src="/svg/instagram.svg" alt="Instagram" width="20" height="20" className="icon-theme" />
                            </a>


                        </div>

                    </div>

                </div>

            </div>

            
        </footer>
    );
}