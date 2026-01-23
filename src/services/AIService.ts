// WCG AI Service - Handles AI interactions with fallback to mock responses
import type { Dashboard } from '../types'

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  actions?: AIAction[]
}

export interface AIAction {
  id: string
  type: 'create_project' | 'create_content' | 'create_brand' | 'create_experiment' | 'generate_plan' | 'schedule_post' | 'add_brand_voice'
  label: string
  payload?: Record<string, any>
}

const SYSTEM_PROMPT = `You are WCG AI, the executive assistant inside the Wilson Collective Group Creative Operating System.

You support creators, artists, musicians, designers, filmmakers, writers, and builders.

Your role is to:
- Analyze creator performance and social media data
- Identify trends and patterns in content performance
- Recommend specific, actionable content ideas based on data
- Suggest optimal posting times based on audience activity
- Flag content opportunities and collaboration potential
- Generate release and rollout strategies for music and creative work
- Help creators grow authentically without forcing monetization
- Assist with portfolio structure and brand positioning
- Provide execution support, not just advice

Your tone is:
- Corporate but creative
- Calm and structured
- Professional and supportive
- Direct and actionable
- Never hype or slang-heavy
- Never use emojis
- You are an assistant, not a manager

When suggesting actions, format them as JSON in your response with [ACTION] tags:
[ACTION]
{
  "type": "action_type",
  "label": "Button Label",
  "payload": { "key": "value" }
}
[/ACTION]

Keep responses concise, data-driven, and focused on execution.`

