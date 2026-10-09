import { useNavigate } from 'react-router-dom';

export default function PropertyHeader({ title }) {
    const navigate = useNavigate();

    return (
        <div className="mb-4 pt-2">
            <button
                onClick={() => navigate('/catalogo')}
                className="btn btn-link text-decoration-none text-body-secondary p-0 mb-3 d-inline-flex align-items-center"
                style={{ fontWeight: '500' }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Volver al catálogo
            </button>
            <h1 className="display-5 fw-bolder text-body m-0" style={{ letterSpacing: '-0.02em' }}>
                {title}
            </h1>
        </div>
    );
}