import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './CreatorTools.module.css'

interface ProblemStatement {
  id: string
  problem: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  frequency: number
  affectedUsers: number
  painScore: number
  validated: boolean
}

interface SolutionHypothesis {
  id: string
  problemId: string
  solution: string
  approach: string
  effort: number
  impact: number
  confidence: number
  status: 'idea' | 'testing' | 'validated' | 'rejected'
}

interface ProblemSolutionFit {
  id: string
  problemId: string
  solutionId: string
  fitScore: number
  gaps: string[]
  strengths: string[]
  recommendation: string
}

interface UserPainPoint {
  id: string
  pain: string
  context: string
  workarounds: string[]
  willingnessToPay: number
  urgency: number
}

interface RootCauseAnalysis {
  id: string
  problemId: string
  symptom: string
  causes: {cause: string, level: number}[]
  rootCause: string
  solution: string
}

interface SolutionCanvas {
  id: string
  solution: string
  problem: string
  targetUser: string
  keyFeatures: string[]
  benefits: string[]
  differentiation: string
  risks: string[]
}

interface AssumptionMapping {
  id: string
  assumption: string
  critical: boolean
  tested: boolean
  result?: 'validated' | 'invalidated' | 'inconclusive'
  evidence: string[]
}

interface JobsToBeDone {
  id: string
  job: string
  situation: string
  motivation: string
  outcome: string
  competingAlternatives: string[]
  satisfaction: number
}

interface ProblemSpace {
  id: string
  space: string
  problems: string[]
  opportunities: number
  competition: number
  attractiveness: number
}

interface SolutionTesting {
  id: string
  solutionId: string
  method: string
  participants: number
  results: string[]
  learnings: string[]
  nextIteration: string
}

interface CompetitiveSolution {
  id: string
  competitor: string
  solution: string
  strengths: string[]
  weaknesses: string[]
  gaps: string[]
  differentiation: string
}

interface ConstraintMapping {
  id: string
  constraint: string
  type: 'technical' | 'business' | 'legal' | 'resource'
  impact: number
  workaround?: string
  negotiable: boolean
}

interface OutcomeMapping {
  id: string
  problem: string
  solution: string
  expectedOutcome: string
  measurableMetrics: string[]
  timeframe: string
  successCriteria: number
}

interface FeedbackSynthesis {
  id: string
  source: string
  feedback: string[]
  themes: string[]
  priority: number
  actionable: string[]
}

interface IterationHistory {
  id: string
  problemId: string
  solutionId: string
  iteration: number
  changes: string[]
  results: string
  improved: boolean
  date: string
}

