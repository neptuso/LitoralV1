import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLE_LABELS } from '../../config';
import './Layout.css';

export default function Navbar() {
    const { currentUser, userProfile, signOut } = useAuth();
    const { availableThemes, setTheme, theme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    <span className="logo-emoji">🍊</span>
                    <span className="logo-text">LitoralCitrus</span>
                </NavLink>

                <div className="navbar-menu">
                    {currentUser && (
                        <>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/forms" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Carga
                            </NavLink>
                            {userProfile?.role === 'admin' && (
                                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                    Admin
                                </NavLink>
                            )}
                        </>
                    )}
                </div>

                <div className="navbar-actions">
                    <div className="theme-selector">
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="theme-select"
                            aria-label="Cambiar tema"
                        >
                            {availableThemes.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {currentUser ? (
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">{userProfile?.displayName || currentUser.email}</span>
                                <span className="user-role">{ROLE_LABELS[userProfile?.role] || 'Pendiente'}</span>
                            </div>
                            <button onClick={handleLogout} className="btn-logout" title="Cerrar sesión">
                                🚪
                            </button>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <NavLink to="/login" className="nav-link">Iniciar Sesión</NavLink>
                            <NavLink to="/register" className="nav-link btn-register-nav">Registrarse</NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
