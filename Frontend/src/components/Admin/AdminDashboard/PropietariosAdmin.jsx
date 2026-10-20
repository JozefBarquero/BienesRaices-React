import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
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
    activo: true,
};

const TIPOS_DOCUMENTO = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'ruc', label: 'RUC' },
    { value: 'otro', label: 'Otro' },
];

const FILTROS = [
    { value: 'todos', label: 'Todos' },
    { value: 'activos', label: 'Solo activos' },
    { value: 'inactivos', label: 'Solo inactivos' },
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
                p.telefono,
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
            activo: p.activo !== undefined ? Boolean(p.activo) : true,
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
            variant: nuevoEstado ? 'primary' : 'danger',
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
                    activo: true,
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
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            <div className="admin-loading">
                <span className="admin-spinner" aria-hidden="true" />
                <span>Cargando propietarios...</span>
            </div>
        );
    }

    if (showForm) {
        return (
            <LiquidGlassPanel liquid className="admin-panel">
                <h3 className="admin-panel-title">
                    {editing ? 'Editar Propietario' : 'Nuevo Propietario'}
                </h3>

                <form onSubmit={handleSubmit} className="lg-form">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="prop-tipo-persona">Tipo de Persona</label>
                            <select
                                id="prop-tipo-persona"
                                name="tipo_persona"
                                className="form-select"
                                value={formData.tipo_persona}
                                onChange={handleChange}
                            >
                                <option value="fisica">Persona Física</option>
                                <option value="juridica">Persona Jurídica</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="prop-tipo-doc">Tipo de Documento</label>
                            <select
                                id="prop-tipo-doc"
                                name="tipo_documento"
                                className="form-select"
                                value={formData.tipo_documento}
                                onChange={handleChange}
                            >
                                {TIPOS_DOCUMENTO.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label" htmlFor="prop-doc">Documento de Identidad</label>
                            <input
                                id="prop-doc"
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
                                    <label className="form-label" htmlFor="prop-nombre">Nombre</label>
                                    <input
                                        id="prop-nombre"
                                        type="text"
                                        name="nombre"
                                        className="form-control"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="prop-apellidos">Apellidos</label>
                                    <input
                                        id="prop-apellidos"
                                        type="text"
                                        name="apellidos"
                                        className="form-control"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="col-md-12 mb-3">
                                <label className="form-label" htmlFor="prop-razon">Razón Social</label>
                                <input
                                    id="prop-razon"
                                    type="text"
                                    name="razon_social"
                                    className="form-control"
                                    value={formData.razon_social}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="prop-email">Email</label>
                            <input
                                id="prop-email"
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" htmlFor="prop-tel">Teléfono</label>
                            <input
                                id="prop-tel"
                                type="text"
                                name="telefono"
                                className="form-control"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label" htmlFor="prop-dir">Dirección</label>
                            <input
                                id="prop-dir"
                                type="text"
                                name="direccion"
                                className="form-control"
                                value={formData.direccion}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label" htmlFor="prop-notas">Notas Internas</label>
                            <textarea
                                id="prop-notas"
                                name="notas"
                                className="form-control"
                                rows="3"
                                value={formData.notas}
                                onChange={handleChange}
                            />
                        </div>

                        {editing && (
                            <div className="col-md-12 mb-3">
                                <label className="admin-switch">
                                    <input
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                    />
                                    <span className="admin-switch-label">Propietario Activo</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {error && <div className="admin-alert admin-alert--danger">{error}</div>}

                    <div className="admin-form-actions">
                        <LiquidGlassButton type="submit" variant="primary">
                            Guardar
                        </LiquidGlassButton>
                        <LiquidGlassButton
                            variant="ghost"
                            onClick={() => { setShowForm(false); setEditing(null); }}
                        >
                            Cancelar
                        </LiquidGlassButton>
                    </div>
                </form>
            </LiquidGlassPanel>
        );
    }

    return (
        <div>
            <div className="admin-actions">
                <LiquidGlassButton variant="primary" onClick={handleAddNew}>
                    + Agregar Propietario
                </LiquidGlassButton>
            </div>

            <SearchFilterBar
                search={busqueda}
                onSearchChange={setBusqueda}
                placeholder="Buscar por nombre, razón social, cédula o email..."
                filter={filtro}
                onFilterChange={setFiltro}
                filterOptions={FILTROS}
            />

            {propietariosFiltrados.length === 0 ? (
                <div className="admin-empty">
                    No se encontraron propietarios con los filtros actuales.
                </div>
            ) : (
                <>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
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
                                {propietariosFiltrados.map((p) => (
                                    <tr key={p.id}>
                                        <td className="admin-cell-main">{p.documento_identidad}</td>
                                        <td className="admin-cell-main">{nombreCompleto(p)}</td>
                                        <td>
                                            <span className="admin-badge admin-badge--neutral text-capitalize">
                                                {p.tipo_persona}
                                            </span>
                                        </td>
                                        <td className="admin-cell-sub">
                                            {p.email && <div>{p.email}</div>}
                                            {p.telefono && <div>{p.telefono}</div>}
                                        </td>
                                        <td className="text-center">
                                            {p.activo ? (
                                                <span className="admin-badge admin-badge--success">Activo</span>
                                            ) : (
                                                <span className="admin-badge admin-badge--danger">Inactivo</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="admin-action-group">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(p)}
                                                    className="admin-action-btn admin-action-btn--primary"
                                                >
                                                    Editar
                                                </button>
                                                {p.activo ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleActive(p)}
                                                        className="admin-action-btn admin-action-btn--danger"
                                                    >
                                                        Desactivar
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleActive(p)}
                                                        className="admin-action-btn admin-action-btn--success"
                                                    >
                                                        Activar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-mobile-list">
                        {propietariosFiltrados.map((p) => (
                            <div key={p.id} className="admin-mobile-card lg lg--soft">
                                <div className="admin-mobile-card-row">
                                    <span className="admin-badge admin-badge--neutral">{p.documento_identidad}</span>
                                    {p.activo ? (
                                        <span className="admin-badge admin-badge--success">Activo</span>
                                    ) : (
                                        <span className="admin-badge admin-badge--danger">Inactivo</span>
                                    )}
                                </div>
                                <h5 className="admin-mobile-card-title">{nombreCompleto(p)}</h5>
                                <p className="admin-mobile-card-sub text-capitalize">{p.tipo_persona}</p>
                                {p.email && <p className="admin-mobile-card-sub text-break">{p.email}</p>}
                                {p.telefono && <p className="admin-mobile-card-sub">{p.telefono}</p>}

                                <div className="admin-mobile-card-actions">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(p)}
                                        className="admin-action-btn admin-action-btn--primary"
                                    >
                                        Editar
                                    </button>
                                    {p.activo ? (
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(p)}
                                            className="admin-action-btn admin-action-btn--danger"
                                        >
                                            Desactivar
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(p)}
                                            className="admin-action-btn admin-action-btn--success"
                                        >
                                            Activar
                                        </button>
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