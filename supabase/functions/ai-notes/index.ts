import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt =
  'You are a strategic thinking assistant for a private thought system. ' +
  'Be concise, actionable, and grounded. Avoid emojis. Return plain text.'

const taskPrompts: Record<string, (input: any) => string> = {
  blind_spots: (input) =>
    `Identify missing perspectives or blind spots for the note.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  counter_arguments: (input) =>
    `Provide concise counter-arguments to challenge this note.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  stress_test: (input) =>
    `Stress test this idea for vulnerabilities, risks, and edge cases.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  questions: (input) =>
    `Generate better questions to deepen this note.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  summary: (input) =>
    `Provide an executive-level strategic summary.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  bias: (input) =>
    `Identify cognitive biases present in the note.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  naming: (input) =>
    `Suggest 5 strong concept names for this idea.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  analogy: (input) =>
    `Explain the idea using a clear analogy.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  expansion: (input) =>
    `Expand this idea into a structured framework.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  decision_sim: (input) =>
    `Simulate likely consequences and outcomes if this decision is executed.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  action_plan: (input) =>
    `Convert this insight into 5 concrete next steps.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  compression: (input) =>
    `Compress this note into a single sentence.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  cross_domain: (input) =>
    `Translate this idea into another industry or domain.\nTitle: ${input.note.title}\nBody: ${input.note.body}`,
  synthesis: (input) => {
    const related = (input.relatedNotes || [])
      .map((n: any, i: number) => `Note ${i + 1}: ${n.title}\n${n.body}`)
      .join('\n\n')
    return `Synthesize these related notes into a single coherent insight.\n${related}`
  },
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

    const items = text
      .split('\n')
      .map((line: string) => line.replace(/^[-*\d.\s]+/, '').trim())
      .filter(Boolean)

    return new Response(JSON.stringify({ text, items }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
