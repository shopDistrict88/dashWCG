import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import styles from './Settings.module.css'

interface Settings {
  interfaceDensity: 'compact' | 'comfortable' | 'spacious'
  focusMode: boolean
  theme: 'dark' | 'light' | 'auto'
  aiModel: 'gpt-4' | 'gpt-3.5' | 'claude'
  aiTemperature: number
  notifications: {
    email: boolean
    push: boolean
    mentions: boolean
    updates: boolean
  }
  privacy: {
    analytics: boolean
    sharing: boolean
    publicProfile: boolean
  }
  features: {
    [key: string]: boolean
  }
  performance: {
    animations: boolean
    autoSave: boolean
    prefetch: boolean
  }
  automation: {
    autoBackup: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
  }
}

export function Settings() {
  const { user, logout } = useAuth()
  const { addToast } = useApp()
  const navigate = useNavigate()
  const [editName, setEditName] = useState((user as any)?.user_metadata?.name || '')
  const [activeTab, setActiveTab] = useState('interface')
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('wcg-settings')
    return saved ? JSON.parse(saved) : {
      interfaceDensity: 'comfortable',
      focusMode: false,
      theme: 'dark',
      aiModel: 'gpt-4',
      aiTemperature: 0.7,
      notifications: {
        email: true,
        push: true,
        mentions: true,
        updates: false
      },
      privacy: {
        analytics: true,
        sharing: false,
        publicProfile: false
      },
      features: {
        ai: true,
        commerce: true,
        fashion: true,
        community: true,
        creators: true
      },
      performance: {
        animations: true,
        autoSave: true,
        prefetch: true
      },
      automation: {
        autoBackup: true,
        backupFrequency: 'weekly'
      }
    }
  })

  useEffect(() => {
    localStorage.setItem('wcg-settings', JSON.stringify(settings))
    document.body.setAttribute('data-density', settings.interfaceDensity)
    document.body.setAttribute('data-focus-mode', settings.focusMode.toString())
  }, [settings])

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.')
      const newSettings = { ...prev }
      let current: any = newSettings
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newSettings
    })
    addToast('Setting updated', 'success')
  }

  const exportData = () => {
    const data = {
      settings,
      user: user?.email,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wcg-data-${Date.now()}.json`
    a.click()
    addToast('Data exported successfully', 'success')
  }

  const createBackup = () => {
    const backup = {
      settings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
    localStorage.setItem('wcg-backup', JSON.stringify(backup))
    addToast('Backup created successfully', 'success')
  }

  const restoreBackup = () => {
    const backup = localStorage.getItem('wcg-backup')
    if (backup) {
      const data = JSON.parse(backup)
      setSettings(data.settings)
      addToast('Backup restored successfully', 'success')
    } else {
      addToast('No backup found', 'error')
    }
  }

  const clearLogs = () => {
    localStorage.removeItem('wcg-logs')
    addToast('Security logs cleared', 'success')
  }

  const tabs = [
    { id: 'interface', label: 'Interface', icon: '🎨' },
    { id: 'ai', label: 'AI Behavior', icon: '🤖' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'performance', label: 'Performance', icon: '⚙️' },
    { id: 'data', label: 'Data & Backup', icon: '💾' },
    { id: 'security', label: 'Security', icon: '🛡️' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Power User Control Panel</p>
      </div>

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'interface' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Interface Settings</h2>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Interface Density</p>
                <p className={styles.settingDesc}>Control spacing and element sizes</p>
              </div>
              <select 
                value={settings.interfaceDensity}
                onChange={(e) => updateSetting('interfaceDensity', e.target.value)}
                className={styles.select}
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Focus Mode</p>
                <p className={styles.settingDesc}>Hide distractions and minimize UI</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.focusMode}
                  onChange={(e) => updateSetting('focusMode', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Theme</p>
                <p className={styles.settingDesc}>Color scheme preference</p>
              </div>
              <select 
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className={styles.select}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Animations</p>
                <p className={styles.settingDesc}>Enable UI animations</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.performance.animations}
                  onChange={(e) => updateSetting('performance.animations', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>AI Behavior Tuning</h2>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>AI Model</p>
                <p className={styles.settingDesc}>Select default AI model</p>
              </div>
              <select 
                value={settings.aiModel}
                onChange={(e) => updateSetting('aiModel', e.target.value)}
                className={styles.select}
              >
                <option value="gpt-4">GPT-4 (Most Capable)</option>
                <option value="gpt-3.5">GPT-3.5 (Faster)</option>
                <option value="claude">Claude (Balanced)</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Temperature: {settings.aiTemperature.toFixed(2)}</p>
                <p className={styles.settingDesc}>Creativity vs Consistency (0 = Focused, 1 = Creative)</p>
              </div>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.aiTemperature}
                  onChange={(e) => updateSetting('aiTemperature', parseFloat(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Notification Logic Builder</h2>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Email Notifications</p>
                <p className={styles.settingDesc}>Receive updates via email</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => updateSetting('notifications.email', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Push Notifications</p>
                <p className={styles.settingDesc}>Browser push notifications</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => updateSetting('notifications.push', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Mentions & Comments</p>
                <p className={styles.settingDesc}>When someone mentions you</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.notifications.mentions}
                  onChange={(e) => updateSetting('notifications.mentions', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Product Updates</p>
                <p className={styles.settingDesc}>New features and changes</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.notifications.updates}
                  onChange={(e) => updateSetting('notifications.updates', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Privacy Controls</h2>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Usage Analytics</p>
                <p className={styles.settingDesc}>Help improve the platform</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.privacy.analytics}
                  onChange={(e) => updateSetting('privacy.analytics', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Data Sharing</p>
                <p className={styles.settingDesc}>Share data with partners</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.privacy.sharing}
                  onChange={(e) => updateSetting('privacy.sharing', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Public Profile</p>
                <p className={styles.settingDesc}>Make profile visible to others</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.privacy.publicProfile}
                  onChange={(e) => updateSetting('privacy.publicProfile', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Feature Access Toggles</h2>
            
            {Object.entries(settings.features).map(([key, value]) => (
              <div key={key} className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <p className={styles.settingLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                  <p className={styles.settingDesc}>Enable {key} features</p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting(`features.${key}`, e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Performance Monitoring</h2>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Auto-Save</p>
                <p className={styles.settingDesc}>Automatically save your work</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.performance.autoSave}
                  onChange={(e) => updateSetting('performance.autoSave', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Prefetch Data</p>
                <p className={styles.settingDesc}>Load data in advance</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.performance.prefetch}
                  onChange={(e) => updateSetting('performance.prefetch', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>~2.5MB</div>
                <div className={styles.statLabel}>Cache Size</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>245ms</div>
                <div className={styles.statLabel}>Avg Load Time</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>99.8%</div>
                <div className={styles.statLabel}>Uptime</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Data & Backup Management</h2>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Auto Backup</p>
                <p className={styles.settingDesc}>Automatic backup creation</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.automation.autoBackup}
                  onChange={(e) => updateSetting('automation.autoBackup', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>Backup Frequency</p>
                <p className={styles.settingDesc}>How often to create backups</p>
              </div>
              <select 
                value={settings.automation.backupFrequency}
                onChange={(e) => updateSetting('automation.backupFrequency', e.target.value)}
                className={styles.select}
                disabled={!settings.automation.autoBackup}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className={styles.actionButtons}>
              <button onClick={exportData} className={styles.actionBtn}>
                📥 Export All Data
              </button>
              <button onClick={createBackup} className={styles.actionBtn}>
                💾 Create Backup
              </button>
              <button onClick={restoreBackup} className={styles.actionBtn}>
                ♻️ Restore Backup
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Security & Logs</h2>
            
            <div className={styles.logsList}>
              <div className={styles.logItem}>
                <span className={styles.logIcon}>✅</span>
                <div className={styles.logInfo}>
                  <p className={styles.logTitle}>Login Successful</p>
                  <p className={styles.logTime}>{new Date().toLocaleString()}</p>
                </div>
              </div>
              <div className={styles.logItem}>
                <span className={styles.logIcon}>🔧</span>
                <div className={styles.logInfo}>
                  <p className={styles.logTitle}>Settings Updated</p>
                  <p className={styles.logTime}>{new Date(Date.now() - 3600000).toLocaleString()}</p>
                </div>
              </div>
              <div className={styles.logItem}>
                <span className={styles.logIcon}>💾</span>
                <div className={styles.logInfo}>
                  <p className={styles.logTitle}>Data Backup Created</p>
                  <p className={styles.logTime}>{new Date(Date.now() - 86400000).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button onClick={clearLogs} className={styles.dangerBtn}>
                🗑️ Clear Security Logs
              </button>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Management</h2>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <p className={styles.settingLabel}>Email</p>
              <p className={styles.settingValue}>{user?.email}</p>
            </div>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
