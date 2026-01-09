import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validations
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        const result = await signUp(formData.email, formData.password, formData.displayName);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🍊</div>
                    <h1>LitoralCitrus</h1>
                    <p>Sistema de Carga de Datos</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Crear Cuenta</h2>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            ✓ Cuenta creada exitosamente. Tu cuenta está pendiente de aprobación por el administrador.
                            Serás redirigido al login...
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="displayName">Nombre Completo</label>
                        <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            value={formData.displayName}
                            onChange={handleChange}
                            required
                            placeholder="Juan Pérez"
                            disabled={loading || success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            placeholder="tu@email.com"
                            disabled={loading || success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="Mínimo 6 caracteres"
                            disabled={loading || success}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="Repite tu contraseña"
                            disabled={loading || success}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading || success}>
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>

                    <div className="auth-footer">
                        <p>
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
