import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

/* ═══════════════════════════════════════════════════════════
   CREATIVE INTELLIGENCE — merged hub
   Signals + Ideas + Quiet Wins + Insights + Moodboards
   Features: 61-100, 181-190, 211-216
   ═══════════════════════════════════════════════════════════ */

type CITab = 'signals' | 'ideas' | 'wins' | 'insights' | 'moodboards'

interface CreativeSignal { id: string; title: string; type: string; score: number; trend: 'Rising' | 'Stable' | 'Declining'; notes: string; createdAt: string }
interface Idea { id: string; title: string; description: string; category: string; impact: 'high' | 'medium' | 'low'; feasibility: 'easy' | 'medium' | 'hard'; score: number; status: 'new' | 'evaluating' | 'approved' | 'archived'; tags: string[]; linkedProject: string; createdAt: string }
interface Win { id: string; title: string; description: string; date: string; scope: 'personal' | 'team'; milestone: boolean }
interface Insight { id: string; title: string; description: string; impact: string; actionable: boolean; source: string; createdAt: string }
interface MoodItem { id: string; title: string; url: string; tags: string[]; boardName: string; createdAt: string }

export function CreativeIntelligence() {
  const [tab, setTab] = useState<CITab>('signals')
  const [signals, setSignals] = useCloudStorage<CreativeSignal[]>('ci_signals', [])
  const [ideas, setIdeas] = useCloudStorage<Idea[]>('ci_ideas', [])
  const [wins, setWins] = useCloudStorage<Win[]>('ci_wins', [])
  const [insights, setInsights] = useCloudStorage<Insight[]>('ci_insights', [])
  const [moods, setMoods] = useCloudStorage<MoodItem[]>('ci_moods', [])
  const [search, setSearch] = useState(''); const [showForm, setShowForm] = useState<string | null>(null)
  const [focusMode, setFocusMode] = useState(false)

  const calcScore = (impact: string, feas: string) => ({ high: 3, medium: 2, low: 1 }[impact] || 2) * 30 + ({ easy: 3, medium: 2, hard: 1 }[feas] || 2) * 10
  const sortedIdeas = useMemo(() => { let r = [...ideas]; if (search) r = r.filter(i => i.title.toLowerCase().includes(search.toLowerCase())); return r.sort((a, b) => b.score - a.score) }, [ideas, search])

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Creative Intelligence</h1><p className={styles.subtitle}>Signals · Ideas · Wins · Insights · Inspiration</p></div>
        <div className={styles.headerRight}><button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus (#80)'}</button></div></header>
      <nav className={styles.tabNav}>{(['signals', 'ideas', 'wins', 'insights', 'moodboards'] as CITab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      <main className={styles.mainContent}>
        {/* ═══ SIGNALS (#61-68) ═══ */}
        {tab === 'signals' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Signals</div><div className={styles.kpiValue}>{signals.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Rising</div><div className={styles.kpiValue}>{signals.filter(s => s.trend === 'Rising').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Score</div><div className={styles.kpiValue}>{signals.length ? Math.round(signals.reduce((a, s) => a + s.score, 0) / signals.length) : 0}</div></div>
          </div>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'signal' ? null : 'signal')}>+ Track Signal (#61)</button>
          {showForm === 'signal' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Signal name" id="cs_title" /><select className={styles.select} id="cs_type"><option>Visual</option><option>Audience</option><option>Market</option><option>Creative</option></select><input className={styles.input} type="number" placeholder="Score 0-100" id="cs_score" /><select className={styles.select} id="cs_trend"><option>Rising</option><option>Stable</option><option>Declining</option></select><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('cs_title') as HTMLInputElement).value; if (t) { setSignals(p => [{ id: uid(), title: t, type: (document.getElementById('cs_type') as HTMLSelectElement).value, score: Number((document.getElementById('cs_score') as HTMLInputElement).value) || 50, trend: (document.getElementById('cs_trend') as HTMLSelectElement).value as any, notes: '', createdAt: now() }, ...p]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.grid}>{signals.map(s => (
            <div key={s.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{s.title}</span><span className={`${styles.statusBadge} ${styles[`st_${s.trend.toLowerCase()}`]}`}>{s.trend}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{s.type}</span><span className={styles.scoreBadge}>{s.score}/100</span></div>
              <div className={styles.cardActions}><button className={styles.deleteBtn} onClick={() => setSignals(p => p.filter(x => x.id !== s.id))}>×</button></div>
            </div>
          ))}</div>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI Advisory (#67)</div><pre className={styles.aiOutput}>{`Creative Intelligence:\n${'─'.repeat(35)}\n• ${signals.length} signals tracked\n• ${signals.filter(s => s.trend === 'Rising').length} rising trends\n• Top signal: ${signals.length ? [...signals].sort((a, b) => b.score - a.score)[0]?.title : 'N/A'}\n• Recommendation: ${signals.filter(s => s.trend === 'Rising').length > 2 ? 'Multiple rising signals — consider cross-pollination.' : 'Build signal volume for better insights.'}`}</pre></div>
        </div>}

        {/* ═══ IDEAS (#91-100, #181-190) ═══ */}
        {tab === 'ideas' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Idea Management & Inspiration</h2>
          <div className={styles.controlsRow}><input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ideas (#92)..." /><button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'idea' ? null : 'idea')}>+ Capture Idea (#91)</button></div>
          {showForm === 'idea' && <div className={styles.inlineForm}>
            <input className={styles.input} placeholder="Idea title" id="ci_title" />
            <select className={styles.select} id="ci_cat"><option>Product</option><option>Content</option><option>Feature</option><option>Process</option><option>Creative</option></select>
            <select className={styles.select} id="ci_impact"><option value="medium">Medium Impact</option><option value="high">High Impact</option><option value="low">Low Impact</option></select>
            <select className={styles.select} id="ci_feas"><option value="medium">Medium Feasibility</option><option value="easy">Easy</option><option value="hard">Hard</option></select>
            <textarea className={styles.textarea} rows={2} placeholder="Description..." id="ci_desc" style={{ flex: 1, minWidth: 160 }} />
            <button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ci_title') as HTMLInputElement).value; const impact = (document.getElementById('ci_impact') as HTMLSelectElement).value; const feas = (document.getElementById('ci_feas') as HTMLSelectElement).value; if (t) { setIdeas(p => [{ id: uid(), title: t, description: (document.getElementById('ci_desc') as HTMLTextAreaElement).value, category: (document.getElementById('ci_cat') as HTMLSelectElement).value, impact: impact as any, feasibility: feas as any, score: calcScore(impact, feas), status: 'new', tags: [], linkedProject: '', createdAt: now() }, ...p]); setShowForm(null) } }}>Add</button>
          </div>}
          <div className={styles.grid}>{sortedIdeas.map(i => (
            <div key={i.id} className={styles.card}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{i.title}</span><span className={styles.scoreBadge}>Score: {i.score}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{i.category}</span><span className={styles.tag}>{i.impact} impact</span><span className={styles.tag}>{i.feasibility}</span></div>
              {i.description && <p className={styles.cardPreview}>{i.description.slice(0, 80)}</p>}
              <div className={styles.cardActions}>
                <select className={styles.miniSelect} value={i.status} onChange={e => setIdeas(p => p.map(x => x.id === i.id ? { ...x, status: e.target.value as any } : x))}><option value="new">New</option><option value="evaluating">Evaluating</option><option value="approved">Approved</option><option value="archived">Archived</option></select>
                <button className={styles.deleteBtn} onClick={() => setIdeas(p => p.filter(x => x.id !== i.id))}>×</button>
              </div>
            </div>
          ))}</div>
        </div>}

        {/* ═══ WINS (#81-90) ═══ */}
        {tab === 'wins' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quiet Wins Tracker</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'win' ? null : 'win')}>+ Log Win (#81)</button>
          {showForm === 'win' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Achievement" id="cw_title" /><input className={styles.input} placeholder="Description" id="cw_desc" /><select className={styles.select} id="cw_scope"><option value="personal">Personal</option><option value="team">Team</option></select><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('cw_title') as HTMLInputElement).value; if (t) { setWins(p => [{ id: uid(), title: t, description: (document.getElementById('cw_desc') as HTMLInputElement).value, date: now(), scope: (document.getElementById('cw_scope') as HTMLSelectElement).value as any, milestone: false }, ...p]); setShowForm(null) } }}>Log</button></div>}
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Wins</div><div className={styles.kpiValue}>{wins.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Milestones (#84)</div><div className={styles.kpiValue}>{wins.filter(w => w.milestone).length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Personal</div><div className={styles.kpiValue}>{wins.filter(w => w.scope === 'personal').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Team</div><div className={styles.kpiValue}>{wins.filter(w => w.scope === 'team').length}</div></div>
          </div>
          <div className={styles.timeline}>{wins.map(w => (
            <div key={w.id} className={styles.timelineItem}><span className={styles.timelineDot} /><div style={{ flex: 1 }}>
              <div className={styles.cardHeader}><span className={styles.fontName}>{w.title}</span><span className={styles.helperText}>{fmtDate(w.date)}</span></div>
              {w.description && <p className={styles.cardPreview}>{w.description}</p>}
              <div className={styles.cardActions}><button className={`${styles.ghostBtn} ${w.milestone ? styles.chipActive : ''}`} onClick={() => setWins(p => p.map(x => x.id === w.id ? { ...x, milestone: !x.milestone } : x))}>{w.milestone ? '★ Milestone' : '☆ Mark Milestone'}</button><span className={styles.tag}>{w.scope}</span><button className={styles.deleteBtn} onClick={() => setWins(p => p.filter(x => x.id !== w.id))}>×</button></div>
            </div></div>
          ))}</div>
          <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = wins.map(w => `${w.milestone ? '★ ' : ''}${w.title} (${fmtDate(w.date)}) — ${w.description}`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `wins-${Date.now()}.txt`; a.click() }}>Export Wins (#90)</button></div>
        </div>}

        {/* ═══ INSIGHTS (#211-216) ═══ */}
        {tab === 'insights' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Insights Lab</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'insight' ? null : 'insight')}>+ Add Insight (#211)</button>
          {showForm === 'insight' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Insight title" id="ci2_title" /><input className={styles.input} placeholder="Description" id="ci2_desc" /><select className={styles.select} id="ci2_impact"><option>High</option><option>Medium</option><option>Low</option></select><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ci2_title') as HTMLInputElement).value; if (t) { setInsights(p => [{ id: uid(), title: t, description: (document.getElementById('ci2_desc') as HTMLInputElement).value, impact: (document.getElementById('ci2_impact') as HTMLSelectElement).value, actionable: true, source: '', createdAt: now() }, ...p]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{insights.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Actionable</div><div className={styles.kpiValue}>{insights.filter(i => i.actionable).length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>High Impact</div><div className={styles.kpiValue}>{insights.filter(i => i.impact === 'High').length}</div></div>
          </div>
          <div className={styles.grid}>{insights.map(i => (
            <div key={i.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{i.title}</span><span className={`${styles.statusBadge} ${styles[`st_${i.impact.toLowerCase()}`]}`}>{i.impact}</span></div>
              {i.description && <p className={styles.cardPreview}>{i.description}</p>}
              <div className={styles.cardActions}><button className={`${styles.ghostBtn} ${i.actionable ? styles.chipActive : ''}`} onClick={() => setInsights(p => p.map(x => x.id === i.id ? { ...x, actionable: !x.actionable } : x))}>{i.actionable ? 'Actionable' : 'Note'}</button><button className={styles.deleteBtn} onClick={() => setInsights(p => p.filter(x => x.id !== i.id))}>×</button></div>
            </div>
          ))}</div>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI Recommendations (#215)</div><pre className={styles.aiOutput}>{`Insights Summary:\n${'─'.repeat(35)}\n• ${insights.length} insights captured\n• ${insights.filter(i => i.actionable).length} actionable items\n• ${ideas.length} ideas in pipeline\n• ${wins.length} wins logged\n• Focus: ${insights.filter(i => i.impact === 'High').length > 0 ? 'Act on high-impact insights first.' : 'Gather more data points.'}`}</pre></div>
          <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = insights.map(i => `${i.title} (${i.impact}) — ${i.description}`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `insights-${Date.now()}.txt`; a.click() }}>Export Insights (#216)</button></div>
        </div>}

        {/* ═══ MOODBOARDS (#184-190) ═══ */}
        {tab === 'moodboards' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ideas & Inspiration</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'mood' ? null : 'mood')}>+ Add Inspiration (#181)</button>
          {showForm === 'mood' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Title" id="cm_title" /><input className={styles.input} placeholder="URL / Link" id="cm_url" /><input className={styles.input} placeholder="Board name" id="cm_board" /><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('cm_title') as HTMLInputElement).value; if (t) { setMoods(p => [{ id: uid(), title: t, url: (document.getElementById('cm_url') as HTMLInputElement).value, tags: [], boardName: (document.getElementById('cm_board') as HTMLInputElement).value || 'General', createdAt: now() }, ...p]); setShowForm(null) } }}>Add</button></div>}
          {(() => { const boards = [...new Set(moods.map(m => m.boardName || 'General'))]; return boards.map(b => (
            <div key={b} className={styles.dnaBlock}><label className={styles.label}>{b}</label>
              <div className={styles.grid}>{moods.filter(m => (m.boardName || 'General') === b).map(m => (
                <div key={m.id} className={styles.card}><span className={styles.cardTitle}>{m.title}</span>{m.url && <span className={styles.helperText}>{m.url}</span>}
                  <div className={styles.cardActions}><button className={styles.deleteBtn} onClick={() => setMoods(p => p.filter(x => x.id !== m.id))}>×</button></div>
                </div>
              ))}</div>
            </div>
          )) })()}
        </div>}
      </main>
    </div>
  )
}

export { CreativeIntelligence as QuietWins }
export { CreativeIntelligence as IdeaManagement }
