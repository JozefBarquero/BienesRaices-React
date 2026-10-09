export default function PropertyFeatures({ propiedad }) {
    const features = [
        { key: 'habitaciones', label: 'Habitaciones', value: propiedad.habitaciones },
        { key: 'banos', label: 'Baños', value: propiedad.banos },
        { key: 'estacionamientos', label: 'Parqueos', value: propiedad.estacionamientos },
        {
            key: 'area_construida',
            label: 'Construcción',
            value: propiedad.area_construida ? `${propiedad.area_construida} m²` : null
        },
        {
            key: 'area_terreno',
            label: 'Terreno',
            value: propiedad.area_terreno ? `${propiedad.area_terreno} m²` : null
        }
    ].filter((f) => f.value !== null && f.value !== undefined);

    if (features.length === 0) return null;

    return (
        <div className="card border-0 p-4 rounded-4 shadow-sm mb-4">
            <div className="row g-3">
                {features.map((f, index) => {
                    const isLastAndOdd = index === features.length - 1 && features.length % 2 !== 0;
                    const colClass = isLastAndOdd ? 'col-12 col-md' : 'col-6 col-md';

                    return (
                        <div key={f.key} className={colClass}>
                            <div className="p-3 rounded-4 border border-secondary-subtle text-center h-100 d-flex flex-column justify-content-center align-items-center">
                                <span className="d-block text-body-secondary fw-medium mb-1" style={{ fontSize: '0.85rem' }}>{f.label}</span>
                                <strong className="fs-4 text-body fw-bold">{f.value}</strong>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}