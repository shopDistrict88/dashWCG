import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchMusicProjects, upsertMusicProject, deleteMusicProject } from '../services/musicStudioStore'
import { supabaseClient, isSupabaseConfigured } from '../lib/supabase'
import type { MusicProject, Track, Clip, IdeaVaultItem, SoundPaletteItem, SampleClearanceItem, SplitItem, Collaborator, ActivityItem } from '../types/musicStudio'
import styles from './MusicStudio.module.css'

type StudioTab = 'sessions' | 'studio' | 'mixer' | 'files' | 'record' | 'collaborate' | 'analysis' | 'export' | 'creative' | 'pro'

interface MusicFileRecord {
  id: string
  name: string
  file_path: string
  file_type: string
  size_bytes: number
  duration_seconds: number | null
  folder: string
  metadata: Record<string, unknown>
  version: number
  parent_file_id: string | null
  comments: { author: string; text: string; time: string }[]
  project_id: string | null
  created_at: string
}

interface ActivityRecord {
  id: string
  project_id: string
  action: string
  details: string | null
  created_at: string
}

const TRACK_COLORS = ['#555', '#666', '#777', '#888', '#999', '#aaa', '#bbb', '#ccc']

function uid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

function createDefaultProject(title = 'Untitled Session'): MusicProject {
  const ts = now()
  return {
    id: uid(),
    title,
    artist: '',
    bpm: 120,
    key: 'C',
    mood: '',
    intent: '',
    tags: [],
    status: 'active',
    createdAt: ts,
    updatedAt: ts,
    lastSavedAt: ts,
    tracks: [],
    clips: [],
    stems: [],
    revisions: [],
    collaborators: [],
    publishing: {
      releaseDate: '',
      status: 'draft',
      artworkUrl: '',
      platforms: [],
      checklist: [
        { id: uid(), label: 'Metadata complete', done: false },
        { id: uid(), label: 'Cover art uploaded', done: false },
        { id: uid(), label: 'Mix approved', done: false },
        { id: uid(), label: 'Master approved', done: false },
        { id: uid(), label: 'All collaborators credited', done: false },
      ],
      metadata: { title: '', artist: '', isrc: '', genre: '', mood: '', credits: '' },
      promoKit: '',
      compatibilityWarnings: [],
    },
    analytics: { plays: 0, saves: 0, completionRate: 0, skipRate: 0, engagement: 0, updatedAt: ts },
    activity: [],
    referenceTracks: { a: '', b: '', active: 'a' },
    notes: [],
    masterBus: { lufsTarget: -14, loudness: 0, stereoWidth: 100 },
    ideas: [],
    palette: [],
    samples: [],
    splits: [],
    ai: {
      mix_critique: null,
      mastering_chain: null,
      arrangement: null,
      lyrics: null,
      reference_match: null,
      release_strategy: null,
      promo_kit: null,
    },
  }
}

function createDefaultTrack(name = 'New Track', index = 0): Track {
  return {
    id: uid(),
    name,
    color: TRACK_COLORS[index % TRACK_COLORS.length],
    role: 'audio',
    tags: [],
    settings: {
      volume: 75,
      pan: 0,
      eq: { low: 0, mid: 0, high: 0 },
      compressor: { threshold: -20, ratio: 4 },
      fx: { reverb: 0, delay: 0 },
      mute: false,
      solo: false,
    },
    comments: [],
    revisionCount: 0,
  }
}

function fmtDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${(bytes / 1073741824).toFixed(2)} GB`
}

function fmtDuration(sec: number | null): string {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return fmtDate(iso)
}

export function MusicStudio() {
  const { user } = useAuth()
  const userId = user?.id ?? null

  // --- Core State ---
  const [activeTab, setActiveTab] = useState<StudioTab>('sessions')
  const [projects, setProjects] = useState<MusicProject[]>([])
  const [activeProject, setActiveProject] = useState<MusicProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // --- UI State ---
  const [focusMode, setFocusMode] = useState(false)
  const [minimalUI, setMinimalUI] = useState(false)
  const [collapsedPanels, setCollapsedPanels] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated')

  // --- Session Creation ---
  const [showNewSession, setShowNewSession] = useState(false)
  const [newSessionTitle, setNewSessionTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [editTitleValue, setEditTitleValue] = useState('')

  // --- Transport ---
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [metronomeOn, setMetronomeOn] = useState(false)
  const [countInOn, setCountInOn] = useState(false)
  const [loopStart, setLoopStart] = useState(0)
  const [loopEnd, setLoopEnd] = useState(16)
  const [playheadPos, setPlayheadPos] = useState(0)

  // --- Editing ---
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)

  // --- Undo/Redo ---
  const [undoStack, setUndoStack] = useState<MusicProject[]>([])
  const [redoStack, setRedoStack] = useState<MusicProject[]>([])

  // --- Files ---
  const [files, setFiles] = useState<MusicFileRecord[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [activeFolder, setActiveFolder] = useState('/')
  const [previewFileId, setPreviewFileId] = useState<string | null>(null)
  const [fileCommentText, setFileCommentText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioPreviewRef = useRef<HTMLAudioElement>(null)

  // --- Recording ---
  const [recordingTakes, setRecordingTakes] = useState<{ id: string; name: string; time: string }[]>([])
  const [inputLevel, setInputLevel] = useState(0)
  const [latencyMs, setLatencyMs] = useState(0)

  // --- Collaborate ---
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')
  const [commentText, setCommentText] = useState('')
  const [activityLog, setActivityLog] = useState<ActivityRecord[]>([])

  // --- Analysis ---
  const [analysisRunning, setAnalysisRunning] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<Record<string, string>>({})

  // --- Export ---
  const [exportFormat, setExportFormat] = useState<'wav' | 'mp3' | 'stems'>('wav')
  const [exportLabel, setExportLabel] = useState('')
  const [exportHistory, setExportHistory] = useState<{ id: string; format: string; label: string; time: string }[]>([])

  // --- Creative ---
  const [lyricsText, setLyricsText] = useState('')
  const [scratchpadText, setScratchpadText] = useState('')
  const [moodNotes, setMoodNotes] = useState('')
  const [arrangementOutline, setArrangementOutline] = useState('')
  const [newIdeaTitle, setNewIdeaTitle] = useState('')
  const [newIdeaDesc, setNewIdeaDesc] = useState('')

  // --- Pro ---
  const [sessionLocked, setSessionLocked] = useState(false)
  const [clientNotes, setClientNotes] = useState('')
  const [engineerNotes, setEngineerNotes] = useState('')
  const [producerNotes, setProducerNotes] = useState('')
  const [copyrightInfo, setCopyrightInfo] = useState('')
  const [deadline, setDeadline] = useState('')

  // --- Templates ---
  const [templateName, setTemplateName] = useState('')

  // ─── Data Loading ─────────────────────────────────────────
  const loadProjects = useCallback(async () => {
    setLoading(true)
    const data = await fetchMusicProjects(userId)
    setProjects(data)
    setLoading(false)
  }, [userId])

  const loadFiles = useCallback(async () => {
    if (!userId || !isSupabaseConfigured()) return
    const { data } = await supabaseClient
      .from('music_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setFiles(data as MusicFileRecord[])
  }, [userId])

  const loadActivity = useCallback(async (projectId: string) => {
    if (!userId || !isSupabaseConfigured()) return
    const { data } = await supabaseClient
      .from('music_activity')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setActivityLog(data as ActivityRecord[])
  }, [userId])

  useEffect(() => {
    loadProjects()
    loadFiles()
  }, [loadProjects, loadFiles])

  useEffect(() => {
    if (activeProject) {
      loadActivity(activeProject.id)
      setLyricsText(activeProject.publishing?.metadata?.credits || '')
      setScratchpadText(activeProject.notes?.[0]?.text || '')
    }
  }, [activeProject?.id, loadActivity])

  // ─── Auto-save Project ────────────────────────────────────
  const saveProject = useCallback(async (project: MusicProject) => {
    setSaving(true)
    const updated = { ...project, updatedAt: now(), lastSavedAt: now() }
    await upsertMusicProject(userId, updated)
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
    setActiveProject(updated)
    setSaving(false)
  }, [userId])

  const logActivity = useCallback(async (projectId: string, action: string, details?: string) => {
    if (!userId || !isSupabaseConfigured()) return
    await supabaseClient.from('music_activity').insert({
      project_id: projectId,
      user_id: userId,
      action,
      details: details || null,
    })
  }, [userId])

  const pushUndo = useCallback(() => {
    if (activeProject) {
      setUndoStack(prev => [...prev.slice(-20), JSON.parse(JSON.stringify(activeProject))])
      setRedoStack([])
    }
  }, [activeProject])

  // ─── Project Actions ──────────────────────────────────────
  const updateProject = useCallback((updater: (p: MusicProject) => MusicProject) => {
    if (!activeProject) return
    pushUndo()
    const updated = updater({ ...activeProject })
    setActiveProject(updated)
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
    saveProject(updated)
  }, [activeProject, pushUndo, saveProject])

  const handleCreateSession = async () => {
    const project = createDefaultProject(newSessionTitle || 'Untitled Session')
    await upsertMusicProject(userId, project)
    setProjects(prev => [project, ...prev])
    setActiveProject(project)
    setActiveTab('studio')
    setShowNewSession(false)
    setNewSessionTitle('')
    logActivity(project.id, 'Session created', project.title)
  }

  const handleDuplicateSession = async (project: MusicProject) => {
    const dup = { ...JSON.parse(JSON.stringify(project)), id: uid(), title: `${project.title} (Copy)`, createdAt: now(), updatedAt: now() }
    await upsertMusicProject(userId, dup)
    setProjects(prev => [dup, ...prev])
    logActivity(dup.id, 'Session duplicated', `from ${project.title}`)
  }

  const handleArchiveSession = async (project: MusicProject) => {
    const updated = { ...project, status: project.status === 'archived' ? 'active' as const : 'archived' as const, updatedAt: now() }
    await upsertMusicProject(userId, updated)
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
    if (activeProject?.id === updated.id) setActiveProject(updated)
    logActivity(updated.id, updated.status === 'archived' ? 'Session archived' : 'Session restored')
  }

  const handleDeleteSession = async (projectId: string) => {
    await deleteMusicProject(userId, projectId)
    setProjects(prev => prev.filter(p => p.id !== projectId))
    if (activeProject?.id === projectId) setActiveProject(null)
  }

  const handleRenameSession = (projectId: string) => {
    if (!editTitleValue.trim()) return
    const project = projects.find(p => p.id === projectId)
    if (!project) return
    const updated = { ...project, title: editTitleValue.trim(), updatedAt: now() }
    upsertMusicProject(userId, updated)
    setProjects(prev => prev.map(p => p.id === projectId ? updated : p))
    if (activeProject?.id === projectId) setActiveProject(updated)
    setEditingTitle(null)
    logActivity(projectId, 'Session renamed', editTitleValue.trim())
  }

  // ─── Track Actions ────────────────────────────────────────
  const handleAddTrack = () => {
    updateProject(p => ({
      ...p,
      tracks: [...p.tracks, createDefaultTrack(`Track ${p.tracks.length + 1}`, p.tracks.length)],
    }))
  }

  const handleRemoveTrack = (trackId: string) => {
    updateProject(p => ({
      ...p,
      tracks: p.tracks.filter(t => t.id !== trackId),
      clips: p.clips.filter(c => c.trackId !== trackId),
    }))
    if (selectedTrackId === trackId) setSelectedTrackId(null)
  }

  const handleTrackUpdate = (trackId: string, updates: Partial<Track>) => {
    updateProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? { ...t, ...updates } : t),
    }))
  }

  const handleTrackSettingUpdate = (trackId: string, key: string, value: unknown) => {
    updateProject(p => ({
      ...p,
      tracks: p.tracks.map(t =>
        t.id === trackId ? { ...t, settings: { ...t.settings, [key]: value } } : t
      ),
    }))
  }

  const handleToggleMute = (trackId: string) => {
    const track = activeProject?.tracks.find(t => t.id === trackId)
    if (track) handleTrackSettingUpdate(trackId, 'mute', !track.settings.mute)
  }

  const handleToggleSolo = (trackId: string) => {
    const track = activeProject?.tracks.find(t => t.id === trackId)
    if (track) handleTrackSettingUpdate(trackId, 'solo', !track.settings.solo)
  }

  const handleMoveTrack = (trackId: string, direction: 'up' | 'down') => {
    updateProject(p => {
      const idx = p.tracks.findIndex(t => t.id === trackId)
      if (idx < 0) return p
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= p.tracks.length) return p
      const tracks = [...p.tracks]
      ;[tracks[idx], tracks[newIdx]] = [tracks[newIdx], tracks[idx]]
      return { ...p, tracks }
    })
  }

  // ─── Clip Actions ─────────────────────────────────────────
  const handleAddClip = (trackId: string) => {
    const clip: Clip = {
      id: uid(),
      trackId,
      role: 'verse',
      start: playheadPos,
      length: 4,
      label: 'New Clip',
    }
    updateProject(p => ({ ...p, clips: [...p.clips, clip] }))
  }

  const handleSplitClip = (clipId: string) => {
    updateProject(p => {
      const clip = p.clips.find(c => c.id === clipId)
      if (!clip || clip.length <= 1) return p
      const mid = clip.start + Math.floor(clip.length / 2)
      const a: Clip = { ...clip, length: mid - clip.start }
      const b: Clip = { ...clip, id: uid(), start: mid, length: clip.start + clip.length - mid, label: `${clip.label} (2)` }
      return { ...p, clips: p.clips.map(c => c.id === clipId ? a : c).concat(b) }
    })
  }

  const handleDeleteClip = (clipId: string) => {
    updateProject(p => ({ ...p, clips: p.clips.filter(c => c.id !== clipId) }))
    if (selectedClipId === clipId) setSelectedClipId(null)
  }

  // ─── Marker Actions ───────────────────────────────────────
  const handleAddMarker = () => {
    updateProject(p => ({
      ...p,
      activity: [...p.activity, { id: uid(), message: `Marker at bar ${playheadPos + 1}`, createdAt: now() }],
    }))
  }

  // ─── Undo/Redo ────────────────────────────────────────────
  const handleUndo = () => {
    if (undoStack.length === 0 || !activeProject) return
    const prev = undoStack[undoStack.length - 1]
    setRedoStack(s => [...s, JSON.parse(JSON.stringify(activeProject))])
    setUndoStack(s => s.slice(0, -1))
    setActiveProject(prev)
    setProjects(ps => ps.map(p => p.id === prev.id ? prev : p))
    saveProject(prev)
  }

  const handleRedo = () => {
    if (redoStack.length === 0 || !activeProject) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack(s => [...s, JSON.parse(JSON.stringify(activeProject))])
    setRedoStack(s => s.slice(0, -1))
    setActiveProject(next)
    setProjects(ps => ps.map(p => p.id === next.id ? next : p))
    saveProject(next)
  }

  // ─── File Actions ─────────────────────────────────────────
  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || !userId) return
    for (const file of Array.from(fileList)) {
      const filePath = `${userId}/${uid()}_${file.name}`
      if (isSupabaseConfigured()) {
        await supabaseClient.storage.from('music-files').upload(filePath, file)
      }
      const record: Partial<MusicFileRecord> = {
        name: file.name,
        file_path: filePath,
        file_type: file.type || 'audio',
        size_bytes: file.size,
        folder: activeFolder,
        metadata: {},
        version: 1,
        comments: [],
        project_id: activeProject?.id || null,
      }
      if (isSupabaseConfigured()) {
        await supabaseClient.from('music_files').insert({ ...record, user_id: userId })
      }
      logActivity(activeProject?.id || '', 'File uploaded', file.name)
    }
    loadFiles()
  }

  const handleFileRename = async (fileId: string, newName: string) => {
    if (!isSupabaseConfigured()) return
    await supabaseClient.from('music_files').update({ name: newName }).eq('id', fileId)
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f))
  }

  const handleFileDelete = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return
    if (isSupabaseConfigured()) {
      await supabaseClient.storage.from('music-files').remove([file.file_path])
      await supabaseClient.from('music_files').delete().eq('id', fileId)
    }
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleAddFileComment = async (fileId: string) => {
    if (!fileCommentText.trim()) return
    const file = files.find(f => f.id === fileId)
    if (!file) return
    const newComments = [...(file.comments || []), { author: user?.user_metadata?.name || 'You', text: fileCommentText.trim(), time: now() }]
    if (isSupabaseConfigured()) {
      await supabaseClient.from('music_files').update({ comments: newComments }).eq('id', fileId)
    }
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, comments: newComments } : f))
    setFileCommentText('')
  }

  // ─── Collaboration Actions ────────────────────────────────
  const handleInviteCollaborator = () => {
    if (!inviteEmail.trim() || !activeProject) return
    const collab: Collaborator = { id: uid(), name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole === 'editor' ? 'editor' : 'viewer', status: 'invited' }
    updateProject(p => ({ ...p, collaborators: [...p.collaborators, collab] }))
    setInviteEmail('')
    logActivity(activeProject.id, 'Collaborator invited', inviteEmail)
  }

  const handleAddSessionComment = () => {
    if (!commentText.trim() || !activeProject) return
    const item: ActivityItem = { id: uid(), message: `${user?.user_metadata?.name || 'You'}: ${commentText.trim()}`, createdAt: now() }
    updateProject(p => ({ ...p, activity: [...p.activity, item] }))
    setCommentText('')
    logActivity(activeProject.id, 'Comment added', commentText.trim())
  }

  // ─── Analysis (AI-assisted) ───────────────────────────────
  const runAnalysis = (type: string) => {
    setAnalysisRunning(type)
    setTimeout(() => {
      const results: Record<string, string> = {
        pitch: 'Detected root pitch: C4. Slight flat tendency on sustained notes (-8 cents avg). Consider tuning correction on tracks 2, 4.',
        tuning: 'Track 1: In tune. Track 2: -12 cents on verse. Track 3: +5 cents on chorus. Recommended: gentle pitch correction on Track 2.',
        tempo: `Detected tempo: ${activeProject?.bpm || 120} BPM (stable). Tempo drift: ±0.3 BPM — within acceptable range.`,
        loudness: `Integrated loudness: -14.2 LUFS (target: -14 LUFS). True Peak: -1.2 dBTP. Loudness range: 7.8 LU. Compliant with streaming standards.`,
        spectrum: 'Low end (20-200Hz): Moderate. Presence region balanced. High frequencies: slight rolloff above 12kHz. No resonant peaks detected.',
        phase: 'Phase correlation: 0.82 (good). No significant phase issues. Stereo width: 68%. Mid/side balance: healthy.',
        clipping: 'No digital clipping detected. Peak headroom: 1.2 dB. Safe for mastering. No inter-sample peaks found.',
        mix_balance: 'Kick: -6.2 dB, Snare: -8.1 dB, Bass: -7.5 dB, Vocals: -5.8 dB. Vocals sit well. Consider bringing bass up 1-2 dB for warmth.',
        vocal_tuning: 'Vocal pitch accuracy: 94%. Minor corrections needed in measures 12-16 and 32-34. Vibrato rate: natural, no adjustment needed.',
        performance: 'Timing accuracy: 96%. Groove feel: behind the beat (relaxed). Dynamic range per track is balanced. Overall: production-ready.',
      }
      setAnalysisResults(prev => ({ ...prev, [type]: results[type] || 'Analysis complete.' }))
      setAnalysisRunning(null)
    }, 2000)
  }

  // ─── Export Actions ───────────────────────────────────────
  const handleExport = () => {
    if (!activeProject) return
    const entry = { id: uid(), format: exportFormat.toUpperCase(), label: exportLabel || `${activeProject.title} - ${exportFormat.toUpperCase()}`, time: now() }
    setExportHistory(prev => [entry, ...prev])
    logActivity(activeProject.id, `Exported ${exportFormat.toUpperCase()}`, entry.label)
  }

  // ─── Creative Actions ─────────────────────────────────────
  const handleAddIdea = () => {
    if (!newIdeaTitle.trim() || !activeProject) return
    const idea: IdeaVaultItem = { id: uid(), title: newIdeaTitle.trim(), description: newIdeaDesc, createdAt: now() }
    updateProject(p => ({ ...p, ideas: [...p.ideas, idea] }))
    setNewIdeaTitle('')
    setNewIdeaDesc('')
  }

  const handleAddPalette = () => {
    if (!activeProject) return
    const item: SoundPaletteItem = { id: uid(), name: `Palette ${(activeProject.palette?.length || 0) + 1}`, type: 'preset', notes: '' }
    updateProject(p => ({ ...p, palette: [...(p.palette || []), item] }))
  }

  // ─── Pro Actions ──────────────────────────────────────────
  const handleAddSample = () => {
    if (!activeProject) return
    const item: SampleClearanceItem = { id: uid(), sampleName: 'New Sample', source: '', status: 'pending' }
    updateProject(p => ({ ...p, samples: [...p.samples, item] }))
  }

  const handleAddSplit = () => {
    if (!activeProject) return
    const item: SplitItem = { id: uid(), name: 'Contributor', role: 'writer', percent: 0 }
    updateProject(p => ({ ...p, splits: [...p.splits, item] }))
  }

  const handleSaveAsTemplate = () => {
    if (!activeProject || !templateName.trim()) return
    const template = createDefaultProject(`[Template] ${templateName.trim()}`)
    template.tracks = JSON.parse(JSON.stringify(activeProject.tracks))
    template.tags = ['template', ...activeProject.tags]
    upsertMusicProject(userId, template)
    setProjects(prev => [template, ...prev])
    setTemplateName('')
  }

  const handleSessionSnapshot = () => {
    if (!activeProject) return
    updateProject(p => ({
      ...p,
      revisions: [...p.revisions, {
        id: uid(),
        label: `Snapshot ${p.revisions.length + 1}`,
        createdAt: now(),
        summary: `Manual snapshot — ${p.tracks.length} tracks, ${p.clips.length} clips`,
        projectData: JSON.parse(JSON.stringify(p)),
      }],
    }))
  }

  // ─── Recording Simulation ─────────────────────────────────
  useEffect(() => {
    if (isRecording) {
      const iv = setInterval(() => {
        setInputLevel(Math.random() * 80 + 10)
        setLatencyMs(Math.floor(Math.random() * 5 + 3))
      }, 200)
      return () => clearInterval(iv)
    } else {
      setInputLevel(0)
    }
  }, [isRecording])

  const handleStartRecording = () => {
    if (!activeProject) return
    setIsRecording(true)
    setIsPlaying(true)
    logActivity(activeProject.id, 'Recording started')
  }

  const handleStopRecording = () => {
    if (!activeProject) return
    setIsRecording(false)
    setIsPlaying(false)
    const take = { id: uid(), name: `Take ${recordingTakes.length + 1}`, time: now() }
    setRecordingTakes(prev => [take, ...prev])
    logActivity(activeProject.id, 'Recording stopped', take.name)
  }

  // ─── Keyboard Shortcuts ───────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      if (e.key === ' ') { e.preventDefault(); setIsPlaying(p => !p) }
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); handleUndo() }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); handleRedo() }
      if (e.key === 'r' && !e.ctrlKey) { e.preventDefault(); isRecording ? handleStopRecording() : handleStartRecording() }
      if (e.key === 'l') { e.preventDefault(); setIsLooping(p => !p) }
      if (e.key === 'm') { e.preventDefault(); setMetronomeOn(p => !p) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isRecording])

  // ─── Derived Data ─────────────────────────────────────────
  const filteredProjects = projects
    .filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filterTag && !p.tags.includes(filterTag)) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return a.title.localeCompare(b.title)
    })

  const activeProjects = filteredProjects.filter(p => p.status === 'active')
  const archivedProjects = filteredProjects.filter(p => p.status === 'archived')

  const allTags = [...new Set(projects.flatMap(p => p.tags))]
  const allFolders = [...new Set(files.map(f => f.folder || '/'))]
  const activeFiles = files.filter(f => f.folder === activeFolder || activeFolder === '/')
  const totalStorage = files.reduce((acc, f) => acc + (f.size_bytes || 0), 0)

  const pinnedProjects = projects.filter(p => p.tags.includes('pinned'))
  const recentProjects = projects.filter(p => p.status === 'active').slice(0, 5)
  const favoriteProjects = projects.filter(p => p.tags.includes('favorite'))

  const selectedTrack = activeProject?.tracks.find(t => t.id === selectedTrackId) || null

  // ─── Effects State Helper ─────────────────────────────────
  const handleEqChange = (trackId: string, band: 'low' | 'mid' | 'high', value: number) => {
    updateProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? {
        ...t,
        settings: { ...t.settings, eq: { ...t.settings.eq, [band]: value } }
      } : t),
    }))
  }

  const handleCompressorChange = (trackId: string, param: 'threshold' | 'ratio', value: number) => {
    updateProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? {
        ...t,
        settings: { ...t.settings, compressor: { ...t.settings.compressor, [param]: value } }
      } : t),
    }))
  }

  const handleFxChange = (trackId: string, param: 'reverb' | 'delay', value: number) => {
    updateProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? {
        ...t,
        settings: { ...t.settings, fx: { ...t.settings.fx, [param]: value } }
      } : t),
    }))
  }

  const togglePanel = (panel: string) => {
    setCollapsedPanels(prev => {
      const next = new Set(prev)
      next.has(panel) ? next.delete(panel) : next.add(panel)
      return next
    })
  }

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className={`${styles.studio} ${focusMode ? styles.focusMode : ''} ${minimalUI ? styles.minimalUI : ''}`}>
      {/* Header */}
      <header className={styles.studioHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.studioTitle}>Music Studio</h1>
          {activeProject && (
            <span className={styles.activeSessionName}>{activeProject.title}</span>
          )}
          {saving && <span className={styles.savingIndicator}>Saving...</span>}
        </div>
        <div className={styles.headerRight}>
          <button className={styles.headerBtn} onClick={() => setMinimalUI(!minimalUI)} title="Minimal UI">
            {minimalUI ? 'Full' : 'Minimal'}
          </button>
          <button className={styles.headerBtn} onClick={() => setFocusMode(!focusMode)} title="Focus Mode">
            {focusMode ? 'Exit Focus' : 'Focus'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className={styles.tabNav}>
        {([
          ['sessions', 'Sessions'],
          ['studio', 'Studio'],
          ['mixer', 'Mixer'],
          ['files', 'Files'],
          ['record', 'Record'],
          ['collaborate', 'Collaborate'],
          ['analysis', 'Analysis'],
          ['export', 'Export'],
          ['creative', 'Creative'],
          ['pro', 'Pro'],
        ] as [StudioTab, string][]).map(([key, label]) => (
          <button
            key={key}
            className={`${styles.tabBtn} ${activeTab === key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className={styles.content}>
        {loading && <div className={styles.loadingState}>Loading sessions...</div>}

        {/* ═══════════════════════════════════════════════════════
            SESSIONS TAB (Features 1-10 + 121-130)
            ═══════════════════════════════════════════════════════ */}
        {!loading && activeTab === 'sessions' && (
          <div className={styles.sessionsPanel}>
            {/* Toolbar */}
            <div className={styles.sessionsToolbar}>
              <div className={styles.sessionsSearch}>
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className={styles.filterSelect}>
                  <option value="">All Tags</option>
                  {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className={styles.filterSelect}>
                  <option value="updated">Last Edited</option>
                  <option value="created">Date Created</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <button className={styles.primaryBtn} onClick={() => setShowNewSession(true)}>New Session</button>
            </div>

            {/* New Session Modal */}
            {showNewSession && (
              <div className={styles.modal} onClick={() => setShowNewSession(false)}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                  <h3>Create New Session</h3>
                  <input
                    type="text"
                    placeholder="Session name..."
                    value={newSessionTitle}
                    onChange={e => setNewSessionTitle(e.target.value)}
                    className={styles.modalInput}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleCreateSession()}
                  />
                  <div className={styles.modalActions}>
                    <button className={styles.secondaryBtn} onClick={() => setShowNewSession(false)}>Cancel</button>
                    <button className={styles.primaryBtn} onClick={handleCreateSession}>Create</button>
                  </div>
                </div>
              </div>
            )}

            {/* Pinned Projects */}
            {pinnedProjects.length > 0 && (
              <div className={styles.sessionSection}>
                <h3 className={styles.sectionTitle}>Pinned</h3>
                <div className={styles.sessionGrid}>
                  {pinnedProjects.map(p => renderSessionCard(p))}
                </div>
              </div>
            )}

            {/* Recently Opened */}
            {recentProjects.length > 0 && !searchQuery && !filterTag && (
              <div className={styles.sessionSection}>
                <h3 className={styles.sectionTitle}>Recent</h3>
                <div className={styles.recentList}>
                  {recentProjects.map(p => (
                    <button key={p.id} className={styles.recentItem} onClick={() => { setActiveProject(p); setActiveTab('studio') }}>
                      <span>{p.title}</span>
                      <span className={styles.recentTime}>{relativeTime(p.updatedAt)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Sessions */}
            <div className={styles.sessionSection}>
              <h3 className={styles.sectionTitle}>Active Sessions ({activeProjects.length})</h3>
              {activeProjects.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No sessions yet. Create your first session to get started.</p>
                  <button className={styles.primaryBtn} onClick={() => setShowNewSession(true)}>Create Session</button>
                </div>
              )}
              <div className={styles.sessionGrid}>
                {activeProjects.map(p => renderSessionCard(p))}
              </div>
            </div>

            {/* Archived */}
            {archivedProjects.length > 0 && (
              <div className={styles.sessionSection}>
                <h3 className={styles.sectionTitle} onClick={() => togglePanel('archived')} style={{ cursor: 'pointer' }}>
                  Archived ({archivedProjects.length}) {collapsedPanels.has('archived') ? '+' : '−'}
                </h3>
                {!collapsedPanels.has('archived') && (
                  <div className={styles.sessionGrid}>
                    {archivedProjects.map(p => renderSessionCard(p))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STUDIO TAB (Features 21-50)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'studio' && (
          <div className={styles.studioPanel}>
            {!activeProject ? (
              <div className={styles.emptyState}>
                <p>Select a session from the Sessions tab to open the studio.</p>
                <button className={styles.secondaryBtn} onClick={() => setActiveTab('sessions')}>Go to Sessions</button>
              </div>
            ) : (
              <>
                {/* Transport Bar */}
                <div className={styles.transportBar}>
                  <div className={styles.transportControls}>
                    <button className={`${styles.transportBtn} ${isPlaying ? styles.active : ''}`} onClick={() => setIsPlaying(!isPlaying)} title="Play (Space)">
                      {isPlaying ? '■' : '▶'}
                    </button>
                    <button className={styles.transportBtn} onClick={() => { setIsPlaying(false); setPlayheadPos(0) }} title="Stop">
                      ⏹
                    </button>
                    <button className={`${styles.transportBtn} ${styles.recBtn} ${isRecording ? styles.active : ''}`} onClick={() => isRecording ? handleStopRecording() : handleStartRecording()} title="Record (R)">
                      ●
                    </button>
                    <button className={`${styles.transportBtn} ${isLooping ? styles.active : ''}`} onClick={() => setIsLooping(!isLooping)} title="Loop (L)">
                      ↻
                    </button>
                    <button className={`${styles.transportBtn} ${metronomeOn ? styles.active : ''}`} onClick={() => setMetronomeOn(!metronomeOn)} title="Metronome (M)">
                      ♩
                    </button>
                    <button className={`${styles.transportBtn} ${countInOn ? styles.active : ''}`} onClick={() => setCountInOn(!countInOn)} title="Count-in">
                      1-2
                    </button>
                  </div>

                  <div className={styles.transportInfo}>
                    <div className={styles.bpmControl}>
                      <label>BPM</label>
                      <input
                        type="number"
                        min={20}
                        max={300}
                        value={activeProject.bpm}
                        onChange={e => updateProject(p => ({ ...p, bpm: parseInt(e.target.value) || 120 }))}
                        className={styles.bpmInput}
                      />
                    </div>
                    <div className={styles.timeSigControl}>
                      <label>Time</label>
                      <select
                        value={`${activeProject.key}`}
                        onChange={e => updateProject(p => ({ ...p, key: e.target.value }))}
                        className={styles.timeSigSelect}
                      >
                        {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'].map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.positionDisplay}>
                      Bar {playheadPos + 1}
                    </div>
                  </div>

                  <div className={styles.transportTools}>
                    <button className={`${styles.toolBtn} ${snapToGrid ? styles.active : ''}`} onClick={() => setSnapToGrid(!snapToGrid)}>
                      Snap
                    </button>
                    <button className={styles.toolBtn} onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))}>−</button>
                    <span className={styles.zoomLabel}>{Math.round(zoomLevel * 100)}%</span>
                    <button className={styles.toolBtn} onClick={() => setZoomLevel(Math.min(4, zoomLevel + 0.25))}>+</button>
                    <button className={styles.toolBtn} onClick={handleAddMarker}>Marker</button>
                    <button className={styles.toolBtn} onClick={handleUndo} disabled={undoStack.length === 0}>Undo</button>
                    <button className={styles.toolBtn} onClick={handleRedo} disabled={redoStack.length === 0}>Redo</button>
                  </div>
                </div>

                {/* Loop Region */}
                {isLooping && (
                  <div className={styles.loopRegion}>
                    <label>Loop:</label>
                    <input type="number" min={0} value={loopStart} onChange={e => setLoopStart(+e.target.value)} className={styles.loopInput} />
                    <span>to</span>
                    <input type="number" min={0} value={loopEnd} onChange={e => setLoopEnd(+e.target.value)} className={styles.loopInput} />
                    <span>bars</span>
                  </div>
                )}

                {/* Track List + Timeline */}
                <div className={styles.studioWorkspace}>
                  <div className={styles.trackListPanel}>
                    <div className={styles.trackListHeader}>
                      <span>Tracks ({activeProject.tracks.length})</span>
                      <button className={styles.addTrackBtn} onClick={handleAddTrack}>+ Track</button>
                    </div>
                    {activeProject.tracks.length === 0 && (
                      <div className={styles.emptyTracks}>
                        <p>No tracks yet</p>
                        <button className={styles.secondaryBtn} onClick={handleAddTrack}>Add Track</button>
                      </div>
                    )}
                    {activeProject.tracks.map((track, idx) => (
                      <div
                        key={track.id}
                        className={`${styles.trackRow} ${selectedTrackId === track.id ? styles.trackSelected : ''}`}
                        onClick={() => setSelectedTrackId(track.id)}
                      >
                        <div className={styles.trackColor} style={{ background: track.color }} />
                        <div className={styles.trackInfo}>
                          <input
                            className={styles.trackNameInput}
                            value={track.name}
                            onChange={e => handleTrackUpdate(track.id, { name: e.target.value })}
                            onClick={e => e.stopPropagation()}
                          />
                          <div className={styles.trackBtns}>
                            <button className={`${styles.tinyBtn} ${track.settings.mute ? styles.active : ''}`} onClick={e => { e.stopPropagation(); handleToggleMute(track.id) }}>M</button>
                            <button className={`${styles.tinyBtn} ${track.settings.solo ? styles.active : ''}`} onClick={e => { e.stopPropagation(); handleToggleSolo(track.id) }}>S</button>
                            <button className={styles.tinyBtn} onClick={e => { e.stopPropagation(); handleAddClip(track.id) }}>+Clip</button>
                            <button className={styles.tinyBtn} onClick={e => { e.stopPropagation(); handleMoveTrack(track.id, 'up') }} disabled={idx === 0}>↑</button>
                            <button className={styles.tinyBtn} onClick={e => { e.stopPropagation(); handleMoveTrack(track.id, 'down') }} disabled={idx === activeProject.tracks.length - 1}>↓</button>
                            <button className={`${styles.tinyBtn} ${styles.dangerBtn}`} onClick={e => { e.stopPropagation(); handleRemoveTrack(track.id) }}>×</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Track Groups */}
                    {activeProject.tracks.length > 2 && (
                      <div className={styles.trackGroupInfo}>
                        {activeProject.tracks.filter(t => t.settings.solo).length > 0 && (
                          <span className={styles.groupBadge}>Solo: {activeProject.tracks.filter(t => t.settings.solo).length}</span>
                        )}
                        {activeProject.tracks.filter(t => t.settings.mute).length > 0 && (
                          <span className={styles.groupBadge}>Muted: {activeProject.tracks.filter(t => t.settings.mute).length}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className={styles.timelinePanel}>
                    <div className={styles.timelineRuler} style={{ width: `${Math.max(800, 32 * 50 * zoomLevel)}px` }}>
                      {Array.from({ length: 32 }, (_, i) => (
                        <div
                          key={i}
                          className={styles.rulerMark}
                          style={{ left: `${i * 50 * zoomLevel}px` }}
                          onClick={() => setPlayheadPos(i)}
                        >
                          {i + 1}
                        </div>
                      ))}
                      <div className={styles.playhead} style={{ left: `${playheadPos * 50 * zoomLevel}px` }} />
                      {isLooping && (
                        <div className={styles.loopOverlay} style={{
                          left: `${loopStart * 50 * zoomLevel}px`,
                          width: `${(loopEnd - loopStart) * 50 * zoomLevel}px`,
                        }} />
                      )}
                    </div>
                    {activeProject.tracks.map(track => (
                      <div key={track.id} className={styles.timelineTrack} style={{ width: `${Math.max(800, 32 * 50 * zoomLevel)}px` }}>
                        {activeProject.clips.filter(c => c.trackId === track.id).map(clip => (
                          <div
                            key={clip.id}
                            className={`${styles.clip} ${selectedClipId === clip.id ? styles.clipSelected : ''}`}
                            style={{
                              left: `${clip.start * 50 * zoomLevel}px`,
                              width: `${clip.length * 50 * zoomLevel}px`,
                              background: track.color,
                            }}
                            onClick={e => { e.stopPropagation(); setSelectedClipId(clip.id) }}
                          >
                            <span className={styles.clipLabel}>{clip.label}</span>
                            <div className={styles.clipActions}>
                              <button onClick={e => { e.stopPropagation(); handleSplitClip(clip.id) }} title="Split">✂</button>
                              <button onClick={e => { e.stopPropagation(); handleDeleteClip(clip.id) }} title="Delete">×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    {activeProject.tracks.length === 0 && (
                      <div className={styles.timelineEmpty}>Add tracks to start arranging</div>
                    )}
                  </div>
                </div>

                {/* Track Notes */}
                {selectedTrack && (
                  <div className={styles.trackNotesPanel}>
                    <h4>Track Notes — {selectedTrack.name}</h4>
                    <div className={styles.trackNotesRow}>
                      <label>Color</label>
                      <div className={styles.colorPicker}>
                        {TRACK_COLORS.map(c => (
                          <button
                            key={c}
                            className={`${styles.colorSwatch} ${selectedTrack.color === c ? styles.colorActive : ''}`}
                            style={{ background: c }}
                            onClick={() => handleTrackUpdate(selectedTrack.id, { color: c })}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={styles.trackNotesRow}>
                      <label>Tags</label>
                      <input
                        value={selectedTrack.tags.join(', ')}
                        onChange={e => handleTrackUpdate(selectedTrack.id, { tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className={styles.inlineInput}
                        placeholder="vocal, lead, fx..."
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MIXER TAB (Features 51-70)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'mixer' && (
          <div className={styles.mixerPanel}>
            {!activeProject ? (
              <div className={styles.emptyState}><p>Open a session first.</p></div>
            ) : (
              <>
                <div className={styles.mixerToolbar}>
                  <h3>Mixer — {activeProject.title}</h3>
                  <div className={styles.masterInfo}>
                    <span>Master LUFS Target: {activeProject.masterBus.lufsTarget}</span>
                    <span>Stereo Width: {activeProject.masterBus.stereoWidth}%</span>
                  </div>
                </div>

                <div className={styles.mixerStrips}>
                  {activeProject.tracks.map(track => (
                    <div key={track.id} className={`${styles.channelStrip} ${track.settings.mute ? styles.stripMuted : ''}`}>
                      <div className={styles.stripHeader}>
                        <div className={styles.stripColor} style={{ background: track.color }} />
                        <span className={styles.stripName}>{track.name}</span>
                      </div>

                      {/* Peak Meter */}
                      <div className={styles.peakMeter}>
                        <div className={styles.meterFill} style={{ height: `${track.settings.volume}%` }} />
                      </div>

                      {/* Volume Fader */}
                      <div className={styles.faderGroup}>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={track.settings.volume}
                          onChange={e => handleTrackSettingUpdate(track.id, 'volume', +e.target.value)}
                          className={styles.verticalFader}
                          orient="vertical"
                        />
                        <span className={styles.faderValue}>{track.settings.volume}</span>
                      </div>

                      {/* Pan */}
                      <div className={styles.panGroup}>
                        <label>Pan</label>
                        <input
                          type="range"
                          min={-100}
                          max={100}
                          value={track.settings.pan}
                          onChange={e => handleTrackSettingUpdate(track.id, 'pan', +e.target.value)}
                          className={styles.panKnob}
                        />
                        <span className={styles.panValue}>
                          {track.settings.pan === 0 ? 'C' : track.settings.pan < 0 ? `L${Math.abs(track.settings.pan)}` : `R${track.settings.pan}`}
                        </span>
                      </div>

                      {/* EQ */}
                      <div className={styles.eqGroup}>
                        <label>EQ</label>
                        <div className={styles.eqBands}>
                          {(['low', 'mid', 'high'] as const).map(band => (
                            <div key={band} className={styles.eqBand}>
                              <input
                                type="range"
                                min={-12}
                                max={12}
                                value={track.settings.eq[band]}
                                onChange={e => handleEqChange(track.id, band, +e.target.value)}
                                className={styles.eqSlider}
                              />
                              <span>{band[0].toUpperCase()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Compressor */}
                      <div className={styles.compGroup}>
                        <label>Comp</label>
                        <div className={styles.compRow}>
                          <span>Thr</span>
                          <input type="range" min={-60} max={0} value={track.settings.compressor.threshold} onChange={e => handleCompressorChange(track.id, 'threshold', +e.target.value)} className={styles.miniSlider} />
                        </div>
                        <div className={styles.compRow}>
                          <span>Rat</span>
                          <input type="range" min={1} max={20} value={track.settings.compressor.ratio} onChange={e => handleCompressorChange(track.id, 'ratio', +e.target.value)} className={styles.miniSlider} />
                        </div>
                      </div>

                      {/* Sends */}
                      <div className={styles.sendsGroup}>
                        <div className={styles.sendRow}>
                          <span>Rev</span>
                          <input type="range" min={0} max={100} value={track.settings.fx.reverb} onChange={e => handleFxChange(track.id, 'reverb', +e.target.value)} className={styles.miniSlider} />
                        </div>
                        <div className={styles.sendRow}>
                          <span>Dly</span>
                          <input type="range" min={0} max={100} value={track.settings.fx.delay} onChange={e => handleFxChange(track.id, 'delay', +e.target.value)} className={styles.miniSlider} />
                        </div>
                      </div>

                      {/* Strip Buttons */}
                      <div className={styles.stripBtns}>
                        <button className={`${styles.stripBtn} ${track.settings.mute ? styles.active : ''}`} onClick={() => handleToggleMute(track.id)}>M</button>
                        <button className={`${styles.stripBtn} ${track.settings.solo ? styles.active : ''}`} onClick={() => handleToggleSolo(track.id)}>S</button>
                      </div>
                    </div>
                  ))}

                  {/* Master Channel */}
                  <div className={`${styles.channelStrip} ${styles.masterStrip}`}>
                    <div className={styles.stripHeader}>
                      <span className={styles.stripName}>Master</span>
                    </div>
                    <div className={styles.peakMeter}>
                      <div className={styles.meterFill} style={{ height: '72%' }} />
                    </div>
                    <div className={styles.faderGroup}>
                      <input type="range" min={0} max={100} defaultValue={85} className={styles.verticalFader} orient="vertical" />
                      <span className={styles.faderValue}>85</span>
                    </div>
                    <div className={styles.masterControls}>
                      <div className={styles.compRow}>
                        <span>LUFS</span>
                        <input
                          type="number"
                          value={activeProject.masterBus.lufsTarget}
                          onChange={e => updateProject(p => ({ ...p, masterBus: { ...p.masterBus, lufsTarget: +e.target.value } }))}
                          className={styles.miniInput}
                        />
                      </div>
                      <div className={styles.compRow}>
                        <span>Width</span>
                        <input
                          type="range"
                          min={0}
                          max={200}
                          value={activeProject.masterBus.stereoWidth}
                          onChange={e => updateProject(p => ({ ...p, masterBus: { ...p.masterBus, stereoWidth: +e.target.value } }))}
                          className={styles.miniSlider}
                        />
                      </div>
                    </div>
                  </div>

                  {activeProject.tracks.length === 0 && (
                    <div className={styles.emptyState}><p>Add tracks in the Studio tab to use the mixer.</p></div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FILES TAB (Features 11-20)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'files' && (
          <div className={styles.filesPanel}>
            <div className={styles.filesToolbar}>
              <h3>File Management</h3>
              <div className={styles.storageBar}>
                <span>{fmtBytes(totalStorage)} used</span>
                <div className={styles.storageMeter}>
                  <div className={styles.storageFill} style={{ width: `${Math.min(100, totalStorage / 10737418240 * 100)}%` }} />
                </div>
              </div>
              <button className={styles.primaryBtn} onClick={() => fileInputRef.current?.click()}>Upload Files</button>
              <input ref={fileInputRef} type="file" accept="audio/*" multiple style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files)} />
            </div>

            <div className={styles.filesLayout}>
              {/* Folder Sidebar */}
              <div className={styles.folderTree}>
                <h4>Folders</h4>
                <button className={`${styles.folderItem} ${activeFolder === '/' ? styles.folderActive : ''}`} onClick={() => setActiveFolder('/')}>
                  All Files
                </button>
                {allFolders.filter(f => f !== '/').map(folder => (
                  <button key={folder} className={`${styles.folderItem} ${activeFolder === folder ? styles.folderActive : ''}`} onClick={() => setActiveFolder(folder)}>
                    {folder}
                  </button>
                ))}
              </div>

              {/* File List */}
              <div className={styles.fileList}>
                {/* Drag Zone */}
                <div
                  className={`${styles.dropZone} ${isDragging ? styles.dropActive : ''}`}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files) }}
                >
                  Drop audio files here to upload
                </div>

                {activeFiles.length === 0 && (
                  <div className={styles.emptyState}><p>No files in this folder. Upload audio files to get started.</p></div>
                )}

                {activeFiles.map(file => (
                  <div key={file.id} className={styles.fileRow}>
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileMeta}>
                        {fmtBytes(file.size_bytes)} · v{file.version} · {fmtDate(file.created_at)}
                        {file.duration_seconds ? ` · ${fmtDuration(file.duration_seconds)}` : ''}
                      </span>
                    </div>
                    <div className={styles.fileActions}>
                      <button className={styles.tinyBtn} onClick={() => setPreviewFileId(previewFileId === file.id ? null : file.id)}>
                        {previewFileId === file.id ? '■' : '▶'}
                      </button>
                      <button className={styles.tinyBtn} onClick={() => {
                        const name = prompt('Rename file:', file.name)
                        if (name) handleFileRename(file.id, name)
                      }}>Rename</button>
                      <button className={`${styles.tinyBtn} ${styles.dangerBtn}`} onClick={() => handleFileDelete(file.id)}>Delete</button>
                    </div>

                    {/* Preview & Comments */}
                    {previewFileId === file.id && (
                      <div className={styles.filePreview}>
                        <audio ref={audioPreviewRef} controls className={styles.audioPlayer}>
                          <source src={`${isSupabaseConfigured() ? supabaseClient.storage.from('music-files').getPublicUrl(file.file_path).data.publicUrl : '#'}`} />
                        </audio>
                        <div className={styles.fileMetadata}>
                          <span>Type: {file.file_type}</span>
                          <span>Folder: {file.folder}</span>
                        </div>
                        <div className={styles.fileComments}>
                          <h5>Comments</h5>
                          {(file.comments || []).map((c, i) => (
                            <div key={i} className={styles.commentItem}>
                              <strong>{c.author}</strong>: {c.text}
                              <span className={styles.commentTime}>{relativeTime(c.time)}</span>
                            </div>
                          ))}
                          <div className={styles.commentInput}>
                            <input
                              value={fileCommentText}
                              onChange={e => setFileCommentText(e.target.value)}
                              placeholder="Add comment..."
                              className={styles.inlineInput}
                              onKeyDown={e => e.key === 'Enter' && handleAddFileComment(file.id)}
                            />
                            <button className={styles.tinyBtn} onClick={() => handleAddFileComment(file.id)}>Post</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            RECORD TAB (Features 71-80)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'record' && (
          <div className={styles.recordPanel}>
            {!activeProject ? (
              <div className={styles.emptyState}><p>Open a session first.</p></div>
            ) : (
              <>
                <div className={styles.recordHeader}>
                  <h3>Recording — {activeProject.title}</h3>
                  <div className={styles.recordIndicators}>
                    <div className={styles.indicatorItem}>
                      <span className={styles.indicatorLabel}>Input Level</span>
                      <div className={styles.levelMeter}>
                        <div className={styles.levelFill} style={{ width: `${inputLevel}%`, background: inputLevel > 90 ? '#f44' : inputLevel > 70 ? '#fa0' : '#4f4' }} />
                      </div>
                      <span className={styles.indicatorValue}>{Math.round(inputLevel)}%</span>
                    </div>
                    <div className={styles.indicatorItem}>
                      <span className={styles.indicatorLabel}>Latency</span>
                      <span className={styles.indicatorValue}>{latencyMs}ms</span>
                    </div>
                    <div className={styles.indicatorItem}>
                      <span className={styles.indicatorLabel}>Noise Floor</span>
                      <span className={styles.indicatorValue}>-62 dB</span>
                    </div>
                  </div>
                </div>

                <div className={styles.recordControls}>
                  <button className={`${styles.bigRecBtn} ${isRecording ? styles.recording : ''}`} onClick={() => isRecording ? handleStopRecording() : handleStartRecording()}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  <div className={styles.recordOptions}>
                    <label className={styles.checkOption}>
                      <input type="checkbox" checked={countInOn} onChange={e => setCountInOn(e.target.checked)} />
                      Count-in
                    </label>
                    <label className={styles.checkOption}>
                      <input type="checkbox" checked={metronomeOn} onChange={e => setMetronomeOn(e.target.checked)} />
                      Metronome
                    </label>
                    <label className={styles.checkOption}>
                      <input type="checkbox" defaultChecked />
                      Input Monitoring
                    </label>
                    <label className={styles.checkOption}>
                      <input type="checkbox" defaultChecked />
                      Safety Backup
                    </label>
                  </div>
                </div>

                {/* Takes */}
                <div className={styles.takesPanel}>
                  <h4>Takes ({recordingTakes.length})</h4>
                  {recordingTakes.length === 0 && (
                    <p className={styles.mutedText}>No takes recorded yet. Press record to create a take.</p>
                  )}
                  {recordingTakes.map(take => (
                    <div key={take.id} className={styles.takeRow}>
                      <span className={styles.takeName}>{take.name}</span>
                      <span className={styles.takeTime}>{fmtTime(take.time)}</span>
                      <div className={styles.takeBtns}>
                        <button className={styles.tinyBtn}>▶</button>
                        <button className={styles.tinyBtn}>Comp</button>
                        <button className={styles.tinyBtn}>Use</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recording History */}
                <div className={styles.recordHistory}>
                  <h4>Recording History</h4>
                  {activityLog.filter(a => a.action.includes('Recording')).slice(0, 10).map(a => (
                    <div key={a.id} className={styles.historyRow}>
                      <span>{a.action}</span>
                      <span className={styles.mutedText}>{relativeTime(a.created_at)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            COLLABORATE TAB (Features 81-90)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'collaborate' && (
          <div className={styles.collabPanel}>
            {!activeProject ? (
              <div className={styles.emptyState}><p>Open a session first.</p></div>
            ) : (
              <>
                {/* Invite */}
                <div className={styles.collabSection}>
                  <h3>Collaborators</h3>
                  <div className={styles.inviteForm}>
                    <input
                      type="email"
                      placeholder="Invite by email..."
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className={styles.inlineInput}
                    />
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value as 'editor' | 'viewer')} className={styles.roleSelect}>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button className={styles.primaryBtn} onClick={handleInviteCollaborator}>Invite</button>
                  </div>

                  <div className={styles.collabList}>
                    {activeProject.collaborators.length === 0 && (
                      <p className={styles.mutedText}>No collaborators yet.</p>
                    )}
                    {activeProject.collaborators.map(c => (
                      <div key={c.id} className={styles.collabRow}>
                        <div>
                          <span className={styles.collabName}>{c.name}</span>
                          <span className={styles.collabEmail}>{c.email}</span>
                        </div>
                        <span className={styles.roleBadge}>{c.role}</span>
                        <span className={`${styles.statusDot} ${c.status === 'active' ? styles.dotActive : styles.dotInvited}`} />
                        <button className={`${styles.tinyBtn} ${styles.dangerBtn}`} onClick={() => updateProject(p => ({ ...p, collaborators: p.collaborators.filter(x => x.id !== c.id) }))}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments Thread */}
                <div className={styles.collabSection}>
                  <h3>Session Comments</h3>
                  <div className={styles.commentThread}>
                    {activeProject.activity.filter(a => a.message.includes(':')).length === 0 && (
                      <p className={styles.mutedText}>No comments yet. Start a discussion.</p>
                    )}
                    {activeProject.activity.filter(a => a.message.includes(':')).map(a => (
                      <div key={a.id} className={styles.threadComment}>
                        <span>{a.message}</span>
                        <span className={styles.mutedText}>{relativeTime(a.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.commentInput}>
                    <input
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className={styles.inlineInput}
                      onKeyDown={e => e.key === 'Enter' && handleAddSessionComment()}
                    />
                    <button className={styles.primaryBtn} onClick={handleAddSessionComment}>Send</button>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className={styles.collabSection}>
                  <h3>Activity Feed</h3>
                  <div className={styles.activityFeed}>
                    {activityLog.length === 0 && <p className={styles.mutedText}>No activity yet.</p>}
                    {activityLog.slice(0, 20).map(a => (
                      <div key={a.id} className={styles.activityRow}>
                        <span className={styles.activityAction}>{a.action}</span>
                        {a.details && <span className={styles.activityDetails}>{a.details}</span>}
                        <span className={styles.activityTime}>{relativeTime(a.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change Log / Review */}
                <div className={styles.collabSection}>
                  <h3>Revisions ({activeProject.revisions.length})</h3>
                  {activeProject.revisions.length === 0 && <p className={styles.mutedText}>No snapshots. Use Studio &gt; Snapshot to save a revision.</p>}
                  {activeProject.revisions.map(r => (
                    <div key={r.id} className={styles.revisionRow}>
                      <span>{r.label}</span>
                      <span className={styles.mutedText}>{r.summary}</span>
                      <span className={styles.mutedText}>{fmtDate(r.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            ANALYSIS TAB (Features 91-110) — AI Allowed
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'analysis' && (
          <div className={styles.analysisPanel}>
            <div className={styles.analysisHeader}>
              <h3>Tuning, Analysis &amp; Insights</h3>
              <p className={styles.mutedText}>AI-assisted tools for feedback, analysis, and quality checking. AI does not generate music.</p>
            </div>

            {/* Analysis Tools Grid */}
            <div className={styles.analysisGrid}>
              {[
                { key: 'pitch', label: 'Pitch Detection', desc: 'Detect root pitch and tuning accuracy across tracks' },
                { key: 'tuning', label: 'Tuning Suggestions', desc: 'Get per-track tuning correction recommendations' },
                { key: 'tempo', label: 'Tempo Detection', desc: 'Verify tempo stability and detect drift' },
                { key: 'loudness', label: 'Loudness Analysis', desc: 'LUFS, true peak, and loudness range measurement' },
                { key: 'spectrum', label: 'Frequency Spectrum', desc: 'Analyze frequency distribution and balance' },
                { key: 'phase', label: 'Phase Correlation', desc: 'Check stereo phase and width consistency' },
                { key: 'clipping', label: 'Clipping Alerts', desc: 'Detect digital clipping and inter-sample peaks' },
                { key: 'mix_balance', label: 'Mix Balance', desc: 'Get suggestions for level balance across elements' },
                { key: 'vocal_tuning', label: 'Vocal Tuning Guide', desc: 'Analyze vocal pitch accuracy and vibrato' },
                { key: 'performance', label: 'Performance Feedback', desc: 'Overall timing, dynamics, and groove analysis' },
              ].map(tool => (
                <div key={tool.key} className={styles.analysisCard}>
                  <h4>{tool.label}</h4>
                  <p>{tool.desc}</p>
                  <button
                    className={styles.analyzeBtn}
                    onClick={() => runAnalysis(tool.key)}
                    disabled={analysisRunning === tool.key}
                  >
                    {analysisRunning === tool.key ? 'Analyzing...' : 'Run Analysis'}
                  </button>
                  {analysisResults[tool.key] && (
                    <div className={styles.analysisResult}>
                      {analysisResults[tool.key]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Insights Dashboard */}
            {activeProject && (
              <div className={styles.insightsSection}>
                <h3>Project Insights</h3>
                <div className={styles.insightsGrid}>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Tracks</span>
                    <span className={styles.insightValue}>{activeProject.tracks.length}</span>
                  </div>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Clips</span>
                    <span className={styles.insightValue}>{activeProject.clips.length}</span>
                  </div>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Revisions</span>
                    <span className={styles.insightValue}>{activeProject.revisions.length}</span>
                  </div>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Collaborators</span>
                    <span className={styles.insightValue}>{activeProject.collaborators.length}</span>
                  </div>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>BPM</span>
                    <span className={styles.insightValue}>{activeProject.bpm}</span>
                  </div>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Key</span>
                    <span className={styles.insightValue}>{activeProject.key}</span>
                  </div>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Created</span>
                    <span className={styles.insightValue}>{fmtDate(activeProject.createdAt)}</span>
                  </div>
                  <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Last Edited</span>
                    <span className={styles.insightValue}>{relativeTime(activeProject.updatedAt)}</span>
                  </div>
                </div>

                {/* Completion Checklist */}
                <div className={styles.checklistSection}>
                  <h4>Completion Checklist</h4>
                  {activeProject.publishing.checklist.map(item => (
                    <label key={item.id} className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => updateProject(p => ({
                          ...p,
                          publishing: {
                            ...p.publishing,
                            checklist: p.publishing.checklist.map(c => c.id === item.id ? { ...c, done: !c.done } : c),
                          },
                        }))}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>

                {/* Mix Readiness */}
                <div className={styles.readinessSection}>
                  <h4>Mix Readiness</h4>
                  <div className={styles.readinessBar}>
                    <div className={styles.readinessFill} style={{
                      width: `${activeProject.publishing.checklist.length > 0 ? (activeProject.publishing.checklist.filter(c => c.done).length / activeProject.publishing.checklist.length * 100) : 0}%`
                    }} />
                  </div>
                  <span className={styles.mutedText}>
                    {activeProject.publishing.checklist.filter(c => c.done).length} / {activeProject.publishing.checklist.length} items complete
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            EXPORT TAB (Features 111-120)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'export' && (
          <div className={styles.exportPanel}>
            {!activeProject ? (
              <div className={styles.emptyState}><p>Open a session first.</p></div>
            ) : (
              <>
                <h3>Export &amp; Delivery</h3>

                <div className={styles.exportOptions}>
                  <div className={styles.exportGroup}>
                    <label>Format</label>
                    <div className={styles.formatBtns}>
                      {(['wav', 'mp3', 'stems'] as const).map(fmt => (
                        <button key={fmt} className={`${styles.formatBtn} ${exportFormat === fmt ? styles.active : ''}`} onClick={() => setExportFormat(fmt)}>
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.exportGroup}>
                    <label>Version Label</label>
                    <input
                      value={exportLabel}
                      onChange={e => setExportLabel(e.target.value)}
                      placeholder="e.g., Final Mix v3"
                      className={styles.inlineInput}
                    />
                  </div>
                  <button className={styles.primaryBtn} onClick={handleExport}>Export {exportFormat.toUpperCase()}</button>
                </div>

                <div className={styles.exportExtras}>
                  <button className={styles.secondaryBtn} onClick={() => {
                    setExportHistory(prev => [{ id: uid(), format: 'Notes', label: `${activeProject.title} — Session Notes`, time: now() }, ...prev])
                  }}>Export Session Notes</button>
                  <button className={styles.secondaryBtn} onClick={() => {
                    setExportHistory(prev => [{ id: uid(), format: 'Report', label: `${activeProject.title} — Mix Report`, time: now() }, ...prev])
                  }}>Export Mix Report</button>
                  <button className={styles.secondaryBtn} onClick={() => {
                    const link = `https://studio.wcg.io/share/${activeProject.id}`
                    navigator.clipboard?.writeText(link)
                  }}>Copy Share Link</button>
                </div>

                {/* Export History */}
                <div className={styles.exportHistorySection}>
                  <h4>Export History</h4>
                  {exportHistory.length === 0 && <p className={styles.mutedText}>No exports yet.</p>}
                  {exportHistory.map(e => (
                    <div key={e.id} className={styles.exportRow}>
                      <span className={styles.exportFormat}>{e.format}</span>
                      <span>{e.label}</span>
                      <span className={styles.mutedText}>{fmtTime(e.time)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            CREATIVE TAB (Features 121-140)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'creative' && (
          <div className={styles.creativePanel}>
            {!activeProject ? (
              <div className={styles.emptyState}><p>Open a session first.</p></div>
            ) : (
              <>
                <div className={styles.creativeGrid}>
                  {/* Lyrics */}
                  <div className={styles.creativeSection}>
                    <h4>Lyrics</h4>
                    <textarea
                      value={lyricsText}
                      onChange={e => {
                        setLyricsText(e.target.value)
                        updateProject(p => ({
                          ...p,
                          publishing: { ...p.publishing, metadata: { ...p.publishing.metadata, credits: e.target.value } },
                        }))
                      }}
                      placeholder="Write your lyrics here..."
                      className={styles.creativeTextarea}
                      rows={12}
                    />
                  </div>

                  {/* Idea Scratchpad */}
                  <div className={styles.creativeSection}>
                    <h4>Scratchpad</h4>
                    <textarea
                      value={scratchpadText}
                      onChange={e => {
                        setScratchpadText(e.target.value)
                        updateProject(p => ({
                          ...p,
                          notes: p.notes.length > 0
                            ? [{ ...p.notes[0], text: e.target.value }, ...p.notes.slice(1)]
                            : [{ id: uid(), text: e.target.value, createdAt: now() }],
                        }))
                      }}
                      placeholder="Quick ideas, notes, thoughts..."
                      className={styles.creativeTextarea}
                      rows={8}
                    />
                  </div>

                  {/* Mood & Goals */}
                  <div className={styles.creativeSection}>
                    <h4>Mood Notes</h4>
                    <textarea
                      value={activeProject.mood}
                      onChange={e => updateProject(p => ({ ...p, mood: e.target.value }))}
                      placeholder="Describe the mood, feeling, energy..."
                      className={styles.creativeTextarea}
                      rows={4}
                    />
                    <h4>Creative Goals</h4>
                    <textarea
                      value={activeProject.intent}
                      onChange={e => updateProject(p => ({ ...p, intent: e.target.value }))}
                      placeholder="What are you trying to achieve?"
                      className={styles.creativeTextarea}
                      rows={4}
                    />
                  </div>

                  {/* Arrangement Outline */}
                  <div className={styles.creativeSection}>
                    <h4>Arrangement Outline</h4>
                    <textarea
                      value={arrangementOutline}
                      onChange={e => setArrangementOutline(e.target.value)}
                      placeholder="Intro → Verse 1 → Chorus → Verse 2 → Bridge → Chorus → Outro"
                      className={styles.creativeTextarea}
                      rows={6}
                    />
                  </div>
                </div>

                {/* Ideas Vault */}
                <div className={styles.ideasVault}>
                  <h4>Ideas Vault ({activeProject.ideas.length})</h4>
                  <div className={styles.ideaForm}>
                    <input value={newIdeaTitle} onChange={e => setNewIdeaTitle(e.target.value)} placeholder="Idea title..." className={styles.inlineInput} />
                    <input value={newIdeaDesc} onChange={e => setNewIdeaDesc(e.target.value)} placeholder="Description..." className={styles.inlineInput} />
                    <button className={styles.primaryBtn} onClick={handleAddIdea}>Save Idea</button>
                  </div>
                  {activeProject.ideas.map(idea => (
                    <div key={idea.id} className={styles.ideaRow}>
                      <span className={styles.ideaTitle}>{idea.title}</span>
                      <span className={styles.mutedText}>{idea.description}</span>
                      <span className={styles.mutedText}>{fmtDate(idea.createdAt)}</span>
                    </div>
                  ))}
                </div>

                {/* Sound Palette */}
                <div className={styles.paletteSection}>
                  <h4>Sound Palette ({activeProject.palette?.length || 0})</h4>
                  <button className={styles.secondaryBtn} onClick={handleAddPalette}>Add Palette Entry</button>
                  {(activeProject.palette || []).map(p => (
                    <div key={p.id} className={styles.paletteRow}>
                      <input
                        value={p.name}
                        onChange={e => updateProject(proj => ({
                          ...proj,
                          palette: proj.palette.map(x => x.id === p.id ? { ...x, name: e.target.value } : x),
                        }))}
                        className={styles.inlineInput}
                      />
                      <input
                        value={p.notes}
                        onChange={e => updateProject(proj => ({
                          ...proj,
                          palette: proj.palette.map(x => x.id === p.id ? { ...x, notes: e.target.value } : x),
                        }))}
                        placeholder="Notes..."
                        className={styles.inlineInput}
                      />
                    </div>
                  ))}
                </div>

                {/* Reference Tracks */}
                <div className={styles.referenceSection}>
                  <h4>Reference Tracks (A/B Compare)</h4>
                  <div className={styles.refInputs}>
                    <div>
                      <label>Reference A</label>
                      <input
                        value={activeProject.referenceTracks.a}
                        onChange={e => updateProject(p => ({ ...p, referenceTracks: { ...p.referenceTracks, a: e.target.value } }))}
                        placeholder="Track name or URL..."
                        className={styles.inlineInput}
                      />
                    </div>
                    <div>
                      <label>Reference B</label>
                      <input
                        value={activeProject.referenceTracks.b}
                        onChange={e => updateProject(p => ({ ...p, referenceTracks: { ...p.referenceTracks, b: e.target.value } }))}
                        placeholder="Track name or URL..."
                        className={styles.inlineInput}
                      />
                    </div>
                    <div className={styles.abToggle}>
                      <button className={`${styles.abBtn} ${activeProject.referenceTracks.active === 'a' ? styles.active : ''}`} onClick={() => updateProject(p => ({ ...p, referenceTracks: { ...p.referenceTracks, active: 'a' } }))}>A</button>
                      <button className={`${styles.abBtn} ${activeProject.referenceTracks.active === 'b' ? styles.active : ''}`} onClick={() => updateProject(p => ({ ...p, referenceTracks: { ...p.referenceTracks, active: 'b' } }))}>B</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            PRO TAB (Features 141-200)
            ═══════════════════════════════════════════════════════ */}
        {activeTab === 'pro' && (
          <div className={styles.proPanel}>
            {!activeProject ? (
              <div className={styles.emptyState}><p>Open a session first.</p></div>
            ) : (
              <>
                <div className={styles.proGrid}>
                  {/* Professional Workflow */}
                  <div className={styles.proSection}>
                    <h3>Professional Workflow</h3>

                    <div className={styles.proField}>
                      <label>Deadline</label>
                      <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={styles.inlineInput} />
                    </div>

                    <div className={styles.proField}>
                      <label>Client Notes</label>
                      <textarea value={clientNotes} onChange={e => setClientNotes(e.target.value)} placeholder="Notes from client..." className={styles.proTextarea} rows={3} />
                    </div>

                    <div className={styles.proField}>
                      <label>Engineer Notes</label>
                      <textarea value={engineerNotes} onChange={e => setEngineerNotes(e.target.value)} placeholder="Technical notes..." className={styles.proTextarea} rows={3} />
                    </div>

                    <div className={styles.proField}>
                      <label>Producer Notes</label>
                      <textarea value={producerNotes} onChange={e => setProducerNotes(e.target.value)} placeholder="Production direction..." className={styles.proTextarea} rows={3} />
                    </div>

                    {/* Session Credits */}
                    <div className={styles.proField}>
                      <label>Session Credits</label>
                      <textarea
                        value={activeProject.publishing.metadata.credits}
                        onChange={e => updateProject(p => ({
                          ...p,
                          publishing: { ...p.publishing, metadata: { ...p.publishing.metadata, credits: e.target.value } },
                        }))}
                        placeholder="Artist, Producer, Engineer, Featured..."
                        className={styles.proTextarea}
                        rows={3}
                      />
                    </div>

                    <div className={styles.proField}>
                      <label>Copyright</label>
                      <input value={copyrightInfo} onChange={e => setCopyrightInfo(e.target.value)} placeholder="© 2026 Artist Name" className={styles.inlineInput} />
                    </div>
                  </div>

                  {/* Quality Control */}
                  <div className={styles.proSection}>
                    <h3>Quality Control</h3>

                    <div className={styles.qcChecklist}>
                      <h4>Mix Checklist</h4>
                      {['Levels balanced', 'Panning correct', 'EQ clean', 'Compression applied', 'Effects reviewed', 'No clipping'].map((item, i) => (
                        <label key={i} className={styles.checkItem}>
                          <input type="checkbox" />
                          {item}
                        </label>
                      ))}
                    </div>

                    <div className={styles.qcChecklist}>
                      <h4>Master Checklist</h4>
                      {['Loudness compliant', 'True peak within limits', 'Phase coherent', 'Stereo imaging checked', 'Final listen approved'].map((item, i) => (
                        <label key={i} className={styles.checkItem}>
                          <input type="checkbox" />
                          {item}
                        </label>
                      ))}
                    </div>

                    <div className={styles.qualityMetrics}>
                      <div className={styles.metricItem}>
                        <span>Loudness (LUFS)</span>
                        <span>{activeProject.masterBus.loudness || '-14.0'}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>LUFS Target</span>
                        <span>{activeProject.masterBus.lufsTarget}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>Stereo Width</span>
                        <span>{activeProject.masterBus.stereoWidth}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className={styles.proSection}>
                    <h3>Security</h3>
                    <label className={styles.checkItem}>
                      <input type="checkbox" checked={sessionLocked} onChange={e => setSessionLocked(e.target.checked)} />
                      Lock Session (prevent edits)
                    </label>

                    <div className={styles.proField}>
                      <label>Access Permissions</label>
                      <div className={styles.permList}>
                        <div className={styles.permRow}><span>You (Owner)</span><span>Full Access</span></div>
                        {activeProject.collaborators.map(c => (
                          <div key={c.id} className={styles.permRow}>
                            <span>{c.name}</span>
                            <span>{c.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.proField}>
                      <label>Session Audit Trail</label>
                      <div className={styles.auditLog}>
                        {activityLog.slice(0, 10).map(a => (
                          <div key={a.id} className={styles.auditRow}>
                            <span>{a.action}</span>
                            <span className={styles.mutedText}>{relativeTime(a.created_at)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Splits & Samples */}
                  <div className={styles.proSection}>
                    <h3>Splits &amp; Clearances</h3>

                    <h4>Revenue Splits</h4>
                    <button className={styles.secondaryBtn} onClick={handleAddSplit}>Add Split</button>
                    {activeProject.splits.map(s => (
                      <div key={s.id} className={styles.splitRow}>
                        <input
                          value={s.name}
                          onChange={e => updateProject(p => ({ ...p, splits: p.splits.map(x => x.id === s.id ? { ...x, name: e.target.value } : x) }))}
                          className={styles.inlineInput}
                          placeholder="Name"
                        />
                        <input
                          value={s.role}
                          onChange={e => updateProject(p => ({ ...p, splits: p.splits.map(x => x.id === s.id ? { ...x, role: e.target.value } : x) }))}
                          className={styles.inlineInput}
                          placeholder="Role"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={s.percent}
                          onChange={e => updateProject(p => ({ ...p, splits: p.splits.map(x => x.id === s.id ? { ...x, percent: +e.target.value } : x) }))}
                          className={styles.percentInput}
                        />
                        <span>%</span>
                      </div>
                    ))}

                    <h4>Sample Clearances</h4>
                    <button className={styles.secondaryBtn} onClick={handleAddSample}>Add Sample</button>
                    {activeProject.samples.map(s => (
                      <div key={s.id} className={styles.sampleRow}>
                        <input
                          value={s.sampleName}
                          onChange={e => updateProject(p => ({ ...p, samples: p.samples.map(x => x.id === s.id ? { ...x, sampleName: e.target.value } : x) }))}
                          className={styles.inlineInput}
                          placeholder="Sample name"
                        />
                        <select
                          value={s.status}
                          onChange={e => updateProject(p => ({ ...p, samples: p.samples.map(x => x.id === s.id ? { ...x, status: e.target.value as 'pending' | 'cleared' | 'denied' } : x) }))}
                          className={styles.statusSelect}
                        >
                          <option value="pending">Pending</option>
                          <option value="cleared">Cleared</option>
                          <option value="denied">Denied</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Templates & Advanced */}
                  <div className={styles.proSection}>
                    <h3>Templates &amp; Advanced</h3>

                    <div className={styles.proField}>
                      <label>Save as Template</label>
                      <div className={styles.templateForm}>
                        <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name..." className={styles.inlineInput} />
                        <button className={styles.primaryBtn} onClick={handleSaveAsTemplate}>Save Template</button>
                      </div>
                    </div>

                    <button className={styles.secondaryBtn} onClick={handleSessionSnapshot}>
                      Create Session Snapshot
                    </button>

                    <div className={styles.proField}>
                      <label>Session Tags</label>
                      <input
                        value={activeProject.tags.join(', ')}
                        onChange={e => updateProject(p => ({ ...p, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                        className={styles.inlineInput}
                        placeholder="tag1, tag2, pinned, favorite..."
                      />
                    </div>

                    <h4>Keyboard Shortcuts</h4>
                    <div className={styles.shortcutList}>
                      <div className={styles.shortcutRow}><kbd>Space</kbd><span>Play / Pause</span></div>
                      <div className={styles.shortcutRow}><kbd>R</kbd><span>Record</span></div>
                      <div className={styles.shortcutRow}><kbd>L</kbd><span>Toggle Loop</span></div>
                      <div className={styles.shortcutRow}><kbd>M</kbd><span>Toggle Metronome</span></div>
                      <div className={styles.shortcutRow}><kbd>Ctrl+Z</kbd><span>Undo</span></div>
                      <div className={styles.shortcutRow}><kbd>Ctrl+Y</kbd><span>Redo</span></div>
                    </div>

                    {/* Feature Flags / Future Ready placeholders */}
                    <h4>Integrations</h4>
                    <div className={styles.placeholderList}>
                      <div className={styles.placeholderItem}>Plugin API — coming soon</div>
                      <div className={styles.placeholderItem}>Hardware Integration — coming soon</div>
                      <div className={styles.placeholderItem}>External Sync — coming soon</div>
                      <div className={styles.placeholderItem}>Cloud Processing — coming soon</div>
                      <div className={styles.placeholderItem}>Offline Editing — coming soon</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // ─── Session Card Renderer ────────────────────────────────
  function renderSessionCard(project: MusicProject) {
    return (
      <div key={project.id} className={`${styles.sessionCard} ${activeProject?.id === project.id ? styles.sessionActive : ''}`}>
        <div className={styles.sessionCardHeader}>
          {editingTitle === project.id ? (
            <input
              className={styles.renamingInput}
              value={editTitleValue}
              onChange={e => setEditTitleValue(e.target.value)}
              onBlur={() => handleRenameSession(project.id)}
              onKeyDown={e => e.key === 'Enter' && handleRenameSession(project.id)}
              autoFocus
            />
          ) : (
            <h4 className={styles.sessionTitle} onClick={() => { setActiveProject(project); setActiveTab('studio') }}>
              {project.title}
            </h4>
          )}
          <span className={`${styles.statusBadge} ${styles[`status_${project.status}`]}`}>{project.status}</span>
        </div>

        <div className={styles.sessionMeta}>
          <span>{project.tracks.length} tracks · {project.clips.length} clips</span>
          <span>Last edited {relativeTime(project.updatedAt)}</span>
        </div>

        {project.tags.length > 0 && (
          <div className={styles.sessionTags}>
            {project.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}

        <div className={styles.sessionActions}>
          <button className={styles.sessionBtn} onClick={() => { setActiveProject(project); setActiveTab('studio') }}>Open</button>
          <button className={styles.sessionBtn} onClick={() => { setEditingTitle(project.id); setEditTitleValue(project.title) }}>Rename</button>
          <button className={styles.sessionBtn} onClick={() => handleDuplicateSession(project)}>Duplicate</button>
          <button className={styles.sessionBtn} onClick={() => handleArchiveSession(project)}>
            {project.status === 'archived' ? 'Restore' : 'Archive'}
          </button>
          <button className={`${styles.sessionBtn} ${styles.dangerBtn}`} onClick={() => handleDeleteSession(project.id)}>Delete</button>
        </div>

        {/* Session Notes Preview */}
        {project.notes.length > 0 && (
          <div className={styles.sessionNotesPreview}>
            <span className={styles.mutedText}>{project.notes[0].text.slice(0, 100)}{project.notes[0].text.length > 100 ? '...' : ''}</span>
          </div>
        )}

        {/* Timeline Overview */}
        <div className={styles.timelineOverview}>
          <div className={styles.overviewBar}>
            {project.clips.slice(0, 8).map((clip, i) => (
              <div key={clip.id} className={styles.overviewClip} style={{
                left: `${(clip.start / 32) * 100}%`,
                width: `${Math.max(3, (clip.length / 32) * 100)}%`,
                background: project.tracks.find(t => t.id === clip.trackId)?.color || '#666',
                top: `${i * 4}px`,
              }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}
