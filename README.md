# LitoralCitrus - Sistema de Carga de Datos

🍊 Aplicación web mobile-first para carga de datos de producción de cítricos con integración a Google Sheets.

## 🚀 Características

- **Mobile-First**: Diseño responsivo optimizado para dispositivos móviles
- **6 Temas Visuales**: Claro, Oscuro, Citrus (naranja), y 3 temas premium adicionales
- **3 Layouts de Formulario**: Página única, Multi-paso (wizard), y Pestañas
- **RBAC**: Sistema de roles con 5 niveles de acceso
- **Offline-First**: Funciona sin conexión y sincroniza automáticamente
- **Auditoría Completa**: Registro de todas las acciones con IP y geolocalización
- **Integración Google Sheets**: Sincronización bidireccional con hojas de cálculo

## 📋 Requisitos

- Node.js 18+ (probado con v22.19.0)
- npm o yarn
- Cuenta de Firebase (plan Spark gratuito)
- Proyecto de Google Cloud con Sheets API habilitada

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd LitoralCitrus

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

## 🔧 Configuración

### Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password)
3. Crear Firestore Database
4. Registrar aplicación web
5. Copiar configuración a `.env`

### Google Cloud

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Google Sheets API y Google Drive API
3. Crear Service Account
4. Descargar credenciales JSON
5. Compartir hojas de cálculo con email de Service Account

Ver [google-cloud-setup.md](./docs/google-cloud-setup.md) para instrucciones detalladas.

## 📁 Estructura del Proyecto

```
LitoralCitrus/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── auth/        # Login, registro
│   │   ├── layout/      # Header, footer, sidebar
│   │   ├── forms/       # 3 versiones del formulario
│   │   ├── admin/       # Panel de administración
│   │   └── dashboard/   # Widgets y gráficos
│   ├── pages/           # Páginas principales
│   ├── context/         # React Context (Auth, Theme)
│   ├── hooks/           # Custom hooks
│   ├── services/        # Firebase, API, validación
│   ├── utils/           # Utilidades
│   ├── styles/          # CSS y temas
│   └── config/          # Configuración
├── public/              # Archivos estáticos
└── firebase/            # Reglas de Firestore
```

## 🎨 Temas Disponibles

1. **Light** - Tema claro profesional
2. **Dark** - Tema oscuro moderno
3. **Citrus** - Tema naranja (identidad de marca)
4. **Ocean** - Azul profundo
5. **Forest** - Verde natural
6. **Sunset** - Púrpura/rosa

Cambiar tema desde el menú de usuario o configuración.

## 👥 Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Admin** | Super usuario | Control total del sistema |
| **Gerente Operativo** | Supervisión general | Lectura global, dashboards |
| **Gerente de Planta** | Gestión de planta | Validación y consulta de su planta |
| **Usuario de Carga** | Operador | Solo carga de datos |
| **Usuario de Consulta** | Visualización | Solo reportes específicos |

## 🔒 Seguridad

- Autenticación Firebase
- Reglas de seguridad Firestore
- Variables de entorno para credenciales
- `.gitignore` configurado para proteger datos sensibles
- Auditoría completa de acciones

## 📱 Uso

### Cargar Datos

1. Iniciar sesión
2. Ir a "Nueva Carga"
3. Seleccionar planta
4. Completar formulario (campos variables según planta)
5. Validación automática contra límites operativos
6. Enviar (se guarda en Firestore y sincroniza con Google Sheets)

### Consultar Reportes

1. Ir a "Dashboard" o "Reportes"
2. Filtrar por fecha, planta, etc.
3. Visualizar gráficos y KPIs
4. Exportar a CSV/Excel si es necesario

### Administrar Usuarios (Solo Admin)

1. Ir a "Panel de Administración"
2. Ver lista de usuarios registrados
3. Asignar roles y permisos
4. Activar/desactivar usuarios

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deployment

```bash
# Build para producción
npm run build

# Preview del build
npm run preview

# Deploy a Firebase Hosting
npm run deploy
```

## 📄 Licencia

Propietario - LitoralCitrus © 2026

## 👨‍💻 Desarrolladores

Desarrollado con ❤️ por el equipo de CEIBAL SISTEMAS para  LitoralCitrus

---

**Versión**: 1.1.0  
**Última actualización**: Enero 2026
**Desarrollado por**: CEIBAL SISTEMAS
**PROXIMOS PASOS O PENDIENTES**: Fase técnica de sincronización con documentos sheets, validacion de campos y especificación de valores operativos críticos
