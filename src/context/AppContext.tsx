import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, Dashboard, Toast } from '../types'

interface AppContextType {
  user: User | null
  dashboard: Dashboard
  toasts: Toast[]
  setUser: (user: User | null) => void
  updateDashboard: (dashboard: Partial<Dashboard>) => void
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEY = 'wcg_user'
const DASHBOARD_KEY = 'wcg_dashboard'

const defaultDashboard: Dashboard = {
  creators: [],
  projects: [],
  brands: [],
  content: [],
  launchPages: [],
  products: [],
  orders: [],
  notes: [],
  experiments: [],
  services: [],
  activity: [],
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [dashboard, setDashboard] = useState<Dashboard>(defaultDashboard)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  // Load dashboard from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(DASHBOARD_KEY)
      if (stored) {
        setDashboard(JSON.parse(stored))
      }
    }
  }, [user])

  // Save user to localStorage
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser)
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(DASHBOARD_KEY)
    }
  }

  // Save dashboard to localStorage
  const handleUpdateDashboard = (updates: Partial<Dashboard>) => {
    const updated = { ...dashboard, ...updates }
    setDashboard(updated)
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(updated))
  }

  // Add toast notification
  const handleAddToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration: 3000 }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  // Logout
  const handleLogout = () => {
    handleSetUser(null)
    setDashboard(defaultDashboard)
  }

  return (
    <AppContext.Provider
      value={{
        user,
        dashboard,
        toasts,
        setUser: handleSetUser,
        updateDashboard: handleUpdateDashboard,
        addToast: handleAddToast,
        logout: handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
