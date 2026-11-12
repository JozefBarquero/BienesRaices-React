import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import SearchFilterBar from '@/components/Admin/AdminDashboard/SearchFilterBar';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import { formatPrice } from '@/utils/formatters';
import '@/assets/styles/admin.css';

const PropertyForm = lazy(() => import('@/components/ui/PropertyForm'));
const Dashboard = lazy(() => import('@/components/Admin/AdminDashboard/Dashboard'));
const UsuariosAdmin = lazy(() => import('@/components/Admin/AdminDashboard/UsuariosAdmin'));
const PropietariosAdmin = lazy(() => import('@/components/Admin/AdminDashboard/PropietariosAdmin'));
const MensajesAdmin = lazy(() => import('@/components/Admin/AdminDashboard/MensajesAdmin'));
const ClientesAdmin = lazy(() => import('@/components/Admin/AdminDashboard/ClientesAdmin'));
const TransaccionesAdmin = lazy(() => import('@/components/Admin/AdminDashboard/TransaccionesAdmin'));

const normalizar = (str) =>
    String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const FILTROS_PROPIEDADES = [
    { value: 'todas', label: 'Todas' },
    { value: 'activas', label: 'Solo activas' },
    { value: 'inactivas', label: 'Solo inactivas' },
    { value: 'disponibles', label: 'Disponibles' },
    { value: 'vendidas', label: 'Vendidas' },
    { value: 'alquiladas', label: 'Alquiladas' },
];

const TABS = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'propiedades', label: 'Propiedades' },
    { key: 'propietarios', label: 'Propietarios' },
    { key: 'clientes', label: 'Clientes' },
    { key: 'transacciones', label: 'Ventas / Alquileres' },
    { key: 'mensajes', label: 'Mensajes' },
];

const ESTADO_COMERCIAL_LABELS = {
    disponible: 'Disponible',
    vendida: 'Vendida',
    alquilada: 'Alquilada',
};

const diasParaDesactivar = (fechaStr) => {
    if (!fechaStr) return null;
    const ahora = new Date();
    const objetivo = new Date(fechaStr);
    if (isNaN(objetivo.getTime())) return null;
    const diff = Math.ceil((objetivo - ahora) / (1000 * 60 * 60 * 24));
    return diff < 0 ? 0 : diff;
};

const rowTint = (estadoComercial) => {
    if (estadoComercial === 'vendida') return { backgroundColor: 'rgba(185, 28, 28, 0.05)' };
    if (estadoComercial === 'alquilada') return { backgroundColor: 'rgba(194, 65, 12, 0.05)' };
    return undefined;
};

