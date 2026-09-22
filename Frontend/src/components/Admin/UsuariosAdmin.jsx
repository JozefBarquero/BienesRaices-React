import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export default function UsuariosAdmin({ currentUser }) {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    const initialForm = {
        id: '',
        nombre: '',
        apellidos: '',
        email: '',
        rol: 'agente_inmobiliario',
        activo: true,
        fecha_contratacion: '',
        fecha_fin_contratacion: ''
    };
    const [formData, setFormData] = useState(initialForm);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await api.usuarios.getAll();
            setUsuarios(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        if (String(id) === String(currentUser.id)) {
            alert('No puedes desactivar tu propia cuenta.');
            return;
        }
        if (window.confirm('¿Seguro que deseas desactivar este usuario?')) {
            try {
                await api.usuarios.delete(id);
                loadUsers();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.usuarios.update(editingUser.id, formData);
            } else {
                await api.usuarios.create(formData);
            }
            setShowForm(false);
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert('Error al guardar el usuario');
        }
    };

    const handleEdit = (user) => {
        setFormData({
            id: user.id,
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            rol: user.rol,
            activo: user.activo,
            fecha_contratacion: user.fecha_contratacion ? user.fecha_contratacion.split('T')[0] : '',
            fecha_fin_contratacion: user.fecha_fin_contratacion ? user.fecha_fin_contratacion.split('T')[0] : ''
        });
        setEditingUser(user);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setFormData(initialForm);
        setEditingUser(null);
        setShowForm(true);
    };

    if (loading) return <div>Cargando usuarios...</div>;

    return (
        <div className="mt-4">
            {showForm ? (
                <div className="card p-4">
                    <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Cédula</label>
                                <input type="text" className="form-control" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required disabled={!!editingUser} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Rol</label>
                                <select className="form-select" value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
                                    <option value="agente_inmobiliario">Agente Inmobiliario</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Nombre</label>
                                <input type="text" className="form-control" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Apellidos</label>
                                <input type="text" className="form-control" value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} required />
                            </div>
                            <div className="col-md-12 mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Fecha de Contratación</label>
                                <input type="date" className="form-control" value={formData.fecha_contratacion} onChange={e => setFormData({...formData, fecha_contratacion: e.target.value})} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Fecha Fin de Contratación</label>
                                <input type="date" className="form-control" value={formData.fecha_fin_contratacion} onChange={e => setFormData({...formData, fecha_fin_contratacion: e.target.value})} />
                            </div>
                        </div>
                        
                        {editingUser && (
                            <div className="form-check mb-3">
                                <input type="checkbox" className="form-check-input" id="activoCheck" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} />
                                <label className="form-check-label" htmlFor="activoCheck">Usuario Activo</label>
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary me-2">Guardar</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                    </form>
                </div>
            ) : (
                <>
                    <button onClick={handleAddNew} className="btn btn-primary mb-3">+ Agregar Usuario</button>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Cédula</th>
                                    <th>Nombre Completo</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Contratación</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.nombre} {u.apellidos}</td>
                                        <td>{u.email}</td>
                                        <td>{u.rol}</td>
                                        <td>{new Date(u.fecha_contratacion).toLocaleDateString()}</td>
                                        <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                                        <td>
                                            <button onClick={() => handleEdit(u)} className="btn btn-sm btn-outline-primary me-2">Editar</button>
                                            <button onClick={() => handleDelete(u.id)} className="btn btn-sm btn-outline-danger" disabled={String(u.id) === String(currentUser.id)}>Desactivar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}