-- =====================================================
-- Script de Inicialización - Base de Datos NGPRO Mantenimientos
-- SQL Server Express
-- =====================================================

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NgproMantenimientos')
BEGIN
    CREATE DATABASE [NgproMantenimientos]
END
GO

USE [NgproMantenimientos]
GO

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla Usuarios
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Usuarios] (
        [IdUsuario] int IDENTITY(1,1) NOT NULL,
        [Nombre] nvarchar(100) NOT NULL,
        [Apellidos] nvarchar(100) NOT NULL,
        [Email] nvarchar(200) NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [Rol] int NOT NULL DEFAULT 4,
        [Activo] bit NOT NULL DEFAULT 1,
        [UltimoAcceso] datetime2 NULL,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] datetime2 NULL,
        [IdiomaPreferido] nvarchar(10) NULL DEFAULT 'es',
        CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED ([IdUsuario] ASC)
    )

    CREATE UNIQUE NONCLUSTERED INDEX [IX_Usuario_Email] ON [dbo].[Usuarios] ([Email] ASC)
END
GO

-- Tabla Clientes
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Clientes' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Clientes] (
        [IdCliente] int IDENTITY(1,1) NOT NULL,
        [Nombre] nvarchar(200) NOT NULL,
        [NifCif] nvarchar(20) NULL,
        [Email] nvarchar(200) NULL,
        [Telefono] nvarchar(20) NULL,
        [Direccion] nvarchar(500) NULL,
        [Ciudad] nvarchar(100) NULL,
        [CodigoPostal] nvarchar(10) NULL,
        [Provincia] nvarchar(100) NULL,
        [Pais] nvarchar(100) NULL DEFAULT 'España',
        [Activo] bit NOT NULL DEFAULT 1,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] datetime2 NULL,
        [Notas] nvarchar(1000) NULL,
        CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([IdCliente] ASC)
    )

    CREATE UNIQUE NONCLUSTERED INDEX [IX_Cliente_Email] ON [dbo].[Clientes] ([Email] ASC) WHERE [Email] IS NOT NULL
    CREATE UNIQUE NONCLUSTERED INDEX [IX_Cliente_NifCif] ON [dbo].[Clientes] ([NifCif] ASC) WHERE [NifCif] IS NOT NULL
END
GO

-- Tabla Contratos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Contratos' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Contratos] (
        [IdContrato] int IDENTITY(1,1) NOT NULL,
        [IdCliente] int NOT NULL,
        [Area] int NOT NULL,
        [Descripcion] nvarchar(200) NOT NULL,
        [FechaInicio] datetime2 NOT NULL,
        [FechaFin] datetime2 NOT NULL,
        [Periodicidad] int NOT NULL,
        [Importe] decimal(18,2) NOT NULL,
        [Estado] int NOT NULL DEFAULT 1,
        [FormaPago] nvarchar(100) NULL,
        [Notas] nvarchar(1000) NULL,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] datetime2 NULL,
        [CreadoPor] nvarchar(100) NULL,
        [ModificadoPor] nvarchar(100) NULL,
        CONSTRAINT [PK_Contratos] PRIMARY KEY CLUSTERED ([IdContrato] ASC),
        CONSTRAINT [FK_Contratos_Clientes] FOREIGN KEY ([IdCliente]) REFERENCES [dbo].[Clientes] ([IdCliente])
    )

    CREATE NONCLUSTERED INDEX [IX_Contrato_Cliente_Area] ON [dbo].[Contratos] ([IdCliente] ASC, [Area] ASC)
    CREATE NONCLUSTERED INDEX [IX_Contrato_Estado] ON [dbo].[Contratos] ([Estado] ASC)
    CREATE NONCLUSTERED INDEX [IX_Contrato_FechaFin] ON [dbo].[Contratos] ([FechaFin] ASC)
END
GO

-- Tabla LineasContrato
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LineasContrato' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[LineasContrato] (
        [IdLinea] int IDENTITY(1,1) NOT NULL,
        [IdContrato] int NOT NULL,
        [Concepto] nvarchar(500) NOT NULL,
        [Cantidad] int NOT NULL DEFAULT 1,
        [PrecioUnitario] decimal(18,2) NOT NULL,
        [PorcentajeImpuestos] decimal(5,2) NOT NULL DEFAULT 21.0,
        [ImporteImpuestos] decimal(18,2) NOT NULL,
        [Total] decimal(18,2) NOT NULL,
        [Descripcion] nvarchar(500) NULL,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_LineasContrato] PRIMARY KEY CLUSTERED ([IdLinea] ASC),
        CONSTRAINT [FK_LineasContrato_Contratos] FOREIGN KEY ([IdContrato]) REFERENCES [dbo].[Contratos] ([IdContrato]) ON DELETE CASCADE
    )
