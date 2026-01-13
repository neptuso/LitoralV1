import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reportSections, OPERATIONAL_LIMITS } from '../../config/formFields';
import { PLANTS } from '../../config';
import { dataService } from '../../services/dataService';
import SinglePageForm from '../../components/forms/SinglePageForm';
import WizardForm from '../../components/forms/WizardForm';
import TabbedForm from '../../components/forms/TabbedForm';
import './Forms.css';

export default function FormsPage() {
    const { userProfile, currentUser } = useAuth();
    const [layout, setLayout] = useState('single'); // 'single' | 'wizard' | 'tabs'
    const [loading, setLoading] = useState(false);
    const methods = useForm();

    const plantId = userProfile?.plantId || 'concordia';
    const assignedPlant = PLANTS.find(p => p.id === plantId);

    // Dynamically generate fields based on the plant
    const activeSections = reportSections ? reportSections.map(section => ({
        ...section,
        fields: typeof section.fields === 'function' ? section.fields(plantId) : []
    })) : [];

    // Monitor fields for real-time calculations
    const allValues = methods.watch();

    useEffect(() => {
        if (!allValues) return;

        let totalFruit = 0;
        let totalJuice = 0;

        Object.keys(allValues).forEach(key => {
            if (key.startsWith('fruta_')) {
                const val = Number(allValues[key]);
                if (!isNaN(val)) totalFruit += val;
            }
            if (key.startsWith('jugo_')) {
                const val = Number(allValues[key]);
                if (!isNaN(val)) totalJuice += val;
            }
        });

        if (totalFruit > 0 && totalJuice > 0) {
            const yieldVal = (totalFruit / totalJuice).toFixed(2);
            const efficiencyVal = ((totalJuice / (totalFruit * 0.13)) * 100).toFixed(1);

            methods.setValue('calc_rendimiento', yieldVal, { shouldValidate: false });
            methods.setValue('calc_eficiencia', efficiencyVal + '%', { shouldValidate: false });
        }
    }, [allValues, methods]);

    if (!userProfile || activeSections.length === 0) {
        return <div className="loading-container"><div className="spinner"></div><p>Cargando configuración de planta...</p></div>;
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await dataService.createEntry(currentUser.uid, plantId, data);

            alert('Datos guardados exitosamente en Firestore y registrados en Auditoría.');
            methods.reset();
        } catch (error) {
            alert('Error al guardar los datos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forms-page">
            <header className="page-header">
                <h1>Carga de Datos</h1>
                <p>Planta: <strong>{assignedPlant?.name || 'Sin Asignar'}</strong></p>
            </header>

            <div className="layout-selector">
                <label>Versatilidad de Interfaz:</label>
                <div className="btn-group">
                    <button
                        className={`btn-toggle ${layout === 'single' ? 'active' : ''}`}
                        onClick={() => setLayout('single')}
                    >
                        Página Única
                    </button>
                    <button
                        className={`btn-toggle ${layout === 'wizard' ? 'active' : ''}`}
                        onClick={() => setLayout('wizard')}
                    >
                        Paso a Paso
                    </button>
                    <button
                        className={`btn-toggle ${layout === 'tabs' ? 'active' : ''}`}
                        onClick={() => setLayout('tabs')}
                    >
                        Pestañas
                    </button>
                </div>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="dynamic-form">
                    {layout === 'single' && <SinglePageForm sections={activeSections} />}
                    {layout === 'wizard' && <WizardForm sections={activeSections} />}
                    {layout === 'tabs' && <TabbedForm sections={activeSections} />}

                    {layout !== 'wizard' && (
                        <div className="form-submit-container">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar Reporte Diario'}
                            </button>
                        </div>
                    )}
                </form>
            </FormProvider>
        </div>
    );
}
