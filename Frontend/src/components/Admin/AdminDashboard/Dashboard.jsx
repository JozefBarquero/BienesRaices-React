import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/formatters';
import '@/assets/styles/dashboard.css';

const IconBuilding = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
    </svg>
);

const IconUsers = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconMessage = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const IconBriefcase = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const IconStar = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const IconArrow = ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconPlus = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const timeAgo = (date) => {
    if (!date) return 'sin fecha';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return 'sin fecha';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `hace ${Math.floor(diff / 86400)} d`;
    return d.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' });
};

const prioridadColor = (p) => {
    if (p === 'alta') return '#dc2626';
    if (p === 'baja') return '#10b981';
    return '#f59e0b';
};

const estadoBadgeClass = (estado) => {
    if (estado === 'nuevo') return 'admin-badge--primary';
    if (estado === 'en_proceso') return 'admin-badge--warning';
    if (estado === 'atendido') return 'admin-badge--success';
    return 'admin-badge--neutral';
};

const estadoLabel = (estado) => {
    if (estado === 'nuevo') return 'Nuevo';
    if (estado === 'en_proceso') return 'En proceso';
    if (estado === 'atendido') return 'Atendido';
    if (estado === 'descartado') return 'Descartado';
    return estado || '—';
};

const StatCard = ({ label, value, hint, icon, tone = 'primary', onClick }) => (
    <div className="col-12 col-sm-6 col-xl-3">
        <div
            className="dash-panel dash-stat p-3 p-md-4 h-100 position-relative"
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
        >
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`dash-stat-icon tone-${tone}`}>
                    {icon}
                </div>
                <span className="dash-arrow">
                    <IconArrow />
                </span>
            </div>
            <div className="dash-stat-value mb-1">{value}</div>
            <div className="text-secondary small fw-semibold">{label}</div>
            {hint && <div className={`dash-stat-hint tone-${tone} mt-2`}>{hint}</div>}
        </div>
    </div>
);

