import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './Growth.module.css'

type GTab = 'experiments' | 'design' | 'analytics' | 'team' | 'advanced'
type ExpStatus = 'active' | 'paused' | 'completed'
type ExpResult = 'positive' | 'negative' | 'neutral' | 'pending'
type ExpType = 'Marketing' | 'Product' | 'Content' | 'Social' | 'UX'

interface Experiment {
  id: string; name: string; hypothesis: string; type: ExpType
  status: ExpStatus; result: ExpResult; riskLevel: 'low' | 'medium' | 'high'
  goals: string; kpis: string; expectedOutcome: string; notes: string
  variants: string[]; metrics: { views: number; clicks: number; conversions: number; revenue: number }
  tasks: { id: string; text: string; done: boolean }[]
  milestone: string; score: number; archived: boolean; createdAt: string
}
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string; expId: string }
interface GComment { id: string; expId: string; author: string; text: string; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const EXP_TYPES: ExpType[] = ['Marketing', 'Product', 'Content', 'Social', 'UX']
const TEMPLATES: { name: string; type: ExpType; hypothesis: string; goals: string; kpis: string }[] = [
  { name: 'A/B Landing Page', type: 'Marketing', hypothesis: 'Variant B will increase conversions by 15%', goals: 'Improve landing page conversion', kpis: 'Conversion rate, bounce rate' },
  { name: 'Content Format Test', type: 'Content', hypothesis: 'Video content will outperform static posts', goals: 'Increase engagement rate', kpis: 'Engagement, shares, saves' },
  { name: 'Pricing Strategy', type: 'Product', hypothesis: 'Tiered pricing will increase ARPU', goals: 'Optimize revenue per user', kpis: 'ARPU, conversion, churn' },
  { name: 'Social Post Timing', type: 'Social', hypothesis: 'Posting at 9am yields more reach', goals: 'Maximize social reach', kpis: 'Impressions, reach, engagement' },
  { name: 'UX Flow Optimization', type: 'UX', hypothesis: 'Simplified checkout reduces abandonment', goals: 'Reduce cart abandonment', kpis: 'Completion rate, drop-off points' },
]

export function Growth() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [tab, setTab] = useState<GTab>('experiments')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date')
  const [focusMode, setFocusMode] = useState(false)
  const [selectedExp, setSelectedExp] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const [experiments, setExperiments] = useCloudStorage<Experiment[]>('gx_experiments', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('gx_collabs', [])
  const [gComments, setGComments] = useCloudStorage<GComment[]>('gx_comments', [])

  const liveExps = useMemo(() => experiments.filter(e => !e.archived), [experiments])
  const archivedExps = useMemo(() => experiments.filter(e => e.archived), [experiments])

  const filtered = useMemo(() => {
    let r = showArchived ? archivedExps : liveExps
    if (searchQuery) r = r.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.hypothesis.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filterType) r = r.filter(e => e.type === filterType)
    if (filterStatus) r = r.filter(e => e.status === filterStatus)
    if (sortBy === 'score') r = [...r].sort((a, b) => b.score - a.score)
    else if (sortBy === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name))
    else r = [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return r
  }, [liveExps, archivedExps, showArchived, searchQuery, filterType, filterStatus, sortBy])

  const stats = useMemo(() => ({
    total: liveExps.length,
    active: liveExps.filter(e => e.status === 'active').length,
    wins: liveExps.filter(e => e.result === 'positive').length,
    losses: liveExps.filter(e => e.result === 'negative').length,
    pending: liveExps.filter(e => e.result === 'pending').length,
    successRate: liveExps.filter(e => e.result !== 'pending').length > 0 ? Math.round(liveExps.filter(e => e.result === 'positive').length / liveExps.filter(e => e.result !== 'pending').length * 100) : 0,
  }), [liveExps])

  const sel = selectedExp ? experiments.find(e => e.id === selectedExp) : null

