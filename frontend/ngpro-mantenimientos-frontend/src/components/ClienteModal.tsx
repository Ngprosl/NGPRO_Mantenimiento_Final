import React, { useState, useEffect } from 'react';
import type { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../services/api';

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: CreateClienteRequest | UpdateClienteRequest) => void;
  cliente?: Cliente;
  title: string;
}

const ClienteModal: React.FC<ClienteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cliente,
  title,
}) => {
  const [formData, setFormData] = useState<CreateClienteRequest>({
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
    observaciones: '',
    nombreComercial: '',
    comercial: '',
    descatalogado: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        dniCif: cliente.dnicif || '',
        direccion: cliente.direccion || '',
        poblacion: cliente.poblacion || '',
        provincia: cliente.provincia || '',
        codPostal: cliente.codpostal || '',
        pais: cliente.pais || '',
        telef1: cliente.telef1 || '',
        telef2: cliente.telef2 || '',
        email1: cliente.email1 || '',
        email2: cliente.email2 || '',
        observaciones: cliente.observaciones || '',
        nombreComercial: cliente.nombrecomercial || '',
        comercial: cliente.comercial || '',
        descatalogado: cliente.descatalogado || false,
      });
    } else {
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
        observaciones: '',
        nombreComercial: '',
        comercial: '',
        descatalogado: false,
      });
    }
    setErrors({});
  }, [cliente, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.email1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email1)) {
      newErrors.email1 = 'Formato de email inválido';
    }

    if (formData.email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email2)) {
      newErrors.email2 = 'Formato de email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nombre - Campo obligatorio */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* DNI/CIF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI/CIF
              </label>
              <input
                type="text"
                name="dniCif"
                value={formData.dniCif}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Dirección */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Población */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Población
              </label>
              <input
                type="text"
                name="poblacion"
                value={formData.poblacion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Provincia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia
              </label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Código Postal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                name="codPostal"
                value={formData.codPostal}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Teléfono 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono 1
              </label>
              <input
                type="tel"
                name="telef1"
                value={formData.telef1}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Teléfono 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono 2
              </label>
              <input
                type="tel"
                name="telef2"
                value={formData.telef2}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email 1
              </label>
              <input
                type="email"
                name="email1"
                value={formData.email1}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.email1 ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.email1 && (
                <p className="text-red-500 text-sm mt-1">{errors.email1}</p>
              )}
            </div>

            {/* Email 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email 2
              </label>
              <input
                type="email"
                name="email2"
                value={formData.email2}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.email2 ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.email2 && (
                <p className="text-red-500 text-sm mt-1">{errors.email2}</p>
              )}
            </div>

            {/* Nombre Comercial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Comercial
              </label>
              <input
                type="text"
                name="nombreComercial"
                value={formData.nombreComercial}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Comercial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comercial
              </label>
              <input
                type="text"
                name="comercial"
                value={formData.comercial}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Observaciones */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Descatalogado */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="descatalogado"
                checked={formData.descatalogado}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Descatalogado
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteModal;
