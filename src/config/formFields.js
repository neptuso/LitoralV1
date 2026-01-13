/**
 * LitoralCitrus - Form Configuration & Operational Limits
 * Based on data analysis of EJEMPLO DE TABLAS and METAS BaseCargaV1
 */

export const OPERATIONAL_LIMITS = {
    YIELD: {
        MAX_KG_FF_PER_KG_JC: 17, // Fruta Fresca por kg de Jugo Concentrado
        MAX_KG_FF_PER_KG_CC: 30, // Fruta Fresca por kg de Concentrado
    },
    EFFICIENCY: {
        JUICE_TARGET: 95, // %
        JUICE_WARNING: 90, // %
        OIL_TARGET: 50, // %
    },
    TEMPERATURES: {
        CHAMBERS: { min: -20, max: -11 }, // °C
        ANTE_CHAMBERS: { min: 2, max: 6 }, // Target +4°C
    },
    OTHER: {
        MAX_STOCK_FRUIT: 150, // Tn
        MAX_ABSENTEEISM: 5, // %
    }
};

// Plant-specific species (Frutas) mapping from Spreadsheet headers
export const PLANT_SPECIES = {
    concordia: ['Naranja Común', 'Naranja Ombligo', 'Naranja Verano', 'Pomelo Blanco', 'Pomelo Rosado', 'Limón', 'Mandarina', 'Mandarina Raleo'],
    tucuman: ['Naranja Común', 'Naranja Tardía', 'Naranja Valencia', 'Pomelo Blanco', 'Pomelo Rosado', 'Limón Orgánico', 'Limón', 'Mandarina'],
    bella_vista: ['Naranja Común', 'Naranja Tardía', 'Naranja Valencia', 'Pomelo Blanco', 'Pomelo Rosado', 'Limón Orgánico', 'Limón', 'Mandarina'],
    formosa: ['Naranja Común', 'Naranja Ombligo', 'Naranja Verano', 'Pomelo Blanco', 'Pomelo Rosado', 'Pomelo Rojo', 'Mandarina Común', 'Mandarina Variedad'],
};

// Main sections for the daily report
export const reportSections = [
    {
        id: 'general',
        title: 'Información General',
        icon: '📋',
        fields: (plantId) => [
            { id: 'fecha', label: 'Fecha', type: 'date', required: true },
            ...(plantId === 'tucuman' || plantId === 'bella_vista' ?
                [{ id: 'parte_nro', label: 'Parte Nº', type: 'text', required: true }] : []),
            { id: 'turno', label: 'Turno', type: 'select', options: ['Mañana', 'Tarde', 'Noche'], required: true },
            { id: 'responsable', label: 'Responsable', type: 'text', required: true },
        ]
    },
    {
        id: 'fruta_ingreso',
        title: 'Fruta Ingresada (Kg)',
        icon: '🚚',
        fields: (plantId) => (PLANT_SPECIES[plantId] || PLANT_SPECIES.concordia).map(species => ({
            id: `fruta_${species.toLowerCase().replace(/ /g, '_')}`,
            label: species,
            type: 'number',
            min: 0
        }))
    },
    {
        id: 'jugos_aceites',
        title: 'Producción: Jugos y Aceites',
        icon: '🧃',
        fields: (plantId) => [
            ...(PLANT_SPECIES[plantId] || PLANT_SPECIES.concordia).map(species => ({
                id: `jugo_${species.toLowerCase().replace(/ /g, '_')}`,
                label: `Jugo ${species}`,
                type: 'number',
                min: 0
            })),
            { id: 'aceite_esencial', label: 'Aceite Esencial (Kg)', type: 'number', min: 0 },
            { id: 'terpenos', label: 'Terpenos (Kg)', type: 'number', min: 0 },
            { id: 'descarte', label: 'Descarte Físico (Kg)', type: 'number', min: 0 },
        ]
    },
    {
        id: 'calidad',
        title: 'Parámetros de Calidad y Ops',
        icon: '🧪',
        fields: (plantId) => [
            { id: 'brix', label: 'Brix (50º Std)', type: 'number', step: 0.1, min: 0, max: 80 },
            { id: 'acidez', label: 'Acidez (%)', type: 'number', step: 0.01, min: 0, max: 10 },
            { id: 'temp_camara', label: 'Temp. Cámara (°C)', type: 'number', step: 0.5, warning: OPERATIONAL_LIMITS.TEMPERATURES.CHAMBERS },
            { id: 'temp_antecamara', label: 'Temp. Ante-cámara (°C)', type: 'number', step: 0.5, warning: OPERATIONAL_LIMITS.TEMPERATURES.ANTE_CHAMBERS },
        ]
    },
    {
        id: 'eficiencia', // Computed fields
        title: 'Cálculos de Eficiencia (Auto)',
        icon: '📈',
        fields: () => [
            { id: 'calc_rendimiento', label: 'Rendimiento (Kg Fruta/Kg Jugo)', type: 'number', disabled: true },
            { id: 'calc_eficiencia', label: 'Eficiencia Extracción (%)', type: 'number', disabled: true },
        ]
    }
];
