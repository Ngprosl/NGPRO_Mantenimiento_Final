import React, { useEffect, useState } from 'react';
import { acuerdosApi } from '../services/api';
import type { Acuerdo } from '../services/api';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AcuerdoModal from './AcuerdoModal';

interface AcuerdosBaseProps {
  titulo: string;
  descripcion: string;
  icono: React.ElementType;
  color: string;
}

const AcuerdosBase: React.FC<AcuerdosBaseProps> = ({ titulo, descripcion, icono: IconComponent, color }) => {
  const [acuerdos, setAcuerdos] = useState<Acuerdo[]>([]);
  const [acuerdosActivos, setAcuerdosActivos] = useState<Acuerdo[]>([]);
  const [filteredAcuerdos, setFilteredAcuerdos] = useState<Acuerdo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAcuerdo, setModalAcuerdo] = useState<Acuerdo | undefined>(undefined);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // CRUD handlers
  const loadAcuerdos = () => {
    setLoading(true);
    Promise.all([acuerdosApi.getTotal(), acuerdosApi.getActivos()])
      .then(([todos, activos]) => {
        setAcuerdos(todos);
        setAcuerdosActivos(activos);
        setFilteredAcuerdos(todos);
      })
      .catch(() => setError('Error al cargar acuerdos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAcuerdos();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAcuerdos(acuerdos);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredAcuerdos(
        acuerdos.filter(a => {
          const isActivo = acuerdosActivos.some(act => act.ID === a.ID);
          const activoStr = isActivo ? 'activo' : 'inactivo';
          let estado = 'pendiente';
          if (a.COBRADO) estado = 'cobrado';
          else if (a.ENVIADO) estado = 'enviado';

          return (
            (a.NOMBRE || '').toLowerCase().includes(term) ||
            (a.SEGMENTO || '').toLowerCase().includes(term) ||
            (a.COMERCIAL || '').toLowerCase().includes(term) ||
            (a.IMPORTE || '').toLowerCase().includes(term) ||
            (a.OBSERVACIONES || '').toLowerCase().includes(term) ||
            activoStr === term ||
            estado === term
          );
        })
      );
    }
  }, [searchTerm, acuerdos, acuerdosActivos]);

  const handleCreate = () => {
    setModalAcuerdo(undefined);
    setModalTitle('Nuevo Acuerdo');
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEdit = (acuerdo: Acuerdo) => {
    setModalAcuerdo(acuerdo);
    setModalTitle('Editar Acuerdo');
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = async (acuerdo: Acuerdo) => {
    if (window.confirm(`¿Seguro que quieres eliminar el acuerdo ID: ${acuerdo.ID}?`)) {
      await acuerdosApi.delete(acuerdo.ID);
      loadAcuerdos();
    }
  };

  const handleSave = async (data: Partial<Acuerdo>) => {
    if (modalMode === 'create') {
      await acuerdosApi.create(data);
    } else if (modalAcuerdo && modalAcuerdo.ID) {
      await acuerdosApi.update(modalAcuerdo.ID, data);
    }
    setModalOpen(false);
    loadAcuerdos();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <span className="h-6 w-6 text-red-600 mr-2">!</span>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
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
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            onClick={handleCreate}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nuevo Acuerdo</span>
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
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder={`Buscar en ${titulo.toLowerCase()} por nombre, segmento, comercial, estado...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* KPIs resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Acuerdos</p>
              <p className="text-2xl font-bold text-gray-900">{acuerdos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acuerdos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{acuerdosActivos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acuerdos Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{acuerdos.length - acuerdosActivos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acuerdos Este Año</p>
              <p className="text-2xl font-bold text-gray-900">{
                acuerdos.filter(a => {
                  if (!a.SEGUND_JUST_PRESENTADO) return false;
                  const fecha = new Date(a.SEGUND_JUST_PRESENTADO);
                  return fecha.getFullYear() === new Date().getFullYear();
                }).length
              }</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de acuerdos */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Acuerdos de {titulo} ({filteredAcuerdos.length})
          </h3>
        </div>
        {filteredAcuerdos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron acuerdos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredAcuerdos.map((a) => {
              const isActivo = acuerdosActivos.some(act => act.ID === a.ID);
              let estado = 'pendiente';
              let estadoColor = 'bg-gray-100 text-gray-800';
              if (a.COBRADO) {
                estado = 'cobrado';
                estadoColor = 'bg-green-100 text-green-800';
              } else if (a.ENVIADO) {
                estado = 'enviado';
                estadoColor = 'bg-yellow-100 text-yellow-800';
              }
              return (
                <div key={a.ID} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{a.NOMBRE || 'Sin nombre'}</h4>
                      <p className="text-sm text-gray-600">{a.SEGMENTO || 'Sin segmento'}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isActivo ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${estadoColor}`}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 flex-1">
                    <div>
                      <span className="font-medium">Comercial:</span> {a.COMERCIAL || 'Sin comercial'}
                    </div>
                    <div>
                      <span className="font-medium">Importe:</span> {a.IMPORTE || '-'}
                    </div>
                    <div>
                      <span className="font-medium">Validado:</span> {a.VALIDADOS || '-'}
                    </div>
                    <div>
                      <span className="font-medium">Observaciones:</span> {a.OBSERVACIONES || '-'}
                    </div>
                  </div>
                  {/* Botones de acción */}
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => handleEdit(a)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => handleDelete(a)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Modal de crear/editar */}
      <AcuerdoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        acuerdo={modalAcuerdo}
        title={modalTitle}
      />
    </div>
  );
};

export default AcuerdosBase;