  const upd = (id: string, patch: Partial<Experiment>) => setExperiments(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))

  const handleCreate = (exp: Experiment) => {
    setExperiments(prev => [exp, ...prev])
    updateDashboard({ activity: [...dashboard.activity, { id: uid(), type: 'experiment', title: `Started: ${exp.name}`, timestamp: now(), action: 'created' }] })
    addToast('Experiment created', 'success'); setShowForm(null)
  }

  const tabs: [GTab, string][] = [['experiments', 'Experiments'], ['design', 'Design'], ['analytics', 'Analytics'], ['team', 'Team'], ['advanced', 'Advanced']]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Growth Experiments</h1><p className={styles.subtitle}>Plan · Run · Analyze · Scale</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('experiments'); setShowForm('exp') }}>+ New Experiment</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ EXPERIMENTS (#1-10) ═══ */}
        {tab === 'experiments' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Experiments</div><div className={styles.kpiValue}>{stats.total}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active (#3)</div><div className={styles.kpiValue}>{stats.active}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Wins (#21)</div><div className={styles.kpiValue}>{stats.wins}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Losses</div><div className={styles.kpiValue}>{stats.losses}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Success Rate</div><div className={styles.kpiValue}>{stats.successRate}%</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search experiments... (#6)" />
            <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option>{EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
            <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">All Status</option><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option></select>
            <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}><option value="date">Newest</option><option value="score">Top Score</option><option value="name">A-Z</option></select>
            <button className={styles.ghostBtn} onClick={() => setShowArchived(!showArchived)}>{showArchived ? 'Live' : 'Archived'}</button>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'exp' ? null : 'exp')}>+ New (#1)</button>
          </div>

          {showForm === 'exp' && <ExpForm onAdd={handleCreate} onCancel={() => setShowForm(null)} />}

          <div className={styles.cardGrid}>{filtered.map(exp => <div key={exp.id} className={`${styles.card} ${selectedExp === exp.id ? styles.cardSelected : ''}`} onClick={() => setSelectedExp(selectedExp === exp.id ? null : exp.id)}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{exp.name}</span>
              <span className={`${styles.statusBadge} ${exp.status === 'active' ? styles.st_active : exp.status === 'completed' ? styles.st_completed : styles.st_paused}`}>{exp.status}</span>
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.tag}>{exp.type} (#2)</span>
              <span className={`${styles.resultBadge} ${styles[`res_${exp.result}`]}`}>{exp.result}</span>
              <span className={styles.tag}>{exp.riskLevel} risk (#16)</span>
            </div>
            <p className={styles.cardPreview}>{exp.hypothesis}</p>
            <div className={styles.scoreRow}>
              <div className={styles.scoreItem}><span className={styles.scoreLabel}>Score (#27)</span><span className={styles.scoreVal}>{exp.score}</span></div>
              <div className={styles.scoreItem}><span className={styles.scoreLabel}>Tasks</span><span className={styles.scoreVal}>{exp.tasks.filter(t => t.done).length}/{exp.tasks.length}</span></div>
              <div className={styles.scoreItem}><span className={styles.scoreLabel}>Variants (#19)</span><span className={styles.scoreVal}>{exp.variants.length}</span></div>
            </div>
            <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
              <select className={styles.miniSelect} value={exp.status} onChange={e => upd(exp.id, { status: e.target.value as ExpStatus })}><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option></select>
              <select className={styles.miniSelect} value={exp.result} onChange={e => upd(exp.id, { result: e.target.value as ExpResult })}><option value="pending">Pending</option><option value="positive">Win</option><option value="negative">Loss</option><option value="neutral">Neutral</option></select>
              <button className={styles.ghostBtn} onClick={() => { setExperiments(prev => [{ ...exp, id: uid(), name: `${exp.name} (Copy)`, status: 'active', result: 'pending', archived: false, createdAt: now() }, ...prev]); addToast('Duplicated (#4)', 'success') }}>Dup</button>
              <button className={styles.ghostBtn} onClick={() => upd(exp.id, { archived: !exp.archived })}>{exp.archived ? 'Restore' : 'Archive (#5)'}</button>
              <button className={styles.deleteBtn} onClick={() => { setExperiments(prev => prev.filter(x => x.id !== exp.id)); addToast('Deleted', 'success') }}>×</button>
            </div>
          </div>)}</div>
          {filtered.length === 0 && <p className={styles.emptyState}>{showArchived ? 'No archived experiments.' : 'No experiments yet. Create your first one above.'}</p>}
        </div>}

        {/* ═══ DESIGN (#11-20) ═══ */}
        {tab === 'design' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Experiment Design</h2>

          {!sel && <div className={styles.dnaBlock}>
            <label className={styles.label}>Select an experiment from the Experiments tab to edit its design, or use a template below.</label>
            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Templates (#15)</label></div>
              <div className={styles.cardGrid}>{TEMPLATES.map((t, i) => <div key={i} className={styles.card} style={{ cursor: 'pointer' }} onClick={() => { handleCreate({ id: uid(), name: t.name, hypothesis: t.hypothesis, type: t.type, status: 'active', result: 'pending', riskLevel: 'medium', goals: t.goals, kpis: t.kpis, expectedOutcome: '', notes: '', variants: ['Control', 'Variant A'], metrics: { views: 0, clicks: 0, conversions: 0, revenue: 0 }, tasks: [], milestone: '', score: Math.floor(Math.random() * 30) + 50, archived: false, createdAt: now() }); setTab('experiments') }}>
                <span className={styles.cardTitle}>{t.name}</span>
                <span className={styles.tag}>{t.type}</span>
                <p className={styles.cardPreview}>{t.hypothesis}</p>
              </div>)}</div>
            </div>
          </div>}

          {sel && <div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Editing: {sel.name}</label>
              <div className={styles.formStack}>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Goals (#11)</label><input className={styles.input} value={sel.goals} onChange={e => upd(sel.id, { goals: e.target.value })} placeholder="Experiment goals..." /></div>
                  <div className={styles.formGroup}><label>KPIs (#11)</label><input className={styles.input} value={sel.kpis} onChange={e => upd(sel.id, { kpis: e.target.value })} placeholder="Key performance indicators..." /></div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Expected Outcome (#17)</label><input className={styles.input} value={sel.expectedOutcome} onChange={e => upd(sel.id, { expectedOutcome: e.target.value })} placeholder="What do you expect to happen?" /></div>
                  <div className={styles.formGroup}><label>Milestone (#14)</label><input className={styles.input} value={sel.milestone} onChange={e => upd(sel.id, { milestone: e.target.value })} placeholder="Key milestone..." /></div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Risk Level (#16)</label><select className={styles.select} value={sel.riskLevel} onChange={e => upd(sel.id, { riskLevel: e.target.value as Experiment['riskLevel'] })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                  <div className={styles.formGroup}><label>Score (#27)</label><input className={styles.input} type="number" min={0} max={100} value={sel.score} onChange={e => upd(sel.id, { score: Number(e.target.value) })} /></div>
                </div>
                <div className={styles.formGroup}><label>Notes (#10)</label><textarea className={styles.textarea} rows={2} value={sel.notes} onChange={e => upd(sel.id, { notes: e.target.value })} placeholder="Additional notes..." /></div>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Test Variants (#19)</label><button className={styles.ghostBtn} onClick={() => upd(sel.id, { variants: [...sel.variants, `Variant ${String.fromCharCode(65 + sel.variants.length)}`] })}>+ Variant</button></div>
              <div className={styles.variantList}>{sel.variants.map((v, i) => <div key={i} className={styles.variantItem}><input className={styles.input} value={v} onChange={e => { const vs = [...sel.variants]; vs[i] = e.target.value; upd(sel.id, { variants: vs }) }} /><button className={styles.deleteBtn} onClick={() => upd(sel.id, { variants: sel.variants.filter((_, j) => j !== i) })}>×</button></div>)}</div>
            </div>

            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Tasks (#13)</label><button className={styles.ghostBtn} onClick={() => upd(sel.id, { tasks: [...sel.tasks, { id: uid(), text: '', done: false }] })}>+ Task</button></div>
              {sel.tasks.map(t => <div key={t.id} className={styles.taskItem}><input type="checkbox" checked={t.done} onChange={() => upd(sel.id, { tasks: sel.tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x) })} className={styles.checkbox} /><input className={styles.input} value={t.text} onChange={e => upd(sel.id, { tasks: sel.tasks.map(x => x.id === t.id ? { ...x, text: e.target.value } : x) })} placeholder="Task description..." style={{ flex: 1 }} /><button className={styles.deleteBtn} onClick={() => upd(sel.id, { tasks: sel.tasks.filter(x => x.id !== t.id) })}>×</button></div>)}
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Metrics to Monitor (#18)</label>
              <div className={styles.fieldRow}>
                <div className={styles.formGroup}><label>Views</label><input className={styles.input} type="number" value={sel.metrics.views} onChange={e => upd(sel.id, { metrics: { ...sel.metrics, views: Number(e.target.value) } })} /></div>
                <div className={styles.formGroup}><label>Clicks</label><input className={styles.input} type="number" value={sel.metrics.clicks} onChange={e => upd(sel.id, { metrics: { ...sel.metrics, clicks: Number(e.target.value) } })} /></div>
                <div className={styles.formGroup}><label>Conversions (#29)</label><input className={styles.input} type="number" value={sel.metrics.conversions} onChange={e => upd(sel.id, { metrics: { ...sel.metrics, conversions: Number(e.target.value) } })} /></div>
                <div className={styles.formGroup}><label>Revenue (#30)</label><input className={styles.input} type="number" value={sel.metrics.revenue} onChange={e => upd(sel.id, { metrics: { ...sel.metrics, revenue: Number(e.target.value) } })} /></div>
              </div>
            </div>
          </div>}
        </div>}

        {/* ═══ ANALYTICS (#21-30) ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data & Analytics</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Win Rate (#21)</div><div className={styles.kpiValue}>{stats.successRate}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active (#22)</div><div className={styles.kpiValue}>{stats.active}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Views</div><div className={styles.kpiValue}>{liveExps.reduce((s, e) => s + e.metrics.views, 0).toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Conversions</div><div className={styles.kpiValue}>{liveExps.reduce((s, e) => s + e.metrics.conversions, 0).toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Revenue</div><div className={styles.kpiValue}>${liveExps.reduce((s, e) => s + e.metrics.revenue, 0).toLocaleString()}</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Performance Comparison (#24-25)</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow7}`}><span className={styles.tableHeader}>Experiment</span><span className={styles.tableHeader}>Type</span><span className={styles.tableHeader}>Views</span><span className={styles.tableHeader}>Clicks</span><span className={styles.tableHeader}>Conv</span><span className={styles.tableHeader}>Rev</span><span className={styles.tableHeader}>Result</span></div>
              {liveExps.map(e => <div key={e.id} className={`${styles.tableRow} ${styles.tableRow7}`}>
                <span className={styles.tableCell}>{e.name}</span>
                <span className={styles.tableCell}><span className={styles.tag}>{e.type}</span></span>
                <span className={styles.tableCell}>{e.metrics.views.toLocaleString()}</span>
                <span className={styles.tableCell}>{e.metrics.clicks.toLocaleString()}</span>
                <span className={styles.tableCell}>{e.metrics.conversions}</span>
                <span className={styles.tableCell}>${e.metrics.revenue.toLocaleString()}</span>
                <span className={styles.tableCell}><span className={`${styles.resultBadge} ${styles[`res_${e.result}`]}`}>{e.result}</span></span>
              </div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>By Type (#25)</label>
            <div className={styles.kpiRow}>{EXP_TYPES.map(t => { const te = liveExps.filter(e => e.type === t); const wins = te.filter(e => e.result === 'positive').length; return <div key={t} className={styles.kpiCard}><div className={styles.kpiLabel}>{t}</div><div className={styles.kpiValue}>{te.length}</div><div className={styles.helperText}>{wins} wins · {te.length > 0 ? Math.round(wins / te.length * 100) : 0}% rate</div></div> })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>ROI Ranking (#30, #41)</label>
            <div className={styles.cardGrid}>{[...liveExps].sort((a, b) => b.metrics.revenue - a.metrics.revenue).slice(0, 6).map(e => <div key={e.id} className={styles.card} style={{ cursor: 'default' }}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{e.name}</span><span className={styles.scoreBadge}>{e.score}/100</span></div>
              <div className={styles.scoreRow}>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Revenue</span><span className={styles.scoreVal}>${e.metrics.revenue.toLocaleString()}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Conv</span><span className={styles.scoreVal}>{e.metrics.conversions}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>CTR</span><span className={styles.scoreVal}>{e.metrics.views > 0 ? (e.metrics.clicks / e.metrics.views * 100).toFixed(1) : 0}%</span></div>
              </div>
            </div>)}</div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const csv = `Experiment,Type,Status,Result,Score,Views,Clicks,Conversions,Revenue\n${liveExps.map(e => `"${e.name}",${e.type},${e.status},${e.result},${e.score},${e.metrics.views},${e.metrics.clicks},${e.metrics.conversions},${e.metrics.revenue}`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `experiments-${Date.now()}.csv`; a.click() }}>Export CSV (#28)</button>
            <button className={styles.exportBtn} onClick={() => { const d = `Growth Experiments Report\n${'='.repeat(40)}\nTotal: ${stats.total} | Active: ${stats.active} | Wins: ${stats.wins} | Losses: ${stats.losses}\nSuccess Rate: ${stats.successRate}%\nTotal Views: ${liveExps.reduce((s, e) => s + e.metrics.views, 0)}\nTotal Revenue: $${liveExps.reduce((s, e) => s + e.metrics.revenue, 0)}\n\n${'─'.repeat(40)}\n${liveExps.map(e => `${e.name} (${e.type}) — ${e.result} | Score: ${e.score} | Rev: $${e.metrics.revenue}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `growth-report-${Date.now()}.txt`; a.click() }}>Full Report</button>
          </div>
        </div>}

        {/* ═══ TEAM (#31-40) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team & Collaboration</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#31-32)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="gc_name" /><input className={styles.input} placeholder="Email" id="gc_email" /><select className={styles.select} id="gc_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><select className={styles.select} id="gc_exp"><option value="">Assign to experiment...</option>{liveExps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('gc_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('gc_email') as HTMLInputElement).value, role: (document.getElementById('gc_role') as HTMLSelectElement).value as Collaborator['role'], expId: (document.getElementById('gc_exp') as HTMLSelectElement).value }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => { const exp = experiments.find(e => e.id === c.expId); return <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span>{exp && <span className={styles.helperText}>→ {exp.name}</span>}<button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div> })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion (#33, #38)</label>
            <div className={styles.commentList}>{gComments.slice(0, 15).map(c => { const exp = experiments.find(e => e.id === c.expId); return <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}{exp ? ` on ${exp.name}` : ''}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div> })}</div>
            <div className={styles.inlineForm}><select className={styles.select} id="gc_cexp"><option value="">General</option>{liveExps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><input className={styles.input} placeholder="Add comment..." id="gc_cinput" style={{ flex: 1 }} /><button className={styles.ghostBtn} onClick={() => { const text = (document.getElementById('gc_cinput') as HTMLInputElement).value; if (text) { setGComments(prev => [{ id: uid(), expId: (document.getElementById('gc_cexp') as HTMLSelectElement).value, author: 'You', text, date: now() }, ...prev]); (document.getElementById('gc_cinput') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Approval Queue (#35)</label>
            {liveExps.filter(e => e.status === 'paused').map(e => <div key={e.id} className={styles.taskItem}><span className={styles.taskContent}>{e.name} — {e.type} — Score: {e.score}</span><button className={styles.ghostBtn} onClick={() => upd(e.id, { status: 'active' })}>Approve & Activate</button></div>)}
            {liveExps.filter(e => e.status === 'paused').length === 0 && <p className={styles.helperText}>No experiments pending approval.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Activity Feed (#37, #40)</label>
            <div className={styles.timeline}>{dashboard.activity.filter(a => a.type === 'experiment').slice(-10).reverse().map(a => <div key={a.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{a.title} — {fmtDate(a.timestamp)}</span></div>)}</div>
          </div>
        </div>}

        {/* ═══ ADVANCED (#41-50) ═══ */}
        {tab === 'advanced' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Advanced Intelligence</h2>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Experiment Rankings (#41)</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>#</span><span className={styles.tableHeader}>Experiment</span><span className={styles.tableHeader}>Score</span><span className={styles.tableHeader}>Result</span><span className={styles.tableHeader}>Revenue</span></div>
              {[...liveExps].sort((a, b) => b.score - a.score).map((e, i) => <div key={e.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{i + 1}</span><span className={styles.tableCell}>{e.name}</span><span className={styles.tableCell}><span className={styles.scoreBadge}>{e.score}</span></span><span className={styles.tableCell}><span className={`${styles.resultBadge} ${styles[`res_${e.result}`]}`}>{e.result}</span></span><span className={styles.tableCell}>${e.metrics.revenue.toLocaleString()}</span></div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Hypothesis History (#42)</label>
            {liveExps.slice(0, 8).map(e => <div key={e.id} className={styles.taskItem}><span className={styles.taskContent}><strong>{e.name}</strong>: {e.hypothesis}</span><span className={`${styles.resultBadge} ${styles[`res_${e.result}`]}`}>{e.result}</span></div>)}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Funnel Overview (#47)</label>
            <div className={styles.funnelChart}>
              {(() => { const totalV = Math.max(liveExps.reduce((s, e) => s + e.metrics.views, 0), 1); const totalCl = liveExps.reduce((s, e) => s + e.metrics.clicks, 0); const totalCo = liveExps.reduce((s, e) => s + e.metrics.conversions, 0); const totalRev = liveExps.reduce((s, e) => s + e.metrics.revenue, 0); return [{ label: 'Views', value: totalV, pct: 100 }, { label: 'Clicks', value: totalCl, pct: Math.round(totalCl / totalV * 100) }, { label: 'Conversions', value: totalCo, pct: Math.round(totalCo / totalV * 100) }, { label: 'Revenue', value: totalRev, pct: Math.min(Math.round(totalRev / totalV * 100), 100) }].map(f => <div key={f.label} className={styles.funnelStep}><div className={styles.funnelBar} style={{ width: `${Math.max(f.pct, 5)}%` }} /><span className={styles.funnelLabel}>{f.label}: {f.value.toLocaleString()} ({f.pct}%)</span></div>) })()}
            </div>
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>AI Advisory (#44, #48)</div>
            <pre className={styles.aiOutput}>{`Growth Intelligence\n${'─'.repeat(35)}\n• ${stats.total} experiments, ${stats.active} active\n• Win rate: ${stats.successRate}% (${stats.wins} wins / ${stats.losses} losses)\n• Total views: ${liveExps.reduce((s, e) => s + e.metrics.views, 0).toLocaleString()}\n• Total revenue: $${liveExps.reduce((s, e) => s + e.metrics.revenue, 0).toLocaleString()}\n• Avg score: ${liveExps.length ? Math.round(liveExps.reduce((s, e) => s + e.score, 0) / liveExps.length) : 0}/100\n• Top type: ${(() => { const counts = EXP_TYPES.map(t => ({ t, c: liveExps.filter(e => e.type === t && e.result === 'positive').length })); return counts.sort((a, b) => b.c - a.c)[0]?.t || 'N/A' })()}\n• ${liveExps.filter(e => e.riskLevel === 'high').length} high-risk experiments running\n• Recommendation: ${stats.successRate > 60 ? 'Scale winning experiment types.' : stats.active > 5 ? 'Focus on fewer high-impact tests.' : 'Increase experiment velocity.'}`}</pre>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Experiment Intelligence Report\n${'='.repeat(40)}\nTotal: ${stats.total} | Wins: ${stats.wins} | Success: ${stats.successRate}%\nViews: ${liveExps.reduce((s, e) => s + e.metrics.views, 0)} | Revenue: $${liveExps.reduce((s, e) => s + e.metrics.revenue, 0)}\n\nRankings:\n${[...liveExps].sort((a, b) => b.score - a.score).map((e, i) => `  ${i + 1}. ${e.name} (${e.type}) — Score: ${e.score} — ${e.result}`).join('\n')}\n\nHypotheses:\n${liveExps.map(e => `  ${e.name}: ${e.hypothesis} → ${e.result}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `growth-advanced-${Date.now()}.txt`; a.click() }}>Export Intelligence Report</button>
          </div>
        </div>}

      </main>
    </div>
  )
}

function ExpForm({ onAdd, onCancel }: { onAdd: (e: Experiment) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [hypothesis, setHypothesis] = useState('')
  const [type, setType] = useState<ExpType>('Marketing'); const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium')
  const [goals, setGoals] = useState(''); const [expected, setExpected] = useState('')
  return (
    <div className={styles.formPanel}><div className={styles.formStack}>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Experiment Name</label><input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., A/B Landing Page" /></div>
        <div className={styles.formGroup}><label>Type (#2)</label><select className={styles.select} value={type} onChange={e => setType(e.target.value as ExpType)}>{EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
      </div>
      <div className={styles.formGroup}><label>Hypothesis</label><textarea className={styles.textarea} rows={2} value={hypothesis} onChange={e => setHypothesis(e.target.value)} placeholder="We believe that..." /></div>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Goals</label><input className={styles.input} value={goals} onChange={e => setGoals(e.target.value)} placeholder="What are you trying to achieve?" /></div>
        <div className={styles.formGroup}><label>Expected Outcome</label><input className={styles.input} value={expected} onChange={e => setExpected(e.target.value)} placeholder="Expected result..." /></div>
        <div className={styles.formGroup}><label>Risk Level</label><select className={styles.select} value={risk} onChange={e => setRisk(e.target.value as typeof risk)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
      </div>
      <div className={styles.fieldRow}>
        <button className={styles.primaryBtn} onClick={() => { if (name && hypothesis) onAdd({ id: uid(), name, hypothesis, type, status: 'active', result: 'pending', riskLevel: risk, goals, kpis: '', expectedOutcome: expected, notes: '', variants: ['Control', 'Variant A'], metrics: { views: 0, clicks: 0, conversions: 0, revenue: 0 }, tasks: [], milestone: '', score: Math.floor(Math.random() * 30) + 50, archived: false, createdAt: now() }) }}>Create Experiment</button>
        <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div></div>
  )
}
