import { useState } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()

/* ═══════════════════════════════════════════════════════════
   BRAND & CULTURAL SYSTEMS — merged
   Brand Identity + Cultural Risk
   Features: 111-130
   ═══════════════════════════════════════════════════════════ */

type BSTab = 'brand' | 'cultural' | 'audit'

interface BrandAsset { id: string; name: string; type: 'logo' | 'color' | 'typography' | 'tone' | 'guideline'; value: string; version: number; notes: string; createdAt: string }
interface CulturalRisk { id: string; title: string; riskLevel: 'low' | 'medium' | 'high'; project: string; notes: string; status: 'monitoring' | 'mitigated' | 'active' }
interface ComplianceItem { id: string; title: string; done: boolean; category: string }

export function BrandIdentity() {
  const [tab, setTab] = useState<BSTab>('brand')
  const [assets, setAssets] = useCloudStorage<BrandAsset[]>('bs_assets', [])
  const [risks, setRisks] = useCloudStorage<CulturalRisk[]>('bs_risks', [])
  const [compliance, setCompliance] = useCloudStorage<ComplianceItem[]>('bs_compliance', [])
  const [showForm, setShowForm] = useState<string | null>(null)

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Brand & Culture</h1><p className={styles.subtitle}>Identity Systems · Cultural Risk · Compliance</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm('asset')}>+ Brand Asset (#111)</button></div></header>
      <nav className={styles.tabNav}>{(['brand', 'cultural', 'audit'] as BSTab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      {showForm === 'asset' && <div className={styles.overlay}><div className={styles.wizardPanel}><h2 className={styles.wizardTitle}>New Brand Asset</h2>
        <div className={styles.formStack}>
          <div className={styles.formGroup}><label>Name</label><input className={styles.input} id="ba_name" /></div>
          <div className={styles.fieldRow}><div className={styles.formGroup}><label>Type</label><select className={styles.select} id="ba_type"><option value="logo">Logo (#111)</option><option value="color">Color (#111)</option><option value="typography">Typography (#112)</option><option value="tone">Tone of Voice (#113)</option><option value="guideline">Guideline (#114)</option></select></div><div className={styles.formGroup}><label>Value / Details</label><input className={styles.input} id="ba_val" placeholder="#FFFFFF, Helvetica, etc." /></div></div>
          <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('ba_name') as HTMLInputElement).value; if (n) { setAssets(p => [{ id: uid(), name: n, type: (document.getElementById('ba_type') as HTMLSelectElement).value as any, value: (document.getElementById('ba_val') as HTMLInputElement).value, version: 1, notes: '', createdAt: now() }, ...p]); setShowForm(null) } }}>Add</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
        </div></div></div>}

      <main className={styles.mainContent}>
        {tab === 'brand' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Assets</div><div className={styles.kpiValue}>{assets.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Logos</div><div className={styles.kpiValue}>{assets.filter(a => a.type === 'logo').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Colors</div><div className={styles.kpiValue}>{assets.filter(a => a.type === 'color').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Typography</div><div className={styles.kpiValue}>{assets.filter(a => a.type === 'typography').length}</div></div>
          </div>
          <div className={styles.grid}>{assets.map(a => (
            <div key={a.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{a.name}</span><span className={styles.tag}>{a.type} · v{a.version}</span></div>
              {a.value && <p className={styles.cardPreview}>{a.value}</p>}
              {a.type === 'color' && a.value && <div style={{ width: 40, height: 20, background: a.value, borderRadius: 4, marginBottom: 8, border: '1px solid #333' }} />}
              <div className={styles.cardActions}><button className={styles.ghostBtn} onClick={() => setAssets(p => p.map(x => x.id === a.id ? { ...x, version: x.version + 1 } : x))}>+ Version (#116)</button><button className={styles.deleteBtn} onClick={() => setAssets(p => p.filter(x => x.id !== a.id))}>×</button></div>
            </div>
          ))}</div>
        </div>}

        {tab === 'cultural' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cultural & Risk (#121-130)</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'risk' ? null : 'risk')}>+ Add Risk (#122)</button>
          {showForm === 'risk' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Risk title" id="cr_title" /><select className={styles.select} id="cr_level"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><input className={styles.input} placeholder="Project" id="cr_proj" /><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('cr_title') as HTMLInputElement).value; if (t) { setRisks(p => [...p, { id: uid(), title: t, riskLevel: (document.getElementById('cr_level') as HTMLSelectElement).value as any, project: (document.getElementById('cr_proj') as HTMLInputElement).value, notes: '', status: 'monitoring' }]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.grid}>{risks.map(r => (
            <div key={r.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{r.title}</span><span className={`${styles.statusBadge} ${styles[`st_${r.riskLevel}`]}`}>{r.riskLevel} risk</span></div>
              {r.project && <div className={styles.cardMeta}><span className={styles.tag}>{r.project}</span></div>}
              <div className={styles.cardActions}><select className={styles.miniSelect} value={r.status} onChange={e => setRisks(p => p.map(x => x.id === r.id ? { ...x, status: e.target.value as any } : x))}><option value="monitoring">Monitoring</option><option value="active">Active</option><option value="mitigated">Mitigated</option></select><button className={styles.deleteBtn} onClick={() => setRisks(p => p.filter(x => x.id !== r.id))}>×</button></div>
            </div>
          ))}</div>
          <div className={styles.dnaBlock}><div className={styles.blockHeader}><label className={styles.label}>Compliance Checklist (#126)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'comp' ? null : 'comp')}>+ Add</button></div>
            {showForm === 'comp' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Checklist item" id="cc_title" /><input className={styles.input} placeholder="Category" id="cc_cat" /><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('cc_title') as HTMLInputElement).value; if (t) { setCompliance(p => [...p, { id: uid(), title: t, done: false, category: (document.getElementById('cc_cat') as HTMLInputElement).value || 'General' }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.taskList}>{compliance.map(c => <div key={c.id} className={`${styles.taskItem} ${c.done ? styles.taskDone : ''}`}><button className={styles.checkBtn} onClick={() => setCompliance(p => p.map(x => x.id === c.id ? { ...x, done: !x.done } : x))}>{c.done ? '✓' : '○'}</button><span className={styles.taskContent}>{c.title}</span><span className={styles.tag}>{c.category}</span><button className={styles.deleteBtn} onClick={() => setCompliance(p => p.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI Risk Advisory (#129)</div><pre className={styles.aiOutput}>{`Risk Assessment:\n${'─'.repeat(35)}\n• ${risks.length} risks tracked\n• ${risks.filter(r => r.riskLevel === 'high').length} high-risk items\n• ${compliance.filter(c => c.done).length}/${compliance.length} compliance items completed\n• Recommendation: ${risks.filter(r => r.riskLevel === 'high' && r.status !== 'mitigated').length > 0 ? 'Address high-risk items immediately.' : 'No critical risks. Maintain monitoring.'}`}</pre></div>
        </div>}

        {tab === 'audit' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Brand Audit & Export (#118-120)</h2>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI Brand Audit (#119)</div><pre className={styles.aiOutput}>{`Brand System Health:\n${'─'.repeat(35)}\n• ${assets.length} brand assets registered\n• ${assets.filter(a => a.type === 'logo').length} logos, ${assets.filter(a => a.type === 'color').length} colors, ${assets.filter(a => a.type === 'typography').length} typography\n• ${risks.filter(r => r.status === 'mitigated').length} mitigated risks\n• Consistency: ${assets.length > 5 ? 'Strong' : assets.length > 2 ? 'Moderate' : 'Build your brand system'}\n• Coverage: ${['logo', 'color', 'typography', 'tone', 'guideline'].filter(t => assets.some(a => a.type === t)).length}/5 categories`}</pre></div>
          <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = `Brand Manual\n${'='.repeat(40)}\n${assets.map(a => `[${a.type}] ${a.name}: ${a.value} (v${a.version})`).join('\n')}\n\nRisks:\n${risks.map(r => `${r.title} — ${r.riskLevel} (${r.status})`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `brand-manual-${Date.now()}.txt`; a.click() }}>Export Brand Manual (#120)</button>
            <button className={styles.exportBtn} onClick={() => { const d = risks.map(r => `${r.title} | ${r.riskLevel} | ${r.status} | ${r.project}`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `risk-report-${Date.now()}.txt`; a.click() }}>Export Risk Report (#130)</button></div>
        </div>}
      </main>
    </div>
  )
}

export { BrandIdentity as CulturalRisk }
