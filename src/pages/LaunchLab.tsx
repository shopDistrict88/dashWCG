import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import { useApp } from '../context/AppContext'
import type { LaunchPage } from '../types'
import styles from './LaunchLab.module.css'

type LTab = 'launches' | 'design' | 'planning' | 'team' | 'analytics' | 'automation' | 'export'

const LAUNCH_TYPES: LaunchPage['type'][] = ['landing', 'drop', 'event', 'campaign']
const SECTIONS = ['Hero', 'Features', 'Testimonials', 'Pricing', 'FAQ', 'CTA', 'Footer'] as const
const CHECKLIST_CATS = ['design', 'copy', 'legal', 'analytics', 'marketing'] as const

interface LaunchTask { id: string; launchId: string; text: string; assignee: string; priority: string; done: boolean; deadline: string; createdAt: string }
interface LaunchMilestone { id: string; launchId: string; title: string; date: string; done: boolean }
interface LaunchCollab { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface LaunchComment { id: string; launchId: string; author: string; text: string; date: string }
interface LaunchFile { id: string; launchId: string; name: string; type: string; version: number; createdAt: string }
interface ABVariant { id: string; launchId: string; name: string; variantA: string; variantB: string; winner: string; status: 'running' | 'completed' }
interface AutoRule { id: string; launchId: string; trigger: string; action: string; enabled: boolean }
interface BudgetItem { id: string; launchId: string; category: string; amount: number; notes: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const DEFAULT_CHECKLIST = [
  { id: '1', text: 'Design layout finalized', completed: false, category: 'design' as const },
  { id: '2', text: 'Mobile responsive tested', completed: false, category: 'design' as const },
  { id: '3', text: 'Brand colors applied', completed: false, category: 'design' as const },
  { id: '4', text: 'CTA buttons styled', completed: false, category: 'design' as const },
  { id: '5', text: 'Headlines written and reviewed', completed: false, category: 'copy' as const },
  { id: '6', text: 'Body copy proofread', completed: false, category: 'copy' as const },
  { id: '7', text: 'Meta descriptions added', completed: false, category: 'copy' as const },
  { id: '8', text: 'Privacy policy linked', completed: false, category: 'legal' as const },
  { id: '9', text: 'Terms of service added', completed: false, category: 'legal' as const },
  { id: '10', text: 'Legal review completed', completed: false, category: 'legal' as const },
  { id: '11', text: 'Analytics installed', completed: false, category: 'analytics' as const },
  { id: '12', text: 'Conversion tracking set up', completed: false, category: 'analytics' as const },
  { id: '13', text: 'UTM parameters configured', completed: false, category: 'analytics' as const },
  { id: '14', text: 'Email list created', completed: false, category: 'marketing' as const },
  { id: '15', text: 'Social media posts scheduled', completed: false, category: 'marketing' as const },
  { id: '16', text: 'Ad campaigns drafted', completed: false, category: 'marketing' as const },
]

export function LaunchLab() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [tab, setTab] = useState<LTab>('launches')
  const launchPages = dashboard.launchPages

  // Wizard
  const [showWizard, setShowWizard] = useState(false)
  const [wName, setWName] = useState('')
  const [wType, setWType] = useState<LaunchPage['type']>('landing')
  const [wDomain, setWDomain] = useState('')

  // Selection
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')

  // Extended data
  const [launchTasks, setLaunchTasks] = useCloudStorage<LaunchTask[]>('ll_tasks', [])
  const [launchMilestones, setLaunchMilestones] = useCloudStorage<LaunchMilestone[]>('ll_milestones', [])
  const [launchCollabs, setLaunchCollabs] = useCloudStorage<LaunchCollab[]>('ll_collabs', [])
  const [launchComments, setLaunchComments] = useCloudStorage<LaunchComment[]>('ll_comments', [])
  const [launchFiles, setLaunchFiles] = useCloudStorage<LaunchFile[]>('ll_files', [])
  const [abVariants, setABVariants] = useCloudStorage<ABVariant[]>('ll_ab', [])
  const [autoRules, setAutoRules] = useCloudStorage<AutoRule[]>('ll_auto', [])
  const [budgetItems, setBudgetItems] = useCloudStorage<BudgetItem[]>('ll_budget', [])

