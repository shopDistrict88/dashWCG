export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface Creator {
  id: string
  name: string
  goals: string[]
  teamRequests: string[]
  progress: number
  roadmapStage: 'beginner' | 'established' | 'monetized'
}

export interface Project {
  id: string
  name: string
  type: string
  description: string
  helpNeeded: string[]
  status: 'idea' | 'active' | 'completed'
  createdAt: string
}

export interface Brand {
  id: string
  name: string
  description?: string
  colors: string[]
  fonts?: string[]
  voice?: string
  logoUrl?: string
  consistencyScore?: number
}

export interface ContentPiece {
  id: string
  title: string
  type: string
  content: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  tags?: string[]
  repurposedFrom?: string
  createdAt: string
  // New features
  intent?: 'Awareness' | 'Authority' | 'Trust' | 'Conversion' | 'Community' | 'Experiment'
  riskLevel?: 'Safe' | 'Experimental' | 'High-risk'
  qualityScore?: number // 0-100
  isEvergreen?: boolean
  hook?: string
  hooks?: string[] // Hook library
  creatorVoiceProfile?: string // Tone/voice classification
  platformRecommendations?: { platform: string; bestTime: string }[]
  visualConsistencyWarning?: string
  captionVisualAlignment?: number // 0-100 alignment score
  relatedOpportunities?: string[] // Signals for launches, monetization, etc
  archivedReason?: string
  experimentSuggestions?: string[]
  contentFatigueFactor?: number // 0-100, how repetitive
  dependencyFlags?: string[] // Warns of event/launch dependencies
}

export interface LaunchPage {
  id: string
  title: string
  type: 'landing' | 'drop' | 'event' | 'campaign'
  content: string
  status: 'draft' | 'live'
  url?: string
  checklist?: Array<{ id: string; text: string; completed: boolean; category: 'design' | 'copy' | 'legal' | 'analytics' | 'marketing' }>
  createdAt: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  inventory?: number
  status: 'draft' | 'active'
  scarityTimer?: string
  feedbackCollected?: number
}

export interface Order {
  id: string
  productId: string
  quantity: number
  total: number
  status: 'pending' | 'completed'
  createdAt: string
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration: number
}

export interface Dashboard {
  creators: Creator[]
  projects: Project[]
  brands: Brand[]
  content: ContentPiece[]
  launchPages: LaunchPage[]
  products: Product[]
  orders: Order[]
  notes: Note[]
  experiments: Experiment[]
  services: Service[]
  activity: ActivityItem[]
}

export interface Note {
  id: string
  title: string
  content: string
  category?: string
  score?: number
  createdAt: string
}

export interface Experiment {
  id: string
  name: string
  type: 'ab-test' | 'pricing' | 'campaign'
  description: string
  status: 'active' | 'completed'
  results?: string
  learnings?: string
  createdAt: string
}

export interface Service {
  id: string
  title: string
  category: 'design' | 'development' | 'photography' | 'branding' | 'marketing'
  description: string
  budget?: string
  status: 'inquiry' | 'booked' | 'completed'
  linkedProject?: string
  createdAt: string
}

export interface ActivityItem {
  id: string
  type: 'project' | 'product' | 'content' | 'brand' | 'experiment' | 'order'
  title: string
  timestamp: string
  action: string
}
