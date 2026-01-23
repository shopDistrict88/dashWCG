import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './PersonalBrand.module.css'

interface PersonalBrand {
  bio: string
  tagline: string
  website: string
  isPublic: boolean
}

export function PersonalBrand() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [brand, setBrand] = useState<PersonalBrand>({
    bio: 'Creative entrepreneur building the future',
    tagline: 'Design × Strategy × Growth',
    website: 'www.yoursite.com',
    isPublic: true,
  })

  const handleUpdateBrand = (field: keyof PersonalBrand, value: any) => {
    const updated = { ...brand, [field]: value }
    setBrand(updated)
    updateDashboard({
      activity: [...dashboard.activity, {
        id: Math.random().toString(36).substr(2, 9),
        type: 'brand',
        title: `Updated personal brand: ${field}`,
        timestamp: new Date().toISOString(),
        action: 'updated',
      }],
    })
    addToast('Personal brand updated', 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Personal Brand</h1>
        <p className={styles.subtitle}>Build your public presence</p>
      </div>

      <div className={styles.mainContent}>
        <section className={styles.section}>
          <h2>Brand Profile</h2>
          <div className={styles.previewCard}>
            <div className={styles.avatarPlaceholder}>👤</div>
            <h3>{brand.tagline}</h3>
            <p>{brand.bio}</p>
            <a href={`https://${brand.website}`} target="_blank" rel="noopener noreferrer">{brand.website}</a>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Edit Profile</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Tagline (50 chars max)</label>
              <input
                type="text"
                maxLength={50}
                value={brand.tagline}
                onChange={(e) => handleUpdateBrand('tagline', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bio (200 chars max)</label>
              <textarea
                maxLength={200}
                value={brand.bio}
                onChange={(e) => handleUpdateBrand('bio', e.target.value)}
                className={styles.textarea}
                rows={4}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Website URL</label>
              <input
                type="text"
                value={brand.website}
                onChange={(e) => handleUpdateBrand('website', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Visibility</h2>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={brand.isPublic}
              onChange={(e) => handleUpdateBrand('isPublic', e.target.checked)}
              className={styles.checkbox}
            />
            <span>{brand.isPublic ? '🔓 Public Profile' : '🔒 Private Profile'}</span>
          </label>
          {brand.isPublic && <p className={styles.note}>Your profile is visible to everyone</p>}
        </section>

        <section className={styles.section}>
          <h2>Connected Accounts</h2>
          <div className={styles.accountsList}>
            <div className={styles.accountItem}>LinkedIn</div>
            <div className={styles.accountItem}>Twitter</div>
            <div className={styles.accountItem}>Instagram</div>
          </div>
        </section>
      </div>
    </div>
  )
}