export function CreatorTools() {
  const { addToast } = useApp()
  
  const [problems, setProblems] = useState<ProblemStatement[]>([])
  const [solutions, setSolutions] = useState<SolutionHypothesis[]>([])
  const [fits, setFits] = useState<ProblemSolutionFit[]>([])
  const [painPoints, setPainPoints] = useState<UserPainPoint[]>([])
  const [rootCause, setRootCause] = useState<RootCauseAnalysis[]>([])
  const [canvas, setCanvas] = useState<SolutionCanvas[]>([])
  const [assumptions, setAssumptions] = useState<AssumptionMapping[]>([])
  const [jobs, setJobs] = useState<JobsToBeDone[]>([])
  const [spaces, setSpaces] = useState<ProblemSpace[]>([])
  const [testing, setTesting] = useState<SolutionTesting[]>([])
  const [competitive, setCompetitive] = useState<CompetitiveSolution[]>([])
  const [constraints, setConstraints] = useState<ConstraintMapping[]>([])
  const [outcomes, setOutcomes] = useState<OutcomeMapping[]>([])
  const [feedback, setFeedback] = useState<FeedbackSynthesis[]>([])
  const [history, setHistory] = useState<IterationHistory[]>([])

  const [activeSection, setActiveSection] = useState('problems')

  useEffect(() => {
    const keys = ['problems', 'solutions', 'fits', 'painPoints', 'rootCause', 'canvas', 'assumptions', 'jobs', 'spaces', 'testing', 'competitive', 'constraints', 'outcomes', 'feedback', 'history']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`creatortools_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'problems': setProblems(data); break
          case 'solutions': setSolutions(data); break
          case 'fits': setFits(data); break
          case 'painPoints': setPainPoints(data); break
          case 'rootCause': setRootCause(data); break
          case 'canvas': setCanvas(data); break
          case 'assumptions': setAssumptions(data); break
          case 'jobs': setJobs(data); break
          case 'spaces': setSpaces(data); break
          case 'testing': setTesting(data); break
          case 'competitive': setCompetitive(data); break
          case 'constraints': setConstraints(data); break
          case 'outcomes': setOutcomes(data); break
          case 'feedback': setFeedback(data); break
          case 'history': setHistory(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('creatortools_problems', JSON.stringify(problems)) }, [problems])
  useEffect(() => { localStorage.setItem('creatortools_solutions', JSON.stringify(solutions)) }, [solutions])
  useEffect(() => { localStorage.setItem('creatortools_fits', JSON.stringify(fits)) }, [fits])
  useEffect(() => { localStorage.setItem('creatortools_painPoints', JSON.stringify(painPoints)) }, [painPoints])
  useEffect(() => { localStorage.setItem('creatortools_rootCause', JSON.stringify(rootCause)) }, [rootCause])
  useEffect(() => { localStorage.setItem('creatortools_canvas', JSON.stringify(canvas)) }, [canvas])
  useEffect(() => { localStorage.setItem('creatortools_assumptions', JSON.stringify(assumptions)) }, [assumptions])
  useEffect(() => { localStorage.setItem('creatortools_jobs', JSON.stringify(jobs)) }, [jobs])
  useEffect(() => { localStorage.setItem('creatortools_spaces', JSON.stringify(spaces)) }, [spaces])
  useEffect(() => { localStorage.setItem('creatortools_testing', JSON.stringify(testing)) }, [testing])
  useEffect(() => { localStorage.setItem('creatortools_competitive', JSON.stringify(competitive)) }, [competitive])
  useEffect(() => { localStorage.setItem('creatortools_constraints', JSON.stringify(constraints)) }, [constraints])
  useEffect(() => { localStorage.setItem('creatortools_outcomes', JSON.stringify(outcomes)) }, [outcomes])
  useEffect(() => { localStorage.setItem('creatortools_feedback', JSON.stringify(feedback)) }, [feedback])
  useEffect(() => { localStorage.setItem('creatortools_history', JSON.stringify(history)) }, [history])

  // AI Functions
  const calculatePainScore = (severity: string, frequency: number, affectedUsers: number): number => {
    let severityScore = 0
    if (severity === 'critical') severityScore = 40
    else if (severity === 'high') severityScore = 30
    else if (severity === 'medium') severityScore = 20
    else severityScore = 10
    
    const frequencyScore = Math.min(30, frequency * 3)
    const userScore = Math.min(30, Math.log10(affectedUsers + 1) * 10)
    
    return Math.round(severityScore + frequencyScore + userScore)
  }

  const calculateSolutionConfidence = (effort: number, impact: number, evidence: number): number => {
    const efficiencyScore = impact / Math.max(effort, 1)
    const evidenceScore = Math.min(50, evidence * 10)
    return Math.round(Math.min(100, efficiencyScore * 20 + evidenceScore))
  }

  const calculateProblemSolutionFit = (problemScore: number, solutionImpact: number, gaps: number): number => {
    const baseScore = (problemScore + solutionImpact) / 2
    const gapPenalty = gaps * 10
    return Math.max(0, Math.round(baseScore - gapPenalty))
  }

  const calculateUrgency = (frequency: number, willingnessToPay: number): number => {
    return Math.round((frequency * 0.4 + willingnessToPay * 0.6))
  }

  const identifyRootCause = (causes: {cause: string, level: number}[]): string => {
    if (causes.length === 0) return 'No causes identified'
    const deepestLevel = Math.max(...causes.map(c => c.level))
    const rootCauses = causes.filter(c => c.level === deepestLevel)
    return rootCauses.map(c => c.cause).join(', ')
  }

  const calculateSpaceAttractiveness = (opportunities: number, competition: number): number => {
    if (competition === 0) return opportunities * 10
    const ratio = opportunities / competition
    return Math.min(100, Math.round(ratio * 20))
  }

  const calculateJobSatisfaction = (competingAlts: number, painLevel: number): number => {
    let score = 100
    score -= competingAlts * 15
    score -= painLevel * 0.5
    return Math.max(0, Math.round(score))
  }

  const prioritizeFeedback = (feedback: string[], themes: number): number => {
    const volume = feedback.length
    const themeDensity = themes > 0 ? volume / themes : 0
    return Math.min(100, Math.round((volume * 5) + (themeDensity * 10)))
  }

  const assessAssumptionRisk = (critical: boolean, tested: boolean): 'high' | 'medium' | 'low' => {
    if (critical && !tested) return 'high'
    if (critical && tested) return 'medium'
    if (!critical && !tested) return 'medium'
    return 'low'
  }

  // CRUD Functions
  const addProblem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const severity = formData.get('severity') as ProblemStatement['severity']
    const frequency = parseInt(formData.get('frequency') as string)
    const affectedUsers = parseInt(formData.get('affectedUsers') as string)
    const painScore = calculatePainScore(severity, frequency, affectedUsers)
    
    const newProblem: ProblemStatement = {
      id: Date.now().toString(),
      problem: formData.get('problem') as string,
      severity,
      frequency,
      affectedUsers,
      painScore,
      validated: false
    }
    
    setProblems([...problems, newProblem])
    addToast(`Problem added - Pain score: ${painScore}`, 'success')
    e.currentTarget.reset()
  }

  const addSolution = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const effort = parseInt(formData.get('effort') as string)
    const impact = parseInt(formData.get('impact') as string)
    const confidence = calculateSolutionConfidence(effort, impact, 0)
    
    const newSolution: SolutionHypothesis = {
      id: Date.now().toString(),
      problemId: formData.get('problemId') as string,
      solution: formData.get('solution') as string,
      approach: formData.get('approach') as string,
      effort,
      impact,
      confidence,
      status: 'idea'
    }
    
    setSolutions([...solutions, newSolution])
    addToast(`Solution added - ${confidence}% confidence`, 'success')
    e.currentTarget.reset()
  }

  const calculateFit = (problemId: string, solutionId: string) => {
    const problem = problems.find(p => p.id === problemId)
    const solution = solutions.find(s => s.id === solutionId)
    
    if (!problem || !solution) {
      addToast('Problem or solution not found', 'error')
      return
    }
    
    const fitScore = calculateProblemSolutionFit(problem.painScore, solution.impact, 0)
    
    const newFit: ProblemSolutionFit = {
      id: Date.now().toString(),
      problemId,
      solutionId,
      fitScore,
      gaps: [],
      strengths: ['High impact', 'Clear approach'],
      recommendation: fitScore >= 70 ? 'Proceed with development' : fitScore >= 50 ? 'Test with MVP' : 'Rethink approach'
    }
    
    setFits([...fits, newFit])
    addToast(`Fit score: ${fitScore}`, fitScore >= 70 ? 'success' : 'info')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Problem–Solution Mapper</h1>
          <p className={styles.subtitle}>Map problems to solutions with systematic validation</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'problems' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('problems')}>Problem Statements</button>
          <button className={`${styles.navItem} ${activeSection === 'solutions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('solutions')}>Solution Hypotheses</button>
          <button className={`${styles.navItem} ${activeSection === 'fit' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('fit')}>Problem-Solution Fit</button>
          <button className={`${styles.navItem} ${activeSection === 'pain' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('pain')}>User Pain Points</button>
          <button className={`${styles.navItem} ${activeSection === 'root' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('root')}>Root Cause Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'canvas' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('canvas')}>Solution Canvas</button>
          <button className={`${styles.navItem} ${activeSection === 'assumptions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('assumptions')}>Assumption Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'jobs' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('jobs')}>Jobs to Be Done</button>
          <button className={`${styles.navItem} ${activeSection === 'space' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('space')}>Problem Space</button>
          <button className={`${styles.navItem} ${activeSection === 'testing' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('testing')}>Solution Testing</button>
          <button className={`${styles.navItem} ${activeSection === 'competitive' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('competitive')}>Competitive Solutions</button>
          <button className={`${styles.navItem} ${activeSection === 'constraints' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('constraints')}>Constraint Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'outcomes' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('outcomes')}>Outcome Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'feedback' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('feedback')}>Feedback Synthesis</button>
          <button className={`${styles.navItem} ${activeSection === 'history' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('history')}>Iteration History</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'problems' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Problem Statements</h2>
                <p>Define and quantify problems worth solving</p>
              </div>

              <form onSubmit={addProblem} className={styles.form}>
                <textarea name="problem" placeholder="Describe the problem" required className={styles.textarea} rows={3}></textarea>
                <select name="severity" required className={styles.select}>
                  <option value="">Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <input name="frequency" type="number" placeholder="Frequency (times/week)" required className={styles.input} />
                <input name="affectedUsers" type="number" placeholder="Affected users" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Add Problem</button>
              </form>

              <div className={styles.problemGrid}>
                {problems.sort((a, b) => b.painScore - a.painScore).map(prob => (
                  <div key={prob.id} className={`${styles.problemCard} ${styles[prob.severity]}`}>
                    <div className={styles.painScore}>
                      <span className={styles.score}>{prob.painScore}</span>
                      <span className={styles.label}>Pain Score</span>
                    </div>
                    <div className={styles.severityBadge}>{prob.severity.toUpperCase()}</div>
                    <p className={styles.problemText}>{prob.problem}</p>
                    <div className={styles.problemMeta}>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>{prob.frequency}x</span>
                        <span className={styles.statLabel}>per week</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>{prob.affectedUsers.toLocaleString()}</span>
                        <span className={styles.statLabel}>users</span>
                      </div>
                    </div>
                    {prob.validated && <div className={styles.validated}>✓ Validated</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'solutions' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Solution Hypotheses</h2>
                <p>Propose and evaluate potential solutions</p>
              </div>

              <form onSubmit={addSolution} className={styles.form}>
                <select name="problemId" required className={styles.select}>
                  <option value="">Select problem</option>
                  {problems.map(p => (
                    <option key={p.id} value={p.id}>{p.problem.substring(0, 50)}...</option>
                  ))}
                </select>
                <textarea name="solution" placeholder="Proposed solution" required className={styles.textarea} rows={3}></textarea>
                <textarea name="approach" placeholder="Implementation approach" required className={styles.textarea} rows={2}></textarea>
                <input name="effort" type="number" placeholder="Effort (1-10)" min="1" max="10" required className={styles.input} />
                <input name="impact" type="number" placeholder="Expected impact (1-100)" min="1" max="100" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Add Solution</button>
              </form>

              <div className={styles.solutionGrid}>
                {solutions.map(sol => {
                  const problem = problems.find(p => p.id === sol.problemId)
                  return (
                    <div key={sol.id} className={`${styles.solutionCard} ${styles[sol.status]}`}>
                      <div className={styles.status}>{sol.status}</div>
                      <div className={styles.confidenceBadge}>{sol.confidence}% confidence</div>
                      <h3>{sol.solution}</h3>
                      {problem && <p className={styles.linkedProblem}>Solves: {problem.problem.substring(0, 60)}...</p>}
                      <p className={styles.approach}>{sol.approach}</p>
                      <div className={styles.solutionMetrics}>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Effort</span>
                          <span className={styles.metricValue}>{sol.effort}/10</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Impact</span>
                          <span className={styles.metricValue}>{sol.impact}/100</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Ratio</span>
                          <span className={styles.metricValue}>{(sol.impact / sol.effort).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeSection === 'fit' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Problem-Solution Fit</h2>
                <p>Evaluate how well solutions address problems</p>
              </div>

              <div className={styles.calculator}>
                <h3>Calculate Fit Score</h3>
                <div className={styles.calcInputs}>
                  <select id="fitProblem" className={styles.select}>
                    <option value="">Select problem</option>
                    {problems.map(p => (
                      <option key={p.id} value={p.id}>{p.problem.substring(0, 40)}...</option>
                    ))}
                  </select>
                  <select id="fitSolution" className={styles.select}>
                    <option value="">Select solution</option>
                    {solutions.map(s => (
                      <option key={s.id} value={s.id}>{s.solution.substring(0, 40)}...</option>
                    ))}
                  </select>
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const problemId = (document.getElementById('fitProblem') as HTMLSelectElement).value
                      const solutionId = (document.getElementById('fitSolution') as HTMLSelectElement).value
                      if (problemId && solutionId) calculateFit(problemId, solutionId)
                    }}
                  >
                    Calculate Fit
                  </button>
                </div>

                <div className={styles.fitGrid}>
                  {fits.map(fit => {
                    const problem = problems.find(p => p.id === fit.problemId)
                    const solution = solutions.find(s => s.id === fit.solutionId)
                    return (
                      <div key={fit.id} className={styles.fitCard}>
                        <div className={styles.fitScore}>
                          <div className={styles.bigNumber}>{fit.fitScore}</div>
                          <div className={styles.label}>Fit Score</div>
                        </div>
                        <div className={styles.fitDetails}>
                          <div className={styles.fitSection}>
                            <strong>Problem:</strong>
                            <p>{problem?.problem.substring(0, 80)}...</p>
                          </div>
                          <div className={styles.fitSection}>
                            <strong>Solution:</strong>
                            <p>{solution?.solution.substring(0, 80)}...</p>
                          </div>
                          <div className={styles.fitSection}>
                            <strong>Recommendation:</strong>
                            <p className={styles.recommendation}>{fit.recommendation}</p>
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
