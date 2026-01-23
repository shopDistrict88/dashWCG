import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Education.module.css'

interface InnovationProject {
  id: string
  name: string
  type: 'product' | 'process' | 'business-model' | 'technology'
  stage: 'ideation' | 'research' | 'prototype' | 'pilot' | 'scale'
  novelty: number
  feasibility: number
  impact: number
  team: string[]
}

interface PatentableIdea {
  id: string
  idea: string
  category: string
  uniqueness: number
  priorArt: string[]
  patentability: 'high' | 'medium' | 'low'
  status: 'documenting' | 'researching' | 'filing' | 'granted'
}

interface ResearchLog {
  id: string
  question: string
  findings: string[]
  sources: string[]
  confidence: number
  date: string
  nextSteps: string[]
}

interface ExperimentLog {
  id: string
  hypothesis: string
  method: string
  results: string
  conclusion: string
  repeatable: boolean
  breakthroughScore: number
}

interface TrendAnalysis {
  id: string
  trend: string
  category: string
  strength: number
  adoption: number
  timeToMainstream: number
  opportunities: string[]
}

interface CompetitorInnovation {
  id: string
  competitor: string
  innovation: string
  threat: number
  response: string
  timeframe: string
}

interface IdeationSession {
  id: string
  topic: string
  participants: string[]
  method: 'brainstorm' | 'brainwrite' | 'scamper' | 'six-hats' | 'mind-map'
  ideas: {idea: string, votes: number}[]
  date: string
}

interface FailureLearning {
  id: string
  failure: string
  cost: number
  learnings: string[]
  prevention: string[]
  value: number
}

interface CollaborationNetwork {
  id: string
  partner: string
  expertise: string[]
  projects: number
  synergy: number
  active: boolean
}

interface ResourceInventory {
  id: string
  resource: string
  type: 'tool' | 'skill' | 'asset' | 'network'
  availability: number
  utilization: number
  value: number
}

interface MilestoneTracker {
  id: string
  projectId: string
  milestone: string
  targetDate: string
  completed: boolean
  impact: string
  blockers: string[]
}

interface InnovationMetrics {
  id: string
  metric: string
  value: number
  benchmark: number
  trend: 'improving' | 'stable' | 'declining'
  category: string
}

interface WhitespaceAnalysis {
  id: string
  market: string
  gap: string
  opportunity: number
  competition: number
  attractiveness: number
}

interface PrototypeFeedback {
  id: string
  prototypeId: string
  tester: string
  feedback: string
  satisfaction: number
  improvements: string[]
  wouldUse: boolean
}

interface IdeaPipeline {
  id: string
  idea: string
  stage: 'raw' | 'evaluated' | 'validated' | 'greenlit' | 'shelved'
  score: number
  champion: string
  nextAction: string
}

