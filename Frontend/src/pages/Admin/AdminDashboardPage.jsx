import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import PropertyForm from '@/components/ui/PropertyForm';
import UsuariosAdmin from '@/components/Admin/UsuariosAdmin';
import { formatPrice } from '@/utils/formatters';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('propiedades');
    
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);

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

    const handleLogout = async () => {
        await api.auth.logout();
        navigate('/admin');
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas desactivar esta propiedad?')) {
            try {
                await api.propiedades.delete(id);
                loadProperties();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingProperty) {
                await api.propiedades.update(editingProperty.id, data);
            } else {
                await api.propiedades.create(data);
            }
            setShowForm(false);
            setEditingProperty(null);
            loadProperties();
        } catch (error) {
            console.error(error);
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
        <div className="container py-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h1 className="display-6 fw-bold text-primary m-0">Panel de Administración</h1>
                <div className="d-flex gap-2">
                    <span className="align-self-center text-muted me-3">Hola, {currentUser?.nombre}</span>
                    <button onClick={handleLogout} className="btn btn-outline-danger">Cerrar Sesión</button>
                </div>
            </div>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'propiedades' ? 'active' : ''}`} onClick={() => setActiveTab('propiedades')}>
                        Propiedades
                    </button>
                </li>
                {currentUser?.rol === 'Administrador' && (
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>
                            Usuarios
                        </button>
                    </li>
                )}
            </ul>

            {activeTab === 'propiedades' ? (
                showForm ? (
                    <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
                        <h2 className="h3 fw-bold mb-4">{editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
                        <PropertyForm
                            initialData={editingProperty}
                            onSubmit={handleFormSubmit}
                            onCancel={() => { setShowForm(false); setEditingProperty(null); }}
                        />
                    </div>
                ) : (
                    <>
                        <button onClick={handleAddNew} className="btn btn-primary btn-lg fw-semibold shadow-sm mb-4">
                            + Agregar Nueva Propiedad
                        </button>

                        {loading ? (
                            <div className="d-flex align-items-center gap-3 text-secondary py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <span className="fs-5">Cargando propiedades...</span>
                            </div>
                        ) : (
                            <div className="table-responsive shadow-sm rounded-4 border overflow-hidden">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-center">ID</th>
                                            <th scope="col">Título</th>
                                            <th scope="col">Operación</th>
                                            <th scope="col">Tipo</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col" className="text-center">Estado</th>
                                            <th scope="col" className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {propiedades.map(p => (
                                            <tr key={p.id}>
                                                <td className="text-center fw-bold">{p.id}</td>
                                                <td className="fw-semibold">{p.titulo}</td>
                                                <td className="text-capitalize">{p.tipo_operacion}</td>
                                                <td>{p.tipo_inmueble_texto}</td>
                                                <td className="fw-semibold"> {formatPrice(p.precio)}</td>
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
                                                        <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-outline-danger">
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
                    </>
                )
            ) : (
                <UsuariosAdmin currentUser={currentUser} />
            )}
        </div>
    );
}