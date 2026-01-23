import { useState } from 'react'
import styles from './CreativeLibrary.module.css'

interface DesignFile {
  id: string
  name: string
  type: 'design' | 'source' | 'export' | 'concept'
  thumbnail: string
  format: string
  size: string
  dimensions?: string
  uploadDate: string
  project?: string
  tags: string[]
}

interface Moodboard {
  id: string
  title: string
  description: string
  items: number
  coverImage: string
  theme?: string
  color?: string
  era?: string
  createdDate: string
}

export function CreativeLibrary() {
  const [activeTab, setActiveTab] = useState<'files' | 'moodboards' | 'inspiration'>('files')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterTag, setFilterTag] = useState<string>('all')

  // Mock design files
  const [designFiles] = useState<DesignFile[]>([
    {
      id: '1',
      name: 'Brand Logo Concept',
      type: 'design',
      thumbnail: 'https://via.placeholder.com/300x300/111/fff?text=Logo',
      format: 'Figma',
      size: '2.4 MB',
      uploadDate: '2026-01-20',
      project: 'Brand Refresh 2026',
      tags: ['logo', 'branding', 'minimal'],
    },
    {
      id: '2',
      name: 'Social Media Template',
      type: 'export',
      thumbnail: 'https://via.placeholder.com/300x300/111/fff?text=Template',
      format: 'PNG',
      size: '1.2 MB',
      dimensions: '1080x1080',
      uploadDate: '2026-01-19',
      tags: ['social', 'template', 'instagram'],
    },
    {
      id: '3',
      name: 'Website Mockup',
      type: 'concept',
      thumbnail: 'https://via.placeholder.com/300x300/111/fff?text=Web',
      format: 'Sketch',
      size: '5.8 MB',
      uploadDate: '2026-01-18',
      project: 'Portfolio Site',
      tags: ['web', 'ui', 'dark'],
    },
  ])

  // Mock moodboards
  const [moodboards] = useState<Moodboard[]>([
    {
      id: '1',
      title: 'Minimal Dark Aesthetic',
      description: 'Clean, corporate, Apple-like design references',
      items: 24,
      coverImage: 'https://via.placeholder.com/400x300/000/fff?text=Minimal',
      theme: 'Minimal',
      color: 'Black & White',
      era: 'Contemporary',
      createdDate: '2026-01-15',
    },
    {
      id: '2',
      title: 'Typography Inspiration',
      description: 'Modern font pairings and layouts',
      items: 18,
      coverImage: 'https://via.placeholder.com/400x300/111/fff?text=Type',
      theme: 'Typography',
      createdDate: '2026-01-12',
    },
  ])

  const allTags = Array.from(new Set(designFiles.flatMap(f => f.tags)))
  const filteredFiles = filterTag === 'all' 
    ? designFiles 
    : designFiles.filter(f => f.tags.includes(filterTag))

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Creative Library</h1>
          <p className={styles.subtitle}>Store and organize your creative work</p>
        </div>
        <button className={styles.uploadBtn}>Upload Files</button>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === 'files' ? styles.active : ''}
          onClick={() => setActiveTab('files')}
        >
          Design Files
        </button>
        <button
          className={activeTab === 'moodboards' ? styles.active : ''}
          onClick={() => setActiveTab('moodboards')}
        >
          Moodboards
        </button>
        <button
          className={activeTab === 'inspiration' ? styles.active : ''}
          onClick={() => setActiveTab('inspiration')}
        >
          Inspiration
        </button>
      </div>

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className={styles.filesContent}>
          <div className={styles.filesHeader}>
            <div className={styles.filterSection}>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className={styles.viewToggle}>
              <button
                className={viewMode === 'grid' ? styles.active : ''}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={viewMode === 'list' ? styles.active : ''}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? styles.filesGrid : styles.filesList}>
            {filteredFiles.map(file => (
              <div key={file.id} className={styles.fileCard}>
                <div className={styles.fileThumbnail}>
                  <img src={file.thumbnail} alt={file.name} />
                  <span className={styles.fileType}>{file.type}</span>
                </div>
                <div className={styles.fileInfo}>
                  <h3>{file.name}</h3>
                  <div className={styles.fileMeta}>
                    <span>{file.format}</span>
                    <span>{file.size}</span>
                    {file.dimensions && <span>{file.dimensions}</span>}
                  </div>
                  {file.project && (
                    <p className={styles.fileProject}>{file.project}</p>
                  )}
                  <div className={styles.fileTags}>
                    {file.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.fileActions}>
                  <button className={styles.actionBtn}>Open</button>
                  <button className={styles.actionBtn}>Share</button>
                  <button className={styles.actionBtn}>Export</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Moodboards Tab */}
      {activeTab === 'moodboards' && (
        <div className={styles.moodboardsContent}>
          <div className={styles.moodboardsHeader}>
            <h2>Your Moodboards</h2>
            <button className={styles.createBtn}>Create Moodboard</button>
          </div>

          <div className={styles.moodboardsGrid}>
            {moodboards.map(board => (
              <div key={board.id} className={styles.moodboardCard}>
                <div className={styles.moodboardCover}>
                  <img src={board.coverImage} alt={board.title} />
                  <span className={styles.itemCount}>{board.items} items</span>
                </div>
                <div className={styles.moodboardInfo}>
                  <h3>{board.title}</h3>
                  <p>{board.description}</p>
                  <div className={styles.moodboardMeta}>
                    {board.theme && <span>{board.theme}</span>}
                    {board.color && <span>{board.color}</span>}
                    {board.era && <span>{board.era}</span>}
                  </div>
                  <span className={styles.moodboardDate}>
                    Created {new Date(board.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inspiration Tab */}
      {activeTab === 'inspiration' && (
        <div className={styles.inspirationContent}>
          <h2>Organize Your Inspiration</h2>
          <p className={styles.inspirationSubtitle}>
            Save designs, references, and ideas by theme, color, era, or medium
          </p>

          <div className={styles.categoryGrid}>
            <div className={styles.categoryCard}>
              <h3>By Theme</h3>
              <div className={styles.categoryTags}>
                <span>Minimal</span>
                <span>Bold</span>
                <span>Playful</span>
                <span>Corporate</span>
                <span>Retro</span>
              </div>
            </div>
            <div className={styles.categoryCard}>
              <h3>By Color</h3>
              <div className={styles.categoryTags}>
                <span>Monochrome</span>
                <span>Vibrant</span>
                <span>Pastel</span>
                <span>Dark</span>
                <span>Neon</span>
              </div>
            </div>
            <div className={styles.categoryCard}>
              <h3>By Era</h3>
              <div className={styles.categoryTags}>
                <span>Contemporary</span>
                <span>90s</span>
                <span>80s</span>
                <span>Vintage</span>
                <span>Futuristic</span>
              </div>
            </div>
            <div className={styles.categoryCard}>
              <h3>By Medium</h3>
              <div className={styles.categoryTags}>
                <span>Digital</span>
                <span>Print</span>
                <span>Web</span>
                <span>Motion</span>
                <span>3D</span>
              </div>
            </div>
          </div>

          <div className={styles.inspirationTip}>
            <h3>Usage Rights Tracking</h3>
            <p>
              Keep track of licensing and usage rights for all your inspiration and reference materials.
              Organize by personal use, commercial use, or client-ready exports.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
