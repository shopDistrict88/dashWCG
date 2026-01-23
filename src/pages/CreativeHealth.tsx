import { useState } from 'react'
import styles from './CreativeHealth.module.css'

export default function CreativeHealth() {
  const [healthMetrics] = useState({
    burnoutRisk: 32,
    energyLevel: 68,
    pace: 'Sustainable',
    weeklyHours: 42,
    projectLoad: 5,
    lastBreak: '3 days ago',
  })

  const [energyTrend] = useState([
    { week: 'Week 1', energy: 75 },
    { week: 'Week 2', energy: 72 },
    { week: 'Week 3', energy: 68 },
    { week: 'Week 4', energy: 68 },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Creative Health</h1>
        <p>Monitor your creative energy and prevent burnout</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Burnout Risk</h2>
            <span className={styles.statusLow}>Low</span>
          </div>
          <div className={styles.metric}>
            <div className={styles.number}>{healthMetrics.burnoutRisk}%</div>
            <div className={styles.bar}>
              <div 
                className={styles.barFill} 
                style={{ width: `${healthMetrics.burnoutRisk}%` }}
              />
            </div>
          </div>
          <p className={styles.cardNote}>Based on your pace, project load, and rest patterns</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Energy Level</h2>
            <span className={styles.statusGood}>Good</span>
          </div>
          <div className={styles.metric}>
            <div className={styles.number}>{healthMetrics.energyLevel}%</div>
            <div className={styles.bar}>
              <div 
                className={styles.barFill} 
                style={{ width: `${healthMetrics.energyLevel}%`, background: '#4ade80' }}
              />
            </div>
          </div>
          <p className={styles.cardNote}>Trending stable over the past month</p>
        </div>

        <div className={styles.card}>
          <h2>Work Pace</h2>
          <div className={styles.paceIndicator}>
            <div className={styles.paceLabel}>{healthMetrics.pace}</div>
            <div className={styles.paceDetails}>
              {healthMetrics.weeklyHours} hours/week · {healthMetrics.projectLoad} active projects
            </div>
          </div>
          <p className={styles.cardNote}>Your current pace is sustainable for long-term work</p>
        </div>

        <div className={styles.card}>
          <h2>Rest & Recovery</h2>
          <div className={styles.restInfo}>
            <div className={styles.restStat}>
              <span className={styles.restLabel}>Last Break</span>
              <span className={styles.restValue}>{healthMetrics.lastBreak}</span>
            </div>
            <div className={styles.restStat}>
              <span className={styles.restLabel}>Recommended</span>
              <span className={styles.restValue}>1-2 days off/week</span>
            </div>
          </div>
          <button className={styles.button}>Schedule Break</button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Energy Trends</h2>
        <div className={styles.chart}>
          {energyTrend.map((data, index) => (
            <div key={index} className={styles.chartBar}>
              <div className={styles.chartLabel}>{data.week}</div>
              <div className={styles.chartBarBg}>
                <div 
                  className={styles.chartBarFill} 
                  style={{ height: `${data.energy}%` }}
                />
              </div>
              <div className={styles.chartValue}>{data.energy}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Recommendations</h2>
        <div className={styles.recommendations}>
          <div className={styles.recommendation}>
            <div className={styles.recommendationTitle}>Maintain Current Pace</div>
            <p>Your workload is balanced. Keep this rhythm to sustain long-term creativity.</p>
          </div>
          <div className={styles.recommendation}>
            <div className={styles.recommendationTitle}>Schedule Downtime</div>
            <p>Consider blocking off time this weekend for rest and reflection.</p>
          </div>
          <div className={styles.recommendation}>
            <div className={styles.recommendationTitle}>Project Rotation</div>
            <p>Rotate between projects to maintain freshness and avoid creative fatigue.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
