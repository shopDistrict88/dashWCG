import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './CollaborationHub.module.css'

interface QuickCapture {
  id: string
  content: string
  type: 'thought' | 'todo' | 'idea' | 'reference' | 'question'
  timestamp: string
  processed: boolean
}

interface SmartTag {
  id: string
  tag: string
  category: string
  usage: number
  relatedTags: string[]
}

interface NoteLink {
  id: string
  fromNoteId: string
  toNoteId: string
  relationship: 'supports' | 'contradicts' | 'extends' | 'references'
  strength: number
}

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  links: string[]
  created: string
  updated: string
  template: string
}

interface NoteTemplate {
  id: string
  name: string
  structure: string[]
  prompts: string[]
  usage: number
}

interface VoiceNote {
  id: string
  audioUrl: string
  transcript: string
  duration: number
  tags: string[]
  transcribed: boolean
}

interface NoteVersion {
  id: string
  noteId: string
  content: string
  timestamp: string
  changes: string
}

interface CollaborationNote {
  id: string
  noteId: string
  collaborators: string[]
  permissions: {user: string, role: 'view' | 'edit' | 'admin'}[]
  lastEdited: string
}

interface NoteAnalytics {
  id: string
  noteId: string
  views: number
  edits: number
  shares: number
  avgReadTime: number
}

interface NoteExport {
  id: string
  format: 'pdf' | 'markdown' | 'docx' | 'html'
  noteIds: string[]
  date: string
  fileSize: number
}

interface DailyJournal {
  id: string
  date: string
  mood: number
  wins: string[]
  challenges: string[]
  learnings: string[]
  tomorrow: string[]
}

interface MeetingNote {
  id: string
  title: string
  date: string
  attendees: string[]
  agenda: string[]
  notes: string
  actionItems: {task: string, owner: string, deadline: string}[]
}

interface IdeaCluster {
  id: string
  theme: string
  ideas: string[]
  connections: number
  potential: number
}

interface NoteReminder {
  id: string
  noteId: string
  date: string
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  message: string
  active: boolean
}

interface NoteArchive {
  id: string
  noteId: string
  archiveDate: string
  reason: string
  retentionPeriod: number
}

