import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Business.module.css'

interface MonthlyMetric {
  month: string
  revenue: number
  expenses: number
  newCustomers: number
}

export function Business() {
  const { addToast } = useApp()
  const [metrics, setMetrics] = useState<MonthlyMetric[]>([
    { month: 'January', revenue: 5000, expenses: 2000, newCustomers: 12 },
    { month: 'February', revenue: 7500, expenses: 2500, newCustomers: 18 },
    { month: 'March', revenue: 9200, expenses: 3000, newCustomers: 22 },
  ])

  const calculateHealthScore = (): { score: number; status: string; metrics: { label: string; value: string }[] } => {
    let score = 50

    // Revenue growth
    if (metrics.length >= 2) {
      const revenueGrowth = ((metrics[metrics.length - 1].revenue - metrics[metrics.length - 2].revenue) / metrics[metrics.length - 2].revenue) * 100
      if (revenueGrowth > 20) score += 20
      else if (revenueGrowth > 10) score += 10
    }

    // Profitability
    const latestMonth = metrics[metrics.length - 1]
    const profit = latestMonth.revenue - latestMonth.expenses
    const marginPercent = (profit / latestMonth.revenue) * 100
    if (marginPercent > 40) score += 20
    else if (marginPercent > 20) score += 10

    // Customer growth
    if (metrics.length >= 2) {
      const customerGrowth = ((metrics[metrics.length - 1].newCustomers - metrics[metrics.length - 2].newCustomers) / metrics[metrics.length - 2].newCustomers) * 100
      if (customerGrowth > 15) score += 10
    }

    const status = score >= 70 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Attention'
    
    const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0)
    const totalExpenses = metrics.reduce((sum, m) => sum + m.expenses, 0)
    const avgMargin = ((totalRevenue - totalExpenses) / totalRevenue) * 100

    return {
      score: Math.min(100, score),
      status,
      metrics: [
        { label: 'Monthly Revenue', value: `$${latestMonth.revenue.toLocaleString()}` },
        { label: 'Profit Margin', value: `${avgMargin.toFixed(1)}%` },
        { label: 'Total Customers', value: `${metrics.reduce((sum, m) => sum + m.newCustomers, 0)}` },
      ],
    }
  }

  const health = calculateHealthScore()

  const handleAddMonth = () => {
    const newMonth: MonthlyMetric = {
      month: `Month ${metrics.length + 1}`,
      revenue: 10000,
      expenses: 3000,
      newCustomers: 25,
    }
    setMetrics([...metrics, newMonth])
    addToast('Month added', 'success')
  }

  const handleUpdateMetric = (index: number, field: 'month' | 'revenue' | 'expenses' | 'newCustomers', value: string | number) => {
    const updated = [...metrics]
    if (field === 'month') {
      updated[index].month = value as string
    } else {
      updated[index][field] = typeof value === 'string' ? parseFloat(value) : value
    }
    setMetrics(updated)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Business Management</h1>
        <p className={styles.subtitle}>Track health, metrics, and performance</p>
      </div>

      <div className={styles.mainContent}>
        {/* Business Health */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Business Health Score</h2>
          <div className={styles.healthCard}>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreNumber}>{health.score}</div>
              <div className={styles.scoreLabel}>{health.status}</div>
            </div>
            <div className={styles.healthMetrics}>
              {health.metrics.map((m, i) => (
                <div key={i} className={styles.metricBox}>
                  <span className={styles.metricLabel}>{m.label}</span>
                  <span className={styles.metricValue}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Metrics */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Monthly Performance</h2>
            <button onClick={handleAddMonth} className={styles.smallButton}>
              + Add Month
            </button>
          </div>

          <div className={styles.metricsTable}>
            <div className={styles.tableRow}>
              <div className={styles.tableHeader}>Month</div>
              <div className={styles.tableHeader}>Revenue</div>
              <div className={styles.tableHeader}>Expenses</div>
              <div className={styles.tableHeader}>Profit</div>
              <div className={styles.tableHeader}>Customers</div>
            </div>

            {metrics.map((month, idx) => {
              const profit = month.revenue - month.expenses
              return (
                <div key={idx} className={styles.tableRow}>
                  <div className={styles.tableCell}>
                    <input
                      type="text"
                      value={month.month}
                      onChange={(e) => handleUpdateMetric(idx, 'month', e.target.value as any)}
                      className={styles.cellInput}
                    />
                  </div>
                  <div className={styles.tableCell}>
                    <input
                      type="number"
                      value={month.revenue}
                      onChange={(e) => handleUpdateMetric(idx, 'revenue', parseFloat(e.target.value))}
                      className={styles.cellInput}
                    />
                  </div>
                  <div className={styles.tableCell}>
                    <input
                      type="number"
                      value={month.expenses}
                      onChange={(e) => handleUpdateMetric(idx, 'expenses', parseFloat(e.target.value))}
                      className={styles.cellInput}
                    />
                  </div>
                  <div className={styles.tableCell}>
                    <span className={profit > 0 ? styles.profitPositive : styles.profitNegative}>
                      ${profit.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    <input
                      type="number"
                      value={month.newCustomers}
                      onChange={(e) => handleUpdateMetric(idx, 'newCustomers', parseFloat(e.target.value))}
                      className={styles.cellInput}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <div className={styles.actionCard}>
              <h3>📊 Generate Report</h3>
              <p>Create monthly performance report</p>
              <button className={styles.actionButton}>Generate</button>
            </div>
            <div className={styles.actionCard}>
              <h3>💰 Set Budget</h3>
              <p>Plan budget for next month</p>
              <button className={styles.actionButton}>Set Budget</button>
            </div>
            <div className={styles.actionCard}>
              <h3>🎯 Set Goals</h3>
              <p>Define quarterly targets</p>
              <button className={styles.actionButton}>Set Goals</button>
            </div>
            <div className={styles.actionCard}>
              <h3>📈 Analyze</h3>
              <p>View trend analysis</p>
              <button className={styles.actionButton}>Analyze</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