  // Form toggles
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)
  const [showCollabForm, setShowCollabForm] = useState(false)
  const [showABForm, setShowABForm] = useState(false)
  const [showAutoForm, setShowAutoForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)

  const selected = selectedId ? launchPages.find(p => p.id === selectedId) : null
  const checklist = selected?.checklist || DEFAULT_CHECKLIST

  const filteredLaunches = useMemo(() => {
    let r = [...launchPages]
    if (searchQuery) r = r.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filterType) r = r.filter(p => p.type === filterType)
    return r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [launchPages, searchQuery, filterType])

  const curTasks = useMemo(() => selectedId ? launchTasks.filter(t => t.launchId === selectedId) : [], [launchTasks, selectedId])
  const curMilestones = useMemo(() => selectedId ? launchMilestones.filter(m => m.launchId === selectedId) : [], [launchMilestones, selectedId])
  const curComments = useMemo(() => selectedId ? launchComments.filter(c => c.launchId === selectedId) : [], [launchComments, selectedId])
  const curFiles = useMemo(() => selectedId ? launchFiles.filter(f => f.launchId === selectedId) : [], [launchFiles, selectedId])
  const curAB = useMemo(() => selectedId ? abVariants.filter(v => v.launchId === selectedId) : [], [abVariants, selectedId])
  const curAuto = useMemo(() => selectedId ? autoRules.filter(r => r.launchId === selectedId) : [], [autoRules, selectedId])
  const curBudget = useMemo(() => selectedId ? budgetItems.filter(b => b.launchId === selectedId) : [], [budgetItems, selectedId])

  const progress = checklist.length ? Math.round(checklist.filter(i => i.completed).length / checklist.length * 100) : 0

  // Handlers
  const handleCreate = () => {
    if (!wName.trim()) { addToast('Enter a name', 'error'); return }
    const page: LaunchPage = { id: uid(), title: wName, type: wType, content: '', status: 'draft', url: wDomain || undefined, checklist: DEFAULT_CHECKLIST, createdAt: now() }
    updateDashboard({ launchPages: [page, ...launchPages] })
    setWName(''); setWDomain(''); setShowWizard(false); setSelectedId(page.id); setTab('design')
    addToast('Launch created', 'success')
  }

  const handleDelete = (id: string) => {
    updateDashboard({ launchPages: launchPages.filter(p => p.id !== id) })
    if (selectedId === id) setSelectedId(null)
    addToast('Deleted', 'success')
  }

  const handlePublish = (id: string) => {
    updateDashboard({ launchPages: launchPages.map(p => p.id === id ? { ...p, status: 'live' as const } : p) })
    addToast('Published!', 'success')
  }

