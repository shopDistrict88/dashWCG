import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './LaunchLab.module.css'

interface LaunchChecklistItem {
  id: string
  text: string
  completed: boolean
  category: 'design' | 'copy' | 'legal' | 'analytics' | 'marketing'
}

const DEFAULT_CHECKLIST: LaunchChecklistItem[] = [
  // Design
  { id: '1', text: 'Design layout finalized', completed: false, category: 'design' },
  { id: '2', text: 'Mobile responsive tested', completed: false, category: 'design' },
  { id: '3', text: 'Brand colors applied', completed: false, category: 'design' },
  { id: '4', text: 'CTA buttons styled', completed: false, category: 'design' },
  // Copy
  { id: '5', text: 'Headlines written and reviewed', completed: false, category: 'copy' },
  { id: '6', text: 'Body copy proofread', completed: false, category: 'copy' },
  { id: '7', text: 'Meta descriptions added', completed: false, category: 'copy' },
  // Legal
  { id: '8', text: 'Privacy policy linked', completed: false, category: 'legal' },
  { id: '9', text: 'Terms of service added', completed: false, category: 'legal' },
  { id: '10', text: 'Legal review completed', completed: false, category: 'legal' },
  // Analytics
  { id: '11', text: 'Google Analytics installed', completed: false, category: 'analytics' },
  { id: '12', text: 'Conversion tracking set up', completed: false, category: 'analytics' },
  { id: '13', text: 'UTM parameters configured', completed: false, category: 'analytics' },
  // Marketing
  { id: '14', text: 'Email list created', completed: false, category: 'marketing' },
  { id: '15', text: 'Social media posts scheduled', completed: false, category: 'marketing' },
  { id: '16', text: 'Ad campaigns drafted', completed: false, category: 'marketing' },
]

