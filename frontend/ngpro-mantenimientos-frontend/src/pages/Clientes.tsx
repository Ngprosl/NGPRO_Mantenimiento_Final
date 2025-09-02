/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from 'react'
import { clientesApi, type Cliente, type CreateClienteRequest, type UpdateClienteRequest } from '../services/api'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { usePageTitle } from '../hooks/usePageTitle'

const Clientes: React.FC = () => {
  usePageTitle({ title: 'Gestión de Clientes' })
  
  const [allClientes, setAllClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  
  // Estado para operaciones CRUD
  const [saving, setSaving] = useState(false)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    dniCif: '',
    direccion: '',
    poblacion: '',
    provincia: '',
    codPostal: '',
    pais: '',
    telef1: '',
    telef2: '',
    email1: '',
    email2: '',
    nombreComercial: '',
    comercial: '',
    observaciones: '',
    descatalogado: false
  })

  // Función para cargar TODOS los clientes
  const loadAllClientes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await clientesApi.getAll()
      
      if (Array.isArray(data)) {
        setAllClientes(data)
        setFilteredClientes(data) // Mostrar todos inicialmente
      } else {
        console.error('❌ Los datos no son un array:', data)
        setError('Error: Los datos recibidos no tienen el formato esperado')
      }
    } catch (error) {
      console.error('❌ Error al cargar clientes:', error)
      setError('Error al cargar los clientes. Verifica que el backend esté funcionando.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAllClientes()
  }, [loadAllClientes])

  // Función para filtrar clientes en tiempo real
  useEffect(() => {
    if (!searchTerm) {
      setFilteredClientes(allClientes)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = allClientes.filter(cliente => {
        const clienteAny = cliente as any
        
        // Campos básicos
        const nombre = (clienteAny.NOMBRE || clienteAny.nombre || '').toLowerCase()
        const email1 = (clienteAny.EMAIL1 || clienteAny.email1 || '').toLowerCase()
        const email2 = (clienteAny.EMAIL2 || clienteAny.email2 || '').toLowerCase()
        const dnicif = (clienteAny.DNICIF || clienteAny.dnicif || '').toLowerCase()
        
        // Campos de ubicación
        const direccion = (clienteAny.DIRECCION || clienteAny.direccion || '').toLowerCase()
        const poblacion = (clienteAny.POBLACION || clienteAny.poblacion || '').toLowerCase()
        const provincia = (clienteAny.PROVINCIA || clienteAny.provincia || '').toLowerCase()
        const codPostal = (clienteAny.CODPOSTAL || clienteAny.codpostal || '').toLowerCase()
        const pais = (clienteAny.PAIS || clienteAny.pais || '').toLowerCase()
        
        // Campos de contacto
        const telef1 = (clienteAny.TELEF1 || clienteAny.telef1 || '').toLowerCase()
        const telef2 = (clienteAny.TELEF2 || clienteAny.telef2 || '').toLowerCase()
        
        // Campos comerciales
        const nombreComercial = (clienteAny.NOMBRECOMERCIAL || clienteAny.nombrecomercial || '').toLowerCase()
        const comercial = (clienteAny.COMERCIAL || clienteAny.comercial || '').toLowerCase()
        
        // Estado activo/inactivo
        const descatalogado = clienteAny.DESCATALOGADO || clienteAny.descatalogado
        const estado = descatalogado ? 'inactivo' : 'activo'
        const estadoAlternativo = descatalogado ? 'descatalogado' : 'catalogado'
        
        // Observaciones
        const observaciones = (clienteAny.OBSERVACIONES || clienteAny.observaciones || '').toLowerCase()
        
        return nombre.includes(term) ||
               email1.includes(term) ||
               email2.includes(term) ||
               dnicif.includes(term) ||
               direccion.includes(term) ||
               poblacion.includes(term) ||
               provincia.includes(term) ||
               codPostal.includes(term) ||
               pais.includes(term) ||
               telef1.includes(term) ||
               telef2.includes(term) ||
               nombreComercial.includes(term) ||
               comercial.includes(term) ||
               estado.includes(term) ||
               estadoAlternativo.includes(term) ||
               observaciones.includes(term)
      })
      setFilteredClientes(filtered)
    }
  }, [searchTerm, allClientes])

  // Función para manejar cambios en la búsqueda
  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  // Funciones para el modal
  const handleAddCliente = () => {
    setFormData({
      nombre: '',
      dniCif: '',
      direccion: '',
      poblacion: '',
      provincia: '',
      codPostal: '',
      pais: '',
      telef1: '',
      telef2: '',
      email1: '',
      email2: '',
      nombreComercial: '',
      comercial: '',
      observaciones: '',
      descatalogado: false
    })
    setSelectedCliente(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    const clienteAny = cliente as any
    setFormData({
      nombre: getClienteField(clienteAny, 'nombre') || '',
      dniCif: getClienteField(clienteAny, 'dnicif') || '',
      direccion: getClienteField(clienteAny, 'direccion') || '',
      poblacion: getClienteField(clienteAny, 'poblacion') || '',
      provincia: getClienteField(clienteAny, 'provincia') || '',
      codPostal: getClienteField(clienteAny, 'codpostal') || '',
      pais: getClienteField(clienteAny, 'pais') || '',
      telef1: getClienteField(clienteAny, 'telef1') || '',
      telef2: getClienteField(clienteAny, 'telef2') || '',
      email1: getClienteField(clienteAny, 'email1') || '',
      email2: getClienteField(clienteAny, 'email2') || '',
      nombreComercial: getClienteField(clienteAny, 'nombrecomercial') || '',
      comercial: getClienteField(clienteAny, 'comercial') || '',
      observaciones: getClienteField(clienteAny, 'observaciones') || '',
      descatalogado: clienteAny.descatalogado || clienteAny.DESCATALOGADO || false
    })
    setSelectedCliente(cliente)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleDeleteCliente = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        setSaving(true)
        await clientesApi.delete(id)
        await loadAllClientes() // Recargar todos los datos
      } catch (error) {
        console.error('Error al eliminar cliente:', error)
        setError('Error al eliminar el cliente.')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleSaveCliente = async () => {
    try {
      setSaving(true)
      
      // Verificar que el campo nombre no esté vacío
      if (!formData.nombre || formData.nombre.trim() === '') {
        setError('El campo nombre es obligatorio')
        return
      }
      
      if (modalMode === 'edit' && selectedCliente) {
        const clienteAny = selectedCliente as any
        const id = clienteAny.id || clienteAny.ID
        await clientesApi.update(id, formData as UpdateClienteRequest)
      } else {
        await clientesApi.create(formData as CreateClienteRequest)
      }
      
      setModalOpen(false)
      await loadAllClientes() // Recargar todos los datos
    } catch (error) {
      console.error('Error al guardar cliente:', error)
      setError('Error al guardar el cliente.')
    } finally {
      setSaving(false)
    }
  }

  // Funciones auxiliares para mostrar datos (manejar mayúsculas/minúsculas)
  const getClienteField = (cliente: any, field: string): string => {
    return cliente[field] || cliente[field.toUpperCase()] || cliente[field.toLowerCase()] || ''
  }

  const getEstadoCliente = (cliente: any) => {
    const descatalogado = cliente.descatalogado || cliente.DESCATALOGADO
    return descatalogado ? 'Inactivo' : 'Activo'
  }

  const getEstadoColor = (cliente: any) => {
    const descatalogado = cliente.descatalogado || cliente.DESCATALOGADO
    return descatalogado 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800'
  }

  // Componente para tarjeta móvil individual
  const ClienteCard = ({ cliente }: { cliente: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 hover:shadow-lg transition-all duration-200 hover:border-ngpro-300">
      {/* Header de la tarjeta */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
            {getClienteField(cliente, 'nombre') || 'Sin nombre'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {getClienteField(cliente, 'nombrecomercial') || getClienteField(cliente, 'dnicif') || 'Sin identificación'}
          </p>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shrink-0 ml-2 ${getEstadoColor(cliente)}`}>
          {getEstadoCliente(cliente)}
        </span>
      </div>

      {/* Información de contacto */}
      <div className="space-y-2">
        {getClienteField(cliente, 'comercial') && (
          <div className="flex items-center text-xs text-gray-600 min-w-0">
            <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate font-medium text-ngpro-600">{getClienteField(cliente, 'comercial')}</span>
          </div>
        )}
        {getClienteField(cliente, 'email1') && (
          <div className="flex items-center text-xs text-gray-600 min-w-0">
            <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{getClienteField(cliente, 'email1')}</span>
          </div>
        )}
        {getClienteField(cliente, 'telef1') && (
          <div className="flex items-center text-xs text-gray-600">
            <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{getClienteField(cliente, 'telef1')}</span>
          </div>
        )}
        {getClienteField(cliente, 'poblacion') && (
          <div className="flex items-center text-xs text-gray-600 min-w-0">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {getClienteField(cliente, 'poblacion')}
              {getClienteField(cliente, 'provincia') && `, ${getClienteField(cliente, 'provincia')}`}
            </span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        <button 
          onClick={() => handleEditCliente(cliente)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          disabled={saving}
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button 
          onClick={() => {
            const id = (cliente as any).id || (cliente as any).ID
            handleDeleteCliente(id)
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          disabled={saving}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ngpro-500"></div>
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
            onClick={loadAllClientes}
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
      {/* Header responsive */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Administra la información de tus clientes ({allClientes.length} total)
          </p>
        </div>
        <button
          onClick={handleAddCliente}
          className="btn-primary flex items-center justify-center space-x-2 w-full lg:w-auto shrink-0"
          disabled={saving}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-ngpro-500 focus:border-ngpro-500 text-sm"
          placeholder="Buscar por nombre, email, teléfono, DNI/CIF, dirección, comercial, activo/inactivo..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Estadísticas compactas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-ngpro-100 rounded-lg">
              <UserIcon className="w-5 h-5 text-ngpro-600" />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-900 truncate">{allClientes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xs text-gray-600">Activos</p>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {allClientes.filter(c => !((c as any).descatalogado || (c as any).DESCATALOGADO)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xs text-gray-600">Inactivos</p>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {allClientes.filter(c => (c as any).descatalogado || (c as any).DESCATALOGADO).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xs text-gray-600">Filtrados</p>
              <p className="text-lg font-semibold text-gray-900 truncate">{filteredClientes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información de resultados */}
      {searchTerm && (
        <div className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg">
          <p className="text-sm text-blue-700 min-w-0 truncate pr-4">
            Mostrando {filteredClientes.length} resultado{filteredClientes.length !== 1 ? 's' : ''} para "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium shrink-0"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Vista responsive: Grid de tarjetas para todas las pantallas */}
      <div>
        {filteredClientes.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron clientes con ese término de búsqueda.' : 'Comienza agregando un nuevo cliente.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClientes.map((cliente: any) => (
              <ClienteCard 
                key={(cliente as any).id || (cliente as any).ID} 
                cliente={cliente} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal CRUD completo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {modalMode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSaveCliente(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI/CIF
                    </label>
                    <input
                      type="text"
                      value={formData.dniCif}
                      onChange={(e) => setFormData({...formData, dniCif: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email1}
                      onChange={(e) => setFormData({...formData, email1: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telef1}
                      onChange={(e) => setFormData({...formData, telef1: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Población
                    </label>
                    <input
                      type="text"
                      value={formData.poblacion}
                      onChange={(e) => setFormData({...formData, poblacion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      value={formData.provincia}
                      onChange={(e) => setFormData({...formData, provincia: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={formData.codPostal}
                      onChange={(e) => setFormData({...formData, codPostal: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      value={formData.pais}
                      onChange={(e) => setFormData({...formData, pais: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Comercial
                    </label>
                    <input
                      type="text"
                      value={formData.nombreComercial}
                      onChange={(e) => setFormData({...formData, nombreComercial: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comercial
                    </label>
                    <input
                      type="text"
                      value={formData.comercial}
                      onChange={(e) => setFormData({...formData, comercial: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      rows={3}
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.descatalogado}
                        onChange={(e) => setFormData({...formData, descatalogado: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Cliente inactivo</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formData.nombre.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {saving && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clientes
