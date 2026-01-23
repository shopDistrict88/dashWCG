import { useApp } from '../context/AppContext'
import styles from './Home.module.css'

export function Home() {
  const { user, dashboard } = useApp()

  // Calculate stats
  const activeProjects = dashboard.projects.filter((p) => p.status === 'active').length
  const publishedContent = dashboard.content.filter((c) => c.status === 'published').length
  const totalRevenue = dashboard.orders.reduce((sum, order) => sum + order.total, 0)
  const completedExperiments = dashboard.experiments.filter((e) => e.status === 'completed').length

  // Get recent activity (last 5 items)
  const recentActivity = dashboard.activity.slice(0, 5)

  // Recommendations based on usage
  const recommendations = []
  if (dashboard.projects.length === 0) recommendations.push('Create your first project to get started')
  if (dashboard.brands.length === 0) recommendations.push('Define your brand identity')
  if (dashboard.products.length === 0) recommendations.push('Add a product to start selling')
  if (dashboard.experiments.length === 0) recommendations.push('Run your first growth experiment')

  const stats = [
    { label: 'Active Projects', value: activeProjects },
    { label: 'Published Content', value: publishedContent },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}` },
    { label: 'Experiments', value: completedExperiments },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back, {user?.name}!</h1>
        <p className={styles.subtitle}>Your creative operating system</p>
      </div>

      {/* Focus Card */}
      <div className={styles.focusCard}>
        <h2 className={styles.focusTitle}>What are we building today?</h2>
        <div className={styles.focusContent}>
          {activeProjects > 0 ? (
            <p>You have {activeProjects} active project{activeProjects !== 1 ? 's' : ''} in progress</p>
          ) : (
            <p>Start by creating a new project or selecting an idea from your backlog</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>📦 New Project</h3>
            <p>Start a creative project</p>
          </div>
          <div className={styles.card}>
            <h3>✍️ Add Content</h3>
            <p>Create and plan content</p>
          </div>
          <div className={styles.card}>
            <h3>🎨 Build Brand</h3>
            <p>Define your identity</p>
          </div>
          <div className={styles.card}>
            <h3>🚀 Launch</h3>
            <p>Create landing page</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Smart Recommendations</h2>
          <div className={styles.recommendations}>
            {recommendations.map((rec, i) => (
              <div key={i} className={styles.recommendation}>
                <span className={styles.recommendationIcon}>💡</span>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className={styles.empty}>No activity yet. Start creating!</p>
        ) : (
          <div className={styles.activity}>
            {recentActivity.map((item) => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityMeta}>
                  <p className={styles.activityTitle}>{item.title}</p>
                  <p className={styles.activityType}>{item.type}</p>
                </div>
                <p className={styles.activityTime}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
