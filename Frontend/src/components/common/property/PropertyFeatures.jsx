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

        <div className="row g-3 mb-5 text-center">

            {features.map((f, index) => {
                const isLastAndOdd = index === features.length - 1 && features.length % 2 !== 0;
                const colClass = isLastAndOdd ? 'col-12 col-md' : 'col-6 col-md';



                return (
                    <div key={f.key} className={colClass}>
                        <div className="p-3 bg-body rounded-3 shadow-sm border">
                            <span className="d-block text-body-secondary small">{f.label}</span>
                            <strong className="fs-5">{f.value}</strong>
                        </div>
                    </div>
                );


            })}


        </div>
    );
}