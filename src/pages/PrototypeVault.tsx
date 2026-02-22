import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './PrototypeVault.module.css'

type PVTab = 'prototypes' | 'details' | 'team' | 'analytics' | 'advanced'
type ProtoType = 'Clothing' | 'Product' | 'UI' | 'Visual Art' | 'Music' | '3D' | 'Other'
type ProtoStatus = 'draft' | 'testing' | 'approved' | 'archived'

interface Prototype {
  id: string; title: string; description: string; type: ProtoType
  status: ProtoStatus; projectLink: string; version: number; iterations: number
  tags: string[]; favorited: boolean; author: string; phase: string
  previewUrl: string; notes: string; successNotes: string; failureNotes: string
  views: number; interactions: number; createdAt: string
}
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string; protoId: string }
interface PVComment { id: string; protoId: string; author: string; text: string; date: string }
interface PVTask { id: string; protoId: string; text: string; assignee: string; done: boolean; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const PROTO_TYPES: ProtoType[] = ['Clothing', 'Product', 'UI', 'Visual Art', 'Music', '3D', 'Other']
const PHASES = ['Concept', 'Sketch', 'Digital Mock', 'Physical Sample', 'Testing', 'Final']

export function PrototypeVault() {
  const [tab, setTab] = useState<PVTab>('prototypes')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'version' | 'name'>('date')
  const [focusMode, setFocusMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const [prototypes, setPrototypes] = useCloudStorage<Prototype[]>('pv_protos', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('pv_collabs', [])
  const [comments, setComments] = useCloudStorage<PVComment[]>('pv_comments', [])
  const [tasks, setTasks] = useCloudStorage<PVTask[]>('pv_tasks', [])

  const liveProtos = useMemo(() => prototypes.filter(p => p.status !== 'archived'), [prototypes])
  const archivedProtos = useMemo(() => prototypes.filter(p => p.status === 'archived'), [prototypes])

  const filtered = useMemo(() => {
    let r = showArchived ? archivedProtos : liveProtos
    if (search) r = r.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (filterType) r = r.filter(p => p.type === filterType)
    if (filterStatus && !showArchived) r = r.filter(p => p.status === filterStatus)
    if (sortBy === 'version') r = [...r].sort((a, b) => b.version - a.version)
    else if (sortBy === 'name') r = [...r].sort((a, b) => a.title.localeCompare(b.title))
    else r = [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    r.sort((a, b) => (b.favorited ? 1 : 0) - (a.favorited ? 1 : 0))
    return r
  }, [liveProtos, archivedProtos, showArchived, search, filterType, filterStatus, sortBy])

  const sel = selectedId ? prototypes.find(p => p.id === selectedId) : null
  const upd = (id: string, patch: Partial<Prototype>) => setPrototypes(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))

  const tabs: [PVTab, string][] = [['prototypes', 'Prototypes'], ['details', 'Details'], ['team', 'Team'], ['analytics', 'Analytics'], ['advanced', 'Advanced']]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Prototype Vault</h1><p className={styles.subtitle}>Upload · Track · Compare · Iterate</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('prototypes'); setShowForm('proto') }}>+ New Prototype</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ PROTOTYPES (#1-10) ═══ */}
        {tab === 'prototypes' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{liveProtos.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Draft</div><div className={styles.kpiValue}>{liveProtos.filter(p => p.status === 'draft').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Testing</div><div className={styles.kpiValue}>{liveProtos.filter(p => p.status === 'testing').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Approved</div><div className={styles.kpiValue}>{liveProtos.filter(p => p.status === 'approved').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Iterations</div><div className={styles.kpiValue}>{liveProtos.reduce((s, p) => s + p.iterations, 0)}</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prototypes... (#9)" />
            <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option>{PROTO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
            <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">All Status</option><option value="draft">Draft</option><option value="testing">Testing</option><option value="approved">Approved</option></select>
            <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}><option value="date">Newest</option><option value="version">Version</option><option value="name">A-Z</option></select>
            <button className={styles.ghostBtn} onClick={() => setShowArchived(!showArchived)}>{showArchived ? 'Live' : 'Archived (#6)'}</button>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'proto' ? null : 'proto')}>+ Upload (#1)</button>
          </div>

          {showForm === 'proto' && <ProtoForm onAdd={p => { setPrototypes(prev => [p, ...prev]); setShowForm(null) }} onCancel={() => setShowForm(null)} />}

          <div className={styles.cardGrid}>{filtered.map(p => <div key={p.id} className={`${styles.card} ${selectedId === p.id ? styles.cardSelected : ''}`} onClick={() => { setSelectedId(selectedId === p.id ? null : p.id) }}>
            {p.previewUrl && <div className={styles.cardPreviewImg} style={{ backgroundImage: `url(${p.previewUrl})` }} />}
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{p.favorited ? '★ ' : ''}{p.title}</span>
                <span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.tag}>{p.type} (#3)</span>
                <span className={styles.tag}>v{p.version} (#4)</span>
                {p.phase && <span className={styles.tag}>{p.phase} (#47)</span>}
              </div>
              {p.tags.length > 0 && <div className={styles.cardMeta}>{p.tags.map(t => <span key={t} className={styles.tagSmall}>{t}</span>)}</div>}
              <div className={styles.scoreRow}>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Iterations (#5)</span><span className={styles.scoreVal}>{p.iterations}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Views (#22)</span><span className={styles.scoreVal}>{p.views}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Interactions</span><span className={styles.scoreVal}>{p.interactions}</span></div>
              </div>
              <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                <button className={styles.ghostBtn} onClick={() => upd(p.id, { favorited: !p.favorited })}>{p.favorited ? '★ Fav' : '☆ Fav (#10)'}</button>
                <button className={styles.ghostBtn} onClick={() => { setPrototypes(prev => [{ ...p, id: uid(), title: `${p.title} (Copy)`, version: 1, iterations: 1, status: 'draft', favorited: false, createdAt: now() }, ...prev]) }}>Dup (#7)</button>
                <button className={styles.ghostBtn} onClick={() => upd(p.id, { version: p.version + 1, iterations: p.iterations + 1 })}>+ Version</button>
                <button className={styles.ghostBtn} onClick={() => upd(p.id, { status: p.status === 'archived' ? 'draft' : 'archived' })}>{p.status === 'archived' ? 'Restore' : 'Archive (#6)'}</button>
                <button className={styles.deleteBtn} onClick={() => setPrototypes(prev => prev.filter(x => x.id !== p.id))}>×</button>
              </div>
            </div>
          </div>)}</div>
          {filtered.length === 0 && <p className={styles.emptyState}>{showArchived ? 'No archived prototypes.' : 'No prototypes yet. Upload your first one.'}</p>}
        </div>}

        {/* ═══ DETAILS (#2, #4, #24, #32, #41-45) ═══ */}
        {tab === 'details' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Prototype Details</h2>
          {!sel && <p className={styles.helperText}>Select a prototype from the Prototypes tab to view and edit its details.</p>}
          {sel && <div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Editing: {sel.title} (v{sel.version})</label>
              <div className={styles.formStack}>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Title (#2)</label><input className={styles.input} value={sel.title} onChange={e => upd(sel.id, { title: e.target.value })} /></div>
                  <div className={styles.formGroup}><label>Type (#3)</label><select className={styles.select} value={sel.type} onChange={e => upd(sel.id, { type: e.target.value as ProtoType })}>{PROTO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Project Link (#2, #48)</label><input className={styles.input} value={sel.projectLink} onChange={e => upd(sel.id, { projectLink: e.target.value })} placeholder="Link to project or launch..." /></div>
                  <div className={styles.formGroup}><label>Phase (#47)</label><select className={styles.select} value={sel.phase} onChange={e => upd(sel.id, { phase: e.target.value })}><option value="">Select...</option>{PHASES.map(ph => <option key={ph} value={ph}>{ph}</option>)}</select></div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Author (#45)</label><input className={styles.input} value={sel.author} onChange={e => upd(sel.id, { author: e.target.value })} /></div>
                  <div className={styles.formGroup}><label>Preview URL (#41)</label><input className={styles.input} value={sel.previewUrl} onChange={e => upd(sel.id, { previewUrl: e.target.value })} placeholder="Image or render URL" /></div>
                </div>
                <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={2} value={sel.description} onChange={e => upd(sel.id, { description: e.target.value })} /></div>
                <div className={styles.formGroup}><label>Tags (#8)</label><input className={styles.input} value={sel.tags.join(', ')} onChange={e => upd(sel.id, { tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="tag1, tag2" /></div>
                <div className={styles.formGroup}><label>Notes (#10)</label><textarea className={styles.textarea} rows={2} value={sel.notes} onChange={e => upd(sel.id, { notes: e.target.value })} /></div>
              </div>
            </div>

            <div className={styles.splitRow}>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Success Notes (#24)</label>
                <textarea className={styles.textarea} rows={2} value={sel.successNotes} onChange={e => upd(sel.id, { successNotes: e.target.value })} placeholder="What worked well?" />
              </div>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Failure Notes (#24)</label>
                <textarea className={styles.textarea} rows={2} value={sel.failureNotes} onChange={e => upd(sel.id, { failureNotes: e.target.value })} placeholder="What didn't work?" />
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Version History (#4, #43)</label>
              <div className={styles.timeline}>
                {Array.from({ length: sel.version }, (_, i) => <div key={i} className={styles.timelineItem}><span className={styles.timelineDot} /><span>Version {sel.version - i}{i === 0 ? ' (current)' : ''}</span></div>)}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Metrics (#22)</label>
              <div className={styles.fieldRow}>
                <div className={styles.formGroup}><label>Views</label><input className={styles.input} type="number" value={sel.views} onChange={e => upd(sel.id, { views: Number(e.target.value) })} /></div>
                <div className={styles.formGroup}><label>Interactions</label><input className={styles.input} type="number" value={sel.interactions} onChange={e => upd(sel.id, { interactions: Number(e.target.value) })} /></div>
              </div>
            </div>
          </div>}
        </div>}

        {/* ═══ TEAM (#11-20) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team & Collaboration</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#11-12)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="pvc_name" /><input className={styles.input} placeholder="Email" id="pvc_email" /><select className={styles.select} id="pvc_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><select className={styles.select} id="pvc_proto"><option value="">All prototypes</option>{liveProtos.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('pvc_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('pvc_email') as HTMLInputElement).value, role: (document.getElementById('pvc_role') as HTMLSelectElement).value as Collaborator['role'], protoId: (document.getElementById('pvc_proto') as HTMLSelectElement).value }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => { const pr = prototypes.find(p => p.id === c.protoId); return <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span>{pr && <span className={styles.helperText}>→ {pr.title}</span>}<button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div> })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion (#13)</label>
            <div className={styles.commentList}>{comments.slice(0, 15).map(c => { const pr = prototypes.find(p => p.id === c.protoId); return <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}{pr ? ` on ${pr.title}` : ''}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div> })}</div>
            <div className={styles.inlineForm}><select className={styles.select} id="pvc_cproto"><option value="">General</option>{liveProtos.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select><input className={styles.input} placeholder="Add comment..." id="pvc_comment" style={{ flex: 1 }} /><button className={styles.ghostBtn} onClick={() => { const t = (document.getElementById('pvc_comment') as HTMLInputElement).value; if (t) { setComments(prev => [{ id: uid(), protoId: (document.getElementById('pvc_cproto') as HTMLSelectElement).value, author: 'You', text: t, date: now() }, ...prev]); (document.getElementById('pvc_comment') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Approval Queue (#15)</label>
            {liveProtos.filter(p => p.status === 'testing').map(p => <div key={p.id} className={styles.taskItem}><span className={styles.taskContent}>{p.title} (v{p.version}) — {p.type}</span><button className={styles.ghostBtn} onClick={() => upd(p.id, { status: 'approved' })}>Approve</button></div>)}
            {liveProtos.filter(p => p.status === 'testing').length === 0 && <p className={styles.helperText}>No prototypes pending approval.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Tasks (#16)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'task' ? null : 'task')}>+ Task</button></div>
            {showForm === 'task' && <div className={styles.inlineForm}><select className={styles.select} id="pvt_proto"><option value="">General</option>{liveProtos.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select><input className={styles.input} placeholder="Task description" id="pvt_text" style={{ flex: 1 }} /><input className={styles.input} placeholder="Assignee" id="pvt_assign" /><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('pvt_text') as HTMLInputElement).value; if (t) { setTasks(prev => [...prev, { id: uid(), protoId: (document.getElementById('pvt_proto') as HTMLSelectElement).value, text: t, assignee: (document.getElementById('pvt_assign') as HTMLInputElement).value, done: false, date: now() }]); setShowForm(null) } }}>Add</button></div>}
            {tasks.map(t => { const pr = prototypes.find(p => p.id === t.protoId); return <div key={t.id} className={styles.taskItem}><input type="checkbox" checked={t.done} onChange={() => setTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))} className={styles.checkbox} /><span className={`${styles.taskContent} ${t.done ? styles.taskDone : ''}`}>{t.text}{t.assignee && ` — ${t.assignee}`}{pr && <span className={styles.helperText}> ({pr.title})</span>}</span><button className={styles.deleteBtn} onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))}>×</button></div> })}
          </div>
        </div>}

        {/* ═══ ANALYTICS (#21-30) ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics & Insights</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Prototypes</div><div className={styles.kpiValue}>{liveProtos.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Iterations (#21)</div><div className={styles.kpiValue}>{liveProtos.reduce((s, p) => s + p.iterations, 0)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Views (#22)</div><div className={styles.kpiValue}>{liveProtos.reduce((s, p) => s + p.views, 0).toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Approved</div><div className={styles.kpiValue}>{liveProtos.filter(p => p.status === 'approved').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Iterations</div><div className={styles.kpiValue}>{liveProtos.length ? (liveProtos.reduce((s, p) => s + p.iterations, 0) / liveProtos.length).toFixed(1) : 0}</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Performance Comparison (#23, #30)</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow6}`}><span className={styles.tableHeader}>Prototype</span><span className={styles.tableHeader}>Type</span><span className={styles.tableHeader}>Version</span><span className={styles.tableHeader}>Iterations</span><span className={styles.tableHeader}>Views</span><span className={styles.tableHeader}>Status</span></div>
              {liveProtos.map(p => <div key={p.id} className={`${styles.tableRow} ${styles.tableRow6}`}><span className={styles.tableCell}>{p.title}</span><span className={styles.tableCell}><span className={styles.tag}>{p.type}</span></span><span className={styles.tableCell}>v{p.version}</span><span className={styles.tableCell}>{p.iterations}</span><span className={styles.tableCell}>{p.views}</span><span className={styles.tableCell}><span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span></span></div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>By Type (#25)</label>
            <div className={styles.kpiRow}>{PROTO_TYPES.map(t => { const items = liveProtos.filter(p => p.type === t); return <div key={t} className={styles.kpiCard}><div className={styles.kpiLabel}>{t}</div><div className={styles.kpiValue}>{items.length}</div><div className={styles.helperText}>{items.reduce((s, p) => s + p.iterations, 0)} iterations</div></div> })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Evolution Timeline (#29)</label>
            <div className={styles.timeline}>{[...liveProtos].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(p => <div key={p.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{p.title} — v{p.version} — {fmtDate(p.createdAt)}</span><span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span></div>)}</div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const csv = `Prototype,Type,Version,Iterations,Views,Interactions,Status,Phase\n${liveProtos.map(p => `"${p.title}",${p.type},${p.version},${p.iterations},${p.views},${p.interactions},${p.status},${p.phase}`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `prototypes-${Date.now()}.csv`; a.click() }}>Export CSV (#28)</button>
            <button className={styles.exportBtn} onClick={() => { const d = `Prototype Vault Report\n${'='.repeat(40)}\nTotal: ${liveProtos.length} | Iterations: ${liveProtos.reduce((s, p) => s + p.iterations, 0)} | Views: ${liveProtos.reduce((s, p) => s + p.views, 0)}\n\n${liveProtos.map(p => `${p.title} (${p.type}) — v${p.version} — ${p.iterations} iterations — ${p.status}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `prototype-report-${Date.now()}.txt`; a.click() }}>Full Report</button>
          </div>
        </div>}

        {/* ═══ ADVANCED (#41-50) ═══ */}
        {tab === 'advanced' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Advanced Intelligence</h2>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Prototype Rankings</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>#</span><span className={styles.tableHeader}>Prototype</span><span className={styles.tableHeader}>Iterations</span><span className={styles.tableHeader}>Views</span><span className={styles.tableHeader}>Status</span></div>
              {[...liveProtos].sort((a, b) => (b.views + b.interactions) - (a.views + a.interactions)).map((p, i) => <div key={p.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{i + 1}</span><span className={styles.tableCell}>{p.title}</span><span className={styles.tableCell}>{p.iterations}</span><span className={styles.tableCell}>{p.views}</span><span className={styles.tableCell}><span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span></span></div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Side-by-Side Comparison (#44)</label>
            {liveProtos.length >= 2 ? <div className={styles.comparisonGrid}>
              {liveProtos.slice(0, 4).map(p => <div key={p.id} className={styles.comparisonCard}>
                {p.previewUrl && <div className={styles.compPreview} style={{ backgroundImage: `url(${p.previewUrl})` }} />}
                <span className={styles.cardTitle}>{p.title}</span>
                <span className={styles.helperText}>v{p.version} · {p.iterations} iter · {p.views} views</span>
                <span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span>
              </div>)}
            </div> : <p className={styles.helperText}>Add at least 2 prototypes to compare.</p>}
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>AI Advisory (#42)</div>
            <pre className={styles.aiOutput}>{`Prototype Vault Intelligence\n${'─'.repeat(35)}\n• ${liveProtos.length} prototypes, ${archivedProtos.length} archived\n• Total iterations: ${liveProtos.reduce((s, p) => s + p.iterations, 0)}\n• Avg iterations: ${liveProtos.length ? (liveProtos.reduce((s, p) => s + p.iterations, 0) / liveProtos.length).toFixed(1) : 0}\n• Total views: ${liveProtos.reduce((s, p) => s + p.views, 0).toLocaleString()}\n• ${liveProtos.filter(p => p.status === 'approved').length} approved, ${liveProtos.filter(p => p.status === 'testing').length} testing\n• Most iterated: ${liveProtos.length ? [...liveProtos].sort((a, b) => b.iterations - a.iterations)[0]?.title || 'N/A' : 'N/A'}\n• Top type: ${(() => { const c: Record<string, number> = {}; liveProtos.forEach(p => c[p.type] = (c[p.type] || 0) + 1); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' })()}\n• ${tasks.filter(t => !t.done).length} open tasks\n• Recommendation: ${liveProtos.filter(p => p.status === 'testing').length > 3 ? 'Focus on completing testing before starting new prototypes.' : liveProtos.length < 3 ? 'Start adding prototypes to build your vault.' : 'Good velocity. Push testing prototypes to approval.'}`}</pre>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Notifications Summary (#49)</label>
            <div className={styles.timeline}>
              {liveProtos.filter(p => p.status === 'testing').map(p => <div key={p.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{p.title} is awaiting approval</span></div>)}
              {tasks.filter(t => !t.done).slice(0, 5).map(t => <div key={t.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>Task: {t.text}{t.assignee && ` (${t.assignee})`}</span></div>)}
              {liveProtos.filter(p => p.status === 'testing').length === 0 && tasks.filter(t => !t.done).length === 0 && <p className={styles.helperText}>All clear — no pending items.</p>}
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Prototype Intelligence Report\n${'='.repeat(40)}\nTotal: ${liveProtos.length} | Iterations: ${liveProtos.reduce((s, p) => s + p.iterations, 0)} | Views: ${liveProtos.reduce((s, p) => s + p.views, 0)}\nApproved: ${liveProtos.filter(p => p.status === 'approved').length} | Testing: ${liveProtos.filter(p => p.status === 'testing').length}\n\nRankings:\n${[...liveProtos].sort((a, b) => b.iterations - a.iterations).map((p, i) => `  ${i + 1}. ${p.title} (${p.type}) — v${p.version} — ${p.iterations} iter — ${p.status}`).join('\n')}\n\nNotes:\n${liveProtos.filter(p => p.successNotes || p.failureNotes).map(p => `  ${p.title}: ${p.successNotes ? `✓ ${p.successNotes}` : ''} ${p.failureNotes ? `✗ ${p.failureNotes}` : ''}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `prototype-intelligence-${Date.now()}.txt`; a.click() }}>Export Intelligence Report (#46)</button>
          </div>
        </div>}

      </main>
    </div>
  )
}

function ProtoForm({ onAdd, onCancel }: { onAdd: (p: Prototype) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(''); const [desc, setDesc] = useState('')
  const [type, setType] = useState<ProtoType>('Product'); const [project, setProject] = useState('')
  const [phase, setPhase] = useState(''); const [preview, setPreview] = useState('')
  const [tags, setTags] = useState(''); const [author, setAuthor] = useState('')
  return (
    <div className={styles.formPanel}><div className={styles.formStack}>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Title (#2)</label><input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Prototype name" /></div>
        <div className={styles.formGroup}><label>Type (#3)</label><select className={styles.select} value={type} onChange={e => setType(e.target.value as ProtoType)}>{PROTO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Project Link (#2)</label><input className={styles.input} value={project} onChange={e => setProject(e.target.value)} placeholder="Link to project..." /></div>
        <div className={styles.formGroup}><label>Phase (#47)</label><select className={styles.select} value={phase} onChange={e => setPhase(e.target.value)}><option value="">Select...</option>{PHASES.map(ph => <option key={ph} value={ph}>{ph}</option>)}</select></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Preview URL (#1, #41)</label><input className={styles.input} value={preview} onChange={e => setPreview(e.target.value)} placeholder="Image or render URL" /></div>
        <div className={styles.formGroup}><label>Author (#45)</label><input className={styles.input} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Creator name" /></div>
      </div>
      <div className={styles.formGroup}><label>Tags (#8)</label><input className={styles.input} value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2, tag3" /></div>
      <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe this prototype..." /></div>
      <div className={styles.fieldRow}>
        <button className={styles.primaryBtn} onClick={() => { if (title) onAdd({ id: uid(), title, description: desc, type, status: 'draft', projectLink: project, version: 1, iterations: 1, tags: tags.split(',').map(s => s.trim()).filter(Boolean), favorited: false, author, phase, previewUrl: preview, notes: '', successNotes: '', failureNotes: '', views: 0, interactions: 0, createdAt: now() }) }}>Upload Prototype</button>
        <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div></div>
  )
}
