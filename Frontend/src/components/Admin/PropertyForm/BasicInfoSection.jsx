import React from 'react';
import PropietarioSelect from './PropietarioSelect';

export default function BasicInfoSection({ formData, tipos, propietarios = [], onChange }) {

    return (
        <div className="mb-4">
            <h4 className="fw-bold text-primary mb-3">Información Básica</h4>

            <div className="row g-3">
                <div className="col-12">
                    <label className="form-label fw-semibold">Título:</label>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo || ''}
                        onChange={onChange}
                        required
                        className="form-control form-control-lg"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Tipo de Inmueble:</label>
                    <select
                        name="tipo_inmueble_id"
                        value={formData.tipo_inmueble_id || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                    >
                        <option value="">Seleccione...</option>
                        {tipos.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Tipo de Operación:</label>
                    <select
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
                    <label className="form-label fw-semibold">Propietario:</label>
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