export default function Dashboard({ currentUser, onNavigate, onNewProperty }) {
    const [loading, setLoading] = useState(true);
    const [propiedades, setPropiedades] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const isAdmin = currentUser?.rol === 'Administrador';

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const [props, owners, msgs, users] = await Promise.all([
                    api.propiedades.getAll(),
                    api.propietarios.getAll(),
                    api.mensajes.getAll(),
                    isAdmin ? api.usuarios.getAll() : Promise.resolve([]),
                ]);
                if (!mounted) return;
                setPropiedades(props);
                setPropietarios(owners);
                setMensajes(msgs);
                setUsuarios(users);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [isAdmin]);

    const stats = useMemo(() => {
        const propsActivas = propiedades.filter((p) => p.activa).length;
        const propsDestacadas = propiedades.filter((p) => p.destacada === 1).length;
        const ownersActivos = propietarios.filter((p) => p.activo).length;
        const msgsNuevos = mensajes.filter((m) => m.estado === 'nuevo' && m.activo).length;
        const msgsAlta = mensajes.filter((m) => m.prioridad === 'alta' && m.activo).length;
        const trabajadoresActivos = usuarios.filter((u) => u.activo).length;
        const valorTotal = propiedades.filter((p) => p.activa && p.precio).reduce((s, p) => s + Number(p.precio || 0), 0);
        return { propsActivas, propsDestacadas, ownersActivos, msgsNuevos, msgsAlta, trabajadoresActivos, valorTotal };
    }, [propiedades, propietarios, mensajes, usuarios]);

    const mensajesRecientes = useMemo(() => {
        return [...mensajes]
            .sort((a, b) => {
                const da = new Date(a.created_at || a.fecha_creacion || a.fecha || 0).getTime();
                const db = new Date(b.created_at || b.fecha_creacion || b.fecha || 0).getTime();
                return db - da;
            })
            .slice(0, 5);
    }, [mensajes]);

    const propiedadesRecientes = useMemo(() => {
        return [...propiedades]
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 5);
    }, [propiedades]);

    const saludo = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Buenos días';
        if (h < 19) return 'Buenas tardes';
        return 'Buenas noches';
    };

    const fechaActual = new Date().toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' });

    if (loading) {
        return (
            <div className="admin-loading">
                <span className="admin-spinner" aria-hidden="true" />
                <span>Preparando tu resumen...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="dash-hero rounded-4 p-4 p-md-5 mb-4 text-white position-relative overflow-hidden">
                <div className="dash-hero-glow-primary" />
                <div className="dash-hero-glow-secondary" />

                <div className="position-relative d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4" style={{ zIndex: 2 }}>
                    <div>
                        <div className="text-uppercase small fw-bold mb-2" style={{ opacity: 0.75, letterSpacing: '0.18em' }}>
                            Panel general
                        </div>
                        <h2 className="fw-bolder mb-2 text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.15rem)' }}>
                            {saludo()}, {currentUser?.nombre?.split(' ')[0] || 'equipo'}
                        </h2>
                        <p className="mb-0" style={{ opacity: 0.86, maxWidth: 560 }}>
                            {stats.msgsNuevos > 0
                                ? `Tienes ${stats.msgsNuevos} ${stats.msgsNuevos === 1 ? 'mensaje nuevo' : 'mensajes nuevos'} esperando respuesta.`
                                : 'No tienes mensajes pendientes por atender.'}
                            {stats.msgsAlta > 0 && ` Hay ${stats.msgsAlta} con prioridad alta.`}
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        <div>
                            <div className="small text-uppercase fw-semibold" style={{ opacity: 0.7, letterSpacing: '0.14em' }}>Hoy</div>
                            <div className="fs-6 fw-bold text-capitalize">{fechaActual}</div>
                        </div>
                        <button
                            type="button"
                            onClick={onNewProperty}
                            className="lg-btn"
                            style={{ background: 'rgba(255, 255, 255, 0.9)', color: 'var(--color-brand-3)' }}
                        >
                            <IconPlus />
                            <span>Nueva propiedad</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <StatCard
                    label="Propiedades activas"
                    value={stats.propsActivas}
                    hint={stats.propsDestacadas > 0 ? `${stats.propsDestacadas} destacada${stats.propsDestacadas === 1 ? '' : 's'}` : `${propiedades.length} en total`}
                    icon={<IconBuilding />}
                    tone="primary"
                    onClick={() => onNavigate('propiedades')}
                />
                <StatCard
                    label="Propietarios activos"
                    value={stats.ownersActivos}
                    hint={`${propietarios.length} registrado${propietarios.length === 1 ? '' : 's'}`}
                    icon={<IconUsers />}
                    tone="success"
                    onClick={() => onNavigate('propietarios')}
                />
                <StatCard
                    label="Mensajes nuevos"
                    value={stats.msgsNuevos}
                    hint={stats.msgsAlta > 0 ? `${stats.msgsAlta} de alta prioridad` : 'Sin prioridad alta'}
                    icon={<IconMessage />}
                    tone="warning"
                    onClick={() => onNavigate('mensajes')}
                />
                {isAdmin ? (
                    <StatCard
                        label="Trabajadores activos"
                        value={stats.trabajadoresActivos}
                        hint={`${usuarios.length} en el sistema`}
                        icon={<IconBriefcase />}
                        tone="violet"
                        onClick={() => onNavigate('usuarios')}
                    />
                ) : (
                    <StatCard
                        label="Propiedades destacadas"
                        value={stats.propsDestacadas}
                        hint={stats.valorTotal > 0 ? formatPrice(stats.valorTotal) : 'Sin datos'}
                        icon={<IconStar />}
                        tone="rose"
                        onClick={() => onNavigate('propiedades')}
                    />
                )}
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className="dash-panel p-3 p-md-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h3 className="dash-section-label mb-1">Mensajes recientes</h3>
                                <p className="text-secondary small mb-0">Últimas consultas recibidas</p>
                            </div>
                            <button type="button" onClick={() => onNavigate('mensajes')} className="dash-link">
                                Ver todos
                            </button>
                        </div>

                        {mensajesRecientes.length === 0 ? (
                            <div className="text-center text-secondary py-5 small">
                                Aún no hay mensajes registrados.
                            </div>
                        ) : (
                            <ul className="list-unstyled mb-0">
                                {mensajesRecientes.map((m) => {
                                    const inicial = (m.nombre_cliente || '?').trim().charAt(0).toUpperCase();
                                    return (
                                        <li key={m.id} className="dash-divider d-flex align-items-start gap-3 py-3">
                                            <div className="dash-avatar">{inicial}</div>
                                            <div className="flex-grow-1 min-w-0">
                                                <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                                                    <div className="fw-semibold text-body text-truncate">{m.nombre_cliente || 'Anónimo'}</div>
                                                    <span className="text-secondary small text-nowrap">
                                                        {timeAgo(m.created_at || m.fecha_creacion || m.fecha)}
                                                    </span>
                                                </div>
                                                <div className="text-secondary small text-truncate mb-2">{m.mensaje}</div>
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <span className={`admin-badge dash-badge-estado ${estadoBadgeClass(m.estado)}`}>
                                                        {estadoLabel(m.estado)}
                                                    </span>
                                                    <span className="d-inline-flex align-items-center gap-1 text-secondary small">
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: prioridadColor(m.prioridad), display: 'inline-block' }} />
                                                        {m.prioridad}
                                                    </span>
                                                    {m.propiedad_titulo && (
                                                        <span className="text-secondary small text-truncate" style={{ maxWidth: 220 }}>
                                                            · {m.propiedad_titulo}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="dash-panel p-3 p-md-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h3 className="dash-section-label mb-1">Propiedades recientes</h3>
                                <p className="text-secondary small mb-0">Últimas publicaciones</p>
                            </div>
                            <button type="button" onClick={() => onNavigate('propiedades')} className="dash-link">
                                Ver todas
                            </button>
                        </div>

                        {propiedadesRecientes.length === 0 ? (
                            <div className="text-center text-secondary py-5 small">
                                Aún no hay propiedades registradas.
                            </div>
                        ) : (
                            <ul className="list-unstyled mb-0">
                                {propiedadesRecientes.map((p) => (
                                    <li key={p.id} className="dash-divider py-3">
                                        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                            <div className="fw-semibold text-body text-truncate">{p.titulo}</div>
                                            {p.activa ? (
                                                <span className="admin-badge admin-badge--success dash-badge-estado">Activa</span>
                                            ) : (
                                                <span className="admin-badge admin-badge--danger dash-badge-estado">Inactiva</span>
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                            <span className="text-secondary small text-truncate">
                                                {p.tipo_inmueble_texto}{p.ubicacion ? ` · ${p.ubicacion}` : ''}
                                            </span>
                                            <span className="dash-price small">{formatPrice(p.precio)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}