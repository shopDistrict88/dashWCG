import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

/* ═══════════════════════════════════════════════════════════
   NARRATIVE STUDIO — 20 features
   Worldbuilding, stories, editorial content
   ═══════════════════════════════════════════════════════════ */

interface Story { id: string; title: string; description: string; category: string; version: number; tags: string[]; status: 'draft' | 'in-progress' | 'published' | 'archived'; notes: string; createdAt: string }
interface StoryElement { id: string; storyId: string; type: 'character' | 'location' | 'event' | 'scene'; name: string; description: string }

type NarTab = 'stories' | 'worldbuilding' | 'editorial' | 'assets'

export function WorldbuildingStudio() {
  const [tab, setTab] = useState<NarTab>('stories')
  const [stories, setStories] = useCloudStorage<Story[]>('nar_stories', [])
  const [elements, setElements] = useCloudStorage<StoryElement[]>('nar_elements', [])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusMode, setFocusMode] = useState(false)

  const selected = stories.find(s => s.id === selectedId)
  const curElements = useMemo(() => selectedId ? elements.filter(e => e.storyId === selectedId) : [], [elements, selectedId])
  const filtered = useMemo(() => { let r = [...stories]; if (search) r = r.filter(s => s.title.toLowerCase().includes(search.toLowerCase())); return r }, [stories, search])

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Narrative Studio</h1><p className={styles.subtitle}>Stories · Worldbuilding · IP</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm('story')}>+ New Story (#1)</button><button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>Focus (#20)</button></div></header>
      <nav className={styles.tabNav}>{(['stories', 'worldbuilding', 'editorial', 'assets'] as NarTab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      {showForm === 'story' && <div className={styles.overlay}><div className={styles.wizardPanel}><h2 className={styles.wizardTitle}>New Story / IP</h2>
        <div className={styles.formStack}>
          <div className={styles.formGroup}><label>Title</label><input className={styles.input} id="ns_title" placeholder="Story title" /></div>
          <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={3} id="ns_desc" /></div>
          <div className={styles.formGroup}><label>Category</label><select className={styles.select} id="ns_cat"><option>Novel</option><option>Series</option><option>Film</option><option>Game</option><option>IP Universe</option></select></div>
          <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ns_title') as HTMLInputElement).value; if (t) { setStories(p => [{ id: uid(), title: t, description: (document.getElementById('ns_desc') as HTMLTextAreaElement).value, category: (document.getElementById('ns_cat') as HTMLSelectElement).value, version: 1, tags: [], status: 'draft', notes: '', createdAt: now() }, ...p]); setShowForm(null) } }}>Create</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
        </div></div></div>}

      <main className={styles.mainContent}>
        {tab === 'stories' && <div className={styles.section}>
          <div className={styles.controlsRow}><input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories..." /></div>
          <div className={styles.grid}>{filtered.map(s => (
            <div key={s.id} className={`${styles.card} ${selectedId === s.id ? styles.cardActive : ''}`} onClick={() => { setSelectedId(s.id); setTab('worldbuilding') }}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{s.title}</span><span className={`${styles.statusBadge} ${styles[`st_${s.status}`]}`}>{s.status}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{s.category}</span><span className={styles.helperText}>v{s.version}</span></div>
              {s.description && <p className={styles.cardPreview}>{s.description.slice(0, 80)}</p>}
              <div className={styles.cardActions}>
                <select className={styles.miniSelect} value={s.status} onClick={e => e.stopPropagation()} onChange={e => setStories(p => p.map(x => x.id === s.id ? { ...x, status: e.target.value as any } : x))}><option value="draft">Draft</option><option value="in-progress">In Progress</option><option value="published">Published</option><option value="archived">Archived</option></select>
                <button className={styles.ghostBtn} onClick={e => { e.stopPropagation(); setStories(p => p.map(x => x.id === s.id ? { ...x, version: x.version + 1 } : x)) }}>+ Version (#4)</button>
                <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); setStories(p => p.filter(x => x.id !== s.id)) }}>×</button>
              </div>
            </div>
          ))}</div>
        </div>}

        {tab === 'worldbuilding' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Worldbuilding (#2)</h2>
          {!selected ? <p className={styles.emptyState}>Select a story from the Stories tab.</p> : <>
            <div className={styles.dnaBlock}><div className={styles.blockHeader}><label className={styles.label}>Elements: {selected.title}</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'element' ? null : 'element')}>+ Add</button></div>
              {showForm === 'element' && <div className={styles.inlineForm}><select className={styles.select} id="ne_type"><option value="character">Character</option><option value="location">Location</option><option value="event">Event</option><option value="scene">Scene</option></select><input className={styles.input} placeholder="Name" id="ne_name" /><input className={styles.input} placeholder="Description" id="ne_desc" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('ne_name') as HTMLInputElement).value; if (n) { setElements(p => [...p, { id: uid(), storyId: selectedId!, type: (document.getElementById('ne_type') as HTMLSelectElement).value as any, name: n, description: (document.getElementById('ne_desc') as HTMLInputElement).value }]); setShowForm(null) } }}>Add</button></div>}
              <div className={styles.grid}>{curElements.map(e => <div key={e.id} className={styles.card}><span className={styles.cardTitle}>{e.name}</span><span className={styles.tag}>{e.type}</span>{e.description && <p className={styles.cardPreview}>{e.description}</p>}<button className={styles.deleteBtn} onClick={() => setElements(p => p.filter(x => x.id !== e.id))}>×</button></div>)}</div>
            </div>
            <div className={styles.dnaBlock}><label className={styles.label}>Timeline (#9)</label>
              <div className={styles.timeline}><div className={styles.timelineItem}><span className={styles.timelineDot} /><span>Created {fmtDate(selected.createdAt)}</span></div>
                {curElements.filter(e => e.type === 'event').map(e => <div key={e.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{e.name}</span></div>)}</div>
            </div>
          </>}
        </div>}

        {tab === 'editorial' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Editorial (#3)</h2>
          {selected && <div className={styles.dnaBlock}><label className={styles.label}>Notes & Draft</label><textarea className={styles.textarea} rows={8} value={selected.notes} onChange={e => setStories(p => p.map(x => x.id === selected.id ? { ...x, notes: e.target.value } : x))} placeholder="Write your story, notes, editorial content..." /></div>}
          <div className={styles.dnaBlock}><label className={styles.label}>Tags (#14)</label>
            <div className={styles.chipRow}>{['Sci-Fi', 'Fantasy', 'Drama', 'Action', 'Romance', 'Horror', 'Non-Fiction'].map(t => <button key={t} className={`${styles.chipBtn} ${selected?.tags.includes(t) ? styles.chipActive : ''}`} onClick={() => { if (selected) setStories(p => p.map(x => x.id === selected.id ? { ...x, tags: x.tags.includes(t) ? x.tags.filter(g => g !== t) : [...x.tags, t] } : x)) }}>{t}</button>)}</div>
          </div>
        </div>}

        {tab === 'assets' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Assets & Export (#8, #10)</h2>
          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { if (selected) { const d = `${selected.title}\n${'='.repeat(40)}\n${selected.description}\n\n${selected.notes}\n\nElements:\n${curElements.map(e => `[${e.type}] ${e.name}: ${e.description}`).join('\n')}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${selected.title.replace(/\s/g, '-')}.txt`; a.click() } }}>Export Story (TXT)</button>
            <button className={styles.exportBtn} onClick={() => { if (selected) { const d = `# ${selected.title}\n\n${selected.description}\n\n## Notes\n\n${selected.notes}\n\n## Elements\n\n${curElements.map(e => `### ${e.name} (${e.type})\n${e.description}`).join('\n\n')}`; const b = new Blob([d], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${selected.title.replace(/\s/g, '-')}.md`; a.click() } }}>Export Markdown</button>
          </div>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI Advisory (#11)</div><pre className={styles.aiOutput}>{selected ? `Story: ${selected.title}\nVersion: ${selected.version}\nElements: ${curElements.length}\nCharacters: ${curElements.filter(e => e.type === 'character').length}\nLocations: ${curElements.filter(e => e.type === 'location').length}\nConsistency: ${curElements.length > 3 ? 'Good coverage' : 'Add more elements for depth'}` : 'Select a story to view advisory.'}</pre></div>
        </div>}
      </main>
    </div>
  )
}
export { WorldbuildingStudio as StoryIPVault }
export { WorldbuildingStudio as EditorialStudio }

/* ═══════════════════════════════════════════════════════════
   INNOVATION LAB — 20 features + Prototype Vault merged
   R&D, experiments, prototypes
   ═══════════════════════════════════════════════════════════ */

interface Innovation { id: string; name: string; description: string; viability: number; risk: number; reward: number; status: 'exploring' | 'developing' | 'launched' | 'retired'; priority: 'low' | 'medium' | 'high'; createdAt: string }
interface InnoPrototype { id: string; innovationId: string; name: string; status: 'draft' | 'testing' | 'archived'; iterations: number; notes: string; date: string }

type InnoTab = 'projects' | 'prototypes' | 'analytics' | 'archive'

export function RDPlayground() {
  const [tab, setTab] = useState<InnoTab>('projects')
  const [innovations, setInnovations] = useCloudStorage<Innovation[]>('inno_items', [])
  const [prototypes, setPrototypes] = useCloudStorage<InnoPrototype[]>('inno_protos', [])
  const [search, setSearch] = useState(''); const [showForm, setShowForm] = useState<string | null>(null)

  const filtered = useMemo(() => { let r = innovations.filter(i => i.status !== 'retired'); if (search) r = r.filter(i => i.name.toLowerCase().includes(search.toLowerCase())); return r }, [innovations, search])

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Innovation Lab</h1><p className={styles.subtitle}>R&D · Experiments · Prototypes</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm('inno')}>+ New Project (#21)</button></div></header>
      <nav className={styles.tabNav}>{(['projects', 'prototypes', 'analytics', 'archive'] as InnoTab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      {showForm === 'inno' && <div className={styles.overlay}><div className={styles.wizardPanel}><h2 className={styles.wizardTitle}>New Innovation</h2>
        <div className={styles.formStack}>
          <div className={styles.formGroup}><label>Name</label><input className={styles.input} id="in_name" /></div>
          <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={2} id="in_desc" /></div>
          <div className={styles.fieldRow}><div className={styles.formGroup}><label>Viability</label><input className={styles.input} type="number" id="in_v" placeholder="0-100" /></div><div className={styles.formGroup}><label>Risk</label><input className={styles.input} type="number" id="in_r" placeholder="0-100" /></div><div className={styles.formGroup}><label>Reward</label><input className={styles.input} type="number" id="in_rw" placeholder="0-100" /></div></div>
          <div className={styles.formGroup}><label>Priority</label><select className={styles.select} id="in_p"><option value="medium">Medium</option><option value="high">High</option><option value="low">Low</option></select></div>
          <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('in_name') as HTMLInputElement).value; if (n) { setInnovations(p => [{ id: uid(), name: n, description: (document.getElementById('in_desc') as HTMLTextAreaElement).value, viability: Number((document.getElementById('in_v') as HTMLInputElement).value) || 50, risk: Number((document.getElementById('in_r') as HTMLInputElement).value) || 50, reward: Number((document.getElementById('in_rw') as HTMLInputElement).value) || 50, status: 'exploring', priority: (document.getElementById('in_p') as HTMLSelectElement).value as any, createdAt: now() }, ...p]); setShowForm(null) } }}>Create</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
        </div></div></div>}

      <main className={styles.mainContent}>
        {tab === 'projects' && <div className={styles.section}>
          <div className={styles.controlsRow}><input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." /></div>
          <div className={styles.grid}>{filtered.map(i => (
            <div key={i.id} className={styles.card}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{i.name}</span><span className={`${styles.statusBadge} ${styles[`st_${i.status}`]}`}>{i.status}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{i.priority} priority</span></div>
              <div className={styles.scoreRow}><div className={styles.scoreItem}><span className={styles.scoreLabel}>Viability</span><span className={styles.scoreVal}>{i.viability}</span></div><div className={styles.scoreItem}><span className={styles.scoreLabel}>Risk</span><span className={styles.scoreVal}>{i.risk}</span></div><div className={styles.scoreItem}><span className={styles.scoreLabel}>Reward</span><span className={styles.scoreVal}>{i.reward}</span></div></div>
              <div className={styles.cardActions}><select className={styles.miniSelect} value={i.status} onChange={e => setInnovations(p => p.map(x => x.id === i.id ? { ...x, status: e.target.value as any } : x))}><option value="exploring">Exploring</option><option value="developing">Developing</option><option value="launched">Launched</option><option value="retired">Retired</option></select><button className={styles.deleteBtn} onClick={() => setInnovations(p => p.filter(x => x.id !== i.id))}>×</button></div>
            </div>
          ))}</div>
        </div>}

        {tab === 'prototypes' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Prototype Vault (#25, #32)</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'proto' ? null : 'proto')}>+ Upload Prototype</button>
          {showForm === 'proto' && <div className={styles.inlineForm}><select className={styles.select} id="ip_inno">{innovations.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select><input className={styles.input} placeholder="Prototype name" id="ip_name" /><textarea className={styles.textarea} rows={2} placeholder="Notes" id="ip_notes" style={{ flex: 1, minWidth: 160 }} /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('ip_name') as HTMLInputElement).value; if (n) { setPrototypes(p => [...p, { id: uid(), innovationId: (document.getElementById('ip_inno') as HTMLSelectElement).value, name: n, status: 'draft', iterations: 1, notes: (document.getElementById('ip_notes') as HTMLTextAreaElement).value, date: now() }]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.grid}>{prototypes.map(p => { const inno = innovations.find(i => i.id === p.innovationId); return (
            <div key={p.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{p.name}</span><span className={styles.tag}>v{p.iterations}</span></div><div className={styles.cardMeta}><span className={styles.helperText}>{inno?.name}</span><span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span></div>{p.notes && <p className={styles.cardPreview}>{p.notes}</p>}
              <div className={styles.cardActions}><select className={styles.miniSelect} value={p.status} onChange={e => setPrototypes(prev => prev.map(x => x.id === p.id ? { ...x, status: e.target.value as any } : x))}><option value="draft">Draft</option><option value="testing">Testing</option><option value="archived">Archived</option></select><button className={styles.ghostBtn} onClick={() => setPrototypes(prev => prev.map(x => x.id === p.id ? { ...x, iterations: x.iterations + 1 } : x))}>+ Iteration</button><button className={styles.deleteBtn} onClick={() => setPrototypes(prev => prev.filter(x => x.id !== p.id))}>×</button></div></div> ) })}</div>
        </div>}

        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Metrics (#34)</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Projects</div><div className={styles.kpiValue}>{innovations.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Prototypes</div><div className={styles.kpiValue}>{prototypes.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Exploring</div><div className={styles.kpiValue}>{innovations.filter(i => i.status === 'exploring').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Launched</div><div className={styles.kpiValue}>{innovations.filter(i => i.status === 'launched').length}</div></div>
          </div>
          <div className={styles.aiBox}><div className={styles.aiBoxHeader}>AI Advisory (#30)</div><pre className={styles.aiOutput}>{`Innovation Pipeline:\n${'─'.repeat(35)}\n• ${innovations.length} projects tracked\n• Avg viability: ${innovations.length ? Math.round(innovations.reduce((a, i) => a + i.viability, 0) / innovations.length) : 0}/100\n• ${innovations.filter(i => i.priority === 'high').length} high-priority items\n• ${prototypes.length} prototypes in vault`}</pre></div>
          <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = innovations.map(i => `${i.name} | V:${i.viability} R:${i.risk} RW:${i.reward} | ${i.status}`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `innovation-report-${Date.now()}.txt`; a.click() }}>Export Report (#35)</button></div>
        </div>}

        {tab === 'archive' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Idea Backlog & Archive (#28, #40)</h2>
          <div className={styles.grid}>{innovations.filter(i => i.status === 'retired').map(i => <div key={i.id} className={styles.card}><span className={styles.cardTitle}>{i.name}</span><span className={styles.tag}>Retired</span><button className={styles.ghostBtn} onClick={() => setInnovations(p => p.map(x => x.id === i.id ? { ...x, status: 'exploring' } : x))}>Restore</button></div>)}</div>
          {innovations.filter(i => i.status === 'retired').length === 0 && <p className={styles.emptyState}>No archived innovations.</p>}
        </div>}
      </main>
    </div>
  )
}
export { RDPlayground as PrototypeVault }
export { RDPlayground as SpeculativeConcepts }
export { RDPlayground as CreativeConstraintsEngine }
export { RDPlayground as CrossDisciplineFusionLab }

/* ═══════════════════════════════════════════════════════════
   IP & LEGACY HUB — 20 features + Legacy & Ownership merged
   Register IP, track provenance, estate planning
   ═══════════════════════════════════════════════════════════ */

interface IPAsset { id: string; title: string; type: string; rights: string; filingStatus: 'registered' | 'pending' | 'draft'; isPublic: boolean; legal: string; notes: string; version: number; createdAt: string }

type IPTab = 'registry' | 'assets' | 'legal' | 'legacy'

export function IPRegistry() {
  const [tab, setTab] = useState<IPTab>('registry')
  const [assets, setAssets] = useCloudStorage<IPAsset[]>('ip_assets', [])
  const [search, setSearch] = useState(''); const [showForm, setShowForm] = useState<string | null>(null)

  const filtered = useMemo(() => { let r = [...assets]; if (search) r = r.filter(a => a.title.toLowerCase().includes(search.toLowerCase())); return r }, [assets, search])

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>IP & Legacy Hub</h1><p className={styles.subtitle}>Intellectual Property · Rights · Provenance</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm('ip')}>+ Register IP (#41)</button></div></header>
      <nav className={styles.tabNav}>{(['registry', 'assets', 'legal', 'legacy'] as IPTab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      {showForm === 'ip' && <div className={styles.overlay}><div className={styles.wizardPanel}><h2 className={styles.wizardTitle}>Register IP</h2>
        <div className={styles.formStack}>
          <div className={styles.formGroup}><label>Title</label><input className={styles.input} id="ip_title" /></div>
          <div className={styles.fieldRow}><div className={styles.formGroup}><label>Type</label><select className={styles.select} id="ip_type"><option>Design</option><option>Music</option><option>Film</option><option>Software</option><option>Brand</option><option>Patent</option><option>Other</option></select></div><div className={styles.formGroup}><label>Rights</label><input className={styles.input} id="ip_rights" placeholder="Full Ownership, Shared, Licensed..." /></div></div>
          <div className={styles.formGroup}><label>Filing Status</label><select className={styles.select} id="ip_filing"><option value="draft">Draft</option><option value="pending">Pending</option><option value="registered">Registered</option></select></div>
          <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ip_title') as HTMLInputElement).value; if (t) { setAssets(p => [{ id: uid(), title: t, type: (document.getElementById('ip_type') as HTMLSelectElement).value, rights: (document.getElementById('ip_rights') as HTMLInputElement).value || 'Full Ownership', filingStatus: (document.getElementById('ip_filing') as HTMLSelectElement).value as any, isPublic: false, legal: '', notes: '', version: 1, createdAt: now() }, ...p]); setShowForm(null) } }}>Register</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
        </div></div></div>}

      <main className={styles.mainContent}>
        {tab === 'registry' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total IP</div><div className={styles.kpiValue}>{assets.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Registered</div><div className={styles.kpiValue}>{assets.filter(a => a.filingStatus === 'registered').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Pending</div><div className={styles.kpiValue}>{assets.filter(a => a.filingStatus === 'pending').length}</div></div>
          </div>
          <div className={styles.controlsRow}><input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IP (#56)..." /></div>
          <div className={styles.grid}>{filtered.map(a => (
            <div key={a.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{a.title}</span><span className={`${styles.statusBadge} ${styles[a.filingStatus === 'registered' ? 'st_completed' : a.filingStatus === 'pending' ? 'st_pending' : 'st_draft']}`}>{a.filingStatus}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{a.type}</span><span className={styles.helperText}>{a.rights}</span></div>
              <div className={styles.cardActions}>
                <select className={styles.miniSelect} value={a.filingStatus} onChange={e => setAssets(p => p.map(x => x.id === a.id ? { ...x, filingStatus: e.target.value as any } : x))}><option value="draft">Draft</option><option value="pending">Pending</option><option value="registered">Registered</option></select>
                <button className={styles.ghostBtn} onClick={() => setAssets(p => p.map(x => x.id === a.id ? { ...x, isPublic: !x.isPublic } : x))}>{a.isPublic ? 'Public' : 'Private'} (#53)</button>
                <button className={styles.deleteBtn} onClick={() => setAssets(p => p.filter(x => x.id !== a.id))}>×</button>
              </div>
            </div>
          ))}</div>
        </div>}

        {tab === 'assets' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Creative Assets (#42, #55)</h2>
          <div className={styles.grid}>{assets.map(a => <div key={a.id} className={styles.card}><span className={styles.cardTitle}>{a.title}</span><span className={styles.tag}>{a.type} · v{a.version}</span><div className={styles.cardActions}><button className={styles.ghostBtn} onClick={() => setAssets(p => p.map(x => x.id === a.id ? { ...x, version: x.version + 1 } : x))}>+ Version</button></div></div>)}</div>
        </div>}

        {tab === 'legal' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Legal & Compliance (#45-48)</h2>
          <div className={styles.grid}>{assets.map(a => <div key={a.id} className={styles.card}><span className={styles.cardTitle}>{a.title}</span><span className={styles.tag}>{a.rights}</span><div className={styles.formGroup}><label>Legal Notes</label><textarea className={styles.textarea} rows={2} value={a.legal} onChange={e => setAssets(p => p.map(x => x.id === a.id ? { ...x, legal: e.target.value } : x))} placeholder="Licensing, contracts, compliance..." /></div></div>)}</div>
        </div>}

        {tab === 'legacy' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Legacy & Estate (#44, #217-221)</h2>
          <div className={styles.dnaBlock}><label className={styles.label}>Estate Planning Notes</label><textarea className={styles.textarea} rows={4} placeholder="Long-term IP planning, succession, estate notes..." /></div>
          <div className={styles.dnaBlock}><label className={styles.label}>Activity Log (#50)</label>
            <div className={styles.timeline}>{assets.slice(0, 10).map(a => <div key={a.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>Registered: {a.title} · {fmtDate(a.createdAt)}</span></div>)}</div>
          </div>
          <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = assets.map(a => `${a.title} | ${a.type} | ${a.rights} | ${a.filingStatus}`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `ip-report-${Date.now()}.txt`; a.click() }}>Export IP Report (#54)</button></div>
        </div>}
      </main>
    </div>
  )
}
export { IPRegistry as ArchiveProvenance }
export { IPRegistry as CreativeEstateMode }

/* ═══════════════════════════════════════════════════════════
   DESIGN STUDIO — Packaging, Visual Campaigns
   ═══════════════════════════════════════════════════════════ */

interface DesignProject { id: string; name: string; type: string; description: string; status: 'concept' | 'designing' | 'review' | 'final'; notes: string; createdAt: string }

export function PackagingDesignStudio() {
  const [projects, setProjects] = useCloudStorage<DesignProject[]>('ds_projects', [])
  const [search, setSearch] = useState(''); const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => { let r = [...projects]; if (search) r = r.filter(p => p.name.toLowerCase().includes(search.toLowerCase())); return r }, [projects, search])

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Design Studio</h1><p className={styles.subtitle}>Packaging · Visual Campaigns · Creative Assets</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>+ New Project</button></div></header>
      {showForm && <div className={styles.inlineForm}><input className={styles.input} placeholder="Project name" id="ds_name" /><select className={styles.select} id="ds_type"><option>Packaging</option><option>Campaign</option><option>Label</option><option>Print</option><option>Digital</option></select><textarea className={styles.textarea} rows={2} placeholder="Description" id="ds_desc" style={{ flex: 1, minWidth: 160 }} /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('ds_name') as HTMLInputElement).value; if (n) { setProjects(p => [{ id: uid(), name: n, type: (document.getElementById('ds_type') as HTMLSelectElement).value, description: (document.getElementById('ds_desc') as HTMLTextAreaElement).value, status: 'concept', notes: '', createdAt: now() }, ...p]); setShowForm(false) } }}>Create</button></div>}
      <div className={styles.controlsRow}><input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." /></div>
      <div className={styles.grid}>{filtered.map(p => (
        <div key={p.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{p.name}</span><span className={`${styles.statusBadge} ${styles[`st_${p.status === 'final' ? 'completed' : p.status === 'review' ? 'testing' : p.status}`]}`}>{p.status}</span></div>
          <div className={styles.cardMeta}><span className={styles.tag}>{p.type}</span><span className={styles.helperText}>{fmtDate(p.createdAt)}</span></div>
          {p.description && <p className={styles.cardPreview}>{p.description}</p>}
          <div className={styles.cardActions}>
            <select className={styles.miniSelect} value={p.status} onChange={e => setProjects(prev => prev.map(x => x.id === p.id ? { ...x, status: e.target.value as any } : x))}><option value="concept">Concept</option><option value="designing">Designing</option><option value="review">Review</option><option value="final">Final</option></select>
            <button className={styles.deleteBtn} onClick={() => setProjects(prev => prev.filter(x => x.id !== p.id))}>×</button>
          </div>
        </div>
      ))}</div>
    </div>
  )
}
export { PackagingDesignStudio as VisualCampaignBuilder }
