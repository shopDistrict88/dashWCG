import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './LegacyOwnership.module.css'

interface IPAsset {
  id: string
  name: string
  type: 'patent' | 'trademark' | 'copyright' | 'trade-secret' | 'domain'
  status: 'pending' | 'registered' | 'expired' | 'abandoned'
  filingDate: string
  expirationDate: string
  jurisdiction: string
  value: number
}

interface PatentTracking {
  id: string
  patentNumber: string
  title: string
  inventors: string[]
  filingDate: string
  grantDate: string
  status: 'pending' | 'granted' | 'rejected' | 'expired'
  claims: number
  citations: number
}

interface TrademarkManagement {
  id: string
  mark: string
  class: string
  registrationNumber: string
  status: 'applied' | 'registered' | 'renewed' | 'opposed'
  renewalDate: string
  territories: string[]
}

interface CopyrightRegistry {
  id: string
  work: string
  type: 'literary' | 'artistic' | 'software' | 'audio' | 'video'
  author: string
  registrationDate: string
  term: number
  licenses: number
}

interface TradeSecretVault {
  id: string
  secret: string
  category: string
  value: number
  protection: string[]
  accessLevel: 'confidential' | 'restricted' | 'top-secret'
  lastReview: string
}

interface IPValuation {
  id: string
  assetId: string
  method: 'cost' | 'market' | 'income'
  value: number
  date: string
  assumptions: string[]
  confidence: number
}

interface LicensingOpportunity {
  id: string
  assetId: string
  licensee: string
  terms: string
  royaltyRate: number
  exclusivity: boolean
  revenue: number
  status: 'negotiating' | 'active' | 'expired'
}

interface IPProtectionStrategy {
  id: string
  assetType: string
  strategy: string[]
  budget: number
  effectiveness: number
  risks: string[]
}

interface InfringementMonitor {
  id: string
  assetId: string
  infringer: string
  severity: number
  evidence: string[]
  action: 'cease-desist' | 'negotiation' | 'litigation' | 'monitoring'
  status: 'detected' | 'investigating' | 'resolved'
}

interface SuccessionPlan {
  id: string
  role: string
  currentHolder: string
  successor: string
  timeline: string
  readiness: number
  knowledge: string[]
}

interface KnowledgeTransfer {
  id: string
  topic: string
  from: string
  to: string
  method: 'documentation' | 'mentoring' | 'shadowing' | 'training'
  progress: number
  completionDate: string
}

interface DocumentationArchive {
  id: string
  document: string
  category: string
  version: string
  lastUpdated: string
  criticality: number
  access: string[]
}

interface IPCollaboration {
  id: string
  partner: string
  project: string
  ownership: string
  terms: string
  startDate: string
  active: boolean
}

interface ExitStrategy {
  id: string
  scenario: 'acquisition' | 'ipo' | 'merger' | 'succession'
  ipAssets: string[]
  valuation: number
  timeline: string
  preparation: number
}

interface IPPortfolio {
  id: string
  name: string
  assets: string[]
  totalValue: number
  riskScore: number
  diversification: number
}

