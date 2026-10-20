import React from 'react';

export default function FeaturesSection({ formData, onChange }) {
    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Características Físicas</h4>

            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3">
                <div className="col">
                    <label className="form-label" htmlFor="pf-habitaciones">Habitaciones</label>
                    <input
                        id="pf-habitaciones"
                        type="number"
                        name="habitaciones"
                        value={formData.habitaciones || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-banos">Baños</label>
                    <input
                        id="pf-banos"
                        type="number"
                        step="0.5"
                        name="banos"
                        value={formData.banos || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-parqueos">Parqueos</label>
                    <input
                        id="pf-parqueos"
                        type="number"
                        name="estacionamientos"
                        value={formData.estacionamientos || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-area-c">Área Const. (m²)</label>
                    <input
                        id="pf-area-c"
                        type="number"
                        step="0.01"
                        name="area_construida"
                        value={formData.area_construida || ''}
                        onChange={onChange}
                        className="form-control"
                    />
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-area-t">Área Terreno (m²)</label>
                    <input
                        id="pf-area-t"
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