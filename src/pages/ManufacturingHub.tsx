import { useState } from 'react'
import styles from './ManufacturingHub.module.css'

interface Manufacturer {
  id: string
  name: string
  location: string
  specialization: string[]
  capacity: number
  leadTime: string
  qualityRating: number
  ethicsScore: number
  activeOrders: number
  status: 'active' | 'pending' | 'inactive'
}

export function ManufacturingHub() {
  const [manufacturers] = useState<Manufacturer[]>([
    {
      id: '1',
      name: 'Atelier Kyoto',
      location: 'Kyoto, Japan',
      specialization: ['Technical garments', 'Precision tailoring'],
      capacity: 1000,
      leadTime: '8-10 weeks',
      qualityRating: 98,
      ethicsScore: 95,
      activeOrders: 3,
      status: 'active',
    },
    {
      id: '2',
      name: 'Milan Garment Works',
      location: 'Milan, Italy',
      specialization: ['Outerwear', 'Structured pieces'],
      capacity: 1500,
      leadTime: '10-12 weeks',
      qualityRating: 95,
      ethicsScore: 92,
      activeOrders: 5,
      status: 'active',
    },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Manufacturing Hub</h1>
          <p className={styles.subtitle}>Production partners and capacity management</p>
        </div>
        <button className={styles.primaryBtn}>Add Manufacturer</button>
      </div>

      <div className={styles.manufacturersList}>
        {manufacturers.map((mfg) => (
          <div key={mfg.id} className={styles.mfgCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3>{mfg.name}</h3>
                <p className={styles.location}>{mfg.location}</p>
              </div>
              <span className={`${styles.status} ${styles[`status${mfg.status}`]}`}>
                {mfg.status}
              </span>
            </div>

            <div className={styles.specs}>
              {mfg.specialization.map((spec, idx) => (
                <span key={idx} className={styles.specTag}>{spec}</span>
              ))}
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Capacity</span>
                <span className={styles.metricValue}>{mfg.capacity} units/mo</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Lead Time</span>
                <span className={styles.metricValue}>{mfg.leadTime}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Active Orders</span>
                <span className={styles.metricValue}>{mfg.activeOrders}</span>
              </div>
            </div>

            <div className={styles.scores}>
              <div className={styles.score}>
                <span className={styles.scoreLabel}>Quality Rating</span>
                <div className={styles.scoreBar}>
                  <div className={styles.scoreFill} style={{ width: `${mfg.qualityRating}%` }} />
                </div>
                <span className={styles.scoreValue}>{mfg.qualityRating}/100</span>
              </div>
              <div className={styles.score}>
                <span className={styles.scoreLabel}>Ethics Score</span>
                <div className={styles.scoreBar}>
                  <div className={styles.scoreFill} style={{ width: `${mfg.ethicsScore}%` }} />
                </div>
                <span className={styles.scoreValue}>{mfg.ethicsScore}/100</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.secondaryBtn}>View Details</button>
              <button className={styles.secondaryBtn}>New Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