export function LegacyOwnership() {
  const { addToast } = useApp()
  
  const [assets, setAssets] = useState<IPAsset[]>([])
  const [patents, setPatents] = useState<PatentTracking[]>([])
  const [trademarks, setTrademarks] = useState<TrademarkManagement[]>([])
  const [copyrights, setCopyrights] = useState<CopyrightRegistry[]>([])
  const [secrets, setSecrets] = useState<TradeSecretVault[]>([])
  const [valuations, setValuations] = useState<IPValuation[]>([])
  const [licenses, setLicenses] = useState<LicensingOpportunity[]>([])
  const [strategies, setStrategies] = useState<IPProtectionStrategy[]>([])
  const [infringements, setInfringements] = useState<InfringementMonitor[]>([])
  const [succession, setSuccession] = useState<SuccessionPlan[]>([])
  const [transfers, setTransfers] = useState<KnowledgeTransfer[]>([])
  const [archive, setArchive] = useState<DocumentationArchive[]>([])
  const [collaborations, setCollaborations] = useState<IPCollaboration[]>([])
  const [exitPlans, setExitPlans] = useState<ExitStrategy[]>([])
  const [portfolios, setPortfolios] = useState<IPPortfolio[]>([])

  const [activeSection, setActiveSection] = useState('assets')

  useEffect(() => {
    const keys = ['assets', 'patents', 'trademarks', 'copyrights', 'secrets', 'valuations', 'licenses', 'strategies', 'infringements', 'succession', 'transfers', 'archive', 'collaborations', 'exitPlans', 'portfolios']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`legacy_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'assets': setAssets(data); break
          case 'patents': setPatents(data); break
          case 'trademarks': setTrademarks(data); break
          case 'copyrights': setCopyrights(data); break
          case 'secrets': setSecrets(data); break
          case 'valuations': setValuations(data); break
          case 'licenses': setLicenses(data); break
          case 'strategies': setStrategies(data); break
          case 'infringements': setInfringements(data); break
          case 'succession': setSuccession(data); break
          case 'transfers': setTransfers(data); break
          case 'archive': setArchive(data); break
          case 'collaborations': setCollaborations(data); break
          case 'exitPlans': setExitPlans(data); break
          case 'portfolios': setPortfolios(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('legacy_assets', JSON.stringify(assets)) }, [assets])
  useEffect(() => { localStorage.setItem('legacy_patents', JSON.stringify(patents)) }, [patents])
  useEffect(() => { localStorage.setItem('legacy_trademarks', JSON.stringify(trademarks)) }, [trademarks])
  useEffect(() => { localStorage.setItem('legacy_copyrights', JSON.stringify(copyrights)) }, [copyrights])
  useEffect(() => { localStorage.setItem('legacy_secrets', JSON.stringify(secrets)) }, [secrets])
  useEffect(() => { localStorage.setItem('legacy_valuations', JSON.stringify(valuations)) }, [valuations])
  useEffect(() => { localStorage.setItem('legacy_licenses', JSON.stringify(licenses)) }, [licenses])
  useEffect(() => { localStorage.setItem('legacy_strategies', JSON.stringify(strategies)) }, [strategies])
  useEffect(() => { localStorage.setItem('legacy_infringements', JSON.stringify(infringements)) }, [infringements])
  useEffect(() => { localStorage.setItem('legacy_succession', JSON.stringify(succession)) }, [succession])
  useEffect(() => { localStorage.setItem('legacy_transfers', JSON.stringify(transfers)) }, [transfers])
  useEffect(() => { localStorage.setItem('legacy_archive', JSON.stringify(archive)) }, [archive])
  useEffect(() => { localStorage.setItem('legacy_collaborations', JSON.stringify(collaborations)) }, [collaborations])
  useEffect(() => { localStorage.setItem('legacy_exitPlans', JSON.stringify(exitPlans)) }, [exitPlans])
  useEffect(() => { localStorage.setItem('legacy_portfolios', JSON.stringify(portfolios)) }, [portfolios])

  // AI Functions
  const calculateIPValue = (type: string, age: number, revenue: number): number => {
    let baseValue = revenue * 3
    if (type === 'patent') baseValue *= 1.5
    if (type === 'trademark') baseValue *= 1.2
    const ageDiscount = Math.max(0, 1 - (age / 20))
    return Math.round(baseValue * ageDiscount)
  }

  const assessPatentStrength = (claims: number, citations: number, age: number): number => {
    let strength = (claims * 2) + (citations * 5)
    if (age < 5) strength += 20
    return Math.min(100, strength)
  }

  const calculateRenewalPriority = (value: number, daysUntilExpiry: number): 'urgent' | 'high' | 'medium' | 'low' => {
    if (daysUntilExpiry < 90 && value > 50000) return 'urgent'
    if (daysUntilExpiry < 180 && value > 10000) return 'high'
    if (daysUntilExpiry < 365) return 'medium'
    return 'low'
  }

  const calculateLicensingROI = (revenue: number, setupCost: number, maintCost: number): number => {
    const totalCost = setupCost + maintCost
    if (totalCost === 0) return 0
    return Math.round(((revenue - totalCost) / totalCost) * 100)
  }

  const assessInfringementThreat = (severity: number, evidenceCount: number): 'critical' | 'high' | 'moderate' | 'low' => {
    const threatScore = severity + (evidenceCount * 10)
    if (threatScore >= 80) return 'critical'
    if (threatScore >= 60) return 'high'
    if (threatScore >= 40) return 'moderate'
    return 'low'
  }

  const calculateSuccessionReadiness = (progress: number, knowledgeItems: number): number => {
    const knowledgeScore = Math.min(100, knowledgeItems * 10)
    return Math.round((progress * 0.6) + (knowledgeScore * 0.4))
  }

  const calculateKnowledgeRetention = (transferredItems: number, criticalItems: number): number => {
    if (criticalItems === 0) return 100
    return Math.round((transferredItems / criticalItems) * 100)
  }

  const assessExitReadiness = (preparation: number, valuation: number, targetValue: number): number => {
    const valuationGap = (valuation / targetValue) * 100
    return Math.round((preparation * 0.5) + (Math.min(100, valuationGap) * 0.5))
  }

  const calculatePortfolioDiversification = (assetTypes: string[]): number => {
    const uniqueTypes = new Set(assetTypes).size
    return Math.min(100, uniqueTypes * 20)
  }

  const calculateProtectionCoverage = (assets: number, protectedAssets: number): number => {
    if (assets === 0) return 0
    return Math.round((protectedAssets / assets) * 100)
  }

  // CRUD Functions
  const addAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newAsset: IPAsset = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as IPAsset['type'],
      status: formData.get('status') as IPAsset['status'],
      filingDate: formData.get('filingDate') as string,
      expirationDate: formData.get('expirationDate') as string,
      jurisdiction: formData.get('jurisdiction') as string,
      value: parseInt(formData.get('value') as string)
    }
    
    setAssets([...assets, newAsset])
    addToast(`IP asset "${newAsset.name}" added`, 'success')
    e.currentTarget.reset()
  }

  const addSuccession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const knowledge = (formData.get('knowledge') as string).split(',').map(k => k.trim())
    const readiness = parseInt(formData.get('readiness') as string)
    const finalReadiness = calculateSuccessionReadiness(readiness, knowledge.length)
    
    const newPlan: SuccessionPlan = {
      id: Date.now().toString(),
      role: formData.get('role') as string,
      currentHolder: formData.get('currentHolder') as string,
      successor: formData.get('successor') as string,
      timeline: formData.get('timeline') as string,
      readiness,
      knowledge
    }
    
    setSuccession([...succession, newPlan])
    addToast(`Succession plan created - ${finalReadiness}% ready`, 'success')
    e.currentTarget.reset()
  }

  const addTransfer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newTransfer: KnowledgeTransfer = {
      id: Date.now().toString(),
      topic: formData.get('topic') as string,
      from: formData.get('from') as string,
      to: formData.get('to') as string,
      method: formData.get('method') as KnowledgeTransfer['method'],
      progress: parseInt(formData.get('progress') as string),
      completionDate: formData.get('completionDate') as string
    }
    
    setTransfers([...transfers, newTransfer])
    addToast('Knowledge transfer logged', 'success')
    e.currentTarget.reset()
  }

  const totalIPValue = assets.reduce((sum, a) => sum + a.value, 0)
  const activeAssets = assets.filter(a => a.status === 'registered').length
  const activeLicenses = licenses.filter(l => l.status === 'active')
  const licensingRevenue = activeLicenses.reduce((sum, l) => sum + l.revenue, 0)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>IP & Legacy Hub</h1>
          <p className={styles.subtitle}>Protect and transfer intellectual property</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{assets.length}</div>
            <div className={styles.statLabel}>IP Assets</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>${(totalIPValue / 1000000).toFixed(1)}M</div>
            <div className={styles.statLabel}>Total Value</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{activeAssets}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'assets' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('assets')}>IP Inventory</button>
          <button className={`${styles.navItem} ${activeSection === 'patents' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('patents')}>Patent Tracker</button>
          <button className={`${styles.navItem} ${activeSection === 'trademarks' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('trademarks')}>Trademark Management</button>
          <button className={`${styles.navItem} ${activeSection === 'copyrights' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('copyrights')}>Copyright Registry</button>
          <button className={`${styles.navItem} ${activeSection === 'secrets' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('secrets')}>Trade Secrets Vault</button>
          <button className={`${styles.navItem} ${activeSection === 'valuations' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('valuations')}>IP Valuation</button>
          <button className={`${styles.navItem} ${activeSection === 'licenses' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('licenses')}>Licensing Opportunities</button>
          <button className={`${styles.navItem} ${activeSection === 'strategies' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('strategies')}>Protection Strategy</button>
          <button className={`${styles.navItem} ${activeSection === 'infringements' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('infringements')}>Infringement Monitor</button>
          <button className={`${styles.navItem} ${activeSection === 'succession' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('succession')}>Succession Planning</button>
          <button className={`${styles.navItem} ${activeSection === 'transfers' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('transfers')}>Knowledge Transfer</button>
          <button className={`${styles.navItem} ${activeSection === 'archive' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('archive')}>Documentation Archive</button>
          <button className={`${styles.navItem} ${activeSection === 'collaborations' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('collaborations')}>IP Collaboration</button>
          <button className={`${styles.navItem} ${activeSection === 'exitPlans' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('exitPlans')}>Exit Strategy</button>
          <button className={`${styles.navItem} ${activeSection === 'portfolios' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('portfolios')}>IP Portfolio</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'assets' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>IP Inventory</h2>
                <p>Comprehensive catalog of intellectual property assets</p>
              </div>

              <form onSubmit={addAsset} className={styles.form}>
                <input name="name" placeholder="Asset name" required className={styles.input} />
                <select name="type" required className={styles.select}>
                  <option value="">Asset type</option>
                  <option value="patent">Patent</option>
                  <option value="trademark">Trademark</option>
                  <option value="copyright">Copyright</option>
                  <option value="trade-secret">Trade Secret</option>
                  <option value="domain">Domain</option>
                </select>
                <select name="status" required className={styles.select}>
                  <option value="">Status</option>
                  <option value="pending">Pending</option>
                  <option value="registered">Registered</option>
                  <option value="expired">Expired</option>
                  <option value="abandoned">Abandoned</option>
                </select>
                <input name="filingDate" type="date" required className={styles.input} />
                <input name="expirationDate" type="date" required className={styles.input} />
                <input name="jurisdiction" placeholder="Jurisdiction" required className={styles.input} />
                <input name="value" type="number" placeholder="Estimated value ($)" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Add IP Asset</button>
              </form>

              <div className={styles.assetsGrid}>
                {assets.map(asset => {
                  const daysUntilExpiry = Math.floor((new Date(asset.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  const priority = calculateRenewalPriority(asset.value, daysUntilExpiry)
                  
                  return (
                    <div key={asset.id} className={`${styles.assetCard} ${styles[asset.status]}`}>
                      <div className={styles.assetHeader}>
                        <h3>{asset.name}</h3>
                        <span className={styles.typeBadge}>{asset.type}</span>
                      </div>
                      <div className={styles.statusBadge}>{asset.status}</div>
                      {daysUntilExpiry > 0 && daysUntilExpiry < 365 && (
                        <div className={`${styles.priorityBadge} ${styles[priority]}`}>
                          {priority.toUpperCase()} - {daysUntilExpiry} days until expiry
                        </div>
                      )}
                      <div className={styles.assetDetails}>
                        <div className={styles.detail}>
                          <strong>Value:</strong> ${asset.value.toLocaleString()}
                        </div>
                        <div className={styles.detail}>
                          <strong>Jurisdiction:</strong> {asset.jurisdiction}
                        </div>
                        <div className={styles.detail}>
                          <strong>Filed:</strong> {new Date(asset.filingDate).toLocaleDateString()}
                        </div>
                        <div className={styles.detail}>
                          <strong>Expires:</strong> {new Date(asset.expirationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeSection === 'succession' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Succession Planning</h2>
                <p>Plan and track leadership transitions</p>
              </div>

              <form onSubmit={addSuccession} className={styles.form}>
                <input name="role" placeholder="Role" required className={styles.input} />
                <input name="currentHolder" placeholder="Current holder" required className={styles.input} />
                <input name="successor" placeholder="Successor" required className={styles.input} />
                <input name="timeline" placeholder="Timeline (e.g., 6 months)" required className={styles.input} />
                <input name="readiness" type="number" placeholder="Progress %" min="0" max="100" required className={styles.input} />
                <textarea name="knowledge" placeholder="Knowledge areas to transfer (comma-separated)" required className={styles.textarea} rows={2}></textarea>
                <button type="submit" className={styles.primaryBtn}>Create Succession Plan</button>
              </form>

              <div className={styles.successionGrid}>
                {succession.map(plan => {
                  const finalReadiness = calculateSuccessionReadiness(plan.readiness, plan.knowledge.length)
                  
                  return (
                    <div key={plan.id} className={styles.successionCard}>
                      <h3>{plan.role}</h3>
                      <div className={styles.transition}>
                        <div className={styles.person}>
                          <strong>{plan.currentHolder}</strong>
                          <span className={styles.label}>Current</span>
                        </div>
                        <div className={styles.arrow}>→</div>
                        <div className={styles.person}>
                          <strong>{plan.successor}</strong>
                          <span className={styles.label}>Successor</span>
                        </div>
                      </div>
                      <div className={styles.readinessScore}>
                        <div className={styles.bigNumber}>{finalReadiness}%</div>
                        <div className={styles.label}>Readiness</div>
                      </div>
                      <div className={styles.readinessBar}>
                        <div className={styles.fill} style={{width: `${finalReadiness}%`}}></div>
                      </div>
                      <div className={styles.timeline}>
                        <strong>Timeline:</strong> {plan.timeline}
                      </div>
                      <div className={styles.knowledge}>
                        <strong>Knowledge Areas ({plan.knowledge.length}):</strong>
                        <div className={styles.tags}>
                          {plan.knowledge.slice(0, 5).map((k, i) => (
                            <span key={i} className={styles.tag}>{k}</span>
                          ))}
                          {plan.knowledge.length > 5 && (
                            <span className={styles.tag}>+{plan.knowledge.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeSection === 'transfers' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Knowledge Transfer</h2>
                <p>Document and track knowledge handoffs</p>
              </div>

              <form onSubmit={addTransfer} className={styles.form}>
                <input name="topic" placeholder="Knowledge topic" required className={styles.input} />
                <input name="from" placeholder="From (teacher)" required className={styles.input} />
                <input name="to" placeholder="To (learner)" required className={styles.input} />
                <select name="method" required className={styles.select}>
                  <option value="">Transfer method</option>
                  <option value="documentation">Documentation</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="shadowing">Shadowing</option>
                  <option value="training">Training</option>
                </select>
                <input name="progress" type="number" placeholder="Progress %" min="0" max="100" required className={styles.input} />
                <input name="completionDate" type="date" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Log Transfer</button>
              </form>

              <div className={styles.transfersGrid}>
                {transfers.sort((a, b) => b.progress - a.progress).map(transfer => (
                  <div key={transfer.id} className={styles.transferCard}>
                    <h3>{transfer.topic}</h3>
                    <div className={styles.methodBadge}>{transfer.method}</div>
                    <div className={styles.transferFlow}>
                      <div className={styles.from}>{transfer.from}</div>
                      <div className={styles.arrow}>→</div>
                      <div className={styles.to}>{transfer.to}</div>
                    </div>
                    <div className={styles.progressSection}>
                      <div className={styles.progressLabel}>
                        <span>Progress</span>
                        <span className={styles.percentage}>{transfer.progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: `${transfer.progress}%`}}></div>
                      </div>
                    </div>
                    <div className={styles.completion}>
                      <strong>Target:</strong> {new Date(transfer.completionDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {transfers.length > 0 && (
                <div className={styles.transferSummary}>
                  <h3>Knowledge Retention</h3>
                  <div className={styles.retentionStats}>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>
                        {calculateKnowledgeRetention(
                          transfers.filter(t => t.progress === 100).length,
                          transfers.length
                        )}%
                      </div>
                      <div className={styles.statLabel}>Retention Rate</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>
                        {transfers.filter(t => t.progress === 100).length}
                      </div>
                      <div className={styles.statLabel}>Complete</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>
                        {transfers.filter(t => t.progress < 100).length}
                      </div>
                      <div className={styles.statLabel}>In Progress</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeSection === 'licenses' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Licensing Opportunities</h2>
                <p>Monetize IP through strategic licensing</p>
              </div>

              <div className={styles.licensingStats}>
                <div className={styles.bigStat}>
                  <div className={styles.value}>${(licensingRevenue / 1000).toFixed(1)}K</div>
                  <div className={styles.label}>Annual Licensing Revenue</div>
                </div>
                <div className={styles.bigStat}>
                  <div className={styles.value}>{activeLicenses.length}</div>
                  <div className={styles.label}>Active Licenses</div>
                </div>
              </div>

              <div className={styles.licensesGrid}>
                {licenses.map(license => {
                  const asset = assets.find(a => a.id === license.assetId)
                  const roi = calculateLicensingROI(license.revenue, 5000, 1000)
                  
                  return (
                    <div key={license.id} className={`${styles.licenseCard} ${styles[license.status]}`}>
                      <div className={styles.statusBadge}>{license.status}</div>
                      <h3>{asset?.name || 'Unknown Asset'}</h3>
                      <div className={styles.licensee}>
                        <strong>Licensee:</strong> {license.licensee}
                      </div>
                      <div className={styles.licenseTerms}>
                        <div className={styles.term}>
                          <strong>Royalty Rate:</strong> {license.royaltyRate}%
                        </div>
                        <div className={styles.term}>
                          <strong>Exclusivity:</strong> {license.exclusivity ? 'Yes' : 'No'}
                        </div>
                      </div>
                      <div className={styles.revenue}>
                        <strong>Revenue:</strong> ${license.revenue.toLocaleString()}
                      </div>
                      <div className={styles.roi}>
                        <strong>ROI:</strong> {roi}%
                      </div>
                      <div className={styles.terms}>{license.terms}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
