import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { ROLE_LABELS, USER_ROLES } from '../config';

export default function ReportsPage() {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                let data = [];
                if (userProfile?.role === USER_ROLES.ADMIN || userProfile?.role === USER_ROLES.OPERATIONAL_MANAGER) {
                    data = await dataService.getAllEntries();
                } else if (userProfile?.plantId) {
                    data = await dataService.getPlantEntries(userProfile.plantId);
                }
                setEntries(data);
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, [userProfile]);

    if (loading) return <div className="loading-container"><div className="spinner"></div><p>Cargando reportes...</p></div>;

    return (
        <div className="reports-page">
            <header className="page-header">
                <h1>Reportes y Consultas</h1>
                <p>Mostrando actividad para: <strong>{userProfile?.plantId || 'Todas las Plantas'}</strong></p>
            </header>

            <div className="reports-container">
                {entries.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📊</span>
                        <p>No se encontraron cargas realizadas todavía.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Planta</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : 'Reciente'}</td>
                                        <td>{entry.plantId}</td>
                                        <td>
                                            <span className={`badge badge-${entry.status || 'pending'}`}>
                                                {entry.status === 'synced' ? 'Sincronizado' : 'Pendiente Sheets'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-text"
                                                onClick={() => navigate(`/reports/${entry.id}`)}
                                            >
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .reports-page { animation: fadeIn 0.5s ease-out; }
                .reports-container {
                    background: var(--color-bg-secondary);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--color-border);
                    min-height: 300px;
                    padding: var(--spacing-lg);
                }
                .empty-state {
                    text-align: center;
                    padding: var(--spacing-2xl);
                    color: var(--color-text-secondary);
                }
                .empty-icon { font-size: 4rem; display: block; margin-bottom: var(--spacing-md); opacity: 0.5; }
                .table-wrapper { overflow-x: auto; }
                .data-table { width: 100%; border-collapse: collapse; text-align: left; }
                .data-table th { padding: var(--spacing-md); border-bottom: 2px solid var(--color-border); font-size: 0.875rem; color: var(--color-text-secondary); }
                .data-table td { padding: var(--spacing-md); border-bottom: 1px solid var(--color-border); font-size: 0.9rem; }
                .badge { padding: 4px 8px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; }
                .badge-pending { background: var(--color-warning-light); color: var(--color-warning); }
                .badge-synced { background: var(--color-success-light); color: var(--color-success); }
                .btn-text { background: none; border: none; color: var(--color-primary); font-weight: 600; cursor: pointer; }
            `}</style>
        </div>
    );
}
