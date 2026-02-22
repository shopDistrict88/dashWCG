import { useState, useEffect, useMemo, useCallback } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import { useApp } from '../context/AppContext'
import type { Project } from '../types'
import styles from './Projects.module.css'

type PTab = 'projects' | 'details' | 'team' | 'creative' | 'analytics' | 'tracking' | 'export'

const PROJECT_TYPES = ['Campaign', 'Product', 'Service', 'Creative', 'Business', 'Music', 'Visual Art', 'Experiment', 'Social Media', 'Content']
const HELP_OPTS = ['Design', 'Development', 'Marketing', 'Photography', 'Video', 'Music production', 'Branding', 'Strategy']
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

interface Task { id: string; projectId: string; text: string; assignee: string; priority: string; done: boolean; deadline: string; parentId: string; createdAt: string }
interface Milestone { id: string; projectId: string; title: string; date: string; done: boolean }
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface FileAttachment { id: string; projectId: string; name: string; type: string; size: number; createdAt: string }
interface PComment { id: string; projectId: string; taskId: string; author: string; text: string; date: string }
interface ProjectNote { id: string; projectId: string; text: string; createdAt: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

export function Projects() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [tab, setTab] = useState<PTab>('projects')

  // Wizard state (#1-6)
  const [showWizard, setShowWizard] = useState(false)
  const [wName, setWName] = useState('')
  const [wType, setWType] = useState('')
  const [wDesc, setWDesc] = useState('')
  const [wHelp, setWHelp] = useState<string[]>([])
  const [wColor, setWColor] = useState('#ffffff')

  // Selection
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Data state
  const [tasks, setTasks] = useCloudStorage<Task[]>('pj_tasks', [])
  const [milestones, setMilestones] = useCloudStorage<Milestone[]>('pj_milestones', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('pj_collabs', [])
  const [files, setFiles] = useCloudStorage<FileAttachment[]>('pj_files', [])
  const [pComments, setPComments] = useCloudStorage<PComment[]>('pj_comments', [])
  const [projectNotes, setProjectNotes] = useCloudStorage<ProjectNote[]>('pj_notes', [])
  const [favoritesArr, setFavoritesArr] = useCloudStorage<string[]>('pj_favorites', [])
  const favorites = useMemo(() => new Set(favoritesArr), [favoritesArr])

  // Form toggles
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)
  const [showCollabForm, setShowCollabForm] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  const projects = dashboard.projects
  const selected = selectedId ? projects.find(p => p.id === selectedId) : null

