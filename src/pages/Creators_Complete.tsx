import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Creators.module.css'

interface Prototype {
  id: string
  name: string
  type: 'code' | 'design' | 'concept' | 'video' | 'physical'
  version: string
  status: 'idea' | 'in-progress' | 'tested' | 'validated' | 'archived'
  fidelity: 'low' | 'medium' | 'high'
  dateCreated: string
  learnings: string[]
  iterationCount: number
}

interface TestingResult {
  id: string
  prototypeId: string
  testDate: string
  users: number
  successRate: number
  feedback: string[]
  improvements: string[]
  validated: boolean
}

interface IterationLog {
  id: string
  prototypeId: string
  version: string
  changes: string[]
  reasoning: string
  improvement: number
  date: string
}

interface FeatureTest {
  id: string
  feature: string
  prototypeIds: string[]
  adoption: number
  satisfaction: number
  effort: number
  priority: number
}

interface DesignVariant {
  id: string
  prototypeId: string
  variant: string
  approach: string
  userPreference: number
  selected: boolean
}

interface TechnicalSpike {
  id: string
  question: string
  approach: string
  findings: string[]
  feasibility: number
  recommendation: string
  timeInvested: number
}

interface UsabilityScore {
  id: string
  prototypeId: string
  ease: number
  clarity: number
  efficiency: number
  satisfaction: number
  overall: number
}

interface ConceptValidation {
  id: string
  concept: string
  market: string
  assumptions: string[]
  evidence: string[]
  confidence: number
  nextSteps: string[]
}

interface RapidPrototype {
  id: string
  goal: string
  buildTime: number
  tools: string[]
  outcome: string
  speed: number
  quality: number
}

interface AssetLibrary {
  id: string
  asset: string
  type: 'component' | 'template' | 'snippet' | 'resource'
  reusable: boolean
  timeSaved: number
  usageCount: number
}

interface ExperimentalFeature {
  id: string
  feature: string
  hypothesis: string
  success: boolean
  rollout: number
  feedback: string[]
  decision: 'ship' | 'iterate' | 'kill'
}

interface VersionControl {
  id: string
  prototypeId: string
  version: string
  changes: string
  branchFrom?: string
  merged: boolean
  deployDate?: string
}

interface FeedbackLoop {
  id: string
  prototypeId: string
  source: string
  feedback: string
  sentiment: 'positive' | 'neutral' | 'negative'
  actionTaken: string
  impact: number
}

interface PrototypeMetrics {
  id: string
  prototypeId: string
  metric: string
  baseline: number
  current: number
  target: number
  trend: 'improving' | 'stable' | 'declining'
}

interface KillDecision {
  id: string
  prototypeId: string
  reason: string
  learnings: string[]
  salvageableAssets: string[]
  date: string
}

