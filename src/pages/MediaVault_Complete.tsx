import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './MediaVault.module.css'

interface MediaAsset {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document' | 'other'
  size: number
  url: string
  thumbnail: string
  uploadDate: string
  tags: string[]
  folder: string
}

interface AssetOrganization {
  id: string
  folderName: string
  path: string
  assetCount: number
  totalSize: number
  structure: 'flat' | 'hierarchical' | 'tagged'
}

interface MetadataTag {
  id: string
  assetId: string
  key: string
  value: string
  type: 'auto' | 'manual'
}

interface MediaSearch {
  id: string
  query: string
  filters: {type?: string[], tags?: string[], dateRange?: {start: string, end: string}}
  results: number
  timestamp: string
}

interface VersionControl {
  id: string
  assetId: string
  version: number
  changes: string
  date: string
  size: number
}

interface MediaPreview {
  id: string
  assetId: string
  previewUrl: string
  format: string
  quality: 'low' | 'medium' | 'high'
}

interface BatchOperation {
  id: string
  operation: 'rename' | 'move' | 'tag' | 'convert' | 'delete'
  assetIds: string[]
  status: 'pending' | 'processing' | 'complete' | 'failed'
  progress: number
}

interface MediaAnalytics {
  id: string
  assetId: string
  views: number
  downloads: number
  shares: number
  avgLoadTime: number
}

interface StorageManagement {
  id: string
  totalStorage: number
  usedStorage: number
  breakdown: {type: string, size: number}[]
  optimizationPotential: number
}

interface SharingPermissions {
  id: string
  assetId: string
  sharedWith: string[]
  permissions: 'view' | 'download' | 'edit'
  expiryDate: string
  password: string
}

interface MediaEmbedding {
  id: string
  assetId: string
  embedCode: string
  platform: string
  views: number
}

interface FormatConversion {
  id: string
  assetId: string
  fromFormat: string
  toFormat: string
  quality: number
  status: 'queued' | 'converting' | 'complete'
}

interface MediaWorkflow {
  id: string
  name: string
  steps: string[]
  automation: boolean
  usage: number
}

interface BackupRestore {
  id: string
  backupDate: string
  assetCount: number
  size: number
  location: string
  status: 'active' | 'archived'
}

interface MediaInsights {
  id: string
  assetId: string
  popularityScore: number
  engagementRate: number
  recommendations: string[]
}