export class AIService {
  private apiKey: string | null
  private model = 'gpt-4o-mini'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: AIMessage[],
    dashboardContext: Dashboard
  ): Promise<{ content: string; actions: AIAction[] }> {
    // If API key exists, use OpenAI. Otherwise use mock responses.
    if (this.apiKey) {
      return this.callOpenAI(userMessage, conversationHistory, dashboardContext)
    } else {
      return this.generateMockResponse(userMessage, dashboardContext)
    }
  }

  private async callOpenAI(
    userMessage: string,
    conversationHistory: AIMessage[],
    dashboardContext: Dashboard
  ): Promise<{ content: string; actions: AIAction[] }> {
    const messages = [
      {
        role: 'system' as const,
        content: `${SYSTEM_PROMPT}\n\nUser Context:\n${JSON.stringify(this.formatContext(dashboardContext))}`,
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user' as const, content: userMessage },
    ]

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      return this.parseResponse(content)
    } catch (error) {
      console.error('OpenAI API error:', error)
      // Fallback to mock response
      return this.generateMockResponse(userMessage, dashboardContext)
    }
  }

  private generateMockResponse(
    userMessage: string,
    dashboardContext: Dashboard
  ): { content: string; actions: AIAction[] } {
    const lower = userMessage.toLowerCase()
    const actions: AIAction[] = []

    let content = ''

    // Analyze user intent and generate contextual response
    if (lower.includes('project') || lower.includes('new')) {
      content = `I see you're interested in creating a new project. Here are your options:\n\n• Start a brand new project\n• Convert an existing idea into a project\n• Create a project based on your current brand focus\n\nWhat type of project would you like to start?`
      actions.push({
        id: '1',
        type: 'create_project',
        label: '✨ Create New Project',
        payload: { name: 'Untitled Project', type: 'active' },
      })
    } else if (lower.includes('content') || lower.includes('post') || lower.includes('write')) {
      content = `Let's create some content. I can help you:\n\n• Generate a content brief\n• Create a social post\n• Plan a content series\n• Add content to your library\n\nWhat would you like to focus on?`
      actions.push({
        id: '1',
        type: 'create_content',
        label: '📝 Create Content Task',
        payload: { title: 'New Content Piece', type: 'Social Post' },
      })
    } else if (lower.includes('brand') || lower.includes('voice') || lower.includes('visual')) {
      content = `Your brand is your foundation. Let me help you with:\n\n• Define your brand voice\n• Create a color palette\n• Develop brand guidelines\n• Build a brand kit\n\nWhich would be most helpful?`
      actions.push({
        id: '1',
        type: 'add_brand_voice',
        label: '🎨 Define Brand Voice',
        payload: { name: 'My Brand Voice' },
      })
    } else if (lower.includes('launch') || lower.includes('experiment') || lower.includes('test')) {
      content = `Let's plan your next move. I can help you:\n\n• Design an A/B test\n• Create a launch checklist\n• Plan a growth experiment\n• Test new content formats\n\nWhat would you like to explore?`
      actions.push({
        id: '1',
        type: 'create_experiment',
        label: '🧪 Design Experiment',
        payload: { name: 'A/B Test', type: 'ab-test' },
      })
    } else if (lower.includes('plan') || lower.includes('strategy')) {
      content = `Let me help you create a strategic plan. Based on your current work:\n\n• You have ${dashboardContext.projects?.length || 0} active projects\n• ${dashboardContext.content?.length || 0} pieces of content\n• ${dashboardContext.brands?.length || 0} brand profiles\n\nI can generate:\n• A quarterly plan\n• A content calendar\n• A growth roadmap\n\nWhat planning horizon interests you?`
      actions.push({
        id: '1',
        type: 'generate_plan',
        label: '📋 Generate Plan',
        payload: { scope: 'quarterly' },
      })
    } else if (lower.includes('idea') || lower.includes('suggest') || lower.includes('recommend')) {
      content = `Here are my top recommendations for you:\n\n1. **Focus on Content Consistency**: You have ${dashboardContext.content?.length || 0} pieces. Next step: establish a posting schedule.\n\n2. **Expand Your Brand**: With ${dashboardContext.brands?.length || 0} brand profile(s), it's time to deepen your brand guidelines.\n\n3. **Test & Learn**: Create 2-3 micro experiments this month to find what resonates.\n\n4. **Project Clarity**: Review your ${dashboardContext.projects?.length || 0} projects and prioritize the top 3.\n\nWhich would you like to dive into?`
    } else {
      content = `How can I assist you today? I can help with:\n\n• **Creating projects** - Build and organize your work\n• **Content planning** - Write briefs, posts, and calendars\n• **Brand building** - Define voice, visuals, and guidelines\n• **Experiments** - Design tests and growth initiatives\n• **Strategic planning** - Create plans and roadmaps\n• **Smart recommendations** - What you should focus on next\n\nWhat would you like to work on?`
    }

    return { content, actions }
  }

  private parseResponse(content: string): { content: string; actions: AIAction[] } {
    const actions: AIAction[] = []

    // Extract [ACTION] blocks from response
    const actionRegex = /\[ACTION\]([\s\S]*?)\[\/ACTION\]/g
    let match

    while ((match = actionRegex.exec(content)) !== null) {
      try {
        const actionJson = JSON.parse(match[1])
        actions.push({
          id: Math.random().toString(36).substr(2, 9),
          ...actionJson,
        })
      } catch (e) {
        console.error('Failed to parse action:', e)
      }
    }

    // Remove action tags from content
    const cleanContent = content.replace(/\[ACTION\][\s\S]*?\[\/ACTION\]/g, '').trim()

    return { content: cleanContent, actions }
  }

  private formatContext(dashboard: Dashboard): Record<string, any> {
    return {
      projectCount: dashboard.projects?.length || 0,
      projectNames: dashboard.projects?.map((p) => p.name) || [],
      brandCount: dashboard.brands?.length || 0,
      brandNames: dashboard.brands?.map((b) => b.name) || [],
      contentCount: dashboard.content?.length || 0,
      recentContent: dashboard.content?.slice(0, 3).map((c) => c.title) || [],
      experimentCount: dashboard.experiments?.length || 0,
    }
  }
}

export const aiService = new AIService()
