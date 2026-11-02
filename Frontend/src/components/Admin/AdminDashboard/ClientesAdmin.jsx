import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import { formatPrice } from '@/utils/formatters';

const FILTROS_CLIENTES = [
    { value: 'todos', label: 'Todos' },
    { value: 'comprador', label: 'Compradores' },
    { value: 'inquilino', label: 'Inquilinos' },
    { value: 'inversionista', label: 'Inversionistas' },
];

const MONEDAS = [
    { value: 'USD', label: 'USD $' },
    { value: 'CRC', label: 'CRC ₡' },
    { value: 'EUR', label: 'EUR €' },
];

const normalizar = (str) =>
    String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const formatNumberDisplay = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '';
    return new Intl.NumberFormat('es-CR').format(Number(digits));
};

const normalizeToDigits = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const num = parseFloat(value);
    if (isNaN(num) || num === 0) return '';
    return String(Math.round(num));
};

export default function ClientesAdmin() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');
    const [showForm, setShowForm] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [tiposInmueble, setTiposInmueble] = useState([]);

    const [formData, setFormData] = useState({
        tipo_persona: 'fisica',
        nombre: '',
        apellidos: '',
        razon_social: '',
        documento_identidad: '',
        tipo_documento: 'cedula',
        email: '',
        telefono: '',
        direccion: '',
        tipo_cliente: 'comprador',
        presupuesto_min: '',
        presupuesto_max: '',
        moneda_presupuesto: 'USD',
        zonas_interes: '',
        tipo_inmueble_preferido: '',
        notas_seguimiento: '',
    });

    useEffect(() => {
        loadClientes();
        loadTiposInmueble();
    }, []);

    const loadClientes = async () => {
        setLoading(true);
        try {
            const data = await api.clientes.getAll();
            setClientes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadTiposInmueble = async () => {
        try {
            const data = await api.diccionarios.getTiposInmueble();
            setTiposInmueble(data);
        } catch (error) {
            console.error(error);
        }
    };

    const clientesFiltrados = useMemo(() => {
        const q = normalizar(busqueda).trim();
        return clientes.filter((c) => {
            if (filtro !== 'todos' && c.tipo_cliente !== filtro) return false;
            if (!q) return true;
            const campos = [
                c.id,
                c.nombre,
                c.apellidos,
                c.razon_social,
                c.documento_identidad,
                c.email,
                c.telefono,
            ].map(normalizar).join(' ');
            return campos.includes(q);
        });
    }, [clientes, busqueda, filtro]);

    const presupuestoError = useMemo(() => {
        const hasMin = formData.presupuesto_min !== '' && formData.presupuesto_min !== null && formData.presupuesto_min !== undefined;
        const hasMax = formData.presupuesto_max !== '' && formData.presupuesto_max !== null && formData.presupuesto_max !== undefined;
        if (hasMin && hasMax && Number(formData.presupuesto_min) > Number(formData.presupuesto_max)) {
            return 'El presupuesto mínimo no puede ser mayor al máximo.';
        }
        return '';
    }, [formData.presupuesto_min, formData.presupuesto_max]);

    const resetForm = () => {
        setFormData({
            tipo_persona: 'fisica',
            nombre: '',
            apellidos: '',
            razon_social: '',
            documento_identidad: '',
            tipo_documento: 'cedula',
            email: '',
            telefono: '',
            direccion: '',
            tipo_cliente: 'comprador',
            presupuesto_min: '',
            presupuesto_max: '',
            moneda_presupuesto: 'USD',
            zonas_interes: '',
            tipo_inmueble_preferido: '',
            notas_seguimiento: '',
        });
        setEditingCliente(null);
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setFormData({
            tipo_persona: cliente.tipo_persona || 'fisica',
            nombre: cliente.nombre || '',
            apellidos: cliente.apellidos || '',
            razon_social: cliente.razon_social || '',
            documento_identidad: cliente.documento_identidad || '',
            tipo_documento: cliente.tipo_documento || 'cedula',
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            direccion: cliente.direccion || '',
            tipo_cliente: cliente.tipo_cliente || 'comprador',
            presupuesto_min: normalizeToDigits(cliente.presupuesto_min),
            presupuesto_max: normalizeToDigits(cliente.presupuesto_max),
            moneda_presupuesto: cliente.moneda_presupuesto || 'USD',
            zonas_interes: cliente.zonas_interes || '',
            tipo_inmueble_preferido: cliente.tipo_inmueble_preferido || '',
            notas_seguimiento: cliente.notas_seguimiento || '',
        });
        setShowForm(true);
    };

    const handleBudgetChange = (field, rawValue) => {
        const digits = rawValue.replace(/\D/g, '');
        setFormData({ ...formData, [field]: digits });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (presupuestoError) {
            toast.error(presupuestoError);
            return;
        }
        try {
            if (editingCliente) {
                await api.clientes.update(editingCliente.id, formData);
                toast.success('Cliente actualizado con éxito.');
            } else {
                await api.clientes.create(formData);
                toast.success('Cliente creado con éxito.');
            }
            setShowForm(false);
            resetForm();
            loadClientes();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleDelete = async (cliente) => {
        const confirmed = await confirmDialog({
            title: 'Desactivar cliente',
            message: `¿Seguro que deseas desactivar a ${cliente.razon_social || `${cliente.nombre || ''} ${cliente.apellidos || ''}`.trim()}?`,
            confirmText: 'Desactivar',
            variant: 'danger',
        });
        if (!confirmed) return;
        try {
            await api.clientes.delete(cliente.id);
            toast.success('Cliente desactivado.');
            loadClientes();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const renderPresupuesto = (cliente) => {
        const moneda = cliente.moneda_presupuesto || 'USD';
        const hasMin = cliente.presupuesto_min !== null && cliente.presupuesto_min !== undefined && Number(cliente.presupuesto_min) > 0;
        const hasMax = cliente.presupuesto_max !== null && cliente.presupuesto_max !== undefined && Number(cliente.presupuesto_max) > 0;
        if (!hasMin && !hasMax) return '—';
        if (hasMin && hasMax) {
            return `${formatPrice(cliente.presupuesto_min, moneda)} - ${formatPrice(cliente.presupuesto_max, moneda)}`;
        }
        if (hasMin) return `Desde ${formatPrice(cliente.presupuesto_min, moneda)}`;
        return `Hasta ${formatPrice(cliente.presupuesto_max, moneda)}`;
    };

    return (
        <div>
            <div className="admin-actions mb-3">
                <LiquidGlassButton variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
                    + Nuevo Cliente
                </LiquidGlassButton>
            </div>

            {showForm && (
                <LiquidGlassPanel liquid className="admin-panel mb-4">
                    <h3 className="admin-panel-title">{editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Tipo de persona</label>
                            <select
                                className="form-select"
                                value={formData.tipo_persona}
                                onChange={(e) => setFormData({ ...formData, tipo_persona: e.target.value })}
                            >
                                <option value="fisica">Física</option>
                                <option value="juridica">Jurídica</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Documento de identidad</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={formData.documento_identidad}
                                onChange={(e) => setFormData({ ...formData, documento_identidad: e.target.value })}
                                disabled={!!editingCliente}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Tipo de documento</label>
                            <select
                                className="form-select"
                                value={formData.tipo_documento}
                                onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
                            >
                                <option value="cedula">Cédula</option>
                                <option value="pasaporte">Pasaporte</option>
                                <option value="ruc">RUC</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        {formData.tipo_persona === 'fisica' ? (
                            <>
                                <div className="col-md-6">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={formData.apellidos}
                                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="col-12">
                                <label className="form-label">Razón social</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.razon_social}
                                    onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Tipo de cliente</label>
                            <select
                                className="form-select"
                                value={formData.tipo_cliente}
                                onChange={(e) => setFormData({ ...formData, tipo_cliente: e.target.value })}
                            >
                                <option value="comprador">Comprador</option>
                                <option value="inquilino">Inquilino</option>
                                <option value="inversionista">Inversionista</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Moneda del presupuesto</label>
                            <select
                                className="form-select"
                                value={formData.moneda_presupuesto}
                                onChange={(e) => setFormData({ ...formData, moneda_presupuesto: e.target.value })}
                            >
                                {MONEDAS.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Tipo de inmueble preferido</label>
                            <select
                                className="form-select"
                                value={formData.tipo_inmueble_preferido}
                                onChange={(e) => setFormData({ ...formData, tipo_inmueble_preferido: e.target.value })}
                            >
                                <option value="">Cualquiera</option>
                                {tiposInmueble.map((t) => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Presupuesto mínimo</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                className={`form-control${presupuestoError ? ' is-invalid' : ''}`}
                                placeholder="0"
                                value={formatNumberDisplay(formData.presupuesto_min)}
                                onChange={(e) => handleBudgetChange('presupuesto_min', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Presupuesto máximo</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                className={`form-control${presupuestoError ? ' is-invalid' : ''}`}
                                placeholder="0"
                                value={formatNumberDisplay(formData.presupuesto_max)}
                                onChange={(e) => handleBudgetChange('presupuesto_max', e.target.value)}
                            />
                            {presupuestoError && (
                                <div className="invalid-feedback d-block">{presupuestoError}</div>
                            )}
                        </div>

                        <div className="col-12">
                            <label className="form-label">Zonas de interés</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.zonas_interes}
                                onChange={(e) => setFormData({ ...formData, zonas_interes: e.target.value })}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Notas de seguimiento</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                value={formData.notas_seguimiento}
                                onChange={(e) => setFormData({ ...formData, notas_seguimiento: e.target.value })}
                            />
                        </div>
                        <div className="col-12 d-flex gap-2">
                            <LiquidGlassButton variant="primary" type="submit" disabled={!!presupuestoError}>
                                {editingCliente ? 'Actualizar' : 'Crear'}
                            </LiquidGlassButton>
                            <LiquidGlassButton variant="ghost" type="button" onClick={() => { setShowForm(false); resetForm(); }}>
                                Cancelar
                            </LiquidGlassButton>
                        </div>
                    </form>
                </LiquidGlassPanel>
            )}

            <div className="d-flex gap-2 mb-3 flex-wrap">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <select
                    className="form-select"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    {FILTROS_CLIENTES.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <span className="admin-spinner" aria-hidden="true" />
                    <span>Cargando clientes...</span>
                </div>
            ) : clientesFiltrados.length === 0 ? (
                <div className="admin-empty">No hay clientes registrados.</div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre / Razón social</th>
                                <th>Documento</th>
                                <th>Tipo cliente</th>
                                <th>Presupuesto</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map((c) => (
                                <tr key={c.id}>
                                    <td className="text-center fw-bold">#{c.id}</td>
                                    <td className="admin-cell-main">
                                        {c.razon_social || `${c.nombre || ''} ${c.apellidos || ''}`.trim()}
                                    </td>
                                    <td>{c.documento_identidad}</td>
                                    <td className="text-capitalize">{c.tipo_cliente}</td>
                                    <td className="admin-cell-sub">{renderPresupuesto(c)}</td>
                                    <td>{c.email || '—'}</td>
                                    <td>{c.telefono || '—'}</td>
                                    <td>
                                        <div className="admin-action-group">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(c)}
                                                className="admin-action-btn admin-action-btn--primary"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(c)}
                                                className="admin-action-btn admin-action-btn--danger"
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
            )}
        </div>
    );
}