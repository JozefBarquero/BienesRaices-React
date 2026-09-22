import React from 'react';
import MapSearch from './MapSearch';
import LocationMap from './LocationMap';



export default function LocationSection({ formData, provincias, cantones, distritos, onChange, onLocationSelect }) {



    return (


        <div className="mb-4">


            <h4 className="fw-bold text-primary mb-3">Ubicación</h4>


            <div className="row g-3 mb-3">


                <div className="col-md-4">
                    <label className="form-label fw-semibold">Provincia:</label>
                    <select
                        name="provincia"
                        value={formData.provincia || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                    >
                        <option value="">Seleccione...</option>
                        {provincias.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>



                <div className="col-md-4">
                    <label className="form-label fw-semibold">Cantón:</label>
                    <select
                        name="canton"
                        value={formData.canton || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                        disabled={!formData.provincia}
                    >
                        <option value="">Seleccione...</option>
                        {cantones.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>



                <div className="col-md-4">


                    <label className="form-label fw-semibold">Distrito:</label>
                    <select
                        name="distrito"
                        value={formData.distrito || ''}
                        onChange={onChange}
                        required
                        className="form-select"
                        disabled={!formData.canton}
                    >
                        <option value="">Seleccione...</option>
                        {distritos.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>



            </div>



            <div className="mb-3">

                <label className="form-label fw-semibold">Dirección Exacta:</label>
                <input
                    type="text"
                    name="direccion_exacta"
                    value={formData.direccion_exacta || ''}
                    onChange={onChange}
                    required
                    className="form-control"
                />

            </div>
            


            <div className="card mb-3 border">


                <div className="card-header fw-semibold">
                    Coordenadas del Mapa
                </div>



                <div className="card-body p-3">
                    <MapSearch onLocationChange={onLocationSelect} />


                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Latitud:</label>
                            <input
                                type="text"
                                name="latitud"
                                value={formData.latitud || ''}
                                onChange={onChange}
                                required
                                className="form-control"
                            />


                        </div>




                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Longitud:</label>
                            <input
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


                    <small className="text-muted mt-2 d-block">
                        Puedes buscar una dirección, hacer clic directamente en el mapa para establecer las coordenadas, o ingresarlas manualmente.
                    </small>



                </div>

            </div>

        </div>

        
    );
}