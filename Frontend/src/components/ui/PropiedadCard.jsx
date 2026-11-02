import { memo } from 'react';
import { formatPrice } from '@/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';
import { LiquidGlassCard, LiquidGlassButton } from '@/components/ui/LiquidGlass';

const ESTADO_LABELS = {
    vendida: 'Vendida',
    alquilada: 'Alquilada',
};

const ESTADO_ICONS = {
    vendida: '✓',
    alquilada: '✓',
};

function PropiedadCard({ propiedad }) {
    const { userCurrency, convertPrice } = useCurrency();

    const convertedAmount = convertPrice(propiedad.precio, propiedad.moneda, userCurrency);
    const mostrarConversion =
        propiedad.moneda !== userCurrency &&
        convertedAmount !== null &&
        convertedAmount !== undefined;

    const estadoComercial = propiedad.estado_comercial;
    const mostrarEstadoComercial = estadoComercial && estadoComercial !== 'disponible';

    return (
        <LiquidGlassCard
            liquid
            className={`prop-card${mostrarEstadoComercial ? ' prop-card--closed' : ''}`}
            interactive
        >
            <div className="prop-card-img">
                {propiedad.destacada === 1 && !mostrarEstadoComercial && (
                    <span className="prop-card-badge">Destacada</span>
                )}
                {!mostrarEstadoComercial && propiedad.tipo_operacion && (
                    <span className="prop-card-type">{propiedad.tipo_operacion}</span>
                )}
                <img
                    src={propiedad.imagen}
                    alt={propiedad.titulo}
                    loading="lazy"
                    decoding="async"
                    className={mostrarEstadoComercial ? 'prop-card-img--dim' : ''}
                />
                {mostrarEstadoComercial && (
                    <div className={`prop-card-status-banner prop-card-status-banner--${estadoComercial}`}>
                        <span className="prop-card-status-banner-icon" aria-hidden="true">
                            {ESTADO_ICONS[estadoComercial] || '•'}
                        </span>
                        <span>{ESTADO_LABELS[estadoComercial] || estadoComercial}</span>
                    </div>
                )}
            </div>

            <div className="prop-card-body">
                <h3 className="prop-card-title" title={propiedad.titulo}>
                    {propiedad.titulo}
                </h3>

                <p className="prop-card-location" title={propiedad.ubicacion}>
                    {propiedad.ubicacion}
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

export default memo(PropiedadCard);