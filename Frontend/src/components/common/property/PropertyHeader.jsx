import { useNavigate } from 'react-router-dom';

export default function PropertyHeader({ title }) {


    const navigate = useNavigate();



    return (


        <>


            <button

                onClick={() => navigate('/catalogo')}
                className="btn btn-outline-secondary mb-4"

            >

                &larr; Volver al catálogo
            </button>


            <h1 className="display-5 fw-bold text-primary mb-4">{title}</h1>

            
        </>


    );
}