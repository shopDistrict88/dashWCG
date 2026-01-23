import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Business.module.css'

interface KPI {
  id: string
  name: string
  current: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'flat'
  health: number
  category: 'revenue' | 'growth' | 'efficiency' | 'quality'
}

interface OKR {
  id: string
  objective: string
  keyResults: {kr: string, progress: number, target: number}[]
  owner: string
  quarter: string
  confidence: number
  status: 'on-track' | 'at-risk' | 'off-track' | 'complete'
}

interface TeamCapacity {
  id: string
  member: string
  role: string
  availability: number
  allocated: number
  utilization: number
  overloaded: boolean
  skills: string[]
}

interface Meeting {
  id: string
  title: string
  duration: number
  attendees: number
  costPerHour: number
  totalCost: number
  efficiency: number
  outcome: string
  recurring: boolean
}

interface Decision {
  id: string
  title: string
  framework: 'reversible' | 'one-way-door' | 'data-driven' | 'consensus'
  decision: string
  rationale: string
  alternatives: string[]
  date: string
  owner: string
}

interface Process {
  id: string
  name: string
  steps: {step: string, duration: string, owner: string}[]
  frequency: string
  lastUpdated: string
  version: number
  automationPotential: number
}

interface Vendor {
  id: string
  name: string
  service: string
  cost: number
  renewalDate: string
  contractLength: string
  performance: number
  critical: boolean
}

interface Contract {
  id: string
  vendor: string
  type: string
  value: number
  startDate: string
  endDate: string
  autoRenew: boolean
  noticePeriod: number
  status: 'active' | 'expiring' | 'negotiating' | 'cancelled'
}

interface Compliance {
  id: string
  requirement: string
  category: 'legal' | 'security' | 'financial' | 'operational'
  status: 'compliant' | 'partial' | 'non-compliant'
  lastAudit: string
  nextAudit: string
  risk: 'low' | 'medium' | 'high' | 'critical'
}

interface Risk {
  id: string
  risk: string
  probability: number
  impact: number
  score: number
  mitigation: string
  owner: string
  status: 'identified' | 'mitigating' | 'resolved' | 'accepted'
}

interface Incident {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  reportedDate: string
  resolvedDate?: string
  impact: string
  rootCause: string
  preventionSteps: string[]
  status: 'open' | 'investigating' | 'resolved'
}

interface PerformanceReview {
  id: string
  employee: string
  role: string
  period: string
  rating: number
  strengths: string[]
  improvements: string[]
  goals: string[]
  promotionReady: boolean
}

interface OrgChart {
  id: string
  name: string
  role: string
  reportsTo: string
  directReports: number
  department: string
  level: number
}

interface ResourceAllocation {
  id: string
  project: string
  resources: {name: string, allocation: number, role: string}[]
  totalCost: number
  efficiency: number
  bottlenecks: string[]
}

interface BusinessContinuity {
  id: string
  scenario: string
  likelihood: number
  impactDays: number
  recovery: {step: string, timeframe: string, owner: string}[]
  lastTested: string
  readiness: number
}

