import { useState } from 'react'
import styles from './Placeholder.module.css'

export function PrototypeVault() {
  const [searchQuery, setSearchQuery] = useState('')
  const prototypes = [
    { id: '1', name: 'Modular Jacket v3', date: '2025-11-12', status: 'Archived', iterations: 8 },
    { id: '2', name: 'Adaptive Bag System', date: '2025-12-20', status: 'Active', iterations: 5 },
    { id: '3', name: 'Technical Vest Series', date: '2026-01-15', status: 'Testing', iterations: 3 },
  ]

  const filteredPrototypes = prototypes.filter(proto =>
    proto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proto.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Prototype Vault</h1>
          <p className={styles.subtitle}>Historical prototypes and iteration archive</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Upload Prototype functionality')}>
          Upload Prototype
        </button>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search prototypes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.grid}>
        {filteredPrototypes.map(proto => (
          <div key={proto.id} className={styles.card}>
            <h3>{proto.name}</h3>
            <p className={styles.meta}>{new Date(proto.date).toLocaleDateString()}</p>
            <div className={styles.metrics}>
              <div>
                <span className={styles.label}>Status</span>
                <span className={styles.value}>{proto.status}</span>
              </div>
              <div>
                <span className={styles.label}>Iterations</span>
                <span className={styles.value}>{proto.iterations}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProblemSolutionMapper() {
  const [searchQuery, setSearchQuery] = useState('')
  const challenges = [
    { id: '1', problem: 'Weather adaptability', solution: 'Modular layering system', status: 'Implemented' },
    { id: '2', problem: 'Durability vs weight', solution: 'Ripstop technical fabric', status: 'Testing' },
    { id: '3', problem: 'Accessibility pricing', solution: 'Tiered product line', status: 'Planning' },
  ]

  const filteredChallenges = challenges.filter(c =>
    c.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Problem–Solution Mapper</h1>
          <p className={styles.subtitle}>Design challenges and creative solutions</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert('Map new challenge functionality')}>
          Map Challenge
        </button>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search challenges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.grid}>
        {filteredChallenges.map(c => (
          <div key={c.id} className={styles.card}>
            <h3>{c.problem}</h3>
            <p className={styles.description}>{c.solution}</p>
            <div className={styles.metrics}>
              <div>
                <span className={styles.label}>Status</span>
                <span className={styles.value}>{c.status}</span>
              </div>
            </div>
            <button className={styles.secondaryBtn} onClick={() => alert(`View ${c.problem} details`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Business Intelligence Hub - Combined page
export function MarketSignalsBoard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'signals' | 'pricing' | 'timing'>('signals')

  const signals = [
    { id: '1', trend: 'Technical minimalism', strength: 85, trajectory: 'Rising', confidence: 92, category: 'Design' },
    { id: '2', trend: 'Sustainable luxury', strength: 78, trajectory: 'Stable', confidence: 88, category: 'Values' },
    { id: '3', trend: 'Modular systems', strength: 72, trajectory: 'Rising', confidence: 84, category: 'Function' },
  ]

  const pricingStrategies = [
    { id: '1', name: 'Anchor Pricing', product: 'Premium Collection', impact: 'High', status: 'Active' },
    { id: '2', name: 'Value Bundling', product: 'Starter Kit', impact: 'Medium', status: 'Testing' },
    { id: '3', name: 'Prestige Positioning', product: 'Limited Edition', impact: 'Very High', status: 'Active' },
  ]

  const timingEvents = [
    { id: '1', event: 'Q2 Fashion Week', optimal: '2026-03-15', confidence: 94, category: 'Launch' },
    { id: '2', event: 'Summer Campaign', optimal: '2026-05-01', confidence: 88, category: 'Marketing' },
    { id: '3', event: 'Holiday Collection', optimal: '2026-10-15', confidence: 96, category: 'Launch' },
  ]

  const filteredSignals = signals.filter(s =>
    s.trend.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPricing = pricingStrategies.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTiming = timingEvents.filter(t =>
    t.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Business Intelligence Hub</h1>
          <p className={styles.subtitle}>Market signals, pricing psychology & cultural timing</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert(`Add new ${activeTab} data`)}>
          Add {activeTab === 'signals' ? 'Signal' : activeTab === 'pricing' ? 'Strategy' : 'Event'}
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search intelligence data..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'signals' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('signals')}
        >
          Market Signals
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'pricing' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing Psychology
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'timing' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('timing')}
        >
          Cultural Timing
        </button>
      </div>

      {activeTab === 'signals' && (
        <div className={styles.grid}>
          {filteredSignals.map(s => (
            <div key={s.id} className={styles.card}>
              <span className={styles.category}>{s.category}</span>
              <h3>{s.trend}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Strength</span>
                  <span className={styles.value}>{s.strength}%</span>
                </div>
                <div>
                  <span className={styles.label}>Trajectory</span>
                  <span className={styles.value}>{s.trajectory}</span>
                </div>
                <div>
                  <span className={styles.label}>Confidence</span>
                  <span className={styles.value}>{s.confidence}%</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${s.trend} details`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className={styles.grid}>
          {filteredPricing.map(p => (
            <div key={p.id} className={styles.card}>
              <h3>{p.name}</h3>
              <p className={styles.meta}>{p.product}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Impact</span>
                  <span className={styles.value}>{p.impact}</span>
                </div>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{p.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Edit ${p.name} strategy`)}>
                Edit Strategy
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timing' && (
        <div className={styles.grid}>
          {filteredTiming.map(t => (
            <div key={t.id} className={styles.card}>
              <span className={styles.category}>{t.category}</span>
              <h3>{t.event}</h3>
              <p className={styles.meta}>Optimal: {new Date(t.optimal).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Confidence</span>
                  <span className={styles.value}>{t.confidence}%</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Analyze ${t.event} timing`)}>
                Analyze Timing
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Design Studio - Combined page
export function PackagingDesignStudio() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'packaging' | 'campaigns'>('packaging')

  const packagingDesigns = [
    { id: '1', name: 'Minimal Black Box', material: 'Recycled Cardboard', sustainability: 95, status: 'Production' },
    { id: '2', name: 'Protective Case', material: 'Biodegradable Plastic', sustainability: 88, status: 'Testing' },
    { id: '3', name: 'Luxury Presentation', material: 'FSC Paper & Hemp', sustainability: 92, status: 'Design' },
  ]

  const campaigns = [
    { id: '1', name: 'Spring Launch 2026', type: 'Product Launch', channels: 'Digital, Print, OOH', status: 'Planning' },
    { id: '2', name: 'Brand Manifesto', type: 'Brand Awareness', channels: 'Social, Video', status: 'Active' },
    { id: '3', name: 'Sustainability Story', type: 'Values Campaign', channels: 'Editorial, Social', status: 'Development' },
  ]

  const filteredPackaging = packagingDesigns.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.material.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Design Studio</h1>
          <p className={styles.subtitle}>Packaging design & visual campaign development</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert(`Create new ${activeTab === 'packaging' ? 'packaging' : 'campaign'}`)}>
          New {activeTab === 'packaging' ? 'Design' : 'Campaign'}
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search designs and campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'packaging' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('packaging')}
        >
          Packaging Design
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'campaigns' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Visual Campaigns
        </button>
      </div>

      {activeTab === 'packaging' && (
        <div className={styles.grid}>
          {filteredPackaging.map(p => (
            <div key={p.id} className={styles.card}>
              <h3>{p.name}</h3>
              <p className={styles.meta}>{p.material}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Sustainability</span>
                  <span className={styles.value}>{p.sustainability}%</span>
                </div>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{p.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Edit ${p.name}`)}>
                Edit Design
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className={styles.grid}>
          {filteredCampaigns.map(c => (
            <div key={c.id} className={styles.card}>
              <span className={styles.category}>{c.type}</span>
              <h3>{c.name}</h3>
              <p className={styles.meta}>{c.channels}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{c.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${c.name} campaign`)}>
                View Campaign
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Narrative Studio - Combined page
export function WorldbuildingStudio() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'worlds' | 'stories' | 'editorial'>('worlds')

  const worlds = [
    { id: '1', name: 'Urban Nomad Universe', elements: 12, status: 'Active', depth: 'High' },
    { id: '2', name: 'Technical Heritage', elements: 8, status: 'Development', depth: 'Medium' },
    { id: '3', name: 'Future Utility', elements: 15, status: 'Active', depth: 'Very High' },
  ]

  const stories = [
    { id: '1', title: 'Origin Story', type: 'Brand Narrative', registered: '2025-08-15', protection: 'Registered' },
    { id: '2', title: 'Maker Series', type: 'Campaign IP', registered: '2025-11-20', protection: 'Copyright' },
    { id: '3', title: 'City Chronicles', type: 'Editorial IP', registered: '2026-01-05', protection: 'Trademark' },
  ]

  const editorials = [
    { id: '1', title: 'The New Uniform', format: 'Longform Essay', publish: '2026-02-15', status: 'Draft' },
    { id: '2', title: 'Material Futures', format: 'Photo Essay', publish: '2026-03-01', status: 'Photography' },
    { id: '3', title: 'Designer Interview Series', format: 'Video Editorial', publish: '2026-03-20', status: 'Planning' },
  ]

  const filteredWorlds = worlds.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStories = stories.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEditorials = editorials.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.format.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Narrative Studio</h1>
          <p className={styles.subtitle}>Worldbuilding, story IP & editorial content</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert(`Create new ${activeTab}`)}>
          New {activeTab === 'worlds' ? 'World' : activeTab === 'stories' ? 'Story' : 'Editorial'}
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search narrative content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'worlds' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('worlds')}
        >
          Worldbuilding
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'stories' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('stories')}
        >
          Story IP Vault
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'editorial' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('editorial')}
        >
          Editorial Studio
        </button>
      </div>

      {activeTab === 'worlds' && (
        <div className={styles.grid}>
          {filteredWorlds.map(w => (
            <div key={w.id} className={styles.card}>
              <h3>{w.name}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Elements</span>
                  <span className={styles.value}>{w.elements}</span>
                </div>
                <div>
                  <span className={styles.label}>Depth</span>
                  <span className={styles.value}>{w.depth}</span>
                </div>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{w.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Explore ${w.name}`)}>
                Explore World
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stories' && (
        <div className={styles.grid}>
          {filteredStories.map(s => (
            <div key={s.id} className={styles.card}>
              <span className={styles.category}>{s.type}</span>
              <h3>{s.title}</h3>
              <p className={styles.meta}>Registered: {new Date(s.registered).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Protection</span>
                  <span className={styles.value}>{s.protection}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${s.title} registration`)}>
                View Registration
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'editorial' && (
        <div className={styles.grid}>
          {filteredEditorials.map(e => (
            <div key={e.id} className={styles.card}>
              <span className={styles.category}>{e.format}</span>
              <h3>{e.title}</h3>
              <p className={styles.meta}>Publish: {new Date(e.publish).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{e.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Edit ${e.title}`)}>
                Edit Editorial
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Innovation Lab - Combined page
export function RDPlayground() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'experiments' | 'speculative' | 'constraints' | 'fusion'>('experiments')

  const experiments = [
    { id: '1', name: 'Self-Healing Fabric', stage: 'Lab Testing', potential: 'High', timeline: 'Q3 2026' },
    { id: '2', name: 'Zero-Waste Pattern System', stage: 'Prototyping', potential: 'Very High', timeline: 'Q2 2026' },
    { id: '3', name: 'Adaptive Color Technology', stage: 'Research', potential: 'Medium', timeline: 'Q4 2026' },
  ]

  const concepts = [
    { id: '1', concept: 'Climate-Responsive Garments', horizon: '5-7 years', feasibility: 'Medium' },
    { id: '2', concept: 'Bioengineered Materials', horizon: '10+ years', feasibility: 'Low' },
    { id: '3', concept: 'Modular AI Fit System', horizon: '2-3 years', feasibility: 'High' },
  ]

  const constraints = [
    { id: '1', challenge: 'Design with single material', difficulty: 'Hard', projects: 3 },
    { id: '2', challenge: 'Create without electricity', difficulty: 'Medium', projects: 5 },
    { id: '3', challenge: 'Zero budget prototype', difficulty: 'Very Hard', projects: 2 },
  ]

  const fusions = [
    { id: '1', fusion: 'Fashion × Architecture', output: 'Structural Garment System', status: 'Active' },
    { id: '2', fusion: 'Textile × Software', output: 'Programmable Fabric', status: 'Research' },
    { id: '3', fusion: 'Design × Biology', output: 'Living Material Study', status: 'Concept' },
  ]

  const filteredExperiments = experiments.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredConcepts = concepts.filter(c =>
    c.concept.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredConstraints = constraints.filter(c =>
    c.challenge.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFusions = fusions.filter(f =>
    f.fusion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.output.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Innovation Lab</h1>
          <p className={styles.subtitle}>R&D, speculative concepts, creative constraints & cross-discipline fusion</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert(`Create new ${activeTab}`)}>
          New {activeTab === 'experiments' ? 'Experiment' : activeTab === 'speculative' ? 'Concept' : activeTab === 'constraints' ? 'Challenge' : 'Fusion'}
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search innovation projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'experiments' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('experiments')}
        >
          R&D Experiments
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'speculative' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('speculative')}
        >
          Speculative Concepts
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'constraints' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('constraints')}
        >
          Creative Constraints
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'fusion' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('fusion')}
        >
          Cross-Discipline Fusion
        </button>
      </div>

      {activeTab === 'experiments' && (
        <div className={styles.grid}>
          {filteredExperiments.map(e => (
            <div key={e.id} className={styles.card}>
              <h3>{e.name}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Stage</span>
                  <span className={styles.value}>{e.stage}</span>
                </div>
                <div>
                  <span className={styles.label}>Potential</span>
                  <span className={styles.value}>{e.potential}</span>
                </div>
                <div>
                  <span className={styles.label}>Timeline</span>
                  <span className={styles.value}>{e.timeline}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${e.name} research`)}>
                View Research
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'speculative' && (
        <div className={styles.grid}>
          {filteredConcepts.map(c => (
            <div key={c.id} className={styles.card}>
              <h3>{c.concept}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Horizon</span>
                  <span className={styles.value}>{c.horizon}</span>
                </div>
                <div>
                  <span className={styles.label}>Feasibility</span>
                  <span className={styles.value}>{c.feasibility}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Explore ${c.concept}`)}>
                Explore Concept
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'constraints' && (
        <div className={styles.grid}>
          {filteredConstraints.map(c => (
            <div key={c.id} className={styles.card}>
              <h3>{c.challenge}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Difficulty</span>
                  <span className={styles.value}>{c.difficulty}</span>
                </div>
                <div>
                  <span className={styles.label}>Projects</span>
                  <span className={styles.value}>{c.projects}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Start ${c.challenge} challenge`)}>
                Start Challenge
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'fusion' && (
        <div className={styles.grid}>
          {filteredFusions.map(f => (
            <div key={f.id} className={styles.card}>
              <span className={styles.category}>{f.fusion}</span>
              <h3>{f.output}</h3>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{f.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${f.output} project`)}>
                View Project
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// IP & Legacy Hub - Combined page
export function IPRegistry() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'registry' | 'archive' | 'estate'>('registry')

  const ipAssets = [
    { id: '1', name: 'Brand Wordmark', type: 'Trademark', filed: '2024-06-15', status: 'Registered' },
    { id: '2', name: 'Signature Pattern', type: 'Design Patent', filed: '2025-02-20', status: 'Pending' },
    { id: '3', name: 'Product Line Name', type: 'Trademark', filed: '2025-09-10', status: 'Registered' },
  ]

  const archives = [
    { id: '1', work: 'Fall 2024 Collection', date: '2024-09-15', type: 'Product Launch', provenance: 'Complete' },
    { id: '2', work: 'Brand Film Series', date: '2025-03-20', type: 'Content', provenance: 'Complete' },
    { id: '3', work: 'Sustainability Report', date: '2025-11-05', type: 'Publication', provenance: 'Verified' },
  ]

  const estateItems = [
    { id: '1', asset: 'Core IP Portfolio', beneficiary: 'Trust A', status: 'Configured' },
    { id: '2', asset: 'Creative Archives', beneficiary: 'Foundation', status: 'In Progress' },
    { id: '3', asset: 'Revenue Streams', beneficiary: 'Trust B', status: 'Configured' },
  ]

  const filteredIP = ipAssets.filter(ip =>
    ip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ip.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredArchives = archives.filter(a =>
    a.work.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEstate = estateItems.filter(e =>
    e.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.beneficiary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>IP & Legacy Hub</h1>
          <p className={styles.subtitle}>IP registry, archive & provenance, creative estate planning</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert(`Add new ${activeTab} entry`)}>
          Add {activeTab === 'registry' ? 'IP' : activeTab === 'archive' ? 'Archive' : 'Estate Item'}
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search IP and legacy records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'registry' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('registry')}
        >
          IP Registry
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'archive' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('archive')}
        >
          Archive & Provenance
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'estate' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('estate')}
        >
          Creative Estate
        </button>
      </div>

      {activeTab === 'registry' && (
        <div className={styles.grid}>
          {filteredIP.map(ip => (
            <div key={ip.id} className={styles.card}>
              <span className={styles.category}>{ip.type}</span>
              <h3>{ip.name}</h3>
              <p className={styles.meta}>Filed: {new Date(ip.filed).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{ip.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${ip.name} details`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'archive' && (
        <div className={styles.grid}>
          {filteredArchives.map(a => (
            <div key={a.id} className={styles.card}>
              <span className={styles.category}>{a.type}</span>
              <h3>{a.work}</h3>
              <p className={styles.meta}>{new Date(a.date).toLocaleDateString()}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Provenance</span>
                  <span className={styles.value}>{a.provenance}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`View ${a.work} archive`)}>
                View Archive
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'estate' && (
        <div className={styles.grid}>
          {filteredEstate.map(e => (
            <div key={e.id} className={styles.card}>
              <h3>{e.asset}</h3>
              <p className={styles.meta}>Beneficiary: {e.beneficiary}</p>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.label}>Status</span>
                  <span className={styles.value}>{e.status}</span>
                </div>
              </div>
              <button className={styles.secondaryBtn} onClick={() => alert(`Configure ${e.asset} estate`)}>
                Configure
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Keep these as exports for backward compatibility
export const PricingPsychologyLab = MarketSignalsBoard
export const CulturalTimingIndex = MarketSignalsBoard
export const VisualCampaignBuilder = PackagingDesignStudio
export const StoryIPVault = WorldbuildingStudio
export const EditorialStudio = WorldbuildingStudio
export const SpeculativeConcepts = RDPlayground
export const CreativeConstraintsEngine = RDPlayground
export const CrossDisciplineFusionLab = RDPlayground
export const ArchiveProvenance = IPRegistry
export const CreativeEstateMode = IPRegistry
