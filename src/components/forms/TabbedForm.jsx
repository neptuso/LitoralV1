import { useState } from 'react';
import { FormField } from './FormField';

export default function TabbedForm({ sections, plantId }) {
    const [activeTab, setActiveTab] = useState(sections[0].id);

    return (
        <div className="tabbed-form">
            <div className="tabs-header">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        className={`tab-btn ${activeTab === section.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(section.id)}
                    >
                        <span className="tab-icon">{section.icon}</span>
                        <span className="tab-title">{section.title}</span>
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`tab-pane ${activeTab === section.id ? 'active' : ''}`}
                    >
                        <fieldset className="form-section-fieldset">
                            <div className="fields-grid">
                                {section.fields.map((field) => (
                                    <FormField key={field.id} field={field} />
                                ))}
                            </div>
                        </fieldset>
                    </div>
                ))}
            </div>
        </div>
    );
}
