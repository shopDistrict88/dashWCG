import { useState } from 'react'
import styles from './LegacyOwnership.module.css'

export default function LegacyOwnership() {
  const [assets] = useState([
    { id: 1, title: 'Summer EP (2026)', type: 'Music', rights: 'Full Ownership', registered: true },
    { id: 2, title: 'Brand Identity System', type: 'Visual Design', rights: 'Full Ownership', registered: true },
    { id: 3, title: 'Behind the Scenes Documentary', type: 'Film', rights: 'Shared (70%)', registered: false },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Legacy & Ownership</h1>
        <p>Track intellectual property, rights, and long-term creative archive</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>Registered Works</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>3</div>
          <div className={styles.statLabel}>Pending Registration</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>2.4 GB</div>
          <div className={styles.statLabel}>Archive Size</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>100%</div>
          <div className={styles.statLabel}>Data Ownership</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Intellectual Property Tracking</h2>
        <div className={styles.assets}>
          {assets.map(asset => (
            <div key={asset.id} className={styles.assetCard}>
              <div className={styles.assetHeader}>
                <div>
                  <div className={styles.assetTitle}>{asset.title}</div>
                  <div className={styles.assetType}>{asset.type}</div>
                </div>
                {asset.registered && (
                  <span className={styles.registered}>Registered</span>
                )}
              </div>
              <div className={styles.assetRights}>
                <span className={styles.rightsLabel}>Rights:</span> {asset.rights}
              </div>
              <div className={styles.assetActions}>
                <button className={styles.buttonSecondary}>View Details</button>
                <button className={styles.buttonSecondary}>Download Certificate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Rights Overview</h2>
        <div className={styles.rightsCard}>
          <div className={styles.rightsItem}>
            <div className={styles.rightsTitle}>Master Recordings</div>
            <div className={styles.rightsStatus}>
              <span className={styles.rightsValue}>8 tracks</span>
              <span className={styles.rightsOwnership}>100% ownership</span>
            </div>
          </div>
          <div className={styles.rightsItem}>
            <div className={styles.rightsTitle}>Publishing Rights</div>
            <div className={styles.rightsStatus}>
              <span className={styles.rightsValue}>8 compositions</span>
              <span className={styles.rightsOwnership}>100% ownership</span>
            </div>
          </div>
          <div className={styles.rightsItem}>
            <div className={styles.rightsTitle}>Visual Assets</div>
            <div className={styles.rightsStatus}>
              <span className={styles.rightsValue}>45 files</span>
              <span className={styles.rightsOwnership}>100% ownership</span>
            </div>
          </div>
          <div className={styles.rightsItem}>
            <div className={styles.rightsTitle}>Collaborative Works</div>
            <div className={styles.rightsStatus}>
              <span className={styles.rightsValue}>3 projects</span>
              <span className={styles.rightsOwnership}>Shared ownership</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Long-Term Archive</h2>
        <div className={styles.archiveCard}>
          <div className={styles.archiveInfo}>
            <h3>Creative Timeline Archive</h3>
            <p>All your work is automatically archived with full version history, metadata, and rights information.</p>
          </div>
          <div className={styles.archiveStats}>
            <div className={styles.archiveStat}>
              <div className={styles.archiveStatValue}>2019</div>
              <div className={styles.archiveStatLabel}>Archive Start</div>
            </div>
            <div className={styles.archiveStat}>
              <div className={styles.archiveStatValue}>7 Years</div>
              <div className={styles.archiveStatLabel}>History Tracked</div>
            </div>
            <div className={styles.archiveStat}>
              <div className={styles.archiveStatValue}>342</div>
              <div className={styles.archiveStatLabel}>Works Archived</div>
            </div>
          </div>
          <button className={styles.button}>Browse Archive</button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Data Ownership</h2>
        <div className={styles.ownershipCard}>
          <div className={styles.ownershipItem}>
            <div className={styles.ownershipIcon}>✓</div>
            <div className={styles.ownershipText}>
              <div className={styles.ownershipTitle}>You Own Your Data</div>
              <p>Everything you create belongs to you. No platform claims.</p>
            </div>
          </div>
          <div className={styles.ownershipItem}>
            <div className={styles.ownershipIcon}>✓</div>
            <div className={styles.ownershipText}>
              <div className={styles.ownershipTitle}>Export Anytime</div>
              <p>Download all your work in original formats, no restrictions.</p>
            </div>
          </div>
          <div className={styles.ownershipItem}>
            <div className={styles.ownershipIcon}>✓</div>
            <div className={styles.ownershipText}>
              <div className={styles.ownershipTitle}>Permanent Archive</div>
              <p>Your work is preserved with full metadata and version history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
