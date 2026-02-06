import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt =
  'You are a professional music production assistant. ' +
  'Be concise, actionable, and practical. Avoid emojis.'

const taskPrompts: Record<string, (input: any) => string> = {
  mix_critique: (input) =>
    `Give a concise mix critique (strengths + fixes).\nTitle: ${input.context.title}\nNotes: ${input.context.notes}`,
  mastering_chain: (input) =>
    `Suggest a mastering chain with order and settings.\nTitle: ${input.context.title}\nBPM: ${input.context.bpm}\nKey: ${input.context.key}`,
  arrangement: (input) =>
    `Suggest arrangement improvements (structure, tension, pacing).\nNotes: ${input.context.notes}`,
  lyrics: (input) =>
    `Enhance the lyrics or writing approach based on mood and intent.\nMood: ${input.context.mood}\nIntent: ${input.context.intent}\nNotes: ${input.context.notes}`,
  reference_match: (input) =>
    `Suggest reference track directions and sonic targets.\nMood: ${input.context.mood}\nIntent: ${input.context.intent}`,
  release_strategy: (input) =>
    `Provide a release strategy (timeline, platforms, marketing beats).\nTitle: ${input.context.title}\nArtist: ${input.context.artist}`,
  promo_kit: (input) =>
    `Generate a promo kit: 1 short description, 5 captions, 10 hashtags.\nTitle: ${input.context.title}\nArtist: ${input.context.artist}\nMood: ${input.context.mood}`,
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const task = body.task as string

    if (!taskPrompts[task]) {
      return new Response(JSON.stringify({ error: 'Unknown task' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const prompt = taskPrompts[task](body)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      }),
    })

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content?.trim() || ''

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
