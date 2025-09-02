import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Clientes', href: '/clientes' },
    { name: 'Contratos', href: '/contratos' },
    { name: 'Renovaciones', href: '/renovaciones' },
    { name: 'Incidencias', href: '/incidencias' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
            NGPRO Mantenimientos
          </h1>
        </div>
        
        <nav style={{ padding: '1rem' }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.25rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  color: isActive ? '#3b82f6' : '#6b7280',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              {user?.nombre}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              {user?.email}
            </p>
            <button 
              onClick={logout}
              style={{
                fontSize: '0.75rem',
                color: '#ef4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                padding: '0.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              ☰
            </button>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Bienvenido, {user?.nombre}
            </span>
          </div>
        </div>
        
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