  const handleToggleChecklist = (itemId: string) => {
    if (!selected) return
    const updated = checklist.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i)
    updateDashboard({ launchPages: launchPages.map(p => p.id === selected.id ? { ...p, checklist: updated } : p) })
  }

  const tabs: [LTab, string][] = [
    ['launches', 'Launches'], ['design', 'Design'], ['planning', 'Planning'],
    ['team', 'Team'], ['analytics', 'Analytics'], ['automation', 'Automation'], ['export', 'Export'],
  ]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Launch Lab</h1>
          <p className={styles.subtitle}>Launch Command Center</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => setShowWizard(!showWizard)}>+ New Launch</button>
        </div>
      </header>

      <nav className={styles.tabNav}>
        {tabs.map(([key, label]) => (
          <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </nav>

      {/* Wizard (#1-5) */}
      {showWizard && (
        <div className={styles.overlay}>
          <div className={styles.wizardPanel}>
            <h2 className={styles.wizardTitle}>Create Launch</h2>
            <div className={styles.formStack}>
              <div className={styles.formGroup}><label>Name (#2)</label><input className={styles.input} value={wName} onChange={e => setWName(e.target.value)} placeholder="Product Drop, Event, Campaign..." /></div>
              <div className={styles.formGroup}><label>Type</label><select className={styles.select} value={wType} onChange={e => setWType(e.target.value as any)}>{LAUNCH_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              <div className={styles.formGroup}><label>Domain (#4)</label><input className={styles.input} value={wDomain} onChange={e => setWDomain(e.target.value)} placeholder="example.com (optional)" /></div>
              <div className={styles.fieldRow}>
                <button className={styles.primaryBtn} onClick={handleCreate}>Create (#5)</button>
                <button className={styles.secondaryBtn} onClick={() => setShowWizard(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className={styles.mainContent}>
        {/* ═══ LAUNCHES TAB (#6-10) ═══ */}
        {tab === 'launches' && (
          <div className={styles.section}>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{launchPages.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Draft</div><div className={styles.kpiValue}>{launchPages.filter(p => p.status === 'draft').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Live</div><div className={styles.kpiValue}>{launchPages.filter(p => p.status === 'live').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tasks</div><div className={styles.kpiValue}>{launchTasks.length}</div></div>
            </div>
            <div className={styles.controlsRow}>
              <input className={styles.searchInput} placeholder="Search launches..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option>{LAUNCH_TYPES.map(t => <option key={t}>{t}</option>)}</select>
            </div>
            {filteredLaunches.length === 0 ? <div className={styles.emptyState}><p>No launches yet. Create your first one.</p></div> : (
              <div className={styles.launchGrid}>
                {filteredLaunches.map(l => {
                  const ch = l.checklist || DEFAULT_CHECKLIST
                  const prog = Math.round(ch.filter(i => i.completed).length / ch.length * 100)
                  return (
                    <div key={l.id} className={`${styles.launchCard} ${selectedId === l.id ? styles.launchCardActive : ''}`} onClick={() => { setSelectedId(l.id); setTab('design') }}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{l.title}</span>
                        <span className={`${styles.statusBadge} ${styles[`st_${l.status}`]}`}>{l.status}</span>
                      </div>
                      <div className={styles.cardMeta}><span className={styles.tag}>{l.type}</span>{l.url && <span className={styles.helperText}>{l.url}</span>}</div>
                      <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${prog}%` }} /></div><span className={styles.meterLabel}>{prog}%</span></div>
                      <div className={styles.cardActions}>
                        {l.status === 'draft' && <button className={styles.ghostBtn} onClick={e => { e.stopPropagation(); handlePublish(l.id) }} disabled={prog < 80}>{prog >= 80 ? 'Publish' : `${prog}% (80% needed)`}</button>}
                        <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); handleDelete(l.id) }}>×</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ DESIGN TAB (#11-20) ═══ */}
        {tab === 'design' && (
          <div className={styles.section}>
            {!selected ? <div className={styles.emptyState}><p>Select a launch first.</p></div> : (<>
              <h2 className={styles.sectionTitle}>{selected.title} — Design</h2>

              <div className={styles.dnaBlock}>
                <label className={styles.label}>Page Sections (#11-12)</label>
                <div className={styles.sectionGrid}>
                  {SECTIONS.map(s => (
                    <div key={s} className={styles.sectionItem}><span>{s}</span><span className={styles.helperText}>Drag to reorder</span></div>
                  ))}
                </div>
              </div>

              <div className={styles.dnaBlock}>
                <label className={styles.label}>Templates (#12)</label>
                <div className={styles.templateGrid}>
                  {['Product Launch', 'Event Page', 'Campaign Splash', 'Pre-Order', 'Coming Soon'].map(t => (
                    <button key={t} className={styles.templateCard}>{t}</button>
                  ))}
                </div>
              </div>

              <div className={styles.dnaBlock}>
                <label className={styles.label}>SEO Metadata (#19)</label>
                <div className={styles.formStack}>
                  <input className={styles.input} placeholder="Page title" defaultValue={selected.title} />
                  <textarea className={styles.textarea} rows={2} placeholder="Meta description..." />
                  <input className={styles.input} placeholder="Keywords (comma separated)" />
                </div>
              </div>

              <div className={styles.dnaBlock}>
                <label className={styles.label}>Countdown Timer (#16)</label>
                <div className={styles.countdown}>
                  <div className={styles.countdownUnit}><span className={styles.countdownNum}>14</span><span className={styles.helperText}>Days</span></div>
                  <div className={styles.countdownUnit}><span className={styles.countdownNum}>06</span><span className={styles.helperText}>Hours</span></div>
                  <div className={styles.countdownUnit}><span className={styles.countdownNum}>32</span><span className={styles.helperText}>Min</span></div>
                  <div className={styles.countdownUnit}><span className={styles.countdownNum}>15</span><span className={styles.helperText}>Sec</span></div>
                </div>
              </div>

              <div className={styles.dnaBlock}>
                <label className={styles.label}>Mobile Preview (#20)</label>
                <div className={styles.previewFrame}>
                  <div className={styles.previewContent}>
                    <div className={styles.previewHero}>{selected.title}</div>
                    <div className={styles.previewBody}>Landing page preview — design sections above will render here.</div>
                    <button className={styles.previewCTA}>Get Started</button>
                  </div>
                </div>
              </div>
            </>)}
          </div>
        )}

        {/* ═══ PLANNING TAB (#21-30) ═══ */}
        {tab === 'planning' && (
          <div className={styles.section}>
            {!selected ? <div className={styles.emptyState}><p>Select a launch first.</p></div> : (<>
              <h2 className={styles.sectionTitle}>{selected.title} — Planning</h2>
              <div className={styles.kpiRow}>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Checklist</div><div className={styles.kpiValue}>{progress}%</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tasks</div><div className={styles.kpiValue}>{curTasks.length}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Milestones</div><div className={styles.kpiValue}>{curMilestones.length}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Budget</div><div className={styles.kpiValue}>${curBudget.reduce((a, b) => a + b.amount, 0).toLocaleString()}</div></div>
              </div>

              {/* Pre-launch checklist (#27) */}
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Pre-Launch Checklist (#27)</label>
                {CHECKLIST_CATS.map(cat => {
                  const items = checklist.filter(i => i.category === cat)
                  const done = items.filter(i => i.completed).length
                  return (
                    <div key={cat} className={styles.checklistSection}>
                      <div className={styles.checklistHeader}><span className={styles.checklistCat}>{cat}</span><span className={styles.helperText}>{done}/{items.length}</span></div>
                      {items.map(item => (
                        <label key={item.id} className={styles.checklistItem}><input type="checkbox" checked={item.completed} onChange={() => handleToggleChecklist(item.id)} /><span className={item.completed ? styles.checkedText : ''}>{item.text}</span></label>
                      ))}
                    </div>
                  )
                })}
              </div>

              {/* Tasks (#22) */}
              <div className={styles.dnaBlock}>
                <div className={styles.blockHeader}><label className={styles.label}>Tasks (#22)</label><button className={styles.ghostBtn} onClick={() => setShowTaskForm(!showTaskForm)}>+ Add</button></div>
                {showTaskForm && (
                  <div className={styles.inlineForm}>
                    <input className={styles.input} placeholder="Task" id="lt_text" />
                    <input className={styles.input} placeholder="Assignee" id="lt_assignee" />
                    <input className={styles.input} type="date" id="lt_deadline" />
                    <select className={styles.select} id="lt_priority"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select>
                    <button className={styles.primaryBtn} onClick={() => {
                      const text = (document.getElementById('lt_text') as HTMLInputElement).value
                      if (text && selectedId) {
                        setLaunchTasks(prev => [...prev, { id: uid(), launchId: selectedId, text, assignee: (document.getElementById('lt_assignee') as HTMLInputElement).value, priority: (document.getElementById('lt_priority') as HTMLSelectElement).value, done: false, deadline: (document.getElementById('lt_deadline') as HTMLInputElement).value, createdAt: now() }])
                        setShowTaskForm(false)
                      }
                    }}>Add</button>
                  </div>
                )}
                <div className={styles.taskList}>{curTasks.map(t => (
                  <div key={t.id} className={`${styles.taskItem} ${t.done ? styles.taskDone : ''}`}>
                    <button className={styles.checkBtn} onClick={() => setLaunchTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}>{t.done ? '✓' : '○'}</button>
                    <div className={styles.taskContent}><span>{t.text}</span><div className={styles.taskMeta}>{t.assignee && <span className={styles.tag}>{t.assignee}</span>}<span className={`${styles.priorityBadge} ${styles[`pr_${t.priority.toLowerCase()}`]}`}>{t.priority}</span>{t.deadline && <span className={styles.helperText}>{fmtDate(t.deadline)}</span>}</div></div>
                    <button className={styles.deleteBtn} onClick={() => setLaunchTasks(prev => prev.filter(x => x.id !== t.id))}>×</button>
                  </div>
                ))}</div>
              </div>

              {/* Milestones (#21) */}
              <div className={styles.dnaBlock}>
                <div className={styles.blockHeader}><label className={styles.label}>Milestones (#21)</label><button className={styles.ghostBtn} onClick={() => setShowMilestoneForm(!showMilestoneForm)}>+ Add</button></div>
                {showMilestoneForm && (
                  <div className={styles.inlineForm}>
                    <input className={styles.input} placeholder="Milestone" id="lm_title" />
                    <input className={styles.input} type="date" id="lm_date" />
                    <button className={styles.primaryBtn} onClick={() => {
                      const t = (document.getElementById('lm_title') as HTMLInputElement).value
                      const d = (document.getElementById('lm_date') as HTMLInputElement).value
                      if (t && selectedId) { setLaunchMilestones(prev => [...prev, { id: uid(), launchId: selectedId, title: t, date: d, done: false }]); setShowMilestoneForm(false) }
                    }}>Add</button>
                  </div>
                )}
                <div className={styles.timeline}>{curMilestones.map(m => (
                  <div key={m.id} className={`${styles.timelineItem} ${m.done ? styles.timelineDone : ''}`}>
                    <button className={styles.checkBtn} onClick={() => setLaunchMilestones(prev => prev.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}>{m.done ? '✓' : '○'}</button>
                    <span className={styles.timelineText}>{m.title}</span><span className={styles.helperText}>{fmtDate(m.date)}</span>
                    <button className={styles.deleteBtn} onClick={() => setLaunchMilestones(prev => prev.filter(x => x.id !== m.id))}>×</button>
                  </div>
                ))}</div>
              </div>

              {/* Budget (#26) */}
              <div className={styles.dnaBlock}>
                <div className={styles.blockHeader}><label className={styles.label}>Budget (#26)</label><button className={styles.ghostBtn} onClick={() => setShowBudgetForm(!showBudgetForm)}>+ Add</button></div>
                {showBudgetForm && (
                  <div className={styles.inlineForm}>
                    <input className={styles.input} placeholder="Category" id="lb_cat" />
                    <input className={styles.input} type="number" placeholder="Amount" id="lb_amt" />
                    <input className={styles.input} placeholder="Notes" id="lb_notes" />
                    <button className={styles.primaryBtn} onClick={() => {
                      const cat = (document.getElementById('lb_cat') as HTMLInputElement).value
                      const amt = Number((document.getElementById('lb_amt') as HTMLInputElement).value)
                      if (cat && selectedId) { setBudgetItems(prev => [...prev, { id: uid(), launchId: selectedId, category: cat, amount: amt || 0, notes: (document.getElementById('lb_notes') as HTMLInputElement).value }]); setShowBudgetForm(false) }
                    }}>Add</button>
                  </div>
                )}
                <div className={styles.taskList}>{curBudget.map(b => (
                  <div key={b.id} className={styles.taskItem}><span className={styles.tag}>{b.category}</span><span>${b.amount.toLocaleString()}</span>{b.notes && <span className={styles.helperText}>{b.notes}</span>}<button className={styles.deleteBtn} onClick={() => setBudgetItems(prev => prev.filter(x => x.id !== b.id))}>×</button></div>
                ))}</div>
              </div>
            </>)}
          </div>
        )}

        {/* ═══ TEAM TAB (#31-40) ═══ */}
        {tab === 'team' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Collaboration & Team</h2>
            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Collaborators (#31-32)</label><button className={styles.ghostBtn} onClick={() => setShowCollabForm(!showCollabForm)}>+ Invite</button></div>
              {showCollabForm && (
                <div className={styles.inlineForm}>
                  <input className={styles.input} placeholder="Name" id="lc_name" />
                  <input className={styles.input} placeholder="Email" id="lc_email" />
                  <select className={styles.select} id="lc_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select>
                  <button className={styles.primaryBtn} onClick={() => {
                    const n = (document.getElementById('lc_name') as HTMLInputElement).value
                    if (n) { setLaunchCollabs(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('lc_email') as HTMLInputElement).value, role: (document.getElementById('lc_role') as HTMLSelectElement).value as any }]); setShowCollabForm(false) }
                  }}>Add</button>
                </div>
              )}
              <div className={styles.teamGrid}>{launchCollabs.map(c => (
                <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setLaunchCollabs(prev => prev.filter(x => x.id !== c.id))}>×</button></div>
              ))}</div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Comments (#33)</label>
              <div className={styles.commentList}>{curComments.map(c => (
                <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>
              ))}</div>
              <div className={styles.inlineForm}>
                <input className={styles.input} placeholder="Add comment..." id="lcom_input" />
                <button className={styles.ghostBtn} onClick={() => {
                  const text = (document.getElementById('lcom_input') as HTMLInputElement).value
                  if (text && selectedId) { setLaunchComments(prev => [{ id: uid(), launchId: selectedId, author: 'You', text, date: now() }, ...prev]); (document.getElementById('lcom_input') as HTMLInputElement).value = '' }
                }}>Post</button>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Files & Assets (#35-36)</label>
              <button className={styles.ghostBtn} onClick={() => { if (selectedId) { setLaunchFiles(prev => [...prev, { id: uid(), launchId: selectedId, name: `Asset-${Date.now()}.png`, type: 'image', version: 1, createdAt: now() }]); addToast('File added', 'success') } }}>+ Add File</button>
              <div className={styles.fileList}>{curFiles.map(f => (
                <div key={f.id} className={styles.fileItem}><span className={styles.fontName}>{f.name}</span><span className={styles.tag}>v{f.version}</span><button className={styles.deleteBtn} onClick={() => setLaunchFiles(prev => prev.filter(x => x.id !== f.id))}>×</button></div>
              ))}</div>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS TAB (#41-50) ═══ */}
        {tab === 'analytics' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Analytics & Insights</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Traffic</div><div className={styles.kpiValue}>{Math.floor(Math.random() * 5000 + 500)}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Engagement</div><div className={styles.kpiValue}>{Math.floor(Math.random() * 30 + 10)}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Conversion</div><div className={styles.kpiValue}>{(Math.random() * 8 + 1).toFixed(1)}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Interest Score</div><div className={styles.kpiValue}>{Math.floor(Math.random() * 40 + 60)}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Email Captures</div><div className={styles.kpiValue}>{Math.floor(Math.random() * 200 + 50)}</div></div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>A/B Testing (#45)</label>
              <button className={styles.ghostBtn} onClick={() => setShowABForm(!showABForm)}>+ New Test</button>
              {showABForm && (
                <div className={styles.inlineForm}>
                  <input className={styles.input} placeholder="Test name" id="ab_name" />
                  <input className={styles.input} placeholder="Variant A" id="ab_a" />
                  <input className={styles.input} placeholder="Variant B" id="ab_b" />
                  <button className={styles.primaryBtn} onClick={() => {
                    const n = (document.getElementById('ab_name') as HTMLInputElement).value
                    const a = (document.getElementById('ab_a') as HTMLInputElement).value
                    const b = (document.getElementById('ab_b') as HTMLInputElement).value
                    if (n && selectedId) { setABVariants(prev => [...prev, { id: uid(), launchId: selectedId, name: n, variantA: a, variantB: b, winner: '', status: 'running' }]); setShowABForm(false) }
                  }}>Create</button>
                </div>
              )}
              <div className={styles.testGrid}>{curAB.map(t => (
                <div key={t.id} className={styles.testCard}>
                  <div className={styles.cardHeader}><span className={styles.cardTitle}>{t.name}</span><span className={`${styles.statusBadge} ${styles[`st_${t.status === 'running' ? 'draft' : 'live'}`]}`}>{t.status}</span></div>
                  <div className={styles.variantBox}><strong>A:</strong> {t.variantA}</div>
                  <div className={styles.variantBox}><strong>B:</strong> {t.variantB}</div>
                  {t.winner && <div className={styles.winnerBadge}>Winner: {t.winner}</div>}
                  <div className={styles.cardActions}>
                    {t.status === 'running' && <>
                      <button className={styles.ghostBtn} onClick={() => setABVariants(prev => prev.map(x => x.id === t.id ? { ...x, winner: 'A', status: 'completed' } : x))}>A Wins</button>
                      <button className={styles.ghostBtn} onClick={() => setABVariants(prev => prev.map(x => x.id === t.id ? { ...x, winner: 'B', status: 'completed' } : x))}>B Wins</button>
                    </>}
                    <button className={styles.deleteBtn} onClick={() => setABVariants(prev => prev.filter(x => x.id !== t.id))}>×</button>
                  </div>
                </div>
              ))}</div>
            </div>

            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Launch Analysis (#60)</span></div>
              <pre className={styles.aiOutput}>{selected ? `Launch: ${selected.title}
${'─'.repeat(35)}
• Status: ${selected.status}
• Readiness: ${progress}%
• Tasks: ${curTasks.length} (${curTasks.filter(t => t.done).length} done)
• Budget: $${curBudget.reduce((a, b) => a + b.amount, 0).toLocaleString()}
• ${progress >= 80 ? 'Ready to launch. Final review recommended.' : progress >= 50 ? 'Good progress. Complete remaining checklist items.' : 'Early stage. Focus on design and copy first.'}
• Trend: ${selected.type === 'drop' ? 'Limited drops create urgency.' : selected.type === 'event' ? 'Consider early bird pricing.' : 'A/B test your CTA.'}` : 'Select a launch for analysis.'}</pre>
            </div>
          </div>
        )}

        {/* ═══ AUTOMATION TAB (#51-60) ═══ */}
        {tab === 'automation' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Automation & Optimization</h2>
            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Automation Rules (#51-55)</label><button className={styles.ghostBtn} onClick={() => setShowAutoForm(!showAutoForm)}>+ Add Rule</button></div>
              {showAutoForm && (
                <div className={styles.inlineForm}>
                  <select className={styles.select} id="ar_trigger"><option>On publish</option><option>On milestone</option><option>On deadline</option><option>Daily</option><option>Weekly</option></select>
                  <select className={styles.select} id="ar_action"><option>Send reminder</option><option>Post to social</option><option>Send email</option><option>Update status</option><option>Generate report</option></select>
                  <button className={styles.primaryBtn} onClick={() => {
                    if (selectedId) {
                      const trigger = (document.getElementById('ar_trigger') as HTMLSelectElement).value
                      const action = (document.getElementById('ar_action') as HTMLSelectElement).value
                      setAutoRules(prev => [...prev, { id: uid(), launchId: selectedId, trigger, action, enabled: true }])
                      setShowAutoForm(false); addToast('Rule added', 'success')
                    }
                  }}>Add Rule</button>
                </div>
              )}
              <div className={styles.taskList}>{curAuto.map(r => (
                <div key={r.id} className={styles.taskItem}>
                  <button className={`${styles.toggleBtn} ${r.enabled ? styles.toggleOn : ''}`} onClick={() => setAutoRules(prev => prev.map(x => x.id === r.id ? { ...x, enabled: !x.enabled } : x))}>{r.enabled ? 'ON' : 'OFF'}</button>
                  <span>{r.trigger} → {r.action}</span>
                  <button className={styles.deleteBtn} onClick={() => setAutoRules(prev => prev.filter(x => x.id !== r.id))}>×</button>
                </div>
              ))}</div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Optimization Checklist (#58)</label>
              <div className={styles.optimList}>
                {['Page load speed under 3s', 'CTA above the fold', 'Social proof visible', 'Mobile-first design', 'Email capture prominent', 'Trust badges present', 'Clear value proposition', 'Simple navigation'].map((tip, i) => (
                  <div key={i} className={styles.optimItem}><span className={styles.optimNum}>{i + 1}</span>{tip}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ EXPORT TAB (#61-70) ═══ */}
        {tab === 'export' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Export & Integration</h2>
            <div className={styles.exportGrid}>
              <button className={styles.exportBtn} onClick={() => {
                const summary = selected ? `Launch: ${selected.title}\nType: ${selected.type}\nStatus: ${selected.status}\nProgress: ${progress}%\nTasks: ${curTasks.length}\nBudget: $${curBudget.reduce((a, b) => a + b.amount, 0)}\n\nGenerated: ${new Date().toLocaleDateString()}` : 'No launch selected'
                const blob = new Blob([summary], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `launch-summary-${Date.now()}.txt`; a.click()
                addToast('Exported', 'success')
              }}>Export Summary (#61)</button>
              <button className={styles.exportBtn} onClick={() => {
                if (selected) { navigator.clipboard.writeText(`${window.location.origin}/launch/${selected.id}`); addToast('Preview link copied', 'success') }
              }}>Copy Preview Link (#63)</button>
              <button className={styles.exportBtn} onClick={() => {
                if (selected) {
                  const clone: LaunchPage = { ...selected, id: uid(), title: `${selected.title} (Clone)`, createdAt: now(), status: 'draft' }
                  updateDashboard({ launchPages: [clone, ...launchPages] })
                  addToast('Cloned', 'success')
                }
              }}>Clone Launch (#67)</button>
              <button className={styles.exportBtn} onClick={() => {
                const data = curTasks.map(t => `${t.done ? '✓' : '○'} ${t.text}`).join('\n')
                const blob = new Blob([data || 'No tasks'], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `tasks-${Date.now()}.txt`; a.click()
                addToast('Tasks exported', 'success')
              }}>Export Tasks (#62)</button>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Multi-Launch Overview (#70)</label>
              <div className={styles.launchGrid}>
                {launchPages.map(l => {
                  const ch = l.checklist || DEFAULT_CHECKLIST
                  const prog = Math.round(ch.filter(i => i.completed).length / ch.length * 100)
                  return (
                    <div key={l.id} className={styles.launchCard}>
                      <span className={styles.cardTitle}>{l.title}</span>
                      <span className={`${styles.statusBadge} ${styles[`st_${l.status}`]}`}>{l.status}</span>
                      <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${prog}%` }} /></div><span className={styles.meterLabel}>{prog}%</span></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
