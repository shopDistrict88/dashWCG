import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import type { Product, Order } from '../types'
import styles from './Commerce.module.css'

type CTab = 'products' | 'orders' | 'analytics' | 'team' | 'campaigns'

const PRODUCT_TYPES = ['Digital', 'Physical', 'Service', 'Subscription', 'Bundle']
const CATEGORIES = ['Fashion', 'Art', 'Music', 'Design', 'Education', 'Tech', 'Merch']

interface Customer { id: string; name: string; email: string; orders: number; revenue: number; createdAt: string }
interface Feedback { id: string; productId: string; author: string; text: string; rating: number; date: string }
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface CComment { id: string; targetId: string; author: string; text: string; date: string }
interface Campaign { id: string; name: string; productIds: string[]; budget: number; roi: number; status: 'planning' | 'active' | 'completed'; progress: number; createdAt: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

export function Commerce() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [tab, setTab] = useState<CTab>('products')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [focusMode, setFocusMode] = useState(false)

  const products = dashboard.products
  const orders = dashboard.orders

  const [customers, setCustomers] = useCloudStorage<Customer[]>('cm_customers', [])
  const [feedbacks, setFeedbacks] = useCloudStorage<Feedback[]>('cm_feedbacks', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('cm_collabs', [])
  const [cComments, setCComments] = useCloudStorage<CComment[]>('cm_comments', [])
  const [campaigns, setCampaigns] = useCloudStorage<Campaign[]>('cm_campaigns', [])

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0

  const filteredProducts = useMemo(() => {
    let r = [...products]
    if (searchQuery) r = r.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    if (filterType) r = r.filter(p => p.status === (filterType === 'active' ? 'active' : 'draft'))
    return r
  }, [products, searchQuery, filterType])

  const getScarcity = (timer?: string) => {
    if (!timer) return null
    const days = Math.ceil((new Date(timer).getTime() - Date.now()) / 86400000)
    return { days: Math.max(0, days), expired: days <= 0 }
  }

  const handleAddProduct = (p: { name: string; price: number; description: string; inventory?: number; scarcityDays?: number }) => {
    const scarityTimer = p.scarcityDays ? new Date(Date.now() + p.scarcityDays * 86400000).toISOString() : undefined
    const newProduct: Product = { id: uid(), name: p.name, price: p.price, description: p.description, inventory: p.inventory, status: 'draft', scarityTimer, feedbackCollected: 0 }
    updateDashboard({ products: [...products, newProduct], activity: [...dashboard.activity, { id: uid(), type: 'product', title: `Created: ${p.name}`, timestamp: now(), action: 'created' }] })
    addToast('Product created', 'success'); setShowForm(null)
  }

  const tabs: [CTab, string][] = [['products', 'Products'], ['orders', 'Orders'], ['analytics', 'Analytics'], ['team', 'Team'], ['campaigns', 'Campaigns']]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Commerce</h1><p className={styles.subtitle}>Products · Orders · Analytics · Growth</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('products'); setShowForm('product') }}>+ New Product</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ PRODUCTS (#1-10) ═══ */}
        {tab === 'products' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Products</div><div className={styles.kpiValue}>{products.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active</div><div className={styles.kpiValue}>{products.filter(p => p.status === 'active').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Revenue</div><div className={styles.kpiValue}>${totalRevenue.toFixed(0)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Orders</div><div className={styles.kpiValue}>{orders.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Feedback</div><div className={styles.kpiValue}>{feedbacks.length}</div></div>
          </div>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products... (#5)" />
            <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All</option><option value="active">Active</option><option value="draft">Draft</option></select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'product' ? null : 'product')}>+ New Product (#1)</button>
          </div>

          {showForm === 'product' && <ProductForm onAdd={handleAddProduct} onCancel={() => setShowForm(null)} />}

          <div className={styles.cardGrid}>{filteredProducts.map(p => {
            const sc = getScarcity(p.scarityTimer)
            const pOrders = orders.filter(o => o.productId === p.id)
            const pRevenue = pOrders.reduce((s, o) => s + o.total, 0)
            return <div key={p.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{p.name}</span>
                <span className={`${styles.statusBadge} ${p.status === 'active' ? styles.st_active : styles.st_draft}`}>{p.status === 'active' ? 'Live' : 'Draft'}</span>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.priceTag}>${p.price.toFixed(2)}</span>
                {p.inventory !== undefined && <span className={styles.tag}>{p.inventory > 0 ? `${p.inventory} in stock` : 'Out of stock'}</span>}
                {p.inventory !== undefined && p.inventory > 0 && p.inventory <= 5 && <span className={styles.alertTag}>Low stock (#2)</span>}
              </div>
              {sc && <div className={`${styles.scarcityBar} ${sc.expired ? styles.scarcityExpired : ''}`}>{sc.expired ? 'Expired' : `${sc.days}d remaining (#3)`}</div>}
              {p.description && <p className={styles.cardPreview}>{p.description.slice(0, 80)}</p>}
              <div className={styles.scoreRow}>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Orders</span><span className={styles.scoreVal}>{pOrders.length}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Revenue</span><span className={styles.scoreVal}>${pRevenue.toFixed(0)}</span></div>
                <div className={styles.scoreItem}><span className={styles.scoreLabel}>Feedback</span><span className={styles.scoreVal}>{p.feedbackCollected || 0}</span></div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.ghostBtn} onClick={() => updateDashboard({ products: products.map(x => x.id === p.id ? { ...x, status: x.status === 'draft' ? 'active' : 'draft' } : x) })}>{p.status === 'draft' ? 'Publish' : 'Unpublish'}</button>
                <button className={styles.ghostBtn} onClick={() => { updateDashboard({ products: [...products, { ...p, id: uid(), name: `${p.name} (Copy)`, status: 'draft' }] }); addToast('Product duplicated', 'success') }}>Duplicate (#7)</button>
                <button className={styles.ghostBtn} onClick={() => { const newOrder: Order = { id: uid(), productId: p.id, quantity: 1, total: p.price, status: 'completed', createdAt: now() }; updateDashboard({ orders: [...orders, newOrder] }); addToast('Order recorded', 'success') }}>+ Order</button>
                <button className={styles.deleteBtn} onClick={() => { updateDashboard({ products: products.filter(x => x.id !== p.id) }); addToast('Product removed', 'success') }}>×</button>
              </div>
            </div>
          })}</div>
          {filteredProducts.length === 0 && <p className={styles.emptyState}>No products yet. Create your first one above.</p>}
        </div>}

        {/* ═══ ORDERS (#11-20) ═══ */}
        {tab === 'orders' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Orders & Customers</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Orders (#11)</div><div className={styles.kpiValue}>{orders.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Revenue (#13)</div><div className={styles.kpiValue}>${totalRevenue.toFixed(2)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Order</div><div className={styles.kpiValue}>${avgOrderValue.toFixed(2)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Customers (#12)</div><div className={styles.kpiValue}>{customers.length}</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Recent Orders (#11)</label>
            {orders.length === 0 ? <p className={styles.helperText}>No orders yet.</p> : (
              <div className={styles.tableWrap}>
                <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>Product</span><span className={styles.tableHeader}>Qty</span><span className={styles.tableHeader}>Total</span><span className={styles.tableHeader}>Status</span><span className={styles.tableHeader}>Date</span></div>
                {[...orders].reverse().slice(0, 20).map(o => {
                  const p = products.find(x => x.id === o.productId)
                  return <div key={o.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{p?.name || 'Unknown'}</span><span className={styles.tableCell}>{o.quantity}</span><span className={styles.tableCell}>${o.total.toFixed(2)}</span><span className={styles.tableCell}><span className={`${styles.statusBadge} ${o.status === 'completed' ? styles.st_active : styles.st_draft}`}>{o.status}</span></span><span className={styles.tableCell}>{fmtDate(o.createdAt)}</span></div>
                })}
              </div>
            )}
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Customers (#12)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'customer' ? null : 'customer')}>+ Add</button></div>
            {showForm === 'customer' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="cust_name" /><input className={styles.input} placeholder="Email" id="cust_email" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('cust_name') as HTMLInputElement).value; if (n) { setCustomers(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('cust_email') as HTMLInputElement).value, orders: 0, revenue: 0, createdAt: now() }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{customers.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.helperText}>{c.email}</span><span className={styles.tag}>{c.orders} orders · ${c.revenue}</span><button className={styles.deleteBtn} onClick={() => setCustomers(prev => prev.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Payout & Tax (#15-16)</label>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Gross Revenue</div><div className={styles.kpiValue}>${totalRevenue.toFixed(2)}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Est. Tax (8%)</div><div className={styles.kpiValue}>${(totalRevenue * 0.08).toFixed(2)}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Est. Fees (3%)</div><div className={styles.kpiValue}>${(totalRevenue * 0.03).toFixed(2)}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Net (#15)</div><div className={styles.kpiValue}>${(totalRevenue * 0.89).toFixed(2)}</div></div>
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const csv = `Product,Qty,Total,Status,Date\n${orders.map(o => { const p = products.find(x => x.id === o.productId); return `"${p?.name || 'Unknown'}",${o.quantity},${o.total.toFixed(2)},${o.status},${o.createdAt}` }).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `orders-${Date.now()}.csv`; a.click() }}>Export Orders CSV (#18)</button>
          </div>
        </div>}

        {/* ═══ ANALYTICS (#21-30) ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics & Feedback</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Revenue</div><div className={styles.kpiValue}>${totalRevenue.toFixed(0)}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Products</div><div className={styles.kpiValue}>{products.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Orders</div><div className={styles.kpiValue}>{orders.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Rating (#22)</div><div className={styles.kpiValue}>{feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '—'}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Conversion</div><div className={styles.kpiValue}>{products.length ? Math.round(orders.length / products.length * 10) : 0}%</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Product Performance (#21, #25)</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>Product</span><span className={styles.tableHeader}>Price</span><span className={styles.tableHeader}>Orders</span><span className={styles.tableHeader}>Revenue</span><span className={styles.tableHeader}>Feedback</span></div>
              {products.map(p => { const po = orders.filter(o => o.productId === p.id); const pr = po.reduce((s, o) => s + o.total, 0); const pf = feedbacks.filter(f => f.productId === p.id); return <div key={p.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{p.name}</span><span className={styles.tableCell}>${p.price.toFixed(2)}</span><span className={styles.tableCell}>{po.length}</span><span className={styles.tableCell}>${pr.toFixed(0)}</span><span className={styles.tableCell}>{pf.length > 0 ? `${(pf.reduce((s, f) => s + f.rating, 0) / pf.length).toFixed(1)}/5` : '—'}</span></div> })}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Customer Feedback (#22)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'feedback' ? null : 'feedback')}>+ Add</button></div>
            {showForm === 'feedback' && <div className={styles.inlineForm}><select className={styles.select} id="fb_prod">{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><input className={styles.input} placeholder="Author" id="fb_auth" /><input className={styles.input} type="number" min={1} max={5} placeholder="Rating 1-5" id="fb_rate" /><textarea className={styles.textarea} rows={2} placeholder="Feedback..." id="fb_text" style={{ flex: 1, minWidth: 200 }} /><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('fb_text') as HTMLTextAreaElement).value; if (t) { const pid = (document.getElementById('fb_prod') as HTMLSelectElement).value; setFeedbacks(prev => [...prev, { id: uid(), productId: pid, author: (document.getElementById('fb_auth') as HTMLInputElement).value || 'Anonymous', text: t, rating: Number((document.getElementById('fb_rate') as HTMLInputElement).value) || 5, date: now() }]); updateDashboard({ products: products.map(p => p.id === pid ? { ...p, feedbackCollected: (p.feedbackCollected || 0) + 1 } : p) }); setShowForm(null) } }}>Submit</button></div>}
            {feedbacks.slice(0, 10).map(f => { const p = products.find(x => x.id === f.productId); return <div key={f.id} className={styles.taskItem}><span className={styles.taskContent}><strong>{f.author}</strong> on {p?.name || 'Unknown'}: {f.text}</span><span className={styles.scoreBadge}>{f.rating}/5</span><span className={styles.helperText}>{fmtDate(f.date)}</span></div> })}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Scarcity Effectiveness (#23)</label>
            <div className={styles.cardGrid}>{products.filter(p => p.scarityTimer).map(p => { const sc = getScarcity(p.scarityTimer); const po = orders.filter(o => o.productId === p.id); return <div key={p.id} className={styles.card} style={{ cursor: 'default' }}><span className={styles.cardTitle}>{p.name}</span><div className={styles.cardMeta}><span className={styles.tag}>{sc?.expired ? 'Expired' : `${sc?.days}d left`}</span><span className={styles.helperText}>{po.length} orders during scarcity</span></div></div> })}</div>
            {products.filter(p => p.scarityTimer).length === 0 && <p className={styles.helperText}>No products with scarcity timers.</p>}
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Commerce Report\n${'='.repeat(40)}\nProducts: ${products.length}\nOrders: ${orders.length}\nRevenue: $${totalRevenue.toFixed(2)}\nAvg Order: $${avgOrderValue.toFixed(2)}\nFeedback: ${feedbacks.length}\nAvg Rating: ${feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 'N/A'}\n\n${'─'.repeat(40)}\nProducts:\n${products.map(p => { const po = orders.filter(o => o.productId === p.id); return `  ${p.name} | $${p.price} | ${po.length} orders | $${po.reduce((s, o) => s + o.total, 0).toFixed(0)} rev` }).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `commerce-report-${Date.now()}.txt`; a.click() }}>Full Report (#26)</button>
            <button className={styles.exportBtn} onClick={() => { const csv = `Product,Price,Orders,Revenue,Rating\n${products.map(p => { const po = orders.filter(o => o.productId === p.id); const pf = feedbacks.filter(f => f.productId === p.id); return `"${p.name}",${p.price},${po.length},${po.reduce((s, o) => s + o.total, 0).toFixed(2)},${pf.length ? (pf.reduce((s, f) => s + f.rating, 0) / pf.length).toFixed(1) : ''}` }).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `analytics-${Date.now()}.csv`; a.click() }}>Export CSV</button>
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>Revenue Forecast (#28)</div>
            <pre className={styles.aiOutput}>{`Commerce Intelligence\n${'─'.repeat(35)}\n• ${products.length} products, ${products.filter(p => p.status === 'active').length} active\n• ${orders.length} total orders, $${totalRevenue.toFixed(2)} revenue\n• Avg order value: $${avgOrderValue.toFixed(2)}\n• Projected monthly (at current rate): $${(totalRevenue * 1.15).toFixed(0)}\n• Top product: ${products.length ? [...products].sort((a, b) => orders.filter(o => o.productId === b.id).length - orders.filter(o => o.productId === a.id).length)[0]?.name || 'N/A' : 'N/A'}\n• ${products.filter(p => p.inventory !== undefined && p.inventory <= 5).length} products with low stock\n• Recommendation: ${orders.length < 5 ? 'Focus on driving initial sales.' : totalRevenue > 1000 ? 'Scale winning products.' : 'Optimize pricing and conversion.'}`}</pre>
          </div>
        </div>}

        {/* ═══ TEAM (#31-40) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team & Collaboration</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#31-32)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Invite</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="cl_name" /><input className={styles.input} placeholder="Email" id="cl_email" /><select className={styles.select} id="cl_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('cl_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('cl_email') as HTMLInputElement).value, role: (document.getElementById('cl_role') as HTMLSelectElement).value as Collaborator['role'] }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion (#33, #39)</label>
            <div className={styles.commentList}>{cComments.slice(0, 15).map(c => <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>)}</div>
            <div className={styles.inlineForm}><input className={styles.input} placeholder="Add comment..." id="ccom_input" /><button className={styles.ghostBtn} onClick={() => { const text = (document.getElementById('ccom_input') as HTMLInputElement).value; if (text) { setCComments(prev => [{ id: uid(), targetId: '', author: 'You', text, date: now() }, ...prev]); (document.getElementById('ccom_input') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Approval Queue (#36)</label>
            {products.filter(p => p.status === 'draft').map(p => <div key={p.id} className={styles.taskItem}><span className={styles.taskContent}>{p.name} — ${p.price.toFixed(2)}</span><button className={styles.ghostBtn} onClick={() => updateDashboard({ products: products.map(x => x.id === p.id ? { ...x, status: 'active' } : x) })}>Approve & Publish</button></div>)}
            {products.filter(p => p.status === 'draft').length === 0 && <p className={styles.helperText}>No products pending approval.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Activity Log (#38)</label>
            <div className={styles.timeline}>{dashboard.activity.filter(a => a.type === 'product' || a.type === 'order').slice(-10).reverse().map(a => <div key={a.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{a.title} — {fmtDate(a.timestamp)}</span></div>)}</div>
          </div>
        </div>}

        {/* ═══ CAMPAIGNS (#10, #29-30) ═══ */}
        {tab === 'campaigns' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Campaigns & ROI</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Campaign Boards (#30)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'campaign' ? null : 'campaign')}>+ New</button></div>
            {showForm === 'campaign' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Campaign name" id="cmp_name" /><input className={styles.input} type="number" placeholder="Budget $" id="cmp_budget" /><input className={styles.input} type="number" placeholder="Expected ROI %" id="cmp_roi" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('cmp_name') as HTMLInputElement).value; if (n) { setCampaigns(prev => [...prev, { id: uid(), name: n, productIds: [], budget: Number((document.getElementById('cmp_budget') as HTMLInputElement).value) || 0, roi: Number((document.getElementById('cmp_roi') as HTMLInputElement).value) || 0, status: 'planning', progress: 0, createdAt: now() }]); setShowForm(null) } }}>Create</button></div>}
            <div className={styles.cardGrid}>{campaigns.map(c => <div key={c.id} className={styles.card} style={{ cursor: 'default' }}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{c.name}</span><span className={`${styles.statusBadge} ${c.status === 'active' ? styles.st_active : c.status === 'completed' ? styles.st_completed : styles.st_draft}`}>{c.status}</span></div>
              <div className={styles.cardMeta}>{c.budget > 0 && <span className={styles.tag}>${c.budget} budget</span>}{c.roi > 0 && <span className={styles.scoreBadge}>{c.roi}% ROI</span>}</div>
              <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${c.progress}%` }} /></div><span className={styles.helperText}>{c.progress}%</span></div>
              <div className={styles.cardActions}><input type="range" min={0} max={100} value={c.progress} onChange={e => setCampaigns(prev => prev.map(x => x.id === c.id ? { ...x, progress: Number(e.target.value) } : x))} className={styles.range} style={{ flex: 1 }} /><select className={styles.miniSelect} value={c.status} onChange={e => setCampaigns(prev => prev.map(x => x.id === c.id ? { ...x, status: e.target.value as Campaign['status'] } : x))}><option value="planning">Planning</option><option value="active">Active</option><option value="completed">Completed</option></select><button className={styles.deleteBtn} onClick={() => setCampaigns(prev => prev.filter(x => x.id !== c.id))}>×</button></div>
            </div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Campaign KPIs</label>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Spend</div><div className={styles.kpiValue}>${campaigns.reduce((s, c) => s + c.budget, 0).toLocaleString()}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg ROI</div><div className={styles.kpiValue}>{campaigns.length ? Math.round(campaigns.reduce((s, c) => s + c.roi, 0) / campaigns.length) : 0}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active</div><div className={styles.kpiValue}>{campaigns.filter(c => c.status === 'active').length}</div></div>
            </div>
          </div>
        </div>}

      </main>
    </div>
  )
}

function ProductForm({ onAdd, onCancel }: { onAdd: (p: { name: string; price: number; description: string; inventory?: number; scarcityDays?: number }) => void; onCancel: () => void }) {
  const [name, setName] = useState(''); const [price, setPrice] = useState(''); const [desc, setDesc] = useState('')
  const [inv, setInv] = useState(''); const [scarcity, setScarcity] = useState('')
  return (
    <div className={styles.formPanel}>
      <div className={styles.formStack}>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Product Name (#1)</label><input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Digital Download" /></div>
          <div className={styles.formGroup}><label>Price ($)</label><input className={styles.input} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="9.99" /></div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.formGroup}><label>Inventory (#2)</label><input className={styles.input} type="number" value={inv} onChange={e => setInv(e.target.value)} placeholder="Blank for unlimited" /></div>
          <div className={styles.formGroup}><label>Scarcity Days (#3)</label><input className={styles.input} type="number" value={scarcity} onChange={e => setScarcity(e.target.value)} placeholder="e.g., 3" /></div>
        </div>
        <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your product..." /></div>
        <div className={styles.fieldRow}>
          <button className={styles.primaryBtn} onClick={() => { if (name && price) onAdd({ name, price: parseFloat(price), description: desc, inventory: inv ? parseInt(inv) : undefined, scarcityDays: scarcity ? parseInt(scarcity) : undefined }) }}>Create Product</button>
          <button className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
