import { useState } from 'react'
import styles from './Placeholder.module.css'

// Brand Identity Systems
export function BrandIdentity() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'mythology' | 'language' | 'symbols' | 'silence'>('mythology')

  const mythologyElements = [
    { id: '1', element: 'Origin Story', strength: 95, documented: true, consistency: 'Very High' },
    { id: '2', element: 'Core Values', strength: 92, documented: true, consistency: 'High' },
    { id: '3', element: 'Brand Archetypes', strength: 88, documented: true, consistency: 'High' },
  ]

  const languageSystem = [
    { id: '1', term: 'Technical Silence', usage: 'Core positioning', locked: true, alternatives: 0 },
    { id: '2', term: 'Quiet Luxury', usage: 'Product description', locked: true, alternatives: 2 },
    { id: '3', term: 'Institutional Quality', usage: 'Brand values', locked: false, alternatives: 1 },
  ]

  const symbols = [
    { id: '1', symbol: 'Primary Mark', usage: 'Primary branding', protection: 'Trademarked', versions: 3 },
    { id: '2', symbol: 'Secondary Mark', usage: 'Product labels', protection: 'Registered', versions: 2 },
    { id: '3', symbol: 'Pattern System', usage: 'Textiles', protection: 'Design Patent', versions: 5 },
  ]

  const silenceStrategies = [
    { id: '1', strategy: 'No social media Sundays', active: true, impact: 'High', adherence: 98 },
    { id: '2', strategy: 'Quarterly quiet periods', active: true, impact: 'Medium', adherence: 95 },
    { id: '3', strategy: 'Private product previews', active: true, impact: 'Very High', adherence: 100 },
  ]

  const filteredMythology = mythologyElements.filter(m =>
    m.element.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLanguage = languageSystem.filter(l =>
    l.term.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSymbols = symbols.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSilence = silenceStrategies.filter(s =>
    s.strategy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Brand Identity Systems</h1>
          <p className={styles.subtitle}>Mythology, language, symbols & strategic silence</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Add brand element')}>
          Add Element
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search brand elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'mythology' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('mythology')}
        >
          Brand Mythology
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'language' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('language')}
        >
          Language System
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'symbols' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('symbols')}
        >
          Symbols & Icons
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'silence' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('silence')}
        >
          Strategic Silence
        </button>
      </div>

      {activeTab === 'mythology' && (
        <div className={styles.grid}>
          {filteredMythology.map(m => (
            <div key={m.id} className={styles.card}>
              <h3>{m.element}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Strength</span>
                  <span className={styles.value}>{m.strength}%</span>
                </div>
                <div>
                  <span className={styles.label}>Consistency</span>
                  <span className={styles.value}>{m.consistency}</span>
                </div>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{m.documented ? 'Documented' : 'Draft'}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Edit ${m.element}`)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'language' && (
        <div className={styles.grid}>
          {filteredLanguage.map(l => (
            <div key={l.id} className={styles.card}>
              <span className={styles.category}>{l.locked ? 'Locked' : 'Flexible'}</span>
              <h3>{l.term}</h3>
              <p className={styles.meta}>{l.usage}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Alternatives</span>
                  <span className={styles.value}>{l.alternatives}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Manage ${l.term}`)}>
                Manage
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'symbols' && (
        <div className={styles.grid}>
          {filteredSymbols.map(s => (
            <div key={s.id} className={styles.card}>
              <span className={styles.category}>{s.protection}</span>
              <h3>{s.symbol}</h3>
              <p className={styles.meta}>{s.usage}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Versions</span>
                  <span className={styles.value}>{s.versions}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${s.symbol} vault`)}>
                View Vault
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'silence' && (
        <div className={styles.grid}>
          {filteredSilence.map(s => (
            <div key={s.id} className={styles.card}>
              <span className={styles.category}>{s.active ? 'Active' : 'Paused'}</span>
              <h3>{s.strategy}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Impact</span>
                  <span className={styles.value}>{s.impact}</span>
                </div>
                <div>
                  <span className={styles.label}>Adherence</span>
                  <span className={styles.value}>{s.adherence}%</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Configure ${s.strategy}`)}>
                Configure
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Cultural & Risk Systems
export function CulturalRisk() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'cultural' | 'legacy' | 'horizon'>('cultural')

  const culturalRisks = [
    { id: '1', risk: 'Trend appropriation', level: 'Low', monitoring: 'Active', lastReview: '2026-01-20' },
    { id: '2', risk: 'Message misalignment', level: 'Medium', monitoring: 'Active', lastReview: '2026-01-18' },
    { id: '3', risk: 'Cultural insensitivity', level: 'Low', monitoring: 'Active', lastReview: '2026-01-15' },
  ]

  const legacyNarratives = [
    { id: '1', narrative: 'Founder vision', strength: 95, documented: true, preservation: 'High' },
    { id: '2', narrative: 'Craft heritage', strength: 88, documented: true, preservation: 'High' },
    { id: '3', narrative: 'Innovation timeline', strength: 82, documented: false, preservation: 'Medium' },
  ]

  const timeHorizons = [
    { id: '1', period: '1 Year', planned: true, clarity: 95, alignment: 'Very High' },
    { id: '2', period: '5 Years', planned: true, clarity: 82, alignment: 'High' },
    { id: '3', period: '10 Years', planned: false, clarity: 65, alignment: 'Medium' },
  ]

  const filteredRisks = culturalRisks.filter(r =>
    r.risk.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredNarratives = legacyNarratives.filter(n =>
    n.narrative.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredHorizons = timeHorizons.filter(h =>
    h.period.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Cultural & Risk Systems</h1>
          <p className={styles.subtitle}>Cultural risk monitoring, legacy narratives & time horizon planning</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Add monitoring')}>
          Add Monitoring
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search systems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'cultural' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('cultural')}
        >
          Cultural Risk
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'legacy' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('legacy')}
        >
          Legacy Narratives
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'horizon' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('horizon')}
        >
          Time Horizons
        </button>
      </div>

      {activeTab === 'cultural' && (
        <div className={styles.grid}>
          {filteredRisks.map(r => (
            <div key={r.id} className={styles.card}>
              <span className={styles.category}>{r.level} Risk</span>
              <h3>{r.risk}</h3>
              <p className={styles.meta}>Last review: {new Date(r.lastReview).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Monitoring</span>
                  <span className={styles.value}>{r.monitoring}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Review ${r.risk}`)}>
                Review
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'legacy' && (
        <div className={styles.grid}>
          {filteredNarratives.map(n => (
            <div key={n.id} className={styles.card}>
              <h3>{n.narrative}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Strength</span>
                  <span className={styles.value}>{n.strength}%</span>
                </div>
                <div>
                  <span className={styles.label}>Preservation</span>
                  <span className={styles.value}>{n.preservation}</span>
                </div>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{n.documented ? 'Documented' : 'Draft'}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Build ${n.narrative}`)}>
                Build Narrative
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'horizon' && (
        <div className={styles.grid}>
          {filteredHorizons.map(h => (
            <div key={h.id} className={styles.card}>
              <h3>{h.period} Horizon</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Clarity</span>
                  <span className={styles.value}>{h.clarity}%</span>
                </div>
                <div>
                  <span className={styles.label}>Alignment</span>
                  <span className={styles.value}>{h.alignment}</span>
                </div>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{h.planned ? 'Planned' : 'Undefined'}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Plan ${h.period}`)}>
                Plan Horizon
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
