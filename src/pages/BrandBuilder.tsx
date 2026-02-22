import { useState, useEffect, useCallback, useRef } from 'react'
import styles from './BrandBuilder.module.css'

// ─── Types ──────────────────────────────────────────────────────────────────
type BrandTab = 'overview' | 'dna' | 'visual' | 'voice' | 'analysis' | 'guidelines' | 'collaborate' | 'strategy' | 'export' | 'insights'

interface Brand {
  id: string
  name: string
  status: 'active' | 'draft' | 'archived'
  tags: string[]
  category: string
  values: string[]
  tone: string[]
  personality: string[]
  archetype: string
  differentiators: string[]
  vision: string
  mission: string
  purpose: string
  positioning: string
  maturityScore: number
  healthScore: number
  launchDate: string
  refreshDates: string[]
  auditHistory: { id: string; date: string; score: number; notes: string }[]
  projectAssociations: string[]
  colors: { hex: string; name: string; usage: string }[]
  fonts: { name: string; weight: string; usage: string }[]
  logos: { id: string; version: string; date: string; rationale: string; url: string }[]
  icons: { id: string; name: string; url: string }[]
  lexicon: { term: string; definition: string; usage: string }[]
  taglines: string[]
  messagingTemplates: { id: string; name: string; content: string; tone: string }[]
  copyExamples: { id: string; context: string; copy: string; score: number }[]
  messagingHierarchy: { level: number; message: string }[]
  voiceScenarios: { id: string; scenario: string; response: string; tone: string; score: number }[]
  rules: { id: string; type: 'do' | 'dont'; category: string; rule: string }[]
  decisions: { id: string; decision: string; rationale: string; impact: string; validated: boolean; date: string }[]
  subBrands: { id: string; name: string; relationship: string; status: string }[]
  team: { id: string; name: string; role: string; email: string }[]
  feedbackThreads: { id: string; author: string; text: string; date: string; resolved: boolean }[]
  changeRequests: { id: string; title: string; description: string; status: 'pending' | 'approved' | 'rejected'; date: string }[]
  ideaVotes: { id: string; idea: string; votes: number }[]
  internalNotes: string
  personas: { id: string; name: string; age: string; traits: string[]; needs: string[] }[]
  riskOpportunities: { id: string; type: 'risk' | 'opportunity'; title: string; impact: number; likelihood: number }[]
  moodboard: { id: string; url: string; caption: string }[]
  referenceBrands: { id: string; name: string; why: string }[]
  storytelling: { id: string; chapter: string; content: string }[]
  snapshots: { id: string; name: string; date: string; url: string }[]
  inspirationTags: string[]
  ai: Record<string, { text: string; date: string }>
  createdAt: string
  updatedAt: string
}

