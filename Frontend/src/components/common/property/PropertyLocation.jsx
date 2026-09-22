import { PropertyAiSummary } from '@/components/common/PropertyAiSummary';




export default function PropertyLocation({ propiedad }) {


    if (!propiedad.latitud || !propiedad.longitud) return null;



    return (


        <div className="mb-5">

            <h3 className="fw-bold mb-3">Ubicación y Entorno</h3>

            <div className="ratio ratio-21x9 rounded-4 shadow-sm overflow-hidden mb-4">

                <iframe
                    src={`https://maps.google.com/maps?q=${propiedad.latitud},${propiedad.longitud}&z=15&t=k&output=embed`}
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