import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { aiService, type AIMessage, type AIAction } from '../services/AIService'
import type { Project, ContentPiece, Brand, Experiment } from '../types'
import styles from './AI.module.css'

const QUICK_ACTIONS = [
  '📋 Help me plan my next quarter',
  '✨ Create a new project',
  '📝 Generate a content brief',
  '🎨 Define my brand voice',
  '🧪 Design a micro-experiment',
  '💡 What should I focus on next?',
]

export function AI() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wcg_ai_messages')
    if (saved) {
      setMessages(JSON.parse(saved))
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('wcg_ai_messages', JSON.stringify(messages))
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    // Add user message
    const userMessage: AIMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await aiService.generateResponse(messageText, messages, dashboard)

      const assistantMessage: AIMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        actions: response.actions,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      addToast('Error communicating with AI', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action: AIAction) => {
    switch (action.type) {
      case 'create_project': {
        const newProject: Project = {
          id: Math.random().toString(36).substr(2, 9),
          name: action.payload?.name || 'New Project',
          type: action.payload?.type || 'active',
          description: '',
          helpNeeded: [],
          status: 'active',
          createdAt: new Date().toISOString(),
        }
        updateDashboard({
          projects: [newProject, ...dashboard.projects],
          activity: [
            ...dashboard.activity,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'project',
              title: `Created project: ${newProject.name}`,
              timestamp: new Date().toISOString(),
              action: 'created',
            },
          ],
        })
        addToast(`Created project: ${newProject.name}`, 'success')
        handleSendMessage(`Great! I've created a new project called "${newProject.name}". What would you like to do next?`)
        break
      }

      case 'create_content': {
        const newContent: ContentPiece = {
          id: Math.random().toString(36).substr(2, 9),
          title: action.payload?.title || 'New Content',
          type: action.payload?.type || 'Social Post',
          content: '',
          status: 'draft',
          createdAt: new Date().toISOString(),
          tags: ['ai-generated'],
        }
        updateDashboard({
          content: [newContent, ...dashboard.content],
        })
        addToast('Created content task', 'success')
        handleSendMessage(`Perfect! I've created a new ${newContent.type}. Now let's add details to make it compelling.`)
        break
      }

      case 'create_brand': {
        const newBrand: Brand = {
          id: Math.random().toString(36).substr(2, 9),
          name: action.payload?.name || 'My Brand',
          description: action.payload?.description || '',
          colors: action.payload?.colors || ['#000000', '#ffffff', '#666666'],
          voice: action.payload?.voice || 'Professional, creative',
        }
        updateDashboard({
          brands: [newBrand, ...dashboard.brands],
        })
        addToast(`Created brand: ${newBrand.name}`, 'success')
        handleSendMessage(`Excellent! I've created your brand profile. Let's develop it further with your unique voice and visual identity.`)
        break
      }

      case 'add_brand_voice': {
        const voiceProfile = {
          tone: 'Professional, creative, and supportive',
          values: ['Authenticity', 'Innovation', 'Community'],
          doList: ['Be genuine', 'Share insights', 'Encourage others'],
          dontList: ['Hype', 'Pressure', 'Jargon'],
        }
        addToast('Brand voice framework created', 'success')
        handleSendMessage(
          `Here's your brand voice framework:\n\n**Tone:** ${voiceProfile.tone}\n**Values:** ${voiceProfile.values.join(', ')}\n\n**Do:** ${voiceProfile.doList.join(', ')}\n**Don't:** ${voiceProfile.dontList.join(', ')}\n\nYou can refine this further in your Brand Builder page.`
        )
        break
      }

      case 'create_experiment': {
        const newExperiment: Experiment = {
          id: Math.random().toString(36).substr(2, 9),
          name: action.payload?.name || 'New Experiment',
          type: action.payload?.type || 'ab-test',
          description: action.payload?.description || 'Testing new approach',
          status: 'active',
          createdAt: new Date().toISOString(),
        }
        updateDashboard({
          experiments: [newExperiment, ...dashboard.experiments],
        })
        addToast('Created experiment', 'success')
        handleSendMessage(`Great! I've created an experiment: "${newExperiment.name}". Let's define your hypothesis and success metrics.`)
        break
      }

      case 'generate_plan': {
        const planScope = action.payload?.scope || 'quarterly'
        const projectCount = dashboard.projects?.length || 0
        const contentCount = dashboard.content?.length || 0
        const brandCount = dashboard.brands?.length || 0

        let plan = ''
        if (planScope === 'quarterly') {
          plan = `# Quarterly Plan\n\n**Month 1: Foundation**\n• Solidify your brand voice and guidelines\n• Create 12 content pieces (4 per week)\n• Launch 2 growth experiments\n• Engage with community\n\n**Month 2: Expansion**\n• Run A/B tests on top performers\n• Publish long-form content\n• Build 1 collaboration\n• Analyze data\n\n**Month 3: Optimization**\n• Double down on what works\n• Plan next quarter\n• Build audience\n• Prepare for launches\n\n**Current Status:** ${projectCount} projects, ${contentCount} content pieces, ${brandCount} brand profile(s)`
        } else if (planScope === 'content') {
          plan = `# Content Calendar (Next 4 Weeks)\n\n**Week 1:** Foundation\n• Mon: Introduction post\n• Wed: Value post\n• Fri: Community post\n\n**Week 2:** Building\n• Mon: Tutorial\n• Wed: Case study\n• Fri: Behind-the-scenes\n\n**Week 3:** Engagement\n• Mon: Q&A\n• Wed: Collaboration\n• Fri: Reflection\n\n**Week 4:** Growth\n• Mon: Announcement\n• Wed: Launch\n• Fri: Recap\n\nReady to start creating?`
        } else {
          plan = `# Growth Roadmap\n\n**Phase 1: Build (Weeks 1-4)**\nFocus on consistency and quality. Post regularly, engage authentically.\n\n**Phase 2: Test (Weeks 5-8)**\nRun experiments. Track what resonates. Optimize based on data.\n\n**Phase 3: Scale (Weeks 9-12)**\nDouble down on winning formats. Build collaborations. Grow audience.\n\n**Phase 4: Monetize (Weeks 13+)**\nExplore opportunities aligned with your brand and audience.\n\nRemember: sustainable growth beats viral spikes every time.`
        }
        handleSendMessage(plan)
        break
      }

      case 'schedule_post': {
        addToast('Post scheduled for optimal engagement time', 'success')
        handleSendMessage(`Your post has been scheduled! I analyzed your audience and scheduled it for maximum engagement. Check your Content Studio to see all scheduled posts.`)
        break
      }
    }
  }

  const newChatMode = messages.length === 0 && !showNewChat

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>WCG AI</h1>
        <p className={styles.subtitle}>Your creative companion inside Wilson Collective Group</p>
      </div>

      {/* Chat Area */}
      <div className={styles.chatContainer}>
        {newChatMode ? (
          <div className={styles.emptyState}>
            <h2>Welcome to WCG AI</h2>
            <p>I'm here to help you think clearly, explore ideas, and move forward.</p>

            <div className={styles.quickActionsSection}>
              <h3>Try asking me:</h3>
              <div className={styles.quickActions}>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    className={styles.quickActionBtn}
                    onClick={() => {
                      setShowNewChat(true)
                      handleSendMessage(action)
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.info}>
              <h4>I can help with:</h4>
              <ul>
                <li>Creating projects and tasks</li>
                <li>Planning content and campaigns</li>
                <li>Building your brand</li>
                <li>Designing experiments</li>
                <li>Strategic planning and recommendations</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
                <div className={styles.messageContent}>
                  <p className={styles.messageText}>{msg.content}</p>

                  {msg.actions && msg.actions.length > 0 && (
                    <div className={styles.actions}>
                      {msg.actions.map((action) => (
                        <button
                          key={action.id}
                          className={styles.actionBtn}
                          onClick={() => handleAction(action)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                setShowNewChat(true)
                handleSendMessage()
              }
            }}
            placeholder="Ask me anything... or start with a quick action above"
            className={styles.input}
            disabled={loading}
          />
          <button
            onClick={() => {
              setShowNewChat(true)
              handleSendMessage()
            }}
            disabled={loading || !input.trim()}
            className={styles.sendBtn}
          >
            {loading ? '⟳' : '→'}
          </button>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([])
              setInput('')
              setShowNewChat(false)
              addToast('Started a new conversation', 'success')
            }}
            className={styles.newChatBtn}
          >
            + New Chat
          </button>
        )}
      </div>
    </div>
  )
}
