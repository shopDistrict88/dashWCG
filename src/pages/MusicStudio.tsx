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

export function MusicStudio() {
  const [activeTab, setActiveTab] = useState<'library' | 'releases' | 'collaborate'>('library')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  
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

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === 'library' ? styles.active : ''}
          onClick={() => setActiveTab('library')}
        >
          Library
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
