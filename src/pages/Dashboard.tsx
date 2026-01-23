import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

const MENU_ITEMS = [
  { label: 'Home', path: '/dashboard' },
  { label: 'WCG AI', path: '/dashboard/ai' },
  
  // Creator Section
  { label: 'Creator Hub', path: '/dashboard/creator-hub' },
  { label: 'Music Studio', path: '/dashboard/music-studio' },
  { label: 'Creative Library', path: '/dashboard/creative-library' },
  { label: 'Creator Tools', path: '/dashboard/creator-tools' },
  
  // Original Pages (Updated)
  { label: 'Brand Builder', path: '/dashboard/brand-builder' },
  { label: 'Content Studio', path: '/dashboard/content-studio' },
  { label: 'Projects', path: '/dashboard/projects' },
  { label: 'Launch Lab', path: '/dashboard/launch-lab' },
  { label: 'Commerce', path: '/dashboard/commerce' },
  { label: 'Funding', path: '/dashboard/funding' },
  { label: 'Growth', path: '/dashboard/growth' },
  { label: 'Community', path: '/dashboard/community' },
  { label: 'Marketplace', path: '/dashboard/marketplace' },
  { label: 'Ideas', path: '/dashboard/ideas' },
  { label: 'Settings', path: '/dashboard/settings' },
]

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768)

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

      <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.closed : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.logo}>WCG</h2>
          <button
            className={styles.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
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
          <div className={styles.userInfo}>
            <p className={styles.userName}>{(user as any)?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
