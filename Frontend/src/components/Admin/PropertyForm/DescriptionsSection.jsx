import React from 'react';

export default function DescriptionsSection({ formData, onChange }) {
    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Descripciones</h4>

            <div className="mb-3">
                <label className="form-label" htmlFor="pf-desc-corta">Descripción corta</label>
                <input
                    id="pf-desc-corta"
                    type="text"
                    name="descripcion_corta"
                    value={formData.descripcion_corta || ''}
                    onChange={onChange}
                    required
                    className="form-control"
                />
            </div>

            <div>
                <label className="form-label" htmlFor="pf-desc-larga">Descripción detallada</label>
                <textarea
                    id="pf-desc-larga"
                    name="descripcion_larga"
                    value={formData.descripcion_larga || ''}
                    onChange={onChange}
                    rows={4}
                    className="form-control"
                />
            </div>
        </div>
    );
}