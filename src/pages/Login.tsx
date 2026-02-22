import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import styles from './Login.module.css'

export function Login() {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        if (password.length < 6) throw new Error('Password must be at least 6 characters')
        await signup(email, name, password)
      } else {
        await login(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'twitter' | 'github') => {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/dashboard' },
    })
    if (error) setError(error.message)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Wilson Collective Group</h1>
          <p className={styles.subtitle}>Creator Platform & AI Companion</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          {error && <div className={styles.error}>{error}</div>}

          {isSignUp && (
            <div className={styles.field}>
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required disabled={loading} />
            </div>
          )}
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required disabled={loading} />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} disabled={loading} />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>or continue with</div>

        <div className={styles.oauthRow}>
          <button className={styles.oauthBtn} onClick={() => handleOAuth('google')} disabled={loading}>Google</button>
          <button className={styles.oauthBtn} onClick={() => handleOAuth('twitter')} disabled={loading}>X / Twitter</button>
          <button className={styles.oauthBtn} onClick={() => handleOAuth('github')} disabled={loading}>GitHub</button>
        </div>

        <div className={styles.toggle}>
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
          <button type="button" className={styles.toggleButton} onClick={() => { setIsSignUp(!isSignUp); setError(''); setEmail(''); setName(''); setPassword('') }} disabled={loading}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}
