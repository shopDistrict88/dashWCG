import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Product, Order } from '../types'
import styles from './Commerce.module.css'

export function Commerce() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [inventory, setInventory] = useState('')
  const [scarityDays, setScarcityDays] = useState('')
  const [feedbackModal, setFeedbackModal] = useState<{ visible: boolean; productId?: string }>({ visible: false })
  const [feedbackText, setFeedbackText] = useState('')

  const products = dashboard.products
  const orders = dashboard.orders

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim() || !price) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    const scarityTimer = scarityDays ? new Date(Date.now() + parseInt(scarityDays) * 24 * 60 * 60 * 1000).toISOString() : undefined

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: productName,
      price: parseFloat(price),
      description,
      inventory: inventory ? parseInt(inventory) : undefined,
      status: 'draft',
      scarityTimer,
      feedbackCollected: 0,
    }

    updateDashboard({
      products: [...products, newProduct],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'product',
          title: `Created product: ${productName}`,
          timestamp: new Date().toISOString(),
          action: 'created',
        },
      ],
    })

    setProductName('')
    setPrice('')
    setDescription('')
    setInventory('')
    setScarcityDays('')
    addToast('Product created!', 'success')
  }

  const handleDeleteProduct = (id: string) => {
    updateDashboard({
      products: products.filter((p) => p.id !== id),
    })
    addToast('Product deleted', 'success')
  }

  const handlePublishProduct = (id: string) => {
    updateDashboard({
      products: products.map((p) =>
        p.id === id ? { ...p, status: p.status === 'draft' ? 'active' : 'draft' } : p
      ),
    })
  }

  const handleAddOrder = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      quantity: 1,
      total: product.price,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }

    updateDashboard({
      orders: [...orders, newOrder],
      activity: [
        ...dashboard.activity,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'order',
          title: `Order: ${product.name}`,
          timestamp: new Date().toISOString(),
          action: 'purchased',
        },
      ],
    })
    addToast('Order recorded!', 'success')
  }

  const handleAddFeedback = (productId: string) => {
    if (!feedbackText.trim()) {
      addToast('Please enter feedback', 'error')
      return
    }

    updateDashboard({
      products: products.map((p) =>
        p.id === productId
          ? { ...p, feedbackCollected: (p.feedbackCollected || 0) + 1 }
          : p
      ),
    })

    setFeedbackText('')
    setFeedbackModal({ visible: false })
    addToast('Feedback recorded! Thank you.', 'success')
  }

  const getScarcityStatus = (scarityTimer?: string): { days: number; expired: boolean; text: string } => {
    if (!scarityTimer) return { days: 0, expired: false, text: 'No scarcity' }
    const now = new Date().getTime()
    const end = new Date(scarityTimer).getTime()
    const diff = end - now
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return {
      days: Math.max(0, days),
      expired: days <= 0,
      text: days > 0 ? `${days}d left` : 'Expired',
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Commerce</h1>
        <p className={styles.subtitle}>Sell products with scarcity strategies & feedback</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statValue}>{products.length}</p>
          <p className={styles.statLabel}>Products</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statValue}>{orders.length}</p>
          <p className={styles.statLabel}>Orders</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statValue}>${totalRevenue.toFixed(2)}</p>
          <p className={styles.statLabel}>Revenue</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statValue}>{products.reduce((sum, p) => sum + (p.feedbackCollected || 0), 0)}</p>
          <p className={styles.statLabel}>Feedbacks</p>
        </div>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Add Product</h2>
        <form onSubmit={handleAddProduct} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Product Name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Digital Download"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.99"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Inventory</label>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                placeholder="Leave blank for unlimited"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Scarcity (days)</label>
              <input
                type="number"
                value={scarityDays}
                onChange={(e) => setScarcityDays(e.target.value)}
                placeholder="e.g., 3 for 3-day countdown"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product"
              rows={3}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Add Product
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Products</h2>
        {products.length === 0 ? (
          <p className={styles.empty}>No products yet. Create one above!</p>
        ) : (
          <div className={styles.productsList}>
            {products.map((product) => {
              const scarcity = getScarcityStatus(product.scarityTimer)
              return (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productHeader}>
                    <div>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={styles.publishBtn}
                        onClick={() => handlePublishProduct(product.id)}
                      >
                        {product.status === 'draft' ? 'Publish' : 'Unpublish'}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {product.scarityTimer && (
                    <div className={`${styles.scarcityBanner} ${scarcity.expired ? styles.expired : ''}`}>
                      ⏰ {scarcity.text}
                    </div>
                  )}

                  {product.description && (
                    <p className={styles.description}>{product.description}</p>
                  )}

                  {product.feedbackCollected && product.feedbackCollected > 0 && (
                    <div className={styles.feedbackBadge}>
                      💬 {product.feedbackCollected} feedback(s)
                    </div>
                  )}

                  <div className={styles.footer}>
                    {product.inventory && (
                      <span className={styles.inventory}>
                        Stock: {product.inventory}
                      </span>
                    )}
                    <span
                      className={`${styles.status} ${styles[product.status]}`}
                    >
                      {product.status === 'draft' ? 'Draft' : 'Live'}
                    </span>
                  </div>

                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.orderBtn}
                      onClick={() => handleAddOrder(product.id)}
                    >
                      📦 Simulate Order
                    </button>
                    <button
                      className={styles.feedbackBtn}
                      onClick={() => setFeedbackModal({ visible: true, productId: product.id })}
                    >
                      💬 Add Feedback
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        {orders.length === 0 ? (
          <p className={styles.empty}>No orders yet</p>
        ) : (
          <div className={styles.ordersList}>
            {orders
              .slice()
              .reverse()
              .slice(0, 10)
              .map((order) => {
                const product = products.find((p) => p.id === order.productId)
                return (
                  <div key={order.id} className={styles.orderItem}>
                    <div className={styles.orderInfo}>
                      <p className={styles.orderProduct}>{product?.name}</p>
                      <p className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={styles.orderTotal}>${order.total.toFixed(2)}</p>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {feedbackModal.visible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Leave Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.submitBtn}
                onClick={() => handleAddFeedback(feedbackModal.productId!)}
              >
                Submit Feedback
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setFeedbackModal({ visible: false })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
