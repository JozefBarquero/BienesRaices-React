import React from 'react';



export default function DescriptionsSection({ formData, onChange }) {


    return (


        <div className="mb-4">

            <h4 className="fw-bold text-primary mb-3">Descripciones</h4>

            <div className="mb-3">

                <label className="form-label fw-semibold">Descripción corta:</label>
                <input
                    type="text"
                    name="descripcion_corta"
                    value={formData.descripcion_corta || ''}
                    onChange={onChange}
                    required
                    className="form-control"
                />

            </div>



            <div>

                <label className="form-label fw-semibold">Descripción detallada:</label>
                
                <textarea
                    name="descripcion_larga"
                    value={formData.descripcion_larga || ''}
                    onChange={onChange}
                    rows={4}
                    className="form-control"
                ></textarea>

            </div>
        </div>
    );
}