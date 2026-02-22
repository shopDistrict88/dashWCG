import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './Fashion.module.css'

type FTab = 'designs' | 'studio' | 'materials' | 'production' | 'collections' | 'testing' | 'ip' | 'team'

interface Design {
  id: string; name: string; type: 'Clothing' | 'Accessories' | 'Footwear'
  category: string; description: string; tags: string[]; designIntent: string
  status: 'Concept' | 'Prototype' | 'Final'; pipelineStage: string; notes: string
  versions: string[]; costEstimate: number; createdAt: string
}
interface Material {
  id: string; name: string; type: 'Fabric' | 'Trim' | 'Color' | 'Hardware'
  supplier: string; costPerYard: number; moq: number
  sustainabilityScore: number; notes: string; quantity: number; createdAt: string
}
interface TechPack {
  id: string; designId: string; measurements: Record<string, string>; fabricSpecs: string
  trimSpecs: string; labels: string; careInstructions: string; packagingNotes: string
  version: number; approved: boolean; createdAt: string
}
interface Collection {
  id: string; name: string; theme: string; colorStory: string; dropDate: string
  designIds: string[]; notes: string; archived: boolean; dropType: 'Limited' | 'Preorder' | 'Standard'
  inventoryLimit: number; revenue: number; createdAt: string
}
interface IPRecord {
  id: string; designId: string; status: 'pending' | 'filed' | 'registered' | 'expired'
  ownership: Record<string, number>; trademarkRef: string; copyrightTag: string
  licensingNotes: string; confidential: boolean; versionHistory: string[]; createdAt: string
}
interface FitTest {
  id: string; designId: string; testerName: string; size: string
  measurements: Record<string, number>; fitNotes: string; rating: number
  issues: string[]; approved: boolean; date: string
}
interface TrendItem { id: string; name: string; score: number; category: string; source: string; projected: string; createdAt: string }
interface ProductionTask { id: string; designId: string; text: string; assignee: string; done: boolean; deadline: string; createdAt: string }
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface FComment { id: string; targetId: string; author: string; text: string; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const CATEGORIES = ['Minimal', 'Streetwear', 'Luxury', 'Technical', 'Avant-garde', 'Casual', 'Formal', 'Athletic']
const PIPELINE = ['Design', 'Prototype', 'Sample', 'Fit Test', 'Finalize', 'Production', 'Shipping']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const MAT_TYPES: Material['type'][] = ['Fabric', 'Trim', 'Color', 'Hardware']

export function Fashion() {
  const [tab, setTab] = useState<FTab>('designs')
  const [searchQuery, setSearchQuery] = useState('')
  const [designs, setDesigns] = useCloudStorage<Design[]>('fl_designs', [])
  const [materials, setMaterials] = useCloudStorage<Material[]>('fl_materials', [])
  const [techPacks, setTechPacks] = useCloudStorage<TechPack[]>('fl_techpacks', [])
  const [collections, setCollections] = useCloudStorage<Collection[]>('fl_collections', [])
  const [ipRecords, setIpRecords] = useCloudStorage<IPRecord[]>('fl_ip', [])
  const [fitTests, setFitTests] = useCloudStorage<FitTest[]>('fl_fittests', [])
  const [trends, setTrends] = useCloudStorage<TrendItem[]>('fl_trends', [])
  const [prodTasks, setProdTasks] = useCloudStorage<ProductionTask[]>('fl_prodtasks', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('fl_collabs', [])
  const [fComments, setFComments] = useCloudStorage<FComment[]>('fl_comments', [])
  const [favoritesArr, setFavoritesArr] = useCloudStorage<string[]>('fl_favorites', [])
  const favorites = useMemo(() => new Set(favoritesArr), [favoritesArr])
  const [showForm, setShowForm] = useState<string | null>(null)
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterMatType, setFilterMatType] = useState('')
  const [critiqueInput, setCritiqueInput] = useState('')
  const [critiqueResult, setCritiqueResult] = useState<{ colorHarmony: number; brandAlignment: number; fitAssessment: number; visualAppeal: number; suggestions: string[] } | null>(null)
  const [focusMode, setFocusMode] = useState(false)

  const selectedDesign = selectedDesignId ? designs.find(d => d.id === selectedDesignId) : null
  const toggleFav = (id: string) => setFavoritesArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const filteredDesigns = useMemo(() => {
    let r = [...designs]
    if (searchQuery) r = r.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    if (filterCategory) r = r.filter(d => d.category === filterCategory)
    if (filterStatus) r = r.filter(d => d.status === filterStatus)
    const favArr = [...favorites]
    r.sort((a, b) => (favArr.includes(b.id) ? 1 : 0) - (favArr.includes(a.id) ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return r
  }, [designs, searchQuery, filterCategory, filterStatus, favorites])

  const filteredMats = useMemo(() => {
    let r = [...materials]
    if (filterMatType) r = r.filter(m => m.type === filterMatType)
    if (searchQuery) r = r.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return r
  }, [materials, filterMatType, searchQuery])

  const runCritique = () => {
    if (!critiqueInput.trim()) return
    const w = critiqueInput.toLowerCase()
    const cs = w.includes('color') || w.includes('palette') ? 85 + Math.floor(Math.random() * 15) : 70 + Math.floor(Math.random() * 20)
    const bs = w.includes('minimal') || w.includes('clean') ? 90 + Math.floor(Math.random() * 10) : 60 + Math.floor(Math.random() * 30)
    const fs = w.includes('fit') || w.includes('tailored') ? 88 + Math.floor(Math.random() * 12) : 65 + Math.floor(Math.random() * 25)
    const ms = w.split(' ').length > 10 ? 85 + Math.floor(Math.random() * 15) : 70 + Math.floor(Math.random() * 20)
    setCritiqueResult({ colorHarmony: cs, brandAlignment: bs, fitAssessment: fs, visualAppeal: ms,
      suggestions: [cs < 80 ? 'Simplify color palette' : 'Strong color coherence', bs < 80 ? 'Strengthen brand alignment' : 'Perfect brand fit', fs < 80 ? 'Refine proportions' : 'Excellent structure', ms < 80 ? 'Consider trend integration' : 'Market-ready design'] })
  }

  const totalRevenue = collections.reduce((a, c) => a + c.revenue, 0)
  const avgSustainability = materials.length ? Math.round(materials.reduce((a, m) => a + m.sustainabilityScore, 0) / materials.length) : 0

  const tabs: [FTab, string][] = [
    ['designs', 'Designs'], ['studio', 'Studio'], ['materials', 'Materials'],
    ['production', 'Production'], ['collections', 'Collections'],
    ['testing', 'Testing'], ['ip', 'IP & Legal'], ['team', 'Team & Analytics'],
  ]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Fashion Lab</h1><p className={styles.subtitle}>Design · Produce · Launch · Collaborate</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('designs'); setShowForm('design') }}>+ New Design</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ DESIGNS (#1-10) ═══ */}
        {tab === 'designs' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{designs.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Concepts</div><div className={styles.kpiValue}>{designs.filter(d => d.status === 'Concept').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Prototypes</div><div className={styles.kpiValue}>{designs.filter(d => d.status === 'Prototype').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Final</div><div className={styles.kpiValue}>{designs.filter(d => d.status === 'Final').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Favorited</div><div className={styles.kpiValue}>{favorites.size}</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search designs... (#2)" />
            <select className={styles.select} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}><option value="">All Categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">All Status</option><option>Concept</option><option>Prototype</option><option>Final</option></select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'design' ? null : 'design')}>+ New Design (#1)</button>
          </div>

          {showForm === 'design' && <DesignForm onAdd={d => { setDesigns(prev => [{ ...d, id: uid(), versions: ['v1'], createdAt: now() }, ...prev]); setShowForm(null) }} onCancel={() => setShowForm(null)} />}

          <div className={styles.designGrid}>{filteredDesigns.map(d => (
            <div key={d.id} className={`${styles.designCard} ${selectedDesignId === d.id ? styles.designCardActive : ''}`} onClick={() => { setSelectedDesignId(d.id); setTab('studio') }}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{d.name}</span>
                <button className={styles.favBtn} onClick={e => { e.stopPropagation(); toggleFav(d.id) }}>{favorites.has(d.id) ? '★' : '☆'}</button>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.tag}>{d.type}</span>
                <span className={styles.tag}>{d.category}</span>
                <span className={`${styles.statusBadge} ${styles[`st_${d.status.toLowerCase()}`]}`}>{d.status}</span>
                <span className={styles.helperText}>{d.pipelineStage}</span>
              </div>
              {d.tags.length > 0 && <div className={styles.tagRow}>{d.tags.slice(0, 4).map(t => <span key={t} className={styles.tag}>#{t}</span>)}</div>}
              {d.description && <p className={styles.cardPreview}>{d.description.slice(0, 80)}</p>}
              {d.costEstimate > 0 && <span className={styles.helperText}>${d.costEstimate} est.</span>}
              <div className={styles.cardActions}>
                <button className={styles.ghostBtn} onClick={e => { e.stopPropagation(); setDesigns(prev => [{ ...d, id: uid(), name: `${d.name} (Copy)`, versions: ['v1'], createdAt: now() }, ...prev]) }}>Duplicate (#5)</button>
                <button className={styles.ghostBtn} onClick={e => { e.stopPropagation(); setDesigns(prev => prev.map(x => x.id === d.id ? { ...x, status: 'Final' as const, pipelineStage: 'Shipping' } : x)) }}>Archive (#4)</button>
                <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); setDesigns(prev => prev.filter(x => x.id !== d.id)) }}>×</button>
              </div>
            </div>
          ))}</div>
          {filteredDesigns.length === 0 && <p className={styles.emptyState}>No designs found. Create your first design above.</p>}
        </div>}

        {/* ═══ STUDIO ═══ */}
        {tab === 'studio' && <div className={styles.section}>
          {!selectedDesign ? <div className={styles.emptyState}><p>Select a design from the Designs tab to open Studio.</p></div> : <>
            <h2 className={styles.sectionTitle}>{selectedDesign.name} — Design Studio</h2>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Design Canvas (#7)</label>
              <div className={styles.canvasArea}><div className={styles.canvasPlaceholder}><p>Canvas for {selectedDesign.name}</p><p className={styles.helperText}>Attach sketches, photos, CAD files</p></div></div>
            </div>
            <div className={styles.splitRow}>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Color Palette</label>
                <div className={styles.paletteRow}>{['#000', '#fff', '#333', '#666', '#999', '#c7a17a'].map(c => <div key={c} className={styles.swatch} style={{ background: c }} />)}</div>
              </div>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Description (#6)</label>
                <textarea className={styles.textarea} rows={3} defaultValue={selectedDesign.description} onChange={e => setDesigns(prev => prev.map(x => x.id === selectedDesign.id ? { ...x, description: e.target.value } : x))} placeholder="Inline design description..." />
              </div>
            </div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Pipeline Stage (#14)</label>
              <div className={styles.pipelineRow}>{PIPELINE.map(s => (
                <button key={s} className={`${styles.pipelineStep} ${selectedDesign.pipelineStage === s ? styles.pipelineActive : ''}`}
                  onClick={() => setDesigns(prev => prev.map(x => x.id === selectedDesign.id ? { ...x, pipelineStage: s } : x))}>{s}</button>
              ))}</div>
            </div>
            <div className={styles.splitRow}>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Version History (#9)</label>
                <div className={styles.versionList}>{selectedDesign.versions.map((v, i) => <div key={i} className={styles.versionItem}>{v}</div>)}</div>
                <button className={styles.ghostBtn} onClick={() => setDesigns(prev => prev.map(x => x.id === selectedDesign.id ? { ...x, versions: [...x.versions, `v${x.versions.length + 1} — ${new Date().toLocaleString()}`] } : x))}>+ Add Version</button>
              </div>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Notes</label>
                <textarea className={styles.textarea} rows={3} defaultValue={selectedDesign.notes} onChange={e => setDesigns(prev => prev.map(x => x.id === selectedDesign.id ? { ...x, notes: e.target.value } : x))} placeholder="Design notes..." />
              </div>
            </div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Cost Estimation (#20)</label>
              <div className={styles.fieldRow}>
                <input className={styles.input} type="number" defaultValue={selectedDesign.costEstimate} onChange={e => setDesigns(prev => prev.map(x => x.id === selectedDesign.id ? { ...x, costEstimate: Number(e.target.value) } : x))} placeholder="Estimated cost $" />
                <select className={styles.select} value={selectedDesign.status} onChange={e => setDesigns(prev => prev.map(x => x.id === selectedDesign.id ? { ...x, status: e.target.value as Design['status'] } : x))}><option>Concept</option><option>Prototype</option><option>Final</option></select>
              </div>
            </div>
          </>}
        </div>}

        {/* ═══ MATERIALS (#11-13, #20) ═══ */}
        {tab === 'materials' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Material Library</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Materials</div><div className={styles.kpiValue}>{materials.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Cost</div><div className={styles.kpiValue}>${materials.length ? (materials.reduce((a, m) => a + m.costPerYard, 0) / materials.length).toFixed(0) : 0}/yd</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Sustainability (#12)</div><div className={styles.kpiValue}>{avgSustainability}/100</div></div>
          </div>
          <div className={styles.controlsRow}>
            <select className={styles.select} value={filterMatType} onChange={e => setFilterMatType(e.target.value)}><option value="">All Types</option>{MAT_TYPES.map(t => <option key={t}>{t}</option>)}</select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'material' ? null : 'material')}>+ Add Material (#11)</button>
          </div>
          {showForm === 'material' && <MaterialForm onAdd={m => { setMaterials(prev => [{ ...m, id: uid(), createdAt: now() }, ...prev]); setShowForm(null) }} onCancel={() => setShowForm(null)} />}
          <div className={styles.designGrid}>{filteredMats.map(m => (
            <div key={m.id} className={styles.designCard} style={{ cursor: 'default' }}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{m.name}</span><span className={styles.tag}>{m.type}</span></div>
              <div className={styles.cardMeta}><span className={styles.helperText}>${m.costPerYard}/yd</span><span className={styles.tag}>{m.supplier || 'No supplier'}</span><span className={styles.helperText}>MOQ: {m.moq}</span></div>
              <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${m.sustainabilityScore}%` }} /></div><span className={styles.meterLabel}>{m.sustainabilityScore}% eco (#12)</span></div>
              {m.notes && <p className={styles.cardPreview}>{m.notes} (#13)</p>}
              <div className={styles.cardActions}><span className={styles.helperText}>Qty: {m.quantity}</span><button className={styles.deleteBtn} onClick={() => setMaterials(prev => prev.filter(x => x.id !== m.id))}>×</button></div>
            </div>
          ))}</div>
        </div>}

        {/* ═══ PRODUCTION (#14-15) ═══ */}
        {tab === 'production' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Production & Tech Packs</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>In Production</div><div className={styles.kpiValue}>{designs.filter(d => ['Production', 'Shipping'].includes(d.pipelineStage)).length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tasks</div><div className={styles.kpiValue}>{prodTasks.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Done</div><div className={styles.kpiValue}>{prodTasks.filter(t => t.done).length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tech Packs</div><div className={styles.kpiValue}>{techPacks.length}</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Pipeline Board (#14)</label>
            <div className={styles.pipelineBoard}>{PIPELINE.map(stage => {
              const sd = designs.filter(d => d.pipelineStage === stage)
              return <div key={stage} className={styles.pipelineCol}><div className={styles.pipelineColHeader}>{stage} ({sd.length})</div>{sd.map(d => <div key={d.id} className={styles.pipelineItem} onClick={() => { setSelectedDesignId(d.id); setTab('studio') }}><span>{d.name}</span><span className={styles.tag}>{d.category}</span></div>)}</div>
            })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Production Tasks</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'prodtask' ? null : 'prodtask')}>+ Add</button></div>
            {showForm === 'prodtask' && <div className={styles.inlineForm}><select className={styles.select} id="pt_design">{designs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select><input className={styles.input} placeholder="Task" id="pt_text" /><input className={styles.input} placeholder="Assignee (#46)" id="pt_assignee" /><input className={styles.input} type="date" id="pt_deadline" /><button className={styles.primaryBtn} onClick={() => { const text = (document.getElementById('pt_text') as HTMLInputElement).value; if (text) { setProdTasks(prev => [...prev, { id: uid(), designId: (document.getElementById('pt_design') as HTMLSelectElement).value, text, assignee: (document.getElementById('pt_assignee') as HTMLInputElement).value, done: false, deadline: (document.getElementById('pt_deadline') as HTMLInputElement).value, createdAt: now() }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.taskList}>{prodTasks.map(t => {
              const d = designs.find(x => x.id === t.designId)
              return <div key={t.id} className={`${styles.taskItem} ${t.done ? styles.taskDone : ''}`}><button className={styles.checkBtn} onClick={() => setProdTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}>{t.done ? '✓' : '○'}</button><div className={styles.taskContent}><span>{t.text}</span><div className={styles.taskMeta}>{d && <span className={styles.tag}>{d.name}</span>}{t.assignee && <span className={styles.helperText}>{t.assignee}</span>}{t.deadline && <span className={styles.helperText}>{fmtDate(t.deadline)}</span>}</div></div><button className={styles.deleteBtn} onClick={() => setProdTasks(prev => prev.filter(x => x.id !== t.id))}>×</button></div>
            })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Tech Packs (#15)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'techpack' ? null : 'techpack')}>+ Generate</button></div>
            {showForm === 'techpack' && <TechPackForm designs={designs} onAdd={tp => { setTechPacks(prev => [{ ...tp, id: uid(), version: 1, approved: false, createdAt: now() }, ...prev]); setShowForm(null) }} onCancel={() => setShowForm(null)} />}
            <div className={styles.designGrid}>{techPacks.map(tp => {
              const d = designs.find(x => x.id === tp.designId)
              return <div key={tp.id} className={styles.designCard} style={{ cursor: 'default' }}>
                <div className={styles.cardHeader}><span className={styles.cardTitle}>{d?.name || 'Unknown'}</span><span className={styles.tag}>v{tp.version}</span></div>
                <div className={styles.cardMeta}><span className={`${styles.statusBadge} ${tp.approved ? styles.st_final : styles.st_concept}`}>{tp.approved ? 'Approved' : 'Pending'}</span></div>
                <div className={styles.techDetails}>{tp.fabricSpecs && <p><strong>Fabric:</strong> {tp.fabricSpecs}</p>}{tp.trimSpecs && <p><strong>Trims:</strong> {tp.trimSpecs}</p>}</div>
                <div className={styles.cardActions}>
                  <button className={styles.ghostBtn} onClick={() => setTechPacks(prev => prev.map(x => x.id === tp.id ? { ...x, approved: !x.approved } : x))}>{tp.approved ? 'Revoke' : 'Approve'}</button>
                  <button className={styles.ghostBtn} onClick={() => { const data = `Tech Pack: ${d?.name}\nFabric: ${tp.fabricSpecs}\nTrims: ${tp.trimSpecs}\nLabels: ${tp.labels}\nCare: ${tp.careInstructions}\nPackaging: ${tp.packagingNotes}`; const b = new Blob([data], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `techpack-${d?.name || 'unknown'}.txt`; a.click() }}>Export</button>
                  <button className={styles.deleteBtn} onClick={() => setTechPacks(prev => prev.filter(x => x.id !== tp.id))}>×</button>
                </div>
              </div>
            })}</div>
          </div>
        </div>}

        {/* ═══ COLLECTIONS (#16-17) ═══ */}
        {tab === 'collections' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Collections & Drops</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Collections</div><div className={styles.kpiValue}>{collections.filter(c => !c.archived).length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Revenue</div><div className={styles.kpiValue}>${totalRevenue.toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Upcoming</div><div className={styles.kpiValue}>{collections.filter(c => c.dropDate && new Date(c.dropDate) > new Date()).length}</div></div>
          </div>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'collection' ? null : 'collection')}>+ New Collection (#16)</button>
          {showForm === 'collection' && <CollectionForm designs={designs} onAdd={c => { setCollections(prev => [{ ...c, id: uid(), archived: false, revenue: 0, createdAt: now() }, ...prev]); setShowForm(null) }} onCancel={() => setShowForm(null)} />}

          <div className={styles.designGrid}>{collections.filter(c => !c.archived).map(c => {
            const daysLeft = c.dropDate ? Math.ceil((new Date(c.dropDate).getTime() - Date.now()) / 86400000) : null
            return <div key={c.id} className={styles.designCard} style={{ cursor: 'default' }}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{c.name}</span><span className={styles.tag}>{c.dropType}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{c.theme}</span><span className={styles.helperText}>{c.designIds.length} designs</span>{daysLeft !== null && <span className={styles.helperText}>{daysLeft > 0 ? `${daysLeft}d to drop` : 'Released'}</span>}</div>
              {c.colorStory && <p className={styles.cardPreview}>{c.colorStory}</p>}
              {c.inventoryLimit > 0 && <span className={styles.helperText}>Limit: {c.inventoryLimit} units</span>}
              <div className={styles.cardActions}>
                <span className={styles.helperText}>${c.revenue.toLocaleString()}</span>
                <input className={styles.input} type="number" style={{ width: 80 }} placeholder="Revenue" onChange={e => setCollections(prev => prev.map(x => x.id === c.id ? { ...x, revenue: Number(e.target.value) } : x))} />
                <button className={styles.ghostBtn} onClick={() => setCollections(prev => prev.map(x => x.id === c.id ? { ...x, archived: true } : x))}>Archive</button>
                <button className={styles.deleteBtn} onClick={() => setCollections(prev => prev.filter(x => x.id !== c.id))}>×</button>
              </div>
            </div>
          })}</div>

          {collections.filter(c => c.archived).length > 0 && <div className={styles.dnaBlock}><label className={styles.label}>Archived</label>{collections.filter(c => c.archived).map(c => <div key={c.id} className={styles.taskItem}><span>{c.name}</span><button className={styles.ghostBtn} onClick={() => setCollections(prev => prev.map(x => x.id === c.id ? { ...x, archived: false } : x))}>Restore</button></div>)}</div>}
        </div>}

        {/* ═══ TESTING (#18-19, #21-30) ═══ */}
        {tab === 'testing' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Testing, Trends & AI</h2>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Fit & Wear Testing (#21-30)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'fittest' ? null : 'fittest')}>+ New Test</button></div>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tests</div><div className={styles.kpiValue}>{fitTests.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Approved (#25)</div><div className={styles.kpiValue}>{fitTests.filter(t => t.approved).length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Rating</div><div className={styles.kpiValue}>{fitTests.length ? (fitTests.reduce((a, t) => a + t.rating, 0) / fitTests.length).toFixed(1) : '—'}</div></div>
            </div>
            {showForm === 'fittest' && <FitTestForm designs={designs} onAdd={ft => { setFitTests(prev => [{ ...ft, id: uid(), approved: false, date: now() }, ...prev]); setShowForm(null) }} onCancel={() => setShowForm(null)} />}
            <div className={styles.designGrid}>{fitTests.map(ft => {
              const d = designs.find(x => x.id === ft.designId)
              return <div key={ft.id} className={styles.designCard} style={{ cursor: 'default' }}>
                <div className={styles.cardHeader}><span className={styles.cardTitle}>{d?.name || 'Unknown'}</span><span className={`${styles.statusBadge} ${ft.approved ? styles.st_final : styles.st_concept}`}>{ft.approved ? 'Pass' : 'Pending'}</span></div>
                <div className={styles.cardMeta}><span className={styles.tag}>{ft.testerName}</span><span className={styles.tag}>Size {ft.size}</span><span className={styles.scoreBadge}>{ft.rating}/10</span></div>
                {ft.fitNotes && <p className={styles.cardPreview}>{ft.fitNotes}</p>}
                {ft.issues.length > 0 && <div className={styles.tagRow}>{ft.issues.map((x, i) => <span key={i} className={styles.tag}>{x}</span>)}</div>}
                <div className={styles.cardActions}><button className={styles.ghostBtn} onClick={() => setFitTests(prev => prev.map(x => x.id === ft.id ? { ...x, approved: !x.approved } : x))}>{ft.approved ? 'Revoke' : 'Approve'}</button><button className={styles.ghostBtn} onClick={() => { const report = `Fit Report: ${d?.name}\nTester: ${ft.testerName}\nSize: ${ft.size}\nRating: ${ft.rating}/10\nNotes: ${ft.fitNotes}\nIssues: ${ft.issues.join(', ')}`; const b = new Blob([report], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `fit-report-${d?.name || 'unknown'}.txt`; a.click() }}>Export (#30)</button><button className={styles.deleteBtn} onClick={() => setFitTests(prev => prev.filter(x => x.id !== ft.id))}>×</button></div>
              </div>
            })}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Trend Drift (#18)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'trend' ? null : 'trend')}>+ Track</button></div>
            {showForm === 'trend' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Trend name" id="tr_name" /><input className={styles.input} placeholder="Category" id="tr_cat" /><input className={styles.input} placeholder="Source" id="tr_src" /><input className={styles.input} type="number" placeholder="Score" id="tr_score" /><input className={styles.input} placeholder="Projected direction" id="tr_proj" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('tr_name') as HTMLInputElement).value; if (n) { setTrends(prev => [{ id: uid(), name: n, category: (document.getElementById('tr_cat') as HTMLInputElement).value, source: (document.getElementById('tr_src') as HTMLInputElement).value, score: Number((document.getElementById('tr_score') as HTMLInputElement).value) || 50, projected: (document.getElementById('tr_proj') as HTMLInputElement).value, createdAt: now() }, ...prev]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.designGrid}>{trends.map(t => <div key={t.id} className={styles.designCard} style={{ cursor: 'default' }}><div className={styles.cardHeader}><span className={styles.cardTitle}>{t.name}</span><span className={styles.scoreBadge}>{t.score}/100</span></div><div className={styles.cardMeta}><span className={styles.tag}>{t.category}</span>{t.source && <span className={styles.helperText}>{t.source}</span>}{t.projected && <span className={styles.helperText}>{t.projected}</span>}</div><button className={styles.deleteBtn} onClick={() => setTrends(prev => prev.filter(x => x.id !== t.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>AI Design Critique (#19)</label>
            <textarea className={styles.textarea} rows={3} value={critiqueInput} onChange={e => setCritiqueInput(e.target.value)} placeholder="Describe design for AI review: colors, materials, silhouette, intent..." />
            <button className={styles.primaryBtn} onClick={runCritique} style={{ marginTop: 8 }}>Run Critique</button>
            {critiqueResult && <div style={{ marginTop: 12 }}>
              <div className={styles.kpiRow}>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Color Harmony</div><div className={styles.kpiValue}>{critiqueResult.colorHarmony}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Brand Alignment</div><div className={styles.kpiValue}>{critiqueResult.brandAlignment}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Fit Assessment</div><div className={styles.kpiValue}>{critiqueResult.fitAssessment}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Visual Appeal</div><div className={styles.kpiValue}>{critiqueResult.visualAppeal}</div></div>
              </div>
              {critiqueResult.suggestions.map((s, i) => <p key={i} className={styles.suggestionItem}>{s}</p>)}
            </div>}
          </div>
        </div>}

        {/* ═══ IP & LEGAL (#31-40) ═══ */}
        {tab === 'ip' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>IP & Legal Registry</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total IP</div><div className={styles.kpiValue}>{ipRecords.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Registered</div><div className={styles.kpiValue}>{ipRecords.filter(r => r.status === 'registered').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Pending</div><div className={styles.kpiValue}>{ipRecords.filter(r => r.status === 'pending').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Confidential</div><div className={styles.kpiValue}>{ipRecords.filter(r => r.confidential).length}</div></div>
          </div>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'ip' ? null : 'ip')}>+ Register Design (#31)</button>
          {showForm === 'ip' && <div className={styles.inlineForm}>
            <select className={styles.select} id="ip_design">{designs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
            <select className={styles.select} id="ip_status"><option value="pending">Pending</option><option value="filed">Filed</option><option value="registered">Registered</option></select>
            <input className={styles.input} placeholder="Trademark Ref" id="ip_tm" />
            <input className={styles.input} placeholder="Copyright Tag" id="ip_cr" />
            <input className={styles.input} placeholder="Licensing notes (#34)" id="ip_lic" />
            <button className={styles.primaryBtn} onClick={() => { const designId = (document.getElementById('ip_design') as HTMLSelectElement).value; if (designId) { setIpRecords(prev => [...prev, { id: uid(), designId, status: (document.getElementById('ip_status') as HTMLSelectElement).value as IPRecord['status'], ownership: { 'You': 100 }, trademarkRef: (document.getElementById('ip_tm') as HTMLInputElement).value, copyrightTag: (document.getElementById('ip_cr') as HTMLInputElement).value, licensingNotes: (document.getElementById('ip_lic') as HTMLInputElement).value, confidential: false, versionHistory: ['Initial filing'], createdAt: now() }]); setShowForm(null) } }}>Register</button>
          </div>}
          <div className={styles.designGrid}>{ipRecords.map(r => {
            const d = designs.find(x => x.id === r.designId)
            return <div key={r.id} className={styles.designCard} style={{ cursor: 'default' }}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{d?.name || 'Unknown'}</span><span className={`${styles.statusBadge} ${styles[`st_${r.status === 'registered' ? 'final' : r.status === 'filed' ? 'prototype' : 'concept'}`]}`}>{r.status}</span></div>
              <div className={styles.cardMeta}>{r.trademarkRef && <span className={styles.tag}>TM: {r.trademarkRef}</span>}{r.copyrightTag && <span className={styles.tag}>©: {r.copyrightTag}</span>}{r.confidential && <span className={styles.tag}>Confidential</span>}</div>
              <p className={styles.helperText}>Ownership: {Object.entries(r.ownership).map(([k, v]) => `${k}: ${v}%`).join(', ')}</p>
              {r.licensingNotes && <p className={styles.cardPreview}>Licensing: {r.licensingNotes}</p>}
              <div className={styles.cardActions}>
                <button className={styles.ghostBtn} onClick={() => setIpRecords(prev => prev.map(x => x.id === r.id ? { ...x, confidential: !x.confidential } : x))}>{r.confidential ? 'Declassify' : 'Classify'}</button>
                <button className={styles.ghostBtn} onClick={() => setIpRecords(prev => prev.map(x => x.id === r.id ? { ...x, versionHistory: [...x.versionHistory, `Update — ${new Date().toLocaleString()}`] } : x))}>+ Version (#32)</button>
                <button className={styles.ghostBtn} onClick={() => { const data = `IP Record: ${d?.name}\nStatus: ${r.status}\nTM: ${r.trademarkRef}\n©: ${r.copyrightTag}\nLicensing: ${r.licensingNotes}\nOwnership: ${JSON.stringify(r.ownership)}\nHistory: ${r.versionHistory.join('; ')}`; const b = new Blob([data], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `ip-${d?.name || 'unknown'}.txt`; a.click() }}>Export (#38)</button>
                <button className={styles.deleteBtn} onClick={() => setIpRecords(prev => prev.filter(x => x.id !== r.id))}>×</button>
              </div>
            </div>
          })}</div>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI IP Risk Advisory (#40)</div>
            <pre className={styles.aiOutput}>{`IP Portfolio Summary\n${'─'.repeat(35)}\n• ${ipRecords.length} records total\n• ${ipRecords.filter(r => r.status === 'registered').length} registered, ${ipRecords.filter(r => r.status === 'pending').length} pending\n• ${ipRecords.filter(r => r.confidential).length} classified as confidential\n• ${ipRecords.filter(r => r.status === 'expired').length > 0 ? 'WARNING: Expired records detected' : 'No expired records'}\n• Recommendation: ${ipRecords.filter(r => r.status === 'pending').length > 2 ? 'Prioritize pending filings.' : 'Portfolio in good standing.'}`}</pre>
          </div>
        </div>}

        {/* ═══ TEAM & ANALYTICS (#41-60) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team, Analytics & Export</h2>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#41-42)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="fc_name" /><input className={styles.input} placeholder="Email" id="fc_email" /><select className={styles.select} id="fc_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('fc_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('fc_email') as HTMLInputElement).value, role: (document.getElementById('fc_role') as HTMLSelectElement).value as Collaborator['role'] }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion (#43-44)</label>
            <div className={styles.commentList}>{fComments.slice(0, 15).map(c => <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>)}</div>
            <div className={styles.inlineForm}><input className={styles.input} placeholder="Add comment..." id="fcom_input" /><button className={styles.ghostBtn} onClick={() => { const text = (document.getElementById('fcom_input') as HTMLInputElement).value; if (text) { setFComments(prev => [{ id: uid(), targetId: '', author: 'You', text, date: now() }, ...prev]); (document.getElementById('fcom_input') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Analytics & Insights (#51-60)</label>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Sustainability (#51)</div><div className={styles.kpiValue}>{avgSustainability}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Pipeline Health (#52)</div><div className={styles.kpiValue}>{designs.filter(d => d.pipelineStage !== 'Design').length}/{designs.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Trend Score (#53)</div><div className={styles.kpiValue}>{trends.length ? Math.round(trends.reduce((a, t) => a + t.score, 0) / trends.length) : 0}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Revenue (#55)</div><div className={styles.kpiValue}>${totalRevenue.toLocaleString()}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Fit Pass Rate (#57)</div><div className={styles.kpiValue}>{fitTests.length ? Math.round(fitTests.filter(t => t.approved).length / fitTests.length * 100) : 0}%</div></div>
            </div>
            <div className={styles.aiBox}><pre className={styles.aiOutput}>{`Cross-Collection Comparison (#60)\n${'─'.repeat(35)}\n${collections.filter(c => !c.archived).map(c => `• ${c.name}: ${c.designIds.length} designs, $${c.revenue.toLocaleString()} revenue, ${c.dropType}`).join('\n') || '• No active collections'}\n\nCategory Breakdown:\n${[...new Set(designs.map(d => d.category))].map(cat => `• ${cat}: ${designs.filter(d => d.category === cat).length} designs`).join('\n') || '• No designs'}\n\nHistorical Performance (#56):\n• ${designs.length} total designs created\n• ${designs.filter(d => d.status === 'Final').length} finalized\n• Avg cost: $${designs.length ? Math.round(designs.reduce((a, d) => a + d.costEstimate, 0) / designs.length) : 0}`}</pre></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Export & Reports (#59)</label>
            <div className={styles.exportGrid}>
              <button className={styles.exportBtn} onClick={() => { const d = `Fashion Lab Report\n${'='.repeat(40)}\nDesigns: ${designs.length}\nMaterials: ${materials.length}\nCollections: ${collections.length}\nTech Packs: ${techPacks.length}\nFit Tests: ${fitTests.length}\nIP Records: ${ipRecords.length}\nTeam: ${collaborators.length}\nRevenue: $${totalRevenue.toLocaleString()}\nSustainability: ${avgSustainability}%\n\n${'─'.repeat(40)}\nDesigns:\n${designs.map(x => `  ${x.name} | ${x.type} | ${x.category} | ${x.status} | $${x.costEstimate}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `fashion-lab-${Date.now()}.txt`; a.click() }}>Full Report</button>
              <button className={styles.exportBtn} onClick={() => { const csv = `Name,Type,Category,Status,Pipeline,Cost,Tags\n${designs.map(d => `"${d.name}",${d.type},${d.category},${d.status},${d.pipelineStage},${d.costEstimate},"${d.tags.join(';')}"`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `designs-${Date.now()}.csv`; a.click() }}>Export CSV</button>
              <button className={styles.exportBtn} onClick={() => { const d = collections.map(c => `${c.name} | ${c.theme} | ${c.designIds.length} designs | ${c.dropType} | $${c.revenue}`).join('\n'); const b = new Blob([d || 'No collections'], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `collections-${Date.now()}.txt`; a.click() }}>Collections</button>
              <button className={styles.exportBtn} onClick={() => { const d = trends.map(t => `${t.name} | Score: ${t.score} | ${t.category} | ${t.projected}`).join('\n'); const b = new Blob([d || 'No trends'], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `trends-${Date.now()}.txt`; a.click() }}>Trends</button>
            </div>
          </div>
        </div>}

      </main>
    </div>
  )
}

// ═══ SUB-COMPONENT FORMS ═══

function DesignForm({ onAdd, onCancel }: { onAdd: (d: Omit<Design, 'id' | 'createdAt' | 'versions'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [type, setType] = useState<Design['type']>('Clothing')
  const [category, setCategory] = useState('Minimal'); const [desc, setDesc] = useState('')
  const [tags, setTags] = useState<string[]>([]); const [tagInput, setTagInput] = useState('')
  const [intent, setIntent] = useState(''); const [status, setStatus] = useState<Design['status']>('Concept')
  const [cost, setCost] = useState(0)
  return (
    <div className={styles.formPanel}>
      <div className={styles.formStack}>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Name</label><input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Design name" /></div>
          <div className={styles.formGroup}><label>Type (#1)</label><select className={styles.select} value={type} onChange={e => setType(e.target.value as Design['type'])}><option>Clothing</option><option>Accessories</option><option>Footwear</option></select></div>
          <div className={styles.formGroup}><label>Category</label><select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div className={styles.formGroup}><label>Status</label><select className={styles.select} value={status} onChange={e => setStatus(e.target.value as Design['status'])}><option>Concept</option><option>Prototype</option><option>Final</option></select></div>
        </div>
        <div className={styles.formGroup}><label>Description (#6)</label><textarea className={styles.textarea} rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Design description..." /></div>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Intent</label><input className={styles.input} value={intent} onChange={e => setIntent(e.target.value)} placeholder="Design intent..." /></div>
          <div className={styles.formGroup}><label>Cost Estimate (#20)</label><input className={styles.input} type="number" value={cost} onChange={e => setCost(Number(e.target.value))} placeholder="$" /></div>
        </div>
        <div className={styles.formGroup}><label>Tags (#8)</label>
          <input className={styles.input} value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag (Enter)" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setTags(prev => [...prev, tagInput.trim()]); setTagInput('') } } }} />
          <div className={styles.tagRow}>{tags.map(t => <span key={t} className={styles.tag} onClick={() => setTags(prev => prev.filter(x => x !== t))}>#{t} ×</span>)}</div>
        </div>
        <div className={styles.fieldRow}>
          <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, type, category, description: desc, tags, designIntent: intent, status, pipelineStage: 'Design', notes: '', costEstimate: cost }) }}>Create Design</button>
          <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function MaterialForm({ onAdd, onCancel }: { onAdd: (m: Omit<Material, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [type, setType] = useState<Material['type']>('Fabric')
  const [supplier, setSupplier] = useState(''); const [cost, setCost] = useState(0)
  const [moq, setMoq] = useState(0); const [eco, setEco] = useState(50); const [notes, setNotes] = useState(''); const [qty, setQty] = useState(0)
  return (
    <div className={styles.formPanel}>
      <div className={styles.formStack}>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Name</label><input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Material name" /></div>
          <div className={styles.formGroup}><label>Type (#11)</label><select className={styles.select} value={type} onChange={e => setType(e.target.value as Material['type'])}>{MAT_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div className={styles.formGroup}><label>Supplier (#13)</label><input className={styles.input} value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Supplier" /></div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Cost/Yard ($)</label><input className={styles.input} type="number" value={cost} onChange={e => setCost(Number(e.target.value))} /></div>
          <div className={styles.formGroup}><label>MOQ</label><input className={styles.input} type="number" value={moq} onChange={e => setMoq(Number(e.target.value))} /></div>
          <div className={styles.formGroup}><label>Quantity</label><input className={styles.input} type="number" value={qty} onChange={e => setQty(Number(e.target.value))} /></div>
        </div>
        <div className={styles.formGroup}><label>Sustainability (#12): {eco}%</label><input type="range" min={0} max={100} value={eco} onChange={e => setEco(Number(e.target.value))} className={styles.range} /></div>
        <div className={styles.formGroup}><label>Notes</label><textarea className={styles.textarea} rows={2} value={notes} onChange={e => setNotes(e.target.value)} /></div>
        <div className={styles.fieldRow}>
          <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, type, supplier, costPerYard: cost, moq, sustainabilityScore: eco, notes, quantity: qty }) }}>Add Material</button>
          <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function TechPackForm({ designs, onAdd, onCancel }: { designs: Design[]; onAdd: (tp: Omit<TechPack, 'id' | 'version' | 'approved' | 'createdAt'>) => void; onCancel: () => void }) {
  const [designId, setDesignId] = useState(designs[0]?.id || ''); const [fabric, setFabric] = useState('')
  const [trims, setTrims] = useState(''); const [labels, setLabels] = useState(''); const [care, setCare] = useState('')
  const [packaging, setPackaging] = useState('')
  return (
    <div className={styles.formPanel}>
      <div className={styles.formStack}>
        <div className={styles.formGroup}><label>Design</label><select className={styles.select} value={designId} onChange={e => setDesignId(e.target.value)}>{designs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Fabric Specs</label><input className={styles.input} value={fabric} onChange={e => setFabric(e.target.value)} placeholder="100% Cotton..." /></div>
          <div className={styles.formGroup}><label>Trim Specs</label><input className={styles.input} value={trims} onChange={e => setTrims(e.target.value)} placeholder="YKK zippers..." /></div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Labels</label><input className={styles.input} value={labels} onChange={e => setLabels(e.target.value)} /></div>
          <div className={styles.formGroup}><label>Care Instructions</label><input className={styles.input} value={care} onChange={e => setCare(e.target.value)} /></div>
        </div>
        <div className={styles.formGroup}><label>Packaging</label><input className={styles.input} value={packaging} onChange={e => setPackaging(e.target.value)} /></div>
        <div className={styles.fieldRow}>
          <button className={styles.primaryBtn} onClick={() => onAdd({ designId, fabricSpecs: fabric, trimSpecs: trims, labels, careInstructions: care, packagingNotes: packaging, measurements: {} })}>Generate</button>
          <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function CollectionForm({ designs, onAdd, onCancel }: { designs: Design[]; onAdd: (c: Omit<Collection, 'id' | 'archived' | 'revenue' | 'createdAt'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [theme, setTheme] = useState(''); const [colorStory, setColorStory] = useState('')
  const [dropDate, setDropDate] = useState(''); const [designIds, setDesignIds] = useState<string[]>([])
  const [notes, setNotes] = useState(''); const [dropType, setDropType] = useState<Collection['dropType']>('Standard')
  const [inventoryLimit, setInventoryLimit] = useState(0)
  return (
    <div className={styles.formPanel}>
      <div className={styles.formStack}>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Name</label><input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Collection name" /></div>
          <div className={styles.formGroup}><label>Theme</label><input className={styles.input} value={theme} onChange={e => setTheme(e.target.value)} placeholder="Theme" /></div>
          <div className={styles.formGroup}><label>Drop Type (#17)</label><select className={styles.select} value={dropType} onChange={e => setDropType(e.target.value as Collection['dropType'])}><option>Limited</option><option>Preorder</option><option>Standard</option></select></div>
        </div>
        <div className={styles.formGroup}><label>Color Story</label><textarea className={styles.textarea} rows={2} value={colorStory} onChange={e => setColorStory(e.target.value)} placeholder="Describe color narrative..." /></div>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Drop Date</label><input className={styles.input} type="date" value={dropDate} onChange={e => setDropDate(e.target.value)} /></div>
          <div className={styles.formGroup}><label>Inventory Limit</label><input className={styles.input} type="number" value={inventoryLimit} onChange={e => setInventoryLimit(Number(e.target.value))} /></div>
        </div>
        <div className={styles.formGroup}><label>Designs (#16)</label><div className={styles.chipRow}>{designs.map(d => <button key={d.id} type="button" className={`${styles.chipBtn} ${designIds.includes(d.id) ? styles.chipActive : ''}`} onClick={() => setDesignIds(prev => prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id])}>{d.name}</button>)}</div></div>
        <div className={styles.fieldRow}>
          <button className={styles.primaryBtn} onClick={() => { if (name) onAdd({ name, theme, colorStory, dropDate, designIds, notes, dropType, inventoryLimit }) }}>Create</button>
          <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function FitTestForm({ designs, onAdd, onCancel }: { designs: Design[]; onAdd: (ft: Omit<FitTest, 'id' | 'approved' | 'date'>) => void; onCancel: () => void }) {
  const [designId, setDesignId] = useState(designs[0]?.id || ''); const [tester, setTester] = useState('')
  const [size, setSize] = useState('M'); const [rating, setRating] = useState(7); const [notes, setNotes] = useState('')
  const [issues, setIssues] = useState<string[]>([]); const [issueInput, setIssueInput] = useState('')
  return (
    <div className={styles.formPanel}>
      <div className={styles.formStack}>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Design</label><select className={styles.select} value={designId} onChange={e => setDesignId(e.target.value)}>{designs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div className={styles.formGroup}><label>Tester</label><input className={styles.input} value={tester} onChange={e => setTester(e.target.value)} placeholder="Model/tester name" /></div>
          <div className={styles.formGroup}><label>Size</label><select className={styles.select} value={size} onChange={e => setSize(e.target.value)}>{SIZES.map(s => <option key={s}>{s}</option>)}</select></div>
        </div>
        <div className={styles.formGroup}><label>Rating: {rating}/10</label><input type="range" min={1} max={10} value={rating} onChange={e => setRating(Number(e.target.value))} className={styles.range} /></div>
        <div className={styles.formGroup}><label>Fit Notes (#25)</label><textarea className={styles.textarea} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Fit observations..." /></div>
        <div className={styles.formGroup}><label>Issues</label>
          <input className={styles.input} value={issueInput} onChange={e => setIssueInput(e.target.value)} placeholder="Add issue (Enter)" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (issueInput.trim()) { setIssues(prev => [...prev, issueInput.trim()]); setIssueInput('') } } }} />
          <div className={styles.tagRow}>{issues.map((x, i) => <span key={i} className={styles.tag} onClick={() => setIssues(prev => prev.filter((_, j) => j !== i))}>{x} ×</span>)}</div>
        </div>
        <div className={styles.fieldRow}>
          <button className={styles.primaryBtn} onClick={() => { if (tester) onAdd({ designId, testerName: tester, size, rating, fitNotes: notes, issues, measurements: {} }) }}>Submit Test</button>
          <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
