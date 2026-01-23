import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Commerce.module.css'

interface RevenueStream {
  id: string
  name: string
  type: 'subscription' | 'one-time' | 'freemium' | 'marketplace' | 'advertising'
  mrr: number
  growth: number
  churn: number
  ltv: number
  cac: number
  status: 'active' | 'testing' | 'paused'
}

interface PricingExperiment {
  id: string
  streamId: string
  originalPrice: number
  testPrice: number
  hypothesis: string
  results: {conversions: number, revenue: number}
  winner: 'original' | 'test' | 'ongoing'
  confidence: number
}

interface UpsellPath {
  id: string
  fromProduct: string
  toProduct: string
  trigger: string
  conversionRate: number
  avgRevenue: number
  sequence: string[]
}

interface ChurnPredictor {
  id: string
  customerId: string
  churnProbability: number
  signals: string[]
  intervention: string
  status: 'at-risk' | 'safe' | 'churned'
}

interface PaymentFlow {
  id: string
  flowName: string
  steps: {step: string, dropoff: number}[]
  overallConversion: number
  bottleneck: string
  optimizations: string[]
}

interface DiscountStrategy {
  id: string
  name: string
  discount: number
  conditions: string[]
  redemptionRate: number
  profitImpact: number
  status: 'active' | 'expired' | 'scheduled'
}

interface BundleOffer {
  id: string
  name: string
  products: string[]
  bundlePrice: number
  individualPrice: number
  savings: number
  takeRate: number
}

interface RevenueForecasting {
  id: string
  period: string
  conservative: number
  realistic: number
  optimistic: number
  confidence: number
  assumptions: string[]
}

interface RefundAnalysis {
  id: string
  product: string
  refundRate: number
  reasons: {reason: string, count: number}[]
  costImpact: number
  improvements: string[]
}

interface CrossSellMatrix {
  id: string
  productA: string
  productB: string
  affinity: number
  frequency: number
  avgOrderValue: number
}

interface PaymentRecovery {
  id: string
  failedAmount: number
  recoveredAmount: number
  recoveryRate: number
  methods: string[]
  timeline: string
}

interface MarginOptimizer {
  id: string
  product: string
  revenue: number
  cogs: number
  grossMargin: number
  targetMargin: number
  recommendations: string[]
}

interface TrialConverter {
  id: string
  trialUsers: number
  conversions: number
  conversionRate: number
  dropoffPoint: string
  interventions: string[]
}

interface SubscriptionTiers {
  id: string
  tierName: string
  price: number
  features: string[]
  subscribers: number
  churn: number
  upgradePath: string
}

