import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Funding.module.css'

interface FundingRound {
  id: string
  name: string
  target: number
  raised: number
  stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth'
  status: 'planning' | 'active' | 'closed'
  createdAt: string
}

export function Funding() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([
    {
      id: '1',
      name: 'Seed Round',
      target: 250000,
      raised: 0,
      stage: 'seed',
      status: 'planning',
      createdAt: new Date().toISOString(),
    },
  ])

  const [roundName, setRoundName] = useState('')
  const [roundTarget, setRoundTarget] = useState('')
  const [roundStage, setRoundStage] = useState<FundingRound['stage']>('seed')

  const calculateReadiness = (): { score: number; items: string[]; missing: string[] } => {
    const items: string[] = []
    const missing: string[] = []

    // Check business fundamentals
    if (dashboard.creators.length > 0) {
      items.push('Team assembled')
    } else {
      missing.push('Add team members')
    }

    // Check brand
    if (dashboard.brands.some((b) => (b.consistencyScore || 0) > 60)) {
      items.push('Strong brand identity')
    } else {
      missing.push('Establish brand identity')
    }

    // Check traction
    if (dashboard.products.length > 0) {
      items.push('Product in market')
    } else {
      missing.push('Launch initial product')
    }

    // Check content
    if (dashboard.content.filter((c) => c.status === 'published').length > 5) {
      items.push('Content strategy')
    } else {
      missing.push('Build content library')
    }

    // Check business planning
    if (dashboard.projects.length > 2) {
      items.push('Business planning')
    } else {
      missing.push('Define growth strategy')
    }

    // Calculate score (0-100)
    const score = Math.min(100, items.length * 20)
    return { score, items, missing }
  }

  const handleAddRound = () => {
    if (!roundName.trim() || !roundTarget) {
      addToast('Fill in all fields', 'error')
      return
    }

    const newRound: FundingRound = {
      id: Math.random().toString(36).substr(2, 9),
      name: roundName,
      target: parseFloat(roundTarget),
      raised: 0,
      stage: roundStage,
      status: 'planning',
      createdAt: new Date().toISOString(),
    }

    setFundingRounds([...fundingRounds, newRound])
    setRoundName('')
    setRoundTarget('')

    updateDashboard({
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'project',
          title: `New funding round: ${roundName}`,
          timestamp: new Date().toISOString(),
          action: 'created',
        },
      ],
    })

    addToast('Funding round created!', 'success')
  }

  const handleUpdateRound = (roundId: string, raised: number) => {
    setFundingRounds(
      fundingRounds.map((r) => (r.id === roundId ? { ...r, raised } : r))
    )
  }

  const handleDeleteRound = (roundId: string) => {
    setFundingRounds(fundingRounds.filter((r) => r.id !== roundId))
    addToast('Funding round deleted', 'success')
  }

  const readiness = calculateReadiness()
  const totalRaised = fundingRounds.reduce((sum, r) => sum + r.raised, 0)
  const totalTarget = fundingRounds.reduce((sum, r) => sum + r.target, 0)

  const stageLabels: Record<FundingRound['stage'], { label: string; description: string }> = {
    'pre-seed': { label: 'Pre-Seed', description: 'Founders, friends & family' },
    seed: { label: 'Seed', description: '$250K - $2M' },
    'series-a': { label: 'Series A', description: '$2M - $15M' },
    'series-b': { label: 'Series B', description: '$15M - $100M+' },
    growth: { label: 'Growth', description: '$100M+' },
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Funding & Growth Capital</h1>
        <p className={styles.subtitle}>Plan and track your fundraising journey</p>
      </div>

      <div className={styles.mainContent}>
        {/* Readiness Score */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Funding Readiness</h2>
          <div className={styles.readinessCard}>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreNumber}>{readiness.score}%</div>
              <div className={styles.scoreLabel}>Ready to Fundraise</div>
            </div>

            <div className={styles.readinessDetails}>
              <div className={styles.readinessGroup}>
                <h3 className={styles.groupTitle}>✓ Strengths</h3>
                {readiness.items.length > 0 ? (
                  <ul className={styles.itemsList}>
                    {readiness.items.map((item, i) => (
                      <li key={i} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyText}>Build your foundation</p>
                )}
              </div>

              <div className={styles.readinessGroup}>
                <h3 className={styles.groupTitle}>⚠️ To Strengthen</h3>
                {readiness.missing.length > 0 ? (
                  <ul className={styles.itemsList}>
                    {readiness.missing.map((item, i) => (
                      <li key={i} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyText}>All set!</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Funding Overview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Capital Summary</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Target</span>
              <span className={styles.summaryValue}>
                ${(totalTarget / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Raised</span>
              <span className={styles.summaryValue}>
                ${(totalRaised / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Remaining</span>
              <span className={styles.summaryValue}>
                ${((totalTarget - totalRaised) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Progress</span>
              <span className={styles.summaryValue}>
                {totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0}%
              </span>
            </div>
          </div>
        </section>

        {/* Create Round */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>New Funding Round</h2>
          <div className={styles.formGrid}>
            <input
              type="text"
              placeholder="Round name (e.g., Seed Round)"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              className={styles.input}
            />
            <select
              value={roundStage}
              onChange={(e) => setRoundStage(e.target.value as typeof roundStage)}
              className={styles.select}
            >
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B</option>
              <option value="growth">Growth</option>
            </select>
            <input
              type="number"
              placeholder="Target amount ($)"
              value={roundTarget}
              onChange={(e) => setRoundTarget(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleAddRound} className={styles.button}>
              Create Round
            </button>
          </div>
        </section>

        {/* Funding Rounds */}
        {fundingRounds.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Rounds</h2>
            <div className={styles.roundsList}>
              {fundingRounds.map((round) => {
                const progress = (round.raised / round.target) * 100
                const stageInfo = stageLabels[round.stage]

                return (
                  <div key={round.id} className={styles.roundCard}>
                    <div className={styles.roundHeader}>
                      <div>
                        <h3 className={styles.roundName}>{round.name}</h3>
                        <p className={styles.roundMeta}>
                          {stageInfo.label} • {stageInfo.description}
                        </p>
                      </div>
                      <button
                        className={styles.closeButton}
                        onClick={() => handleDeleteRound(round.id)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className={styles.progressText}>
                        ${(round.raised / 1000000).toFixed(1)}M / ${(round.target / 1000000).toFixed(1)}M
                        ({Math.round(progress)}%)
                      </p>
                    </div>

                    <div className={styles.roundControls}>
                      <input
                        type="number"
                        placeholder="Add funds raised"
                        onBlur={(e) => {
                          const amount = parseFloat(e.target.value)
                          if (amount > 0) {
                            handleUpdateRound(round.id, round.raised + amount)
                            e.target.value = ''
                          }
                        }}
                        className={styles.smallInput}
                      />
                      <select
                        value={round.status}
                        onChange={(e) => {
                          setFundingRounds(
                            fundingRounds.map((r) =>
                              r.id === round.id ? { ...r, status: e.target.value as FundingRound['status'] } : r
                            )
                          )
                        }}
                        className={styles.statusSelect}
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
