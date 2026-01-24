import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Notes.module.css'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  linkedNotes: string[]
  context: string
  priority: 'low' | 'medium' | 'high'
  insightType: 'insight' | 'question' | 'assumption' | 'risk' | 'opportunity'
  thinkingStyle: 'strategic' | 'creative' | 'analytical' | 'reflective'
  isDecision: boolean
  decisionDate?: string
  decisionOutcome?: string
  versions: Array<{ content: string; date: string }>
  mentalModel?: string
  createdAt: string
  lastViewed: string
  viewCount: number
}

export function Notes() {
  const { addToast } = useApp()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'graph' | 'focus'>('list')
  const [filterStyle, setFilterStyle] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewNote, setShowNewNote] = useState(false)
  const [editingNote, setEditingNote] = useState(false)
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    tags: '',
    context: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    insightType: 'insight' as 'insight' | 'question' | 'assumption' | 'risk' | 'opportunity',
    thinkingStyle: 'strategic' as 'strategic' | 'creative' | 'analytical' | 'reflective',
    mentalModel: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('wcg-thoughts')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('wcg-thoughts', JSON.stringify(notes))
    }
  }, [notes])

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteForm.title,
      content: noteForm.content,
      tags: noteForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      linkedNotes: [],
      context: noteForm.context,
      priority: noteForm.priority,
      insightType: noteForm.insightType,
      thinkingStyle: noteForm.thinkingStyle,
      isDecision: false,
      versions: [{ content: noteForm.content, date: new Date().toISOString() }],
      mentalModel: noteForm.mentalModel,
      createdAt: new Date().toISOString(),
      lastViewed: new Date().toISOString(),
      viewCount: 0
    }
    setNotes([newNote, ...notes])
    setNoteForm({
      title: '',
      content: '',
      tags: '',
      context: '',
      priority: 'medium',
      insightType: 'insight',
      thinkingStyle: 'strategic',
      mentalModel: ''
    })
    setShowNewNote(false)
    addToast('Thought created', 'success')
  }

  const updateNote = () => {
    if (!selectedNote) return
    const updated = notes.map(n => {
      if (n.id === selectedNote.id) {
        return {
          ...n,
          title: noteForm.title,
          content: noteForm.content,
          tags: noteForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          context: noteForm.context,
          priority: noteForm.priority,
          insightType: noteForm.insightType,
          thinkingStyle: noteForm.thinkingStyle,
          mentalModel: noteForm.mentalModel,
          versions: [...n.versions, { content: noteForm.content, date: new Date().toISOString() }]
        }
      }
      return n
    })
    setNotes(updated)
    setEditingNote(false)
    setSelectedNote(null)
    addToast('Thought updated', 'success')
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
    setSelectedNote(null)
    addToast('Thought deleted', 'success')
  }

  const linkNotes = (noteId: string, linkedId: string) => {
    const updated = notes.map(n => {
      if (n.id === noteId && !n.linkedNotes.includes(linkedId)) {
        return { ...n, linkedNotes: [...n.linkedNotes, linkedId] }
      }
      if (n.id === linkedId && !n.linkedNotes.includes(noteId)) {
        return { ...n, linkedNotes: [...n.linkedNotes, noteId] }
      }
      return n
    })
    setNotes(updated)
    addToast('Thoughts linked', 'success')
  }

  const markAsDecision = (id: string) => {
    const updated = notes.map(n => {
      if (n.id === id) {
        return { 
          ...n, 
          isDecision: true, 
          decisionDate: new Date().toISOString()
        }
      }
      return n
    })
    setNotes(updated)
    addToast('Marked as decision', 'success')
  }

  const convertToProject = (note: Note) => {
    const project = {
      id: Date.now().toString(),
      name: note.title,
      description: note.content,
      status: 'planning',
      tasks: []
    }
    const projects = JSON.parse(localStorage.getItem('wcg-projects') || '[]')
    projects.push(project)
    localStorage.setItem('wcg-projects', JSON.stringify(projects))
    addToast('Converted to project', 'success')
  }

  const summarizeNote = (note: Note) => {
    const words = note.content.split(' ')
    const summary = words.slice(0, Math.min(30, words.length)).join(' ') + '...'
    addToast('Summary: ' + summary, 'info')
  }

  const viewNote = (note: Note) => {
    const updated = notes.map(n => {
      if (n.id === note.id) {
        return {
          ...n,
          lastViewed: new Date().toISOString(),
          viewCount: n.viewCount + 1
        }
      }
      return n
    })
    setNotes(updated)
    setSelectedNote(note)
  }

  const editNote = (note: Note) => {
    setSelectedNote(note)
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      context: note.context,
      priority: note.priority,
      insightType: note.insightType,
      thinkingStyle: note.thinkingStyle,
      mentalModel: note.mentalModel || ''
    })
    setEditingNote(true)
  }

  const getTimeSince = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const days = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStyle = filterStyle === 'all' || note.thinkingStyle === filterStyle
    const matchesPriority = filterPriority === 'all' || note.priority === filterPriority
    return matchesSearch && matchesStyle && matchesPriority
  })

  const getOldNotes = () => {
    const now = new Date()
    return notes.filter(n => {
      const daysSince = Math.floor((now.getTime() - new Date(n.lastViewed).getTime()) / (1000 * 60 * 60 * 24))
      return daysSince > 30
    }).slice(0, 3)
  }

  if (viewMode === 'focus' && selectedNote) {
    return (
      <div className={styles.focusMode}>
        <button onClick={() => setViewMode('list')} className={styles.exitFocus}>
          Exit Focus
        </button>
        <div className={styles.focusContent}>
          <input
            type="text"
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            className={styles.focusTitle}
            placeholder="Title"
          />
          <textarea
            value={noteForm.content}
            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            className={styles.focusTextarea}
            placeholder="Write your thoughts..."
          />
          <button onClick={updateNote} className={styles.focusSave}>
            Save
          </button>
        </div>
      </div>
    )
  }

  if (viewMode === 'graph') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Knowledge Graph</h1>
          <button onClick={() => setViewMode('list')} className={styles.backBtn}>
            Back to List
          </button>
        </div>
        <div className={styles.graph}>
          {notes.map(note => (
            <div key={note.id} className={styles.graphNode}>
              <div className={styles.nodeName}>{note.title}</div>
              <div className={styles.nodeConnections}>
                {note.linkedNotes.map(linkedId => {
                  const linked = notes.find(n => n.id === linkedId)
                  return linked ? (
                    <div key={linkedId} className={styles.connection}>
                      → {linked.title}
                    </div>
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Thought System</h1>
          <p>{notes.length} thoughts · {notes.filter(n => n.isDecision).length} decisions</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => setShowNewNote(true)} className={styles.primaryBtn}>
            New Thought
          </button>
          <button onClick={() => setViewMode('graph')} className={styles.secondaryBtn}>
            Graph View
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search thoughts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)} className={styles.select}>
          <option value="all">All Styles</option>
          <option value="strategic">Strategic</option>
          <option value="creative">Creative</option>
          <option value="analytical">Analytical</option>
          <option value="reflective">Reflective</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={styles.select}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {getOldNotes().length > 0 && (
        <div className={styles.resurfaced}>
          <h3>Resurfaced Thoughts</h3>
          <div className={styles.resurfacedList}>
            {getOldNotes().map(note => (
              <div key={note.id} className={styles.resurfacedItem} onClick={() => viewNote(note)}>
                <div className={styles.resurfacedTitle}>{note.title}</div>
                <div className={styles.resurfacedTime}>{getTimeSince(note.lastViewed)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.notesList}>
          {filteredNotes.map(note => (
            <div key={note.id} className={styles.noteCard} onClick={() => viewNote(note)}>
              <div className={styles.noteHeader}>
                <div className={styles.noteTitle}>{note.title}</div>
                <div className={`${styles.priority} ${styles[`priority${note.priority.charAt(0).toUpperCase() + note.priority.slice(1)}`]}`}>
                  {note.priority}
                </div>
              </div>
              <div className={styles.noteContent}>{note.content.slice(0, 120)}...</div>
              <div className={styles.noteMeta}>
                <span className={styles.badge}>{note.thinkingStyle}</span>
                <span className={styles.badge}>{note.insightType}</span>
                {note.isDecision && <span className={styles.badgeDecision}>Decision</span>}
                {note.context && <span className={styles.badgeContext}>{note.context}</span>}
              </div>
              <div className={styles.noteFooter}>
                <span>{getTimeSince(note.createdAt)}</span>
                <span>{note.versions.length} versions</span>
                <span>{note.linkedNotes.length} links</span>
              </div>
            </div>
          ))}
        </div>

        {selectedNote && !editingNote && (
          <div className={styles.noteDetail}>
            <div className={styles.detailHeader}>
              <h2>{selectedNote.title}</h2>
              <div className={styles.detailActions}>
                <button onClick={() => editNote(selectedNote)} className={styles.actionBtn}>Edit</button>
                <button onClick={() => { setViewMode('focus'); editNote(selectedNote) }} className={styles.actionBtn}>Focus</button>
                <button onClick={() => markAsDecision(selectedNote.id)} className={styles.actionBtn}>
                  {selectedNote.isDecision ? 'Decision' : 'Mark Decision'}
                </button>
                <button onClick={() => summarizeNote(selectedNote)} className={styles.actionBtn}>Summarize</button>
                <button onClick={() => convertToProject(selectedNote)} className={styles.actionBtn}>To Project</button>
                <button onClick={() => deleteNote(selectedNote.id)} className={styles.dangerBtn}>Delete</button>
              </div>
            </div>
            <div className={styles.detailContent}>{selectedNote.content}</div>
            <div className={styles.detailMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Priority:</span>
                <span className={styles.metaValue}>{selectedNote.priority}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Type:</span>
                <span className={styles.metaValue}>{selectedNote.insightType}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Style:</span>
                <span className={styles.metaValue}>{selectedNote.thinkingStyle}</span>
              </div>
              {selectedNote.context && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Context:</span>
                  <span className={styles.metaValue}>{selectedNote.context}</span>
                </div>
              )}
              {selectedNote.mentalModel && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Mental Model:</span>
                  <span className={styles.metaValue}>{selectedNote.mentalModel}</span>
                </div>
              )}
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Created:</span>
                <span className={styles.metaValue}>{getTimeSince(selectedNote.createdAt)}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Views:</span>
                <span className={styles.metaValue}>{selectedNote.viewCount}</span>
              </div>
            </div>
            {selectedNote.versions.length > 1 && (
              <div className={styles.versions}>
                <h3>Version History</h3>
                {selectedNote.versions.map((v, i) => (
                  <div key={i} className={styles.versionItem}>
                    <div className={styles.versionHeader}>Version {selectedNote.versions.length - i}</div>
                    <div className={styles.versionDate}>{new Date(v.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedNote.linkedNotes.length > 0 && (
              <div className={styles.linked}>
                <h3>Linked Thoughts</h3>
                {selectedNote.linkedNotes.map(linkedId => {
                  const linked = notes.find(n => n.id === linkedId)
                  return linked ? (
                    <div key={linkedId} className={styles.linkedItem} onClick={() => viewNote(linked)}>
                      {linked.title}
                    </div>
                  ) : null
                })}
              </div>
            )}
            <div className={styles.linkSection}>
              <h3>Link to Another Thought</h3>
              <select onChange={(e) => e.target.value && linkNotes(selectedNote.id, e.target.value)} className={styles.select}>
                <option value="">Select thought...</option>
                {notes.filter(n => n.id !== selectedNote.id && !selectedNote.linkedNotes.includes(n.id)).map(n => (
                  <option key={n.id} value={n.id}>{n.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {(showNewNote || editingNote) && (
          <div className={styles.noteDetail}>
            <h2>{editingNote ? 'Edit Thought' : 'New Thought'}</h2>
            <input
              type="text"
              placeholder="Title"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className={styles.input}
            />
            <textarea
              placeholder="Content"
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              className={styles.textarea}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={noteForm.tags}
              onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Context (project, brand, etc)"
              value={noteForm.context}
              onChange={(e) => setNoteForm({ ...noteForm, context: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Mental Model"
              value={noteForm.mentalModel}
              onChange={(e) => setNoteForm({ ...noteForm, mentalModel: e.target.value })}
              className={styles.input}
            />
            <div className={styles.formRow}>
              <select value={noteForm.priority} onChange={(e) => setNoteForm({ ...noteForm, priority: e.target.value as any })} className={styles.select}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select value={noteForm.insightType} onChange={(e) => setNoteForm({ ...noteForm, insightType: e.target.value as any })} className={styles.select}>
                <option value="insight">Insight</option>
                <option value="question">Question</option>
                <option value="assumption">Assumption</option>
                <option value="risk">Risk</option>
                <option value="opportunity">Opportunity</option>
              </select>
              <select value={noteForm.thinkingStyle} onChange={(e) => setNoteForm({ ...noteForm, thinkingStyle: e.target.value as any })} className={styles.select}>
                <option value="strategic">Strategic</option>
                <option value="creative">Creative</option>
                <option value="analytical">Analytical</option>
                <option value="reflective">Reflective</option>
              </select>
            </div>
            <div className={styles.formActions}>
              <button onClick={editingNote ? updateNote : createNote} className={styles.primaryBtn}>
                {editingNote ? 'Update' : 'Create'}
              </button>
              <button onClick={() => { setShowNewNote(false); setEditingNote(false); setSelectedNote(null) }} className={styles.secondaryBtn}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
