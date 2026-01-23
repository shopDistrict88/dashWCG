import { useState } from 'react'
import styles from './Placeholder.module.css'

// Advanced Notes System
export function Notes() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'archive'>('all')
  const [moodFilter, setMoodFilter] = useState<string>('all')

  const notes = [
    { 
      id: '1', 
      title: 'Product direction thoughts', 
      content: 'Exploring modular approach to next collection...',
      tags: ['product', 'strategy', 'fashion'],
      mood: 'focused',
      status: 'draft',
      linkedTo: 'Fashion Lab',
      versions: 3,
      date: '2026-01-22',
      visibility: 'private'
    },
    { 
      id: '2', 
      title: 'Brand positioning notes', 
      content: 'Rethinking how we communicate sustainability...',
      tags: ['brand', 'messaging', 'values'],
      mood: 'reflective',
      status: 'active',
      linkedTo: 'Brand Builder',
      versions: 1,
      date: '2026-01-20',
      visibility: 'team'
    },
    { 
      id: '3', 
      title: 'Campaign concept', 
      content: 'Quiet luxury meets technical innovation...',
      tags: ['campaign', 'content', 'visual'],
      mood: 'inspired',
      status: 'draft',
      linkedTo: 'Content Studio',
      versions: 2,
      date: '2026-01-18',
      visibility: 'private'
    },
    { 
      id: '4', 
      title: 'Manufacturing learnings', 
      content: 'Key insights from factory visit...',
      tags: ['manufacturing', 'process', 'quality'],
      mood: 'analytical',
      status: 'archive',
      linkedTo: 'Manufacturing Hub',
      versions: 1,
      date: '2025-12-15',
      visibility: 'team'
    },
  ]

  const moods = ['all', 'focused', 'reflective', 'inspired', 'analytical', 'exploratory', 'decisive']

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesTab = activeTab === 'all' ? note.status !== 'archive' :
                       activeTab === 'drafts' ? note.status === 'draft' :
                       note.status === 'archive'
    
    const matchesMood = moodFilter === 'all' || note.mood === moodFilter

    return matchesSearch && matchesTab && matchesMood
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Notes</h1>
          <p className={styles.subtitle}>Advanced note-taking with context, versioning & AI summaries</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Create new note')}>
          New Note
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search notes, tags, content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterRow}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Notes
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'drafts' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'archive' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('archive')}
          >
            Archive
          </button>
        </div>

        <div className={styles.moodFilter}>
          <label className={styles.filterLabel}>Mood:</label>
          <select 
            value={moodFilter} 
            onChange={(e) => setMoodFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {moods.map(mood => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredNotes.map(note => (
          <div key={note.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.category}>{note.mood}</span>
                <h3>{note.title}</h3>
                <p className={styles.meta}>{new Date(note.date).toLocaleDateString()}</p>
              </div>
              <span className={`${styles.badge} ${styles[note.visibility]}`}>
                {note.visibility}
              </span>
            </div>
            
            <p className={styles.description}>{note.content}</p>
            
            <div className={styles.tags}>
              {note.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.metrics}>
              <div>
                <span className={styles.label}>Linked to</span>
                <span className={styles.value}>{note.linkedTo}</span>
              </div>
              <div>
                <span className={styles.label}>Versions</span>
                <span className={styles.value}>{note.versions}</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button className={styles.secondaryBtn} onClick={() => alert(`Edit ${note.title}`)}>
                Edit
              </button>
              <button className={styles.secondaryBtn} onClick={() => alert(`Convert ${note.title} to project`)}>
                → Project
              </button>
              <button className={styles.secondaryBtn} onClick={() => alert(`AI summary for ${note.title}`)}>
                AI Summary
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className={styles.emptyState}>
          <p>No notes found</p>
        </div>
      )}
    </div>
  )
}
