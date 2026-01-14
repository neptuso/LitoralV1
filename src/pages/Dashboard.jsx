import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS, PLANTS, USER_ROLES } from '../config';
import { dataService } from '../services/dataService';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Get assigned plant name
  const assignedPlant = PLANTS.find(p => p.id === userProfile?.plantId);
  const plantName = assignedPlant ? assignedPlant.name : (userProfile?.role === USER_ROLES.ADMIN ? 'Todas las Plantas' : 'Sin asignar');

  const [stats, setStats] = useState({
    todayCount: 0,
    pendingCount: 0,
    lastSyncTime: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // If user is plant manager or data entry, filter stats by their plant
        const restrictedRoles = [USER_ROLES.PLANT_MANAGER, USER_ROLES.DATA_ENTRY];
        const targetPlantId = restrictedRoles.includes(userProfile?.role) ? userProfile?.plantId : null;

        const data = await dataService.getDashboardStats(targetPlantId);
        setStats(data);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) {
      fetchStats();
    }
  }, [userProfile]);

  const formatTime = (date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Panel de Control o DASH</h1>
        <div className="user-info-bar">
          <p>Bienvenido, <strong>{userProfile?.displayName}</strong> ({ROLE_LABELS[userProfile?.role]}) para Planta: <strong>{plantName}</strong></p>
          <div className="plant-badge">
            <span className="plant-icon">🏭</span>
            <span className="plant-label">Planta: <strong>{plantName}</strong></span>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Plantas</h3>
          <p className="stat-value">{PLANTS.length}</p>
          <p className="stat-desc">Configuradas en el sistema</p>
        </div>
        <div className="stat-card">
          <h3>Cargas Hoy</h3>
          <p className="stat-value">{stats.todayCount}</p>
          <p className="stat-desc">{stats.pendingCount} pendientes de sincronizar</p>
        </div>
        <div className="stat-card">
          <h3>Última Sincronización</h3>
          <p className="stat-value">{formatTime(stats.lastSyncTime)}</p>
          <p className="stat-desc">A Google Sheets</p>
        </div>
      </div>

      <section className="dashboard-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-grid">
          <button className="action-card" onClick={() => navigate('/forms')}>
            <span className="action-icon">📝</span>
            <span className="action-title">Nueva Carga</span>
          </button>
          <button className="action-card" onClick={() => navigate('/reports')}>
            <span className="action-icon">📊</span>
            <span className="action-title">Ver Reportes</span>
          </button>
          {userProfile?.role === 'admin' && (
            <button className="action-card" onClick={() => navigate('/admin')}>
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

        .user-info-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .plant-badge {
          background-color: var(--color-primary-light);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-primary);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .plant-icon {
          font-size: 1.2rem;
        }

        .plant-label {
          color: var(--color-primary-dark);
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