END
GO

-- Tabla Renovaciones
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Renovaciones' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Renovaciones] (
        [IdRenovacion] int IDENTITY(1,1) NOT NULL,
        [IdContrato] int NOT NULL,
        [FechaPrevista] datetime2 NOT NULL,
        [FechaCobro] datetime2 NULL,
        [Importe] decimal(18,2) NOT NULL,
        [EstadoCobro] int NOT NULL DEFAULT 1,
        [Notas] nvarchar(500) NULL,
        [MetodoPago] nvarchar(100) NULL,
        [ReferenciaTransaccion] nvarchar(100) NULL,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] datetime2 NULL,
        [CreadoPor] nvarchar(100) NULL,
        [ModificadoPor] nvarchar(100) NULL,
        CONSTRAINT [PK_Renovaciones] PRIMARY KEY CLUSTERED ([IdRenovacion] ASC),
        CONSTRAINT [FK_Renovaciones_Contratos] FOREIGN KEY ([IdContrato]) REFERENCES [dbo].[Contratos] ([IdContrato]) ON DELETE CASCADE
    )

    CREATE NONCLUSTERED INDEX [IX_Renovacion_FechaPrevista] ON [dbo].[Renovaciones] ([FechaPrevista] ASC)
    CREATE NONCLUSTERED INDEX [IX_Renovacion_EstadoCobro] ON [dbo].[Renovaciones] ([EstadoCobro] ASC)
END
GO

-- Tabla Incidencias
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Incidencias' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Incidencias] (
        [IdIncidencia] int IDENTITY(1,1) NOT NULL,
        [IdContrato] int NOT NULL,
        [Titulo] nvarchar(200) NOT NULL,
        [Fecha] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [Tipo] int NOT NULL,
        [Prioridad] int NOT NULL DEFAULT 2,
        [Descripcion] nvarchar(max) NOT NULL,
        [Estado] int NOT NULL DEFAULT 1,
        [FechaResolucion] datetime2 NULL,
        [FechaCierre] datetime2 NULL,
        [AsignadoA] nvarchar(100) NULL,
        [Solucion] nvarchar(max) NULL,
        [Notas] nvarchar(1000) NULL,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] datetime2 NULL,
        [CreadoPor] nvarchar(100) NULL,
        [ModificadoPor] nvarchar(100) NULL,
        CONSTRAINT [PK_Incidencias] PRIMARY KEY CLUSTERED ([IdIncidencia] ASC),
        CONSTRAINT [FK_Incidencias_Contratos] FOREIGN KEY ([IdContrato]) REFERENCES [dbo].[Contratos] ([IdContrato]) ON DELETE CASCADE
    )

    CREATE NONCLUSTERED INDEX [IX_Incidencia_Estado] ON [dbo].[Incidencias] ([Estado] ASC)
    CREATE NONCLUSTERED INDEX [IX_Incidencia_Prioridad] ON [dbo].[Incidencias] ([Prioridad] ASC)
    CREATE NONCLUSTERED INDEX [IX_Incidencia_Fecha] ON [dbo].[Incidencias] ([Fecha] ASC)
END
GO

-- Tabla CamposPersonalizados
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CamposPersonalizados' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[CamposPersonalizados] (
        [IdCampo] int IDENTITY(1,1) NOT NULL,
        [Ambito] int NOT NULL,
        [NombreCampo] nvarchar(100) NOT NULL,
        [EtiquetaCampo] nvarchar(100) NULL,
        [TipoDato] int NOT NULL,
        [OpcionesJSON] nvarchar(max) NULL,
        [EsObligatorio] bit NOT NULL DEFAULT 0,
        [Activo] bit NOT NULL DEFAULT 1,
        [Orden] int NOT NULL DEFAULT 0,
        [Descripcion] nvarchar(500) NULL,
        [PlaceholderTexto] nvarchar(200) NULL,
        [ValorPorDefecto] nvarchar(max) NULL,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] datetime2 NULL,
        [CreadoPor] nvarchar(100) NULL,
        CONSTRAINT [PK_CamposPersonalizados] PRIMARY KEY CLUSTERED ([IdCampo] ASC)
    )

    CREATE UNIQUE NONCLUSTERED INDEX [IX_CampoPersonalizado_Ambito_Nombre] ON [dbo].[CamposPersonalizados] ([Ambito] ASC, [NombreCampo] ASC)
