export type ThoughtTemperature = 'cold' | 'warm' | 'urgent'
export type AssumptionFlag = 'assumption' | 'fact' | 'hypothesis'
export type NoteRole = 'idea' | 'principle' | 'rule' | 'warning' | 'insight'
export type LifecycleStatus = 'seed' | 'tested' | 'shipped' | 'archived'
export type StrategicHorizon = 'short' | 'mid' | 'long'
export type FrameworkType =
  | 'none'
  | 'swot'
  | 'five_whys'
  | 'first_principles'
  | 'rice'
  | 'opportunity_canvas'

export interface ThoughtVersion {
  content: string
  date: string
}

export interface ThoughtUncertainty {
  id: string
  label: string
  impact: number
  likelihood: number
}

export interface ThoughtReflection {
  id: string
  dueAt: string
  prompt: string
  completed: boolean
}

export interface ThoughtTradeoff {
  id: string
  title: string
  cost: string
  benefit: string
}

export interface ThoughtConstraint {
  id: string
  label: string
}

export interface ThoughtFramework {
  type: FrameworkType
  fields: Record<string, string>
}

export interface ThoughtContextSnapshot {
  summary: string
  mood: 'clear' | 'charged' | 'uncertain' | 'tired'
  energy: number
}

export interface ThoughtReferences {
  projects: string[]
  brands: string[]
  launches: string[]
  content: string[]
  externalLinks: string[]
}

export interface ThoughtAIOutput {
  text: string
  items?: string[]
  updatedAt: string
}

export interface ThoughtAIStore {
  blindSpots?: ThoughtAIOutput
  counterArguments?: ThoughtAIOutput
  stressTest?: ThoughtAIOutput
  questions?: ThoughtAIOutput
  summary?: ThoughtAIOutput
  biasDetection?: ThoughtAIOutput
  naming?: ThoughtAIOutput
  analogy?: ThoughtAIOutput
  expansion?: ThoughtAIOutput
  decisionSim?: ThoughtAIOutput
  actionPlan?: ThoughtAIOutput
  compression?: ThoughtAIOutput
  crossDomain?: ThoughtAIOutput
  synthesis?: ThoughtAIOutput
}

export interface ThoughtNote {
  id: string
  title: string
  body: string
  tags: string[]
  linkedNotes: string[]
  references: ThoughtReferences
  temperature: ThoughtTemperature
  cognitiveLoad: number
  assumptionFlag: AssumptionFlag
  secondOrder: string
  confidence: number
  uncertainties: ThoughtUncertainty[]
  frictionWarnings: string[]
  compression: string
  counterArguments: string[]
  blindSpots: string[]
  ai: ThoughtAIStore
  isDecision: boolean
  decisionOutcome: string
  decisionWorked: boolean | null
  actionItems: string[]
  reflections: ThoughtReflection[]
  versions: ThoughtVersion[]
  parentId: string | null
  lifecycleStatus: LifecycleStatus
  abandoned: boolean
  insightDensityScore: number
  framework: ThoughtFramework
  problemStatement: string
  successCriteria: string
  constraints: ThoughtConstraint[]
  tradeoffs: ThoughtTradeoff[]
  signalNoise: number
  gravityScore: number
  noteRole: NoteRole
  crossDomain: string
  strategicHorizon: StrategicHorizon
  contextSnapshot: ThoughtContextSnapshot
  createdAt: string
  updatedAt: string
  lastViewed: string
  viewCount: number
}

export type ThoughtSort = 'recent' | 'updated' | 'confidence' | 'gravity' | 'load'

export type ThoughtView = 'list' | 'graph' | 'focus'

export type AiTask =
  | 'blind_spots'
  | 'counter_arguments'
  | 'stress_test'
  | 'questions'
  | 'summary'
  | 'bias'
  | 'naming'
  | 'analogy'
  | 'expansion'
  | 'decision_sim'
  | 'action_plan'
  | 'compression'
  | 'cross_domain'
  | 'synthesis'
