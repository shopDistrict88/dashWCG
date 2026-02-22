import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import type { User, Dashboard, Toast } from '../types'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

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
  const { user: authUser, logout: authLogout } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [dashboard, setDashboard] = useState<Dashboard>(defaultDashboard)
  const [toasts, setToasts] = useState<Toast[]>([])
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (!authUser) { setUser(null); setDashboard(defaultDashboard); loaded.current = false; return }

    const appUser: User = {
      id: authUser.id,
      email: authUser.email || '',
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
      createdAt: authUser.created_at || new Date().toISOString(),
    }
    setUser(appUser)

    supabase
      .from('dashboard_data')
      .select('data')
      .eq('user_id', authUser.id)
      .eq('module_key', 'wcg_dashboard')
      .maybeSingle()
      .then(({ data: row }) => {
        if (row?.data) {
          setDashboard({ ...defaultDashboard, ...(row.data as Partial<Dashboard>) })
        }
        loaded.current = true
      })
  }, [authUser])

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser)
  }

  const handleUpdateDashboard = (updates: Partial<Dashboard>) => {
    const updated = { ...dashboard, ...updates }
    setDashboard(updated)

    if (!authUser) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      supabase
        .from('dashboard_data')
        .upsert(
          { user_id: authUser.id, module_key: 'wcg_dashboard', data: updated as unknown as Record<string, unknown> },
          { onConflict: 'user_id,module_key' }
        )
        .then()
    }, 800)
  }

  const handleAddToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration: 3000 }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => { setToasts((prev) => prev.filter((t) => t.id !== id)) }, 3000)
  }

  const handleLogout = () => {
    setUser(null)
    setDashboard(defaultDashboard)
    authLogout()
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
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
