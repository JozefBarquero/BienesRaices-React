import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';

export default function PropiedadCard({ propiedad }) {

    const { userCurrency, convertPrice } = useCurrency();

    
    const convertedAmount = convertPrice(propiedad.precio, propiedad.moneda, userCurrency);


    return (

        <div className="card h-100 border-0 shadow-sm overflow-hidden rounded-4">

            <div className="position-relative aspect-landscape">

                {propiedad.destacada === 1 && (

                    <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 shadow-sm fw-bold">
                        Destacada
                    </span>
                )}


                <img src={propiedad.imagen} alt={propiedad.titulo} className="img-cover" />


            </div>




            <div className="card-body p-4 d-flex flex-column">



                <h3 className="h5 card-title fw-bold text-truncate mb-1" title={propiedad.titulo}>
                    {propiedad.titulo}
                </h3>


                
                <p className="card-text text-body-secondary small mb-3 text-truncate">
                    {propiedad.ubicacion_completa}
                </p>



                <div className="d-flex justify-content-between align-items-center mb-3">


                    <span className="badge bg-body-secondary text-body border">
                        {propiedad.tipo_inmueble_texto}
                    </span>

                    <span className="fw-semibold text-primary text-capitalize">
                        {propiedad.tipo_operacion}
                    </span>


                </div>



                <div className="mb-3">


                    <div className="fs-4 fw-bold text-primary">
                        {formatPrice(propiedad.precio, propiedad.moneda)}
                    </div>


                    {propiedad.moneda !== userCurrency && convertedAmount !== null && (


                        <div className="text-body-secondary small">
                            Aprox: {formatPrice(convertedAmount, userCurrency)}
                        </div>

                    )}


                </div>

                <div className="mt-auto">

                    <Link to={`/catalogo/${propiedad.id}`} className="btn btn-primary w-100 fw-semibold">
                        Ver Detalles
                    </Link>


                </div>


            </div>

        </div>

        
    );
}