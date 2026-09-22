import React from 'react';
import { formatPrice } from '@/utils/formatters';




export default function PricingSection({ formData, onChange }) {


    return (

        <div className="mb-4">

            <h4 className="fw-bold text-primary mb-3">Precio y Divisa</h4>


            <div className="row g-3">

                <div className="col-md-4">

                    <label className="form-label fw-semibold">Moneda:</label>
                    <select
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


                    <label className="form-label fw-semibold">Precio: </label>
                    <span> - {formatPrice(formData.precio, formData.moneda)}</span>
                    <input
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


                    <label className="form-label fw-semibold">Tipo de Precio:</label>
                    <select
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