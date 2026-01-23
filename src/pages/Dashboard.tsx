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
  { label: 'Fashion & Manufacturing', path: '/dashboard/fashion' },
  { label: 'Product Ideation', path: '/dashboard/product-ideation-lab' },
  { label: 'Fit & Wear Testing', path: '/dashboard/fit-wear-testing' },
  { label: 'Commerce', path: '/dashboard/commerce' },
  { label: 'Funding', path: '/dashboard/funding' },
  { label: 'Business', path: '/dashboard/business' },
  { label: 'Growth', path: '/dashboard/growth' },
  { label: 'Personal Brand', path: '/dashboard/personal-brand' },
  { label: 'Prototype Vault', path: '/dashboard/prototype-vault' },
  { label: 'Problem–Solution Mapper', path: '/dashboard/problem-solution-mapper' },
  { label: 'Business Intelligence Hub', path: '/dashboard/market-signals-board' },
  { label: 'Design Studio', path: '/dashboard/packaging-design-studio' },
  { label: 'Narrative Studio', path: '/dashboard/worldbuilding-studio' },
  { label: 'Innovation Lab', path: '/dashboard/rd-playground' },
  { label: 'IP & Legacy Hub', path: '/dashboard/ip-registry' },
  { label: 'Creative Intelligence', path: '/dashboard/creative-intelligence' },
  { label: 'Quiet Wins', path: '/dashboard/quiet-wins' },
  { label: 'Idea Management', path: '/dashboard/idea-management' },
  { label: 'Creative Decisions', path: '/dashboard/creative-decisions' },
  { label: 'Strategy Tools', path: '/dashboard/strategy-tools' },
  { label: 'Brand Identity', path: '/dashboard/brand-identity' },
  { label: 'Cultural Risk', path: '/dashboard/cultural-risk' },
  { label: 'Product Intelligence', path: '/dashboard/product-intelligence' },
  { label: 'Quality & Ethics', path: '/dashboard/quality-ethics' },
  { label: 'Education', path: '/dashboard/education' },
  { label: 'Community', path: '/dashboard/community' },
  { label: 'Marketplace', path: '/dashboard/marketplace' },
  { label: 'Ideas', path: '/dashboard/ideas' },
  { label: 'Creative Health', path: '/dashboard/creative-health' },
  { label: 'Collaboration Hub', path: '/dashboard/collaboration-hub' },
  { label: 'Media Vault', path: '/dashboard/media-vault' },
  { label: 'Insights Lab', path: '/dashboard/insights-lab' },
  { label: 'Legacy & Ownership', path: '/dashboard/legacy-ownership' },
  { label: 'Settings', path: '/dashboard/settings' },
]

const MOBILE_NAV = [
  { label: 'Home', path: '/dashboard', icon: '○' },
  { label: 'Create', path: '/dashboard/projects', icon: '+' },
  { label: 'AI', path: '/dashboard/ai', icon: '◇' },
  { label: 'Activity', path: '/dashboard/insights-lab', icon: '▵' },
  { label: 'Profile', path: '/dashboard/settings', icon: '◆' },
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

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        {MOBILE_NAV.map((item) => (
          <button
            key={item.path}
            className={`${styles.mobileNavItem} ${
              location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/dashboard')
                ? styles.mobileNavItemActive
                : ''
            }`}
            onClick={() => {
              navigate(item.path)
            }}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
