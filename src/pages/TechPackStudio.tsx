import { useState } from 'react'
import styles from './TechPackStudio.module.css'

interface TechPack {
  id: string
  garmentName: string
  styleNumber: string
  collection: string
  version: string
  status: 'draft' | 'review' | 'approved' | 'production'
  measurements: boolean
  materials: boolean
  construction: boolean
  grading: boolean
  lastModified: string
}

export function TechPackStudio() {
  const [techPacks] = useState<TechPack[]>([
    {
      id: '1',
      garmentName: 'Minimal Overshirt',
      styleNumber: 'MF-001-SS26',
      collection: 'Monochrome Foundation',
      version: '3.2',
      status: 'approved',
      measurements: true,
      materials: true,
      construction: true,
      grading: true,
      lastModified: '2026-01-20',
    },
    {
      id: '2',
      garmentName: 'Technical Cargo Pant',
      styleNumber: 'TS-003-FW26',
      collection: 'Technical Silence',
      version: '2.1',
      status: 'review',
      measurements: true,
      materials: true,
      construction: false,
      grading: false,
      lastModified: '2026-01-21',
    },
    {
      id: '3',
      garmentName: 'Structured Coat',
      styleNumber: 'UR-007-SS27',
      collection: 'Urban Restraint',
      version: '1.0',
      status: 'draft',
      measurements: true,
      materials: false,
      construction: false,
      grading: false,
      lastModified: '2026-01-22',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return styles.statusProduction
      case 'approved': return styles.statusApproved
      case 'review': return styles.statusReview
      case 'draft': return styles.statusDraft
      default: return ''
    }
  }

  const getCompletionPercentage = (pack: TechPack) => {
    const total = 4
    const completed = [pack.measurements, pack.materials, pack.construction, pack.grading].filter(Boolean).length
    return Math.round((completed / total) * 100)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Tech Pack Studio</h1>
          <p className={styles.subtitle}>Production specifications and technical documentation</p>
        </div>
        <button className={styles.primaryBtn}>New Tech Pack</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Packs</span>
          <span className={styles.statValue}>{techPacks.length}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Approved</span>
          <span className={styles.statValue}>{techPacks.filter(t => t.status === 'approved').length}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>In Review</span>
          <span className={styles.statValue}>{techPacks.filter(t => t.status === 'review').length}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Draft</span>
          <span className={styles.statValue}>{techPacks.filter(t => t.status === 'draft').length}</span>
        </div>
      </div>

      <div className={styles.packsList}>
        {techPacks.map((pack) => (
          <div key={pack.id} className={styles.packCard}>
            <div className={styles.packHeader}>
              <div>
                <h3>{pack.garmentName}</h3>
                <p className={styles.styleNumber}>{pack.styleNumber}</p>
              </div>
              <span className={`${styles.status} ${getStatusColor(pack.status)}`}>
                {pack.status}
              </span>
            </div>

            <div className={styles.packMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Collection</span>
                <span className={styles.metaValue}>{pack.collection}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Version</span>
                <span className={styles.metaValue}>{pack.version}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Modified</span>
                <span className={styles.metaValue}>{new Date(pack.lastModified).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={styles.completion}>
              <div className={styles.completionHeader}>
                <span className={styles.completionLabel}>Completion</span>
                <span className={styles.completionPercent}>{getCompletionPercentage(pack)}%</span>
              </div>
              <div className={styles.completionBar}>
                <div 
                  className={styles.completionFill}
                  style={{ width: `${getCompletionPercentage(pack)}%` }}
                />
              </div>
            </div>

            <div className={styles.sections}>
              <div className={`${styles.section} ${pack.measurements ? styles.sectionComplete : ''}`}>
                <span className={styles.sectionIcon}>{pack.measurements ? '✓' : '○'}</span>
                <span className={styles.sectionName}>Measurements</span>
              </div>
              <div className={`${styles.section} ${pack.materials ? styles.sectionComplete : ''}`}>
                <span className={styles.sectionIcon}>{pack.materials ? '✓' : '○'}</span>
                <span className={styles.sectionName}>Materials</span>
              </div>
              <div className={`${styles.section} ${pack.construction ? styles.sectionComplete : ''}`}>
                <span className={styles.sectionIcon}>{pack.construction ? '✓' : '○'}</span>
                <span className={styles.sectionName}>Construction</span>
              </div>
              <div className={`${styles.section} ${pack.grading ? styles.sectionComplete : ''}`}>
                <span className={styles.sectionIcon}>{pack.grading ? '✓' : '○'}</span>
                <span className={styles.sectionName}>Grading</span>
              </div>
            </div>

            <div className={styles.packActions}>
              <button className={styles.secondaryBtn}>Edit</button>
              <button className={styles.secondaryBtn}>Export PDF</button>
              <button className={styles.secondaryBtn}>Version History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
