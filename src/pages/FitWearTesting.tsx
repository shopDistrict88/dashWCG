import { useState } from 'react'
import styles from './Placeholder.module.css'

interface FitTest {
  id: string
  garmentName: string
  testDate: string
  model: string
  size: string
  fitScore: number
  issues: string[]
  status: 'passed' | 'minor-adjustments' | 'major-revisions'
}

export function FitWearTesting() {
  const [tests] = useState<FitTest[]>([
    {
      id: '1',
      garmentName: 'Minimal Overshirt',
      testDate: '2026-01-18',
      model: 'Model A',
      size: 'M',
      fitScore: 92,
      issues: ['Sleeve length perfect', 'Shoulder seam aligned'],
      status: 'passed',
    },
    {
      id: '2',
      garmentName: 'Technical Cargo Pant',
      testDate: '2026-01-20',
      model: 'Model B',
      size: 'L',
      fitScore: 78,
      issues: ['Waist slightly tight', 'Rise needs adjustment'],
      status: 'minor-adjustments',
    },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Fit & Wear Testing</h1>
          <p className={styles.subtitle}>Garment validation and ergonomics analysis</p>
        </div>
        <button className={styles.primaryBtn}>Schedule Test</button>
      </div>

      <div className={styles.grid}>
        {tests.map((test) => (
          <div key={test.id} className={styles.card}>
            <h3>{test.garmentName}</h3>
            <p className={styles.meta}>
              {test.model} | Size {test.size} | {new Date(test.testDate).toLocaleDateString()}
            </p>
            <div className={styles.score}>
              <span>Fit Score: {test.fitScore}/100</span>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: `${test.fitScore}%` }} />
              </div>
            </div>
            <div className={styles.issues}>
              {test.issues.map((issue, idx) => (
                <p key={idx}>{issue}</p>
              ))}
            </div>
            <span className={`${styles.status} ${styles[test.status.replace(/-/g, '')]}`}>
              {test.status.replace(/-/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
