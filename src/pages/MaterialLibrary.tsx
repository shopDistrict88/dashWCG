import { useState } from 'react'
import styles from './MaterialLibrary.module.css'

interface Material {
  id: string
  name: string
  type: 'fabric' | 'leather' | 'synthetic' | 'metal' | 'trim'
  supplier: string
  composition: string
  weight: string
  sustainability: number
  costPerMeter: number
  minimumOrder: number
  leadTime: string
  inStock: boolean
  collections: string[]
}

export function MaterialLibrary() {
  const [materials] = useState<Material[]>([
    {
      id: '1',
      name: 'Japanese Cotton Twill',
      type: 'fabric',
      supplier: 'Kurabo Industries',
      composition: '100% Organic Cotton',
      weight: '280 GSM',
      sustainability: 92,
      costPerMeter: 18.50,
      minimumOrder: 50,
      leadTime: '6-8 weeks',
      inStock: true,
      collections: ['Monochrome Foundation', 'Urban Restraint'],
    },
    {
      id: '2',
      name: 'Technical Ripstop',
      type: 'synthetic',
      supplier: 'Schoeller Textil AG',
      composition: '68% Polyamide, 32% Elastane',
      weight: '160 GSM',
      sustainability: 78,
      costPerMeter: 32.00,
      minimumOrder: 100,
      leadTime: '10-12 weeks',
      inStock: false,
      collections: ['Technical Silence'],
    },
    {
      id: '3',
      name: 'Italian Vegetable Tan Leather',
      type: 'leather',
      supplier: 'Conceria Walpier',
      composition: 'Full Grain Leather',
      weight: '1.2-1.4mm',
      sustainability: 85,
      costPerMeter: 45.00,
      minimumOrder: 25,
      leadTime: '8-10 weeks',
      inStock: true,
      collections: ['Monochrome Foundation'],
    },
  ])

  const [filterType, setFilterType] = useState<string>('all')

  const filteredMaterials = filterType === 'all' 
    ? materials 
    : materials.filter(m => m.type === filterType)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Material Library</h1>
          <p className={styles.subtitle}>Sourcing archive and supply chain intelligence</p>
        </div>
        <button className={styles.primaryBtn}>Add Material</button>
      </div>

      <div className={styles.filters}>
        <button 
          className={`${styles.filter} ${filterType === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Materials
        </button>
        <button 
          className={`${styles.filter} ${filterType === 'fabric' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('fabric')}
        >
          Fabric
        </button>
        <button 
          className={`${styles.filter} ${filterType === 'leather' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('leather')}
        >
          Leather
        </button>
        <button 
          className={`${styles.filter} ${filterType === 'synthetic' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('synthetic')}
        >
          Synthetic
        </button>
        <button 
          className={`${styles.filter} ${filterType === 'metal' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('metal')}
        >
          Metal
        </button>
        <button 
          className={`${styles.filter} ${filterType === 'trim' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('trim')}
        >
          Trim
        </button>
      </div>

      <div className={styles.materialsList}>
        {filteredMaterials.map((material) => (
          <div key={material.id} className={styles.materialCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3>{material.name}</h3>
                <p className={styles.supplier}>{material.supplier}</p>
              </div>
              <span className={`${styles.stockBadge} ${material.inStock ? styles.inStock : styles.outOfStock}`}>
                {material.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className={styles.specs}>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Type</span>
                <span className={styles.specValue}>{material.type}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Composition</span>
                <span className={styles.specValue}>{material.composition}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Weight</span>
                <span className={styles.specValue}>{material.weight}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Lead Time</span>
                <span className={styles.specValue}>{material.leadTime}</span>
              </div>
            </div>

            <div className={styles.sustainability}>
              <span className={styles.sustainLabel}>Sustainability Score</span>
              <div className={styles.sustainBar}>
                <div 
                  className={styles.sustainFill}
                  style={{ width: `${material.sustainability}%` }}
                />
              </div>
              <span className={styles.sustainValue}>{material.sustainability}/100</span>
            </div>

            <div className={styles.pricing}>
              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Cost per meter</span>
                <span className={styles.priceValue}>${material.costPerMeter.toFixed(2)}</span>
              </div>
              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Minimum order</span>
                <span className={styles.priceValue}>{material.minimumOrder}m</span>
              </div>
            </div>

            <div className={styles.collections}>
              <span className={styles.collectionsLabel}>Used in:</span>
              <div className={styles.collectionTags}>
                {material.collections.map((collection, idx) => (
                  <span key={idx} className={styles.collectionTag}>{collection}</span>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.secondaryBtn}>View Details</button>
              <button className={styles.secondaryBtn}>Order Sample</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
