import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Growth.module.css'

interface GrowthExperiment {
  id: string
  name: string
  hypothesis: string
  variant: string
  metric: string
  result: 'positive' | 'negative' | 'neutral' | 'pending'
  createdAt: string
}

export function Growth() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [experiments, setExperiments] = useState<GrowthExperiment[]>([
    { id: '1', name: 'Landing Page CTA', hypothesis: 'Different color CTA', variant: 'Red button', metric: 'Click rate', result: 'positive', createdAt: new Date().toISOString() },
  ])
  const [name, setName] = useState('')
  const [hypothesis, setHypothesis] = useState('')

  const handleAddExperiment = () => {
    if (!name.trim() || !hypothesis.trim()) {
      addToast('Fill in all fields', 'error')
      return
    }

    const experiment: GrowthExperiment = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      hypothesis,
      variant: 'Default',
      metric: 'TBD',
      result: 'pending',
      createdAt: new Date().toISOString(),
    }

    setExperiments([experiment, ...experiments])
    updateDashboard({
      activity: [...dashboard.activity, {
        id: Math.random().toString(36).substr(2, 9),
        type: 'experiment',
        title: `Started experiment: ${name}`,
        timestamp: new Date().toISOString(),
        action: 'created',
      }],
    })

    setName('')
    setHypothesis('')
    addToast('Experiment created!', 'success')
  }

  const handleDeleteExperiment = (id: string) => {
    setExperiments(experiments.filter(e => e.id !== id))
    addToast('Experiment deleted', 'success')
  }

  const handleUpdateResult = (id: string, result: GrowthExperiment['result']) => {
    setExperiments(experiments.map(e => e.id === id ? { ...e, result } : e))
  }

  const resultStats = {
    positive: experiments.filter(e => e.result === 'positive').length,
    negative: experiments.filter(e => e.result === 'negative').length,
    pending: experiments.filter(e => e.result === 'pending').length,
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Growth Experiments</h1>
        <p className={styles.subtitle}>Test, learn, and scale what works</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span>✓ Wins</span>
            <span>{resultStats.positive}</span>
          </div>
          <div className={styles.stat}>
            <span>✗ Losses</span>
            <span>{resultStats.negative}</span>
          </div>
          <div className={styles.stat}>
            <span>⏳ Active</span>
            <span>{resultStats.pending}</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2>New Experiment</h2>
          <div className={styles.form}>
            <input placeholder="Experiment name" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />
            <textarea placeholder="Your hypothesis" value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} className={styles.textarea} rows={3} />
            <button onClick={handleAddExperiment} className={styles.button}>Create Experiment</button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Active Experiments</h2>
          <div className={styles.experimentsList}>
            {experiments.map(exp => (
              <div key={exp.id} className={styles.expCard}>
                <div className={styles.expHeader}>
                  <h3>{exp.name}</h3>
                  <button onClick={() => handleDeleteExperiment(exp.id)} className={styles.deleteBtn}>✕</button>
                </div>
                <p className={styles.hypothesis}>{exp.hypothesis}</p>
                <div className={styles.resultSelector}>
                  <select value={exp.result} onChange={(e) => handleUpdateResult(exp.id, e.target.value as any)} className={styles.select}>
                    <option value="pending">Pending</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
