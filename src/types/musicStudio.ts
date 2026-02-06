export type ProjectStatus = 'active' | 'archived'
export type PublishStatus = 'draft' | 'scheduled' | 'released'
export type CollaboratorRole = 'owner' | 'editor' | 'viewer'
export type ClipRole = 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro' | 'fx'
export type AiTask =
  | 'mix_critique'
  | 'mastering_chain'
  | 'arrangement'
  | 'lyrics'
  | 'reference_match'
  | 'release_strategy'
  | 'promo_kit'

export interface TrackEQ {
  low: number
  mid: number
  high: number
}

export interface TrackCompressor {
  threshold: number
  ratio: number
}

export interface TrackFx {
  reverb: number
  delay: number
}

export interface TrackSettings {
  volume: number
  pan: number
  eq: TrackEQ
  compressor: TrackCompressor
  fx: TrackFx
  mute: boolean
  solo: boolean
}

export interface TrackComment {
  id: string
  trackId: string
  author: string
  message: string
  parentId: string | null
  createdAt: string
}

export interface Track {
  id: string
  name: string
  color: string
  role: string
  tags: string[]
  settings: TrackSettings
  comments: TrackComment[]
  revisionCount: number
}

export interface Clip {
  id: string
  trackId: string
  role: ClipRole
  start: number
  length: number
  label: string
}

export interface StemFile {
  id: string
  trackId: string
  name: string
  fileName: string
  sizeMb: number
  durationSec: number
  uploadedAt: string
}

export interface RevisionSnapshot {
  id: string
  label: string
  createdAt: string
  summary: string
  projectData: MusicProject
}

export interface Collaborator {
  id: string
  name: string
  email: string
  role: CollaboratorRole
  status: 'invited' | 'active'
}

export interface PublishingPlatform {
  id: string
  name: string
  enabled: boolean
  compatibility: string[]
}

export interface PublishingChecklistItem {
  id: string
  label: string
  done: boolean
}

export interface ReleaseMetadata {
  title: string
  artist: string
  isrc: string
  genre: string
  mood: string
  credits: string
}

export interface PublishingPlan {
  releaseDate: string
  status: PublishStatus
  artworkUrl: string
  platforms: PublishingPlatform[]
  checklist: PublishingChecklistItem[]
  metadata: ReleaseMetadata
  promoKit: string
  compatibilityWarnings: string[]
}

export interface AnalyticsSnapshot {
  plays: number
  saves: number
  completionRate: number
  skipRate: number
  engagement: number
  updatedAt: string
}

export interface ActivityItem {
  id: string
  message: string
  createdAt: string
}

export interface IdeaVaultItem {
  id: string
  title: string
  description: string
  createdAt: string
}

export interface SoundPaletteItem {
  id: string
  name: string
  type: string
  notes: string
}

export interface SampleClearanceItem {
  id: string
  sampleName: string
  source: string
  status: 'pending' | 'cleared' | 'denied'
}

export interface SplitItem {
  id: string
  name: string
  role: string
  percent: number
}

export interface AiOutput {
  text: string
  updatedAt: string
}

export interface MusicProject {
  id: string
  title: string
  artist: string
  bpm: number
  key: string
  mood: string
  intent: string
  tags: string[]
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  lastSavedAt: string
  tracks: Track[]
  clips: Clip[]
  stems: StemFile[]
  revisions: RevisionSnapshot[]
  collaborators: Collaborator[]
  publishing: PublishingPlan
  analytics: AnalyticsSnapshot
  activity: ActivityItem[]
  referenceTracks: { a: string; b: string; active: 'a' | 'b' }
  notes: { id: string; text: string; createdAt: string }[]
  masterBus: { lufsTarget: number; loudness: number; stereoWidth: number }
  ideas: IdeaVaultItem[]
  palette: SoundPaletteItem[]
  samples: SampleClearanceItem[]
  splits: SplitItem[]
  ai: Record<AiTask, AiOutput | null>
}
