import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './CreativeLibrary.module.css'

interface DesignAsset {
  id: string
  name: string
  type: 'logo' | 'icon' | 'illustration' | 'photo' | 'mockup'
  tags: string[]
  version: string
  fileSize: number
  dimensions: string
  usageCount: number
}

interface DesignSystem {
  id: string
  name: string
  colors: {name: string, hex: string, usage: string}[]
  typography: {name: string, font: string, size: string, weight: string}[]
  spacing: {name: string, value: string}[]
  components: string[]
}

interface StyleGuide {
  id: string
  section: string
  rules: {rule: string, example: string}[]
  doList: string[]
  dontList: string[]
  lastUpdated: string
}

interface ComponentLibrary {
  id: string
  component: string
  description: string
  variants: string[]
  props: {name: string, type: string, required: boolean}[]
  usage: string
  reusable: boolean
}

interface LayoutTemplate {
  id: string
  name: string
  type: 'web' | 'mobile' | 'email' | 'print'
  grid: string
  sections: string[]
  responsive: boolean
  usageCount: number
}

interface ColorPalette {
  id: string
  name: string
  primary: string[]
  secondary: string[]
  accent: string[]
  neutral: string[]
  accessibility: number
}

interface TypographyScale {
  id: string
  name: string
  baseSize: number
  ratio: number
  scale: {name: string, size: number, lineHeight: number}[]
}

interface IconSet {
  id: string
  setName: string
  iconCount: number
  style: 'outlined' | 'filled' | 'rounded' | 'sharp'
  sizes: number[]
  format: string
}

interface AnimationLibrary {
  id: string
  name: string
  duration: number
  easing: string
  trigger: string
  cssCode: string
  preview: string
}

interface ResponsiveBreakpoint {
  id: string
  device: string
  minWidth: number
  maxWidth?: number
  guidelines: string[]
  testCases: string[]
}

interface AccessibilityCheck {
  id: string
  element: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  passed: boolean
  issues: string[]
  fixes: string[]
}

interface DesignToken {
  id: string
  name: string
  value: string
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border'
  category: string
  platform: string[]
}

interface PrototypeLink {
  id: string
  name: string
  tool: 'figma' | 'sketch' | 'adobe-xd' | 'invision'
  url: string
  lastUpdated: string
  collaborators: string[]
}

interface DesignReview {
  id: string
  assetId: string
  reviewer: string
  feedback: string
  rating: number
  approved: boolean
  date: string
}

interface BrandAsset {
  id: string
  asset: string
  category: string
  approved: boolean
  restrictions: string[]
  downloadCount: number
}

