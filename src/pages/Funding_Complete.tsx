import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Funding.module.css'

interface FundingRound {
  id: string
  type: 'bootstrap' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'revenue-based' | 'grant'
  amount: number
  valuation: number
  dilution: number
  investors: string[]
  status: 'planning' | 'pitching' | 'closed' | 'failed'
  closedDate?: string
}

interface InvestorProfile {
  id: string
  name: string
  type: 'angel' | 'vc' | 'corporate' | 'accelerator'
  checkSize: {min: number, max: number}
  sectors: string[]
  stage: string[]
  fitScore: number
  contacted: boolean
}

interface PitchDeck {
  id: string
  version: number
  slides: {title: string, content: string, feedback: string}[]
  score: number
  improvements: string[]
  lastUpdated: string
}

interface RunwayCalculator {
  id: string
  cash: number
  monthlyBurn: number
  monthsRemaining: number
  extendedBy: {action: string, months: number}[]
  urgency: 'critical' | 'warning' | 'healthy'
}

interface CapTable {
  id: string
  stakeholder: string
  shares: number
  percentage: number
  vestingSchedule: string
  type: 'founder' | 'employee' | 'investor' | 'advisor'
}

interface DilutionModel {
  id: string
  roundName: string
  preMoney: number
  investment: number
  postMoney: number
  newInvestorOwnership: number
  founderDilution: number
}

interface SAFECalculator {
  id: string
  investment: number
  valuationCap: number
  discount: number
  conversionShares: number
  futureOwnership: number
}

interface TractionMetrics {
  id: string
  metric: string
  current: number
  target: number
  progress: number
  investorAppeal: number
}

interface GrantOpportunity {
  id: string
  program: string
  amount: number
  deadline: string
  eligibility: string[]
  competitive: boolean
  applicationStatus: 'draft' | 'submitted' | 'approved' | 'denied'
}

interface TermSheet {
  id: string
  investor: string
  amount: number
  valuation: number
  terms: {term: string, favorable: boolean}[]
  overallRating: 'excellent' | 'good' | 'fair' | 'poor'
  redFlags: string[]
}

interface FundingTimeline {
  id: string
  milestone: string
  targetDate: string
  completed: boolean
  dependencies: string[]
  blockers: string[]
}

interface RevenueBasedFinancing {
  id: string
  amount: number
  revenueShare: number
  paybackCap: number
  monthlyPayment: number
  estimatedPayoff: number
}

interface InvestorOutreach {
  id: string
  investor: string
  channel: string
  message: string
  response: 'pending' | 'interested' | 'declined' | 'meeting-scheduled'
  followUpDate?: string
}

interface CompetitiveRounds {
  id: string
  competitor: string
  amount: number
  valuation: number
  investors: string[]
  insights: string[]
}

interface FundingStrategy {
  id: string
  approach: string
  pros: string[]
  cons: string[]
  timeline: string
  successRate: number
  recommended: boolean
}

