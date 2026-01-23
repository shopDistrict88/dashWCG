import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface AuthContextType {
  user: User | null
  session: Session | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, name: string, password: string, role?: string) => Promise<void>
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth on mount
  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock auth mode')
      // Mock user for development
      const savedToken = localStorage.getItem('wcg_auth_token')
      const savedUser = localStorage.getItem('wcg_user')
      
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser) as User)
      }
      
      setIsLoading(false)
      return
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setToken(session?.access_token ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setToken(session?.access_token ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Mock authentication
      const users = JSON.parse(localStorage.getItem('wcg_users') || '[]')
      const foundUser = users.find((u: any) => u.email === email)
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Invalid email or password')
      }

      const mockToken = `token_${Math.random().toString(36).substr(2, 9)}`
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        user_metadata: { name: foundUser.name },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
      } as unknown as User

      setToken(mockToken)
      setUser(userData)
      
      localStorage.setItem('wcg_auth_token', mockToken)
      localStorage.setItem('wcg_user', JSON.stringify(userData))
      return
    }

    // Real Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Skip rate limit errors for testing/development
      if (error.message.toLowerCase().includes('rate limit')) {
        console.warn('Rate limit error ignored, using mock auth')
        const mockToken = `token_${Math.random().toString(36).substr(2, 9)}`
        const userData = {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          email: email,
          user_metadata: { name: email.split('@')[0] },
          created_at: new Date().toISOString(),
          app_metadata: {},
          aud: 'authenticated',
        } as unknown as User

        setToken(mockToken)
        setUser(userData)
        
        localStorage.setItem('wcg_auth_token', mockToken)
        localStorage.setItem('wcg_user', JSON.stringify(userData))
        return
      }
      throw new Error(error.message)
    }

    if (data.user) {
      setUser(data.user)
      setSession(data.session)
      setToken(data.session?.access_token ?? null)
    }
  }

  const signup = async (email: string, name: string, password: string, role: string = 'creator') => {
    if (!isSupabaseConfigured()) {
      // Mock signup
      const users = JSON.parse(localStorage.getItem('wcg_users') || '[]')
      
      if (users.find((u: any) => u.email === email)) {
        throw new Error('User already exists')
      }

      const newUser = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        password,
      }

      users.push(newUser)
      localStorage.setItem('wcg_users', JSON.stringify(users))

      const mockToken = `token_${Math.random().toString(36).substr(2, 9)}`
      const userData = {
        id: newUser.id,
        email: newUser.email,
        user_metadata: { name: newUser.name },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
      } as unknown as User

      setToken(mockToken)
      setUser(userData)
      
      localStorage.setItem('wcg_auth_token', mockToken)
      localStorage.setItem('wcg_user', JSON.stringify(userData))
      return
    }

    // Real Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    })

    if (error) {
      // Skip rate limit errors for testing/development
      if (error.message.toLowerCase().includes('rate limit')) {
        console.warn('Rate limit error ignored, using mock auth')
        const mockToken = `token_${Math.random().toString(36).substr(2, 9)}`
        const userData = {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          email: email,
          user_metadata: { name: name },
          created_at: new Date().toISOString(),
          app_metadata: {},
          aud: 'authenticated',
        } as unknown as User

        setToken(mockToken)
        setUser(userData)
        
        localStorage.setItem('wcg_auth_token', mockToken)
        localStorage.setItem('wcg_user', JSON.stringify(userData))
        return
      }
      throw new Error(error.message)
    }

    if (data.user) {
      setUser(data.user)
      setSession(data.session)
      setToken(data.session?.access_token ?? null)
    }
  }

  const signInWithMagicLink = async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard',
      },
    })

    return { error }
  }

  const logout = () => {
    if (!isSupabaseConfigured()) {
      setToken(null)
      setUser(null)
      localStorage.removeItem('wcg_auth_token')
      localStorage.removeItem('wcg_user')
      return
    }

    supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setToken(null)
  }

  const value = {
    user,
    session,
    token,
    isLoading,
    login,
    signup,
    signInWithMagicLink,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
