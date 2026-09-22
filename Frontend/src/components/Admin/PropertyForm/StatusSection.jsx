import React from 'react';

export default function StatusSection({ formData, onChange }) {


    return (


        <div className="d-flex flex-wrap gap-4 mb-4 p-3 bg-body-tertiary rounded-3 border">


            <div className="form-check form-switch mb-0">
                <input
                    type="checkbox"
                    name="activa"
                    id="activa"
                    checked={Boolean(formData.activa)}
                    onChange={onChange}
                    className="form-check-input"
                    role="switch"
                />
                <label className="form-check-label fw-semibold" htmlFor="activa">
                    Propiedad Activa
                </label>


            </div>



            <div className="form-check form-switch mb-0">


                <input
                    type="checkbox"
                    name="destacada"
                    id="destacada"
                    checked={Boolean(formData.destacada)}
                    onChange={onChange}
                    className="form-check-input"
                    role="switch"
                />
                <label className="form-check-label fw-semibold" htmlFor="destacada">
                    Destacar en Inicio
                </label>


            </div>

            
        </div>
    );
}