export function Business() {
  const { addToast } = useApp()
  
  const [kpis, setKpis] = useState<KPI[]>([])
  const [okrs, setOkrs] = useState<OKR[]>([])
  const [capacity, setCapacity] = useState<TeamCapacity[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [compliance, setCompliance] = useState<Compliance[]>([])
  const [risks, setRisks] = useState<Risk[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [orgChart, setOrgChart] = useState<OrgChart[]>([])
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([])
  const [continuity, setContinuity] = useState<BusinessContinuity[]>([])

  const [activeSection, setActiveSection] = useState('kpi')

  useEffect(() => {
    const keys = ['kpis', 'okrs', 'capacity', 'meetings', 'decisions', 'processes', 'vendors', 'contracts', 'compliance', 'risks', 'incidents', 'reviews', 'orgChart', 'allocations', 'continuity']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`business_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'kpis': setKpis(data); break
          case 'okrs': setOkrs(data); break
          case 'capacity': setCapacity(data); break
          case 'meetings': setMeetings(data); break
          case 'decisions': setDecisions(data); break
          case 'processes': setProcesses(data); break
          case 'vendors': setVendors(data); break
          case 'contracts': setContracts(data); break
          case 'compliance': setCompliance(data); break
          case 'risks': setRisks(data); break
          case 'incidents': setIncidents(data); break
          case 'reviews': setReviews(data); break
          case 'orgChart': setOrgChart(data); break
          case 'allocations': setAllocations(data); break
          case 'continuity': setContinuity(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('business_kpis', JSON.stringify(kpis)) }, [kpis])
  useEffect(() => { localStorage.setItem('business_okrs', JSON.stringify(okrs)) }, [okrs])
  useEffect(() => { localStorage.setItem('business_capacity', JSON.stringify(capacity)) }, [capacity])
  useEffect(() => { localStorage.setItem('business_meetings', JSON.stringify(meetings)) }, [meetings])
  useEffect(() => { localStorage.setItem('business_decisions', JSON.stringify(decisions)) }, [decisions])
  useEffect(() => { localStorage.setItem('business_processes', JSON.stringify(processes)) }, [processes])
  useEffect(() => { localStorage.setItem('business_vendors', JSON.stringify(vendors)) }, [vendors])
  useEffect(() => { localStorage.setItem('business_contracts', JSON.stringify(contracts)) }, [contracts])
  useEffect(() => { localStorage.setItem('business_compliance', JSON.stringify(compliance)) }, [compliance])
  useEffect(() => { localStorage.setItem('business_risks', JSON.stringify(risks)) }, [risks])
  useEffect(() => { localStorage.setItem('business_incidents', JSON.stringify(incidents)) }, [incidents])
  useEffect(() => { localStorage.setItem('business_reviews', JSON.stringify(reviews)) }, [reviews])
  useEffect(() => { localStorage.setItem('business_orgChart', JSON.stringify(orgChart)) }, [orgChart])
  useEffect(() => { localStorage.setItem('business_allocations', JSON.stringify(allocations)) }, [allocations])
  useEffect(() => { localStorage.setItem('business_continuity', JSON.stringify(continuity)) }, [continuity])

  // AI Functions
  const calculateKPIHealth = (current: number, target: number): number => {
    if (target === 0) return 50
    const progress = (current / target) * 100
    return Math.min(progress, 100)
  }

  const calculateOKRConfidence = (keyResults: {kr: string, progress: number, target: number}[]): number => {
    const avgProgress = keyResults.reduce((sum, kr) => sum + (kr.progress / kr.target * 100), 0) / keyResults.length
    return Math.round(avgProgress)
  }

  const assessUtilization = (allocated: number, availability: number): {utilization: number, overloaded: boolean} => {
    const utilization = (allocated / availability) * 100
    return {
      utilization: Math.round(utilization),
      overloaded: utilization > 100
    }
  }

  const calculateMeetingCost = (duration: number, attendees: number, avgHourlyRate: number): number => {
    return (duration / 60) * attendees * avgHourlyRate
  }

  const calculateMeetingEfficiency = (duration: number, outcome: string): number => {
    let baseScore = 50
    if (outcome.toLowerCase().includes('decision')) baseScore += 30
    if (outcome.toLowerCase().includes('action')) baseScore += 20
    if (duration <= 30) baseScore += 20
    if (duration > 60) baseScore -= 20
    return Math.max(0, Math.min(100, baseScore))
  }

  const calculateRiskScore = (probability: number, impact: number): number => {
    return probability * impact
  }

  const assessProcessAutomation = (steps: {step: string, duration: string, owner: string}[]): number => {
    const repetitiveKeywords = ['manual', 'copy', 'paste', 'email', 'spreadsheet', 'update']
    let automationScore = 0
    
    steps.forEach(step => {
      const hasKeyword = repetitiveKeywords.some(kw => step.step.toLowerCase().includes(kw))
      if (hasKeyword) automationScore += 20
    })
    
    return Math.min(100, automationScore)
  }

  const calculateAllocationEfficiency = (resources: {name: string, allocation: number, role: string}[]): number => {
    const avgAllocation = resources.reduce((sum, r) => sum + r.allocation, 0) / resources.length
    if (avgAllocation > 80 && avgAllocation < 95) return 100
    if (avgAllocation < 50) return 40
    if (avgAllocation > 100) return 30
    return 70
  }

  const assessContinuityReadiness = (recovery: {step: string, timeframe: string, owner: string}[], lastTested: string): number => {
    let score = 50
    
    if (recovery.length >= 5) score += 20
    
    const monthsSinceTested = Math.floor((Date.now() - new Date(lastTested).getTime()) / (1000 * 60 * 60 * 24 * 30))
    if (monthsSinceTested < 6) score += 30
    else if (monthsSinceTested < 12) score += 15
    
    return Math.min(100, score)
  }

  // CRUD Functions
  const addKPI = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const current = parseFloat(formData.get('current') as string)
    const target = parseFloat(formData.get('target') as string)
    const health = calculateKPIHealth(current, target)
    
    const newKPI: KPI = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      current,
      target,
      unit: formData.get('unit') as string,
      trend: 'flat',
      health,
      category: formData.get('category') as KPI['category']
    }
    
    setKpis([...kpis, newKPI])
    addToast(`KPI added - ${health.toFixed(0)}% health`, 'success')
    e.currentTarget.reset()
  }

  const addOKR = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const krs = [
      {kr: formData.get('kr1') as string, progress: parseFloat(formData.get('kr1progress') as string || '0'), target: 100},
      {kr: formData.get('kr2') as string, progress: parseFloat(formData.get('kr2progress') as string || '0'), target: 100},
      {kr: formData.get('kr3') as string, progress: parseFloat(formData.get('kr3progress') as string || '0'), target: 100}
    ].filter(kr => kr.kr)
    
    const confidence = calculateOKRConfidence(krs)
    
    const newOKR: OKR = {
      id: Date.now().toString(),
      objective: formData.get('objective') as string,
      keyResults: krs,
      owner: formData.get('owner') as string,
      quarter: formData.get('quarter') as string,
      confidence,
      status: confidence >= 75 ? 'on-track' : confidence >= 50 ? 'at-risk' : 'off-track'
    }
    
    setOkrs([...okrs, newOKR])
    addToast(`OKR created - ${confidence}% confidence`, 'success')
    e.currentTarget.reset()
  }

  const addCapacity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const availability = parseFloat(formData.get('availability') as string)
    const allocated = parseFloat(formData.get('allocated') as string)
    const {utilization, overloaded} = assessUtilization(allocated, availability)
    
    const newCapacity: TeamCapacity = {
      id: Date.now().toString(),
      member: formData.get('member') as string,
      role: formData.get('role') as string,
      availability,
      allocated,
      utilization,
      overloaded,
      skills: (formData.get('skills') as string).split(',').map(s => s.trim())
    }
    
    setCapacity([...capacity, newCapacity])
    addToast(overloaded ? 'Warning: Overallocated!' : 'Capacity tracked', overloaded ? 'error' : 'success')
    e.currentTarget.reset()
  }

  const analyzeMeeting = (title: string, duration: number, attendees: number) => {
    const avgRate = 75
    const cost = calculateMeetingCost(duration, attendees, avgRate)
    const efficiency = calculateMeetingEfficiency(duration, title)
    
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title,
      duration,
      attendees,
      costPerHour: avgRate,
      totalCost: cost,
      efficiency,
      outcome: 'To be determined',
      recurring: false
    }
    
    setMeetings([...meetings, newMeeting])
    addToast(`Meeting cost: $${cost.toFixed(0)} - ${efficiency}% efficient`, efficiency > 60 ? 'success' : 'error')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Business Management</h1>
          <p className={styles.subtitle}>Operations intelligence and team optimization</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'kpi' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('kpi')}>KPI Dashboard</button>
          <button className={`${styles.navItem} ${activeSection === 'okr' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('okr')}>OKR Tracker</button>
          <button className={`${styles.navItem} ${activeSection === 'capacity' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('capacity')}>Team Capacity</button>
          <button className={`${styles.navItem} ${activeSection === 'meetings' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('meetings')}>Meeting Efficiency</button>
          <button className={`${styles.navItem} ${activeSection === 'decisions' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('decisions')}>Decision Framework</button>
          <button className={`${styles.navItem} ${activeSection === 'process' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('process')}>Process Docs</button>
          <button className={`${styles.navItem} ${activeSection === 'vendors' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('vendors')}>Vendor Management</button>
          <button className={`${styles.navItem} ${activeSection === 'contracts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('contracts')}>Contract Tracker</button>
          <button className={`${styles.navItem} ${activeSection === 'compliance' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('compliance')}>Compliance Checklist</button>
          <button className={`${styles.navItem} ${activeSection === 'risk' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('risk')}>Risk Register</button>
          <button className={`${styles.navItem} ${activeSection === 'incidents' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('incidents')}>Incident Management</button>
          <button className={`${styles.navItem} ${activeSection === 'reviews' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('reviews')}>Performance Reviews</button>
          <button className={`${styles.navItem} ${activeSection === 'org' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('org')}>Org Chart</button>
          <button className={`${styles.navItem} ${activeSection === 'allocation' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('allocation')}>Resource Allocation</button>
          <button className={`${styles.navItem} ${activeSection === 'continuity' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('continuity')}>Business Continuity</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'kpi' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>KPI Dashboard</h2>
                <p>Track key performance indicators with health scoring</p>
              </div>

              <form onSubmit={addKPI} className={styles.form}>
                <input name="name" placeholder="KPI name" required className={styles.input} />
                <input name="current" type="number" placeholder="Current value" required className={styles.input} />
                <input name="target" type="number" placeholder="Target value" required className={styles.input} />
                <input name="unit" placeholder="Unit (e.g., %, $, users)" required className={styles.input} />
                <select name="category" required className={styles.select}>
                  <option value="">Select category</option>
                  <option value="revenue">Revenue</option>
                  <option value="growth">Growth</option>
                  <option value="efficiency">Efficiency</option>
                  <option value="quality">Quality</option>
                </select>
                <button type="submit" className={styles.primaryBtn}>Add KPI</button>
              </form>

              <div className={styles.kpiGrid}>
                {kpis.map(kpi => (
                  <div key={kpi.id} className={styles.kpiCard}>
                    <div className={styles.kpiCategory}>{kpi.category}</div>
                    <h3>{kpi.name}</h3>
                    <div className={styles.kpiValues}>
                      <div className={styles.bigNumber}>{kpi.current}<span className={styles.unit}>{kpi.unit}</span></div>
                      <div className={styles.target}>Target: {kpi.target}{kpi.unit}</div>
                    </div>
                    <div className={styles.healthBar}>
                      <div className={styles.healthFill} style={{width: `${kpi.health}%`, backgroundColor: kpi.health >= 80 ? '#10b981' : kpi.health >= 50 ? '#f59e0b' : '#ef4444'}}></div>
                    </div>
                    <div className={styles.healthScore}>{kpi.health.toFixed(0)}% Health</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'capacity' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Team Capacity Planning</h2>
                <p>Monitor team allocation and prevent burnout</p>
              </div>

              <form onSubmit={addCapacity} className={styles.form}>
                <input name="member" placeholder="Team member" required className={styles.input} />
                <input name="role" placeholder="Role" required className={styles.input} />
                <input name="availability" type="number" placeholder="Available hours/week" required className={styles.input} />
                <input name="allocated" type="number" placeholder="Allocated hours/week" required className={styles.input} />
                <input name="skills" placeholder="Skills (comma-separated)" className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Add Capacity</button>
              </form>

              <div className={styles.capacityGrid}>
                {capacity.map(c => (
                  <div key={c.id} className={`${styles.capacityCard} ${c.overloaded ? styles.overloaded : ''}`}>
                    <h3>{c.member}</h3>
                    <div className={styles.role}>{c.role}</div>
                    <div className={styles.utilizationBar}>
                      <div className={styles.utilizationFill} style={{width: `${Math.min(c.utilization, 100)}%`, backgroundColor: c.overloaded ? '#ef4444' : c.utilization > 85 ? '#f59e0b' : '#10b981'}}></div>
                    </div>
                    <div className={styles.utilizationLabel}>{c.utilization}% Utilized</div>
                    <div className={styles.capacityDetails}>
                      <p><strong>Available:</strong> {c.availability}h/week</p>
                      <p><strong>Allocated:</strong> {c.allocated}h/week</p>
                    </div>
                    {c.overloaded && <div className={styles.warning}>⚠️ Overallocated</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'meetings' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Meeting Efficiency Analyzer</h2>
                <p>Calculate meeting costs and optimize calendar time</p>
              </div>

              <div className={styles.calculator}>
                <h3>Analyze Meeting</h3>
                <div className={styles.calcInputs}>
                  <input type="text" id="meetingTitle" placeholder="Meeting title" className={styles.input} />
                  <input type="number" id="meetingDuration" placeholder="Duration (minutes)" className={styles.input} />
                  <input type="number" id="meetingAttendees" placeholder="Number of attendees" className={styles.input} />
                  <button 
                    className={styles.primaryBtn}
                    onClick={() => {
                      const title = (document.getElementById('meetingTitle') as HTMLInputElement).value
                      const duration = parseFloat((document.getElementById('meetingDuration') as HTMLInputElement).value)
                      const attendees = parseFloat((document.getElementById('meetingAttendees') as HTMLInputElement).value)
                      analyzeMeeting(title, duration, attendees)
                    }}
                  >
                    Analyze
                  </button>
                </div>

                <div className={styles.meetingGrid}>
                  {meetings.map(m => (
                    <div key={m.id} className={styles.meetingCard}>
                      <h3>{m.title}</h3>
                      <div className={styles.meetingCost}>${m.totalCost.toFixed(0)}</div>
                      <div className={styles.meetingDetails}>
                        <p><strong>Duration:</strong> {m.duration} min</p>
                        <p><strong>Attendees:</strong> {m.attendees}</p>
                        <p><strong>Efficiency:</strong> {m.efficiency}%</p>
                      </div>
                      <div className={styles.efficiencyBar}>
                        <div className={styles.efficiencyFill} style={{width: `${m.efficiency}%`, backgroundColor: m.efficiency >= 70 ? '#10b981' : m.efficiency >= 40 ? '#f59e0b' : '#ef4444'}}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {meetings.length > 0 && (
                  <div className={styles.meetingSummary}>
                    <h3>Meeting Cost Summary</h3>
                    <div className={styles.summaryStats}>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Total Cost</span>
                        <span className={styles.statValue}>${meetings.reduce((sum, m) => sum + m.totalCost, 0).toFixed(0)}</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Total Time</span>
                        <span className={styles.statValue}>{meetings.reduce((sum, m) => sum + m.duration, 0)} min</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Avg Efficiency</span>
                        <span className={styles.statValue}>{(meetings.reduce((sum, m) => sum + m.efficiency, 0) / meetings.length).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
