export const formSections = [
    {
        id: 'general',
        title: 'Información General',
        icon: '📋',
        fields: [
            { id: 'fecha', label: 'Fecha', type: 'date', required: true },
            { id: 'turno', label: 'Turno', type: 'select', options: ['Mañana', 'Tarde', 'Noche'], required: true },
            { id: 'responsable', label: 'Responsable de Carga', type: 'text', required: true },
        ]
    },
    {
        id: 'produccion',
        title: 'Volúmenes de Producción',
        icon: '🚜',
        fields: [
            { id: 'recepcion_ton', label: 'Recepción (Ton)', type: 'number', min: 0 },
            { id: 'procesado_ton', label: 'Procesado (Ton)', type: 'number', min: 0 },
            { id: 'descarte_ton', label: 'Descarte (Ton)', type: 'number', min: 0 },
            { id: 'producto_terminado_kg', label: 'Producto Terminado (kg)', type: 'number', min: 0 },
        ]
    },
    {
        id: 'calidad',
        title: 'Parámetros de Calidad',
        icon: '🧪',
        fields: [
            { id: 'brix', label: 'Brix (%)', type: 'number', step: 0.1, min: 0, max: 20 },
            { id: 'acidez', label: 'Acidez (%)', type: 'number', step: 0.01, min: 0, max: 5 },
            { id: 'ratio', label: 'Ratio (Brix/Ac)', type: 'number', step: 0.1 },
            { id: 'pH', label: 'pH', type: 'number', step: 0.1, min: 0, max: 14 },
        ]
    },
    {
        id: 'operativos',
        title: 'Límites Operativos',
        icon: '⚙️',
        fields: [
            { id: 'temp_extractores', label: 'Temp. Extractores (°C)', type: 'number', min: 0, max: 50 },
            { id: 'presion_vapor', label: 'Presión Vapor (bar)', type: 'number', min: 0, max: 10 },
            { id: 'nivel_tanques', label: 'Nivel Tanques (%)', type: 'number', min: 0, max: 100 },
        ]
    },
    {
        id: 'observaciones',
        title: 'Observaciones',
        icon: '📝',
        fields: [
            { id: 'notas', label: 'Notas Adicionales', type: 'textarea' },
        ]
    }
];

// Replicate fields to reach ~80 for the demo as requested
// (Note: In a real app, these would be unique IDs)
const additionalFields = [];
for (let i = 1; i <= 60; i++) {
    additionalFields.push({
        id: `extra_field_${i}`,
        label: `Campo Técnico ${i}`,
        type: 'number',
        sectionId: i <= 20 ? 'produccion' : (i <= 40 ? 'calidad' : 'operativos')
    });
}

additionalFields.forEach(field => {
    const section = formSections.find(s => s.id === field.sectionId);
    if (section) section.fields.push(field);
});

export const plantFieldExclusions = {
    'plant1': ['extra_field_10', 'extra_field_11'], // Specific exclusions per plant
    'plant2': ['brix', 'acidez'],
    // ... etc
};
