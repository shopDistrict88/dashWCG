import { useState } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

/* ═══════════════════════════════════════════════════════════
   CREATIVE DECISIONS & STRATEGY — merged
   Decision Frameworks + Strategy Tools + Problem-Solution Mapper
   Features: 101-110
   ═══════════════════════════════════════════════════════════ */

type CDTab = 'decisions' | 'strategy' | 'problems' | 'history'

interface Decision { id: string; title: string; framework: string; riskScore: number; rewardScore: number; priority: 'low' | 'medium' | 'high' | 'critical'; status: 'pending' | 'decided' | 'implemented'; outcome: string; votes: number; createdAt: string }
interface ProblemSolution { id: string; problem: string; solution: string; status: 'planning' | 'testing' | 'implemented'; category: string }
interface Scenario { id: string; title: string; description: string; probability: number; impact: string }

export function CreativeDecisions() {
  const [tab, setTab] = useState<CDTab>('decisions')
  const [decisions, setDecisions] = useCloudStorage<Decision[]>('cd_decisions', [])
  const [problems, setProblems] = useCloudStorage<ProblemSolution[]>('cd_problems', [])
  const [scenarios, setScenarios] = useCloudStorage<Scenario[]>('cd_scenarios', [])
  const [showForm, setShowForm] = useState<string | null>(null)

  const FRAMEWORKS = ['Risk-Reward Matrix', 'Eisenhower Matrix', 'SWOT Analysis', 'Decision Tree', 'Pro-Con List', 'Weighted Scoring']

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Creative Decisions & Strategy</h1><p className={styles.subtitle}>Frameworks · Scenarios · Problem-Solution Mapping</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm('decision')}>+ New Decision (#101)</button></div></header>
      <nav className={styles.tabNav}>{(['decisions', 'strategy', 'problems', 'history'] as CDTab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      {showForm === 'decision' && <div className={styles.overlay}><div className={styles.wizardPanel}><h2 className={styles.wizardTitle}>New Decision</h2>
        <div className={styles.formStack}>
          <div className={styles.formGroup}><label>Decision Title</label><input className={styles.input} id="cd_title" /></div>
          <div className={styles.formGroup}><label>Framework (#101)</label><select className={styles.select} id="cd_fw">{FRAMEWORKS.map(f => <option key={f}>{f}</option>)}</select></div>
          <div className={styles.fieldRow}><div className={styles.formGroup}><label>Risk Score (#103)</label><input className={styles.input} type="number" id="cd_risk" placeholder="0-100" /></div><div className={styles.formGroup}><label>Reward Score</label><input className={styles.input} type="number" id="cd_reward" placeholder="0-100" /></div></div>
          <div className={styles.formGroup}><label>Priority (#102)</label><select className={styles.select} id="cd_pri"><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option><option value="low">Low</option></select></div>
          <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('cd_title') as HTMLInputElement).value; if (t) { setDecisions(p => [{ id: uid(), title: t, framework: (document.getElementById('cd_fw') as HTMLSelectElement).value, riskScore: Number((document.getElementById('cd_risk') as HTMLInputElement).value) || 50, rewardScore: Number((document.getElementById('cd_reward') as HTMLInputElement).value) || 50, priority: (document.getElementById('cd_pri') as HTMLSelectElement).value as any, status: 'pending', outcome: '', votes: 0, createdAt: now() }, ...p]); setShowForm(null) } }}>Create</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
        </div></div></div>}

      <main className={styles.mainContent}>
        {tab === 'decisions' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{decisions.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Pending</div><div className={styles.kpiValue}>{decisions.filter(d => d.status === 'pending').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Implemented</div><div className={styles.kpiValue}>{decisions.filter(d => d.status === 'implemented').length}</div></div>
          </div>
          <div className={styles.grid}>{decisions.map(d => (
            <div key={d.id} className={styles.card}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{d.title}</span><span className={`${styles.statusBadge} ${styles[`st_${d.status}`]}`}>{d.status}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{d.framework}</span><span className={styles.tag}>{d.priority}</span></div>
              <div className={styles.scoreRow}><div className={styles.scoreItem}><span className={styles.scoreLabel}>Risk</span><span className={styles.scoreVal}>{d.riskScore}</span></div><div className={styles.scoreItem}><span className={styles.scoreLabel}>Reward</span><span className={styles.scoreVal}>{d.rewardScore}</span></div></div>
              <div className={styles.cardActions}>
                <select className={styles.miniSelect} value={d.status} onChange={e => setDecisions(p => p.map(x => x.id === d.id ? { ...x, status: e.target.value as any } : x))}><option value="pending">Pending</option><option value="decided">Decided</option><option value="implemented">Implemented</option></select>
                <button className={styles.ghostBtn} onClick={() => setDecisions(p => p.map(x => x.id === d.id ? { ...x, votes: x.votes + 1 } : x))}>Vote (#108) ({d.votes})</button>
                <button className={styles.deleteBtn} onClick={() => setDecisions(p => p.filter(x => x.id !== d.id))}>×</button>
              </div>
            </div>
          ))}</div>
        </div>}

        {tab === 'strategy' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Scenario Simulation (#104)</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'scenario' ? null : 'scenario')}>+ Add Scenario</button>
          {showForm === 'scenario' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Scenario" id="sc_title" /><input className={styles.input} placeholder="Description" id="sc_desc" /><input className={styles.input} type="number" placeholder="Probability %" id="sc_prob" /><select className={styles.select} id="sc_impact"><option>High</option><option>Medium</option><option>Low</option></select><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('sc_title') as HTMLInputElement).value; if (t) { setScenarios(p => [...p, { id: uid(), title: t, description: (document.getElementById('sc_desc') as HTMLInputElement).value, probability: Number((document.getElementById('sc_prob') as HTMLInputElement).value) || 50, impact: (document.getElementById('sc_impact') as HTMLSelectElement).value }]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.grid}>{scenarios.map(s => <div key={s.id} className={styles.card}><span className={styles.cardTitle}>{s.title}</span>{s.description && <p className={styles.cardPreview}>{s.description}</p>}<div className={styles.cardMeta}><span className={styles.scoreBadge}>{s.probability}% likely</span><span className={styles.tag}>{s.impact} impact</span></div><button className={styles.deleteBtn} onClick={() => setScenarios(p => p.filter(x => x.id !== s.id))}>×</button></div>)}</div>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI Advisory (#105)</div><pre className={styles.aiOutput}>{`Decision Intelligence:\n${'─'.repeat(35)}\n• ${decisions.length} decisions tracked\n• Avg risk: ${decisions.length ? Math.round(decisions.reduce((a, d) => a + d.riskScore, 0) / decisions.length) : 0}/100\n• Avg reward: ${decisions.length ? Math.round(decisions.reduce((a, d) => a + d.rewardScore, 0) / decisions.length) : 0}/100\n• ${decisions.filter(d => d.rewardScore > d.riskScore).length} favorable risk-reward ratio\n• ${scenarios.length} scenarios modeled`}</pre></div>
        </div>}

        {tab === 'problems' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Problem-Solution Mapper</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'problem' ? null : 'problem')}>+ Map Challenge</button>
          {showForm === 'problem' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Problem / Challenge" id="ps_prob" /><input className={styles.input} placeholder="Solution" id="ps_sol" /><select className={styles.select} id="ps_cat"><option>Design</option><option>Technical</option><option>Market</option><option>Operations</option><option>Creative</option></select><button className={styles.primaryBtn} onClick={() => { const p = (document.getElementById('ps_prob') as HTMLInputElement).value; if (p) { setProblems(prev => [...prev, { id: uid(), problem: p, solution: (document.getElementById('ps_sol') as HTMLInputElement).value, status: 'planning', category: (document.getElementById('ps_cat') as HTMLSelectElement).value }]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.grid}>{problems.map(p => (
            <div key={p.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{p.problem}</span><span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{p.category}</span></div>
              {p.solution && <p className={styles.cardPreview}>{p.solution}</p>}
              <div className={styles.cardActions}><select className={styles.miniSelect} value={p.status} onChange={e => setProblems(prev => prev.map(x => x.id === p.id ? { ...x, status: e.target.value as any } : x))}><option value="planning">Planning</option><option value="testing">Testing</option><option value="implemented">Implemented</option></select><button className={styles.deleteBtn} onClick={() => setProblems(prev => prev.filter(x => x.id !== p.id))}>×</button></div>
            </div>
          ))}</div>
        </div>}

        {tab === 'history' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Decision History (#107)</h2>
          <div className={styles.timeline}>{decisions.map(d => <div key={d.id} className={styles.timelineItem}><span className={styles.timelineDot} /><div><strong>{d.title}</strong><span className={styles.helperText}> · {d.framework} · {d.status} · {fmtDate(d.createdAt)}</span></div></div>)}</div>
          <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = `Strategic Insights\n${'='.repeat(40)}\nDecisions:\n${decisions.map(d => `${d.title} | Risk:${d.riskScore} Reward:${d.rewardScore} | ${d.status}`).join('\n')}\n\nProblems:\n${problems.map(p => `${p.problem} → ${p.solution} (${p.status})`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `strategy-report-${Date.now()}.txt`; a.click() }}>Export (#110)</button></div>
        </div>}
      </main>
    </div>
  )
}

export { CreativeDecisions as StrategyTools }
