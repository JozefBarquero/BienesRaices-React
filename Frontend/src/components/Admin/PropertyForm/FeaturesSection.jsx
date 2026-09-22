import React from 'react';


export default function FeaturesSection({ formData, onChange }) {


    return (


        <div className="mb-4">

            <h4 className="fw-bold text-primary mb-3">Características Físicas</h4>


            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3">


                <div className="col">
                    <label className="form-label fw-semibold">Habitaciones:</label>
                    <input
                        type="number"
                        name="habitaciones"
                        value={formData.habitaciones || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>



                <div className="col">
                    <label className="form-label fw-semibold">Baños:</label>
                    <input
                        type="number"
                        step="0.5"
                        name="banos"
                        value={formData.banos || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>



                <div className="col">
                    <label className="form-label fw-semibold">Parqueos:</label>
                    <input
                        type="number"
                        name="estacionamientos"
                        value={formData.estacionamientos || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>



                <div className="col">
                    <label className="form-label fw-semibold">Área Const. (m²):</label>
                    <input
                        type="number"
                        step="0.01"
                        name="area_construida"
                        value={formData.area_construida || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>



                <div className="col">
                    <label className="form-label fw-semibold">Área Terreno (m²):</label>
                    <input
                        type="number"
                        step="0.01"
                        name="area_terreno"
                        value={formData.area_terreno || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>



            </div>


            
        </div>
    );
}