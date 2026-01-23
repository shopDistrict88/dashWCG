import { useState } from 'react'
import styles from './Placeholder.module.css'

// Creative Intelligence Hub - Advanced creative analytics and monitoring
export function CreativeIntelligence() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'momentum' | 'trust' | 'impact' | 'drift'>('momentum')

  const momentumData = [
    { id: '1', metric: 'Output Velocity', score: 87, trend: 'Rising', period: 'Last 30 days' },
    { id: '2', metric: 'Quality Consistency', score: 92, trend: 'Stable', period: 'Last 30 days' },
    { id: '3', metric: 'Creative Flow', score: 78, trend: 'Rising', period: 'Last 30 days' },
  ]

  const trustScores = [
    { id: '1', audience: 'Core Followers', score: 94, change: '+3', engagement: 'Very High' },
    { id: '2', audience: 'New Audience', score: 72, change: '+8', engagement: 'Growing' },
    { id: '3', audience: 'Industry Peers', score: 88, change: '+1', engagement: 'High' },
  ]

  const impactCurves = [
    { id: '1', release: 'Fall Collection 2025', peak: 'Week 3', decay: 'Slow', longTerm: 92 },
    { id: '2', release: 'Brand Campaign', peak: 'Week 1', decay: 'Fast', longTerm: 68 },
    { id: '3', release: 'Collaboration Drop', peak: 'Week 2', decay: 'Medium', longTerm: 84 },
  ]

  const driftDetection = [
    { id: '1', element: 'Visual Identity', drift: 'Low', lastCheck: '2026-01-20', status: 'Aligned' },
    { id: '2', element: 'Tone of Voice', drift: 'Medium', lastCheck: '2026-01-15', status: 'Monitor' },
    { id: '3', element: 'Brand Values', drift: 'None', lastCheck: '2026-01-22', status: 'Locked' },
  ]

  const filteredMomentum = momentumData.filter(m =>
    m.metric.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTrust = trustScores.filter(t =>
    t.audience.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredImpact = impactCurves.filter(i =>
    i.release.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDrift = driftDetection.filter(d =>
    d.element.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Creative Intelligence</h1>
          <p className={styles.subtitle}>Momentum tracking, trust scoring & brand drift detection</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Generate intelligence report')}>
          Generate Report
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search metrics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'momentum' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('momentum')}
        >
          Creative Momentum
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'trust' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('trust')}
        >
          Audience Trust
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'impact' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          Release Impact
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'drift' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('drift')}
        >
          Brand Drift
        </button>
      </div>

      {activeTab === 'momentum' && (
        <div className={styles.grid}>
          {filteredMomentum.map(m => (
            <div key={m.id} className={styles.card}>
              <h3>{m.metric}</h3>
              <p className={styles.meta}>{m.period}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Score</span>
                  <span className={styles.value}>{m.score}/100</span>
                </div>
                <div>
                  <span className={styles.label}>Trend</span>
                  <span className={styles.value}>{m.trend}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${m.metric} details`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'trust' && (
        <div className={styles.grid}>
          {filteredTrust.map(t => (
            <div key={t.id} className={styles.card}>
              <h3>{t.audience}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Trust Score</span>
                  <span className={styles.value}>{t.score}/100</span>
                </div>
                <div>
                  <span className={styles.label}>Change</span>
                  <span className={styles.value}>{t.change}</span>
                </div>
                <div>
                  <span className={styles.label}>Engagement</span>
                  <span className={styles.value}>{t.engagement}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Analyze ${t.audience}`)}>
                Analyze
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'impact' && (
        <div className={styles.grid}>
          {filteredImpact.map(i => (
            <div key={i.id} className={styles.card}>
              <h3>{i.release}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Peak</span>
                  <span className={styles.value}>{i.peak}</span>
                </div>
                <div>
                  <span className={styles.label}>Decay</span>
                  <span className={styles.value}>{i.decay}</span>
                </div>
                <div>
                  <span className={styles.label}>Long-term</span>
                  <span className={styles.value}>{i.longTerm}/100</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${i.release} curve`)}>
                View Curve
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'drift' && (
        <div className={styles.grid}>
          {filteredDrift.map(d => (
            <div key={d.id} className={styles.card}>
              <span className={styles.category}>{d.status}</span>
              <h3>{d.element}</h3>
              <p className={styles.meta}>Last checked: {new Date(d.lastCheck).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Drift Level</span>
                  <span className={styles.value}>{d.drift}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Analyze ${d.element} drift`)}>
                Analyze Drift
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Quiet Wins & Signal Tracking
export function QuietWins() {
  const [searchQuery, setSearchQuery] = useState('')

  const wins = [
    { id: '1', win: 'Consistency milestone: 90 days', date: '2026-01-22', visibility: 'Private', impact: 'High' },
    { id: '2', win: 'Quality improvement detected', date: '2026-01-18', visibility: 'Team', impact: 'Medium' },
    { id: '3', win: 'Process optimization complete', date: '2026-01-10', visibility: 'Private', impact: 'Very High' },
  ]

  const filteredWins = wins.filter(w =>
    w.win.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Quiet Wins Tracker</h1>
          <p className={styles.subtitle}>Non-public achievements and internal progress</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Log quiet win')}>
          Log Win
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search wins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.grid}>
        {filteredWins.map(w => (
          <div key={w.id} className={styles.card}>
            <span className={styles.category}>{w.visibility}</span>
            <h3>{w.win}</h3>
            <p className={styles.meta}>{new Date(w.date).toLocaleDateString()}</p>
            <div className={styles.metrics}>
              <div>
                <span className={styles.label}>Impact</span>
                <span className={styles.value}>{w.impact}</span>
              </div>
            </div>
            <button className={styles.secondaryBtn} onClick={() => alert(`View ${w.win}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Idea Management System
export function IdeaManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'dormant' | 'compression' | 'expansion'>('dormant')

  const dormantIdeas = [
    { id: '1', idea: 'Modular product system', dormant: '45 days', potential: 'High', revivedCount: 2 },
    { id: '2', idea: 'Sustainable packaging redesign', dormant: '120 days', potential: 'Medium', revivedCount: 0 },
    { id: '3', idea: 'Collaboration framework', dormant: '30 days', potential: 'Very High', revivedCount: 1 },
  ]

  const filteredIdeas = dormantIdeas.filter(i =>
    i.idea.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Idea Management</h1>
          <p className={styles.subtitle}>Dormancy tracking, compression & expansion tools</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Add idea')}>
          Add Idea
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'dormant' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('dormant')}
        >
          Dormant Ideas
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'compression' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('compression')}
        >
          Compression Lab
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'expansion' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('expansion')}
        >
          Expansion Lab
        </button>
      </div>

      {activeTab === 'dormant' && (
        <div className={styles.grid}>
          {filteredIdeas.map(i => (
            <div key={i.id} className={styles.card}>
              <h3>{i.idea}</h3>
              <p className={styles.meta}>Dormant for {i.dormant}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Potential</span>
                  <span className={styles.value}>{i.potential}</span>
                </div>
                <div>
                  <span className={styles.label}>Revived</span>
                  <span className={styles.value}>{i.revivedCount}x</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Revive ${i.idea}`)}>
                Revive Idea
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'compression' && (
        <div className={styles.emptyState}>
          <p>Compress complex ideas into core concepts</p>
          <button className={styles.secondaryBtn} onClick={() => alert('Start compression')}>
            Start Compression
          </button>
        </div>
      )}

      {activeTab === 'expansion' && (
        <div className={styles.emptyState}>
          <p>Expand concepts into detailed frameworks</p>
          <button className={styles.secondaryBtn} onClick={() => alert('Start expansion')}>
            Start Expansion
          </button>
        </div>
      )}
    </div>
  )
}
