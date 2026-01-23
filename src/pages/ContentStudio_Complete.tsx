import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './ContentStudio.module.css'

interface ContentPlatform {
  id: string
  name: string
  format: string
  frequency: string
  objectives: string[]
  createdAt: string
}

interface ContentArc {
  id: string
  title: string
  theme: string
  duration: string
  milestones: string[]
  status: 'planning' | 'active' | 'completed'
  createdAt: string
}

interface Hook {
  id: string
  text: string
  category: string
  performanceScore: number
  usageCount: number
  createdAt: string
}

interface FatigueAlert {
  id: string
  topic: string
  frequency: number
  lastUsed: string
  severity: 'low' | 'medium' | 'high'
  recommendation: string
}

interface ContentROI {
  id: string
  contentId: string
  title: string
  investment: number
  returns: number
  roi: number
  metrics: {views: number, engagement: number, conversions: number}
  createdAt: string
}

interface FormatRotation {
  id: string
  week: number
  formats: string[]
  rationale: string
  status: 'planned' | 'active' | 'completed'
}

interface NarrativeContinuity {
  id: string
  episode: number
  title: string
  theme: string
  callbacks: string[]
  nextEpisode: string
  createdAt: string
}

interface RemixIdea {
  id: string
  originalContent: string
  remixFormat: string
  newAngle: string
  estimatedReach: number
  status: 'idea' | 'in-progress' | 'published'
}

interface BurnoutMetric {
  id: string
  creator: string
  weeklyHours: number
  contentPieces: number
  qualityScore: number
  alertLevel: 'green' | 'yellow' | 'red'
  recommendation: string
}

interface SeasonalContent {
  id: string
  season: string
  contentTypes: string[]
  peakDates: string[]
  prepLead: number
  status: 'researching' | 'planning' | 'creating' | 'ready'
}

interface CreativeConstraint {
  id: string
  constraint: string
  type: string
  difficulty: 'easy' | 'medium' | 'hard'
  inspirationScore: number
}

interface QualityScore {
  id: string
  contentId: string
  title: string
  technical: number
  storytelling: number
  production: number
  engagement: number
  overall: number
  createdAt: string
}

interface ReactionPrediction {
  id: string
  contentConcept: string
  predictedReach: number
  sentimentScore: number
  viralPotential: number
  targetAudience: string
  confidence: number
}

interface RiskAssessment {
  id: string
  contentId: string
  title: string
  risks: string[]
  severity: 'low' | 'medium' | 'high'
  mitigation: string[]
  approved: boolean
}

interface EvergreenContent {
  id: string
  title: string
  originalDate: string
  lastResurfaced: string
  performance: number
  nextSurface: string
  updates: string[]
}

