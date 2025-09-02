import React, { useEffect, useState } from 'react'
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { acuerdosApi, localizadoresApi } from '../services/api'
import { usePageTitle } from '../hooks/usePageTitle'

// Eliminado: solo mostramos ingresos anuales

const Dashboard: React.FC = () => {
  const [ingresosAcuerdos, setIngresosAcuerdos] = useState<number>(0);
  const [ingresosLocalizadores, setIngresosLocalizadores] = useState<number>(0);
  usePageTitle({ title: 'Dashboard' })
  const [ingresosAnuales, setIngresosAnuales] = useState<number>(0);
  const [ingresosMensuales, setIngresosMensuales] = useState<number>(0);
  const [clientesTotales, setClientesTotales] = useState<number>(0);
  const [clientesActivos, setClientesActivos] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Acuerdos activos y programas informáticos
        const acuerdos = await acuerdosApi.getActivos();
        interface Acuerdo { COBRADO?: boolean; IMPORTE?: string; SEGMENTO?: string; }
        // Todos los acuerdos cobrados
        const acuerdosCobrados = (acuerdos as Acuerdo[])
          .filter(a => a.COBRADO);
        const ingresosAcuerdosCalc = acuerdosCobrados
          .reduce((sum, a) => sum + (parseFloat(a.IMPORTE || '0') || 0), 0);
        setIngresosAcuerdos(ingresosAcuerdosCalc);

        // Localizadores (GPS)
        const localizadores = await localizadoresApi.getAll();
        interface Localizador {
          CLIENTE?: any;
          ClienteId?: any;
          Cliente?: { ID?: any };
          CUOTA_ANUAL_TOTAL?: number;
          CuotaAnualTotal?: number;
          CUOTA_MENSUAL_TOTAL?: number;
          CuotaMensualTotal?: number;
        }
        // Solo localizadores con cliente asociado
        const localizadoresConCliente = (localizadores as Localizador[])
          .filter(l => l.CLIENTE || l.ClienteId || (l.Cliente && l.Cliente.ID));
        const ingresosLocalizadoresCalc = localizadoresConCliente
          .reduce((sum, l) => sum + (l.CUOTA_ANUAL_TOTAL || l.CuotaAnualTotal || 0), 0);
        setIngresosLocalizadores(ingresosLocalizadoresCalc);
        console.log('Ingresos localizadores:', ingresosLocalizadoresCalc);
        // Ingresos mensuales solo de GPS activos (con cliente asociado)
        const ingresosMensuales = localizadoresConCliente
          .reduce((sum, l) => sum + (l.CUOTA_MENSUAL_TOTAL || l.CuotaMensualTotal || 0), 0);
        setIngresosMensuales(ingresosMensuales);
        console.log('Ingresos mensuales:', ingresosMensuales);
        // Actualizar ingresos anuales totales
        setIngresosAnuales(ingresosAcuerdosCalc + ingresosLocalizadoresCalc);
        console.log('Ingresos anuales totales:', ingresosAcuerdosCalc + ingresosLocalizadoresCalc);

  // pieData se define fuera del useEffect usando los estados

  // Clientes totales y activos
  interface Cliente { DESCATALOGADO?: boolean }
  const clientes = await import('../services/api').then(m => m.clientesApi.getAll());
  setClientesTotales(clientes.length);
  setClientesActivos((clientes as Cliente[]).filter(c => !c.DESCATALOGADO).length);
      } catch (error) {
        console.error('Error calculando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

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

  // Solo mostramos ingresos anuales

  // Datos para gráfico circular (usando valores de estado)
  // Asumiendo que ingresosAnuales = acuerdos + localizadores, y ingresosMensuales = solo localizadores
  // Para el gráfico, calculamos los valores a partir de los estados
  // Pie chart muestra los ingresos anuales reales de cada tipo
  const pieData = [
    { name: 'Localizadores', value: ingresosLocalizadores, color: '#10B981' },
    { name: 'Acuerdos Informáticos', value: ingresosAcuerdos, color: '#3B82F6' }
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base">Resumen de mantenimientos y contratos - Datos en tiempo real</p>
      </div>
      {/* Gráfico circular de ingresos anuales */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Ingresos Anuales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`€${value?.toLocaleString()}`, '']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Anuales</p>
              <p className="text-2xl font-semibold text-gray-900">€{ingresosAnuales.toLocaleString()}</p>
              <p className="text-xs text-green-600">Total anual (acuerdos cobrados + GPS)</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales GPS</p>
              <p className="text-2xl font-semibold text-gray-900">€{ingresosMensuales.toLocaleString()}</p>
              <p className="text-xs text-blue-600">Total mensual (solo GPS activos)</p>
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
              <p className="text-sm font-medium text-gray-600">Clientes Totales</p>
              <p className="text-2xl font-semibold text-gray-900">{clientesTotales}</p>
              <p className="text-xs text-green-600">Clientes activos: {clientesActivos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
