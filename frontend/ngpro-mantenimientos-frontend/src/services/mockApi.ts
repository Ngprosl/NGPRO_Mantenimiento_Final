// Mock data service para simular datos de la base de datos
export interface Cliente {
  id: number
  codigo: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  localidad: string
  provincia: string
  codigoPostal: string
  fechaCreacion: string
  activo: boolean
}

export interface Contrato {
  id: number
  clienteId: number
  cliente?: Cliente
  codigo: string
  descripcion: string
  fechaInicio: string
  fechaFin?: string
  valorTotal: number
  estado: 'Activo' | 'Finalizado' | 'Suspendido'
  tipoMantenimiento: 'Programas Informáticos' | 'GPS Tracker' | 'Ciberseguridad'
  fechaCreacion: string
}

export interface Incidencia {
  id: number
  contratoId: number
  contrato?: Contrato
  titulo: string
  descripcion: string
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica'
  estado: 'Abierta' | 'En Progreso' | 'Resuelta' | 'Cerrada'
  fechaCreacion: string
  fechaResolucion?: string
  tecnicoAsignado?: string
}

// Mock data
export const mockClientes: Cliente[] = [
  {
    id: 1,
    codigo: 'CLI001',
    nombre: 'Empresas Tecnológicas SL',
    email: 'contacto@emptech.es',
    telefono: '+34 912 345 678',
    direccion: 'Calle Mayor 123',
    localidad: 'Madrid',
    provincia: 'Madrid',
    codigoPostal: '28001',
    fechaCreacion: '2024-01-15T09:00:00Z',
    activo: true
  },
  {
    id: 2,
    codigo: 'CLI002',
    nombre: 'Logística Integral SA',
    email: 'info@logintegral.com',
    telefono: '+34 934 567 890',
    direccion: 'Avenida Industrial 45',
    localidad: 'Barcelona',
    provincia: 'Barcelona',
    codigoPostal: '08001',
    fechaCreacion: '2024-02-20T10:30:00Z',
    activo: true
  },
  {
    id: 3,
    codigo: 'CLI003',
    nombre: 'Servicios Profesionales León',
    email: 'admin@servleon.es',
    telefono: '+34 987 654 321',
    direccion: 'Plaza Central 8',
    localidad: 'León',
    provincia: 'León',
    codigoPostal: '24001',
    fechaCreacion: '2024-01-08T14:15:00Z',
    activo: true
  },
  {
    id: 4,
    codigo: 'CLI004',
    nombre: 'Construcciones del Sur',
    email: 'contacto@consur.es',
    telefono: '+34 955 123 456',
    direccion: 'Calle Andalucía 67',
    localidad: 'Sevilla',
    provincia: 'Sevilla',
    codigoPostal: '41001',
    fechaCreacion: '2024-03-12T11:45:00Z',
    activo: false
  }
]

export const mockContratos: Contrato[] = [
  {
    id: 1,
    clienteId: 1,
    codigo: 'CNT001',
    descripcion: 'Mantenimiento integral de sistemas informáticos',
    fechaInicio: '2024-01-15T00:00:00Z',
    fechaFin: '2024-12-31T23:59:59Z',
    valorTotal: 24000,
    estado: 'Activo',
    tipoMantenimiento: 'Programas Informáticos',
    fechaCreacion: '2024-01-15T09:30:00Z'
  },
  {
    id: 2,
    clienteId: 2,
    codigo: 'CNT002',
    descripcion: 'Monitoreo GPS de flota vehicular',
    fechaInicio: '2024-02-01T00:00:00Z',
    fechaFin: '2025-01-31T23:59:59Z',
    valorTotal: 18000,
    estado: 'Activo',
    tipoMantenimiento: 'GPS Tracker',
    fechaCreacion: '2024-02-20T11:00:00Z'
  },
  {
    id: 3,
    clienteId: 3,
    codigo: 'CNT003',
    descripcion: 'Auditoría y mantenimiento de ciberseguridad',
    fechaInicio: '2024-01-10T00:00:00Z',
    fechaFin: '2024-07-10T23:59:59Z',
    valorTotal: 12000,
    estado: 'Finalizado',
    tipoMantenimiento: 'Ciberseguridad',
    fechaCreacion: '2024-01-08T15:00:00Z'
  },
  {
    id: 4,
    clienteId: 1,
    codigo: 'CNT004',
    descripcion: 'Seguridad perimetral y firewall',
    fechaInicio: '2024-03-01T00:00:00Z',
    fechaFin: '2025-02-28T23:59:59Z',
    valorTotal: 15000,
    estado: 'Activo',
    tipoMantenimiento: 'Ciberseguridad',
    fechaCreacion: '2024-03-01T09:15:00Z'
  }
]