export function ContentStudio() {
  const { addToast } = useApp()
  
  // State management
  const [platforms, setPlatforms] = useState<ContentPlatform[]>([])
  const [arcs, setArcs] = useState<ContentArc[]>([])
  const [hooks, setHooks] = useState<Hook[]>([])
  const [fatigueAlerts, setFatigueAlerts] = useState<FatigueAlert[]>([])
  const [roiData, setRoiData] = useState<ContentROI[]>([])
  const [rotations, setRotations] = useState<FormatRotation[]>([])
  const [narratives, setNarratives] = useState<NarrativeContinuity[]>([])
  const [remixes, setRemixes] = useState<RemixIdea[]>([])
  const [burnoutMetrics, setBurnoutMetrics] = useState<BurnoutMetric[]>([])
  const [seasonal, setSeasonal] = useState<SeasonalContent[]>([])
  const [constraints, setConstraints] = useState<CreativeConstraint[]>([])
  const [qualityScores, setQualityScores] = useState<QualityScore[]>([])
  const [predictions, setPredictions] = useState<ReactionPrediction[]>([])
  const [risks, setRisks] = useState<RiskAssessment[]>([])
  const [evergreen, setEvergreen] = useState<EvergreenContent[]>([])

  const [activeSection, setActiveSection] = useState('platforms')
  const [showPlatformForm, setShowPlatformForm] = useState(false)
  const [showArcForm, setShowArcForm] = useState(false)
  const [showHookForm, setShowHookForm] = useState(false)
  const [showRemixForm, setShowRemixForm] = useState(false)
  const [showSeasonalForm, setShowSeasonalForm] = useState(false)
  const [showPredictionForm, setShowPredictionForm] = useState(false)
  const [showRiskForm, setShowRiskForm] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const loadedPlatforms = localStorage.getItem('contentstudio_platforms')
    const loadedArcs = localStorage.getItem('contentstudio_arcs')
    const loadedHooks = localStorage.getItem('contentstudio_hooks')
    const loadedFatigue = localStorage.getItem('contentstudio_fatigue')
    const loadedROI = localStorage.getItem('contentstudio_roi')
    const loadedRotations = localStorage.getItem('contentstudio_rotations')
    const loadedNarratives = localStorage.getItem('contentstudio_narratives')
    const loadedRemixes = localStorage.getItem('contentstudio_remixes')
    const loadedBurnout = localStorage.getItem('contentstudio_burnout')
    const loadedSeasonal = localStorage.getItem('contentstudio_seasonal')
    const loadedConstraints = localStorage.getItem('contentstudio_constraints')
    const loadedQuality = localStorage.getItem('contentstudio_quality')
    const loadedPredictions = localStorage.getItem('contentstudio_predictions')
    const loadedRisks = localStorage.getItem('contentstudio_risks')
    const loadedEvergreen = localStorage.getItem('contentstudio_evergreen')
    
    if (loadedPlatforms) setPlatforms(JSON.parse(loadedPlatforms))
    if (loadedArcs) setArcs(JSON.parse(loadedArcs))
    if (loadedHooks) setHooks(JSON.parse(loadedHooks))
    if (loadedFatigue) setFatigueAlerts(JSON.parse(loadedFatigue))
    if (loadedROI) setRoiData(JSON.parse(loadedROI))
    if (loadedRotations) setRotations(JSON.parse(loadedRotations))
    if (loadedNarratives) setNarratives(JSON.parse(loadedNarratives))
    if (loadedRemixes) setRemixes(JSON.parse(loadedRemixes))
    if (loadedBurnout) setBurnoutMetrics(JSON.parse(loadedBurnout))
    if (loadedSeasonal) setSeasonal(JSON.parse(loadedSeasonal))
    if (loadedConstraints) setConstraints(JSON.parse(loadedConstraints))
    if (loadedQuality) setQualityScores(JSON.parse(loadedQuality))
    if (loadedPredictions) setPredictions(JSON.parse(loadedPredictions))
    if (loadedRisks) setRisks(JSON.parse(loadedRisks))
    if (loadedEvergreen) setEvergreen(JSON.parse(loadedEvergreen))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('contentstudio_platforms', JSON.stringify(platforms))
  }, [platforms])

  useEffect(() => {
    localStorage.setItem('contentstudio_arcs', JSON.stringify(arcs))
  }, [arcs])

  useEffect(() => {
    localStorage.setItem('contentstudio_hooks', JSON.stringify(hooks))
  }, [hooks])

  useEffect(() => {
    localStorage.setItem('contentstudio_fatigue', JSON.stringify(fatigueAlerts))
  }, [fatigueAlerts])

  useEffect(() => {
    localStorage.setItem('contentstudio_roi', JSON.stringify(roiData))
  }, [roiData])

  useEffect(() => {
    localStorage.setItem('contentstudio_rotations', JSON.stringify(rotations))
  }, [rotations])

  useEffect(() => {
    localStorage.setItem('contentstudio_narratives', JSON.stringify(narratives))
  }, [narratives])

  useEffect(() => {
    localStorage.setItem('contentstudio_remixes', JSON.stringify(remixes))
  }, [remixes])

  useEffect(() => {
    localStorage.setItem('contentstudio_burnout', JSON.stringify(burnoutMetrics))
  }, [burnoutMetrics])

  useEffect(() => {
    localStorage.setItem('contentstudio_seasonal', JSON.stringify(seasonal))
  }, [seasonal])

  useEffect(() => {
    localStorage.setItem('contentstudio_constraints', JSON.stringify(constraints))
  }, [constraints])

  useEffect(() => {
    localStorage.setItem('contentstudio_quality', JSON.stringify(qualityScores))
  }, [qualityScores])

  useEffect(() => {
    localStorage.setItem('contentstudio_predictions', JSON.stringify(predictions))
  }, [predictions])

  useEffect(() => {
    localStorage.setItem('contentstudio_risks', JSON.stringify(risks))
  }, [risks])

  useEffect(() => {
    localStorage.setItem('contentstudio_evergreen', JSON.stringify(evergreen))
  }, [evergreen])

  // AI Functions
  const calculateHookScore = (hook: Hook): number => {
    let score = 50
    if (hook.text.length > 50 && hook.text.length < 150) score += 20
    if (hook.usageCount > 5) score += 15
    if (hook.category) score += 15
    return Math.min(score, 100)
  }

  const detectFatigue = (topic: string): FatigueAlert | null => {
    const related = platforms.filter(p => 
      p.name.toLowerCase().includes(topic.toLowerCase()) ||
      p.format.toLowerCase().includes(topic.toLowerCase())
    )
    
    if (related.length > 5) {
      return {
        id: Date.now().toString(),
        topic,
        frequency: related.length,
        lastUsed: new Date().toISOString(),
        severity: related.length > 10 ? 'high' : related.length > 7 ? 'medium' : 'low',
        recommendation: related.length > 10 
          ? `High fatigue: Pause ${topic} content for 2-3 weeks`
          : `Moderate fatigue: Rotate ${topic} with fresh angles`
      }
    }
    return null
  }

  const calculateContentROI = (investment: number, metrics: {views: number, engagement: number, conversions: number}): number => {
    const viewValue = metrics.views * 0.01
    const engagementValue = metrics.engagement * 0.5
    const conversionValue = metrics.conversions * 10
    const totalReturn = viewValue + engagementValue + conversionValue
    
    if (investment === 0) return 0
    return ((totalReturn - investment) / investment) * 100
  }

  const generateRotationPlan = (weekNumber: number): FormatRotation => {
    const allFormats = ['video', 'carousel', 'story', 'reel', 'thread', 'article', 'podcast', 'livestream']
    const selectedFormats = allFormats.sort(() => 0.5 - Math.random()).slice(0, 4)
    
    return {
      id: Date.now().toString(),
      week: weekNumber,
      formats: selectedFormats,
      rationale: `Rotating through ${selectedFormats.join(', ')} to maintain audience interest and platform algorithm favorability`,
      status: 'planned'
    }
  }

  const calculateQuality = (content: {technical: number, storytelling: number, production: number, engagement: number}): number => {
    return (content.technical + content.storytelling + content.production + content.engagement) / 4
  }

  const predictReaction = (concept: string): ReactionPrediction => {
    const baseReach = Math.floor(Math.random() * 10000) + 1000
    const sentiment = Math.floor(Math.random() * 100)
    const viral = Math.floor(Math.random() * 100)
    const confidence = Math.floor(Math.random() * 30) + 70
    
    return {
      id: Date.now().toString(),
      contentConcept: concept,
      predictedReach: baseReach,
      sentimentScore: sentiment,
      viralPotential: viral,
      targetAudience: 'Primary demographic',
      confidence
    }
  }

  const calculateBurnout = (creator: string, hours: number, pieces: number): BurnoutMetric => {
    const qualityScore = Math.max(0, 100 - (hours * 2) - (pieces * 3))
    let alertLevel: 'green' | 'yellow' | 'red' = 'green'
    let recommendation = 'Healthy pace - maintain current workflow'
    
    if (hours > 60 || pieces > 20) {
      alertLevel = 'red'
      recommendation = 'Critical: Reduce workload by 50% and take 3-5 days off'
    } else if (hours > 40 || pieces > 12) {
      alertLevel = 'yellow'
      recommendation = 'Warning: Scale back 25% and delegate tasks'
    }
    
    return {
      id: Date.now().toString(),
      creator,
      weeklyHours: hours,
      contentPieces: pieces,
      qualityScore,
      alertLevel,
      recommendation
    }
  }

  const assessRisk = (title: string, content: string[]): RiskAssessment => {
    const risks: string[] = []
    const sensitiveKeywords = ['controversy', 'political', 'legal', 'brand', 'offensive']
    
    content.forEach(item => {
      sensitiveKeywords.forEach(keyword => {
        if (item.toLowerCase().includes(keyword)) {
          risks.push(`Potential ${keyword} sensitivity detected`)
        }
      })
    })
    
    const severity: 'low' | 'medium' | 'high' = risks.length > 3 ? 'high' : risks.length > 1 ? 'medium' : 'low'
    
    return {
      id: Date.now().toString(),
      contentId: Date.now().toString(),
      title,
      risks: risks.length > 0 ? risks : ['No significant risks detected'],
      severity,
      mitigation: risks.length > 0 
        ? ['Legal review recommended', 'Sensitivity check with diverse team', 'Have crisis response ready']
        : ['Standard publishing process'],
      approved: risks.length === 0
    }
  }

  // CRUD Functions
  const addPlatform = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPlatform: ContentPlatform = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      format: formData.get('format') as string,
      frequency: formData.get('frequency') as string,
      objectives: (formData.get('objectives') as string).split(',').map(o => o.trim()),
      createdAt: new Date().toISOString()
    }
    
    setPlatforms([...platforms, newPlatform])
    setShowPlatformForm(false)
    addToast('Platform added successfully', 'success')
    e.currentTarget.reset()
  }

  const deletePlatform = (id: string) => {
    setPlatforms(platforms.filter(p => p.id !== id))
    addToast('Platform removed', 'success')
  }

  const addArc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newArc: ContentArc = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      theme: formData.get('theme') as string,
      duration: formData.get('duration') as string,
      milestones: (formData.get('milestones') as string).split(',').map(m => m.trim()),
      status: 'planning',
      createdAt: new Date().toISOString()
    }
    
    setArcs([...arcs, newArc])
    setShowArcForm(false)
    addToast('Content arc created', 'success')
    e.currentTarget.reset()
  }

  const updateArcStatus = (id: string, status: 'planning' | 'active' | 'completed') => {
    setArcs(arcs.map(arc => arc.id === id ? {...arc, status} : arc))
    addToast('Arc status updated', 'success')
  }

  const deleteArc = (id: string) => {
    setArcs(arcs.filter(a => a.id !== id))
    addToast('Arc deleted', 'success')
  }

  const addHook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const hookText = formData.get('text') as string
    const newHook: Hook = {
      id: Date.now().toString(),
      text: hookText,
      category: formData.get('category') as string,
      performanceScore: 0,
      usageCount: 0,
      createdAt: new Date().toISOString()
    }
    
    newHook.performanceScore = calculateHookScore(newHook)
    
    setHooks([...hooks, newHook])
    setShowHookForm(false)
    addToast('Hook added to library', 'success')
    e.currentTarget.reset()
  }

  const useHook = (id: string) => {
    setHooks(hooks.map(hook => {
      if (hook.id === id) {
        const updated = {...hook, usageCount: hook.usageCount + 1}
        updated.performanceScore = calculateHookScore(updated)
        return updated
      }
      return hook
    }))
    addToast('Hook usage tracked', 'success')
  }

  const deleteHook = (id: string) => {
    setHooks(hooks.filter(h => h.id !== id))
    addToast('Hook removed', 'success')
  }

  const runFatigueCheck = () => {
    const topics = platforms.map(p => p.name)
    const uniqueTopics = [...new Set(topics)]
    const newAlerts: FatigueAlert[] = []
    
    uniqueTopics.forEach(topic => {
      const alert = detectFatigue(topic)
      if (alert) newAlerts.push(alert)
    })
    
    setFatigueAlerts(newAlerts)
    addToast(`Fatigue check complete: ${newAlerts.length} alerts`, 'info')
  }

  const addROI = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const investment = parseFloat(formData.get('investment') as string)
    const views = parseInt(formData.get('views') as string)
    const engagement = parseInt(formData.get('engagement') as string)
    const conversions = parseInt(formData.get('conversions') as string)
    const metrics = {views, engagement, conversions}
    
    const roi = calculateContentROI(investment, metrics)
    
    const newROI: ContentROI = {
      id: Date.now().toString(),
      contentId: Date.now().toString(),
      title: formData.get('title') as string,
      investment,
      returns: (roi / 100) * investment + investment,
      roi,
      metrics,
      createdAt: new Date().toISOString()
    }
    
    setRoiData([...roiData, newROI])
    addToast(`ROI calculated: ${roi.toFixed(0)}%`, 'success')
  }

  const generateWeekRotation = () => {
    const nextWeek = rotations.length + 1
    const rotation = generateRotationPlan(nextWeek)
    setRotations([...rotations, rotation])
    addToast(`Week ${nextWeek} rotation generated`, 'success')
  }

  const updateRotationStatus = (id: string, status: 'planned' | 'active' | 'completed') => {
    setRotations(rotations.map(r => r.id === id ? {...r, status} : r))
    addToast('Rotation status updated', 'success')
  }

  const addNarrative = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newNarrative: NarrativeContinuity = {
      id: Date.now().toString(),
      episode: narratives.length + 1,
      title: formData.get('title') as string,
      theme: formData.get('theme') as string,
      callbacks: (formData.get('callbacks') as string).split(',').map(c => c.trim()),
      nextEpisode: formData.get('nextEpisode') as string,
      createdAt: new Date().toISOString()
    }
    
    setNarratives([...narratives, newNarrative])
    addToast('Narrative episode added', 'success')
    e.currentTarget.reset()
  }

  const deleteNarrative = (id: string) => {
    setNarratives(narratives.filter(n => n.id !== id))
    addToast('Narrative episode removed', 'success')
  }

  const addRemix = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newRemix: RemixIdea = {
      id: Date.now().toString(),
      originalContent: formData.get('original') as string,
      remixFormat: formData.get('format') as string,
      newAngle: formData.get('angle') as string,
      estimatedReach: parseInt(formData.get('reach') as string) || 1000,
      status: 'idea'
    }
    
    setRemixes([...remixes, newRemix])
    setShowRemixForm(false)
    addToast('Remix idea added', 'success')
    e.currentTarget.reset()
  }

  const updateRemixStatus = (id: string, status: 'idea' | 'in-progress' | 'published') => {
    setRemixes(remixes.map(r => r.id === id ? {...r, status} : r))
    addToast('Remix status updated', 'success')
  }

  const deleteRemix = (id: string) => {
    setRemixes(remixes.filter(r => r.id !== id))
    addToast('Remix idea removed', 'success')
  }

  const addBurnoutCheck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const creator = formData.get('creator') as string
    const hours = parseInt(formData.get('hours') as string)
    const pieces = parseInt(formData.get('pieces') as string)
    
    const metric = calculateBurnout(creator, hours, pieces)
    setBurnoutMetrics([...burnoutMetrics, metric])
    addToast(`Burnout check complete: ${metric.alertLevel.toUpperCase()}`, metric.alertLevel === 'red' ? 'error' : metric.alertLevel === 'yellow' ? 'warning' : 'success')
    e.currentTarget.reset()
  }

  const addSeasonal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newSeasonal: SeasonalContent = {
      id: Date.now().toString(),
      season: formData.get('season') as string,
      contentTypes: (formData.get('types') as string).split(',').map(t => t.trim()),
      peakDates: (formData.get('dates') as string).split(',').map(d => d.trim()),
      prepLead: parseInt(formData.get('lead') as string),
      status: 'researching'
    }
    
    setSeasonal([...seasonal, newSeasonal])
    setShowSeasonalForm(false)
    addToast('Seasonal content planned', 'success')
    e.currentTarget.reset()
  }

  const updateSeasonalStatus = (id: string, status: 'researching' | 'planning' | 'creating' | 'ready') => {
    setSeasonal(seasonal.map(s => s.id === id ? {...s, status} : s))
    addToast('Seasonal status updated', 'success')
  }

  const generateConstraint = () => {
    const constraintTypes = ['Time', 'Format', 'Platform', 'Budget', 'Theme', 'Length', 'Style', 'Audience']
    const constraintOptions = [
      'Create in under 1 hour',
      'Use only 3 colors',
      'No talking, only text',
      'Under 30 seconds',
      'Zero budget production',
      'Film in one location',
      'Use only mobile phone',
      'Target Gen Z exclusively',
      'Nostalgic 90s theme',
      'Educational only',
      'Behind-the-scenes style',
      'Documentary format'
    ]
    
    const randomConstraint = constraintOptions[Math.floor(Math.random() * constraintOptions.length)]
    const randomType = constraintTypes[Math.floor(Math.random() * constraintTypes.length)]
    const difficulty: 'easy' | 'medium' | 'hard' = Math.random() > 0.6 ? 'hard' : Math.random() > 0.3 ? 'medium' : 'easy'
    const inspiration = Math.floor(Math.random() * 30) + 70
    
    const newConstraint: CreativeConstraint = {
      id: Date.now().toString(),
      constraint: randomConstraint,
      type: randomType,
      difficulty,
      inspirationScore: inspiration
    }
    
    setConstraints([...constraints, newConstraint])
    addToast('Creative constraint generated', 'success')
  }

  const deleteConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id))
    addToast('Constraint removed', 'success')
  }

  const addQualityScore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const technical = parseInt(formData.get('technical') as string)
    const storytelling = parseInt(formData.get('storytelling') as string)
    const production = parseInt(formData.get('production') as string)
    const engagement = parseInt(formData.get('engagement') as string)
    const overall = calculateQuality({technical, storytelling, production, engagement})
    
    const newScore: QualityScore = {
      id: Date.now().toString(),
      contentId: Date.now().toString(),
      title: formData.get('title') as string,
      technical,
      storytelling,
      production,
      engagement,
      overall,
      createdAt: new Date().toISOString()
    }
    
    setQualityScores([...qualityScores, newScore])
    addToast(`Quality score: ${overall.toFixed(0)}/100`, 'success')
    e.currentTarget.reset()
  }

  const addPrediction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const concept = formData.get('concept') as string
    const prediction = predictReaction(concept)
    
    setPredictions([...predictions, prediction])
    setShowPredictionForm(false)
    addToast(`Prediction complete: ${prediction.viralPotential}% viral potential`, 'info')
    e.currentTarget.reset()
  }

  const deletePrediction = (id: string) => {
    setPredictions(predictions.filter(p => p.id !== id))
    addToast('Prediction removed', 'success')
  }

  const addRisk = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const title = formData.get('title') as string
    const content = (formData.get('content') as string).split(',').map(c => c.trim())
    
    const assessment = assessRisk(title, content)
    setRisks([...risks, assessment])
    setShowRiskForm(false)
    addToast(`Risk assessed: ${assessment.severity.toUpperCase()}`, assessment.severity === 'high' ? 'error' : 'info')
    e.currentTarget.reset()
  }

  const approveRisk = (id: string) => {
    setRisks(risks.map(r => r.id === id ? {...r, approved: true} : r))
    addToast('Content approved for publishing', 'success')
  }

  const deleteRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id))
    addToast('Risk assessment removed', 'success')
  }

  const addEvergreen = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newEvergreen: EvergreenContent = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      originalDate: formData.get('originalDate') as string,
      lastResurfaced: new Date().toISOString(),
      performance: parseFloat(formData.get('performance') as string) || 75,
      nextSurface: formData.get('nextSurface') as string,
      updates: (formData.get('updates') as string).split(',').map(u => u.trim()),
    }
    
    setEvergreen([...evergreen, newEvergreen])
    addToast('Evergreen content added', 'success')
    e.currentTarget.reset()
  }

  const resurfaceContent = (id: string) => {
    setEvergreen(evergreen.map(e => 
      e.id === id 
        ? {...e, lastResurfaced: new Date().toISOString()} 
        : e
    ))
    addToast('Content resurfaced', 'success')
  }

  const deleteEvergreen = (id: string) => {
    setEvergreen(evergreen.filter(e => e.id !== id))
    addToast('Evergreen content removed', 'success')
  }

  // Section Components
  const PlatformsSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Multi-Platform Content Mapping</h2>
        <p className={styles.subtitle}>Define content strategy across all platforms</p>
      </div>

      {!showPlatformForm && (
        <button className={styles.primaryBtn} onClick={() => setShowPlatformForm(true)}>
          + Add Platform
        </button>
      )}

      {showPlatformForm && (
        <form className={styles.form} onSubmit={addPlatform}>
          <div className={styles.formGroup}>
            <label>Platform Name</label>
            <input name="name" className={styles.input} placeholder="TikTok, YouTube, Instagram..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Content Format</label>
            <input name="format" className={styles.input} placeholder="Short-form video, long-form, stories..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Publishing Frequency</label>
            <input name="frequency" className={styles.input} placeholder="Daily, 3x/week, weekly..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Objectives (comma-separated)</label>
            <textarea name="objectives" className={styles.textarea} placeholder="Brand awareness, engagement, conversions..." required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Add Platform</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowPlatformForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.grid}>
        {platforms.map(platform => (
          <div key={platform.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{platform.name}</h3>
              <button className={styles.dangerBtn} onClick={() => deletePlatform(platform.id)}>×</button>
            </div>
            <p className={styles.format}><strong>Format:</strong> {platform.format}</p>
            <p className={styles.frequency}><strong>Frequency:</strong> {platform.frequency}</p>
            <div className={styles.objectives}>
              <strong>Objectives:</strong>
              <div className={styles.tagList}>
                {platform.objectives.map((obj, idx) => (
                  <span key={idx} className={styles.tag}>{obj}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {platforms.length === 0 && (
        <div className={styles.emptyState}>
          <p>No platforms mapped yet. Add your first platform to start planning cross-platform content.</p>
        </div>
      )}
    </div>
  )

  const ArcsSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Long-Term Content Arcs</h2>
        <p className={styles.subtitle}>Plan narrative arcs that span multiple content pieces</p>
      </div>

      {!showArcForm && (
        <button className={styles.primaryBtn} onClick={() => setShowArcForm(true)}>
          + Create Arc
        </button>
      )}

      {showArcForm && (
        <form className={styles.form} onSubmit={addArc}>
          <div className={styles.formGroup}>
            <label>Arc Title</label>
            <input name="title" className={styles.input} placeholder="Building My First Product" required />
          </div>
          <div className={styles.formGroup}>
            <label>Theme</label>
            <input name="theme" className={styles.input} placeholder="Entrepreneurship, skill development..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Duration</label>
            <input name="duration" className={styles.input} placeholder="3 months, 12 episodes..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Milestones (comma-separated)</label>
            <textarea name="milestones" className={styles.textarea} placeholder="Episode 1: Idea, Episode 5: Prototype..." required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Create Arc</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowArcForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.arcsGrid}>
        {arcs.map(arc => (
          <div key={arc.id} className={styles.arcCard}>
            <div className={styles.arcHeader}>
              <h3>{arc.title}</h3>
              <span className={`${styles.statusBadge} ${styles[`status${arc.status.charAt(0).toUpperCase() + arc.status.slice(1)}`]}`}>
                {arc.status}
              </span>
            </div>
            <p><strong>Theme:</strong> {arc.theme}</p>
            <p><strong>Duration:</strong> {arc.duration}</p>
            <div className={styles.milestones}>
              <strong>Milestones:</strong>
              {arc.milestones.map((m, idx) => (
                <div key={idx} className={styles.milestone}>• {m}</div>
              ))}
            </div>
            <div className={styles.arcActions}>
              <button className={styles.secondaryBtn} onClick={() => updateArcStatus(arc.id, 'active')}>Activate</button>
              <button className={styles.secondaryBtn} onClick={() => updateArcStatus(arc.id, 'completed')}>Complete</button>
              <button className={styles.dangerBtn} onClick={() => deleteArc(arc.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {arcs.length === 0 && (
        <div className={styles.emptyState}>
          <p>No content arcs yet. Create your first arc to build sustained narrative momentum.</p>
        </div>
      )}
    </div>
  )

  const HooksSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>AI Hook Library</h2>
        <p className={styles.subtitle}>Catalog and score high-performing hooks</p>
      </div>

      {!showHookForm && (
        <button className={styles.primaryBtn} onClick={() => setShowHookForm(true)}>
          + Add Hook
        </button>
      )}

      {showHookForm && (
        <form className={styles.form} onSubmit={addHook}>
          <div className={styles.formGroup}>
            <label>Hook Text</label>
            <textarea name="text" className={styles.textarea} placeholder="I tried [thing] for 30 days and..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Category</label>
            <input name="category" className={styles.input} placeholder="Curiosity, Controversy, Tutorial..." required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Add Hook</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setShowHookForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.hooksGrid}>
        {hooks.map(hook => (
          <div key={hook.id} className={styles.hookCard}>
            <div className={styles.hookHeader}>
              <span className={styles.scoreChip}>Score: {hook.performanceScore}</span>
              <button className={styles.dangerBtn} onClick={() => deleteHook(hook.id)}>×</button>
            </div>
            <p className={styles.hookText}>{hook.text}</p>
            <div className={styles.hookMeta}>
              <span className={styles.tag}>{hook.category}</span>
              <span className={styles.usageCount}>Used {hook.usageCount}x</span>
            </div>
            <button className={styles.secondaryBtn} onClick={() => useHook(hook.id)}>Mark as Used</button>
          </div>
        ))}
      </div>

      {hooks.length === 0 && (
        <div className={styles.emptyState}>
          <p>No hooks in library. Add your first hook to start building your collection.</p>
        </div>
      )}
    </div>
  )

  const FatigueSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Content Fatigue Detection</h2>
        <p className={styles.subtitle}>Identify overused topics and themes</p>
      </div>

      <button className={styles.primaryBtn} onClick={runFatigueCheck}>
        Run Fatigue Check
      </button>

      <div className={styles.alertsGrid}>
        {fatigueAlerts.map(alert => (
          <div key={alert.id} className={`${styles.alertCard} ${styles[`severity${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}`]}`}>
            <div className={styles.alertHeader}>
              <h3>{alert.topic}</h3>
              <span className={styles.severityBadge}>{alert.severity.toUpperCase()}</span>
            </div>
            <p><strong>Frequency:</strong> {alert.frequency} pieces</p>
            <p><strong>Last Used:</strong> {new Date(alert.lastUsed).toLocaleDateString()}</p>
            <div className={styles.recommendation}>
              <strong>Recommendation:</strong>
              <p>{alert.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {fatigueAlerts.length === 0 && (
        <div className={styles.emptyState}>
          <p>No fatigue alerts. Run a check to analyze content repetition patterns.</p>
        </div>
      )}
    </div>
  )

  const ROISection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Content ROI Estimator</h2>
        <p className={styles.subtitle}>Calculate return on investment for content pieces</p>
      </div>

      <form className={styles.form} onSubmit={addROI}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Content Title</label>
            <input name="title" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Investment ($)</label>
            <input name="investment" type="number" step="0.01" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Views</label>
            <input name="views" type="number" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Engagement</label>
            <input name="engagement" type="number" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Conversions</label>
            <input name="conversions" type="number" className={styles.input} required />
          </div>
        </div>
        <button type="submit" className={styles.primaryBtn}>Calculate ROI</button>
      </form>

      <div className={styles.roiGrid}>
        {roiData.map(item => (
          <div key={item.id} className={styles.roiCard}>
            <h3>{item.title}</h3>
            <div className={styles.roiMetrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Investment</span>
                <span className={styles.metricValue}>${item.investment}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Returns</span>
                <span className={styles.metricValue}>${item.returns.toFixed(2)}</span>
              </div>
              <div className={`${styles.metric} ${styles.roiHighlight}`}>
                <span className={styles.metricLabel}>ROI</span>
                <span className={styles.metricValue}>{item.roi.toFixed(0)}%</span>
              </div>
            </div>
            <div className={styles.performanceMetrics}>
              <div>Views: {item.metrics.views}</div>
              <div>Engagement: {item.metrics.engagement}</div>
              <div>Conversions: {item.metrics.conversions}</div>
            </div>
          </div>
        ))}
      </div>

      {roiData.length === 0 && (
        <div className={styles.emptyState}>
          <p>No ROI data yet. Add your first content piece to track returns.</p>
        </div>
      )}
    </div>
  )

  const RotationSection = () => (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Format Rotation Planner</h2>
        <p className={styles.subtitle}>Automatically plan content format rotation</p>
      </div>

      <button className={styles.primaryBtn} onClick={generateWeekRotation}>
        Generate Week Rotation
      </button>

      <div className={styles.rotationsGrid}>
        {rotations.map(rotation => (
          <div key={rotation.id} className={styles.rotationCard}>
            <div className={styles.rotationHeader}>
              <h3>Week {rotation.week}</h3>
              <span className={`${styles.statusBadge} ${styles[`status${rotation.status.charAt(0).toUpperCase() + rotation.status.slice(1)}`]}`}>
                {rotation.status}
              </span>
            </div>
            <div className={styles.formats}>
              <strong>Formats:</strong>
              <div className={styles.tagList}>
                {rotation.formats.map((format, idx) => (
                  <span key={idx} className={styles.tag}>{format}</span>
                ))}
              </div>
            </div>
            <p className={styles.rationale}>{rotation.rationale}</p>
            <div className={styles.rotationActions}>
              <button className={styles.secondaryBtn} onClick={() => updateRotationStatus(rotation.id, 'active')}>Activate</button>
              <button className={styles.secondaryBtn} onClick={() => updateRotationStatus(rotation.id, 'completed')}>Complete</button>
            </div>
          </div>
        ))}
      </div>

      {rotations.length === 0 && (
        <div className={styles.emptyState}>
          <p>No rotations planned. Generate your first week rotation.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Creative Production Engine</h1>
          <p className={styles.subtitle}>Full-spectrum content intelligence and production workflow</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'platforms' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('platforms')}>Platform Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'arcs' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('arcs')}>Content Arcs</button>
          <button className={`${styles.navItem} ${activeSection === 'hooks' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('hooks')}>Hook Library</button>
          <button className={`${styles.navItem} ${activeSection === 'fatigue' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('fatigue')}>Fatigue Detection</button>
          <button className={`${styles.navItem} ${activeSection === 'roi' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('roi')}>ROI Estimator</button>
          <button className={`${styles.navItem} ${activeSection === 'rotation' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('rotation')}>Format Rotation</button>
          <button className={`${styles.navItem} ${activeSection === 'narrative' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('narrative')}>Narrative Continuity</button>
          <button className={`${styles.navItem} ${activeSection === 'remix' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('remix')}>Remix Engine</button>
          <button className={`${styles.navItem} ${activeSection === 'burnout' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('burnout')}>Burnout Alerts</button>
          <button className={`${styles.navItem} ${activeSection === 'seasonal' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('seasonal')}>Seasonal Forecast</button>
          <button className={`${styles.navItem} ${activeSection === 'constraints' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('constraints')}>Creative Constraints</button>
          <button className={`${styles.navItem} ${activeSection === 'quality' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('quality')}>Quality Scoring</button>
          <button className={`${styles.navItem} ${activeSection === 'predictions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('predictions')}>Reaction Predictor</button>
          <button className={`${styles.navItem} ${activeSection === 'risk' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('risk')}>Risk Assessment</button>
          <button className={`${styles.navItem} ${activeSection === 'evergreen' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('evergreen')}>Evergreen Resurfacer</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'platforms' && <PlatformsSection />}
          {activeSection === 'arcs' && <ArcsSection />}
          {activeSection === 'hooks' && <HooksSection />}
          {activeSection === 'fatigue' && <FatigueSection />}
          {activeSection === 'roi' && <ROISection />}
          {activeSection === 'rotation' && <RotationSection />}
          {/* Add remaining sections here */}
        </main>
      </div>
    </div>
  )
}
