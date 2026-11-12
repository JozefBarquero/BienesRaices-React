export default function PropertyDescription({ description }) {
    if (!description) return null;

    return (
        <div style={{ maxWidth: '100%', minWidth: 0 }}>
            <h4 className="fw-bolder mb-3 text-body">Acerca de la propiedad</h4>
            <p
                className="text-body-secondary"
                style={{
                    whiteSpace: 'pre-line',
                    lineHeight: '1.8',
                    fontSize: '1.05rem',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                }}
            >
                {description}
            </p>
        </div>
    );
}