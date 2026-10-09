import { PropertyAiSummary } from '@/components/common/PropertyAiSummary';

export default function PropertyLocation({ propiedad }) {
    if (!propiedad.latitud || !propiedad.longitud) return null;

    return (
        <div>
            <h4 className="fw-bolder mb-3 text-body">Ubicación y Entorno</h4>
            <div className="ratio ratio-21x9 rounded-4 shadow-sm overflow-hidden mb-4">
                <iframe
                    src={`https://maps.google.com/maps?q=${propiedad.latitud},${propiedad.longitud}&z=18&t=k&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa de ubicación"
                ></iframe>
            </div>
            <PropertyAiSummary
                propertyId={propiedad.id}
                lat={propiedad.latitud}
                lng={propiedad.longitud}
                type={propiedad.tipo_inmueble_texto}
                operation={propiedad.tipo_operacion}
            />
        </div>
    );
}