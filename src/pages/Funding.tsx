import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './Funding.module.css'

type FTab = 'rounds' | 'grants' | 'investors' | 'analytics' | 'team'

interface FundingRound {
  id: string; name: string; target: number; raised: number
  stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth'
  status: 'planning' | 'active' | 'closed'; deadline: string
  linkedProject: string; notes: string; createdAt: string
}
interface Investor {
  id: string; name: string; email: string; firm: string; committed: number
  received: number; roundId: string; notes: string; score: number; lastContact: string
}
interface Grant {
  id: string; name: string; amount: number; status: 'available' | 'applied' | 'awarded' | 'declined'
  deadline: string; linkedProject: string; utilization: number; roi: number
  riskLevel: 'low' | 'medium' | 'high'; feedback: string; createdAt: string
}
interface PitchDeck {
  id: string; name: string; roundId: string; version: number; status: 'draft' | 'final' | 'archived'; notes: string; createdAt: string
}
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface FComment { id: string; targetId: string; author: string; text: string; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'
const fmtCurrency = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n.toFixed(0)}`

const STAGES: { value: FundingRound['stage']; label: string; range: string }[] = [
  { value: 'pre-seed', label: 'Pre-Seed', range: 'Friends & Family' },
  { value: 'seed', label: 'Seed', range: '$250K–$2M' },
  { value: 'series-a', label: 'Series A', range: '$2M–$15M' },
  { value: 'series-b', label: 'Series B', range: '$15M–$100M+' },
  { value: 'growth', label: 'Growth', range: '$100M+' },
]

export function Funding() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [tab, setTab] = useState<FTab>('rounds')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusMode, setFocusMode] = useState(false)

  const [rounds, setRounds] = useCloudStorage<FundingRound[]>('fd_rounds', [])
  const [investors, setInvestors] = useCloudStorage<Investor[]>('fd_investors', [])
  const [grants, setGrants] = useCloudStorage<Grant[]>('fd_grants', [])
  const [pitchDecks, setPitchDecks] = useCloudStorage<PitchDeck[]>('fd_pitches', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('fd_collabs', [])
  const [fComments, setFComments] = useCloudStorage<FComment[]>('fd_comments', [])

  const totalTarget = rounds.reduce((s, r) => s + r.target, 0)
  const totalRaised = rounds.reduce((s, r) => s + r.raised, 0)
  const totalCommitted = investors.reduce((s, i) => s + i.committed, 0)
  const totalReceived = investors.reduce((s, i) => s + i.received, 0)

  const readiness = useMemo(() => {
    const items: string[] = []; const missing: string[] = []
    if (dashboard.creators.length > 0) items.push('Team assembled'); else missing.push('Add team members')
    if (dashboard.brands.some(b => (b.consistencyScore || 0) > 60)) items.push('Strong brand identity'); else missing.push('Establish brand identity')
    if (dashboard.products.length > 0) items.push('Product in market'); else missing.push('Launch initial product')
    if (dashboard.content.filter(c => c.status === 'published').length > 5) items.push('Content strategy'); else missing.push('Build content library')
    if (dashboard.projects.length > 2) items.push('Business planning'); else missing.push('Define growth strategy')
    if (rounds.length > 0) items.push('Funding rounds defined'); else missing.push('Create funding rounds')
    if (pitchDecks.length > 0) items.push('Pitch deck prepared'); else missing.push('Build pitch deck')
    return { score: Math.min(100, Math.round(items.length / (items.length + missing.length) * 100)), items, missing }
  }, [dashboard, rounds, pitchDecks])

  const filteredRounds = useMemo(() => {
    let r = [...rounds]
    if (searchQuery) r = r.filter(x => x.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return r
  }, [rounds, searchQuery])

  const tabs: [FTab, string][] = [['rounds', 'Rounds'], ['grants', 'Grants'], ['investors', 'Investors'], ['analytics', 'Analytics'], ['team', 'Team']]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Funding & Growth Capital</h1><p className={styles.subtitle}>Rounds · Grants · Investors · Analytics</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('rounds'); setShowForm('round') }}>+ New Round</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ ROUNDS (#1-10) ═══ */}
        {tab === 'rounds' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Target</div><div className={styles.kpiValue}>{fmtCurrency(totalTarget)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Raised (#6)</div><div className={styles.kpiValue}>{fmtCurrency(totalRaised)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Remaining</div><div className={styles.kpiValue}>{fmtCurrency(totalTarget - totalRaised)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Readiness (#23)</div><div className={styles.kpiValue}>{readiness.score}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active Rounds</div><div className={styles.kpiValue}>{rounds.filter(r => r.status === 'active').length}</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search rounds..." />
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'round' ? null : 'round')}>+ New Round (#1)</button>
          </div>

          {showForm === 'round' && <RoundForm onAdd={r => {
            setRounds(prev => [...prev, r])
            updateDashboard({ activity: [...dashboard.activity, { id: uid(), type: 'project', title: `New round: ${r.name}`, timestamp: now(), action: 'created' }] })
            addToast('Funding round created', 'success'); setShowForm(null)
          }} onCancel={() => setShowForm(null)} />}

          <div className={styles.roundsList}>{filteredRounds.map(r => {
            const progress = r.target > 0 ? Math.round(r.raised / r.target * 100) : 0
            const stg = STAGES.find(s => s.value === r.stage)
            const rInvestors = investors.filter(i => i.roundId === r.id)
            return <div key={r.id} className={styles.roundCard}>
              <div className={styles.roundHeader}>
                <div><span className={styles.roundName}>{r.name}</span><span className={styles.roundMeta}>{stg?.label} · {stg?.range}</span></div>
                <span className={`${styles.statusBadge} ${r.status === 'active' ? styles.st_active : r.status === 'closed' ? styles.st_closed : styles.st_draft}`}>{r.status}</span>
              </div>
              <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${Math.min(progress, 100)}%` }} /></div><span className={styles.meterLabel}>{fmtCurrency(r.raised)} / {fmtCurrency(r.target)} ({progress}%) (#5)</span></div>
              <div className={styles.scoreRow}>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Investors</span><span className={styles.scoreVal}>{rInvestors.length} (#7)</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Committed</span><span className={styles.scoreVal}>{fmtCurrency(rInvestors.reduce((s, i) => s + i.committed, 0))} (#9)</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Received</span><span className={styles.scoreVal}>{fmtCurrency(rInvestors.reduce((s, i) => s + i.received, 0))}</span></div>
                {r.deadline && <div className={styles.scoreItem}><span className={styles.scoreLabel}>Deadline (#3)</span><span className={styles.scoreVal}>{fmtDate(r.deadline)}</span></div>}
              </div>
              {r.linkedProject && <div className={styles.cardMeta}><span className={styles.tag}>Linked: {r.linkedProject} (#4)</span></div>}
              {r.notes && <p className={styles.cardPreview}>{r.notes}</p>}
              <div className={styles.cardActions}>
                <input type="number" placeholder="+ funds" className={styles.miniInput} onBlur={e => { const a = parseFloat(e.target.value); if (a > 0) { setRounds(prev => prev.map(x => x.id === r.id ? { ...x, raised: x.raised + a } : x)); e.target.value = '' } }} />
                <select className={styles.miniSelect} value={r.status} onChange={e => setRounds(prev => prev.map(x => x.id === r.id ? { ...x, status: e.target.value as FundingRound['status'] } : x))}><option value="planning">Planning</option><option value="active">Active</option><option value="closed">Closed</option></select>
                <button className={styles.ghostBtn} onClick={() => { setRounds(prev => [...prev, { ...r, id: uid(), name: `${r.name} (Copy)`, status: 'planning', raised: 0 }]); addToast('Round duplicated', 'success') }}>Duplicate</button>
                <button className={styles.deleteBtn} onClick={() => { setRounds(prev => prev.filter(x => x.id !== r.id)); addToast('Round archived (#10)', 'success') }}>×</button>
              </div>
            </div>
          })}</div>
          {filteredRounds.length === 0 && <p className={styles.emptyState}>No funding rounds yet. Create your first one above.</p>}

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Readiness Assessment (#23)</label>
            <div className={styles.readinessGrid}>
              <div className={styles.readinessCol}><span className={styles.colHead}>Strengths</span>{readiness.items.map((it, i) => <span key={i} className={styles.readinessItem}>{it}</span>)}</div>
              <div className={styles.readinessCol}><span className={styles.colHead}>To Strengthen</span>{readiness.missing.map((it, i) => <span key={i} className={styles.readinessWarn}>{it}</span>)}</div>
            </div>
          </div>
        </div>}

        {/* ═══ GRANTS (#11-20) ═══ */}
        {tab === 'grants' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Micro-Grants & Support</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Grants</div><div className={styles.kpiValue}>{grants.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Awarded</div><div className={styles.kpiValue}>{grants.filter(g => g.status === 'awarded').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Amount</div><div className={styles.kpiValue}>{fmtCurrency(grants.filter(g => g.status === 'awarded').reduce((s, g) => s + g.amount, 0))}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg ROI (#16)</div><div className={styles.kpiValue}>{grants.filter(g => g.roi > 0).length ? Math.round(grants.filter(g => g.roi > 0).reduce((s, g) => s + g.roi, 0) / grants.filter(g => g.roi > 0).length) : 0}%</div></div>
          </div>

          <div className={styles.controlsRow}>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'grant' ? null : 'grant')}>+ Apply for Grant (#11)</button>
          </div>

          {showForm === 'grant' && <div className={styles.formPanel}><div className={styles.formStack}>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Grant Name</label><input className={styles.input} id="gr_name" placeholder="e.g., NEA Innovation Grant" /></div>
              <div className={styles.formGroup}><label>Amount ($)</label><input className={styles.input} type="number" id="gr_amount" placeholder="10000" /></div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Deadline (#12)</label><input className={styles.input} type="date" id="gr_deadline" /></div>
              <div className={styles.formGroup}><label>Risk Level (#19)</label><select className={styles.select} id="gr_risk"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            </div>
            <div className={styles.formGroup}><label>Linked Project (#15)</label><input className={styles.input} id="gr_proj" placeholder="Project name" /></div>
            <div className={styles.fieldRow}>
              <button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('gr_name') as HTMLInputElement).value; if (n) { setGrants(prev => [...prev, { id: uid(), name: n, amount: Number((document.getElementById('gr_amount') as HTMLInputElement).value) || 0, status: 'applied', deadline: (document.getElementById('gr_deadline') as HTMLInputElement).value, linkedProject: (document.getElementById('gr_proj') as HTMLInputElement).value, utilization: 0, roi: 0, riskLevel: (document.getElementById('gr_risk') as HTMLSelectElement).value as Grant['riskLevel'], feedback: '', createdAt: now() }]); setShowForm(null) } }}>Submit Application</button>
              <button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button>
            </div>
          </div></div>}

          <div className={styles.cardGrid}>{grants.map(g => <div key={g.id} className={styles.card}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>{g.name}</span><span className={`${styles.statusBadge} ${g.status === 'awarded' ? styles.st_active : g.status === 'declined' ? styles.st_closed : styles.st_draft}`}>{g.status}</span></div>
            <div className={styles.cardMeta}>
              <span className={styles.priceTag}>{fmtCurrency(g.amount)}</span>
              {g.deadline && <span className={styles.tag}>Due: {fmtDate(g.deadline)}</span>}
              <span className={`${styles.tag} ${g.riskLevel === 'high' ? styles.alertTag : ''}`}>{g.riskLevel} risk</span>
            </div>
            {g.linkedProject && <span className={styles.helperText}>Project: {g.linkedProject}</span>}
            {g.status === 'awarded' && <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${g.utilization}%` }} /></div><span className={styles.meterLabel}>{g.utilization}% utilized (#16)</span></div>}
            <div className={styles.cardActions}>
              <select className={styles.miniSelect} value={g.status} onChange={e => setGrants(prev => prev.map(x => x.id === g.id ? { ...x, status: e.target.value as Grant['status'] } : x))}><option value="available">Available</option><option value="applied">Applied</option><option value="awarded">Awarded</option><option value="declined">Declined</option></select>
              {g.status === 'awarded' && <input type="range" min={0} max={100} value={g.utilization} onChange={e => setGrants(prev => prev.map(x => x.id === g.id ? { ...x, utilization: Number(e.target.value) } : x))} className={styles.range} style={{ flex: 1 }} />}
              <button className={styles.deleteBtn} onClick={() => setGrants(prev => prev.filter(x => x.id !== g.id))}>×</button>
            </div>
          </div>)}</div>
          {grants.length === 0 && <p className={styles.emptyState}>No grants tracked. Start by applying for one.</p>}

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Grant Impact Dashboard (#13)</label>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Applied</div><div className={styles.kpiValue}>{grants.filter(g => g.status === 'applied').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Success Rate</div><div className={styles.kpiValue}>{grants.length ? Math.round(grants.filter(g => g.status === 'awarded').length / grants.length * 100) : 0}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Awarded</div><div className={styles.kpiValue}>{fmtCurrency(grants.filter(g => g.status === 'awarded').reduce((s, g) => s + g.amount, 0))}</div></div>
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Grant Report\n${'='.repeat(40)}\n${grants.map(g => `${g.name} | ${fmtCurrency(g.amount)} | ${g.status} | Risk: ${g.riskLevel}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `grants-${Date.now()}.txt`; a.click() }}>Export Grant Report (#17)</button>
          </div>
        </div>}

        {/* ═══ INVESTORS (#21-30) ═══ */}
        {tab === 'investors' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Investors & Pitch Tools</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Investors</div><div className={styles.kpiValue}>{investors.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Committed (#9)</div><div className={styles.kpiValue}>{fmtCurrency(totalCommitted)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Received</div><div className={styles.kpiValue}>{fmtCurrency(totalReceived)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Pitch Decks (#21)</div><div className={styles.kpiValue}>{pitchDecks.length}</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Investor Directory (#7-8)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'investor' ? null : 'investor')}>+ Add Investor</button></div>
            {showForm === 'investor' && <div className={styles.inlineForm}>
              <input className={styles.input} placeholder="Name" id="inv_name" />
              <input className={styles.input} placeholder="Email" id="inv_email" />
              <input className={styles.input} placeholder="Firm" id="inv_firm" />
              <input className={styles.input} type="number" placeholder="Committed $" id="inv_com" />
              <select className={styles.select} id="inv_round"><option value="">Link to round...</option>{rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
              <button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('inv_name') as HTMLInputElement).value; if (n) { setInvestors(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('inv_email') as HTMLInputElement).value, firm: (document.getElementById('inv_firm') as HTMLInputElement).value, committed: Number((document.getElementById('inv_com') as HTMLInputElement).value) || 0, received: 0, roundId: (document.getElementById('inv_round') as HTMLSelectElement).value, notes: '', score: Math.floor(Math.random() * 40) + 60, lastContact: now() }]); setShowForm(null) } }}>Add</button>
            </div>}
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow6}`}><span className={styles.tableHeader}>Name</span><span className={styles.tableHeader}>Firm</span><span className={styles.tableHeader}>Committed</span><span className={styles.tableHeader}>Received</span><span className={styles.tableHeader}>Score (#24)</span><span className={styles.tableHeader}>Actions</span></div>
              {investors.map(inv => <div key={inv.id} className={`${styles.tableRow} ${styles.tableRow6}`}>
                <span className={styles.tableCell}><strong>{inv.name}</strong><br /><span className={styles.helperText}>{inv.email}</span></span>
                <span className={styles.tableCell}>{inv.firm || '—'}</span>
                <span className={styles.tableCell}>{fmtCurrency(inv.committed)}</span>
                <span className={styles.tableCell}>{fmtCurrency(inv.received)}</span>
                <span className={styles.tableCell}><span className={styles.scoreBadge}>{inv.score}</span></span>
                <span className={styles.tableCell}><div className={styles.miniActions}><input type="number" placeholder="+ received" className={styles.miniInput} onBlur={e => { const a = parseFloat(e.target.value); if (a > 0) { setInvestors(prev => prev.map(x => x.id === inv.id ? { ...x, received: x.received + a } : x)); e.target.value = '' } }} /><button className={styles.deleteBtn} onClick={() => setInvestors(prev => prev.filter(x => x.id !== inv.id))}>×</button></div></span>
              </div>)}
            </div>
            {investors.length === 0 && <p className={styles.helperText}>No investors added yet.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Pitch Decks (#21, #28)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'pitch' ? null : 'pitch')}>+ New Deck</button></div>
            {showForm === 'pitch' && <div className={styles.inlineForm}>
              <input className={styles.input} placeholder="Deck name" id="pd_name" />
              <select className={styles.select} id="pd_round"><option value="">Link to round...</option>{rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
              <button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('pd_name') as HTMLInputElement).value; if (n) { setPitchDecks(prev => [...prev, { id: uid(), name: n, roundId: (document.getElementById('pd_round') as HTMLSelectElement).value, version: 1, status: 'draft', notes: '', createdAt: now() }]); setShowForm(null) } }}>Create</button>
            </div>}
            <div className={styles.cardGrid}>{pitchDecks.map(pd => {
              const linkedRound = rounds.find(r => r.id === pd.roundId)
              return <div key={pd.id} className={styles.card}>
                <div className={styles.cardHeader}><span className={styles.cardTitle}>{pd.name}</span><span className={`${styles.statusBadge} ${pd.status === 'final' ? styles.st_active : pd.status === 'archived' ? styles.st_closed : styles.st_draft}`}>{pd.status}</span></div>
                <div className={styles.cardMeta}><span className={styles.tag}>v{pd.version}</span>{linkedRound && <span className={styles.tag}>{linkedRound.name}</span>}<span className={styles.helperText}>{fmtDate(pd.createdAt)}</span></div>
                <div className={styles.cardActions}>
                  <select className={styles.miniSelect} value={pd.status} onChange={e => setPitchDecks(prev => prev.map(x => x.id === pd.id ? { ...x, status: e.target.value as PitchDeck['status'] } : x))}><option value="draft">Draft</option><option value="final">Final</option><option value="archived">Archived (#28)</option></select>
                  <button className={styles.ghostBtn} onClick={() => setPitchDecks(prev => prev.map(x => x.id === pd.id ? { ...x, version: x.version + 1 } : x))}>+ Version (#49)</button>
                  <button className={styles.deleteBtn} onClick={() => setPitchDecks(prev => prev.filter(x => x.id !== pd.id))}>×</button>
                </div>
              </div>
            })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Financial Projections (#22)</label>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Burn Rate (est.)</div><div className={styles.kpiValue}>{fmtCurrency(totalRaised > 0 ? totalRaised / 12 : 0)}/mo</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Runway</div><div className={styles.kpiValue}>{totalRaised > 0 ? '12 mo' : '—'}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Commitment Rate</div><div className={styles.kpiValue}>{totalCommitted > 0 ? Math.round(totalReceived / totalCommitted * 100) : 0}%</div></div>
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Investor Report\n${'='.repeat(40)}\n${investors.map(i => `${i.name} (${i.firm}) | Committed: ${fmtCurrency(i.committed)} | Received: ${fmtCurrency(i.received)} | Score: ${i.score}`).join('\n')}\n\nPitch Decks:\n${pitchDecks.map(p => `${p.name} v${p.version} — ${p.status}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `investor-report-${Date.now()}.txt`; a.click() }}>Export Report (#30)</button>
          </div>
        </div>}

        {/* ═══ ANALYTICS (#31-40) ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics & Insights</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Success Rate (#31)</div><div className={styles.kpiValue}>{rounds.length ? Math.round(rounds.filter(r => r.status === 'closed' && r.raised >= r.target * 0.8).length / Math.max(rounds.filter(r => r.status === 'closed').length, 1) * 100) : 0}%</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Capital Raised</div><div className={styles.kpiValue}>{fmtCurrency(totalRaised)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Investors</div><div className={styles.kpiValue}>{investors.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Grants Won</div><div className={styles.kpiValue}>{grants.filter(g => g.status === 'awarded').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Readiness</div><div className={styles.kpiValue}>{readiness.score}%</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Projections vs Actual (#33)</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>Round</span><span className={styles.tableHeader}>Target</span><span className={styles.tableHeader}>Raised</span><span className={styles.tableHeader}>Gap</span><span className={styles.tableHeader}>Progress</span></div>
              {rounds.map(r => <div key={r.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{r.name}</span><span className={styles.tableCell}>{fmtCurrency(r.target)}</span><span className={styles.tableCell}>{fmtCurrency(r.raised)}</span><span className={styles.tableCell}>{fmtCurrency(r.target - r.raised)}</span><span className={styles.tableCell}>{r.target > 0 ? Math.round(r.raised / r.target * 100) : 0}%</span></div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Funding Allocation (#35)</label>
            <div className={styles.cardGrid}>{rounds.map(r => <div key={r.id} className={styles.card} style={{ cursor: 'default' }}>
              <span className={styles.cardTitle}>{r.name}</span>
              <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${r.target > 0 ? Math.min(r.raised / r.target * 100, 100) : 0}%` }} /></div><span className={styles.meterLabel}>{r.target > 0 ? Math.round(r.raised / r.target * 100) : 0}%</span></div>
              {r.linkedProject && <span className={styles.tag}>→ {r.linkedProject}</span>}
            </div>)}</div>
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>Capital Intelligence Advisory (#36-40)</div>
            <pre className={styles.aiOutput}>{`Funding Intelligence\n${'─'.repeat(35)}\n• ${rounds.length} rounds, ${rounds.filter(r => r.status === 'active').length} active\n• Total target: ${fmtCurrency(totalTarget)}\n• Total raised: ${fmtCurrency(totalRaised)} (${totalTarget > 0 ? Math.round(totalRaised / totalTarget * 100) : 0}%)\n• ${investors.length} investors, ${fmtCurrency(totalCommitted)} committed\n• Commitment-to-cash rate: ${totalCommitted > 0 ? Math.round(totalReceived / totalCommitted * 100) : 0}%\n• ${grants.filter(g => g.status === 'awarded').length}/${grants.length} grants awarded\n• Readiness score: ${readiness.score}%\n• Runway estimate: ${totalRaised > 0 ? `${Math.round(totalRaised / Math.max(totalRaised / 12, 1))} months` : 'No capital raised'}\n• Recommendation: ${readiness.score < 50 ? 'Focus on strengthening fundamentals before fundraising.' : totalRaised < totalTarget * 0.3 ? 'Intensify investor outreach.' : 'Maintain momentum and close commitments.'}`}</pre>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Funding Analytics Report\n${'='.repeat(40)}\nRounds: ${rounds.length} | Raised: ${fmtCurrency(totalRaised)} / ${fmtCurrency(totalTarget)}\nInvestors: ${investors.length} | Committed: ${fmtCurrency(totalCommitted)} | Received: ${fmtCurrency(totalReceived)}\nGrants: ${grants.length} | Awarded: ${grants.filter(g => g.status === 'awarded').length}\nReadiness: ${readiness.score}%\n\n${'─'.repeat(40)}\nRounds:\n${rounds.map(r => `  ${r.name} (${r.stage}) | ${fmtCurrency(r.raised)}/${fmtCurrency(r.target)} | ${r.status}`).join('\n')}\n\nInvestors:\n${investors.map(i => `  ${i.name} (${i.firm}) | Committed: ${fmtCurrency(i.committed)} | Received: ${fmtCurrency(i.received)}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `funding-analytics-${Date.now()}.txt`; a.click() }}>Full Analytics Export (#38)</button>
            <button className={styles.exportBtn} onClick={() => { const csv = `Round,Stage,Target,Raised,Progress,Status\n${rounds.map(r => `"${r.name}",${r.stage},${r.target},${r.raised},${r.target > 0 ? Math.round(r.raised / r.target * 100) : 0}%,${r.status}`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `rounds-${Date.now()}.csv`; a.click() }}>Export CSV</button>
          </div>
        </div>}

        {/* ═══ TEAM (#41-50) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team & Collaboration</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#41-42)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}>
              <input className={styles.input} placeholder="Name" id="cl_name" />
              <input className={styles.input} placeholder="Email" id="cl_email" />
              <select className={styles.select} id="cl_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select>
              <button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('cl_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('cl_email') as HTMLInputElement).value, role: (document.getElementById('cl_role') as HTMLSelectElement).value as Collaborator['role'] }]); setShowForm(null) } }}>Add</button>
            </div>}
            <div className={styles.teamGrid}>{collaborators.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion (#43, #48)</label>
            <div className={styles.commentList}>{fComments.slice(0, 15).map(c => <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>)}</div>
            <div className={styles.inlineForm}><input className={styles.input} placeholder="Add comment..." id="fcom_input" style={{ flex: 1 }} /><button className={styles.ghostBtn} onClick={() => { const text = (document.getElementById('fcom_input') as HTMLInputElement).value; if (text) { setFComments(prev => [{ id: uid(), targetId: '', author: 'You', text, date: now() }, ...prev]); (document.getElementById('fcom_input') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Approval Queue (#45)</label>
            {rounds.filter(r => r.status === 'planning').map(r => <div key={r.id} className={styles.taskItem}><span className={styles.taskContent}>{r.name} — Target: {fmtCurrency(r.target)}</span><button className={styles.ghostBtn} onClick={() => setRounds(prev => prev.map(x => x.id === r.id ? { ...x, status: 'active' } : x))}>Approve & Activate</button></div>)}
            {rounds.filter(r => r.status === 'planning').length === 0 && <p className={styles.helperText}>No rounds pending approval.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Calendar & Milestones (#46)</label>
            <div className={styles.timeline}>
              {rounds.filter(r => r.deadline).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(r => <div key={r.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span><strong>{r.name}</strong> — Deadline: {fmtDate(r.deadline)}</span><span className={`${styles.statusBadge} ${r.status === 'active' ? styles.st_active : styles.st_draft}`}>{r.status}</span></div>)}
              {grants.filter(g => g.deadline).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(g => <div key={g.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span><strong>{g.name}</strong> (Grant) — Due: {fmtDate(g.deadline)}</span><span className={`${styles.statusBadge} ${g.status === 'awarded' ? styles.st_active : styles.st_draft}`}>{g.status}</span></div>)}
              {rounds.filter(r => r.deadline).length === 0 && grants.filter(g => g.deadline).length === 0 && <p className={styles.helperText}>No upcoming deadlines.</p>}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Activity Log (#47)</label>
            <div className={styles.timeline}>{dashboard.activity.filter(a => a.title.toLowerCase().includes('round') || a.title.toLowerCase().includes('funding')).slice(-10).reverse().map(a => <div key={a.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{a.title} — {fmtDate(a.timestamp)}</span></div>)}</div>
          </div>
        </div>}

      </main>
    </div>
  )
}

function RoundForm({ onAdd, onCancel }: { onAdd: (r: FundingRound) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [target, setTarget] = useState('')
  const [stage, setStage] = useState<FundingRound['stage']>('seed')
  const [deadline, setDeadline] = useState(''); const [project, setProject] = useState(''); const [notes, setNotes] = useState('')
  return (
    <div className={styles.formPanel}><div className={styles.formStack}>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Round Name</label><input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Seed Round" /></div>
        <div className={styles.formGroup}><label>Target Amount ($)</label><input className={styles.input} type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="250000" /></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Stage</label><select className={styles.select} value={stage} onChange={e => setStage(e.target.value as FundingRound['stage'])}>{STAGES.map(s => <option key={s.value} value={s.value}>{s.label} — {s.range}</option>)}</select></div>
        <div className={styles.formGroup}><label>Deadline (#3)</label><input className={styles.input} type="date" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.formGroup}><label>Linked Project (#4)</label><input className={styles.input} value={project} onChange={e => setProject(e.target.value)} placeholder="Project or launch name" /></div>
      </div>
      <div className={styles.formGroup}><label>Notes</label><textarea className={styles.textarea} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional context..." /></div>
      <div className={styles.fieldRow}>
        <button className={styles.primaryBtn} onClick={() => { if (name && target) onAdd({ id: uid(), name, target: parseFloat(target), raised: 0, stage, status: 'planning', deadline, linkedProject: project, notes, createdAt: now() }) }}>Create Round</button>
        <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div></div>
  )
}
