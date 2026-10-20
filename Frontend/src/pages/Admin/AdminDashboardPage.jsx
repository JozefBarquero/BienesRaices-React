import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import PropertyForm from '@/components/ui/PropertyForm';
import Dashboard from '@/components/Admin/AdminDashboard/Dashboard';
import UsuariosAdmin from '@/components/Admin/AdminDashboard/UsuariosAdmin';
import PropietariosAdmin from '@/components/Admin/AdminDashboard/PropietariosAdmin';
import MensajesAdmin from '@/components/Admin/AdminDashboard/MensajesAdmin';
import SearchFilterBar from '@/components/Admin/AdminDashboard/SearchFilterBar';
import { LiquidGlassPanel, LiquidGlassButton } from '@/components/ui/LiquidGlass';
import { formatPrice } from '@/utils/formatters';
import '@/assets/styles/admin.css';

const normalizar = (str) =>
    String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const FILTROS_PROPIEDADES = [
    { value: 'todas', label: 'Todas' },
    { value: 'activas', label: 'Solo activas' },
    { value: 'inactivas', label: 'Solo inactivas' },
];

const TABS = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'propiedades', label: 'Propiedades' },
    { key: 'propietarios', label: 'Propietarios' },
    { key: 'mensajes', label: 'Mensajes' },
];

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
            const data = await api.propiedades.getAll();
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
                            <h2 className="admin-panel-title">
                                {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
                            </h2>
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
                                                    <th>Tipo</th>
                                                    <th>Propietario</th>
                                                    <th>Precio</th>
                                                    <th className="text-center">Estado</th>
                                                    <th className="text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {propiedadesFiltradas.map((p) => (
                                                    <tr key={p.id}>
                                                        <td className="text-center fw-bold">#{p.id}</td>
                                                        <td className="admin-cell-main">{p.titulo}</td>
                                                        <td className="text-capitalize">{p.tipo_operacion}</td>
                                                        <td>{p.tipo_inmueble_texto}</td>
                                                        <td className="admin-cell-sub">
                                                            {p.propietario_razon_social || `${p.propietario_nombre || ''} ${p.propietario_apellidos || ''}`.trim() || '—'}
                                                        </td>
                                                        <td className="fw-semibold">{formatPrice(p.precio)}</td>
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
                                            <div key={p.id} className="admin-mobile-card lg lg--soft">
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

                                                <div className="admin-mobile-card-price">{formatPrice(p.precio)}</div>

                                                <div className="admin-mobile-card-actions">
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

                {activeTab === 'mensajes' && <MensajesAdmin currentUser={currentUser} />}

                {activeTab === 'usuarios' && currentUser?.rol === 'Administrador' && (
                    <UsuariosAdmin currentUser={currentUser} />
                )}
            </div>
        </main>
    );
}
