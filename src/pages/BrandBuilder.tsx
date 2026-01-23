import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Brand } from '../types'
import styles from './BrandBuilder.module.css'

export function BrandBuilder() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [colors, setColors] = useState('')
  const [fonts, setFonts] = useState('')
  const [voice, setVoice] = useState('')

  const brands = dashboard.brands

  const calculateConsistencyScore = (brand: Brand): number => {
    let score = 0
    if (brand.colors && brand.colors.length > 0) score += 20
    if (brand.fonts && brand.fonts.length > 0) score += 20
    if (brand.voice && brand.voice.length > 0) score += 20
    if (brand.description && brand.description.length > 50) score += 20
    if (brand.name && brand.colors && brand.fonts && brand.voice) score += 20
    return score
  }

  const getScoreColor = (score: number): string => {
    if (score < 40) return '#d32f2f'
    if (score < 60) return '#f57c00'
    if (score < 80) return '#fbc02d'
    return '#388e3c'
  }

  const getScoreLabel = (score: number): string => {
    if (score < 40) return 'Getting Started'
    if (score < 60) return 'Developing'
    if (score < 80) return 'Well Defined'
    return 'Brand Master'
  }

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      addToast('Please enter a brand name', 'error')
      return
    }

    const colorList = colors
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
    const fontList = fonts
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0)

    const newBrand: Brand = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      colors: colorList,
      fonts: fontList,
      voice,
      consistencyScore: 0,
    }

    // Calculate initial score
    newBrand.consistencyScore = calculateConsistencyScore(newBrand)

    updateDashboard({
      brands: [...brands, newBrand],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'brand',
          title: `Created brand: ${name}`,
          timestamp: new Date().toISOString(),
          action: 'created',
        },
      ],
    })

    setName('')
    setDescription('')
    setColors('')
    setFonts('')
    setVoice('')
    addToast('Brand created successfully!', 'success')
  }

  const handleDeleteBrand = (id: string) => {
    updateDashboard({
      brands: brands.filter((b) => b.id !== id),
    })
    addToast('Brand deleted', 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Brand Builder</h1>
        <p className={styles.subtitle}>
          Create and refine your brand identity with consistency scoring
        </p>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Create New Brand</h2>
        <form onSubmit={handleAddBrand} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your brand name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Brand Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your brand stand for?"
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Colors (comma-separated)</label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="e.g., #FF6B6B, #4ECDC4, #FFE66D"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fonts (comma-separated)</label>
              <input
                type="text"
                value={fonts}
                onChange={(e) => setFonts(e.target.value)}
                placeholder="e.g., Inter, Georgia"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Brand Voice</label>
            <textarea
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              placeholder="How do you talk to your audience? (Friendly, professional, bold, etc.)"
              rows={3}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Brand
          </button>
        </form>
      </div>

      <div className={styles.brandsSection}>
        <h2 className={styles.sectionTitle}>Your Brands</h2>
        {brands.length === 0 ? (
          <p className={styles.empty}>No brands created yet. Build one above!</p>
        ) : (
          <div className={styles.brandsList}>
            {brands.map((brand) => {
              const score = brand.consistencyScore || calculateConsistencyScore(brand)
              return (
                <div key={brand.id} className={styles.brandCard}>
                  {/* Score Card */}
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(score) }}>
                      <span className={styles.scoreNumber}>{score}</span>
                      <span className={styles.scoreMax}>/100</span>
                    </div>
                    <div>
                      <p className={styles.scoreLabel}>{getScoreLabel(score)}</p>
                      <p className={styles.scoreDescription}>Consistency Score</p>
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className={styles.brandHeader}>
                    <div>
                      <h3 className={styles.brandName}>{brand.name}</h3>
                      {brand.description && <p className={styles.brandDesc}>{brand.description}</p>}
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteBrand(brand.id)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Consistency Indicators */}
                  <div className={styles.indicators}>
                    <div className={`${styles.indicator} ${brand.colors && brand.colors.length > 0 ? styles.active : ''}`}>
                      <span className={styles.indicatorIcon}>🎨</span>
                      <small>Colors</small>
                    </div>
                    <div className={`${styles.indicator} ${brand.fonts && brand.fonts.length > 0 ? styles.active : ''}`}>
                      <span className={styles.indicatorIcon}>✏️</span>
                      <small>Fonts</small>
                    </div>
                    <div className={`${styles.indicator} ${brand.voice && brand.voice.length > 0 ? styles.active : ''}`}>
                      <span className={styles.indicatorIcon}>🗣️</span>
                      <small>Voice</small>
                    </div>
                  </div>

                  {/* Colors */}
                  {brand.colors && brand.colors.length > 0 && (
                    <div className={styles.section}>
                      <h4 className={styles.sectionLabel}>Colors</h4>
                      <div className={styles.colorGrid}>
                        {brand.colors.map((color, i) => (
                          <div key={i} className={styles.colorItem}>
                            <div
                              className={styles.colorSwatch}
                              style={{
                                backgroundColor: color.startsWith('#') ? color : '#e0e0e0',
                                border: '1px solid #333',
                              }}
                            />
                            <small>{color}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fonts */}
                  {brand.fonts && brand.fonts.length > 0 && (
                    <div className={styles.section}>
                      <h4 className={styles.sectionLabel}>Typography</h4>
                      <div className={styles.fontList}>
                        {brand.fonts.map((font: string, i: number) => (
                          <p key={i} style={{ fontFamily: font, margin: '4px 0', color: '#cccccc' }}>
                            {font}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Voice */}
                  {brand.voice && (
                    <div className={styles.section}>
                      <h4 className={styles.sectionLabel}>Brand Voice</h4>
                      <p className={styles.voiceText}>{brand.voice}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
