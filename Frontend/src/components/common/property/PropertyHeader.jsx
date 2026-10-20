import { useNavigate } from 'react-router-dom';

export default function PropertyHeader({ title }) {
    const navigate = useNavigate();

    return (
        <div className="prop-detail-header">
            <button
                type="button"
                onClick={() => navigate('/catalogo')}
                className="prop-back-link"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver al catálogo
            </button>

            <h1 className="prop-detail-title">{title}</h1>
        </div>
    );
}
