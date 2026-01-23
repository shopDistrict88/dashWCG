import { useState } from 'react'
import styles from './CollaborationHub.module.css'

export default function CollaborationHub() {
  const [matches] = useState([
    { id: 1, name: 'Sarah Chen', role: 'Visual Designer', intent: 'Album artwork collaboration', match: 92 },
    { id: 2, name: 'Marcus Rivera', role: 'Producer', intent: 'Music production', match: 88 },
    { id: 3, name: 'Aisha Patel', role: 'Photographer', intent: 'Brand photography', match: 85 },
  ])

  const [activeCollabs] = useState([
    { 
      id: 1, 
      project: 'Summer EP Release', 
      collaborators: ['Sarah Chen', 'Marcus Rivera'], 
      status: 'In Progress',
      progress: 65
    },
    { 
      id: 2, 
      project: 'Brand Refresh 2026', 
      collaborators: ['Aisha Patel'], 
      status: 'Planning',
      progress: 20
    },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Collaboration Hub</h1>
        <p>Find collaborators by intent and track contributions</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recommended Matches</h2>
          <button className={styles.button}>Set Your Intent</button>
        </div>
        <div className={styles.matches}>
          {matches.map(match => (
            <div key={match.id} className={styles.matchCard}>
              <div className={styles.matchHeader}>
                <div>
                  <div className={styles.matchName}>{match.name}</div>
                  <div className={styles.matchRole}>{match.role}</div>
                </div>
                <div className={styles.matchScore}>{match.match}%</div>
              </div>
              <div className={styles.matchIntent}>
                <span className={styles.intentLabel}>Intent:</span> {match.intent}
              </div>
              <div className={styles.matchActions}>
                <button className={styles.buttonSecondary}>View Profile</button>
                <button className={styles.buttonPrimary}>Connect</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Active Collaborations</h2>
        <div className={styles.collabs}>
          {activeCollabs.map(collab => (
            <div key={collab.id} className={styles.collabCard}>
              <div className={styles.collabHeader}>
                <div className={styles.collabTitle}>{collab.project}</div>
                <span className={styles.collabStatus}>{collab.status}</span>
              </div>
              <div className={styles.collabCollaborators}>
                {collab.collaborators.map((name, i) => (
                  <div key={i} className={styles.collaborator}>{name}</div>
                ))}
              </div>
              <div className={styles.collabProgress}>
                <div className={styles.progressLabel}>
                  <span>Progress</span>
                  <span>{collab.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${collab.progress}%` }}
                  />
                </div>
              </div>
              <div className={styles.collabActions}>
                <button className={styles.buttonSecondary}>View Details</button>
                <button className={styles.buttonSecondary}>Message</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Availability Signals</h2>
        <div className={styles.availability}>
          <div className={styles.availabilityCard}>
            <h3>Your Status</h3>
            <select className={styles.select}>
              <option>Open to Collaborations</option>
              <option>Selective Projects Only</option>
              <option>Not Available</option>
            </select>
            <p className={styles.note}>This helps others know when to reach out</p>
          </div>
          <div className={styles.availabilityCard}>
            <h3>Looking For</h3>
            <div className={styles.tags}>
              <span className={styles.tag}>Producers</span>
              <span className={styles.tag}>Visual Artists</span>
              <span className={styles.tag}>Engineers</span>
            </div>
            <button className={styles.buttonSecondary}>Edit Preferences</button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Contribution Ledger</h2>
        <div className={styles.ledger}>
          <div className={styles.ledgerItem}>
            <div className={styles.ledgerInfo}>
              <div className={styles.ledgerName}>Sarah Chen</div>
              <div className={styles.ledgerRole}>Visual Designer · Summer EP Release</div>
            </div>
            <div className={styles.ledgerContribution}>Album artwork, social assets</div>
            <div className={styles.ledgerStatus}>Completed</div>
          </div>
          <div className={styles.ledgerItem}>
            <div className={styles.ledgerInfo}>
              <div className={styles.ledgerName}>Marcus Rivera</div>
              <div className={styles.ledgerRole}>Producer · Summer EP Release</div>
            </div>
            <div className={styles.ledgerContribution}>3 tracks produced, mixing</div>
            <div className={styles.ledgerStatus}>In Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}
