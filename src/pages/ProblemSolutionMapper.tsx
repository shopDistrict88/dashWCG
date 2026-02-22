import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './ProblemSolutionMapper.module.css'

type PSTab = 'challenges' | 'solutions' | 'analysis' | 'team' | 'strategy'
type Severity = 'low' | 'medium' | 'high' | 'critical'
type ChallengeStatus = 'open' | 'exploring' | 'solved' | 'archived'
type SolutionStatus = 'proposed' | 'testing' | 'implemented' | 'rejected'

interface Challenge {
  id: string; title: string; description: string; category: string
  severity: Severity; status: ChallengeStatus; impact: number
  projectLink: string; tags: string[]; createdAt: string
}
interface Solution {
  id: string; challengeId: string; title: string; description: string
  status: SolutionStatus; effort: 'low' | 'medium' | 'high'; effectiveness: number
  cost: string; timeline: string; notes: string; createdAt: string
}
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface PSComment { id: string; targetId: string; author: string; text: string; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const CATEGORIES = ['Design', 'Production', 'UX', 'Marketing', 'Technical', 'Business', 'Sustainability', 'Supply Chain']

export function ProblemSolutionMapper() {
  const [tab, setTab] = useState<PSTab>('challenges')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')
  const [focusMode, setFocusMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [challenges, setChallenges] = useCloudStorage<Challenge[]>('psm_challenges', [])
  const [solutions, setSolutions] = useCloudStorage<Solution[]>('psm_solutions', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('psm_collabs', [])
  const [comments, setComments] = useCloudStorage<PSComment[]>('psm_comments', [])

  const liveChals = useMemo(() => challenges.filter(c => c.status !== 'archived'), [challenges])

  const filtered = useMemo(() => {
    let r = [...liveChals]
    if (search) r = r.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (filterCat) r = r.filter(c => c.category === filterCat)
    if (filterSeverity) r = r.filter(c => c.severity === filterSeverity)
    r.sort((a, b) => { const sev: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 }; return (sev[b.severity] || 0) - (sev[a.severity] || 0) })
    return r
  }, [liveChals, search, filterCat, filterSeverity])

  const sel = selectedId ? challenges.find(c => c.id === selectedId) : null
  const selSolutions = selectedId ? solutions.filter(s => s.challengeId === selectedId) : []
  const updChal = (id: string, patch: Partial<Challenge>) => setChallenges(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))

  const solveRate = useMemo(() => { const done = challenges.filter(c => c.status === 'solved').length; return challenges.length ? Math.round(done / challenges.length * 100) : 0 }, [challenges])

  const tabs: [PSTab, string][] = [['challenges', 'Challenges'], ['solutions', 'Solutions'], ['analysis', 'Analysis'], ['team', 'Team'], ['strategy', 'Strategy']]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Problem–Solution Mapper</h1><p className={styles.subtitle}>Design Challenges & Creative Solutions</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('challenges'); setShowForm('challenge') }}>+ New Challenge</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ CHALLENGES ═══ */}
        {tab === 'challenges' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Open</div><div className={styles.kpiValue}>{liveChals.filter(c => c.status === 'open').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Exploring</div><div className={styles.kpiValue}>{liveChals.filter(c => c.status === 'exploring').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Solved</div><div className={styles.kpiValue}>{challenges.filter(c => c.status === 'solved').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Solutions</div><div className={styles.kpiValue}>{solutions.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Solve Rate</div><div className={styles.kpiValue}>{solveRate}%</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search challenges..." />
            <select className={styles.select} value={filterCat} onChange={e => setFilterCat(e.target.value)}><option value="">All Categories</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select className={styles.select} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}><option value="">All Severity</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'challenge' ? null : 'challenge')}>+ Challenge</button>
          </div>

          {showForm === 'challenge' && <div className={styles.formPanel}><div className={styles.formStack}>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Challenge</label><input className={styles.input} id="ch_title" placeholder="e.g., Weather adaptability" /></div>
              <div className={styles.formGroup}><label>Category</label><select className={styles.select} id="ch_cat">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Severity</label><select className={styles.select} id="ch_sev"><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option><option value="low">Low</option></select></div>
              <div className={styles.formGroup}><label>Impact (0-100)</label><input className={styles.input} type="number" id="ch_imp" placeholder="70" /></div>
            </div>
            <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={2} id="ch_desc" placeholder="Describe the design challenge..." /></div>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Project Link</label><input className={styles.input} id="ch_proj" placeholder="Linked project..." /></div>
              <div className={styles.formGroup}><label>Tags</label><input className={styles.input} id="ch_tags" placeholder="tag1, tag2" /></div>
            </div>
            <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ch_title') as HTMLInputElement).value; if (t) { setChallenges(prev => [{ id: uid(), title: t, description: (document.getElementById('ch_desc') as HTMLTextAreaElement).value, category: (document.getElementById('ch_cat') as HTMLSelectElement).value, severity: (document.getElementById('ch_sev') as HTMLSelectElement).value as Severity, status: 'open', impact: Number((document.getElementById('ch_imp') as HTMLInputElement).value) || 50, projectLink: (document.getElementById('ch_proj') as HTMLInputElement).value, tags: (document.getElementById('ch_tags') as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean), createdAt: now() }, ...prev]); setShowForm(null) } }}>Create</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
          </div></div>}

          <div className={styles.cardGrid}>{filtered.map(c => {
            const cSols = solutions.filter(s => s.challengeId === c.id)
            const implemented = cSols.filter(s => s.status === 'implemented').length
            return <div key={c.id} className={`${styles.card} ${selectedId === c.id ? styles.cardSelected : ''}`} onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{c.title}</span>
                <span className={`${styles.sevBadge} ${styles[`sev_${c.severity}`]}`}>{c.severity}</span>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.tag}>{c.category}</span>
                <span className={`${styles.statusBadge} ${styles[`st_${c.status}`]}`}>{c.status}</span>
              </div>
              {c.tags.length > 0 && <div className={styles.cardMeta}>{c.tags.map(t => <span key={t} className={styles.tagSmall}>{t}</span>)}</div>}
              {c.description && <p className={styles.cardPreview}>{c.description.slice(0, 100)}</p>}
              <div className={styles.scoreRow}>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Impact</span><span className={styles.scoreVal}>{c.impact}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Solutions</span><span className={styles.scoreVal}>{cSols.length}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Implemented</span><span className={styles.scoreVal}>{implemented}</span></div>
              </div>
              <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                <select className={styles.miniSelect} value={c.status} onChange={e => updChal(c.id, { status: e.target.value as ChallengeStatus })}><option value="open">Open</option><option value="exploring">Exploring</option><option value="solved">Solved</option><option value="archived">Archived</option></select>
                <button className={styles.ghostBtn} onClick={() => { setChallenges(prev => [{ ...c, id: uid(), title: `${c.title} (Copy)`, status: 'open', createdAt: now() }, ...prev]) }}>Dup</button>
                <button className={styles.deleteBtn} onClick={() => { setChallenges(prev => prev.filter(x => x.id !== c.id)); setSolutions(prev => prev.filter(s => s.challengeId !== c.id)) }}>×</button>
              </div>
            </div>
          })}</div>
          {filtered.length === 0 && <p className={styles.emptyState}>No challenges yet. Create your first design challenge above.</p>}
        </div>}

        {/* ═══ SOLUTIONS ═══ */}
        {tab === 'solutions' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Creative Solutions</h2>
          {!sel && <p className={styles.helperText}>Select a challenge from the Challenges tab, then return here to map solutions to it.</p>}
          {sel && <div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Challenge: {sel.title}</label>
              <div className={styles.cardMeta}><span className={styles.tag}>{sel.category}</span><span className={`${styles.sevBadge} ${styles[`sev_${sel.severity}`]}`}>{sel.severity}</span><span className={`${styles.statusBadge} ${styles[`st_${sel.status}`]}`}>{sel.status}</span></div>
              {sel.description && <p className={styles.cardPreview}>{sel.description}</p>}
            </div>

            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Mapped Solutions ({selSolutions.length})</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'solution' ? null : 'solution')}>+ Add Solution</button></div>
              {showForm === 'solution' && <div className={styles.formPanel}><div className={styles.formStack}>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Solution</label><input className={styles.input} id="sol_title" placeholder="e.g., Modular layering system" /></div>
                  <div className={styles.formGroup}><label>Effort</label><select className={styles.select} id="sol_eff"><option value="medium">Medium</option><option value="low">Low</option><option value="high">High</option></select></div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Cost Estimate</label><input className={styles.input} id="sol_cost" placeholder="$500" /></div>
                  <div className={styles.formGroup}><label>Timeline</label><input className={styles.input} id="sol_time" placeholder="2 weeks" /></div>
                  <div className={styles.formGroup}><label>Effectiveness (0-100)</label><input className={styles.input} type="number" id="sol_eff_score" placeholder="75" /></div>
                </div>
                <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={2} id="sol_desc" placeholder="How does this solve the challenge?" /></div>
                <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('sol_title') as HTMLInputElement).value; if (t) { setSolutions(prev => [...prev, { id: uid(), challengeId: sel.id, title: t, description: (document.getElementById('sol_desc') as HTMLTextAreaElement).value, status: 'proposed', effort: (document.getElementById('sol_eff') as HTMLSelectElement).value as Solution['effort'], effectiveness: Number((document.getElementById('sol_eff_score') as HTMLInputElement).value) || 50, cost: (document.getElementById('sol_cost') as HTMLInputElement).value, timeline: (document.getElementById('sol_time') as HTMLInputElement).value, notes: '', createdAt: now() }]); setShowForm(null) } }}>Add</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
              </div></div>}

              <div className={styles.solutionList}>{selSolutions.map(s => <div key={s.id} className={styles.solutionCard}>
                <div className={styles.cardHeader}><span className={styles.cardTitle}>{s.title}</span><span className={`${styles.statusBadge} ${styles[`sst_${s.status}`]}`}>{s.status}</span></div>
                <div className={styles.cardMeta}><span className={styles.tag}>{s.effort} effort</span>{s.cost && <span className={styles.tag}>{s.cost}</span>}{s.timeline && <span className={styles.tag}>{s.timeline}</span>}</div>
                {s.description && <p className={styles.cardPreview}>{s.description}</p>}
                <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${s.effectiveness}%` }} /></div><span className={styles.meterLabel}>{s.effectiveness}% effective</span></div>
                <div className={styles.cardActions}>
                  <select className={styles.miniSelect} value={s.status} onChange={e => setSolutions(prev => prev.map(x => x.id === s.id ? { ...x, status: e.target.value as SolutionStatus } : x))}><option value="proposed">Proposed</option><option value="testing">Testing</option><option value="implemented">Implemented</option><option value="rejected">Rejected</option></select>
                  <input type="range" min={0} max={100} value={s.effectiveness} onChange={e => setSolutions(prev => prev.map(x => x.id === s.id ? { ...x, effectiveness: Number(e.target.value) } : x))} className={styles.range} style={{ flex: 1 }} />
                  <button className={styles.deleteBtn} onClick={() => setSolutions(prev => prev.filter(x => x.id !== s.id))}>×</button>
                </div>
              </div>)}</div>
              {selSolutions.length === 0 && <p className={styles.helperText}>No solutions mapped yet. Add the first one above.</p>}
            </div>

            {selSolutions.length >= 2 && <div className={styles.dnaBlock}>
              <label className={styles.label}>Solution Comparison</label>
              <div className={styles.tableWrap}>
                <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>Solution</span><span className={styles.tableHeader}>Effort</span><span className={styles.tableHeader}>Effectiveness</span><span className={styles.tableHeader}>Cost</span><span className={styles.tableHeader}>Status</span></div>
                {selSolutions.map(s => <div key={s.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{s.title}</span><span className={styles.tableCell}><span className={styles.tag}>{s.effort}</span></span><span className={styles.tableCell}>{s.effectiveness}%</span><span className={styles.tableCell}>{s.cost || '—'}</span><span className={styles.tableCell}><span className={`${styles.statusBadge} ${styles[`sst_${s.status}`]}`}>{s.status}</span></span></div>)}
              </div>
            </div>}
          </div>}

          {!sel && liveChals.length > 0 && <div className={styles.dnaBlock}>
            <label className={styles.label}>All Solutions Overview</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>Challenge</span><span className={styles.tableHeader}>Solution</span><span className={styles.tableHeader}>Effectiveness</span><span className={styles.tableHeader}>Effort</span><span className={styles.tableHeader}>Status</span></div>
              {solutions.map(s => { const ch = challenges.find(c => c.id === s.challengeId); return <div key={s.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{ch?.title || '—'}</span><span className={styles.tableCell}>{s.title}</span><span className={styles.tableCell}>{s.effectiveness}%</span><span className={styles.tableCell}><span className={styles.tag}>{s.effort}</span></span><span className={styles.tableCell}><span className={`${styles.statusBadge} ${styles[`sst_${s.status}`]}`}>{s.status}</span></span></div> })}
            </div>
          </div>}
        </div>}

        {/* ═══ ANALYSIS ═══ */}
        {tab === 'analysis' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analysis & Insights</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Challenges</div><div className={styles.kpiValue}>{challenges.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Solutions</div><div className={styles.kpiValue}>{solutions.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Solve Rate</div><div className={styles.kpiValue}>{solveRate}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Implemented</div><div className={styles.kpiValue}>{solutions.filter(s => s.status === 'implemented').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Effectiveness</div><div className={styles.kpiValue}>{solutions.length ? Math.round(solutions.reduce((s, x) => s + x.effectiveness, 0) / solutions.length) : 0}%</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>By Category</label>
            <div className={styles.kpiRow}>{CATEGORIES.map(cat => { const items = challenges.filter(c => c.category === cat); const solved = items.filter(c => c.status === 'solved').length; return items.length > 0 ? <div key={cat} className={styles.kpiCard}><div className={styles.kpiLabel}>{cat}</div><div className={styles.kpiValue}>{items.length}</div><div className={styles.helperText}>{solved} solved</div></div> : null })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>By Severity</label>
            <div className={styles.kpiRow}>
              {(['critical', 'high', 'medium', 'low'] as Severity[]).map(sev => { const items = challenges.filter(c => c.severity === sev); return <div key={sev} className={styles.kpiCard}><div className={styles.kpiLabel}>{sev}</div><div className={styles.kpiValue}>{items.length}</div><div className={styles.helperText}>{items.filter(c => c.status === 'solved').length} solved</div></div> })}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Impact Ranking</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>#</span><span className={styles.tableHeader}>Challenge</span><span className={styles.tableHeader}>Impact</span><span className={styles.tableHeader}>Severity</span><span className={styles.tableHeader}>Solutions</span></div>
              {[...liveChals].sort((a, b) => b.impact - a.impact).map((c, i) => <div key={c.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{i + 1}</span><span className={styles.tableCell}>{c.title}</span><span className={styles.tableCell}>{c.impact}</span><span className={styles.tableCell}><span className={`${styles.sevBadge} ${styles[`sev_${c.severity}`]}`}>{c.severity}</span></span><span className={styles.tableCell}>{solutions.filter(s => s.challengeId === c.id).length}</span></div>)}
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const csv = `Challenge,Category,Severity,Impact,Status,Solutions\n${challenges.map(c => `"${c.title}",${c.category},${c.severity},${c.impact},${c.status},${solutions.filter(s => s.challengeId === c.id).length}`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `challenges-${Date.now()}.csv`; a.click() }}>Export CSV</button>
            <button className={styles.exportBtn} onClick={() => { const d = `Problem–Solution Map Report\n${'='.repeat(40)}\nChallenges: ${challenges.length} | Solutions: ${solutions.length} | Solve Rate: ${solveRate}%\n\n${challenges.map(c => { const cs = solutions.filter(s => s.challengeId === c.id); return `[${c.severity.toUpperCase()}] ${c.title} (${c.category}) — ${c.status}\n  Impact: ${c.impact} | Solutions: ${cs.length}\n${cs.map(s => `  → ${s.title} (${s.status}) — ${s.effectiveness}% effective`).join('\n')}` }).join('\n\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `psm-report-${Date.now()}.txt`; a.click() }}>Full Report</button>
          </div>
        </div>}

        {/* ═══ TEAM ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team & Collaboration</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="psc_name" /><input className={styles.input} placeholder="Email" id="psc_email" /><select className={styles.select} id="psc_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('psc_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('psc_email') as HTMLInputElement).value, role: (document.getElementById('psc_role') as HTMLSelectElement).value as Collaborator['role'] }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion</label>
            <div className={styles.commentList}>{comments.slice(0, 15).map(c => { const ch = challenges.find(x => x.id === c.targetId); return <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}{ch ? ` on ${ch.title}` : ''}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div> })}</div>
            <div className={styles.inlineForm}><select className={styles.select} id="psc_target"><option value="">General</option>{liveChals.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select><input className={styles.input} placeholder="Add comment..." id="psc_input" style={{ flex: 1 }} /><button className={styles.ghostBtn} onClick={() => { const t = (document.getElementById('psc_input') as HTMLInputElement).value; if (t) { setComments(prev => [{ id: uid(), targetId: (document.getElementById('psc_target') as HTMLSelectElement).value, author: 'You', text: t, date: now() }, ...prev]); (document.getElementById('psc_input') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Archived Challenges</label>
            <div className={styles.cardGrid}>{challenges.filter(c => c.status === 'archived').map(c => <div key={c.id} className={styles.card} style={{ cursor: 'default' }}><span className={styles.cardTitle}>{c.title}</span><span className={styles.tag}>{c.category}</span><button className={styles.ghostBtn} onClick={() => updChal(c.id, { status: 'open' })}>Restore</button></div>)}</div>
            {challenges.filter(c => c.status === 'archived').length === 0 && <p className={styles.helperText}>No archived challenges.</p>}
          </div>
        </div>}

        {/* ═══ STRATEGY ═══ */}
        {tab === 'strategy' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Strategic Intelligence</h2>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Priority Matrix</label>
            <div className={styles.matrixGrid}>
              <div className={styles.matrixQuadrant}><span className={styles.matrixLabel}>High Impact · High Severity</span>{liveChals.filter(c => c.impact >= 60 && (c.severity === 'critical' || c.severity === 'high')).map(c => <span key={c.id} className={styles.matrixItem}>{c.title}</span>)}</div>
              <div className={styles.matrixQuadrant}><span className={styles.matrixLabel}>High Impact · Low Severity</span>{liveChals.filter(c => c.impact >= 60 && (c.severity === 'low' || c.severity === 'medium')).map(c => <span key={c.id} className={styles.matrixItem}>{c.title}</span>)}</div>
              <div className={styles.matrixQuadrant}><span className={styles.matrixLabel}>Low Impact · High Severity</span>{liveChals.filter(c => c.impact < 60 && (c.severity === 'critical' || c.severity === 'high')).map(c => <span key={c.id} className={styles.matrixItem}>{c.title}</span>)}</div>
              <div className={styles.matrixQuadrant}><span className={styles.matrixLabel}>Low Impact · Low Severity</span>{liveChals.filter(c => c.impact < 60 && (c.severity === 'low' || c.severity === 'medium')).map(c => <span key={c.id} className={styles.matrixItem}>{c.title}</span>)}</div>
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Best Solutions Ranking</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>#</span><span className={styles.tableHeader}>Solution</span><span className={styles.tableHeader}>Challenge</span><span className={styles.tableHeader}>Effectiveness</span><span className={styles.tableHeader}>Effort</span></div>
              {[...solutions].sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 10).map((s, i) => { const ch = challenges.find(c => c.id === s.challengeId); return <div key={s.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{i + 1}</span><span className={styles.tableCell}>{s.title}</span><span className={styles.tableCell}>{ch?.title || '—'}</span><span className={styles.tableCell}>{s.effectiveness}%</span><span className={styles.tableCell}><span className={styles.tag}>{s.effort}</span></span></div> })}
            </div>
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>AI Strategy Advisory</div>
            <pre className={styles.aiOutput}>{`Problem–Solution Intelligence\n${'─'.repeat(35)}\n• ${challenges.length} challenges mapped, ${solutions.length} solutions proposed\n• Solve rate: ${solveRate}%\n• ${challenges.filter(c => c.severity === 'critical').length} critical, ${challenges.filter(c => c.severity === 'high').length} high severity\n• ${solutions.filter(s => s.status === 'implemented').length} solutions implemented\n• Avg effectiveness: ${solutions.length ? Math.round(solutions.reduce((s, x) => s + x.effectiveness, 0) / solutions.length) : 0}%\n• Avg impact: ${liveChals.length ? Math.round(liveChals.reduce((s, c) => s + c.impact, 0) / liveChals.length) : 0}/100\n• Unsolved critical: ${challenges.filter(c => c.severity === 'critical' && c.status !== 'solved').length}\n• Recommendation: ${challenges.filter(c => c.severity === 'critical' && c.status !== 'solved').length > 0 ? 'Address critical challenges first.' : solveRate < 50 ? 'Increase solution velocity — map more creative approaches.' : 'Strong progress. Focus on implementing proposed solutions.'}`}</pre>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Strategy Report\n${'='.repeat(40)}\nChallenges: ${challenges.length} | Solutions: ${solutions.length} | Solve Rate: ${solveRate}%\n\nPriority Matrix:\n  Critical/High Impact: ${liveChals.filter(c => c.impact >= 60 && (c.severity === 'critical' || c.severity === 'high')).map(c => c.title).join(', ') || 'None'}\n\nTop Solutions:\n${[...solutions].sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 5).map((s, i) => `  ${i + 1}. ${s.title} — ${s.effectiveness}% effective`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `psm-strategy-${Date.now()}.txt`; a.click() }}>Export Strategy Report</button>
          </div>
        </div>}

      </main>
    </div>
  )
}
