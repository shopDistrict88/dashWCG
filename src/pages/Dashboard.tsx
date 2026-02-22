import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

const MENU_ITEMS = [
  { label: 'Home', path: '/dashboard' },
  { label: 'AI Assistant', path: '/dashboard/ai' },
  { label: 'Notes', path: '/dashboard/notes' },
  { label: 'Music Studio', path: '/dashboard/music-studio' },
  { label: 'Social Media', path: '/dashboard/social-media' },
  { label: 'Creators', path: '/dashboard/creators' },
  { label: 'Brand Builder', path: '/dashboard/brand-builder' },
  { label: 'Content Studio', path: '/dashboard/content-studio' },
  { label: 'Projects', path: '/dashboard/projects' },
  { label: 'Launch Lab', path: '/dashboard/launch-lab' },
  { label: 'Fashion Lab', path: '/dashboard/fashion' },
  { label: 'Product Ideation', path: '/dashboard/product-ideation-lab' },
  { label: 'Commerce', path: '/dashboard/commerce' },
  { label: 'Funding', path: '/dashboard/funding' },
  { label: 'Business', path: '/dashboard/business' },
  { label: 'Growth', path: '/dashboard/growth' },
  { label: 'Personal Brand', path: '/dashboard/personal-brand' },
  { label: 'Business Intelligence', path: '/dashboard/market-signals-board' },
  { label: 'Design Studio', path: '/dashboard/packaging-design-studio' },
  { label: 'Narrative Studio', path: '/dashboard/worldbuilding-studio' },
  { label: 'Innovation Lab', path: '/dashboard/rd-playground' },
  { label: 'IP & Legacy', path: '/dashboard/ip-registry' },
  { label: 'Creative Intelligence', path: '/dashboard/creative-intelligence' },
  { label: 'Creative Decisions', path: '/dashboard/creative-decisions' },
  { label: 'Brand & Culture', path: '/dashboard/brand-identity' },
  { label: 'Product & Quality', path: '/dashboard/product-intelligence' },
  { label: 'Education', path: '/dashboard/education' },
  { label: 'Community & Services', path: '/dashboard/community' },
  { label: 'Creative Health', path: '/dashboard/creative-health' },
  { label: 'Collaboration & Media', path: '/dashboard/collaboration-hub' },
  { label: 'Settings', path: '/dashboard/settings' },
]

const MOBILE_NAV = [
  { label: 'Home', path: '/dashboard', icon: '○' },
  { label: 'Create', path: '/dashboard/projects', icon: '+' },
  { label: 'AI', path: '/dashboard/ai', icon: '◇' },
  { label: 'Activity', path: '/dashboard/creative-intelligence', icon: '▵' },
  { label: 'Explore', path: null, icon: '⊞' },
]

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768)
  const [exploreOpen, setExploreOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <button
        className={styles.toggleBtn}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.closed : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.logo}>WCG</h2>
        </div>

        <nav className={styles.nav}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path || 
                (item.path === '/dashboard' && location.pathname === '/dashboard') 
                  ? styles.active 
                  : ''
              }`}
              onClick={() => {
                navigate(item.path)
                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768) {
                  setSidebarOpen(false)
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.footer}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{(user as any)?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</p>
                <p className={styles.userEmail}>{user?.email}</p>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>
              Login / Sign Up
            </button>
          )}
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        {MOBILE_NAV.map((item) => (
          <button
            key={item.label}
            className={`${styles.mobileNavItem} ${
              item.path && (location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/dashboard'))
                ? styles.mobileNavItemActive
                : ''
            }`}
            onClick={() => {
              if (item.path) {
                navigate(item.path)
              } else if (item.label === 'Explore') {
                setExploreOpen(true)
              }
            }}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Explore Modal */}
      {exploreOpen && (
        <>
          <div className={styles.exploreOverlay} onClick={() => setExploreOpen(false)} />
          <div className={styles.exploreModal}>
            <div className={styles.exploreHeader}>
              <h2>Explore All Pages</h2>
              <button onClick={() => setExploreOpen(false)} className={styles.exploreClose}>×</button>
            </div>
            <div className={styles.exploreContent}>
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.path}
                  className={styles.exploreItem}
                  onClick={() => {
                    navigate(item.path)
                    setExploreOpen(false)
                  }}
                >
                  <span className={styles.exploreItemLabel}>{item.label}</span>
                  <span className={styles.exploreItemArrow}>→</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