export function Education() {
  const { addToast } = useApp()
  
  const [projects, setProjects] = useState<InnovationProject[]>([])
  const [patents, setPatents] = useState<PatentableIdea[]>([])
  const [research, setResearch] = useState<ResearchLog[]>([])
  const [experiments, setExperiments] = useState<ExperimentLog[]>([])
  const [trends, setTrends] = useState<TrendAnalysis[]>([])
  const [competitors, setCompetitors] = useState<CompetitorInnovation[]>([])
  const [sessions, setSessions] = useState<IdeationSession[]>([])
  const [failures, setFailures] = useState<FailureLearning[]>([])
  const [collaborations, setCollaborations] = useState<CollaborationNetwork[]>([])
  const [resources, setResources] = useState<ResourceInventory[]>([])
  const [milestones, setMilestones] = useState<MilestoneTracker[]>([])
  const [metrics, setMetrics] = useState<InnovationMetrics[]>([])
  const [whitespace, setWhitespace] = useState<WhitespaceAnalysis[]>([])
  const [feedback, setFeedback] = useState<PrototypeFeedback[]>([])
  const [pipeline, setPipeline] = useState<IdeaPipeline[]>([])

  const [activeSection, setActiveSection] = useState('projects')

  useEffect(() => {
    const keys = ['projects', 'patents', 'research', 'experiments', 'trends', 'competitors', 'sessions', 'failures', 'collaborations', 'resources', 'milestones', 'metrics', 'whitespace', 'feedback', 'pipeline']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`education_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'projects': setProjects(data); break
          case 'patents': setPatents(data); break
          case 'research': setResearch(data); break
          case 'experiments': setExperiments(data); break
          case 'trends': setTrends(data); break
          case 'competitors': setCompetitors(data); break
          case 'sessions': setSessions(data); break
          case 'failures': setFailures(data); break
          case 'collaborations': setCollaborations(data); break
          case 'resources': setResources(data); break
          case 'milestones': setMilestones(data); break
          case 'metrics': setMetrics(data); break
          case 'whitespace': setWhitespace(data); break
          case 'feedback': setFeedback(data); break
          case 'pipeline': setPipeline(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('education_projects', JSON.stringify(projects)) }, [projects])
  useEffect(() => { localStorage.setItem('education_patents', JSON.stringify(patents)) }, [patents])
  useEffect(() => { localStorage.setItem('education_research', JSON.stringify(research)) }, [research])
  useEffect(() => { localStorage.setItem('education_experiments', JSON.stringify(experiments)) }, [experiments])
  useEffect(() => { localStorage.setItem('education_trends', JSON.stringify(trends)) }, [trends])
  useEffect(() => { localStorage.setItem('education_competitors', JSON.stringify(competitors)) }, [competitors])
  useEffect(() => { localStorage.setItem('education_sessions', JSON.stringify(sessions)) }, [sessions])
  useEffect(() => { localStorage.setItem('education_failures', JSON.stringify(failures)) }, [failures])
  useEffect(() => { localStorage.setItem('education_collaborations', JSON.stringify(collaborations)) }, [collaborations])
  useEffect(() => { localStorage.setItem('education_resources', JSON.stringify(resources)) }, [resources])
  useEffect(() => { localStorage.setItem('education_milestones', JSON.stringify(milestones)) }, [milestones])
  useEffect(() => { localStorage.setItem('education_metrics', JSON.stringify(metrics)) }, [metrics])
  useEffect(() => { localStorage.setItem('education_whitespace', JSON.stringify(whitespace)) }, [whitespace])
  useEffect(() => { localStorage.setItem('education_feedback', JSON.stringify(feedback)) }, [feedback])
  useEffect(() => { localStorage.setItem('education_pipeline', JSON.stringify(pipeline)) }, [pipeline])

  // AI Functions
  const calculateInnovationScore = (novelty: number, feasibility: number, impact: number): number => {
    return Math.round((novelty * 0.3 + feasibility * 0.3 + impact * 0.4))
  }

  const assessPatentability = (uniqueness: number, priorArt: number): 'high' | 'medium' | 'low' => {
    if (uniqueness >= 80 && priorArt === 0) return 'high'
    if (uniqueness >= 60 && priorArt <= 2) return 'medium'
    return 'low'
  }

  const calculateBreakthroughScore = (novelty: number, impact: number, repeatable: boolean): number => {
    let score = (novelty + impact) / 2
    if (repeatable) score += 20
    return Math.min(100, Math.round(score))
  }

  const calculateTimeToMainstream = (strength: number, adoption: number): number => {
    if (adoption >= 50) return 1
    if (adoption >= 25) return 2
    if (strength >= 80) return 3
    if (strength >= 60) return 5
    return 10
  }

  const calculateThreatLevel = (innovationImpact: number, ourCapability: number): number => {
    const gap = innovationImpact - ourCapability
    return Math.max(0, Math.min(100, gap))
  }

  const calculateFailureValue = (cost: number, learnings: number): number => {
    const learningValue = learnings * 10000
    const roi = ((learningValue - cost) / cost) * 100
    return Math.round(roi)
  }

  const calculateSynergy = (sharedProjects: number, expertise: number): number => {
    return Math.min(100, (sharedProjects * 15) + (expertise * 5))
  }

  const calculateWhitespaceAttractiveness = (opportunity: number, competition: number): number => {
    if (competition === 0) return Math.min(100, opportunity * 1.5)
    return Math.round(opportunity / competition * 20)
  }

  const scoreIdeaInPipeline = (novelty: number, feasibility: number, marketFit: number): number => {
    return Math.round((novelty * 0.3 + feasibility * 0.3 + marketFit * 0.4))
  }

  // CRUD Functions
  const addProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const novelty = parseInt(formData.get('novelty') as string)
    const feasibility = parseInt(formData.get('feasibility') as string)
    const impact = parseInt(formData.get('impact') as string)
    
    const newProject: InnovationProject = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as InnovationProject['type'],
      stage: 'ideation',
      novelty,
      feasibility,
      impact,
      team: (formData.get('team') as string).split(',').map(m => m.trim())
    }
    
    setProjects([...projects, newProject])
    const score = calculateInnovationScore(novelty, feasibility, impact)
    addToast(`Innovation project created - Score: ${score}`, 'success')
    e.currentTarget.reset()
  }

  const addPatent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const uniqueness = parseInt(formData.get('uniqueness') as string)
    const priorArt = (formData.get('priorArt') as string).split(',').filter(p => p.trim()).length
    const patentability = assessPatentability(uniqueness, priorArt)
    
    const newPatent: PatentableIdea = {
      id: Date.now().toString(),
      idea: formData.get('idea') as string,
      category: formData.get('category') as string,
      uniqueness,
      priorArt: (formData.get('priorArt') as string).split(',').map(p => p.trim()).filter(p => p),
      patentability,
      status: 'documenting'
    }
    
    setPatents([...patents, newPatent])
    addToast(`Patent idea logged - ${patentability} patentability`, 'success')
    e.currentTarget.reset()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Innovation Lab</h1>
          <p className={styles.subtitle}>R&D tracking and breakthrough management</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'projects' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('projects')}>Innovation Projects</button>
          <button className={`${styles.navItem} ${activeSection === 'patents' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('patents')}>Patentable Ideas</button>
          <button className={`${styles.navItem} ${activeSection === 'research' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('research')}>Research Log</button>
          <button className={`${styles.navItem} ${activeSection === 'experiments' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('experiments')}>Experiment Log</button>
          <button className={`${styles.navItem} ${activeSection === 'trends' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('trends')}>Trend Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'competitors' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('competitors')}>Competitor Innovation</button>
          <button className={`${styles.navItem} ${activeSection === 'sessions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('sessions')}>Ideation Sessions</button>
          <button className={`${styles.navItem} ${activeSection === 'failures' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('failures')}>Failure Learnings</button>
          <button className={`${styles.navItem} ${activeSection === 'collaborations' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('collaborations')}>Collaboration Network</button>
          <button className={`${styles.navItem} ${activeSection === 'resources' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('resources')}>Resource Inventory</button>
          <button className={`${styles.navItem} ${activeSection === 'milestones' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('milestones')}>Milestone Tracker</button>
          <button className={`${styles.navItem} ${activeSection === 'metrics' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('metrics')}>Innovation Metrics</button>
          <button className={`${styles.navItem} ${activeSection === 'whitespace' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('whitespace')}>Whitespace Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'feedback' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('feedback')}>Prototype Feedback</button>
          <button className={`${styles.navItem} ${activeSection === 'pipeline' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('pipeline')}>Idea Pipeline</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'projects' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Innovation Projects</h2>
                <p>Track breakthrough initiatives from idea to scale</p>
              </div>

              <form onSubmit={addProject} className={styles.form}>
                <input name="name" placeholder="Project name" required className={styles.input} />
                <select name="type" required className={styles.select}>
                  <option value="">Project type</option>
                  <option value="product">Product Innovation</option>
                  <option value="process">Process Innovation</option>
                  <option value="business-model">Business Model Innovation</option>
                  <option value="technology">Technology Innovation</option>
                </select>
                <input name="novelty" type="number" placeholder="Novelty (1-100)" min="1" max="100" required className={styles.input} />
                <input name="feasibility" type="number" placeholder="Feasibility (1-100)" min="1" max="100" required className={styles.input} />
                <input name="impact" type="number" placeholder="Impact (1-100)" min="1" max="100" required className={styles.input} />
                <input name="team" placeholder="Team members (comma-separated)" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Create Project</button>
              </form>

              <div className={styles.projectsGrid}>
                {projects.map(proj => {
                  const score = calculateInnovationScore(proj.novelty, proj.feasibility, proj.impact)
                  return (
                    <div key={proj.id} className={`${styles.projectCard} ${styles[proj.stage]}`}>
                      <div className={styles.projectHeader}>
                        <h3>{proj.name}</h3>
                        <span className={styles.typeBadge}>{proj.type}</span>
                      </div>
                      <div className={styles.stageBadge}>{proj.stage}</div>
                      <div className={styles.innovationScore}>
                        <div className={styles.bigNumber}>{score}</div>
                        <div className={styles.label}>Innovation Score</div>
                      </div>
                      <div className={styles.projectMetrics}>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Novelty</span>
                          <div className={styles.metricBar}>
                            <div className={styles.metricFill} style={{width: `${proj.novelty}%`}}></div>
                          </div>
                          <span className={styles.metricValue}>{proj.novelty}</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Feasibility</span>
                          <div className={styles.metricBar}>
                            <div className={styles.metricFill} style={{width: `${proj.feasibility}%`}}></div>
                          </div>
                          <span className={styles.metricValue}>{proj.feasibility}</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Impact</span>
                          <div className={styles.metricBar}>
                            <div className={styles.metricFill} style={{width: `${proj.impact}%`}}></div>
                          </div>
                          <span className={styles.metricValue}>{proj.impact}</span>
                        </div>
                      </div>
                      <div className={styles.team}>
                        <strong>Team:</strong> {proj.team.join(', ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeSection === 'patents' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Patentable Ideas</h2>
                <p>Document and track intellectual property opportunities</p>
              </div>

              <form onSubmit={addPatent} className={styles.form}>
                <textarea name="idea" placeholder="Describe the patentable idea" required className={styles.textarea} rows={3}></textarea>
                <input name="category" placeholder="Category (e.g., software, hardware)" required className={styles.input} />
                <input name="uniqueness" type="number" placeholder="Uniqueness score (1-100)" min="1" max="100" required className={styles.input} />
                <textarea name="priorArt" placeholder="Prior art/existing solutions (comma-separated)" className={styles.textarea} rows={2}></textarea>
                <button type="submit" className={styles.primaryBtn}>Log Patent Idea</button>
              </form>

              <div className={styles.patentsGrid}>
                {patents.sort((a, b) => {
                  const order = {high: 3, medium: 2, low: 1}
                  return order[b.patentability] - order[a.patentability]
                }).map(patent => (
                  <div key={patent.id} className={`${styles.patentCard} ${styles[patent.patentability]}`}>
                    <div className={styles.patentabilityBadge}>{patent.patentability.toUpperCase()} Patentability</div>
                    <div className={styles.statusBadge}>{patent.status}</div>
                    <p className={styles.patentIdea}>{patent.idea}</p>
                    <div className={styles.patentMeta}>
                      <div className={styles.category}>{patent.category}</div>
                      <div className={styles.uniqueness}>
                        <strong>Uniqueness:</strong> {patent.uniqueness}%
                      </div>
                      {patent.priorArt.length > 0 && (
                        <div className={styles.priorArt}>
                          <strong>Prior Art:</strong> {patent.priorArt.length} found
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
