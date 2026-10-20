import React from 'react';
import { formatPrice } from '@/utils/formatters';

export default function PricingSection({ formData, onChange }) {
    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Precio y Divisa</h4>

            <div className="row g-3">
                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-moneda">Moneda</label>
                    <select
                        id="pf-moneda"
                        name="moneda"
                        value={formData.moneda || 'USD'}
                        onChange={onChange}
                        className="form-select"
                    >
                        <option value="USD">Dólares (USD)</option>
                        <option value="CRC">Colones (CRC)</option>
                        <option value="EUR">Euros (EUR)</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-precio">
                        Precio <span style={{ color: 'var(--color-muted)', fontWeight: 500 }}>· {formatPrice(formData.precio, formData.moneda)}</span>
                    </label>
                    <input
                        id="pf-precio"
                        type="number"
                        step="0.01"
                        name="precio"
                        value={formData.precio || ''}
                        onChange={onChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-tipo-precio">Tipo de Precio</label>
                    <select
                        id="pf-tipo-precio"
                        name="tipo_precio"
                        value={formData.tipo_precio || 'fijo'}
                        onChange={onChange}
                        className="form-select"
                    >
                        <option value="fijo">Fijo</option>
                        <option value="negociable">Negociable</option>
                    </select>
                </div>
            </div>
        </div>
    );
}