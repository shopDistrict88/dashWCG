import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Education.module.css'

interface Playbook {
  id: string
  title: string
  category: string
  progress: number
}

export function Education() {
  const { addToast } = useApp()
  const [playbooks] = useState<Playbook[]>([
    { id: '1', title: 'Founder Playbook', category: 'Startup Basics', progress: 75 },
    { id: '2', title: 'Content Strategy 101', category: 'Content', progress: 45 },
    { id: '3', title: 'Growth Hacking', category: 'Growth', progress: 30 },
    { id: '4', title: 'Branding Essentials', category: 'Brand', progress: 60 },
  ])

  const handleStartPlaybook = (title: string) => {
    addToast(`Started: ${title}`, 'success')
  }

  const categoriesCount = {
    'Startup Basics': playbooks.filter(p => p.category === 'Startup Basics').length,
    'Content': playbooks.filter(p => p.category === 'Content').length,
    'Growth': playbooks.filter(p => p.category === 'Growth').length,
    'Brand': playbooks.filter(p => p.category === 'Brand').length,
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Education & Playbooks</h1>
        <p className={styles.subtitle}>Learn proven strategies and frameworks</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{playbooks.length}</span>
            <span className={styles.statLabel}>Playbooks</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round(playbooks.reduce((sum, p) => sum + p.progress, 0) / playbooks.length)}</span>
            <span className={styles.statLabel}>% Average Progress</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{playbooks.filter(p => p.progress >= 100).length}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Your Learning Path</h2>
          <div className={styles.playbooksList}>
            {playbooks.map(playbook => (
              <div key={playbook.id} className={styles.playbookCard}>
                <div className={styles.cardHeader}>
                  <h3>{playbook.title}</h3>
                  <span className={styles.category}>{playbook.category}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${playbook.progress}%` }}></div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.progress}>{playbook.progress}% complete</span>
                  <button onClick={() => handleStartPlaybook(playbook.title)} className={styles.button}>
                    {playbook.progress === 0 ? 'Start' : playbook.progress === 100 ? 'Review' : 'Continue'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Categories</h2>
          <div className={styles.categoriesGrid}>
            {Object.entries(categoriesCount).map(([name, count]) => (
              <div key={name} className={styles.categoryCard}>
                <h3>{name}</h3>
                <p>{count} playbooks</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
