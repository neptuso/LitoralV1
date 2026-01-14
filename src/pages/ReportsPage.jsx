import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { ROLE_LABELS, USER_ROLES, PLANTS } from '../config';
import { OPERATIONAL_LIMITS } from '../config/formFields';

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

    const chartData = (() => {
        // Metas referenciales por planta (Kg fruta procesada estimada por día/turno)
        const PLANT_TARGETS = {
            concordia: 50000,
            tucuman: 45000,
            bella_vista: 35000,
            formosa: 30000
        };

        const plantStats = PLANTS.map(p => ({
            id: p.id,
            name: p.name,
            totalFruta: 0,
            avgEficiencia: 0,
            count: 0,
            targetFruta: PLANT_TARGETS[p.id] || 40000,
            targetEficiencia: OPERATIONAL_LIMITS.EFFICIENCY.JUICE_TARGET
        }));

        entries.forEach(entry => {
            const plant = plantStats.find(ps => ps.id === entry.plantId);
            if (plant && entry.data) {
                // Sumar fruta
                Object.keys(entry.data).forEach(key => {
                    if (key.startsWith('fruta_')) {
                        plant.totalFruta += Number(entry.data[key]) || 0;
                    }
                });

                // Procesar eficiencia si existe
                const eficiencia = Number(entry.data.calc_eficiencia);
                if (!isNaN(eficiencia) && eficiencia > 0) {
                    plant.avgEficiencia += eficiencia;
                    plant.count += 1;
                }
            }
        });

        return plantStats.map(ps => ({
            ...ps,
            totalFruta: Math.round(ps.totalFruta),
            avgEficiencia: ps.count > 0 ? parseFloat((ps.avgEficiencia / ps.count).toFixed(2)) : 0
        }));
    })();

    const COLORS = ['#f97316', '#0ea5e9', '#10b981', '#8b5cf6'];

    if (loading) return <div className="loading-container"><div className="spinner"></div><p>Cargando reportes...</p></div>;

    return (
        <div className="reports-page">
            <header className="page-header">
                <h1>Reportes y Consultas</h1>
                <p>Análisis de actividad para: <strong>{userProfile?.plantId || 'Todas las Plantas'}</strong></p>
            </header>

            {(userProfile?.role === USER_ROLES.ADMIN || userProfile?.role === USER_ROLES.OPERATIONAL_MANAGER) && (
                <>
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <span className="kpi-icon">🚜</span>
                            <div className="kpi-info">
                                <span className="kpi-label">Fruta Total (Kg)</span>
                                <span className="kpi-value">{chartData.reduce((acc, curr) => acc + curr.totalFruta, 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-icon">🎯</span>
                            <div className="kpi-info">
                                <span className="kpi-label">Eficiencia Promedio</span>
                                <span className="kpi-value">
                                    {(chartData.filter(d => d.count > 0).reduce((acc, curr) => acc + curr.avgEficiencia, 0) /
                                        (chartData.filter(d => d.count > 0).length || 1)).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <span className="kpi-icon">📄</span>
                            <div className="kpi-info">
                                <span className="kpi-label">Partes Cargados</span>
                                <span className="kpi-value">{entries.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="charts-section">
                        <div className="chart-card">
                            <h3>Fruta Procesada vs Capacidad Instalada (Kg)</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
                                            formatter={(value) => [`${value.toLocaleString()} Kg`, 'Total Procesado']}
                                        />
                                        <Legend />
                                        <Bar dataKey="totalFruta" name="Fruta Procesada" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                        <Bar dataKey="targetFruta" name="Capacidad/Meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} opacity={0.5} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Eficiencia de Extracción vs Meta ({OPERATIONAL_LIMITS.EFFICIENCY.JUICE_TARGET}%)</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis domain={[0, 100]} fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
                                        />
                                        <ReferenceLine y={OPERATIONAL_LIMITS.EFFICIENCY.JUICE_TARGET} label="Meta" stroke="#ef4444" strokeDasharray="3 3" />
                                        <Bar dataKey="avgEficiencia" radius={[4, 4, 0, 0]} name="Eficiencia %">
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-ef-${index}`}
                                                    fill={entry.avgEficiencia >= OPERATIONAL_LIMITS.EFFICIENCY.JUICE_TARGET ? '#10b981' : '#f59e0b'}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}

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
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xl);
                }
                .kpi-card {
                    background: var(--color-bg-secondary);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--color-border);
                    padding: var(--spacing-md);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    box-shadow: var(--shadow-sm);
                }
                .kpi-icon {
                    font-size: 2rem;
                    background: var(--color-bg-primary);
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-md);
                }
                .kpi-info { display: flex; flex-direction: column; }
                .kpi-label { font-size: 0.75rem; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
                .kpi-value { font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary); }
                
                .charts-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-2xl);
                }
                .chart-card {
                    background: var(--color-bg-secondary);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--color-border);
                    padding: var(--spacing-lg);
                    box-shadow: var(--shadow-sm);
                }
                .chart-card h3 {
                    font-size: 1rem;
                    margin-bottom: var(--spacing-lg);
                    color: var(--color-text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .chart-container {
                    width: 100%;
                    margin-top: var(--spacing-md);
                }
                .reports-container {
                    background: var(--color-bg-secondary);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--color-border);
                    min-height: 300px;
                    padding: var(--spacing-lg);
                    box-shadow: var(--shadow-sm);
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
