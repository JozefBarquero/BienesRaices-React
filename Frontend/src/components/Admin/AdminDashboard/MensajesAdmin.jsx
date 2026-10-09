import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import SearchFilterBar from './SearchFilterBar';

const ESTADOS = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'atendido', label: 'Atendido' },
    { value: 'descartado', label: 'Descartado' }
];

const PRIORIDADES = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' }
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

const badgePrioridad = (p) => {
    if (p === 'alta') return 'bg-danger-subtle text-danger border-danger-subtle';
    if (p === 'baja') return 'bg-success-subtle text-success border-success-subtle';
    return 'bg-warning-subtle text-warning border-warning-subtle';
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
                currentUser?.rol === 'Administrador' ? api.usuarios.getAll() : Promise.resolve([])
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
                m.prioridad
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
                notas_internas: notas
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
                const refrescado = actualizado.find(x => x.id === id);
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
            variant: 'danger'
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
            <div className="d-flex align-items-center gap-3 text-secondary py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <span className="fs-5">Cargando mensajes...</span>
            </div>
        );
    }

    return (
        <div className="mt-2">
            <SearchFilterBar
                search={busqueda}
                onSearchChange={setBusqueda}
                placeholder="Buscar por cliente, email, propiedad o mensaje..."
                filter={filtro}
                onFilterChange={setFiltro}
                filterOptions={FILTROS}
            />

            {mensajesFiltrados.length === 0 ? (
                <div className="alert alert-info text-center py-4">
                    No se encontraron mensajes con los filtros actuales.
                </div>
            ) : (
                <>
                    <div className="table-responsive shadow-sm rounded-4 border overflow-hidden d-none d-md-block">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
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
                                {mensajesFiltrados.map(m => (
                                    <tr key={m.id} className={!m.activo ? 'opacity-50' : ''}>
                                        <td>
                                            <div className="fw-semibold">{m.nombre_cliente}</div>
                                            <div className="text-muted small">{m.email_cliente}</div>
                                        </td>
                                        <td className="small">{m.propiedad_titulo || <span className="text-muted">Consulta general</span>}</td>
                                        <td className="small text-truncate" style={{ maxWidth: '240px' }}>{m.mensaje}</td>
                                        <td><span className="badge bg-secondary-subtle text-secondary border">{m.estado}</span></td>
                                        <td><span className={`badge border ${badgePrioridad(m.prioridad)}`}>{m.prioridad}</span></td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button onClick={() => abrirDetalle(m)} className="btn btn-sm btn-outline-primary">Ver</button>
                                                <button onClick={() => registrarContacto(m.id)} className="btn btn-sm btn-outline-success">Contactar</button>
                                                {m.activo && (
                                                    <button onClick={() => desactivar(m.id)} className="btn btn-sm btn-outline-danger">Desactivar</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-block d-md-none">
                        {mensajesFiltrados.map(m => (
                            <div key={m.id} className={`card shadow-sm border rounded-3 mb-3 p-3 ${!m.activo ? 'opacity-50' : ''}`}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className={`badge border ${badgePrioridad(m.prioridad)}`}>{m.prioridad}</span>
                                    <span className="badge bg-secondary-subtle text-secondary border">{m.estado}</span>
                                </div>
                                <h5 className="fw-bold fs-6 mb-1">{m.nombre_cliente}</h5>
                                <p className="text-muted small mb-1 text-break">{m.email_cliente}</p>
                                {m.propiedad_titulo && <p className="text-muted small mb-1">Propiedad: {m.propiedad_titulo}</p>}
                                <p className="small mb-2">{m.mensaje}</p>
                                <div className="d-flex gap-2">
                                    <button onClick={() => abrirDetalle(m)} className="btn btn-outline-primary btn-sm flex-fill">Ver</button>
                                    <button onClick={() => registrarContacto(m.id)} className="btn btn-outline-success btn-sm flex-fill">Contactar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {detalle && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target === e.currentTarget) setDetalle(null); }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 rounded-4">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Detalle del mensaje</h5>
                                <button type="button" className="btn-close" onClick={() => setDetalle(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <strong>Cliente:</strong> {detalle.nombre_cliente}
                                </div>
                                <div className="mb-3">
                                    <strong>Email:</strong> {detalle.email_cliente}
                                </div>
                                {detalle.telefono_cliente && (
                                    <div className="mb-3"><strong>Teléfono:</strong> {detalle.telefono_cliente}</div>
                                )}
                                {detalle.propiedad_titulo && (
                                    <div className="mb-3"><strong>Propiedad:</strong> {detalle.propiedad_titulo}</div>
                                )}
                                <div className="mb-3">
                                    <strong>Mensaje:</strong>
                                    <p className="mt-2 mb-0">{detalle.mensaje}</p>
                                </div>
                                <div className="mb-3">
                                    <strong>Intentos de contacto:</strong> {detalle.intentos_contacto || 0}
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Estado</label>
                                        <select className="form-select" value={estadoSel} onChange={(e) => setEstadoSel(e.target.value)}>
                                            {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Prioridad</label>
                                        <select className="form-select" value={prioridadSel} onChange={(e) => setPrioridadSel(e.target.value)}>
                                            {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Asignado a</label>
                                        <select className="form-select" value={asignadoSel} onChange={(e) => setAsignadoSel(e.target.value)}>
                                            <option value="">Sin asignar</option>
                                            {trabajadores.map(t => (
                                                <option key={t.id} value={t.id}>{t.nombre} {t.apellidos}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Notas internas</label>
                                    <textarea className="form-control" rows="4" value={notas} onChange={(e) => setNotas(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary" onClick={() => setDetalle(null)}>Cerrar</button>
                                <button className="btn btn-success" onClick={() => registrarContacto(detalle.id)}>Registrar contacto</button>
                                <button className="btn btn-primary" onClick={guardarDetalle}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}