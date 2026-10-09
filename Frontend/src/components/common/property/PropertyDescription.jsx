export default function PropertyDescription({ description }) {
    if (!description) return null;

    return (
        <div>
            <h4 className="fw-bolder mb-3 text-body">Acerca de la propiedad</h4>
            <p className="text-body-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1.05rem' }}>
                {description}
            </p>
        </div>
    );
}