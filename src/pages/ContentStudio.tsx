import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { ContentPiece } from '../types'
import styles from './ContentStudio.module.css'

const CONTENT_TYPES = [
  'Blog Post',
  'Social Post',
  'Video Script',
  'Podcast Notes',
  'Newsletter',
  'Caption',
  'Story',
  'Reel',
]

const CONTENT_INTENTS = ['Awareness', 'Authority', 'Trust', 'Conversion', 'Community', 'Experiment']
const RISK_LEVELS = ['Safe', 'Experimental', 'High-risk']
const PERFORMANCE_TAGS = ['trending', 'evergreen', 'seasonal', 'viral']
const PLATFORMS = ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube', 'Email']

export function ContentStudio() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [tab, setTab] = useState<'create' | 'library' | 'hooks' | 'analysis' | 'experiments' | 'opportunities'>('create')
  
  // Create Content State
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [intent, setIntent] = useState<string>('')
  const [riskLevel, setRiskLevel] = useState<string>('Safe')
  const [hook, setHook] = useState('')
  const [captionVisualScore, setCaptionVisualScore] = useState(85)
  const [isEvergreen, setIsEvergreen] = useState(false)

  const [repurposingModal, setRepurposingModal] = useState<{ visible: boolean; from?: string; newType?: string }>({ visible: false })
  const [detailsModal, setDetailsModal] = useState<{ visible: boolean; pieceId?: string }>({ visible: false })

  const pieces = dashboard.content
  const selectedPiece = pieces.find((p) => p.id === detailsModal.pieceId)

  // Helper: Generate quality score
  // (Used for display in card details)
  
  // Helper: Detect content fatigue
  const calculateContentFatigue = (): number => {
    if (pieces.length < 2) return 0
    const types = pieces.map((p) => p.type)
    const typeFreq = types.reduce((acc: Record<string, number>, t) => {
      acc[t] = (acc[t] || 0) + 1
      return acc
    }, {})
    const maxFreq = Math.max(...Object.values(typeFreq))
    return Math.min(100, (maxFreq / pieces.length) * 100)
  }

  // Helper: Generate experiment suggestions
  const generateExperimentSuggestions = (): string[] => {
    return [
      'Test different hook variations (3 versions)',
      'A/B test CTA placement (top vs bottom)',
      'Compare caption length (short vs long)',
      'Experiment with visual style (minimalist vs complex)',
      'Test posting time optimization',
    ]
  }

  // Helper: Detect opportunity signals
  const detectOpportunitySignals = (p: ContentPiece): string[] => {
    const signals: string[] = []
    if (p.intent === 'Conversion') signals.push('💰 Monetization opportunity')
    if (p.qualityScore && p.qualityScore > 80) signals.push('🚀 High-performing - consider repurposing')
    if (p.isEvergreen) signals.push('♻️ Evergreen content - schedule recurring posts')
    if (p.tags?.includes('trending')) signals.push('📈 Trending topic - amplify now')
    return signals
  }

  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !type) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    const qualityScore = 70 + Math.random() * 20 // Simulated AI scoring
    const newPiece: ContentPiece = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      type,
      content,
      status: 'draft',
      createdAt: new Date().toISOString(),
      tags: selectedTags,
      intent: intent as any,
      riskLevel: riskLevel as any,
      hook,
      qualityScore,
      isEvergreen,
      captionVisualAlignment: captionVisualScore,
      platformRecommendations: PLATFORMS.map((p) => ({
        platform: p,
        bestTime: ['9am', '12pm', '6pm', '8pm'][Math.floor(Math.random() * 4)],
      })),
      experimentSuggestions: generateExperimentSuggestions(),
      relatedOpportunities: [],
      contentFatigueFactor: calculateContentFatigue(),
    }

    updateDashboard({
      content: [newPiece, ...pieces],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'content',
          title: `Created: ${title} (${intent || 'no intent'})`,
          timestamp: new Date().toISOString(),
          action: 'created',
        },
      ],
    })

    setTitle('')
    setType('')
    setContent('')
    setSelectedTags([])
    setIntent('')
    setHook('')
    setRiskLevel('Safe')
    setIsEvergreen(false)
    setCaptionVisualScore(85)
    addToast('Content created with AI analysis!', 'success')
  }

  const handleDeleteContent = (id: string) => {
    updateDashboard({
      content: pieces.filter((p) => p.id !== id),
    })
    addToast('Content deleted', 'success')
  }

  const handleUpdateStatus = (id: string, status: 'draft' | 'scheduled' | 'published' | 'archived') => {
    updateDashboard({
      content: pieces.map((p) => (p.id === id ? { ...p, status } : p)),
    })
  }

  const handleRepurpose = (sourceId: string, targetType: string) => {
    const sourcePiece = pieces.find((p) => p.id === sourceId)
    if (!sourcePiece) return

    const newPiece: ContentPiece = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${sourcePiece.title} (${targetType})`,
      type: targetType,
      content: `[Repurposed from: ${sourcePiece.title}]\n\n${sourcePiece.content}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      tags: sourcePiece.tags,
      repurposedFrom: sourceId,
      intent: sourcePiece.intent,
      riskLevel: sourcePiece.riskLevel,
      qualityScore: (sourcePiece.qualityScore || 70) - 5,
      isEvergreen: sourcePiece.isEvergreen,
    }

    updateDashboard({
      content: [newPiece, ...pieces],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'content',
          title: `Repurposed: ${sourcePiece.title} → ${targetType}`,
          timestamp: new Date().toISOString(),
          action: 'repurposed',
        },
      ],
    })

    setRepurposingModal({ visible: false })
    addToast(`Content repurposed to ${targetType}!`, 'success')
  }

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSaveHook = (text: string) => {
    if (!text.trim()) return
    const hookPiece: ContentPiece = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Hook: ${text.substring(0, 40)}...`,
      type: 'Hook',
      content: text,
      status: 'draft',
      createdAt: new Date().toISOString(),
      tags: ['hook', 'template'],
    }
    updateDashboard({ content: [hookPiece, ...pieces] })
    addToast('Hook saved to library!', 'success')
  }

  const evergreenContent = pieces.filter((p) => p.isEvergreen && p.status === 'published')
  const highPerformingContent = pieces.filter((p) => p.qualityScore && p.qualityScore > 75)
  const experimentContent = pieces.filter((p) => p.intent === 'Experiment')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Content Studio</h1>
        <p className={styles.subtitle}>Creative command center — not just a scheduler</p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button className={`${styles.tab} ${tab === 'create' ? styles.active : ''}`} onClick={() => setTab('create')}>
          ✏️ Create
        </button>
        <button className={`${styles.tab} ${tab === 'library' ? styles.active : ''}`} onClick={() => setTab('library')}>
          📚 Library ({pieces.length})
        </button>
        <button className={`${styles.tab} ${tab === 'hooks' ? styles.active : ''}`} onClick={() => setTab('hooks')}>
          🪝 Hooks
        </button>
        <button className={`${styles.tab} ${tab === 'analysis' ? styles.active : ''}`} onClick={() => setTab('analysis')}>
          📊 Analysis
        </button>
        <button className={`${styles.tab} ${tab === 'experiments' ? styles.active : ''}`} onClick={() => setTab('experiments')}>
          🧪 Tests
        </button>
        <button className={`${styles.tab} ${tab === 'opportunities' ? styles.active : ''}`} onClick={() => setTab('opportunities')}>
          💡 Opportunities
        </button>
      </div>

      {/* CREATE TAB */}
      {tab === 'create' && (
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Create Content</h2>
          <form onSubmit={handleAddContent} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Compelling content title..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Type *</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select a type</option>
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Content Intent</label>
                <select value={intent} onChange={(e) => setIntent(e.target.value)}>
                  <option value="">Select intent...</option>
                  {CONTENT_INTENTS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Risk Level</label>
                <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                  {RISK_LEVELS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Hook / Opening Line</label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="Your most compelling hook or first line..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Performance Tags</label>
              <div className={styles.tagGrid}>
                {PERFORMANCE_TAGS.map((tag) => (
                  <label key={tag} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleToggleTag(tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Caption-to-Visual Alignment: {captionVisualScore}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={captionVisualScore}
                  onChange={(e) => setCaptionVisualScore(Number(e.target.value))}
                />
              </div>
              <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label className={styles.checkbox} style={{ marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    checked={isEvergreen}
                    onChange={(e) => setIsEvergreen(e.target.checked)}
                  />
                  Mark as Evergreen
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or paste your content..."
                rows={6}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Save & Analyze
            </button>
          </form>
        </div>
      )}

      {/* LIBRARY TAB */}
      {tab === 'library' && (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Content Library</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <p className={styles.statValue}>{pieces.filter((p) => p.status === 'draft').length}</p>
              <p className={styles.statLabel}>Drafts</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>{pieces.filter((p) => p.status === 'scheduled').length}</p>
              <p className={styles.statLabel}>Scheduled</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>{pieces.filter((p) => p.status === 'published').length}</p>
              <p className={styles.statLabel}>Published</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>{pieces.filter((p) => p.status === 'archived').length}</p>
              <p className={styles.statLabel}>Archived</p>
            </div>
          </div>

          {pieces.length === 0 ? (
            <p className={styles.empty}>No content yet. Create your first piece!</p>
          ) : (
            <div className={styles.contentList}>
              {pieces.map((piece) => (
                <div key={piece.id} className={styles.contentCard}>
                  <div className={styles.contentHeader}>
                    <div>
                      <h3 className={styles.contentTitle}>{piece.title}</h3>
                      <div className={styles.contentMeta}>
                        <p className={styles.contentType}>{piece.type}</p>
                        {piece.repurposedFrom && <span className={styles.badge}>Repurposed</span>}
                        {piece.intent && <span className={styles.badge}>{piece.intent}</span>}
                        {piece.riskLevel && piece.riskLevel !== 'Safe' && (
                          <span className={styles.badge} style={{ background: '#5a1a1a' }}>
                            ⚠️ {piece.riskLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteContent(piece.id)}>
                      ✕
                    </button>
                  </div>

                  {piece.qualityScore && (
                    <div className={styles.scoreBar}>
                      <div className={styles.scoreLabel}>Quality: {Math.round(piece.qualityScore)}</div>
                      <div className={styles.scoreFill} style={{ width: `${piece.qualityScore}%` }}></div>
                    </div>
                  )}

                  {piece.tags && piece.tags.length > 0 && (
                    <div className={styles.tags}>
                      {piece.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {piece.content && <p className={styles.contentPreview}>{piece.content.substring(0, 120)}...</p>}

                  <div className={styles.footer}>
                    <select
                      className={styles.statusSelect}
                      value={piece.status}
                      onChange={(e) => handleUpdateStatus(piece.id, e.target.value as any)}
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      className={styles.repurposeBtn}
                      onClick={() => setRepurposingModal({ visible: true, from: piece.id })}
                    >
                      🔄
                    </button>
                    <button
                      className={styles.repurposeBtn}
                      onClick={() => setDetailsModal({ visible: true, pieceId: piece.id })}
                    >
                      👁️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HOOKS TAB */}
      {tab === 'hooks' && (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Hook Library</h2>
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Save a New Hook</h3>
            <input
              type="text"
              placeholder="Paste a high-performing hook or opening line..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveHook((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
              className={styles.hookInput}
            />
          </div>
          <div className={styles.hookList}>
            {pieces
              .filter((p) => p.type === 'Hook' || p.tags?.includes('hook'))
              .map((hook) => (
                <div key={hook.id} className={styles.hookCard}>
                  <p className={styles.hookText}>{hook.content}</p>
                  <button
                    className={styles.hookCopyBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(hook.content)
                      addToast('Hook copied!', 'success')
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ANALYSIS TAB */}
      {tab === 'analysis' && (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Content Analysis</h2>
          
          <div className={styles.analysisBox}>
            <h3>📊 Content Health</h3>
            <div className={styles.stat}>
              <p className={styles.statValue}>{Math.round(calculateContentFatigue())}%</p>
              <p className={styles.statLabel}>Fatigue Factor</p>
              <p className={styles.statDesc}>How repetitive your content feels</p>
            </div>
          </div>

          <div className={styles.analysisBox}>
            <h3>🎯 High-Performing Content ({highPerformingContent.length})</h3>
            {highPerformingContent.length === 0 ? (
              <p className={styles.empty}>No high-performers yet</p>
            ) : (
              <div className={styles.analysisGrid}>
                {highPerformingContent.map((p) => (
                  <div key={p.id} className={styles.analysisCard}>
                    <strong>{p.title}</strong>
                    <p>Score: {Math.round(p.qualityScore || 0)}/100</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.analysisBox}>
            <h3>♻️ Evergreen Content ({evergreenContent.length})</h3>
            {evergreenContent.length === 0 ? (
              <p className={styles.empty}>Mark content as evergreen to track reusable pieces</p>
            ) : (
              <div className={styles.analysisGrid}>
                {evergreenContent.map((p) => (
                  <div key={p.id} className={styles.analysisCard}>
                    <strong>{p.title}</strong>
                    <p>{p.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXPERIMENTS TAB */}
      {tab === 'experiments' && (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Micro-Experiments</h2>
          {experimentContent.length === 0 ? (
            <div className={styles.analysisBox}>
              <p className={styles.empty}>Create content with "Experiment" intent to track tests</p>
            </div>
          ) : (
            <div className={styles.analysisGrid}>
              {experimentContent.map((p) => (
                <div key={p.id} className={styles.analysisCard}>
                  <strong>{p.title}</strong>
                  <p>{p.content.substring(0, 80)}...</p>
                  {p.experimentSuggestions && (
                    <ul>
                      {p.experimentSuggestions.slice(0, 2).map((s, i) => (
                        <li key={i} style={{ fontSize: '12px' }}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OPPORTUNITIES TAB */}
      {tab === 'opportunities' && (
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Content Opportunities</h2>
          <div className={styles.opportunitiesGrid}>
            {pieces.map((p) => {
              const signals = detectOpportunitySignals(p)
              return signals.length > 0 ? (
                <div key={p.id} className={styles.opportunityCard}>
                  <h4>{p.title}</h4>
                  {signals.map((signal, i) => (
                    <p key={i} className={styles.signal}>
                      {signal}
                    </p>
                  ))}
                </div>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Repurposing Modal */}
      {repurposingModal.visible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Repurpose Content</h3>
            <p>Select a format to convert this content to:</p>
            <div className={styles.typeGrid}>
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t}
                  className={styles.typeBtn}
                  onClick={() => handleRepurpose(repurposingModal.from!, t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className={styles.closeBtn} onClick={() => setRepurposingModal({ visible: false })}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.visible && selectedPiece && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setDetailsModal({ visible: false })}>
              ✕
            </button>
            <h3>{selectedPiece.title}</h3>
            <div className={styles.detailsGrid}>
              <div>
                <strong>Type:</strong> {selectedPiece.type}
              </div>
              <div>
                <strong>Intent:</strong> {selectedPiece.intent || 'Not set'}
              </div>
              <div>
                <strong>Risk:</strong> {selectedPiece.riskLevel || 'Safe'}
              </div>
              <div>
                <strong>Quality:</strong> {Math.round(selectedPiece.qualityScore || 0)}/100
              </div>
              <div>
                <strong>Evergreen:</strong> {selectedPiece.isEvergreen ? '✓' : '✗'}
              </div>
              <div>
                <strong>Caption Alignment:</strong> {selectedPiece.captionVisualAlignment || 0}%
              </div>
            </div>

            {selectedPiece.platformRecommendations && (
              <div className={styles.platformSection}>
                <strong>Best Posting Times:</strong>
                <div className={styles.platformGrid}>
                  {selectedPiece.platformRecommendations.map((rec) => (
                    <div key={rec.platform} className={styles.platformCard}>
                      {rec.platform}: {rec.bestTime}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPiece.experimentSuggestions && (
              <div className={styles.suggestionsSection}>
                <strong>Suggested Tests:</strong>
                <ul>
                  {selectedPiece.experimentSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.contentBody}>{selectedPiece.content}</div>
          </div>
        </div>
      )}
    </div>
  )
}
