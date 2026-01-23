import { useApp } from '../context/AppContext'
import styles from './Toast.module.css'

export function ToastContainer() {
  const { toasts } = useApp()

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
