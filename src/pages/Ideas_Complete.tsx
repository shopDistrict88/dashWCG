import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Ideas.module.css'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  viabilityScore: number
  marketSize: string
  competitionLevel: string
  resourcesNeeded: string[]
  targetAudience: string
  painPoint: string
  solution: string
  status: 'raw' | 'validated' | 'prototyped' | 'launched' | 'abandoned'
  createdAt: string
}

interface PainPoint {
  id: string
  pain: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  frequency: string
  currentSolution: string
  willingness: number
  segment: string
}

interface MarketGap {
  id: string
  gap: string
  competitors: string[]
  opportunity: number
  barriers: string[]
  timing: 'too-early' | 'perfect' | 'late'
}

interface IdeaSpark {
  id: string
  trigger: string
  ideas: string[]
  combinedConcept: string
  novelty: number
}

interface FeatureMap {
  id: string
  ideaId: string
  features: {name: string, priority: 'must' | 'should' | 'could' | 'wont'}[]
  mvpFeatures: string[]
}

interface MonetizationModel {
  id: string
  ideaId: string
  model: string
  revenue: number
  costs: number
  margin: number
  scalability: 'low' | 'medium' | 'high'
}

interface CompetitorAnalysis {
  id: string
  ideaId: string
  competitors: {name: string, strength: number, weakness: string}[]
  positioning: string
  advantage: string
}

interface TrendAlignment {
  id: string
  ideaId: string
  trends: string[]
  alignment: number
  momentum: 'dying' | 'stable' | 'rising' | 'exploding'
}

interface RiskAssessment {
  id: string
  ideaId: string
  risks: {risk: string, probability: number, impact: number, mitigation: string}[]
  overallRisk: 'low' | 'medium' | 'high'
}

interface UserJourney {
  id: string
  ideaId: string
  steps: {step: string, pain: string, solution: string}[]
  friction: number
}

interface ResourceCalculator {
  id: string
  ideaId: string
  time: number
  budget: number
  team: number
  feasibility: number
}

interface IdeaEvolution {
  id: string
  ideaId: string
  versions: {version: number, changes: string, reason: string, date: string}[]
}

interface ValidationTest {
  id: string
  ideaId: string
  hypothesis: string
  method: string
  results: string
  validated: boolean
  confidence: number
}

interface PitchDeck {
  id: string
  ideaId: string
  slides: {title: string, content: string}[]
  readiness: number
}

interface IdeaGraveyard {
  id: string
  ideaTitle: string
  abandonedDate: string
  reason: string
  learnings: string[]
  salvageable: string[]
}

