import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './ProductIdeationLab.module.css'

type PITab = 'concepts' | 'details' | 'prototypes' | 'team' | 'analytics'

const TYPES = ['Product', 'Service', 'System', 'Digital', 'Physical', 'Wearable', 'Software']
const INDUSTRIES = ['Technology', 'Fashion', 'Health', 'Finance', 'Education', 'Entertainment', 'Food', 'Sustainability']
const RISKS = ['Low', 'Medium', 'High']
const TEMPLATES: { name: string; type: string; desc: string }[] = [
  { name: 'Wearable Device', type: 'Physical', desc: 'Smart wearable with sensor integration and companion app' },
  { name: 'SaaS Platform', type: 'Software', desc: 'Cloud-based subscription service with dashboard and API' },
  { name: 'Sustainable Product', type: 'Product', desc: 'Eco-friendly consumer product with circular lifecycle' },
  { name: 'Service Blueprint', type: 'Service', desc: 'End-to-end service design with touchpoints and support flow' },
]

interface Concept {
  id: string; name: string; type: string; description: string; tags: string[]
  viability: number; innovation: number; marketFit: number; riskLevel: string
  status: 'exploring' | 'developing' | 'validated' | 'shelved' | 'launched'
  notes: string; prototypeLink: string; versions: string[]
  costEstimate: number; marginTarget: number; sustainabilityScore: number
  linkedProject: string; createdAt: string
}
interface ConceptTask { id: string; conceptId: string; text: string; assignee: string; done: boolean; deadline: string; createdAt: string }
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface PIComment { id: string; conceptId: string; author: string; text: string; date: string }
interface Prototype { id: string; conceptId: string; name: string; status: 'draft' | 'testing' | 'approved' | 'rejected'; version: number; notes: string; score: number; feasibility: number; createdAt: string }
interface TrendItem { id: string; name: string; score: number; industry: string; createdAt: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

export function ProductIdeationLab() {
  const [tab, setTab] = useState<PITab>('concepts')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'viability' | 'innovation' | 'score'>('date')

  const [concepts, setConcepts] = useCloudStorage<Concept[]>('pi_concepts', [])
  const [tasks, setTasks] = useCloudStorage<ConceptTask[]>('pi_tasks', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('pi_collabs', [])
  const [comments, setComments] = useCloudStorage<PIComment[]>('pi_comments', [])
  const [prototypes, setPrototypes] = useCloudStorage<Prototype[]>('pi_protos', [])
  const [trendItems, setTrendItems] = useCloudStorage<TrendItem[]>('pi_trends', [])
  const [favoritesArr, setFavoritesArr] = useCloudStorage<string[]>('pi_favorites', [])
  const favorites = useMemo(() => new Set(favoritesArr), [favoritesArr])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<string | null>(null)
  const [focusMode, setFocusMode] = useState(false)

  const selected = selectedId ? concepts.find(c => c.id === selectedId) : null
  const toggleFav = (id: string) => setFavoritesArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const oScore = (c: Concept) => Math.round((c.viability + c.innovation + c.marketFit) / 3)

  const filteredConcepts = useMemo(() => {
    let r = [...concepts]
    if (searchQuery) r = r.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    if (filterType) r = r.filter(c => c.type === filterType)
    if (filterStatus) r = r.filter(c => c.status === filterStatus)
    const favArr = [...favorites]
    if (sortBy === 'viability') r.sort((a, b) => b.viability - a.viability)
    else if (sortBy === 'innovation') r.sort((a, b) => b.innovation - a.innovation)
    else if (sortBy === 'score') r.sort((a, b) => oScore(b) - oScore(a))
    else r.sort((a, b) => (favArr.includes(b.id) ? 1 : 0) - (favArr.includes(a.id) ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return r
  }, [concepts, searchQuery, filterType, filterStatus, favorites, sortBy])

  const curTasks = useMemo(() => selectedId ? tasks.filter(t => t.conceptId === selectedId) : [], [tasks, selectedId])
  const curComments = useMemo(() => selectedId ? comments.filter(c => c.conceptId === selectedId) : [], [comments, selectedId])
  const curProtos = useMemo(() => selectedId ? prototypes.filter(p => p.conceptId === selectedId) : [], [prototypes, selectedId])

  const avgViability = concepts.length ? Math.round(concepts.reduce((a, c) => a + c.viability, 0) / concepts.length) : 0
  const avgInnovation = concepts.length ? Math.round(concepts.reduce((a, c) => a + c.innovation, 0) / concepts.length) : 0
  const avgMarketFit = concepts.length ? Math.round(concepts.reduce((a, c) => a + c.marketFit, 0) / concepts.length) : 0
  const successRate = concepts.length ? Math.round(concepts.filter(c => c.status === 'launched' || c.status === 'validated').length / concepts.length * 100) : 0

  const tabs: [PITab, string][] = [
    ['concepts', 'Concepts'], ['details', 'Details'], ['prototypes', 'Prototypes'],
    ['team', 'Team'], ['analytics', 'Analytics'],
  ]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Product Ideation Lab</h1><p className={styles.subtitle}>Capture · Develop · Evaluate · Launch</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'concept' ? null : 'concept')}>+ New Concept</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      {showForm === 'concept' && <div className={styles.overlay}><div className={styles.wizardPanel}><h2 className={styles.wizardTitle}>New Concept</h2><ConceptForm onAdd={c => { setConcepts(prev => [{ ...c, id: uid(), versions: ['v1'], createdAt: now() }, ...prev]); setShowForm(null) }} onCancel={() => setShowForm(null)} /></div></div>}

      <main className={styles.mainContent}>

        {/* ═══ CONCEPTS (#1-10) ═══ */}
        {tab === 'concepts' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{concepts.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Exploring</div><div className={styles.kpiValue}>{concepts.filter(c => c.status === 'exploring').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Developing</div><div className={styles.kpiValue}>{concepts.filter(c => c.status === 'developing').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Validated</div><div className={styles.kpiValue}>{concepts.filter(c => c.status === 'validated').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Launched</div><div className={styles.kpiValue}>{concepts.filter(c => c.status === 'launched').length}</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search concepts... (#5)" />
            <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
            <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">All Status</option><option value="exploring">Exploring</option><option value="developing">Developing</option><option value="validated">Validated</option><option value="launched">Launched</option><option value="shelved">Shelved</option></select>
            <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}><option value="date">Newest</option><option value="viability">Viability</option><option value="innovation">Innovation</option><option value="score">Score</option></select>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Quick Templates (#2)</label></div>
            <div className={styles.chipRow}>{TEMPLATES.map(t => <button key={t.name} className={styles.chipBtn} onClick={() => setConcepts(prev => [{ id: uid(), name: t.name, type: t.type, description: t.desc, tags: [], viability: 50, innovation: 50, marketFit: 50, riskLevel: 'Medium', status: 'exploring', notes: '', prototypeLink: '', versions: ['v1'], costEstimate: 0, marginTarget: 0, sustainabilityScore: 50, linkedProject: '', createdAt: now() }, ...prev])}>{t.name}</button>)}</div>
          </div>

          {filteredConcepts.length === 0 ? <div className={styles.emptyState}><p>No concepts yet. Create your first one above.</p></div> : (
            <div className={styles.conceptGrid}>{filteredConcepts.map(c => (
              <div key={c.id} className={`${styles.conceptCard} ${selectedId === c.id ? styles.conceptCardActive : ''}`} onClick={() => { setSelectedId(c.id); setTab('details') }}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{c.name}</span>
                  <button className={styles.favBtn} onClick={e => { e.stopPropagation(); toggleFav(c.id) }}>{favorites.has(c.id) ? '★' : '☆'}</button>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.tag}>{c.type}</span>
                  <span className={`${styles.statusBadge} ${styles[`st_${c.status}`]}`}>{c.status}</span>
                  {c.riskLevel !== 'Low' && <span className={styles.tag}>{c.riskLevel} risk</span>}
                </div>
                {c.description && <p className={styles.cardPreview}>{c.description.slice(0, 80)}</p>}
                <div className={styles.scoreRow}>
                  <div className={styles.scoreItem}><span className={styles.scoreLabel}>Viability</span><span className={styles.scoreVal}>{c.viability}</span></div>
                  <div className={styles.scoreItem}><span className={styles.scoreLabel}>Innovation</span><span className={styles.scoreVal}>{c.innovation}</span></div>
                  <div className={styles.scoreItem}><span className={styles.scoreLabel}>Market</span><span className={styles.scoreVal}>{c.marketFit}</span></div>
                  <div className={styles.scoreItem}><span className={styles.scoreLabel}>Score</span><span className={styles.scoreVal}>{oScore(c)}</span></div>
                </div>
                {c.tags.length > 0 && <div className={styles.tagRow}>{c.tags.slice(0, 4).map(t => <span key={t} className={styles.tag}>#{t}</span>)}</div>}
                <div className={styles.cardActions}>
                  <select className={styles.miniSelect} value={c.status} onClick={e => e.stopPropagation()} onChange={e => setConcepts(prev => prev.map(x => x.id === c.id ? { ...x, status: e.target.value as Concept['status'] } : x))}>
                    <option value="exploring">Exploring</option><option value="developing">Developing</option><option value="validated">Validated</option><option value="launched">Launched</option><option value="shelved">Shelved</option>
                  </select>
                  <button className={styles.ghostBtn} onClick={e => { e.stopPropagation(); setConcepts(prev => [{ ...c, id: uid(), name: `${c.name} (Copy)`, versions: ['v1'], createdAt: now() }, ...prev]) }}>Duplicate (#7)</button>
                  <button className={styles.ghostBtn} onClick={e => { e.stopPropagation(); setConcepts(prev => prev.map(x => x.id === c.id ? { ...x, status: 'shelved' as const } : x)) }}>Archive (#8)</button>
                  <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); setConcepts(prev => prev.filter(x => x.id !== c.id)) }}>×</button>
                </div>
              </div>
            ))}</div>
          )}

          {concepts.filter(c => c.status === 'shelved').length > 0 && <div className={styles.dnaBlock}>
            <label className={styles.label}>Idea Backlog (#4, #8)</label>
            {concepts.filter(c => c.status === 'shelved').map(c => <div key={c.id} className={styles.taskItem}><span className={styles.taskContent}>{c.name}</span><span className={styles.tag}>{c.type}</span><button className={styles.ghostBtn} onClick={() => setConcepts(prev => prev.map(x => x.id === c.id ? { ...x, status: 'exploring' as const } : x))}>Revive</button></div>)}
          </div>}
        </div>}

        {/* ═══ DETAILS (#11-20) ═══ */}
        {tab === 'details' && <div className={styles.section}>
          {!selected ? <div className={styles.emptyState}><p>Select a concept from the Concepts tab.</p></div> : <>
            <h2 className={styles.sectionTitle}>{selected.name}</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Viability (#11)</div><div className={styles.kpiValue}>{selected.viability}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Innovation (#12)</div><div className={styles.kpiValue}>{selected.innovation}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Market Fit (#13)</div><div className={styles.kpiValue}>{selected.marketFit}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Opportunity</div><div className={styles.kpiValue}>{oScore(selected)}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Sustainability (#17)</div><div className={styles.kpiValue}>{selected.sustainabilityScore}</div></div>
            </div>

            <div className={styles.splitRow}>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Score Adjustment (#11-13)</label>
                <div className={styles.formStack}>
                  <div className={styles.formGroup}><label>Viability: {selected.viability}</label><input type="range" min={0} max={100} value={selected.viability} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, viability: Number(e.target.value) } : x))} className={styles.range} /></div>
                  <div className={styles.formGroup}><label>Innovation: {selected.innovation}</label><input type="range" min={0} max={100} value={selected.innovation} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, innovation: Number(e.target.value) } : x))} className={styles.range} /></div>
                  <div className={styles.formGroup}><label>Market Fit: {selected.marketFit}</label><input type="range" min={0} max={100} value={selected.marketFit} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, marketFit: Number(e.target.value) } : x))} className={styles.range} /></div>
                  <div className={styles.formGroup}><label>Sustainability: {selected.sustainabilityScore}</label><input type="range" min={0} max={100} value={selected.sustainabilityScore} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, sustainabilityScore: Number(e.target.value) } : x))} className={styles.range} /></div>
                  <div className={styles.formGroup}><label>Risk (#14)</label><select className={styles.select} value={selected.riskLevel} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, riskLevel: e.target.value } : x))}>{RISKS.map(r => <option key={r}>{r}</option>)}</select></div>
                </div>
              </div>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Cost & Margin (#15)</label>
                <div className={styles.formStack}>
                  <div className={styles.formGroup}><label>Cost Estimate ($)</label><input className={styles.input} type="number" value={selected.costEstimate} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, costEstimate: Number(e.target.value) } : x))} /></div>
                  <div className={styles.formGroup}><label>Target Margin (%)</label><input className={styles.input} type="number" value={selected.marginTarget} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, marginTarget: Number(e.target.value) } : x))} /></div>
                  {selected.costEstimate > 0 && selected.marginTarget > 0 && <p className={styles.helperText}>Target price: ${Math.round(selected.costEstimate / (1 - selected.marginTarget / 100))}</p>}
                </div>
                <label className={styles.label} style={{ marginTop: 16 }}>Linked Project (#3)</label>
                <input className={styles.input} value={selected.linkedProject} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, linkedProject: e.target.value } : x))} placeholder="Link to project name or ID..." />
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Notes & Description (#43)</label>
              <textarea className={styles.textarea} rows={3} value={selected.notes} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, notes: e.target.value } : x))} placeholder="Notes, observations, ideas..." />
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Attach Files (#10)</label>
              <input className={styles.input} value={selected.prototypeLink} onChange={e => setConcepts(prev => prev.map(x => x.id === selected.id ? { ...x, prototypeLink: e.target.value } : x))} placeholder="Link to sketches, CAD files, images, PDFs..." />
            </div>

            <div className={styles.splitRow}>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Version History (#9)</label>
                <div className={styles.versionList}>{selected.versions.map((v, i) => <div key={i} className={styles.versionItem}>{v}</div>)}</div>
                <button className={styles.ghostBtn} onClick={() => setConcepts(prev => prev.map(c => c.id === selected.id ? { ...c, versions: [...c.versions, `v${c.versions.length + 1} — ${new Date().toLocaleString()}`] } : c))}>+ Add Version</button>
              </div>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Timeline (#39)</label>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><span className={styles.timelineDot} /><span>Created {fmtDate(selected.createdAt)}</span></div>
                  {selected.versions.slice(1).map((v, i) => <div key={i} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{v}</span></div>)}
                  {curProtos.map(p => <div key={p.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>Prototype: {p.name} ({p.status})</span></div>)}
                </div>
              </div>
            </div>

            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}>AI Advisory (#18)</div>
              <pre className={styles.aiOutput}>{(() => {
                const s = oScore(selected); const ready = selected.viability > 70 && selected.marketFit > 70 && selected.innovation > 50
                return `Concept Assessment: ${selected.name}\n${'─'.repeat(35)}\n• Opportunity Score: ${s}/100 — ${s > 75 ? 'High potential' : s > 50 ? 'Moderate — iterate' : 'Low — consider pivoting'}\n• Risk Level: ${selected.riskLevel}\n• Sustainability: ${selected.sustainabilityScore}/100\n• Launch Ready: ${ready ? 'Yes — meets all criteria' : `No — needs: ${selected.viability <= 70 ? 'viability ' : ''}${selected.marketFit <= 70 ? 'market fit ' : ''}${selected.innovation <= 50 ? 'innovation' : ''}`}\n• Cost: ${selected.costEstimate > 0 ? `$${selected.costEstimate} est. (${selected.marginTarget}% target margin)` : 'Not estimated'}\n• Recommendation: ${s > 75 ? 'Move to prototype validation.' : s > 50 ? 'Refine value proposition and test assumptions.' : 'Park or pivot — explore alternative approaches.'}`
              })()}</pre>
            </div>
          </>}
        </div>}

        {/* ═══ PROTOTYPES (#16, #34) ═══ */}
        {tab === 'prototypes' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Prototypes & Testing</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{prototypes.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Testing</div><div className={styles.kpiValue}>{prototypes.filter(p => p.status === 'testing').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Approved</div><div className={styles.kpiValue}>{prototypes.filter(p => p.status === 'approved').length}</div></div>
          </div>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'proto' ? null : 'proto')}>+ New Prototype (#34)</button>
          {showForm === 'proto' && <div className={styles.inlineForm}>
            <select className={styles.select} id="pr_concept">{concepts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <input className={styles.input} placeholder="Prototype name" id="pr_name" />
            <input className={styles.input} type="number" placeholder="Feasibility % (#16)" id="pr_feas" />
            <textarea className={styles.textarea} rows={2} placeholder="Notes..." id="pr_notes" style={{ flex: 1, minWidth: 200 }} />
            <button className={styles.primaryBtn} onClick={() => { const name = (document.getElementById('pr_name') as HTMLInputElement).value; if (name) { setPrototypes(prev => [...prev, { id: uid(), conceptId: (document.getElementById('pr_concept') as HTMLSelectElement).value, name, status: 'draft', version: 1, notes: (document.getElementById('pr_notes') as HTMLTextAreaElement).value, score: 0, feasibility: Number((document.getElementById('pr_feas') as HTMLInputElement).value) || 50, createdAt: now() }]); setShowForm(null) } }}>Create</button>
          </div>}
          <div className={styles.conceptGrid}>{prototypes.map(p => {
            const c = concepts.find(x => x.id === p.conceptId)
            return <div key={p.id} className={styles.conceptCard} style={{ cursor: 'default' }}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{p.name}</span><span className={styles.tag}>v{p.version}</span></div>
              <div className={styles.cardMeta}><span className={styles.helperText}>{c?.name}</span><span className={`${styles.statusBadge} ${styles[`st_${p.status === 'approved' ? 'validated' : p.status === 'testing' ? 'developing' : p.status === 'rejected' ? 'shelved' : 'exploring'}`]}`}>{p.status}</span></div>
              {p.notes && <p className={styles.cardPreview}>{p.notes}</p>}
              <div className={styles.scoreRow}>{p.score > 0 && <div className={styles.scoreItem}><span className={styles.scoreLabel}>Score</span><span className={styles.scoreVal}>{p.score}</span></div>}<div className={styles.scoreItem}><span className={styles.scoreLabel}>Feasibility</span><span className={styles.scoreVal}>{p.feasibility}%</span></div></div>
              <div className={styles.cardActions}>
                <select className={styles.miniSelect} value={p.status} onChange={e => setPrototypes(prev => prev.map(x => x.id === p.id ? { ...x, status: e.target.value as Prototype['status'] } : x))}><option value="draft">Draft</option><option value="testing">Testing</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
                <input className={styles.miniSelect} type="number" style={{ width: 50 }} placeholder="Score" value={p.score || ''} onChange={e => setPrototypes(prev => prev.map(x => x.id === p.id ? { ...x, score: Number(e.target.value) } : x))} />
                <button className={styles.deleteBtn} onClick={() => setPrototypes(prev => prev.filter(x => x.id !== p.id))}>×</button>
              </div>
            </div>
          })}</div>
        </div>}

        {/* ═══ TEAM (#21-30) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Collaboration & Team</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#21-22)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="pic_name" /><input className={styles.input} placeholder="Email" id="pic_email" /><select className={styles.select} id="pic_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('pic_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('pic_email') as HTMLInputElement).value, role: (document.getElementById('pic_role') as HTMLSelectElement).value as Collaborator['role'] }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion (#23-24){selected ? ` — ${selected.name}` : ''}</label>
            <div className={styles.commentList}>{(selected ? curComments : comments.slice(0, 15)).map(c => <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>)}</div>
            <div className={styles.inlineForm}><input className={styles.input} placeholder="Add comment... (#30)" id="picom_input" /><button className={styles.ghostBtn} onClick={() => { const text = (document.getElementById('picom_input') as HTMLInputElement).value; if (text) { setComments(prev => [{ id: uid(), conceptId: selectedId || '', author: 'You', text, date: now() }, ...prev]); (document.getElementById('picom_input') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Tasks & Milestones (#26)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'task' ? null : 'task')}>+ Add</button></div>
            {showForm === 'task' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Task" id="pit_text" /><input className={styles.input} placeholder="Assignee" id="pit_assignee" /><input className={styles.input} type="date" id="pit_deadline" /><button className={styles.primaryBtn} onClick={() => { const text = (document.getElementById('pit_text') as HTMLInputElement).value; if (text) { setTasks(prev => [...prev, { id: uid(), conceptId: selectedId || '', text, assignee: (document.getElementById('pit_assignee') as HTMLInputElement).value, done: false, deadline: (document.getElementById('pit_deadline') as HTMLInputElement).value, createdAt: now() }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.taskList}>{(selected ? curTasks : tasks.slice(0, 10)).map(t => (
              <div key={t.id} className={`${styles.taskItem} ${t.done ? styles.taskDone : ''}`}><button className={styles.checkBtn} onClick={() => setTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}>{t.done ? '✓' : '○'}</button><div className={styles.taskContent}><span>{t.text}</span><div className={styles.taskMeta}>{t.assignee && <span className={styles.tag}>{t.assignee}</span>}{t.deadline && <span className={styles.helperText}>{fmtDate(t.deadline)}</span>}</div></div><button className={styles.deleteBtn} onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))}>×</button></div>
            ))}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Approval Workflow (#29)</label>
            {concepts.filter(c => c.status === 'validated' || c.status === 'developing').map(c => {
              const ready = c.viability > 70 && c.marketFit > 70 && c.innovation > 50
              return <div key={c.id} className={styles.taskItem}><span className={styles.taskContent}>{c.name}</span><span className={`${styles.statusBadge} ${ready ? styles.st_validated : styles.st_exploring}`}>{ready ? 'Ready' : 'Pending'}</span><button className={styles.ghostBtn} onClick={() => setConcepts(prev => prev.map(x => x.id === c.id ? { ...x, status: 'launched' as const } : x))}>Approve & Launch</button></div>
            })}
            {concepts.filter(c => c.status === 'validated' || c.status === 'developing').length === 0 && <p className={styles.helperText}>No concepts pending approval.</p>}
          </div>
        </div>}

        {/* ═══ ANALYTICS (#31-40, #19-20) ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics, Strategy & Export</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Concepts</div><div className={styles.kpiValue}>{concepts.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Viability</div><div className={styles.kpiValue}>{avgViability}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Innovation</div><div className={styles.kpiValue}>{avgInnovation}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Market Fit</div><div className={styles.kpiValue}>{avgMarketFit}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Success Rate (#32)</div><div className={styles.kpiValue}>{successRate}%</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Cross-Concept Comparison (#19)</label>
            <div className={styles.comparisonTable}>
              <div className={styles.compRow}><span className={styles.compHeader}>Concept</span><span className={styles.compHeader}>Viability</span><span className={styles.compHeader}>Innovation</span><span className={styles.compHeader}>Market</span><span className={styles.compHeader}>Score</span></div>
              {[...concepts].sort((a, b) => oScore(b) - oScore(a)).slice(0, 10).map(c => <div key={c.id} className={styles.compRow}><span>{c.name}</span><span>{c.viability}</span><span>{c.innovation}</span><span>{c.marketFit}</span><span className={styles.scoreBadge}>{oScore(c)}</span></div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Concept Decay (#20)</label>
            <div className={styles.conceptGrid}>{concepts.filter(c => c.status === 'exploring' || c.status === 'shelved').map(c => {
              const age = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000)
              return <div key={c.id} className={styles.conceptCard} style={{ cursor: 'default' }}><span className={styles.cardTitle}>{c.name}</span><span className={styles.helperText}>{age} days old — {age > 30 ? 'Consider archiving or reviving' : 'Still fresh'}</span></div>
            })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Trend Signals (#33)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'trend' ? null : 'trend')}>+ Track</button></div>
            {showForm === 'trend' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Trend" id="str_name" /><select className={styles.select} id="str_ind">{INDUSTRIES.map(i => <option key={i}>{i}</option>)}</select><input className={styles.input} type="number" placeholder="Score" id="str_score" /><button className={styles.primaryBtn} onClick={() => { const name = (document.getElementById('str_name') as HTMLInputElement).value; if (name) { setTrendItems(prev => [...prev, { id: uid(), name, industry: (document.getElementById('str_ind') as HTMLSelectElement).value, score: Number((document.getElementById('str_score') as HTMLInputElement).value) || 50, createdAt: now() }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.conceptGrid}>{trendItems.map(t => <div key={t.id} className={styles.conceptCard} style={{ cursor: 'default' }}><span className={styles.cardTitle}>{t.name}</span><div className={styles.cardMeta}><span className={styles.tag}>{t.industry}</span><span className={styles.scoreBadge}>{t.score}/100</span></div><button className={styles.deleteBtn} onClick={() => setTrendItems(prev => prev.filter(x => x.id !== t.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const data = `Concept Portfolio\n${'='.repeat(40)}\n${concepts.map(c => `${c.name} | ${c.type} | V:${c.viability} I:${c.innovation} M:${c.marketFit} | ${c.status} | $${c.costEstimate}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([data], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `concept-portfolio-${Date.now()}.txt`; a.click() }}>Export Portfolio (#37)</button>
            <button className={styles.exportBtn} onClick={() => { const csv = `Name,Type,Viability,Innovation,MarketFit,Score,Status,Risk,Cost,Sustainability\n${concepts.map(c => `"${c.name}",${c.type},${c.viability},${c.innovation},${c.marketFit},${oScore(c)},${c.status},${c.riskLevel},${c.costEstimate},${c.sustainabilityScore}`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `concepts-${Date.now()}.csv`; a.click() }}>Export CSV</button>
            <button className={styles.exportBtn} onClick={() => { const exec = `Executive Summary\n${'='.repeat(40)}\nTotal: ${concepts.length} | Validated: ${concepts.filter(c => c.status === 'validated').length} | Launched: ${concepts.filter(c => c.status === 'launched').length}\nAvg Score: ${concepts.length ? Math.round(concepts.reduce((a, c) => a + oScore(c), 0) / concepts.length) : 0}\nSuccess Rate: ${successRate}% | Prototypes: ${prototypes.length} | Team: ${collaborators.length}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([exec], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `executive-summary-${Date.now()}.txt`; a.click() }}>Executive Summary</button>
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>Innovation KPIs (#36)</div>
            <pre className={styles.aiOutput}>{`Innovation Lab Summary\n${'─'.repeat(35)}\n• ${concepts.length} concepts in pipeline\n• ${concepts.filter(c => c.status === 'validated').length} validated, ${concepts.filter(c => c.status === 'launched').length} launched\n• Success rate: ${successRate}%\n• Avg opportunity: ${concepts.length ? Math.round(concepts.reduce((a, c) => a + oScore(c), 0) / concepts.length) : 0}/100\n• ${concepts.filter(c => c.riskLevel === 'High').length} high-risk — monitor closely\n• Avg sustainability: ${concepts.length ? Math.round(concepts.reduce((a, c) => a + c.sustainabilityScore, 0) / concepts.length) : 0}/100\n• Top type: ${concepts.length ? (() => { const f: Record<string, number> = {}; concepts.forEach(c => f[c.type] = (f[c.type] || 0) + 1); return Object.entries(f).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' })() : 'N/A'}\n• Recommendation: ${concepts.length < 5 ? 'Build volume. Aim for 10+ concepts.' : concepts.filter(c => c.status === 'validated').length > 0 ? 'Move validated concepts to launch.' : 'Focus on validation — test assumptions.'}`}</pre>
          </div>
        </div>}

      </main>
    </div>
  )
}

function ConceptForm({ onAdd, onCancel }: { onAdd: (c: Omit<Concept, 'id' | 'versions' | 'createdAt'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [type, setType] = useState('Product'); const [desc, setDesc] = useState('')
  const [tags, setTags] = useState<string[]>([]); const [tagInput, setTagInput] = useState('')
  const [viability, setViability] = useState(50); const [innovation, setInnovation] = useState(50); const [marketFit, setMarketFit] = useState(50)
  const [risk, setRisk] = useState('Low'); const [cost, setCost] = useState(0); const [sustainability, setSustainability] = useState(50)
  return (
    <div className={styles.formStack}>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Name (#1)</label><input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Concept name" /></div>
        <div className={styles.formGroup}><label>Type</label><select className={styles.select} value={type} onChange={e => setType(e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
      </div>
      <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this concept?" /></div>
      <div className={styles.formGroup}><label>Tags (#9)</label>
        <div className={styles.chipRow}>{INDUSTRIES.map(i => <button key={i} type="button" className={`${styles.chipBtn} ${tags.includes(i) ? styles.chipActive : ''}`} onClick={() => setTags(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}>{i}</button>)}</div>
        <input className={styles.input} value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Custom tag (Enter)" style={{ marginTop: 6 }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setTags(prev => [...prev, tagInput.trim()]); setTagInput('') } } }} />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Viability: {viability}</label><input type="range" min={0} max={100} value={viability} onChange={e => setViability(Number(e.target.value))} className={styles.range} /></div>
        <div className={styles.formGroup}><label>Innovation: {innovation}</label><input type="range" min={0} max={100} value={innovation} onChange={e => setInnovation(Number(e.target.value))} className={styles.range} /></div>
        <div className={styles.formGroup}><label>Market Fit: {marketFit}</label><input type="range" min={0} max={100} value={marketFit} onChange={e => setMarketFit(Number(e.target.value))} className={styles.range} /></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Risk (#14)</label><select className={styles.select} value={risk} onChange={e => setRisk(e.target.value)}>{RISKS.map(r => <option key={r}>{r}</option>)}</select></div>
        <div className={styles.formGroup}><label>Cost Estimate (#15)</label><input className={styles.input} type="number" value={cost} onChange={e => setCost(Number(e.target.value))} placeholder="$" /></div>
        <div className={styles.formGroup}><label>Sustainability (#17): {sustainability}</label><input type="range" min={0} max={100} value={sustainability} onChange={e => setSustainability(Number(e.target.value))} className={styles.range} /></div>
      </div>
      <div className={styles.fieldRow}>
        <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, type, description: desc, tags, viability, innovation, marketFit, riskLevel: risk, status: 'exploring', notes: '', prototypeLink: '', costEstimate: cost, marginTarget: 0, sustainabilityScore: sustainability, linkedProject: '' }) }}>Create Concept</button>
        <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
