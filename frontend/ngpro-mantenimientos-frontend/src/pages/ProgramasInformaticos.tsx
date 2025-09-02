import React from 'react'
import AcuerdosBase from '../components/AcuerdosBase'


import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

const ProgramasInformaticos: React.FC = () => {
  return (
    <AcuerdosBase
      titulo="Programas Informáticos"
      descripcion="Gestión de acuerdos de software y aplicaciones empresariales"
      icono={ComputerDesktopIcon}
      color="bg-blue-600"
    />
  );
}

export default ProgramasInformaticos
