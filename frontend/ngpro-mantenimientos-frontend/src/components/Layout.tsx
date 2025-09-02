import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import logoNgpro from '../assets/logongpro.png'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Clientes', href: '/clientes', icon: UsersIcon },
  ]

  const contractsSubMenu = [
    { 
      name: 'Programas Informáticos', 
      href: '/contratos/programas-informaticos', 
      icon: ComputerDesktopIcon,
      description: 'Gestión de software y aplicaciones'
    },
    { 
      name: 'GPS Tracker', 
      href: '/contratos/gps-tracker', 
      icon: MapPinIcon,
      description: 'Sistemas de localización y seguimiento'
    },
    { 
      name: 'Ciberseguridad', 
      href: '/contratos/ciberseguridad', 
      icon: ShieldCheckIcon,
      description: 'Servicios de seguridad informática'
    }
  ]

  const otherNavigation = [
    { name: 'Renovaciones', href: '/renovaciones', icon: CalendarIcon },
    { name: 'Incidencias', href: '/incidencias', icon: ExclamationTriangleIcon },
  ]

  // Abrir automáticamente el menú de contratos si estamos en una página de contrato
  const isContractsActive = contractsSubMenu.some(item => location.pathname === item.href)
  const [contractsOpen, setContractsOpen] = useState(isContractsActive)

  // Efecto para abrir el menú automáticamente
  React.useEffect(() => {
    if (isContractsActive) {
      setContractsOpen(true)
    }
  }, [isContractsActive, location.pathname])

  const renderNavigationItems = (isMobile = false) => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-3 py-2 ${isMobile ? 'mb-1' : ''} text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-ngpro-50 text-ngpro-700 border-r-2 border-ngpro-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </Link>
        )
      })}

      {/* Contratos con submenu */}
      <div className={isMobile ? 'mb-1' : ''}>
        <button
          onClick={() => setContractsOpen(!contractsOpen)}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isContractsActive
              ? 'bg-ngpro-50 text-ngpro-700 border-r-2 border-ngpro-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <DocumentTextIcon className="mr-3 h-5 w-5 flex-shrink-0" />
            Contratos
          </div>
          {contractsOpen ? (
            <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
          )}
        </button>
        
        {/* Submenu con animación */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          contractsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="ml-6 mt-1 space-y-1">
            {contractsSubMenu.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-ngpro-100 text-ngpro-800 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false)
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {otherNavigation.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-3 py-2 ${isMobile ? 'mb-1' : ''} text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-ngpro-50 text-ngpro-700 border-r-2 border-ngpro-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src={logoNgpro} 
              alt="NGPRO Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-ngpro-600">NGPRO</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-4">
          {renderNavigationItems(true)}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
            <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
            <button 
              onClick={logout}
              className="text-xs text-red-600 hover:text-red-700 underline"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img 
                src={logoNgpro} 
                alt="NGPRO Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-ngpro-600">NGPRO Mantenimientos</h1>
            </div>
          </div>
          
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {renderNavigationItems(false)}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
              <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
              <button 
                onClick={logout}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-x-2 sm:gap-x-4 border-b border-gray-200 bg-white px-2 sm:px-4 lg:px-8 shadow-sm">
          <button 
            type="button" 
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 items-center justify-between min-w-0">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
              {(() => {
                // Buscar en navigation principal
                const mainNav = navigation.find(item => item.href === location.pathname)
                if (mainNav) return mainNav.name
                
                // Buscar en submenu de contratos
                const contractNav = contractsSubMenu.find(item => item.href === location.pathname)
                if (contractNav) return contractNav.name
                
                // Buscar en other navigation
                const otherNav = otherNavigation.find(item => item.href === location.pathname)
                if (otherNav) return otherNav.name
                
                return 'Dashboard'
              })()}
            </h2>
            
            <div className="flex items-center gap-x-2">
              <span className="text-xs sm:text-sm text-gray-700 truncate max-w-32 sm:max-w-none">
                <span className="hidden sm:inline">Bienvenido, </span>{user?.nombre}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