export function CollaborationHub() {
  const { addToast } = useApp()
  
  const [captures, setCaptures] = useState<QuickCapture[]>([])
  const [tags, setTags] = useState<SmartTag[]>([])
  const [links, setLinks] = useState<NoteLink[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [templates, setTemplates] = useState<NoteTemplate[]>([])
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [versions, setVersions] = useState<NoteVersion[]>([])
  const [collabNotes, setCollabNotes] = useState<CollaborationNote[]>([])
  const [analytics, setAnalytics] = useState<NoteAnalytics[]>([])
  const [exports, setExports] = useState<NoteExport[]>([])
  const [journals, setJournals] = useState<DailyJournal[]>([])
  const [meetings, setMeetings] = useState<MeetingNote[]>([])
  const [clusters, setClusters] = useState<IdeaCluster[]>([])
  const [reminders, setReminders] = useState<NoteReminder[]>([])
  const [archives, setArchives] = useState<NoteArchive[]>([])

  const [activeSection, setActiveSection] = useState('capture')

  useEffect(() => {
    const keys = ['captures', 'tags', 'links', 'notes', 'templates', 'voiceNotes', 'versions', 'collabNotes', 'analytics', 'exports', 'journals', 'meetings', 'clusters', 'reminders', 'archives']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`thoughtsystem_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'captures': setCaptures(data); break
          case 'tags': setTags(data); break
          case 'links': setLinks(data); break
          case 'notes': setNotes(data); break
          case 'templates': setTemplates(data); break
          case 'voiceNotes': setVoiceNotes(data); break
          case 'versions': setVersions(data); break
          case 'collabNotes': setCollabNotes(data); break
          case 'analytics': setAnalytics(data); break
          case 'exports': setExports(data); break
          case 'journals': setJournals(data); break
          case 'meetings': setMeetings(data); break
          case 'clusters': setClusters(data); break
          case 'reminders': setReminders(data); break
          case 'archives': setArchives(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('thoughtsystem_captures', JSON.stringify(captures)) }, [captures])
  useEffect(() => { localStorage.setItem('thoughtsystem_tags', JSON.stringify(tags)) }, [tags])
  useEffect(() => { localStorage.setItem('thoughtsystem_links', JSON.stringify(links)) }, [links])
  useEffect(() => { localStorage.setItem('thoughtsystem_notes', JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem('thoughtsystem_templates', JSON.stringify(templates)) }, [templates])
  useEffect(() => { localStorage.setItem('thoughtsystem_voiceNotes', JSON.stringify(voiceNotes)) }, [voiceNotes])
  useEffect(() => { localStorage.setItem('thoughtsystem_versions', JSON.stringify(versions)) }, [versions])
  useEffect(() => { localStorage.setItem('thoughtsystem_collabNotes', JSON.stringify(collabNotes)) }, [collabNotes])
  useEffect(() => { localStorage.setItem('thoughtsystem_analytics', JSON.stringify(analytics)) }, [analytics])
  useEffect(() => { localStorage.setItem('thoughtsystem_exports', JSON.stringify(exports)) }, [exports])
  useEffect(() => { localStorage.setItem('thoughtsystem_journals', JSON.stringify(journals)) }, [journals])
  useEffect(() => { localStorage.setItem('thoughtsystem_meetings', JSON.stringify(meetings)) }, [meetings])
  useEffect(() => { localStorage.setItem('thoughtsystem_clusters', JSON.stringify(clusters)) }, [clusters])
  useEffect(() => { localStorage.setItem('thoughtsystem_reminders', JSON.stringify(reminders)) }, [reminders])
  useEffect(() => { localStorage.setItem('thoughtsystem_archives', JSON.stringify(archives)) }, [archives])

  // AI Functions
  const calculateTagRelevance = (usage: number, relatedCount: number): number => {
    return Math.min(100, (usage * 5) + (relatedCount * 10))
  }

  const assessLinkStrength = (relationship: string, context: string): number => {
    let base = 50
    if (relationship === 'supports') base += 20
    if (relationship === 'extends') base += 15
    if (context.length > 100) base += 15
    return Math.min(100, base)
  }

  const calculateNoteQuality = (wordCount: number, linkCount: number, tagCount: number): number => {
    let quality = 0
    if (wordCount >= 100) quality += 30
    if (wordCount >= 500) quality += 20
    quality += Math.min(25, linkCount * 5)
    quality += Math.min(25, tagCount * 5)
    return quality
  }

  const suggestTags = (content: string, existingTags: SmartTag[]): string[] => {
    const suggestions: string[] = []
    existingTags.forEach(tag => {
      if (content.toLowerCase().includes(tag.tag.toLowerCase())) {
        suggestions.push(tag.tag)
      }
    })
    return suggestions.slice(0, 5)
  }

  const calculateKnowledgeGraph = (noteCount: number, linkCount: number): number => {
    if (noteCount === 0) return 0
    const density = (linkCount / noteCount) * 100
    return Math.min(100, density)
  }

  const assessJournalConsistency = (journals: DailyJournal[], days: number): number => {
    const recentJournals = journals.filter(j => {
      const date = new Date(j.date)
      const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= days
    })
    return Math.round((recentJournals.length / days) * 100)
  }

  const calculateMeetingEffectiveness = (actionItems: number, attendees: number): number => {
    if (attendees === 0) return 0
    const actionPerPerson = actionItems / attendees
    return Math.min(100, actionPerPerson * 50)
  }

  const identifyClusterPotential = (ideasCount: number, connections: number): number => {
    return Math.round((ideasCount * 10) + (connections * 5))
  }

  const calculateRetentionValue = (views: number, edits: number, shares: number): number => {
    return (views * 1) + (edits * 10) + (shares * 20)
  }

  const prioritizeCapture = (type: string, age: number): 'urgent' | 'high' | 'medium' | 'low' => {
    if (type === 'todo' && age > 1) return 'urgent'
    if (type === 'idea' && age > 3) return 'high'
    if (age > 7) return 'medium'
    return 'low'
  }

  // CRUD Functions
  const addCapture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newCapture: QuickCapture = {
      id: Date.now().toString(),
      content: formData.get('content') as string,
      type: formData.get('type') as QuickCapture['type'],
      timestamp: new Date().toISOString(),
      processed: false
    }
    
    setCaptures([newCapture, ...captures])
    addToast('Quick capture saved', 'success')
    e.currentTarget.reset()
  }

  const addNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const content = formData.get('content') as string
    const tagsInput = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t)
    const wordCount = content.split(/\s+/).length
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      content,
      tags: tagsInput,
      links: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      template: ''
    }
    
    setNotes([...notes, newNote])
    
    // Update tag usage
    tagsInput.forEach(tagName => {
      const existing = tags.find(t => t.tag === tagName)
      if (existing) {
        setTags(tags.map(t => t.tag === tagName ? {...t, usage: t.usage + 1} : t))
      } else {
        setTags([...tags, {
          id: Date.now().toString(),
          tag: tagName,
          category: 'general',
          usage: 1,
          relatedTags: []
        }])
      }
    })
    
    const quality = calculateNoteQuality(wordCount, 0, tagsInput.length)
    addToast(`Note created - Quality score: ${quality}`, 'success')
    e.currentTarget.reset()
  }

  const addJournal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newJournal: DailyJournal = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      mood: parseInt(formData.get('mood') as string),
      wins: (formData.get('wins') as string).split('\n').filter(w => w.trim()),
      challenges: (formData.get('challenges') as string).split('\n').filter(c => c.trim()),
      learnings: (formData.get('learnings') as string).split('\n').filter(l => l.trim()),
      tomorrow: (formData.get('tomorrow') as string).split('\n').filter(t => t.trim())
    }
    
    setJournals([...journals, newJournal])
    addToast('Journal entry saved', 'success')
    e.currentTarget.reset()
  }

  const unprocessedCaptures = captures.filter(c => !c.processed)
  const graphDensity = calculateKnowledgeGraph(notes.length, links.length)
  const consistency = assessJournalConsistency(journals, 30)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Thought System</h1>
          <p className={styles.subtitle}>Capture, connect, and develop ideas</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{notes.length}</div>
            <div className={styles.statLabel}>Notes</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{unprocessedCaptures.length}</div>
            <div className={styles.statLabel}>Inbox</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{graphDensity}%</div>
            <div className={styles.statLabel}>Graph Density</div>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'capture' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('capture')}>Quick Capture</button>
          <button className={`${styles.navItem} ${activeSection === 'tags' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('tags')}>Smart Tagging</button>
          <button className={`${styles.navItem} ${activeSection === 'links' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('links')}>Note Linking</button>
          <button className={`${styles.navItem} ${activeSection === 'notes' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('notes')}>All Notes</button>
          <button className={`${styles.navItem} ${activeSection === 'templates' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('templates')}>Note Templates</button>
          <button className={`${styles.navItem} ${activeSection === 'voice' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('voice')}>Voice Notes</button>
          <button className={`${styles.navItem} ${activeSection === 'versions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('versions')}>Note Versioning</button>
          <button className={`${styles.navItem} ${activeSection === 'collab' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('collab')}>Collaboration Notes</button>
          <button className={`${styles.navItem} ${activeSection === 'analytics' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('analytics')}>Note Analytics</button>
          <button className={`${styles.navItem} ${activeSection === 'export' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('export')}>Note Export</button>
          <button className={`${styles.navItem} ${activeSection === 'journal' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('journal')}>Daily Journal</button>
          <button className={`${styles.navItem} ${activeSection === 'meetings' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('meetings')}>Meeting Notes</button>
          <button className={`${styles.navItem} ${activeSection === 'clusters' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('clusters')}>Idea Clustering</button>
          <button className={`${styles.navItem} ${activeSection === 'reminders' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('reminders')}>Note Reminders</button>
          <button className={`${styles.navItem} ${activeSection === 'archive' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('archive')}>Note Archive</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'capture' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Quick Capture</h2>
                <p>Instantly save thoughts before they slip away</p>
              </div>

              <form onSubmit={addCapture} className={styles.captureForm}>
                <textarea name="content" placeholder="What's on your mind?" required className={styles.captureInput} rows={3} autoFocus></textarea>
                <div className={styles.captureActions}>
                  <select name="type" required className={styles.typeSelect}>
                    <option value="thought">Thought</option>
                    <option value="todo">To-Do</option>
                    <option value="idea">Idea</option>
                    <option value="reference">Reference</option>
                    <option value="question">Question</option>
                  </select>
                  <button type="submit" className={styles.captureBtn}>Capture</button>
                </div>
              </form>

              <div className={styles.capturesList}>
                <h3>Inbox ({unprocessedCaptures.length})</h3>
                {unprocessedCaptures.map(capture => {
                  const daysOld = Math.floor((Date.now() - new Date(capture.timestamp).getTime()) / (1000 * 60 * 60 * 24))
                  const priority = prioritizeCapture(capture.type, daysOld)
                  
                  return (
                    <div key={capture.id} className={`${styles.captureCard} ${styles[priority]}`}>
                      <div className={styles.captureHeader}>
                        <span className={styles.typeBadge}>{capture.type}</span>
                        <span className={styles.timestamp}>
                          {daysOld === 0 ? 'Today' : `${daysOld}d ago`}
                        </span>
                        {priority === 'urgent' && (
                          <span className={styles.urgentBadge}>URGENT</span>
                        )}
                      </div>
                      <p className={styles.captureContent}>{capture.content}</p>
                      <button 
                        className={styles.processBtn}
                        onClick={() => setCaptures(captures.map(c => 
                          c.id === capture.id ? {...c, processed: true} : c
                        ))}
                      >
                        Process
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeSection === 'notes' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>All Notes</h2>
                <p>Your knowledge base</p>
              </div>

              <form onSubmit={addNote} className={styles.form}>
                <input name="title" placeholder="Note title" required className={styles.input} />
                <textarea name="content" placeholder="Note content" required className={styles.textarea} rows={5}></textarea>
                <input name="tags" placeholder="Tags (comma-separated)" className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Create Note</button>
              </form>

              <div className={styles.notesGrid}>
                {notes.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()).map(note => {
                  const wordCount = note.content.split(/\s+/).length
                  const quality = calculateNoteQuality(wordCount, note.links.length, note.tags.length)
                  
                  return (
                    <div key={note.id} className={styles.noteCard}>
                      <h3>{note.title}</h3>
                      <div className={styles.qualityBadge}>Quality: {quality}</div>
                      <p className={styles.notePreview}>
                        {note.content.substring(0, 150)}
                        {note.content.length > 150 && '...'}
                      </p>
                      <div className={styles.noteMeta}>
                        <span className={styles.wordCount}>{wordCount} words</span>
                        <span className={styles.linkCount}>{note.links.length} links</span>
                        <span className={styles.updated}>
                          {new Date(note.updated).toLocaleDateString()}
                        </span>
                      </div>
                      {note.tags.length > 0 && (
                        <div className={styles.noteTags}>
                          {note.tags.map((tag, i) => (
                            <span key={i} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeSection === 'journal' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Daily Journal</h2>
                <p>Reflect and track your journey</p>
              </div>

              <div className={styles.consistencyBadge}>
                <strong>30-Day Consistency:</strong> {consistency}%
              </div>

              <form onSubmit={addJournal} className={styles.journalForm}>
                <input name="date" type="date" required className={styles.input} defaultValue={new Date().toISOString().split('T')[0]} />
                <div className={styles.moodSelector}>
                  <label>Mood (1-10):</label>
                  <input name="mood" type="range" min="1" max="10" defaultValue="5" className={styles.moodSlider} />
                </div>
                <div className={styles.journalSection}>
                  <label>Today's Wins</label>
                  <textarea name="wins" placeholder="What went well?" className={styles.textarea} rows={3}></textarea>
                </div>
                <div className={styles.journalSection}>
                  <label>Challenges</label>
                  <textarea name="challenges" placeholder="What was difficult?" className={styles.textarea} rows={3}></textarea>
                </div>
                <div className={styles.journalSection}>
                  <label>Learnings</label>
                  <textarea name="learnings" placeholder="What did you learn?" className={styles.textarea} rows={3}></textarea>
                </div>
                <div className={styles.journalSection}>
                  <label>Tomorrow's Focus</label>
                  <textarea name="tomorrow" placeholder="What will you tackle?" className={styles.textarea} rows={3}></textarea>
                </div>
                <button type="submit" className={styles.primaryBtn}>Save Journal Entry</button>
              </form>

              <div className={styles.journalsGrid}>
                {journals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(journal => (
                  <div key={journal.id} className={styles.journalCard}>
                    <div className={styles.journalHeader}>
                      <h3>{new Date(journal.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                      <div className={styles.mood}>
                        <span className={styles.moodLabel}>Mood:</span>
                        <span className={styles.moodValue}>{journal.mood}/10</span>
                      </div>
                    </div>
                    {journal.wins.length > 0 && (
                      <div className={styles.journalItem}>
                        <strong>Wins:</strong>
                        <ul>
                          {journal.wins.map((win, i) => (
                            <li key={i}>{win}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {journal.challenges.length > 0 && (
                      <div className={styles.journalItem}>
                        <strong>Challenges:</strong>
                        <ul>
                          {journal.challenges.map((challenge, i) => (
                            <li key={i}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {journal.learnings.length > 0 && (
                      <div className={styles.journalItem}>
                        <strong>Learnings:</strong>
                        <ul>
                          {journal.learnings.map((learning, i) => (
                            <li key={i}>{learning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
