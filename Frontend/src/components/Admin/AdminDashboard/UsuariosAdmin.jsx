import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import SearchFilterBar from './SearchFilterBar';

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

const initialForm = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'agente_inmobiliario',
    cargo: '',
    tipo_documento: 'cedula',
    telefono: '',
    direccion: '',
    activo: true,
    fecha_contratacion: '',
    fecha_fin_contratacion: '',
};

export default function UsuariosAdmin({ currentUser }) {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');
    const [formData, setFormData] = useState(initialForm);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await api.usuarios.getAll();
            setUsuarios(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const usuariosFiltrados = useMemo(() => {
        const q = normalizar(busqueda).trim();
        const soloDigitos = q.replace(/\D/g, '');

        return usuarios.filter((u) => {
            if (filtro === 'activos' && !u.activo) return false;
            if (filtro === 'inactivos' && u.activo) return false;

            if (!q) return true;

            const campos = [
                u.id,
                u.documento_identidad,
                u.nombre,
                u.apellidos,
                u.email,
                u.cargo,
                u.rol,
            ].map(normalizar).join(' ');

            const coincideTexto = campos.includes(q);
            const coincideDoc = soloDigitos.length > 0 &&
                normalizar(u.documento_identidad || u.id).replace(/\D/g, '').includes(soloDigitos);

            return coincideTexto || coincideDoc;
        });
    }, [usuarios, busqueda, filtro]);

    const handleDelete = async (id) => {
        if (String(id) === String(currentUser.id)) {
            toast.warning('No puedes desactivar tu propia cuenta.');
            return;
        }
        const confirmed = await confirmDialog({
            title: 'Desactivar usuario',
            message: '¿Seguro que deseas desactivar este usuario?',
            confirmText: 'Desactivar',
            variant: 'danger',
        });
        if (confirmed) {
            try {
                await api.usuarios.delete(id);
                toast.success('Usuario desactivado correctamente.');
                loadUsers();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!editingUser && (!formData.password || formData.password.length < 8)) {
            setError('La contraseña es obligatoria y debe tener al menos 8 caracteres.');
            toast.warning('La contraseña es obligatoria y debe tener al menos 8 caracteres.');
            return;
        }
        if (editingUser && formData.password && formData.password.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres.');
            toast.warning('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }

        try {
            if (editingUser) {
                await api.usuarios.update(editingUser.id, formData);
                toast.success('Usuario actualizado con éxito.');
            } else {
                await api.usuarios.create(formData);
                toast.success('Usuario creado con éxito.');
            }
            setShowForm(false);
            setEditingUser(null);
            setFormData(initialForm);
            loadUsers();
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const handleEdit = (user) => {
        setFormData({
            id: user.id || '',
            nombre: user.nombre || '',
            apellidos: user.apellidos || '',
            email: user.email || '',
            password: '',
            rol: user.rol || 'agente_inmobiliario',
            cargo: user.cargo || '',
            tipo_documento: user.tipo_documento || 'cedula',
            telefono: user.telefono || '',
            direccion: user.direccion || '',
            activo: user.activo ?? true,
            fecha_contratacion: user.fecha_ingreso ? user.fecha_ingreso.split('T')[0] : '',
            fecha_fin_contratacion: user.fecha_salida ? user.fecha_salida.split('T')[0] : '',
        });
        setEditingUser(user);
        setError('');
        setShowForm(true);
    };

    const handleAddNew = () => {
        setFormData(initialForm);
        setEditingUser(null);
        setError('');
        setShowPassword(false);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <span className="admin-spinner" aria-hidden="true" />
                <span>Cargando usuarios...</span>
            </div>
        );
    }

    return (
        <div>
            {showForm ? (
                <LiquidGlassPanel liquid className="admin-panel">
                    <h3 className="admin-panel-title">
                        {editingUser ? 'Editar Trabajador' : 'Nuevo Trabajador'}
                    </h3>

                    <form onSubmit={handleFormSubmit} className="lg-form">
                        <div className="admin-form-section">
                            <h4 className="admin-form-section-title">Datos Personales</h4>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label" htmlFor="u-tipodoc">Tipo de Documento</label>
                                    <select
                                        id="u-tipodoc"
                                        className="form-select"
                                        value={formData.tipo_documento}
                                        onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
                                    >
                                        {TIPOS_DOCUMENTO.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label" htmlFor="u-doc">Documento de Identidad</label>
                                    <input
                                        id="u-doc"
                                        type="text"
                                        className="form-control"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        required
                                        disabled={!!editingUser}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label" htmlFor="u-fechacont">Fecha de Contratación</label>
                                    <input
                                        id="u-fechacont"
                                        type="date"
                                        className="form-control"
                                        value={formData.fecha_contratacion}
                                        onChange={(e) => setFormData({ ...formData, fecha_contratacion: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-nombre">Nombre</label>
                                    <input
                                        id="u-nombre"
                                        type="text"
                                        className="form-control"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-apellidos">Apellidos</label>
                                    <input
                                        id="u-apellidos"
                                        type="text"
                                        className="form-control"
                                        value={formData.apellidos}
                                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-tel">Teléfono</label>
                                    <input
                                        id="u-tel"
                                        type="text"
                                        className="form-control"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        placeholder="Ej: +506 8888 8888"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-dir">Dirección</label>
                                    <input
                                        id="u-dir"
                                        type="text"
                                        className="form-control"
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        placeholder="Dirección de residencia"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-section">
                            <h4 className="admin-form-section-title">Datos Laborales</h4>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-rol">Rol</label>
                                    <select
                                        id="u-rol"
                                        className="form-select"
                                        value={formData.rol}
                                        onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                    >
                                        <option value="agente_inmobiliario">Agente Inmobiliario</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-cargo">Cargo</label>
                                    <input
                                        id="u-cargo"
                                        type="text"
                                        className="form-control"
                                        value={formData.cargo}
                                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                        placeholder="Ej: Agente Senior"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-fechafin">Fecha Fin de Contratación</label>
                                    <input
                                        id="u-fechafin"
                                        type="date"
                                        className="form-control"
                                        value={formData.fecha_fin_contratacion}
                                        onChange={(e) => setFormData({ ...formData, fecha_fin_contratacion: e.target.value })}
                                    />
                                </div>

                                {editingUser && (
                                    <div className="col-md-6 mb-3 d-flex align-items-end">
                                        <label className="admin-switch">
                                            <input
                                                type="checkbox"
                                                checked={formData.activo}
                                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                            />
                                            <span className="admin-switch-label">Usuario Activo</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="admin-form-section">
                            <h4 className="admin-form-section-title">Credenciales de Acceso</h4>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-email">Email</label>
                                    <input
                                        id="u-email"
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="u-password">
                                        {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                                    </label>
                                    <div className="input-group">
                                        <input
                                            id="u-password"
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={editingUser ? 'Dejar en blanco para no cambiar' : 'Mínimo 8 caracteres'}
                                            minLength={8}
                                            required={!editingUser}
                                        />
                                        <button
                                            type="button"
                                            className="admin-action-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 'Ocultar' : 'Mostrar'}
                                        </button>
                                    </div>
                                    <small className="admin-hint">
                                        {editingUser
                                            ? 'Si no se llena, la contraseña actual se mantiene.'
                                            : 'El trabajador recibirá un correo con un enlace para restablecerla.'}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {error && <div className="admin-alert admin-alert--danger">{error}</div>}

                        <div className="admin-form-actions">
                            <LiquidGlassButton type="submit" variant="primary">
                                Guardar
                            </LiquidGlassButton>
                            <LiquidGlassButton
                                variant="ghost"
                                onClick={() => { setShowForm(false); setEditingUser(null); setError(''); }}
                            >
                                Cancelar
                            </LiquidGlassButton>
                        </div>
                    </form>
                </LiquidGlassPanel>
            ) : (
                <>
                    <div className="admin-actions">
                        <LiquidGlassButton variant="primary" onClick={handleAddNew}>
                            + Agregar Trabajador
                        </LiquidGlassButton>
                    </div>

                    <SearchFilterBar
                        search={busqueda}
                        onSearchChange={setBusqueda}
                        placeholder="Buscar por nombre, cédula, email o cargo..."
                        filter={filtro}
                        onFilterChange={setFiltro}
                        filterOptions={FILTROS}
                    />

                    {usuariosFiltrados.length === 0 ? (
                        <div className="admin-empty">
                            No se encontraron trabajadores con los filtros actuales.
                        </div>
                    ) : (
                        <>
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Documento</th>
                                            <th>Nombre Completo</th>
                                            <th>Contacto</th>
                                            <th>Rol</th>
                                            <th>Cargo</th>
                                            <th>Contratación</th>
                                            <th className="text-center">Estado</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosFiltrados.map((u) => (
                                            <tr key={u.id}>
                                                <td className="admin-cell-sub">
                                                    <div className="admin-cell-main">{u.documento_identidad || u.id}</div>
                                                    <div className="text-capitalize">{u.tipo_documento || 'cedula'}</div>
                                                </td>
                                                <td className="admin-cell-main">{u.nombre} {u.apellidos}</td>
                                                <td className="admin-cell-sub">
                                                    <div>{u.email}</div>
                                                    {u.telefono && <div>{u.telefono}</div>}
                                                </td>
                                                <td>
                                                    <span className="admin-badge admin-badge--neutral">
                                                        {u.rol}
                                                    </span>
                                                </td>
                                                <td className="admin-cell-sub">{u.cargo || '—'}</td>
                                                <td className="admin-cell-sub">
                                                    {u.fecha_ingreso ? new Date(u.fecha_ingreso).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="text-center">
                                                    {u.activo ? (
                                                        <span className="admin-badge admin-badge--success">Activo</span>
                                                    ) : (
                                                        <span className="admin-badge admin-badge--danger">Inactivo</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="admin-action-group">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(u)}
                                                            className="admin-action-btn admin-action-btn--primary"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(u.id)}
                                                            className="admin-action-btn admin-action-btn--danger"
                                                            disabled={String(u.id) === String(currentUser.id)}
                                                        >
                                                            Desactivar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="admin-mobile-list">
                                {usuariosFiltrados.map((u) => (
                                    <div key={u.id} className="admin-mobile-card lg lg--soft">
                                        <div className="admin-mobile-card-row">
                                            <span className="admin-badge admin-badge--neutral">
                                                {u.documento_identidad || u.id}
                                            </span>
                                            {u.activo ? (
                                                <span className="admin-badge admin-badge--success">Activo</span>
                                            ) : (
                                                <span className="admin-badge admin-badge--danger">Inactivo</span>
                                            )}
                                        </div>
                                        <h5 className="admin-mobile-card-title">{u.nombre} {u.apellidos}</h5>
                                        <p className="admin-mobile-card-sub text-break">{u.email}</p>
                                        {u.telefono && <p className="admin-mobile-card-sub">{u.telefono}</p>}

                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <span className="admin-cell-sub">
                                                <strong style={{ color: 'var(--color-heading)' }}>Rol:</strong> {u.rol}
                                            </span>
                                            <span className="admin-cell-sub">
                                                <strong style={{ color: 'var(--color-heading)' }}>Cargo:</strong> {u.cargo || '—'}
                                            </span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="admin-cell-sub">
                                                <strong style={{ color: 'var(--color-heading)' }}>Contratación:</strong>{' '}
                                                {u.fecha_ingreso ? new Date(u.fecha_ingreso).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="admin-mobile-card-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(u)}
                                                className="admin-action-btn admin-action-btn--primary"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(u.id)}
                                                className="admin-action-btn admin-action-btn--danger"
                                                disabled={String(u.id) === String(currentUser.id)}
                                            >
                                                Desactivar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}