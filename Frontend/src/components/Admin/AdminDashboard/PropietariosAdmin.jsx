import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import SearchFilterBar from './SearchFilterBar';

const FORM_INICIAL = {
    tipo_persona: 'fisica',
    tipo_documento: 'cedula',
    documento_identidad: '',
    nombre: '',
    apellidos: '',
    razon_social: '',
    email: '',
    telefono: '',
    direccion: '',
    notas: '',
    activo: true
};

const TIPOS_DOCUMENTO = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'ruc', label: 'RUC' },
    { value: 'otro', label: 'Otro' }
];

const FILTROS = [
    { value: 'todos', label: 'Todos' },
    { value: 'activos', label: 'Solo activos' },
    { value: 'inactivos', label: 'Solo inactivos' }
];

const normalizar = (str) =>
    String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

export default function PropietariosAdmin() {
    const [propietarios, setPropietarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(FORM_INICIAL);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');

    const load = async () => {
        setLoading(true);
        try {
            const data = await api.propietarios.getAll();
            setPropietarios(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const propietariosFiltrados = useMemo(() => {
        const q = normalizar(busqueda).trim();
        const soloDigitos = q.replace(/\D/g, '');

        return propietarios.filter((p) => {
            if (filtro === 'activos' && !p.activo) return false;
            if (filtro === 'inactivos' && p.activo) return false;

            if (!q) return true;

            const campos = [
                p.documento_identidad,
                p.nombre,
                p.apellidos,
                p.razon_social,
                p.email,
                p.telefono
            ].map(normalizar).join(' ');

            const coincideTexto = campos.includes(q);
            const coincideDoc = soloDigitos.length > 0 &&
                normalizar(p.documento_identidad).replace(/\D/g, '').includes(soloDigitos);

            return coincideTexto || coincideDoc;
        });
    }, [propietarios, busqueda, filtro]);

    const handleAddNew = () => {
        setFormData(FORM_INICIAL);
        setEditing(null);
        setError('');
        setShowForm(true);
    };

    const handleEdit = (p) => {
        setFormData({
            tipo_persona: p.tipo_persona || 'fisica',
            tipo_documento: p.tipo_documento || 'cedula',
            documento_identidad: p.documento_identidad || '',
            nombre: p.nombre || '',
            apellidos: p.apellidos || '',
            razon_social: p.razon_social || '',
            email: p.email || '',
            telefono: p.telefono || '',
            direccion: p.direccion || '',
            notas: p.notas || '',
            activo: p.activo !== undefined ? Boolean(p.activo) : true
        });
        setEditing(p);
        setError('');
        setShowForm(true);
    };

    const handleToggleActive = async (p) => {
        const nuevoEstado = !p.activo;
        const accion = nuevoEstado ? 'activar' : 'desactivar';
        const confirmed = await confirmDialog({
            title: `${nuevoEstado ? 'Activar' : 'Desactivar'} propietario`,
            message: `¿Seguro que deseas ${accion} este propietario?`,
            confirmText: nuevoEstado ? 'Activar' : 'Desactivar',
            variant: nuevoEstado ? 'primary' : 'danger'
        });
        if (!confirmed) return;
        try {
            if (nuevoEstado) {
                const payload = {
                    tipo_persona: p.tipo_persona,
                    tipo_documento: p.tipo_documento,
                    documento_identidad: p.documento_identidad,
                    nombre: p.nombre || '',
                    apellidos: p.apellidos || '',
                    razon_social: p.razon_social || '',
                    email: p.email || '',
                    telefono: p.telefono || '',
                    direccion: p.direccion || '',
                    notas: p.notas || '',
                    activo: true
                };
                await api.propietarios.update(p.id, payload);
                toast.success('Propietario activado con éxito.');
            } else {
                await api.propietarios.delete(p.id);
                toast.success('Propietario desactivado con éxito.');
            }
            load();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = { ...formData };

        if (payload.tipo_persona === 'fisica') {
            payload.razon_social = '';
        } else {
            payload.nombre = '';
            payload.apellidos = '';
        }

        try {
            if (editing) {
                await api.propietarios.update(editing.id, payload);
                toast.success('Propietario actualizado con éxito.');
            } else {
                await api.propietarios.create(payload);
                toast.success('Propietario creado con éxito.');
            }
            setShowForm(false);
            setEditing(null);
            load();
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const nombreCompleto = (p) => {
        if (p.tipo_persona === 'juridica') return p.razon_social || '—';
        return `${p.nombre || ''} ${p.apellidos || ''}`.trim() || '—';
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center gap-3 text-secondary py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <span className="fs-5">Cargando propietarios...</span>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="card border-0 shadow-sm p-4 rounded-4">
                <h3 className="fw-bold mb-4">{editing ? 'Editar Propietario' : 'Nuevo Propietario'}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Tipo de Persona</label>
                            <select name="tipo_persona" className="form-select" value={formData.tipo_persona} onChange={handleChange}>
                                <option value="fisica">Persona Física</option>
                                <option value="juridica">Persona Jurídica</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Tipo de Documento</label>
                            <select name="tipo_documento" className="form-select" value={formData.tipo_documento} onChange={handleChange}>
                                {TIPOS_DOCUMENTO.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label fw-semibold">Documento de Identidad</label>
                            <input
                                type="text"
                                name="documento_identidad"
                                className="form-control"
                                value={formData.documento_identidad}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {formData.tipo_persona === 'fisica' ? (
                            <>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Nombre</label>
                                    <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Apellidos</label>
                                    <input type="text" name="apellidos" className="form-control" value={formData.apellidos} onChange={handleChange} required />
                                </div>
                            </>
                        ) : (
                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-semibold">Razón Social</label>
                                <input type="text" name="razon_social" className="form-control" value={formData.razon_social} onChange={handleChange} required />
                            </div>
                        )}

                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Teléfono</label>
                            <input type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label fw-semibold">Dirección</label>
                            <input type="text" name="direccion" className="form-control" value={formData.direccion} onChange={handleChange} />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label fw-semibold">Notas Internas</label>
                            <textarea name="notas" className="form-control" rows="3" value={formData.notas} onChange={handleChange} />
                        </div>

                        {editing && (
                            <div className="col-md-12 mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="propietarioActivo"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                    />
                                    <label className="form-check-label" htmlFor="propietarioActivo">Propietario Activo</label>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary flex-fill flex-md-grow-0">Guardar</button>
                        <button type="button" className="btn btn-secondary flex-fill flex-md-grow-0" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="mt-2">
            <button onClick={handleAddNew} className="btn btn-primary mb-3 w-100 w-md-auto">+ Agregar Propietario</button>

            <SearchFilterBar
                search={busqueda}
                onSearchChange={setBusqueda}
                placeholder="Buscar por nombre, razón social, cédula o email..."
                filter={filtro}
                onFilterChange={setFiltro}
                filterOptions={FILTROS}
            />

            {propietariosFiltrados.length === 0 ? (
                <div className="alert alert-info text-center py-4">
                    No se encontraron propietarios con los filtros actuales.
                </div>
            ) : (
                <>
                    <div className="table-responsive shadow-sm rounded-4 border overflow-hidden d-none d-md-block">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre / Razón Social</th>
                                    <th>Tipo</th>
                                    <th>Contacto</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {propietariosFiltrados.map(p => (
                                    <tr key={p.id}>
                                        <td className="fw-semibold">{p.documento_identidad}</td>
                                        <td className="fw-semibold">{nombreCompleto(p)}</td>
                                        <td><span className="badge bg-secondary-subtle text-secondary border text-capitalize">{p.tipo_persona}</span></td>
                                        <td className="small">
                                            {p.email && <div>{p.email}</div>}
                                            {p.telefono && <div className="text-muted">{p.telefono}</div>}
                                        </td>
                                        <td className="text-center">
                                            {p.activo ? (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Activo</span>
                                            ) : (
                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Inactivo</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline-primary">Editar</button>
                                                {p.activo ? (
                                                    <button onClick={() => handleToggleActive(p)} className="btn btn-sm btn-outline-danger">Desactivar</button>
                                                ) : (
                                                    <button onClick={() => handleToggleActive(p)} className="btn btn-sm btn-outline-success">Activar</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-block d-md-none">
                        {propietariosFiltrados.map(p => (
                            <div key={p.id} className="card shadow-sm border rounded-3 mb-3 p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge bg-light text-dark border">{p.documento_identidad}</span>
                                    {p.activo ? (
                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Activo</span>
                                    ) : (
                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Inactivo</span>
                                    )}
                                </div>
                                <h5 className="fw-bold fs-6 mb-1">{nombreCompleto(p)}</h5>
                                <p className="text-muted small mb-1 text-capitalize">{p.tipo_persona}</p>
                                {p.email && <p className="text-muted small mb-1 text-break">{p.email}</p>}
                                {p.telefono && <p className="text-muted small mb-2">{p.telefono}</p>}

                                <div className="d-flex gap-2 mt-2">
                                    <button onClick={() => handleEdit(p)} className="btn btn-outline-primary btn-sm flex-fill">Editar</button>
                                    {p.activo ? (
                                        <button onClick={() => handleToggleActive(p)} className="btn btn-outline-danger btn-sm flex-fill">Desactivar</button>
                                    ) : (
                                        <button onClick={() => handleToggleActive(p)} className="btn btn-outline-success btn-sm flex-fill">Activar</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}