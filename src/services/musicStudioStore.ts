import { supabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { MusicProject } from '../types/musicStudio'

const LOCAL_KEY = 'wcg-music-studio'

const loadLocal = (): MusicProject[] => {
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as MusicProject[]
  } catch {
    return []
  }
}

const saveLocal = (projects: MusicProject[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(projects))
}

export async function fetchMusicProjects(userId: string | null): Promise<MusicProject[]> {
  if (!userId || !isSupabaseConfigured()) {
    return loadLocal()
  }

  const { data, error } = await supabaseClient
    .from('music_projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.warn('Music projects load error, using local cache:', error.message)
    return loadLocal()
  }

  return (data || []).map((row: any) => row.data as MusicProject)
}

export async function upsertMusicProject(userId: string | null, project: MusicProject): Promise<void> {
  if (!userId || !isSupabaseConfigured()) {
    const projects = loadLocal()
    const merged = [project, ...projects.filter((p) => p.id !== project.id)]
    saveLocal(merged)
    return
  }

  const { error } = await supabaseClient
    .from('music_projects')
    .upsert(
      {
        id: project.id,
        user_id: userId,
        title: project.title,
        status: project.status,
        data: project,
        created_at: project.createdAt,
        updated_at: project.updatedAt,
      },
      { onConflict: 'id' }
    )

  if (error) {
    console.warn('Music project upsert failed, saving local:', error.message)
    const projects = loadLocal()
    const merged = [project, ...projects.filter((p) => p.id !== project.id)]
    saveLocal(merged)
  }
}

export async function deleteMusicProject(userId: string | null, projectId: string): Promise<void> {
  if (!userId || !isSupabaseConfigured()) {
    saveLocal(loadLocal().filter((p) => p.id !== projectId))
    return
  }

  const { error } = await supabaseClient.from('music_projects').delete().eq('id', projectId)
  if (error) {
    console.warn('Music project delete failed, updating local cache:', error.message)
    saveLocal(loadLocal().filter((p) => p.id !== projectId))
  }
}
