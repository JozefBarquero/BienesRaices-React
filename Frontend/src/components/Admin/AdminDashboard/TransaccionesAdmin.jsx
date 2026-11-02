import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { formatPrice } from '@/utils/formatters';

const ESTADOS_TRANSACCION = [
    { value: 'todos', label: 'Todos' },
    { value: 'en_proceso', label: 'En proceso' },
    { value: 'cerrada', label: 'Cerradas' },
    { value: 'cancelada', label: 'Canceladas' },
];

const METODOS_PAGO = [
    { value: 'escrow', label: 'Escrow (SUGEF)' },
    { value: 'transferencia', label: 'Transferencia bancaria' },
    { value: 'financiamiento', label: 'Financiamiento' },
    { value: 'mixto', label: 'Mixto' },
    { value: 'deposito_garantia', label: 'Depósito de garantía' },
];

const EMPTY_FORM = {
    propiedad_id: '',
    cliente_id: '',
    tipo_transaccion: 'venta',
    fecha_inicio: '',
    fecha_fin: '',
    plazo_meses: '',
    monto_total: '',
    moneda: 'USD',
    metodo_pago: 'escrow',
    notas: '',
};

const normalizar = (str) =>
    String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const formatMontoTransaccion = (t) => {
    const base = formatPrice(t.monto_total, t.moneda);
    return t.tipo_transaccion === 'alquiler' ? `${base} / mes` : base;
};

