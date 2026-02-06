import { supabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { ThoughtNote } from '../types/thoughtSystem'

const LOCAL_KEY = 'wcg-thought-system'

const nowIso = () => new Date().toISOString()

const toRow = (userId: string, note: ThoughtNote) => ({
  id: note.id,
  user_id: userId,
  title: note.title,
  body: note.body,
  tags: note.tags,
  linked_notes: note.linkedNotes,
  references: note.references,
  data: note,
  created_at: note.createdAt,
  updated_at: note.updatedAt,
  last_viewed: note.lastViewed,
  view_count: note.viewCount,
})

const fromRow = (row: any): ThoughtNote => {
  const data = row.data || {}
  return {
    ...data,
    id: row.id,
    title: row.title,
    body: row.body,
    tags: row.tags || [],
    linkedNotes: row.linked_notes || [],
    references: row.references || {
      projects: [],
      brands: [],
      launches: [],
      content: [],
      externalLinks: [],
    },
    createdAt: row.created_at || data.createdAt || nowIso(),
    updatedAt: row.updated_at || data.updatedAt || nowIso(),
    lastViewed: row.last_viewed || data.lastViewed || nowIso(),
    viewCount: row.view_count ?? data.viewCount ?? 0,
  }
}

const loadLocal = (): ThoughtNote[] => {
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ThoughtNote[]
  } catch {
    return []
  }
}

const saveLocal = (notes: ThoughtNote[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(notes))
}

export async function fetchThoughts(userId: string | null): Promise<ThoughtNote[]> {
  if (!userId || !isSupabaseConfigured()) {
    return loadLocal()
  }

  const { data, error } = await supabaseClient
    .from('thought_notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.warn('Thought load error, using local cache:', error.message)
    return loadLocal()
  }

  return (data || []).map(fromRow)
}

export async function upsertThought(userId: string | null, note: ThoughtNote): Promise<void> {
  const updatedNote = { ...note, updatedAt: nowIso() }
  if (!userId || !isSupabaseConfigured()) {
    const notes = loadLocal()
    const merged = [updatedNote, ...notes.filter((n) => n.id !== note.id)]
    saveLocal(merged)
    return
  }

  const { error } = await supabaseClient
    .from('thought_notes')
    .upsert(toRow(userId, updatedNote), { onConflict: 'id' })

  if (error) {
    console.warn('Thought upsert failed, saving local:', error.message)
    const notes = loadLocal()
    const merged = [updatedNote, ...notes.filter((n) => n.id !== note.id)]
    saveLocal(merged)
  }
}

export async function deleteThought(userId: string | null, noteId: string): Promise<void> {
  if (!userId || !isSupabaseConfigured()) {
    const notes = loadLocal().filter((n) => n.id !== noteId)
    saveLocal(notes)
    return
  }

  const { error } = await supabaseClient
    .from('thought_notes')
    .delete()
    .eq('id', noteId)

  if (error) {
    console.warn('Thought delete failed, updating local cache:', error.message)
    const notes = loadLocal().filter((n) => n.id !== noteId)
    saveLocal(notes)
  }
}

export async function replaceThoughts(userId: string | null, notes: ThoughtNote[]): Promise<void> {
  if (!userId || !isSupabaseConfigured()) {
    saveLocal(notes)
    return
  }

  const payload = notes.map((note) => toRow(userId, note))
  const { error } = await supabaseClient
    .from('thought_notes')
    .upsert(payload, { onConflict: 'id' })

  if (error) {
    console.warn('Thought bulk upsert failed, saving local:', error.message)
    saveLocal(notes)
  }
}
