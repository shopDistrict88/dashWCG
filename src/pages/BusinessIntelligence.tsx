import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './BusinessIntelligence.module.css'

type BITab = 'signals' | 'analytics' | 'strategy' | 'team' | 'advanced'
type SignalType = 'Market' | 'Pricing' | 'Cultural' | 'Competitive' | 'Trend'
type Trajectory = 'Rising' | 'Stable' | 'Falling'

interface Signal {
  id: string; title: string; type: SignalType; description: string
  strength: number; trajectory: Trajectory; confidence: number
  projectLink: string; tags: string[]; source: string
  archived: boolean; createdAt: string
}
interface SigComment { id: string; signalId: string; author: string; text: string; date: string }
interface SigTask { id: string; signalId: string; text: string; assignee: string; done: boolean }
interface Collaborator { id: string; name: string; role: 'owner' | 'analyst' | 'viewer'; email: string }
interface Alert { id: string; signalId: string; message: string; date: string; read: boolean }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const SIGNAL_TYPES: SignalType[] = ['Market', 'Pricing', 'Cultural', 'Competitive', 'Trend']

export function BusinessIntelligence() {
  const [tab, setTab] = useState<BITab>('signals')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [sortBy, setSortBy] = useState<'strength' | 'trajectory' | 'confidence' | 'date'>('strength')
  const [focusMode, setFocusMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [favArr, setFavArr] = useCloudStorage<string[]>('bi_favs', [])
  const favorites = useMemo(() => new Set(favArr), [favArr])

  const [signals, setSignals] = useCloudStorage<Signal[]>('bi_signals', [])
  const [comments, setComments] = useCloudStorage<SigComment[]>('bi_comments', [])
  const [tasks, setTasks] = useCloudStorage<SigTask[]>('bi_tasks', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('bi_collabs', [])
  const [alerts, setAlerts] = useCloudStorage<Alert[]>('bi_alerts', [])

  const live = useMemo(() => signals.filter(s => !s.archived), [signals])

  const filtered = useMemo(() => {
    let r = [...live]
    if (search) r = r.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (filterType) r = r.filter(s => s.type === filterType)
    const favArr = [...favorites]
    r.sort((a, b) => {
      const fa = favArr.includes(a.id) ? 1 : 0, fb = favArr.includes(b.id) ? 1 : 0
      if (fb !== fa) return fb - fa
      if (sortBy === 'strength') return b.strength - a.strength
      if (sortBy === 'confidence') return b.confidence - a.confidence
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      const traj: Record<string, number> = { Rising: 3, Stable: 2, Falling: 1 }
      return (traj[b.trajectory] || 0) - (traj[a.trajectory] || 0)
    })
    return r
  }, [live, search, filterType, sortBy, favorites])

  const sel = selectedId ? signals.find(s => s.id === selectedId) : null
  const toggleFav = (id: string) => setFavArr(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const avgStr = live.length ? Math.round(live.reduce((s, x) => s + x.strength, 0) / live.length) : 0
  const avgConf = live.length ? Math.round(live.reduce((s, x) => s + x.confidence, 0) / live.length) : 0
  const risingCount = live.filter(s => s.trajectory === 'Rising').length

  const addAlert = (signalId: string, message: string) => setAlerts(p => [{ id: uid(), signalId, message, date: now(), read: false }, ...p])

  const tabs: [BITab, string][] = [['signals', 'Signals'], ['analytics', 'Analytics'], ['strategy', 'Strategy'], ['team', 'Team'], ['advanced', 'Advanced']]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Business Intelligence Hub</h1><p className={styles.subtitle}>Market Signals · Pricing Psychology · Cultural Timing · Strategic Insight</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('signals'); setShowForm('signal') }}>+ New Signal</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
          {alerts.filter(a => !a.read).length > 0 && <span className={styles.alertBadge}>{alerts.filter(a => !a.read).length}</span>}
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ SIGNALS ═══ */}
        {tab === 'signals' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active</div><div className={styles.kpiValue}>{live.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Rising</div><div className={styles.kpiValue}>{risingCount}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Strength</div><div className={styles.kpiValue}>{avgStr}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Confidence</div><div className={styles.kpiValue}>{avgConf}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Favorites</div><div className={styles.kpiValue}>{favorites.size}</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search signals or tags..." />
            <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option>{SIGNAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
            <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}><option value="strength">Sort: Strength</option><option value="trajectory">Sort: Trajectory</option><option value="confidence">Sort: Confidence</option><option value="date">Sort: Newest</option></select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'signal' ? null : 'signal')}>+ Signal</button>
          </div>

          {showForm === 'signal' && <div className={styles.formPanel}><div className={styles.formStack}>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Title</label><input className={styles.input} id="bs_title" placeholder="Signal title..." /></div>
              <div className={styles.formGroup}><label>Type</label><select className={styles.select} id="bs_type">{SIGNAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div className={styles.formGroup}><label>Description / Context</label><textarea className={styles.textarea} rows={2} id="bs_desc" placeholder="Describe the signal..." /></div>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Strength (0-100)</label><input className={styles.input} type="number" id="bs_str" placeholder="70" /></div>
              <div className={styles.formGroup}><label>Trajectory</label><select className={styles.select} id="bs_traj"><option>Rising</option><option>Stable</option><option>Falling</option></select></div>
              <div className={styles.formGroup}><label>Confidence (0-100)</label><input className={styles.input} type="number" id="bs_conf" placeholder="80" /></div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Project Link</label><input className={styles.input} id="bs_proj" placeholder="Linked project..." /></div>
              <div className={styles.formGroup}><label>Source</label><input className={styles.input} id="bs_src" placeholder="Data source or reference" /></div>
              <div className={styles.formGroup}><label>Tags</label><input className={styles.input} id="bs_tags" placeholder="tag1, tag2" /></div>
            </div>
            <div className={styles.fieldRow}>
              <button className={styles.primaryBtn} onClick={() => {
                const t = (document.getElementById('bs_title') as HTMLInputElement).value
                if (!t) return
                const newSig: Signal = {
                  id: uid(), title: t,
                  type: (document.getElementById('bs_type') as HTMLSelectElement).value as SignalType,
                  description: (document.getElementById('bs_desc') as HTMLTextAreaElement).value,
                  strength: Number((document.getElementById('bs_str') as HTMLInputElement).value) || 50,
                  trajectory: (document.getElementById('bs_traj') as HTMLSelectElement).value as Trajectory,
                  confidence: Number((document.getElementById('bs_conf') as HTMLInputElement).value) || 50,
                  projectLink: (document.getElementById('bs_proj') as HTMLInputElement).value,
                  source: (document.getElementById('bs_src') as HTMLInputElement).value,
                  tags: (document.getElementById('bs_tags') as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean),
                  archived: false, createdAt: now(),
                }
                setSignals(prev => [newSig, ...prev])
                addAlert(newSig.id, `New signal added: ${t}`)
                setShowForm(null)
              }}>Create Signal</button>
              <button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button>
            </div>
          </div></div>}

          <div className={styles.cardGrid}>{filtered.map(s => {
            const isFav = favorites.has(s.id)
            return <div key={s.id} className={`${styles.card} ${selectedId === s.id ? styles.cardSelected : ''}`} onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{s.title}</span>
                <button className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`} onClick={e => { e.stopPropagation(); toggleFav(s.id) }}>{isFav ? '★' : '☆'}</button>
              </div>
              <div className={styles.cardMeta}>
                <span className={`${styles.typeBadge} ${styles[`tp_${s.type.toLowerCase()}`]}`}>{s.type}</span>
                <span className={`${styles.trajBadge} ${styles[`tr_${s.trajectory.toLowerCase()}`]}`}>{s.trajectory}</span>
              </div>
              {s.tags.length > 0 && <div className={styles.cardMeta}>{s.tags.map(t => <span key={t} className={styles.tagSmall}>{t}</span>)}</div>}
              {s.description && <p className={styles.cardPreview}>{s.description.slice(0, 100)}</p>}
              <div className={styles.meterRow}>
                <div className={styles.meterGroup}><span className={styles.meterLabel}>STR</span><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${s.strength}%` }} /></div><span className={styles.meterVal}>{s.strength}</span></div>
                <div className={styles.meterGroup}><span className={styles.meterLabel}>CONF</span><div className={styles.meter}><div className={styles.meterFillAlt} style={{ width: `${s.confidence}%` }} /></div><span className={styles.meterVal}>{s.confidence}</span></div>
              </div>
              {s.source && <div className={styles.srcTag}>Source: {s.source}</div>}
              <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                <select className={styles.miniSelect} value={s.trajectory} onChange={e => { const v = e.target.value as Trajectory; setSignals(p => p.map(x => x.id === s.id ? { ...x, trajectory: v } : x)); addAlert(s.id, `${s.title} trajectory changed to ${v}`) }}><option>Rising</option><option>Stable</option><option>Falling</option></select>
                <button className={styles.ghostBtn} onClick={() => { setSignals(p => [{ ...s, id: uid(), title: `${s.title} (copy)`, createdAt: now() }, ...p]) }}>Dup</button>
                <button className={styles.ghostBtn} onClick={() => setSignals(p => p.map(x => x.id === s.id ? { ...x, archived: true } : x))}>Archive</button>
                <button className={styles.deleteBtn} onClick={() => { setSignals(p => p.filter(x => x.id !== s.id)); setSortBy(sortBy) }}>×</button>
              </div>
            </div>
          })}</div>
          {filtered.length === 0 && <p className={styles.emptyState}>No signals yet. Add your first market signal above.</p>}

          {sel && <div className={styles.detailPanel}>
            <h3 className={styles.detailTitle}>{sel.title}</h3>
            <div className={styles.cardMeta}><span className={`${styles.typeBadge} ${styles[`tp_${sel.type.toLowerCase()}`]}`}>{sel.type}</span><span className={`${styles.trajBadge} ${styles[`tr_${sel.trajectory.toLowerCase()}`]}`}>{sel.trajectory}</span>{sel.projectLink && <span className={styles.tagSmall}>Project: {sel.projectLink}</span>}</div>
            <p className={styles.detailDesc}>{sel.description || 'No description.'}</p>
            <div className={styles.formGroup}><label>Inline Notes</label><textarea className={styles.textarea} rows={2} value={sel.description} onChange={e => setSignals(p => p.map(x => x.id === sel.id ? { ...x, description: e.target.value } : x))} /></div>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Strength</label><input type="range" min={0} max={100} value={sel.strength} onChange={e => setSignals(p => p.map(x => x.id === sel.id ? { ...x, strength: Number(e.target.value) } : x))} className={styles.range} /><span className={styles.meterVal}>{sel.strength}%</span></div>
              <div className={styles.formGroup}><label>Confidence</label><input type="range" min={0} max={100} value={sel.confidence} onChange={e => setSignals(p => p.map(x => x.id === sel.id ? { ...x, confidence: Number(e.target.value) } : x))} className={styles.range} /><span className={styles.meterVal}>{sel.confidence}%</span></div>
            </div>
          </div>}
        </div>}

        {/* ═══ ANALYTICS ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics & Insights</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Strength</div><div className={styles.kpiValue}>{avgStr}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Confidence</div><div className={styles.kpiValue}>{avgConf}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Rising</div><div className={styles.kpiValue}>{risingCount}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Stable</div><div className={styles.kpiValue}>{live.filter(s => s.trajectory === 'Stable').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Falling</div><div className={styles.kpiValue}>{live.filter(s => s.trajectory === 'Falling').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>High Strength</div><div className={styles.kpiValue}>{live.filter(s => s.strength >= 75).length}</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>By Signal Type</label>
            <div className={styles.kpiRow}>{SIGNAL_TYPES.map(t => {
              const group = live.filter(s => s.type === t)
              return group.length > 0 ? <div key={t} className={styles.kpiCard}>
                <div className={styles.kpiLabel}>{t}</div>
                <div className={styles.kpiValue}>{group.length}</div>
                <div className={styles.helperText}>Avg {Math.round(group.reduce((a, s) => a + s.strength, 0) / group.length)}%</div>
              </div> : null
            })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Top Signals by Strength</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>#</span><span className={styles.tableHeader}>Signal</span><span className={styles.tableHeader}>Type</span><span className={styles.tableHeader}>Strength</span><span className={styles.tableHeader}>Trajectory</span></div>
              {[...live].sort((a, b) => b.strength - a.strength).slice(0, 10).map((s, i) => <div key={s.id} className={`${styles.tableRow} ${styles.tableRow5}`}>
                <span className={styles.tableCell}>{i + 1}</span>
                <span className={styles.tableCell}>{s.title}</span>
                <span className={styles.tableCell}><span className={`${styles.typeBadge} ${styles[`tp_${s.type.toLowerCase()}`]}`}>{s.type}</span></span>
                <span className={styles.tableCell}>{s.strength}%</span>
                <span className={styles.tableCell}><span className={`${styles.trajBadge} ${styles[`tr_${s.trajectory.toLowerCase()}`]}`}>{s.trajectory}</span></span>
              </div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Cross-Signal Correlation</label>
            <div className={styles.heatmapGrid}>
              {SIGNAL_TYPES.map(t => {
                const group = live.filter(s => s.type === t)
                const avgS = group.length ? Math.round(group.reduce((a, s) => a + s.strength, 0) / group.length) : 0
                const avgC = group.length ? Math.round(group.reduce((a, s) => a + s.confidence, 0) / group.length) : 0
                return <div key={t} className={styles.heatCell} style={{ opacity: group.length ? 0.4 + (avgS / 100) * 0.6 : 0.2 }}>
                  <span className={styles.heatLabel}>{t}</span>
                  <span className={styles.heatVal}>{avgS}% str</span>
                  <span className={styles.heatSub}>{avgC}% conf</span>
                </div>
              })}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Trajectory Distribution</label>
            <div className={styles.barGroup}>
              {(['Rising', 'Stable', 'Falling'] as Trajectory[]).map(t => {
                const count = live.filter(s => s.trajectory === t).length
                const pct = live.length ? Math.round(count / live.length * 100) : 0
                return <div key={t} className={styles.barRow}>
                  <span className={styles.barLabel}>{t}</span>
                  <div className={styles.bar}><div className={`${styles.barFill} ${styles[`bf_${t.toLowerCase()}`]}`} style={{ width: `${pct}%` }} /></div>
                  <span className={styles.barVal}>{count} ({pct}%)</span>
                </div>
              })}
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const csv = `Signal,Type,Strength,Trajectory,Confidence,Source,Date\n${live.map(s => `"${s.title}",${s.type},${s.strength},${s.trajectory},${s.confidence},"${s.source}",${fmtDate(s.createdAt)}`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `intelligence-${Date.now()}.csv`; a.click() }}>Export CSV</button>
            <button className={styles.exportBtn} onClick={() => { const d = `Business Intelligence Report\n${'='.repeat(40)}\nSignals: ${live.length} | Avg Strength: ${avgStr}% | Rising: ${risingCount}\n\n${live.map(s => `[${s.type}] ${s.title}\n  Strength: ${s.strength}% | Trajectory: ${s.trajectory} | Confidence: ${s.confidence}%\n  ${s.description || ''}`).join('\n\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `intel-report-${Date.now()}.txt`; a.click() }}>Full Report</button>
          </div>
        </div>}

        {/* ═══ STRATEGY ═══ */}
        {tab === 'strategy' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Strategic Intelligence</h2>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Pricing Psychology Analysis</label>
            {live.filter(s => s.type === 'Pricing').length > 0
              ? <div className={styles.tableWrap}>
                  <div className={`${styles.tableRow} ${styles.tableRow4}`}><span className={styles.tableHeader}>Signal</span><span className={styles.tableHeader}>Strength</span><span className={styles.tableHeader}>Trajectory</span><span className={styles.tableHeader}>Action</span></div>
                  {live.filter(s => s.type === 'Pricing').map(s => <div key={s.id} className={`${styles.tableRow} ${styles.tableRow4}`}>
                    <span className={styles.tableCell}>{s.title}</span>
                    <span className={styles.tableCell}>{s.strength}%</span>
                    <span className={styles.tableCell}><span className={`${styles.trajBadge} ${styles[`tr_${s.trajectory.toLowerCase()}`]}`}>{s.trajectory}</span></span>
                    <span className={styles.tableCell}>{s.trajectory === 'Rising' && s.strength >= 60 ? 'Raise prices' : s.trajectory === 'Falling' ? 'Hold / discount' : 'Monitor'}</span>
                  </div>)}
                </div>
              : <p className={styles.helperText}>No pricing signals yet. Add Pricing-type signals to get analysis.</p>
            }
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Cultural Timing Alerts</label>
            {live.filter(s => s.type === 'Cultural' && s.trajectory === 'Rising').map(s =>
              <div key={s.id} className={styles.alertItem}><span className={styles.alertDot} />{s.title} — Rising ({s.strength}% strength, {s.confidence}% confidence)</div>
            )}
            {live.filter(s => s.type === 'Cultural' && s.trajectory === 'Rising').length === 0 && <p className={styles.helperText}>No cultural timing alerts at this time.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Scenario Simulation</label>
            <p className={styles.helperText}>What-if analysis based on trajectory shifts for top signals.</p>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow4}`}><span className={styles.tableHeader}>Signal</span><span className={styles.tableHeader}>Current</span><span className={styles.tableHeader}>If Rising</span><span className={styles.tableHeader}>If Falling</span></div>
              {[...live].sort((a, b) => b.strength - a.strength).slice(0, 6).map(s => <div key={s.id} className={`${styles.tableRow} ${styles.tableRow4}`}>
                <span className={styles.tableCell}>{s.title}</span>
                <span className={styles.tableCell}><span className={`${styles.trajBadge} ${styles[`tr_${s.trajectory.toLowerCase()}`]}`}>{s.trajectory}</span></span>
                <span className={styles.tableCell}><span className={styles.positiveHint}>Expand & invest</span></span>
                <span className={styles.tableCell}><span className={styles.negativeHint}>Pivot strategy</span></span>
              </div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Competitive Landscape</label>
            {live.filter(s => s.type === 'Competitive').length > 0
              ? <div className={styles.cardGrid}>{live.filter(s => s.type === 'Competitive').map(s =>
                  <div key={s.id} className={styles.miniCard}><span className={styles.cardTitle}>{s.title}</span><span className={`${styles.trajBadge} ${styles[`tr_${s.trajectory.toLowerCase()}`]}`}>{s.trajectory}</span><span className={styles.meterVal}>{s.strength}%</span></div>
                )}</div>
              : <p className={styles.helperText}>No competitive signals tracked yet.</p>
            }
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>AI Strategy Advisory</div>
            <pre className={styles.aiOutput}>{`Intelligence Summary\n${'─'.repeat(35)}\n• ${live.length} active signals tracked\n• ${risingCount} rising trends · ${live.filter(s => s.trajectory === 'Falling').length} falling\n• Avg strength: ${avgStr}% · Avg confidence: ${avgConf}%\n• Top type: ${live.length ? (() => { const f: Record<string, number> = {}; live.forEach(s => f[s.type] = (f[s.type] || 0) + 1); return Object.entries(f).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' })() : 'N/A'}\n• ${live.filter(s => s.strength >= 75).length} high-strength signals\n• Pricing signals: ${live.filter(s => s.type === 'Pricing').length} (${live.filter(s => s.type === 'Pricing' && s.trajectory === 'Rising').length} rising)\n• Cultural timing: ${live.filter(s => s.type === 'Cultural' && s.trajectory === 'Rising').length} active cultural alerts\n• Recommendation: ${live.filter(s => s.trajectory === 'Rising' && s.strength >= 70).length > 0 ? 'Act on rising high-strength signals now.' : risingCount > 0 ? 'Monitor rising signals — approaching action threshold.' : 'No urgent signals. Continue data collection.'}`}</pre>
          </div>
        </div>}

        {/* ═══ TEAM ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Collaboration & Team</h2>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="bic_name" /><input className={styles.input} placeholder="Email" id="bic_email" /><select className={styles.select} id="bic_role"><option value="analyst">Analyst</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('bic_name') as HTMLInputElement).value; if (n) { setCollaborators(p => [...p, { id: uid(), name: n, email: (document.getElementById('bic_email') as HTMLInputElement).value, role: (document.getElementById('bic_role') as HTMLSelectElement).value as Collaborator['role'] }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setCollaborators(p => p.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion</label>
            <div className={styles.commentList}>{comments.slice(0, 20).map(c => {
              const sig = signals.find(s => s.id === c.signalId)
              return <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}{sig ? ` on ${sig.title}` : ''}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>
            })}</div>
            <div className={styles.inlineForm}>
              <select className={styles.select} id="bic_target"><option value="">General</option>{live.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select>
              <input className={styles.input} placeholder="Add comment..." id="bic_input" style={{ flex: 1 }} />
              <button className={styles.ghostBtn} onClick={() => { const t = (document.getElementById('bic_input') as HTMLInputElement).value; if (t) { setComments(p => [{ id: uid(), signalId: (document.getElementById('bic_target') as HTMLSelectElement).value, author: 'You', text: t, date: now() }, ...p]); (document.getElementById('bic_input') as HTMLInputElement).value = '' } }}>Post</button>
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Tasks</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'task' ? null : 'task')}>+ Add Task</button></div>
            {showForm === 'task' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Task description" id="bit_text" style={{ flex: 1 }} /><input className={styles.input} placeholder="Assignee" id="bit_assign" /><select className={styles.select} id="bit_sig"><option value="">No signal</option>{live.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('bit_text') as HTMLInputElement).value; if (t) { setTasks(p => [...p, { id: uid(), signalId: (document.getElementById('bit_sig') as HTMLSelectElement).value, text: t, assignee: (document.getElementById('bit_assign') as HTMLInputElement).value, done: false }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.taskList}>{tasks.map(t => <div key={t.id} className={`${styles.taskItem} ${t.done ? styles.taskDone : ''}`}>
              <button className={styles.checkBtn} onClick={() => setTasks(p => p.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}>{t.done ? '✓' : '○'}</button>
              <span className={styles.taskContent}>{t.text}{t.assignee && <span className={styles.tag}>{t.assignee}</span>}</span>
              <button className={styles.deleteBtn} onClick={() => setTasks(p => p.filter(x => x.id !== t.id))}>×</button>
            </div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Team Contribution Ranking</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow4}`}><span className={styles.tableHeader}>Member</span><span className={styles.tableHeader}>Comments</span><span className={styles.tableHeader}>Tasks Done</span><span className={styles.tableHeader}>Role</span></div>
              {collaborators.map(c => <div key={c.id} className={`${styles.tableRow} ${styles.tableRow4}`}>
                <span className={styles.tableCell}>{c.name}</span>
                <span className={styles.tableCell}>{comments.filter(x => x.author === c.name).length}</span>
                <span className={styles.tableCell}>{tasks.filter(x => x.assignee === c.name && x.done).length}</span>
                <span className={styles.tableCell}><span className={styles.tag}>{c.role}</span></span>
              </div>)}
            </div>
          </div>
        </div>}

        {/* ═══ ADVANCED ═══ */}
        {tab === 'advanced' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Advanced Intelligence</h2>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Alerts & Notifications</label>
            {alerts.length > 0
              ? <div className={styles.alertList}>{alerts.slice(0, 15).map(a => {
                  const sig = signals.find(s => s.id === a.signalId)
                  return <div key={a.id} className={`${styles.alertRow} ${a.read ? styles.alertRead : ''}`} onClick={() => setAlerts(p => p.map(x => x.id === a.id ? { ...x, read: true } : x))}>
                    <span className={a.read ? styles.helperText : styles.fontName}>{a.message}</span>
                    <span className={styles.helperText}>{fmtDate(a.date)}</span>
                    {sig && <span className={styles.tagSmall}>{sig.type}</span>}
                  </div>
                })}</div>
              : <p className={styles.helperText}>No alerts yet.</p>
            }
            {alerts.length > 0 && <button className={styles.ghostBtn} onClick={() => setAlerts(p => p.map(a => ({ ...a, read: true })))}>Mark all read</button>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Signal Source Verification</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow4}`}><span className={styles.tableHeader}>Signal</span><span className={styles.tableHeader}>Source</span><span className={styles.tableHeader}>Confidence</span><span className={styles.tableHeader}>Verified</span></div>
              {live.map(s => <div key={s.id} className={`${styles.tableRow} ${styles.tableRow4}`}>
                <span className={styles.tableCell}>{s.title}</span>
                <span className={styles.tableCell}>{s.source || '—'}</span>
                <span className={styles.tableCell}>{s.confidence}%</span>
                <span className={styles.tableCell}>{s.source && s.confidence >= 70 ? <span className={styles.positiveHint}>Verified</span> : <span className={styles.negativeHint}>Unverified</span>}</span>
              </div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Archived Signals</label>
            <div className={styles.cardGrid}>{signals.filter(s => s.archived).map(s => <div key={s.id} className={styles.miniCard}>
              <span className={styles.cardTitle}>{s.title}</span>
              <span className={`${styles.typeBadge} ${styles[`tp_${s.type.toLowerCase()}`]}`}>{s.type}</span>
              <button className={styles.ghostBtn} onClick={() => setSignals(p => p.map(x => x.id === s.id ? { ...x, archived: false } : x))}>Restore</button>
            </div>)}</div>
            {signals.filter(s => s.archived).length === 0 && <p className={styles.helperText}>No archived signals.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Cross-Industry Comparison</label>
            <div className={styles.heatmapGrid}>
              {SIGNAL_TYPES.map(t => {
                const group = live.filter(s => s.type === t)
                const rising = group.filter(s => s.trajectory === 'Rising').length
                return <div key={t} className={styles.heatCell} style={{ opacity: group.length ? 0.4 + (rising / Math.max(group.length, 1)) * 0.6 : 0.2 }}>
                  <span className={styles.heatLabel}>{t}</span>
                  <span className={styles.heatVal}>{group.length} signals</span>
                  <span className={styles.heatSub}>{rising} rising</span>
                </div>
              })}
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = JSON.stringify({ signals, comments, tasks, collaborators, alerts }, null, 2); const b = new Blob([d], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `bi-backup-${Date.now()}.json`; a.click() }}>Export Full Backup (JSON)</button>
            <button className={styles.exportBtn} onClick={() => { setSignals([]); setComments([]); setTasks([]); setAlerts([]); setFavArr([]) }}>Reset All Data</button>
          </div>
        </div>}

      </main>
    </div>
  )
}

export { BusinessIntelligence as MarketSignalsBoard }
export { BusinessIntelligence as PricingPsychologyLab }
export { BusinessIntelligence as CulturalTimingIndex }
