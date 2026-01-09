// Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Google Sheets IDs
export const sheetsConfig = {
  masterId: import.meta.env.VITE_SHEETS_MASTER_ID,
  parteDiarioId: import.meta.env.VITE_SHEETS_PARTE_DIARIO_ID,
  parteComplementarioId: import.meta.env.VITE_SHEETS_PARTE_COMPLEMENTARIO_ID,
};

// Environment
export const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
export const isDevelopment = environment === 'development';
export const isProduction = environment === 'production';
export const isStaging = environment === 'staging';

// Feature flags
export const features = {
  offlineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  geolocation: import.meta.env.VITE_ENABLE_GEOLOCATION === 'true',
  auditLogs: import.meta.env.VITE_ENABLE_AUDIT_LOGS === 'true',
};

// API endpoints
export const apiConfig = {
  ipGeolocation: import.meta.env.VITE_IP_GEOLOCATION_API || 'https://ipapi.co/json/',
};

// App configuration
export const appConfig = {
  name: 'LitoralCitrus',
  version: '1.0.0',
  defaultTheme: 'citrus',
  defaultFormLayout: 'single', // 'single' | 'wizard' | 'tabs'
  plantsCount: 4,
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATIONAL_MANAGER: 'operational_manager',
  PLANT_MANAGER: 'plant_manager',
  DATA_ENTRY: 'data_entry',
  QUERY_USER: 'query_user',
};

// Role labels in Spanish
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.OPERATIONAL_MANAGER]: 'Gerente Operativo',
  [USER_ROLES.PLANT_MANAGER]: 'Gerente de Planta',
  [USER_ROLES.DATA_ENTRY]: 'Usuario de Carga',
  [USER_ROLES.QUERY_USER]: 'Usuario de Consulta',
};

// Plants configuration
export const PLANTS = [
  { id: 'plant1', name: 'Planta 1', location: 'Ubicación 1' },
  { id: 'plant2', name: 'Planta 2', location: 'Ubicación 2' },
  { id: 'plant3', name: 'Planta 3', location: 'Ubicación 3' },
  { id: 'plant4', name: 'Planta 4', location: 'Ubicación 4' },
];
