export default function PropertyFeatures({ propiedad }) {
    const features = [
        { key: 'habitaciones', label: 'Habitaciones', value: propiedad.habitaciones },
        { key: 'banos', label: 'Baños', value: propiedad.banos },
        { key: 'estacionamientos', label: 'Parqueos', value: propiedad.estacionamientos },
        {
            key: 'area_construida',
            label: 'Construcción',
            value: propiedad.area_construida ? `${propiedad.area_construida} m²` : null,
        },
        {
            key: 'area_terreno',
            label: 'Terreno',
            value: propiedad.area_terreno ? `${propiedad.area_terreno} m²` : null,
        },
    ].filter((f) => f.value !== null && f.value !== undefined);

    if (features.length === 0) return null;

    return (
        <div className="prop-features">
            {features.map((f) => (
                <div key={f.key} className="prop-feature-cell">
                    <span className="prop-feature-label">{f.label}</span>
                    <span className="prop-feature-value">{f.value}</span>
                </div>
            ))}
        </div>
    );
}