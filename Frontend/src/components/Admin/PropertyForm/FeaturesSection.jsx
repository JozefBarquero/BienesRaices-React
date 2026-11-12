import React from 'react';

const preventInvalidKey = (e) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
        e.preventDefault();
    }
};

export default function FeaturesSection({ formData, onChange }) {
    const areaConstruida = Number(formData.area_construida);
    const areaTerreno = Number(formData.area_terreno);
    const areaExcedida =
        formData.area_construida !== '' &&
        formData.area_terreno !== '' &&
        !Number.isNaN(areaConstruida) &&
        !Number.isNaN(areaTerreno) &&
        areaTerreno > 0 &&
        areaConstruida > areaTerreno;

    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Características Físicas</h4>

            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3">
                <div className="col">
                    <label className="form-label" htmlFor="pf-habitaciones">Habitaciones</label>
                    <input
                        id="pf-habitaciones"
                        type="number"
                        min="0"
                        name="habitaciones"
                        value={formData.habitaciones || ''}
                        onChange={onChange}
                        onKeyDown={preventInvalidKey}
                        className="form-control"
                    />
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-banos">Baños</label>
                    <input
                        id="pf-banos"
                        type="number"
                        min="0"
                        step="0.5"
                        name="banos"
                        value={formData.banos || ''}
                        onChange={onChange}
                        onKeyDown={preventInvalidKey}
                        className="form-control"
                    />
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-parqueos">Parqueos</label>
                    <input
                        id="pf-parqueos"
                        type="number"
                        min="0"
                        name="estacionamientos"
                        value={formData.estacionamientos || ''}
                        onChange={onChange}
                        onKeyDown={preventInvalidKey}
                        className="form-control"
                    />
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-area-c">Área Const. (m²)</label>
                    <input
                        id="pf-area-c"
                        type="number"
                        min="0"
                        step="0.01"
                        max={areaTerreno > 0 ? areaTerreno : undefined}
                        name="area_construida"
                        value={formData.area_construida || ''}
                        onChange={onChange}
                        onKeyDown={preventInvalidKey}
                        className={`form-control${areaExcedida ? ' is-invalid' : ''}`}
                    />
                    {areaExcedida && (
                        <small className="text-danger d-block mt-1">
                            No puede superar el área del terreno.
                        </small>
                    )}
                </div>

                <div className="col">
                    <label className="form-label" htmlFor="pf-area-t">Área Terreno (m²)</label>
                    <input
                        id="pf-area-t"
                        type="number"
                        min="0"
                        step="0.01"
                        name="area_terreno"
                        value={formData.area_terreno || ''}
                        onChange={onChange}
                        onKeyDown={preventInvalidKey}
                        className="form-control"
                    />
                </div>
            </div>
        </div>
    );
}