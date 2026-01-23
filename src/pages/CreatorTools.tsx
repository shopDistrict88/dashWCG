import { useState } from 'react'
import styles from './CreatorTools.module.css'

interface Tool {
  id: string
  name: string
  description: string
  category: 'analytics' | 'planning' | 'productivity' | 'growth' | 'archive'
  status?: 'active' | 'disabled'
}

const CREATOR_TOOLS: Tool[] = [
  { id: '1', name: 'Performance Score', description: 'Overall creator performance rating', category: 'analytics' },
  { id: '2', name: 'Weekly Growth Summary', description: 'Automated weekly progress reports', category: 'analytics' },
  { id: '3', name: 'Monthly Creative Review', description: 'Deep dive into monthly performance', category: 'analytics' },
  { id: '4', name: 'Creative Goal Tracking', description: 'Set and track creative objectives', category: 'planning' },
  { id: '5', name: 'Focus Mode', description: 'Distraction-free workspace', category: 'productivity' },
  { id: '6', name: 'Time Tracking', description: 'Track creative work hours', category: 'productivity' },
  { id: '7', name: 'Cross-Platform Comparison', description: 'Compare performance across platforms', category: 'analytics' },
  { id: '8', name: 'Collaboration Requests', description: 'Manage collab opportunities', category: 'growth' },
  { id: '9', name: 'Creative Briefs Generator', description: 'AI-powered project briefs', category: 'planning' },
  { id: '10', name: 'Release Retrospectives', description: 'Analyze past releases', category: 'analytics' },
  { id: '11', name: 'Audience Sentiment Analysis', description: 'Understand audience feedback', category: 'analytics' },
  { id: '12', name: 'Comment Keyword Analysis', description: 'Extract insights from comments', category: 'analytics' },
  { id: '13', name: 'Drop Calendar', description: 'Schedule and plan releases', category: 'planning' },
  { id: '14', name: 'Personal Archive Mode', description: 'Private creative vault', category: 'archive' },
  { id: '15', name: 'Private Drafts Space', description: 'Work-in-progress storage', category: 'archive' },
  { id: '16', name: 'Version History', description: 'Track content iterations', category: 'archive' },
  { id: '17', name: 'AI Trend Alerts', description: 'Get notified of trending topics', category: 'growth' },
  { id: '18', name: 'Creator Roadmap', description: 'Visualize your creative journey', category: 'planning' },
  { id: '19', name: 'Brand Consistency Score', description: 'Measure brand alignment', category: 'analytics' },
  { id: '20', name: 'Licensing Readiness Check', description: 'Prepare work for licensing', category: 'planning' },
  { id: '21', name: 'Media Kit Generator', description: 'Auto-generate press kits', category: 'growth' },
  { id: '22', name: 'Cross-Posting Preview', description: 'See content across platforms', category: 'productivity' },
  { id: '23', name: 'Burnout Detection', description: 'Monitor creative wellness', category: 'productivity' },
  { id: '24', name: 'Inspiration Recommendations', description: 'AI-curated inspiration', category: 'growth' },
  { id: '25', name: 'Skill Gap Identification', description: 'Identify areas to improve', category: 'growth' },
  { id: '26', name: 'Learning Path Suggestions', description: 'Personalized learning roadmaps', category: 'growth' },
  { id: '27', name: 'Creative Experiment Tracking', description: 'Track A/B tests and experiments', category: 'analytics' },
  { id: '28', name: 'Audience Feedback Summaries', description: 'Aggregated feedback insights', category: 'analytics' },
  { id: '29', name: 'Long-Term Growth Projection', description: 'Forecast future growth', category: 'analytics' },
  { id: '30', name: 'Creator Legacy Archive', description: 'Document your creative legacy', category: 'archive' },
]

export function CreatorTools() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', label: 'All Tools', count: CREATOR_TOOLS.length },
    { id: 'analytics', label: 'Analytics', count: CREATOR_TOOLS.filter(t => t.category === 'analytics').length },
    { id: 'planning', label: 'Planning', count: CREATOR_TOOLS.filter(t => t.category === 'planning').length },
    { id: 'productivity', label: 'Productivity', count: CREATOR_TOOLS.filter(t => t.category === 'productivity').length },
    { id: 'growth', label: 'Growth', count: CREATOR_TOOLS.filter(t => t.category === 'growth').length },
    { id: 'archive', label: 'Archive', count: CREATOR_TOOLS.filter(t => t.category === 'archive').length },
  ]

  const filteredTools = CREATOR_TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleToolClick = (tool: Tool) => {
    console.log('Opening tool:', tool.name)
    // In production, this would navigate to the tool or open a modal
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Creator Tools</h1>
          <p className={styles.subtitle}>30+ tools to support your creative journey</p>
        </div>
      </header>

      {/* Search and Filter */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={selectedCategory === cat.id ? styles.active : ''}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className={styles.toolsGrid}>
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className={styles.toolCard}
            onClick={() => handleToolClick(tool)}
          >
            <div className={styles.toolHeader}>
              <h3>{tool.name}</h3>
              <span className={`${styles.categoryBadge} ${styles[tool.category]}`}>
                {tool.category}
              </span>
            </div>
            <p className={styles.toolDescription}>{tool.description}</p>
            <button className={styles.launchBtn}>Launch Tool</button>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className={styles.emptyState}>
          <p>No tools found matching your search</p>
        </div>
      )}

      {/* Featured Tools */}
      <section className={styles.featuredSection}>
        <h2>Most Used Tools</h2>
        <div className={styles.featuredGrid}>
          <div className={styles.featuredCard}>
            <h3>Performance Score</h3>
            <div className={styles.scoreDisplay}>
              <span className={styles.score}>82</span>
              <span className={styles.scoreLabel}>/ 100</span>
            </div>
            <p className={styles.scoreInsight}>+5 points from last week</p>
          </div>

          <div className={styles.featuredCard}>
            <h3>Focus Mode</h3>
            <p>Eliminate distractions and enter deep work</p>
            <button className={styles.enableBtn}>Enable Now</button>
          </div>

          <div className={styles.featuredCard}>
            <h3>AI Trend Alerts</h3>
            <div className={styles.trendsList}>
              <div className={styles.trendItem}>
                <span>Minimal design</span>
                <span className={styles.trending}>Trending</span>
              </div>
              <div className={styles.trendItem}>
                <span>Lo-fi music</span>
                <span className={styles.trending}>Hot</span>
              </div>
            </div>
          </div>

          <div className={styles.featuredCard}>
            <h3>Weekly Summary</h3>
            <div className={styles.summaryStats}>
              <div className={styles.summaryStat}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.statValue}>45K</span>
                <span className={styles.statLabel}>Views</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
