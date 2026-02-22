import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * Drop-in replacement for useState + localStorage pattern.
 * Persists to Supabase `dashboard_data` table when authenticated,
 * falls back to localStorage otherwise. Debounces cloud writes.
 */
export function useCloudStorage<T>(moduleKey: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { user } = useAuth()
  const [data, setData] = useState<T>(initialValue)
  const loaded = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNextSave = useRef(true)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    if (user) {
      supabase
        .from('dashboard_data')
        .select('data')
        .eq('user_id', user.id)
        .eq('module_key', moduleKey)
        .maybeSingle()
        .then(({ data: row }) => {
          if (row?.data !== undefined && row.data !== null) {
            skipNextSave.current = true
            setData(row.data as T)
          } else {
            const local = localStorage.getItem(moduleKey)
            if (local) {
              try {
                skipNextSave.current = true
                setData(JSON.parse(local) as T)
              } catch { /* ignore */ }
            }
          }
        })
    } else {
      const local = localStorage.getItem(moduleKey)
      if (local) {
        try {
          skipNextSave.current = true
          setData(JSON.parse(local) as T)
        } catch { /* ignore */ }
      }
    }
  }, [user, moduleKey])

  useEffect(() => {
    if (!loaded.current) return
    if (skipNextSave.current) { skipNextSave.current = false; return }

    localStorage.setItem(moduleKey, JSON.stringify(data))

    if (!user) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      supabase
        .from('dashboard_data')
        .upsert(
          { user_id: user.id, module_key: moduleKey, data: data as unknown as Record<string, unknown> },
          { onConflict: 'user_id,module_key' }
        )
        .then()
    }, 800)
  }, [data, user, moduleKey])

  return [data, setData]
}
