import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './LaunchLab.module.css'

interface LaunchReadiness {
  id: string
  productName: string
  score: number
  categories: {product: number, market: number, operations: number, marketing: number}
  gaps: string[]
  createdAt: string
}

interface SilentLaunch {
  id: string
  productName: string
  targetAudience: string
  duration: string
  metrics: {signups: number, feedback: number, bugs: number}
  status: 'planning' | 'active' | 'completed'
  learnings: string[]
}

interface AudienceTest {
  id: string
  segment: string
  testType: string
  hypothesis: string
  results: string
  validated: boolean
  createdAt: string
}

interface LaunchNarrative {
  id: string
  productName: string
  story: string
  keyMessages: string[]
  emotionalHooks: string[]
  callToAction: string
}

interface LaunchTiming {
  id: string
  productName: string
  proposedDate: string
  optimalDate: string
  factors: string[]
  confidence: number
}

interface TractionSignal {
  id: string
  signal: string
  strength: 'weak' | 'moderate' | 'strong'
  source: string
  date: string
}

interface ChannelModel {
  id: string
  channel: string
  reach: number
  cost: number
  conversion: number
  roi: number
  priority: 'high' | 'medium' | 'low'
}

interface DemandForecast {
  id: string
  productName: string
  month1: number
  month3: number
  month6: number
  confidence: number
  assumptions: string[]
}

interface DecayAnalysis {
  id: string
  productName: string
  launchDate: string
  peakEngagement: number
  currentEngagement: number
  decayRate: number
  recommendations: string[]
}

interface RelaunchPlan {
  id: string
  originalProduct: string
  reason: string
  newAngle: string
  targetDate: string
  changes: string[]
  status: 'planning' | 'ready' | 'launched'
}

interface LaunchHeatmap {
  id: string
  productName: string
  segments: {name: string, interest: number}[]
  hotZones: string[]
  coldZones: string[]
}

interface ViralTrigger {
  id: string
  trigger: string
  type: 'social-proof' | 'scarcity' | 'novelty' | 'controversy' | 'utility'
  potentialReach: number
  implementation: string
}

interface ConversionChoke {
  id: string
  stage: string
  dropoffRate: number
  causes: string[]
  fixes: string[]
  priority: 'critical' | 'high' | 'medium' | 'low'
}

interface LaunchPostmortem {
  id: string
  productName: string
  launchDate: string
  targetReach: number
  actualReach: number
  wins: string[]
  failures: string[]
  learnings: string[]
  nextTime: string[]
}

interface AssetBundle {
  id: string
  productName: string
  assets: {type: string, name: string, status: 'ready' | 'in-progress' | 'missing'}[]
  completeness: number
}

