import { useState } from 'react'
import styles from './Placeholder.module.css'

// Product Intelligence Systems
export function ProductIntelligence() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'dna' | 'lifecycle' | 'fit' | 'drop'>('dna')

  const collectionDNA = [
    { id: '1', collection: 'Monochrome Foundation', dna: 'Minimalist utility', consistency: 96, evolution: 'Stable' },
    { id: '2', collection: 'Technical Silence', dna: 'Performance elegance', consistency: 92, evolution: 'Evolving' },
    { id: '3', collection: 'Urban Systems', dna: 'Modular functionality', consistency: 88, evolution: 'Emerging' },
  ]

  const lifecycle = [
    { id: '1', product: 'Core Jacket', stage: 'Mature', lifespan: '24 months', value: 'Very High' },
    { id: '2', product: 'Tech Vest', stage: 'Growth', lifespan: '12 months', value: 'High' },
    { id: '3', product: 'Minimal Bag', stage: 'Introduction', lifespan: '6 months', value: 'Medium' },
  ]

  const fitIntelligence = [
    { id: '1', garment: 'Overshirt', fitScore: 94, returns: '2%', adjustments: 'Minor' },
    { id: '2', garment: 'Cargo Pant', fitScore: 88, returns: '5%', adjustments: 'Moderate' },
    { id: '3', garment: 'Technical Jacket', fitScore: 96, returns: '1%', adjustments: 'None' },
  ]

  const dropSimulations = [
    { id: '1', drop: 'Limited Edition 100', scarcity: 'Very High', demand: 'Predicted High', pricing: 'Premium' },
    { id: '2', drop: 'Core Restock 500', scarcity: 'Low', demand: 'Steady', pricing: 'Standard' },
    { id: '3', drop: 'Collaboration 250', scarcity: 'High', demand: 'Predicted Very High', pricing: 'Ultra Premium' },
  ]

  const filteredDNA = collectionDNA.filter(c =>
    c.collection.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLifecycle = lifecycle.filter(l =>
    l.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFit = fitIntelligence.filter(f =>
    f.garment.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDrop = dropSimulations.filter(d =>
    d.drop.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Product Intelligence</h1>
          <p className={styles.subtitle}>Collection DNA, lifecycle tracking, fit intelligence & drop simulation</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Analyze product')}>
          Analyze Product
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'dna' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('dna')}
        >
          Collection DNA
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'lifecycle' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('lifecycle')}
        >
          Lifecycle Tracker
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'fit' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('fit')}
        >
          Fit Intelligence
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'drop' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('drop')}
        >
          Drop Simulator
        </button>
      </div>

      {activeTab === 'dna' && (
        <div className={styles.grid}>
          {filteredDNA.map(c => (
            <div key={c.id} className={styles.card}>
              <h3>{c.collection}</h3>
              <p className={styles.meta}>{c.dna}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Consistency</span>
                  <span className={styles.value}>{c.consistency}%</span>
                </div>
                <div>
                  <span className={styles.label}>Evolution</span>
                  <span className={styles.value}>{c.evolution}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Analyze ${c.collection}`)}>
                Analyze DNA
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'lifecycle' && (
        <div className={styles.grid}>
          {filteredLifecycle.map(l => (
            <div key={l.id} className={styles.card}>
              <span className={styles.category}>{l.stage}</span>
              <h3>{l.product}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Lifespan</span>
                  <span className={styles.value}>{l.lifespan}</span>
                </div>
                <div>
                  <span className={styles.label}>Value</span>
                  <span className={styles.value}>{l.value}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Track ${l.product}`)}>
                Track Lifecycle
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'fit' && (
        <div className={styles.grid}>
          {filteredFit.map(f => (
            <div key={f.id} className={styles.card}>
              <h3>{f.garment}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Fit Score</span>
                  <span className={styles.value}>{f.fitScore}/100</span>
                </div>
                <div>
                  <span className={styles.label}>Returns</span>
                  <span className={styles.value}>{f.returns}</span>
                </div>
                <div>
                  <span className={styles.label}>Adjustments</span>
                  <span className={styles.value}>{f.adjustments}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${f.garment} feedback`)}>
                View Feedback
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'drop' && (
        <div className={styles.grid}>
          {filteredDrop.map(d => (
            <div key={d.id} className={styles.card}>
              <h3>{d.drop}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Scarcity</span>
                  <span className={styles.value}>{d.scarcity}</span>
                </div>
                <div>
                  <span className={styles.label}>Demand</span>
                  <span className={styles.value}>{d.demand}</span>
                </div>
                <div>
                  <span className={styles.label}>Pricing</span>
                  <span className={styles.value}>{d.pricing}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Simulate ${d.drop}`)}>
                Run Simulation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Ethical & Quality Systems
export function QualityEthics() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'ethics' | 'counterfeit' | 'plagiarism'>('ethics')

  const ethicalImpact = [
    { id: '1', metric: 'Supply Chain Transparency', score: 94, trend: 'Improving', lastAudit: '2026-01-15' },
    { id: '2', metric: 'Worker Conditions', score: 96, trend: 'Stable', lastAudit: '2026-01-10' },
    { id: '3', metric: 'Environmental Impact', score: 88, trend: 'Improving', lastAudit: '2026-01-05' },
  ]

  const counterfeitRisks = [
    { id: '1', product: 'Signature Jacket', risk: 'Medium', monitoring: 'Active', incidents: 3 },
    { id: '2', product: 'Core Bag', risk: 'Low', monitoring: 'Active', incidents: 0 },
    { id: '3', product: 'Limited Edition', risk: 'High', monitoring: 'Enhanced', incidents: 7 },
  ]

  const plagiarismDetection = [
    { id: '1', design: 'Minimal Overshirt', similarity: 'None', monitored: true, lastCheck: '2026-01-20' },
    { id: '2', design: 'Technical Vest', similarity: 'Low', monitored: true, lastCheck: '2026-01-18' },
    { id: '3', design: 'Modular System', similarity: 'None', monitored: true, lastCheck: '2026-01-15' },
  ]

  const filteredEthics = ethicalImpact.filter(e =>
    e.metric.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCounterfeit = counterfeitRisks.filter(c =>
    c.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPlagiarism = plagiarismDetection.filter(p =>
    p.design.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Quality & Ethics</h1>
          <p className={styles.subtitle}>Ethical impact, counterfeit monitoring & plagiarism detection</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Run audit')}>
          Run Audit
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search monitoring systems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'ethics' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('ethics')}
        >
          Ethical Impact
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'counterfeit' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('counterfeit')}
        >
          Counterfeit Monitor
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'plagiarism' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('plagiarism')}
        >
          Plagiarism Detection
        </button>
      </div>

      {activeTab === 'ethics' && (
        <div className={styles.grid}>
          {filteredEthics.map(e => (
            <div key={e.id} className={styles.card}>
              <h3>{e.metric}</h3>
              <p className={styles.meta}>Last audit: {new Date(e.lastAudit).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Score</span>
                  <span className={styles.value}>{e.score}/100</span>
                </div>
                <div>
                  <span className={styles.label}>Trend</span>
                  <span className={styles.value}>{e.trend}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${e.metric} details`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'counterfeit' && (
        <div className={styles.grid}>
          {filteredCounterfeit.map(c => (
            <div key={c.id} className={styles.card}>
              <span className={styles.category}>{c.risk} Risk</span>
              <h3>{c.product}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Monitoring</span>
                  <span className={styles.value}>{c.monitoring}</span>
                </div>
                <div>
                  <span className={styles.label}>Incidents</span>
                  <span className={styles.value}>{c.incidents}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Monitor ${c.product}`)}>
                View Reports
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'plagiarism' && (
        <div className={styles.grid}>
          {filteredPlagiarism.map(p => (
            <div key={p.id} className={styles.card}>
              <h3>{p.design}</h3>
              <p className={styles.meta}>Last check: {new Date(p.lastCheck).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Similarity</span>
                  <span className={styles.value}>{p.similarity}</span>
                </div>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{p.monitored ? 'Monitored' : 'Unmonitored'}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Scan ${p.design}`)}>
                Run Scan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
