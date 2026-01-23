import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Settings.module.css'

interface AccountSettings {
  id: string
  username: string
  email: string
  displayName: string
  bio: string
  avatar: string
  timezone: string
  language: string
}

interface AppearanceCustomization {
  id: string
  theme: 'light' | 'dark' | 'auto'
  accentColor: string
  fontSize: number
  fontFamily: string
  compactMode: boolean
  animations: boolean
}

interface NotificationPreferences {
  id: string
  email: boolean
  push: boolean
  desktop: boolean
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  types: string[]
}

interface DataManagement {
  id: string
  dataRetention: number
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  exportFormat: 'json' | 'csv' | 'xml'
}

interface PrivacyControls {
  id: string
  profileVisibility: 'public' | 'private' | 'contacts'
  activityTracking: boolean
  analytics: boolean
  thirdPartySharing: boolean
  dataEncryption: boolean
}

interface IntegrationSettings {
  id: string
  service: string
  enabled: boolean
  apiKey: string
  webhook: string
  syncFrequency: number
}

interface KeyboardShortcut {
  id: string
  action: string
  keys: string
  enabled: boolean
  category: string
}

interface DataExportImport {
  id: string
  type: 'export' | 'import'
  format: string
  date: string
  fileSize: number
  status: 'pending' | 'processing' | 'complete' | 'failed'
}

interface APIAccess {
  id: string
  apiKey: string
  created: string
  lastUsed: string
  requests: number
  rateLimit: number
}

interface AdvancedPreferences {
  id: string
  developerMode: boolean
  experimentalFeatures: boolean
  debugMode: boolean
  betaProgram: boolean
  telemetry: boolean
}

interface AccessibilityOptions {
  id: string
  screenReader: boolean
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  keyboardNav: boolean
}

interface PerformanceSettings {
  id: string
  cacheSize: number
  lazyLoading: boolean
  compressionLevel: number
  prefetch: boolean
  offlineMode: boolean
}

interface BackupConfiguration {
  id: string
  autoBackup: boolean
  frequency: string
  location: string
  retention: number
  encryption: boolean
}

interface UserRole {
  id: string
  userId: string
  role: 'admin' | 'editor' | 'viewer' | 'guest'
  permissions: string[]
  expiryDate: string
}

interface SystemDiagnostics {
  id: string
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  errors: string[]
  warnings: string[]
}

