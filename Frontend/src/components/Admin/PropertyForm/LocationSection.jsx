import React from 'react';
import MapSearch from './MapSearch';
import LocationMap from './LocationMap';

export default function LocationSection({ formData, provincias, cantones, distritos, onChange, onLocationSelect }) {
    return (
        <div className="admin-form-section">
            <h4 className="admin-form-section-title">Ubicación</h4>

            <div className="row g-3 mb-3">
                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-provincia">Provincia</label>
                    <select
                        id="pf-provincia"
                        name="provincia"
                        value={formData.provincia || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                    >
                        <option value="">Seleccione...</option>
                        {provincias.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-canton">Cantón</label>
                    <select
                        id="pf-canton"
                        name="canton"
                        value={formData.canton || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                        disabled={!formData.provincia}
                    >
                        <option value="">Seleccione...</option>
                        {cantones.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label" htmlFor="pf-distrito">Distrito</label>
                    <select
                        id="pf-distrito"
                        name="distrito"
                        value={formData.distrito || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                        disabled={!formData.canton}
                    >
                        <option value="">Seleccione...</option>
                        {distritos.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="pf-dir-exacta">Dirección Exacta</label>
                <input
                    id="pf-dir-exacta"
                    type="text"
                    name="direccion_exacta"
                    value={formData.direccion_exacta || ''}
                    onChange={onChange}
                    required
                    className="form-control"
                />
            </div>

            <div className="admin-map-card">
                <div className="admin-map-header">Coordenadas del Mapa</div>

                <div className="admin-map-body">
                    <MapSearch onLocationChange={onLocationSelect} />

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="pf-lat">Latitud</label>
                            <input
                                id="pf-lat"
                                type="text"
                                name="latitud"
                                value={formData.latitud || ''}
                                onChange={onChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label" htmlFor="pf-lng">Longitud</label>
                            <input
                                id="pf-lng"
                                type="text"
                                name="longitud"
                                value={formData.longitud || ''}
                                onChange={onChange}
                                required
                                className="form-control"
                            />
                        </div>
                    </div>

                    <LocationMap
                        lat={formData.latitud}
                        lng={formData.longitud}
                        onLocationChange={onLocationSelect}
                    />

                    <small className="admin-hint">
                        Puedes buscar una dirección, hacer clic directamente en el mapa para establecer las coordenadas, o ingresarlas manualmente.
                    </small>
                </div>
            </div>
        </div>
    );
}