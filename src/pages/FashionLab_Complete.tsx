import { useState, useEffect } from 'react'
import styles from './Fashion.module.css'

// ============================================================================
// TYPES
// ============================================================================

interface Design {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  designIntent: string
  status: 'Concept' | 'Prototype' | 'Final'
  createdAt: string
  pipelineStage: string
  notes: string
}

interface Material {
  id: string
  name: string
  supplier: string
  costPerYard: number
  moq: number
  sustainabilityScore: number
  notes: string
  createdAt: string
}

interface TechPack {
  id: string
  designId: string
  measurements: Record<string, string>
  fabricSpecs: string
  trimSpecs: string
  labels: string
  careInstructions: string
  packagingNotes: string
  createdAt: string
}

interface Collection {
  id: string
  name: string
  theme: string
  colorStory: string
  dropDate: string
  products: string[]
  pricingTiers: Record<string, number>
  createdAt: string
}

interface Drop {
  id: string
  name: string
  type: 'Limited' | 'Preorder' | 'Standard'
  releaseDate: string
  hypePlan: string
  inventoryLimit: number
  createdAt: string
}

interface IPRecord {
  id: string
  designId: string
  timestamp: string
  ownership: Record<string, number>
  collaborators: string[]
  versionHistory: string[]
}

const PIPELINE_STAGES = ['Design', 'Prototype', 'Sample', 'Fit Test', 'Finalize', 'Production', 'Shipping']

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Fashion() {
  const [activeSection, setActiveSection] = useState<string>('design-studio')
  const [searchQuery, setSearchQuery] = useState('')

  // State
  const [designs, setDesigns] = useState<Design[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [techPacks, setTechPacks] = useState<TechPack[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [drops, setDrops] = useState<Drop[]>([])
  const [ipRecords, setIpRecords] = useState<IPRecord[]>([])

  // UI State
  const [showDesignForm, setShowDesignForm] = useState(false)
  const [editingDesign, setEditingDesign] = useState<Design | null>(null)
  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [showTechPackForm, setShowTechPackForm] = useState(false)
  const [showCollectionForm, setShowCollectionForm] = useState(false)
  const [showDropForm, setShowDropForm] = useState(false)
  const [critiqueInput, setCritiqueInput] = useState('')
  const [critiqueResult, setCritiqueResult] = useState<any>(null)

  // Load from localStorage
  useEffect(() => {
    const loadedDesigns = localStorage.getItem('fashionlab_designs')
    const loadedMaterials = localStorage.getItem('fashionlab_materials')
    const loadedTechPacks = localStorage.getItem('fashionlab_techpacks')
    const loadedCollections = localStorage.getItem('fashionlab_collections')
    const loadedDrops = localStorage.getItem('fashionlab_drops')
    const loadedIPRecords = localStorage.getItem('fashionlab_iprecords')

    if (loadedDesigns) setDesigns(JSON.parse(loadedDesigns))
    if (loadedMaterials) setMaterials(JSON.parse(loadedMaterials))
    if (loadedTechPacks) setTechPacks(JSON.parse(loadedTechPacks))
    if (loadedCollections) setCollections(JSON.parse(loadedCollections))
    if (loadedDrops) setDrops(JSON.parse(loadedDrops))
    if (loadedIPRecords) setIpRecords(JSON.parse(loadedIPRecords))
  }, [])

  // Save to localStorage
  useEffect(() => { localStorage.setItem('fashionlab_designs', JSON.stringify(designs)) }, [designs])
  useEffect(() => { localStorage.setItem('fashionlab_materials', JSON.stringify(materials)) }, [materials])
  useEffect(() => { localStorage.setItem('fashionlab_techpacks', JSON.stringify(techPacks)) }, [techPacks])
  useEffect(() => { localStorage.setItem('fashionlab_collections', JSON.stringify(collections)) }, [collections])
  useEffect(() => { localStorage.setItem('fashionlab_drops', JSON.stringify(drops)) }, [drops])
  useEffect(() => { localStorage.setItem('fashionlab_iprecords', JSON.stringify(ipRecords)) }, [ipRecords])

  // Design Functions
  const addDesign = (design: Omit<Design, 'id' | 'createdAt'>) => {
    const newDesign: Design = { ...design, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setDesigns([newDesign, ...designs])
    setShowDesignForm(false)
    
    const ipRecord: IPRecord = {
      id: Date.now().toString(),
      designId: newDesign.id,
      timestamp: new Date().toISOString(),
      ownership: { 'You': 100 },
      collaborators: [],
      versionHistory: ['v1.0 - Initial design']
    }
    setIpRecords([ipRecord, ...ipRecords])
  }

  const updateDesign = (id: string, updates: Partial<Design>) => {
    setDesigns(designs.map(d => d.id === id ? { ...d, ...updates } : d))
    setEditingDesign(null)
  }

  const deleteDesign = (id: string) => {
    if (confirm('Delete this design?')) setDesigns(designs.filter(d => d.id !== id))
  }

  // Material Functions
  const addMaterial = (material: Omit<Material, 'id' | 'createdAt'>) => {
    const newMaterial: Material = { ...material, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setMaterials([newMaterial, ...materials])
    setShowMaterialForm(false)
  }

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, ...updates } : m))
    setEditingMaterial(null)
  }

  const deleteMaterial = (id: string) => {
    if (confirm('Delete this material?')) setMaterials(materials.filter(m => m.id !== id))
  }

  // Tech Pack Functions
  const addTechPack = (techPack: Omit<TechPack, 'id' | 'createdAt'>) => {
    const newTechPack: TechPack = { ...techPack, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setTechPacks([newTechPack, ...techPacks])
    setShowTechPackForm(false)
  }

  const exportTechPackPDF = (techPack: TechPack) => {
    const design = designs.find(d => d.id === techPack.designId)
    const printWindow = window.open('', '', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>Tech Pack - ${design?.name || 'Unknown'}</title>
        <style>body{font-family:Arial,sans-serif;padding:40px}h1{border-bottom:2px solid #000;padding-bottom:10px}.section{margin:20px 0}.label{font-weight:bold;margin-top:10px}</style>
        </head><body><h1>Tech Pack: ${design?.name || 'Unknown'}</h1>
        <div class="section"><div class="label">Measurements:</div><pre>${JSON.stringify(techPack.measurements, null, 2)}</pre></div>
        <div class="section"><div class="label">Fabric Specs:</div><p>${techPack.fabricSpecs}</p></div>
        <div class="section"><div class="label">Trim Specs:</div><p>${techPack.trimSpecs}</p></div>
        <div class="section"><div class="label">Labels:</div><p>${techPack.labels}</p></div>
        <div class="section"><div class="label">Care Instructions:</div><p>${techPack.careInstructions}</p></div>
        <div class="section"><div class="label">Packaging:</div><p>${techPack.packagingNotes}</p></div>
        </body></html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Collection Functions
  const addCollection = (collection: Omit<Collection, 'id' | 'createdAt'>) => {
    const newCollection: Collection = { ...collection, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setCollections([newCollection, ...collections])
    setShowCollectionForm(false)
  }

  const deleteCollection = (id: string) => {
    if (confirm('Delete this collection?')) setCollections(collections.filter(c => c.id !== id))
  }

  // Drop Functions
  const addDrop = (drop: Omit<Drop, 'id' | 'createdAt'>) => {
    const newDrop: Drop = { ...drop, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setDrops([newDrop, ...drops])
    setShowDropForm(false)
  }

  const deleteDrop = (id: string) => {
    if (confirm('Delete this drop?')) setDrops(drops.filter(d => d.id !== id))
  }

  // AI Critique
  const runAICritique = () => {
    if (!critiqueInput.trim()) return
    const words = critiqueInput.toLowerCase().split(' ')
    const colorScore = words.some(w => ['color', 'palette', 'tone'].includes(w)) ? 85 + Math.floor(Math.random() * 15) : 70 + Math.floor(Math.random() * 20)
    const brandScore = words.some(w => ['minimal', 'clean', 'technical'].includes(w)) ? 90 + Math.floor(Math.random() * 10) : 60 + Math.floor(Math.random() * 30)
    const fitScore = words.some(w => ['fit', 'tailored', 'structured'].includes(w)) ? 88 + Math.floor(Math.random() * 12) : 65 + Math.floor(Math.random() * 25)
    const marketScore = words.length > 15 ? 85 + Math.floor(Math.random() * 15) : 70 + Math.floor(Math.random() * 20)

    setCritiqueResult({
      colorBalance: colorScore,
      brandAlignment: brandScore,
      fitSuggestions: fitScore >= 85 ? 'Excellent structural design' : 'Consider refining proportions',
      marketFit: marketScore,
      suggestions: [
        colorScore < 80 ? 'Simplify color palette for stronger brand identity' : 'Color palette shows strong coherence',
        brandScore < 80 ? 'Align closer to minimal technical aesthetic' : 'Perfect brand alignment',
        fitScore < 80 ? 'Focus on precision tailoring' : 'Fit concept is strong'
      ]
    })
  }

  // Trend Drift
  const calculateTrendDrift = () => {
    const totalDesigns = designs.length
    const minimalDesigns = designs.filter(d => d.category.toLowerCase().includes('minimal')).length
    const technicalDesigns = designs.filter(d => d.tags.some(t => t.toLowerCase().includes('technical'))).length
    const driftScore = totalDesigns > 0 ? Math.round(((minimalDesigns + technicalDesigns) / totalDesigns) * 100) : 0

    return {
      driftScore,
      brandIdentityScore: driftScore,
      suggestions: driftScore > 75 
        ? ['Maintain current direction', 'Strong brand consistency']
        : ['Increase focus on minimal aesthetic', 'Reduce trend chasing', 'Strengthen core identity']
    }
  }

  // Export IP Registry
  const exportIPLedger = (record: IPRecord) => {
    const design = designs.find(d => d.id === record.designId)
    const printWindow = window.open('', '', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>IP Ledger - ${design?.name || 'Unknown'}</title>
        <style>body{font-family:Arial,sans-serif;padding:40px}h1{border-bottom:2px solid #000;padding-bottom:10px}.section{margin:20px 0}.label{font-weight:bold}</style>
        </head><body><h1>IP Ledger: ${design?.name || 'Unknown'}</h1>
        <div class="section"><div class="label">Timestamp:</div><p>${new Date(record.timestamp).toLocaleString()}</p></div>
        <div class="section"><div class="label">Ownership:</div><pre>${JSON.stringify(record.ownership, null, 2)}</pre></div>
        <div class="section"><div class="label">Collaborators:</div><p>${record.collaborators.join(', ') || 'None'}</p></div>
        <div class="section"><div class="label">Version History:</div><ul>${record.versionHistory.map(v => `<li>${v}</li>`).join('')}</ul></div>
        </body></html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Filtered data
  const filteredDesigns = designs.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredMaterials = materials.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCountdown = (date: string) => {
    const now = new Date()
    const target = new Date(date)
    const diff = target.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days` : 'Released'
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Fashion Lab</h1>
        <p className={styles.subtitle}>Complete fashion design and production system</p>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          {['design-studio', 'material-library', 'production-pipeline', 'tech-pack', 'collection-builder', 'drop-planner', 'trend-drift', 'ai-critique', 'ip-registry'].map(section => (
            <button
              key={section}
              className={`${styles.navItem} ${activeSection === section ? styles.navItemActive : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {section.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </nav>

        <div className={styles.mainContent}>
          {/* DESIGN STUDIO */}
          {activeSection === 'design-studio' && (
            <DesignStudioSection
              designs={filteredDesigns}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showForm={showDesignForm}
              setShowForm={setShowDesignForm}
              addDesign={addDesign}
              updateDesign={updateDesign}
              deleteDesign={deleteDesign}
              editingDesign={editingDesign}
              setEditingDesign={setEditingDesign}
            />
          )}

          {/* MATERIAL LIBRARY */}
          {activeSection === 'material-library' && (
            <MaterialLibrarySection
              materials={filteredMaterials}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showForm={showMaterialForm}
              setShowForm={setShowMaterialForm}
              addMaterial={addMaterial}
              updateMaterial={updateMaterial}
              deleteMaterial={deleteMaterial}
              editingMaterial={editingMaterial}
              setEditingMaterial={setEditingMaterial}
            />
          )}

          {/* PRODUCTION PIPELINE */}
          {activeSection === 'production-pipeline' && (
            <ProductionPipelineSection designs={designs} updateDesign={updateDesign} />
          )}

          {/* TECH PACK BUILDER */}
          {activeSection === 'tech-pack' && (
            <TechPackBuilderSection
              techPacks={techPacks}
              designs={designs}
              showForm={showTechPackForm}
              setShowForm={setShowTechPackForm}
              addTechPack={addTechPack}
              exportTechPackPDF={exportTechPackPDF}
            />
          )}

          {/* COLLECTION BUILDER */}
          {activeSection === 'collection-builder' && (
            <CollectionBuilderSection
              collections={collections}
              designs={designs}
              showForm={showCollectionForm}
              setShowForm={setShowCollectionForm}
              addCollection={addCollection}
              deleteCollection={deleteCollection}
            />
          )}

          {/* DROP PLANNER */}
          {activeSection === 'drop-planner' && (
            <DropPlannerSection
              drops={drops}
              showForm={showDropForm}
              setShowForm={setShowDropForm}
              addDrop={addDrop}
              deleteDrop={deleteDrop}
              getCountdown={getCountdown}
            />
          )}

          {/* TREND DRIFT MONITOR */}
          {activeSection === 'trend-drift' && (
            <TrendDriftMonitorSection calculateTrendDrift={calculateTrendDrift} />
          )}

          {/* AI FASHION CRITIQUE */}
          {activeSection === 'ai-critique' && (
            <AIFashionCritiqueSection
              input={critiqueInput}
              setInput={setCritiqueInput}
              result={critiqueResult}
              runCritique={runAICritique}
            />
          )}

          {/* IP REGISTRY */}
          {activeSection === 'ip-registry' && (
            <IPRegistrySection ipRecords={ipRecords} designs={designs} exportIPLedger={exportIPLedger} />
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function DesignStudioSection({ designs, searchQuery, setSearchQuery, showForm, setShowForm, addDesign, updateDesign, deleteDesign, editingDesign, setEditingDesign }: any) {
  const [formData, setFormData] = useState<any>({
    name: '', category: 'minimal', description: '', tags: [], designIntent: '', status: 'Concept', pipelineStage: 'Design', notes: ''
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingDesign) {
      updateDesign(editingDesign.id, formData)
    } else {
      addDesign(formData)
    }
    setFormData({ name: '', category: 'minimal', description: '', tags: [], designIntent: '', status: 'Concept', pipelineStage: 'Design', notes: '' })
    setShowForm(false)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  useEffect(() => {
    if (editingDesign) {
      setFormData(editingDesign)
      setShowForm(true)
    }
  }, [editingDesign])

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>Design Studio</h2><p className={styles.sectionSubtitle}>Create and manage fashion designs</p></div>
        <button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Design'}</button>
      </div>

      {!showForm && (
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search designs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
        </div>
      )}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Design Name*</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Category*</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={styles.select}>
                <option value="minimal">Minimal</option>
                <option value="streetwear">Streetwear</option>
                <option value="luxury">Luxury</option>
                <option value="technical">Technical</option>
                <option value="avant-garde">Avant-garde</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Status*</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={styles.select}>
                <option value="Concept">Concept</option>
                <option value="Prototype">Prototype</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Description*</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className={styles.textarea} rows={3} />
          </div>
          <div className={styles.formGroup}>
            <label>Design Intent</label>
            <textarea value={formData.designIntent} onChange={(e) => setFormData({ ...formData, designIntent: e.target.value })} className={styles.textarea} rows={3} />
          </div>
          <div className={styles.formGroup}>
            <label>Tags</label>
            <div className={styles.tagInput}>
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag" className={styles.input} />
              <button type="button" onClick={addTag} className={styles.secondaryBtn}>Add</button>
            </div>
            <div className={styles.tags}>
              {formData.tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>{tag} <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) })} className={styles.tagRemove}>×</button></span>
              ))}
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>{editingDesign ? 'Update' : 'Create'} Design</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingDesign(null) }} className={styles.secondaryBtn}>Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className={styles.grid}>
          {designs.map((design: Design) => (
            <div key={design.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={`${styles.badge} ${styles[design.status.toLowerCase()]}`}>{design.status}</span>
                <span className={styles.category}>{design.category}</span>
              </div>
              <h3>{design.name}</h3>
              <p className={styles.description}>{design.description}</p>
              {design.designIntent && <p className={styles.intent}><strong>Intent:</strong> {design.designIntent}</p>}
              <div className={styles.tags}>{design.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}</div>
              <div className={styles.cardActions}>
                <button onClick={() => setEditingDesign(design)} className={styles.secondaryBtn}>Edit</button>
                <button onClick={() => deleteDesign(design.id)} className={styles.dangerBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm && designs.length === 0 && <div className={styles.emptyState}><p>No designs yet. Create your first design.</p></div>}
    </div>
  )
}

function MaterialLibrarySection({ materials, searchQuery, setSearchQuery, showForm, setShowForm, addMaterial, updateMaterial, deleteMaterial, editingMaterial, setEditingMaterial }: any) {
  const [formData, setFormData] = useState<any>({ name: '', supplier: '', costPerYard: 0, moq: 0, sustainabilityScore: 0, notes: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, formData)
    } else {
      addMaterial(formData)
    }
    setFormData({ name: '', supplier: '', costPerYard: 0, moq: 0, sustainabilityScore: 0, notes: '' })
    setShowForm(false)
  }

  useEffect(() => {
    if (editingMaterial) {
      setFormData(editingMaterial)
      setShowForm(true)
    }
  }, [editingMaterial])

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>Material Library</h2><p className={styles.sectionSubtitle}>Manage fabrics and materials</p></div>
        <button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Material'}</button>
      </div>

      {!showForm && (
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
        </div>
      )}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Material Name*</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Supplier*</label>
              <input type="text" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Cost per Yard ($)*</label>
              <input type="number" step="0.01" value={formData.costPerYard} onChange={(e) => setFormData({ ...formData, costPerYard: parseFloat(e.target.value) })} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>MOQ*</label>
              <input type="number" value={formData.moq} onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) })} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Sustainability Score (0-100)</label>
              <input type="number" min="0" max="100" value={formData.sustainabilityScore} onChange={(e) => setFormData({ ...formData, sustainabilityScore: parseInt(e.target.value) })} className={styles.input} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={styles.textarea} rows={3} />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>{editingMaterial ? 'Update' : 'Add'} Material</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingMaterial(null) }} className={styles.secondaryBtn}>Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className={styles.grid}>
          {materials.map((material: Material) => (
            <div key={material.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{material.name}</h3>
                <span className={styles.sustainability}>Sustainability: {material.sustainabilityScore}/100</span>
              </div>
              <p className={styles.supplier}>Supplier: {material.supplier}</p>
              <div className={styles.materialInfo}>
                <div><span className={styles.label}>Cost/Yard</span><span className={styles.value}>${material.costPerYard}</span></div>
                <div><span className={styles.label}>MOQ</span><span className={styles.value}>{material.moq} yards</span></div>
              </div>
              {material.notes && <p className={styles.notes}>{material.notes}</p>}
              <div className={styles.cardActions}>
                <button onClick={() => setEditingMaterial(material)} className={styles.secondaryBtn}>Edit</button>
                <button onClick={() => deleteMaterial(material.id)} className={styles.dangerBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm && materials.length === 0 && <div className={styles.emptyState}><p>No materials yet. Add your first material.</p></div>}
    </div>
  )
}

function ProductionPipelineSection({ designs, updateDesign }: any) {
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [notes, setNotes] = useState('')

  const handleStageChange = (newStage: string) => {
    if (selectedDesign) {
      updateDesign(selectedDesign.id, { pipelineStage: newStage })
      setSelectedDesign({ ...selectedDesign, pipelineStage: newStage })
    }
  }

  const handleAddNote = () => {
    if (selectedDesign && notes.trim()) {
      const updatedNotes = selectedDesign.notes + '\n' + `[${new Date().toLocaleString()}] ${notes}`
      updateDesign(selectedDesign.id, { notes: updatedNotes })
      setSelectedDesign({ ...selectedDesign, notes: updatedNotes })
      setNotes('')
    }
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>Production Pipeline</h2><p className={styles.sectionSubtitle}>Track design progression through production stages</p></div>
      </div>

      <div className={styles.pipelineContainer}>
        <div className={styles.designList}>
          <h3>Designs</h3>
          {designs.map((design: Design) => (
            <div key={design.id} className={`${styles.pipelineDesignItem} ${selectedDesign?.id === design.id ? styles.active : ''}`} onClick={() => setSelectedDesign(design)}>
              <div className={styles.pipelineDesignName}>{design.name}</div>
              <div className={styles.pipelineDesignStage}>{design.pipelineStage || 'Design'}</div>
            </div>
          ))}
          {designs.length === 0 && <p className={styles.emptyMessage}>No designs available</p>}
        </div>

        {selectedDesign && (
          <div className={styles.pipelineDetails}>
            <h3>{selectedDesign.name}</h3>
            <p className={styles.description}>{selectedDesign.description}</p>
            <div className={styles.stageSelector}>
              <label>Current Stage:</label>
              <div className={styles.stages}>
                {PIPELINE_STAGES.map((stage) => (
                  <button key={stage} className={`${styles.stageBtn} ${selectedDesign.pipelineStage === stage ? styles.active : ''}`} onClick={() => handleStageChange(stage)}>{stage}</button>
                ))}
              </div>
            </div>
            <div className={styles.notesSection}>
              <h4>Pipeline Notes</h4>
              <div className={styles.notesList}>
                {selectedDesign.notes ? <pre className={styles.notesDisplay}>{selectedDesign.notes}</pre> : <p className={styles.emptyMessage}>No notes yet</p>}
              </div>
              <div className={styles.addNote}>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add a note..." className={styles.textarea} rows={3} />
                <button onClick={handleAddNote} className={styles.primaryBtn}>Add Note</button>
              </div>
            </div>
          </div>
        )}

        {!selectedDesign && designs.length > 0 && <div className={styles.pipelineDetails}><p className={styles.emptyMessage}>Select a design to view pipeline details</p></div>}
      </div>
    </div>
  )
}

function TechPackBuilderSection({ techPacks, designs, showForm, setShowForm, addTechPack, exportTechPackPDF }: any) {
  const [formData, setFormData] = useState<any>({ designId: '', measurements: {}, fabricSpecs: '', trimSpecs: '', labels: '', careInstructions: '', packagingNotes: '' })
  const [measurementKey, setMeasurementKey] = useState('')
  const [measurementValue, setMeasurementValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTechPack(formData)
    setFormData({ designId: '', measurements: {}, fabricSpecs: '', trimSpecs: '', labels: '', careInstructions: '', packagingNotes: '' })
  }

  const addMeasurement = () => {
    if (measurementKey.trim() && measurementValue.trim()) {
      setFormData({ ...formData, measurements: { ...formData.measurements, [measurementKey]: measurementValue } })
      setMeasurementKey('')
      setMeasurementValue('')
    }
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>Tech Pack Builder</h2><p className={styles.sectionSubtitle}>Create technical specification documents</p></div>
        <button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Tech Pack'}</button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Select Design*</label>
            <select value={formData.designId} onChange={(e) => setFormData({ ...formData, designId: e.target.value })} required className={styles.select}>
              <option value="">Choose a design</option>
              {designs.map((design: Design) => <option key={design.id} value={design.id}>{design.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Measurements</label>
            <div className={styles.measurementInput}>
              <input type="text" value={measurementKey} onChange={(e) => setMeasurementKey(e.target.value)} placeholder="e.g., Chest" className={styles.input} />
              <input type="text" value={measurementValue} onChange={(e) => setMeasurementValue(e.target.value)} placeholder="e.g., 40 inches" className={styles.input} />
              <button type="button" onClick={addMeasurement} className={styles.secondaryBtn}>Add</button>
            </div>
            <div className={styles.measurements}>
              {Object.entries(formData.measurements).map(([key, value]) => (
                <div key={key} className={styles.measurementItem}>
                  <span><strong>{key}:</strong> {value as string}</span>
                  <button type="button" onClick={() => { const { [key]: removed, ...rest } = formData.measurements; setFormData({ ...formData, measurements: rest }) }} className={styles.removeBtn}>×</button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}><label>Fabric Specifications</label><textarea value={formData.fabricSpecs} onChange={(e) => setFormData({ ...formData, fabricSpecs: e.target.value })} className={styles.textarea} rows={3} /></div>
          <div className={styles.formGroup}><label>Trim Specifications</label><textarea value={formData.trimSpecs} onChange={(e) => setFormData({ ...formData, trimSpecs: e.target.value })} className={styles.textarea} rows={3} /></div>
          <div className={styles.formGroup}><label>Labels</label><textarea value={formData.labels} onChange={(e) => setFormData({ ...formData, labels: e.target.value })} className={styles.textarea} rows={2} /></div>
          <div className={styles.formGroup}><label>Care Instructions</label><textarea value={formData.careInstructions} onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })} className={styles.textarea} rows={2} /></div>
          <div className={styles.formGroup}><label>Packaging Notes</label><textarea value={formData.packagingNotes} onChange={(e) => setFormData({ ...formData, packagingNotes: e.target.value })} className={styles.textarea} rows={2} /></div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Create Tech Pack</button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.secondaryBtn}>Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className={styles.grid}>
          {techPacks.map((pack: TechPack) => {
            const design = designs.find((d: Design) => d.id === pack.designId)
            return (
              <div key={pack.id} className={styles.card}>
                <h3>Tech Pack: {design?.name || 'Unknown Design'}</h3>
                <p className={styles.meta}>Created: {new Date(pack.createdAt).toLocaleDateString()}</p>
                <div className={styles.techPackInfo}>
                  <div><span className={styles.label}>Measurements</span><span className={styles.value}>{Object.keys(pack.measurements).length} items</span></div>
                  <div><span className={styles.label}>Fabric Specs</span><span className={styles.value}>{pack.fabricSpecs ? 'Yes' : 'No'}</span></div>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => exportTechPackPDF(pack)} className={styles.primaryBtn}>Export PDF</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!showForm && techPacks.length === 0 && <div className={styles.emptyState}><p>No tech packs yet. Create your first tech pack.</p></div>}
    </div>
  )
}

function CollectionBuilderSection({ collections, designs, showForm, setShowForm, addCollection, deleteCollection }: any) {
  const [formData, setFormData] = useState<any>({ name: '', theme: '', colorStory: '', dropDate: '', products: [], pricingTiers: {} })
  const [tierName, setTierName] = useState('')
  const [tierPrice, setTierPrice] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCollection(formData)
    setFormData({ name: '', theme: '', colorStory: '', dropDate: '', products: [], pricingTiers: {} })
  }

  const toggleProduct = (productId: string) => {
    if (formData.products.includes(productId)) {
      setFormData({ ...formData, products: formData.products.filter((p: string) => p !== productId) })
    } else {
      setFormData({ ...formData, products: [...formData.products, productId] })
    }
  }

  const addPricingTier = () => {
    if (tierName.trim() && tierPrice > 0) {
      setFormData({ ...formData, pricingTiers: { ...formData.pricingTiers, [tierName]: tierPrice } })
      setTierName('')
      setTierPrice(0)
    }
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>Collection Builder</h2><p className={styles.sectionSubtitle}>Organize designs into collections</p></div>
        <button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Collection'}</button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}><label>Collection Name*</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={styles.input} /></div>
            <div className={styles.formGroup}><label>Drop Date</label><input type="date" value={formData.dropDate} onChange={(e) => setFormData({ ...formData, dropDate: e.target.value })} className={styles.input} /></div>
          </div>
          <div className={styles.formGroup}><label>Theme</label><input type="text" value={formData.theme} onChange={(e) => setFormData({ ...formData, theme: e.target.value })} className={styles.input} /></div>
          <div className={styles.formGroup}><label>Color Story</label><input type="text" value={formData.colorStory} onChange={(e) => setFormData({ ...formData, colorStory: e.target.value })} className={styles.input} /></div>
          <div className={styles.formGroup}>
            <label>Select Products</label>
            <div className={styles.productSelector}>
              {designs.map((design: Design) => (
                <label key={design.id} className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.products.includes(design.id)} onChange={() => toggleProduct(design.id)} /> {design.name}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Pricing Tiers</label>
            <div className={styles.measurementInput}>
              <input type="text" value={tierName} onChange={(e) => setTierName(e.target.value)} placeholder="Tier name" className={styles.input} />
              <input type="number" step="0.01" value={tierPrice} onChange={(e) => setTierPrice(parseFloat(e.target.value))} placeholder="Price" className={styles.input} />
              <button type="button" onClick={addPricingTier} className={styles.secondaryBtn}>Add</button>
            </div>
            <div className={styles.measurements}>
              {Object.entries(formData.pricingTiers).map(([name, price]) => (
                <div key={name} className={styles.measurementItem}>
                  <span><strong>{name}:</strong> ${String(price)}</span>
                  <button type="button" onClick={() => { const { [name]: removed, ...rest } = formData.pricingTiers; setFormData({ ...formData, pricingTiers: rest }) }} className={styles.removeBtn}>×</button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Create Collection</button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.secondaryBtn}>Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className={styles.grid}>
          {collections.map((collection: Collection) => (
            <div key={collection.id} className={styles.card}>
              <h3>{collection.name}</h3>
              {collection.theme && <p className={styles.theme}>Theme: {collection.theme}</p>}
              {collection.colorStory && <p className={styles.colorStory}>Colors: {collection.colorStory}</p>}
              <div className={styles.collectionInfo}>
                <div><span className={styles.label}>Products</span><span className={styles.value}>{collection.products.length}</span></div>
                <div><span className={styles.label}>Drop Date</span><span className={styles.value}>{collection.dropDate ? new Date(collection.dropDate).toLocaleDateString() : 'TBD'}</span></div>
              </div>
              {Object.keys(collection.pricingTiers).length > 0 && (
                <div className={styles.pricingTiers}>
                  <strong>Pricing:</strong>
                  {Object.entries(collection.pricingTiers).map(([name, price]) => <div key={name}>{name}: ${price}</div>)}
                </div>
              )}
              <div className={styles.cardActions}><button onClick={() => deleteCollection(collection.id)} className={styles.dangerBtn}>Delete</button></div>
            </div>
          ))}
        </div>
      )}

      {!showForm && collections.length === 0 && <div className={styles.emptyState}><p>No collections yet. Create your first collection.</p></div>}
    </div>
  )
}

function DropPlannerSection({ drops, showForm, setShowForm, addDrop, deleteDrop, getCountdown }: any) {
  const [formData, setFormData] = useState<any>({ name: '', type: 'Standard', releaseDate: '', hypePlan: '', inventoryLimit: 0 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addDrop(formData)
    setFormData({ name: '', type: 'Standard', releaseDate: '', hypePlan: '', inventoryLimit: 0 })
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>Drop Planner</h2><p className={styles.sectionSubtitle}>Schedule and manage product drops</p></div>
        <button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Drop'}</button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}><label>Drop Name*</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={styles.input} /></div>
            <div className={styles.formGroup}>
              <label>Drop Type*</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={styles.select}>
                <option value="Standard">Standard</option>
                <option value="Limited">Limited</option>
                <option value="Preorder">Preorder</option>
              </select>
            </div>
            <div className={styles.formGroup}><label>Release Date*</label><input type="date" value={formData.releaseDate} onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })} required className={styles.input} /></div>
            <div className={styles.formGroup}><label>Inventory Limit</label><input type="number" value={formData.inventoryLimit} onChange={(e) => setFormData({ ...formData, inventoryLimit: parseInt(e.target.value) })} className={styles.input} placeholder="0 = unlimited" /></div>
          </div>
          <div className={styles.formGroup}><label>Hype Plan</label><textarea value={formData.hypePlan} onChange={(e) => setFormData({ ...formData, hypePlan: e.target.value })} className={styles.textarea} rows={4} /></div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryBtn}>Create Drop</button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.secondaryBtn}>Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className={styles.grid}>
          {drops.map((drop: Drop) => (
            <div key={drop.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={`${styles.badge} ${styles[drop.type.toLowerCase()]}`}>{drop.type}</span>
                <span className={styles.countdown}>{getCountdown(drop.releaseDate)}</span>
              </div>
              <h3>{drop.name}</h3>
              <p className={styles.releaseDate}>Release: {new Date(drop.releaseDate).toLocaleDateString()}</p>
              {drop.inventoryLimit > 0 && <p className={styles.inventory}>Limited to {drop.inventoryLimit} units</p>}
              {drop.hypePlan && <p className={styles.hypePlan}>{drop.hypePlan}</p>}
              <div className={styles.cardActions}><button onClick={() => deleteDrop(drop.id)} className={styles.dangerBtn}>Delete</button></div>
            </div>
          ))}
        </div>
      )}

      {!showForm && drops.length === 0 && <div className={styles.emptyState}><p>No drops scheduled. Create your first drop.</p></div>}
    </div>
  )
}

function TrendDriftMonitorSection({ calculateTrendDrift }: any) {
  const driftData = calculateTrendDrift()

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>Trend Drift Monitor</h2><p className={styles.sectionSubtitle}>Analyze brand consistency vs trend alignment</p></div>
      </div>

      <div className={styles.driftDashboard}>
        <div className={styles.driftScores}>
          <div className={styles.scoreCard}>
            <h3>Trend Drift Score</h3>
            <div className={styles.bigScore}>{driftData.driftScore}/100</div>
            <p className={styles.scoreDescription}>
              {driftData.driftScore > 75 ? 'Strong brand identity' : driftData.driftScore > 50 ? 'Moderate alignment' : 'High trend drift'}
            </p>
          </div>
          <div className={styles.scoreCard}>
            <h3>Brand Identity Score</h3>
            <div className={styles.bigScore}>{driftData.brandIdentityScore}/100</div>
            <p className={styles.scoreDescription}>Consistency with core aesthetic</p>
          </div>
        </div>

        <div className={styles.suggestions}>
          <h3>Recommendations</h3>
          <ul className={styles.suggestionList}>
            {driftData.suggestions.map((suggestion: string, index: number) => <li key={index}>{suggestion}</li>)}
          </ul>
        </div>

        <div className={styles.driftInfo}>
          <p>This monitor compares your design output against your brand's core identity. Higher scores indicate stronger brand consistency.</p>
        </div>
      </div>
    </div>
  )
}

function AIFashionCritiqueSection({ input, setInput, result, runCritique }: any) {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>AI Fashion Critique</h2><p className={styles.sectionSubtitle}>Get intelligent design analysis and suggestions</p></div>
      </div>

      <div className={styles.critiqueContainer}>
        <div className={styles.critiqueInput}>
          <label>Describe Your Design</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={styles.textarea} rows={6} placeholder="Describe your design in detail: silhouette, materials, color palette, intended use, target audience..." />
          <button onClick={runCritique} className={styles.primaryBtn}>Run Critique</button>
        </div>

        {result && (
          <div className={styles.critiqueResults}>
            <h3>Analysis Results</h3>
            <div className={styles.critiqueScores}>
              <div className={styles.critiqueScore}>
                <span className={styles.scoreLabel}>Color Balance</span>
                <span className={styles.scoreValue}>{result.colorBalance}/100</span>
                <div className={styles.scoreBar}><div className={styles.scoreBarFill} style={{ width: `${result.colorBalance}%` }} /></div>
              </div>
              <div className={styles.critiqueScore}>
                <span className={styles.scoreLabel}>Brand Alignment</span>
                <span className={styles.scoreValue}>{result.brandAlignment}/100</span>
                <div className={styles.scoreBar}><div className={styles.scoreBarFill} style={{ width: `${result.brandAlignment}%` }} /></div>
              </div>
              <div className={styles.critiqueScore}>
                <span className={styles.scoreLabel}>Market Fit</span>
                <span className={styles.scoreValue}>{result.marketFit}/100</span>
                <div className={styles.scoreBar}><div className={styles.scoreBarFill} style={{ width: `${result.marketFit}%` }} /></div>
              </div>
            </div>
            <div className={styles.fitSuggestions}><h4>Fit Suggestions</h4><p>{result.fitSuggestions}</p></div>
            <div className={styles.suggestions}>
              <h4>Recommendations</h4>
              <ul className={styles.suggestionList}>{result.suggestions.map((suggestion: string, index: number) => <li key={index}>{suggestion}</li>)}</ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function IPRegistrySection({ ipRecords, designs, exportIPLedger }: any) {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <div><h2>IP Registry</h2><p className={styles.sectionSubtitle}>Design ownership and version tracking</p></div>
      </div>

      <div className={styles.grid}>
        {ipRecords.map((record: IPRecord) => {
          const design = designs.find((d: Design) => d.id === record.designId)
          return (
            <div key={record.id} className={styles.card}>
              <h3>{design?.name || 'Unknown Design'}</h3>
              <p className={styles.timestamp}>Registered: {new Date(record.timestamp).toLocaleString()}</p>
              <div className={styles.ownership}>
                <h4>Ownership</h4>
                {Object.entries(record.ownership).map(([owner, percentage]) => (
                  <div key={owner} className={styles.ownershipItem}><span>{owner}</span><span>{percentage}%</span></div>
                ))}
              </div>
              {record.collaborators.length > 0 && (
                <div className={styles.collaborators}><h4>Collaborators</h4><p>{record.collaborators.join(', ')}</p></div>
              )}
              <div className={styles.versionHistory}>
                <h4>Version History</h4>
                <ul>{record.versionHistory.map((version, index) => <li key={index}>{version}</li>)}</ul>
              </div>
              <div className={styles.cardActions}><button onClick={() => exportIPLedger(record)} className={styles.primaryBtn}>Export Ledger</button></div>
            </div>
          )
        })}
      </div>

      {ipRecords.length === 0 && <div className={styles.emptyState}><p>No IP records yet. Create a design to auto-generate IP records.</p></div>}
    </div>
  )
}