export function LaunchLab() {
  const { addToast } = useApp()
  
  const [readiness, setReadiness] = useState<LaunchReadiness[]>([])
  const [silentLaunches, setSilentLaunches] = useState<SilentLaunch[]>([])
  const [audienceTests, setAudienceTests] = useState<AudienceTest[]>([])
  const [narratives, setNarratives] = useState<LaunchNarrative[]>([])
  const [timings, setTimings] = useState<LaunchTiming[]>([])
  const [signals, setSignals] = useState<TractionSignal[]>([])
  const [channels, setChannels] = useState<ChannelModel[]>([])
  const [forecasts, setForecasts] = useState<DemandForecast[]>([])
  const [decays, setDecays] = useState<DecayAnalysis[]>([])
  const [relaunches, setRelaunches] = useState<RelaunchPlan[]>([])
  const [heatmaps, setHeatmaps] = useState<LaunchHeatmap[]>([])
  const [triggers, setTriggers] = useState<ViralTrigger[]>([])
  const [chokes, setChokes] = useState<ConversionChoke[]>([])
  const [postmortems, setPostmortems] = useState<LaunchPostmortem[]>([])
  const [bundles, setBundles] = useState<AssetBundle[]>([])

  const [activeSection, setActiveSection] = useState('readiness')
  const [showReadinessForm, setShowReadinessForm] = useState(false)
  const [showSilentForm, setShowSilentForm] = useState(false)
  const [showTestForm, setShowTestForm] = useState(false)
  const [showNarrativeForm, setShowNarrativeForm] = useState(false)
  const [showRelaunchForm, setShowRelaunchForm] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const keys = ['readiness', 'silentLaunches', 'audienceTests', 'narratives', 'timings', 'signals', 'channels', 'forecasts', 'decays', 'relaunches', 'heatmaps', 'triggers', 'chokes', 'postmortems', 'bundles']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`launchlab_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'readiness': setReadiness(data); break
          case 'silentLaunches': setSilentLaunches(data); break
          case 'audienceTests': setAudienceTests(data); break
          case 'narratives': setNarratives(data); break
          case 'timings': setTimings(data); break
          case 'signals': setSignals(data); break
          case 'channels': setChannels(data); break
          case 'forecasts': setForecasts(data); break
          case 'decays': setDecays(data); break
          case 'relaunches': setRelaunches(data); break
          case 'heatmaps': setHeatmaps(data); break
          case 'triggers': setTriggers(data); break
          case 'chokes': setChokes(data); break
          case 'postmortems': setPostmortems(data); break
          case 'bundles': setBundles(data); break
        }
      }
    })
  }, [])

  // Save to localStorage
  useEffect(() => { localStorage.setItem('launchlab_readiness', JSON.stringify(readiness)) }, [readiness])
  useEffect(() => { localStorage.setItem('launchlab_silentLaunches', JSON.stringify(silentLaunches)) }, [silentLaunches])
  useEffect(() => { localStorage.setItem('launchlab_audienceTests', JSON.stringify(audienceTests)) }, [audienceTests])
  useEffect(() => { localStorage.setItem('launchlab_narratives', JSON.stringify(narratives)) }, [narratives])
  useEffect(() => { localStorage.setItem('launchlab_timings', JSON.stringify(timings)) }, [timings])
  useEffect(() => { localStorage.setItem('launchlab_signals', JSON.stringify(signals)) }, [signals])
  useEffect(() => { localStorage.setItem('launchlab_channels', JSON.stringify(channels)) }, [channels])
  useEffect(() => { localStorage.setItem('launchlab_forecasts', JSON.stringify(forecasts)) }, [forecasts])
  useEffect(() => { localStorage.setItem('launchlab_decays', JSON.stringify(decays)) }, [decays])
  useEffect(() => { localStorage.setItem('launchlab_relaunches', JSON.stringify(relaunches)) }, [relaunches])
  useEffect(() => { localStorage.setItem('launchlab_heatmaps', JSON.stringify(heatmaps)) }, [heatmaps])
  useEffect(() => { localStorage.setItem('launchlab_triggers', JSON.stringify(triggers)) }, [triggers])
  useEffect(() => { localStorage.setItem('launchlab_chokes', JSON.stringify(chokes)) }, [chokes])
  useEffect(() => { localStorage.setItem('launchlab_postmortems', JSON.stringify(postmortems)) }, [postmortems])
  useEffect(() => { localStorage.setItem('launchlab_bundles', JSON.stringify(bundles)) }, [bundles])

  // AI Functions
  const calculateReadinessScore = (categories: {product: number, market: number, operations: number, marketing: number}): number => {
    return (categories.product + categories.market + categories.operations + categories.marketing) / 4
  }

  const optimizeLaunchTiming = (proposedDate: string): {optimal: string, confidence: number} => {
    const proposed = new Date(proposedDate)
    const dayOfWeek = proposed.getDay()
    let optimal = new Date(proposed)
    let confidence = 75
    
    // Tuesday-Thursday are optimal
    if (dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4) {
      confidence = 95
    } else if (dayOfWeek === 1 || dayOfWeek === 5) {
      confidence = 85
    } else {
      // Move to next Tuesday
      const daysToAdd = (2 - dayOfWeek + 7) % 7
      optimal.setDate(optimal.getDate() + daysToAdd)
      confidence = 70
    }
    
    return {optimal: optimal.toISOString().split('T')[0], confidence}
  }

  const calculateChannelROI = (reach: number, cost: number, conversion: number): number => {
    if (cost === 0) return 0
    const revenue = reach * (conversion / 100) * 50 // Assume $50 per conversion
    return ((revenue - cost) / cost) * 100
  }

  const forecastDemand = (initialInterest: number): {month1: number, month3: number, month6: number} => {
    const growthRate = 1.15
    return {
      month1: initialInterest,
      month3: Math.floor(initialInterest * Math.pow(growthRate, 3)),
      month6: Math.floor(initialInterest * Math.pow(growthRate, 6))
    }
  }

  const calculateDecayRate = (peak: number, current: number, daysSinceLaunch: number): number => {
    if (peak === 0 || daysSinceLaunch === 0) return 0
    const decayPercentage = ((peak - current) / peak) * 100
    return decayPercentage / daysSinceLaunch
  }

  const identifyViralTriggers = (productType: string): ViralTrigger[] => {
    const triggers: ViralTrigger[] = [
      {
        id: Date.now().toString() + '1',
        trigger: 'Invite-only early access',
        type: 'scarcity',
        potentialReach: 5000,
        implementation: 'Waitlist with limited daily invites'
      },
      {
        id: Date.now().toString() + '2',
        trigger: 'Founder story video',
        type: 'social-proof',
        potentialReach: 10000,
        implementation: 'Personal narrative on social platforms'
      },
      {
        id: Date.now().toString() + '3',
        trigger: 'Solve unsolved problem',
        type: 'utility',
        potentialReach: 25000,
        implementation: 'Demo solving pain point competitors ignore'
      }
    ]
    return triggers
  }

  // CRUD Functions
  const addReadinessCheck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const categories = {
      product: parseInt(formData.get('product') as string),
      market: parseInt(formData.get('market') as string),
      operations: parseInt(formData.get('operations') as string),
      marketing: parseInt(formData.get('marketing') as string)
    }
    
    const score = calculateReadinessScore(categories)
    const gaps: string[] = []
    if (categories.product < 80) gaps.push('Product needs polish')
    if (categories.market < 80) gaps.push('Market research incomplete')
    if (categories.operations < 80) gaps.push('Operations not ready')
    if (categories.marketing < 80) gaps.push('Marketing assets missing')
    
    const newReadiness: LaunchReadiness = {
      id: Date.now().toString(),
      productName: formData.get('productName') as string,
      score,
      categories,
      gaps,
      createdAt: new Date().toISOString()
    }
    
    setReadiness([...readiness, newReadiness])
    setShowReadinessForm(false)
    addToast(`Readiness score: ${score.toFixed(0)}/100`, score >= 80 ? 'success' : 'warning')
    e.currentTarget.reset()
  }

  const addSilentLaunch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newSilent: SilentLaunch = {
      id: Date.now().toString(),
      productName: formData.get('productName') as string,
      targetAudience: formData.get('audience') as string,
      duration: formData.get('duration') as string,
      metrics: {signups: 0, feedback: 0, bugs: 0},
      status: 'planning',
      learnings: []
    }
    
    setSilentLaunches([...silentLaunches, newSilent])
    setShowSilentForm(false)
    addToast('Silent launch planned', 'success')
    e.currentTarget.reset()
  }

  const updateSilentStatus = (id: string, status: 'planning' | 'active' | 'completed') => {
    setSilentLaunches(silentLaunches.map(s => s.id === id ? {...s, status} : s))
    addToast('Silent launch status updated', 'success')
  }

  const addAudienceTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newTest: AudienceTest = {
      id: Date.now().toString(),
      segment: formData.get('segment') as string,
      testType: formData.get('testType') as string,
      hypothesis: formData.get('hypothesis') as string,
      results: formData.get('results') as string,
      validated: formData.get('validated') === 'true',
      createdAt: new Date().toISOString()
    }
    
    setAudienceTests([...audienceTests, newTest])
    setShowTestForm(false)
    addToast(`Test ${newTest.validated ? 'validated' : 'invalidated'}`, newTest.validated ? 'success' : 'warning')
    e.currentTarget.reset()
  }

  const addNarrative = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newNarrative: LaunchNarrative = {
      id: Date.now().toString(),
      productName: formData.get('productName') as string,
      story: formData.get('story') as string,
      keyMessages: (formData.get('messages') as string).split(',').map(m => m.trim()),
      emotionalHooks: (formData.get('hooks') as string).split(',').map(h => h.trim()),
      callToAction: formData.get('cta') as string
    }
    
    setNarratives([...narratives, newNarrative])
    setShowNarrativeForm(false)
    addToast('Launch narrative created', 'success')
    e.currentTarget.reset()
  }

  const optimizeTiming = (productName: string, proposedDate: string) => {
    const optimization = optimizeLaunchTiming(proposedDate)
    
    const newTiming: LaunchTiming = {
      id: Date.now().toString(),
      productName,
      proposedDate,
      optimalDate: optimization.optimal,
      factors: ['Day of week analysis', 'Market conditions', 'Competitor activity'],
      confidence: optimization.confidence
    }
    
    setTimings([...timings, newTiming])
    addToast(`Optimal date: ${optimization.optimal} (${optimization.confidence}% confidence)`, 'info')
  }

  const addTractionSignal = (signal: string, strength: 'weak' | 'moderate' | 'strong', source: string) => {
    const newSignal: TractionSignal = {
      id: Date.now().toString(),
      signal,
      strength,
      source,
      date: new Date().toISOString()
    }
    
    setSignals([...signals, newSignal])
    addToast(`Traction signal logged: ${strength.toUpperCase()}`, 'info')
  }

  const addChannelModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const reach = parseInt(formData.get('reach') as string)
    const cost = parseFloat(formData.get('cost') as string)
    const conversion = parseFloat(formData.get('conversion') as string)
    const roi = calculateChannelROI(reach, cost, conversion)
    
    const newChannel: ChannelModel = {
      id: Date.now().toString(),
      channel: formData.get('channel') as string,
      reach,
      cost,
      conversion,
      roi,
      priority: roi > 200 ? 'high' : roi > 100 ? 'medium' : 'low'
    }
    
    setChannels([...channels, newChannel])
    addToast(`Channel ROI: ${roi.toFixed(0)}%`, 'success')
    e.currentTarget.reset()
  }

  const generateForecast = (productName: string, initialInterest: number) => {
    const forecast = forecastDemand(initialInterest)
    
    const newForecast: DemandForecast = {
      id: Date.now().toString(),
      productName,
      month1: forecast.month1,
      month3: forecast.month3,
      month6: forecast.month6,
      confidence: 80,
      assumptions: ['15% monthly growth', 'No major competitors', 'Consistent marketing']
    }
    
    setForecasts([...forecasts, newForecast])
    addToast('Demand forecast generated', 'success')
  }

  const analyzeDecay = (productName: string, launchDate: string, peak: number, current: number) => {
    const daysSince = Math.floor((new Date().getTime() - new Date(launchDate).getTime()) / (1000 * 60 * 60 * 24))
    const decayRate = calculateDecayRate(peak, current, daysSince)
    
    const newDecay: DecayAnalysis = {
      id: Date.now().toString(),
      productName,
      launchDate,
      peakEngagement: peak,
      currentEngagement: current,
      decayRate,
      recommendations: decayRate > 5 ? ['Consider relaunch', 'New features needed', 'Marketing refresh'] : ['Maintain momentum', 'Continue current strategy']
    }
    
    setDecays([...decays, newDecay])
    addToast(`Decay rate: ${decayRate.toFixed(2)}% per day`, decayRate > 5 ? 'warning' : 'info')
  }

  const addRelaunch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newRelaunch: RelaunchPlan = {
      id: Date.now().toString(),
      originalProduct: formData.get('product') as string,
      reason: formData.get('reason') as string,
      newAngle: formData.get('angle') as string,
      targetDate: formData.get('date') as string,
      changes: (formData.get('changes') as string).split(',').map(c => c.trim()),
      status: 'planning'
    }
    
    setRelaunches([...relaunches, newRelaunch])
    setShowRelaunchForm(false)
    addToast('Relaunch plan created', 'success')
    e.currentTarget.reset()
  }

  const generateViralTriggers = (productName: string) => {
    const newTriggers = identifyViralTriggers(productName)
    setTriggers([...triggers, ...newTriggers])
    addToast(`Generated ${newTriggers.length} viral triggers`, 'success')
  }

  const addPostmortem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPostmortem: LaunchPostmortem = {
      id: Date.now().toString(),
      productName: formData.get('productName') as string,
      launchDate: formData.get('launchDate') as string,
      targetReach: parseInt(formData.get('targetReach') as string),
      actualReach: parseInt(formData.get('actualReach') as string),
      wins: (formData.get('wins') as string).split(',').map(w => w.trim()),
      failures: (formData.get('failures') as string).split(',').map(f => f.trim()),
      learnings: (formData.get('learnings') as string).split(',').map(l => l.trim()),
      nextTime: (formData.get('nextTime') as string).split(',').map(n => n.trim())
    }
    
    setPostmortems([...postmortems, newPostmortem])
    addToast('Launch postmortem saved', 'success')
    e.currentTarget.reset()
  }

  // Section Components
  const ReadinessSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Launch Readiness Score</h2>
        <p className={styles.subtitle}>Comprehensive readiness assessment across all dimensions</p>
      </div>

      {!showReadinessForm && (
        <button className={styles.primaryBtn} onClick={() => setShowReadinessForm(true)}>
          + Check Readiness
        </button>
      )}

      {showReadinessForm && (
        <form className={styles.form} onSubmit={addReadinessCheck}>
          <div className={styles.formGroup}>
            <label>Product Name</label>
            <input name="productName" className={styles.input} required />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Product Readiness (0-100)</label>
              <input name="product" type="number" min="0" max="100" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label>Market Readiness (0-100)</label>
              <input name="market" type="number" min="0" max="100" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label>Operations Readiness (0-100)</label>
              <input name="operations" type="number" min="0" max="100" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label>Marketing Readiness (0-100)</label>
              <input name="marketing" type="number" min="0" max="100" className={styles.input} required />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Calculate Score</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowReadinessForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.readinessGrid}>
        {readiness.map(item => (
          <div key={item.id} className={styles.readinessCard}>
            <h3>{item.productName}</h3>
            <div className={styles.scoreDisplay}>
              <div className={styles.bigScore}>{item.score.toFixed(0)}</div>
              <div className={styles.scoreLabel}>Readiness Score</div>
            </div>
            <div className={styles.categoryScores}>
              <div className={styles.category}>
                <span>Product</span>
                <span className={styles.categoryScore}>{item.categories.product}</span>
              </div>
              <div className={styles.category}>
                <span>Market</span>
                <span className={styles.categoryScore}>{item.categories.market}</span>
              </div>
              <div className={styles.category}>
                <span>Operations</span>
                <span className={styles.categoryScore}>{item.categories.operations}</span>
              </div>
              <div className={styles.category}>
                <span>Marketing</span>
                <span className={styles.categoryScore}>{item.categories.marketing}</span>
              </div>
            </div>
            {item.gaps.length > 0 && (
              <div className={styles.gaps}>
                <strong>Gaps to Address:</strong>
                <ul>
                  {item.gaps.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {readiness.length === 0 && (
        <div className={styles.emptyState}>
          <p>No readiness checks yet. Run your first assessment to evaluate launch preparedness.</p>
        </div>
      )}
    </div>
  )

  const SilentLaunchSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Silent Launch Mode</h2>
        <p className={styles.subtitle}>Test with limited audience before full launch</p>
      </div>

      {!showSilentForm && (
        <button className={styles.primaryBtn} onClick={() => setShowSilentForm(true)}>
          + Plan Silent Launch
        </button>
      )}

      {showSilentForm && (
        <form className={styles.form} onSubmit={addSilentLaunch}>
          <div className={styles.formGroup}>
            <label>Product Name</label>
            <input name="productName" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Target Audience</label>
            <input name="audience" className={styles.input} placeholder="Early adopters, beta testers..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Duration</label>
            <input name="duration" className={styles.input} placeholder="2 weeks, 1 month..." required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Create Silent Launch</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowSilentForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.silentGrid}>
        {silentLaunches.map(launch => (
          <div key={launch.id} className={styles.silentCard}>
            <div className={styles.silentHeader}>
              <h3>{launch.productName}</h3>
              <span className={`${styles.statusBadge} ${styles[`status${launch.status.charAt(0).toUpperCase() + launch.status.slice(1)}`]}`}>
                {launch.status}
              </span>
            </div>
            <p><strong>Audience:</strong> {launch.targetAudience}</p>
            <p><strong>Duration:</strong> {launch.duration}</p>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{launch.metrics.signups}</span>
                <span className={styles.metricLabel}>Signups</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{launch.metrics.feedback}</span>
                <span className={styles.metricLabel}>Feedback</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{launch.metrics.bugs}</span>
                <span className={styles.metricLabel}>Bugs</span>
              </div>
            </div>
            <div className={styles.silentActions}>
              <button className={styles.secondaryBtn} onClick={() => updateSilentStatus(launch.id, 'active')}>Activate</button>
              <button className={styles.secondaryBtn} onClick={() => updateSilentStatus(launch.id, 'completed')}>Complete</button>
            </div>
          </div>
        ))}
      </div>

      {silentLaunches.length === 0 && (
        <div className={styles.emptyState}>
          <p>No silent launches planned. Create your first silent launch to test with a limited audience.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Go-To-Market System</h1>
          <p className={styles.subtitle}>Complete launch orchestration and optimization platform</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'readiness' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('readiness')}>Readiness Score</button>
          <button className={`${styles.navItem} ${activeSection === 'silent' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('silent')}>Silent Launch</button>
          <button className={`${styles.navItem} ${activeSection === 'testing' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('testing')}>Audience Testing</button>
          <button className={`${styles.navItem} ${activeSection === 'narrative' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('narrative')}>Launch Narrative</button>
          <button className={`${styles.navItem} ${activeSection === 'timing' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('timing')}>Timing Optimizer</button>
          <button className={`${styles.navItem} ${activeSection === 'traction' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('traction')}>Traction Signals</button>
          <button className={`${styles.navItem} ${activeSection === 'channels' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('channels')}>Channel Modeling</button>
          <button className={`${styles.navItem} ${activeSection === 'forecast' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('forecast')}>Demand Forecast</button>
          <button className={`${styles.navItem} ${activeSection === 'decay' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('decay')}>Decay Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'relaunch' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('relaunch')}>Relaunch Planning</button>
          <button className={`${styles.navItem} ${activeSection === 'heatmap' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('heatmap')}>Launch Heatmaps</button>
          <button className={`${styles.navItem} ${activeSection === 'viral' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('viral')}>Viral Triggers</button>
          <button className={`${styles.navItem} ${activeSection === 'conversion' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('conversion')}>Conversion Chokes</button>
          <button className={`${styles.navItem} ${activeSection === 'postmortem' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('postmortem')}>Launch Postmortem</button>
          <button className={`${styles.navItem} ${activeSection === 'assets' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('assets')}>Asset Bundler</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'readiness' && <ReadinessSection />}
          {activeSection === 'silent' && <SilentLaunchSection />}
        </main>
      </div>
    </div>
  )
}
