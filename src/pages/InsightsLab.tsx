import { useState } from 'react'
import styles from './InsightsLab.module.css'

export default function InsightsLab() {
  const [metrics] = useState({
    totalReach: 145820,
    engagement: 8.4,
    growth: 12.3,
    momentum: 74,
  })

  const [insights] = useState([
    {
      id: 1,
      title: 'Content Performance Peak',
      description: 'Your posts between 6-8 PM consistently outperform morning content by 34%',
      impact: 'High',
      actionable: true,
    },
    {
      id: 2,
      title: 'Audience Quality Over Quantity',
      description: 'Your smaller, engaged audience (15K) generates more meaningful interactions than larger accounts',
      impact: 'Medium',
      actionable: false,
    },
    {
      id: 3,
      title: 'Long-Form Content Trend',
      description: 'Multi-image posts and carousels drive 2.5x more saves and shares',
      impact: 'High',
      actionable: true,
    },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Insights Lab</h1>
        <p>Deep analytics focused on signal over noise</p>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Reach</div>
          <div className={styles.metricValue}>{metrics.totalReach.toLocaleString()}</div>
          <div className={styles.metricChange}>+12.3% vs last month</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Engagement Rate</div>
          <div className={styles.metricValue}>{metrics.engagement}%</div>
          <div className={styles.metricChange}>+2.1% vs last month</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Growth Rate</div>
          <div className={styles.metricValue}>{metrics.growth}%</div>
          <div className={styles.metricChange}>+5.4% vs last month</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Momentum Score</div>
          <div className={styles.metricValue}>{metrics.momentum}</div>
          <div className={styles.metricChange}>Strong</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Key Insights</h2>
        <div className={styles.insights}>
          {insights.map(insight => (
            <div key={insight.id} className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <div className={styles.insightTitle}>{insight.title}</div>
                <span className={insight.impact === 'High' ? styles.impactHigh : styles.impactMedium}>
                  {insight.impact} Impact
                </span>
              </div>
              <p className={styles.insightDescription}>{insight.description}</p>
              {insight.actionable && (
                <button className={styles.actionButton}>Take Action</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Long-Term Trends</h2>
        <div className={styles.trendsCard}>
          <div className={styles.trendItem}>
            <div className={styles.trendLabel}>Audience Trust</div>
            <div className={styles.trendGraph}>
              <div className={styles.trendLine} style={{ width: '78%' }} />
            </div>
            <div className={styles.trendValue}>78%</div>
          </div>
          <div className={styles.trendItem}>
            <div className={styles.trendLabel}>Content Consistency</div>
            <div className={styles.trendGraph}>
              <div className={styles.trendLine} style={{ width: '85%' }} />
            </div>
            <div className={styles.trendValue}>85%</div>
          </div>
          <div className={styles.trendItem}>
            <div className={styles.trendLabel}>Brand Clarity</div>
            <div className={styles.trendGraph}>
              <div className={styles.trendLine} style={{ width: '92%' }} />
            </div>
            <div className={styles.trendValue}>92%</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Signal-Only Mode</h2>
        <div className={styles.signalCard}>
          <div className={styles.signalHeader}>
            <div>
              <h3>Hide Vanity Metrics</h3>
              <p>Focus on meaningful signals instead of likes and follower counts</p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className={styles.signalInfo}>
            <div className={styles.signalItem}>
              <span className={styles.signalIcon}>✓</span>
              <span>Engagement quality</span>
            </div>
            <div className={styles.signalItem}>
              <span className={styles.signalIcon}>✓</span>
              <span>Audience trust</span>
            </div>
            <div className={styles.signalItem}>
              <span className={styles.signalIcon}>✓</span>
              <span>Long-term growth</span>
            </div>
            <div className={styles.signalItem}>
              <span className={styles.signalIcon}>✗</span>
              <span>Like counts</span>
            </div>
            <div className={styles.signalItem}>
              <span className={styles.signalIcon}>✗</span>
              <span>Follower numbers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
