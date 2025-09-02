import React, { useState, useEffect, useCallback } from 'react'
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { localizadoresApi, apiClient } from '../services/api'
import ContratoModal from './ContratoModal';
import type { Localizador, Cliente } from '../services/api'
import { useTitle } from '../hooks/useTitle'

interface ContratosBaseProps {
  tipoServicio: string
  titulo: string
  descripcion: string
  icono: React.ElementType
  color: string
}

const ContratosBase: React.FC<ContratosBaseProps> = ({ 
  tipoServicio, 
  titulo, 
  descripcion, 
  icono: IconComponent, 
  color 
}) => {
  useTitle(`${titulo} - NGPRO Mantenimientos`)

  const [contratos, setContratos] = useState<Localizador[]>([])
  const [filteredContratos, setFilteredContratos] = useState<Localizador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContrato, setModalContrato] = useState<Localizador | undefined>(undefined);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Función auxiliar para obtener valores de campos (maneja mayúsculas/minúsculas)
  const getField = (item: Localizador | Record<string, unknown> | undefined, field: string): string => {
    if (!item) return ''
    const value = (item as Record<string, unknown>)[field] || 
                  (item as Record<string, unknown>)[field.toUpperCase()] || 
                  (item as Record<string, unknown>)[field.toLowerCase()] || ''
    return String(value)
  }

  // Función para obtener valores booleanos
  const getBooleanField = (item: Localizador, field: string): boolean => {
    // Para el campo 'activo', verificamos el estado del cliente
    if (field === 'activo') {
      // Un contrato está activo si:
      // 1. Existe el cliente Y
      // 2. El cliente NO está descatalogado
      const cliente = item.Cliente
      if (!cliente) return false
      
      const descatalogado = cliente.DESCATALOGADO ?? (cliente as Record<string, unknown>).descatalogado
      return descatalogado === false
    }
    
    // Para otros campos, usar la lógica original
    const value = (item as Record<string, unknown>)[field] || 
                  (item as Record<string, unknown>)[field.toUpperCase()] || 
                  (item as Record<string, unknown>)[field.toLowerCase()]
    return Boolean(value)
  }

  // Cargar contratos del tipo específico
  const loadContratos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await localizadoresApi.getByTipo(tipoServicio)
      
      if (Array.isArray(data)) {
        setContratos(data)
        setFilteredContratos(data)
      } else {
        console.error('❌ Los datos no son un array:', data)
        setError('Error: Los datos recibidos no tienen el formato esperado')
      }
    } catch (error) {
      console.error('❌ Error al cargar contratos:', error)
      setError('Error al cargar los contratos. Verifica que el backend esté funcionando.')
      
      // Datos de ejemplo para desarrollo cuando el backend no está disponible
      const datosEjemplo: Localizador[] = [
        {
          ID: 1,
          CLIENTE: 1,
          COMERCIAL: 'Juan Pérez',
          MODELO: 'Modelo GPS Pro',
          GPS: 1,
          IBBUTON: 'Botón de pánico activado',
          BLUETOOTH: 1,
          DESCUENTOS_APLICADOS: 10.5,
          CUOTA_MENSUAL_TOTAL: 45.99,
          CUOTA_ANUAL_TOTAL: 550.88,
          ANO_VENTA: 2024,
          OBSERVACIONES: 'Cliente premium con servicios adicionales',
          TIPO: tipoServicio,
          Cliente: {
            ID: 1,
            NOMBRE: 'Cliente Ejemplo 1',
            EMAIL1: 'cliente1@ejemplo.com',
            DNICIF: '12345678A',
            DESCATALOGADO: false // Cliente activo
          }
        },
        {
          ID: 2,
          CLIENTE: 2,
          COMERCIAL: 'María González',
          MODELO: 'Modelo GPS Básico',
          GPS: 1,
          IBBUTON: 'Sin botón de pánico',
          BLUETOOTH: 0,
          DESCUENTOS_APLICADOS: 5.0,
          CUOTA_MENSUAL_TOTAL: 29.99,
          CUOTA_ANUAL_TOTAL: 359.88,
          ANO_VENTA: 2024,
          OBSERVACIONES: 'Cliente estándar',
          TIPO: tipoServicio,
          Cliente: {
            ID: 2,
            NOMBRE: 'Cliente Ejemplo 2',
            EMAIL1: 'cliente2@ejemplo.com',
            DNICIF: '87654321B',
            DESCATALOGADO: true // Cliente inactivo
          }
        }
      ]
      setContratos(datosEjemplo)
      setFilteredContratos(datosEjemplo)
    } finally {
      setLoading(false)
    }
  }, [tipoServicio])

  useEffect(() => {
    loadContratos()
  }, [loadContratos])

  // Cargar clientes al montar el componente
  useEffect(() => {
    apiClient.getClientes().then(setClientes).catch(() => setClientes([]));
  }, []);

  // Función para filtrar contratos en tiempo real
  useEffect(() => {
    if (!searchTerm) {
      setFilteredContratos(contratos)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = contratos.filter(contrato => {
        const marca = getField(contrato, 'marca').toLowerCase();
        const modelo = getField(contrato, 'modelo').toLowerCase();
        const imei = getField(contrato, 'imei').toLowerCase();
        const numero = getField(contrato, 'numero').toLowerCase();
        const estado = getField(contrato, 'estado').toLowerCase();
        const clienteNombre = getField(contrato.Cliente, 'nombre').toLowerCase();
        const activo = getBooleanField(contrato, 'activo') ? 'activo' : 'inactivo';
        // Buscar año de venta en todas las variantes posibles
        const anoVenta = getField(contrato, 'ANO_VENTA') || getField(contrato, 'AnoVenta') || getField(contrato, 'anoVenta');
        const anoVentaStr = String(anoVenta).toLowerCase();

        return marca.includes(term) ||
               modelo.includes(term) ||
               imei.includes(term) ||
               numero.includes(term) ||
               estado.includes(term) ||
               clienteNombre.includes(term) ||
               activo.includes(term) ||
               anoVentaStr.includes(term);
      });
      setFilteredContratos(filtered)
    }
  }, [searchTerm, contratos])

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  // Handler para abrir modal de crear
  const handleCreate = () => {
    setModalContrato(undefined);
    setModalTitle('Nuevo Contrato');
    setModalMode('create');
    setModalOpen(true);
  };

  // Handler para abrir modal de editar
  const handleEdit = (contrato: Localizador) => {
    setModalContrato(contrato);
    setModalTitle('Editar Contrato');
    setModalMode('edit');
    setModalOpen(true);
  };

  // Handler para guardar contrato
  const handleSave = async (data: Partial<Localizador>) => {
    try {
      const payload = {
        clienteId: Number.isInteger(data.ClienteId) ? data.ClienteId : 0,
        comercial: data.Comercial ?? '',
        modelo: data.Modelo ?? '',
        gps: data.Gps ?? 0,
        ibButton: data.IbButton ?? '',
        bluetooth: data.Bluetooth ?? 0,
        descuentosAplicados: data.DescuentosAplicados ?? 0,
        cuotaMensualTotal: data.CuotaMensualTotal ?? 0,
        cuotaAnualTotal: data.CuotaAnualTotal ?? 0,
        anoVenta: data.AnoVenta ?? 0,
        observaciones: data.Observaciones ?? '',
        tipo: tipoServicio
      };
      if (modalMode === 'create') {
        await localizadoresApi.create(payload);
      } else if (modalContrato && typeof modalContrato.Id === 'number') {
        await localizadoresApi.update(modalContrato.Id, payload);
      }
      setModalOpen(false);
      loadContratos();
    } catch {
      alert('Error al guardar el contrato');
    }
  };

  // Handler para eliminar contrato
  const handleDelete = async (contrato: Localizador) => {
    if (window.confirm(`¿Seguro que quieres eliminar el contrato ID: ${contrato.Id}?`)) {
      if (typeof contrato.Id === 'number') {
        await localizadoresApi.delete(contrato.Id);
      }
      loadContratos();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ngpro-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Error</h3>
          </div>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadContratos}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 ${color} rounded-lg`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
              <p className="text-gray-600">{descripcion}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-ngpro-600 text-white rounded-lg hover:bg-ngpro-700 transition-colors flex items-center space-x-2" onClick={handleCreate}>
            <PlusIcon className="h-5 w-5" />
            <span>Nuevo Contrato</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-ngpro-500 focus:border-ngpro-500 text-sm"
            placeholder={`Buscar en ${titulo.toLowerCase()} por marca, modelo, cliente, estado...`}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contratos</p>
              <p className="text-2xl font-bold text-gray-900">{contratos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">GPS Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {contratos
                  .filter(c => {
                    const cliente = c.Cliente
                    if (!cliente) return false
                    const descatalogado = cliente.DESCATALOGADO ?? (cliente as Record<string, unknown>).descatalogado
                    return descatalogado === false
                  })
                  .reduce((sum, c) => sum + (Number(c.Gps) || 0), 0)
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">GPS Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">
                {contratos
                  .filter(c => {
                    const cliente = c.Cliente
                    if (!cliente) return true
                    const descatalogado = cliente.DESCATALOGADO ?? (cliente as Record<string, unknown>).descatalogado
                    return descatalogado === true
                  })
                  .reduce((sum, c) => sum + (Number(c.Gps) || 0), 0)
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">GPS Este Año</p>
              <p className="text-2xl font-bold text-gray-900">
                {contratos.filter(c => {
                  const anoVenta = getField(c, 'ANO_VENTA') || getField(c, 'AnoVenta')
                  if (!anoVenta) return false
                  const currentYear = new Date().getFullYear()
                  return Number(anoVenta) === currentYear
                }).reduce((sum, c) => sum + (Number(c.Gps) || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de contratos */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Contratos de {titulo} ({filteredContratos.length})
          </h3>
        </div>
        
        {filteredContratos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron contratos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredContratos.map((contrato) => {
              const id = contrato.Id
              const clienteNombre = contrato.Cliente?.NOMBRE || contrato.Cliente?.nombre || 'Sin cliente'
              const modelo = contrato.Modelo || ''
              const activo = getBooleanField(contrato, 'activo')
              const comercial = contrato.Comercial || ''
              const gps = contrato.Gps || 0
              const cuotaMensual = contrato.CuotaMensualTotal || 0
              const anoVenta = contrato.AnoVenta || ''

              return (
                <div key={id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{clienteNombre || 'Sin cliente'}</h4>
                      <p className="text-sm text-gray-600">{modelo}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Año Alta:</span> {anoVenta || 'Sin año'}
                    </div>
                    <div>
                      <span className="font-medium">Comercial:</span> {comercial || 'Sin comercial'}
                    </div>
                    <div>
                      <span className="font-medium">GPS:</span> {gps}
                    </div>
                    <div>
                      <span className="font-medium">€/mes:</span> {Number(cuotaMensual).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})} €
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => handleEdit(contrato)}>
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDelete(contrato)}>
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ContratoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        contrato={modalContrato}
        clientes={clientes}
        title={modalTitle}
      />
    </div>
  )
}

export default ContratosBase
