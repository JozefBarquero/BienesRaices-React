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

const FILTROS_TIPO = [
    { value: 'todas', label: 'Todas las consultas' },
    { value: 'general', label: 'Consultas generales' },
    { value: 'propiedad', label: 'Por propiedad' },
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
    const [tipoConsulta, setTipoConsulta] = useState('todas');
    
    const [contactModal, setContactModal] = useState(null);

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

            if (tipoConsulta === 'general' && m.propiedad_titulo) return false;
            if (tipoConsulta === 'propiedad' && !m.propiedad_titulo) return false;

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
    }, [mensajes, busqueda, filtro, tipoConsulta]);

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
            confirmType: 'danger',
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

    const getWhatsAppLink = (telefono, nombre) => {
        if (!telefono) return null;
        const cleanPhone = telefono.replace(/\D/g, '');
        const text = encodeURIComponent(`Hola ${nombre}, le escribimos de Bienes Raíces Horquetas de Sarapiquí en respuesta a su consulta.`);
        return `https://wa.me/${cleanPhone}?text=${text}`;
    };

    const getMailtoLink = (email, nombre) => {
        if (!email) return null;
        const subject = encodeURIComponent('Respuesta a su consulta - Bienes Raíces Horquetas');
        const body = encodeURIComponent(`Hola ${nombre},\n\nHemos recibido su mensaje y nos gustaría ponernos en contacto con usted.\n\nSaludos cordiales,\nEquipo de Bienes Raíces.`);
        return `mailto:${email}?subject=${subject}&body=${body}`;
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
                secondaryFilter={tipoConsulta}
                onSecondaryFilterChange={setTipoConsulta}
                secondaryFilterOptions={FILTROS_TIPO}
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
                                            {m.telefono_cliente && <div className="admin-cell-sub">{m.telefono_cliente}</div>}
                                        </td>
                                        <td className="admin-cell-sub">
                                            {m.propiedad_titulo || <span className="text-muted">General</span>}
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
                                                    onClick={() => setContactModal(m)}
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
                                {m.propiedad_titulo ? (
                                    <p className="admin-mobile-card-sub text-break">Propiedad: {m.propiedad_titulo}</p>
                                ) : (
                                    <p className="admin-mobile-card-sub text-muted">Consulta general</p>
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
                                        onClick={() => setContactModal(m)}
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
                            {detalle.propiedad_titulo ? (
                                <p><strong>Propiedad:</strong> {detalle.propiedad_titulo}</p>
                            ) : (
                                <p><strong>Tipo:</strong> Consulta general</p>
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

            {contactModal && (
                <div
                    className="admin-modal-backdrop"
                    onClick={(e) => { if (e.target === e.currentTarget) setContactModal(null); }}
                >
                    <LiquidGlassPanel liquid className="admin-modal" style={{ maxWidth: '420px' }}>
                        <div className="admin-modal-header">
                            <h5 className="admin-modal-title">Contactar a {contactModal.nombre_cliente}</h5>
                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => setContactModal(null)}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="d-flex flex-column gap-2 mb-4">
                                {contactModal.email_cliente && (
                                    <div className="d-flex align-items-center gap-2 small text-muted">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg>
                                        <span>{contactModal.email_cliente}</span>
                                    </div>
                                )}
                                {contactModal.telefono_cliente && (
                                    <div className="d-flex align-items-center gap-2 small text-muted">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>
                                        <span>{contactModal.telefono_cliente}</span>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex flex-column gap-3">
                                <a
                                    href={getWhatsAppLink(contactModal.telefono_cliente, contactModal.nombre_cliente)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-action-btn admin-action-btn--success w-100 py-2"
                                    onClick={() => {
                                        registrarContacto(contactModal.id);
                                        setContactModal(null);
                                    }}
                                    style={{ pointerEvents: contactModal.telefono_cliente ? 'auto' : 'none', opacity: contactModal.telefono_cliente ? 1 : 0.5 }}
                                >
                                    Enviar WhatsApp
                                </a>
                                <a
                                    href={getMailtoLink(contactModal.email_cliente, contactModal.nombre_cliente)}
                                    className="admin-action-btn admin-action-btn--primary w-100 py-2"
                                    onClick={() => {
                                        registrarContacto(contactModal.id);
                                        setContactModal(null);
                                    }}
                                    style={{ pointerEvents: contactModal.email_cliente ? 'auto' : 'none', opacity: contactModal.email_cliente ? 1 : 0.5 }}
                                >
                                    Enviar Correo Electrónico
                                </a>
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <LiquidGlassButton variant="ghost" onClick={() => setContactModal(null)}>
                                Cancelar
                            </LiquidGlassButton>
                        </div>
                    </LiquidGlassPanel>
                </div>
            )}
        </div>
    );
}