import { formatPrice } from '@/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';

export default function PropertyInfoCard({ propiedad }) {
    const { userCurrency, convertPrice } = useCurrency();
    const mostrarConversion = propiedad.moneda !== userCurrency;

    return (
        <div className="prop-info">
            <div className="prop-info-head">
                <span className="prop-info-op">{propiedad.tipo_operacion}</span>

                <p className="prop-info-price">
                    {formatPrice(propiedad.precio, propiedad.moneda)}
                </p>

                {mostrarConversion && (
                    <p className="prop-info-approx">
                        Aprox: {formatPrice(convertPrice(propiedad.precio, propiedad.moneda, userCurrency), userCurrency)}
                    </p>
                )}

                <span className="prop-info-price-tag">
                    Precio {propiedad.tipo_precio}
                </span>
            </div>

            <div>
                <h5 className="prop-info-title">Detalles</h5>

                <div className="prop-info-row">
                    <span className="prop-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </span>
                    <div className="prop-info-text">
                        <p className="prop-info-main">{propiedad.ubicacion}</p>
                        <p className="prop-info-sub">{propiedad.direccion_exacta}</p>
                    </div>
                </div>

                <div className="prop-info-row">
                    <span className="prop-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </span>
                    <div className="prop-info-text">
                        <p className="prop-info-main text-capitalize">{propiedad.tipo_inmueble_texto}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}