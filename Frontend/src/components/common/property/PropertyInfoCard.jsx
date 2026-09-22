import { formatPrice } from '@/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';




export default function PropertyInfoCard({ propiedad }) {



    const { userCurrency, convertPrice, formatCurrency } = useCurrency();



    return (


        <div className="card border-0 shadow-sm p-4 mb-4 bg-body-tertiary rounded-4">

            <div className="row g-3 align-items-center">


                <div className="col-md-8">
                    <p className="mb-1"><strong>Ubicación:</strong> {propiedad.ubicacion}</p>
                    <p className="mb-1"><strong>Dirección Exacta:</strong> {propiedad.direccion_exacta}</p>
                    <p className="mb-1"><strong>Tipo:</strong> {propiedad.tipo_inmueble_texto}</p>
                    <p className="mb-0 text-capitalize">
                        <strong>Operación:</strong> {propiedad.tipo_operacion}
                    </p>
                </div>



                <div className="col-md-4 text-md-end">


                    <div className="fs-2 fw-bold text-primary">
                        {formatPrice(propiedad.precio, propiedad.moneda)}
                    </div>




                    {propiedad.moneda !== userCurrency && (



                        <div className="text-body-secondary mt-1">


                            <small>
                                Aprox:{' '}
                                {formatPrice(
                                    convertPrice(propiedad.precio, propiedad.moneda, userCurrency),
                                    userCurrency
                                )}
                                <span
                                    className="ms-1"
                                    title="Estimación según tipo de cambio actual. Puede variar."
                                    style={{ cursor: 'help' }}
                                >
                                    ⓘ
                                </span>
                            </small>


                        </div>



                    )}


                    <span className="badge bg-secondary text-capitalize fs-6 mt-2">


                        Precio {propiedad.tipo_precio}
                    </span>


                    
                </div>
            </div>
        </div>
    );
}