  // Keyboard shortcuts (#75)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); setShowWizard(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Filtered projects (#10, #51-60)
  const filteredProjects = useMemo(() => {
    let result = [...projects]
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filterType) result = result.filter(p => p.type === filterType)
    if (filterStatus) result = result.filter(p => p.status === filterStatus)
    const favArr = [...favorites]
    result.sort((a, b) => {
      const aFav = favArr.includes(a.id) ? 0 : 1
      const bFav = favArr.includes(b.id) ? 0 : 1
      return aFav - bFav || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return result
  }, [projects, searchQuery, filterType, filterStatus, favorites])

  // Handlers
  const handleCreateProject = () => {
    if (!wName.trim() || !wType) { addToast('Fill required fields', 'error'); return }
    const proj: Project = { id: uid(), name: wName, type: wType, description: wDesc, helpNeeded: wHelp, status: 'idea', createdAt: now() }
    updateDashboard({ projects: [proj, ...projects] })
    setWName(''); setWType(''); setWDesc(''); setWHelp([]); setWColor('#ffffff'); setShowWizard(false)
    setSelectedId(proj.id); setTab('details')
    addToast('Project created', 'success')
  }

  const handleDeleteProject = (id: string) => {
    updateDashboard({ projects: projects.filter(p => p.id !== id) })
    if (selectedId === id) setSelectedId(null)
    addToast('Deleted', 'success')
  }

  const handleUpdateStatus = (id: string, status: string) => {
    updateDashboard({ projects: projects.map(p => p.id === id ? { ...p, status } : p) })
  }

  const toggleFavorite = (id: string) => setFavoritesArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const projectTasks = useMemo(() => selectedId ? tasks.filter(t => t.projectId === selectedId) : [], [tasks, selectedId])
  const projectMilestones = useMemo(() => selectedId ? milestones.filter(m => m.projectId === selectedId) : [], [milestones, selectedId])
  const projectFiles = useMemo(() => selectedId ? files.filter(f => f.projectId === selectedId) : [], [files, selectedId])
  const projectComments = useMemo(() => selectedId ? pComments.filter(c => c.projectId === selectedId) : [], [pComments, selectedId])
  const projectProgress = projectTasks.length ? Math.round(projectTasks.filter(t => t.done).length / projectTasks.length * 100) : 0

  const tabs: [PTab, string][] = [
    ['projects', 'Projects'], ['details', 'Details'], ['team', 'Team'],
    ['creative', 'Creative'], ['analytics', 'Analytics'],
    ['tracking', 'Tracking'], ['export', 'Export'],
  ]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Projects & Ideas</h1>
          <p className={styles.subtitle}>Creative Command Center</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => setShowWizard(!showWizard)}>+ New Project</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>
        {tabs.map(([key, label]) => (
          <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </nav>

      {/* Wizard Overlay (#1-6) */}
      {showWizard && (
        <div className={styles.overlay}>
          <div className={styles.wizardPanel}>
            <h2 className={styles.wizardTitle}>New Project</h2>
            <div className={styles.formStack}>
              <div className={styles.formGroup}><label>Name</label><input className={styles.input} value={wName} onChange={e => setWName(e.target.value)} placeholder="Project name" /></div>
              <div className={styles.formGroup}><label>Type (#3)</label><select className={styles.select} value={wType} onChange={e => setWType(e.target.value)}><option value="">Select type</option>{PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              <div className={styles.formGroup}><label>Description (#4)</label><textarea className={styles.textarea} rows={3} value={wDesc} onChange={e => setWDesc(e.target.value)} placeholder="What's this project about?" /></div>
              <div className={styles.formGroup}>
                <label>Help Needed (#5)</label>
                <div className={styles.chipRow}>{HELP_OPTS.map(h => <button key={h} type="button" className={`${styles.chipBtn} ${wHelp.includes(h) ? styles.chipActive : ''}`} onClick={() => setWHelp(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h])}>{h}</button>)}</div>
              </div>
              <div className={styles.formGroup}><label>Color (#52)</label><input type="color" value={wColor} onChange={e => setWColor(e.target.value)} className={styles.colorPicker} /></div>
              <div className={styles.fieldRow}>
                <button className={styles.primaryBtn} onClick={handleCreateProject}>Create Project (#6)</button>
                <button className={styles.secondaryBtn} onClick={() => setShowWizard(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className={styles.mainContent}>
        {/* ═══ PROJECTS TAB (#7-10) ═══ */}
        {tab === 'projects' && (
          <div className={styles.section}>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total</div><div className={styles.kpiValue}>{projects.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Ideas</div><div className={styles.kpiValue}>{projects.filter(p => p.status === 'idea').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active</div><div className={styles.kpiValue}>{projects.filter(p => p.status === 'active').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Completed</div><div className={styles.kpiValue}>{projects.filter(p => p.status === 'completed').length}</div></div>
            </div>
            <div className={styles.controlsRow}>
              <input className={styles.searchInput} placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option>{PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}</select>
              <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">All Status</option><option value="idea">Idea</option><option value="active">Active</option><option value="completed">Completed</option></select>
            </div>
            {filteredProjects.length === 0 ? <div className={styles.emptyState}><p>No projects yet. Create your first one.</p></div> : (
              <div className={styles.projectGrid}>
                {filteredProjects.map(p => {
                  const pTasks = tasks.filter(t => t.projectId === p.id)
                  const prog = pTasks.length ? Math.round(pTasks.filter(t => t.done).length / pTasks.length * 100) : 0
                  return (
                    <div key={p.id} className={`${styles.projectCard} ${selectedId === p.id ? styles.projectCardActive : ''}`} onClick={() => { setSelectedId(p.id); setTab('details') }}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{p.name}</span>
                        <button className={styles.favBtn} onClick={e => { e.stopPropagation(); toggleFavorite(p.id) }}>{favorites.has(p.id) ? '★' : '☆'}</button>
                      </div>
                      <div className={styles.cardMeta}>
                        <span className={styles.tag}>{p.type}</span>
                        <span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span>
                      </div>
                      {p.description && <p className={styles.cardPreview}>{p.description.slice(0, 80)}</p>}
                      {pTasks.length > 0 && (
                        <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${prog}%` }} /></div><span className={styles.meterLabel}>{prog}%</span></div>
                      )}
                      {p.helpNeeded.length > 0 && <div className={styles.tagRow}>{p.helpNeeded.map(h => <span key={h} className={styles.tag}>{h}</span>)}</div>}
                      <div className={styles.cardActions}>
                        <select className={styles.miniSelect} value={p.status} onClick={e => e.stopPropagation()} onChange={e => handleUpdateStatus(p.id, e.target.value)}>
                          <option value="idea">Idea</option><option value="active">Active</option><option value="completed">Completed</option>
                        </select>
                        <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); handleDeleteProject(p.id) }}>×</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ DETAILS TAB (#11-20) ═══ */}
        {tab === 'details' && (
          <div className={styles.section}>
            {!selected ? <div className={styles.emptyState}><p>Select a project from the Projects tab.</p></div> : (<>
              <h2 className={styles.sectionTitle}>{selected.name}</h2>
              <div className={styles.kpiRow}>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Progress (#18)</div><div className={styles.kpiValue}>{projectProgress}%</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tasks</div><div className={styles.kpiValue}>{projectTasks.length}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Done</div><div className={styles.kpiValue}>{projectTasks.filter(t => t.done).length}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Milestones</div><div className={styles.kpiValue}>{projectMilestones.length}</div></div>
              </div>

              {/* Milestones (#12) */}
              <div className={styles.dnaBlock}>
                <div className={styles.blockHeader}><label className={styles.label}>Milestones</label><button className={styles.ghostBtn} onClick={() => setShowMilestoneForm(!showMilestoneForm)}>+ Add</button></div>
                {showMilestoneForm && (
                  <div className={styles.inlineForm}>
                    <input className={styles.input} placeholder="Milestone title" id="ms_title" />
                    <input className={styles.input} type="date" id="ms_date" />
                    <button className={styles.primaryBtn} onClick={() => {
                      const t = (document.getElementById('ms_title') as HTMLInputElement).value
                      const d = (document.getElementById('ms_date') as HTMLInputElement).value
                      if (t && selectedId) { setMilestones(prev => [...prev, { id: uid(), projectId: selectedId, title: t, date: d, done: false }]); setShowMilestoneForm(false) }
                    }}>Add</button>
                  </div>
                )}
                <div className={styles.timeline}>{projectMilestones.map(m => (
                  <div key={m.id} className={`${styles.timelineItem} ${m.done ? styles.timelineDone : ''}`}>
                    <button className={styles.checkBtn} onClick={() => setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}>{m.done ? '✓' : '○'}</button>
                    <span className={styles.timelineText}>{m.title}</span>
                    <span className={styles.helperText}>{fmtDate(m.date)}</span>
                    <button className={styles.deleteBtn} onClick={() => setMilestones(prev => prev.filter(x => x.id !== m.id))}>×</button>
                  </div>
                ))}</div>
              </div>

              {/* Tasks (#13-16) */}
              <div className={styles.dnaBlock}>
                <div className={styles.blockHeader}><label className={styles.label}>Tasks</label><button className={styles.ghostBtn} onClick={() => setShowTaskForm(!showTaskForm)}>+ Add</button></div>
                {showTaskForm && (
                  <div className={styles.inlineForm}>
                    <input className={styles.input} placeholder="Task description" id="task_text" />
                    <input className={styles.input} placeholder="Assignee" id="task_assignee" />
                    <select className={styles.select} id="task_priority">{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select>
                    <input className={styles.input} type="date" id="task_deadline" />
                    <button className={styles.primaryBtn} onClick={() => {
                      const text = (document.getElementById('task_text') as HTMLInputElement).value
                      if (text && selectedId) {
                        const assignee = (document.getElementById('task_assignee') as HTMLInputElement).value
                        const priority = (document.getElementById('task_priority') as HTMLSelectElement).value
                        const deadline = (document.getElementById('task_deadline') as HTMLInputElement).value
                        setTasks(prev => [...prev, { id: uid(), projectId: selectedId, text, assignee, priority, done: false, deadline, parentId: '', createdAt: now() }])
                        setShowTaskForm(false)
                      }
                    }}>Add</button>
                  </div>
                )}
                <div className={styles.taskList}>{projectTasks.map(t => (
                  <div key={t.id} className={`${styles.taskItem} ${t.done ? styles.taskDone : ''}`}>
                    <button className={styles.checkBtn} onClick={() => setTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}>{t.done ? '✓' : '○'}</button>
                    <div className={styles.taskContent}>
                      <span className={styles.taskText}>{t.text}</span>
                      <div className={styles.taskMeta}>
                        {t.assignee && <span className={styles.tag}>{t.assignee}</span>}
                        <span className={`${styles.priorityBadge} ${styles[`pr_${t.priority.toLowerCase()}`]}`}>{t.priority}</span>
                        {t.deadline && <span className={styles.helperText}>{fmtDate(t.deadline)}</span>}
                      </div>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))}>×</button>
                  </div>
                ))}</div>
              </div>

              {/* Notes (#20) */}
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Project Notes (#20)</label>
                <div className={styles.notesList}>
                  {projectNotes.filter(n => n.projectId === selectedId).map(n => (
                    <div key={n.id} className={styles.noteItem}>
                      <p>{n.text}</p><span className={styles.helperText}>{fmtDate(n.createdAt)}</span>
                      <button className={styles.deleteBtn} onClick={() => setProjectNotes(prev => prev.filter(x => x.id !== n.id))}>×</button>
                    </div>
                  ))}
                </div>
                <div className={styles.inlineForm}>
                  <textarea className={styles.textarea} rows={2} placeholder="Add a note..." id="pnote_text" />
                  <button className={styles.ghostBtn} onClick={() => {
                    const text = (document.getElementById('pnote_text') as HTMLTextAreaElement).value
                    if (text && selectedId) { setProjectNotes(prev => [{ id: uid(), projectId: selectedId, text, createdAt: now() }, ...prev]); (document.getElementById('pnote_text') as HTMLTextAreaElement).value = '' }
                  }}>Add Note</button>
                </div>
              </div>
            </>)}
          </div>
        )}

        {/* ═══ TEAM TAB (#21-30) ═══ */}
        {tab === 'team' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Collaboration & Team</h2>
            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Collaborators (#21-22)</label><button className={styles.ghostBtn} onClick={() => setShowCollabForm(!showCollabForm)}>+ Invite</button></div>
              {showCollabForm && (
                <div className={styles.inlineForm}>
                  <input className={styles.input} placeholder="Name" id="collab_name" />
                  <input className={styles.input} placeholder="Email" id="collab_email" />
                  <select className={styles.select} id="collab_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select>
                  <button className={styles.primaryBtn} onClick={() => {
                    const n = (document.getElementById('collab_name') as HTMLInputElement).value
                    const e = (document.getElementById('collab_email') as HTMLInputElement).value
                    const r = (document.getElementById('collab_role') as HTMLSelectElement).value
                    if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: e, role: r as any }]); setShowCollabForm(false) }
                  }}>Add</button>
                </div>
              )}
              <div className={styles.teamGrid}>{collaborators.map(c => (
                <div key={c.id} className={styles.teamCard}>
                  <span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span>
                  <button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button>
                </div>
              ))}</div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Comments & Discussion (#23-24)</label>
              <div className={styles.commentList}>{projectComments.map(c => (
                <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>
              ))}</div>
              <div className={styles.inlineForm}>
                <input className={styles.input} placeholder="Add comment..." id="pc_input" />
                <button className={styles.ghostBtn} onClick={() => {
                  const text = (document.getElementById('pc_input') as HTMLInputElement).value
                  if (text && selectedId) { setPComments(prev => [{ id: uid(), projectId: selectedId, taskId: '', author: 'You', text, date: now() }, ...prev]); (document.getElementById('pc_input') as HTMLInputElement).value = '' }
                }}>Post</button>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>File Attachments (#25-26)</label>
              <button className={styles.ghostBtn} onClick={() => {
                if (selectedId) { setFiles(prev => [...prev, { id: uid(), projectId: selectedId, name: `Document-${Date.now()}.pdf`, type: 'pdf', size: Math.floor(Math.random() * 5000000), createdAt: now() }]); addToast('File attached', 'success') }
              }}>+ Attach File</button>
              <div className={styles.fileList}>{projectFiles.map(f => (
                <div key={f.id} className={styles.fileItem}>
                  <span className={styles.fontName}>{f.name}</span><span className={styles.helperText}>{(f.size / 1048576).toFixed(1)} MB</span>
                  <button className={styles.deleteBtn} onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}>×</button>
                </div>
              ))}</div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Activity Feed (#29)</label>
              <div className={styles.activityFeed}>
                {projectTasks.slice(0, 5).map(t => (
                  <div key={t.id} className={styles.activityItem}>
                    <span className={styles.helperText}>{fmtDate(t.createdAt)}</span>
                    <span>{t.done ? 'Completed' : 'Created'}: {t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CREATIVE TAB (#31-40) ═══ */}
        {tab === 'creative' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Creative Support</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Design Assets</div><div className={styles.kpiValue}>{projectFiles.filter(f => f.type === 'image' || f.type === 'design').length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Media Files</div><div className={styles.kpiValue}>{projectFiles.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Best Practices</div><div className={styles.kpiValue}>{projectNotes.filter(n => n.projectId === selectedId).length}</div></div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>AI Advisory Panel (#36)</label>
              <div className={styles.aiBox}>
                <pre className={styles.aiOutput}>{selected ? `Project Analysis: ${selected.name}
${'─'.repeat(40)}
• Type: ${selected.type}
• Status: ${selected.status}
• Tasks: ${projectTasks.length} (${projectTasks.filter(t => t.done).length} done)
• Progress: ${projectProgress}%
• Team: ${collaborators.length} collaborators
• ${projectProgress < 30 ? 'Recommendation: Break project into smaller milestones.' : projectProgress < 70 ? 'Good progress. Keep momentum.' : 'Near completion! Review quality before launch.'}
• Risk: ${projectTasks.filter(t => t.priority === 'Urgent' && !t.done).length > 0 ? 'Urgent tasks pending — address immediately.' : 'No critical blockers.'}` : 'Select a project to see AI analysis.'}</pre>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Best Practices (#37)</label>
              <div className={styles.practiceList}>
                {['Define clear success criteria before starting', 'Break work into 2-week sprints', 'Review and iterate weekly', 'Document decisions and rationale', 'Celebrate milestones'].map((tip, i) => (
                  <div key={i} className={styles.practiceItem}><span className={styles.practiceNum}>{i + 1}</span>{tip}</div>
                ))}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Cross-Project References (#38)</label>
              <div className={styles.projectGrid}>
                {projects.filter(p => p.id !== selectedId).slice(0, 4).map(p => (
                  <div key={p.id} className={styles.projectCard} onClick={() => { setSelectedId(p.id); setTab('details') }}>
                    <span className={styles.cardTitle}>{p.name}</span><span className={styles.tag}>{p.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS TAB (#41-50) ═══ */}
        {tab === 'analytics' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>AI & Analytics</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Projects</div><div className={styles.kpiValue}>{projects.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Tasks</div><div className={styles.kpiValue}>{tasks.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Completion Rate</div><div className={styles.kpiValue}>{tasks.length ? Math.round(tasks.filter(t => t.done).length / tasks.length * 100) : 0}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Team Size</div><div className={styles.kpiValue}>{collaborators.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Milestones Hit</div><div className={styles.kpiValue}>{milestones.filter(m => m.done).length}/{milestones.length}</div></div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Progress Prediction (#41)</label>
              <div className={styles.aiBox}>
                <pre className={styles.aiOutput}>{`Project Forecast:
${projects.filter(p => p.status === 'active').map(p => {
  const pT = tasks.filter(t => t.projectId === p.id)
  const prog = pT.length ? Math.round(pT.filter(t => t.done).length / pT.length * 100) : 0
  const urgentCount = pT.filter(t => t.priority === 'Urgent' && !t.done).length
  return `• ${p.name}: ${prog}% complete${urgentCount > 0 ? ` (${urgentCount} urgent)` : ''} — ${prog > 80 ? 'On track for completion' : prog > 40 ? 'Steady progress' : 'Needs attention'}`
}).join('\n') || '• No active projects'}`}</pre>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Bottleneck Detection (#48)</label>
              <div className={styles.alertList}>
                {tasks.filter(t => !t.done && t.priority === 'Urgent').map(t => (
                  <div key={t.id} className={styles.alertItem}><span className={styles.alertIcon}>!</span><span>{t.text}</span><span className={styles.helperText}>Urgent — {t.assignee || 'Unassigned'}</span></div>
                ))}
                {tasks.filter(t => !t.done && t.priority === 'Urgent').length === 0 && <p className={styles.helperText}>No bottlenecks detected.</p>}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Resource Allocation (#44)</label>
              <div className={styles.teamGrid}>
                {collaborators.map(c => {
                  const assigned = tasks.filter(t => t.assignee === c.name).length
                  return <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.helperText}>{assigned} tasks assigned</span></div>
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TRACKING TAB (#51-60) ═══ */}
        {tab === 'tracking' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Project Tracking</h2>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Multi-Project Overview (#56)</label>
              <div className={styles.projectGrid}>
                {projects.map(p => {
                  const pT = tasks.filter(t => t.projectId === p.id)
                  const prog = pT.length ? Math.round(pT.filter(t => t.done).length / pT.length * 100) : 0
                  return (
                    <div key={p.id} className={styles.projectCard} onClick={() => { setSelectedId(p.id); setTab('details') }}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{p.name}</span>
                        <button className={styles.favBtn} onClick={e => { e.stopPropagation(); toggleFavorite(p.id) }}>{favorites.has(p.id) ? '★' : '☆'}</button>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span>
                      <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${prog}%` }} /></div><span className={styles.meterLabel}>{prog}%</span></div>
                      <span className={styles.helperText}>{pT.length} tasks · {pT.filter(t => t.done).length} done</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Recently Edited (#54)</label>
              <div className={styles.projectGrid}>
                {[...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4).map(p => (
                  <div key={p.id} className={styles.projectCard} onClick={() => { setSelectedId(p.id); setTab('details') }}>
                    <span className={styles.cardTitle}>{p.name}</span><span className={styles.helperText}>{fmtDate(p.createdAt)}</span>
                  </div>
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
                const summary = selected
                  ? `Project: ${selected.name}\nType: ${selected.type}\nStatus: ${selected.status}\nTasks: ${projectTasks.length}\nProgress: ${projectProgress}%\nMilestones: ${projectMilestones.length}\nNotes: ${projectNotes.filter(n => n.projectId === selectedId).length}\n\nGenerated: ${new Date().toLocaleDateString()}`
                  : 'No project selected'
                const blob = new Blob([summary], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `project-summary-${Date.now()}.txt`; a.click()
                addToast('Summary exported', 'success')
              }}>Export Summary (#61)</button>
              <button className={styles.exportBtn} onClick={() => {
                const taskData = projectTasks.map(t => `${t.done ? '✓' : '○'} ${t.text} [${t.priority}] ${t.assignee || 'unassigned'} ${t.deadline || ''}`).join('\n')
                const blob = new Blob([taskData || 'No tasks'], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `tasks-${Date.now()}.txt`; a.click()
                addToast('Tasks exported', 'success')
              }}>Export Tasks (#62)</button>
              <button className={styles.exportBtn} onClick={() => {
                if (selected) { navigator.clipboard.writeText(`${window.location.origin}/project/${selected.id}`); addToast('Link copied', 'success') }
              }}>Copy Project Link (#64)</button>
              <button className={styles.exportBtn} onClick={() => {
                if (selected) {
                  const clone: Project = { ...selected, id: uid(), name: `${selected.name} (Clone)`, createdAt: now(), status: 'idea' }
                  updateDashboard({ projects: [clone, ...projects] })
                  addToast('Project cloned', 'success')
                }
              }}>Clone Project (#67)</button>
            </div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Quick Snapshot (#70)</label>
              {selected ? (
                <div className={styles.snapshot}>
                  <div className={styles.kpiRow}>
                    <div className={styles.kpiCard}><div className={styles.kpiLabel}>Project</div><div className={styles.kpiValue}>{selected.name}</div></div>
                    <div className={styles.kpiCard}><div className={styles.kpiLabel}>Progress</div><div className={styles.kpiValue}>{projectProgress}%</div></div>
                    <div className={styles.kpiCard}><div className={styles.kpiLabel}>Tasks Done</div><div className={styles.kpiValue}>{projectTasks.filter(t => t.done).length}/{projectTasks.length}</div></div>
                  </div>
                </div>
              ) : <p className={styles.helperText}>Select a project for snapshot.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