export function CreativeLibrary() {
  const { addToast } = useApp()
  
  const [assets, setAssets] = useState<DesignAsset[]>([])
  const [systems, setSystems] = useState<DesignSystem[]>([])
  const [guides, setGuides] = useState<StyleGuide[]>([])
  const [components, setComponents] = useState<ComponentLibrary[]>([])
  const [templates, setTemplates] = useState<LayoutTemplate[]>([])
  const [palettes, setPalettes] = useState<ColorPalette[]>([])
  const [typography, setTypography] = useState<TypographyScale[]>([])
  const [icons, setIcons] = useState<IconSet[]>([])
  const [animations, setAnimations] = useState<AnimationLibrary[]>([])
  const [breakpoints, setBreakpoints] = useState<ResponsiveBreakpoint[]>([])
  const [accessibility, setAccessibility] = useState<AccessibilityCheck[]>([])
  const [tokens, setTokens] = useState<DesignToken[]>([])
  const [prototypes, setPrototypes] = useState<PrototypeLink[]>([])
  const [reviews, setReviews] = useState<DesignReview[]>([])
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])

  const [activeSection, setActiveSection] = useState('assets')

  useEffect(() => {
    const keys = ['assets', 'systems', 'guides', 'components', 'templates', 'palettes', 'typography', 'icons', 'animations', 'breakpoints', 'accessibility', 'tokens', 'prototypes', 'reviews', 'brandAssets']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`creativelibrary_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'assets': setAssets(data); break
          case 'systems': setSystems(data); break
          case 'guides': setGuides(data); break
          case 'components': setComponents(data); break
          case 'templates': setTemplates(data); break
          case 'palettes': setPalettes(data); break
          case 'typography': setTypography(data); break
          case 'icons': setIcons(data); break
          case 'animations': setAnimations(data); break
          case 'breakpoints': setBreakpoints(data); break
          case 'accessibility': setAccessibility(data); break
          case 'tokens': setTokens(data); break
          case 'prototypes': setPrototypes(data); break
          case 'reviews': setReviews(data); break
          case 'brandAssets': setBrandAssets(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('creativelibrary_assets', JSON.stringify(assets)) }, [assets])
  useEffect(() => { localStorage.setItem('creativelibrary_systems', JSON.stringify(systems)) }, [systems])
  useEffect(() => { localStorage.setItem('creativelibrary_guides', JSON.stringify(guides)) }, [guides])
  useEffect(() => { localStorage.setItem('creativelibrary_components', JSON.stringify(components)) }, [components])
  useEffect(() => { localStorage.setItem('creativelibrary_templates', JSON.stringify(templates)) }, [templates])
  useEffect(() => { localStorage.setItem('creativelibrary_palettes', JSON.stringify(palettes)) }, [palettes])
  useEffect(() => { localStorage.setItem('creativelibrary_typography', JSON.stringify(typography)) }, [typography])
  useEffect(() => { localStorage.setItem('creativelibrary_icons', JSON.stringify(icons)) }, [icons])
  useEffect(() => { localStorage.setItem('creativelibrary_animations', JSON.stringify(animations)) }, [animations])
  useEffect(() => { localStorage.setItem('creativelibrary_breakpoints', JSON.stringify(breakpoints)) }, [breakpoints])
  useEffect(() => { localStorage.setItem('creativelibrary_accessibility', JSON.stringify(accessibility)) }, [accessibility])
  useEffect(() => { localStorage.setItem('creativelibrary_tokens', JSON.stringify(tokens)) }, [tokens])
  useEffect(() => { localStorage.setItem('creativelibrary_prototypes', JSON.stringify(prototypes)) }, [prototypes])
  useEffect(() => { localStorage.setItem('creativelibrary_reviews', JSON.stringify(reviews)) }, [reviews])
  useEffect(() => { localStorage.setItem('creativelibrary_brandAssets', JSON.stringify(brandAssets)) }, [brandAssets])

  // AI Functions
  const calculateAccessibilityScore = (colors: {name: string, hex: string}[]): number => {
    let score = 100
    
    colors.forEach(color => {
      const hex = color.hex.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      
      if (luminance < 0.2 || luminance > 0.8) {
        // Good contrast potential
      } else {
        score -= 10
      }
    })
    
    return Math.max(0, Math.min(100, score))
  }

  const generateTypographyScale = (baseSize: number, ratio: number): {name: string, size: number, lineHeight: number}[] => {
    const scale = []
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']
    
    sizes.forEach((name, idx) => {
      const multiplier = Math.pow(ratio, idx - 2)
      const size = Math.round(baseSize * multiplier * 10) / 10
      const lineHeight = Math.round(size * 1.5 * 10) / 10
      
      scale.push({name, size, lineHeight})
    })
    
    return scale
  }

  const calculateContrastRatio = (color1: string, color2: string): number => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.replace('#', ''), 16)
      const r = ((rgb >> 16) & 0xff) / 255
      const g = ((rgb >> 8) & 0xff) / 255
      const b = (rgb & 0xff) / 255
      
      const [rL, gL, bL] = [r, g, b].map(c => 
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      )
      
      return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL
    }
    
    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    
    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  const assessWCAGCompliance = (contrastRatio: number, textSize: 'small' | 'large'): 'A' | 'AA' | 'AAA' | 'fail' => {
    if (textSize === 'large') {
      if (contrastRatio >= 4.5) return 'AAA'
      if (contrastRatio >= 3) return 'AA'
      return 'fail'
    } else {
      if (contrastRatio >= 7) return 'AAA'
      if (contrastRatio >= 4.5) return 'AA'
      if (contrastRatio >= 3) return 'A'
      return 'fail'
    }
  }

  const calculateComponentReusability = (variants: number, usageCount: number): number => {
    let score = 30
    score += Math.min(40, variants * 10)
    score += Math.min(30, Math.log10(usageCount + 1) * 15)
    return Math.round(score)
  }

  const assessAssetOptimization = (fileSize: number, type: string): {optimized: boolean, recommendation: string} => {
    let maxSize = 1000000 // 1MB default
    
    if (type === 'icon') maxSize = 10000
    else if (type === 'logo') maxSize = 50000
    else if (type === 'photo') maxSize = 500000
    
    const optimized = fileSize <= maxSize
    const recommendation = optimized 
      ? 'File size is optimal' 
      : `Consider reducing file size by ${Math.round((fileSize - maxSize) / 1000)}KB`
    
    return {optimized, recommendation}
  }

  // CRUD Functions
  const addAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newAsset: DesignAsset = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as DesignAsset['type'],
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
      version: '1.0',
      fileSize: parseInt(formData.get('fileSize') as string),
      dimensions: formData.get('dimensions') as string,
      usageCount: 0
    }
    
    setAssets([...assets, newAsset])
    addToast('Design asset added', 'success')
    e.currentTarget.reset()
  }

  const addPalette = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const primary = (formData.get('primary') as string).split(',').map(c => c.trim())
    const secondary = (formData.get('secondary') as string).split(',').map(c => c.trim())
    
    const accessibility = calculateAccessibilityScore([
      ...primary.map(hex => ({name: 'primary', hex})),
      ...secondary.map(hex => ({name: 'secondary', hex}))
    ])
    
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      primary,
      secondary,
      accent: [],
      neutral: [],
      accessibility
    }
    
    setPalettes([...palettes, newPalette])
    addToast(`Palette created - ${accessibility}% accessible`, 'success')
    e.currentTarget.reset()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Design Studio</h1>
          <p className={styles.subtitle}>Centralized design system and asset management</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'assets' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('assets')}>Design Assets</button>
          <button className={`${styles.navItem} ${activeSection === 'system' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('system')}>Design System</button>
          <button className={`${styles.navItem} ${activeSection === 'guide' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('guide')}>Style Guide</button>
          <button className={`${styles.navItem} ${activeSection === 'components' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('components')}>Component Library</button>
          <button className={`${styles.navItem} ${activeSection === 'templates' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('templates')}>Layout Templates</button>
          <button className={`${styles.navItem} ${activeSection === 'colors' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('colors')}>Color Palettes</button>
          <button className={`${styles.navItem} ${activeSection === 'typography' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('typography')}>Typography Scale</button>
          <button className={`${styles.navItem} ${activeSection === 'icons' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('icons')}>Icon Sets</button>
          <button className={`${styles.navItem} ${activeSection === 'animations' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('animations')}>Animation Library</button>
          <button className={`${styles.navItem} ${activeSection === 'responsive' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('responsive')}>Responsive Breakpoints</button>
          <button className={`${styles.navItem} ${activeSection === 'accessibility' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('accessibility')}>Accessibility</button>
          <button className={`${styles.navItem} ${activeSection === 'tokens' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('tokens')}>Design Tokens</button>
          <button className={`${styles.navItem} ${activeSection === 'prototypes' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('prototypes')}>Prototype Links</button>
          <button className={`${styles.navItem} ${activeSection === 'reviews' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('reviews')}>Design Reviews</button>
          <button className={`${styles.navItem} ${activeSection === 'brand' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('brand')}>Brand Assets</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'assets' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Design Assets</h2>
                <p>Centralized repository for all design files</p>
              </div>

              <form onSubmit={addAsset} className={styles.form}>
                <input name="name" placeholder="Asset name" required className={styles.input} />
                <select name="type" required className={styles.select}>
                  <option value="">Asset type</option>
                  <option value="logo">Logo</option>
                  <option value="icon">Icon</option>
                  <option value="illustration">Illustration</option>
                  <option value="photo">Photo</option>
                  <option value="mockup">Mockup</option>
                </select>
                <input name="tags" placeholder="Tags (comma-separated)" className={styles.input} />
                <input name="fileSize" type="number" placeholder="File size (bytes)" required className={styles.input} />
                <input name="dimensions" placeholder="Dimensions (e.g., 1920x1080)" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Add Asset</button>
              </form>

              <div className={styles.assetsGrid}>
                {assets.map(asset => (
                  <div key={asset.id} className={styles.assetCard}>
                    <div className={styles.assetType}>{asset.type}</div>
                    <h3>{asset.name}</h3>
                    <div className={styles.assetMeta}>
                      <span className={styles.version}>v{asset.version}</span>
                      <span className={styles.dimensions}>{asset.dimensions}</span>
                      <span className={styles.fileSize}>{(asset.fileSize / 1000).toFixed(1)}KB</span>
                    </div>
                    <div className={styles.tags}>
                      {asset.tags.map((tag, idx) => (
                        <span key={idx} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    <div className={styles.usage}>Used {asset.usageCount} times</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'colors' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Color Palettes</h2>
                <p>Brand-approved color systems with accessibility scoring</p>
              </div>

              <form onSubmit={addPalette} className={styles.form}>
                <input name="name" placeholder="Palette name" required className={styles.input} />
                <input name="primary" placeholder="Primary colors (hex, comma-separated)" required className={styles.input} />
                <input name="secondary" placeholder="Secondary colors (hex, comma-separated)" className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Create Palette</button>
              </form>

              <div className={styles.palettesGrid}>
                {palettes.map(palette => (
                  <div key={palette.id} className={styles.paletteCard}>
                    <h3>{palette.name}</h3>
                    <div className={styles.accessibilityScore}>
                      <span className={styles.score}>{palette.accessibility}%</span>
                      <span className={styles.label}>Accessible</span>
                    </div>
                    <div className={styles.colorSection}>
                      <strong>Primary</strong>
                      <div className={styles.colorSwatches}>
                        {palette.primary.map((color, idx) => (
                          <div 
                            key={idx} 
                            className={styles.swatch} 
                            style={{backgroundColor: color}}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>
                    {palette.secondary.length > 0 && (
                      <div className={styles.colorSection}>
                        <strong>Secondary</strong>
                        <div className={styles.colorSwatches}>
                          {palette.secondary.map((color, idx) => (
                            <div 
                              key={idx} 
                              className={styles.swatch} 
                              style={{backgroundColor: color}}
                              title={color}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
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
