import { useState, useEffect } from 'react'
import styles from './Notes.module.css'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  linkedNotes: string[]
  context: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  viewCount: number
}

const STORAGE_KEY = 'wcg-notes'

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function loadNotes(): Note[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

function createEmptyNote(): Note {
  return {
    id: generateId(),
    title: '',
    content: '',
    tags: [],
    linkedNotes: [],
    context: '',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
  }
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [editingNote, setEditingNote] = useState(false)
  const [showNewNote, setShowNewNote] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load notes on mount
  useEffect(() => {
    const loaded = loadNotes()
    setNotes(loaded)
  }, [])

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleCreateNote = () => {
    const newNote = createEmptyNote()
    setSelectedNote(newNote)
    setEditingNote(true)
    setShowNewNote(true)
  }

  const handleSelectNote = (note: Note) => {
    const updated = {
      ...note,
      viewCount: note.viewCount + 1,
      updatedAt: new Date().toISOString(),
    }
    setSelectedNote(updated)
    setEditingNote(false)
  }

  const handleSaveNote = () => {
    if (!selectedNote) return

    if (!selectedNote.title.trim() && !selectedNote.content.trim()) {
      alert('Note must have a title or content')
      return
    }

    const isDuplicate = notes.some((n) => n.id === selectedNote.id)

    const updated = {
      ...selectedNote,
      updatedAt: new Date().toISOString(),
    }

    let newNotes: Note[]
    if (isDuplicate) {
      newNotes = notes.map((n) => (n.id === updated.id ? updated : n))
    } else {
      newNotes = [updated, ...notes]
    }

    setNotes(newNotes)
    saveNotes(newNotes)
    setSelectedNote(updated)
    setEditingNote(false)
    setShowNewNote(false)
  }

  const handleDeleteNote = () => {
    if (!selectedNote) return

    if (!window.confirm('Delete this note?')) {
      return
    }

    const newNotes = notes.filter((n) => n.id !== selectedNote.id)
    setNotes(newNotes)
    saveNotes(newNotes)
    setSelectedNote(null)
    setEditingNote(false)
  }

  const handleAddTag = (tag: string) => {
    if (!selectedNote || !tag.trim()) return

    const cleaned = tag.trim().toLowerCase()
    if (selectedNote.tags.includes(cleaned)) return

    setSelectedNote({
      ...selectedNote,
      tags: [...selectedNote.tags, cleaned],
    })
  }

  const handleRemoveTag = (tag: string) => {
    if (!selectedNote) return

    setSelectedNote({
      ...selectedNote,
      tags: selectedNote.tags.filter((t) => t !== tag),
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Notes</h1>
          <p>{notes.length} notes</p>
        </div>
        <button onClick={handleCreateNote} className={styles.primaryBtn}>
          New Note
        </button>
      </div>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.layout}>
        <div className={styles.notesList}>
          {filteredNotes.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No notes yet. Create one to get started!</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                className={`${styles.noteCard} ${selectedNote?.id === note.id ? styles.noteCardActive : ''}`}
                onClick={() => handleSelectNote(note)}
              >
                <div className={styles.noteCardTitle}>{note.title || '(Untitled)'}</div>
                <div className={styles.noteCardContent}>
                  {note.content.slice(0, 100)}
                  {note.content.length > 100 ? '...' : ''}
                </div>
                {note.tags.length > 0 && (
                  <div className={styles.noteCardTags}>
                    {note.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className={styles.noteCardTag}>
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className={styles.noteCardTag}>+{note.tags.length - 2}</span>
                    )}
                  </div>
                )}
                <div className={styles.noteCardTime}>
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>

        {selectedNote && (
          <div className={styles.noteEditor}>
            {editingNote ? (
              <>
                <div className={styles.editorHeader}>
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) =>
                      setSelectedNote({
                        ...selectedNote,
                        title: e.target.value,
                      })
                    }
                    className={styles.editorTitle}
                    placeholder="Note title"
                  />
                  <div className={styles.editorActions}>
                    <button onClick={handleSaveNote} className={styles.primaryBtn}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingNote(false)
                        if (showNewNote) {
                          setSelectedNote(null)
                          setShowNewNote(false)
                        }
                      }}
                      className={styles.secondaryBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <textarea
                  value={selectedNote.content}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      content: e.target.value,
                    })
                  }
                  className={styles.editorTextarea}
                  placeholder="Write your note..."
                />

                <div className={styles.editorMeta}>
                  <div className={styles.metaSection}>
                    <label className={styles.label}>Priority</label>
                    <select
                      value={selectedNote.priority}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          priority: e.target.value as 'low' | 'medium' | 'high',
                        })
                      }
                      className={styles.select}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className={styles.metaSection}>
                    <label className={styles.label}>Context</label>
                    <input
                      type="text"
                      value={selectedNote.context}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          context: e.target.value,
                        })
                      }
                      className={styles.input}
                      placeholder="e.g., Project X, Brand Y"
                    />
                  </div>

                  <div className={styles.metaSection}>
                    <label className={styles.label}>Tags</label>
                    <div className={styles.tagInput}>
                      {selectedNote.tags.map((tag) => (
                        <button
                          key={tag}
                          className={styles.tag}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </button>
                      ))}
                      <input
                        type="text"
                        placeholder="Add tag and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.currentTarget
                            handleAddTag(input.value)
                            input.value = ''
                          }
                        }}
                        className={styles.tagInputField}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.viewerHeader}>
                  <h2 className={styles.viewerTitle}>{selectedNote.title || '(Untitled)'}</h2>
                  <div className={styles.viewerActions}>
                    <button
                      onClick={() => setEditingNote(true)}
                      className={styles.primaryBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteNote}
                      className={styles.dangerBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className={styles.viewerContent}>
                  <div className={styles.viewerBody}>{selectedNote.content}</div>

                  {selectedNote.context && (
                    <p className={styles.viewerMeta}>
                      <strong>Context:</strong> {selectedNote.context}
                    </p>
                  )}

                  {selectedNote.priority !== 'medium' && (
                    <p className={styles.viewerMeta}>
                      <strong>Priority:</strong> {selectedNote.priority}
                    </p>
                  )}

                  {selectedNote.tags.length > 0 && (
                    <div className={styles.viewerTags}>
                      {selectedNote.tags.map((tag) => (
                        <span key={tag} className={styles.viewerTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className={styles.viewerTime}>
                    Created {new Date(selectedNote.createdAt).toLocaleString()}{' '}
                    · Updated {new Date(selectedNote.updatedAt).toLocaleString()}{' '}
                    · Viewed {selectedNote.viewCount} times
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
