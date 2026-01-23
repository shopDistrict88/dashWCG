import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Growth.module.css'

interface Experiment {
  id: string
  hypothesis: string
  metric: string
  baseline: number
  target: number
  actual: number
  duration: number
  status: 'draft' | 'running' | 'completed' | 'failed'
  learnings: string
  validated: boolean
}

interface Hypothesis {
  id: string
  statement: string
  assumption: string
  testMethod: string
  successCriteria: string
  confidence: number
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface ABTest {
  id: string
  name: string
  variants: {name: string, traffic: number, conversions: number, conversionRate: number}[]
  sampleSize: number
  significance: number
  winner?: string
  status: 'planning' | 'running' | 'completed'
}

interface GrowthLoop {
  id: string
  name: string
  steps: {step: string, metric: string, target: number}[]
  velocity: number
  efficiency: number
  bottleneck?: string
  status: 'active' | 'broken' | 'optimizing'
}

interface ViralCoefficient {
  id: string
  period: string
  invitesSent: number
  invitesAccepted: number
  kFactor: number
  viralCycleTime: number
  viralityRating: 'dying' | 'stable' | 'growing' | 'viral'
}

interface CohortAnalysis {
  id: string
  cohort: string
  size: number
  day1: number
  day7: number
  day30: number
  day90: number
  churnRate: number
  ltv: number
}

interface ActivationFunnel {
  id: string
  step: string
  users: number
  dropoff: number
  conversionRate: number
  avgTimeToComplete: number
  improvement: string
}

interface ReferralProgram {
  id: string
  name: string
  incentive: string
  referrals: number
  conversions: number
  cost: number
  roi: number
  status: 'active' | 'paused' | 'testing'
}

interface GrowthChannel {
  id: string
  channel: string
  users: number
  cost: number
  cac: number
  ltv: number
  ltvCacRatio: number
  priority: number
  status: 'testing' | 'scaling' | 'paused'
}

interface PLGMotion {
  id: string
  motion: string
  trigger: string
  action: string
  impact: string
  adoptionRate: number
  revenueImpact: number
}

interface ConversionOptimization {
  id: string
  page: string
  currentRate: number
  targetRate: number
  changes: {change: string, impact: number}[]
  projectedLift: number
  priority: number
}

interface GrowthModel {
  id: string
  model: string
  inputs: {variable: string, value: number}[]
  monthlyGrowth: number
  year1: number
  year3: number
  assumptions: string[]
}

interface AcquisitionCost {
  id: string
  channel: string
  spend: number
  users: number
  cac: number
  paybackPeriod: number
  sustainable: boolean
}

interface LTVOptimization {
  id: string
  segment: string
  currentLTV: number
  targetLTV: number
  tactics: {tactic: string, impact: number}[]
  projectedLTV: number
  effort: 'low' | 'medium' | 'high'
}

interface GrowthPlaybook {
  id: string
  playbook: string
  stage: string
  tactics: string[]
  expectedImpact: string
  timeframe: string
  difficulty: number
  proven: boolean
}

export function Growth() {
  const { addToast } = useApp()
  
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([])
  const [abTests, setAbTests] = useState<ABTest[]>([])
  const [loops, setLoops] = useState<GrowthLoop[]>([])
  const [viral, setViral] = useState<ViralCoefficient[]>([])
  const [cohorts, setCohorts] = useState<CohortAnalysis[]>([])
  const [funnels, setFunnels] = useState<ActivationFunnel[]>([])
  const [referrals, setReferrals] = useState<ReferralProgram[]>([])
  const [channels, setChannels] = useState<GrowthChannel[]>([])
  const [plg, setPlg] = useState<PLGMotion[]>([])
  const [conversions, setConversions] = useState<ConversionOptimization[]>([])
  const [models, setModels] = useState<GrowthModel[]>([])
  const [acquisition, setAcquisition] = useState<AcquisitionCost[]>([])
  const [ltvOpt, setLtvOpt] = useState<LTVOptimization[]>([])
  const [playbooks, setPlaybooks] = useState<GrowthPlaybook[]>([])

  const [activeSection, setActiveSection] = useState('experiments')

  useEffect(() => {
    const keys = ['experiments', 'hypotheses', 'abTests', 'loops', 'viral', 'cohorts', 'funnels', 'referrals', 'channels', 'plg', 'conversions', 'models', 'acquisition', 'ltvOpt', 'playbooks']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`growth_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'experiments': setExperiments(data); break
          case 'hypotheses': setHypotheses(data); break
          case 'abTests': setAbTests(data); break
          case 'loops': setLoops(data); break
          case 'viral': setViral(data); break
          case 'cohorts': setCohorts(data); break
          case 'funnels': setFunnels(data); break
          case 'referrals': setReferrals(data); break
          case 'channels': setChannels(data); break
          case 'plg': setPlg(data); break
          case 'conversions': setConversions(data); break
          case 'models': setModels(data); break
          case 'acquisition': setAcquisition(data); break
          case 'ltvOpt': setLtvOpt(data); break
          case 'playbooks': setPlaybooks(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('growth_experiments', JSON.stringify(experiments)) }, [experiments])
  useEffect(() => { localStorage.setItem('growth_hypotheses', JSON.stringify(hypotheses)) }, [hypotheses])
  useEffect(() => { localStorage.setItem('growth_abTests', JSON.stringify(abTests)) }, [abTests])
  useEffect(() => { localStorage.setItem('growth_loops', JSON.stringify(loops)) }, [loops])
  useEffect(() => { localStorage.setItem('growth_viral', JSON.stringify(viral)) }, [viral])
  useEffect(() => { localStorage.setItem('growth_cohorts', JSON.stringify(cohorts)) }, [cohorts])
  useEffect(() => { localStorage.setItem('growth_funnels', JSON.stringify(funnels)) }, [funnels])
  useEffect(() => { localStorage.setItem('growth_referrals', JSON.stringify(referrals)) }, [referrals])
  useEffect(() => { localStorage.setItem('growth_channels', JSON.stringify(channels)) }, [channels])
  useEffect(() => { localStorage.setItem('growth_plg', JSON.stringify(plg)) }, [plg])
  useEffect(() => { localStorage.setItem('growth_conversions', JSON.stringify(conversions)) }, [conversions])
  useEffect(() => { localStorage.setItem('growth_models', JSON.stringify(models)) }, [models])
  useEffect(() => { localStorage.setItem('growth_acquisition', JSON.stringify(acquisition)) }, [acquisition])
  useEffect(() => { localStorage.setItem('growth_ltvOpt', JSON.stringify(ltvOpt)) }, [ltvOpt])
  useEffect(() => { localStorage.setItem('growth_playbooks', JSON.stringify(playbooks)) }, [playbooks])

  // AI Functions
  const calculateViralCoefficient = (invites: number, accepted: number): number => {
    if (invites === 0) return 0
    return accepted / invites
  }

  const assessVirality = (kFactor: number): 'dying' | 'stable' | 'growing' | 'viral' => {
    if (kFactor < 0.5) return 'dying'
    if (kFactor < 1) return 'stable'
    if (kFactor < 1.5) return 'growing'
    return 'viral'
  }

  const calculateRetention = (day1: number, day30: number, cohortSize: number): number => {
    if (cohortSize === 0) return 0
    return (day30 / cohortSize) * 100
  }

  const calculateChurnRate = (day1: number, day30: number): number => {
    if (day1 === 0) return 0
    const retained = day30 / day1
    return (1 - retained) * 100
  }

  const identifyFunnelBottleneck = (funnel: ActivationFunnel[]): string => {
    if (funnel.length === 0) return 'No data'
    
    let maxDropoff = 0
    let bottleneck = ''
    
    funnel.forEach(step => {
      if (step.dropoff > maxDropoff) {
        maxDropoff = step.dropoff
        bottleneck = step.step
      }
    })
    
    return bottleneck
  }

  const calculateReferralROI = (conversions: number, avgRevenue: number, cost: number): number => {
    const revenue = conversions * avgRevenue
    if (cost === 0) return 0
    return ((revenue - cost) / cost) * 100
  }

  const calculateLTVCACRatio = (ltv: number, cac: number): number => {
    if (cac === 0) return 0
    return ltv / cac
  }

  const prioritizeChannel = (ltvCacRatio: number, volume: number): number => {
    let score = 0
    
    if (ltvCacRatio >= 3) score += 50
    else if (ltvCacRatio >= 2) score += 30
    else if (ltvCacRatio >= 1) score += 10
    
    if (volume >= 1000) score += 30
    else if (volume >= 100) score += 20
    else if (volume >= 10) score += 10
    
    return Math.min(100, score)
  }

  const projectGrowth = (baseUsers: number, monthlyGrowthRate: number, months: number): number => {
    return Math.round(baseUsers * Math.pow(1 + monthlyGrowthRate / 100, months))
  }

  const calculatePaybackPeriod = (cac: number, monthlyRevenue: number): number => {
    if (monthlyRevenue === 0) return 999
    return Math.round(cac / monthlyRevenue)
  }

  const assessExperimentSuccess = (baseline: number, actual: number, target: number): boolean => {
    const improvement = ((actual - baseline) / baseline) * 100
    const targetImprovement = ((target - baseline) / baseline) * 100
    return improvement >= targetImprovement
  }

  // CRUD Functions
  const addExperiment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const baseline = parseFloat(formData.get('baseline') as string)
    const target = parseFloat(formData.get('target') as string)
    const actual = parseFloat(formData.get('actual') as string || '0')
    
    const validated = assessExperimentSuccess(baseline, actual, target)
    
    const newExperiment: Experiment = {
      id: Date.now().toString(),
      hypothesis: formData.get('hypothesis') as string,
      metric: formData.get('metric') as string,
      baseline,
      target,
      actual,
      duration: parseInt(formData.get('duration') as string),
      status: 'draft',
      learnings: '',
      validated
    }
    
    setExperiments([...experiments, newExperiment])
    addToast('Experiment created', 'success')
    e.currentTarget.reset()
  }

  const calculateViral = (invites: number, accepted: number, cycleTime: number) => {
    const kFactor = calculateViralCoefficient(invites, accepted)
    const rating = assessVirality(kFactor)
    
    const newViral: ViralCoefficient = {
      id: Date.now().toString(),
      period: new Date().toISOString().split('T')[0],
      invitesSent: invites,
      invitesAccepted: accepted,
      kFactor,
      viralCycleTime: cycleTime,
      viralityRating: rating
    }
    
    setViral([...viral, newViral])
    addToast(`K-Factor: ${kFactor.toFixed(2)} - ${rating.toUpperCase()}`, rating === 'viral' ? 'success' : 'info')
  }

  const analyzeCohort = (cohort: string, size: number, d1: number, d7: number, d30: number, d90: number) => {
    const churnRate = calculateChurnRate(d1, d30)
    const retention30 = calculateRetention(d1, d30, size)
    
    const newCohort: CohortAnalysis = {
      id: Date.now().toString(),
      cohort,
      size,
      day1: d1,
      day7: d7,
      day30: d30,
      day90: d90,
      churnRate,
      ltv: (retention30 / 100) * 100 // Simplified LTV
    }
    
    setCohorts([...cohorts, newCohort])
    addToast(`Cohort analyzed - ${retention30.toFixed(1)}% retention`, 'success')
  }

  const analyzeChannel = (channel: string, users: number, cost: number, ltv: number) => {
    const cac = cost / users
    const ltvCacRatio = calculateLTVCACRatio(ltv, cac)
    const priority = prioritizeChannel(ltvCacRatio, users)
    
    const newChannel: GrowthChannel = {
      id: Date.now().toString(),
      channel,
      users,
      cost,
      cac,
      ltv,
      ltvCacRatio,
      priority,
      status: ltvCacRatio >= 3 ? 'scaling' : ltvCacRatio >= 1 ? 'testing' : 'paused'
    }
    
    setChannels([...channels, newChannel])
    addToast(`${channel}: ${ltvCacRatio.toFixed(1)}x LTV:CAC`, ltvCacRatio >= 3 ? 'success' : 'info')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Growth Experiments</h1>
          <p className={styles.subtitle}>Data-driven growth and experimentation framework</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'experiments' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('experiments')}>Experiments</button>
          <button className={`${styles.navItem} ${activeSection === 'hypothesis' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('hypothesis')}>Hypothesis Validator</button>
          <button className={`${styles.navItem} ${activeSection === 'ab' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('ab')}>A/B Tests</button>
          <button className={`${styles.navItem} ${activeSection === 'loops' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('loops')}>Growth Loops</button>
          <button className={`${styles.navItem} ${activeSection === 'viral' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('viral')}>Viral Coefficient</button>
          <button className={`${styles.navItem} ${activeSection === 'cohorts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('cohorts')}>Cohort Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'funnel' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('funnel')}>Activation Funnel</button>
          <button className={`${styles.navItem} ${activeSection === 'referral' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('referral')}>Referral Programs</button>
          <button className={`${styles.navItem} ${activeSection === 'channels' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('channels')}>Growth Channels</button>
          <button className={`${styles.navItem} ${activeSection === 'plg' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('plg')}>PLG Motions</button>
          <button className={`${styles.navItem} ${activeSection === 'conversion' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('conversion')}>Conversion Optimizer</button>
          <button className={`${styles.navItem} ${activeSection === 'model' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('model')}>Growth Model</button>
          <button className={`${styles.navItem} ${activeSection === 'acquisition' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('acquisition')}>Acquisition Cost</button>
          <button className={`${styles.navItem} ${activeSection === 'ltv' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('ltv')}>LTV Optimizer</button>
          <button className={`${styles.navItem} ${activeSection === 'playbook' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('playbook')}>Growth Playbooks</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'experiments' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Growth Experiments</h2>
                <p>Run structured experiments to validate growth hypotheses</p>
              </div>

              <form onSubmit={addExperiment} className={styles.form}>
                <input name="hypothesis" placeholder="Hypothesis" required className={styles.input} />
                <input name="metric" placeholder="Metric to measure" required className={styles.input} />
                <input name="baseline" type="number" step="0.01" placeholder="Baseline value" required className={styles.input} />
                <input name="target" type="number" step="0.01" placeholder="Target value" required className={styles.input} />
                <input name="duration" type="number" placeholder="Duration (days)" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Create Experiment</button>
              </form>

              <div className={styles.experimentGrid}>
                {experiments.map(exp => (
                  <div key={exp.id} className={`${styles.experimentCard} ${styles[exp.status]}`}>
                    <div className={styles.status}>{exp.status}</div>
                    <h3>{exp.hypothesis}</h3>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>{exp.metric}</span>
                      <div className={styles.metricValues}>
                        <span>Baseline: {exp.baseline}</span>
                        <span>Target: {exp.target}</span>
                        {exp.actual > 0 && <span className={styles.actual}>Actual: {exp.actual}</span>}
                      </div>
                    </div>
                    {exp.validated && <div className={styles.validated}>✓ Validated</div>}
                    <div className={styles.duration}>{exp.duration} days</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'viral' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Viral Coefficient Calculator</h2>
                <p>Measure and optimize your viral growth loops</p>
              </div>

              <div className={styles.calculator}>
                <h3>Calculate K-Factor</h3>
                <div className={styles.calcInputs}>
                  <input type="number" id="invites" placeholder="Invites sent" className={styles.input} />
                  <input type="number" id="accepted" placeholder="Invites accepted" className={styles.input} />
                  <input type="number" id="cycleTime" placeholder="Viral cycle time (days)" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const invites = parseFloat((document.getElementById('invites') as HTMLInputElement).value)
                      const accepted = parseFloat((document.getElementById('accepted') as HTMLInputElement).value)
                      const cycle = parseFloat((document.getElementById('cycleTime') as HTMLInputElement).value)
                      calculateViral(invites, accepted, cycle)
                    }}
                  >
                    Calculate
                  </button>
                </div>

                <div className={styles.viralGrid}>
                  {viral.map(v => (
                    <div key={v.id} className={`${styles.viralCard} ${styles[v.viralityRating]}`}>
                      <div className={styles.bigNumber}>{v.kFactor.toFixed(2)}</div>
                      <div className={styles.label}>K-Factor</div>
                      <div className={styles.viralityBadge}>{v.viralityRating.toUpperCase()}</div>
                      <div className={styles.viralDetails}>
                        <p><strong>Invites Sent:</strong> {v.invitesSent}</p>
                        <p><strong>Accepted:</strong> {v.invitesAccepted}</p>
                        <p><strong>Cycle Time:</strong> {v.viralCycleTime} days</p>
                      </div>
                      <div className={styles.interpretation}>
                        {v.kFactor >= 1 ? 'Viral growth! Each user brings more than 1 new user.' : 'Sub-viral. Need to increase invites or acceptance rate.'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSection === 'channels' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Growth Channel Prioritization</h2>
                <p>Analyze and prioritize growth channels by LTV:CAC ratio</p>
              </div>

              <div className={styles.calculator}>
                <h3>Analyze Channel</h3>
                <div className={styles.calcInputs}>
                  <input type="text" id="channelName" placeholder="Channel name" className={styles.input} />
                  <input type="number" id="channelUsers" placeholder="Users acquired" className={styles.input} />
                  <input type="number" id="channelCost" placeholder="Total cost ($)" className={styles.input} />
                  <input type="number" id="channelLTV" placeholder="LTV per user ($)" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const channel = (document.getElementById('channelName') as HTMLInputElement).value
                      const users = parseFloat((document.getElementById('channelUsers') as HTMLInputElement).value)
                      const cost = parseFloat((document.getElementById('channelCost') as HTMLInputElement).value)
                      const ltv = parseFloat((document.getElementById('channelLTV') as HTMLInputElement).value)
                      analyzeChannel(channel, users, cost, ltv)
                    }}
                  >
                    Analyze
                  </button>
                </div>

                <div className={styles.channelGrid}>
                  {channels.sort((a, b) => b.priority - a.priority).map(ch => (
                    <div key={ch.id} className={`${styles.channelCard} ${styles[ch.status]}`}>
                      <h3>{ch.channel}</h3>
                      <div className={styles.channelStatus}>{ch.status}</div>
                      <div className={styles.channelMetrics}>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>LTV:CAC</span>
                          <span className={`${styles.metricValue} ${ch.ltvCacRatio >= 3 ? styles.good : ch.ltvCacRatio >= 1 ? styles.ok : styles.bad}`}>
                            {ch.ltvCacRatio.toFixed(1)}x
                          </span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>CAC</span>
                          <span className={styles.metricValue}>${ch.cac.toFixed(0)}</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Users</span>
                          <span className={styles.metricValue}>{ch.users}</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Priority</span>
                          <span className={styles.metricValue}>{ch.priority}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
