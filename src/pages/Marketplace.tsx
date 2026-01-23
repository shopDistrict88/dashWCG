import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Marketplace.module.css'

interface ServiceListing {
  id: string
  title: string
  category: string
  budget: string
  provider: string
  rating: number
  status: 'available' | 'booked'
}

export function Marketplace() {
  const { addToast } = useApp()
  const [services] = useState<ServiceListing[]>([
    { id: '1', title: 'Brand Identity Design', category: 'Design', budget: '$1,500-$3,000', provider: 'Design Studio Pro', rating: 4.8, status: 'available' },
    { id: '2', title: 'Website Development', category: 'Development', budget: '$3,000-$8,000', provider: 'Tech Squad', rating: 4.6, status: 'available' },
    { id: '3', title: 'Photography Package', category: 'Photography', budget: '$800-$2,000', provider: 'Visual Creatives', rating: 4.9, status: 'booked' },
    { id: '4', title: 'Content Writing', category: 'Content', budget: '$500-$1,500', provider: 'Copy Masters', rating: 4.7, status: 'available' },
  ])
  const [filterCategory, setFilterCategory] = useState('')

  const categories = Array.from(new Set(services.map(s => s.category)))
  const filtered = filterCategory ? services.filter(s => s.category === filterCategory) : services

  const handleBook = (title: string) => {
    addToast(`Booking request sent for: ${title}`, 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Services Marketplace</h1>
        <p className={styles.subtitle}>Hire vetted creative professionals</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span>{services.length}</span>
            <span>Services</span>
          </div>
          <div className={styles.stat}>
            <span>{services.filter(s => s.status === 'available').length}</span>
            <span>Available</span>
          </div>
          <div className={styles.stat}>
            <span>{categories.length}</span>
            <span>Categories</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Filter by Category</h2>
          <div className={styles.categoryButtons}>
            <button
              onClick={() => setFilterCategory('')}
              className={`${styles.categoryBtn} ${!filterCategory ? styles.active : ''}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`${styles.categoryBtn} ${filterCategory === cat ? styles.active : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Services ({filtered.length})</h2>
          <div className={styles.servicesList}>
            {filtered.map(service => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.cardHeader}>
                  <h3>{service.title}</h3>
                  <span className={`${styles.status} ${styles[service.status]}`}>
                    {service.status === 'available' ? '✓ Available' : '✗ Booked'}
                  </span>
                </div>
                <p className={styles.provider}>{service.provider}</p>
                <div className={styles.rating}>
                  <span>★ {service.rating}</span>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.budget}>{service.budget}</span>
                  <button
                    onClick={() => handleBook(service.title)}
                    disabled={service.status === 'booked'}
                    className={styles.bookBtn}
                  >
                    {service.status === 'available' ? 'Request' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
