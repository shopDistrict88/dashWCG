import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './InsightsLab.module.css'

interface DataSource {
  id: string
  name: string
  type: 'analytics' | 'crm' | 'financial' | 'social' | 'custom'
  connected: boolean
  lastSync: string
  recordCount: number
  health: number
}

interface MetricTracker {
  id: string
  metric: string
  value: number
  target: number
  trend: 'up' | 'down' | 'flat'
  change: number
  category: string
  critical: boolean
}

interface DashboardWidget {
  id: string
  title: string
  type: 'chart' | 'table' | 'stat' | 'gauge'
  dataSource: string
  config: any
  position: {x: number, y: number, w: number, h: number}
}

interface AnalyticsReport {
  id: string
  title: string
  schedule: 'daily' | 'weekly' | 'monthly'
  recipients: string[]
  sections: {title: string, metrics: string[]}[]
  lastGenerated: string
  automated: boolean
}

interface InsightAlert {
  id: string
  condition: string
  metric: string
  threshold: number
  triggered: boolean
  action: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface DataVisualization {
  id: string
  name: string
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap'
  data: any[]
  insights: string[]
  interactive: boolean
}

interface PredictiveModel {
  id: string
  name: string
  type: 'regression' | 'classification' | 'timeseries'
  accuracy: number
  features: string[]
  predictions: {date: string, value: number, confidence: number}[]
}

interface AnomalyDetection {
  id: string
  metric: string
  anomalyDate: string
  expectedValue: number
  actualValue: number
  deviation: number
  severity: 'low' | 'medium' | 'high'
  investigated: boolean
}

interface SegmentAnalysis {
  id: string
  segment: string
  size: number
  characteristics: string[]
  behavior: string[]
  value: number
  growth: number
}

interface CohortReport {
  id: string
  cohort: string
  startDate: string
  metrics: {period: string, retention: number, revenue: number}[]
  insights: string[]
}

interface ABTestResults {
  id: string
  testName: string
  variants: {name: string, users: number, conversion: number}[]
  winner: string
  significance: number
  liftPercentage: number
}

interface FunnelAnalysis {
  id: string
  funnelName: string
  steps: {step: string, users: number, dropoff: number}[]
  conversionRate: number
  bottleneck: string
}

interface CustomQuery {
  id: string
  name: string
  query: string
  results: any[]
  executionTime: number
  saved: boolean
}

interface DataExport {
  id: string
  name: string
  format: 'csv' | 'json' | 'excel'
  filters: any
  schedule?: string
  lastExport: string
}

interface InsightRecommendation {
  id: string
  insight: string
  recommendation: string
  impact: number
  effort: number
  priority: number
  implemented: boolean
}

export function InsightsLab() {
  const { addToast } = useApp()
  
  const [sources, setSources] = useState<DataSource[]>([])
  const [metrics, setMetrics] = useState<MetricTracker[]>([])
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [reports, setReports] = useState<AnalyticsReport[]>([])
  const [alerts, setAlerts] = useState<InsightAlert[]>([])
  const [visualizations, setVisualizations] = useState<DataVisualization[]>([])
  const [models, setModels] = useState<PredictiveModel[]>([])
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([])
  const [segments, setSegments] = useState<SegmentAnalysis[]>([])
  const [cohorts, setCohorts] = useState<CohortReport[]>([])
  const [abTests, setAbTests] = useState<ABTestResults[]>([])
  const [funnels, setFunnels] = useState<FunnelAnalysis[]>([])
  const [queries, setQueries] = useState<CustomQuery[]>([])
  const [exports, setExports] = useState<DataExport[]>([])
  const [recommendations, setRecommendations] = useState<InsightRecommendation[]>([])

  const [activeSection, setActiveSection] = useState('sources')

  useEffect(() => {
    const keys = ['sources', 'metrics', 'widgets', 'reports', 'alerts', 'visualizations', 'models', 'anomalies', 'segments', 'cohorts', 'abTests', 'funnels', 'queries', 'exports', 'recommendations']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`insights_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'sources': setSources(data); break
          case 'metrics': setMetrics(data); break
          case 'widgets': setWidgets(data); break
          case 'reports': setReports(data); break
          case 'alerts': setAlerts(data); break
          case 'visualizations': setVisualizations(data); break
          case 'models': setModels(data); break
          case 'anomalies': setAnomalies(data); break
          case 'segments': setSegments(data); break
          case 'cohorts': setCohorts(data); break
          case 'abTests': setAbTests(data); break
          case 'funnels': setFunnels(data); break
          case 'queries': setQueries(data); break
          case 'exports': setExports(data); break
          case 'recommendations': setRecommendations(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('insights_sources', JSON.stringify(sources)) }, [sources])
  useEffect(() => { localStorage.setItem('insights_metrics', JSON.stringify(metrics)) }, [metrics])
  useEffect(() => { localStorage.setItem('insights_widgets', JSON.stringify(widgets)) }, [widgets])
  useEffect(() => { localStorage.setItem('insights_reports', JSON.stringify(reports)) }, [reports])
  useEffect(() => { localStorage.setItem('insights_alerts', JSON.stringify(alerts)) }, [alerts])
  useEffect(() => { localStorage.setItem('insights_visualizations', JSON.stringify(visualizations)) }, [visualizations])
  useEffect(() => { localStorage.setItem('insights_models', JSON.stringify(models)) }, [models])
  useEffect(() => { localStorage.setItem('insights_anomalies', JSON.stringify(anomalies)) }, [anomalies])
  useEffect(() => { localStorage.setItem('insights_segments', JSON.stringify(segments)) }, [segments])
  useEffect(() => { localStorage.setItem('insights_cohorts', JSON.stringify(cohorts)) }, [cohorts])
  useEffect(() => { localStorage.setItem('insights_abTests', JSON.stringify(abTests)) }, [abTests])
  useEffect(() => { localStorage.setItem('insights_funnels', JSON.stringify(funnels)) }, [funnels])
  useEffect(() => { localStorage.setItem('insights_queries', JSON.stringify(queries)) }, [queries])
  useEffect(() => { localStorage.setItem('insights_exports', JSON.stringify(exports)) }, [exports])
  useEffect(() => { localStorage.setItem('insights_recommendations', JSON.stringify(recommendations)) }, [recommendations])

  // AI Functions
  const calculateSourceHealth = (connected: boolean, lastSyncHours: number, recordCount: number): number => {
    if (!connected) return 0
    
    let score = 50
    if (lastSyncHours < 24) score += 30
    else if (lastSyncHours < 72) score += 15
    
    if (recordCount > 10000) score += 20
    else if (recordCount > 1000) score += 10
    
    return Math.min(100, score)
  }

  const calculateMetricTrend = (current: number, previous: number): 'up' | 'down' | 'flat' => {
    const change = ((current - previous) / previous) * 100
    if (Math.abs(change) < 5) return 'flat'
    return change > 0 ? 'up' : 'down'
  }

  const detectAnomaly = (values: number[]): {isAnomaly: boolean, deviation: number} => {
    if (values.length < 3) return {isAnomaly: false, deviation: 0}
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)
    
    const lastValue = values[values.length - 1]
    const deviation = Math.abs(lastValue - mean) / stdDev
    
    return {
      isAnomaly: deviation > 2,
      deviation: Math.round(deviation * 100) / 100
    }
  }

  const calculateSegmentValue = (size: number, avgRevenue: number, growth: number): number => {
    return Math.round(size * avgRevenue * (1 + growth / 100))
  }

  const identifyFunnelBottleneck = (steps: {step: string, users: number, dropoff: number}[]): string => {
    if (steps.length === 0) return 'No steps'
    
    let maxDropoff = 0
    let bottleneck = ''
    
    steps.forEach(step => {
      if (step.dropoff > maxDropoff) {
        maxDropoff = step.dropoff
        bottleneck = step.step
      }
    })
    
    return bottleneck
  }

  const calculateTestSignificance = (controlUsers: number, variantUsers: number, controlConv: number, variantConv: number): number => {
    const pooled = ((controlConv * controlUsers) + (variantConv * variantUsers)) / (controlUsers + variantUsers)
    const se = Math.sqrt(pooled * (1 - pooled) * (1/controlUsers + 1/variantUsers))
    
    if (se === 0) return 0
    
    const zScore = Math.abs(variantConv - controlConv) / se
    
    if (zScore > 2.58) return 99
    if (zScore > 1.96) return 95
    if (zScore > 1.65) return 90
    return Math.round(zScore * 40)
  }

  const calculateLiftPercentage = (control: number, variant: number): number => {
    if (control === 0) return 0
    return Math.round(((variant - control) / control) * 100)
  }

  const prioritizeRecommendation = (impact: number, effort: number): number => {
    return Math.round((impact / Math.max(effort, 1)) * 10)
  }

  const predictNextPeriod = (values: number[]): {prediction: number, confidence: number} => {
    if (values.length < 2) return {prediction: 0, confidence: 0}
    
    const trend = (values[values.length - 1] - values[0]) / values.length
    const prediction = values[values.length - 1] + trend
    
    const variance = values.reduce((sum, v, i) => {
      const expected = values[0] + (trend * i)
      return sum + Math.pow(v - expected, 2)
    }, 0) / values.length
    
    const confidence = Math.max(0, Math.min(100, 100 - (variance / values[values.length - 1]) * 100))
    
    return {
      prediction: Math.round(prediction),
      confidence: Math.round(confidence)
    }
  }

  // CRUD Functions
  const addMetric = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const value = parseFloat(formData.get('value') as string)
    const target = parseFloat(formData.get('target') as string)
    const previousValue = value * 0.9
    
    const trend = calculateMetricTrend(value, previousValue)
    const change = ((value - previousValue) / previousValue) * 100
    
    const newMetric: MetricTracker = {
      id: Date.now().toString(),
      metric: formData.get('metric') as string,
      value,
      target,
      trend,
      change: Math.round(change * 10) / 10,
      category: formData.get('category') as string,
      critical: false
    }
    
    setMetrics([...metrics, newMetric])
    addToast(`Metric tracked - ${trend} ${Math.abs(change).toFixed(1)}%`, 'success')
    e.currentTarget.reset()
  }

  const detectAnomalyInMetric = (metricName: string, values: number[]) => {
    const result = detectAnomaly(values)
    
    if (result.isAnomaly) {
      const newAnomaly: AnomalyDetection = {
        id: Date.now().toString(),
        metric: metricName,
        anomalyDate: new Date().toISOString().split('T')[0],
        expectedValue: values[values.length - 2],
        actualValue: values[values.length - 1],
        deviation: result.deviation,
        severity: result.deviation > 3 ? 'high' : result.deviation > 2.5 ? 'medium' : 'low',
        investigated: false
      }
      
      setAnomalies([...anomalies, newAnomaly])
      addToast(`Anomaly detected in ${metricName}!`, 'error')
    } else {
      addToast('No anomaly detected', 'info')
    }
  }

  const analyzeFunnel = (name: string, steps: {step: string, users: number}[]) => {
    const stepsWithDropoff = steps.map((step, idx) => {
      const prevUsers = idx > 0 ? steps[idx - 1].users : step.users
      const dropoff = idx > 0 ? ((prevUsers - step.users) / prevUsers) * 100 : 0
      return {...step, dropoff: Math.round(dropoff)}
    })
    
    const totalConversion = (steps[steps.length - 1].users / steps[0].users) * 100
    const bottleneck = identifyFunnelBottleneck(stepsWithDropoff)
    
    const newFunnel: FunnelAnalysis = {
      id: Date.now().toString(),
      funnelName: name,
      steps: stepsWithDropoff,
      conversionRate: Math.round(totalConversion * 10) / 10,
      bottleneck
    }
    
    setFunnels([...funnels, newFunnel])
    addToast(`Funnel analyzed - ${totalConversion.toFixed(1)}% conversion`, 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Business Intelligence Hub</h1>
          <p className={styles.subtitle}>Data analytics and predictive insights</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'sources' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('sources')}>Data Sources</button>
          <button className={`${styles.navItem} ${activeSection === 'metrics' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('metrics')}>Metric Tracking</button>
          <button className={`${styles.navItem} ${activeSection === 'dashboard' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('dashboard')}>Custom Dashboards</button>
          <button className={`${styles.navItem} ${activeSection === 'reports' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('reports')}>Automated Reports</button>
          <button className={`${styles.navItem} ${activeSection === 'alerts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('alerts')}>Smart Alerts</button>
          <button className={`${styles.navItem} ${activeSection === 'viz' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('viz')}>Visualizations</button>
          <button className={`${styles.navItem} ${activeSection === 'predictive' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('predictive')}>Predictive Models</button>
          <button className={`${styles.navItem} ${activeSection === 'anomalies' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('anomalies')}>Anomaly Detection</button>
          <button className={`${styles.navItem} ${activeSection === 'segments' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('segments')}>Segment Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'cohorts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('cohorts')}>Cohort Reports</button>
          <button className={`${styles.navItem} ${activeSection === 'ab' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('ab')}>A/B Test Results</button>
          <button className={`${styles.navItem} ${activeSection === 'funnels' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('funnels')}>Funnel Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'queries' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('queries')}>Custom Queries</button>
          <button className={`${styles.navItem} ${activeSection === 'export' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('export')}>Data Export</button>
          <button className={`${styles.navItem} ${activeSection === 'recommendations' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('recommendations')}>AI Recommendations</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'metrics' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Metric Tracking</h2>
                <p>Monitor key business metrics with trend analysis</p>
              </div>

              <form onSubmit={addMetric} className={styles.form}>
                <input name="metric" placeholder="Metric name" required className={styles.input} />
                <input name="value" type="number" step="0.01" placeholder="Current value" required className={styles.input} />
                <input name="target" type="number" step="0.01" placeholder="Target value" required className={styles.input} />
                <input name="category" placeholder="Category" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Track Metric</button>
              </form>

              <div className={styles.metricsGrid}>
                {metrics.map(metric => (
                  <div key={metric.id} className={`${styles.metricCard} ${styles[metric.trend]}`}>
                    <div className={styles.metricHeader}>
                      <h3>{metric.metric}</h3>
                      <span className={`${styles.trendBadge} ${styles[metric.trend]}`}>
                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}%
                      </span>
                    </div>
                    <div className={styles.metricValue}>
                      <div className={styles.current}>{metric.value.toLocaleString()}</div>
                      <div className={styles.target}>Target: {metric.target.toLocaleString()}</div>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{
                          width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                          backgroundColor: metric.value >= metric.target ? '#10b981' : '#f59e0b'
                        }}
                      ></div>
                    </div>
                    <div className={styles.category}>{metric.category}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'anomalies' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Anomaly Detection</h2>
                <p>Identify unusual patterns and outliers in your data</p>
              </div>

              <div className={styles.calculator}>
                <h3>Detect Anomalies</h3>
                <div className={styles.calcInputs}>
                  <input type="text" id="anomalyMetric" placeholder="Metric name" className={styles.input} />
                  <input type="text" id="anomalyValues" placeholder="Historical values (comma-separated)" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const name = (document.getElementById('anomalyMetric') as HTMLInputElement).value
                      const valuesStr = (document.getElementById('anomalyValues') as HTMLInputElement).value
                      const values = valuesStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
                      if (values.length >= 3) detectAnomalyInMetric(name, values)
                    }}
                  >
                    Detect
                  </button>
                </div>

                <div className={styles.anomalyGrid}>
                  {anomalies.map(anomaly => (
                    <div key={anomaly.id} className={`${styles.anomalyCard} ${styles[anomaly.severity]}`}>
                      <div className={styles.severityBadge}>{anomaly.severity.toUpperCase()}</div>
                      <h3>{anomaly.metric}</h3>
                      <div className={styles.anomalyDetails}>
                        <div className={styles.values}>
                          <div className={styles.valueItem}>
                            <span className={styles.label}>Expected</span>
                            <span className={styles.value}>{anomaly.expectedValue}</span>
                          </div>
                          <div className={styles.valueItem}>
                            <span className={styles.label}>Actual</span>
                            <span className={styles.value}>{anomaly.actualValue}</span>
                          </div>
                        </div>
                        <div className={styles.deviation}>
                          <strong>Deviation:</strong> {anomaly.deviation}σ
                        </div>
                        <div className={styles.date}>{anomaly.anomalyDate}</div>
                      </div>
                      {!anomaly.investigated && <button className={styles.secondaryBtn}>Investigate</button>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSection === 'funnels' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Funnel Analysis</h2>
                <p>Visualize conversion funnels and identify drop-off points</p>
              </div>

              <div className={styles.funnelGrid}>
                {funnels.map(funnel => (
                  <div key={funnel.id} className={styles.funnelCard}>
                    <h3>{funnel.funnelName}</h3>
                    <div className={styles.conversionRate}>
                      <div className={styles.bigNumber}>{funnel.conversionRate}%</div>
                      <div className={styles.label}>Overall Conversion</div>
                    </div>
                    <div className={styles.funnelSteps}>
                      {funnel.steps.map((step, idx) => (
                        <div key={idx} className={`${styles.funnelStep} ${step.step === funnel.bottleneck ? styles.bottleneck : ''}`}>
                          <div className={styles.stepName}>{step.step}</div>
                          <div className={styles.stepUsers}>{step.users.toLocaleString()} users</div>
                          {idx > 0 && <div className={styles.stepDropoff}>-{step.dropoff}%</div>}
                        </div>
                      ))}
                    </div>
                    <div className={styles.bottleneckAlert}>
                      <strong>Bottleneck:</strong> {funnel.bottleneck}
                    </div>
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
