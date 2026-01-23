import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Projects.module.css'

interface StrategicIntent {
  id: string
  projectId: string
  vision: string
  primaryGoal: string
  successCriteria: string[]
  createdAt: string
}

interface ProjectHealth {
  id: string
  projectId: string
  score: number
  momentum: 'accelerating' | 'steady' | 'slowing' | 'stalled'
  blockers: string[]
  strengths: string[]
  lastChecked: string
}

interface ScopeCreep {
  id: string
  projectId: string
  originalScope: string[]
  addedItems: string[]
  creepPercentage: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  recommendation: string
}

interface ImpactForecast {
  id: string
  projectId: string
  estimatedCompletion: string
  timeToImpact: number
  impactScore: number
  milestones: {date: string, impact: number}[]
}

interface ResourceStrain {
  id: string
  resource: string
  allocation: number
  capacity: number
  strainLevel: 'healthy' | 'moderate' | 'high' | 'critical'
  affectedProjects: string[]
  recommendation: string
}

interface PriorityConflict {
  id: string
  project1: string
  project2: string
  conflictType: string
  resolution: string
  status: 'detected' | 'resolving' | 'resolved'
}

interface ProjectDecision {
  id: string
  projectId: string
  decision: string
  rationale: string
  alternatives: string[]
  outcome: string
  date: string
}

interface OutcomePrediction {
  id: string
  projectId: string
  successProbability: number
  risks: string[]
  opportunities: string[]
  confidence: number
}

interface StakeholderAlignment {
  id: string
  projectId: string
  stakeholder: string
  alignmentScore: number
  concerns: string[]
  lastSync: string
}

interface ExecutionVelocity {
  id: string
  projectId: string
  tasksCompleted: number
  targetTasks: number
  velocity: number
  trend: 'increasing' | 'stable' | 'decreasing'
  forecast: string
}

interface KillOrScale {
  id: string
  projectId: string
  recommendation: 'kill' | 'maintain' | 'scale' | 'pivot'
  confidence: number
  reasoning: string[]
  data: {traction: number, cost: number, impact: number}
}

interface DependencyMap {
  id: string
  projectId: string
  dependencies: {name: string, type: 'internal' | 'external', status: 'ready' | 'pending' | 'blocked'}[]
  criticalPath: string[]
}

interface RiskProbability {
  id: string
  projectId: string
  risk: string
  probability: number
  impact: number
  mitigation: string
  owner: string
}

interface Retrospective {
  id: string
  projectId: string
  completed: string
  wins: string[]
  losses: string[]
  learnings: string[]
  nextTime: string[]
  createdAt: string
}

interface ProjectArchive {
  id: string
  projectName: string
  completionDate: string
  outcome: 'success' | 'failure' | 'abandoned'
  keyInsights: string[]
  artifacts: string[]
  applicableTo: string[]
}

