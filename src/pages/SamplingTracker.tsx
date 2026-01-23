import { useState } from 'react'
import styles from './SamplingTracker.module.css'

interface Sample {
  id: string
  garmentName: string
  styleNumber: string
  factory: string
  sampleRound: number
  status: 'ordered' | 'in-production' | 'shipped' | 'received' | 'approved' | 'revisions-needed'
  orderDate: string
  expectedDelivery: string
  actualDelivery?: string
  fitNotes: string[]
  qualityScore: number
}

export function SamplingTracker() {
  const [samples] = useState<Sample[]>([
    {
      id: '1',
      garmentName: 'Minimal Overshirt',
      styleNumber: 'MF-001-SS26',
      factory: 'Atelier Kyoto',
      sampleRound: 3,
      status: 'approved',
      orderDate: '2025-12-10',
      expectedDelivery: '2026-01-05',
      actualDelivery: '2026-01-04',
      fitNotes: ['Shoulder width correct', 'Sleeve length adjusted'],
      qualityScore: 95,
    },
    {
      id: '2',
      garmentName: 'Technical Cargo Pant',
      styleNumber: 'TS-003-FW26',
      factory: 'Precision Manufacturing Co',
      sampleRound: 2,
      status: 'in-production',
      orderDate: '2026-01-08',
      expectedDelivery: '2026-01-28',
      fitNotes: ['Waist needs adjustment', 'Pocket placement revised'],
      qualityScore: 0,
    },
    {
      id: '3',
      garmentName: 'Structured Coat',
      styleNumber: 'UR-007-SS27',
      factory: 'Milan Garment Works',
      sampleRound: 1,
      status: 'ordered',
      orderDate: '2026-01-20',
      expectedDelivery: '2026-02-15',
      fitNotes: [],
      qualityScore: 0,
    },
  ])

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ordered': styles.statusOrdered,
      'in-production': styles.statusInProduction,
      'shipped': styles.statusShipped,
      'received': styles.statusReceived,
      'approved': styles.statusApproved,
      'revisions-needed': styles.statusRevisions,
    }
    return statusMap[status] || ''
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Sampling Tracker</h1>
          <p className={styles.subtitle}>Production samples and fit validation pipeline</p>
        </div>
        <button className={styles.primaryBtn}>Order Sample</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Active Samples</span>
          <span className={styles.statValue}>{samples.filter(s => s.status !== 'approved').length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Approved</span>
          <span className={styles.statValue}>{samples.filter(s => s.status === 'approved').length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Avg Quality</span>
          <span className={styles.statValue}>
            {samples.filter(s => s.qualityScore > 0).length > 0
              ? Math.round(samples.reduce((sum, s) => sum + s.qualityScore, 0) / samples.filter(s => s.qualityScore > 0).length)
              : 'N/A'}
          </span>
        </div>
      </div>

      <div className={styles.samplesList}>
        {samples.map((sample) => (
          <div key={sample.id} className={styles.sampleCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3>{sample.garmentName}</h3>
                <p className={styles.styleNumber}>{sample.styleNumber}</p>
              </div>
              <span className={`${styles.status} ${getStatusColor(sample.status)}`}>
                {sample.status.replace('-', ' ')}
              </span>
            </div>

            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Factory</span>
                <span className={styles.infoValue}>{sample.factory}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Sample Round</span>
                <span className={styles.infoValue}>Round {sample.sampleRound}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order Date</span>
                <span className={styles.infoValue}>{new Date(sample.orderDate).toLocaleDateString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Expected Delivery</span>
                <span className={styles.infoValue}>{new Date(sample.expectedDelivery).toLocaleDateString()}</span>
              </div>
            </div>

            {sample.qualityScore > 0 && (
              <div className={styles.quality}>
                <span className={styles.qualityLabel}>Quality Score</span>
                <div className={styles.qualityBar}>
                  <div className={styles.qualityFill} style={{ width: `${sample.qualityScore}%` }} />
                </div>
                <span className={styles.qualityValue}>{sample.qualityScore}/100</span>
              </div>
            )}

            {sample.fitNotes.length > 0 && (
              <div className={styles.notes}>
                <span className={styles.notesLabel}>Fit Notes</span>
                <ul className={styles.notesList}>
                  {sample.fitNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.actions}>
              <button className={styles.secondaryBtn}>View Details</button>
              <button className={styles.secondaryBtn}>Update Status</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
