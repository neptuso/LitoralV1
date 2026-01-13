import { useFormContext } from 'react-hook-form';

export const FormField = ({ field }) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[field.id];

    return (
        <div className={`form-field-group ${error ? 'has-error' : ''}`}>
            <label htmlFor={field.id}>
                {field.label} {field.required && <span className="required">*</span>}
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
                    {...register(field.id, {
                        required: field.required,
                        min: field.min,
                        max: field.max
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
        </div>
    );
};
