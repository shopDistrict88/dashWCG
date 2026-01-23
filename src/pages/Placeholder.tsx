import styles from './Placeholder.module.css'

interface PlaceholderProps {
  title: string
  description?: string
}

export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.content}>
        <p className={styles.message}>Coming soon...</p>
        <div className={styles.icon}>🚀</div>
      </div>
    </div>
  )
}