export function LaunchLab() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const launchPages = dashboard.launchPages

  const [pageName, setPageName] = useState('')
  const [pageType, setPageType] = useState<'landing' | 'drop' | 'event' | 'campaign'>('landing')
  const [domain, setDomain] = useState('')
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)

  const selectedPage = selectedPageId ? launchPages.find((p) => p.id === selectedPageId) : null
  const checklist = selectedPage
    ? selectedPage.checklist || DEFAULT_CHECKLIST
    : DEFAULT_CHECKLIST

  const handleCreatePage = () => {
    if (!pageName.trim()) {
      addToast('Enter a page name', 'error')
      return
    }

    const newPage = {
      id: Math.random().toString(36).substr(2, 9),
      title: pageName,
      type: pageType,
      content: '',
      status: 'draft' as const,
      url: domain || undefined,
      checklist: DEFAULT_CHECKLIST,
      createdAt: new Date().toISOString(),
    }

    updateDashboard({
      launchPages: [...launchPages, newPage],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'project',
          title: `Created launch page: ${pageName}`,
          timestamp: new Date().toISOString(),
          action: 'created',
        },
      ],
    })

    setPageName('')
    setDomain('')
    setSelectedPageId(newPage.id)
    addToast('Launch page created!', 'success')
  }

  const handleToggleChecklistItem = (itemId: string) => {
    if (!selectedPage) return

    const updatedChecklist = selectedPage.checklist
      ? selectedPage.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      : DEFAULT_CHECKLIST.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )

    updateDashboard({
      launchPages: launchPages.map((p) =>
        p.id === selectedPage.id ? { ...p, checklist: updatedChecklist } : p
      ),
    })
  }

  const handlePublishPage = (pageId: string) => {
    const page = launchPages.find((p) => p.id === pageId)
    if (!page) return

    updateDashboard({
      launchPages: launchPages.map((p) =>
        p.id === pageId ? { ...p, status: 'live' } : p
      ),
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'project',
          title: `Published: ${page.title}`,
          timestamp: new Date().toISOString(),
          action: 'published',
        },
      ],
    })
    addToast(`${page.title} is now live!`, 'success')
  }

  const handleDeletePage = (pageId: string) => {
    updateDashboard({
      launchPages: launchPages.filter((p) => p.id !== pageId),
    })
    setSelectedPageId(null)
    addToast('Launch page deleted', 'success')
  }

  const calculateProgress = (list: LaunchChecklistItem[]) => {
    if (list.length === 0) return 0
    const completed = list.filter((item) => item.completed).length
    return Math.round((completed / list.length) * 100)
  }

  const categoryStats = (list: LaunchChecklistItem[], category: LaunchChecklistItem['category']) => {
    const items = list.filter((item) => item.category === category)
    const completed = items.filter((item) => item.completed).length
    return { total: items.length, completed }
  }

  const progress = calculateProgress(checklist)
  const categoryIcons: Record<LaunchChecklistItem['category'], string> = {
    design: '🎨',
    copy: '✍️',
    legal: '⚖️',
    analytics: '📊',
    marketing: '📢',
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Launch Lab</h1>
        <p className={styles.subtitle}>Plan, prepare, and publish your launch</p>
      </div>

      <div className={styles.mainContent}>
        {/* Creation Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Create New Launch</h2>
          <div className={styles.formGrid}>
            <input
              type="text"
              placeholder="Page name (e.g., Product Drop, Event, Campaign)"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              className={styles.input}
            />
            <select
              value={pageType}
              onChange={(e) => setPageType(e.target.value as typeof pageType)}
              className={styles.select}
            >
              <option value="landing">Landing Page</option>
              <option value="drop">Product Drop</option>
              <option value="event">Event</option>
              <option value="campaign">Campaign</option>
            </select>
            <input
              type="text"
              placeholder="Domain (optional)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleCreatePage} className={styles.button}>
              Create Launch Page
            </button>
          </div>
        </section>

        {/* Pages List */}
        {launchPages.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Launches</h2>
            <div className={styles.pagesList}>
              {launchPages.map((page) => {
                const pageChecklist = page.checklist || DEFAULT_CHECKLIST
                const pageProgress = calculateProgress(pageChecklist)
                return (
                  <div
                    key={page.id}
                    className={`${styles.pageCard} ${
                      selectedPageId === page.id ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedPageId(page.id)}
                  >
                    <div className={styles.pageCardHeader}>
                      <h3 className={styles.pageName}>{page.title}</h3>
                      <span className={`${styles.status} ${styles[page.status]}`}>
                        {page.status === 'live' ? '🔴 Live' : '⚫ Draft'}
                      </span>
                    </div>
                    <p className={styles.pageType}>{page.type}</p>
                    {page.url && <p className={styles.pageUrl}>{page.url}</p>}
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${pageProgress}%` }}
                      ></div>
                    </div>
                    <p className={styles.progressText}>{pageProgress}% complete</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Checklist Section */}
        {selectedPage && (
          <section className={styles.section}>
            <div className={styles.checklistHeader}>
              <h2 className={styles.sectionTitle}>Pre-Launch Checklist: {selectedPage.title}</h2>
              <div className={styles.checklistStats}>
                <span className={styles.statBadge}>
                  {checklist.filter((i) => i.completed).length}/{checklist.length} done
                </span>
                <span className={styles.statBadge}>{progress}% ready</span>
              </div>
            </div>

            {/* Category Sections */}
            <div className={styles.categorySections}>
              {['design', 'copy', 'legal', 'analytics', 'marketing'].map((category) => {
                const cat = category as LaunchChecklistItem['category']
                const stats = categoryStats(checklist, cat)
                const categoryItems = checklist.filter((item) => item.category === cat)

                return (
                  <div key={category} className={styles.categorySection}>
                    <div className={styles.categoryHeader}>
                      <h3 className={styles.categoryTitle}>
                        {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </h3>
                      <span className={styles.categoryCount}>
                        {stats.completed}/{stats.total}
                      </span>
                    </div>
                    <div className={styles.checklistItems}>
                      {categoryItems.map((item) => (
                        <label key={item.id} className={styles.checklistItem}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleChecklistItem(item.id)}
                            className={styles.checkbox}
                          />
                          <span className={item.completed ? styles.completedText : ''}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              {selectedPage.status === 'draft' && (
                <button
                  onClick={() => handlePublishPage(selectedPage.id)}
                  className={`${styles.button} ${styles.publishButton}`}
                  disabled={progress < 80}
                >
                  {progress < 80 ? '✓ Reach 80% to publish' : '🚀 Publish Launch'}
                </button>
              )}
              <button
                onClick={() => handleDeletePage(selectedPage.id)}
                className={`${styles.button} ${styles.deleteButton}`}
              >
                Delete Launch
              </button>
            </div>
          </section>
        )}

        {/* Empty State */}
        {launchPages.length === 0 && (
          <section className={styles.emptyState}>
            <p className={styles.emptyIcon}>🚀</p>
            <p className={styles.emptyText}>Create a launch page to get started</p>
          </section>
        )}
      </div>
    </div>
  )
}
