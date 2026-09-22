import { useState, useEffect } from 'react';

export default function DisclaimerModal() {

    const [isVisible, setIsVisible] = useState(false);
    const [isShowing, setIsShowing] = useState(false);



    useEffect(() => {

        if (!localStorage.getItem("avisoMostrado")) {

            const timer1 = setTimeout(() => {

                setIsVisible(true);
                const timer2 = setTimeout(() => {
                    setIsShowing(true);
                }, 10);
                return () => clearTimeout(timer2);
            }, 500);


            return () => clearTimeout(timer1);

        }
    }, []);



    const handleClose = () => {

        setIsShowing(false);
        setTimeout(() => {
            setIsVisible(false);
        }, 400);
        localStorage.setItem("avisoMostrado", "true");


    };

    if (!isVisible) return null;


    return (

        <div 

            id="disclaimerModal" 
            className={`modal-overlay ${isShowing ? 'show' : ''}`}
        >


            <div className="modal-content">

                <div className="modal-icon-badge">


                    <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>


                </div>




                <h3 className="title-tertiary">Aviso Importante</h3>



                <p className="text-body">
                    Esta no es una empresa real. Es un proyecto académico desarrollado para el curso de <strong>Programación III</strong> de la <strong>Universidad Nacional (UNA)</strong>.
                </p>




                <button 
                    id="closeDisclaimer" 
                    className="modal-btn-primary"
                    onClick={handleClose}
                >
                    Entendido
                </button>


            </div>


        </div>
    );
}