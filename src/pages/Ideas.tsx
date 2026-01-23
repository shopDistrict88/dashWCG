import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Note } from '../types'
import styles from './Ideas.module.css'

interface IdeaWithScore extends Note {
  score?: number
  potentialImpact?: 'high' | 'medium' | 'low'
  feasibility?: 'easy' | 'medium' | 'hard'
}

export function Ideas() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<'product' | 'content' | 'feature' | 'process' | 'other'>('product')
  const [potentialImpact, setPotentialImpact] = useState<'high' | 'medium' | 'low'>('medium')
  const [feasibility, setFeasibility] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score')

  const notes = dashboard.notes

  const calculateScore = (impact: 'high' | 'medium' | 'low', feasibility: 'easy' | 'medium' | 'hard'): number => {
    const impactScore: Record<string, number> = { high: 3, medium: 2, low: 1 }
    const feasibilityScore: Record<string, number> = { easy: 3, medium: 2, hard: 1 }
    return (impactScore[impact] * 30) + (feasibilityScore[feasibility] * 10)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      addToast('Please enter a title', 'error')
      return
    }

    const score = calculateScore(potentialImpact, feasibility)

    const newNote: IdeaWithScore = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      category,
      score,
      createdAt: new Date().toISOString(),
    }

    updateDashboard({
      notes: [newNote, ...notes],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'project',
          title: `New idea: ${title}`,
          timestamp: new Date().toISOString(),
          action: 'created',
        },
      ],
    })

    setTitle('')
    setContent('')
    setPotentialImpact('medium')
    setFeasibility('medium')
    addToast('Idea saved!', 'success')
  }

  const handleDeleteNote = (id: string) => {
    updateDashboard({
      notes: notes.filter((n) => n.id !== id),
    })
    addToast('Idea deleted', 'success')
  }

  const handleUpdateScore = (id: string, impact: 'high' | 'medium' | 'low', feasibility: 'easy' | 'medium' | 'hard') => {
    const score = calculateScore(impact, feasibility)
    updateDashboard({
      notes: notes.map((n) =>
        n.id === id
          ? {
              ...n,
              score,
              category: (n as IdeaWithScore).potentialImpact ? (n as IdeaWithScore).potentialImpact : n.category,
              ...((n as IdeaWithScore).potentialImpact !== impact && { potentialImpact: impact }),
              ...((n as IdeaWithScore).feasibility !== feasibility && { feasibility }),
            }
          : n
      ),
    })
  }

  let filteredNotes = notes
  if (filterCategory !== 'all') {
    filteredNotes = filteredNotes.filter((n) => n.category === filterCategory)
  }

  if (sortBy === 'score') {
    filteredNotes = [...filteredNotes].sort((a, b) => (b.score || 0) - (a.score || 0))
  } else {
    filteredNotes = [...filteredNotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const categoryStats = {
    product: notes.filter((n) => n.category === 'product').length,
    content: notes.filter((n) => n.category === 'content').length,
    feature: notes.filter((n) => n.category === 'feature').length,
    process: notes.filter((n) => n.category === 'process').length,
    other: notes.filter((n) => n.category === 'other').length,
  }

  const avgScore = notes.length > 0 ? Math.round(notes.reduce((sum, n) => sum + (n.score || 0), 0) / notes.length) : 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ideas & Inspiration</h1>
        <p className={styles.subtitle}>Capture, score, and organize your creative ideas</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Ideas</span>
          <span className={styles.statValue}>{notes.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Avg Score</span>
          <span className={styles.statValue}>{avgScore}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>High Impact</span>
          <span className={styles.statValue}>{notes.filter((n) => (n as IdeaWithScore).potentialImpact === 'high').length}</span>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>New Idea</h2>
          <form onSubmit={handleAddNote} className={styles.form}>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Idea title..."
                className={styles.titleInput}
              />
            </div>

            <div className={styles.formGroup}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className={styles.select}
              >
                <option value="product">Product</option>
                <option value="content">Content</option>
                <option value="feature">Feature</option>
                <option value="process">Process</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Potential Impact</label>
                <select
                  value={potentialImpact}
                  onChange={(e) => setPotentialImpact(e.target.value as typeof potentialImpact)}
                  className={styles.select}
                >
                  <option value="high">🔥 High</option>
                  <option value="medium">⚡ Medium</option>
                  <option value="low">❄️ Low</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Feasibility</label>
                <select
                  value={feasibility}
                  onChange={(e) => setFeasibility(e.target.value as typeof feasibility)}
                  className={styles.select}
                >
                  <option value="easy">✓ Easy</option>
                  <option value="medium">~ Medium</option>
                  <option value="hard">✗ Hard</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your idea, inspiration, or thoughts..."
                rows={8}
                className={styles.contentInput}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Save Idea
            </button>
          </form>
        </div>

        <div className={styles.ideasSection}>
          <div className={styles.controlsBar}>
            <div className={styles.filterControls}>
              <label className={styles.filterLabel}>Filter:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All ({notes.length})</option>
                <option value="product">Product ({categoryStats.product})</option>
                <option value="content">Content ({categoryStats.content})</option>
                <option value="feature">Feature ({categoryStats.feature})</option>
                <option value="process">Process ({categoryStats.process})</option>
                <option value="other">Other ({categoryStats.other})</option>
              </select>
            </div>

            <div className={styles.sortControls}>
              <label className={styles.filterLabel}>Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className={styles.filterSelect}
              >
                <option value="score">Highest Score</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Your Ideas</h2>
          {filteredNotes.length === 0 ? (
            <p className={styles.empty}>No ideas yet. Start capturing your inspiration!</p>
          ) : (
            <div className={styles.notesList}>
              {filteredNotes.map((note) => {
                const ideaNote = note as IdeaWithScore
                return (
                  <div key={note.id} className={styles.noteCard}>
                    <div className={styles.noteHeader}>
                      <div className={styles.noteTitleArea}>
                        <h3 className={styles.noteTitle}>{note.title}</h3>
                        {note.category && (
                          <span className={`${styles.categoryBadge} ${styles[note.category]}`}>
                            {note.category}
                          </span>
                        )}
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className={styles.scoreSection}>
                      <div className={styles.scoreDisplay}>
                        <span className={styles.scoreLabel}>Score</span>
                        <span className={`${styles.scoreValue} ${styles[`score${Math.floor((ideaNote.score || 0) / 20)}`]}`}>
                          {ideaNote.score || 0}
                        </span>
                      </div>

                      {ideaNote.potentialImpact && (
                        <div className={styles.scoreControl}>
                          <label className={styles.scoreLabel}>Impact:</label>
                          <select
                            value={ideaNote.potentialImpact}
                            onChange={(e) => handleUpdateScore(note.id, e.target.value as any, ideaNote.feasibility || 'medium')}
                            className={styles.smallSelect}
                          >
                            <option value="high">🔥 High</option>
                            <option value="medium">⚡ Medium</option>
                            <option value="low">❄️ Low</option>
                          </select>
                        </div>
                      )}

                      {ideaNote.feasibility && (
                        <div className={styles.scoreControl}>
                          <label className={styles.scoreLabel}>Feasibility:</label>
                          <select
                            value={ideaNote.feasibility}
                            onChange={(e) => handleUpdateScore(note.id, ideaNote.potentialImpact || 'medium', e.target.value as any)}
                            className={styles.smallSelect}
                          >
                            <option value="easy">✓ Easy</option>
                            <option value="medium">~ Medium</option>
                            <option value="hard">✗ Hard</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <p className={styles.noteDate}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                    {note.content && (
                      <p className={styles.noteContent}>{note.content}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
