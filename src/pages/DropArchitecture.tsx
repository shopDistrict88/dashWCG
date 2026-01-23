import { useState } from 'react'
import styles from './DropArchitecture.module.css'

interface Drop {
  id: string
  name: string
  releaseDate: string
  productCount: number
  inventory: number
  pricing: string
  status: 'planned' | 'active' | 'sold-out' | 'archived'
  culturalTiming: number
  demandForecast: number
}

export function DropArchitecture() {
  const [drops] = useState<Drop[]>([
    {
      id: '1',
      name: 'Foundation Drop 01',
      releaseDate: '2026-02-15',
      productCount: 8,
      inventory: 500,
      pricing: 'Premium',
      status: 'planned',
      culturalTiming: 88,
      demandForecast: 92,
    },
    {
      id: '2',
      name: 'Technical Series',
      releaseDate: '2026-03-01',
      productCount: 12,
      inventory: 750,
      pricing: 'Mid-tier',
      status: 'planned',
      culturalTiming: 75,
      demandForecast: 85,
    },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Drop Architecture</h1>
          <p className={styles.subtitle}>Release strategy and inventory planning</p>
        </div>
        <button className={styles.primaryBtn}>Plan Drop</button>
      </div>

      <div className={styles.dropsList}>
        {drops.map((drop) => (
          <div key={drop.id} className={styles.dropCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3>{drop.name}</h3>
                <p className={styles.releaseDate}>{new Date(drop.releaseDate).toLocaleDateString()}</p>
              </div>
              <span className={`${styles.status} ${styles[`status${drop.status.replace('-', '')}`]}`}>
                {drop.status}
              </span>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Products</span>
                <span className={styles.metricValue}>{drop.productCount}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Inventory</span>
                <span className={styles.metricValue}>{drop.inventory}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Pricing</span>
                <span className={styles.metricValue}>{drop.pricing}</span>
              </div>
            </div>

            <div className={styles.forecasts}>
              <div className={styles.forecast}>
                <span className={styles.forecastLabel}>Cultural Timing</span>
                <div className={styles.forecastBar}>
                  <div className={styles.forecastFill} style={{ width: `${drop.culturalTiming}%` }} />
                </div>
                <span className={styles.forecastValue}>{drop.culturalTiming}%</span>
              </div>
              <div className={styles.forecast}>
                <span className={styles.forecastLabel}>Demand Forecast</span>
                <div className={styles.forecastBar}>
                  <div className={styles.forecastFill} style={{ width: `${drop.demandForecast}%` }} />
                </div>
                <span className={styles.forecastValue}>{drop.demandForecast}%</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.secondaryBtn}>Edit Strategy</button>
              <button className={styles.secondaryBtn}>View Timeline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