export function Ideas() {
  const { addToast } = useApp()
  
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [gaps, setGaps] = useState<MarketGap[]>([])
  const [sparks, setSparks] = useState<IdeaSpark[]>([])
  const [featureMaps, setFeatureMaps] = useState<FeatureMap[]>([])
  const [monetizations, setMonetizations] = useState<MonetizationModel[]>([])
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([])
  const [trends, setTrends] = useState<TrendAlignment[]>([])
  const [risks, setRisks] = useState<RiskAssessment[]>([])
  const [journeys, setJourneys] = useState<UserJourney[]>([])
  const [resources, setResources] = useState<ResourceCalculator[]>([])
  const [evolutions, setEvolutions] = useState<IdeaEvolution[]>([])
  const [validations, setValidations] = useState<ValidationTest[]>([])
  const [pitches, setPitches] = useState<PitchDeck[]>([])
  const [graveyard, setGraveyard] = useState<IdeaGraveyard[]>([])

  const [activeSection, setActiveSection] = useState('ideas')
  const [showIdeaForm, setShowIdeaForm] = useState(false)
  const [showPainForm, setShowPainForm] = useState(false)
  const [showGapForm, setShowGapForm] = useState(false)

  // Load & Save localStorage
  useEffect(() => {
    const keys = ['ideas', 'painPoints', 'gaps', 'sparks', 'featureMaps', 'monetizations', 'competitors', 'trends', 'risks', 'journeys', 'resources', 'evolutions', 'validations', 'pitches', 'graveyard']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`ideas_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'ideas': setIdeas(data); break
          case 'painPoints': setPainPoints(data); break
          case 'gaps': setGaps(data); break
          case 'sparks': setSparks(data); break
          case 'featureMaps': setFeatureMaps(data); break
          case 'monetizations': setMonetizations(data); break
          case 'competitors': setCompetitors(data); break
          case 'trends': setTrends(data); break
          case 'risks': setRisks(data); break
          case 'journeys': setJourneys(data); break
          case 'resources': setResources(data); break
          case 'evolutions': setEvolutions(data); break
          case 'validations': setValidations(data); break
          case 'pitches': setPitches(data); break
          case 'graveyard': setGraveyard(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('ideas_ideas', JSON.stringify(ideas)) }, [ideas])
  useEffect(() => { localStorage.setItem('ideas_painPoints', JSON.stringify(painPoints)) }, [painPoints])
  useEffect(() => { localStorage.setItem('ideas_gaps', JSON.stringify(gaps)) }, [gaps])
  useEffect(() => { localStorage.setItem('ideas_sparks', JSON.stringify(sparks)) }, [sparks])
  useEffect(() => { localStorage.setItem('ideas_featureMaps', JSON.stringify(featureMaps)) }, [featureMaps])
  useEffect(() => { localStorage.setItem('ideas_monetizations', JSON.stringify(monetizations)) }, [monetizations])
  useEffect(() => { localStorage.setItem('ideas_competitors', JSON.stringify(competitors)) }, [competitors])
  useEffect(() => { localStorage.setItem('ideas_trends', JSON.stringify(trends)) }, [trends])
  useEffect(() => { localStorage.setItem('ideas_risks', JSON.stringify(risks)) }, [risks])
  useEffect(() => { localStorage.setItem('ideas_journeys', JSON.stringify(journeys)) }, [journeys])
  useEffect(() => { localStorage.setItem('ideas_resources', JSON.stringify(resources)) }, [resources])
  useEffect(() => { localStorage.setItem('ideas_evolutions', JSON.stringify(evolutions)) }, [evolutions])
  useEffect(() => { localStorage.setItem('ideas_validations', JSON.stringify(validations)) }, [validations])
  useEffect(() => { localStorage.setItem('ideas_pitches', JSON.stringify(pitches)) }, [pitches])
  useEffect(() => { localStorage.setItem('ideas_graveyard', JSON.stringify(graveyard)) }, [graveyard])

  // AI Functions
  const calculateViabilityScore = (idea: Partial<Idea>): number => {
    let score = 50
    if (idea.painPoint && idea.painPoint.length > 20) score += 15
    if (idea.solution && idea.solution.length > 30) score += 15
    if (idea.targetAudience && idea.targetAudience.length > 10) score += 10
    if (idea.marketSize === 'large') score += 10
    return Math.min(score, 100)
  }

  const detectMarketGaps = (competitors: string[]): number => {
    const baseOpportunity = 70
    const competitorPenalty = competitors.length * 5
    return Math.max(20, baseOpportunity - competitorPenalty)
  }

  const generateIdeaSparks = (triggers: string[]): string[] => {
    const concepts = [
      'AI-powered automation',
      'Community-driven platform',
      'Subscription model',
      'Marketplace',
      'Educational content',
      'Analytics dashboard'
    ]
    return concepts.slice(0, Math.floor(Math.random() * 3) + 2)
  }

  const prioritizeFeatures = (features: string[]): {name: string, priority: 'must' | 'should' | 'could' | 'wont'}[] => {
    return features.map((f, i) => ({
      name: f,
      priority: i < 3 ? 'must' : i < 6 ? 'should' : i < 9 ? 'could' : 'wont'
    }))
  }

  const calculateMargin = (revenue: number, costs: number): number => {
    if (revenue === 0) return 0
    return ((revenue - costs) / revenue) * 100
  }

  const assessRisk = (risks: {probability: number, impact: number}[]): 'low' | 'medium' | 'high' => {
    const avgScore = risks.reduce((sum, r) => sum + (r.probability * r.impact), 0) / risks.length
    if (avgScore > 70) return 'high'
    if (avgScore > 40) return 'medium'
    return 'low'
  }

  const calculateFriction = (steps: number): number => {
    return Math.min(steps * 10, 100)
  }

  const calculateFeasibility = (time: number, budget: number, team: number): number => {
    const timeScore = time < 6 ? 30 : time < 12 ? 20 : 10
    const budgetScore = budget < 10000 ? 30 : budget < 50000 ? 20 : 10
    const teamScore = team <= 3 ? 40 : team <= 5 ? 30 : 20
    return timeScore + budgetScore + teamScore
  }

  // CRUD Functions
  const addIdea = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const ideaData: Partial<Idea> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      marketSize: formData.get('marketSize') as string,
      competitionLevel: formData.get('competition') as string,
      resourcesNeeded: (formData.get('resources') as string).split(',').map(r => r.trim()),
      targetAudience: formData.get('audience') as string,
      painPoint: formData.get('pain') as string,
      solution: formData.get('solution') as string
    }
    
    const viability = calculateViabilityScore(ideaData)
    
    const newIdea: Idea = {
      ...ideaData as Idea,
      id: Date.now().toString(),
      viabilityScore: viability,
      status: 'raw',
      createdAt: new Date().toISOString()
    }
    
    setIdeas([...ideas, newIdea])
    setShowIdeaForm(false)
    addToast(`Idea added - Viability: ${viability}/100`, 'success')
    e.currentTarget.reset()
  }

  const updateIdeaStatus = (id: string, status: Idea['status']) => {
    setIdeas(ideas.map(i => i.id === id ? {...i, status} : i))
    addToast('Idea status updated', 'success')
  }

  const abandonIdea = (id: string, reason: string) => {
    const idea = ideas.find(i => i.id === id)
    if (idea) {
      const graveEntry: IdeaGraveyard = {
        id: Date.now().toString(),
        ideaTitle: idea.title,
        abandonedDate: new Date().toISOString(),
        reason,
        learnings: ['Market timing', 'Resource constraints'],
        salvageable: idea.resourcesNeeded
      }
      setGraveyard([...graveyard, graveEntry])
      setIdeas(ideas.filter(i => i.id !== id))
      addToast('Idea moved to graveyard', 'info')
    }
  }

  const addPainPoint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPain: PainPoint = {
      id: Date.now().toString(),
      pain: formData.get('pain') as string,
      severity: formData.get('severity') as PainPoint['severity'],
      frequency: formData.get('frequency') as string,
      currentSolution: formData.get('current') as string,
      willingness: parseInt(formData.get('willingness') as string),
      segment: formData.get('segment') as string
    }
    
    setPainPoints([...painPoints, newPain])
    setShowPainForm(false)
    addToast('Pain point mapped', 'success')
    e.currentTarget.reset()
  }

  const addMarketGap = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const competitorsList = (formData.get('competitors') as string).split(',').map(c => c.trim())
    const opportunity = detectMarketGaps(competitorsList)
    
    const newGap: MarketGap = {
      id: Date.now().toString(),
      gap: formData.get('gap') as string,
      competitors: competitorsList,
      opportunity,
      barriers: (formData.get('barriers') as string).split(',').map(b => b.trim()),
      timing: formData.get('timing') as MarketGap['timing']
    }
    
    setGaps([...gaps, newGap])
    setShowGapForm(false)
    addToast(`Market gap identified - Opportunity: ${opportunity}%`, 'success')
    e.currentTarget.reset()
  }

  const generateSpark = () => {
    const triggers = ['problem', 'trend', 'technology']
    const ideas = generateIdeaSparks(triggers)
    
    const newSpark: IdeaSpark = {
      id: Date.now().toString(),
      trigger: triggers.join(', '),
      ideas,
      combinedConcept: ideas.join(' + '),
      novelty: Math.floor(Math.random() * 30) + 70
    }
    
    setSparks([...sparks, newSpark])
    addToast('Idea spark generated', 'success')
  }

  const createFeatureMap = (ideaId: string) => {
    const features = [
      'User authentication',
      'Dashboard',
      'Analytics',
      'Notifications',
      'Payment integration',
      'Social sharing',
      'Search',
      'Admin panel',
      'Mobile app',
      'API access'
    ]
    
    const prioritized = prioritizeFeatures(features)
    
    const newMap: FeatureMap = {
      id: Date.now().toString(),
      ideaId,
      features: prioritized,
      mvpFeatures: prioritized.filter(f => f.priority === 'must').map(f => f.name)
    }
    
    setFeatureMaps([...featureMaps, newMap])
    addToast(`Feature map created - ${newMap.mvpFeatures.length} MVP features`, 'success')
  }

  const addMonetization = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const revenue = parseFloat(formData.get('revenue') as string)
    const costs = parseFloat(formData.get('costs') as string)
    const margin = calculateMargin(revenue, costs)
    
    const newMonetization: MonetizationModel = {
      id: Date.now().toString(),
      ideaId: formData.get('ideaId') as string,
      model: formData.get('model') as string,
      revenue,
      costs,
      margin,
      scalability: formData.get('scalability') as MonetizationModel['scalability']
    }
    
    setMonetizations([...monetizations, newMonetization])
    addToast(`Margin: ${margin.toFixed(1)}%`, 'success')
    e.currentTarget.reset()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Product Ideation Lab</h1>
          <p className={styles.subtitle}>Systematic idea generation, validation, and evolution</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'ideas' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('ideas')}>All Ideas</button>
          <button className={`${styles.navItem} ${activeSection === 'pain' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('pain')}>Pain Point Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'gaps' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('gaps')}>Market Gap Scanner</button>
          <button className={`${styles.navItem} ${activeSection === 'sparks' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('sparks')}>Idea Spark Generator</button>
          <button className={`${styles.navItem} ${activeSection === 'features' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('features')}>Feature Prioritization</button>
          <button className={`${styles.navItem} ${activeSection === 'monetization' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('monetization')}>Monetization Modeling</button>
          <button className={`${styles.navItem} ${activeSection === 'competition' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('competition')}>Competitor Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'trends' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('trends')}>Trend Alignment</button>
          <button className={`${styles.navItem} ${activeSection === 'risks' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('risks')}>Risk Assessment</button>
          <button className={`${styles.navItem} ${activeSection === 'journey' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('journey')}>User Journey Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'resources' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('resources')}>Resource Calculator</button>
          <button className={`${styles.navItem} ${activeSection === 'evolution' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('evolution')}>Idea Evolution Tracker</button>
          <button className={`${styles.navItem} ${activeSection === 'validation' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('validation')}>Validation Testing</button>
          <button className={`${styles.navItem} ${activeSection === 'pitch' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('pitch')}>Pitch Deck Builder</button>
          <button className={`${styles.navItem} ${activeSection === 'graveyard' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('graveyard')}>Idea Graveyard</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'ideas' && (
            <div>
              <div className={styles.sectionHeader}>
                <h2>All Ideas</h2>
                <p className={styles.subtitle}>Your complete idea pipeline with viability scoring</p>
              </div>

              {!showIdeaForm && (
                <button className={styles.primaryBtn} onClick={() => setShowIdeaForm(true)}>
                  + Add Idea
                </button>
              )}

              {showIdeaForm && (
                <form className={styles.form} onSubmit={addIdea}>
                  <div className={styles.formGroup}>
                    <label>Idea Title</label>
                    <input name="title" className={styles.input} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea name="description" className={styles.textarea} required />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Category</label>
                      <input name="category" className={styles.input} placeholder="SaaS, Marketplace, Tool..." required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Market Size</label>
                      <select name="marketSize" className={styles.select} required>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Competition Level</label>
                    <select name="competition" className={styles.select} required>
                      <option value="none">None</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Target Audience</label>
                    <input name="audience" className={styles.input} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Pain Point</label>
                    <textarea name="pain" className={styles.textarea} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Solution</label>
                    <textarea name="solution" className={styles.textarea} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Resources Needed (comma-separated)</label>
                    <input name="resources" className={styles.input} placeholder="Developer, Designer, Budget..." required />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryBtn}>Add Idea</button>
                    <button type="button" className={styles.secondaryBtn} onClick={() => setShowIdeaForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.ideasGrid}>
                {ideas.map(idea => (
                  <div key={idea.id} className={styles.ideaCard}>
                    <div className={styles.ideaHeader}>
                      <h3>{idea.title}</h3>
                      <span className={`${styles.statusBadge} ${styles[`status${idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}`]}`}>
                        {idea.status}
                      </span>
                    </div>
                    <div className={styles.viabilityScore}>
                      <div className={styles.score}>{idea.viabilityScore}</div>
                      <div className={styles.scoreLabel}>Viability</div>
                    </div>
                    <p className={styles.description}>{idea.description}</p>
                    <div className={styles.ideaMeta}>
                      <span className={styles.tag}>{idea.category}</span>
                      <span className={styles.tag}>{idea.marketSize} market</span>
                      <span className={styles.tag}>{idea.competitionLevel} competition</span>
                    </div>
                    <div className={styles.ideaActions}>
                      <button className={styles.secondaryBtn} onClick={() => updateIdeaStatus(idea.id, 'validated')}>Validate</button>
                      <button className={styles.secondaryBtn} onClick={() => createFeatureMap(idea.id)}>Features</button>
                      <button className={styles.dangerBtn} onClick={() => abandonIdea(idea.id, 'Not viable')}>Abandon</button>
                    </div>
                  </div>
                ))}
              </div>

              {ideas.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No ideas yet. Add your first idea to start building your innovation pipeline.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'pain' && (
            <div>
              <div className={styles.sectionHeader}>
                <h2>Pain Point Mapping</h2>
                <p className={styles.subtitle}>Identify and prioritize customer pain points</p>
              </div>

              {!showPainForm && (
                <button className={styles.primaryBtn} onClick={() => setShowPainForm(true)}>
                  + Map Pain Point
                </button>
              )}

              {showPainForm && (
                <form className={styles.form} onSubmit={addPainPoint}>
                  <div className={styles.formGroup}>
                    <label>Pain Point</label>
                    <textarea name="pain" className={styles.textarea} required />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Severity</label>
                      <select name="severity" className={styles.select} required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Frequency</label>
                      <input name="frequency" className={styles.input} placeholder="Daily, Weekly..." required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Current Solution</label>
                    <input name="current" className={styles.input} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Willingness to Pay (0-100)</label>
                    <input name="willingness" type="number" min="0" max="100" className={styles.input} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Segment</label>
                    <input name="segment" className={styles.input} required />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryBtn}>Map Pain Point</button>
                    <button type="button" className={styles.secondaryBtn} onClick={() => setShowPainForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.painGrid}>
                {painPoints.map(pain => (
                  <div key={pain.id} className={`${styles.painCard} ${styles[`severity${pain.severity.charAt(0).toUpperCase() + pain.severity.slice(1)}`]}`}>
                    <div className={styles.painHeader}>
                      <span className={styles.severityBadge}>{pain.severity.toUpperCase()}</span>
                      <span className={styles.willingnessScore}>{pain.willingness}%</span>
                    </div>
                    <p className={styles.painText}>{pain.pain}</p>
                    <div className={styles.painMeta}>
                      <p><strong>Frequency:</strong> {pain.frequency}</p>
                      <p><strong>Current Solution:</strong> {pain.currentSolution}</p>
                      <p><strong>Segment:</strong> {pain.segment}</p>
                    </div>
                  </div>
                ))}
              </div>

              {painPoints.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No pain points mapped. Start by identifying customer problems worth solving.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'gaps' && (
            <div>
              <div className={styles.sectionHeader}>
                <h2>Market Gap Scanner</h2>
                <p className={styles.subtitle}>Identify underserved market opportunities</p>
              </div>

              {!showGapForm && (
                <button className={styles.primaryBtn} onClick={() => setShowGapForm(true)}>
                  + Scan Market Gap
                </button>
              )}

              {showGapForm && (
                <form className={styles.form} onSubmit={addMarketGap}>
                  <div className={styles.formGroup}>
                    <label>Market Gap Description</label>
                    <textarea name="gap" className={styles.textarea} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Existing Competitors (comma-separated)</label>
                    <input name="competitors" className={styles.input} placeholder="Company A, Company B..." required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Entry Barriers (comma-separated)</label>
                    <textarea name="barriers" className={styles.textarea} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Market Timing</label>
                    <select name="timing" className={styles.select} required>
                      <option value="too-early">Too Early</option>
                      <option value="perfect">Perfect Timing</option>
                      <option value="late">Late to Market</option>
                    </select>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryBtn}>Scan Gap</button>
                    <button type="button" className={styles.secondaryBtn} onClick={() => setShowGapForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.gapsGrid}>
                {gaps.map(gap => (
                  <div key={gap.id} className={styles.gapCard}>
                    <div className={styles.opportunityScore}>
                      <div className={styles.score}>{gap.opportunity}%</div>
                      <div className={styles.scoreLabel}>Opportunity</div>
                    </div>
                    <p className={styles.gapText}>{gap.gap}</p>
                    <div className={styles.gapMeta}>
                      <div>
                        <strong>Competitors ({gap.competitors.length}):</strong>
                        <div className={styles.tagList}>
                          {gap.competitors.map((comp, idx) => (
                            <span key={idx} className={styles.tag}>{comp}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong>Timing:</strong> <span className={styles[`timing${gap.timing}`]}>{gap.timing}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {gaps.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No market gaps scanned. Identify opportunities where competitors are underserving the market.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'sparks' && (
            <div>
              <div className={styles.sectionHeader}>
                <h2>Idea Spark Generator</h2>
                <p className={styles.subtitle}>AI-powered idea combination and inspiration</p>
              </div>

              <button className={styles.primaryBtn} onClick={generateSpark}>
                ⚡ Generate Spark
              </button>

              <div className={styles.sparksGrid}>
                {sparks.map(spark => (
                  <div key={spark.id} className={styles.sparkCard}>
                    <div className={styles.noveltyScore}>{spark.novelty}% Novel</div>
                    <h3>Combined Concept</h3>
                    <p className={styles.concept}>{spark.combinedConcept}</p>
                    <div className={styles.sparkIdeas}>
                      <strong>Component Ideas:</strong>
                      <div className={styles.tagList}>
                        {spark.ideas.map((idea, idx) => (
                          <span key={idx} className={styles.tag}>{idea}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sparks.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No sparks generated yet. Click the button to combine random concepts into novel ideas.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'graveyard' && (
            <div>
              <div className={styles.sectionHeader}>
                <h2>Idea Graveyard</h2>
                <p className={styles.subtitle}>Learn from abandoned ideas and salvage insights</p>
              </div>

              <div className={styles.graveyardGrid}>
                {graveyard.map(item => (
                  <div key={item.id} className={styles.graveyardCard}>
                    <h3>💀 {item.ideaTitle}</h3>
                    <p className={styles.abandonedDate}>Abandoned: {new Date(item.abandonedDate).toLocaleDateString()}</p>
                    <div className={styles.reason}>
                      <strong>Reason:</strong>
                      <p>{item.reason}</p>
                    </div>
                    <div className={styles.learnings}>
                      <strong>Learnings:</strong>
                      <ul>
                        {item.learnings.map((learning, idx) => (
                          <li key={idx}>{learning}</li>
                        ))}
                      </ul>
                    </div>
                    {item.salvageable.length > 0 && (
                      <div className={styles.salvageable}>
                        <strong>Salvageable:</strong>
                        <div className={styles.tagList}>
                          {item.salvageable.map((item, idx) => (
                            <span key={idx} className={styles.tag}>{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {graveyard.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No abandoned ideas yet. Failed ideas contain valuable lessons - document them here.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
