import { supabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { AiTask } from '../types/thoughtSystem'

export interface AiRequestPayload {
  task: AiTask
  note: {
    title: string
    body: string
    tags: string[]
    context?: string
  }
  relatedNotes?: Array<{ title: string; body: string }>
}

export interface AiResponsePayload {
  text: string
  items?: string[]
}

export async function runThoughtAi(payload: AiRequestPayload): Promise<AiResponsePayload> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured for AI calls')
  }

  const { data, error } = await supabaseClient.functions.invoke('ai-notes', {
    body: payload,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data as AiResponsePayload
}
