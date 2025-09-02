import React from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import ContratosBase from '../components/ContratosBase'

const GpsTracker: React.FC = () => {
  return (
    <ContratosBase
      tipoServicio="GPS_TRACKER"
      titulo="GPS Tracker"
      descripcion="Gestión de contratos de sistemas de localización y seguimiento vehicular"
      icono={MapPinIcon}
      color="bg-green-600"
    />
  )
}

export default GpsTracker
