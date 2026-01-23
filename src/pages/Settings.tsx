import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import styles from './Settings.module.css'

export function Settings() {
  const { user, logout } = useAuth()
  const { addToast } = useApp()
  const navigate = useNavigate()
  const [editName, setEditName] = useState((user as any)?.user_metadata?.name || '')

  const handleSaveName = () => {
    addToast('Settings updated!', 'success')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account and preferences</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.settingItem}>
          <div>
            <p className={styles.settingLabel}>Name</p>
            <p className={styles.settingValue}>{(user as any)?.user_metadata?.name || user?.email}</p>
          </div>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className={styles.input}
            placeholder="Your name"
          />
          <button onClick={handleSaveName} className={styles.saveBtn}>
            Update
          </button>
        </div>

        <div className={styles.settingItem}>
          <div>
            <p className={styles.settingLabel}>Email</p>
            <p className={styles.settingValue}>{user?.email}</p>
          </div>
        </div>

        <div className={styles.settingItem}>
          <div>
            <p className={styles.settingLabel}>Member Since</p>
            <p className={styles.settingValue}>
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Preferences</h2>
        <div className={styles.settingItem}>
          <div>
            <p className={styles.settingLabel}>Notifications</p>
            <p className={styles.settingValue}>Enabled</p>
          </div>
          <label className={styles.checkbox}>
            <input type="checkbox" defaultChecked />
            <span>Email notifications</span>
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data</h2>
        <button className={styles.exportBtn}>
          Export Your Data
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Danger Zone</h2>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