export function MediaVault() {
  const { addToast } = useApp()
  
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [organization, setOrganization] = useState<AssetOrganization[]>([])
  const [metadata, setMetadata] = useState<MetadataTag[]>([])
  const [searches, setSearches] = useState<MediaSearch[]>([])
  const [versions, setVersions] = useState<VersionControl[]>([])
  const [previews, setPreviews] = useState<MediaPreview[]>([])
  const [batches, setBatches] = useState<BatchOperation[]>([])
  const [analytics, setAnalytics] = useState<MediaAnalytics[]>([])
  const [storage, setStorage] = useState<StorageManagement[]>([])
  const [sharing, setSharing] = useState<SharingPermissions[]>([])
  const [embeddings, setEmbeddings] = useState<MediaEmbedding[]>([])
  const [conversions, setConversions] = useState<FormatConversion[]>([])
  const [workflows, setWorkflows] = useState<MediaWorkflow[]>([])
  const [backups, setBackups] = useState<BackupRestore[]>([])
  const [insights, setInsights] = useState<MediaInsights[]>([])

  const [activeSection, setActiveSection] = useState('library')
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    const keys = ['assets', 'organization', 'metadata', 'searches', 'versions', 'previews', 'batches', 'analytics', 'storage', 'sharing', 'embeddings', 'conversions', 'workflows', 'backups', 'insights']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`media_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'assets': setAssets(data); break
          case 'organization': setOrganization(data); break
          case 'metadata': setMetadata(data); break
          case 'searches': setSearches(data); break
          case 'versions': setVersions(data); break
          case 'previews': setPreviews(data); break
          case 'batches': setBatches(data); break
          case 'analytics': setAnalytics(data); break
          case 'storage': setStorage(data); break
          case 'sharing': setSharing(data); break
          case 'embeddings': setEmbeddings(data); break
          case 'conversions': setConversions(data); break
          case 'workflows': setWorkflows(data); break
          case 'backups': setBackups(data); break
          case 'insights': setInsights(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('media_assets', JSON.stringify(assets)) }, [assets])
  useEffect(() => { localStorage.setItem('media_organization', JSON.stringify(organization)) }, [organization])
  useEffect(() => { localStorage.setItem('media_metadata', JSON.stringify(metadata)) }, [metadata])
  useEffect(() => { localStorage.setItem('media_searches', JSON.stringify(searches)) }, [searches])
  useEffect(() => { localStorage.setItem('media_versions', JSON.stringify(versions)) }, [versions])
  useEffect(() => { localStorage.setItem('media_previews', JSON.stringify(previews)) }, [previews])
  useEffect(() => { localStorage.setItem('media_batches', JSON.stringify(batches)) }, [batches])
  useEffect(() => { localStorage.setItem('media_analytics', JSON.stringify(analytics)) }, [analytics])
  useEffect(() => { localStorage.setItem('media_storage', JSON.stringify(storage)) }, [storage])
  useEffect(() => { localStorage.setItem('media_sharing', JSON.stringify(sharing)) }, [sharing])
  useEffect(() => { localStorage.setItem('media_embeddings', JSON.stringify(embeddings)) }, [embeddings])
  useEffect(() => { localStorage.setItem('media_conversions', JSON.stringify(conversions)) }, [conversions])
  useEffect(() => { localStorage.setItem('media_workflows', JSON.stringify(workflows)) }, [workflows])
  useEffect(() => { localStorage.setItem('media_backups', JSON.stringify(backups)) }, [backups])
  useEffect(() => { localStorage.setItem('media_insights', JSON.stringify(insights)) }, [insights])

  // AI Functions
  const calculateStorageUsage = (used: number, total: number): number => {
    return Math.round((used / total) * 100)
  }

  const assessOptimizationPotential = (assets: MediaAsset[]): number => {
    const largeFiles = assets.filter(a => a.size > 10000000).length
    const duplicates = assets.length - new Set(assets.map(a => a.name)).size
    return Math.min(100, (largeFiles * 5) + (duplicates * 10))
  }

  const calculatePopularityScore = (views: number, downloads: number, shares: number): number => {
    return Math.min(100, (views * 1) + (downloads * 10) + (shares * 20))
  }

  const assessEngagementRate = (views: number, interactions: number): number => {
    if (views === 0) return 0
    return Math.round((interactions / views) * 100)
  }

  const predictStorageNeeds = (currentUsage: number, growthRate: number, months: number): number => {
    return Math.round(currentUsage * Math.pow(1 + (growthRate / 100), months))
  }

  const calculateLoadOptimization = (fileSize: number, loadTime: number): number => {
    const optimal = fileSize / 1000000 * 0.5
    if (loadTime <= optimal) return 100
    const efficiency = (optimal / loadTime) * 100
    return Math.round(efficiency)
  }

  const assessFolderHealth = (assetCount: number, maxRecommended: number): 'healthy' | 'warning' | 'critical' => {
    if (assetCount <= maxRecommended) return 'healthy'
    if (assetCount <= maxRecommended * 1.5) return 'warning'
    return 'critical'
  }

  const calculateBatchEfficiency = (assetsProcessed: number, timeSpent: number): number => {
    const assetsPerMinute = assetsProcessed / (timeSpent / 60)
    return Math.round(assetsPerMinute * 10)
  }

  const suggestTags = (filename: string, existingTags: string[]): string[] => {
    const suggestions: string[] = []
    const keywords = ['design', 'video', 'audio', 'document', 'photo', 'logo', 'banner']
    keywords.forEach(keyword => {
      if (filename.toLowerCase().includes(keyword)) {
        suggestions.push(keyword)
      }
    })
    return suggestions.slice(0, 3)
  }

  const assessBackupCoverage = (totalAssets: number, backedUpAssets: number): number => {
    if (totalAssets === 0) return 100
    return Math.round((backedUpAssets / totalAssets) * 100)
  }

  // CRUD Functions
  const addAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newAsset: MediaAsset = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as MediaAsset['type'],
      size: parseInt(formData.get('size') as string),
      url: formData.get('url') as string,
      thumbnail: formData.get('url') as string,
      uploadDate: new Date().toISOString(),
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t),
      folder: formData.get('folder') as string
    }
    
    setAssets([...assets, newAsset])
    addToast(`Asset "${newAsset.name}" uploaded`, 'success')
    e.currentTarget.reset()
  }

  const addBatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newBatch: BatchOperation = {
      id: Date.now().toString(),
      operation: formData.get('operation') as BatchOperation['operation'],
      assetIds: (formData.get('assetIds') as string).split(',').map(id => id.trim()),
      status: 'pending',
      progress: 0
    }
    
    setBatches([...batches, newBatch])
    addToast('Batch operation queued', 'success')
    e.currentTarget.reset()
  }

  const filteredAssets = selectedType === 'all' 
    ? assets 
    : assets.filter(a => a.type === selectedType)

  const totalSize = assets.reduce((sum, a) => sum + a.size, 0)
  const totalStorage = 100000000000 // 100GB
  const usagePercent = calculateStorageUsage(totalSize, totalStorage)
  const optimizationPotential = assessOptimizationPotential(assets)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Media Vault</h1>
          <p className={styles.subtitle}>Centralized asset management and delivery</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{assets.length}</div>
            <div className={styles.statLabel}>Assets</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{(totalSize / 1000000000).toFixed(1)}GB</div>
            <div className={styles.statLabel}>Used</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{usagePercent}%</div>
            <div className={styles.statLabel}>Storage</div>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'library' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('library')}>Media Library</button>
          <button className={`${styles.navItem} ${activeSection === 'organization' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('organization')}>Asset Organization</button>
          <button className={`${styles.navItem} ${activeSection === 'metadata' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('metadata')}>Metadata Tagging</button>
          <button className={`${styles.navItem} ${activeSection === 'search' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('search')}>Media Search</button>
          <button className={`${styles.navItem} ${activeSection === 'versions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('versions')}>Version Control</button>
          <button className={`${styles.navItem} ${activeSection === 'previews' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('previews')}>Media Previews</button>
          <button className={`${styles.navItem} ${activeSection === 'batches' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('batches')}>Batch Operations</button>
          <button className={`${styles.navItem} ${activeSection === 'analytics' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('analytics')}>Media Analytics</button>
          <button className={`${styles.navItem} ${activeSection === 'storage' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('storage')}>Storage Management</button>
          <button className={`${styles.navItem} ${activeSection === 'sharing' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('sharing')}>Sharing & Permissions</button>
          <button className={`${styles.navItem} ${activeSection === 'embeddings' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('embeddings')}>Media Embedding</button>
          <button className={`${styles.navItem} ${activeSection === 'conversions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('conversions')}>Format Conversion</button>
          <button className={`${styles.navItem} ${activeSection === 'workflows' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('workflows')}>Media Workflow</button>
          <button className={`${styles.navItem} ${activeSection === 'backups' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('backups')}>Backup & Restore</button>
          <button className={`${styles.navItem} ${activeSection === 'insights' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('insights')}>Media Insights</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'library' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Media Library</h2>
                <p>All your assets in one place</p>
              </div>

              <form onSubmit={addAsset} className={styles.form}>
                <input name="name" placeholder="Asset name" required className={styles.input} />
                <select name="type" required className={styles.select}>
                  <option value="">Asset type</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                  <option value="other">Other</option>
                </select>
                <input name="url" placeholder="Asset URL" required className={styles.input} />
                <input name="size" type="number" placeholder="File size (bytes)" required className={styles.input} />
                <input name="folder" placeholder="Folder path" required className={styles.input} />
                <input name="tags" placeholder="Tags (comma-separated)" className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Upload Asset</button>
              </form>

              <div className={styles.filterBar}>
                <button 
                  className={`${styles.filterBtn} ${selectedType === 'all' ? styles.active : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  All ({assets.length})
                </button>
                <button 
                  className={`${styles.filterBtn} ${selectedType === 'image' ? styles.active : ''}`}
                  onClick={() => setSelectedType('image')}
                >
                  Images ({assets.filter(a => a.type === 'image').length})
                </button>
                <button 
                  className={`${styles.filterBtn} ${selectedType === 'video' ? styles.active : ''}`}
                  onClick={() => setSelectedType('video')}
                >
                  Videos ({assets.filter(a => a.type === 'video').length})
                </button>
                <button 
                  className={`${styles.filterBtn} ${selectedType === 'audio' ? styles.active : ''}`}
                  onClick={() => setSelectedType('audio')}
                >
                  Audio ({assets.filter(a => a.type === 'audio').length})
                </button>
                <button 
                  className={`${styles.filterBtn} ${selectedType === 'document' ? styles.active : ''}`}
                  onClick={() => setSelectedType('document')}
                >
                  Documents ({assets.filter(a => a.type === 'document').length})
                </button>
              </div>

              <div className={styles.assetsGrid}>
                {filteredAssets.map(asset => {
                  const assetAnalytics = analytics.find(a => a.assetId === asset.id)
                  const popularity = assetAnalytics 
                    ? calculatePopularityScore(assetAnalytics.views, assetAnalytics.downloads, assetAnalytics.shares)
                    : 0
                  
                  return (
                    <div key={asset.id} className={styles.assetCard}>
                      <div className={styles.assetThumbnail}>
                        <div className={styles.typeBadge}>{asset.type}</div>
                      </div>
                      <div className={styles.assetInfo}>
                        <h3>{asset.name}</h3>
                        <div className={styles.assetMeta}>
                          <span className={styles.size}>{(asset.size / 1000000).toFixed(2)} MB</span>
                          <span className={styles.folder}>{asset.folder}</span>
                        </div>
                        <div className={styles.uploadDate}>
                          {new Date(asset.uploadDate).toLocaleDateString()}
                        </div>
                        {asset.tags.length > 0 && (
                          <div className={styles.assetTags}>
                            {asset.tags.map((tag, i) => (
                              <span key={i} className={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        )}
                        {popularity > 0 && (
                          <div className={styles.popularity}>
                            <strong>Popularity:</strong> {popularity}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeSection === 'storage' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Storage Management</h2>
                <p>Monitor and optimize storage usage</p>
              </div>

              <div className={styles.storageOverview}>
                <div className={styles.storageCard}>
                  <h3>Storage Usage</h3>
                  <div className={styles.storageBar}>
                    <div className={styles.storageFill} style={{width: `${usagePercent}%`}}></div>
                  </div>
                  <div className={styles.storageStats}>
                    <div className={styles.stat}>
                      <span className={styles.label}>Used:</span>
                      <span className={styles.value}>{(totalSize / 1000000000).toFixed(2)} GB</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.label}>Total:</span>
                      <span className={styles.value}>{(totalStorage / 1000000000).toFixed(0)} GB</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.label}>Available:</span>
                      <span className={styles.value}>{((totalStorage - totalSize) / 1000000000).toFixed(2)} GB</span>
                    </div>
                  </div>
                </div>

                <div className={styles.optimizationCard}>
                  <h3>Optimization Potential</h3>
                  <div className={styles.optimizationScore}>
                    <div className={styles.bigNumber}>{optimizationPotential}%</div>
                    <div className={styles.label}>
                      {optimizationPotential > 50 ? 'High potential' : 
                       optimizationPotential > 25 ? 'Moderate potential' : 
                       'Well optimized'}
                    </div>
                  </div>
                  <div className={styles.recommendations}>
                    {optimizationPotential > 50 && (
                      <>
                        <p>• Compress large files</p>
                        <p>• Remove duplicate assets</p>
                        <p>• Archive old media</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.breakdownSection}>
                <h3>Storage Breakdown by Type</h3>
                <div className={styles.breakdownGrid}>
                  {['image', 'video', 'audio', 'document', 'other'].map(type => {
                    const typeAssets = assets.filter(a => a.type === type)
                    const typeSize = typeAssets.reduce((sum, a) => sum + a.size, 0)
                    const typePercent = totalSize > 0 ? (typeSize / totalSize) * 100 : 0
                    
                    return (
                      <div key={type} className={styles.breakdownCard}>
                        <div className={styles.typeLabel}>{type}</div>
                        <div className={styles.typeStats}>
                          <div className={styles.count}>{typeAssets.length} files</div>
                          <div className={styles.size}>{(typeSize / 1000000).toFixed(2)} MB</div>
                          <div className={styles.percent}>{typePercent.toFixed(1)}%</div>
                        </div>
                        <div className={styles.typeBar}>
                          <div className={styles.typeFill} style={{width: `${typePercent}%`}}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {activeSection === 'batches' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Batch Operations</h2>
                <p>Process multiple assets at once</p>
              </div>

              <form onSubmit={addBatch} className={styles.form}>
                <select name="operation" required className={styles.select}>
                  <option value="">Select operation</option>
                  <option value="rename">Rename</option>
                  <option value="move">Move</option>
                  <option value="tag">Tag</option>
                  <option value="convert">Convert</option>
                  <option value="delete">Delete</option>
                </select>
                <textarea name="assetIds" placeholder="Asset IDs (comma-separated)" required className={styles.textarea} rows={3}></textarea>
                <button type="submit" className={styles.primaryBtn}>Queue Batch</button>
              </form>

              <div className={styles.batchesGrid}>
                {batches.map(batch => (
                  <div key={batch.id} className={`${styles.batchCard} ${styles[batch.status]}`}>
                    <div className={styles.batchHeader}>
                      <h3>{batch.operation.toUpperCase()}</h3>
                      <span className={styles.statusBadge}>{batch.status}</span>
                    </div>
                    <div className={styles.batchMeta}>
                      <strong>Assets:</strong> {batch.assetIds.length}
                    </div>
                    <div className={styles.progressSection}>
                      <div className={styles.progressLabel}>
                        <span>Progress</span>
                        <span className={styles.percentage}>{batch.progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: `${batch.progress}%`}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
