import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { fetchThoughts, upsertThought, deleteThought } from '../services/thoughtStore'
import { runThoughtAi } from '../services/thoughtAi'
import type {
  AiTask,
  FrameworkType,
  LifecycleStatus,
  NoteRole,
  StrategicHorizon,
  ThoughtNote,
  ThoughtSort,
  ThoughtTemperature,
  ThoughtView,
} from '../types/thoughtSystem'
import styles from './Notes.module.css'

const nowIso = () => new Date().toISOString()

const createId = () => `thought-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const createEmptyThought = (): ThoughtNote => ({
  id: createId(),
  title: '',
  body: '',
  tags: [],
  linkedNotes: [],
  references: { projects: [], brands: [], launches: [], content: [], externalLinks: [] },
  temperature: 'warm',
  cognitiveLoad: 40,
  assumptionFlag: 'assumption',
  secondOrder: '',
  confidence: 50,
  uncertainties: [],
  frictionWarnings: [],
  compression: '',
  counterArguments: [],
  blindSpots: [],
  ai: {},
  isDecision: false,
  decisionOutcome: '',
  decisionWorked: null,
  actionItems: [],
  reflections: [],
  versions: [],
  parentId: null,
  lifecycleStatus: 'seed',
  abandoned: false,
  insightDensityScore: 0,
  framework: { type: 'none', fields: {} },
  problemStatement: '',
  successCriteria: '',
  constraints: [],
  tradeoffs: [],
  signalNoise: 50,
  gravityScore: 0,
  noteRole: 'idea',
  crossDomain: '',
  strategicHorizon: 'mid',
  contextSnapshot: { summary: '', mood: 'clear', energy: 50 },
  createdAt: nowIso(),
  updatedAt: nowIso(),
  lastViewed: nowIso(),
  viewCount: 0,
})

const hydrateThought = (note: ThoughtNote): ThoughtNote => {
  const base = createEmptyThought()
  return {
    ...base,
    ...note,
    references: { ...base.references, ...note.references },
    contextSnapshot: { ...base.contextSnapshot, ...note.contextSnapshot },
    framework: { ...base.framework, ...note.framework },
    ai: { ...base.ai, ...note.ai },
  }
}

const wordCount = (text: string) =>
  text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean).length

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

const computeDensity = (note: ThoughtNote) => {
  const words = Math.max(wordCount(note.body), 1)
  const signal =
    note.tags.length +
    note.linkedNotes.length +
    (note.actionItems?.length || 0) +
    (note.ai?.summary ? 1 : 0) +
    (note.ai?.questions ? 1 : 0)
  return clamp((signal / words) * 100)
}

const computeGravity = (note: ThoughtNote) => {
  const refs =
    note.references.projects.length +
    note.references.brands.length +
    note.references.launches.length +
    note.references.content.length
  return clamp((note.linkedNotes.length + refs) * 12)
}

const detectFriction = (note: ThoughtNote, allNotes: ThoughtNote[]) => {
  const shared = allNotes.filter(
    (other) => other.id !== note.id && other.tags.some((tag) => note.tags.includes(tag))
  )
  const negative = /(never|avoid|do not|cannot|can't|no)\b/i
  const positive = /(must|should|do|always|prioritize)\b/i
  const warnings: string[] = []

  shared.forEach((other) => {
    const noteNeg = negative.test(note.body)
    const notePos = positive.test(note.body)
    const otherNeg = negative.test(other.body)
    const otherPos = positive.test(other.body)
    if ((noteNeg && otherPos) || (notePos && otherNeg)) {
      warnings.push(`Potential contradiction with "${other.title || 'Untitled'}".`)
    }
  })

  return warnings
}

const getAgeLabel = (createdAt: string) => {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  if (days < 7) return { label: 'Fresh', className: styles.ageFresh }
  if (days < 30) return { label: 'Maturing', className: styles.ageWarm }
  if (days < 180) return { label: 'Aging', className: styles.ageOld }
  return { label: 'Legacy', className: styles.ageArchive }
}

const timeSince = (date: string) => {
  const now = new Date()
  const past = new Date(date)
  const days = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

const sortOptions: ThoughtSort[] = ['recent', 'updated', 'confidence', 'gravity', 'load']

export function Notes() {
  const { addToast, dashboard } = useApp()
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [notes, setNotes] = useState<ThoughtNote[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<ThoughtNote | null>(null)
  const [viewMode, setViewMode] = useState<ThoughtView>('list')
  const [sortBy, setSortBy] = useState<ThoughtSort>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState<NoteRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<LifecycleStatus | 'all'>('all')
  const [temperatureFilter, setTemperatureFilter] = useState<ThoughtTemperature | 'all'>('all')
  const [horizonFilter, setHorizonFilter] = useState<StrategicHorizon | 'all'>('all')
  const [activePanel, setActivePanel] = useState<'overview' | 'cognition' | 'evolution' | 'systems' | 'ai' | 'links'>(
    'overview'
  )
  const [syncing, setSyncing] = useState(false)
  const [aiLoading, setAiLoading] = useState<AiTask | null>(null)
  const [showAbandoned, setShowAbandoned] = useState(false)
  const [dateFilter, setDateFilter] = useState('')
  const [focusTimer, setFocusTimer] = useState(0)
  const [focusTimerActive, setFocusTimerActive] = useState(false)
  const [showDigest, setShowDigest] = useState(false)
  const [showQuickCapture, setShowQuickCapture] = useState(false)
  const [quickCaptureText, setQuickCaptureText] = useState('')

  const graphWrapperRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<HTMLCanvasElement | null>(null)
  const graphNodesRef = useRef<Array<{ id: string; x: number; y: number; r: number }>>([])

  useEffect(() => {
    fetchThoughts(userId).then((loaded) => setNotes(loaded.map(hydrateThought)))
  }, [userId])

  // Writing sessions timer (#37)
  useEffect(() => {
    if (!focusTimerActive) return
    const iv = setInterval(() => setFocusTimer(p => p + 1), 1000)
    return () => clearInterval(iv)
  }, [focusTimerActive])

  // Quick capture keyboard shortcut (#49)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'q') { e.preventDefault(); setShowQuickCapture(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!draft) return
    if (!draft.title.trim() && !draft.body.trim()) return
    const timer = setTimeout(() => {
      handleSaveDraft(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [draft])

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedId) || null,
    [notes, selectedId]
  )

  const stats = useMemo(() => {
    const tags = notes.flatMap((note) => note.tags)
    const tagMap = tags.reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})
    const topTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
    return {
      decisions: notes.filter((note) => note.isDecision).length,
      topTags,
    }
  }, [notes])

  const filteredNotes = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase()
    const lowerTag = tagFilter.toLowerCase()
    let result = notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(lowerSearch) ||
        note.body.toLowerCase().includes(lowerSearch)
      const matchesTag = !lowerTag || note.tags.some((tag) => tag.toLowerCase().includes(lowerTag))
      const matchesRole = roleFilter === 'all' || note.noteRole === roleFilter
      const matchesStatus = statusFilter === 'all' || note.lifecycleStatus === statusFilter
      const matchesTemp = temperatureFilter === 'all' || note.temperature === temperatureFilter
      const matchesHorizon = horizonFilter === 'all' || note.strategicHorizon === horizonFilter
      const matchesAbandoned = !showAbandoned || note.abandoned
      const matchesDate = !dateFilter || note.createdAt.startsWith(dateFilter)
      return matchesSearch && matchesTag && matchesRole && matchesStatus && matchesTemp && matchesHorizon && matchesAbandoned && matchesDate
    })

    result = result.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'confidence':
          return b.confidence - a.confidence
        case 'gravity':
          return b.gravityScore - a.gravityScore
        case 'load':
          return b.cognitiveLoad - a.cognitiveLoad
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [notes, searchQuery, tagFilter, roleFilter, statusFilter, temperatureFilter, horizonFilter, sortBy, showAbandoned, dateFilter])

  const resurfaced = useMemo(() => {
    const now = Date.now()
    return notes
      .filter((note) => now - new Date(note.lastViewed).getTime() > 1000 * 60 * 60 * 24 * 30)
      .slice(0, 4)
  }, [notes])

  const normalizeNote = (note: ThoughtNote, allNotes: ThoughtNote[]) => {
    const updated = {
      ...note,
      insightDensityScore: computeDensity(note),
      gravityScore: computeGravity(note),
      frictionWarnings: detectFriction(note, allNotes),
      updatedAt: nowIso(),
    }
    return updated
  }

  const handleSelect = (note: ThoughtNote) => {
    const updated = { ...note, lastViewed: nowIso(), viewCount: note.viewCount + 1 }
    const normalized = normalizeNote(updated, notes)
    setNotes((prev) => prev.map((n) => (n.id === note.id ? normalized : n)))
    setSelectedId(note.id)
    setDraft(normalized)
    upsertThought(userId, normalized)
  }

  const handleNewThought = () => {
    const newThought = createEmptyThought()
    setDraft(newThought)
    setSelectedId(newThought.id)
    setViewMode('list')
    setActivePanel('overview')
    addToast('Thought ready', 'info')
  }

  const handleQuickCapture = async () => {
    if (!quickCaptureText.trim()) return
    const note = createEmptyThought()
    note.title = quickCaptureText.trim().split('\n')[0].slice(0, 80)
    note.body = quickCaptureText.trim()
    note.tags = ['quick-capture']
    const normalized = normalizeNote(note, notes)
    setNotes(prev => [normalized, ...prev])
    await upsertThought(userId, normalized)
    setQuickCaptureText('')
    setShowQuickCapture(false)
    addToast('Quick capture saved', 'success')
  }

  const pinnedNotes = useMemo(() => notes.filter(n => n.tags.includes('pinned')), [notes])

  const insightDigest = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recent = notes.filter(n => new Date(n.updatedAt).getTime() > weekAgo)
    const decisions = recent.filter(n => n.isDecision)
    const topGravity = [...recent].sort((a, b) => b.gravityScore - a.gravityScore).slice(0, 3)
    return { total: recent.length, decisions: decisions.length, topGravity }
  }, [notes])

  const handleSaveDraft = async (announce = true) => {
    if (!draft) return
    if (!draft.title.trim() && !draft.body.trim()) return
    const exists = notes.some((note) => note.id === draft.id)
    const lastVersion = draft.versions[draft.versions.length - 1]
    const shouldAppendVersion = draft.body && lastVersion?.content !== draft.body
    const updated = normalizeNote(
      {
        ...draft,
        versions: shouldAppendVersion
          ? [...draft.versions, { content: draft.body, date: nowIso() }]
          : draft.versions,
      },
      notes
    )
    setNotes((prev) => (exists ? prev.map((n) => (n.id === draft.id ? updated : n)) : [updated, ...prev]))
    setDraft(updated)
    await upsertThought(userId, updated)
    if (announce) addToast('Thought saved', 'success')
  }

  const handleDelete = async (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    if (selectedId === noteId) {
      setSelectedId(null)
      setDraft(null)
    }
    await deleteThought(userId, noteId)
    addToast('Thought deleted', 'success')
  }

  const handleSync = async () => {
    setSyncing(true)
    const loaded = await fetchThoughts(userId)
    setNotes(loaded.map(hydrateThought))
    setSyncing(false)
    addToast('Thoughts synced', 'success')
  }

  const updateDraft = (updates: Partial<ThoughtNote>) => {
    setDraft((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const addTag = (tag: string) => {
    if (!draft || !tag.trim()) return
    const cleaned = tag.trim().toLowerCase()
    if (draft.tags.includes(cleaned)) return
    updateDraft({ tags: [...draft.tags, cleaned] })
  }

  const removeTag = (tag: string) => {
    if (!draft) return
    updateDraft({ tags: draft.tags.filter((t) => t !== tag) })
  }

  const addUncertainty = () => {
    if (!draft) return
    updateDraft({
      uncertainties: [
        ...draft.uncertainties,
        { id: createId(), label: 'Unknown', impact: 3, likelihood: 3 },
      ],
    })
  }

  const updateUncertainty = (id: string, updates: Partial<ThoughtNote['uncertainties'][number]>) => {
    if (!draft) return
    updateDraft({
      uncertainties: draft.uncertainties.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })
  }

  const removeUncertainty = (id: string) => {
    if (!draft) return
    updateDraft({ uncertainties: draft.uncertainties.filter((item) => item.id !== id) })
  }

  const addConstraint = () => {
    if (!draft) return
    updateDraft({ constraints: [...draft.constraints, { id: createId(), label: 'Constraint' }] })
  }

  const updateConstraint = (id: string, label: string) => {
    if (!draft) return
    updateDraft({ constraints: draft.constraints.map((c) => (c.id === id ? { ...c, label } : c)) })
  }

  const removeConstraint = (id: string) => {
    if (!draft) return
    updateDraft({ constraints: draft.constraints.filter((c) => c.id !== id) })
  }

  const addTradeoff = () => {
    if (!draft) return
    updateDraft({
      tradeoffs: [...draft.tradeoffs, { id: createId(), title: 'Tradeoff', cost: '', benefit: '' }],
    })
  }

  const updateTradeoff = (id: string, updates: Partial<ThoughtNote['tradeoffs'][number]>) => {
    if (!draft) return
    updateDraft({
      tradeoffs: draft.tradeoffs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })
  }

  const removeTradeoff = (id: string) => {
    if (!draft) return
    updateDraft({ tradeoffs: draft.tradeoffs.filter((t) => t.id !== id) })
  }

  const addReflection = (days: number) => {
    if (!draft) return
    const dueAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    updateDraft({
      reflections: [...draft.reflections, { id: createId(), dueAt, prompt: 'Revisit this thought', completed: false }],
    })
  }

  const updateReflection = (id: string, updates: Partial<ThoughtNote['reflections'][number]>) => {
    if (!draft) return
    updateDraft({
      reflections: draft.reflections.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })
  }

  const removeReflection = (id: string) => {
    if (!draft) return
    updateDraft({ reflections: draft.reflections.filter((r) => r.id !== id) })
  }

  const toggleLink = (id: string) => {
    if (!draft) return
    const exists = draft.linkedNotes.includes(id)
    updateDraft({
      linkedNotes: exists ? draft.linkedNotes.filter((n) => n !== id) : [...draft.linkedNotes, id],
    })
  }

  const toggleReference = (type: keyof ThoughtNote['references'], id: string) => {
    if (!draft) return
    const current = draft.references[type]
    const exists = current.includes(id)
    updateDraft({
      references: {
        ...draft.references,
        [type]: exists ? current.filter((value) => value !== id) : [...current, id],
      },
    })
  }

  const addExternalLink = (value: string) => {
    if (!draft || !value.trim()) return
    updateDraft({
      references: {
        ...draft.references,
        externalLinks: [...draft.references.externalLinks, value.trim()],
      },
    })
  }

  const removeExternalLink = (value: string) => {
    if (!draft) return
    updateDraft({
      references: {
        ...draft.references,
        externalLinks: draft.references.externalLinks.filter((link) => link !== value),
      },
    })
  }

  const handleAiTask = async (task: AiTask, target?: ThoughtNote) => {
    const base = target || draft
    if (!base) return
    setAiLoading(task)
    try {
      const response = await runThoughtAi({
        task,
        note: { title: base.title, body: base.body, tags: base.tags, context: base.contextSnapshot?.summary },
        relatedNotes: notes.filter((n) => base.linkedNotes.includes(n.id)).map((n) => ({ title: n.title, body: n.body })),
      })

      const updated: ThoughtNote = { ...base, ai: { ...base.ai } }

      const updateOutput = (key: keyof ThoughtNote['ai'], text: string, items?: string[]) => {
        updated.ai[key] = { text, items, updatedAt: nowIso() }
      }

      switch (task) {
        case 'blind_spots':
          updated.blindSpots = response.items || [response.text]
          updateOutput('blindSpots', response.text, response.items)
          break
        case 'counter_arguments':
          updated.counterArguments = response.items || [response.text]
          updateOutput('counterArguments', response.text, response.items)
          break
        case 'stress_test':
          updateOutput('stressTest', response.text, response.items)
          break
        case 'questions':
          updateOutput('questions', response.text, response.items)
          break
        case 'summary':
          updateOutput('summary', response.text, response.items)
          break
        case 'bias':
          updateOutput('biasDetection', response.text, response.items)
          break
        case 'naming':
          updateOutput('naming', response.text, response.items)
          break
        case 'analogy':
          updateOutput('analogy', response.text, response.items)
          break
        case 'expansion':
          updateOutput('expansion', response.text, response.items)
          break
        case 'decision_sim':
          updateOutput('decisionSim', response.text, response.items)
          break
        case 'action_plan':
          updateOutput('actionPlan', response.text, response.items)
          updated.actionItems = response.items || updated.actionItems
          break
        case 'compression':
          updated.compression = response.text
          updateOutput('compression', response.text, response.items)
          break
        case 'cross_domain':
          updated.crossDomain = response.text
          updateOutput('crossDomain', response.text, response.items)
          break
        case 'synthesis':
          updateOutput('synthesis', response.text, response.items)
          break
        default:
          break
      }

      setDraft(updated)
      setNotes((prev) => prev.map((note) => (note.id === updated.id ? normalizeNote(updated, prev) : note)))
      await upsertThought(userId, normalizeNote(updated, notes))
      addToast('AI response ready', 'success')
    } catch (error) {
      addToast('AI call failed', 'error')
    } finally {
      setAiLoading(null)
    }
  }

  const createSynthesis = async () => {
    if (!draft) return
    if (draft.linkedNotes.length === 0) {
      addToast('Link at least one related note', 'info')
      return
    }
    setAiLoading('synthesis')
    try {
      const response = await runThoughtAi({
        task: 'synthesis',
        note: { title: draft.title, body: draft.body, tags: draft.tags },
        relatedNotes: notes
          .filter((n) => draft.linkedNotes.includes(n.id))
          .map((n) => ({ title: n.title, body: n.body })),
      })
      const synthesized = createEmptyThought()
      synthesized.title = `Synthesis: ${draft.title || 'Untitled'}`
      synthesized.body = response.text
      synthesized.tags = Array.from(new Set([...draft.tags, 'synthesis']))
      const normalized = normalizeNote(synthesized, notes)
      setNotes((prev) => [normalized, ...prev])
      setSelectedId(normalized.id)
      setDraft(normalized)
      await upsertThought(userId, normalized)
      addToast('Synthesis created', 'success')
    } catch {
      addToast('Synthesis failed', 'error')
    } finally {
      setAiLoading(null)
    }
  }

  useEffect(() => {
    if (viewMode !== 'graph') return
    const canvas = graphRef.current
    const wrapper = graphWrapperRef.current
    if (!canvas || !wrapper) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = wrapper.clientWidth
    const height = Math.max(420, Math.min(720, wrapper.clientHeight || 520))
    const pixelRatio = window.devicePixelRatio || 1
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.max(120, Math.min(width, height) / 2 - 60)
    const count = Math.max(notes.length, 1)
    const positions = notes.map((note, index) => {
      const angle = (index / count) * Math.PI * 2
      return {
        id: note.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        r: 16,
      }
    })
    graphNodesRef.current = positions

    const positionMap = new Map(positions.map((pos) => [pos.id, pos]))

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    notes.forEach((note) => {
      const from = positionMap.get(note.id)
      if (!from) return
      note.linkedNotes.forEach((linkedId) => {
        const to = positionMap.get(linkedId)
        if (!to) return
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      })
    })

    positions.forEach((pos) => {
      const isSelected = pos.id === selectedId
      ctx.fillStyle = isSelected ? '#ffffff' : '#1a1a1a'
      ctx.strokeStyle = '#333333'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })

    ctx.fillStyle = '#ffffff'
    ctx.font = '12px "SF Pro Display", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    positions.forEach((pos) => {
      const note = notes.find((n) => n.id === pos.id)
      if (!note) return
      const label = note.title ? note.title.slice(0, 18) : 'Untitled'
      ctx.fillText(label, pos.x, pos.y + pos.r + 6)
    })
  }, [notes, selectedId, viewMode])

  const handleGraphClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = graphRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const match = graphNodesRef.current.find((node) => {
      const dx = x - node.x
      const dy = y - node.y
      return Math.sqrt(dx * dx + dy * dy) <= node.r + 6
    })
    if (!match) return
    const target = notes.find((note) => note.id === match.id)
    if (target) handleSelect(target)
  }

  if (viewMode === 'focus' && draft) {
    const mins = Math.floor(focusTimer / 60)
    const secs = focusTimer % 60
    return (
      <div className={styles.focusMode}>
        <div className={styles.focusToolbar}>
          <button onClick={() => { setViewMode('list'); setFocusTimerActive(false); setFocusTimer(0) }} className={styles.exitFocus}>
            Exit Focus
          </button>
          <div className={styles.focusTimerDisplay}>
            <button onClick={() => setFocusTimerActive(p => !p)} className={styles.ghostBtn}>
              {focusTimerActive ? 'Pause' : 'Start Timer'}
            </button>
            <span className={styles.timerValue}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
          </div>
        </div>
        <div className={styles.focusContent}>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
            className={styles.focusTitle}
            placeholder="Title"
          />
          <textarea
            value={draft.body}
            onChange={(e) => updateDraft({ body: e.target.value })}
            className={styles.focusTextarea}
            placeholder="Write your thought"
          />
          <button onClick={() => handleSaveDraft(true)} className={styles.focusSave}>
            Save
          </button>
        </div>
      </div>
    )
  }

  if (viewMode === 'graph') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Knowledge Graph</h1>
            <p>Connections across all thoughts</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => setViewMode('list')} className={styles.secondaryBtn}>
              Back to Thoughts
            </button>
          </div>
        </div>
        <div className={styles.graphCanvasWrap} ref={graphWrapperRef}>
          <canvas ref={graphRef} className={styles.graphCanvas} onClick={handleGraphClick} />
        </div>
        {selectedNote && (
          <div className={styles.graphGrid}>
            <div className={styles.graphNode}>
              <div className={styles.graphTitle}>{selectedNote.title || 'Untitled'}</div>
              <div className={styles.graphMeta}>Links: {selectedNote.linkedNotes.length}</div>
              <div className={styles.graphConnections}>
                {selectedNote.linkedNotes.map((id) => {
                  const linked = notes.find((n) => n.id === id)
                  return linked ? (
                    <div key={id} className={styles.graphConnection}>
                      {linked.title || 'Untitled'}
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Quick Capture Widget (#49) */}
      {showQuickCapture && (
        <div className={styles.quickCaptureOverlay}>
          <div className={styles.quickCapture}>
            <div className={styles.quickCaptureHeader}><span>Quick Capture</span><button onClick={() => setShowQuickCapture(false)} className={styles.ghostBtn}>×</button></div>
            <textarea value={quickCaptureText} onChange={e => setQuickCaptureText(e.target.value)} className={styles.focusTextarea} rows={4} placeholder="Capture a thought instantly... (Ctrl+Q)" autoFocus />
            <div className={styles.quickCaptureActions}>
              <button onClick={handleQuickCapture} className={styles.primaryBtn}>Save</button>
              <button onClick={() => setShowQuickCapture(false)} className={styles.secondaryBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1>Thought System</h1>
          <p>
            {notes.length} thoughts · {stats.decisions} decisions · {stats.topTags.length} active themes
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleNewThought} className={styles.primaryBtn}>
            New Thought
          </button>
          <button onClick={() => setShowQuickCapture(true)} className={styles.secondaryBtn}>
            Quick Capture
          </button>
          <button onClick={() => setViewMode('graph')} className={styles.secondaryBtn}>
            Graph View
          </button>
          <button onClick={() => setShowDigest(p => !p)} className={styles.secondaryBtn}>
            {showDigest ? 'Hide Digest' : 'Digest'}
          </button>
          <button onClick={handleSync} className={styles.secondaryBtn} disabled={syncing}>
            {syncing ? 'Syncing' : 'Sync'}
          </button>
        </div>
      </div>

      {/* Insight Digest (#50) */}
      {showDigest && (
        <div className={styles.resurfaced}>
          <h3>Weekly Insight Digest</h3>
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Thoughts This Week</div><div className={styles.kpiValue}>{insightDigest.total}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Decisions Made</div><div className={styles.kpiValue}>{insightDigest.decisions}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Thoughts</div><div className={styles.kpiValue}>{notes.length}</div></div>
          </div>
          {insightDigest.topGravity.length > 0 && (
            <div>
              <h4 style={{ color: '#888', fontSize: 12, margin: '12px 0 6px' }}>Highest Gravity This Week</h4>
              {insightDigest.topGravity.map(n => (
                <button key={n.id} className={styles.resurfacedItem} onClick={() => handleSelect(n)}>
                  <div className={styles.resurfacedTitle}>{n.title || 'Untitled'}</div>
                  <div className={styles.resurfacedTime}>Gravity {n.gravityScore}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pinned Insights (#46) */}
      {pinnedNotes.length > 0 && !showDigest && (
        <div className={styles.resurfaced}>
          <h3>Pinned Insights</h3>
          <div className={styles.resurfacedList}>
            {pinnedNotes.map(note => (
              <button key={note.id} className={styles.resurfacedItem} onClick={() => handleSelect(note)}>
                <div className={styles.resurfacedTitle}>{note.title || 'Untitled'}</div>
                <div className={styles.resurfacedTime}>Confidence {note.confidence}%</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search thoughts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className={styles.searchInput}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as NoteRole | 'all')} className={styles.select}>
          <option value="all">All Roles</option>
          <option value="idea">Idea</option>
          <option value="principle">Principle</option>
          <option value="rule">Rule</option>
          <option value="warning">Warning</option>
          <option value="insight">Insight</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LifecycleStatus | 'all')} className={styles.select}>
          <option value="all">All Status</option>
          <option value="seed">Seed</option>
          <option value="tested">Tested</option>
          <option value="shipped">Shipped</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={temperatureFilter}
          onChange={(e) => setTemperatureFilter(e.target.value as ThoughtTemperature | 'all')}
          className={styles.select}
        >
          <option value="all">All Temperatures</option>
          <option value="cold">Cold</option>
          <option value="warm">Warm</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          value={horizonFilter}
          onChange={(e) => setHorizonFilter(e.target.value as StrategicHorizon | 'all')}
          className={styles.select}
        >
          <option value="all">All Horizons</option>
          <option value="short">Short</option>
          <option value="mid">Mid</option>
          <option value="long">Long</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as ThoughtSort)} className={styles.select}>
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option === 'recent'
                ? 'Newest'
                : option === 'updated'
                  ? 'Recently Updated'
                  : option === 'confidence'
                    ? 'Confidence'
                    : option === 'gravity'
                      ? 'Gravity'
                      : 'Cognitive Load'}
            </option>
          ))}
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className={styles.searchInput} title="Time Machine — filter by date" />
        <button onClick={() => setShowAbandoned((prev) => !prev)} className={styles.secondaryBtn}>
          {showAbandoned ? 'Hide Abandoned' : 'Show Abandoned'}
        </button>
        {dateFilter && <button onClick={() => setDateFilter('')} className={styles.ghostBtn}>Clear Date</button>}
      </div>

      {resurfaced.length > 0 && (
        <div className={styles.resurfaced}>
          <h3>Resurfaced Ideas</h3>
          <div className={styles.resurfacedList}>
            {resurfaced.map((note) => (
              <button key={note.id} className={styles.resurfacedItem} onClick={() => handleSelect(note)}>
                <div className={styles.resurfacedTitle}>{note.title || 'Untitled'}</div>
                <div className={styles.resurfacedTime}>{timeSince(note.lastViewed)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.notesList}>
          {filteredNotes.map((note) => {
            const age = getAgeLabel(note.createdAt)
            return (
              <button
                key={note.id}
                className={`${styles.noteCard} ${age.className}`}
                onClick={() => handleSelect(note)}
              >
                <div className={styles.noteHeader}>
                  <div className={styles.noteTitle}>{note.title || 'Untitled'}</div>
                  <div className={styles.noteTemp}>{note.temperature}</div>
                </div>
                <div className={styles.noteContent}>
                  {note.body.slice(0, 140)}{note.body.length > 140 ? '...' : ''}
                </div>
                <div className={styles.noteMeta}>
                  <span className={styles.badge}>{note.noteRole}</span>
                  <span className={styles.badge}>{note.lifecycleStatus}</span>
                  <span className={styles.badge}>{age.label}</span>
                  {note.isDecision && <span className={styles.badgeDecision}>Decision</span>}
                  {note.abandoned && <span className={styles.badgeContext}>Abandoned</span>}
                </div>
                <div className={styles.noteFooter}>
                  <span>Confidence {note.confidence}%</span>
                  <span>Gravity {note.gravityScore}</span>
                  <span>{note.linkedNotes.length} links</span>
                </div>
              </button>
            )
          })}
        </div>

        {draft && (
          <div className={styles.noteDetail}>
            <div className={styles.detailHeader}>
              <div className={styles.detailTitleBlock}>
                <input
                  value={draft.title}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                  className={styles.detailTitle}
                  placeholder="Title"
                />
                <div className={styles.detailSub}>Last updated {timeSince(draft.updatedAt)}</div>
              </div>
              <div className={styles.detailActions}>
                <button onClick={() => setViewMode('focus')} className={styles.secondaryBtn}>
                  Focus
                </button>
                <button onClick={() => handleSaveDraft(true)} className={styles.primaryBtn}>
                  Save
                </button>
                <button onClick={() => handleDelete(draft.id)} className={styles.dangerBtn}>
                  Delete
                </button>
              </div>
            </div>

            <textarea
              value={draft.body}
              onChange={(e) => updateDraft({ body: e.target.value })}
              className={styles.textarea}
              placeholder="Write your thought"
              rows={6}
            />

            <div className={styles.panelTabs}>
              {['overview', 'cognition', 'evolution', 'systems', 'ai', 'links'].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.panelTab} ${activePanel === tab ? styles.panelTabActive : ''}`}
                  onClick={() => setActivePanel(tab as typeof activePanel)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activePanel === 'overview' && (
              <div className={styles.panelSection}>
                <div className={styles.gridTwo}>
                  <div>
                    <label className={styles.label}>Thought temperature</label>
                    <select
                      value={draft.temperature}
                      onChange={(e) => updateDraft({ temperature: e.target.value as ThoughtTemperature })}
                      className={styles.select}
                    >
                      <option value="cold">Cold</option>
                      <option value="warm">Warm</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label}>Note role</label>
                    <select
                      value={draft.noteRole}
                      onChange={(e) => updateDraft({ noteRole: e.target.value as NoteRole })}
                      className={styles.select}
                    >
                      <option value="idea">Idea</option>
                      <option value="principle">Principle</option>
                      <option value="rule">Rule</option>
                      <option value="warning">Warning</option>
                      <option value="insight">Insight</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label}>Lifecycle status</label>
                    <select
                      value={draft.lifecycleStatus}
                      onChange={(e) => updateDraft({ lifecycleStatus: e.target.value as LifecycleStatus })}
                      className={styles.select}
                    >
                      <option value="seed">Seed</option>
                      <option value="tested">Tested</option>
                      <option value="shipped">Shipped</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label}>Strategic horizon</label>
                    <select
                      value={draft.strategicHorizon}
                      onChange={(e) => updateDraft({ strategicHorizon: e.target.value as StrategicHorizon })}
                      className={styles.select}
                    >
                      <option value="short">Short</option>
                      <option value="mid">Mid</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Tags</label>
                  <div className={styles.tagRow}>
                    {draft.tags.map((tag) => (
                      <button key={tag} className={styles.tag} onClick={() => removeTag(tag)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Add tag and press Enter"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        const target = event.target as HTMLInputElement
                        addTag(target.value)
                        target.value = ''
                      }
                    }}
                  />
                </div>

                <div className={styles.kpiGrid}>
                  <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Insight Density</div>
                    <div className={styles.kpiValue}>{draft.insightDensityScore.toFixed(1)}</div>
                  </div>
                  <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Idea Gravity</div>
                    <div className={styles.kpiValue}>{draft.gravityScore}</div>
                  </div>
                  <div className={styles.kpiCard}>
                    <div className={styles.kpiLabel}>Cognitive Load</div>
                    <div className={styles.kpiValue}>{draft.cognitiveLoad}</div>
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Pattern recognition</label>
                  <div className={styles.tagRow}>
                    {stats.topTags.map(([tag, count]) => (
                      <span key={tag} className={styles.tag}>
                        {tag} ({count})
                      </span>
                    ))}
                    {stats.topTags.length === 0 && <span className={styles.helperText}>No patterns yet</span>}
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'cognition' && (
              <div className={styles.panelSection}>
                <div className={styles.gridTwo}>
                  <div>
                    <label className={styles.label}>Cognitive load</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draft.cognitiveLoad}
                      onChange={(e) => updateDraft({ cognitiveLoad: Number(e.target.value) })}
                      className={styles.range}
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Confidence level</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draft.confidence}
                      onChange={(e) => updateDraft({ confidence: Number(e.target.value) })}
                      className={styles.range}
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Assumption flag</label>
                    <select
                      value={draft.assumptionFlag}
                      onChange={(e) => updateDraft({ assumptionFlag: e.target.value as ThoughtNote['assumptionFlag'] })}
                      className={styles.select}
                    >
                      <option value="assumption">Assumption</option>
                      <option value="fact">Fact</option>
                      <option value="hypothesis">Hypothesis</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label}>Second-order thinking</label>
                    <input
                      type="text"
                      value={draft.secondOrder}
                      onChange={(e) => updateDraft({ secondOrder: e.target.value })}
                      className={styles.input}
                      placeholder="What happens next"
                    />
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Idea compression</label>
                  <div className={styles.rowBetween}>
                    <input
                      value={draft.compression}
                      onChange={(e) => updateDraft({ compression: e.target.value })}
                      className={styles.input}
                      placeholder="Single sentence summary"
                    />
                    <button
                      onClick={() => handleAiTask('compression')}
                      className={styles.secondaryBtn}
                      disabled={aiLoading === 'compression'}
                    >
                      {aiLoading === 'compression' ? 'Working' : 'Compress'}
                    </button>
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Uncertainty mapping</label>
                  <div className={styles.stack}>
                    {draft.uncertainties.map((item) => (
                      <div key={item.id} className={styles.uncertaintyRow}>
                        <input
                          value={item.label}
                          onChange={(e) => updateUncertainty(item.id, { label: e.target.value })}
                          className={styles.input}
                        />
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={item.impact}
                          onChange={(e) => updateUncertainty(item.id, { impact: Number(e.target.value) })}
                          className={styles.miniInput}
                        />
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={item.likelihood}
                          onChange={(e) => updateUncertainty(item.id, { likelihood: Number(e.target.value) })}
                          className={styles.miniInput}
                        />
                        <button onClick={() => removeUncertainty(item.id)} className={styles.ghostBtn}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addUncertainty} className={styles.secondaryBtn}>
                    Add Uncertainty
                  </button>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Mental friction warnings</label>
                  <div className={styles.alertBox}>
                    {draft.frictionWarnings.length === 0 && <span>No conflicts detected.</span>}
                    {draft.frictionWarnings.map((warning) => (
                      <div key={warning}>{warning}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'evolution' && (
              <div className={styles.panelSection}>
                <div className={styles.gridTwo}>
                  <div>
                    <label className={styles.label}>Decision outcome tracking</label>
                    <div className={styles.rowBetween}>
                      <button
                        onClick={() => updateDraft({ isDecision: !draft.isDecision })}
                        className={styles.secondaryBtn}
                      >
                        {draft.isDecision ? 'Decision On' : 'Mark Decision'}
                      </button>
                      <select
                        value={draft.decisionWorked === null ? 'unknown' : draft.decisionWorked ? 'yes' : 'no'}
                        onChange={(e) =>
                          updateDraft({
                            decisionWorked:
                              e.target.value === 'unknown' ? null : e.target.value === 'yes',
                          })
                        }
                        className={styles.select}
                      >
                        <option value="unknown">Outcome unknown</option>
                        <option value="yes">Worked</option>
                        <option value="no">Did not work</option>
                      </select>
                    </div>
                    <textarea
                      value={draft.decisionOutcome}
                      onChange={(e) => updateDraft({ decisionOutcome: e.target.value })}
                      className={styles.textarea}
                      rows={3}
                      placeholder="Outcome notes"
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Idea aging</label>
                    <div className={styles.agingBox}>
                      <div>Created {timeSince(draft.createdAt)}</div>
                      <div>Views {draft.viewCount}</div>
                      <div>Last viewed {timeSince(draft.lastViewed)}</div>
                    </div>
                    <label className={styles.label}>Abandoned vault</label>
                    <button
                      onClick={() => updateDraft({ abandoned: !draft.abandoned })}
                      className={styles.secondaryBtn}
                    >
                      {draft.abandoned ? 'Remove from Vault' : 'Send to Vault'}
                    </button>
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Revision heatmap</label>
                  <div className={styles.heatmapBar}>
                    <div className={styles.heatmapFill} style={{ width: `${Math.min(draft.versions.length * 10, 100)}%` }} />
                  </div>
                  <div className={styles.helperText}>{draft.versions.length} revisions</div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Time-delayed reflections</label>
                  <div className={styles.rowBetween}>
                    <button onClick={() => addReflection(7)} className={styles.secondaryBtn}>
                      Add 7-day reflection
                    </button>
                    <button onClick={() => addReflection(30)} className={styles.secondaryBtn}>
                      Add 30-day reflection
                    </button>
                  </div>
                  <div className={styles.stack}>
                    {draft.reflections.map((reflection) => (
                      <div key={reflection.id} className={styles.reflectionRow}>
                        <input
                          value={reflection.prompt}
                          onChange={(e) => updateReflection(reflection.id, { prompt: e.target.value })}
                          className={styles.input}
                        />
                        <input
                          type="date"
                          value={reflection.dueAt.split('T')[0]}
                          onChange={(e) =>
                            updateReflection(reflection.id, {
                              dueAt: new Date(e.target.value).toISOString(),
                            })
                          }
                          className={styles.miniInput}
                        />
                        <button
                          onClick={() => updateReflection(reflection.id, { completed: !reflection.completed })}
                          className={styles.ghostBtn}
                        >
                          {reflection.completed ? 'Completed' : 'Pending'}
                        </button>
                        <button onClick={() => removeReflection(reflection.id)} className={styles.ghostBtn}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Idea lineage</label>
                  <select
                    value={draft.parentId || ''}
                    onChange={(e) => updateDraft({ parentId: e.target.value || null })}
                    className={styles.select}
                  >
                    <option value="">No parent</option>
                    {notes
                      .filter((note) => note.id !== draft.id)
                      .map((note) => (
                        <option key={note.id} value={note.id}>
                          {note.title || 'Untitled'}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {activePanel === 'systems' && (
              <div className={styles.panelSection}>
                <div className={styles.gridTwo}>
                  <div>
                    <label className={styles.label}>Framework mode</label>
                    <select
                      value={draft.framework.type}
                      onChange={(e) =>
                        updateDraft({ framework: { ...draft.framework, type: e.target.value as FrameworkType } })
                      }
                      className={styles.select}
                    >
                      <option value="none">None</option>
                      <option value="swot">SWOT</option>
                      <option value="five_whys">5 Whys</option>
                      <option value="first_principles">First Principles</option>
                      <option value="rice">RICE</option>
                      <option value="opportunity_canvas">Opportunity Canvas</option>
                    </select>
                    <textarea
                      value={draft.framework.fields.summary || ''}
                      onChange={(e) =>
                        updateDraft({ framework: { ...draft.framework, fields: { summary: e.target.value } } })
                      }
                      className={styles.textarea}
                      rows={3}
                      placeholder="Framework notes"
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Problem framing</label>
                    <input
                      value={draft.problemStatement}
                      onChange={(e) => updateDraft({ problemStatement: e.target.value })}
                      className={styles.input}
                      placeholder="Problem statement"
                    />
                    <input
                      value={draft.successCriteria}
                      onChange={(e) => updateDraft({ successCriteria: e.target.value })}
                      className={styles.input}
                      placeholder="Success criteria"
                    />
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Constraints</label>
                  <div className={styles.stack}>
                    {draft.constraints.map((constraint) => (
                      <div key={constraint.id} className={styles.rowBetween}>
                        <input
                          value={constraint.label}
                          onChange={(e) => updateConstraint(constraint.id, e.target.value)}
                          className={styles.input}
                        />
                        <button onClick={() => removeConstraint(constraint.id)} className={styles.ghostBtn}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addConstraint} className={styles.secondaryBtn}>
                    Add Constraint
                  </button>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Tradeoff mapper</label>
                  <div className={styles.stack}>
                    {draft.tradeoffs.map((tradeoff) => (
                      <div key={tradeoff.id} className={styles.tradeoffRow}>
                        <input
                          value={tradeoff.title}
                          onChange={(e) => updateTradeoff(tradeoff.id, { title: e.target.value })}
                          className={styles.input}
                        />
                        <input
                          value={tradeoff.cost}
                          onChange={(e) => updateTradeoff(tradeoff.id, { cost: e.target.value })}
                          className={styles.input}
                          placeholder="Cost"
                        />
                        <input
                          value={tradeoff.benefit}
                          onChange={(e) => updateTradeoff(tradeoff.id, { benefit: e.target.value })}
                          className={styles.input}
                          placeholder="Benefit"
                        />
                        <button onClick={() => removeTradeoff(tradeoff.id)} className={styles.ghostBtn}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addTradeoff} className={styles.secondaryBtn}>
                    Add Tradeoff
                  </button>
                </div>

                <div className={styles.gridTwo}>
                  <div>
                    <label className={styles.label}>Signal vs noise</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draft.signalNoise}
                      onChange={(e) => updateDraft({ signalNoise: Number(e.target.value) })}
                      className={styles.range}
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Context snapshot</label>
                    <textarea
                      value={draft.contextSnapshot.summary}
                      onChange={(e) =>
                        updateDraft({
                          contextSnapshot: { ...draft.contextSnapshot, summary: e.target.value },
                        })
                      }
                      className={styles.textarea}
                      rows={3}
                      placeholder="State of mind, environment, constraints"
                    />
                    <div className={styles.rowBetween}>
                      <select
                        value={draft.contextSnapshot.mood}
                        onChange={(e) =>
                          updateDraft({
                            contextSnapshot: {
                              ...draft.contextSnapshot,
                              mood: e.target.value as ThoughtNote['contextSnapshot']['mood'],
                            },
                          })
                        }
                        className={styles.select}
                      >
                        <option value="clear">Clear</option>
                        <option value="charged">Charged</option>
                        <option value="uncertain">Uncertain</option>
                        <option value="tired">Tired</option>
                      </select>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={draft.contextSnapshot.energy}
                        onChange={(e) =>
                          updateDraft({
                            contextSnapshot: { ...draft.contextSnapshot, energy: Number(e.target.value) },
                          })
                        }
                        className={styles.range}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'ai' && (
              <div className={styles.panelSection}>
                <div className={styles.aiGrid}>
                  <button onClick={() => handleAiTask('blind_spots')} className={styles.secondaryBtn}>
                    Blind Spot Detector
                  </button>
                  <button onClick={() => handleAiTask('counter_arguments')} className={styles.secondaryBtn}>
                    Counter-Arguments
                  </button>
                  <button onClick={() => handleAiTask('stress_test')} className={styles.secondaryBtn}>
                    Idea Stress Test
                  </button>
                  <button onClick={() => handleAiTask('questions')} className={styles.secondaryBtn}>
                    Question Generator
                  </button>
                  <button onClick={() => handleAiTask('summary')} className={styles.secondaryBtn}>
                    Strategic Summary
                  </button>
                  <button onClick={() => handleAiTask('bias')} className={styles.secondaryBtn}>
                    Bias Detection
                  </button>
                  <button onClick={() => handleAiTask('naming')} className={styles.secondaryBtn}>
                    Naming Engine
                  </button>
                  <button onClick={() => handleAiTask('analogy')} className={styles.secondaryBtn}>
                    Analogy Builder
                  </button>
                  <button onClick={() => handleAiTask('expansion')} className={styles.secondaryBtn}>
                    Thought Expansion
                  </button>
                  <button onClick={() => handleAiTask('decision_sim')} className={styles.secondaryBtn}>
                    Decision Simulator
                  </button>
                  <button onClick={() => handleAiTask('action_plan')} className={styles.secondaryBtn}>
                    Insight to Action
                  </button>
                  <button onClick={() => handleAiTask('cross_domain')} className={styles.secondaryBtn}>
                    Cross-Domain Translation
                  </button>
                  <button onClick={createSynthesis} className={styles.secondaryBtn}>
                    Synthesis Engine
                  </button>
                </div>

                {aiLoading && <div className={styles.helperText}>AI running: {aiLoading.replace('_', ' ')}</div>}

                <div className={styles.aiOutputGrid}>
                  {draft.ai.summary && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Strategic Summary</div>
                      <div className={styles.aiText}>{draft.ai.summary.text}</div>
                    </div>
                  )}
                  {draft.ai.questions && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Questions</div>
                      <div className={styles.aiText}>{draft.ai.questions.text}</div>
                    </div>
                  )}
                  {draft.ai.stressTest && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Stress Test</div>
                      <div className={styles.aiText}>{draft.ai.stressTest.text}</div>
                    </div>
                  )}
                  {draft.ai.actionPlan && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Action Plan</div>
                      <div className={styles.aiText}>{draft.ai.actionPlan.text}</div>
                    </div>
                  )}
                  {draft.ai.blindSpots && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Blind Spots</div>
                      <div className={styles.aiText}>{draft.ai.blindSpots.text}</div>
                    </div>
                  )}
                  {draft.ai.counterArguments && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Counter-Arguments</div>
                      <div className={styles.aiText}>{draft.ai.counterArguments.text}</div>
                    </div>
                  )}
                  {draft.ai.biasDetection && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Bias Detection</div>
                      <div className={styles.aiText}>{draft.ai.biasDetection.text}</div>
                    </div>
                  )}
                  {draft.ai.naming && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Naming Options</div>
                      <div className={styles.aiText}>{draft.ai.naming.text}</div>
                    </div>
                  )}
                  {draft.ai.analogy && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Analogy</div>
                      <div className={styles.aiText}>{draft.ai.analogy.text}</div>
                    </div>
                  )}
                  {draft.ai.expansion && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Expansion</div>
                      <div className={styles.aiText}>{draft.ai.expansion.text}</div>
                    </div>
                  )}
                  {draft.ai.decisionSim && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Decision Simulation</div>
                      <div className={styles.aiText}>{draft.ai.decisionSim.text}</div>
                    </div>
                  )}
                  {draft.ai.crossDomain && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Cross-Domain Translation</div>
                      <div className={styles.aiText}>{draft.ai.crossDomain.text}</div>
                    </div>
                  )}
                  {draft.ai.synthesis && (
                    <div className={styles.aiCard}>
                      <div className={styles.aiTitle}>Synthesis</div>
                      <div className={styles.aiText}>{draft.ai.synthesis.text}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePanel === 'links' && (
              <div className={styles.panelSection}>
                <div className={styles.sectionRow}>
                  <label className={styles.label}>Link other thoughts</label>
                  <div className={styles.linkGrid}>
                    {notes
                      .filter((note) => note.id !== draft.id)
                      .map((note) => (
                        <button
                          key={note.id}
                          className={`${styles.linkItem} ${draft.linkedNotes.includes(note.id) ? styles.linkItemActive : ''}`}
                          onClick={() => toggleLink(note.id)}
                        >
                          {note.title || 'Untitled'}
                        </button>
                      ))}
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Project references</label>
                  <div className={styles.linkGrid}>
                    {dashboard.projects.map((project) => (
                      <button
                        key={project.id}
                        className={`${styles.linkItem} ${draft.references.projects.includes(project.id) ? styles.linkItemActive : ''}`}
                        onClick={() => toggleReference('projects', project.id)}
                      >
                        {project.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Brand references</label>
                  <div className={styles.linkGrid}>
                    {dashboard.brands.map((brand) => (
                      <button
                        key={brand.id}
                        className={`${styles.linkItem} ${draft.references.brands.includes(brand.id) ? styles.linkItemActive : ''}`}
                        onClick={() => toggleReference('brands', brand.id)}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Launch references</label>
                  <div className={styles.linkGrid}>
                    {dashboard.launchPages.map((launch) => (
                      <button
                        key={launch.id}
                        className={`${styles.linkItem} ${draft.references.launches.includes(launch.id) ? styles.linkItemActive : ''}`}
                        onClick={() => toggleReference('launches', launch.id)}
                      >
                        {launch.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>Content references</label>
                  <div className={styles.linkGrid}>
                    {dashboard.content.map((item) => (
                      <button
                        key={item.id}
                        className={`${styles.linkItem} ${draft.references.content.includes(item.id) ? styles.linkItemActive : ''}`}
                        onClick={() => toggleReference('content', item.id)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionRow}>
                  <label className={styles.label}>External links</label>
                  <div className={styles.rowBetween}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="https://"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          const target = event.target as HTMLInputElement
                          addExternalLink(target.value)
                          target.value = ''
                        }
                      }}
                    />
                  </div>
                  <div className={styles.tagRow}>
                    {draft.references.externalLinks.map((link) => (
                      <button key={link} className={styles.tag} onClick={() => removeExternalLink(link)}>
                        {link}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