export default function TransaccionesAdmin({ currentUser }) {
    const [transacciones, setTransacciones] = useState([]);
    const [propiedades, setPropiedades] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState(EMPTY_FORM);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [transRes, propRes, cliRes] = await Promise.all([
                api.transacciones.getAll(),
                api.propiedades.getAll(),
                api.clientes.getAll(),
            ]);
            setTransacciones(transRes);
            setPropiedades(propRes.filter((p) => p.estado_comercial === 'disponible' && p.activa));
            setClientes(cliRes.filter((c) => c.activo));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const transaccionesFiltradas = useMemo(() => {
        const q = normalizar(busqueda).trim();
        const soloDigitos = q.replace(/\D/g, '');

        return transacciones.filter((t) => {
            if (filtro !== 'todos' && t.estado !== filtro) return false;
            if (!q) return true;

            const clienteNombre = t.cliente_razon_social
                || `${t.cliente_nombre || ''} ${t.cliente_apellidos || ''}`.trim();

            const campos = [
                t.id,
                t.propiedad_titulo,
                clienteNombre,
            ].map(normalizar).join(' ');

            const coincideTexto = campos.includes(q);
            const coincideId = soloDigitos.length > 0 && String(t.id).includes(soloDigitos);

            return coincideTexto || coincideId;
        });
    }, [transacciones, filtro, busqueda]);

    const propiedadSeleccionada = useMemo(
        () => propiedades.find((p) => String(p.id) === String(formData.propiedad_id)),
        [propiedades, formData.propiedad_id]
    );

    const tipoTransaccionFijo = !!propiedadSeleccionada && propiedadSeleccionada.tipo_operacion !== 'ambos';
    const precioFijo = !!propiedadSeleccionada && propiedadSeleccionada.tipo_precio === 'fijo';
    const esAlquiler = formData.tipo_transaccion === 'alquiler';

    const totalContrato = useMemo(() => {
        if (!esAlquiler) return null;
        const monto = Number(formData.monto_total);
        const meses = Number(formData.plazo_meses);
        if (!monto || !meses || isNaN(monto) || isNaN(meses)) return null;
        return monto * meses;
    }, [esAlquiler, formData.monto_total, formData.plazo_meses]);

    const resetForm = () => {
        setFormData(EMPTY_FORM);
    };

    const handlePropertyChange = (propiedadId) => {
        const prop = propiedades.find((p) => String(p.id) === String(propiedadId));
        if (!prop) {
            setFormData({ ...EMPTY_FORM, propiedad_id: propiedadId, cliente_id: formData.cliente_id });
            return;
        }

        let tipoTransaccion = formData.tipo_transaccion;
        if (prop.tipo_operacion === 'venta') tipoTransaccion = 'venta';
        else if (prop.tipo_operacion === 'alquiler') tipoTransaccion = 'alquiler';
        else tipoTransaccion = 'venta';

        setFormData((prev) => ({
            ...prev,
            propiedad_id: propiedadId,
            tipo_transaccion: tipoTransaccion,
            monto_total: String(prop.precio),
            moneda: prop.moneda,
            fecha_fin: tipoTransaccion === 'venta' ? '' : prev.fecha_fin,
            plazo_meses: tipoTransaccion === 'venta' ? '' : prev.plazo_meses,
        }));
    };

    const handleTipoTransaccionChange = (nuevoTipo) => {
        setFormData((prev) => ({
            ...prev,
            tipo_transaccion: nuevoTipo,
            ...(nuevoTipo === 'venta' ? { fecha_fin: '', plazo_meses: '' } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.propiedad_id || !formData.cliente_id) {
            toast.error('Debes seleccionar una propiedad y un cliente de la lista.');
            return;
        }
        if (esAlquiler && !formData.plazo_meses) {
            toast.error('Para alquileres debes indicar el plazo en meses.');
            return;
        }
        try {
            await api.transacciones.create(formData);
            toast.success('Transacción registrada con éxito.');
            setShowForm(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleCerrar = async (transaccion) => {
        const confirmed = await confirmDialog({
            title: 'Cerrar transacción',
            message: `¿Confirmas cerrar la transacción #${transaccion.id}? La propiedad quedará como ${transaccion.tipo_transaccion === 'venta' ? 'vendida' : 'alquilada'} y se desactivará en 7 días.`,
            confirmText: 'Cerrar transacción',
            variant: 'primary',
        });
        if (!confirmed) return;
        try {
            await api.transacciones.cerrar(transaccion.id);
            toast.success('Transacción cerrada. Desactivación programada en 7 días.');
            loadData();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleCancelar = async (transaccion) => {
        const confirmed = await confirmDialog({
            title: 'Cancelar transacción',
            message: `¿Seguro que deseas cancelar la transacción #${transaccion.id}?`,
            confirmText: 'Cancelar transacción',
            variant: 'danger',
        });
        if (!confirmed) return;
        try {
            await api.transacciones.cancelar(transaccion.id);
            toast.success('Transacción cancelada.');
            loadData();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <div>
            <div className="admin-actions mb-3">
                <LiquidGlassButton variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
                    + Nueva Transacción
                </LiquidGlassButton>
            </div>

            {showForm && (
                <LiquidGlassPanel liquid className="admin-panel mb-4">
                    <h3 className="admin-panel-title">Registrar Venta / Alquiler</h3>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Propiedad</label>
                            <SearchableSelect
                                options={propiedades}
                                value={formData.propiedad_id}
                                onChange={handlePropertyChange}
                                getValue={(p) => p.id}
                                getLabel={(p) => `#${p.id} — ${p.titulo}`}
                                getSearchText={(p) => `${p.id} ${p.titulo} ${p.ubicacion || ''}`}
                                placeholder="Buscar propiedad por ID, título o ubicación..."
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Cliente</label>
                            <SearchableSelect
                                options={clientes}
                                value={formData.cliente_id}
                                onChange={(id) => setFormData({ ...formData, cliente_id: id })}
                                getValue={(c) => c.id}
                                getLabel={(c) => {
                                    const nombre = c.razon_social || `${c.nombre || ''} ${c.apellidos || ''}`.trim();
                                    return `${nombre} — ${c.documento_identidad}`;
                                }}
                                getSearchText={(c) => `${c.documento_identidad || ''} ${c.nombre || ''} ${c.apellidos || ''} ${c.razon_social || ''}`}
                                placeholder="Buscar cliente por cédula o nombre..."
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Tipo de transacción</label>
                            <select
                                className="form-select"
                                value={formData.tipo_transaccion}
                                onChange={(e) => handleTipoTransaccionChange(e.target.value)}
                                disabled={tipoTransaccionFijo}
                            >
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                            </select>
                            {tipoTransaccionFijo && (
                                <div className="form-text">
                                    Definido por la propiedad seleccionada.
                                </div>
                            )}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Fecha de inicio</label>
                            <input
                                type="date"
                                className="form-control"
                                required
                                value={formData.fecha_inicio}
                                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Fecha de fin</label>
                            <input
                                type="date"
                                className="form-control"
                                value={esAlquiler ? formData.fecha_fin : ''}
                                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                                disabled={!esAlquiler}
                            />
                            {!esAlquiler && (
                                <div className="form-text">
                                    Solo aplica para alquileres.
                                </div>
                            )}
                        </div>

                        {esAlquiler && (
                            <div className="col-md-4">
                                <label className="form-label">Plazo (meses)</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    required
                                    value={formData.plazo_meses}
                                    onChange={(e) => setFormData({ ...formData, plazo_meses: e.target.value })}
                                />
                            </div>
                        )}

                        <div className={esAlquiler ? 'col-md-4' : 'col-md-8'}>
                            <label className="form-label">
                                {esAlquiler ? 'Canon mensual' : 'Precio de venta'}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                required
                                value={formData.monto_total}
                                onChange={(e) => setFormData({ ...formData, monto_total: e.target.value })}
                                disabled={precioFijo}
                            />
                            {precioFijo && propiedadSeleccionada ? (
                                <div className="form-text">
                                    Precio fijo definido en la propiedad.
                                </div>
                            ) : (
                                <div className="form-text">
                                    Se autocompleta con el precio de la propiedad. Puedes ajustarlo si es negociable.
                                </div>
                            )}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Moneda</label>
                            <select
                                className="form-select"
                                value={formData.moneda}
                                onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                                disabled={precioFijo}
                            >
                                <option value="USD">USD</option>
                                <option value="CRC">CRC</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>

                        {esAlquiler && totalContrato !== null && (
                            <div className="col-12">
                                <div className="alert alert-info py-2 mb-0">
                                    <strong>Total del contrato:</strong>{' '}
                                    {formatPrice(totalContrato, formData.moneda)} ({formData.plazo_meses} meses ×{' '}
                                    {formatPrice(Number(formData.monto_total), formData.moneda)})
                                </div>
                            </div>
                        )}

                        <div className="col-md-6">
                            <label className="form-label">Método de pago</label>
                            <select
                                className="form-select"
                                value={formData.metodo_pago}
                                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                            >
                                {METODOS_PAGO.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label">Notas</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            />
                        </div>

                        <div className="col-12 d-flex gap-2">
                            <LiquidGlassButton variant="primary" type="submit">Registrar</LiquidGlassButton>
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
                    placeholder="Buscar por ID, propiedad o cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ maxWidth: '320px' }}
                />
                <select
                    className="form-select"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    {ESTADOS_TRANSACCION.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <span className="admin-spinner" aria-hidden="true" />
                    <span>Cargando transacciones...</span>
                </div>
            ) : transaccionesFiltradas.length === 0 ? (
                <div className="admin-empty">
                    {busqueda || filtro !== 'todos'
                        ? 'No se encontraron transacciones con los filtros actuales.'
                        : 'No hay transacciones registradas.'}
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Propiedad</th>
                                <th>Cliente</th>
                                <th>Tipo</th>
                                <th>Monto</th>
                                <th>Método</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaccionesFiltradas.map((t) => (
                                <tr key={t.id}>
                                    <td className="text-center fw-bold">#{t.id}</td>
                                    <td className="admin-cell-main">{t.propiedad_titulo}</td>
                                    <td className="admin-cell-sub">
                                        {t.cliente_razon_social || `${t.cliente_nombre || ''} ${t.cliente_apellidos || ''}`.trim()}
                                    </td>
                                    <td className="text-capitalize">{t.tipo_transaccion}</td>
                                    <td className="fw-semibold">{formatMontoTransaccion(t)}</td>
                                    <td className="text-capitalize">{t.metodo_pago}</td>
                                    <td>
                                        {t.estado === 'en_proceso' && <span className="admin-badge admin-badge--primary">En proceso</span>}
                                        {t.estado === 'cerrada' && <span className="admin-badge admin-badge--success">Cerrada</span>}
                                        {t.estado === 'cancelada' && <span className="admin-badge admin-badge--danger">Cancelada</span>}
                                    </td>
                                    <td>
                                        <div className="admin-action-group">
                                            {t.estado === 'en_proceso' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCerrar(t)}
                                                        className="admin-action-btn admin-action-btn--success"
                                                    >
                                                        Cerrar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelar(t)}
                                                        className="admin-action-btn admin-action-btn--danger"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
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