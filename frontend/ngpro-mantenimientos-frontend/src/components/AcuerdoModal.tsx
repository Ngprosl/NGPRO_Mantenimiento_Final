// Modal para crear/editar acuerdo
import React, { useState, useEffect } from 'react';
import type { Acuerdo } from '../services/api';

const AcuerdoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Acuerdo>) => void;
  acuerdo?: Acuerdo;
  title: string;
}> = ({ isOpen, onClose, onSave, acuerdo, title }) => {
  const [form, setForm] = useState<Partial<Acuerdo>>(acuerdo || {
    NOMBRE: '',
    SEGMENTO: '',
    COMERCIAL: '',
    IMPORTE: '',
    OBSERVACIONES: '',
    ENVIADO: false,
    COBRADO: false,
    SEGUND_JUST_PRESENTADO: '',
    VALIDADOS: '',
  });

  // Helper para formatear fechas a YYYY-MM-DD desde Date, string, null, undefined
  const formatDate = (value?: string | Date | null): string => {
    if (!value) return '';
    if (typeof value === 'string') {
      // Si ya está en formato correcto
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      // Si viene en formato ISO (con hora)
      const d = new Date(value);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().slice(0, 10);
    }
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return '';
      return value.toISOString().slice(0, 10);
    }
    return '';
  };

  useEffect(() => {
    setForm(acuerdo ? {
      ...acuerdo,
      VALIDADOS: formatDate(acuerdo.VALIDADOS),
      SEGUND_JUST_PRESENTADO: formatDate(acuerdo.SEGUND_JUST_PRESENTADO),
    } : {
      NOMBRE: '',
      SEGMENTO: '',
      COMERCIAL: '',
      IMPORTE: '',
      OBSERVACIONES: '',
      ENVIADO: false,
      COBRADO: false,
      SEGUND_JUST_PRESENTADO: '',
      VALIDADOS: '',
    });
  }, [acuerdo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            const payload: Partial<Acuerdo> = {
              ID: 0,
              NOMBRE: form.NOMBRE || '',
              SEGMENTO: form.SEGMENTO || '',
              COMERCIAL: form.COMERCIAL || '',
              CIF_NIF: '',
              IMPORTE: form.IMPORTE || '',
              NBONO: '',
              VALIDADOS: form.VALIDADOS || undefined,
              LANZADOS: undefined,
              IVAPAGADO: undefined,
              PRIMER_JUST_PRESENTADO: undefined,
              SEGUND_JUST_PRESENTADO: form.SEGUND_JUST_PRESENTADO || undefined,
              OBSERVACIONES: form.OBSERVACIONES || '',
              FECHAFACTURA: undefined,
              PRESENTADOS: undefined,
              ENVIADO: !!form.ENVIADO,
              COBRADO: !!form.COBRADO,
              FECHA_ENVIADO: undefined,
              FECHA_COBRADO: undefined,
              BAJA: false,
            };
            onSave(payload);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Nombre</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={form.NOMBRE || ''} onChange={e => setForm(f => ({ ...f, NOMBRE: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Segmento</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={form.SEGMENTO || ''} onChange={e => setForm(f => ({ ...f, SEGMENTO: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Comercial</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={form.COMERCIAL || ''} onChange={e => setForm(f => ({ ...f, COMERCIAL: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Importe</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={form.IMPORTE || ''} onChange={e => setForm(f => ({ ...f, IMPORTE: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Observaciones</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={form.OBSERVACIONES || ''} onChange={e => setForm(f => ({ ...f, OBSERVACIONES: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Validado</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.VALIDADOS || ''} onChange={e => setForm(f => ({ ...f, VALIDADOS: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Segunda Justificación Presentado</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.SEGUND_JUST_PRESENTADO || ''} onChange={e => setForm(f => ({ ...f, SEGUND_JUST_PRESENTADO: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input type="checkbox" checked={!!form.ENVIADO} onChange={e => setForm(f => ({ ...f, ENVIADO: e.target.checked }))} />
              <span className="ml-2">Enviado</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={!!form.COBRADO} onChange={e => setForm(f => ({ ...f, COBRADO: e.target.checked }))} />
              <span className="ml-2">Cobrado</span>
            </label>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcuerdoModal;