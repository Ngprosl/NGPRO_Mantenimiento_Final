import React, { useState, useEffect } from 'react';
import type { Localizador } from '../services/api';

interface ContratoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contrato: Partial<Localizador>) => void;
  contrato?: Localizador;
  title: string;
  clientes: Array<{ ID?: number; NOMBRE?: string; id?: number; nombre?: string }>;
}

const ContratoModal: React.FC<ContratoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contrato,
  title,
  clientes,
}) => {
  const [formData, setFormData] = useState<Partial<Localizador>>({
    ClienteId: 0,
    Comercial: '',
    Modelo: '',
    Gps: 0,
    AnoVenta: 0,
    CuotaMensualTotal: 0,
    Observaciones: '',
  });
  const [clienteError, setClienteError] = useState(false);

  useEffect(() => {
    if (contrato) {
      setFormData({
        ClienteId: contrato.ClienteId || 0,
        Comercial: contrato.Comercial || '',
        Modelo: contrato.Modelo || '',
        Gps: contrato.Gps || 0,
        AnoVenta: contrato.AnoVenta || 0,
        CuotaMensualTotal: contrato.CuotaMensualTotal || 0,
        Observaciones: contrato.Observaciones || '',
      });
    } else {
      setFormData({
        ClienteId: 0,
        Comercial: '',
        Modelo: '',
        Gps: 0,
        AnoVenta: 0,
        CuotaMensualTotal: 0,
        Observaciones: '',
      });
    }
  }, [contrato, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Gps' || name === 'CuotaMensualTotal' || name === 'AnoVenta' || name === 'ClienteId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ClienteId || formData.ClienteId === 0) {
      setClienteError(true);
      return;
    }
    setClienteError(false);
    const data = { ...formData };
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente <span className="text-red-600">*</span></label>
            <select
              name="ClienteId"
              value={formData.ClienteId}
              onChange={e => { handleChange(e); setClienteError(false); }}
              className={`w-full border rounded px-3 py-2 ${clienteError ? 'border-red-500' : ''}`}
            >
              <option value={0}>Selecciona un cliente...</option>
              {clientes.filter(c => {
                const id = typeof c.ID === 'number' ? c.ID : c.id;
                const nombre = c.NOMBRE || c.nombre;
                return typeof id === 'number' && !!nombre;
              }).map((cliente) => {
                const id = typeof cliente.ID === 'number' ? cliente.ID : cliente.id;
                const nombre = cliente.NOMBRE || cliente.nombre || `Cliente ${id}`;
                return (
                  <option key={`cliente-${id}`} value={id}>{nombre}</option>
                );
              })}
            </select>
            {clienteError && (
              <p className="text-red-600 text-xs mt-1">Debes seleccionar un cliente.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comercial</label>
            <input type="text" name="Comercial" value={formData.Comercial as string} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input type="text" name="Modelo" value={formData.Modelo as string} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPS</label>
            <input type="number" name="Gps" value={formData.Gps as number} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año Venta</label>
            <input type="number" name="AnoVenta" value={formData.AnoVenta as number} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">€/mes</label>
            <input type="number" name="CuotaMensualTotal" value={formData.CuotaMensualTotal as number} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea name="Observaciones" value={formData.Observaciones as string} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-ngpro-600 text-white rounded hover:bg-ngpro-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContratoModal;