const renderEstadoComercial = (p) => {
    const estado = p.estado_comercial || 'disponible';
    const dias = diasParaDesactivar(p.fecha_desactivacion_programada);

    if (estado === 'disponible') {
        return <span className="admin-badge admin-badge--neutral">Disponible</span>;
    }

    const esVendida = estado === 'vendida';
    const badgeClass = esVendida ? 'admin-badge--danger' : 'admin-badge--warning';
    const textClass = esVendida ? 'text-danger-emphasis' : 'text-warning-emphasis';

    return (
        <>
            <span className={`admin-badge ${badgeClass}`}>
                ✓ {ESTADO_COMERCIAL_LABELS[estado]}
            </span>
            {p.activa ? (
                dias !== null && (
                    <span className={`d-block small mt-1 fw-semibold ${textClass}`}>
                        Se desactiva en {dias} día{dias === 1 ? '' : 's'}
                    </span>
                )
            ) : (
                <span className="d-block small text-body-secondary mt-1">
                    Ya desactivada
                </span>
            )}
        </>
    );
};

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todas');

    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await api.auth.verify();
                setCurrentUser(userRes.user);
                await loadProperties();
            } catch (error) {
                console.error(error);
                navigate('/admin');
            }
        };
        init();
    }, [navigate]);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const data = await api.propiedades.getAllAdmin();
            setPropiedades(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const propiedadesFiltradas = useMemo(() => {
        const q = normalizar(busqueda).trim();
        const soloDigitos = q.replace(/\D/g, '');

        return propiedades.filter((p) => {
            if (filtro === 'activas' && !p.activa) return false;
            if (filtro === 'inactivas' && p.activa) return false;
            if (filtro === 'disponibles' && p.estado_comercial !== 'disponible') return false;
            if (filtro === 'vendidas' && p.estado_comercial !== 'vendida') return false;
            if (filtro === 'alquiladas' && p.estado_comercial !== 'alquilada') return false;

            if (!q) return true;

            const campos = [
                p.id,
                p.titulo,
                p.descripcion_corta,
                p.tipo_inmueble_texto,
                p.tipo_operacion,
                p.ubicacion,
                p.propietario_razon_social,
                p.propietario_nombre,
                p.propietario_apellidos,
                p.propietario_documento,
            ].map(normalizar).join(' ');

            const coincideTexto = campos.includes(q);
            const coincideId = soloDigitos.length > 0 && String(p.id).includes(soloDigitos);

            return coincideTexto || coincideId;
        });
    }, [propiedades, busqueda, filtro]);

    const handleLogout = async () => {
        await api.auth.logout();
        navigate('/admin');
    };

    const handleToggleActive = async (propiedad) => {
        const nuevaActiva = !propiedad.activa;
        const accion = nuevaActiva ? 'activar' : 'desactivar';
        const confirmed = await confirmDialog({
            title: `${nuevaActiva ? 'Activar' : 'Desactivar'} propiedad`,
            message: `¿Seguro que deseas ${accion} esta propiedad?`,
            confirmText: nuevaActiva ? 'Activar' : 'Desactivar',
            variant: nuevaActiva ? 'primary' : 'danger',
        });
        if (!confirmed) return;
        try {
            await api.propiedades.toggleActiva(propiedad.id, nuevaActiva);
            toast.success(`Propiedad ${nuevaActiva ? 'activada' : 'desactivada'} con éxito.`);
            loadProperties();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingProperty) {
                await api.propiedades.update(editingProperty.id, data);
                toast.success('Propiedad actualizada con éxito.');
            } else {
                await api.propiedades.create(data);
                toast.success('Propiedad creada con éxito.');
            }
            setShowForm(false);
            setEditingProperty(null);
            loadProperties();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleEdit = (propiedad) => {
        setEditingProperty(propiedad);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingProperty(null);
        setShowForm(true);
    };

    const handleQuickNewProperty = () => {
        setEditingProperty(null);
        setShowForm(true);
        setActiveTab('propiedades');
    };

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        if (tab !== 'propiedades') {
            setShowForm(false);
            setEditingProperty(null);
        }
    };

    return (
        <main className="admin-shell">
            <div className="container">
                <div className="admin-topbar lg lg--soft">
                    <h1 className="admin-title">Panel de Administración</h1>

                    <div className="admin-user">
                        {currentUser && (
                            <span className="admin-user-info">
                                Hola, <strong>{currentUser.nombre}</strong> ({currentUser.email})
                            </span>
                        )}
                        <LiquidGlassButton variant="ghost-danger" onClick={handleLogout}>
                            Cerrar Sesión
                        </LiquidGlassButton>
                    </div>
                </div>

                <nav className="admin-tabs" aria-label="Secciones del panel">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`admin-tab${activeTab === tab.key ? ' active' : ''}`}
                            onClick={() => handleChangeTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                    {currentUser?.rol === 'Administrador' && (
                        <button
                            type="button"
                            className={`admin-tab${activeTab === 'usuarios' ? ' active' : ''}`}
                            onClick={() => handleChangeTab('usuarios')}
                        >
                            Trabajadores
                        </button>
                    )}
                </nav>

                <Suspense fallback={<div className="admin-loading justify-content-center p-5"><span className="admin-spinner" /></div>}>
                {activeTab === 'dashboard' && (
                    <Dashboard
                        currentUser={currentUser}
                        onNavigate={handleChangeTab}
                        onNewProperty={handleQuickNewProperty}
                    />
                )}

                {activeTab === 'propiedades' && (
                    showForm ? (
                        <LiquidGlassPanel liquid className="admin-panel">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                                <h2 className="admin-panel-title mb-0">
                                    {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
                                </h2>
                                {editingProperty && (
                                    <a
                                        href={`/catalogo/${editingProperty.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-action-btn admin-action-btn--primary"
                                    >
                                        Previsualizar Propiedad
                                    </a>
                                )}
                            </div>
                            <PropertyForm
                                initialData={editingProperty}
                                onSubmit={handleFormSubmit}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingProperty(null);
                                }}
                            />
                        </LiquidGlassPanel>
                    ) : (
                        <>
                            <div className="admin-actions">
                                <LiquidGlassButton variant="primary" onClick={handleAddNew}>
                                    + Agregar Nueva Propiedad
                                </LiquidGlassButton>
                            </div>

                            <SearchFilterBar
                                search={busqueda}
                                onSearchChange={setBusqueda}
                                placeholder="Buscar por título, ID, propietario, ubicación..."
                                filter={filtro}
                                onFilterChange={setFiltro}
                                filterOptions={FILTROS_PROPIEDADES}
                            />

                            {loading ? (
                                <div className="admin-loading">
                                    <span className="admin-spinner" aria-hidden="true" />
                                    <span>Cargando propiedades...</span>
                                </div>
                            ) : propiedadesFiltradas.length === 0 ? (
                                <div className="admin-empty">
                                    No se encontraron propiedades con los filtros actuales.
                                </div>
                            ) : (
                                <>
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center">ID</th>
                                                    <th>Título</th>
                                                    <th>Operación</th>
                                                    <th>Estado comercial</th>
                                                    <th>Tipo</th>
                                                    <th>Propietario</th>
                                                    <th>Precio</th>
                                                    <th className="text-center">Activa</th>
                                                    <th className="text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {propiedadesFiltradas.map((p) => (
                                                    <tr key={p.id} style={rowTint(p.estado_comercial)}>
                                                        <td className="text-center fw-bold">#{p.id}</td>
                                                        <td className="admin-cell-main">{p.titulo}</td>
                                                        <td className="text-capitalize">{p.tipo_operacion}</td>
                                                        <td>{renderEstadoComercial(p)}</td>
                                                        <td>{p.tipo_inmueble_texto}</td>
                                                        <td className="admin-cell-sub">
                                                            {p.propietario_razon_social || `${p.propietario_nombre || ''} ${p.propietario_apellidos || ''}`.trim() || '—'}
                                                        </td>
                                                        <td className="fw-semibold">{formatPrice(p.precio, p.moneda)}</td>
                                                        <td className="text-center">
                                                            {p.activa ? (
                                                                <span className="admin-badge admin-badge--success">Activa</span>
                                                            ) : (
                                                                <span className="admin-badge admin-badge--danger">Inactiva</span>
                                                            )}
                                                            {p.destacada === 1 && (
                                                                <span className="admin-badge admin-badge--accent d-block mt-1">★ Destacada</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="admin-action-group">
                                                                <a
                                                                    href={`/catalogo/${p.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="admin-action-btn"
                                                                >
                                                                    Previsualizar
                                                                </a>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEdit(p)}
                                                                    className="admin-action-btn admin-action-btn--primary"
                                                                >
                                                                    Editar
                                                                </button>
                                                                {p.activa ? (
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
                                        {propiedadesFiltradas.map((p) => (
                                            <div
                                                key={p.id}
                                                className="admin-mobile-card lg lg--soft"
                                                style={rowTint(p.estado_comercial)}
                                            >
                                                <div className="admin-mobile-card-row">
                                                    <div className="d-flex gap-2">
                                                        <span className="admin-badge admin-badge--neutral">#{p.id}</span>
                                                        <span className="admin-badge admin-badge--primary text-capitalize">
                                                            {p.tipo_operacion}
                                                        </span>
                                                    </div>
                                                    <div className="text-end">
                                                        {p.activa ? (
                                                            <span className="admin-badge admin-badge--success">Activa</span>
                                                        ) : (
                                                            <span className="admin-badge admin-badge--danger">Inactiva</span>
                                                        )}
                                                        {p.destacada === 1 && (
                                                            <span className="admin-badge admin-badge--accent d-block mt-1">
                                                                ★ Destacada
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <h5 className="admin-mobile-card-title">{p.titulo}</h5>
                                                <p className="admin-mobile-card-sub mb-1">{p.tipo_inmueble_texto}</p>
                                                <p className="admin-mobile-card-sub">
                                                    <strong style={{ color: 'var(--color-heading)' }}>Propietario:</strong>{' '}
                                                    {p.propietario_razon_social || `${p.propietario_nombre || ''} ${p.propietario_apellidos || ''}`.trim() || '—'}
                                                </p>
                                                <p className="admin-mobile-card-sub">
                                                    <strong style={{ color: 'var(--color-heading)' }}>Estado comercial:</strong>{' '}
                                                    {renderEstadoComercial(p)}
                                                </p>

                                                <div className="admin-mobile-card-price">{formatPrice(p.precio, p.moneda)}</div>

                                                <div className="admin-mobile-card-actions">
                                                    <a
                                                        href={`/catalogo/${p.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="admin-action-btn"
                                                    >
                                                        Previsualizar
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(p)}
                                                        className="admin-action-btn admin-action-btn--primary"
                                                    >
                                                        Editar
                                                    </button>
                                                    {p.activa ? (
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
                        </>
                    )
                )}

                {activeTab === 'propietarios' && <PropietariosAdmin />}

                {activeTab === 'clientes' && <ClientesAdmin />}

                {activeTab === 'transacciones' && <TransaccionesAdmin currentUser={currentUser} />}

                {activeTab === 'mensajes' && <MensajesAdmin currentUser={currentUser} />}

                {activeTab === 'usuarios' && currentUser?.rol === 'Administrador' && (
                    <UsuariosAdmin currentUser={currentUser} />
                )}
                </Suspense>
            </div>
        </main>
    );
}