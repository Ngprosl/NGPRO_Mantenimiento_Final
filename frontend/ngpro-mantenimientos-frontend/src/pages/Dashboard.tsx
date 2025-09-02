import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { mockApi } from '../services/mockApi'
import { usePageTitle } from '../hooks/usePageTitle'

interface DashboardStats {
  clientesActivos: number
  contratosActivos: number
  incidenciasAbiertas: number
  mrrTotal: number
  ingresosMensuales: number
  contratosPorTipo: Record<string, number>
}

const Dashboard: React.FC = () => {
  usePageTitle({ title: 'Dashboard' })
  
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await mockApi.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ngpro-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600">Error al cargar los datos del dashboard</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-ngpro-600 hover:text-ngpro-700 underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Datos para gráficos
  const revenueData = [
    { name: 'Ene', Software: stats.mrrTotal * 0.4, GPS: stats.mrrTotal * 0.3, Ciber: stats.mrrTotal * 0.3 },
    { name: 'Feb', Software: stats.mrrTotal * 0.45, GPS: stats.mrrTotal * 0.25, Ciber: stats.mrrTotal * 0.3 },
    { name: 'Mar', Software: stats.mrrTotal * 0.5, GPS: stats.mrrTotal * 0.35, Ciber: stats.mrrTotal * 0.15 },
    { name: 'Abr', Software: stats.mrrTotal * 0.55, GPS: stats.mrrTotal * 0.3, Ciber: stats.mrrTotal * 0.15 },
    { name: 'May', Software: stats.mrrTotal * 0.48, GPS: stats.mrrTotal * 0.32, Ciber: stats.mrrTotal * 0.2 },
    { name: 'Jun', Software: stats.mrrTotal * 0.5, GPS: stats.mrrTotal * 0.3, Ciber: stats.mrrTotal * 0.2 },
  ]

  const contractsData = Object.entries(stats.contratosPorTipo).map(([tipo, cantidad], index) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b']
    return {
      name: tipo.replace('Programas Informáticos', 'Software'),
      value: cantidad,
      color: colors[index % colors.length]
    }
  })

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base">Resumen de mantenimientos y contratos - Datos en tiempo real</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-ngpro-100 rounded-lg">
              <svg className="w-6 h-6 text-ngpro-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">MRR</p>
              <p className="text-2xl font-semibold text-gray-900">€{stats.mrrTotal.toLocaleString()}</p>
              <p className="text-xs text-green-600">+5.2% este mes</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.contratosActivos}</p>
              <p className="text-xs text-gray-500">{stats.clientesActivos} clientes</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
              <p className="text-2xl font-semibold text-gray-900">€{stats.ingresosMensuales.toLocaleString()}</p>
              <p className="text-xs text-green-600">+8.1% vs mes anterior</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.68 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Incidencias Abiertas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.incidenciasAbiertas}</p>
              <p className="text-xs text-yellow-600">Requieren atención</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ingresos por Área de Mantenimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`€${value?.toLocaleString()}`, '']} />
              <Bar dataKey="Software" fill="#3B82F6" name="Programas Informáticos" />
              <Bar dataKey="GPS" fill="#10B981" name="GPS Tracker" />
              <Bar dataKey="Ciber" fill="#F59E0B" name="Ciberseguridad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Contratos por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contractsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {contractsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Resumen por Área</h4>
          <div className="space-y-3">
            {Object.entries(stats.contratosPorTipo).map(([tipo, cantidad]) => (
              <div key={tipo} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{tipo}</span>
                <span className="text-sm font-medium text-gray-900">{cantidad} contratos</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Estado del Sistema</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conexión Base de Datos</span>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Simulado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Backend</span>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Mock Data</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Última Actualización</span>
              <span className="text-xs text-gray-500">Hace 2 min</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Próximos Pasos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-ngpro-500">•</span>
              <span className="text-gray-600">Instalar .NET 8 SDK</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-ngpro-500">•</span>
              <span className="text-gray-600">Configurar SQL Server</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-ngpro-500">•</span>
              <span className="text-gray-600">Conectar API real</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
