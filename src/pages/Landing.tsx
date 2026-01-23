import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './Landing.module.css'

export function Landing() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleEnter = () => {
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <h1 className={styles.title}>Wilson Collective Group</h1>
        <p className={styles.subtitle}>A Creative Operating System</p>
        <p className={styles.description}>
          For creators, artists, musicians, designers, filmmakers, writers, and builders.
        </p>
        <button className={styles.enterButton} onClick={handleEnter}>
          ENTER
        </button>
      </div>
      <div className={styles.gradient}></div>
    </div>
  )
}