interface RevenueLeaks {
  id: string
  leak: string
  lostRevenue: number
  frequency: string
  fix: string
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export function Commerce() {
  const { addToast } = useApp()
  
  const [streams, setStreams] = useState<RevenueStream[]>([])
  const [experiments, setExperiments] = useState<PricingExperiment[]>([])
  const [upsells, setUpsells] = useState<UpsellPath[]>([])
  const [churnPredictions, setChurnPredictions] = useState<ChurnPredictor[]>([])
  const [flows, setFlows] = useState<PaymentFlow[]>([])
  const [discounts, setDiscounts] = useState<DiscountStrategy[]>([])
  const [bundles, setBundles] = useState<BundleOffer[]>([])
  const [forecasts, setForecasts] = useState<RevenueForecasting[]>([])
  const [refunds, setRefunds] = useState<RefundAnalysis[]>([])
  const [crossSells, setCrossSells] = useState<CrossSellMatrix[]>([])
  const [recoveries, setRecoveries] = useState<PaymentRecovery[]>([])
  const [margins, setMargins] = useState<MarginOptimizer[]>([])
  const [trials, setTrials] = useState<TrialConverter[]>([])
  const [tiers, setTiers] = useState<SubscriptionTiers[]>([])
  const [leaks, setLeaks] = useState<RevenueLeaks[]>([])

  const [activeSection, setActiveSection] = useState('streams')
  const [showStreamForm, setShowStreamForm] = useState(false)
  const [showExperimentForm, setShowExperimentForm] = useState(false)

  useEffect(() => {
    const keys = ['streams', 'experiments', 'upsells', 'churnPredictions', 'flows', 'discounts', 'bundles', 'forecasts', 'refunds', 'crossSells', 'recoveries', 'margins', 'trials', 'tiers', 'leaks']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`commerce_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'streams': setStreams(data); break
          case 'experiments': setExperiments(data); break
          case 'upsells': setUpsells(data); break
          case 'churnPredictions': setChurnPredictions(data); break
          case 'flows': setFlows(data); break
          case 'discounts': setDiscounts(data); break
          case 'bundles': setBundles(data); break
          case 'forecasts': setForecasts(data); break
          case 'refunds': setRefunds(data); break
          case 'crossSells': setCrossSells(data); break
          case 'recoveries': setRecoveries(data); break
          case 'margins': setMargins(data); break
          case 'trials': setTrials(data); break
          case 'tiers': setTiers(data); break
          case 'leaks': setLeaks(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('commerce_streams', JSON.stringify(streams)) }, [streams])
  useEffect(() => { localStorage.setItem('commerce_experiments', JSON.stringify(experiments)) }, [experiments])
  useEffect(() => { localStorage.setItem('commerce_upsells', JSON.stringify(upsells)) }, [upsells])
  useEffect(() => { localStorage.setItem('commerce_churnPredictions', JSON.stringify(churnPredictions)) }, [churnPredictions])
  useEffect(() => { localStorage.setItem('commerce_flows', JSON.stringify(flows)) }, [flows])
  useEffect(() => { localStorage.setItem('commerce_discounts', JSON.stringify(discounts)) }, [discounts])
  useEffect(() => { localStorage.setItem('commerce_bundles', JSON.stringify(bundles)) }, [bundles])
  useEffect(() => { localStorage.setItem('commerce_forecasts', JSON.stringify(forecasts)) }, [forecasts])
  useEffect(() => { localStorage.setItem('commerce_refunds', JSON.stringify(refunds)) }, [refunds])
  useEffect(() => { localStorage.setItem('commerce_crossSells', JSON.stringify(crossSells)) }, [crossSells])
  useEffect(() => { localStorage.setItem('commerce_recoveries', JSON.stringify(recoveries)) }, [recoveries])
  useEffect(() => { localStorage.setItem('commerce_margins', JSON.stringify(margins)) }, [margins])
  useEffect(() => { localStorage.setItem('commerce_trials', JSON.stringify(trials)) }, [trials])
  useEffect(() => { localStorage.setItem('commerce_tiers', JSON.stringify(tiers)) }, [tiers])
  useEffect(() => { localStorage.setItem('commerce_leaks', JSON.stringify(leaks)) }, [leaks])

  // AI Functions
  const calculateLTV = (mrr: number, churn: number): number => {
    if (churn === 0) return mrr * 36 // 3 year default
    return (mrr / churn) * 100
  }

  const calculateGrowthRate = (currentMRR: number, previousMRR: number): number => {
    if (previousMRR === 0) return 0
    return ((currentMRR - previousMRR) / previousMRR) * 100
  }

  const calculateChurnProbability = (signals: string[]): number => {
    const baseProb = 20
    const signalWeight = signals.length * 15
    return Math.min(baseProb + signalWeight, 95)
  }

  const identifyBottleneck = (steps: {step: string, dropoff: number}[]): string => {
    const maxDropoff = Math.max(...steps.map(s => s.dropoff))
    const bottleneck = steps.find(s => s.dropoff === maxDropoff)
    return bottleneck?.step || 'Unknown'
  }

  const calculateOverallConversion = (steps: {step: string, dropoff: number}[]): number => {
    const retention = steps.reduce((acc, step) => acc * (1 - step.dropoff / 100), 1)
    return retention * 100
  }

  const calculateBundleSavings = (bundlePrice: number, individualPrice: number): number => {
    if (individualPrice === 0) return 0
    return ((individualPrice - bundlePrice) / individualPrice) * 100
  }

  const forecastRevenue = (currentMRR: number, growthRate: number, months: number): {conservative: number, realistic: number, optimistic: number} => {
    const conservativeRate = growthRate * 0.5
    const optimisticRate = growthRate * 1.5
    
    return {
      conservative: currentMRR * Math.pow(1 + conservativeRate / 100, months),
      realistic: currentMRR * Math.pow(1 + growthRate / 100, months),
      optimistic: currentMRR * Math.pow(1 + optimisticRate / 100, months)
    }
  }

  const calculateGrossMargin = (revenue: number, cogs: number): number => {
    if (revenue === 0) return 0
    return ((revenue - cogs) / revenue) * 100
  }

  const calculateRecoveryRate = (recovered: number, failed: number): number => {
    if (failed === 0) return 0
    return (recovered / failed) * 100
  }

  const detectRevenueLeak = (product: string, expectedRevenue: number, actualRevenue: number): {leak: string, amount: number} => {
    const lost = expectedRevenue - actualRevenue
    return {
      leak: `${product} underperforming`,
      amount: lost
    }
  }

  // CRUD Functions
  const addStream = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const mrr = parseFloat(formData.get('mrr') as string)
    const churn = parseFloat(formData.get('churn') as string)
    const cac = parseFloat(formData.get('cac') as string)
    const ltv = calculateLTV(mrr, churn)
    
    const newStream: RevenueStream = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as RevenueStream['type'],
      mrr,
      growth: parseFloat(formData.get('growth') as string),
      churn,
      ltv,
      cac,
      status: 'active'
    }
    
    setStreams([...streams, newStream])
    setShowStreamForm(false)
    addToast(`Stream added - LTV: $${ltv.toFixed(0)}`, 'success')
    e.currentTarget.reset()
  }

  const addExperiment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newExperiment: PricingExperiment = {
      id: Date.now().toString(),
      streamId: formData.get('streamId') as string,
      originalPrice: parseFloat(formData.get('original') as string),
      testPrice: parseFloat(formData.get('test') as string),
      hypothesis: formData.get('hypothesis') as string,
      results: {conversions: 0, revenue: 0},
      winner: 'ongoing',
      confidence: 0
    }
    
    setExperiments([...experiments, newExperiment])
    setShowExperimentForm(false)
    addToast('Pricing experiment started', 'success')
    e.currentTarget.reset()
  }

  const addUpsellPath = (fromProduct: string, toProduct: string) => {
    const newUpsell: UpsellPath = {
      id: Date.now().toString(),
      fromProduct,
      toProduct,
      trigger: 'Feature limit reached',
      conversionRate: Math.random() * 20 + 5,
      avgRevenue: Math.random() * 50 + 20,
      sequence: ['Show upgrade prompt', 'Explain benefits', 'Offer discount', 'Complete upgrade']
    }
    
    setUpsells([...upsells, newUpsell])
    addToast('Upsell path created', 'success')
  }

  const predictChurn = (customerId: string) => {
    const signals = ['Low usage', 'No logins for 14 days', 'Support tickets']
    const probability = calculateChurnProbability(signals)
    
    const newPrediction: ChurnPredictor = {
      id: Date.now().toString(),
      customerId,
      churnProbability: probability,
      signals,
      intervention: probability > 70 ? 'Immediate outreach' : 'Automated email',
      status: probability > 70 ? 'at-risk' : 'safe'
    }
    
    setChurnPredictions([...churnPredictions, newPrediction])
    addToast(`Churn risk: ${probability}%`, probability > 70 ? 'info' : 'info')
  }

  const analyzePaymentFlow = (flowName: string) => {
    const steps = [
      {step: 'Landing page', dropoff: 30},
      {step: 'Pricing page', dropoff: 25},
      {step: 'Sign up form', dropoff: 40},
      {step: 'Payment details', dropoff: 35},
      {step: 'Confirmation', dropoff: 5}
    ]
    
    const conversion = calculateOverallConversion(steps)
    const bottleneck = identifyBottleneck(steps)
    
    const newFlow: PaymentFlow = {
      id: Date.now().toString(),
      flowName,
      steps,
      overallConversion: conversion,
      bottleneck,
      optimizations: [`Reduce friction at ${bottleneck}`, 'Add social proof', 'Simplify form fields']
    }
    
    setFlows([...flows, newFlow])
    addToast(`Conversion: ${conversion.toFixed(1)}% | Bottleneck: ${bottleneck}`, 'info')
  }

  const addDiscount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newDiscount: DiscountStrategy = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      discount: parseFloat(formData.get('discount') as string),
      conditions: (formData.get('conditions') as string).split(',').map(c => c.trim()),
      redemptionRate: 0,
      profitImpact: 0,
      status: 'active'
    }
    
    setDiscounts([...discounts, newDiscount])
    addToast('Discount strategy created', 'success')
    e.currentTarget.reset()
  }

  const createBundle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const bundlePrice = parseFloat(formData.get('bundlePrice') as string)
    const individualPrice = parseFloat(formData.get('individualPrice') as string)
    const savings = calculateBundleSavings(bundlePrice, individualPrice)
    
    const newBundle: BundleOffer = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      products: (formData.get('products') as string).split(',').map(p => p.trim()),
      bundlePrice,
      individualPrice,
      savings,
      takeRate: 0
    }
    
    setBundles([...bundles, newBundle])
    addToast(`Bundle created - ${savings.toFixed(0)}% savings`, 'success')
    e.currentTarget.reset()
  }

  const generateForecast = (period: string, currentMRR: number, growthRate: number) => {
    const months = period === 'quarter' ? 3 : period === 'year' ? 12 : 6
    const forecast = forecastRevenue(currentMRR, growthRate, months)
    
    const newForecast: RevenueForecasting = {
      id: Date.now().toString(),
      period,
      conservative: forecast.conservative,
      realistic: forecast.realistic,
      optimistic: forecast.optimistic,
      confidence: 75,
      assumptions: ['Stable churn', 'Current growth rate', 'No major market changes']
    }
    
    setForecasts([...forecasts, newForecast])
    addToast('Forecast generated', 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Lean Revenue Engine</h1>
          <p className={styles.subtitle}>Data-driven commerce optimization and growth</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'streams' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('streams')}>Revenue Streams</button>
          <button className={`${styles.navItem} ${activeSection === 'experiments' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('experiments')}>Pricing Experiments</button>
          <button className={`${styles.navItem} ${activeSection === 'upsells' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('upsells')}>Upsell Paths</button>
          <button className={`${styles.navItem} ${activeSection === 'churn' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('churn')}>Churn Prediction</button>
          <button className={`${styles.navItem} ${activeSection === 'flows' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('flows')}>Payment Flows</button>
          <button className={`${styles.navItem} ${activeSection === 'discounts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('discounts')}>Discount Strategy</button>
          <button className={`${styles.navItem} ${activeSection === 'bundles' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('bundles')}>Bundle Offers</button>
          <button className={`${styles.navItem} ${activeSection === 'forecasts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('forecasts')}>Revenue Forecasting</button>
          <button className={`${styles.navItem} ${activeSection === 'refunds' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('refunds')}>Refund Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'crosssell' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('crosssell')}>Cross-Sell Matrix</button>
          <button className={`${styles.navItem} ${activeSection === 'recovery' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('recovery')}>Payment Recovery</button>
          <button className={`${styles.navItem} ${activeSection === 'margins' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('margins')}>Margin Optimizer</button>
          <button className={`${styles.navItem} ${activeSection === 'trials' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('trials')}>Trial Conversion</button>
          <button className={`${styles.navItem} ${activeSection === 'tiers' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('tiers')}>Subscription Tiers</button>
          <button className={`${styles.navItem} ${activeSection === 'leaks' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('leaks')}>Revenue Leaks</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'streams' && (
            <div>
              <div className={styles.sectionHeader}>
                <h2>Revenue Streams</h2>
                <p className={styles.subtitle}>Track and optimize all revenue sources</p>
              </div>

              {!showStreamForm && (
                <button className={styles.primaryBtn} onClick={() => setShowStreamForm(true)}>
                  + Add Revenue Stream
                </button>
              )}

              {showStreamForm && (
                <form className={styles.form} onSubmit={addStream}>
                  <div className={styles.formGroup}>
                    <label>Stream Name</label>
                    <input name="name" className={styles.input} required />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Type</label>
                      <select name="type" className={styles.select} required>
                        <option value="subscription">Subscription</option>
                        <option value="one-time">One-time</option>
                        <option value="freemium">Freemium</option>
                        <option value="marketplace">Marketplace</option>
                        <option value="advertising">Advertising</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>MRR ($)</label>
                      <input name="mrr" type="number" step="0.01" className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Growth Rate (%)</label>
                      <input name="growth" type="number" step="0.01" className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Churn Rate (%)</label>
                      <input name="churn" type="number" step="0.01" className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>CAC ($)</label>
                      <input name="cac" type="number" step="0.01" className={styles.input} required />
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryBtn}>Add Stream</button>
                    <button type="button" className={styles.secondaryBtn} onClick={() => setShowStreamForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.streamsGrid}>
                {streams.map(stream => (
                  <div key={stream.id} className={styles.streamCard}>
                    <div className={styles.streamHeader}>
                      <h3>{stream.name}</h3>
                      <span className={`${styles.typeBadge} ${styles[`type${stream.type}`]}`}>{stream.type}</span>
                    </div>
                    <div className={styles.metrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>${stream.mrr}</span>
                        <span className={styles.metricLabel}>MRR</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>${stream.ltv.toFixed(0)}</span>
                        <span className={styles.metricLabel}>LTV</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>{stream.growth}%</span>
                        <span className={styles.metricLabel}>Growth</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>{stream.churn}%</span>
                        <span className={styles.metricLabel}>Churn</span>
                      </div>
                    </div>
                    <div className={styles.ratio}>
                      LTV:CAC = {(stream.ltv / stream.cac).toFixed(1)}:1
                    </div>
                  </div>
                ))}
              </div>

              {streams.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No revenue streams yet. Add your first stream to start tracking performance.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
