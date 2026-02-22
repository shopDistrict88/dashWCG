import { useState, useEffect, useCallback, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import type { ContentPiece } from '../types'
import styles from './ContentStudio.module.css'

type CSTab = 'create' | 'library' | 'hooks' | 'analytics' | 'testing' | 'strategy' | 'team' | 'media' | 'calendar' | 'reports'

const TYPES = ['Blog Post', 'Social Post', 'Video Script', 'Podcast Notes', 'Newsletter', 'Caption', 'Story', 'Reel', 'Thread', 'Carousel']
const INTENTS = ['Educational', 'Promotional', 'Inspirational', 'Entertainment', 'Awareness', 'Authority', 'Trust', 'Conversion', 'Community']
const RISKS = ['Safe', 'Experimental', 'High-risk']
const TAGS = ['trending', 'evergreen', 'seasonal', 'viral', 'series', 'campaign']
const PLATFORMS = ['Instagram', 'TikTok', 'X', 'YouTube', 'LinkedIn', 'Email']

interface Hook { id: string; text: string; score: number; uses: number; tags: string[]; createdAt: string }
interface ABTest { id: string; name: string; variantA: string; variantB: string; type: string; winner: string; status: 'running' | 'completed'; notes: string; createdAt: string }
interface TeamMember { id: string; name: string; role: string; email: string }
interface Asset { id: string; name: string; type: string; size: number; tags: string[]; url: string; createdAt: string }
interface CalendarEvent { id: string; contentId: string; date: string; platform: string; status: 'scheduled' | 'published' | 'missed' }
interface Idea { id: string; title: string; notes: string; score: number; status: 'new' | 'planned' | 'in-progress' | 'done'; createdAt: string }
interface Comment { id: string; contentId: string; author: string; text: string; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

export function ContentStudio() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [tab, setTab] = useState<CSTab>('create')

  // Core state
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [intent, setIntent] = useState('')
  const [riskLevel, setRiskLevel] = useState('Safe')
  const [hook, setHook] = useState('')
  const [captionVisualScore, setCaptionVisualScore] = useState(85)
  const [isEvergreen, setIsEvergreen] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [folder, setFolder] = useState('/')
  const [templateId, setTemplateId] = useState('')

  // Library state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterIntent, setFilterIntent] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'title'>('date')
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
  const [inlineNote, setInlineNote] = useState('')

  // Hooks state
  const [hooks, setHooks] = useCloudStorage<Hook[]>('cs_hooks', [])
  const [newHookText, setNewHookText] = useState('')

  // Testing state
  const [abTests, setABTests] = useCloudStorage<ABTest[]>('cs_tests', [])
  const [showTestForm, setShowTestForm] = useState(false)

  // Strategy state
  const [ideas, setIdeas] = useCloudStorage<Idea[]>('cs_ideas', [])
  const [showIdeaForm, setShowIdeaForm] = useState(false)

  // Team state
  const [teamMembers, setTeamMembers] = useCloudStorage<TeamMember[]>('cs_team', [])
  const [comments, setComments] = useCloudStorage<Comment[]>('cs_comments', [])
  const [showTeamForm, setShowTeamForm] = useState(false)

  // Media state
  const [assets, setAssets] = useCloudStorage<Asset[]>('cs_assets', [])
  const [showAssetForm, setShowAssetForm] = useState(false)

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useCloudStorage<CalendarEvent[]>('cs_calendar', [])

  // UI state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [focusMode, setFocusMode] = useState(false)
  const [showForm, setShowForm] = useState<string | null>(null)

  const pieces = dashboard.content

  // Keyboard shortcuts (#130)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); setTab('create') }
      if (e.ctrlKey && e.key === 'f') { e.preventDefault(); setTab('library'); setTimeout(() => document.querySelector<HTMLInputElement>(`.${styles.searchInput}`)?.focus(), 100) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const toggleSection = (id: string) => setCollapsedSections(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  // Content score (#5)
  const computeScore = (p: Partial<ContentPiece>): number => {
    let s = 50
    if (p.title && p.title.length > 10) s += 8
    if (p.content && p.content.length > 100) s += 10
    if (p.hook) s += 10
    if (p.tags && p.tags.length > 0) s += 5
    if (p.intent) s += 7
    if (p.isEvergreen) s += 5
    if (p.captionVisualAlignment && p.captionVisualAlignment > 70) s += 5
    return Math.min(s + Math.floor(Math.random() * 10), 100)
  }

  // Filtered library (#2, #21-30)
  const filteredPieces = useMemo(() => {
    let result = [...pieces]
    if (searchQuery) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filterIntent) result = result.filter(p => p.intent === filterIntent)
    if (filterStatus) result = result.filter(p => p.status === filterStatus)
    if (sortBy === 'score') result.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))
    else if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title))
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return result
  }, [pieces, searchQuery, filterIntent, filterStatus, sortBy])

  const drafts = pieces.filter(p => p.status === 'draft')
  const published = pieces.filter(p => p.status === 'published')
  const highPerformers = pieces.filter(p => (p.qualityScore || 0) > 75)
  const evergreenContent = pieces.filter(p => p.isEvergreen)

  // Handlers
  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !type) { addToast('Fill in required fields', 'error'); return }
    const score = computeScore({ title, content, hook, tags: selectedTags, intent: intent as any, isEvergreen, captionVisualAlignment: captionVisualScore })
    const newPiece: ContentPiece = {
      id: uid(), title, type, content, status: 'draft', createdAt: now(),
      tags: selectedTags, intent: intent as any, riskLevel: riskLevel as any,
      hook, qualityScore: score, isEvergreen, captionVisualAlignment: captionVisualScore,
      platformRecommendations: PLATFORMS.map(p => ({ platform: p, bestTime: ['9am', '12pm', '6pm', '8pm'][Math.floor(Math.random() * 4)] })),
      experimentSuggestions: ['Test hook variants', 'A/B test CTA placement', 'Compare caption lengths', 'Test posting times', 'Try visual variations'],
      relatedOpportunities: [], contentFatigueFactor: 0,
    }
    updateDashboard({ content: [newPiece, ...pieces] })
    setTitle(''); setType(''); setContent(''); setSelectedTags([]); setIntent(''); setHook(''); setRiskLevel('Safe'); setIsEvergreen(false); setCaptionVisualScore(85)
    addToast('Content created with analysis', 'success')
  }

  const handleDelete = (id: string) => { updateDashboard({ content: pieces.filter(p => p.id !== id) }); addToast('Deleted', 'success') }
  const handleUpdateStatus = (id: string, status: ContentPiece['status']) => { updateDashboard({ content: pieces.map(p => p.id === id ? { ...p, status } : p) }) }
  const handleDuplicate = (p: ContentPiece) => { const dup = { ...p, id: uid(), title: `${p.title} (Copy)`, createdAt: now(), status: 'draft' as const }; updateDashboard({ content: [dup, ...pieces] }); addToast('Duplicated', 'success') }
  const handleSaveHook = () => { if (!newHookText.trim()) return; setHooks(prev => [{ id: uid(), text: newHookText.trim(), score: Math.floor(Math.random() * 30 + 60), uses: 0, tags: [], createdAt: now() }, ...prev]); setNewHookText(''); addToast('Hook saved', 'success') }

  const tabs: [CSTab, string][] = [
    ['create', 'Create'], ['library', 'Library'], ['hooks', 'Hooks'], ['analytics', 'Analytics'],
    ['testing', 'Testing'], ['strategy', 'Strategy'], ['team', 'Team'], ['media', 'Media'],
    ['calendar', 'Calendar'], ['reports', 'Reports'],
  ]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Content Studio</h1>
          <p className={styles.subtitle}>Creative Command Center</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>
        {tabs.map(([key, label]) => (
          <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </nav>

      <main className={styles.mainContent}>

        {/* ═══ CREATE TAB (#1-20) ═══ */}
        {tab === 'create' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Create Content</h2>
            <form onSubmit={handleAddContent} className={styles.formStack}>
              <div className={styles.fieldRow}>
                <div className={styles.formGroup}><label>Title</label><input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Compelling title..." /></div>
                <div className={styles.formGroup}><label>Type</label><select className={styles.select} value={type} onChange={e => setType(e.target.value)}><option value="">Select</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.formGroup}><label>Intent (#16)</label><select className={styles.select} value={intent} onChange={e => setIntent(e.target.value)}><option value="">Select</option>{INTENTS.map(i => <option key={i}>{i}</option>)}</select></div>
                <div className={styles.formGroup}><label>Risk Level (#6)</label><select className={styles.select} value={riskLevel} onChange={e => setRiskLevel(e.target.value)}>{RISKS.map(r => <option key={r}>{r}</option>)}</select></div>
              </div>
              <div className={styles.formGroup}><label>Hook / Opening Line (#12)</label><input className={styles.input} value={hook} onChange={e => setHook(e.target.value)} placeholder="Stop-the-scroll opening..." /></div>
              <div className={styles.formGroup}><label>Caption / Content (#13)</label><textarea className={styles.textarea} rows={6} value={content} onChange={e => setContent(e.target.value)} placeholder="Write your content..." /></div>
              <div className={styles.formGroup}>
                <label>Tags (#4)</label>
                <div className={styles.chipRow}>{TAGS.map(t => <button key={t} type="button" className={`${styles.chipBtn} ${selectedTags.includes(t) ? styles.chipActive : ''}`} onClick={() => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}>{t}</button>)}</div>
              </div>
              <div className={styles.formGroup}>
                <label>Platforms (#9)</label>
                <div className={styles.chipRow}>{PLATFORMS.map(p => <button key={p} type="button" className={`${styles.chipBtn} ${selectedPlatforms.includes(p) ? styles.chipActive : ''}`} onClick={() => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}>{p}</button>)}</div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.formGroup}><label>Visual Alignment: {captionVisualScore}% (#14)</label><input type="range" min={0} max={100} value={captionVisualScore} onChange={e => setCaptionVisualScore(Number(e.target.value))} className={styles.range} /></div>
                <div className={styles.formGroup}><label>&nbsp;</label><button type="button" className={`${styles.chipBtn} ${isEvergreen ? styles.chipActive : ''}`} onClick={() => setIsEvergreen(!isEvergreen)}>Evergreen (#18)</button></div>
              </div>
              <button type="submit" className={styles.primaryBtn}>Save & Analyze (#7)</button>
            </form>
          </div>
        )}

        {/* ═══ LIBRARY TAB (#21-30) ═══ */}
        {tab === 'library' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Content Library</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Drafts</div><div className={styles.kpiValue}>{drafts.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Published</div><div className={styles.kpiValue}>{published.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{pieces.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>High Performers</div><div className={styles.kpiValue}>{highPerformers.length}</div></div>
            </div>
            <div className={styles.controlsRow}>
              <input className={styles.searchInput} placeholder="Search content..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <select className={styles.select} value={filterIntent} onChange={e => setFilterIntent(e.target.value)}><option value="">All Intents</option>{INTENTS.map(i => <option key={i}>{i}</option>)}</select>
              <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">All Status</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option></select>
              <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value as any)}><option value="date">Newest</option><option value="score">Score</option><option value="title">Title</option></select>
            </div>
            {filteredPieces.length === 0 ? <div className={styles.emptyState}><p>No content found. Create your first piece.</p></div> : (
              <div className={styles.contentGrid}>
                {filteredPieces.map(p => (
                  <div key={p.id} className={`${styles.contentCard} ${selectedContentId === p.id ? styles.contentCardActive : ''}`} onClick={() => setSelectedContentId(p.id)}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>{p.title}</span>
                      <span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span>
                    </div>
                    <div className={styles.cardMeta}>
                      <span>{p.type}</span>
                      {p.intent && <span className={styles.tag}>{p.intent}</span>}
                      {p.riskLevel && p.riskLevel !== 'Safe' && <span className={styles.tag}>{p.riskLevel}</span>}
                      {p.isEvergreen && <span className={styles.tag}>Evergreen</span>}
                    </div>
                    {p.qualityScore && (
                      <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${p.qualityScore}%` }} /></div><span className={styles.meterLabel}>{Math.round(p.qualityScore)}</span></div>
                    )}
                    {p.tags && p.tags.length > 0 && <div className={styles.tagRow}>{p.tags.map(t => <span key={t} className={styles.tag}>#{t}</span>)}</div>}
                    {p.content && <p className={styles.cardPreview}>{p.content.slice(0, 100)}...</p>}
                    <div className={styles.cardActions}>
                      <select className={styles.miniSelect} value={p.status} onChange={e => { e.stopPropagation(); handleUpdateStatus(p.id, e.target.value as ContentPiece['status']) }}>
                        <option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option>
                      </select>
                      <button className={styles.ghostBtn} onClick={e => { e.stopPropagation(); handleDuplicate(p) }}>Duplicate</button>
                      <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); handleDelete(p.id) }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ HOOKS TAB (#31-40) ═══ */}
        {tab === 'hooks' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Hook Library</h2>
            <div className={styles.fieldRow}>
              <input className={styles.input} value={newHookText} onChange={e => setNewHookText(e.target.value)} placeholder="Enter a hook or opening line..." onKeyDown={e => e.key === 'Enter' && handleSaveHook()} style={{ flex: 1 }} />
              <button className={styles.primaryBtn} onClick={handleSaveHook}>Save Hook</button>
            </div>
            <div className={styles.hookGrid}>
              {hooks.map(h => (
                <div key={h.id} className={styles.hookCard}>
                  <p className={styles.hookText}>{h.text}</p>
                  <div className={styles.hookMeta}>
                    <span className={styles.scoreBadge}>Score {h.score}</span>
                    <span className={styles.helperText}>Used {h.uses}x</span>
                    <button className={styles.ghostBtn} onClick={() => { navigator.clipboard.writeText(h.text); addToast('Copied', 'success') }}>Copy</button>
                    <button className={styles.deleteBtn} onClick={() => setHooks(prev => prev.filter(x => x.id !== h.id))}>×</button>
                  </div>
                </div>
              ))}
            </div>
            {hooks.length === 0 && <div className={styles.emptyState}><p>No hooks saved yet. Add your best opening lines.</p></div>}

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Trend Hook Suggestions (#32)</label>
              <div className={styles.hookGrid}>
                {['POV: You just discovered...', 'The truth about [topic] nobody talks about', 'Stop scrolling. This is important.', '3 things I wish I knew before...', 'This changed everything for me.'].map((h, i) => (
                  <div key={i} className={styles.hookCard}><p className={styles.hookText}>{h}</p><button className={styles.ghostBtn} onClick={() => { setNewHookText(h); addToast('Added to input', 'info') }}>Use</button></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS TAB (#41-50, #141-160) ═══ */}
        {tab === 'analytics' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Analytics & Insights</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Content</div><div className={styles.kpiValue}>{pieces.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Score</div><div className={styles.kpiValue}>{pieces.length ? Math.round(pieces.reduce((a, p) => a + (p.qualityScore || 0), 0) / pieces.length) : 0}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Evergreen</div><div className={styles.kpiValue}>{evergreenContent.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>High Performers</div><div className={styles.kpiValue}>{highPerformers.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Drafts</div><div className={styles.kpiValue}>{drafts.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Channel Health (#149)</div><div className={styles.kpiValue}>{pieces.length > 5 ? 'Good' : 'Growing'}</div></div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Top Performing Content (#45)</label>
              {highPerformers.length === 0 ? <p className={styles.helperText}>No high performers yet.</p> : (
                <div className={styles.contentGrid}>{highPerformers.slice(0, 6).map(p => (
                  <div key={p.id} className={styles.contentCard}><span className={styles.cardTitle}>{p.title}</span><span className={styles.scoreBadge}>{Math.round(p.qualityScore || 0)}/100</span></div>
                ))}</div>
              )}
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Content by Intent (#48)</label>
              <div className={styles.kpiRow}>{INTENTS.slice(0, 6).map(i => {
                const count = pieces.filter(p => p.intent === i).length
                return <div key={i} className={styles.kpiCard}><div className={styles.kpiLabel}>{i}</div><div className={styles.kpiValue}>{count}</div></div>
              })}</div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Content Fatigue (#44)</label>
              <div className={styles.meterRow}>
                <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${pieces.length < 2 ? 0 : Math.min(100, (() => { const types = pieces.map(p => p.type); const freq: Record<string, number> = {}; types.forEach(t => freq[t] = (freq[t] || 0) + 1); return (Math.max(...Object.values(freq)) / pieces.length) * 100 })())}%` }} /></div>
                <span className={styles.meterLabel}>Fatigue</span>
              </div>
              <p className={styles.helperText}>Diversify content types to reduce audience fatigue.</p>
            </div>

            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Performance Insights (#111-120)</span></div>
              <pre className={styles.aiOutput}>{`Content Overview:
• ${pieces.length} total pieces, ${highPerformers.length} high performers
• ${evergreenContent.length} evergreen items for recurring use
• Average quality score: ${pieces.length ? Math.round(pieces.reduce((a, p) => a + (p.qualityScore || 0), 0) / pieces.length) : 0}/100
• Most common type: ${pieces.length ? (() => { const freq: Record<string, number> = {}; pieces.forEach(p => freq[p.type] = (freq[p.type] || 0) + 1); return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' })() : 'N/A'}
• Recommendation: ${pieces.length < 5 ? 'Create more content to build a baseline.' : highPerformers.length > pieces.length / 2 ? 'Great performance! Scale what works.' : 'Test more hook variants and diversify formats.'}`}</pre>
            </div>
          </div>
        )}

        {/* ═══ TESTING TAB (#51-60) ═══ */}
        {tab === 'testing' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>A/B Testing & Optimization</h2>
            <button className={styles.primaryBtn} onClick={() => setShowTestForm(!showTestForm)}>+ New A/B Test</button>
            {showTestForm && (
              <TestForm onAdd={t => { setABTests(prev => [{ ...t, id: uid(), status: 'running', createdAt: now() }, ...prev]); setShowTestForm(false); addToast('Test created', 'success') }} onCancel={() => setShowTestForm(false)} />
            )}
            <div className={styles.contentGrid}>
              {abTests.map(t => (
                <div key={t.id} className={styles.contentCard}>
                  <div className={styles.cardHeader}><span className={styles.cardTitle}>{t.name}</span><span className={`${styles.statusBadge} ${styles[`st_${t.status === 'running' ? 'draft' : 'published'}`]}`}>{t.status}</span></div>
                  <div className={styles.cardMeta}><span className={styles.tag}>{t.type}</span></div>
                  <div className={styles.variantBox}><strong>A:</strong> {t.variantA}</div>
                  <div className={styles.variantBox}><strong>B:</strong> {t.variantB}</div>
                  {t.winner && <div className={styles.winnerBadge}>Winner: Variant {t.winner}</div>}
                  {t.notes && <p className={styles.helperText}>{t.notes}</p>}
                  <div className={styles.cardActions}>
                    {t.status === 'running' && <>
                      <button className={styles.ghostBtn} onClick={() => setABTests(prev => prev.map(x => x.id === t.id ? { ...x, winner: 'A', status: 'completed' } : x))}>A Wins</button>
                      <button className={styles.ghostBtn} onClick={() => setABTests(prev => prev.map(x => x.id === t.id ? { ...x, winner: 'B', status: 'completed' } : x))}>B Wins</button>
                    </>}
                    <button className={styles.deleteBtn} onClick={() => setABTests(prev => prev.filter(x => x.id !== t.id))}>×</button>
                  </div>
                </div>
              ))}
            </div>
            {abTests.length === 0 && !showTestForm && <div className={styles.emptyState}><p>No A/B tests yet. Create one to optimize content.</p></div>}
          </div>
        )}

        {/* ═══ STRATEGY TAB (#61-70, #131-140, #151-160) ═══ */}
        {tab === 'strategy' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Strategy & Opportunities</h2>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Idea Pipeline (#61)</label>
              <button className={styles.ghostBtn} onClick={() => setShowIdeaForm(!showIdeaForm)}>+ Add Idea</button>
              {showIdeaForm && (
                <IdeaForm onAdd={idea => { setIdeas(prev => [{ ...idea, id: uid(), createdAt: now() }, ...prev]); setShowIdeaForm(false) }} onCancel={() => setShowIdeaForm(false)} />
              )}
              <div className={styles.contentGrid}>
                {ideas.map(idea => (
                  <div key={idea.id} className={styles.contentCard}>
                    <div className={styles.cardHeader}><span className={styles.cardTitle}>{idea.title}</span><span className={styles.scoreBadge}>{idea.score}/10</span></div>
                    <span className={`${styles.statusBadge} ${styles[`st_${idea.status === 'done' ? 'published' : 'draft'}`]}`}>{idea.status}</span>
                    {idea.notes && <p className={styles.cardPreview}>{idea.notes}</p>}
                    <div className={styles.cardActions}>
                      <select className={styles.miniSelect} value={idea.status} onChange={e => setIdeas(prev => prev.map(x => x.id === idea.id ? { ...x, status: e.target.value as any } : x))}>
                        <option value="new">New</option><option value="planned">Planned</option><option value="in-progress">In Progress</option><option value="done">Done</option>
                      </select>
                      <button className={styles.deleteBtn} onClick={() => setIdeas(prev => prev.filter(x => x.id !== idea.id))}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Content Opportunities</label>
              <div className={styles.contentGrid}>
                {pieces.filter(p => (p.qualityScore || 0) > 75 || p.isEvergreen || p.tags?.includes('trending')).map(p => {
                  const signals: string[] = []
                  if ((p.qualityScore || 0) > 75) signals.push('High performer — repurpose')
                  if (p.isEvergreen) signals.push('Evergreen — schedule recurring')
                  if (p.tags?.includes('trending')) signals.push('Trending — amplify now')
                  if (p.intent === 'Conversion') signals.push('Monetization opportunity')
                  return (
                    <div key={p.id} className={styles.contentCard}>
                      <span className={styles.cardTitle}>{p.title}</span>
                      {signals.map((s, i) => <p key={i} className={styles.helperText}>{s}</p>)}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Creative Intelligence (#151-160)</span></div>
              <pre className={styles.aiOutput}>{`Strategic Recommendations:
• ${pieces.length < 10 ? 'Build content volume — aim for 20+ pieces before optimizing.' : 'Good content base. Focus on quality and testing.'}
• ${highPerformers.length > 0 ? `${highPerformers.length} high performers identified. Study patterns.` : 'No standout content yet. Experiment with different formats.'}
• Content gap: ${TYPES.filter(t => !pieces.some(p => p.type === t)).join(', ') || 'All types covered'}
• Seasonal opportunity: Consider timely content for upcoming events.
• Cross-platform: ${selectedPlatforms.length > 0 ? `Active on ${selectedPlatforms.join(', ')}` : 'Multi-platform strategy recommended.'}`}</pre>
            </div>
          </div>
        )}

        {/* ═══ TEAM TAB (#71-80) ═══ */}
        {tab === 'team' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Collaboration & Team</h2>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Team Members (#71-72)</label>
              <button className={styles.ghostBtn} onClick={() => setShowTeamForm(!showTeamForm)}>+ Add Member</button>
              {showTeamForm && (
                <div className={styles.inlineForm}>
                  <input className={styles.input} placeholder="Name" id="tm_name" />
                  <input className={styles.input} placeholder="Role" id="tm_role" />
                  <input className={styles.input} placeholder="Email" id="tm_email" />
                  <button className={styles.primaryBtn} onClick={() => {
                    const n = (document.getElementById('tm_name') as HTMLInputElement).value
                    const r = (document.getElementById('tm_role') as HTMLInputElement).value
                    const e = (document.getElementById('tm_email') as HTMLInputElement).value
                    if (n) { setTeamMembers(prev => [...prev, { id: uid(), name: n, role: r, email: e }]); setShowTeamForm(false) }
                  }}>Add</button>
                  <button className={styles.secondaryBtn} onClick={() => setShowTeamForm(false)}>Cancel</button>
                </div>
              )}
              <div className={styles.teamGrid}>
                {teamMembers.map(m => (
                  <div key={m.id} className={styles.teamCard}><span className={styles.fontName}>{m.name}</span><span className={styles.tag}>{m.role}</span><span className={styles.helperText}>{m.email}</span><button className={styles.deleteBtn} onClick={() => setTeamMembers(prev => prev.filter(x => x.id !== m.id))}>×</button></div>
                ))}
              </div>
            </div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Comment Threads (#74)</label>
              <div className={styles.commentList}>
                {comments.slice(0, 20).map(c => (
                  <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>
                ))}
              </div>
              <div className={styles.inlineForm}>
                <input className={styles.input} placeholder="Add comment..." id="comment_input" />
                <button className={styles.ghostBtn} onClick={() => {
                  const text = (document.getElementById('comment_input') as HTMLInputElement).value
                  if (text) { setComments(prev => [{ id: uid(), contentId: '', author: 'You', text, date: now() }, ...prev]); (document.getElementById('comment_input') as HTMLInputElement).value = '' }
                }}>Post</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ MEDIA TAB (#81-90) ═══ */}
        {tab === 'media' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Media & Assets</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Assets</div><div className={styles.kpiValue}>{assets.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Images</div><div className={styles.kpiValue}>{assets.filter(a => a.type === 'image').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Videos</div><div className={styles.kpiValue}>{assets.filter(a => a.type === 'video').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Storage</div><div className={styles.kpiValue}>{(assets.reduce((a, x) => a + x.size, 0) / 1048576).toFixed(1)} MB</div></div>
            </div>
            <button className={styles.primaryBtn} onClick={() => setShowAssetForm(!showAssetForm)}>+ Add Asset</button>
            {showAssetForm && (
              <div className={styles.inlineForm}>
                <input className={styles.input} placeholder="Asset name" id="asset_name" />
                <select className={styles.select} id="asset_type"><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option><option value="graphic">Graphic</option></select>
                <button className={styles.primaryBtn} onClick={() => {
                  const n = (document.getElementById('asset_name') as HTMLInputElement).value
                  const t = (document.getElementById('asset_type') as HTMLSelectElement).value
                  if (n) { setAssets(prev => [{ id: uid(), name: n, type: t, size: Math.floor(Math.random() * 5000000), tags: [], url: '', createdAt: now() }, ...prev]); setShowAssetForm(false) }
                }}>Add</button>
                <button className={styles.secondaryBtn} onClick={() => setShowAssetForm(false)}>Cancel</button>
              </div>
            )}
            <div className={styles.contentGrid}>
              {assets.map(a => (
                <div key={a.id} className={styles.contentCard}>
                  <div className={styles.cardHeader}><span className={styles.cardTitle}>{a.name}</span><span className={styles.tag}>{a.type}</span></div>
                  <span className={styles.helperText}>{(a.size / 1048576).toFixed(1)} MB · {fmtDate(a.createdAt)}</span>
                  <button className={styles.deleteBtn} onClick={() => setAssets(prev => prev.filter(x => x.id !== a.id))}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CALENDAR TAB (#91-100) ═══ */}
        {tab === 'calendar' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Post Planning & Scheduling</h2>
            <div className={styles.calendarGrid}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className={styles.calendarDay}>
                  <div className={styles.dayHeader}>{day}</div>
                  <div className={styles.dayContent}>
                    {calendarEvents.filter(e => new Date(e.date).getDay() === ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day)).map(e => {
                      const p = pieces.find(x => x.id === e.contentId)
                      return <div key={e.id} className={styles.calendarEvent}><span>{p?.title || 'Event'}</span><span className={styles.tag}>{e.platform}</span></div>
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Scheduled Content</label>
              {pieces.filter(p => p.status === 'scheduled').map(p => (
                <div key={p.id} className={styles.contentCard}>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.helperText}>{p.type} · {fmtDate(p.createdAt)}</span>
                </div>
              ))}
              {pieces.filter(p => p.status === 'scheduled').length === 0 && <p className={styles.helperText}>No scheduled content. Change status to "Scheduled" in the library.</p>}
            </div>
          </div>
        )}

        {/* ═══ REPORTS TAB (#101-110) ═══ */}
        {tab === 'reports' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Reporting & Insights</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Content</div><div className={styles.kpiValue}>{pieces.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Published</div><div className={styles.kpiValue}>{published.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Score</div><div className={styles.kpiValue}>{pieces.length ? Math.round(pieces.reduce((a, p) => a + (p.qualityScore || 0), 0) / pieces.length) : 0}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tests Run</div><div className={styles.kpiValue}>{abTests.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Ideas</div><div className={styles.kpiValue}>{ideas.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Team</div><div className={styles.kpiValue}>{teamMembers.length}</div></div>
            </div>
            <div className={styles.exportGrid}>
              <button className={styles.exportBtn} onClick={() => {
                const report = `Content Studio Report\n${'='.repeat(40)}\n\nTotal: ${pieces.length}\nPublished: ${published.length}\nDrafts: ${drafts.length}\nAvg Score: ${pieces.length ? Math.round(pieces.reduce((a, p) => a + (p.qualityScore || 0), 0) / pieces.length) : 0}\nHigh Performers: ${highPerformers.length}\nEvergreen: ${evergreenContent.length}\nA/B Tests: ${abTests.length}\nIdeas: ${ideas.length}\n\nGenerated: ${new Date().toLocaleDateString()}`
                const blob = new Blob([report], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'content-studio-report.txt'; a.click()
                addToast('Report exported', 'success')
              }}>Export Performance Report (#102)</button>
              <button className={styles.exportBtn} onClick={() => {
                const exec = `Executive Summary\n${'='.repeat(40)}\n\nContent health: ${pieces.length > 10 ? 'Strong' : 'Building'}\nTop performing type: ${pieces.length ? (() => { const f: Record<string, number> = {}; pieces.forEach(p => f[p.type] = (f[p.type] || 0) + 1); return Object.entries(f).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' })() : 'N/A'}\nGrowth trend: Positive\n\nGenerated: ${new Date().toLocaleDateString()}`
                const blob = new Blob([exec], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'executive-summary.txt'; a.click()
                addToast('Summary exported', 'success')
              }}>Executive Summary (#110)</button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

// Sub-component forms
function TestForm({ onAdd, onCancel }: { onAdd: (t: Omit<ABTest, 'id' | 'status' | 'createdAt'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [variantA, setVariantA] = useState(''); const [variantB, setVariantB] = useState('')
  const [type, setType] = useState('caption'); const [notes, setNotes] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Test name" />
      <select className={styles.select} value={type} onChange={e => setType(e.target.value)}><option value="caption">Caption</option><option value="hook">Hook</option><option value="thumbnail">Thumbnail</option><option value="time">Posting Time</option><option value="format">Format</option></select>
      <input className={styles.input} value={variantA} onChange={e => setVariantA(e.target.value)} placeholder="Variant A" />
      <input className={styles.input} value={variantB} onChange={e => setVariantB(e.target.value)} placeholder="Variant B" />
      <input className={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" />
      <button className={styles.primaryBtn} onClick={() => { if (name && variantA && variantB) onAdd({ name, variantA, variantB, type, winner: '', notes }) }}>Create Test</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function IdeaForm({ onAdd, onCancel }: { onAdd: (i: Omit<Idea, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(''); const [notes, setNotes] = useState(''); const [score, setScore] = useState(5)
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Idea title" />
      <textarea className={styles.textarea} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes..." />
      <div className={styles.fieldRow}><label>Priority: {score}/10</label><input type="range" min={1} max={10} value={score} onChange={e => setScore(Number(e.target.value))} className={styles.range} /></div>
      <button className={styles.primaryBtn} onClick={() => { if (title) onAdd({ title, notes, score, status: 'new' }) }}>Add Idea</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}
