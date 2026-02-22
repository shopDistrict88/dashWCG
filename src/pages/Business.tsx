import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './Business.module.css'

type BTab = 'dashboard' | 'financial' | 'goals' | 'analytics' | 'reports' | 'team' | 'advanced'

interface MonthlyMetric { month: string; revenue: number; expenses: number; newCustomers: number }
interface Budget { id: string; month: string; planned: number; actual: number; category: string }
interface Goal { id: string; title: string; type: 'quarterly' | 'annual'; target: number; current: number; kpi: string; assignee: string; status: 'on-track' | 'at-risk' | 'off-track' | 'completed'; deadline: string; createdAt: string }
interface BComment { id: string; targetId: string; author: string; text: string; date: string }
interface TeamMember { id: string; name: string; role: string; email: string }
interface Milestone { id: string; goalId: string; title: string; done: boolean; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const EXPENSE_CATS = ['Marketing', 'Payroll', 'Software', 'Rent', 'Supplies', 'Travel', 'Legal', 'Other']
const KPIS = ['Revenue', 'Profit', 'Customers', 'Churn Rate', 'Conversion', 'MRR', 'ARR', 'CAC', 'LTV']

export function Business() {
  const { addToast } = useApp()
  const [tab, setTab] = useState<BTab>('dashboard')

  const [metrics, setMetrics] = useCloudStorage<MonthlyMetric[]>('biz_metrics', [
    { month: 'January', revenue: 5000, expenses: 2000, newCustomers: 12 },
    { month: 'February', revenue: 7500, expenses: 2500, newCustomers: 18 },
    { month: 'March', revenue: 9200, expenses: 3000, newCustomers: 22 },
  ])
  const [budgets, setBudgets] = useCloudStorage<Budget[]>('biz_budgets', [])
  const [goals, setGoals] = useCloudStorage<Goal[]>('biz_goals', [])
  const [bComments, setBComments] = useCloudStorage<BComment[]>('biz_comments', [])
  const [teamMembers, setTeamMembers] = useCloudStorage<TeamMember[]>('biz_team', [])
  const [milestones, setMilestones] = useCloudStorage<Milestone[]>('biz_milestones', [])
  const [showForm, setShowForm] = useState<string | null>(null)
  const [focusMode, setFocusMode] = useState(false)
  const [forecastMonths, setForecastMonths] = useState(3)

  // Computed
  const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0)
  const totalExpenses = metrics.reduce((s, m) => s + m.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const totalCustomers = metrics.reduce((s, m) => s + m.newCustomers, 0)
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0'
  const latest = metrics[metrics.length - 1]

  const healthScore = useMemo(() => {
    let s = 50
    if (metrics.length >= 2) {
      const rg = ((metrics[metrics.length - 1].revenue - metrics[metrics.length - 2].revenue) / metrics[metrics.length - 2].revenue) * 100
      if (rg > 20) s += 20; else if (rg > 10) s += 10
      const cg = ((metrics[metrics.length - 1].newCustomers - metrics[metrics.length - 2].newCustomers) / metrics[metrics.length - 2].newCustomers) * 100
      if (cg > 15) s += 10
    }
    const profit = latest.revenue - latest.expenses
    const mp = (profit / latest.revenue) * 100
    if (mp > 40) s += 20; else if (mp > 20) s += 10
    return Math.min(100, s)
  }, [metrics])

  const healthStatus = healthScore >= 70 ? 'Excellent' : healthScore >= 50 ? 'Good' : 'Needs Attention'

  // Forecast (#13)
  const forecast = useMemo(() => {
    if (metrics.length < 2) return []
    const revGrowth = (metrics[metrics.length - 1].revenue - metrics[metrics.length - 2].revenue) / metrics[metrics.length - 2].revenue
    const expGrowth = (metrics[metrics.length - 1].expenses - metrics[metrics.length - 2].expenses) / metrics[metrics.length - 2].expenses
    const result = []
    for (let i = 1; i <= forecastMonths; i++) {
      result.push({
        month: `Forecast +${i}`,
        revenue: Math.round(latest.revenue * Math.pow(1 + revGrowth, i)),
        expenses: Math.round(latest.expenses * Math.pow(1 + expGrowth, i)),
      })
    }
    return result
  }, [metrics, forecastMonths])

  const handleAddMonth = () => {
    setMetrics([...metrics, { month: `Month ${metrics.length + 1}`, revenue: 10000, expenses: 3000, newCustomers: 25 }])
    addToast('Month added', 'success')
  }

  const handleUpdateMetric = (index: number, field: keyof MonthlyMetric, value: string | number) => {
    const updated = [...metrics]
    if (field === 'month') updated[index].month = value as string
    else updated[index][field] = typeof value === 'string' ? parseFloat(value) || 0 : value
    setMetrics(updated)
  }

  const tabs: [BTab, string][] = [
    ['dashboard', 'Dashboard'], ['financial', 'Financial'], ['goals', 'Goals'],
    ['analytics', 'Analytics'], ['reports', 'Reports'], ['team', 'Team'], ['advanced', 'Advanced'],
  ]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Business Management</h1>
          <p className={styles.subtitle}>Performance & Strategy Hub</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>
        {tabs.map(([key, label]) => (
          <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </nav>

      <main className={styles.mainContent}>
        {/* ═══ DASHBOARD TAB (#1-10) ═══ */}
        {tab === 'dashboard' && (
          <div className={styles.section}>
            <div className={styles.healthCard}>
              <div className={styles.healthScore}><div className={styles.healthNum}>{healthScore}</div><div className={styles.healthLabel}>{healthStatus}</div></div>
              <div className={styles.kpiRow}>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Revenue (#2)</div><div className={styles.kpiValue}>${latest.revenue.toLocaleString()}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Margin (#3)</div><div className={styles.kpiValue}>{avgMargin}%</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Customers (#4)</div><div className={styles.kpiValue}>{totalCustomers}</div></div>
                <div className={styles.kpiCard}><div className={styles.kpiLabel}>Profit</div><div className={styles.kpiValue}>${totalProfit.toLocaleString()}</div></div>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Monthly Performance (#5-6)</label><button className={styles.ghostBtn} onClick={handleAddMonth}>+ Add Month</button></div>
              <div className={styles.metricsTable}>
                <div className={styles.tableRow}><div className={styles.tableHeader}>Month</div><div className={styles.tableHeader}>Revenue</div><div className={styles.tableHeader}>Expenses</div><div className={styles.tableHeader}>Profit</div><div className={styles.tableHeader}>Customers</div></div>
                {metrics.map((m, i) => {
                  const profit = m.revenue - m.expenses
                  return (
                    <div key={i} className={styles.tableRow}>
                      <div className={styles.tableCell}><input className={styles.cellInput} value={m.month} onChange={e => handleUpdateMetric(i, 'month', e.target.value)} /></div>
                      <div className={styles.tableCell}><input className={styles.cellInput} type="number" value={m.revenue} onChange={e => handleUpdateMetric(i, 'revenue', e.target.value)} /></div>
                      <div className={styles.tableCell}><input className={styles.cellInput} type="number" value={m.expenses} onChange={e => handleUpdateMetric(i, 'expenses', e.target.value)} /></div>
                      <div className={styles.tableCell}><span className={profit > 0 ? styles.profitPositive : styles.profitNegative}>${profit.toLocaleString()}</span></div>
                      <div className={styles.tableCell}><input className={styles.cellInput} type="number" value={m.newCustomers} onChange={e => handleUpdateMetric(i, 'newCustomers', e.target.value)} /></div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Revenue Trend (#9-10)</label>
              <div className={styles.barChart}>{metrics.map((m, i) => {
                const max = Math.max(...metrics.map(x => x.revenue))
                return <div key={i} className={styles.barGroup}><div className={styles.bar} style={{ height: `${(m.revenue / max) * 120}px` }} /><span className={styles.barLabel}>{m.month.slice(0, 3)}</span></div>
              })}</div>
            </div>
          </div>
        )}

        {/* ═══ FINANCIAL TAB (#11-20) ═══ */}
        {tab === 'financial' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Financial Planning</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Revenue</div><div className={styles.kpiValue}>${totalRevenue.toLocaleString()}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Expenses</div><div className={styles.kpiValue}>${totalExpenses.toLocaleString()}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Profit</div><div className={styles.kpiValue}>${totalProfit.toLocaleString()}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Budgets</div><div className={styles.kpiValue}>{budgets.length}</div></div>
            </div>

            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Budget Tracker (#11-12)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'budget' ? null : 'budget')}>+ Add</button></div>
              {showForm === 'budget' && (
                <div className={styles.inlineForm}>
                  <input className={styles.input} placeholder="Month" id="bud_month" />
                  <select className={styles.select} id="bud_cat">{EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}</select>
                  <input className={styles.input} type="number" placeholder="Planned" id="bud_planned" />
                  <input className={styles.input} type="number" placeholder="Actual" id="bud_actual" />
                  <button className={styles.primaryBtn} onClick={() => {
                    const month = (document.getElementById('bud_month') as HTMLInputElement).value
                    if (month) { setBudgets(prev => [...prev, { id: uid(), month, category: (document.getElementById('bud_cat') as HTMLSelectElement).value, planned: Number((document.getElementById('bud_planned') as HTMLInputElement).value) || 0, actual: Number((document.getElementById('bud_actual') as HTMLInputElement).value) || 0 }]); setShowForm(null) }
                  }}>Add</button>
                </div>
              )}
              <div className={styles.metricsTable}>
                <div className={styles.tableRow}><div className={styles.tableHeader}>Month</div><div className={styles.tableHeader}>Category</div><div className={styles.tableHeader}>Planned</div><div className={styles.tableHeader}>Actual</div><div className={styles.tableHeader}>Variance</div></div>
                {budgets.map(b => {
                  const variance = b.planned - b.actual
                  return (
                    <div key={b.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>{b.month}</div>
                      <div className={styles.tableCell}><span className={styles.tag}>{b.category}</span></div>
                      <div className={styles.tableCell}>${b.planned.toLocaleString()}</div>
                      <div className={styles.tableCell}>${b.actual.toLocaleString()}</div>
                      <div className={styles.tableCell}><span className={variance >= 0 ? styles.profitPositive : styles.profitNegative}>${variance.toLocaleString()}</span></div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Revenue Forecast (#13)</label>
              <div className={styles.fieldRow}><label>Forecast months: {forecastMonths}</label><input type="range" min={1} max={12} value={forecastMonths} onChange={e => setForecastMonths(Number(e.target.value))} className={styles.range} /></div>
              <div className={styles.metricsTable}>
                <div className={styles.tableRow}><div className={styles.tableHeader}>Period</div><div className={styles.tableHeader}>Revenue</div><div className={styles.tableHeader}>Expenses</div><div className={styles.tableHeader}>Profit</div></div>
                {forecast.map((f, i) => (
                  <div key={i} className={styles.tableRow}>
                    <div className={styles.tableCell}>{f.month}</div>
                    <div className={styles.tableCell}>${f.revenue.toLocaleString()}</div>
                    <div className={styles.tableCell}>${f.expenses.toLocaleString()}</div>
                    <div className={styles.tableCell}><span className={f.revenue - f.expenses > 0 ? styles.profitPositive : styles.profitNegative}>${(f.revenue - f.expenses).toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Expense Breakdown (#14)</label>
              <div className={styles.kpiRow}>
                {EXPENSE_CATS.slice(0, 6).map(cat => {
                  const total = budgets.filter(b => b.category === cat).reduce((s, b) => s + b.actual, 0)
                  return <div key={cat} className={styles.kpiCard}><div className={styles.kpiLabel}>{cat}</div><div className={styles.kpiValue}>${total.toLocaleString()}</div></div>
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ GOALS TAB (#21-30) ═══ */}
        {tab === 'goals' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Goals & Performance</h2>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'goal' ? null : 'goal')}>+ Set Goal (#21)</button>
            {showForm === 'goal' && (
              <div className={styles.inlineForm}>
                <input className={styles.input} placeholder="Goal title" id="g_title" />
                <select className={styles.select} id="g_type"><option value="quarterly">Quarterly</option><option value="annual">Annual</option></select>
                <select className={styles.select} id="g_kpi">{KPIS.map(k => <option key={k}>{k}</option>)}</select>
                <input className={styles.input} type="number" placeholder="Target" id="g_target" />
                <input className={styles.input} placeholder="Assignee" id="g_assignee" />
                <input className={styles.input} type="date" id="g_deadline" />
                <button className={styles.primaryBtn} onClick={() => {
                  const title = (document.getElementById('g_title') as HTMLInputElement).value
                  if (title) {
                    setGoals(prev => [...prev, { id: uid(), title, type: (document.getElementById('g_type') as HTMLSelectElement).value as any, target: Number((document.getElementById('g_target') as HTMLInputElement).value) || 0, current: 0, kpi: (document.getElementById('g_kpi') as HTMLSelectElement).value, assignee: (document.getElementById('g_assignee') as HTMLInputElement).value, status: 'on-track', deadline: (document.getElementById('g_deadline') as HTMLInputElement).value, createdAt: now() }])
                    setShowForm(null); addToast('Goal created', 'success')
                  }
                }}>Create</button>
              </div>
            )}
            <div className={styles.goalGrid}>
              {goals.map(g => {
                const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0
                return (
                  <div key={g.id} className={styles.goalCard}>
                    <div className={styles.cardHeader}><span className={styles.cardTitle}>{g.title}</span><span className={`${styles.statusBadge} ${styles[`st_${g.status.replace('-', '')}`]}`}>{g.status}</span></div>
                    <div className={styles.cardMeta}><span className={styles.tag}>{g.type}</span><span className={styles.tag}>{g.kpi}</span>{g.assignee && <span className={styles.helperText}>{g.assignee}</span>}</div>
                    <div className={styles.goalProgress}><span>{g.current.toLocaleString()} / {g.target.toLocaleString()}</span><span>{pct}%</span></div>
                    <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${pct}%` }} /></div></div>
                    <div className={styles.cardActions}>
                      <input className={styles.cellInput} type="number" value={g.current} onChange={e => setGoals(prev => prev.map(x => x.id === g.id ? { ...x, current: Number(e.target.value) || 0, status: Number(e.target.value) >= g.target ? 'completed' : x.status } : x))} style={{ width: 80 }} />
                      <select className={styles.miniSelect} value={g.status} onChange={e => setGoals(prev => prev.map(x => x.id === g.id ? { ...x, status: e.target.value as any } : x))}>
                        <option value="on-track">On Track</option><option value="at-risk">At Risk</option><option value="off-track">Off Track</option><option value="completed">Completed</option>
                      </select>
                      <button className={styles.deleteBtn} onClick={() => setGoals(prev => prev.filter(x => x.id !== g.id))}>×</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS TAB (#31-40) ═══ */}
        {tab === 'analytics' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Analytics & Insights</h2>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Revenue Growth</div><div className={styles.kpiValue}>{metrics.length >= 2 ? `${(((latest.revenue - metrics[metrics.length - 2].revenue) / metrics[metrics.length - 2].revenue) * 100).toFixed(1)}%` : '—'}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Customer Growth (#33)</div><div className={styles.kpiValue}>{metrics.length >= 2 ? `${(((latest.newCustomers - metrics[metrics.length - 2].newCustomers) / metrics[metrics.length - 2].newCustomers) * 100).toFixed(0)}%` : '—'}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Margin</div><div className={styles.kpiValue}>{avgMargin}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Health Score (#67)</div><div className={styles.kpiValue}>{healthScore}/100</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Goals Active</div><div className={styles.kpiValue}>{goals.filter(g => g.status !== 'completed').length}</div></div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Month-over-Month Trend (#31)</label>
              <div className={styles.metricsTable}>
                <div className={styles.tableRow}><div className={styles.tableHeader}>Month</div><div className={styles.tableHeader}>Revenue</div><div className={styles.tableHeader}>Growth</div><div className={styles.tableHeader}>Margin</div></div>
                {metrics.map((m, i) => {
                  const growth = i > 0 ? (((m.revenue - metrics[i - 1].revenue) / metrics[i - 1].revenue) * 100).toFixed(1) : '—'
                  const margin = ((m.revenue - m.expenses) / m.revenue * 100).toFixed(1)
                  return (
                    <div key={i} className={styles.tableRow}>
                      <div className={styles.tableCell}>{m.month}</div>
                      <div className={styles.tableCell}>${m.revenue.toLocaleString()}</div>
                      <div className={styles.tableCell}><span className={Number(growth) > 0 ? styles.profitPositive : styles.profitNegative}>{growth}%</span></div>
                      <div className={styles.tableCell}>{margin}%</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>AI Performance Insights (#61)</span></div>
              <pre className={styles.aiOutput}>{`Business Intelligence:
${'─'.repeat(35)}
• Health Score: ${healthScore}/100 (${healthStatus})
• Total Revenue: $${totalRevenue.toLocaleString()}
• Total Profit: $${totalProfit.toLocaleString()} (${avgMargin}% margin)
• ${totalCustomers} total customers acquired
• ${goals.filter(g => g.status === 'completed').length}/${goals.length} goals completed
• ${budgets.length} budget items tracked
• Forecast: ${forecast.length > 0 ? `$${forecast[forecast.length - 1]?.revenue.toLocaleString()} projected in ${forecastMonths} months` : 'Add more data'}
• Recommendation: ${healthScore >= 70 ? 'Strong performance. Scale growth.' : healthScore >= 50 ? 'Positive trend. Optimize margins.' : 'Review expenses and growth strategy.'}`}</pre>
            </div>
          </div>
        )}

        {/* ═══ REPORTS TAB (#41-50) ═══ */}
        {tab === 'reports' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Reporting & Export</h2>
            <div className={styles.exportGrid}>
              <button className={styles.exportBtn} onClick={() => {
                const report = `Business Report\n${'='.repeat(40)}\n\nHealth Score: ${healthScore}/100\nRevenue: $${totalRevenue.toLocaleString()}\nExpenses: $${totalExpenses.toLocaleString()}\nProfit: $${totalProfit.toLocaleString()}\nMargin: ${avgMargin}%\nCustomers: ${totalCustomers}\n\nMonthly Data:\n${metrics.map(m => `${m.month}: Rev $${m.revenue} Exp $${m.expenses} Profit $${m.revenue - m.expenses} Cust ${m.newCustomers}`).join('\n')}\n\nGoals:\n${goals.map(g => `${g.title}: ${g.current}/${g.target} (${g.status})`).join('\n') || 'None'}\n\nGenerated: ${new Date().toLocaleDateString()}`
                const blob = new Blob([report], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `business-report-${Date.now()}.txt`; a.click()
                addToast('Report exported', 'success')
              }}>Monthly Report (#41-42)</button>
              <button className={styles.exportBtn} onClick={() => {
                const inv = `Investor Summary\n${'='.repeat(40)}\n\nBusiness Health: ${healthScore}/100 (${healthStatus})\nRevenue Trend: ${metrics.length >= 2 ? (((latest.revenue - metrics[0].revenue) / metrics[0].revenue) * 100).toFixed(0) : 0}% growth\nProfit Margin: ${avgMargin}%\nCustomer Base: ${totalCustomers}\nGoals: ${goals.filter(g => g.status === 'completed').length} completed, ${goals.filter(g => g.status !== 'completed').length} in progress\n\nGenerated: ${new Date().toLocaleDateString()}`
                const blob = new Blob([inv], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `investor-summary-${Date.now()}.txt`; a.click()
                addToast('Summary exported', 'success')
              }}>Investor Summary (#48)</button>
              <button className={styles.exportBtn} onClick={() => {
                const csv = `Month,Revenue,Expenses,Profit,Customers\n${metrics.map(m => `${m.month},${m.revenue},${m.expenses},${m.revenue - m.expenses},${m.newCustomers}`).join('\n')}`
                const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `metrics-${Date.now()}.csv`; a.click()
                addToast('CSV exported', 'success')
              }}>Export CSV (#42)</button>
              <button className={styles.exportBtn} onClick={() => {
                const kpi = `KPI Summary\n${'='.repeat(40)}\n${goals.map(g => `${g.kpi}: ${g.current}/${g.target} (${g.status})`).join('\n') || 'No KPIs set'}`
                const blob = new Blob([kpi], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `kpi-summary-${Date.now()}.txt`; a.click()
              }}>KPI Summary (#45)</button>
            </div>
          </div>
        )}

        {/* ═══ TEAM TAB (#51-60) ═══ */}
        {tab === 'team' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Team & Collaboration</h2>
            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Team (#51)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'team' ? null : 'team')}>+ Add</button></div>
              {showForm === 'team' && (
                <div className={styles.inlineForm}>
                  <input className={styles.input} placeholder="Name" id="bt_name" /><input className={styles.input} placeholder="Role" id="bt_role" /><input className={styles.input} placeholder="Email" id="bt_email" />
                  <button className={styles.primaryBtn} onClick={() => {
                    const n = (document.getElementById('bt_name') as HTMLInputElement).value
                    if (n) { setTeamMembers(prev => [...prev, { id: uid(), name: n, role: (document.getElementById('bt_role') as HTMLInputElement).value, email: (document.getElementById('bt_email') as HTMLInputElement).value }]); setShowForm(null) }
                  }}>Add</button>
                </div>
              )}
              <div className={styles.teamGrid}>{teamMembers.map(m => (
                <div key={m.id} className={styles.teamCard}><span className={styles.fontName}>{m.name}</span><span className={styles.tag}>{m.role}</span><span className={styles.helperText}>{m.email}</span><button className={styles.deleteBtn} onClick={() => setTeamMembers(prev => prev.filter(x => x.id !== m.id))}>×</button></div>
              ))}</div>
            </div>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Feedback (#54)</label>
              <div className={styles.commentList}>{bComments.slice(0, 20).map(c => (
                <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>
              ))}</div>
              <div className={styles.inlineForm}>
                <input className={styles.input} placeholder="Add feedback..." id="bcom_input" />
                <button className={styles.ghostBtn} onClick={() => {
                  const text = (document.getElementById('bcom_input') as HTMLInputElement).value
                  if (text) { setBComments(prev => [{ id: uid(), targetId: '', author: 'You', text, date: now() }, ...prev]); (document.getElementById('bcom_input') as HTMLInputElement).value = '' }
                }}>Post</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ADVANCED TAB (#61-70) ═══ */}
        {tab === 'advanced' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Advanced Business Tools</h2>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>Scenario Simulation (#18, #66)</label>
              <p className={styles.helperText}>What-if analysis: Adjust revenue/expense growth rates to see projected outcomes.</p>
              <div className={styles.metricsTable}>
                <div className={styles.tableRow}><div className={styles.tableHeader}>Scenario</div><div className={styles.tableHeader}>Revenue</div><div className={styles.tableHeader}>Expenses</div><div className={styles.tableHeader}>Profit</div></div>
                {[{ label: 'Conservative (5%)', rate: 0.05 }, { label: 'Moderate (15%)', rate: 0.15 }, { label: 'Aggressive (30%)', rate: 0.30 }].map(s => (
                  <div key={s.label} className={styles.tableRow}>
                    <div className={styles.tableCell}>{s.label}</div>
                    <div className={styles.tableCell}>${Math.round(latest.revenue * (1 + s.rate)).toLocaleString()}</div>
                    <div className={styles.tableCell}>${Math.round(latest.expenses * (1 + s.rate * 0.5)).toLocaleString()}</div>
                    <div className={styles.tableCell}><span className={styles.profitPositive}>${Math.round(latest.revenue * (1 + s.rate) - latest.expenses * (1 + s.rate * 0.5)).toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>Risk Assessment (#62)</label>
              <div className={styles.alertList}>
                {Number(avgMargin) < 20 && <div className={styles.alertItem}><span className={styles.alertIcon}>!</span>Low profit margin ({avgMargin}%). Review pricing strategy.</div>}
                {metrics.length >= 2 && latest.revenue < metrics[metrics.length - 2].revenue && <div className={styles.alertItem}><span className={styles.alertIcon}>!</span>Revenue declined last month. Investigate causes.</div>}
                {goals.filter(g => g.status === 'off-track').length > 0 && <div className={styles.alertItem}><span className={styles.alertIcon}>!</span>{goals.filter(g => g.status === 'off-track').length} goal(s) off-track. Review and adjust.</div>}
                {Number(avgMargin) >= 20 && (metrics.length < 2 || latest.revenue >= metrics[metrics.length - 2].revenue) && goals.filter(g => g.status === 'off-track').length === 0 && <p className={styles.helperText}>No critical risks detected.</p>}
              </div>
            </div>

            <div className={styles.aiBox}>
              <div className={styles.aiBoxHeader}><span>Executive Summary (#70)</span></div>
              <pre className={styles.aiOutput}>{`Business Executive Summary
${'─'.repeat(35)}
• Health: ${healthScore}/100 (${healthStatus})
• Revenue: $${totalRevenue.toLocaleString()} total
• Profit: $${totalProfit.toLocaleString()} (${avgMargin}% margin)
• Customers: ${totalCustomers} acquired
• Growth: ${metrics.length >= 2 ? (((latest.revenue - metrics[0].revenue) / metrics[0].revenue) * 100).toFixed(0) + '% since start' : 'Insufficient data'}
• Team: ${teamMembers.length} members
• Goals: ${goals.length} set, ${goals.filter(g => g.status === 'completed').length} completed
• Outlook: ${healthScore >= 70 ? 'Positive — maintain momentum' : 'Moderate — optimize operations'}`}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
