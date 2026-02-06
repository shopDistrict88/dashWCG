import { supabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { AiTask } from '../types/musicStudio'

export interface MusicAiPayload {
  task: AiTask
  context: {
    title: string
    artist: string
    bpm: number
    key: string
    mood: string
    intent: string
    notes: string
  }
}

export interface MusicAiResponse {
  text: string
}

export async function runMusicAi(payload: MusicAiPayload): Promise<MusicAiResponse> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured for AI calls')
  }

  const { data, error } = await supabaseClient.functions.invoke('music-ai', {
    body: payload,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data as MusicAiResponse
}
