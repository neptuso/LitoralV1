import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Component to protect routes based on authentication and roles.
 */
export default function ProtectedRoute({ children, requiredRoles = [] }) {
    const { currentUser, userProfile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Verificando credenciales...</p>
            </div>
        );
    }

    if (!currentUser) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!userProfile?.isActive) {
        // User is authenticated but account not approved
        return (
            <div className="container">
                <div className="alert alert-warning">
                    <h3>Cuenta Pendiente de Aprobación</h3>
                    <p>Tu cuenta ha sido creada exitosamente, pero un administrador debe aprobarla y asignarte un rol antes de que puedas acceder.</p>
                </div>
            </div>
        );
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(userProfile?.role)) {
        // User doesn't have the required role
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
