import { useState } from 'react'
import styles from './MusicStudio.module.css'

interface MusicFile {
  id: string
  name: string
  type: 'beat' | 'song' | 'demo' | 'stems' | 'cover'
  bpm?: number
  key?: string
  genre?: string
  mood?: string
  duration: string
  size: string
  uploadDate: string
  plays: number
  collaborators: string[]
}

interface Release {
  id: string
  title: string
  artist: string
  coverArt: string
  releaseDate: string
  status: 'draft' | 'scheduled' | 'released'
  platforms: {
    spotify: boolean
    appleMusic: boolean
    soundcloud: boolean
    youtubeMusic: boolean
  }
  stats?: {
    plays: number
    listeners: number
    saves: number
    revenue: number
  }
}

interface Track {
  id: string
  name: string
  duration: string
  bpm: number
  key: string
  stems: string[]
  versions: string[]
}

interface Project {
  id: string
  name: string
  createdDate: string
  lastModified: string
  tracks: Track[]
}

interface IdeaVaultItem {
  id: string
  title: string
  description: string
  createdDate: string
  mood: string
}

type TabType = 'library' | 'releases' | 'collaborate' | 'projects' | 'ai' | 'publishing' | 'analytics' | 'ideas' | 'admin'

export function MusicStudio() {
  const [activeTab, setActiveTab] = useState<TabType>('library')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [expandedIdea, setExpandedIdea] = useState<string>('')
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [aiTask, setAiTask] = useState<string>('')
  const [selectedReference, setSelectedReference] = useState<string>('')
  const [publishingMetadata, setPublishingMetadata] = useState({
    credits: '',
    lyrics: '',
    genre: '',
    mood: '',
    language: ''
  })
  
  // Mock music files
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([
    {
      id: '1',
      name: 'Late Night Vibes.mp3',
      type: 'beat',
      bpm: 85,
      key: 'Am',
      genre: 'Lo-fi',
      mood: 'Chill',
      duration: '3:24',
      size: '7.2 MB',
      uploadDate: '2026-01-15',
      plays: 245,
      collaborators: [],
    },
    {
      id: '2',
      name: 'Summer Hit Demo.wav',
      type: 'demo',
      bpm: 128,
      key: 'C',
      genre: 'Pop',
      mood: 'Uplifting',
      duration: '3:42',
      size: '42.1 MB',
      uploadDate: '2026-01-18',
      plays: 89,
      collaborators: ['Producer Mike', 'Sarah Vocals'],
    },
  ])

  // Mock releases
  const [releases] = useState<Release[]>([
    {
      id: '1',
      title: 'Midnight Drive',
      artist: 'Your Artist Name',
      coverArt: 'https://via.placeholder.com/300x300/111/fff?text=Album',
      releaseDate: '2026-02-14',
      status: 'scheduled',
      platforms: {
        spotify: true,
        appleMusic: true,
        soundcloud: true,
        youtubeMusic: true,
      },
      stats: {
        plays: 12450,
        listeners: 8230,
        saves: 1840,
        revenue: 246.8,
      },
    },
  ])

  // Projects (NEW)
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Neon Dreams EP',
      createdDate: '2026-01-10',
      lastModified: '2026-02-01',
      tracks: [
        { id: '1-1', name: 'Intro', duration: '1:45', bpm: 120, key: 'C', stems: ['Synth', 'Bass', 'Drums'], versions: ['v1', 'v2', 'v3'] },
        { id: '1-2', name: 'Main Track', duration: '3:42', bpm: 128, key: 'G', stems: ['Piano', 'Strings', 'Drums', 'Vocals'], versions: ['v1', 'v2'] },
      ]
    },
    {
      id: '2',
      name: 'Chill Sessions',
      createdDate: '2025-12-15',
      lastModified: '2026-01-25',
      tracks: [
        { id: '2-1', name: 'Coffee Thoughts', duration: '4:12', bpm: 85, key: 'Am', stems: ['Guitar', 'Ambient'], versions: ['v1'] },
      ]
    }
  ])

  // Idea Vault (NEW)
  const [ideas] = useState<IdeaVaultItem[]>([
    {
      id: '1',
      title: 'Synthwave Revival',
      description: 'Dark synth with retro 80s vibes. Perfect for a cyberpunk themed project.',
      createdDate: '2026-02-01',
      mood: 'Dark'
    },
    {
      id: '2',
      title: 'Bedroom Pop Experiment',
      description: 'Lo-fi hip-hop with acoustic guitar and vocal harmonies.',
      createdDate: '2026-01-28',
      mood: 'Intimate'
    },
    {
      id: '3',
      title: 'Epic Orchestral Arrangement',
      description: 'Full orchestral arrangement with choir and brass sections.',
      createdDate: '2026-01-20',
      mood: 'Cinematic'
    }
  ])

  // Sound Palette (NEW)
  const [soundPalettes] = useState([
    { id: '1', name: 'Retro Synths', presets: ['Prophet', 'Moog', 'Juno'] },
    { id: '2', name: 'Jazz Lounge', presets: ['Electric Piano', 'Upright Bass', 'Vibraphone'] },
    { id: '3', name: 'Modern Trap', presets: ['808 Kick', '808 Clap', 'Snare Roll'] }
  ])

  // Publishing Data (NEW)
  const [publishingTargets] = useState([
    { platform: 'Spotify', selected: true, status: 'approved' },
    { platform: 'Apple Music', selected: true, status: 'pending' },
    { platform: 'Amazon Music', selected: true, status: 'approved' },
    { platform: 'YouTube Music', selected: true, status: 'approved' },
    { platform: 'SoundCloud', selected: true, status: 'approved' },
    { platform: 'Bandcamp', selected: false, status: 'idle' }
  ])

  // Analytics Summary (NEW)
  const [analytics] = useState({
    totalPlays: 156420,
    totalListeners: 45230,
    totalRevenue: 3521.40,
    topTrack: 'Summer Hit Demo',
    topPlatform: 'Spotify',
    growth: {
      playsPercent: 23,
      listenersPercent: 18,
      revenuePercent: 31
    }
  })

  // Collaboration Comments (NEW)
  const [comments] = useState([
    { id: '1', author: 'Producer Mike', text: 'Love the arrangement! Maybe add more punch to the drop?', timestamp: '2 hours ago' },
    { id: '2', author: 'Sarah Vocals', text: 'The vocal timing is perfect on verse 2', timestamp: '1 day ago' }
  ])

  const filteredFiles = filterType === 'all' 
    ? musicFiles 
    : musicFiles.filter(f => f.type === filterType)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      console.log('Uploading files:', files)
      // Mock upload
      const newFile: MusicFile = {
        id: Date.now().toString(),
        name: files[0].name,
        type: 'song',
        duration: '0:00',
        size: `${(files[0].size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        plays: 0,
        collaborators: [],
      }
      setMusicFiles(prev => [newFile, ...prev])
      setUploadModalOpen(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Music Studio</h1>
          <p className={styles.subtitle}>Create, organize, and distribute your music</p>
        </div>
        <button className={styles.uploadBtn} onClick={() => setUploadModalOpen(true)}>
          Upload Files
        </button>
      </header>

      {/* Tabs - Original + New Features */}
      <div className={styles.tabs}>
        <button
          className={activeTab === 'library' ? styles.active : ''}
          onClick={() => setActiveTab('library')}
        >
          Library
        </button>
        <button
          className={activeTab === 'projects' ? styles.active : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={activeTab === 'ai' ? styles.active : ''}
          onClick={() => setActiveTab('ai')}
        >
          AI Tools
        </button>
        <button
          className={activeTab === 'publishing' ? styles.active : ''}
          onClick={() => setActiveTab('publishing')}
        >
          Publishing
        </button>
        <button
          className={activeTab === 'analytics' ? styles.active : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={activeTab === 'releases' ? styles.active : ''}
          onClick={() => setActiveTab('releases')}
        >
          Releases
        </button>
        <button
          className={activeTab === 'collaborate' ? styles.active : ''}
          onClick={() => setActiveTab('collaborate')}
        >
          Collaborate
        </button>
        <button
          className={activeTab === 'ideas' ? styles.active : ''}
          onClick={() => setActiveTab('ideas')}
        >
          Ideas
        </button>
        <button
          className={activeTab === 'admin' ? styles.active : ''}
          onClick={() => setActiveTab('admin')}
        >
          Admin
        </button>
      </div>

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div className={styles.libraryContent}>
          <div className={styles.libraryHeader}>
            <h2>Your Music Library</h2>
            <div className={styles.filters}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Files</option>
                <option value="beat">Beats</option>
                <option value="song">Songs</option>
                <option value="demo">Demos</option>
                <option value="stems">Stems</option>
                <option value="cover">Covers</option>
              </select>
            </div>
          </div>

          <div className={styles.filesList}>
            {filteredFiles.map(file => (
              <div key={file.id} className={styles.fileCard}>
                <div className={styles.fileIcon}>
                  <span>{file.type.charAt(0).toUpperCase()}</span>
                </div>
                <div className={styles.fileInfo}>
                  <h3>{file.name}</h3>
                  <div className={styles.fileMeta}>
                    {file.bpm && <span>BPM: {file.bpm}</span>}
                    {file.key && <span>Key: {file.key}</span>}
                    {file.genre && <span>Genre: {file.genre}</span>}
                    {file.mood && <span>Mood: {file.mood}</span>}
                  </div>
                  <div className={styles.fileDetails}>
                    <span>{file.duration}</span>
                    <span>{file.size}</span>
                    <span>{file.plays} plays</span>
                    {file.collaborators.length > 0 && (
                      <span>{file.collaborators.length} collaborators</span>
                    )}
                  </div>
                </div>
                <div className={styles.fileActions}>
                  <button className={styles.actionBtn}>Play</button>
                  <button className={styles.actionBtn}>Share</button>
                  <button className={styles.actionBtn}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Releases Tab */}
      {activeTab === 'releases' && (
        <div className={styles.releasesContent}>
          <div className={styles.releasesHeader}>
            <h2>Your Releases</h2>
            <button className={styles.createReleaseBtn}>Create New Release</button>
          </div>

          <div className={styles.distributionInfo}>
            <h3>FREE Distribution to All Platforms</h3>
            <p>You keep 100% ownership and 100% revenue from all streams and sales.</p>
            <div className={styles.platformLogos}>
              <span>Spotify</span>
              <span>Apple Music</span>
              <span>SoundCloud</span>
              <span>YouTube Music</span>
            </div>
          </div>

          <div className={styles.releasesList}>
            {releases.map(release => (
              <div key={release.id} className={styles.releaseCard}>
                <div className={styles.releaseCover}>
                  <img src={release.coverArt} alt={release.title} />
                  <span className={`${styles.statusBadge} ${styles[release.status]}`}>
                    {release.status}
                  </span>
                </div>
                <div className={styles.releaseInfo}>
                  <h3>{release.title}</h3>
                  <p>{release.artist}</p>
                  <p className={styles.releaseDate}>
                    Release Date: {new Date(release.releaseDate).toLocaleDateString()}
                  </p>
                  <div className={styles.releasePlatforms}>
                    {release.platforms.spotify && <span>Spotify</span>}
                    {release.platforms.appleMusic && <span>Apple Music</span>}
                    {release.platforms.soundcloud && <span>SoundCloud</span>}
                    {release.platforms.youtubeMusic && <span>YouTube Music</span>}
                  </div>
                </div>
                {release.stats && (
                  <div className={styles.releaseStats}>
                    <div className={styles.releaseStat}>
                      <span className={styles.releaseStatValue}>{release.stats.plays.toLocaleString()}</span>
                      <span className={styles.releaseStatLabel}>Plays</span>
                    </div>
                    <div className={styles.releaseStat}>
                      <span className={styles.releaseStatValue}>{release.stats.listeners.toLocaleString()}</span>
                      <span className={styles.releaseStatLabel}>Listeners</span>
                    </div>
                    <div className={styles.releaseStat}>
                      <span className={styles.releaseStatValue}>${release.stats.revenue.toFixed(2)}</span>
                      <span className={styles.releaseStatLabel}>Revenue</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaborate Tab */}
      {activeTab === 'collaborate' && (
        <div className={styles.collaborateContent}>
          <h2>Find Collaborators</h2>
          <p className={styles.collaborateSubtitle}>
            Connect with producers, songwriters, vocalists, and engineers
          </p>

          <div className={styles.collaboratorGrid}>
            {['Producer', 'Vocalist', 'Songwriter', 'Engineer', 'Mixer', 'Designer'].map(role => (
              <div key={role} className={styles.collaboratorCard}>
                <h3>Looking for {role}s</h3>
                <p>Post a collaboration request or browse available {role.toLowerCase()}s</p>
                <button className={styles.findBtn}>Find {role}s</button>
              </div>
            ))}
          </div>

          <div className={styles.collaborationRequests}>
            <h3>Your Collaboration Requests</h3>
            <div className={styles.emptyState}>
              <p>You haven't posted any collaboration requests yet</p>
              <button className={styles.createRequestBtn}>Create Request</button>
            </div>
          </div>

          {/* NEW: Collaboration Comments */}
          <div className={styles.collaborationComments}>
            <h3>Track Comments</h3>
            <div className={styles.commentsList}>
              {comments.map(comment => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentAuthor}>{comment.author}</div>
                  <div className={styles.commentText}>{comment.text}</div>
                  <div className={styles.commentTime}>{comment.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab (NEW) */}
      {activeTab === 'projects' && (
        <div className={styles.projectsContent}>
          <div className={styles.projectsHeader}>
            <h2>Your Projects</h2>
            <button className={styles.createProjectBtn}>New Project</button>
          </div>

          <div className={styles.projectsList}>
            {projects.map(project => (
              <div 
                key={project.id} 
                className={styles.projectCard}
                onClick={() => setSelectedProject(selectedProject === project.id ? '' : project.id)}
              >
                <div className={styles.projectInfo}>
                  <h3>{project.name}</h3>
                  <p className={styles.projectMeta}>
                    Created: {new Date(project.createdDate).toLocaleDateString()} | Modified: {new Date(project.lastModified).toLocaleDateString()}
                  </p>
                  <p className={styles.trackCount}>{project.tracks.length} tracks</p>
                </div>

                {selectedProject === project.id && (
                  <div className={styles.projectDetails}>
                    <h4>Tracks & Timeline</h4>
                    {project.tracks.map(track => (
                      <div key={track.id} className={styles.trackDetail}>
                        <span className={styles.trackName}>{track.name}</span>
                        <span className={styles.trackMeta}>
                          {track.bpm} BPM | {track.key} | {track.duration}
                        </span>
                        <div className={styles.stemsList}>
                          Stems: {track.stems.join(', ')}
                        </div>
                        <div className={styles.versionsList}>
                          Versions: {track.versions.join(', ')}
                        </div>
                      </div>
                    ))}

                    {/* Mixer Section */}
                    <div className={styles.mixerSection}>
                      <h4>Simple Mixer View</h4>
                      <div className={styles.mixerStrips}>
                        {project.tracks.map(track => (
                          <div key={`mixer-${track.id}`} className={styles.mixerStrip}>
                            <div className={styles.stripName}>{track.name.substring(0, 8)}</div>
                            <div className={styles.stripControls}>
                              <div className={styles.fader}>
                                <input type="range" min="0" max="100" defaultValue="75" />
                              </div>
                              <div className={styles.stripButtons}>
                                <button>▶</button>
                                <button>💬</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Tools Tab (NEW) */}
      {activeTab === 'ai' && (
        <div className={styles.aiContent}>
          <h2>AI Music Tools</h2>
          <p className={styles.aiSubtitle}>Leverage AI to enhance your music production workflow</p>

          <div className={styles.aiToolsGrid}>
            <div className={styles.aiToolCard} onClick={() => setAiTask('mix-critique')}>
              <h3>Mix Critique</h3>
              <p>Get AI feedback on your mix balance, EQ, and dynamics</p>
              <button className={styles.runAiBtn}>Analyze Now</button>
            </div>
            <div className={styles.aiToolCard} onClick={() => setAiTask('mastering')}>
              <h3>Mastering Chain</h3>
              <p>AI-generated mastering chain suggestions</p>
              <button className={styles.runAiBtn}>Generate</button>
            </div>
            <div className={styles.aiToolCard} onClick={() => setAiTask('arrangement')}>
              <h3>Arrangement Assistant</h3>
              <p>Get arrangement ideas and suggestions</p>
              <button className={styles.runAiBtn}>Suggest</button>
            </div>
            <div className={styles.aiToolCard} onClick={() => setAiTask('lyrics')}>
              <h3>Lyric Generator</h3>
              <p>Generate lyrics based on mood and theme</p>
              <button className={styles.runAiBtn}>Create</button>
            </div>
            <div className={styles.aiToolCard} onClick={() => setAiTask('reference')}>
              <h3>Reference Matching</h3>
              <p>Match your track to reference songs</p>
              <button className={styles.runAiBtn}>Match</button>
            </div>
            <div className={styles.aiToolCard} onClick={() => setAiTask('diagnostics')}>
              <h3>AI Diagnostics</h3>
              <p>Detect loudness, frequency issues, and quality metrics</p>
              <button className={styles.runAiBtn}>Scan</button>
            </div>
          </div>

          {/* AI Results Panel */}
          {aiTask && (
            <div className={styles.aiResultsPanel}>
              <h3>Results for {aiTask.replace('-', ' ').toUpperCase()}</h3>
              <div className={styles.aiResults}>
                <p>🔄 Processing your request...</p>
                <p>AI analysis will appear here</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setAiTask('')}>Close</button>
            </div>
          )}
        </div>
      )}

      {/* Publishing Tab (NEW) */}
      {activeTab === 'publishing' && (
        <div className={styles.publishingContent}>
          <h2>Publishing & Distribution</h2>

          {/* Release Metadata */}
          <div className={styles.publishingSection}>
            <h3>Release Metadata</h3>
            <div className={styles.metadataForm}>
              <div className={styles.formGroup}>
                <label>Credits</label>
                <input 
                  type="text" 
                  placeholder="Artist, Producer, Featured Artists"
                  value={publishingMetadata.credits}
                  onChange={(e) => setPublishingMetadata({...publishingMetadata, credits: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Lyrics</label>
                <textarea placeholder="Write or paste lyrics here..."></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Genre</label>
                <input type="text" placeholder="e.g., Electronic, Hip-Hop, Pop" />
              </div>
              <div className={styles.formGroup}>
                <label>Mood Tags</label>
                <input type="text" placeholder="e.g., Energetic, Chill, Dark" />
              </div>
            </div>
          </div>

          {/* Publishing Platforms */}
          <div className={styles.publishingSection}>
            <h3>Select Distribution Platforms</h3>
            <div className={styles.platformsList}>
              {publishingTargets.map(target => (
                <div key={target.platform} className={styles.platformItem}>
                  <input type="checkbox" defaultChecked={target.selected} id={target.platform} />
                  <label htmlFor={target.platform}>{target.platform}</label>
                  <span className={`${styles.statusBadge} ${styles[target.status]}`}>
                    {target.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Publishing Checklist */}
          <div className={styles.publishingSection}>
            <h3>Pre-Release Checklist</h3>
            <div className={styles.checklist}>
              <label><input type="checkbox" defaultChecked /> Metadata complete</label>
              <label><input type="checkbox" defaultChecked /> Cover art uploaded</label>
              <label><input type="checkbox" /> Sample clearances ready</label>
              <label><input type="checkbox" defaultChecked /> Release date set</label>
              <label><input type="checkbox" /> All collaborators credited</label>
            </div>
          </div>

          {/* Schedule Release */}
          <div className={styles.publishingSection}>
            <h3>Schedule Release</h3>
            <input type="datetime-local" className={styles.scheduleInput} />
            <button className={styles.scheduleBtn}>Schedule Release</button>
          </div>

          {/* Promo Kit */}
          <div className={styles.publishingSection}>
            <h3>Promo Kit</h3>
            <p>Auto-generated promotional materials for your release</p>
            <div className={styles.promoItems}>
              <button className={styles.promoBtn}>📄 Social Media Kit</button>
              <button className={styles.promoBtn}>🎬 Video Snippets</button>
              <button className={styles.promoBtn}>📰 Press Release</button>
              <button className={styles.promoBtn}>🖼️ Cover Variations</button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab (NEW) */}
      {activeTab === 'analytics' && (
        <div className={styles.analyticsContent}>
          <h2>Analytics & Insights</h2>

          {/* KPI Summary */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Total Plays</div>
              <div className={styles.kpiValue}>{analytics.totalPlays.toLocaleString()}</div>
              <div className={`${styles.kpiDelta} ${styles.positive}`}>↑ {analytics.growth.playsPercent}%</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Total Listeners</div>
              <div className={styles.kpiValue}>{analytics.totalListeners.toLocaleString()}</div>
              <div className={`${styles.kpiDelta} ${styles.positive}`}>↑ {analytics.growth.listenersPercent}%</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Revenue</div>
              <div className={styles.kpiValue}>${analytics.totalRevenue.toLocaleString()}</div>
              <div className={`${styles.kpiDelta} ${styles.positive}`}>↑ {analytics.growth.revenuePercent}%</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Top Track</div>
              <div className={styles.kpiValue} style={{fontSize: '0.95rem'}}>{analytics.topTrack}</div>
              <div className={styles.kpiDelta}>Most played</div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className={styles.analyticsSection}>
            <h3>Engagement by Platform</h3>
            <div className={styles.platformMetrics}>
              {['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud'].map(platform => (
                <div key={platform} className={styles.platformMetric}>
                  <span>{platform}</span>
                  <div className={styles.metricBar}>
                    <div className={styles.metricFill} style={{width: `${Math.random() * 100}%`}}></div>
                  </div>
                  <span className={styles.metricValue}>{Math.floor(Math.random() * 10000).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revision History Heatmap */}
          <div className={styles.analyticsSection}>
            <h3>Revision Activity Heatmap</h3>
            <div className={styles.heatmapContainer}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                Last 4 weeks of activity
              </div>
              <div className={styles.heatmapGrid}>
                {[...Array(28)].map((_, i) => (
                  <div 
                    key={i}
                    className={styles.heatmapCell}
                    style={{
                      opacity: Math.random()
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ideas Vault Tab (NEW) */}
      {activeTab === 'ideas' && (
        <div className={styles.ideasContent}>
          <div className={styles.ideasHeader}>
            <h2>Ideas Vault</h2>
            <button className={styles.createIdeaBtn}>Save New Idea</button>
          </div>

          {/* Sound Palette */}
          <div className={styles.ideasSection}>
            <h3>Sound Palettes</h3>
            <div className={styles.palettesList}>
              {soundPalettes.map(palette => (
                <div key={palette.id} className={styles.paletteCard}>
                  <h4>{palette.name}</h4>
                  <div className={styles.presetsList}>
                    {palette.presets.map(preset => (
                      <span key={preset} className={styles.preset}>{preset}</span>
                    ))}
                  </div>
                  <button className={styles.loadPaletteBtn}>Load Palette</button>
                </div>
              ))}
            </div>
          </div>

          {/* Idea Vault Items */}
          <div className={styles.ideasSection}>
            <h3>Your Music Ideas</h3>
            <div className={styles.ideasList}>
              {ideas.map(idea => (
                <div 
                  key={idea.id} 
                  className={styles.ideaCard}
                  onClick={() => setExpandedIdea(expandedIdea === idea.id ? '' : idea.id)}
                >
                  <div className={styles.ideaHeader}>
                    <h4>{idea.title}</h4>
                    <span className={styles.ideaMood}>{idea.mood}</span>
                  </div>
                  {expandedIdea === idea.id && (
                    <div className={styles.ideaDetails}>
                      <p>{idea.description}</p>
                      <p className={styles.ideaDate}>Saved: {new Date(idea.createdDate).toLocaleDateString()}</p>
                      <button className={styles.convertIdeaBtn}>Convert to Project</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reference Tracks */}
          <div className={styles.ideasSection}>
            <h3>Reference Tracks</h3>
            <p className={styles.sectionDescription}>A/B compare your tracks (for matching arrangement, mood, or production style)</p>
            <div className={styles.referencesList}>
              <div className={styles.referenceItem}>
                <input 
                  type="text" 
                  placeholder="Search reference tracks..." 
                  className={styles.referenceSearch}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Tab (NEW) */}
      {activeTab === 'admin' && (
        <div className={styles.adminContent}>
          <h2>Admin</h2>

          {/* Sample Clearance */}
          <div className={styles.adminSection}>
            <h3>Sample Clearances</h3>
            <div className={styles.samplesList}>
              <div className={styles.sampleItem}>
                <span>Sample Name</span>
                <span>Status: Ready</span>
                <button className={styles.manageBtn}>Manage</button>
              </div>
              <div className={styles.sampleItem}>
                <span>Original Artist</span>
                <span>Status: Pending</span>
                <button className={styles.manageBtn}>Manage</button>
              </div>
            </div>
            <button className={styles.addSampleBtn}>+ Add Sample Clearance</button>
          </div>

          {/* Splits Management */}
          <div className={styles.adminSection}>
            <h3>Splits Management</h3>
            <p className={styles.sectionDescription}>Manage revenue splits with collaborators and rights holders</p>
            <div className={styles.splitsList}>
              <div className={styles.splitItem}>
                <span>You</span>
                <span>50%</span>
                <input type="range" min="0" max="100" defaultValue="50" />
              </div>
              <div className={styles.splitItem}>
                <span>Producer A</span>
                <span>30%</span>
                <input type="range" min="0" max="100" defaultValue="30" />
              </div>
              <div className={styles.splitItem}>
                <span>Featuring Artist</span>
                <span>20%</span>
                <input type="range" min="0" max="100" defaultValue="20" />
              </div>
            </div>
            <button className={styles.saveSplitsBtn}>Save Splits</button>
          </div>

          {/* Loudness Meter / Quality Checks */}
          <div className={styles.adminSection}>
            <h3>Quality Analysis</h3>
            <div className={styles.qualityMetrics}>
              <div className={styles.metricRow}>
                <span>Loudness (LUFS)</span>
                <span className={styles.metricValue}>-14.2</span>
              </div>
              <div className={styles.metricRow}>
                <span>Peak Level</span>
                <span className={styles.metricValue}>-1.5 dB</span>
              </div>
              <div className={styles.metricRow}>
                <span>Dynamic Range</span>
                <span className={styles.metricValue}>9.2 dB</span>
              </div>
              <div className={styles.metricRow}>
                <span>Clipping Detected</span>
                <span className={styles.metricValue} style={{color: 'var(--color-success)'}}>✓ None</span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className={styles.adminSection}>
            <h3>Activity Log</h3>
            <div className={styles.activityLog}>
              <div className={styles.logEntry}>
                <span className={styles.logTime}>2 hours ago</span>
                <span className={styles.logAction}>Track uploaded: "Summer Hit Demo"</span>
              </div>
              <div className={styles.logEntry}>
                <span className={styles.logTime}>1 day ago</span>
                <span className={styles.logAction}>Release scheduled: "Midnight Drive"</span>
              </div>
              <div className={styles.logEntry}>
                <span className={styles.logTime}>3 days ago</span>
                <span className={styles.logAction}>Collaborator added: Producer Mike</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className={styles.modal} onClick={() => setUploadModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Upload Music Files</h2>
            <div className={styles.uploadArea}>
              <input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleUpload}
                className={styles.fileInput}
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className={styles.uploadLabel}>
                <span>Drop files here or click to browse</span>
                <span className={styles.uploadHint}>
                  Supports MP3, WAV, FLAC, and more
                </span>
              </label>
            </div>
            <button className={styles.cancelBtn} onClick={() => setUploadModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
