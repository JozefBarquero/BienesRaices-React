import { formatPrice } from '@/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';

export default function PropertyInfoCard({ propiedad }) {
    const { userCurrency, convertPrice, formatCurrency } = useCurrency();

    return (
        <div className="card border-0 shadow-sm p-4 mb-4 rounded-4">
            <div className="mb-4 pb-4 border-bottom border-secondary-subtle">
                <span className="badge bg-primary bg-opacity-10 text-primary text-capitalize px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-block">
                    {propiedad.tipo_operacion}
                </span>
                
                <div className="fs-1 fw-bolder text-body lh-1 mb-2">
                    {formatPrice(propiedad.precio, propiedad.moneda)}
                </div>

                {propiedad.moneda !== userCurrency && (
                    <div className="text-body-secondary fw-medium mb-2">
                        <small>
                            Aprox: {formatPrice(convertPrice(propiedad.precio, propiedad.moneda, userCurrency), userCurrency)}
                        </small>
                    </div>
                )}
                
                <span className="badge bg-body-secondary text-body text-capitalize px-3 py-2 rounded-pill fw-medium border border-secondary-subtle mt-2">
                    Precio {propiedad.tipo_precio}
                </span>
            </div>

            <div>
                <h5 className="fw-bold mb-3 text-body">Detalles</h5>
                <div className="d-flex mb-3">
                    <div className="me-3 text-primary mt-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                        <p className="mb-1 fw-semibold text-body">{propiedad.ubicacion}</p>
                        <p className="mb-0 text-body-secondary small">{propiedad.direccion_exacta}</p>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="me-3 text-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <div>
                        <p className="mb-0 fw-semibold text-body text-capitalize">{propiedad.tipo_inmueble_texto}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}