export function Funding() {
  const { addToast } = useApp()
  
  const [rounds, setRounds] = useState<FundingRound[]>([])
  const [investors, setInvestors] = useState<InvestorProfile[]>([])
  const [decks, setDecks] = useState<PitchDeck[]>([])
  const [runway, setRunway] = useState<RunwayCalculator[]>([])
  const [capTable, setCapTable] = useState<CapTable[]>([])
  const [dilutions, setDilutions] = useState<DilutionModel[]>([])
  const [safes, setSafes] = useState<SAFECalculator[]>([])
  const [traction, setTraction] = useState<TractionMetrics[]>([])
  const [grants, setGrants] = useState<GrantOpportunity[]>([])
  const [termSheets, setTermSheets] = useState<TermSheet[]>([])
  const [timelines, setTimelines] = useState<FundingTimeline[]>([])
  const [rbf, setRbf] = useState<RevenueBasedFinancing[]>([])
  const [outreach, setOutreach] = useState<InvestorOutreach[]>([])
  const [competitive, setCompetitive] = useState<CompetitiveRounds[]>([])
  const [strategies, setStrategies] = useState<FundingStrategy[]>([])

  const [activeSection, setActiveSection] = useState('rounds')

  useEffect(() => {
    const keys = ['rounds', 'investors', 'decks', 'runway', 'capTable', 'dilutions', 'safes', 'traction', 'grants', 'termSheets', 'timelines', 'rbf', 'outreach', 'competitive', 'strategies']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`funding_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'rounds': setRounds(data); break
          case 'investors': setInvestors(data); break
          case 'decks': setDecks(data); break
          case 'runway': setRunway(data); break
          case 'capTable': setCapTable(data); break
          case 'dilutions': setDilutions(data); break
          case 'safes': setSafes(data); break
          case 'traction': setTraction(data); break
          case 'grants': setGrants(data); break
          case 'termSheets': setTermSheets(data); break
          case 'timelines': setTimelines(data); break
          case 'rbf': setRbf(data); break
          case 'outreach': setOutreach(data); break
          case 'competitive': setCompetitive(data); break
          case 'strategies': setStrategies(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('funding_rounds', JSON.stringify(rounds)) }, [rounds])
  useEffect(() => { localStorage.setItem('funding_investors', JSON.stringify(investors)) }, [investors])
  useEffect(() => { localStorage.setItem('funding_decks', JSON.stringify(decks)) }, [decks])
  useEffect(() => { localStorage.setItem('funding_runway', JSON.stringify(runway)) }, [runway])
  useEffect(() => { localStorage.setItem('funding_capTable', JSON.stringify(capTable)) }, [capTable])
  useEffect(() => { localStorage.setItem('funding_dilutions', JSON.stringify(dilutions)) }, [dilutions])
  useEffect(() => { localStorage.setItem('funding_safes', JSON.stringify(safes)) }, [safes])
  useEffect(() => { localStorage.setItem('funding_traction', JSON.stringify(traction)) }, [traction])
  useEffect(() => { localStorage.setItem('funding_grants', JSON.stringify(grants)) }, [grants])
  useEffect(() => { localStorage.setItem('funding_termSheets', JSON.stringify(termSheets)) }, [termSheets])
  useEffect(() => { localStorage.setItem('funding_timelines', JSON.stringify(timelines)) }, [timelines])
  useEffect(() => { localStorage.setItem('funding_rbf', JSON.stringify(rbf)) }, [rbf])
  useEffect(() => { localStorage.setItem('funding_outreach', JSON.stringify(outreach)) }, [outreach])
  useEffect(() => { localStorage.setItem('funding_competitive', JSON.stringify(competitive)) }, [competitive])
  useEffect(() => { localStorage.setItem('funding_strategies', JSON.stringify(strategies)) }, [strategies])

  // AI Functions
  const calculateDilution = (preMoney: number, investment: number): number => {
    const postMoney = preMoney + investment
    return (investment / postMoney) * 100
  }

  const calculateRunway = (cash: number, burn: number): number => {
    if (burn === 0) return 999
    return Math.floor(cash / burn)
  }

  const calculateInvestorFit = (investor: InvestorProfile, yourStage: string, yourSector: string): number => {
    let score = 50
    if (investor.stage.includes(yourStage)) score += 25
    if (investor.sectors.includes(yourSector)) score += 25
    return score
  }

  const calculateSAFEConversion = (investment: number, valuationCap: number, discount: number, nextRoundPrice: number): {shares: number, ownership: number} => {
    const discountedPrice = nextRoundPrice * (1 - discount / 100)
    const capPrice = valuationCap / 10000000 // Assuming 10M shares
    const conversionPrice = Math.min(discountedPrice, capPrice)
    const shares = investment / conversionPrice
    const ownership = (shares / 10000000) * 100
    return {shares, ownership}
  }

  const assessRunwayUrgency = (months: number): 'critical' | 'warning' | 'healthy' => {
    if (months < 3) return 'critical'
    if (months < 6) return 'warning'
    return 'healthy'
  }

  const scoreTermSheet = (terms: {term: string, favorable: boolean}[]): 'excellent' | 'good' | 'fair' | 'poor' => {
    const favorableCount = terms.filter(t => t.favorable).length
    const favorablePercentage = (favorableCount / terms.length) * 100
    
    if (favorablePercentage >= 80) return 'excellent'
    if (favorablePercentage >= 60) return 'good'
    if (favorablePercentage >= 40) return 'fair'
    return 'poor'
  }

  const calculateRBFPayment = (amount: number, revenueShare: number, monthlyRevenue: number): number => {
    return monthlyRevenue * (revenueShare / 100)
  }

  const estimatePayoffMonths = (amount: number, paybackCap: number, monthlyPayment: number): number => {
    const totalPayback = amount * (paybackCap / 100)
    if (monthlyPayment === 0) return 999
    return Math.ceil(totalPayback / monthlyPayment)
  }

  // CRUD Functions
  const addRound = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const amount = parseFloat(formData.get('amount') as string)
    const valuation = parseFloat(formData.get('valuation') as string)
    const dilution = calculateDilution(valuation - amount, amount)
    
    const newRound: FundingRound = {
      id: Date.now().toString(),
      type: formData.get('type') as FundingRound['type'],
      amount,
      valuation,
      dilution,
      investors: (formData.get('investors') as string).split(',').map(i => i.trim()),
      status: 'planning'
    }
    
    setRounds([...rounds, newRound])
    addToast(`Round created - ${dilution.toFixed(1)}% dilution`, 'success')
    e.currentTarget.reset()
  }

  const addInvestor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const fitScore = calculateInvestorFit(
      {
        name: formData.get('name') as string,
        type: formData.get('type') as InvestorProfile['type'],
        sectors: (formData.get('sectors') as string).split(','),
        stage: (formData.get('stage') as string).split(','),
      } as InvestorProfile,
      'seed',
      'saas'
    )
    
    const newInvestor: InvestorProfile = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as InvestorProfile['type'],
      checkSize: {
        min: parseFloat(formData.get('minCheck') as string),
        max: parseFloat(formData.get('maxCheck') as string)
      },
      sectors: (formData.get('sectors') as string).split(',').map(s => s.trim()),
      stage: (formData.get('stage') as string).split(',').map(s => s.trim()),
      fitScore,
      contacted: false
    }
    
    setInvestors([...investors, newInvestor])
    addToast(`Investor added - Fit score: ${fitScore}`, 'success')
    e.currentTarget.reset()
  }

  const calculateRunwayMetrics = (cash: number, burn: number) => {
    const months = calculateRunway(cash, burn)
    const urgency = assessRunwayUrgency(months)
    
    const newRunway: RunwayCalculator = {
      id: Date.now().toString(),
      cash,
      monthlyBurn: burn,
      monthsRemaining: months,
      extendedBy: [
        {action: 'Cut discretionary spending', months: 1},
        {action: 'Delay hiring', months: 2},
        {action: 'Secure bridge round', months: 6}
      ],
      urgency
    }
    
    setRunway([...runway, newRunway])
    addToast(`Runway: ${months} months - ${urgency.toUpperCase()}`, urgency === 'critical' ? 'error' : 'info')
  }

  const modelDilution = (roundName: string, preMoney: number, investment: number) => {
    const postMoney = preMoney + investment
    const newInvestorOwnership = (investment / postMoney) * 100
    const founderDilution = newInvestorOwnership
    
    const newModel: DilutionModel = {
      id: Date.now().toString(),
      roundName,
      preMoney,
      investment,
      postMoney,
      newInvestorOwnership,
      founderDilution
    }
    
    setDilutions([...dilutions, newModel])
    addToast(`Dilution: ${founderDilution.toFixed(1)}%`, 'info')
  }

  const calculateSAFE = (investment: number, cap: number, discount: number) => {
    const nextRoundPrice = 10 // Assume $10/share
    const result = calculateSAFEConversion(investment, cap, discount, nextRoundPrice)
    
    const newSAFE: SAFECalculator = {
      id: Date.now().toString(),
      investment,
      valuationCap: cap,
      discount,
      conversionShares: result.shares,
      futureOwnership: result.ownership
    }
    
    setSafes([...safes, newSAFE])
    addToast(`SAFE: ${result.ownership.toFixed(2)}% ownership`, 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Funding & Growth Capital</h1>
          <p className={styles.subtitle}>Strategic fundraising and investor management</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'rounds' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('rounds')}>Funding Rounds</button>
          <button className={`${styles.navItem} ${activeSection === 'investors' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('investors')}>Investor Database</button>
          <button className={`${styles.navItem} ${activeSection === 'deck' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('deck')}>Pitch Deck Scoring</button>
          <button className={`${styles.navItem} ${activeSection === 'runway' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('runway')}>Runway Calculator</button>
          <button className={`${styles.navItem} ${activeSection === 'cap' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('cap')}>Cap Table</button>
          <button className={`${styles.navItem} ${activeSection === 'dilution' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('dilution')}>Dilution Modeling</button>
          <button className={`${styles.navItem} ${activeSection === 'safe' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('safe')}>SAFE Calculator</button>
          <button className={`${styles.navItem} ${activeSection === 'traction' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('traction')}>Traction Metrics</button>
          <button className={`${styles.navItem} ${activeSection === 'grants' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('grants')}>Grant Opportunities</button>
          <button className={`${styles.navItem} ${activeSection === 'terms' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('terms')}>Term Sheet Analyzer</button>
          <button className={`${styles.navItem} ${activeSection === 'timeline' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('timeline')}>Funding Timeline</button>
          <button className={`${styles.navItem} ${activeSection === 'rbf' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('rbf')}>Revenue-Based Financing</button>
          <button className={`${styles.navItem} ${activeSection === 'outreach' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('outreach')}>Investor Outreach</button>
          <button className={`${styles.navItem} ${activeSection === 'competitive' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('competitive')}>Competitive Rounds</button>
          <button className={`${styles.navItem} ${activeSection === 'strategy' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('strategy')}>Funding Strategy</button>
        </nav>

        <main className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h2>{activeSection === 'rounds' ? 'Funding Rounds' : 
                 activeSection === 'runway' ? 'Runway Calculator' :
                 activeSection === 'dilution' ? 'Dilution Modeling' : 'Funding Tools'}</h2>
          </div>

          <div className={styles.toolSection}>
            {activeSection === 'runway' && (
              <div className={styles.calculator}>
                <h3>Calculate Runway</h3>
                <div className={styles.calcInputs}>
                  <input type="number" id="cash" placeholder="Cash on hand ($)" className={styles.input} />
                  <input type="number" id="burn" placeholder="Monthly burn ($)" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const cash = parseFloat((document.getElementById('cash') as HTMLInputElement).value)
                      const burn = parseFloat((document.getElementById('burn') as HTMLInputElement).value)
                      calculateRunwayMetrics(cash, burn)
                    }}
                  >
                    Calculate
                  </button>
                </div>
                
                <div className={styles.runwayGrid}>
                  {runway.map(r => (
                    <div key={r.id} className={`${styles.runwayCard} ${styles[`urgency${r.urgency}`]}`}>
                      <div className={styles.bigNumber}>{r.monthsRemaining}</div>
                      <div className={styles.label}>Months Remaining</div>
                      <div className={styles.urgencyBadge}>{r.urgency.toUpperCase()}</div>
                      <div className={styles.runwayDetails}>
                        <p><strong>Cash:</strong> ${r.cash.toLocaleString()}</p>
                        <p><strong>Burn:</strong> ${r.monthlyBurn.toLocaleString()}/mo</p>
                      </div>
                      <div className={styles.extensions}>
                        <strong>Runway Extensions:</strong>
                        <ul>
                          {r.extendedBy.map((ext, idx) => (
                            <li key={idx}>{ext.action} (+{ext.months} months)</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'dilution' && (
              <div className={styles.calculator}>
                <h3>Model Dilution</h3>
                <div className={styles.calcInputs}>
                  <input type="text" id="roundName" placeholder="Round name" className={styles.input} />
                  <input type="number" id="preMoney" placeholder="Pre-money valuation ($)" className={styles.input} />
                  <input type="number" id="investment" placeholder="Investment amount ($)" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const name = (document.getElementById('roundName') as HTMLInputElement).value
                      const pre = parseFloat((document.getElementById('preMoney') as HTMLInputElement).value)
                      const inv = parseFloat((document.getElementById('investment') as HTMLInputElement).value)
                      modelDilution(name, pre, inv)
                    }}
                  >
                    Model
                  </button>
                </div>

                <div className={styles.dilutionGrid}>
                  {dilutions.map(d => (
                    <div key={d.id} className={styles.dilutionCard}>
                      <h3>{d.roundName}</h3>
                      <div className={styles.dilutionMetrics}>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Pre-Money</span>
                          <span className={styles.metricValue}>${(d.preMoney / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Investment</span>
                          <span className={styles.metricValue}>${(d.investment / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Post-Money</span>
                          <span className={styles.metricValue}>${(d.postMoney / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className={`${styles.metric} ${styles.highlight}`}>
                          <span className={styles.metricLabel}>Dilution</span>
                          <span className={styles.metricValue}>{d.founderDilution.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'safe' && (
              <div className={styles.calculator}>
                <h3>SAFE Calculator</h3>
                <div className={styles.calcInputs}>
                  <input type="number" id="safeInvestment" placeholder="Investment ($)" className={styles.input} />
                  <input type="number" id="valuationCap" placeholder="Valuation cap ($)" className={styles.input} />
                  <input type="number" id="discount" placeholder="Discount (%)" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const inv = parseFloat((document.getElementById('safeInvestment') as HTMLInputElement).value)
                      const cap = parseFloat((document.getElementById('valuationCap') as HTMLInputElement).value)
                      const disc = parseFloat((document.getElementById('discount') as HTMLInputElement).value)
                      calculateSAFE(inv, cap, disc)
                    }}
                  >
                    Calculate
                  </button>
                </div>

                <div className={styles.safeGrid}>
                  {safes.map(s => (
                    <div key={s.id} className={styles.safeCard}>
                      <h3>SAFE Terms</h3>
                      <div className={styles.safeDetails}>
                        <p><strong>Investment:</strong> ${s.investment.toLocaleString()}</p>
                        <p><strong>Valuation Cap:</strong> ${s.valuationCap.toLocaleString()}</p>
                        <p><strong>Discount:</strong> {s.discount}%</p>
                        <div className={styles.results}>
                          <p><strong>Conversion Shares:</strong> {s.conversionShares.toLocaleString()}</p>
                          <p><strong>Future Ownership:</strong> {s.futureOwnership.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {rounds.length === 0 && activeSection === 'rounds' && (
            <div className={styles.emptyState}>
              <p>No funding rounds yet. Add your first round to start tracking capital raises.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
