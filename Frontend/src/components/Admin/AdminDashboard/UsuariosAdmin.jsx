import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import SearchFilterBar from './SearchFilterBar';

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

export default function UsuariosAdmin({ currentUser }) {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');

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
        fecha_fin_contratacion: ''
    };

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
                u.rol
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
            variant: 'danger'
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
            fecha_fin_contratacion: user.fecha_salida ? user.fecha_salida.split('T')[0] : ''
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
            <div className="d-flex align-items-center gap-3 text-secondary py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <span className="fs-5">Cargando usuarios...</span>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {showForm ? (
                <div className="card border-0 shadow-sm p-4 rounded-4">
                    <h3 className="fw-bold mb-4">{editingUser ? 'Editar Trabajador' : 'Nuevo Trabajador'}</h3>

                    <form onSubmit={handleFormSubmit}>
                        <h5 className="text-primary fw-bold mb-3">Datos Personales</h5>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Tipo de Documento</label>
                                <select
                                    className="form-select"
                                    value={formData.tipo_documento}
                                    onChange={e => setFormData({ ...formData, tipo_documento: e.target.value })}
                                >
                                    {TIPOS_DOCUMENTO.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Documento de Identidad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.id}
                                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                                    required
                                    disabled={!!editingUser}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">Fecha de Contratación</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.fecha_contratacion}
                                    onChange={e => setFormData({ ...formData, fecha_contratacion: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Apellidos</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.apellidos}
                                    onChange={e => setFormData({ ...formData, apellidos: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.telefono}
                                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                    placeholder="Ej: +506 8888 8888"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.direccion}
                                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                    placeholder="Dirección de residencia"
                                />
                            </div>
                        </div>

                        <h5 className="text-primary fw-bold mb-3 mt-3">Datos Laborales</h5>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Rol</label>
                                <select
                                    className="form-select"
                                    value={formData.rol}
                                    onChange={e => setFormData({ ...formData, rol: e.target.value })}
                                >
                                    <option value="agente_inmobiliario">Agente Inmobiliario</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Cargo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.cargo}
                                    onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                                    placeholder="Ej: Agente Senior"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Fecha Fin de Contratación</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.fecha_fin_contratacion}
                                    onChange={e => setFormData({ ...formData, fecha_fin_contratacion: e.target.value })}
                                />
                            </div>

                            {editingUser && (
                                <div className="col-md-6 mb-3 d-flex align-items-end">
                                    <div className="form-check mb-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="activoCheck"
                                            checked={formData.activo}
                                            onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="activoCheck">
                                            Usuario Activo
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <h5 className="text-primary fw-bold mb-3 mt-3">Credenciales de Acceso</h5>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={editingUser ? 'Dejar en blanco para no cambiar' : 'Mínimo 8 caracteres'}
                                        minLength={8}
                                        required={!editingUser}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                                <small className="text-muted">
                                    {editingUser
                                        ? 'Si no se llena, la contraseña actual se mantiene.'
                                        : 'El trabajador recibirá un correo con un enlace para restablecerla.'}
                                </small>
                            </div>
                        </div>

                        {error && <div className="alert alert-danger py-2">{error}</div>}

                        <div className="d-flex gap-2 mt-3">
                            <button type="submit" className="btn btn-primary flex-fill flex-md-grow-0">
                                Guardar
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary flex-fill flex-md-grow-0"
                                onClick={() => { setShowForm(false); setEditingUser(null); setError(''); }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <button onClick={handleAddNew} className="btn btn-primary mb-3 w-100 w-md-auto">
                        + Agregar Trabajador
                    </button>

                    <SearchFilterBar
                        search={busqueda}
                        onSearchChange={setBusqueda}
                        placeholder="Buscar por nombre, cédula, email o cargo..."
                        filter={filtro}
                        onFilterChange={setFiltro}
                        filterOptions={FILTROS}
                    />

                    {usuariosFiltrados.length === 0 ? (
                        <div className="alert alert-info text-center py-4">
                            No se encontraron trabajadores con los filtros actuales.
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive shadow-sm rounded-4 border overflow-hidden d-none d-md-block">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
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
                                        {usuariosFiltrados.map(u => (
                                            <tr key={u.id}>
                                                <td className="fw-bold small">
                                                    <div>{u.documento_identidad || u.id}</div>
                                                    <div className="text-muted text-capitalize">{u.tipo_documento || 'cedula'}</div>
                                                </td>
                                                <td className="fw-semibold">{u.nombre} {u.apellidos}</td>
                                                <td className="small">
                                                    <div>{u.email}</div>
                                                    {u.telefono && <div className="text-muted">{u.telefono}</div>}
                                                </td>
                                                <td><span className="badge bg-secondary-subtle text-secondary border">{u.rol}</span></td>
                                                <td className="text-muted small">{u.cargo || '—'}</td>
                                                <td className="small">
                                                    {u.fecha_ingreso ? new Date(u.fecha_ingreso).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="text-center">
                                                    {u.activo ? (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Activo</span>
                                                    ) : (
                                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Inactivo</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button onClick={() => handleEdit(u)} className="btn btn-sm btn-outline-primary">Editar</button>
                                                        <button
                                                            onClick={() => handleDelete(u.id)}
                                                            className="btn btn-sm btn-outline-danger"
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

                            <div className="d-block d-md-none">
                                {usuariosFiltrados.map(u => (
                                    <div key={u.id} className="card shadow-sm border rounded-3 mb-3 p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge bg-light text-dark border">
                                                {u.documento_identidad || u.id}
                                            </span>
                                            {u.activo ? (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Activo</span>
                                            ) : (
                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Inactivo</span>
                                            )}
                                        </div>
                                        <h5 className="fw-bold fs-6 mb-1">{u.nombre} {u.apellidos}</h5>
                                        <p className="text-muted small mb-1 text-break">{u.email}</p>
                                        {u.telefono && <p className="text-muted small mb-2">{u.telefono}</p>}

                                        <div className="d-flex justify-content-between align-items-center my-2 text-secondary small">
                                            <span><strong>Rol:</strong> {u.rol}</span>
                                            <span><strong>Cargo:</strong> {u.cargo || '—'}</span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center my-2 text-secondary small">
                                            <span>
                                                <strong>Contratación:</strong>{' '}
                                                {u.fecha_ingreso ? new Date(u.fecha_ingreso).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="d-flex gap-2 mt-3">
                                            <button onClick={() => handleEdit(u)} className="btn btn-outline-primary btn-sm flex-fill">Editar</button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="btn btn-outline-danger btn-sm flex-fill"
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