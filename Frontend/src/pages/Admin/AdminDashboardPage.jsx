import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { confirmDialog } from '@/components/ui/ConfirmDialog';
import PropertyForm from '@/components/ui/PropertyForm';
import UsuariosAdmin from '@/components/Admin/AdminDashboard/UsuariosAdmin';
import PropietariosAdmin from '@/components/Admin/AdminDashboard/PropietariosAdmin';
import MensajesAdmin from '@/components/Admin/AdminDashboard/MensajesAdmin';
import SearchFilterBar from '@/components/Admin/AdminDashboard/SearchFilterBar';
import { formatPrice } from '@/utils/formatters';

const normalizar = (str) =>
    String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const FILTROS_PROPIEDADES = [
    { value: 'todas', label: 'Todas' },
    { value: 'activas', label: 'Solo activas' },
    { value: 'inactivas', label: 'Solo inactivas' }
];

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('propiedades');

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
                p.propietario_documento
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
            variant: nuevaActiva ? 'primary' : 'danger'
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

    return (
        <div className="container py-4 py-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h1 className="display-6 display-md-5 fw-bolder text-body m-0">Panel de Administración</h1>

                <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
                    {currentUser && (
                        <span className="text-muted small me-sm-2">
                            Hola, <strong>{currentUser.nombre}</strong> ({currentUser.email})
                        </span>
                    )}
                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm align-self-start align-self-sm-center">
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <ul className="nav nav-tabs mb-4 flex-nowrap overflow-auto">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'propiedades' ? 'active' : ''}`} onClick={() => setActiveTab('propiedades')}>
                        Propiedades
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'propietarios' ? 'active' : ''}`} onClick={() => setActiveTab('propietarios')}>
                        Propietarios
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'mensajes' ? 'active' : ''}`} onClick={() => setActiveTab('mensajes')}>
                        Mensajes
                    </button>
                </li>
                {currentUser?.rol === 'Administrador' && (
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>
                            Trabajadores
                        </button>
                    </li>
                )}
            </ul>

            {activeTab === 'propiedades' && (
                showForm ? (
                    <div className="card border-0 shadow-sm p-3 p-md-5 rounded-4">
                        <h2 className="h3 fw-bold mb-4">{editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
                        <PropertyForm
                            initialData={editingProperty}
                            onSubmit={handleFormSubmit}
                            onCancel={() => { setShowForm(false); setEditingProperty(null); }}
                        />
                    </div>
                ) : (
                    <>
                        <button onClick={handleAddNew} className="btn btn-primary mb-3 w-100 w-md-auto">
                            + Agregar Nueva Propiedad
                        </button>

                        <SearchFilterBar
                            search={busqueda}
                            onSearchChange={setBusqueda}
                            placeholder="Buscar por título, ID, propietario, ubicación..."
                            filter={filtro}
                            onFilterChange={setFiltro}
                            filterOptions={FILTROS_PROPIEDADES}
                        />

                        {loading ? (
                            <div className="d-flex align-items-center gap-3 text-secondary py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <span className="fs-5">Cargando propiedades...</span>
                            </div>
                        ) : propiedadesFiltradas.length === 0 ? (
                            <div className="alert alert-info text-center py-4">
                                No se encontraron propiedades con los filtros actuales.
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive shadow-sm rounded-4 border overflow-hidden d-none d-md-block">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col" className="text-center">ID</th>
                                                <th scope="col">Título</th>
                                                <th scope="col">Operación</th>
                                                <th scope="col">Tipo</th>
                                                <th scope="col">Propietario</th>
                                                <th scope="col">Precio</th>
                                                <th scope="col" className="text-center">Estado</th>
                                                <th scope="col" className="text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {propiedadesFiltradas.map(p => (
                                                <tr key={p.id}>
                                                    <td className="text-center fw-bold">{p.id}</td>
                                                    <td className="fw-semibold">{p.titulo}</td>
                                                    <td className="text-capitalize">{p.tipo_operacion}</td>
                                                    <td>{p.tipo_inmueble_texto}</td>
                                                    <td className="text-muted small">
                                                        {p.propietario_razon_social || `${p.propietario_nombre || ''} ${p.propietario_apellidos || ''}`.trim() || '—'}
                                                    </td>
                                                    <td className="fw-semibold">{formatPrice(p.precio)}</td>
                                                    <td className="text-center">
                                                        {p.activa ? (
                                                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Activa</span>
                                                        ) : (
                                                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Inactiva</span>
                                                        )}
                                                        {p.destacada === 1 && (
                                                            <span className="d-block badge bg-warning text-dark mt-1">★ Destacada</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline-primary">
                                                                Editar
                                                            </button>
                                                            {p.activa ? (
                                                                <button onClick={() => handleToggleActive(p)} className="btn btn-sm btn-outline-danger">
                                                                    Desactivar
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => handleToggleActive(p)} className="btn btn-sm btn-outline-success">
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

                                <div className="d-block d-md-none">
                                    {propiedadesFiltradas.map(p => (
                                        <div key={p.id} className="card shadow-sm border rounded-3 mb-3 p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <span className="badge bg-light text-dark border me-1">#{p.id}</span>
                                                    <span className="badge bg-secondary-subtle text-secondary border text-capitalize">{p.tipo_operacion}</span>
                                                </div>
                                                <div className="text-end">
                                                    {p.activa ? (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Activa</span>
                                                    ) : (
                                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Inactiva</span>
                                                    )}
                                                    {p.destacada === 1 && (
                                                        <span className="badge bg-warning text-dark d-block mt-1">★ Destacada</span>
                                                    )}
                                                </div>
                                            </div>

                                            <h5 className="fw-bold fs-6 mb-1">{p.titulo}</h5>
                                            <p className="text-muted small mb-1">{p.tipo_inmueble_texto}</p>
                                            <p className="text-muted small mb-2">
                                                <strong>Propietario:</strong>{' '}
                                                {p.propietario_razon_social || `${p.propietario_nombre || ''} ${p.propietario_apellidos || ''}`.trim() || '—'}
                                            </p>

                                            <div className="fs-5 fw-bold text-primary mb-3">
                                                {formatPrice(p.precio)}
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button onClick={() => handleEdit(p)} className="btn btn-outline-primary btn-sm flex-fill">
                                                    Editar
                                                </button>
                                                {p.activa ? (
                                                    <button onClick={() => handleToggleActive(p)} className="btn btn-outline-danger btn-sm flex-fill">
                                                        Desactivar
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleToggleActive(p)} className="btn btn-outline-success btn-sm flex-fill">
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
    );
}