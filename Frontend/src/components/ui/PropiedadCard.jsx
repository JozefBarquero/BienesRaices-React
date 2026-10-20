import { formatPrice } from '@/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';
import { LiquidGlassCard, LiquidGlassButton } from '@/components/ui/LiquidGlass';

export default function PropiedadCard({ propiedad }) {
    const { userCurrency, convertPrice } = useCurrency();

    const convertedAmount = convertPrice(propiedad.precio, propiedad.moneda, userCurrency);
    const mostrarConversion =
        propiedad.moneda !== userCurrency &&
        convertedAmount !== null &&
        convertedAmount !== undefined;

    return (
        <LiquidGlassCard liquid className="prop-card" interactive>
            <div className="prop-card-img">
                {propiedad.destacada === 1 && (
                    <span className="prop-card-badge">Destacada</span>
                )}
                {propiedad.tipo_operacion && (
                    <span className="prop-card-type">{propiedad.tipo_operacion}</span>
                )}
                <img src={propiedad.imagen} alt={propiedad.titulo} loading="lazy" />
            </div>

            <div className="prop-card-body">
                <h3 className="prop-card-title" title={propiedad.titulo}>
                    {propiedad.titulo}
                </h3>

                <p className="prop-card-location" title={propiedad.ubicacion_completa}>
                    {propiedad.ubicacion_completa}
                </p>

                <div className="prop-card-meta">
                    <span className="prop-card-chip">{propiedad.tipo_inmueble_texto}</span>
                </div>

                <div>
                    <p className="prop-card-price">
                        {formatPrice(propiedad.precio, propiedad.moneda)}
                    </p>
                    {mostrarConversion && (
                        <p className="prop-card-approx">
                            Aprox: {formatPrice(convertedAmount, userCurrency)}
                        </p>
                    )}
                </div>

                <div className="prop-card-cta">
                    <LiquidGlassButton variant="primary" to={`/catalogo/${propiedad.id}`}>
                        Ver Detalles
                    </LiquidGlassButton>
                </div>
            </div>
        </LiquidGlassCard>
    );
}
