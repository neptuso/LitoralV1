import { useFormContext } from 'react-hook-form';

export const FormField = ({ field }) => {
    const { register, watch, formState: { errors } } = useFormContext();
    const error = errors[field.id];
    const value = watch(field.id);

    // Operational limits warning logic
    let warning = null;
    if (field.warning && value !== undefined && value !== '') {
        const numVal = parseFloat(value);
        if (numVal < field.warning.min || numVal > field.warning.max) {
            warning = `Fuera de rango operativo (${field.warning.min} a ${field.warning.max})`;
        }
    }

    const containerClass = `form-field-group ${error ? 'has-error' : warning ? 'has-warning' : ''}`;

    return (
        <div className={containerClass}>
            <label htmlFor={field.id}>
                {field.label} {field.required && <span className="required">*</span>}
                {warning && <span className="warning-icon" title={warning}>⚠️</span>}
            </label>

            {field.type === 'textarea' ? (
                <textarea
                    id={field.id}
                    {...register(field.id, { required: field.required })}
                    placeholder={field.label}
                    rows={4}
                />
            ) : field.type === 'select' ? (
                <select
                    id={field.id}
                    {...register(field.id, { required: field.required })}
                >
                    <option value="">Seleccione...</option>
                    {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <input
                    id={field.id}
                    type={field.type}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    disabled={field.disabled}
                    {...register(field.id, {
                        required: field.required,
                        min: field.min,
                        max: field.max,
                        valueAsNumber: field.type === 'number'
                    })}
                    placeholder={field.label}
                />
            )}

            {error && <span className="field-error">
                {error.type === 'required' ? 'Este campo es obligatorio' :
                    error.type === 'min' ? `Valor mínimo: ${field.min}` :
                        error.type === 'max' ? `Valor máximo: ${field.max}` :
                            'Valor inválido'}
            </span>}

            {warning && !error && <span className="field-warning">{warning}</span>}
        </div>
    );
};
