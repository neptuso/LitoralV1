import { useState } from 'react';
import { FormField } from './FormField';

export default function WizardForm({ sections, plantId }) {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = sections.length;
    const section = sections[currentStep];

    const next = (e) => { e.preventDefault(); setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1)); };
    const prev = (e) => { e.preventDefault(); setCurrentStep(prev => Math.max(prev - 1, 0)); };

    return (
        <div className="wizard-form">
            <div className="wizard-progress">
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    ></div>
                </div>
                <div className="steps-indicator">
                    Paso {currentStep + 1} de {totalSteps}: <strong>{section.title}</strong>
                </div>
            </div>

            <fieldset className="form-section-fieldset active-step">
                <legend className="section-legend">
                    <span className="section-icon">{section.icon}</span>
                    {section.title}
                </legend>
                <div className="fields-grid">
                    {section.fields.map((field) => (
                        <FormField key={field.id} field={field} />
                    ))}
                </div>
            </fieldset>

            <div className="wizard-controls">
                <button
                    onClick={prev}
                    disabled={currentStep === 0}
                    className="btn btn-secondary"
                >
                    Anterior
                </button>
                {currentStep < totalSteps - 1 ? (
                    <button onClick={next} className="btn btn-primary">
                        Siguiente
                    </button>
                ) : (
                    <button type="submit" className="btn btn-success">
                        Enviar Datos
                    </button>
                )}
            </div>
        </div>
    );
}