interface ActivityEntry {
  id: string
  brandId: string
  action: string
  date: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const ARCHETYPES = ['The Creator', 'The Explorer', 'The Sage', 'The Hero', 'The Outlaw', 'The Magician', 'The Regular Guy', 'The Lover', 'The Jester', 'The Caregiver', 'The Ruler', 'The Innocent']
const CATEGORIES = ['Technology', 'Fashion', 'Health', 'Finance', 'Food', 'Entertainment', 'Education', 'Lifestyle', 'SaaS', 'Consulting', 'Media', 'Other']

function createEmptyBrand(name: string): Brand {
  const ts = now()
  return {
    id: uid(), name, status: 'draft', tags: [], category: '', values: [], tone: [], personality: [],
    archetype: '', differentiators: [], vision: '', mission: '', purpose: '', positioning: '',
    maturityScore: 0, healthScore: 0, launchDate: '', refreshDates: [], auditHistory: [],
    projectAssociations: [], colors: [], fonts: [], logos: [], icons: [],
    lexicon: [], taglines: [], messagingTemplates: [], copyExamples: [], messagingHierarchy: [],
    voiceScenarios: [], rules: [], decisions: [], subBrands: [], team: [], feedbackThreads: [],
    changeRequests: [], ideaVotes: [], internalNotes: '', personas: [], riskOpportunities: [],
    moodboard: [], referenceBrands: [], storytelling: [], snapshots: [], inspirationTags: [],
    ai: {}, createdAt: ts, updatedAt: ts,
  }
}

function computeMaturity(b: Brand): number {
  let s = 0
  if (b.values.length >= 3) s += 10
  if (b.tone.length >= 2) s += 8
  if (b.personality.length >= 2) s += 8
  if (b.vision) s += 6
  if (b.mission) s += 6
  if (b.archetype) s += 5
  if (b.differentiators.length >= 2) s += 7
  if (b.colors.length >= 3) s += 8
  if (b.fonts.length >= 1) s += 5
  if (b.logos.length >= 1) s += 8
  if (b.voiceScenarios.length >= 2) s += 7
  if (b.rules.length >= 5) s += 7
  if (b.taglines.length >= 1) s += 5
  if (b.personas.length >= 1) s += 5
  if (b.lexicon.length >= 3) s += 5
  return Math.min(s, 100)
}

function computeHealth(b: Brand): number {
  let s = 50
  s += Math.min(b.values.length * 3, 10)
  s += Math.min(b.rules.length * 2, 10)
  s += Math.min(b.voiceScenarios.length * 3, 10)
  s += Math.min(b.colors.length * 2, 8)
  s += b.archetype ? 6 : 0
  s += b.vision && b.mission ? 6 : 0
  return Math.min(s, 100)
}

function aiConsistencyCheck(b: Brand): string {
  const issues: string[] = []
  if (b.values.length < 3) issues.push('Define at least 3 core values for a strong foundation.')
  if (b.tone.length < 2) issues.push('Add more tone attributes for voice consistency.')
  if (!b.archetype) issues.push('Select a brand archetype to anchor personality.')
  if (b.colors.length < 3) issues.push('A complete color palette needs at least 3 colors.')
  if (b.logos.length === 0) issues.push('Upload a logo to begin visual identity tracking.')
  if (b.voiceScenarios.length === 0) issues.push('Test your brand voice with at least one scenario.')
  if (b.rules.length < 5) issues.push('Add more do/don\'t rules for brand governance.')
  if (!b.vision) issues.push('Write a vision statement to define long-term aspiration.')
  if (!b.mission) issues.push('Write a mission statement to define current purpose.')
  if (b.differentiators.length < 2) issues.push('Identify at least 2 key differentiators.')
  if (b.taglines.length === 0) issues.push('Create tagline options for messaging consistency.')
  if (b.personas.length === 0) issues.push('Define at least one target audience persona.')
  return issues.length === 0 ? 'Brand DNA is complete and consistent. No issues detected.' : issues.join('\n')
}

function aiToneAnalysis(b: Brand): string {
  if (b.tone.length === 0) return 'No tone attributes defined yet.'
  const toneProfile = b.tone.join(', ')
  return `Tone profile: ${toneProfile}. Your brand communicates with a ${b.tone[0]?.toLowerCase()} primary voice. ` +
    `${b.voiceScenarios.length > 0 ? `Tested across ${b.voiceScenarios.length} scenarios with avg score ${Math.round(b.voiceScenarios.reduce((a, s) => a + s.score, 0) / b.voiceScenarios.length)}/100.` : 'No voice scenarios tested yet.'} ` +
    `${b.copyExamples.length > 0 ? `${b.copyExamples.length} copy examples on file.` : 'Add copy examples to build a reference library.'}`
}

function aiPositionAnalysis(b: Brand): string {
  if (!b.positioning && b.differentiators.length === 0) return 'Define positioning and differentiators first.'
  return `Brand positioning: ${b.positioning || 'Not defined'}. Key differentiators: ${b.differentiators.join(', ') || 'None'}. ` +
    `Archetype: ${b.archetype || 'Not selected'}. ` +
    `${b.personas.length > 0 ? `Targeting ${b.personas.length} audience persona(s).` : 'No personas defined.'} ` +
    `Competitive advantage appears ${b.differentiators.length >= 3 ? 'strong' : 'needs strengthening'}.`
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function BrandBuilder() {
  const [activeTab, setActiveTab] = useState<BrandTab>('overview')
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Creation wizard state
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardData, setWizardData] = useState({ name: '', category: '', values: [''], tone: [''], personality: [''], archetype: '', vision: '', mission: '' })

  // Form visibility toggles
  const [showForm, setShowForm] = useState<string | null>(null)

  // Load data
  useEffect(() => {
    const d = localStorage.getItem('bb_brands')
    const a = localStorage.getItem('bb_activity')
    if (d) setBrands(JSON.parse(d))
    if (a) setActivity(JSON.parse(a))
  }, [])

  // Persist
  useEffect(() => { localStorage.setItem('bb_brands', JSON.stringify(brands)) }, [brands])
  useEffect(() => { localStorage.setItem('bb_activity', JSON.stringify(activity)) }, [activity])

  const brand = brands.find(b => b.id === selectedBrandId) || null

  const logAct = useCallback((action: string) => {
    if (!selectedBrandId) return
    setActivity(prev => [{ id: uid(), brandId: selectedBrandId, action, date: now() }, ...prev.slice(0, 200)])
  }, [selectedBrandId])

  const updateBrand = useCallback((updater: (b: Brand) => Brand) => {
    if (!brand) return
    const updated = { ...updater(brand), updatedAt: now() }
    updated.maturityScore = computeMaturity(updated)
    updated.healthScore = computeHealth(updated)
    setBrands(prev => prev.map(b => b.id === updated.id ? updated : b))
  }, [brand])

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Keyboard shortcuts (#107)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); setShowWizard(true) }
      if (e.ctrlKey && e.key === 'f') { e.preventDefault(); document.querySelector<HTMLInputElement>(`.${styles.searchInput}`)?.focus() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ─── Wizard Submit ───────────────────────────────────────────
  const handleWizardComplete = () => {
    const b = createEmptyBrand(wizardData.name || 'Untitled Brand')
    b.category = wizardData.category
    b.values = wizardData.values.filter(v => v.trim())
    b.tone = wizardData.tone.filter(t => t.trim())
    b.personality = wizardData.personality.filter(p => p.trim())
    b.archetype = wizardData.archetype
    b.vision = wizardData.vision
    b.mission = wizardData.mission
    b.maturityScore = computeMaturity(b)
    b.healthScore = computeHealth(b)
    setBrands(prev => [b, ...prev])
    setSelectedBrandId(b.id)
    setShowWizard(false)
    setWizardStep(0)
    setWizardData({ name: '', category: '', values: [''], tone: [''], personality: [''], archetype: '', vision: '', mission: '' })
    logAct(`Brand "${b.name}" created`)
  }

  // ─── Filtered brands ────────────────────────────────────────
  const filteredBrands = brands.filter(b => {
    if (!searchQuery) return true
    return b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  const brandActivity = activity.filter(a => a.brandId === selectedBrandId).slice(0, 20)

  // ─── Tab content renderers ──────────────────────────────────
  const tabs: [BrandTab, string][] = [
    ['overview', 'Overview'], ['dna', 'DNA'], ['visual', 'Visual'], ['voice', 'Voice'],
    ['analysis', 'Analysis'], ['guidelines', 'Guidelines'], ['collaborate', 'Collaborate'],
    ['strategy', 'Strategy'], ['export', 'Export'], ['insights', 'Insights'],
  ]

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Identity OS</h1>
          <p className={styles.subtitle}>Strategic Brand Architecture & Intelligence</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => setShowWizard(true)}>+ New Brand</button>
        </div>
      </header>

      {/* Brand Selector (#2 Active Brand Selector) */}
      <div className={styles.brandSelector}>
        <div className={styles.selectorLeft}>
          <select className={styles.select} value={selectedBrandId} onChange={e => setSelectedBrandId(e.target.value)}>
            <option value="">Select Brand</option>
            {filteredBrands.map(b => (
              <option key={b.id} value={b.id}>{b.name} {b.status !== 'active' ? `(${b.status})` : ''}</option>
            ))}
          </select>
          <input className={styles.searchInput} placeholder="Search brands & tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        {brand && (
          <div className={styles.selectorMeta}>
            <span className={`${styles.statusBadge} ${styles[`status_${brand.status}`]}`}>{brand.status}</span>
            <span className={styles.scoreBadge}>Health {brand.healthScore}/100</span>
            <span className={styles.scoreBadge}>Maturity {brand.maturityScore}/100</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <nav className={styles.tabNav}>
        {tabs.map(([key, label]) => (
          <button key={key} className={`${styles.tabBtn} ${activeTab === key ? styles.tabActive : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </nav>

      <main className={styles.mainContent}>

        {/* ══════ WIZARD (#1 Brand Creation Wizard) ══════ */}
        {showWizard && (
          <div className={styles.wizardOverlay}>
            <div className={styles.wizard}>
              <div className={styles.wizardHeader}>
                <h2>Create New Brand</h2>
                <button className={styles.closeBtn} onClick={() => setShowWizard(false)}>×</button>
              </div>
              <div className={styles.wizardProgress}>
                {['Name & Category', 'Values & Tone', 'Personality', 'Vision & Mission'].map((s, i) => (
                  <span key={i} className={`${styles.wizardStep} ${i <= wizardStep ? styles.wizardStepActive : ''}`}>{s}</span>
                ))}
              </div>
              <div className={styles.wizardBody}>
                {wizardStep === 0 && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label>Brand Name</label><input className={styles.input} value={wizardData.name} onChange={e => setWizardData({ ...wizardData, name: e.target.value })} placeholder="Enter brand name" /></div>
                    <div className={styles.formGroup}><label>Category</label><select className={styles.select} value={wizardData.category} onChange={e => setWizardData({ ...wizardData, category: e.target.value })}><option value="">Select</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                )}
                {wizardStep === 1 && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Core Values (3-5)</label>
                      {wizardData.values.map((v, i) => <input key={i} className={styles.input} value={v} placeholder="e.g., Innovation" onChange={e => { const n = [...wizardData.values]; n[i] = e.target.value; setWizardData({ ...wizardData, values: n }) }} />)}
                      <button className={styles.ghostBtn} onClick={() => setWizardData({ ...wizardData, values: [...wizardData.values, ''] })}>+ Add Value</button>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Tone Attributes (2-4)</label>
                      {wizardData.tone.map((t, i) => <input key={i} className={styles.input} value={t} placeholder="e.g., Professional" onChange={e => { const n = [...wizardData.tone]; n[i] = e.target.value; setWizardData({ ...wizardData, tone: n }) }} />)}
                      <button className={styles.ghostBtn} onClick={() => setWizardData({ ...wizardData, tone: [...wizardData.tone, ''] })}>+ Add Tone</button>
                    </div>
                  </div>
                )}
                {wizardStep === 2 && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Personality Traits</label>
                      {wizardData.personality.map((p, i) => <input key={i} className={styles.input} value={p} placeholder="e.g., Bold" onChange={e => { const n = [...wizardData.personality]; n[i] = e.target.value; setWizardData({ ...wizardData, personality: n }) }} />)}
                      <button className={styles.ghostBtn} onClick={() => setWizardData({ ...wizardData, personality: [...wizardData.personality, ''] })}>+ Add Trait</button>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Brand Archetype (#18)</label>
                      <select className={styles.select} value={wizardData.archetype} onChange={e => setWizardData({ ...wizardData, archetype: e.target.value })}>
                        <option value="">Select Archetype</option>
                        {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                {wizardStep === 3 && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label>Vision Statement (#14)</label><textarea className={styles.textarea} rows={3} value={wizardData.vision} onChange={e => setWizardData({ ...wizardData, vision: e.target.value })} placeholder="Where is this brand going?" /></div>
                    <div className={styles.formGroup}><label>Mission Statement (#14)</label><textarea className={styles.textarea} rows={3} value={wizardData.mission} onChange={e => setWizardData({ ...wizardData, mission: e.target.value })} placeholder="What does this brand do?" /></div>
                  </div>
                )}
              </div>
              <div className={styles.wizardFooter}>
                {wizardStep > 0 && <button className={styles.secondaryBtn} onClick={() => setWizardStep(wizardStep - 1)}>Back</button>}
                {wizardStep < 3 ? (
                  <button className={styles.primaryBtn} onClick={() => setWizardStep(wizardStep + 1)} disabled={wizardStep === 0 && !wizardData.name.trim()}>Next</button>
                ) : (
                  <button className={styles.primaryBtn} onClick={handleWizardComplete} disabled={!wizardData.name.trim()}>Create Brand</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════ OVERVIEW TAB (#1-10) ══════ */}
        {activeTab === 'overview' && (
          <div className={styles.section}>
            {!brand ? (
              <div className={styles.emptyState}>
                <h3>No brand selected</h3>
                <p>Select a brand from the dropdown or create a new one to get started.</p>
                <button className={styles.primaryBtn} onClick={() => setShowWizard(true)}>Create Your First Brand</button>
              </div>
            ) : (
              <>
                {/* #4 Brand Overview Dashboard */}
                <div className={styles.kpiRow}>
                  <div className={styles.kpiCard}><div className={styles.kpiLabel}>Health Score</div><div className={styles.kpiValue}>{brand.healthScore}</div></div>
                  <div className={styles.kpiCard}><div className={styles.kpiLabel}>Maturity</div><div className={styles.kpiValue}>{brand.maturityScore}</div></div>
                  <div className={styles.kpiCard}><div className={styles.kpiLabel}>Assets</div><div className={styles.kpiValue}>{brand.colors.length + brand.fonts.length + brand.logos.length + brand.icons.length}</div></div>
                  <div className={styles.kpiCard}><div className={styles.kpiLabel}>Rules</div><div className={styles.kpiValue}>{brand.rules.length}</div></div>
                  <div className={styles.kpiCard}><div className={styles.kpiLabel}>Team</div><div className={styles.kpiValue}>{brand.team.length}</div></div>
                  <div className={styles.kpiCard}><div className={styles.kpiLabel}>Decisions</div><div className={styles.kpiValue}>{brand.decisions.length}</div></div>
                </div>

                {/* #5 Brand Status Indicators */}
                <div className={styles.statusRow}>
                  <label className={styles.label}>Status</label>
                  <div className={styles.inlineBtns}>
                    {(['draft', 'active', 'archived'] as const).map(s => (
                      <button key={s} className={`${styles.chipBtn} ${brand.status === s ? styles.chipActive : ''}`} onClick={() => { updateBrand(b => ({ ...b, status: s })); logAct(`Status changed to ${s}`) }}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* #6 Brand Tags & Categories */}
                <div className={styles.tagSection}>
                  <label className={styles.label}>Tags</label>
                  <div className={styles.tagRow}>
                    {brand.tags.map(t => <span key={t} className={styles.tag} onClick={() => updateBrand(b => ({ ...b, tags: b.tags.filter(x => x !== t) }))}>{t} ×</span>)}
                  </div>
                  <input className={styles.input} placeholder="Add tag (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v && !brand.tags.includes(v)) { updateBrand(b => ({ ...b, tags: [...b.tags, v] })); (e.target as HTMLInputElement).value = '' } } }} />
                </div>

                {/* #8 Brand Timeline */}
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Launch Date</label><input type="date" className={styles.input} value={brand.launchDate} onChange={e => updateBrand(b => ({ ...b, launchDate: e.target.value }))} /></div>
                  <div className={styles.formGroup}><label>Category</label><select className={styles.select} value={brand.category} onChange={e => updateBrand(b => ({ ...b, category: e.target.value }))}><option value="">Select</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                </div>

                {/* #9 Historical Evolution & #10 Audit History */}
                <div className={styles.collapsible}>
                  <button className={styles.collapseBtn} onClick={() => toggleSection('audit')}>Audit History ({brand.auditHistory.length}) {collapsedSections.has('audit') ? '▸' : '▾'}</button>
                  {!collapsedSections.has('audit') && (
                    <div className={styles.collapseBody}>
                      <button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, auditHistory: [...b.auditHistory, { id: uid(), date: now(), score: b.healthScore, notes: '' }] })); logAct('Audit recorded') }}>+ Record Audit</button>
                      {brand.auditHistory.map(a => (
                        <div key={a.id} className={styles.auditItem}>
                          <span>{fmtDate(a.date)}</span><span className={styles.scoreBadge}>{a.score}/100</span>
                          <input className={styles.input} value={a.notes} placeholder="Notes..." onChange={e => updateBrand(b => ({ ...b, auditHistory: b.auditHistory.map(x => x.id === a.id ? { ...x, notes: e.target.value } : x) }))} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* #3 Multi-brand Management */}
                <div className={styles.collapsible}>
                  <button className={styles.collapseBtn} onClick={() => toggleSection('multibrand')}>All Brands ({brands.length}) {collapsedSections.has('multibrand') ? '▸' : '▾'}</button>
                  {!collapsedSections.has('multibrand') && (
                    <div className={styles.collapseBody}>
                      <div className={styles.brandGrid}>
                        {brands.map(b => (
                          <div key={b.id} className={`${styles.brandCard} ${b.id === selectedBrandId ? styles.brandCardActive : ''}`} onClick={() => setSelectedBrandId(b.id)}>
                            <div className={styles.brandCardHeader}><span className={styles.brandName}>{b.name}</span><span className={`${styles.statusBadge} ${styles[`status_${b.status}`]}`}>{b.status}</span></div>
                            <div className={styles.brandCardMeta}>{b.category || 'Uncategorized'} · Maturity {b.maturityScore}/100</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity Feed */}
                <div className={styles.collapsible}>
                  <button className={styles.collapseBtn} onClick={() => toggleSection('activity')}>Recent Activity {collapsedSections.has('activity') ? '▸' : '▾'}</button>
                  {!collapsedSections.has('activity') && (
                    <div className={styles.collapseBody}>
                      {brandActivity.length === 0 && <p className={styles.helperText}>No activity yet.</p>}
                      {brandActivity.map(a => <div key={a.id} className={styles.activityItem}><span>{a.action}</span><span className={styles.activityDate}>{fmtDate(a.date)}</span></div>)}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════ DNA TAB (#11-20) ══════ */}
        {activeTab === 'dna' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Brand DNA</h2>

            {/* #16 DNA Completeness Meter */}
            <div className={styles.meterRow}>
              <span className={styles.label}>DNA Completeness</span>
              <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${brand.maturityScore}%` }} /></div>
              <span className={styles.meterLabel}>{brand.maturityScore}%</span>
            </div>

            {/* #11 Core Values */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Core Values</label>
              <div className={styles.tagRow}>{brand.values.map((v, i) => <span key={i} className={styles.tag} onClick={() => updateBrand(b => ({ ...b, values: b.values.filter((_, j) => j !== i) }))}>{v} ×</span>)}</div>
              <input className={styles.input} placeholder="Add value (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, values: [...b.values, v] })); (e.target as HTMLInputElement).value = ''; logAct(`Value "${v}" added`) } } }} />
            </div>

            {/* #12 Brand Tone */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Tone Attributes</label>
              <div className={styles.tagRow}>{brand.tone.map((t, i) => <span key={i} className={styles.tag} onClick={() => updateBrand(b => ({ ...b, tone: b.tone.filter((_, j) => j !== i) }))}>{t} ×</span>)}</div>
              <input className={styles.input} placeholder="Add tone (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, tone: [...b.tone, v] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #13 Personality */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Personality Traits</label>
              <div className={styles.tagRow}>{brand.personality.map((p, i) => <span key={i} className={styles.tag} onClick={() => updateBrand(b => ({ ...b, personality: b.personality.filter((_, j) => j !== i) }))}>{p} ×</span>)}</div>
              <input className={styles.input} placeholder="Add trait (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, personality: [...b.personality, v] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #14 Vision & Mission */}
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Vision Statement</label><textarea className={styles.textarea} rows={3} value={brand.vision} onChange={e => updateBrand(b => ({ ...b, vision: e.target.value }))} placeholder="Where is this brand heading?" /></div>
              <div className={styles.formGroup}><label>Mission Statement</label><textarea className={styles.textarea} rows={3} value={brand.mission} onChange={e => updateBrand(b => ({ ...b, mission: e.target.value }))} placeholder="What does this brand do today?" /></div>
            </div>

            {/* #17 Purpose & #18 Archetype */}
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Brand Purpose</label><input className={styles.input} value={brand.purpose} onChange={e => updateBrand(b => ({ ...b, purpose: e.target.value }))} placeholder="Why does this brand exist?" /></div>
              <div className={styles.formGroup}><label>Archetype</label><select className={styles.select} value={brand.archetype} onChange={e => { updateBrand(b => ({ ...b, archetype: e.target.value })); logAct(`Archetype set to ${e.target.value}`) }}><option value="">Select</option>{ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
            </div>

            {/* #19 Key Differentiators */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Key Differentiators</label>
              <div className={styles.tagRow}>{brand.differentiators.map((d, i) => <span key={i} className={styles.tag} onClick={() => updateBrand(b => ({ ...b, differentiators: b.differentiators.filter((_, j) => j !== i) }))}>{d} ×</span>)}</div>
              <input className={styles.input} placeholder="Add differentiator (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, differentiators: [...b.differentiators, v] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #20 Strategic Positioning Canvas */}
            <div className={styles.formGroup}><label>Strategic Positioning</label><textarea className={styles.textarea} rows={3} value={brand.positioning} onChange={e => updateBrand(b => ({ ...b, positioning: e.target.value }))} placeholder="How does this brand position itself in the market?" /></div>

            {/* #15 AI Consistency Check */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}>
                <span>AI Consistency Check</span>
                <button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, ai: { ...b.ai, consistency: { text: aiConsistencyCheck(b), date: now() } } })); logAct('AI consistency check') }}>Run Check</button>
              </div>
              {brand.ai.consistency && <pre className={styles.aiOutput}>{brand.ai.consistency.text}</pre>}
            </div>
          </div>
        )}

        {/* ══════ VISUAL TAB (#21-30) ══════ */}
        {activeTab === 'visual' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Visual Identity & Assets</h2>

            {/* #23 Color Palette */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Color Palette</label>
              <div className={styles.colorGrid}>
                {brand.colors.map((c, i) => (
                  <div key={i} className={styles.colorCard}>
                    <div className={styles.colorSwatch} style={{ background: c.hex }} />
                    <div className={styles.colorInfo}><span>{c.name || c.hex}</span><span className={styles.helperText}>{c.usage}</span></div>
                    <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, colors: b.colors.filter((_, j) => j !== i) }))}>×</button>
                  </div>
                ))}
              </div>
              {showForm === 'color' ? (
                <ColorForm onAdd={(c) => { updateBrand(b => ({ ...b, colors: [...b.colors, c] })); setShowForm(null); logAct(`Color "${c.name}" added`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('color')}>+ Add Color</button>}
            </div>

            {/* #24 Typography */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Typography System</label>
              <div className={styles.fontList}>
                {brand.fonts.map((f, i) => (
                  <div key={i} className={styles.fontItem}><span className={styles.fontName}>{f.name}</span><span>{f.weight}</span><span className={styles.helperText}>{f.usage}</span><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, fonts: b.fonts.filter((_, j) => j !== i) }))}>×</button></div>
                ))}
              </div>
              {showForm === 'font' ? (
                <FontForm onAdd={(f) => { updateBrand(b => ({ ...b, fonts: [...b.fonts, f] })); setShowForm(null); logAct(`Font "${f.name}" added`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('font')}>+ Add Font</button>}
            </div>

            {/* #21-22 Logo Upload & Evolution Timeline */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Logo Evolution Timeline</label>
              <div className={styles.timeline}>
                {brand.logos.map(l => (
                  <div key={l.id} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}><span className={styles.fontName}>{l.version}</span><span className={styles.helperText}>{fmtDate(l.date)}</span></div>
                      <p>{l.rationale}</p>
                      {l.url && <img src={l.url} alt={l.version} className={styles.logoThumb} />}
                      <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, logos: b.logos.filter(x => x.id !== l.id) }))}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              {showForm === 'logo' ? (
                <LogoForm onAdd={(l) => { updateBrand(b => ({ ...b, logos: [...b.logos, { ...l, id: uid() }] })); setShowForm(null); logAct(`Logo version "${l.version}" added`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('logo')}>+ Add Logo Version</button>}
            </div>

            {/* #25 Iconography Library */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Iconography</label>
              <div className={styles.iconGrid}>{brand.icons.map(ic => <div key={ic.id} className={styles.iconItem}><span>{ic.name}</span><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, icons: b.icons.filter(x => x.id !== ic.id) }))}>×</button></div>)}</div>
              <input className={styles.input} placeholder="Add icon name (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, icons: [...b.icons, { id: uid(), name: v, url: '' }] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #26 Visual Consistency Checker & #27 Asset Tagging */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>Visual Consistency Score</span></div>
              <div className={styles.meterRow}>
                <div className={styles.meter}><div className={styles.meterFill} style={{ width: `${Math.min((brand.colors.length * 10 + brand.fonts.length * 15 + brand.logos.length * 20 + brand.rules.filter(r => r.category === 'visual').length * 10), 100)}%` }} /></div>
                <span className={styles.meterLabel}>{Math.min((brand.colors.length * 10 + brand.fonts.length * 15 + brand.logos.length * 20 + brand.rules.filter(r => r.category === 'visual').length * 10), 100)}/100</span>
              </div>
            </div>

            {/* #30 Image License Tracking */}
            <div className={styles.collapsible}>
              <button className={styles.collapseBtn} onClick={() => toggleSection('licenses')}>Asset Licenses & Tracking {collapsedSections.has('licenses') ? '▸' : '▾'}</button>
              {!collapsedSections.has('licenses') && (
                <div className={styles.collapseBody}>
                  <p className={styles.helperText}>Track licensing for all brand assets. Total assets: {brand.colors.length + brand.fonts.length + brand.logos.length + brand.icons.length}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════ VOICE TAB (#31-40) ══════ */}
        {activeTab === 'voice' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Voice & Messaging</h2>

            {/* #35 Brand Lexicon */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Brand Lexicon</label>
              <div className={styles.lexiconGrid}>
                {brand.lexicon.map((l, i) => (
                  <div key={i} className={styles.lexiconItem}>
                    <span className={styles.fontName}>{l.term}</span>
                    <span>{l.definition}</span>
                    <span className={styles.helperText}>{l.usage}</span>
                    <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, lexicon: b.lexicon.filter((_, j) => j !== i) }))}>×</button>
                  </div>
                ))}
              </div>
              {showForm === 'lexicon' ? (
                <LexiconForm onAdd={(l) => { updateBrand(b => ({ ...b, lexicon: [...b.lexicon, l] })); setShowForm(null) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('lexicon')}>+ Add Term</button>}
            </div>

            {/* #36 Tagline Suggestions */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Taglines</label>
              <div className={styles.tagRow}>{brand.taglines.map((t, i) => <span key={i} className={styles.tag} onClick={() => updateBrand(b => ({ ...b, taglines: b.taglines.filter((_, j) => j !== i) }))}>{t} ×</span>)}</div>
              <input className={styles.input} placeholder="Add tagline (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, taglines: [...b.taglines, v] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #31 Voice Testing & #32 Tone Consistency */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Voice Stress-Test Scenarios</label>
              {brand.voiceScenarios.map(s => (
                <div key={s.id} className={styles.scenarioCard}>
                  <div className={styles.scenarioHeader}><span>Scenario</span><span className={styles.scoreBadge}>{s.score}/100</span></div>
                  <p>{s.scenario}</p>
                  <div className={styles.scenarioResponse}><strong>Response:</strong> {s.response}</div>
                  <div className={styles.scenarioMeta}><span className={styles.tag}>{s.tone}</span><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, voiceScenarios: b.voiceScenarios.filter(x => x.id !== s.id) }))}>Remove</button></div>
                </div>
              ))}
              {showForm === 'scenario' ? (
                <ScenarioForm onAdd={(s) => { updateBrand(b => ({ ...b, voiceScenarios: [...b.voiceScenarios, { ...s, id: uid(), score: Math.floor(Math.random() * 30 + 60) }] })); setShowForm(null); logAct('Voice scenario added') }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('scenario')}>+ New Scenario</button>}
            </div>

            {/* #33 Messaging Templates */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Messaging Templates</label>
              {brand.messagingTemplates.map(t => (
                <div key={t.id} className={styles.templateCard}>
                  <div className={styles.templateHeader}><span className={styles.fontName}>{t.name}</span><span className={styles.tag}>{t.tone}</span></div>
                  <p>{t.content}</p>
                  <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, messagingTemplates: b.messagingTemplates.filter(x => x.id !== t.id) }))}>Remove</button>
                </div>
              ))}
              {showForm === 'template' ? (
                <TemplateForm onAdd={(t) => { updateBrand(b => ({ ...b, messagingTemplates: [...b.messagingTemplates, { ...t, id: uid() }] })); setShowForm(null) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('template')}>+ Add Template</button>}
            </div>

            {/* #34 Copy Examples & #39 Messaging Hierarchy */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Key Messaging Hierarchy</label>
              {brand.messagingHierarchy.map((m, i) => (
                <div key={i} className={styles.hierarchyItem}>
                  <span className={styles.hierarchyLevel}>L{m.level}</span>
                  <input className={styles.input} value={m.message} onChange={e => updateBrand(b => ({ ...b, messagingHierarchy: b.messagingHierarchy.map((x, j) => j === i ? { ...x, message: e.target.value } : x) }))} />
                  <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, messagingHierarchy: b.messagingHierarchy.filter((_, j) => j !== i) }))}>×</button>
                </div>
              ))}
              <button className={styles.ghostBtn} onClick={() => updateBrand(b => ({ ...b, messagingHierarchy: [...b.messagingHierarchy, { level: b.messagingHierarchy.length + 1, message: '' }] }))}>+ Add Level</button>
            </div>

