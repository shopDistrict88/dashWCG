import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './CollaborationHub.module.css'

interface Collaborator {
  id: string
  name: string
  role: string
  skills: string[]
  goals: string[]
  availability: 'available' | 'busy' | 'unavailable'
  fitScore: number
  trustScore: number
  contributions: number
  responseTime: number
  alignmentStyle: 'strategic' | 'creative' | 'technical'
  lastActive: string
}

interface Collaboration {
  id: string
  project: string
  collaborators: string[]
  roles: { [key: string]: string }
  decisions: Array<{ decision: string; owner: string; date: string }>
  contributions: Array<{ collaborator: string; type: string; description: string; date: string }>
  sharedGoals: string[]
  status: 'planning' | 'active' | 'completed'
  health: number
  conflicts: string[]
  startDate: string
}

export default function CollaborationHub() {
  const { addToast } = useApp()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null)
  const [viewMode, setViewMode] = useState<'discover' | 'active' | 'history'>('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [showNewCollab, setShowNewCollab] = useState(false)

  useEffect(() => {
    const savedCollaborators = localStorage.getItem('wcg-collaborators')
    const savedCollaborations = localStorage.getItem('wcg-collaborations')
    if (savedCollaborators) {
      setCollaborators(JSON.parse(savedCollaborators))
    }
    if (savedCollaborations) {
      setCollaborations(JSON.parse(savedCollaborations))
    }
  }, [])

  useEffect(() => {
    if (collaborators.length > 0) {
      localStorage.setItem('wcg-collaborators', JSON.stringify(collaborators))
    }
  }, [collaborators])

  useEffect(() => {
    if (collaborations.length > 0) {
      localStorage.setItem('wcg-collaborations', JSON.stringify(collaborations))
    }
  }, [collaborations])

  const addCollaborator = (name: string, role: string, skills: string[], goals: string[]) => {
    const newCollab: Collaborator = {
      id: Date.now().toString(),
      name,
      role,
      skills,
      goals,
      availability: 'available',
      fitScore: Math.floor(Math.random() * 20) + 80,
      trustScore: Math.floor(Math.random() * 20) + 80,
      contributions: 0,
      responseTime: Math.floor(Math.random() * 24) + 1,
      alignmentStyle: ['strategic', 'creative', 'technical'][Math.floor(Math.random() * 3)] as any,
      lastActive: new Date().toISOString()
    }
    setCollaborators([...collaborators, newCollab])
    addToast('Collaborator added', 'success')
  }

  const createCollaboration = (project: string, collaboratorIds: string[], sharedGoals: string[]) => {
    const newCollab: Collaboration = {
      id: Date.now().toString(),
      project,
      collaborators: collaboratorIds,
      roles: {},
      decisions: [],
      contributions: [],
      sharedGoals,
      status: 'planning',
      health: 100,
      conflicts: [],
      startDate: new Date().toISOString()
    }
    setCollaborations([...collaborations, newCollab])
    addToast('Collaboration created', 'success')
  }

  const addContribution = (collabId: string, collaboratorName: string, type: string, description: string) => {
    const updated = collaborations.map(c => {
      if (c.id === collabId) {
        return {
          ...c,
          contributions: [...c.contributions, {
            collaborator: collaboratorName,
            type,
            description,
            date: new Date().toISOString()
          }]
        }
      }
      return c
    })
    setCollaborations(updated)
    
    // Update collaborator contribution count
    const updatedCollaborators = collaborators.map(collab => {
      if (collab.name === collaboratorName) {
        return { ...collab, contributions: collab.contributions + 1 }
      }
      return collab
    })
    setCollaborators(updatedCollaborators)
    
    addToast('Contribution tracked', 'success')
  }

  const assignDecision = (collabId: string, decision: string, owner: string) => {
    const updated = collaborations.map(c => {
      if (c.id === collabId) {
        return {
          ...c,
          decisions: [...c.decisions, {
            decision,
            owner,
            date: new Date().toISOString()
          }]
        }
      }
      return c
    })
    setCollaborations(updated)
    addToast('Decision assigned', 'success')
  }

  const detectConflicts = (collabId: string) => {
    const collab = collaborations.find(c => c.id === collabId)
    if (!collab) return
    
    const conflicts: string[] = []
    const roleOwners = Object.values(collab.roles)
    const duplicateRoles = roleOwners.filter((role, index) => roleOwners.indexOf(role) !== index)
    if (duplicateRoles.length > 0) {
      conflicts.push('Overlapping role responsibilities detected')
    }
    
    const decisionOwners = collab.decisions.map(d => d.owner)
    const conflictingDecisions = decisionOwners.filter((owner, index) => decisionOwners.indexOf(owner) !== index)
    if (conflictingDecisions.length > 0) {
      conflicts.push('Multiple people making similar decisions')
    }
    
    const updated = collaborations.map(c => {
      if (c.id === collabId) {
        return { ...c, conflicts }
      }
      return c
    })
    setCollaborations(updated)
    
    if (conflicts.length > 0) {
      addToast(`${conflicts.length} conflicts detected`, 'error')
    } else {
      addToast('No conflicts detected', 'success')
    }
  }

  const calculateAlignmentScore = (collab1: Collaborator, collab2: Collaborator) => {
    let score = 0
    const sharedSkills = collab1.skills.filter(s => collab2.skills.includes(s))
    score += sharedSkills.length * 10
    
    const sharedGoals = collab1.goals.filter(g => collab2.goals.includes(g))
    score += sharedGoals.length * 15
    
    if (collab1.alignmentStyle === collab2.alignmentStyle) {
      score += 20
    }
    
    return Math.min(100, score)
  }

  const findSkillGaps = (collabId: string) => {
    const collab = collaborations.find(c => c.id === collabId)
    if (!collab) return []
    
    const requiredSkills = ['design', 'development', 'marketing', 'strategy', 'content']
    const currentSkills = collab.collaborators.flatMap(id => {
      const collaborator = collaborators.find(c => c.id === id)
      return collaborator ? collaborator.skills : []
    })
    
    return requiredSkills.filter(skill => !currentSkills.includes(skill))
  }

  const filteredCollaborators = collaborators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSkill = !skillFilter || c.skills.includes(skillFilter)
    return matchesSearch && matchesSkill
  })

  const getTimeSince = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const hours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return `${Math.floor(days / 7)}w ago`
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Collaboration Hub</h1>
          <p>{collaborators.length} collaborators · {collaborations.filter(c => c.status === 'active').length} active projects</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => setShowNewCollab(true)} className={styles.primaryBtn}>
            New Collaboration
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={viewMode === 'discover' ? styles.tabActive : styles.tab}
          onClick={() => setViewMode('discover')}
        >
          Discover
        </button>
        <button 
          className={viewMode === 'active' ? styles.tabActive : styles.tab}
          onClick={() => setViewMode('active')}
        >
          Active
        </button>
        <button 
          className={viewMode === 'history' ? styles.tabActive : styles.tab}
          onClick={() => setViewMode('history')}
        >
          History
        </button>
      </div>

      {viewMode === 'discover' && (
        <>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search collaborators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className={styles.select}>
              <option value="">All Skills</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="marketing">Marketing</option>
              <option value="strategy">Strategy</option>
              <option value="content">Content</option>
            </select>
          </div>

          <div className={styles.collaboratorGrid}>
            {filteredCollaborators.map(collab => (
              <div key={collab.id} className={styles.collaboratorCard}>
                <div className={styles.collabHeader}>
                  <div>
                    <div className={styles.collabName}>{collab.name}</div>
                    <div className={styles.collabRole}>{collab.role}</div>
                  </div>
                  <div className={styles.availability}>
                    <span className={`${styles.availabilityDot} ${styles[collab.availability]}`}></span>
                    {collab.availability}
                  </div>
                </div>
                
                <div className={styles.scores}>
                  <div className={styles.scoreItem}>
                    <div className={styles.scoreLabel}>Fit Score</div>
                    <div className={styles.scoreValue}>{collab.fitScore}%</div>
                  </div>
                  <div className={styles.scoreItem}>
                    <div className={styles.scoreLabel}>Trust Score</div>
                    <div className={styles.scoreValue}>{collab.trustScore}%</div>
                  </div>
                </div>

                <div className={styles.skills}>
                  {collab.skills.map(skill => (
                    <span key={skill} className={styles.skillBadge}>{skill}</span>
                  ))}
                </div>

                <div className={styles.collabMeta}>
                  <span>{collab.contributions} contributions</span>
                  <span>{collab.responseTime}h response</span>
                  <span className={styles.alignmentBadge}>{collab.alignmentStyle}</span>
                </div>

                <div className={styles.collabFooter}>
                  <span>Active {getTimeSince(collab.lastActive)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'active' && (
        <div className={styles.collaborationsList}>
          {collaborations.filter(c => c.status === 'active' || c.status === 'planning').map(collab => {
            const skillGaps = findSkillGaps(collab.id)
            return (
              <div key={collab.id} className={styles.collabProjectCard} onClick={() => setSelectedCollab(collab)}>
                <div className={styles.projectHeader}>
                  <div>
                    <div className={styles.projectName}>{collab.project}</div>
                    <div className={styles.projectStatus}>{collab.status}</div>
                  </div>
                  <div className={styles.healthScore}>
                    <div className={styles.healthLabel}>Health</div>
                    <div className={styles.healthValue}>{collab.health}%</div>
                  </div>
                </div>

                <div className={styles.projectTeam}>
                  {collab.collaborators.map(id => {
                    const collaborator = collaborators.find(c => c.id === id)
                    return collaborator ? (
                      <span key={id} className={styles.teamMember}>{collaborator.name}</span>
                    ) : null
                  })}
                </div>

                <div className={styles.projectStats}>
                  <span>{collab.decisions.length} decisions</span>
                  <span>{collab.contributions.length} contributions</span>
                  <span>{collab.sharedGoals.length} goals</span>
                </div>

                {collab.conflicts.length > 0 && (
                  <div className={styles.conflicts}>
                    {collab.conflicts.map((conflict, i) => (
                      <div key={i} className={styles.conflictItem}>{conflict}</div>
                    ))}
                  </div>
                )}

                {skillGaps.length > 0 && (
                  <div className={styles.skillGaps}>
                    Missing: {skillGaps.join(', ')}
                  </div>
                )}

                <div className={styles.projectFooter}>
                  Started {getTimeSince(collab.startDate)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewMode === 'history' && (
        <div className={styles.historyTimeline}>
          {collaborations.filter(c => c.status === 'completed').map(collab => (
            <div key={collab.id} className={styles.historyItem}>
              <div className={styles.historyHeader}>
                <div className={styles.historyProject}>{collab.project}</div>
                <div className={styles.historyDate}>{new Date(collab.startDate).toLocaleDateString()}</div>
              </div>
              <div className={styles.historyTeam}>
                Team: {collab.collaborators.map(id => {
                  const collaborator = collaborators.find(c => c.id === id)
                  return collaborator?.name
                }).filter(Boolean).join(', ')}
              </div>
              <div className={styles.historyOutcome}>
                {collab.contributions.length} contributions · {collab.decisions.length} decisions
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCollab && (
        <div className={styles.modal} onClick={() => setSelectedCollab(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedCollab.project}</h2>
              <button onClick={() => setSelectedCollab(null)} className={styles.closeBtn}>×</button>
            </div>

            <div className={styles.modalSection}>
              <h3>Team</h3>
              {selectedCollab.collaborators.map(id => {
                const collaborator = collaborators.find(c => c.id === id)
                return collaborator ? (
                  <div key={id} className={styles.teamMemberDetail}>
                    <div>
                      <div className={styles.memberName}>{collaborator.name}</div>
                      <div className={styles.memberRole}>{collaborator.role}</div>
                    </div>
                    <div className={styles.memberScores}>
                      <span>Fit: {collaborator.fitScore}%</span>
                      <span>Trust: {collaborator.trustScore}%</span>
                    </div>
                  </div>
                ) : null
              })}
            </div>

            <div className={styles.modalSection}>
              <h3>Shared Goals</h3>
              {selectedCollab.sharedGoals.map((goal, i) => (
                <div key={i} className={styles.goalItem}>{goal}</div>
              ))}
            </div>

            <div className={styles.modalSection}>
              <h3>Decisions</h3>
              {selectedCollab.decisions.map((decision, i) => (
                <div key={i} className={styles.decisionItem}>
                  <div className={styles.decisionText}>{decision.decision}</div>
                  <div className={styles.decisionMeta}>
                    <span>Owner: {decision.owner}</span>
                    <span>{new Date(decision.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add decision..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    assignDecision(selectedCollab.id, e.currentTarget.value, 'You')
                    e.currentTarget.value = ''
                  }
                }}
                className={styles.input}
              />
            </div>

            <div className={styles.modalSection}>
              <h3>Contributions</h3>
              {selectedCollab.contributions.map((contrib, i) => (
                <div key={i} className={styles.contributionItem}>
                  <div className={styles.contributionHeader}>
                    <span className={styles.contributionAuthor}>{contrib.collaborator}</span>
                    <span className={styles.contributionType}>{contrib.type}</span>
                  </div>
                  <div className={styles.contributionDesc}>{contrib.description}</div>
                  <div className={styles.contributionDate}>{new Date(contrib.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => detectConflicts(selectedCollab.id)} className={styles.secondaryBtn}>
                Detect Conflicts
              </button>
              <button onClick={() => addToast(`Skill gaps: ${findSkillGaps(selectedCollab.id).join(', ') || 'None'}`, 'info')} className={styles.secondaryBtn}>
                Check Skill Gaps
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewCollab && (
        <div className={styles.modal} onClick={() => setShowNewCollab(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>New Collaboration</h2>
              <button onClick={() => setShowNewCollab(false)} className={styles.closeBtn}>×</button>
            </div>
            <div className={styles.form}>
              <input
                type="text"
                placeholder="Project name"
                className={styles.input}
                id="projectName"
              />
              <input
                type="text"
                placeholder="Shared goals (comma separated)"
                className={styles.input}
                id="sharedGoals"
              />
              <button 
                onClick={() => {
                  const projectName = (document.getElementById('projectName') as HTMLInputElement).value
                  const goals = (document.getElementById('sharedGoals') as HTMLInputElement).value.split(',').map(g => g.trim())
                  if (projectName && goals.length > 0) {
                    createCollaboration(projectName, [], goals)
                    setShowNewCollab(false)
                  }
                }}
                className={styles.primaryBtn}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
