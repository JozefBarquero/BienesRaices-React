import React from 'react';

export default function StatusSection({ formData, onChange }) {
    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Estado de la Publicación</h4>

            <div className="admin-switch-group">
                <label className="admin-switch">
                    <input
                        type="checkbox"
                        name="activa"
                        checked={Boolean(formData.activa)}
                        onChange={onChange}
                        role="switch"
                    />
                    <span className="admin-switch-label">Propiedad Activa</span>
                </label>

                <label className="admin-switch">
                    <input
                        type="checkbox"
                        name="destacada"
                        checked={Boolean(formData.destacada)}
                        onChange={onChange}
                        role="switch"
                    />
                    <span className="admin-switch-label">Destacar en Inicio</span>
                </label>
            </div>
        </div>
    );
}
