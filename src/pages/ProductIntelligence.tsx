import { useState } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()

/* ═══════════════════════════════════════════════════════════
   PRODUCT & QUALITY — merged
   Product Intelligence + Quality & Ethics
   Features: 131-150
   ═══════════════════════════════════════════════════════════ */

type PITab = 'intelligence' | 'quality' | 'reports'

interface Product { id: string; name: string; collection: string; stage: 'concept' | 'development' | 'production' | 'mature' | 'decline'; fitScore: number; trendScore: number; salesForecast: number; sustainability: number; notes: string; createdAt: string }
interface QCItem { id: string; productId: string; title: string; done: boolean; category: 'quality' | 'ethics' | 'sourcing' | 'sustainability' }
interface Supplier { id: string; name: string; rating: number; ethical: boolean; notes: string }

export function ProductIntelligence() {
  const [tab, setTab] = useState<PITab>('intelligence')
  const [products, setProducts] = useCloudStorage<Product[]>('pi2_products', [])
  const [qcItems, setQcItems] = useCloudStorage<QCItem[]>('pi2_qc', [])
  const [suppliers, setSuppliers] = useCloudStorage<Supplier[]>('pi2_suppliers', [])
  const [showForm, setShowForm] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Product & Quality</h1><p className={styles.subtitle}>Intelligence · QC · Ethics · Sustainability</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm('product')}>+ Add Product (#131)</button></div></header>
      <nav className={styles.tabNav}>{(['intelligence', 'quality', 'reports'] as PITab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      {showForm === 'product' && <div className={styles.overlay}><div className={styles.wizardPanel}><h2 className={styles.wizardTitle}>New Product</h2>
        <div className={styles.formStack}>
          <div className={styles.fieldRow}><div className={styles.formGroup}><label>Name</label><input className={styles.input} id="pp_name" /></div><div className={styles.formGroup}><label>Collection</label><input className={styles.input} id="pp_coll" /></div></div>
          <div className={styles.fieldRow}><div className={styles.formGroup}><label>Fit Score</label><input className={styles.input} type="number" id="pp_fit" placeholder="0-100" /></div><div className={styles.formGroup}><label>Trend Score</label><input className={styles.input} type="number" id="pp_trend" placeholder="0-100" /></div><div className={styles.formGroup}><label>Sustainability</label><input className={styles.input} type="number" id="pp_sus" placeholder="0-100" /></div></div>
          <div className={styles.formGroup}><label>Stage</label><select className={styles.select} id="pp_stage"><option value="concept">Concept</option><option value="development">Development</option><option value="production">Production</option><option value="mature">Mature</option></select></div>
          <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('pp_name') as HTMLInputElement).value; if (n) { setProducts(p => [{ id: uid(), name: n, collection: (document.getElementById('pp_coll') as HTMLInputElement).value, stage: (document.getElementById('pp_stage') as HTMLSelectElement).value as any, fitScore: Number((document.getElementById('pp_fit') as HTMLInputElement).value) || 50, trendScore: Number((document.getElementById('pp_trend') as HTMLInputElement).value) || 50, salesForecast: 0, sustainability: Number((document.getElementById('pp_sus') as HTMLInputElement).value) || 50, notes: '', createdAt: now() }, ...p]); setShowForm(null) } }}>Create</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
        </div></div></div>}

      <main className={styles.mainContent}>
        {tab === 'intelligence' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Products</div><div className={styles.kpiValue}>{products.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Fit (#133)</div><div className={styles.kpiValue}>{products.length ? Math.round(products.reduce((a, p) => a + p.fitScore, 0) / products.length) : 0}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Trend (#138)</div><div className={styles.kpiValue}>{products.length ? Math.round(products.reduce((a, p) => a + p.trendScore, 0) / products.length) : 0}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Sustainability (#144)</div><div className={styles.kpiValue}>{products.length ? Math.round(products.reduce((a, p) => a + p.sustainability, 0) / products.length) : 0}</div></div>
          </div>
          <div className={styles.controlsRow}><input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." /></div>
          <div className={styles.grid}>{products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{p.name}</span><span className={`${styles.statusBadge} ${styles[`st_${p.stage === 'mature' ? 'completed' : p.stage === 'production' ? 'active' : p.stage}`]}`}>{p.stage}</span></div>
              <div className={styles.cardMeta}>{p.collection && <span className={styles.tag}>{p.collection}</span>}</div>
              <div className={styles.scoreRow}><div className={styles.scoreItem}><span className={styles.scoreLabel}>Fit</span><span className={styles.scoreVal}>{p.fitScore}</span></div><div className={styles.scoreItem}><span className={styles.scoreLabel}>Trend</span><span className={styles.scoreVal}>{p.trendScore}</span></div><div className={styles.scoreItem}><span className={styles.scoreLabel}>Sustain</span><span className={styles.scoreVal}>{p.sustainability}</span></div></div>
              <div className={styles.cardActions}><select className={styles.miniSelect} value={p.stage} onChange={e => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, stage: e.target.value as any } : x))}><option value="concept">Concept</option><option value="development">Development</option><option value="production">Production</option><option value="mature">Mature</option><option value="decline">Decline</option></select><button className={styles.deleteBtn} onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))}>×</button></div>
            </div>
          ))}</div>
        </div>}

        {tab === 'quality' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quality & Ethics (#141-150)</h2>
          <div className={styles.dnaBlock}><div className={styles.blockHeader}><label className={styles.label}>QC Checklist (#141)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'qc' ? null : 'qc')}>+ Add</button></div>
            {showForm === 'qc' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Check item" id="qc_title" /><select className={styles.select} id="qc_cat"><option value="quality">Quality</option><option value="ethics">Ethics</option><option value="sourcing">Sourcing (#142)</option><option value="sustainability">Sustainability (#144)</option></select><select className={styles.select} id="qc_prod">{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('qc_title') as HTMLInputElement).value; if (t) { setQcItems(p => [...p, { id: uid(), productId: (document.getElementById('qc_prod') as HTMLSelectElement).value, title: t, done: false, category: (document.getElementById('qc_cat') as HTMLSelectElement).value as any }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.taskList}>{qcItems.map(q => <div key={q.id} className={`${styles.taskItem} ${q.done ? styles.taskDone : ''}`}><button className={styles.checkBtn} onClick={() => setQcItems(p => p.map(x => x.id === q.id ? { ...x, done: !x.done } : x))}>{q.done ? '✓' : '○'}</button><span className={styles.taskContent}>{q.title}</span><span className={styles.tag}>{q.category}</span><button className={styles.deleteBtn} onClick={() => setQcItems(p => p.filter(x => x.id !== q.id))}>×</button></div>)}</div>
          </div>
          <div className={styles.dnaBlock}><div className={styles.blockHeader}><label className={styles.label}>Suppliers (#148)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'supplier' ? null : 'supplier')}>+ Add</button></div>
            {showForm === 'supplier' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Supplier name" id="sp_name" /><input className={styles.input} type="number" placeholder="Rating 1-5" id="sp_rate" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('sp_name') as HTMLInputElement).value; if (n) { setSuppliers(p => [...p, { id: uid(), name: n, rating: Number((document.getElementById('sp_rate') as HTMLInputElement).value) || 3, ethical: true, notes: '' }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{suppliers.map(s => <div key={s.id} className={styles.teamCard}><span className={styles.fontName}>{s.name}</span><span className={styles.tag}>Rating: {s.rating}/5</span><span className={s.ethical ? styles.profitPositive : styles.profitNegative}>{s.ethical ? 'Ethical' : 'Review'}</span><button className={styles.deleteBtn} onClick={() => setSuppliers(p => p.filter(x => x.id !== s.id))}>×</button></div>)}</div>
          </div>
        </div>}

        {tab === 'reports' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reports & Analytics (#135, #140, #150)</h2>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>Product Intelligence</div><pre className={styles.aiOutput}>{`Product Report:\n${'─'.repeat(35)}\n• ${products.length} products tracked\n• Avg fit: ${products.length ? Math.round(products.reduce((a, p) => a + p.fitScore, 0) / products.length) : 0}/100\n• Avg sustainability: ${products.length ? Math.round(products.reduce((a, p) => a + p.sustainability, 0) / products.length) : 0}/100\n• QC: ${qcItems.filter(q => q.done).length}/${qcItems.length} checks passed\n• ${suppliers.length} suppliers tracked\n• Stage distribution: ${['concept', 'development', 'production', 'mature'].map(s => `${s}: ${products.filter(p => p.stage === s).length}`).join(', ')}`}</pre></div>
          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = products.map(p => `${p.name} | ${p.collection} | Fit:${p.fitScore} Trend:${p.trendScore} Sustain:${p.sustainability} | ${p.stage}`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `product-report-${Date.now()}.txt`; a.click() }}>Export Products (#140)</button>
            <button className={styles.exportBtn} onClick={() => { const d = `QC Report\n${qcItems.map(q => `[${q.done ? '✓' : '○'}] ${q.title} (${q.category})`).join('\n')}\n\nSuppliers:\n${suppliers.map(s => `${s.name} — Rating ${s.rating}/5`).join('\n')}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `qc-report-${Date.now()}.txt`; a.click() }}>Export QC Report (#150)</button>
          </div>
        </div>}
      </main>
    </div>
  )
}

export { ProductIntelligence as QualityEthics }
