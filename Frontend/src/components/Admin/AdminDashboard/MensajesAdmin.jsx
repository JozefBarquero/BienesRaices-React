import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import SearchFilterBar from './SearchFilterBar';

const ESTADOS = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'atendido', label: 'Atendido' },
    { value: 'descartado', label: 'Descartado' },
];

const PRIORIDADES = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
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

const badgePrioridad = (p) => {
    if (p === 'alta') return 'admin-badge--danger';
    if (p === 'baja') return 'admin-badge--success';
    return 'admin-badge--warning';
};

const badgeEstado = (e) => {
    if (e === 'nuevo') return 'admin-badge--primary';
    if (e === 'en_proceso') return 'admin-badge--warning';
    if (e === 'atendido') return 'admin-badge--success';
    return 'admin-badge--neutral';
};

export default function MensajesAdmin({ currentUser }) {
    const [mensajes, setMensajes] = useState([]);
    const [trabajadores, setTrabajadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detalle, setDetalle] = useState(null);
    const [notas, setNotas] = useState('');
    const [estadoSel, setEstadoSel] = useState('nuevo');
    const [prioridadSel, setPrioridadSel] = useState('media');
    const [asignadoSel, setAsignadoSel] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');

    const load = async () => {
        setLoading(true);
        try {
            const [msgs, users] = await Promise.all([
                api.mensajes.getAll(),
                currentUser?.rol === 'Administrador' ? api.usuarios.getAll() : Promise.resolve([]),
            ]);
            setMensajes(msgs);
            setTrabajadores(users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const mensajesFiltrados = useMemo(() => {
        const q = normalizar(busqueda).trim();

        return mensajes.filter((m) => {
            if (filtro === 'activos' && !m.activo) return false;
            if (filtro === 'inactivos' && m.activo) return false;

            if (!q) return true;

            const campos = [
                m.nombre_cliente,
                m.email_cliente,
                m.telefono_cliente,
                m.mensaje,
                m.propiedad_titulo,
                m.estado,
                m.prioridad,
            ].map(normalizar).join(' ');

            return campos.includes(q);
        });
    }, [mensajes, busqueda, filtro]);

    const abrirDetalle = (m) => {
        setDetalle(m);
        setNotas(m.notas_internas || '');
        setEstadoSel(m.estado || 'nuevo');
        setPrioridadSel(m.prioridad || 'media');
        setAsignadoSel(m.asignado_a || '');
    };

    const guardarDetalle = async () => {
        try {
            await api.mensajes.update(detalle.id, {
                estado: estadoSel,
                prioridad: prioridadSel,
                asignado_a: asignadoSel || null,
                notas_internas: notas,
            });
            toast.success('Mensaje actualizado con éxito.');
            setDetalle(null);
            load();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const registrarContacto = async (id) => {
        try {
            await api.mensajes.registrarContacto(id);
            toast.success('Contacto registrado con éxito.');
            load();
            if (detalle?.id === id) {
                const actualizado = await api.mensajes.getAll();
                const refrescado = actualizado.find((x) => x.id === id);
                if (refrescado) setDetalle(refrescado);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const desactivar = async (id) => {
        const confirmed = await confirmDialog({
            title: 'Desactivar mensaje',
            message: '¿Seguro que deseas desactivar este mensaje?',
            confirmText: 'Desactivar',
            variant: 'danger',
        });
        if (!confirmed) return;
        try {
            await api.mensajes.delete(id);
            toast.success('Mensaje desactivado con éxito.');
            setDetalle(null);
            load();
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <span className="admin-spinner" aria-hidden="true" />
                <span>Cargando mensajes...</span>
            </div>
        );
    }

    return (
        <div>
            <SearchFilterBar
                search={busqueda}
                onSearchChange={setBusqueda}
                placeholder="Buscar por cliente, email, propiedad o mensaje..."
                filter={filtro}
                onFilterChange={setFiltro}
                filterOptions={FILTROS}
            />

            {mensajesFiltrados.length === 0 ? (
                <div className="admin-empty">
                    No se encontraron mensajes con los filtros actuales.
                </div>
            ) : (
                <>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Propiedad</th>
                                    <th>Mensaje</th>
                                    <th>Estado</th>
                                    <th>Prioridad</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mensajesFiltrados.map((m) => (
                                    <tr key={m.id} className={!m.activo ? 'muted-row' : ''}>
                                        <td>
                                            <div className="admin-cell-main">{m.nombre_cliente}</div>
                                            <div className="admin-cell-sub">{m.email_cliente}</div>
                                        </td>
                                        <td className="admin-cell-sub">
                                            {m.propiedad_titulo || 'Consulta general'}
                                        </td>
                                        <td className="admin-cell-sub" style={{ maxWidth: '240px' }}>
                                            <div className="text-truncate">{m.mensaje}</div>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${badgeEstado(m.estado)}`}>
                                                {m.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${badgePrioridad(m.prioridad)}`}>
                                                {m.prioridad}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-action-group">
                                                <button
                                                    type="button"
                                                    onClick={() => abrirDetalle(m)}
                                                    className="admin-action-btn admin-action-btn--primary"
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => registrarContacto(m.id)}
                                                    className="admin-action-btn admin-action-btn--success"
                                                >
                                                    Contactar
                                                </button>
                                                {m.activo && (
                                                    <button
                                                        type="button"
                                                        onClick={() => desactivar(m.id)}
                                                        className="admin-action-btn admin-action-btn--danger"
                                                    >
                                                        Desactivar
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
                        {mensajesFiltrados.map((m) => (
                            <div key={m.id} className={`admin-mobile-card lg lg--soft ${!m.activo ? 'opacity-50' : ''}`}>
                                <div className="admin-mobile-card-row">
                                    <span className={`admin-badge ${badgePrioridad(m.prioridad)}`}>
                                        {m.prioridad}
                                    </span>
                                    <span className={`admin-badge ${badgeEstado(m.estado)}`}>
                                        {m.estado}
                                    </span>
                                </div>
                                <h5 className="admin-mobile-card-title">{m.nombre_cliente}</h5>
                                <p className="admin-mobile-card-sub text-break">{m.email_cliente}</p>
                                {m.propiedad_titulo && (
                                    <p className="admin-mobile-card-sub">Propiedad: {m.propiedad_titulo}</p>
                                )}
                                <p className="admin-mobile-card-sub mt-2">{m.mensaje}</p>
                                <div className="admin-mobile-card-actions">
                                    <button
                                        type="button"
                                        onClick={() => abrirDetalle(m)}
                                        className="admin-action-btn admin-action-btn--primary"
                                    >
                                        Ver
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => registrarContacto(m.id)}
                                        className="admin-action-btn admin-action-btn--success"
                                    >
                                        Contactar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {detalle && (
                <div
                    className="admin-modal-backdrop"
                    onClick={(e) => { if (e.target === e.currentTarget) setDetalle(null); }}
                >
                    <LiquidGlassPanel liquid className="admin-modal">
                        <div className="admin-modal-header">
                            <h5 className="admin-modal-title">Detalle del mensaje</h5>
                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => setDetalle(null)}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-modal-body lg-form">
                            <p><strong>Cliente:</strong> {detalle.nombre_cliente}</p>
                            <p><strong>Email:</strong> {detalle.email_cliente}</p>
                            {detalle.telefono_cliente && (
                                <p><strong>Teléfono:</strong> {detalle.telefono_cliente}</p>
                            )}
                            {detalle.propiedad_titulo && (
                                <p><strong>Propiedad:</strong> {detalle.propiedad_titulo}</p>
                            )}
                            <p><strong>Mensaje:</strong></p>
                            <p style={{ color: 'var(--color-muted)' }}>{detalle.mensaje}</p>
                            <p><strong>Intentos de contacto:</strong> {detalle.intentos_contacto || 0}</p>

                            <div className="row mt-3">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        value={estadoSel}
                                        onChange={(e) => setEstadoSel(e.target.value)}
                                    >
                                        {ESTADOS.map((e) => (
                                            <option key={e.value} value={e.value}>{e.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Prioridad</label>
                                    <select
                                        className="form-select"
                                        value={prioridadSel}
                                        onChange={(e) => setPrioridadSel(e.target.value)}
                                    >
                                        {PRIORIDADES.map((p) => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Asignado a</label>
                                    <select
                                        className="form-select"
                                        value={asignadoSel}
                                        onChange={(e) => setAsignadoSel(e.target.value)}
                                    >
                                        <option value="">Sin asignar</option>
                                        {trabajadores.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.nombre} {t.apellidos}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Notas internas</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <LiquidGlassButton variant="ghost" onClick={() => setDetalle(null)}>
                                Cerrar
                            </LiquidGlassButton>
                            <LiquidGlassButton
                                variant="accent"
                                onClick={() => registrarContacto(detalle.id)}
                            >
                                Registrar contacto
                            </LiquidGlassButton>
                            <LiquidGlassButton variant="primary" onClick={guardarDetalle}>
                                Guardar
                            </LiquidGlassButton>
                        </div>
                    </LiquidGlassPanel>
                </div>
            )}
        </div>
    );
}