export function Creators() {
  const { addToast } = useApp()
  
  const [prototypes, setPrototypes] = useState<Prototype[]>([])
  const [testing, setTesting] = useState<TestingResult[]>([])
  const [iterations, setIterations] = useState<IterationLog[]>([])
  const [features, setFeatures] = useState<FeatureTest[]>([])
  const [variants, setVariants] = useState<DesignVariant[]>([])
  const [spikes, setSpikes] = useState<TechnicalSpike[]>([])
  const [usability, setUsability] = useState<UsabilityScore[]>([])
  const [concepts, setConcepts] = useState<ConceptValidation[]>([])
  const [rapid, setRapid] = useState<RapidPrototype[]>([])
  const [assets, setAssets] = useState<AssetLibrary[]>([])
  const [experimental, setExperimental] = useState<ExperimentalFeature[]>([])
  const [versions, setVersions] = useState<VersionControl[]>([])
  const [feedback, setFeedback] = useState<FeedbackLoop[]>([])
  const [metrics, setMetrics] = useState<PrototypeMetrics[]>([])
  const [kills, setKills] = useState<KillDecision[]>([])

  const [activeSection, setActiveSection] = useState('prototypes')

  useEffect(() => {
    const keys = ['prototypes', 'testing', 'iterations', 'features', 'variants', 'spikes', 'usability', 'concepts', 'rapid', 'assets', 'experimental', 'versions', 'feedback', 'metrics', 'kills']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`creators_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'prototypes': setPrototypes(data); break
          case 'testing': setTesting(data); break
          case 'iterations': setIterations(data); break
          case 'features': setFeatures(data); break
          case 'variants': setVariants(data); break
          case 'spikes': setSpikes(data); break
          case 'usability': setUsability(data); break
          case 'concepts': setConcepts(data); break
          case 'rapid': setRapid(data); break
          case 'assets': setAssets(data); break
          case 'experimental': setExperimental(data); break
          case 'versions': setVersions(data); break
          case 'feedback': setFeedback(data); break
          case 'metrics': setMetrics(data); break
          case 'kills': setKills(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('creators_prototypes', JSON.stringify(prototypes)) }, [prototypes])
  useEffect(() => { localStorage.setItem('creators_testing', JSON.stringify(testing)) }, [testing])
  useEffect(() => { localStorage.setItem('creators_iterations', JSON.stringify(iterations)) }, [iterations])
  useEffect(() => { localStorage.setItem('creators_features', JSON.stringify(features)) }, [features])
  useEffect(() => { localStorage.setItem('creators_variants', JSON.stringify(variants)) }, [variants])
  useEffect(() => { localStorage.setItem('creators_spikes', JSON.stringify(spikes)) }, [spikes])
  useEffect(() => { localStorage.setItem('creators_usability', JSON.stringify(usability)) }, [usability])
  useEffect(() => { localStorage.setItem('creators_concepts', JSON.stringify(concepts)) }, [concepts])
  useEffect(() => { localStorage.setItem('creators_rapid', JSON.stringify(rapid)) }, [rapid])
  useEffect(() => { localStorage.setItem('creators_assets', JSON.stringify(assets)) }, [assets])
  useEffect(() => { localStorage.setItem('creators_experimental', JSON.stringify(experimental)) }, [experimental])
  useEffect(() => { localStorage.setItem('creators_versions', JSON.stringify(versions)) }, [versions])
  useEffect(() => { localStorage.setItem('creators_feedback', JSON.stringify(feedback)) }, [feedback])
  useEffect(() => { localStorage.setItem('creators_metrics', JSON.stringify(metrics)) }, [metrics])
  useEffect(() => { localStorage.setItem('creators_kills', JSON.stringify(kills)) }, [kills])

  // AI Functions
  const calculateUsabilityScore = (ease: number, clarity: number, efficiency: number, satisfaction: number): number => {
    return Math.round((ease + clarity + efficiency + satisfaction) / 4)
  }

  const calculateFeaturePriority = (adoption: number, satisfaction: number, effort: number): number => {
    const value = (adoption + satisfaction) / 2
    const priority = value / effort
    return Math.round(priority * 10)
  }

  const calculateConceptConfidence = (assumptions: number, evidence: number): number => {
    const validatedAssumptions = Math.min(assumptions, evidence)
    const confidenceRatio = assumptions > 0 ? (validatedAssumptions / assumptions) * 100 : 0
    return Math.round(confidenceRatio)
  }

  const calculateSpeedScore = (buildTime: number, complexity: 'low' | 'medium' | 'high'): number => {
    let targetTime = 8
    if (complexity === 'medium') targetTime = 24
    if (complexity === 'high') targetTime = 72
    
    if (buildTime <= targetTime) return 100
    const overtime = buildTime - targetTime
    const penalty = Math.min(50, (overtime / targetTime) * 50)
    return Math.round(100 - penalty)
  }

  const calculateTimeSaved = (usageCount: number, timePerUse: number): number => {
    return usageCount * timePerUse
  }

  const assessFeedbackSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['great', 'love', 'excellent', 'amazing', 'perfect', 'good']
    const negativeWords = ['bad', 'hate', 'terrible', 'awful', 'poor', 'confusing']
    
    const lower = text.toLowerCase()
    const hasPositive = positiveWords.some(word => lower.includes(word))
    const hasNegative = negativeWords.some(word => lower.includes(word))
    
    if (hasPositive && !hasNegative) return 'positive'
    if (hasNegative && !hasPositive) return 'negative'
    return 'neutral'
  }

  const calculateMetricTrend = (baseline: number, current: number, target: number): 'improving' | 'stable' | 'declining' => {
    if (current > baseline) {
      if (current >= target * 0.8) return 'improving'
      return 'stable'
    } else if (current < baseline) {
      return 'declining'
    }
    return 'stable'
  }

  const calculateIterationImprovement = (changeCount: number, userFeedbackCount: number): number => {
    return Math.min(100, (changeCount * 10) + (userFeedbackCount * 5))
  }

  const assessFeasibility = (findings: string[]): number => {
    const blockerKeywords = ['impossible', 'blocker', 'cannot', 'infeasible']
    const positiveKeywords = ['possible', 'feasible', 'achievable', 'straightforward']
    
    let score = 50
    findings.forEach(finding => {
      const lower = finding.toLowerCase()
      if (blockerKeywords.some(word => lower.includes(word))) score -= 20
      if (positiveKeywords.some(word => lower.includes(word))) score += 20
    })
    
    return Math.max(0, Math.min(100, score))
  }

  // CRUD Functions
  const addPrototype = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPrototype: Prototype = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as Prototype['type'],
      version: '0.1.0',
      status: 'in-progress',
      fidelity: formData.get('fidelity') as Prototype['fidelity'],
      dateCreated: new Date().toISOString().split('T')[0],
      learnings: [],
      iterationCount: 0
    }
    
    setPrototypes([...prototypes, newPrototype])
    addToast('Prototype created', 'success')
    e.currentTarget.reset()
  }

  const recordTesting = (prototypeId: string, users: number, successRate: number) => {
    const validated = successRate >= 70
    
    const newTest: TestingResult = {
      id: Date.now().toString(),
      prototypeId,
      testDate: new Date().toISOString().split('T')[0],
      users,
      successRate,
      feedback: [],
      improvements: [],
      validated
    }
    
    setTesting([...testing, newTest])
    addToast(validated ? 'Test validated!' : 'More iteration needed', validated ? 'success' : 'info')
  }

  const scoreUsability = (prototypeId: string, ease: number, clarity: number, efficiency: number, satisfaction: number) => {
    const overall = calculateUsabilityScore(ease, clarity, efficiency, satisfaction)
    
    const newScore: UsabilityScore = {
      id: Date.now().toString(),
      prototypeId,
      ease,
      clarity,
      efficiency,
      satisfaction,
      overall
    }
    
    setUsability([...usability, newScore])
    addToast(`Usability: ${overall}/100`, overall >= 70 ? 'success' : 'info')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Prototype Vault</h1>
          <p className={styles.subtitle}>Rapid prototyping and validation hub</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'prototypes' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('prototypes')}>All Prototypes</button>
          <button className={`${styles.navItem} ${activeSection === 'testing' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('testing')}>User Testing</button>
          <button className={`${styles.navItem} ${activeSection === 'iterations' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('iterations')}>Iteration Log</button>
          <button className={`${styles.navItem} ${activeSection === 'features' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('features')}>Feature Tests</button>
          <button className={`${styles.navItem} ${activeSection === 'variants' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('variants')}>Design Variants</button>
          <button className={`${styles.navItem} ${activeSection === 'spikes' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('spikes')}>Technical Spikes</button>
          <button className={`${styles.navItem} ${activeSection === 'usability' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('usability')}>Usability Scoring</button>
          <button className={`${styles.navItem} ${activeSection === 'concepts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('concepts')}>Concept Validation</button>
          <button className={`${styles.navItem} ${activeSection === 'rapid' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('rapid')}>Rapid Prototypes</button>
          <button className={`${styles.navItem} ${activeSection === 'assets' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('assets')}>Asset Library</button>
          <button className={`${styles.navItem} ${activeSection === 'experimental' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('experimental')}>Experimental Features</button>
          <button className={`${styles.navItem} ${activeSection === 'versions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('versions')}>Version Control</button>
          <button className={`${styles.navItem} ${activeSection === 'feedback' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('feedback')}>Feedback Loop</button>
          <button className={`${styles.navItem} ${activeSection === 'metrics' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('metrics')}>Prototype Metrics</button>
          <button className={`${styles.navItem} ${activeSection === 'kills' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('kills')}>Kill Decisions</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'prototypes' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Prototype Vault</h2>
                <p>Manage all your prototypes and experiments</p>
              </div>

              <form onSubmit={addPrototype} className={styles.form}>
                <input name="name" placeholder="Prototype name" required className={styles.input} />
                <select name="type" required className={styles.select}>
                  <option value="">Select type</option>
                  <option value="code">Code</option>
                  <option value="design">Design</option>
                  <option value="concept">Concept</option>
                  <option value="video">Video</option>
                  <option value="physical">Physical</option>
                </select>
                <select name="fidelity" required className={styles.select}>
                  <option value="">Fidelity level</option>
                  <option value="low">Low (Sketch/Wireframe)</option>
                  <option value="medium">Medium (Interactive)</option>
                  <option value="high">High (Production-ready)</option>
                </select>
                <button type="submit" className={styles.primaryBtn}>Add Prototype</button>
              </form>

              <div className={styles.prototypeGrid}>
                {prototypes.map(proto => (
                  <div key={proto.id} className={`${styles.prototypeCard} ${styles[proto.status]}`}>
                    <div className={styles.protoHeader}>
                      <h3>{proto.name}</h3>
                      <span className={styles.version}>v{proto.version}</span>
                    </div>
                    <div className={styles.protoBadges}>
                      <span className={`${styles.badge} ${styles[proto.type]}`}>{proto.type}</span>
                      <span className={`${styles.badge} ${styles[proto.fidelity]}`}>{proto.fidelity} fidelity</span>
                      <span className={`${styles.badge} ${styles[proto.status]}`}>{proto.status}</span>
                    </div>
                    <div className={styles.protoMeta}>
                      <p><strong>Created:</strong> {proto.dateCreated}</p>
                      <p><strong>Iterations:</strong> {proto.iterationCount}</p>
                      {proto.learnings.length > 0 && (
                        <div className={styles.learnings}>
                          <strong>Key Learnings:</strong>
                          <ul>
                            {proto.learnings.map((learning, idx) => (
                              <li key={idx}>{learning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'usability' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Usability Scoring</h2>
                <p>Evaluate prototypes across key usability dimensions</p>
              </div>

              <div className={styles.calculator}>
                <h3>Score Usability</h3>
                <div className={styles.calcInputs}>
                  <select id="prototypeSelect" className={styles.select}>
                    <option value="">Select prototype</option>
                    {prototypes.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input type="number" id="ease" placeholder="Ease of use (0-100)" min="0" max="100" className={styles.input} />
                  <input type="number" id="clarity" placeholder="Clarity (0-100)" min="0" max="100" className={styles.input} />
                  <input type="number" id="efficiency" placeholder="Efficiency (0-100)" min="0" max="100" className={styles.input} />
                  <input type="number" id="satisfaction" placeholder="Satisfaction (0-100)" min="0" max="100" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const protoId = (document.getElementById('prototypeSelect') as HTMLSelectElement).value
                      const ease = parseFloat((document.getElementById('ease') as HTMLInputElement).value)
                      const clarity = parseFloat((document.getElementById('clarity') as HTMLInputElement).value)
                      const efficiency = parseFloat((document.getElementById('efficiency') as HTMLInputElement).value)
                      const satisfaction = parseFloat((document.getElementById('satisfaction') as HTMLInputElement).value)
                      if (protoId) scoreUsability(protoId, ease, clarity, efficiency, satisfaction)
                    }}
                  >
                    Calculate Score
                  </button>
                </div>

                <div className={styles.usabilityGrid}>
                  {usability.map(score => {
                    const proto = prototypes.find(p => p.id === score.prototypeId)
                    return (
                      <div key={score.id} className={styles.usabilityCard}>
                        <h3>{proto?.name || 'Unknown'}</h3>
                        <div className={styles.overallScore}>
                          <div className={styles.bigNumber}>{score.overall}</div>
                          <div className={styles.label}>Usability Score</div>
                        </div>
                        <div className={styles.scoreBreakdown}>
                          <div className={styles.scoreItem}>
                            <span className={styles.scoreLabel}>Ease of Use</span>
                            <div className={styles.scoreBar}>
                              <div className={styles.scoreFill} style={{width: `${score.ease}%`}}></div>
                            </div>
                            <span className={styles.scoreValue}>{score.ease}</span>
                          </div>
                          <div className={styles.scoreItem}>
                            <span className={styles.scoreLabel}>Clarity</span>
                            <div className={styles.scoreBar}>
                              <div className={styles.scoreFill} style={{width: `${score.clarity}%`}}></div>
                            </div>
                            <span className={styles.scoreValue}>{score.clarity}</span>
                          </div>
                          <div className={styles.scoreItem}>
                            <span className={styles.scoreLabel}>Efficiency</span>
                            <div className={styles.scoreBar}>
                              <div className={styles.scoreFill} style={{width: `${score.efficiency}%`}}></div>
                            </div>
                            <span className={styles.scoreValue}>{score.efficiency}</span>
                          </div>
                          <div className={styles.scoreItem}>
                            <span className={styles.scoreLabel}>Satisfaction</span>
                            <div className={styles.scoreBar}>
                              <div className={styles.scoreFill} style={{width: `${score.satisfaction}%`}}></div>
                            </div>
                            <span className={styles.scoreValue}>{score.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
