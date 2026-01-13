import { FormField } from './FormField';

export default function SinglePageForm({ sections, plantId }) {
    return (
        <div className="single-page-form">
            {sections.map((section) => (
                <fieldset key={section.id} className="form-section-fieldset">
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
            ))}
        </div>
    );
}
