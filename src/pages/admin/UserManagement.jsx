import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { USER_ROLES, ROLE_LABELS, PLANTS } from '../../config';
import './Admin.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Error al cargar usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (uid, currentData, updates) => {
        try {
            setUpdatingId(uid);
            setError('');
            setSuccess('');

            const updatedFields = {
                role: updates.role !== undefined ? updates.role : currentData.role,
                isActive: updates.isActive !== undefined ? updates.isActive : currentData.isActive,
                plantId: updates.plantId !== undefined ? updates.plantId : currentData.plantId,
            };

            await userService.updateUserAccess(uid, updatedFields);

            setSuccess('Usuario actualizado correctamente');
            fetchUsers(); // Refresh list
        } catch (err) {
            setError('Error al actualizar usuario');
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="admin-loading">Cargando usuarios...</div>;

    return (
        <div className="admin-page">
            <header className="admin-header">
                <h1>Gestión de Usuarios</h1>
                <p>Aprueba registros y asigna roles/privilegios</p>
            </header>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th>Rol</th>
                            <th>Planta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <span className="user-avatar">{user.displayName?.charAt(0) || 'U'}</span>
                                        <span>{user.displayName}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-warning'}`}>
                                        {user.isActive ? 'Activo' : 'Pendiente'}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={user.role || ''}
                                        onChange={(e) => handleUpdateUser(user.id, user, { role: e.target.value })}
                                        disabled={updatingId === user.id}
                                        className="admin-select"
                                    >
                                        <option value="">Sin Rol</option>
                                        {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={user.plantId || ''}
                                        onChange={(e) => handleUpdateUser(user.id, user, { plantId: e.target.value })}
                                        disabled={updatingId === user.id}
                                        className="admin-select"
                                    >
                                        <option value="">Todas / N/A</option>
                                        {PLANTS.map((plant) => (
                                            <option key={plant.id} value={plant.id}>{plant.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateUser(user.id, user, { isActive: !user.isActive })}
                                        disabled={updatingId === user.id}
                                        className={`btn-action ${user.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                                    >
                                        {user.isActive ? 'Desactivar' : 'Aprobar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
