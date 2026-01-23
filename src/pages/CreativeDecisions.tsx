import { useState } from 'react'
import styles from './Placeholder.module.css'

// Creative Decision Systems
export function CreativeDecisions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'calibration' | 'bias' | 'replay' | 'intuition'>('calibration')

  const tasteCalibrations = [
    { id: '1', area: 'Visual Direction', calibration: 92, lastUpdate: '2026-01-20', alignment: 'High' },
    { id: '2', area: 'Material Selection', calibration: 88, lastUpdate: '2026-01-15', alignment: 'High' },
    { id: '3', area: 'Brand Messaging', calibration: 76, lastUpdate: '2026-01-10', alignment: 'Medium' },
  ]

  const biasDetections = [
    { id: '1', bias: 'Novelty Bias', detected: 'Medium', decisions: 12, impact: 'Moderate' },
    { id: '2', bias: 'Confirmation Bias', detected: 'Low', decisions: 5, impact: 'Low' },
    { id: '3', bias: 'Recency Bias', detected: 'High', decisions: 18, impact: 'High' },
  ]

  const decisionReplays = [
    { id: '1', decision: 'Collection pivot', date: '2025-12-10', outcome: 'Successful', wouldChange: false },
    { id: '2', decision: 'Manufacturing partner', date: '2025-11-05', outcome: 'Mixed', wouldChange: true },
    { id: '3', decision: 'Campaign direction', date: '2025-10-20', outcome: 'Successful', wouldChange: false },
  ]

  const intuitionTracking = [
    { id: '1', intuition: 'Sustainability focus timing', confidence: 95, result: 'Correct', value: 'Very High' },
    { id: '2', intuition: 'Product complexity level', confidence: 78, result: 'Correct', value: 'High' },
    { id: '3', intuition: 'Launch timing decision', confidence: 82, result: 'Incorrect', value: 'Medium' },
  ]

  const filteredCalibration = tasteCalibrations.filter(t =>
    t.area.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredBias = biasDetections.filter(b =>
    b.bias.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredReplay = decisionReplays.filter(d =>
    d.decision.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredIntuition = intuitionTracking.filter(i =>
    i.intuition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Creative Decision Systems</h1>
          <p className={styles.subtitle}>Taste calibration, bias detection, decision replay & intuition tracking</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Log decision')}>
          Log Decision
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search decisions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'calibration' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('calibration')}
        >
          Taste Calibration
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'bias' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bias')}
        >
          Bias Detection
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'replay' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('replay')}
        >
          Decision Replay
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'intuition' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('intuition')}
        >
          Intuition Tracker
        </button>
      </div>

      {activeTab === 'calibration' && (
        <div className={styles.grid}>
          {filteredCalibration.map(t => (
            <div key={t.id} className={styles.card}>
              <h3>{t.area}</h3>
              <p className={styles.meta}>Last updated: {new Date(t.lastUpdate).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Calibration</span>
                  <span className={styles.value}>{t.calibration}%</span>
                </div>
                <div>
                  <span className={styles.label}>Alignment</span>
                  <span className={styles.value}>{t.alignment}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Recalibrate ${t.area}`)}>
                Recalibrate
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bias' && (
        <div className={styles.grid}>
          {filteredBias.map(b => (
            <div key={b.id} className={styles.card}>
              <span className={styles.category}>{b.detected} Risk</span>
              <h3>{b.bias}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Decisions</span>
                  <span className={styles.value}>{b.decisions}</span>
                </div>
                <div>
                  <span className={styles.label}>Impact</span>
                  <span className={styles.value}>{b.impact}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Analyze ${b.bias}`)}>
                Analyze
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'replay' && (
        <div className={styles.grid}>
          {filteredReplay.map(d => (
            <div key={d.id} className={styles.card}>
              <span className={styles.category}>{d.outcome}</span>
              <h3>{d.decision}</h3>
              <p className={styles.meta}>{new Date(d.date).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Would Change</span>
                  <span className={styles.value}>{d.wouldChange ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Replay ${d.decision}`)}>
                Replay Decision
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'intuition' && (
        <div className={styles.grid}>
          {filteredIntuition.map(i => (
            <div key={i.id} className={styles.card}>
              <span className={styles.category}>{i.result}</span>
              <h3>{i.intuition}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Confidence</span>
                  <span className={styles.value}>{i.confidence}%</span>
                </div>
                <div>
                  <span className={styles.label}>Value</span>
                  <span className={styles.value}>{i.value}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Analyze ${i.intuition}`)}>
                Analyze
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Strategic Thinking Tools
export function StrategyTools() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'models' | 'effects' | 'timing' | 'confidence'>('models')

  const mentalModels = [
    { id: '1', model: 'First Principles Thinking', uses: 24, effectiveness: 92, category: 'Problem Solving' },
    { id: '2', model: 'Inversion', uses: 18, effectiveness: 88, category: 'Risk Management' },
    { id: '3', model: 'Circle of Competence', uses: 31, effectiveness: 94, category: 'Decision Making' },
  ]

  const secondOrderEffects = [
    { id: '1', action: 'Price increase', firstOrder: 'Revenue up', secondOrder: 'Brand positioning shift', risk: 'Medium' },
    { id: '2', action: 'Expand product line', firstOrder: 'More options', secondOrder: 'Diluted identity', risk: 'High' },
    { id: '3', action: 'Limit production', firstOrder: 'Scarcity', secondOrder: 'Exclusivity premium', risk: 'Low' },
  ]

  const filteredModels = mentalModels.filter(m =>
    m.model.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEffects = secondOrderEffects.filter(e =>
    e.action.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Strategic Thinking Tools</h1>
          <p className={styles.subtitle}>Mental models, second-order effects & long-term thinking</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Add mental model')}>
          Add Model
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search models and effects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'models' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('models')}
        >
          Mental Models
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'effects' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('effects')}
        >
          Second-Order Effects
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'timing' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('timing')}
        >
          Long-Term Thinking
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'confidence' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('confidence')}
        >
          Confidence Index
        </button>
      </div>

      {activeTab === 'models' && (
        <div className={styles.grid}>
          {filteredModels.map(m => (
            <div key={m.id} className={styles.card}>
              <span className={styles.category}>{m.category}</span>
              <h3>{m.model}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Uses</span>
                  <span className={styles.value}>{m.uses}</span>
                </div>
                <div>
                  <span className={styles.label}>Effectiveness</span>
                  <span className={styles.value}>{m.effectiveness}%</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Apply ${m.model}`)}>
                Apply Model
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'effects' && (
        <div className={styles.grid}>
          {filteredEffects.map(e => (
            <div key={e.id} className={styles.card}>
              <span className={styles.category}>{e.risk} Risk</span>
              <h3>{e.action}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>First Order</span>
                  <span className={styles.value}>{e.firstOrder}</span>
                </div>
                <div>
                  <span className={styles.label}>Second Order</span>
                  <span className={styles.value}>{e.secondOrder}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Simulate ${e.action}`)}>
                Simulate
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timing' && (
        <div className={styles.emptyState}>
          <p>Long-term thinking mode: 5-10 year horizon planning</p>
          <button className={styles.secondaryBtn} onClick={() => alert('Start long-term planning')}>
            Start Planning
          </button>
        </div>
      )}

      {activeTab === 'confidence' && (
        <div className={styles.emptyState}>
          <p>Track confidence levels across decisions over time</p>
          <button className={styles.secondaryBtn} onClick={() => alert('View confidence trends')}>
            View Trends
          </button>
        </div>
      )}
    </div>
  )
}
