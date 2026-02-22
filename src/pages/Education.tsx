import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

/* ═══════════════════════════════════════════════════════════
   EDUCATION & PLAYBOOKS — Features: 151-160
   ═══════════════════════════════════════════════════════════ */

interface Playbook { id: string; title: string; category: string; progress: number; rating: number; notes: string; content: string }

const CATEGORIES = ['Startup Basics', 'Content', 'Growth', 'Brand', 'Product', 'Leadership', 'Finance', 'Creative']

export function Education() {
  const { addToast } = useApp()
  const [playbooks, setPlaybooks] = useCloudStorage<Playbook[]>('edu_playbooks', [
    { id: '1', title: 'Founder Playbook', category: 'Startup Basics', progress: 75, rating: 0, notes: '', content: 'Learn the fundamentals of building a startup from idea to launch.' },
    { id: '2', title: 'Content Strategy 101', category: 'Content', progress: 45, rating: 0, notes: '', content: 'Master content creation, distribution, and audience growth.' },
    { id: '3', title: 'Growth Hacking', category: 'Growth', progress: 30, rating: 0, notes: '', content: 'Discover unconventional growth tactics for rapid scaling.' },
    { id: '4', title: 'Branding Essentials', category: 'Brand', progress: 60, rating: 0, notes: '', content: 'Build a memorable brand from strategy to execution.' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState(''); const [filterCat, setFilterCat] = useState('')

  const filtered = playbooks.filter(p => (!search || p.title.toLowerCase().includes(search.toLowerCase())) && (!filterCat || p.category === filterCat))

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Education & Playbooks</h1><p className={styles.subtitle}>Guides · Workflows · Training (#151-160)</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>+ New Playbook (#151)</button></div></header>

      {showForm && <div className={styles.inlineForm}>
        <input className={styles.input} placeholder="Playbook title" id="ep_title" />
        <select className={styles.select} id="ep_cat">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <textarea className={styles.textarea} rows={2} placeholder="Content / guide text..." id="ep_content" style={{ flex: 1, minWidth: 160 }} />
        <button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ep_title') as HTMLInputElement).value; if (t) { setPlaybooks(p => [...p, { id: uid(), title: t, category: (document.getElementById('ep_cat') as HTMLSelectElement).value, progress: 0, rating: 0, notes: '', content: (document.getElementById('ep_content') as HTMLTextAreaElement).value }]); setShowForm(false); addToast('Playbook created', 'success') } }}>Create</button>
      </div>}

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>Playbooks</div><div className={styles.kpiValue}>{playbooks.length}</div></div>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>In Progress (#157)</div><div className={styles.kpiValue}>{playbooks.filter(p => p.progress > 0 && p.progress < 100).length}</div></div>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>Completed</div><div className={styles.kpiValue}>{playbooks.filter(p => p.progress >= 100).length}</div></div>
      </div>

      <div className={styles.controlsRow}>
        <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search playbooks..." />
        <select className={styles.select} value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ maxWidth: 160 }}><option value="">All Categories (#156)</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
      </div>

      <div className={styles.grid}>{filtered.map(p => (
        <div key={p.id} className={styles.card}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>{p.title}</span><span className={styles.tag}>{p.category}</span></div>
          {p.content && <p className={styles.cardPreview}>{p.content.slice(0, 80)}</p>}
          <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${p.progress}%` }} /></div><span className={styles.helperText}>{p.progress}%</span></div>
          <div className={styles.cardActions}>
            <input className={styles.cellInput} type="range" min={0} max={100} value={p.progress} onChange={e => setPlaybooks(prev => prev.map(x => x.id === p.id ? { ...x, progress: Number(e.target.value) } : x))} style={{ width: 80 }} />
            <div>{[1, 2, 3, 4, 5].map(r => <button key={r} className={styles.ghostBtn} onClick={() => setPlaybooks(prev => prev.map(x => x.id === p.id ? { ...x, rating: r } : x))}>{r <= p.rating ? '★' : '☆'}</button>)}</div>
            <button className={styles.deleteBtn} onClick={() => setPlaybooks(prev => prev.filter(x => x.id !== p.id))}>×</button>
          </div>
        </div>
      ))}</div>

      <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = playbooks.map(p => `${p.title} (${p.category}) — ${p.progress}% complete`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `playbooks-${Date.now()}.txt`; a.click() }}>Export (#159)</button></div>
    </div>
  )
}
