import React from 'react';
import PropietarioSelect from './PropietarioSelect';

export default function BasicInfoSection({ formData, tipos, propietarios = [], onChange }) {
    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Información Básica</h4>

            <div className="row g-3">
                <div className="col-12">
                    <label className="form-label" htmlFor="pf-titulo">Título</label>
                    <input
                        id="pf-titulo"
                        type="text"
                        name="titulo"
                        value={formData.titulo || ''}
                        onChange={onChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-tipo">Tipo de Inmueble</label>
                    <select
                        id="pf-tipo"
                        name="tipo_inmueble_id"
                        value={formData.tipo_inmueble_id || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                    >
                        <option value="">Seleccione...</option>
                        {tipos.map((t) => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-operacion">Tipo de Operación</label>
                    <select
                        id="pf-operacion"
                        name="tipo_operacion"
                        value={formData.tipo_operacion || 'venta'}
                        onChange={onChange}
                        className="form-select"
                    >
                        <option value="venta">Venta</option>
                        <option value="alquiler">Alquiler</option>
                        <option value="ambos">Ambos</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Propietario</label>
                    <PropietarioSelect
                        propietarios={propietarios}
                        value={formData.propietario_id || ''}
                        onChange={onChange}
                        name="propietario_id"
                    />
                </div>
            </div>
        </div>
    );
}
