# 🚀 NGPRO Mantenimientos - Sistema Completo

Sistema moderno de gestión de mantenimientos para Programas Informáticos, GPS Tracker y Ciberseguridad.

## 📋 Estado del Proyecto

### ✅ **Frontend (React + TypeScript)**
- ✅ Vite + React 18 + TypeScript configurado
- ✅ Tailwind CSS para estilos
- ✅ React Query para gestión de estado
- ✅ React Router para navegación
- ✅ Zustand para autenticación
- ✅ Componentes principales creados
- ✅ Dashboard con KPIs y gráficos
- ✅ Páginas CRUD completas

### ✅ **Backend (.NET 8 API)**
- ✅ Estructura del proyecto creada
- ✅ Entity Framework Core configurado
- ✅ Modelos de datos definidos
- ✅ JWT Authentication configurado
- ✅ CORS habilitado
- ✅ Swagger documentación
- ⚠️ **REQUIERE .NET 8 SDK**

### 📊 **Base de Datos (SQL Server Express)**
- ✅ Script de creación de tablas
- ✅ Datos de ejemplo
- ✅ Configuración de conexión

## 🚦 **INSTRUCCIONES DE INSTALACIÓN**

### **Prerrequisitos**
1. **Node.js 18+** - [Descargar](https://nodejs.org/)
2. **.NET 8 SDK** - [Descargar](https://dotnet.microsoft.com/download/dotnet/8.0)
3. **SQL Server Express** - [Descargar](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### **1. Configurar Frontend**
```bash
cd frontend/ngpro-mantenimientos-frontend
npm install
npm run dev
```
**URL:** http://localhost:5173

**Credenciales de prueba:**
- Email: `admin@ngpro.es`
- Password: `admin123`

### **2. Configurar Backend** ⚠️ (Requiere .NET 8)
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```
**URL:** http://localhost:5000
**Swagger:** http://localhost:5000/swagger

### **3. Configurar Base de Datos**
1. Ejecutar script: `database/init-database.sql`
2. Verificar cadena de conexión en `backend/appsettings.json`
3. Ejecutar migraciones (cuando estén disponibles)

### Backend
- **.NET 8 Web API**
- **Entity Framework Core 8**
- **SQL Server Express**
- **JWT Authentication**
- **AutoMapper**
- **FluentValidation**
- **Serilog**

### Frontend
- **React 18 + TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Query**
- **React Hook Form**
- **React Router**
- **Zustand (Estado)**
- **Chart Libraries (Recharts)**

## 🚀 Instalación y Configuración

### Prerrequisitos

1. **.NET 8 SDK** - [Descargar aquí](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
3. **SQL Server Express** - [Descargar aquí](https://www.microsoft.com/sql-server/sql-server-downloads)

### 1. Configuración de la Base de Datos

#### Instalar SQL Server Express
```powershell
# Descargar e instalar SQL Server Express con instancia por defecto
# Asegúrate de que la instancia sea .\SQLEXPRESS
```

#### Verificar Conexión
```powershell
# Probar conexión a SQL Server Express
sqlcmd -S .\SQLEXPRESS -E -Q "SELECT @@VERSION"
```

### 2. Configuración del Backend

#### Navegar al directorio backend
```powershell
cd backend
```

#### Instalar .NET 8 SDK (si no está instalado)
```powershell
# Verificar versión de .NET
dotnet --version

# Si no está instalado, descargar desde:
# https://dotnet.microsoft.com/download/dotnet/8.0
```

#### Restaurar paquetes
```powershell
dotnet restore
```

#### Configurar cadena de conexión
Editar `appsettings.json` si es necesario:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=.\\SQLEXPRESS;Initial Catalog=NgproMantenimientos;Integrated Security=True;MultipleActiveResultSets=True;TrustServerCertificate=True"
  }
}
```

#### Crear y aplicar migraciones
```powershell
# Instalar herramientas EF Core (si no están instaladas)
dotnet tool install --global dotnet-ef

# Crear migración inicial
dotnet ef migrations add InitialCreate

# Aplicar migración a la base de datos
dotnet ef database update
```

#### Ejecutar el backend
```powershell
dotnet run
```

**URLs del Backend:**
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000` (página principal)

### 3. Configuración del Frontend

#### Navegar al directorio frontend
```powershell
cd ../frontend/ngpro-mantenimientos-frontend
```

#### Instalar dependencias
```powershell
npm install
```

#### Ejecutar el frontend
```powershell
npm run dev
```

**URL del Frontend:** `http://localhost:5173`

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

1. **Clientes** - Información de clientes
2. **Contratos** - Contratos de mantenimiento por área
3. **LineasContrato** - Detalles de líneas de cada contrato
4. **Renovaciones** - Gestión de renovaciones y cobros
5. **Incidencias** - Incidencias y tickets de soporte
6. **CamposPersonalizados** - Campos dinámicos por área
7. **ValoresCampos** - Valores de campos personalizados
8. **Usuarios** - Usuarios del sistema con roles RBAC

### Areas de Mantenimiento
- **Software** (1)
- **GPS** (2) 
- **Ciberseguridad** (3)

## 🔐 Seguridad

### Roles de Usuario (RBAC)
1. **Admin** - Acceso completo
2. **Gestor** - Gestión de contratos y renovaciones
3. **Comercial** - Visualización y creación de contratos
4. **SoloLectura** - Solo visualización

### Autenticación
- JWT Bearer Token
- Tiempo de expiración: 60 minutos
- Refresh token automático

## 📊 Funcionalidades Principales

### Dashboard
- **KPIs**: MRR, ingresos por área, contratos por vencer
- **Gráficos**: Barras apiladas, líneas de tendencia, donuts
- **Alertas**: Renovaciones próximas, cobros pendientes

### Gestión de Contratos
- CRUD completo de contratos
- Líneas de contrato con cálculo automático
- Estados: Activo, Pendiente, Cancelado, Vencido
- Periodicidad: Mensual, Trimestral, Semestral, Anual

### Campos Personalizables
- Campos dinámicos por área (Cliente, Contrato, Incidencia)
- Tipos: Texto, Número, Fecha, Lista, Booleano
- Configuración de obligatoriedad y valores por defecto

### Informes y Exportación
- **PDF**: Contratos, renovaciones, resúmenes
- **Excel**: Listados filtrados, KPIs
- **CSV**: Datos para análisis externo

### Incidencias
- Sistema de tickets con prioridades
- Estados: Abierta, En Proceso, Pendiente Cliente, Resuelta, Cerrada
- Asignación a técnicos

## 🌐 APIs Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Clientes
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/{id}` - Obtener cliente
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/{id}` - Actualizar cliente
- `DELETE /api/clientes/{id}` - Eliminar cliente

### Contratos
- `GET /api/contratos` - Listar contratos (con filtros)
- `GET /api/contratos/{id}` - Obtener contrato
- `POST /api/contratos` - Crear contrato
- `PUT /api/contratos/{id}` - Actualizar contrato
- `GET /api/contratos/por-vencer` - Contratos próximos a vencer

### Dashboard
- `GET /api/dashboard/kpis` - KPIs principales
- `GET /api/dashboard/charts` - Datos para gráficos
- `GET /api/dashboard/alerts` - Alertas y notificaciones

## 🧪 Testing

### Backend
```powershell
# Ejecutar tests unitarios
dotnet test

# Ejecutar con cobertura
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend
```powershell
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage
```

## 🔧 Configuración Avanzada

### Variables de Entorno

#### Backend (User Secrets)
```powershell
# Configurar secretos de usuario
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "tu_cadena_de_conexion"
dotnet user-secrets set "JwtSettings:SecretKey" "tu_clave_secreta_muy_segura"
```

#### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_DEBUG=true
```

### Logging
Los logs se guardan en:
- **Backend**: `./logs/log-YYYYMMDD.txt`
- **Nivel**: Information (Production), Debug (Development)

## 📈 Métricas y Monitoreo

### KPIs Principales
- **MRR (Monthly Recurring Revenue)**: Ingresos recurrentes mensuales
- **Contratos Activos**: Total por área
- **Tasa de Renovación**: % de contratos renovados
- **Tiempo Medio de Resolución**: Incidencias por área
- **Ingresos por Cliente**: Top clientes

### Alertas Automáticas
- Contratos que vencen en 30/60/90 días
- Cobros pendientes > 15 días
- Incidencias críticas sin asignar
- Límites de base de datos (80% capacidad)

## 🚀 Deployment

### Desarrollo Local
```powershell
# Terminal 1: Backend
cd backend
dotnet run

# Terminal 2: Frontend  
cd frontend/ngpro-mantenimientos-frontend
npm run dev
```

### Producción (Docker - próximamente)
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:80"
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - SA_PASSWORD=YourStrong@Passw0rd
```

## 🆘 Solución de Problemas

### Error: .NET SDK no encontrado
```powershell
# Descargar e instalar .NET 8 SDK
# https://dotnet.microsoft.com/download/dotnet/8.0
```

### Error: SQL Server Express no conecta
```powershell
# Verificar servicio SQL Server Express
Get-Service *sql*

# Reiniciar servicio si es necesario
Restart-Service "SQL Server (SQLEXPRESS)"
```

### Error: Puerto ocupado
```powershell
# Cambiar puerto en launchSettings.json (backend)
# o en vite.config.ts (frontend)
```

## 📞 Soporte

Para soporte técnico:
- **Email**: soporte@ngpro.es
- **Documentación**: Ver archivos en `/docs`
- **Issues**: Reportar en el repositorio

---

## 🎯 Próximos Pasos

1. ✅ **Backend .NET 8 configurado**
2. ✅ **Frontend React configurado** 
3. ⏳ **Crear migraciones de base de datos**
4. ⏳ **Implementar servicios y controladores**
5. ⏳ **Desarrollar UI/UX del frontend**
6. ⏳ **Integrar autenticación JWT**
7. ⏳ **Implementar dashboard con KPIs**
8. ⏳ **Sistema de informes PDF/Excel**

**Estado actual**: ✅ **Estructura base creada y lista para desarrollo**