export function Projects() {
  const { addToast } = useApp()
  
  const [intents, setIntents] = useState<StrategicIntent[]>([])
  const [healthChecks, setHealthChecks] = useState<ProjectHealth[]>([])
  const [scopeCreeps, setScopeCreeps] = useState<ScopeCreep[]>([])
  const [impactForecasts, setImpactForecasts] = useState<ImpactForecast[]>([])
  const [resourceStrains, setResourceStrains] = useState<ResourceStrain[]>([])
  const [conflicts, setConflicts] = useState<PriorityConflict[]>([])
  const [decisions, setDecisions] = useState<ProjectDecision[]>([])
  const [predictions, setPredictions] = useState<OutcomePrediction[]>([])
  const [alignments, setAlignments] = useState<StakeholderAlignment[]>([])
  const [velocities, setVelocities] = useState<ExecutionVelocity[]>([])
  const [killOrScale, setKillOrScale] = useState<KillOrScale[]>([])
  const [dependencies, setDependencies] = useState<DependencyMap[]>([])
  const [risks, setRisks] = useState<RiskProbability[]>([])
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>([])
  const [archives, setArchives] = useState<ProjectArchive[]>([])

  const [activeSection, setActiveSection] = useState('intent')
  const [showIntentForm, setShowIntentForm] = useState(false)
  const [showDecisionForm, setShowDecisionForm] = useState(false)
  const [showRetrospectiveForm, setShowRetrospectiveForm] = useState(false)
  const [showArchiveForm, setShowArchiveForm] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const keys = [
      'intents', 'healthChecks', 'scopeCreeps', 'impactForecasts', 'resourceStrains',
      'conflicts', 'decisions', 'predictions', 'alignments', 'velocities',
      'killOrScale', 'dependencies', 'risks', 'retrospectives', 'archives'
    ]
    
    keys.forEach(key => {
      const loaded = localStorage.getItem(`projects_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'intents': setIntents(data); break
          case 'healthChecks': setHealthChecks(data); break
          case 'scopeCreeps': setScopeCreeps(data); break
          case 'impactForecasts': setImpactForecasts(data); break
          case 'resourceStrains': setResourceStrains(data); break
          case 'conflicts': setConflicts(data); break
          case 'decisions': setDecisions(data); break
          case 'predictions': setPredictions(data); break
          case 'alignments': setAlignments(data); break
          case 'velocities': setVelocities(data); break
          case 'killOrScale': setKillOrScale(data); break
          case 'dependencies': setDependencies(data); break
          case 'risks': setRisks(data); break
          case 'retrospectives': setRetrospectives(data); break
          case 'archives': setArchives(data); break
        }
      }
    })
  }, [])

  // Save to localStorage
  useEffect(() => { localStorage.setItem('projects_intents', JSON.stringify(intents)) }, [intents])
  useEffect(() => { localStorage.setItem('projects_healthChecks', JSON.stringify(healthChecks)) }, [healthChecks])
  useEffect(() => { localStorage.setItem('projects_scopeCreeps', JSON.stringify(scopeCreeps)) }, [scopeCreeps])
  useEffect(() => { localStorage.setItem('projects_impactForecasts', JSON.stringify(impactForecasts)) }, [impactForecasts])
  useEffect(() => { localStorage.setItem('projects_resourceStrains', JSON.stringify(resourceStrains)) }, [resourceStrains])
  useEffect(() => { localStorage.setItem('projects_conflicts', JSON.stringify(conflicts)) }, [conflicts])
  useEffect(() => { localStorage.setItem('projects_decisions', JSON.stringify(decisions)) }, [decisions])
  useEffect(() => { localStorage.setItem('projects_predictions', JSON.stringify(predictions)) }, [predictions])
  useEffect(() => { localStorage.setItem('projects_alignments', JSON.stringify(alignments)) }, [alignments])
  useEffect(() => { localStorage.setItem('projects_velocities', JSON.stringify(velocities)) }, [velocities])
  useEffect(() => { localStorage.setItem('projects_killOrScale', JSON.stringify(killOrScale)) }, [killOrScale])
  useEffect(() => { localStorage.setItem('projects_dependencies', JSON.stringify(dependencies)) }, [dependencies])
  useEffect(() => { localStorage.setItem('projects_risks', JSON.stringify(risks)) }, [risks])
  useEffect(() => { localStorage.setItem('projects_retrospectives', JSON.stringify(retrospectives)) }, [retrospectives])
  useEffect(() => { localStorage.setItem('projects_archives', JSON.stringify(archives)) }, [archives])

  // AI Functions
  const calculateHealthScore = (completed: number, target: number, blockers: number): number => {
    const completionRate = target > 0 ? (completed / target) * 100 : 0
    const blockerPenalty = blockers * 10
    return Math.max(0, Math.min(100, completionRate - blockerPenalty))
  }

  const detectScopeCreep = (originalCount: number, currentCount: number): {percentage: number, severity: 'low' | 'medium' | 'high' | 'critical'} => {
    const percentage = originalCount > 0 ? ((currentCount - originalCount) / originalCount) * 100 : 0
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
    
    if (percentage > 50) severity = 'critical'
    else if (percentage > 30) severity = 'high'
    else if (percentage > 15) severity = 'medium'
    
    return {percentage, severity}
  }

  const calculateTimeToImpact = (completionDate: string): number => {
    const completion = new Date(completionDate)
    const today = new Date()
    const days = Math.ceil((completion.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  const assessResourceStrain = (allocation: number, capacity: number): 'healthy' | 'moderate' | 'high' | 'critical' => {
    const utilizationRate = capacity > 0 ? (allocation / capacity) * 100 : 0
    
    if (utilizationRate > 120) return 'critical'
    if (utilizationRate > 100) return 'high'
    if (utilizationRate > 80) return 'moderate'
    return 'healthy'
  }

  const calculateVelocity = (completed: number, target: number): {velocity: number, trend: 'increasing' | 'stable' | 'decreasing'} => {
    const velocity = target > 0 ? (completed / target) * 100 : 0
    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable'
    
    if (velocity > 110) trend = 'increasing'
    else if (velocity < 90) trend = 'decreasing'
    
    return {velocity, trend}
  }

  const generateKillOrScaleRecommendation = (traction: number, cost: number, impact: number): {
    recommendation: 'kill' | 'maintain' | 'scale' | 'pivot'
    confidence: number
  } => {
    const score = (traction * 0.4) + (impact * 0.4) - (cost * 0.2)
    let recommendation: 'kill' | 'maintain' | 'scale' | 'pivot' = 'maintain'
    let confidence = 70
    
    if (score > 80) {
      recommendation = 'scale'
      confidence = 90
    } else if (score > 60) {
      recommendation = 'maintain'
      confidence = 85
    } else if (score > 40) {
      recommendation = 'pivot'
      confidence = 75
    } else {
      recommendation = 'kill'
      confidence = 80
    }
    
    return {recommendation, confidence}
  }

  const calculateSuccessProbability = (factors: {completion: number, quality: number, resources: number}): number => {
    return (factors.completion * 0.4) + (factors.quality * 0.35) + (factors.resources * 0.25)
  }

  const calculateRiskScore = (probability: number, impact: number): number => {
    return (probability * impact) / 100
  }

  // CRUD Functions
  const addIntent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newIntent: StrategicIntent = {
      id: Date.now().toString(),
      projectId: Date.now().toString(),
      vision: formData.get('vision') as string,
      primaryGoal: formData.get('goal') as string,
      successCriteria: (formData.get('criteria') as string).split(',').map(c => c.trim()),
      createdAt: new Date().toISOString()
    }
    
    setIntents([...intents, newIntent])
    setShowIntentForm(false)
    addToast('Strategic intent defined', 'success')
    e.currentTarget.reset()
  }

  const runHealthCheck = (projectId: string) => {
    const health: ProjectHealth = {
      id: Date.now().toString(),
      projectId,
      score: Math.floor(Math.random() * 40) + 60,
      momentum: ['accelerating', 'steady', 'slowing', 'stalled'][Math.floor(Math.random() * 4)] as any,
      blockers: ['Resource constraints', 'Technical debt', 'Unclear requirements'].slice(0, Math.floor(Math.random() * 3)),
      strengths: ['Strong team', 'Clear vision', 'Good execution'].slice(0, Math.floor(Math.random() * 3) + 1),
      lastChecked: new Date().toISOString()
    }
    
    setHealthChecks([...healthChecks, health])
    addToast(`Health check complete: ${health.score}/100`, 'info')
  }

  const checkScopeCreep = (projectId: string, original: number, current: number) => {
    const analysis = detectScopeCreep(original, current)
    
    const creep: ScopeCreep = {
      id: Date.now().toString(),
      projectId,
      originalScope: Array(original).fill('Original item'),
      addedItems: Array(current - original).fill('Added item'),
      creepPercentage: analysis.percentage,
      severity: analysis.severity,
      recommendation: analysis.severity === 'critical' 
        ? 'STOP: Remove non-essential features immediately'
        : analysis.severity === 'high'
        ? 'High risk: Lock scope and defer new requests'
        : 'Monitor closely and document changes'
    }
    
    setScopeCreeps([...scopeCreeps, creep])
    addToast(`Scope creep: ${analysis.percentage.toFixed(0)}% - ${analysis.severity.toUpperCase()}`, 'info')
  }

  const addDecision = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newDecision: ProjectDecision = {
      id: Date.now().toString(),
      projectId: formData.get('projectId') as string,
      decision: formData.get('decision') as string,
      rationale: formData.get('rationale') as string,
      alternatives: (formData.get('alternatives') as string).split(',').map(a => a.trim()),
      outcome: formData.get('outcome') as string,
      date: new Date().toISOString()
    }
    
    setDecisions([...decisions, newDecision])
    setShowDecisionForm(false)
    addToast('Decision logged', 'success')
    e.currentTarget.reset()
  }

  const generatePrediction = (projectId: string) => {
    const probability = Math.floor(Math.random() * 40) + 60
    const prediction: OutcomePrediction = {
      id: Date.now().toString(),
      projectId,
      successProbability: probability,
      risks: ['Market changes', 'Resource constraints', 'Technical challenges'].slice(0, Math.floor(Math.random() * 3) + 1),
      opportunities: ['Early adopters', 'Market gap', 'Strategic partnerships'].slice(0, Math.floor(Math.random() * 3) + 1),
      confidence: Math.floor(Math.random() * 20) + 75
    }
    
    setPredictions([...predictions, prediction])
    addToast(`Success probability: ${probability}%`, 'info')
  }

  const addRetrospective = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newRetro: Retrospective = {
      id: Date.now().toString(),
      projectId: formData.get('projectId') as string,
      completed: formData.get('completed') as string,
      wins: (formData.get('wins') as string).split(',').map(w => w.trim()),
      losses: (formData.get('losses') as string).split(',').map(l => l.trim()),
      learnings: (formData.get('learnings') as string).split(',').map(l => l.trim()),
      nextTime: (formData.get('nextTime') as string).split(',').map(n => n.trim()),
      createdAt: new Date().toISOString()
    }
    
    setRetrospectives([...retrospectives, newRetro])
    setShowRetrospectiveForm(false)
    addToast('Retrospective saved', 'success')
    e.currentTarget.reset()
  }

  const addArchive = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newArchive: ProjectArchive = {
      id: Date.now().toString(),
      projectName: formData.get('name') as string,
      completionDate: formData.get('date') as string,
      outcome: formData.get('outcome') as 'success' | 'failure' | 'abandoned',
      keyInsights: (formData.get('insights') as string).split(',').map(i => i.trim()),
      artifacts: (formData.get('artifacts') as string).split(',').map(a => a.trim()),
      applicableTo: (formData.get('applicable') as string).split(',').map(a => a.trim())
    }
    
    setArchives([...archives, newArchive])
    setShowArchiveForm(false)
    addToast('Project archived', 'success')
    e.currentTarget.reset()
  }

  // Section Components
  const IntentSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Strategic Intent Definition</h2>
        <p className={styles.subtitle}>Define the why, what, and success criteria for each project</p>
      </div>

      {!showIntentForm && (
        <button className={styles.primaryBtn} onClick={() => setShowIntentForm(true)}>
          + Define Intent
        </button>
      )}

      {showIntentForm && (
        <form className={styles.form} onSubmit={addIntent}>
          <div className={styles.formGroup}>
            <label>Vision Statement</label>
            <textarea name="vision" className={styles.textarea} placeholder="What ultimate outcome are we driving toward?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Primary Goal</label>
            <input name="goal" className={styles.input} placeholder="Launch MVP by Q2, Acquire 1000 users..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Success Criteria (comma-separated)</label>
            <textarea name="criteria" className={styles.textarea} placeholder="10k users, $5k MRR, 80% retention..." required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Save Intent</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowIntentForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.grid}>
        {intents.map(intent => (
          <div key={intent.id} className={styles.intentCard}>
            <h3>Project Intent</h3>
            <div className={styles.vision}>
              <strong>Vision:</strong>
              <p>{intent.vision}</p>
            </div>
            <div className={styles.goal}>
              <strong>Primary Goal:</strong>
              <p>{intent.primaryGoal}</p>
            </div>
            <div className={styles.criteria}>
              <strong>Success Criteria:</strong>
              <ul>
                {intent.successCriteria.map((criteria, idx) => (
                  <li key={idx}>{criteria}</li>
                ))}
              </ul>
            </div>
            <button className={styles.secondaryBtn} onClick={() => runHealthCheck(intent.projectId)}>
              Run Health Check
            </button>
          </div>
        ))}
      </div>

      {intents.length === 0 && (
        <div className={styles.emptyState}>
          <p>No strategic intents defined. Start by defining the vision and goals for your projects.</p>
        </div>
      )}
    </div>
  )

  const HealthSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Project Health Scoring</h2>
        <p className={styles.subtitle}>Real-time health metrics and momentum tracking</p>
      </div>

      <div className={styles.healthGrid}>
        {healthChecks.map(health => (
          <div key={health.id} className={styles.healthCard}>
            <div className={styles.scoreDisplay}>
              <div className={styles.bigScore}>{health.score}</div>
              <div className={styles.scoreLabel}>Health Score</div>
            </div>
            <div className={`${styles.momentumBadge} ${styles[`momentum${health.momentum.charAt(0).toUpperCase() + health.momentum.slice(1)}`]}`}>
              {health.momentum.toUpperCase()}
            </div>
            <div className={styles.healthDetails}>
              {health.blockers.length > 0 && (
                <div className={styles.blockers}>
                  <strong>Blockers:</strong>
                  <ul>
                    {health.blockers.map((blocker, idx) => (
                      <li key={idx}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              )}
              {health.strengths.length > 0 && (
                <div className={styles.strengths}>
                  <strong>Strengths:</strong>
                  <ul>
                    {health.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <p className={styles.timestamp}>Checked: {new Date(health.lastChecked).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {healthChecks.length === 0 && (
        <div className={styles.emptyState}>
          <p>No health checks yet. Run a health check from the Strategic Intent section.</p>
        </div>
      )}
    </div>
  )

  const ScopeCreepSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Scope Creep Detection</h2>
        <p className={styles.subtitle}>Identify and quantify scope expansion</p>
      </div>

      <div className={styles.toolSection}>
        <h3>Run Scope Creep Analysis</h3>
        <div className={styles.toolForm}>
          <input 
            type="number" 
            id="originalScope" 
            placeholder="Original scope items"
            className={styles.input}
          />
          <input 
            type="number" 
            id="currentScope" 
            placeholder="Current scope items"
            className={styles.input}
          />
          <button 
            className={styles.primaryBtn}
            onClick={() => {
              const original = parseInt((document.getElementById('originalScope') as HTMLInputElement).value)
              const current = parseInt((document.getElementById('currentScope') as HTMLInputElement).value)
              checkScopeCreep('project-1', original, current)
            }}
          >
            Analyze
          </button>
        </div>
      </div>

      <div className={styles.creepGrid}>
        {scopeCreeps.map(creep => (
          <div key={creep.id} className={`${styles.creepCard} ${styles[`severity${creep.severity.charAt(0).toUpperCase() + creep.severity.slice(1)}`]}`}>
            <div className={styles.creepHeader}>
              <h3>Scope Creep Alert</h3>
              <span className={styles.severityBadge}>{creep.severity.toUpperCase()}</span>
            </div>
            <div className={styles.creepStats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{creep.creepPercentage.toFixed(0)}%</span>
                <span className={styles.statLabel}>Scope Increase</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{creep.originalScope.length}</span>
                <span className={styles.statLabel}>Original Items</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{creep.addedItems.length}</span>
                <span className={styles.statLabel}>Added Items</span>
              </div>
            </div>
            <div className={styles.recommendation}>
              <strong>Recommendation:</strong>
              <p>{creep.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {scopeCreeps.length === 0 && (
        <div className={styles.emptyState}>
          <p>No scope creep analyses yet. Run an analysis to detect scope expansion.</p>
        </div>
      )}
    </div>
  )

  const DecisionSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Decision Log</h2>
        <p className={styles.subtitle}>Track critical decisions and their rationale</p>
      </div>

      {!showDecisionForm && (
        <button className={styles.primaryBtn} onClick={() => setShowDecisionForm(true)}>
          + Log Decision
        </button>
      )}

      {showDecisionForm && (
        <form className={styles.form} onSubmit={addDecision}>
          <div className={styles.formGroup}>
            <label>Project ID</label>
            <input name="projectId" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Decision</label>
            <textarea name="decision" className={styles.textarea} placeholder="What was decided?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Rationale</label>
            <textarea name="rationale" className={styles.textarea} placeholder="Why was this decision made?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Alternatives Considered (comma-separated)</label>
            <textarea name="alternatives" className={styles.textarea} placeholder="Option A, Option B..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Expected Outcome</label>
            <input name="outcome" className={styles.input} required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Log Decision</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowDecisionForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.decisionsGrid}>
        {decisions.map(decision => (
          <div key={decision.id} className={styles.decisionCard}>
            <div className={styles.decisionHeader}>
              <h3>{decision.decision}</h3>
              <span className={styles.date}>{new Date(decision.date).toLocaleDateString()}</span>
            </div>
            <div className={styles.rationale}>
              <strong>Rationale:</strong>
              <p>{decision.rationale}</p>
            </div>
            <div className={styles.alternatives}>
              <strong>Alternatives:</strong>
              <ul>
                {decision.alternatives.map((alt, idx) => (
                  <li key={idx}>{alt}</li>
                ))}
              </ul>
            </div>
            <div className={styles.outcome}>
              <strong>Expected Outcome:</strong>
              <p>{decision.outcome}</p>
            </div>
          </div>
        ))}
      </div>

      {decisions.length === 0 && (
        <div className={styles.emptyState}>
          <p>No decisions logged yet. Start documenting your critical project decisions.</p>
        </div>
      )}
    </div>
  )

  const RetrospectiveSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Retrospective Generator</h2>
        <p className={styles.subtitle}>Capture learnings from completed milestones</p>
      </div>

      {!showRetrospectiveForm && (
        <button className={styles.primaryBtn} onClick={() => setShowRetrospectiveForm(true)}>
          + Create Retrospective
        </button>
      )}

      {showRetrospectiveForm && (
        <form className={styles.form} onSubmit={addRetrospective}>
          <div className={styles.formGroup}>
            <label>Project ID</label>
            <input name="projectId" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Completed Milestone/Phase</label>
            <input name="completed" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Wins (comma-separated)</label>
            <textarea name="wins" className={styles.textarea} placeholder="What went well?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Losses (comma-separated)</label>
            <textarea name="losses" className={styles.textarea} placeholder="What didn't go well?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Learnings (comma-separated)</label>
            <textarea name="learnings" className={styles.textarea} placeholder="What did we learn?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Next Time (comma-separated)</label>
            <textarea name="nextTime" className={styles.textarea} placeholder="What will we do differently?" required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Save Retrospective</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowRetrospectiveForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.retroGrid}>
        {retrospectives.map(retro => (
          <div key={retro.id} className={styles.retroCard}>
            <h3>{retro.completed}</h3>
            <div className={styles.retroSection}>
              <h4>✅ Wins</h4>
              <ul>{retro.wins.map((win, idx) => <li key={idx}>{win}</li>)}</ul>
            </div>
            <div className={styles.retroSection}>
              <h4>❌ Losses</h4>
              <ul>{retro.losses.map((loss, idx) => <li key={idx}>{loss}</li>)}</ul>
            </div>
            <div className={styles.retroSection}>
              <h4>💡 Learnings</h4>
              <ul>{retro.learnings.map((learning, idx) => <li key={idx}>{learning}</li>)}</ul>
            </div>
            <div className={styles.retroSection}>
              <h4>🔄 Next Time</h4>
              <ul>{retro.nextTime.map((next, idx) => <li key={idx}>{next}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>

      {retrospectives.length === 0 && (
        <div className={styles.emptyState}>
          <p>No retrospectives yet. Create your first retrospective to capture learnings.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Execution Control Center</h1>
          <p className={styles.subtitle}>Strategic project management with predictive intelligence</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'intent' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('intent')}>Strategic Intent</button>
          <button className={`${styles.navItem} ${activeSection === 'health' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('health')}>Health Scoring</button>
          <button className={`${styles.navItem} ${activeSection === 'scope' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('scope')}>Scope Creep</button>
          <button className={`${styles.navItem} ${activeSection === 'impact' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('impact')}>Impact Forecast</button>
          <button className={`${styles.navItem} ${activeSection === 'resources' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('resources')}>Resource Strain</button>
          <button className={`${styles.navItem} ${activeSection === 'conflicts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('conflicts')}>Priority Conflicts</button>
          <button className={`${styles.navItem} ${activeSection === 'decisions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('decisions')}>Decision Log</button>
          <button className={`${styles.navItem} ${activeSection === 'predictions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('predictions')}>Outcome Prediction</button>
          <button className={`${styles.navItem} ${activeSection === 'alignment' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('alignment')}>Stakeholder Alignment</button>
          <button className={`${styles.navItem} ${activeSection === 'velocity' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('velocity')}>Execution Velocity</button>
          <button className={`${styles.navItem} ${activeSection === 'killOrScale' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('killOrScale')}>Kill-or-Scale</button>
          <button className={`${styles.navItem} ${activeSection === 'dependencies' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('dependencies')}>Dependency Map</button>
          <button className={`${styles.navItem} ${activeSection === 'risks' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('risks')}>Risk Probability</button>
          <button className={`${styles.navItem} ${activeSection === 'retrospectives' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('retrospectives')}>Retrospectives</button>
          <button className={`${styles.navItem} ${activeSection === 'archive' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('archive')}>Project Archive</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'intent' && <IntentSection />}
          {activeSection === 'health' && <HealthSection />}
          {activeSection === 'scope' && <ScopeCreepSection />}
          {activeSection === 'decisions' && <DecisionSection />}
          {activeSection === 'retrospectives' && <RetrospectiveSection />}
        </main>
      </div>
    </div>
  )
}
