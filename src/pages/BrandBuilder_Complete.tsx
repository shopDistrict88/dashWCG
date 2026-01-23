import { useState, useEffect } from 'react'
import styles from './BrandBuilder.module.css'

interface Brand {
  id: string
  name: string
  values: string[]
  tone: string[]
  personality: string[]
  maturityScore: number
  createdAt: string
}

interface LogoVersion {
  id: string
  brandId: string
  version: string
  date: string
  rationale: string
  imageUrl: string
}

interface SubBrand {
  id: string
  parentBrandId: string
  name: string
  relationship: string
  status: string
}

interface BrandRule {
  id: string
  brandId: string
  type: 'do' | 'dont'
  category: string
  rule: string
}

interface VoiceScenario {
  id: string
  brandId: string
  scenario: string
  response: string
  tone: string
  score: number
}

interface BrandAsset {
  id: string
  brandId: string
  name: string
  type: string
  version: string
  lastUpdated: string
  status: string
}

interface BrandDecision {
  id: string
  brandId: string
  decision: string
  rationale: string
  impact: string
  validated: boolean
  date: string
}

export default function BrandBuilder() {
  const [activeSection, setActiveSection] = useState('dna')
  
  // State
  const [brands, setBrands] = useState<Brand[]>([])
  const [logoVersions, setLogoVersions] = useState<LogoVersion[]>([])
  const [subBrands, setSubBrands] = useState<SubBrand[]>([])
  const [brandRules, setBrandRules] = useState<BrandRule[]>([])
  const [voiceScenarios, setVoiceScenarios] = useState<VoiceScenario[]>([])
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([])
  const [brandDecisions, setBrandDecisions] = useState<BrandDecision[]>([])
  
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [showBrandForm, setShowBrandForm] = useState(false)
  const [showLogoForm, setShowLogoForm] = useState(false)
  const [showSubBrandForm, setShowSubBrandForm] = useState(false)
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [showScenarioForm, setShowScenarioForm] = useState(false)
  const [showAssetForm, setShowAssetForm] = useState(false)
  const [showDecisionForm, setShowDecisionForm] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const loadedBrands = localStorage.getItem('brandbuilder_brands')
    const loadedLogos = localStorage.getItem('brandbuilder_logos')
    const loadedSubBrands = localStorage.getItem('brandbuilder_subbrands')
    const loadedRules = localStorage.getItem('brandbuilder_rules')
    const loadedScenarios = localStorage.getItem('brandbuilder_scenarios')
    const loadedAssets = localStorage.getItem('brandbuilder_assets')
    const loadedDecisions = localStorage.getItem('brandbuilder_decisions')

    if (loadedBrands) setBrands(JSON.parse(loadedBrands))
    if (loadedLogos) setLogoVersions(JSON.parse(loadedLogos))
    if (loadedSubBrands) setSubBrands(JSON.parse(loadedSubBrands))
    if (loadedRules) setBrandRules(JSON.parse(loadedRules))
    if (loadedScenarios) setVoiceScenarios(JSON.parse(loadedScenarios))
    if (loadedAssets) setBrandAssets(JSON.parse(loadedAssets))
    if (loadedDecisions) setBrandDecisions(JSON.parse(loadedDecisions))
  }, [])

  // Save to localStorage
  useEffect(() => { localStorage.setItem('brandbuilder_brands', JSON.stringify(brands)) }, [brands])
  useEffect(() => { localStorage.setItem('brandbuilder_logos', JSON.stringify(logoVersions)) }, [logoVersions])
  useEffect(() => { localStorage.setItem('brandbuilder_subbrands', JSON.stringify(subBrands)) }, [subBrands])
  useEffect(() => { localStorage.setItem('brandbuilder_rules', JSON.stringify(brandRules)) }, [brandRules])
  useEffect(() => { localStorage.setItem('brandbuilder_scenarios', JSON.stringify(voiceScenarios)) }, [voiceScenarios])
  useEffect(() => { localStorage.setItem('brandbuilder_assets', JSON.stringify(brandAssets)) }, [brandAssets])
  useEffect(() => { localStorage.setItem('brandbuilder_decisions', JSON.stringify(brandDecisions)) }, [brandDecisions])

  // CRUD Functions
  const addBrand = (brand: Omit<Brand, 'id' | 'createdAt' | 'maturityScore'>) => {
    const newBrand: Brand = {
      ...brand,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      maturityScore: calculateMaturityScore(brand)
    }
    setBrands([newBrand, ...brands])
    setSelectedBrand(newBrand.id)
    setShowBrandForm(false)
  }

  const deleteBrand = (id: string) => {
    if (confirm('Delete this brand? This will remove all associated data.')) {
      setBrands(brands.filter(b => b.id !== id))
      setLogoVersions(logoVersions.filter(l => l.brandId !== id))
      setSubBrands(subBrands.filter(s => s.parentBrandId !== id))
      setBrandRules(brandRules.filter(r => r.brandId !== id))
      setVoiceScenarios(voiceScenarios.filter(v => v.brandId !== id))
      setBrandAssets(brandAssets.filter(a => a.brandId !== id))
      setBrandDecisions(brandDecisions.filter(d => d.brandId !== id))
      if (selectedBrand === id) setSelectedBrand('')
    }
  }

  const addLogoVersion = (logo: Omit<LogoVersion, 'id'>) => {
    const newLogo: LogoVersion = { ...logo, id: Date.now().toString() }
    setLogoVersions([newLogo, ...logoVersions])
    setShowLogoForm(false)
  }

  const deleteLogoVersion = (id: string) => {
    if (confirm('Delete this logo version?')) setLogoVersions(logoVersions.filter(l => l.id !== id))
  }

  const addSubBrand = (subBrand: Omit<SubBrand, 'id'>) => {
    const newSubBrand: SubBrand = { ...subBrand, id: Date.now().toString() }
    setSubBrands([newSubBrand, ...subBrands])
    setShowSubBrandForm(false)
  }

  const deleteSubBrand = (id: string) => {
    if (confirm('Delete this sub-brand?')) setSubBrands(subBrands.filter(s => s.id !== id))
  }

  const addBrandRule = (rule: Omit<BrandRule, 'id'>) => {
    const newRule: BrandRule = { ...rule, id: Date.now().toString() }
    setBrandRules([newRule, ...brandRules])
    setShowRuleForm(false)
  }

  const deleteBrandRule = (id: string) => {
    setBrandRules(brandRules.filter(r => r.id !== id))
  }

  const addVoiceScenario = (scenario: Omit<VoiceScenario, 'id' | 'score'>) => {
    const score = calculateVoiceScore(scenario.response, scenario.tone)
    const newScenario: VoiceScenario = { ...scenario, id: Date.now().toString(), score }
    setVoiceScenarios([newScenario, ...voiceScenarios])
    setShowScenarioForm(false)
  }

  const deleteVoiceScenario = (id: string) => {
    setVoiceScenarios(voiceScenarios.filter(v => v.id !== id))
  }

  const addBrandAsset = (asset: Omit<BrandAsset, 'id'>) => {
    const newAsset: BrandAsset = { ...asset, id: Date.now().toString() }
    setBrandAssets([newAsset, ...brandAssets])
    setShowAssetForm(false)
  }

  const deleteBrandAsset = (id: string) => {
    if (confirm('Delete this asset?')) setBrandAssets(brandAssets.filter(a => a.id !== id))
  }

  const addBrandDecision = (decision: Omit<BrandDecision, 'id'>) => {
    const newDecision: BrandDecision = { ...decision, id: Date.now().toString() }
    setBrandDecisions([newDecision, ...brandDecisions])
    setShowDecisionForm(false)
  }

  const validateDecision = (id: string) => {
    setBrandDecisions(brandDecisions.map(d => d.id === id ? { ...d, validated: !d.validated } : d))
  }

  const deleteBrandDecision = (id: string) => {
    setBrandDecisions(brandDecisions.filter(d => d.id !== id))
  }

  // AI Functions
  const calculateMaturityScore = (brand: Partial<Brand>): number => {
    let score = 0
    if (brand.values && brand.values.length >= 3) score += 20
    if (brand.tone && brand.tone.length >= 3) score += 20
    if (brand.personality && brand.personality.length >= 3) score += 20
    const rules = brandRules.filter(r => r.brandId === brand.id)
    if (rules.length >= 10) score += 20
    const assets = brandAssets.filter(a => a.brandId === brand.id)
    if (assets.length >= 5) score += 20
    return Math.min(score, 100)
  }

  const calculateVoiceScore = (response: string, targetTone: string): number => {
    let score = 50
    const words = response.toLowerCase().split(' ')
    
    if (targetTone === 'professional' && words.some(w => ['expertise', 'quality', 'precision'].includes(w))) score += 20
    if (targetTone === 'casual' && words.some(w => ['hey', 'cool', 'awesome'].includes(w))) score += 20
    if (targetTone === 'luxury' && words.some(w => ['exquisite', 'refined', 'exceptional'].includes(w))) score += 20
    
    if (words.length > 20 && words.length < 50) score += 15
    if (response.includes('!') || response.includes('?')) score += 15
    
    return Math.min(score, 100)
  }

  const checkVisualConsistency = (): number => {
    if (!selectedBrand) return 0
    const brandLogos = logoVersions.filter(l => l.brandId === selectedBrand)
    const brandAssetsList = brandAssets.filter(a => a.brandId === selectedBrand)
    
    let score = 70
    if (brandLogos.length >= 3) score += 10
    if (brandAssetsList.length >= 10) score += 10
    if (brandRules.filter(r => r.brandId === selectedBrand && r.category === 'visual').length >= 5) score += 10
    
    return Math.min(score, 100)
  }

  const calculateLifespanForecast = (): string => {
    if (!selectedBrand) return 'Select a brand'
    const brand = brands.find(b => b.id === selectedBrand)
    if (!brand) return 'N/A'
    
    if (brand.maturityScore >= 80) return '10+ years (Strong foundation)'
    if (brand.maturityScore >= 60) return '5-10 years (Developing)'
    if (brand.maturityScore >= 40) return '3-5 years (Early stage)'
    return '1-3 years (Needs work)'
  }

  const getEmotionMapping = (): string[] => {
    if (!selectedBrand) return []
    const brand = brands.find(b => b.id === selectedBrand)
    if (!brand) return []
    
    const emotions: string[] = []
    if (brand.values.some(v => v.toLowerCase().includes('trust'))) emotions.push('Trustworthy')
    if (brand.values.some(v => v.toLowerCase().includes('innov'))) emotions.push('Innovative')
    if (brand.tone.some(t => t.toLowerCase().includes('friendly'))) emotions.push('Approachable')
    if (brand.personality.some(p => p.toLowerCase().includes('bold'))) emotions.push('Confident')
    
    return emotions.length > 0 ? emotions : ['Neutral', 'Professional']
  }

  const getCulturalRelevance = (): number => {
    if (!selectedBrand) return 0
    const brand = brands.find(b => b.id === selectedBrand)
    if (!brand) return 0
    
    let score = 60
    const decisions = brandDecisions.filter(d => d.brandId === selectedBrand)
    if (decisions.length >= 5) score += 20
    if (brand.values.some(v => v.toLowerCase().includes('diversity') || v.toLowerCase().includes('inclusion'))) score += 20
    
    return Math.min(score, 100)
  }

  const currentBrand = brands.find(b => b.id === selectedBrand)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Identity OS</h1>
          <p className={styles.subtitle}>Strategic brand architecture & intelligence system</p>
        </div>
        <button onClick={() => setShowBrandForm(true)} className={styles.primaryBtn}>+ New Brand</button>
      </div>

      {/* Brand Selector */}
      <div className={styles.brandSelector}>
        <label>Active Brand:</label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className={styles.select}>
          <option value="">Select Brand</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        {currentBrand && (
          <div className={styles.brandMeta}>
            <span className={styles.maturityBadge}>Maturity: {currentBrand.maturityScore}/100</span>
            <button onClick={() => deleteBrand(currentBrand.id)} className={styles.dangerBtn}>Delete Brand</button>
          </div>
        )}
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          {['dna', 'consistency', 'logo-evolution', 'naming', 'rules', 'voice-testing', 'positioning', 'emotions', 'cultural', 'lifespan', 'multi-brand', 'guidelines', 'decisions', 'assets'].map(section => (
            <button
              key={section}
              className={`${styles.navItem} ${activeSection === section ? styles.navItemActive : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {section.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </nav>

        <main className={styles.mainContent}>
          {/* DNA GENERATOR */}
          {activeSection === 'dna' && (
            <DNASection
              brands={brands}
              selectedBrand={selectedBrand}
              showForm={showBrandForm}
              setShowForm={setShowBrandForm}
              addBrand={addBrand}
              currentBrand={currentBrand}
            />
          )}

          {/* VISUAL CONSISTENCY */}
          {activeSection === 'consistency' && (
            <ConsistencySection
              selectedBrand={selectedBrand}
              consistencyScore={checkVisualConsistency()}
              brandAssets={brandAssets.filter(a => a.brandId === selectedBrand)}
              brandRules={brandRules.filter(r => r.brandId === selectedBrand && r.category === 'visual')}
            />
          )}

          {/* LOGO EVOLUTION */}
          {activeSection === 'logo-evolution' && (
            <LogoEvolutionSection
              selectedBrand={selectedBrand}
              logoVersions={logoVersions.filter(l => l.brandId === selectedBrand)}
              showForm={showLogoForm}
              setShowForm={setShowLogoForm}
              addLogoVersion={addLogoVersion}
              deleteLogoVersion={deleteLogoVersion}
            />
          )}

          {/* NAMING & SUB-BRANDS */}
          {activeSection === 'naming' && (
            <NamingSection
              selectedBrand={selectedBrand}
              subBrands={subBrands.filter(s => s.parentBrandId === selectedBrand)}
              showForm={showSubBrandForm}
              setShowForm={setShowSubBrandForm}
              addSubBrand={addSubBrand}
              deleteSubBrand={deleteSubBrand}
            />
          )}

          {/* BRAND RULES */}
          {activeSection === 'rules' && (
            <RulesSection
              selectedBrand={selectedBrand}
              brandRules={brandRules.filter(r => r.brandId === selectedBrand)}
              showForm={showRuleForm}
              setShowForm={setShowRuleForm}
              addBrandRule={addBrandRule}
              deleteBrandRule={deleteBrandRule}
            />
          )}

          {/* VOICE STRESS TESTING */}
          {activeSection === 'voice-testing' && (
            <VoiceTestingSection
              selectedBrand={selectedBrand}
              scenarios={voiceScenarios.filter(v => v.brandId === selectedBrand)}
              showForm={showScenarioForm}
              setShowForm={setShowScenarioForm}
              addVoiceScenario={addVoiceScenario}
              deleteVoiceScenario={deleteVoiceScenario}
            />
          )}

          {/* POSITIONING MAP */}
          {activeSection === 'positioning' && (
            <PositioningSection selectedBrand={selectedBrand} currentBrand={currentBrand} />
          )}

          {/* EMOTION MAPPING */}
          {activeSection === 'emotions' && (
            <EmotionSection selectedBrand={selectedBrand} emotions={getEmotionMapping()} />
          )}

          {/* CULTURAL RELEVANCE */}
          {activeSection === 'cultural' && (
            <CulturalSection selectedBrand={selectedBrand} relevanceScore={getCulturalRelevance()} />
          )}

          {/* LIFESPAN FORECAST */}
          {activeSection === 'lifespan' && (
            <LifespanSection selectedBrand={selectedBrand} forecast={calculateLifespanForecast()} currentBrand={currentBrand} />
          )}

          {/* MULTI-BRAND */}
          {activeSection === 'multi-brand' && (
            <MultiBrandSection brands={brands} subBrands={subBrands} />
          )}

          {/* GUIDELINES */}
          {activeSection === 'guidelines' && (
            <GuidelinesSection selectedBrand={selectedBrand} currentBrand={currentBrand} brandRules={brandRules.filter(r => r.brandId === selectedBrand)} />
          )}

          {/* DECISIONS */}
          {activeSection === 'decisions' && (
            <DecisionsSection
              selectedBrand={selectedBrand}
              decisions={brandDecisions.filter(d => d.brandId === selectedBrand)}
              showForm={showDecisionForm}
              setShowForm={setShowDecisionForm}
              addBrandDecision={addBrandDecision}
              validateDecision={validateDecision}
              deleteBrandDecision={deleteBrandDecision}
            />
          )}

          {/* ASSET VERSION CONTROL */}
          {activeSection === 'assets' && (
            <AssetsSection
              selectedBrand={selectedBrand}
              assets={brandAssets.filter(a => a.brandId === selectedBrand)}
              showForm={showAssetForm}
              setShowForm={setShowAssetForm}
              addBrandAsset={addBrandAsset}
              deleteBrandAsset={deleteBrandAsset}
            />
          )}
        </main>
      </div>
    </div>
  )
}

// SUB-COMPONENTS

function DNASection({ brands, selectedBrand, showForm, setShowForm, addBrand, currentBrand }: any) {
  const [formData, setFormData] = useState({ name: '', values: [''], tone: [''], personality: [''] })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return
    addBrand({
      name: formData.name,
      values: formData.values.filter(v => v.trim()),
      tone: formData.tone.filter(t => t.trim()),
      personality: formData.personality.filter(p => p.trim())
    })
    setFormData({ name: '', values: [''], tone: [''], personality: [''] })
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Brand DNA Generator</h2>
        <p className={styles.subtitle}>Define core values, tone, and personality</p>
      </div>

      {currentBrand && !showForm && (
        <div className={styles.dnaDisplay}>
          <div className={styles.dnaGroup}>
            <h3>Core Values</h3>
            <div className={styles.tagList}>
              {currentBrand.values.map((value: string, idx: number) => (
                <span key={idx} className={styles.tag}>{value}</span>
              ))}
            </div>
          </div>
          <div className={styles.dnaGroup}>
            <h3>Tone Attributes</h3>
            <div className={styles.tagList}>
              {currentBrand.tone.map((t: string, idx: number) => (
                <span key={idx} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>
          <div className={styles.dnaGroup}>
            <h3>Personality Traits</h3>
            <div className={styles.tagList}>
              {currentBrand.personality.map((p: string, idx: number) => (
                <span key={idx} className={styles.tag}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Brand Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={styles.input} required />
          </div>
          
          <div className={styles.formGroup}>
            <label>Core Values (3-5)</label>
            {formData.values.map((value, idx) => (
              <input key={idx} type="text" value={value} onChange={(e) => {
                const newValues = [...formData.values]
                newValues[idx] = e.target.value
                setFormData({ ...formData, values: newValues })
              }} className={styles.input} placeholder="e.g., Innovation, Trust, Quality" />
            ))}
            <button type="button" onClick={() => setFormData({ ...formData, values: [...formData.values, ''] })} className={styles.secondaryBtn}>+ Add Value</button>
          </div>

          <div className={styles.formGroup}>
            <label>Tone Attributes (3-5)</label>
            {formData.tone.map((t, idx) => (
              <input key={idx} type="text" value={t} onChange={(e) => {
                const newTone = [...formData.tone]
                newTone[idx] = e.target.value
                setFormData({ ...formData, tone: newTone })
              }} className={styles.input} placeholder="e.g., Professional, Friendly, Bold" />
            ))}
            <button type="button" onClick={() => setFormData({ ...formData, tone: [...formData.tone, ''] })} className={styles.secondaryBtn}>+ Add Tone</button>
          </div>

          <div className={styles.formGroup}>
            <label>Personality Traits (3-5)</label>
            {formData.personality.map((p, idx) => (
              <input key={idx} type="text" value={p} onChange={(e) => {
                const newPersonality = [...formData.personality]
                newPersonality[idx] = e.target.value
                setFormData({ ...formData, personality: newPersonality })
              }} className={styles.input} placeholder="e.g., Energetic, Thoughtful, Precise" />
            ))}
            <button type="button" onClick={() => setFormData({ ...formData, personality: [...formData.personality, ''] })} className={styles.secondaryBtn}>+ Add Trait</button>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Create Brand DNA</button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.secondaryBtn}>Cancel</button>
          </div>
        </form>
      )}

      {!selectedBrand && !showForm && (
        <div className={styles.emptyState}>
          <p>Create a brand to define its DNA</p>
        </div>
      )}
    </div>
  )
}

function ConsistencySection({ selectedBrand, consistencyScore, brandAssets, brandRules }: any) {
  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to check visual consistency</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Visual Consistency Checker</h2>
        <p className={styles.subtitle}>Automated brand coherence analysis</p>
      </div>

      <div className={styles.scoreCard}>
        <div className={styles.bigScore}>{consistencyScore}/100</div>
        <p className={styles.scoreLabel}>Visual Consistency Score</p>
        <div className={styles.scoreBar}>
          <div className={styles.scoreBarFill} style={{ width: `${consistencyScore}%` }} />
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{brandAssets.length}</div>
          <div className={styles.metricLabel}>Brand Assets</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{brandRules.length}</div>
          <div className={styles.metricLabel}>Visual Rules</div>
        </div>
      </div>

      <div className={styles.recommendations}>
        <h3>Recommendations</h3>
        <ul>
          {consistencyScore < 70 && <li>Add more visual guidelines to maintain consistency</li>}
          {brandAssets.length < 10 && <li>Upload more brand assets for better tracking</li>}
          {brandRules.length < 5 && <li>Define visual do/don't rules</li>}
          {consistencyScore >= 90 && <li>Excellent consistency! Maintain current standards.</li>}
        </ul>
      </div>
    </div>
  )
}

function LogoEvolutionSection({ selectedBrand, logoVersions, showForm, setShowForm, addLogoVersion, deleteLogoVersion }: any) {
  const [formData, setFormData] = useState({ version: '', date: '', rationale: '', imageUrl: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBrand) return
    addLogoVersion({ ...formData, brandId: selectedBrand })
    setFormData({ version: '', date: '', rationale: '', imageUrl: '' })
  }

  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to manage logo evolution</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Logo Evolution Timeline</h2>
        <p className={styles.subtitle}>Track design iterations and rationale</p>
        <button onClick={() => setShowForm(!showForm)} className={styles.primaryBtn}>{showForm ? 'Cancel' : '+ Add Version'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Version</label>
              <input type="text" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} className={styles.input} placeholder="v1.0, v2.0" required />
            </div>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={styles.input} required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Rationale</label>
            <textarea value={formData.rationale} onChange={(e) => setFormData({ ...formData, rationale: e.target.value })} className={styles.textarea} rows={3} placeholder="Why this change?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Image URL (optional)</label>
            <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className={styles.input} placeholder="https://..." />
          </div>
          <button type="submit" className={styles.primaryBtn}>Add Version</button>
        </form>
      )}

      <div className={styles.timeline}>
        {logoVersions.map((logo: LogoVersion) => (
          <div key={logo.id} className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <h3>{logo.version}</h3>
                <span className={styles.timelineDate}>{new Date(logo.date).toLocaleDateString()}</span>
              </div>
              <p>{logo.rationale}</p>
              {logo.imageUrl && <img src={logo.imageUrl} alt={logo.version} className={styles.timelineImage} />}
              <button onClick={() => deleteLogoVersion(logo.id)} className={styles.dangerBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm && logoVersions.length === 0 && (
        <div className={styles.emptyState}><p>No logo versions yet. Add your first version to track evolution.</p></div>
      )}
    </div>
  )
}

function NamingSection({ selectedBrand, subBrands, showForm, setShowForm, addSubBrand, deleteSubBrand }: any) {
  const [formData, setFormData] = useState({ name: '', relationship: '', status: 'concept' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBrand) return
    addSubBrand({ ...formData, parentBrandId: selectedBrand })
    setFormData({ name: '', relationship: '', status: 'concept' })
  }

  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to manage sub-brands</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Naming & Sub-Brand Generator</h2>
        <p className={styles.subtitle}>Manage brand family architecture</p>
        <button onClick={() => setShowForm(!showForm)} className={styles.primaryBtn}>{showForm ? 'Cancel' : '+ New Sub-Brand'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Sub-Brand Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Relationship to Parent</label>
            <input type="text" value={formData.relationship} onChange={(e) => setFormData({ ...formData, relationship: e.target.value })} className={styles.input} placeholder="e.g., Premium line, Youth edition" required />
          </div>
          <div className={styles.formGroup}>
            <label>Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={styles.select}>
              <option value="concept">Concept</option>
              <option value="development">Development</option>
              <option value="active">Active</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <button type="submit" className={styles.primaryBtn}>Create Sub-Brand</button>
        </form>
      )}

      <div className={styles.grid}>
        {subBrands.map((sub: SubBrand) => (
          <div key={sub.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{sub.name}</h3>
              <span className={`${styles.statusBadge} ${styles[`status${sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}`]}`}>{sub.status}</span>
            </div>
            <p className={styles.relationship}>{sub.relationship}</p>
            <button onClick={() => deleteSubBrand(sub.id)} className={styles.dangerBtn}>Delete</button>
          </div>
        ))}
      </div>

      {!showForm && subBrands.length === 0 && (
        <div className={styles.emptyState}><p>No sub-brands yet. Create one to expand your brand architecture.</p></div>
      )}
    </div>
  )
}

function RulesSection({ selectedBrand, brandRules, showForm, setShowForm, addBrandRule, deleteBrandRule }: any) {
  const [formData, setFormData] = useState({ type: 'do' as 'do' | 'dont', category: 'visual', rule: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBrand) return
    addBrandRule({ ...formData, brandId: selectedBrand })
    setFormData({ type: 'do', category: 'visual', rule: '' })
  }

  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to manage rules</p></div>

  const doRules = brandRules.filter((r: BrandRule) => r.type === 'do')
  const dontRules = brandRules.filter((r: BrandRule) => r.type === 'dont')

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Brand Do/Don't Rules Engine</h2>
        <p className={styles.subtitle}>Define brand standards and boundaries</p>
        <button onClick={() => setShowForm(!showForm)} className={styles.primaryBtn}>{showForm ? 'Cancel' : '+ Add Rule'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'do' | 'dont' })} className={styles.select}>
                <option value="do">Do</option>
                <option value="dont">Don't</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={styles.select}>
                <option value="visual">Visual</option>
                <option value="voice">Voice</option>
                <option value="messaging">Messaging</option>
                <option value="behavior">Behavior</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Rule</label>
            <textarea value={formData.rule} onChange={(e) => setFormData({ ...formData, rule: e.target.value })} className={styles.textarea} rows={2} placeholder="Describe the rule..." required />
          </div>
          <button type="submit" className={styles.primaryBtn}>Add Rule</button>
        </form>
      )}

      <div className={styles.rulesGrid}>
        <div className={styles.rulesColumn}>
          <h3 className={styles.rulesTitle}>✓ Do</h3>
          {doRules.map((rule: BrandRule) => (
            <div key={rule.id} className={styles.ruleCard}>
              <span className={styles.ruleCategory}>{rule.category}</span>
              <p>{rule.rule}</p>
              <button onClick={() => deleteBrandRule(rule.id)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
        <div className={styles.rulesColumn}>
          <h3 className={styles.rulesTitle}>✗ Don't</h3>
          {dontRules.map((rule: BrandRule) => (
            <div key={rule.id} className={styles.ruleCard}>
              <span className={styles.ruleCategory}>{rule.category}</span>
              <p>{rule.rule}</p>
              <button onClick={() => deleteBrandRule(rule.id)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VoiceTestingSection({ selectedBrand, scenarios, showForm, setShowForm, addVoiceScenario, deleteVoiceScenario }: any) {
  const [formData, setFormData] = useState({ scenario: '', response: '', tone: 'professional' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBrand) return
    addVoiceScenario({ ...formData, brandId: selectedBrand })
    setFormData({ scenario: '', response: '', tone: 'professional' })
  }

  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to test voice scenarios</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Voice Stress-Test Scenarios</h2>
        <p className={styles.subtitle}>Test brand voice in challenging situations</p>
        <button onClick={() => setShowForm(!showForm)} className={styles.primaryBtn}>{showForm ? 'Cancel' : '+ New Scenario'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Scenario</label>
            <textarea value={formData.scenario} onChange={(e) => setFormData({ ...formData, scenario: e.target.value })} className={styles.textarea} rows={2} placeholder="Describe the challenging scenario..." required />
          </div>
          <div className={styles.formGroup}>
            <label>Brand Response</label>
            <textarea value={formData.response} onChange={(e) => setFormData({ ...formData, response: e.target.value })} className={styles.textarea} rows={3} placeholder="How would your brand respond?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Target Tone</label>
            <select value={formData.tone} onChange={(e) => setFormData({ ...formData, tone: e.target.value })} className={styles.select}>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="luxury">Luxury</option>
              <option value="playful">Playful</option>
            </select>
          </div>
          <button type="submit" className={styles.primaryBtn}>Test Scenario</button>
        </form>
      )}

      <div className={styles.scenariosGrid}>
        {scenarios.map((scenario: VoiceScenario) => (
          <div key={scenario.id} className={styles.scenarioCard}>
            <div className={styles.scenarioHeader}>
              <h4>Scenario</h4>
              <span className={styles.scoreChip}>{scenario.score}/100</span>
            </div>
            <p className={styles.scenarioText}>{scenario.scenario}</p>
            <div className={styles.scenarioResponse}>
              <h4>Response</h4>
              <p>{scenario.response}</p>
            </div>
            <div className={styles.scenarioMeta}>
              <span className={styles.toneBadge}>{scenario.tone}</span>
              <button onClick={() => deleteVoiceScenario(scenario.id)} className={styles.dangerBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm && scenarios.length === 0 && (
        <div className={styles.emptyState}><p>No voice scenarios yet. Create one to test brand consistency.</p></div>
      )}
    </div>
  )
}

function PositioningSection({ selectedBrand, currentBrand }: any) {
  if (!selectedBrand || !currentBrand) return <div className={styles.emptyState}><p>Select a brand to view positioning</p></div>

  const competitors = ['Competitor A', 'Competitor B', 'Competitor C', 'Your Brand']
  const axes = { x: 'Premium ← → Accessible', y: 'Traditional ← → Innovative' }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Competitive Brand Positioning Map</h2>
        <p className={styles.subtitle}>Visual market positioning analysis</p>
      </div>

      <div className={styles.positioningMap}>
        <div className={styles.mapYAxis}>{axes.y.split(' ← → ')[1]}</div>
        <div className={styles.mapGrid}>
          {competitors.map((comp, idx) => (
            <div
              key={idx}
              className={`${styles.mapPoint} ${comp === 'Your Brand' ? styles.mapPointActive : ''}`}
              style={{
                left: `${25 + idx * 20}%`,
                top: `${30 + idx * 15}%`
              }}
            >
              {comp}
            </div>
          ))}
        </div>
        <div className={styles.mapYAxis}>{axes.y.split(' ← → ')[0]}</div>
        <div className={styles.mapXAxis}>
          <span>{axes.x.split(' ← → ')[0]}</span>
          <span>{axes.x.split(' ← → ')[1]}</span>
        </div>
      </div>

      <div className={styles.positioningInsights}>
        <h3>Positioning Insights</h3>
        <ul>
          <li>Your brand occupies a unique position in the {currentBrand.values[0]?.toLowerCase()} space</li>
          <li>Clear differentiation from traditional competitors</li>
          <li>Opportunity to own the {currentBrand.tone[0]?.toLowerCase()} tone segment</li>
        </ul>
      </div>
    </div>
  )
}

function EmotionSection({ selectedBrand, emotions }: any) {
  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to view emotion mapping</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Brand Emotion Mapping</h2>
        <p className={styles.subtitle}>Emotional associations and perceptions</p>
      </div>

      <div className={styles.emotionGrid}>
        {emotions.map((emotion: string, idx: number) => (
          <div key={idx} className={styles.emotionCard}>
            <div className={styles.emotionIcon}>💭</div>
            <h3>{emotion}</h3>
          </div>
        ))}
      </div>

      <div className={styles.emotionAnalysis}>
        <h3>Emotional Profile</h3>
        <p>Your brand evokes <strong>{emotions.length}</strong> distinct emotional responses. This creates a {emotions.length >= 4 ? 'rich and multifaceted' : 'focused and clear'} emotional connection with your audience.</p>
      </div>
    </div>
  )
}

function CulturalSection({ selectedBrand, relevanceScore }: any) {
  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to check cultural relevance</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Cultural Relevance Scanner</h2>
        <p className={styles.subtitle}>Assess cultural alignment and sensitivity</p>
      </div>

      <div className={styles.scoreCard}>
        <div className={styles.bigScore}>{relevanceScore}/100</div>
        <p className={styles.scoreLabel}>Cultural Relevance Score</p>
        <div className={styles.scoreBar}>
          <div className={styles.scoreBarFill} style={{ width: `${relevanceScore}%` }} />
        </div>
      </div>

      <div className={styles.culturalInsights}>
        <h3>Cultural Assessment</h3>
        <ul>
          {relevanceScore >= 80 && <li>Strong cultural alignment and awareness</li>}
          {relevanceScore < 80 && relevanceScore >= 60 && <li>Good foundation, room for deeper cultural engagement</li>}
          {relevanceScore < 60 && <li>Consider expanding cultural perspectives and values</li>}
          <li>Review brand decisions for cultural impact</li>
          <li>Monitor evolving cultural conversations</li>
        </ul>
      </div>
    </div>
  )
}

function LifespanSection({ selectedBrand, forecast, currentBrand }: any) {
  if (!selectedBrand || !currentBrand) return <div className={styles.emptyState}><p>Select a brand to view lifespan forecast</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Brand Lifespan Forecast</h2>
        <p className={styles.subtitle}>Predict brand longevity and sustainability</p>
      </div>

      <div className={styles.forecastCard}>
        <div className={styles.forecastValue}>{forecast}</div>
        <p className={styles.forecastLabel}>Projected Lifespan</p>
      </div>

      <div className={styles.lifespanFactors}>
        <h3>Longevity Factors</h3>
        <div className={styles.factorsList}>
          <div className={styles.factor}>
            <span className={styles.factorLabel}>Brand Maturity</span>
            <div className={styles.factorBar}>
              <div className={styles.factorBarFill} style={{ width: `${currentBrand.maturityScore}%` }} />
            </div>
            <span className={styles.factorValue}>{currentBrand.maturityScore}/100</span>
          </div>
          <div className={styles.factor}>
            <span className={styles.factorLabel}>Value Clarity</span>
            <div className={styles.factorBar}>
              <div className={styles.factorBarFill} style={{ width: `${Math.min(currentBrand.values.length * 20, 100)}%` }} />
            </div>
            <span className={styles.factorValue}>{Math.min(currentBrand.values.length * 20, 100)}/100</span>
          </div>
        </div>
      </div>

      <div className={styles.recommendations}>
        <h3>Longevity Recommendations</h3>
        <ul>
          {currentBrand.maturityScore < 60 && <li>Strengthen core brand foundations</li>}
          {currentBrand.values.length < 3 && <li>Define more core values for stability</li>}
          {currentBrand.maturityScore >= 80 && <li>Excellent foundation for long-term success</li>}
          <li>Regular brand health audits recommended</li>
        </ul>
      </div>
    </div>
  )
}

function MultiBrandSection({ brands, subBrands }: any) {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Multi-Brand Management</h2>
        <p className={styles.subtitle}>Portfolio overview and relationships</p>
      </div>

      <div className={styles.brandPortfolio}>
        {brands.map((brand: Brand) => {
          const brandSubs = subBrands.filter((s: SubBrand) => s.parentBrandId === brand.id)
          return (
            <div key={brand.id} className={styles.portfolioItem}>
              <div className={styles.portfolioHeader}>
                <h3>{brand.name}</h3>
                <span className={styles.maturityBadge}>{brand.maturityScore}/100</span>
              </div>
              {brandSubs.length > 0 && (
                <div className={styles.subBrandsList}>
                  <h4>Sub-Brands ({brandSubs.length})</h4>
                  {brandSubs.map((sub: SubBrand) => (
                    <span key={sub.id} className={styles.subBrandChip}>{sub.name}</span>
                  ))}
                </div>
              )}
              <div className={styles.brandMeta}>
                <span>{brand.values.length} values</span>
                <span>{brand.tone.length} tones</span>
                <span>{brand.personality.length} traits</span>
              </div>
            </div>
          )
        })}
      </div>

      {brands.length === 0 && (
        <div className={styles.emptyState}><p>No brands yet. Create your first brand to build a portfolio.</p></div>
      )}
    </div>
  )
}

function GuidelinesSection({ selectedBrand, currentBrand, brandRules }: any) {
  if (!selectedBrand || !currentBrand) return <div className={styles.emptyState}><p>Select a brand to view guidelines</p></div>

  const exportGuidelines = () => {
    const guidelines = {
      brand: currentBrand.name,
      values: currentBrand.values,
      tone: currentBrand.tone,
      personality: currentBrand.personality,
      rules: brandRules,
      exported: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(guidelines, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentBrand.name}-guidelines.json`
    a.click()
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Brand Guideline Auto-Updater</h2>
        <p className={styles.subtitle}>Living brand standards document</p>
        <button onClick={exportGuidelines} className={styles.primaryBtn}>Export Guidelines</button>
      </div>

      <div className={styles.guidelinesDoc}>
        <section className={styles.guidelineSection}>
          <h3>Brand Overview</h3>
          <p><strong>{currentBrand.name}</strong> - Maturity Score: {currentBrand.maturityScore}/100</p>
        </section>

        <section className={styles.guidelineSection}>
          <h3>Core Values</h3>
          <ul>
            {currentBrand.values.map((value: string, idx: number) => (
              <li key={idx}>{value}</li>
            ))}
          </ul>
        </section>

        <section className={styles.guidelineSection}>
          <h3>Tone & Voice</h3>
          <div className={styles.tagList}>
            {currentBrand.tone.map((t: string, idx: number) => (
              <span key={idx} className={styles.tag}>{t}</span>
            ))}
          </div>
        </section>

        <section className={styles.guidelineSection}>
          <h3>Brand Rules ({brandRules.length})</h3>
          <p>See Rules section for complete do/don't guidelines</p>
        </section>

        <section className={styles.guidelineSection}>
          <h3>Last Updated</h3>
          <p>{new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  )
}

function DecisionsSection({ selectedBrand, decisions, showForm, setShowForm, addBrandDecision, validateDecision, deleteBrandDecision }: any) {
  const [formData, setFormData] = useState({ decision: '', rationale: '', impact: '', validated: false, date: new Date().toISOString().split('T')[0] })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBrand) return
    addBrandDecision({ ...formData, brandId: selectedBrand })
    setFormData({ decision: '', rationale: '', impact: '', validated: false, date: new Date().toISOString().split('T')[0] })
  }

  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to track decisions</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Brand Decision Validator</h2>
        <p className={styles.subtitle}>Document and validate strategic choices</p>
        <button onClick={() => setShowForm(!showForm)} className={styles.primaryBtn}>{showForm ? 'Cancel' : '+ New Decision'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Decision</label>
            <input type="text" value={formData.decision} onChange={(e) => setFormData({ ...formData, decision: e.target.value })} className={styles.input} placeholder="What decision was made?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Rationale</label>
            <textarea value={formData.rationale} onChange={(e) => setFormData({ ...formData, rationale: e.target.value })} className={styles.textarea} rows={3} placeholder="Why this decision?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Expected Impact</label>
            <input type="text" value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: e.target.value })} className={styles.input} placeholder="What will change?" required />
          </div>
          <div className={styles.formGroup}>
            <label>Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={styles.input} required />
          </div>
          <button type="submit" className={styles.primaryBtn}>Log Decision</button>
        </form>
      )}

      <div className={styles.decisionsGrid}>
        {decisions.map((decision: BrandDecision) => (
          <div key={decision.id} className={`${styles.decisionCard} ${decision.validated ? styles.validated : ''}`}>
            <div className={styles.decisionHeader}>
              <h3>{decision.decision}</h3>
              <button onClick={() => validateDecision(decision.id)} className={styles.validateBtn}>
                {decision.validated ? '✓ Validated' : 'Validate'}
              </button>
            </div>
            <div className={styles.decisionBody}>
              <div className={styles.decisionSection}>
                <h4>Rationale</h4>
                <p>{decision.rationale}</p>
              </div>
              <div className={styles.decisionSection}>
                <h4>Impact</h4>
                <p>{decision.impact}</p>
              </div>
            </div>
            <div className={styles.decisionFooter}>
              <span className={styles.decisionDate}>{new Date(decision.date).toLocaleDateString()}</span>
              <button onClick={() => deleteBrandDecision(decision.id)} className={styles.dangerBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm && decisions.length === 0 && (
        <div className={styles.emptyState}><p>No decisions logged yet. Start tracking strategic choices.</p></div>
      )}
    </div>
  )
}

function AssetsSection({ selectedBrand, assets, showForm, setShowForm, addBrandAsset, deleteBrandAsset }: any) {
  const [formData, setFormData] = useState({ name: '', type: '', version: 'v1.0', lastUpdated: new Date().toISOString().split('T')[0], status: 'active' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBrand) return
    addBrandAsset({ ...formData, brandId: selectedBrand })
    setFormData({ name: '', type: '', version: 'v1.0', lastUpdated: new Date().toISOString().split('T')[0], status: 'active' })
  }

  if (!selectedBrand) return <div className={styles.emptyState}><p>Select a brand to manage assets</p></div>

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>Brand Asset Version Control</h2>
        <p className={styles.subtitle}>Track and manage brand assets</p>
        <button onClick={() => setShowForm(!showForm)} className={styles.primaryBtn}>{showForm ? 'Cancel' : '+ Add Asset'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Asset Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={styles.input} placeholder="Logo, Color Palette, etc." required />
            </div>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={styles.select} required>
                <option value="">Select Type</option>
                <option value="logo">Logo</option>
                <option value="color">Color Palette</option>
                <option value="typography">Typography</option>
                <option value="imagery">Imagery</option>
                <option value="template">Template</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Version</label>
              <input type="text" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={styles.select}>
                <option value="active">Active</option>
                <option value="deprecated">Deprecated</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <button type="submit" className={styles.primaryBtn}>Add Asset</button>
        </form>
      )}

      <div className={styles.assetsGrid}>
        {assets.map((asset: BrandAsset) => (
          <div key={asset.id} className={styles.assetCard}>
            <div className={styles.assetHeader}>
              <h3>{asset.name}</h3>
              <span className={`${styles.statusBadge} ${styles[`status${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}`]}`}>{asset.status}</span>
            </div>
            <div className={styles.assetMeta}>
              <span className={styles.assetType}>{asset.type}</span>
              <span className={styles.assetVersion}>{asset.version}</span>
            </div>
            <div className={styles.assetFooter}>
              <span className={styles.assetDate}>Updated: {new Date(asset.lastUpdated).toLocaleDateString()}</span>
              <button onClick={() => deleteBrandAsset(asset.id)} className={styles.dangerBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm && assets.length === 0 && (
        <div className={styles.emptyState}><p>No assets tracked yet. Add your first brand asset.</p></div>
      )}
    </div>
  )
}
