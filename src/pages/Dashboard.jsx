import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../config';

export default function Dashboard() {
    const { userProfile } = useAuth();

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Panel de Control</h1>
                <p>Bienvenido, <strong>{userProfile?.displayName}</strong> ({ROLE_LABELS[userProfile?.role]})</p>
            </header>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <h3>Plantas</h3>
                    <p className="stat-value">4</p>
                    <p className="stat-desc">Operativas hoy</p>
                </div>
                <div className="stat-card">
                    <h3>Cargas Hoy</h3>
                    <p className="stat-value">0</p>
                    <p className="stat-desc">Pendientes de sincronizar</p>
                </div>
                <div className="stat-card">
                    <h3>Última Sincronización</h3>
                    <p className="stat-value">--:--</p>
                    <p className="stat-desc">Google Sheets</p>
                </div>
            </div>

            <section className="dashboard-actions">
                <h2>Acciones Rápidas</h2>
                <div className="action-grid">
                    <button className="action-card">
                        <span className="action-icon">📝</span>
                        <span className="action-title">Nueva Carga</span>
                    </button>
                    <button className="action-card">
                        <span className="action-icon">📊</span>
                        <span className="action-title">Ver Reportes</span>
                    </button>
                    {userProfile?.role === 'admin' && (
                        <button className="action-card">
                            <span className="action-icon">👥</span>
                            <span className="action-title">Gestionar Usuarios</span>
                        </button>
                    )}
                </div>
            </section>

            <style>{`
        .dashboard-page {
          animation: fadeIn 0.5s ease-out;
        }

        .page-header {
          margin-bottom: var(--spacing-xl);
        }

        .page-header h1 {
          font-size: 2rem;
          margin-bottom: var(--spacing-xs);
          color: var(--color-primary);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .stat-card {
          background-color: var(--color-bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
          transition: transform var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-4px);
        }

        .stat-card h3 {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
          margin-bottom: var(--spacing-xs);
        }

        .stat-desc {
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
        }

        .dashboard-actions h2 {
          font-size: 1.25rem;
          margin-bottom: var(--spacing-lg);
          border-left: 4px solid var(--color-primary);
          padding-left: var(--spacing-sm);
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--spacing-md);
        }

        .action-card {
          background-color: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--spacing-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .action-card:hover {
          background-color: var(--color-primary-light);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg);
        }

        .action-icon {
          font-size: 2.5rem;
        }

        .action-title {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