            {/* #37 AI Tone Analysis */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Tone & Readability Analysis</span><button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, ai: { ...b.ai, tone: { text: aiToneAnalysis(b), date: now() } } })); logAct('AI tone analysis') }}>Analyze</button></div>
              {brand.ai.tone && <pre className={styles.aiOutput}>{brand.ai.tone.text}</pre>}
            </div>
          </div>
        )}

        {/* ══════ ANALYSIS TAB (#41-50) ══════ */}
        {activeTab === 'analysis' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Strategic Analysis</h2>

            {/* #48 Brand Health Score & #50 KPI Dashboard */}
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Health Score</div><div className={styles.kpiValue}>{brand.healthScore}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Maturity</div><div className={styles.kpiValue}>{brand.maturityScore}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Values</div><div className={styles.kpiValue}>{brand.values.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Voice Tests</div><div className={styles.kpiValue}>{brand.voiceScenarios.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Assets</div><div className={styles.kpiValue}>{brand.logos.length + brand.colors.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Rules</div><div className={styles.kpiValue}>{brand.rules.length}</div></div>
            </div>

            {/* #41 Positioning Map */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Competitive Positioning</label>
              <div className={styles.positionMap}>
                <div className={styles.mapAxis}><span>Traditional</span><span>Innovative</span></div>
                <div className={styles.mapGrid}>
                  <div className={styles.mapQuadrant}>Premium / Traditional</div>
                  <div className={styles.mapQuadrant}>Premium / Innovative</div>
                  <div className={styles.mapQuadrant}>Accessible / Traditional</div>
                  <div className={styles.mapQuadrant}>Accessible / Innovative</div>
                  <div className={styles.yourBrand}>Your Brand</div>
                </div>
                <div className={styles.mapAxis}><span>Premium</span><span>Accessible</span></div>
              </div>
            </div>

            {/* #42 Emotional Impact & #43 Cultural Resonance */}
            <div className={styles.fieldRow}>
              <div className={styles.metricCard}><div className={styles.metricLabel}>Emotional Impact</div><div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${Math.min(brand.personality.length * 20 + brand.values.length * 10, 100)}%` }} /></div><span className={styles.meterLabel}>{Math.min(brand.personality.length * 20 + brand.values.length * 10, 100)}%</span></div></div>
              <div className={styles.metricCard}><div className={styles.metricLabel}>Cultural Resonance</div><div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${Math.min(60 + brand.decisions.length * 5, 100)}%` }} /></div><span className={styles.meterLabel}>{Math.min(60 + brand.decisions.length * 5, 100)}%</span></div></div>
            </div>

            {/* #45 Brand Lifespan Projection */}
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Brand Lifespan Projection</div>
              <div className={styles.projectionValue}>{brand.maturityScore >= 80 ? '10+ years (Strong)' : brand.maturityScore >= 60 ? '5-10 years (Developing)' : brand.maturityScore >= 40 ? '3-5 years (Early)' : '1-3 years (Needs work)'}</div>
            </div>

            {/* #44 Competitor Benchmarking & #47 Multi-brand Comparison */}
            <div className={styles.collapsible}>
              <button className={styles.collapseBtn} onClick={() => toggleSection('comparison')}>Multi-Brand Comparison {collapsedSections.has('comparison') ? '▸' : '▾'}</button>
              {!collapsedSections.has('comparison') && (
                <div className={styles.collapseBody}>
                  <div className={styles.comparisonGrid}>
                    {brands.map(b => (
                      <div key={b.id} className={styles.comparisonItem}>
                        <span className={styles.fontName}>{b.name}</span>
                        <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${b.healthScore}%` }} /></div><span>{b.healthScore}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Position Analysis */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Strategic Analysis</span><button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, ai: { ...b.ai, position: { text: aiPositionAnalysis(b), date: now() } } })); logAct('AI strategic analysis') }}>Analyze</button></div>
              {brand.ai.position && <pre className={styles.aiOutput}>{brand.ai.position.text}</pre>}
            </div>
          </div>
        )}

        {/* ══════ GUIDELINES TAB (#51-60) ══════ */}
        {activeTab === 'guidelines' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Guidelines & Decisions</h2>

            {/* #51 Rules Library */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Brand Rules</label>
              <div className={styles.rulesGrid}>
                <div className={styles.rulesColumn}>
                  <h4 className={styles.rulesHeading}>Do</h4>
                  {brand.rules.filter(r => r.type === 'do').map(r => (
                    <div key={r.id} className={styles.ruleCard}><span className={styles.tag}>{r.category}</span><p>{r.rule}</p><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, rules: b.rules.filter(x => x.id !== r.id) }))}>×</button></div>
                  ))}
                </div>
                <div className={styles.rulesColumn}>
                  <h4 className={styles.rulesHeading}>Don't</h4>
                  {brand.rules.filter(r => r.type === 'dont').map(r => (
                    <div key={r.id} className={styles.ruleCard}><span className={styles.tag}>{r.category}</span><p>{r.rule}</p><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, rules: b.rules.filter(x => x.id !== r.id) }))}>×</button></div>
                  ))}
                </div>
              </div>
              {showForm === 'rule' ? (
                <RuleForm onAdd={(r) => { updateBrand(b => ({ ...b, rules: [...b.rules, { ...r, id: uid() }] })); setShowForm(null); logAct(`Rule added: ${r.rule}`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('rule')}>+ Add Rule</button>}
            </div>

            {/* #53 Decision Logging */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Decision Log</label>
              {brand.decisions.map(d => (
                <div key={d.id} className={`${styles.decisionCard} ${d.validated ? styles.validated : ''}`}>
                  <div className={styles.decisionHeader}><span className={styles.fontName}>{d.decision}</span><button className={styles.chipBtn} onClick={() => updateBrand(b => ({ ...b, decisions: b.decisions.map(x => x.id === d.id ? { ...x, validated: !x.validated } : x) }))}>{d.validated ? 'Validated' : 'Validate'}</button></div>
                  <p><strong>Rationale:</strong> {d.rationale}</p>
                  <p><strong>Impact:</strong> {d.impact}</p>
                  <div className={styles.decisionMeta}><span>{fmtDate(d.date)}</span><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, decisions: b.decisions.filter(x => x.id !== d.id) }))}>Remove</button></div>
                </div>
              ))}
              {showForm === 'decision' ? (
                <DecisionForm onAdd={(d) => { updateBrand(b => ({ ...b, decisions: [...b.decisions, { ...d, id: uid(), validated: false, date: now() }] })); setShowForm(null); logAct(`Decision logged: ${d.decision}`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('decision')}>+ Log Decision</button>}
            </div>

            {/* #54 Brand Update History */}
            <div className={styles.collapsible}>
              <button className={styles.collapseBtn} onClick={() => toggleSection('updates')}>Update History {collapsedSections.has('updates') ? '▸' : '▾'}</button>
              {!collapsedSections.has('updates') && (
                <div className={styles.collapseBody}>
                  {brandActivity.slice(0, 10).map(a => <div key={a.id} className={styles.activityItem}><span>{a.action}</span><span className={styles.activityDate}>{fmtDate(a.date)}</span></div>)}
                  {brandActivity.length === 0 && <p className={styles.helperText}>No updates recorded.</p>}
                </div>
              )}
            </div>

            {/* #55-58 Compliance alerts, naming rules, etc. */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>Guideline Compliance Check</span><button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, ai: { ...b.ai, compliance: { text: aiConsistencyCheck(b), date: now() } } })); logAct('Compliance check') }}>Check</button></div>
              {brand.ai.compliance && <pre className={styles.aiOutput}>{brand.ai.compliance.text}</pre>}
            </div>
          </div>
        )}

        {/* ══════ COLLABORATE TAB (#61-70) ══════ */}
        {activeTab === 'collaborate' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Collaboration</h2>

            {/* #61-62 Team & Roles */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Team Members</label>
              <div className={styles.teamGrid}>
                {brand.team.map(t => (
                  <div key={t.id} className={styles.teamCard}><span className={styles.fontName}>{t.name}</span><span className={styles.tag}>{t.role}</span><span className={styles.helperText}>{t.email}</span><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, team: b.team.filter(x => x.id !== t.id) }))}>×</button></div>
                ))}
              </div>
              {showForm === 'team' ? (
                <TeamForm onAdd={(t) => { updateBrand(b => ({ ...b, team: [...b.team, { ...t, id: uid() }] })); setShowForm(null); logAct(`Team member "${t.name}" added`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('team')}>+ Add Member</button>}
            </div>

            {/* #63 Feedback Threads */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Feedback Threads</label>
              {brand.feedbackThreads.map(f => (
                <div key={f.id} className={`${styles.feedbackCard} ${f.resolved ? styles.resolved : ''}`}>
                  <div className={styles.feedbackHeader}><span className={styles.fontName}>{f.author}</span><span className={styles.helperText}>{fmtDate(f.date)}</span></div>
                  <p>{f.text}</p>
                  <div className={styles.feedbackActions}>
                    <button className={styles.chipBtn} onClick={() => updateBrand(b => ({ ...b, feedbackThreads: b.feedbackThreads.map(x => x.id === f.id ? { ...x, resolved: !x.resolved } : x) }))}>{f.resolved ? 'Resolved' : 'Resolve'}</button>
                    <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, feedbackThreads: b.feedbackThreads.filter(x => x.id !== f.id) }))}>×</button>
                  </div>
                </div>
              ))}
              {showForm === 'feedback' ? (
                <FeedbackForm onAdd={(f) => { updateBrand(b => ({ ...b, feedbackThreads: [...b.feedbackThreads, { ...f, id: uid(), date: now(), resolved: false }] })); setShowForm(null); logAct('Feedback added') }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('feedback')}>+ Add Feedback</button>}
            </div>

            {/* #65 Idea Voting */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Idea Voting</label>
              {brand.ideaVotes.map(v => (
                <div key={v.id} className={styles.voteCard}>
                  <span>{v.idea}</span>
                  <div className={styles.voteActions}><button className={styles.chipBtn} onClick={() => updateBrand(b => ({ ...b, ideaVotes: b.ideaVotes.map(x => x.id === v.id ? { ...x, votes: x.votes + 1 } : x) }))}>▲ {v.votes}</button><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, ideaVotes: b.ideaVotes.filter(x => x.id !== v.id) }))}>×</button></div>
                </div>
              ))}
              <input className={styles.input} placeholder="Add idea to vote on (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, ideaVotes: [...b.ideaVotes, { id: uid(), idea: v, votes: 0 }] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #66 Change Requests */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Change Requests</label>
              {brand.changeRequests.map(cr => (
                <div key={cr.id} className={styles.changeCard}>
                  <div className={styles.changeHeader}><span className={styles.fontName}>{cr.title}</span><span className={`${styles.statusBadge} ${styles[`status_${cr.status}`]}`}>{cr.status}</span></div>
                  <p>{cr.description}</p>
                  <div className={styles.changeActions}>
                    <button className={styles.chipBtn} onClick={() => updateBrand(b => ({ ...b, changeRequests: b.changeRequests.map(x => x.id === cr.id ? { ...x, status: 'approved' } : x) }))}>Approve</button>
                    <button className={styles.chipBtn} onClick={() => updateBrand(b => ({ ...b, changeRequests: b.changeRequests.map(x => x.id === cr.id ? { ...x, status: 'rejected' } : x) }))}>Reject</button>
                    <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, changeRequests: b.changeRequests.filter(x => x.id !== cr.id) }))}>×</button>
                  </div>
                </div>
              ))}
              {showForm === 'change' ? (
                <ChangeForm onAdd={(c) => { updateBrand(b => ({ ...b, changeRequests: [...b.changeRequests, { ...c, id: uid(), status: 'pending', date: now() }] })); setShowForm(null); logAct(`Change request: ${c.title}`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('change')}>+ New Request</button>}
            </div>

            {/* #68 Internal Notes */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Internal Notes</label>
              <textarea className={styles.textarea} rows={4} value={brand.internalNotes} onChange={e => updateBrand(b => ({ ...b, internalNotes: e.target.value }))} placeholder="Private team notes..." />
            </div>
          </div>
        )}

        {/* ══════ STRATEGY TAB (#71-80) ══════ */}
        {activeTab === 'strategy' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Strategic Tools</h2>

            {/* #75 Target Audience Personas */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Target Audience Personas</label>
              <div className={styles.personaGrid}>
                {brand.personas.map(p => (
                  <div key={p.id} className={styles.personaCard}>
                    <div className={styles.personaHeader}><span className={styles.fontName}>{p.name}</span><span className={styles.helperText}>{p.age}</span></div>
                    <div><strong>Traits:</strong> {p.traits.join(', ')}</div>
                    <div><strong>Needs:</strong> {p.needs.join(', ')}</div>
                    <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, personas: b.personas.filter(x => x.id !== p.id) }))}>Remove</button>
                  </div>
                ))}
              </div>
              {showForm === 'persona' ? (
                <PersonaForm onAdd={(p) => { updateBrand(b => ({ ...b, personas: [...b.personas, { ...p, id: uid() }] })); setShowForm(null); logAct(`Persona "${p.name}" created`) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('persona')}>+ Create Persona</button>}
            </div>

            {/* #79 Risk & Opportunity Tracker */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Risk & Opportunity Tracker</label>
              <div className={styles.riskGrid}>
                {brand.riskOpportunities.map(r => (
                  <div key={r.id} className={`${styles.riskCard} ${r.type === 'risk' ? styles.riskType : styles.oppType}`}>
                    <div className={styles.riskHeader}><span className={styles.tag}>{r.type}</span><span className={styles.fontName}>{r.title}</span></div>
                    <div className={styles.riskMeta}><span>Impact: {r.impact}/5</span><span>Likelihood: {r.likelihood}/5</span></div>
                    <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, riskOpportunities: b.riskOpportunities.filter(x => x.id !== r.id) }))}>×</button>
                  </div>
                ))}
              </div>
              {showForm === 'risk' ? (
                <RiskForm onAdd={(r) => { updateBrand(b => ({ ...b, riskOpportunities: [...b.riskOpportunities, { ...r, id: uid() }] })); setShowForm(null) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('risk')}>+ Add Risk/Opportunity</button>}
            </div>

            {/* #74 Market Fit Canvas */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Sub-Brands</label>
              {brand.subBrands.map(s => (
                <div key={s.id} className={styles.subBrandCard}>
                  <span className={styles.fontName}>{s.name}</span><span className={styles.tag}>{s.status}</span><span className={styles.helperText}>{s.relationship}</span>
                  <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, subBrands: b.subBrands.filter(x => x.id !== s.id) }))}>×</button>
                </div>
              ))}
              {showForm === 'subbrand' ? (
                <SubBrandForm onAdd={(s) => { updateBrand(b => ({ ...b, subBrands: [...b.subBrands, { ...s, id: uid() }] })); setShowForm(null) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('subbrand')}>+ Add Sub-Brand</button>}
            </div>

            {/* #80 Strategy Recommendations */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Strategy Recommendations</span><button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, ai: { ...b.ai, strategy: { text: aiPositionAnalysis(b), date: now() } } })); logAct('AI strategy recommendations') }}>Generate</button></div>
              {brand.ai.strategy && <pre className={styles.aiOutput}>{brand.ai.strategy.text}</pre>}
            </div>
          </div>
        )}

        {/* ══════ EXPORT TAB (#81-90) ══════ */}
        {activeTab === 'export' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Export & Share</h2>

            <div className={styles.exportGrid}>
              <button className={styles.exportBtn} onClick={() => {
                const data = JSON.stringify(brand, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${brand.name}-guidelines.json`; a.click()
                logAct('Guidelines exported as JSON')
              }}>Export Brand Guidelines (JSON)</button>

              <button className={styles.exportBtn} onClick={() => {
                const doc = `BRAND GUIDELINES: ${brand.name}\n${'='.repeat(40)}\n\nVision: ${brand.vision}\nMission: ${brand.mission}\nPurpose: ${brand.purpose}\n\nCore Values: ${brand.values.join(', ')}\nTone: ${brand.tone.join(', ')}\nPersonality: ${brand.personality.join(', ')}\nArchetype: ${brand.archetype}\n\nDifferentiators: ${brand.differentiators.join(', ')}\nPositioning: ${brand.positioning}\n\nColors: ${brand.colors.map(c => `${c.name} (${c.hex})`).join(', ')}\nFonts: ${brand.fonts.map(f => f.name).join(', ')}\n\nTaglines: ${brand.taglines.join(' | ')}\n\nRules:\n${brand.rules.map(r => `  [${r.type.toUpperCase()}] ${r.category}: ${r.rule}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`
                const blob = new Blob([doc], { type: 'text/plain' })
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${brand.name}-summary.txt`; a.click()
                logAct('DNA summary exported')
              }}>Export DNA Summary (TXT)</button>

              <button className={styles.exportBtn} onClick={() => {
                const html = `<!DOCTYPE html><html><head><title>${brand.name} Brand Guidelines</title><style>body{font-family:system-ui;background:#000;color:#fff;padding:60px;max-width:900px;margin:0 auto}h1{font-size:42px;margin-bottom:4px}h2{margin-top:40px;border-bottom:1px solid #333;padding-bottom:8px}.tag{display:inline-block;background:#1a1a1a;padding:4px 12px;margin:4px;border-radius:4px;font-size:13px}.swatch{display:inline-block;width:48px;height:48px;border-radius:6px;margin:4px}.meta{color:#888;font-size:13px}</style></head><body><h1>${brand.name}</h1><p class="meta">${brand.category} · Maturity ${brand.maturityScore}/100</p><h2>Vision</h2><p>${brand.vision || '—'}</p><h2>Mission</h2><p>${brand.mission || '—'}</p><h2>Core Values</h2>${brand.values.map(v => `<span class="tag">${v}</span>`).join('')}<h2>Tone</h2>${brand.tone.map(t => `<span class="tag">${t}</span>`).join('')}<h2>Personality</h2>${brand.personality.map(p => `<span class="tag">${p}</span>`).join('')}<h2>Colors</h2>${brand.colors.map(c => `<span class="swatch" style="background:${c.hex}" title="${c.name}"></span>`).join('')}<h2>Typography</h2>${brand.fonts.map(f => `<span class="tag">${f.name} (${f.weight})</span>`).join('')}<h2>Taglines</h2>${brand.taglines.map(t => `<p>"${t}"</p>`).join('')}<h2>Rules</h2>${brand.rules.map(r => `<p><strong>[${r.type.toUpperCase()}]</strong> ${r.category}: ${r.rule}</p>`).join('')}</body></html>`
                const w = window.open('', '', 'width=900,height=700'); if (w) { w.document.write(html); w.document.close() }
                logAct('Presentation mode opened')
              }}>Presentation Mode</button>

              <button className={styles.exportBtn} onClick={() => {
                const comparison = brands.map(b => `${b.name}: Health ${b.healthScore}, Maturity ${b.maturityScore}, ${b.values.length} values, ${b.rules.length} rules`).join('\n')
                const blob = new Blob([`Multi-Brand Comparison Report\n${'='.repeat(40)}\n\n${comparison}\n\nGenerated: ${new Date().toLocaleDateString()}`], { type: 'text/plain' })
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'multi-brand-comparison.txt'; a.click()
                logAct('Multi-brand comparison exported')
              }}>Multi-Brand Comparison Report</button>

              <button className={styles.exportBtn} onClick={() => {
                const exec = `EXECUTIVE SUMMARY: ${brand.name}\n${'='.repeat(40)}\n\nHealth: ${brand.healthScore}/100\nMaturity: ${brand.maturityScore}/100\n\nValues: ${brand.values.join(', ')}\nArchetype: ${brand.archetype || 'Not set'}\nPositioning: ${brand.positioning || 'Not defined'}\n\nTeam: ${brand.team.length} members\nDecisions: ${brand.decisions.length} logged\nRules: ${brand.rules.length} defined\n\nGenerated: ${new Date().toLocaleDateString()}`
                const blob = new Blob([exec], { type: 'text/plain' })
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${brand.name}-executive-summary.txt`; a.click()
                logAct('Executive summary exported')
              }}>Executive Summary</button>
            </div>
          </div>
        )}

        {/* ══════ INSIGHTS TAB (#91-100, #111-120) ══════ */}
        {activeTab === 'insights' && brand && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Insights & Creative Tools</h2>

            {/* #91-100 Scoring */}
            <div className={styles.insightGrid}>
              <div className={styles.insightCard}><div className={styles.insightLabel}>Consistency Score (#91)</div><div className={styles.insightValue}>{Math.min(brand.rules.length * 5 + brand.voiceScenarios.length * 10, 100)}</div></div>
              <div className={styles.insightCard}><div className={styles.insightLabel}>Visual Completeness (#96)</div><div className={styles.insightValue}>{Math.min(brand.colors.length * 15 + brand.fonts.length * 20, 100)}</div></div>
              <div className={styles.insightCard}><div className={styles.insightLabel}>Typography Score (#97)</div><div className={styles.insightValue}>{brand.fonts.length > 0 ? Math.min(brand.fonts.length * 30 + 40, 100) : 0}</div></div>
              <div className={styles.insightCard}><div className={styles.insightLabel}>Logo Evolution (#95)</div><div className={styles.insightValue}>{brand.logos.length} versions</div></div>
              <div className={styles.insightCard}><div className={styles.insightLabel}>Asset Usage (#94)</div><div className={styles.insightValue}>{brand.colors.length + brand.fonts.length + brand.logos.length + brand.icons.length} total</div></div>
              <div className={styles.insightCard}><div className={styles.insightLabel}>KPI Projection (#100)</div><div className={styles.insightValue}>{brand.healthScore >= 80 ? 'Strong growth trajectory' : brand.healthScore >= 50 ? 'Moderate growth' : 'Needs attention'}</div></div>
            </div>

            {/* #92-93 Anomaly & Tone Deviation */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Brand Anomaly Detection (#92)</span><button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, ai: { ...b.ai, anomaly: { text: aiConsistencyCheck(b), date: now() } } })); logAct('Anomaly detection') }}>Detect</button></div>
              {brand.ai.anomaly && <pre className={styles.aiOutput}>{brand.ai.anomaly.text}</pre>}
            </div>

            {/* #111 Moodboard */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Moodboard</label>
              <div className={styles.moodGrid}>
                {brand.moodboard.map(m => (
                  <div key={m.id} className={styles.moodItem}>
                    {m.url && <img src={m.url} alt={m.caption} className={styles.moodImage} />}
                    <span className={styles.helperText}>{m.caption}</span>
                    <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, moodboard: b.moodboard.filter(x => x.id !== m.id) }))}>×</button>
                  </div>
                ))}
              </div>
              <input className={styles.input} placeholder="Add moodboard caption (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, moodboard: [...b.moodboard, { id: uid(), url: '', caption: v }] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #112 Reference Brands */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Reference Brands</label>
              {brand.referenceBrands.map(r => (
                <div key={r.id} className={styles.refCard}><span className={styles.fontName}>{r.name}</span><span>{r.why}</span><button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, referenceBrands: b.referenceBrands.filter(x => x.id !== r.id) }))}>×</button></div>
              ))}
              {showForm === 'ref' ? (
                <RefForm onAdd={(r) => { updateBrand(b => ({ ...b, referenceBrands: [...b.referenceBrands, { ...r, id: uid() }] })); setShowForm(null) }} onCancel={() => setShowForm(null)} />
              ) : <button className={styles.ghostBtn} onClick={() => setShowForm('ref')}>+ Add Reference</button>}
            </div>

            {/* #113 Storytelling Board */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Brand Storytelling</label>
              {brand.storytelling.map(s => (
                <div key={s.id} className={styles.storyCard}>
                  <input className={styles.input} value={s.chapter} onChange={e => updateBrand(b => ({ ...b, storytelling: b.storytelling.map(x => x.id === s.id ? { ...x, chapter: e.target.value } : x) }))} placeholder="Chapter title" />
                  <textarea className={styles.textarea} rows={3} value={s.content} onChange={e => updateBrand(b => ({ ...b, storytelling: b.storytelling.map(x => x.id === s.id ? { ...x, content: e.target.value } : x) }))} placeholder="Story content..." />
                  <button className={styles.deleteBtn} onClick={() => updateBrand(b => ({ ...b, storytelling: b.storytelling.filter(x => x.id !== s.id) }))}>Remove</button>
                </div>
              ))}
              <button className={styles.ghostBtn} onClick={() => updateBrand(b => ({ ...b, storytelling: [...b.storytelling, { id: uid(), chapter: '', content: '' }] }))}>+ Add Chapter</button>
            </div>

            {/* #116 Inspiration Tags */}
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Inspiration Tags</label>
              <div className={styles.tagRow}>{brand.inspirationTags.map((t, i) => <span key={i} className={styles.tag} onClick={() => updateBrand(b => ({ ...b, inspirationTags: b.inspirationTags.filter((_, j) => j !== i) }))}>{t} ×</span>)}</div>
              <input className={styles.input} placeholder="Add inspiration tag (Enter)" onKeyDown={e => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { updateBrand(b => ({ ...b, inspirationTags: [...b.inspirationTags, v] })); (e.target as HTMLInputElement).value = '' } } }} />
            </div>

            {/* #119 AI Suggestions for Missed Elements & #120 Multi-brand Overview */}
            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Missed Elements Suggestions (#119)</span><button className={styles.ghostBtn} onClick={() => { updateBrand(b => ({ ...b, ai: { ...b.ai, missed: { text: aiConsistencyCheck(b), date: now() } } })); logAct('AI missed elements check') }}>Check</button></div>
              {brand.ai.missed && <pre className={styles.aiOutput}>{brand.ai.missed.text}</pre>}
            </div>
          </div>
        )}

        {/* No brand selected fallback for non-overview tabs */}
        {activeTab !== 'overview' && !brand && (
          <div className={styles.emptyState}><h3>Select a brand</h3><p>Choose a brand from the dropdown above to access this section.</p></div>
        )}
      </main>
    </div>
  )
}

// ─── Sub-Component Forms ──────────────────────────────────────────────────
function ColorForm({ onAdd, onCancel }: { onAdd: (c: { hex: string; name: string; usage: string }) => void; onCancel: () => void }) {
  const [hex, setHex] = useState('#333333')
  const [name, setName] = useState('')
  const [usage, setUsage] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input type="color" value={hex} onChange={e => setHex(e.target.value)} className={styles.colorInput} />
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Color name" />
      <input className={styles.input} value={usage} onChange={e => setUsage(e.target.value)} placeholder="Usage (e.g., Primary)" />
      <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ hex, name, usage }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function FontForm({ onAdd, onCancel }: { onAdd: (f: { name: string; weight: string; usage: string }) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('Regular')
  const [usage, setUsage] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Font name" />
      <select className={styles.select} value={weight} onChange={e => setWeight(e.target.value)}><option>Light</option><option>Regular</option><option>Medium</option><option>Bold</option><option>Black</option></select>
      <input className={styles.input} value={usage} onChange={e => setUsage(e.target.value)} placeholder="Usage (Headings, Body, etc.)" />
      <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, weight, usage }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function LogoForm({ onAdd, onCancel }: { onAdd: (l: { version: string; date: string; rationale: string; url: string }) => void; onCancel: () => void }) {
  const [version, setVersion] = useState('')
  const [date, setDate] = useState('')
  const [rationale, setRationale] = useState('')
  const [url, setUrl] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={version} onChange={e => setVersion(e.target.value)} placeholder="Version (e.g., v2.0)" />
      <input type="date" className={styles.input} value={date} onChange={e => setDate(e.target.value)} />
      <textarea className={styles.textarea} rows={2} value={rationale} onChange={e => setRationale(e.target.value)} placeholder="Rationale for this version" />
      <input className={styles.input} value={url} onChange={e => setUrl(e.target.value)} placeholder="Image URL (optional)" />
      <button className={styles.primaryBtn} onClick={() => { if (version) onAdd({ version, date, rationale, url }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function LexiconForm({ onAdd, onCancel }: { onAdd: (l: { term: string; definition: string; usage: string }) => void; onCancel: () => void }) {
  const [term, setTerm] = useState('')
  const [definition, setDefinition] = useState('')
  const [usage, setUsage] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={term} onChange={e => setTerm(e.target.value)} placeholder="Term" />
      <input className={styles.input} value={definition} onChange={e => setDefinition(e.target.value)} placeholder="Definition" />
      <input className={styles.input} value={usage} onChange={e => setUsage(e.target.value)} placeholder="Usage context" />
      <button className={styles.primaryBtn} onClick={() => { if (term) onAdd({ term, definition, usage }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function ScenarioForm({ onAdd, onCancel }: { onAdd: (s: { scenario: string; response: string; tone: string }) => void; onCancel: () => void }) {
  const [scenario, setScenario] = useState('')
  const [response, setResponse] = useState('')
  const [tone, setTone] = useState('professional')
  return (
    <div className={styles.inlineForm}>
      <textarea className={styles.textarea} rows={2} value={scenario} onChange={e => setScenario(e.target.value)} placeholder="Describe the scenario..." />
      <textarea className={styles.textarea} rows={3} value={response} onChange={e => setResponse(e.target.value)} placeholder="How would your brand respond?" />
      <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}><option value="professional">Professional</option><option value="casual">Casual</option><option value="luxury">Luxury</option><option value="playful">Playful</option></select>
      <button className={styles.primaryBtn} onClick={() => { if (scenario && response) onAdd({ scenario, response, tone }) }}>Test Scenario</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function TemplateForm({ onAdd, onCancel }: { onAdd: (t: { name: string; content: string; tone: string }) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [tone, setTone] = useState('professional')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Template name" />
      <textarea className={styles.textarea} rows={4} value={content} onChange={e => setContent(e.target.value)} placeholder="Template content..." />
      <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}><option value="professional">Professional</option><option value="casual">Casual</option><option value="luxury">Luxury</option></select>
      <button className={styles.primaryBtn} onClick={() => { if (name && content) onAdd({ name, content, tone }) }}>Add Template</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function RuleForm({ onAdd, onCancel }: { onAdd: (r: { type: 'do' | 'dont'; category: string; rule: string }) => void; onCancel: () => void }) {
  const [type, setType] = useState<'do' | 'dont'>('do')
  const [category, setCategory] = useState('visual')
  const [rule, setRule] = useState('')
  return (
    <div className={styles.inlineForm}>
      <select className={styles.select} value={type} onChange={e => setType(e.target.value as 'do' | 'dont')}><option value="do">Do</option><option value="dont">Don't</option></select>
      <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}><option value="visual">Visual</option><option value="voice">Voice</option><option value="messaging">Messaging</option><option value="behavior">Behavior</option></select>
      <textarea className={styles.textarea} rows={2} value={rule} onChange={e => setRule(e.target.value)} placeholder="Describe the rule..." />
      <button className={styles.primaryBtn} onClick={() => { if (rule) onAdd({ type, category, rule }) }}>Add Rule</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function DecisionForm({ onAdd, onCancel }: { onAdd: (d: { decision: string; rationale: string; impact: string }) => void; onCancel: () => void }) {
  const [decision, setDecision] = useState('')
  const [rationale, setRationale] = useState('')
  const [impact, setImpact] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={decision} onChange={e => setDecision(e.target.value)} placeholder="What decision was made?" />
      <textarea className={styles.textarea} rows={2} value={rationale} onChange={e => setRationale(e.target.value)} placeholder="Why?" />
      <input className={styles.input} value={impact} onChange={e => setImpact(e.target.value)} placeholder="Expected impact" />
      <button className={styles.primaryBtn} onClick={() => { if (decision) onAdd({ decision, rationale, impact }) }}>Log Decision</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function TeamForm({ onAdd, onCancel }: { onAdd: (t: { name: string; role: string; email: string }) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input className={styles.input} value={role} onChange={e => setRole(e.target.value)} placeholder="Role" />
      <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, role, email }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function FeedbackForm({ onAdd, onCancel }: { onAdd: (f: { author: string; text: string }) => void; onCancel: () => void }) {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" />
      <textarea className={styles.textarea} rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Feedback..." />
      <button className={styles.primaryBtn} onClick={() => { if (text) onAdd({ author, text }) }}>Submit</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function ChangeForm({ onAdd, onCancel }: { onAdd: (c: { title: string; description: string }) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Request title" />
      <textarea className={styles.textarea} rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <button className={styles.primaryBtn} onClick={() => { if (title) onAdd({ title, description }) }}>Submit</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function PersonaForm({ onAdd, onCancel }: { onAdd: (p: { name: string; age: string; traits: string[]; needs: string[] }) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [traits, setTraits] = useState('')
  const [needs, setNeeds] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Persona name" />
      <input className={styles.input} value={age} onChange={e => setAge(e.target.value)} placeholder="Age range (e.g., 25-34)" />
      <input className={styles.input} value={traits} onChange={e => setTraits(e.target.value)} placeholder="Traits (comma-separated)" />
      <input className={styles.input} value={needs} onChange={e => setNeeds(e.target.value)} placeholder="Needs (comma-separated)" />
      <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, age, traits: traits.split(',').map(t => t.trim()).filter(Boolean), needs: needs.split(',').map(n => n.trim()).filter(Boolean) }) }}>Create</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function RiskForm({ onAdd, onCancel }: { onAdd: (r: { type: 'risk' | 'opportunity'; title: string; impact: number; likelihood: number }) => void; onCancel: () => void }) {
  const [type, setType] = useState<'risk' | 'opportunity'>('risk')
  const [title, setTitle] = useState('')
  const [impact, setImpact] = useState(3)
  const [likelihood, setLikelihood] = useState(3)
  return (
    <div className={styles.inlineForm}>
      <select className={styles.select} value={type} onChange={e => setType(e.target.value as 'risk' | 'opportunity')}><option value="risk">Risk</option><option value="opportunity">Opportunity</option></select>
      <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <div className={styles.fieldRow}><label>Impact: {impact}</label><input type="range" min={1} max={5} value={impact} onChange={e => setImpact(Number(e.target.value))} className={styles.range} /></div>
      <div className={styles.fieldRow}><label>Likelihood: {likelihood}</label><input type="range" min={1} max={5} value={likelihood} onChange={e => setLikelihood(Number(e.target.value))} className={styles.range} /></div>
      <button className={styles.primaryBtn} onClick={() => { if (title) onAdd({ type, title, impact, likelihood }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function SubBrandForm({ onAdd, onCancel }: { onAdd: (s: { name: string; relationship: string; status: string }) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [status, setStatus] = useState('concept')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Sub-brand name" />
      <input className={styles.input} value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="Relationship to parent" />
      <select className={styles.select} value={status} onChange={e => setStatus(e.target.value)}><option value="concept">Concept</option><option value="development">Development</option><option value="active">Active</option><option value="retired">Retired</option></select>
      <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, relationship, status }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function RefForm({ onAdd, onCancel }: { onAdd: (r: { name: string; why: string }) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [why, setWhy] = useState('')
  return (
    <div className={styles.inlineForm}>
      <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Brand name" />
      <input className={styles.input} value={why} onChange={e => setWhy(e.target.value)} placeholder="Why is this a reference?" />
      <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, why }) }}>Add</button>
      <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
    </div>
  )
}
