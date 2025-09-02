import React from 'react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import ContratosBase from '../components/ContratosBase'

const Ciberseguridad: React.FC = () => {
  return (
    <ContratosBase
      tipoServicio="CIBERSEGURIDAD"
      titulo="Ciberseguridad"
      descripcion="Gestión de contratos de servicios de seguridad informática y protección de datos"
      icono={ShieldCheckIcon}
      color="bg-red-600"
    />
  )
}

export default Ciberseguridad
