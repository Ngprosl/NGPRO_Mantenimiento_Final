import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        try {
          // Simulación de login - aquí iría la llamada real a la API
          if (email === 'admin@ngpro.es' && password === 'admin123') {
            const user: User = {
              id: 1,
              nombre: 'Administrador',
              email: 'admin@ngpro.es',
              rol: 'Admin'
            }
            const token = 'fake-jwt-token'
            
            set({ 
              isAuthenticated: true, 
              user, 
              token 
            })
          } else {
            throw new Error('Credenciales inválidas')
          }
        } catch (error) {
          throw error
        }
      },
      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null 
        })
      },
      setUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      }),
    }
  )
)
