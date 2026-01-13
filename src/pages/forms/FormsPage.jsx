import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { formSections } from '../../config/formFields';
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

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const plantId = userProfile?.plantId || 'general';
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
                <p>Planta: <strong>{userProfile?.plantId || 'General'}</strong></p>
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
                    {layout === 'single' && <SinglePageForm sections={formSections} />}
                    {layout === 'wizard' && <WizardForm sections={formSections} />}
                    {layout === 'tabs' && <TabbedForm sections={formSections} />}

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