END
GO

-- Tabla ValoresCampos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ValoresCampos' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[ValoresCampos] (
        [IdValor] int IDENTITY(1,1) NOT NULL,
        [IdCampo] int NOT NULL,
        [IdObjeto] int NOT NULL,
        [Valor] nvarchar(max) NULL,
        [FechaCreacion] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] datetime2 NULL,
        CONSTRAINT [PK_ValoresCampos] PRIMARY KEY CLUSTERED ([IdValor] ASC),
        CONSTRAINT [FK_ValoresCampos_CamposPersonalizados] FOREIGN KEY ([IdCampo]) REFERENCES [dbo].[CamposPersonalizados] ([IdCampo]) ON DELETE CASCADE
    )

    CREATE UNIQUE NONCLUSTERED INDEX [IX_ValorCampo_Campo_Objeto] ON [dbo].[ValoresCampos] ([IdCampo] ASC, [IdObjeto] ASC)
END
GO

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Usuario administrador por defecto
IF NOT EXISTS (SELECT 1 FROM [dbo].[Usuarios] WHERE [Email] = 'admin@ngpro.es')
BEGIN
    INSERT INTO [dbo].[Usuarios] ([Nombre], [Apellidos], [Email], [PasswordHash], [Rol], [Activo], [IdiomaPreferido])
    VALUES ('Administrador', 'Sistema', 'admin@ngpro.es', '$2a$11$rOj1.6cQF/hG8ZNiN3zLJeTOKGUGJI1DqY7rKM.nCOY.j0ZlGJTfm', 1, 1, 'es')
    -- Password: Admin123!
END
GO

-- Cliente de ejemplo
IF NOT EXISTS (SELECT 1 FROM [dbo].[Clientes] WHERE [Email] = 'contacto@empresaejemplo.com')
BEGIN
    INSERT INTO [dbo].[Clientes] ([Nombre], [NifCif], [Email], [Telefono], [Direccion], [Ciudad], [CodigoPostal], [Provincia], [Pais], [Activo], [Notas])
    VALUES ('Empresa Ejemplo S.L.', 'B12345678', 'contacto@empresaejemplo.com', '912345678', 'Calle Principal, 123', 'Madrid', '28001', 'Madrid', 'España', 1, 'Cliente de ejemplo para testing')
END
GO

-- Campos personalizados de ejemplo
IF NOT EXISTS (SELECT 1 FROM [dbo].[CamposPersonalizados] WHERE [NombreCampo] = 'SectorEmpresa')
BEGIN
    INSERT INTO [dbo].[CamposPersonalizados] ([Ambito], [NombreCampo], [EtiquetaCampo], [TipoDato], [OpcionesJSON], [EsObligatorio], [Activo], [Orden], [Descripcion])
    VALUES (1, 'SectorEmpresa', 'Sector de la Empresa', 4, '["Tecnología","Sanidad","Educación","Industria","Servicios"]', 0, 1, 1, 'Sector principal de actividad de la empresa')

    INSERT INTO [dbo].[CamposPersonalizados] ([Ambito], [NombreCampo], [EtiquetaCampo], [TipoDato], [EsObligatorio], [Activo], [Orden], [Descripcion])
    VALUES (2, 'NumeroLicencias', 'Número de Licencias', 2, 1, 1, 1, 'Cantidad de licencias incluidas en el contrato')

    INSERT INTO [dbo].[CamposPersonalizados] ([Ambito], [NombreCampo], [EtiquetaCampo], [TipoDato], [EsObligatorio], [Activo], [Orden], [Descripcion])
    VALUES (3, 'TiempoEstimado', 'Tiempo Estimado (horas)', 2, 0, 1, 1, 'Tiempo estimado de resolución en horas')
END
GO

-- =====================================================
-- VISTA RESUMEN DE DATOS
-- =====================================================
SELECT 'Usuarios' as Tabla, COUNT(*) as Registros FROM [dbo].[Usuarios]
UNION ALL
SELECT 'Clientes', COUNT(*) FROM [dbo].[Clientes]
UNION ALL
SELECT 'Contratos', COUNT(*) FROM [dbo].[Contratos]
UNION ALL
SELECT 'Campos Personalizados', COUNT(*) FROM [dbo].[CamposPersonalizados]

PRINT 'Base de datos NgproMantenimientos inicializada correctamente'
PRINT 'Usuario admin: admin@ngpro.es / Admin123!'

GO