export function Settings() {
  const { addToast } = useApp()
  
  const [account, setAccount] = useState<AccountSettings[]>([])
  const [appearance, setAppearance] = useState<AppearanceCustomization[]>([])
  const [notifications, setNotifications] = useState<NotificationPreferences[]>([])
  const [dataManagement, setDataManagement] = useState<DataManagement[]>([])
  const [privacy, setPrivacy] = useState<PrivacyControls[]>([])
  const [integrations, setIntegrations] = useState<IntegrationSettings[]>([])
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([])
  const [dataOps, setDataOps] = useState<DataExportImport[]>([])
  const [apiAccess, setApiAccess] = useState<APIAccess[]>([])
  const [advanced, setAdvanced] = useState<AdvancedPreferences[]>([])
  const [accessibility, setAccessibility] = useState<AccessibilityOptions[]>([])
  const [performance, setPerformance] = useState<PerformanceSettings[]>([])
  const [backups, setBackups] = useState<BackupConfiguration[]>([])
  const [roles, setRoles] = useState<UserRole[]>([])
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics[]>([])

  const [activeSection, setActiveSection] = useState('account')

  useEffect(() => {
    const keys = ['account', 'appearance', 'notifications', 'dataManagement', 'privacy', 'integrations', 'shortcuts', 'dataOps', 'apiAccess', 'advanced', 'accessibility', 'performance', 'backups', 'roles', 'diagnostics']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`settings_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'account': setAccount(data); break
          case 'appearance': setAppearance(data); break
          case 'notifications': setNotifications(data); break
          case 'dataManagement': setDataManagement(data); break
          case 'privacy': setPrivacy(data); break
          case 'integrations': setIntegrations(data); break
          case 'shortcuts': setShortcuts(data); break
          case 'dataOps': setDataOps(data); break
          case 'apiAccess': setApiAccess(data); break
          case 'advanced': setAdvanced(data); break
          case 'accessibility': setAccessibility(data); break
          case 'performance': setPerformance(data); break
          case 'backups': setBackups(data); break
          case 'roles': setRoles(data); break
          case 'diagnostics': setDiagnostics(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('settings_account', JSON.stringify(account)) }, [account])
  useEffect(() => { localStorage.setItem('settings_appearance', JSON.stringify(appearance)) }, [appearance])
  useEffect(() => { localStorage.setItem('settings_notifications', JSON.stringify(notifications)) }, [notifications])
  useEffect(() => { localStorage.setItem('settings_dataManagement', JSON.stringify(dataManagement)) }, [dataManagement])
  useEffect(() => { localStorage.setItem('settings_privacy', JSON.stringify(privacy)) }, [privacy])
  useEffect(() => { localStorage.setItem('settings_integrations', JSON.stringify(integrations)) }, [integrations])
  useEffect(() => { localStorage.setItem('settings_shortcuts', JSON.stringify(shortcuts)) }, [shortcuts])
  useEffect(() => { localStorage.setItem('settings_dataOps', JSON.stringify(dataOps)) }, [dataOps])
  useEffect(() => { localStorage.setItem('settings_apiAccess', JSON.stringify(apiAccess)) }, [apiAccess])
  useEffect(() => { localStorage.setItem('settings_advanced', JSON.stringify(advanced)) }, [advanced])
  useEffect(() => { localStorage.setItem('settings_accessibility', JSON.stringify(accessibility)) }, [accessibility])
  useEffect(() => { localStorage.setItem('settings_performance', JSON.stringify(performance)) }, [performance])
  useEffect(() => { localStorage.setItem('settings_backups', JSON.stringify(backups)) }, [backups])
  useEffect(() => { localStorage.setItem('settings_roles', JSON.stringify(roles)) }, [roles])
  useEffect(() => { localStorage.setItem('settings_diagnostics', JSON.stringify(diagnostics)) }, [diagnostics])

  // AI Functions
  const calculatePrivacyScore = (privacy: PrivacyControls): number => {
    let score = 0
    if (privacy.profileVisibility === 'private') score += 25
    if (!privacy.activityTracking) score += 25
    if (!privacy.analytics) score += 20
    if (!privacy.thirdPartySharing) score += 15
    if (privacy.dataEncryption) score += 15
    return score
  }

  const assessSecurityHealth = (encryption: boolean, twoFactor: boolean, apiKeys: number): number => {
    let health = 50
    if (encryption) health += 25
    if (twoFactor) health += 20
    if (apiKeys <= 3) health += 5
    return Math.min(100, health)
  }

  const calculateStorageEfficiency = (cacheSize: number, compression: number): number => {
    const cacheScore = Math.max(0, 100 - (cacheSize / 10))
    const compressionScore = compression * 10
    return Math.round((cacheScore + compressionScore) / 2)
  }

  const assessAccessibilityCompliance = (options: AccessibilityOptions): number => {
    let compliance = 0
    if (options.screenReader) compliance += 25
    if (options.highContrast) compliance += 20
    if (options.reducedMotion) compliance += 20
    if (options.largeText) compliance += 20
    if (options.keyboardNav) compliance += 15
    return compliance
  }

  const calculateAPIUsageRate = (requests: number, rateLimit: number): number => {
    if (rateLimit === 0) return 0
    return Math.round((requests / rateLimit) * 100)
  }

  const predictStorageNeeds = (currentUsage: number, retention: number): number => {
    return Math.round(currentUsage * (1 + (retention / 365)))
  }

  const assessSystemHealth = (cpu: number, memory: number, disk: number): 'healthy' | 'warning' | 'critical' => {
    const avg = (cpu + memory + disk) / 3
    if (avg < 70) return 'healthy'
    if (avg < 90) return 'warning'
    return 'critical'
  }

  const calculateBackupReliability = (frequency: string, retention: number): number => {
    let score = 0
    if (frequency === 'daily') score += 40
    else if (frequency === 'weekly') score += 30
    else score += 20
    score += Math.min(40, retention * 5)
    return Math.min(100, score)
  }

  const assessIntegrationHealth = (integrations: IntegrationSettings[]): number => {
    const enabled = integrations.filter(i => i.enabled).length
    const total = integrations.length
    if (total === 0) return 100
    return Math.round((enabled / total) * 100)
  }

  const calculateNotificationLoad = (frequency: string, typesEnabled: number): 'low' | 'medium' | 'high' => {
    let load = typesEnabled
    if (frequency === 'realtime') load *= 3
    else if (frequency === 'hourly') load *= 2
    
    if (load < 5) return 'low'
    if (load < 15) return 'medium'
    return 'high'
  }

  // CRUD Functions
  const updateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updated: AccountSettings = {
      id: account[0]?.id || Date.now().toString(),
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      displayName: formData.get('displayName') as string,
      bio: formData.get('bio') as string,
      avatar: formData.get('avatar') as string,
      timezone: formData.get('timezone') as string,
      language: formData.get('language') as string
    }
    
    setAccount([updated])
    addToast('Account settings saved', 'success')
  }

  const updateAppearance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updated: AppearanceCustomization = {
      id: appearance[0]?.id || Date.now().toString(),
      theme: formData.get('theme') as AppearanceCustomization['theme'],
      accentColor: formData.get('accentColor') as string,
      fontSize: parseInt(formData.get('fontSize') as string),
      fontFamily: formData.get('fontFamily') as string,
      compactMode: formData.get('compactMode') === 'on',
      animations: formData.get('animations') === 'on'
    }
    
    setAppearance([updated])
    addToast('Appearance updated', 'success')
  }

  const addIntegration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newIntegration: IntegrationSettings = {
      id: Date.now().toString(),
      service: formData.get('service') as string,
      enabled: true,
      apiKey: formData.get('apiKey') as string,
      webhook: formData.get('webhook') as string,
      syncFrequency: parseInt(formData.get('syncFrequency') as string)
    }
    
    setIntegrations([...integrations, newIntegration])
    addToast(`${newIntegration.service} integration added`, 'success')
    e.currentTarget.reset()
  }

  const currentAccount = account[0]
  const currentAppearance = appearance[0]
  const currentPrivacy = privacy[0]
  const privacyScore = currentPrivacy ? calculatePrivacyScore(currentPrivacy) : 0
  const integrationHealth = assessIntegrationHealth(integrations)
  const latestDiagnostic = diagnostics[0]
  const systemHealth = latestDiagnostic 
    ? assessSystemHealth(latestDiagnostic.cpuUsage, latestDiagnostic.memoryUsage, latestDiagnostic.diskUsage)
    : 'healthy'

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Power User Control</h1>
          <p className={styles.subtitle}>Advanced configuration and system management</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{privacyScore}%</div>
            <div className={styles.statLabel}>Privacy Score</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{integrationHealth}%</div>
            <div className={styles.statLabel}>Integrations</div>
          </div>
          <div className={`${styles.stat} ${styles[systemHealth]}`}>
            <div className={styles.statValue}>{systemHealth.toUpperCase()}</div>
            <div className={styles.statLabel}>System Health</div>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'account' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('account')}>Account Settings</button>
          <button className={`${styles.navItem} ${activeSection === 'appearance' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('appearance')}>Appearance Customization</button>
          <button className={`${styles.navItem} ${activeSection === 'notifications' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('notifications')}>Notification Preferences</button>
          <button className={`${styles.navItem} ${activeSection === 'data' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('data')}>Data Management</button>
          <button className={`${styles.navItem} ${activeSection === 'privacy' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('privacy')}>Privacy Controls</button>
          <button className={`${styles.navItem} ${activeSection === 'integrations' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('integrations')}>Integration Settings</button>
          <button className={`${styles.navItem} ${activeSection === 'shortcuts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('shortcuts')}>Keyboard Shortcuts</button>
          <button className={`${styles.navItem} ${activeSection === 'export' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('export')}>Export/Import Data</button>
          <button className={`${styles.navItem} ${activeSection === 'api' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('api')}>API Access</button>
          <button className={`${styles.navItem} ${activeSection === 'advanced' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('advanced')}>Advanced Preferences</button>
          <button className={`${styles.navItem} ${activeSection === 'accessibility' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('accessibility')}>Accessibility Options</button>
          <button className={`${styles.navItem} ${activeSection === 'performance' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('performance')}>Performance Settings</button>
          <button className={`${styles.navItem} ${activeSection === 'backups' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('backups')}>Backup Configuration</button>
          <button className={`${styles.navItem} ${activeSection === 'roles' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('roles')}>User Roles</button>
          <button className={`${styles.navItem} ${activeSection === 'diagnostics' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('diagnostics')}>System Diagnostics</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'account' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Account Settings</h2>
                <p>Manage your profile and preferences</p>
              </div>

              <form onSubmit={updateAccount} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Username</label>
                  <input name="username" defaultValue={currentAccount?.username} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input name="email" type="email" defaultValue={currentAccount?.email} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Display Name</label>
                  <input name="displayName" defaultValue={currentAccount?.displayName} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Bio</label>
                  <textarea name="bio" defaultValue={currentAccount?.bio} className={styles.textarea} rows={3}></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label>Avatar URL</label>
                  <input name="avatar" defaultValue={currentAccount?.avatar} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Timezone</label>
                  <select name="timezone" defaultValue={currentAccount?.timezone} className={styles.select}>
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Language</label>
                  <select name="language" defaultValue={currentAccount?.language} className={styles.select}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <button type="submit" className={styles.primaryBtn}>Save Account Settings</button>
              </form>
            </>
          )}

          {activeSection === 'appearance' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Appearance Customization</h2>
                <p>Personalize your interface</p>
              </div>

              <form onSubmit={updateAppearance} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Theme</label>
                  <select name="theme" defaultValue={currentAppearance?.theme} className={styles.select}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Accent Color</label>
                  <input name="accentColor" type="color" defaultValue={currentAppearance?.accentColor || '#000000'} className={styles.colorInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Font Size</label>
                  <input name="fontSize" type="number" min="12" max="24" defaultValue={currentAppearance?.fontSize || 16} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Font Family</label>
                  <select name="fontFamily" defaultValue={currentAppearance?.fontFamily} className={styles.select}>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input name="compactMode" type="checkbox" defaultChecked={currentAppearance?.compactMode} className={styles.checkbox} />
                    Compact Mode
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input name="animations" type="checkbox" defaultChecked={currentAppearance?.animations} className={styles.checkbox} />
                    Enable Animations
                  </label>
                </div>
                <button type="submit" className={styles.primaryBtn}>Save Appearance</button>
              </form>
            </>
          )}

          {activeSection === 'integrations' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Integration Settings</h2>
                <p>Connect with external services</p>
              </div>

              <div className={styles.healthBadge}>
                Integration Health: {integrationHealth}%
              </div>

              <form onSubmit={addIntegration} className={styles.form}>
                <input name="service" placeholder="Service name (e.g., Slack, GitHub)" required className={styles.input} />
                <input name="apiKey" placeholder="API Key" required className={styles.input} />
                <input name="webhook" placeholder="Webhook URL (optional)" className={styles.input} />
                <input name="syncFrequency" type="number" placeholder="Sync frequency (minutes)" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Add Integration</button>
              </form>

              <div className={styles.integrationsGrid}>
                {integrations.map(integration => (
                  <div key={integration.id} className={`${styles.integrationCard} ${integration.enabled ? styles.enabled : styles.disabled}`}>
                    <div className={styles.integrationHeader}>
                      <h3>{integration.service}</h3>
                      <span className={styles.statusBadge}>
                        {integration.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className={styles.integrationDetails}>
                      <div className={styles.detail}>
                        <strong>API Key:</strong> {integration.apiKey.substring(0, 10)}...
                      </div>
                      <div className={styles.detail}>
                        <strong>Sync:</strong> Every {integration.syncFrequency} minutes
                      </div>
                      {integration.webhook && (
                        <div className={styles.detail}>
                          <strong>Webhook:</strong> Configured
                        </div>
                      )}
                    </div>
                    <button 
                      className={styles.toggleBtn}
                      onClick={() => {
                        setIntegrations(integrations.map(i => 
                          i.id === integration.id ? {...i, enabled: !i.enabled} : i
                        ))
                        addToast(`${integration.service} ${!integration.enabled ? 'enabled' : 'disabled'}`, 'success')
                      }}
                    >
                      {integration.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