export const mockIncidencias: Incidencia[] = [
  {
    id: 1,
    contratoId: 1,
    titulo: 'Error en servidor de aplicaciones',
    descripcion: 'El servidor principal presenta intermitencias en la conexión',
    prioridad: 'Alta',
    estado: 'En Progreso',
    fechaCreacion: '2024-08-18T08:30:00Z',
    tecnicoAsignado: 'Carlos Ruiz'
  },
  {
    id: 2,
    contratoId: 2,
    titulo: 'Pérdida de señal GPS en 3 vehículos',
    descripcion: 'Los vehículos V001, V003 y V007 no reportan posición desde ayer',
    prioridad: 'Media',
    estado: 'Abierta',
    fechaCreacion: '2024-08-19T14:15:00Z',
    tecnicoAsignado: 'Ana Martínez'
  },
  {
    id: 3,
    contratoId: 4,
    titulo: 'Actualización de firewall completada',
    descripcion: 'Se ha actualizado el firmware del firewall a la última versión',
    prioridad: 'Baja',
    estado: 'Resuelta',
    fechaCreacion: '2024-08-15T10:00:00Z',
    fechaResolucion: '2024-08-15T16:30:00Z',
    tecnicoAsignado: 'Miguel López'
  },
  {
    id: 4,
    contratoId: 1,
    titulo: 'Backup automatizado falló',
    descripcion: 'El backup nocturno del día 17/08 no se completó correctamente',
    prioridad: 'Crítica',
    estado: 'Resuelta',
    fechaCreacion: '2024-08-18T07:00:00Z',
    fechaResolucion: '2024-08-18T09:45:00Z',
    tecnicoAsignado: 'Carlos Ruiz'
  }
]

// API Mock Service
class MockApiService {
  // Simular delay de red
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Clientes
  async getClientes(): Promise<Cliente[]> {
    await this.delay(500)
    return mockClientes.filter(c => c.activo)
  }

  async getCliente(id: number): Promise<Cliente | null> {
    await this.delay(300)
    return mockClientes.find(c => c.id === id) || null
  }

  async createCliente(cliente: Omit<Cliente, 'id' | 'fechaCreacion'>): Promise<Cliente> {
    await this.delay(600)
    const newCliente: Cliente = {
      ...cliente,
      id: Math.max(...mockClientes.map(c => c.id)) + 1,
      fechaCreacion: new Date().toISOString()
    }
    mockClientes.push(newCliente)
    return newCliente
  }

  // Contratos
  async getContratos(): Promise<Contrato[]> {
    await this.delay(500)
    return mockContratos.map(contrato => ({
      ...contrato,
      cliente: mockClientes.find(c => c.id === contrato.clienteId)
    }))
  }

  async getContrato(id: number): Promise<Contrato | null> {
    await this.delay(300)
    const contrato = mockContratos.find(c => c.id === id)
    if (!contrato) return null
    
    return {
      ...contrato,
      cliente: mockClientes.find(c => c.id === contrato.clienteId)
    }
  }

  // Incidencias
  async getIncidencias(): Promise<Incidencia[]> {
    await this.delay(500)
    return mockIncidencias.map(incidencia => ({
      ...incidencia,
      contrato: mockContratos.find(c => c.id === incidencia.contratoId)
    }))
  }

  async getIncidencia(id: number): Promise<Incidencia | null> {
    await this.delay(300)
    const incidencia = mockIncidencias.find(i => i.id === id)
    if (!incidencia) return null
    
    return {
      ...incidencia,
      contrato: mockContratos.find(c => c.id === incidencia.contratoId)
    }
  }

  // Dashboard Stats
  async getDashboardStats() {
    await this.delay(400)
    
    const clientesActivos = mockClientes.filter(c => c.activo).length
    const contratosActivos = mockContratos.filter(c => c.estado === 'Activo').length
    const incidenciasAbiertas = mockIncidencias.filter(i => i.estado === 'Abierta' || i.estado === 'En Progreso').length
    const mrrTotal = mockContratos
      .filter(c => c.estado === 'Activo')
      .reduce((total, c) => total + (c.valorTotal / 12), 0)

    return {
      clientesActivos,
      contratosActivos,
      incidenciasAbiertas,
      mrrTotal: Math.round(mrrTotal),
      ingresosMensuales: Math.round(mrrTotal * 1.15), // Simular crecimiento
      contratosPorTipo: {
        'Programas Informáticos': mockContratos.filter(c => c.tipoMantenimiento === 'Programas Informáticos' && c.estado === 'Activo').length,
        'GPS Tracker': mockContratos.filter(c => c.tipoMantenimiento === 'GPS Tracker' && c.estado === 'Activo').length,
        'Ciberseguridad': mockContratos.filter(c => c.tipoMantenimiento === 'Ciberseguridad' && c.estado === 'Activo').length
      }
    }
  }
}

export const mockApi = new MockApiService()
