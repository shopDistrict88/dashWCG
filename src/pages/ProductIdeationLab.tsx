import { useState } from 'react'
import styles from './Placeholder.module.css'

interface Concept {
  id: string
  title: string
  category: string
  description: string
  viability: number
  innovation: number
  marketFit: number
  status: 'exploring' | 'developing' | 'validated' | 'shelved'
}

export function ProductIdeationLab() {
  const [concepts] = useState<Concept[]>([
    {
      id: '1',
      title: 'Modular Outerwear System',
      category: 'Product Innovation',
      description: 'Interchangeable layers with universal attachment system',
      viability: 85,
      innovation: 92,
      marketFit: 78,
      status: 'developing',
    },
    {
      id: '2',
      title: 'Climate-Adaptive Textile',
      category: 'Material Science',
      description: 'Fabric that responds to temperature changes',
      viability: 62,
      innovation: 98,
      marketFit: 71,
      status: 'exploring',
    },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Product Ideation Lab</h1>
          <p className={styles.subtitle}>Concept development and innovation pipeline</p>
        </div>
        <button className={styles.primaryBtn}>New Concept</button>
      </div>

      <div className={styles.grid}>
        {concepts.map((concept) => (
          <div key={concept.id} className={styles.card}>
            <h3>{concept.title}</h3>
            <p className={styles.category}>{concept.category}</p>
            <p className={styles.description}>{concept.description}</p>
            <div className={styles.metrics}>
              <div>
                <span className={styles.label}>Viability</span>
                <span className={styles.value}>{concept.viability}%</span>
              </div>
              <div>
                <span className={styles.label}>Innovation</span>
                <span className={styles.value}>{concept.innovation}%</span>
              </div>
              <div>
                <span className={styles.label}>Market Fit</span>
                <span className={styles.value}>{concept.marketFit}%</span>
              </div>
            </div>
            <span className={`${styles.status} ${styles[concept.status]}`}>
              {concept.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
