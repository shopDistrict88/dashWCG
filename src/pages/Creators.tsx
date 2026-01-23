import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Creator } from '../types'
import styles from './Creators.module.css'

const TEAM_OPTIONS = [
  'Cameraman',
  'Editing team',
  'Social media manager',
  'Brand strategist',
  'Photographer',
  'Producer',
  'Sound engineer',
]

const ROADMAP_STAGES = ['beginner', 'established', 'monetized'] as const

export function Creators() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [stage, setStage] = useState<'beginner' | 'established' | 'monetized'>('beginner')

  const creators = dashboard.creators

  const handleAddCreator = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      addToast('Please enter a creator name', 'error')
      return
    }

    const newCreator: Creator = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      goals: goal ? [goal] : [],
      teamRequests: selectedTeam,
      progress: 0,
      roadmapStage: stage,
    }

    updateDashboard({
      creators: [...creators, newCreator],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'project',
          title: `Created creator: ${name}`,
          timestamp: new Date().toISOString(),
          action: 'created',
        },
      ],
    })

    setName('')
    setGoal('')
    setSelectedTeam([])
    setStage('beginner')
    addToast('Creator profile created!', 'success')
  }

  const handleDeleteCreator = (id: string) => {
    updateDashboard({
      creators: creators.filter((c) => c.id !== id),
    })
    addToast('Creator profile deleted', 'success')
  }

  const handleUpdateStage = (id: string, newStage: 'beginner' | 'established' | 'monetized') => {
    updateDashboard({
      creators: creators.map((c) => (c.id === id ? { ...c, roadmapStage: newStage } : c)),
    })
  }

  const handleToggleTeam = (team: string) => {
    setSelectedTeam((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    )
  }

  const getRoadmapDescription = (stage: 'beginner' | 'established' | 'monetized') => {
    const descriptions = {
      beginner: 'Growing audience, building foundations',
      established: 'Consistent growth, meaningful engagement',
      monetized: 'Revenue streams, sustainable business',
    }
    return descriptions[stage]
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Creators</h1>
        <p className={styles.subtitle}>
          Build growth strategies, get support, track your journey
        </p>
      </div>

      {/* Creator Roadmap */}
      <div className={styles.roadmapSection}>
        <h2 className={styles.roadmapTitle}>Creator Growth Roadmap</h2>
        <div className={styles.roadmap}>
          {ROADMAP_STAGES.map((stageItem) => (
            <div key={stageItem} className={styles.roadmapStage}>
              <div className={styles.stageIcon}>
                {stageItem === 'beginner' && '🌱'}
                {stageItem === 'established' && '🌿'}
                {stageItem === 'monetized' && '🚀'}
              </div>
              <p className={styles.stageName}>
                {stageItem.charAt(0).toUpperCase() + stageItem.slice(1)}
              </p>
              <p className={styles.stageDescription}>{getRoadmapDescription(stageItem)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Create Creator Profile</h2>
        <form onSubmit={handleAddCreator} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Creator Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your creative name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Growth Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What do you want to achieve?"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Current Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value as any)}>
              <option value="beginner">🌱 Beginner</option>
              <option value="established">🌿 Established</option>
              <option value="monetized">🚀 Monetized</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>What help do you need?</label>
            <div className={styles.checkboxGrid}>
              {TEAM_OPTIONS.map((option) => (
                <label key={option} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedTeam.includes(option)}
                    onChange={() => handleToggleTeam(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Profile
          </button>
        </form>
      </div>

      <div className={styles.creatorsSection}>
        <h2 className={styles.sectionTitle}>Your Creator Profiles</h2>
        {creators.length === 0 ? (
          <p className={styles.empty}>No creator profiles yet. Create one above!</p>
        ) : (
          <div className={styles.creatorsList}>
            {creators.map((creator) => (
              <div key={creator.id} className={styles.creatorCard}>
                <div className={styles.creatorHeader}>
                  <div>
                    <h3 className={styles.creatorName}>{creator.name}</h3>
                    <p className={styles.creatorStage}>
                      {creator.roadmapStage === 'beginner' && '🌱 Beginner'}
                      {creator.roadmapStage === 'established' && '🌿 Established'}
                      {creator.roadmapStage === 'monetized' && '🚀 Monetized'}
                    </p>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteCreator(creator.id)}
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.stageSelector}>
                  <small>Next stage:</small>
                  {creator.roadmapStage !== 'established' && (
                    <button
                      onClick={() =>
                        handleUpdateStage(
                          creator.id,
                          creator.roadmapStage === 'beginner'
                            ? 'established'
                            : 'monetized'
                        )
                      }
                      className={styles.advanceBtn}
                    >
                      →
                    </button>
                  )}
                  {creator.roadmapStage === 'monetized' && (
                    <span className={styles.maxed}>✓ Monetized</span>
                  )}
                </div>

                {creator.goals.length > 0 && (
                  <div className={styles.goals}>
                    <p className={styles.goalLabel}>Goals:</p>
                    {creator.goals.map((g, i) => (
                      <p key={i} className={styles.goalText}>
                        • {g}
                      </p>
                    ))}
                  </div>
                )}
                {creator.teamRequests.length > 0 && (
                  <div className={styles.team}>
                    <p className={styles.teamLabel}>Help Needed:</p>
                    <div className={styles.teamTags}>
                      {creator.teamRequests.map((team) => (
                        <span key={team} className={styles.tag}>
                          {team}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
