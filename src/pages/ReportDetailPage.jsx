import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ROLE_LABELS } from '../config';

export default function ReportDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const docRef = doc(db, 'data_entries', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEntry({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (err) {
                console.error("Error fetching entry detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEntry();
    }, [id]);

    if (loading) return <div className="loading-container"><div className="spinner"></div><p>Cargando detalle...</p></div>;
    if (!entry) return <div className="container"><p>No se encontró el reporte.</p><button onClick={() => navigate('/reports')}>Volver</button></div>;

    return (
        <div className="report-detail-page">
            <header className="page-header">
                <div className="header-nav">
                    <button className="btn-back" onClick={() => navigate('/reports')}>← Volver a Reportes</button>
                </div>
                <h1>Detalle de Carga</h1>
                <div className="entry-meta">
                    <span className="meta-item">Planta: <strong>{entry.plantId}</strong></span>
                    <span className="meta-item">Fecha: <strong>{entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : 'Reciente'}</strong></span>
                    <span className={`badge badge-${entry.status || 'pending'}`}>
                        {entry.status === 'synced' ? 'Sincronizado' : 'Pendiente Sheets'}
                    </span>
                </div>
            </header>

            <div className="detail-sections">
                <div className="data-card">
                    <h2>Datos Registrados</h2>
                    <div className="data-grid">
                        {Object.entries(entry.data).map(([key, value]) => (
                            <div key={key} className="data-item">
                                <span className="label text-capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="value">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="data-card info-card">
                    <h2>Información de Sistema</h2>
                    <div className="data-grid">
                        <div className="data-item">
                            <span className="label">ID del Documento:</span>
                            <span className="value code">{entry.id}</span>
                        </div>
                        <div className="data-item">
                            <span className="label">Usuario:</span>
                            <span className="value">{entry.userId}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .report-detail-page { animation: fadeIn 0.4s ease-out; }
                .btn-back { background: none; border: none; color: var(--color-primary); font-weight: 600; cursor: pointer; margin-bottom: var(--spacing-md); }
                .entry-meta { display: flex; gap: var(--spacing-lg); margin-top: var(--spacing-sm); flex-wrap: wrap; }
                .detail-sections { display: flex; flex-direction: column; gap: var(--spacing-lg); margin-top: var(--spacing-xl); }
                .data-card { background: var(--color-bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: var(--spacing-xl); }
                .data-card h2 { font-size: 1.125rem; margin-bottom: var(--spacing-lg); color: var(--color-primary); border-bottom: 2px solid var(--color-primary-light); display: inline-block; }
                .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--spacing-md); }
                .data-item { display: flex; flex-direction: column; gap: 4px; }
                .label { font-size: 0.75rem; color: var(--color-text-tertiary); text-transform: uppercase; font-weight: 600; }
                .value { font-size: 1rem; color: var(--color-text-primary); font-weight: 500; }
                .code { font-family: monospace; font-size: 0.85rem; }
                .text-capitalize { text-transform: capitalize; }
                .badge { padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; }
                .badge-pending { background: var(--color-warning-light); color: var(--color-warning); }
                .badge-synced { background: var(--color-success-light); color: var(--color-success); }
                
                @media (max-width: 640px) {
                    .data-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
