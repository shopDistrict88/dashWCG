import { useState } from 'react'
import styles from './MediaVault.module.css'

export default function MediaVault() {
  const [files] = useState([
    { id: 1, name: 'Summer_EP_Master_V3.wav', type: 'audio', size: '245 MB', date: '2026-01-20', versions: 3 },
    { id: 2, name: 'Brand_Photoshoot_RAW.zip', type: 'image', size: '1.2 GB', date: '2026-01-18', versions: 1 },
    { id: 3, name: 'Album_Cover_Final.psd', type: 'design', size: '89 MB', date: '2026-01-15', versions: 7 },
    { id: 4, name: 'Behind_Scenes_Edit.mp4', type: 'video', size: '3.4 GB', date: '2026-01-12', versions: 2 },
  ])

  const [selectedType, setSelectedType] = useState('all')

  const filteredFiles = selectedType === 'all' 
    ? files 
    : files.filter(f => f.type === selectedType)

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'audio': return '🎵'
      case 'video': return '🎬'
      case 'image': return '📷'
      case 'design': return '🎨'
      default: return '📄'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Media Vault</h1>
          <p>Secure storage with version control for all your creative assets</p>
        </div>
        <button className={styles.uploadButton}>Upload Files</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>4.9 GB</div>
          <div className={styles.statLabel}>Used</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>45.1 GB</div>
          <div className={styles.statLabel}>Available</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>24</div>
          <div className={styles.statLabel}>Files</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>13</div>
          <div className={styles.statLabel}>Versions Tracked</div>
        </div>
      </div>

      <div className={styles.filters}>
        <button 
          className={selectedType === 'all' ? styles.filterActive : styles.filter}
          onClick={() => setSelectedType('all')}
        >
          All Files
        </button>
        <button 
          className={selectedType === 'audio' ? styles.filterActive : styles.filter}
          onClick={() => setSelectedType('audio')}
        >
          Audio
        </button>
        <button 
          className={selectedType === 'video' ? styles.filterActive : styles.filter}
          onClick={() => setSelectedType('video')}
        >
          Video
        </button>
        <button 
          className={selectedType === 'image' ? styles.filterActive : styles.filter}
          onClick={() => setSelectedType('image')}
        >
          Images
        </button>
        <button 
          className={selectedType === 'design' ? styles.filterActive : styles.filter}
          onClick={() => setSelectedType('design')}
        >
          Design
        </button>
      </div>

      <div className={styles.fileList}>
        {filteredFiles.map(file => (
          <div key={file.id} className={styles.fileCard}>
            <div className={styles.fileIcon}>{getTypeIcon(file.type)}</div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>{file.name}</div>
              <div className={styles.fileMeta}>
                {file.size} · {file.date}
                {file.versions > 1 && (
                  <span className={styles.versions}> · {file.versions} versions</span>
                )}
              </div>
            </div>
            <div className={styles.fileActions}>
              <button className={styles.actionButton}>Download</button>
              <button className={styles.actionButton}>History</button>
              <button className={styles.actionButton}>Share</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2>Version Control</h2>
        <div className={styles.versionCard}>
          <div className={styles.versionHeader}>
            <div className={styles.versionFile}>Album_Cover_Final.psd</div>
            <button className={styles.buttonSecondary}>View All Versions</button>
          </div>
          <div className={styles.versions}>
            <div className={styles.versionItem}>
              <div className={styles.versionNumber}>V7</div>
              <div className={styles.versionInfo}>
                <div className={styles.versionLabel}>Current Version</div>
                <div className={styles.versionDate}>January 15, 2026 · 89 MB</div>
              </div>
              <button className={styles.versionAction}>Active</button>
            </div>
            <div className={styles.versionItem}>
              <div className={styles.versionNumber}>V6</div>
              <div className={styles.versionInfo}>
                <div className={styles.versionLabel}>Color correction update</div>
                <div className={styles.versionDate}>January 14, 2026 · 87 MB</div>
              </div>
              <button className={styles.versionAction}>Restore</button>
            </div>
            <div className={styles.versionItem}>
              <div className={styles.versionNumber}>V5</div>
              <div className={styles.versionInfo}>
                <div className={styles.versionLabel}>Typography changes</div>
                <div className={styles.versionDate}>January 12, 2026 · 86 MB</div>
              </div>
              <button className={styles.versionAction}>Restore</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
