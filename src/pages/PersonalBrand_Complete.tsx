import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './PersonalBrand.module.css'

interface BrandPositioning {
  id: string
  statement: string
  targetAudience: string
  uniqueValue: string
  differentiation: string
  clarity: number
}

interface ContentPillar {
  id: string
  pillar: string
  themes: string[]
  frequency: string
  performance: number
  examples: string[]
}

interface AudiencePersona {
  id: string
  name: string
  role: string
  painPoints: string[]
  goals: string[]
  channels: string[]
  engagement: number
}

interface ThoughtLeadership {
  id: string
  topic: string
  content: string
  platform: string
  reach: number
  engagement: number
  authority: number
}

interface Speaking {
  id: string
  event: string
  topic: string
  date: string
  audienceSize: number
  recording?: string
  impact: number
}

interface Publication {
  id: string
  title: string
  type: 'article' | 'book' | 'research' | 'whitepaper'
  platform: string
  publishedDate: string
  views: number
  credibility: number
}

interface NetworkRelationship {
  id: string
  name: string
  relationship: 'mentor' | 'peer' | 'mentee' | 'collaborator'
  industry: string
  strength: number
  lastContact: string
}

interface CredibilityStack {
  id: string
  credential: string
  type: 'education' | 'certification' | 'award' | 'recognition' | 'experience'
  issuer: string
  date: string
  weight: number
}

interface WebsiteOptimization {
  id: string
  element: string
  current: string
  optimized: string
  impact: number
  priority: number
}

interface SocialProof {
  id: string
  proof: string
  source: string
  type: 'testimonial' | 'case-study' | 'metric' | 'endorsement'
  credibility: number
  placement: string
}

interface ExpertPositioning {
  id: string
  expertise: string
  evidence: string[]
  competitors: string[]
  differentiation: string
  authority: number
}

interface MediaKit {
  id: string
  bio: string
  headshot: string
  topics: string[]
  previousMedia: string[]
  contactInfo: string
  lastUpdated: string
}

interface BrandConsistency {
  id: string
  element: string
  platforms: {platform: string, consistent: boolean}[]
  score: number
  issues: string[]
}

interface InfluenceScore {
  id: string
  period: string
  reach: number
  engagement: number
  authority: number
  trust: number
  overall: number
}

interface LegacyDocumentation {
  id: string
  achievement: string
  date: string
  impact: string
  evidence: string[]
  category: 'professional' | 'creative' | 'personal' | 'community'
}

export function PersonalBrand() {
  const { addToast } = useApp()
  
  const [positioning, setPositioning] = useState<BrandPositioning[]>([])
  const [pillars, setPillars] = useState<ContentPillar[]>([])
  const [personas, setPersonas] = useState<AudiencePersona[]>([])
  const [leadership, setLeadership] = useState<ThoughtLeadership[]>([])
  const [speaking, setSpeaking] = useState<Speaking[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [network, setNetwork] = useState<NetworkRelationship[]>([])
  const [credibility, setCredibility] = useState<CredibilityStack[]>([])
  const [website, setWebsite] = useState<WebsiteOptimization[]>([])
  const [socialProof, setSocialProof] = useState<SocialProof[]>([])
  const [expertPos, setExpertPos] = useState<ExpertPositioning[]>([])
  const [mediaKit, setMediaKit] = useState<MediaKit[]>([])
  const [consistency, setConsistency] = useState<BrandConsistency[]>([])
  const [influence, setInfluence] = useState<InfluenceScore[]>([])
  const [legacy, setLegacy] = useState<LegacyDocumentation[]>([])

  const [activeSection, setActiveSection] = useState('positioning')

  useEffect(() => {
    const keys = ['positioning', 'pillars', 'personas', 'leadership', 'speaking', 'publications', 'network', 'credibility', 'website', 'socialProof', 'expertPos', 'mediaKit', 'consistency', 'influence', 'legacy']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`personalbrand_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'positioning': setPositioning(data); break
          case 'pillars': setPillars(data); break
          case 'personas': setPersonas(data); break
          case 'leadership': setLeadership(data); break
          case 'speaking': setSpeaking(data); break
          case 'publications': setPublications(data); break
          case 'network': setNetwork(data); break
          case 'credibility': setCredibility(data); break
          case 'website': setWebsite(data); break
          case 'socialProof': setSocialProof(data); break
          case 'expertPos': setExpertPos(data); break
          case 'mediaKit': setMediaKit(data); break
          case 'consistency': setConsistency(data); break
          case 'influence': setInfluence(data); break
          case 'legacy': setLegacy(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('personalbrand_positioning', JSON.stringify(positioning)) }, [positioning])
  useEffect(() => { localStorage.setItem('personalbrand_pillars', JSON.stringify(pillars)) }, [pillars])
  useEffect(() => { localStorage.setItem('personalbrand_personas', JSON.stringify(personas)) }, [personas])
  useEffect(() => { localStorage.setItem('personalbrand_leadership', JSON.stringify(leadership)) }, [leadership])
  useEffect(() => { localStorage.setItem('personalbrand_speaking', JSON.stringify(speaking)) }, [speaking])
  useEffect(() => { localStorage.setItem('personalbrand_publications', JSON.stringify(publications)) }, [publications])
  useEffect(() => { localStorage.setItem('personalbrand_network', JSON.stringify(network)) }, [network])
  useEffect(() => { localStorage.setItem('personalbrand_credibility', JSON.stringify(credibility)) }, [credibility])
  useEffect(() => { localStorage.setItem('personalbrand_website', JSON.stringify(website)) }, [website])
  useEffect(() => { localStorage.setItem('personalbrand_socialProof', JSON.stringify(socialProof)) }, [socialProof])
  useEffect(() => { localStorage.setItem('personalbrand_expertPos', JSON.stringify(expertPos)) }, [expertPos])
  useEffect(() => { localStorage.setItem('personalbrand_mediaKit', JSON.stringify(mediaKit)) }, [mediaKit])
  useEffect(() => { localStorage.setItem('personalbrand_consistency', JSON.stringify(consistency)) }, [consistency])
  useEffect(() => { localStorage.setItem('personalbrand_influence', JSON.stringify(influence)) }, [influence])
  useEffect(() => { localStorage.setItem('personalbrand_legacy', JSON.stringify(legacy)) }, [legacy])

  // AI Functions
  const calculatePositioningClarity = (statement: string, uniqueValue: string, differentiation: string): number => {
    let score = 30
    if (statement.length > 50) score += 20
    if (uniqueValue.length > 30) score += 25
    if (differentiation.length > 30) score += 25
    return Math.min(100, score)
  }

  const calculatePillarPerformance = (themes: string[], frequency: string): number => {
    let score = 50
    if (themes.length >= 3) score += 25
    if (frequency === 'daily' || frequency === 'weekly') score += 25
    return score
  }

  const calculateEngagementScore = (persona: AudiencePersona): number => {
    const baseScore = persona.channels.length * 10
    const painPointsScore = persona.painPoints.length * 5
    const goalsScore = persona.goals.length * 5
    return Math.min(100, baseScore + painPointsScore + goalsScore)
  }

  const calculateAuthorityScore = (reach: number, engagement: number): number => {
    let score = 0
    if (reach >= 10000) score += 40
    else if (reach >= 1000) score += 20
    else if (reach >= 100) score += 10
    
    if (engagement >= 10) score += 40
    else if (engagement >= 5) score += 20
    else if (engagement >= 1) score += 10
    
    return Math.min(100, score + 20)
  }

  const calculateSpeakingImpact = (audienceSize: number, hasRecording: boolean): number => {
    let score = 30
    if (audienceSize >= 1000) score += 40
    else if (audienceSize >= 100) score += 30
    else if (audienceSize >= 50) score += 20
    
    if (hasRecording) score += 30
    return Math.min(100, score)
  }

  const calculateCredibilityWeight = (type: string, issuer: string): number => {
    let weight = 50
    
    if (type === 'award') weight += 30
    else if (type === 'certification') weight += 20
    else if (type === 'education') weight += 15
    
    if (issuer.toLowerCase().includes('university') || issuer.toLowerCase().includes('institute')) weight += 20
    
    return Math.min(100, weight)
  }

  const calculateNetworkStrength = (relationship: string, daysSinceContact: number): number => {
    let score = 50
    
    if (relationship === 'mentor') score += 20
    else if (relationship === 'collaborator') score += 15
    
    if (daysSinceContact < 30) score += 30
    else if (daysSinceContact < 90) score += 15
    else if (daysSinceContact < 180) score += 5
    else score -= 20
    
    return Math.max(0, Math.min(100, score))
  }

  const calculateInfluenceScore = (reach: number, engagement: number, authority: number, trust: number): number => {
    return Math.round((reach * 0.25 + engagement * 0.25 + authority * 0.25 + trust * 0.25))
  }

  const calculateConsistencyScore = (platforms: {platform: string, consistent: boolean}[]): number => {
    if (platforms.length === 0) return 0
    const consistentCount = platforms.filter(p => p.consistent).length
    return (consistentCount / platforms.length) * 100
  }

  // CRUD Functions
  const addPositioning = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const statement = formData.get('statement') as string
    const uniqueValue = formData.get('uniqueValue') as string
    const differentiation = formData.get('differentiation') as string
    const clarity = calculatePositioningClarity(statement, uniqueValue, differentiation)
    
    const newPositioning: BrandPositioning = {
      id: Date.now().toString(),
      statement,
      targetAudience: formData.get('targetAudience') as string,
      uniqueValue,
      differentiation,
      clarity
    }
    
    setPositioning([...positioning, newPositioning])
    addToast(`Positioning created - ${clarity}% clarity`, 'success')
    e.currentTarget.reset()
  }

  const addPillar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const themes = (formData.get('themes') as string).split(',').map(t => t.trim())
    const frequency = formData.get('frequency') as string
    const performance = calculatePillarPerformance(themes, frequency)
    
    const newPillar: ContentPillar = {
      id: Date.now().toString(),
      pillar: formData.get('pillar') as string,
      themes,
      frequency,
      performance,
      examples: []
    }
    
    setPillars([...pillars, newPillar])
    addToast(`Content pillar added - ${performance}% strength`, 'success')
    e.currentTarget.reset()
  }

  const addLeadership = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const reach = parseInt(formData.get('reach') as string)
    const engagement = parseInt(formData.get('engagement') as string)
    const authority = calculateAuthorityScore(reach, engagement)
    
    const newLeadership: ThoughtLeadership = {
      id: Date.now().toString(),
      topic: formData.get('topic') as string,
      content: formData.get('content') as string,
      platform: formData.get('platform') as string,
      reach,
      engagement,
      authority
    }
    
    setLeadership([...leadership, newLeadership])
    addToast(`Thought leadership tracked - ${authority}% authority`, 'success')
    e.currentTarget.reset()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Personal Brand</h1>
          <p className={styles.subtitle}>Build and amplify your professional identity</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'positioning' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('positioning')}>Brand Positioning</button>
          <button className={`${styles.navItem} ${activeSection === 'pillars' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('pillars')}>Content Pillars</button>
          <button className={`${styles.navItem} ${activeSection === 'personas' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('personas')}>Audience Personas</button>
          <button className={`${styles.navItem} ${activeSection === 'leadership' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('leadership')}>Thought Leadership</button>
          <button className={`${styles.navItem} ${activeSection === 'speaking' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('speaking')}>Speaking</button>
          <button className={`${styles.navItem} ${activeSection === 'publications' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('publications')}>Publications</button>
          <button className={`${styles.navItem} ${activeSection === 'network' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('network')}>Network Map</button>
          <button className={`${styles.navItem} ${activeSection === 'credibility' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('credibility')}>Credibility Stack</button>
          <button className={`${styles.navItem} ${activeSection === 'website' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('website')}>Website Optimizer</button>
          <button className={`${styles.navItem} ${activeSection === 'proof' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('proof')}>Social Proof</button>
          <button className={`${styles.navItem} ${activeSection === 'expert' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('expert')}>Expert Positioning</button>
          <button className={`${styles.navItem} ${activeSection === 'media' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('media')}>Media Kit</button>
          <button className={`${styles.navItem} ${activeSection === 'consistency' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('consistency')}>Brand Consistency</button>
          <button className={`${styles.navItem} ${activeSection === 'influence' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('influence')}>Influence Score</button>
          <button className={`${styles.navItem} ${activeSection === 'legacy' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('legacy')}>Legacy Docs</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'positioning' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Brand Positioning Statement</h2>
                <p>Define your unique value and differentiation</p>
              </div>

              <form onSubmit={addPositioning} className={styles.form}>
                <textarea name="statement" placeholder="Positioning statement (I help...)" required className={styles.textarea} rows={3}></textarea>
                <input name="targetAudience" placeholder="Target audience" required className={styles.input} />
                <textarea name="uniqueValue" placeholder="Unique value proposition" required className={styles.textarea} rows={2}></textarea>
                <textarea name="differentiation" placeholder="How you're different from others" required className={styles.textarea} rows={2}></textarea>
                <button type="submit" className={styles.primaryBtn}>Create Positioning</button>
              </form>

              <div className={styles.positioningGrid}>
                {positioning.map(pos => (
                  <div key={pos.id} className={styles.positioningCard}>
                    <div className={styles.clarityScore}>
                      <span className={styles.score}>{pos.clarity}%</span>
                      <span className={styles.label}>Clarity</span>
                    </div>
                    <h3>Positioning Statement</h3>
                    <p className={styles.statement}>{pos.statement}</p>
                    <div className={styles.posDetails}>
                      <div className={styles.detail}>
                        <strong>Target Audience:</strong>
                        <p>{pos.targetAudience}</p>
                      </div>
                      <div className={styles.detail}>
                        <strong>Unique Value:</strong>
                        <p>{pos.uniqueValue}</p>
                      </div>
                      <div className={styles.detail}>
                        <strong>Differentiation:</strong>
                        <p>{pos.differentiation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'leadership' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Thought Leadership Tracker</h2>
                <p>Build authority through consistent content and insights</p>
              </div>

              <form onSubmit={addLeadership} className={styles.form}>
                <input name="topic" placeholder="Topic/theme" required className={styles.input} />
                <textarea name="content" placeholder="Content summary" required className={styles.textarea} rows={3}></textarea>
                <input name="platform" placeholder="Platform (LinkedIn, blog, etc.)" required className={styles.input} />
                <input name="reach" type="number" placeholder="Reach/views" required className={styles.input} />
                <input name="engagement" type="number" placeholder="Engagement (likes, comments)" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Add Content</button>
              </form>

              <div className={styles.leadershipGrid}>
                {leadership.map(lead => (
                  <div key={lead.id} className={styles.leadershipCard}>
                    <div className={styles.authorityBadge}>
                      Authority: {lead.authority}%
                    </div>
                    <h3>{lead.topic}</h3>
                    <p className={styles.platform}>{lead.platform}</p>
                    <p className={styles.content}>{lead.content}</p>
                    <div className={styles.leadershipMetrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>{lead.reach.toLocaleString()}</span>
                        <span className={styles.metricLabel}>Reach</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricValue}>{lead.engagement}</span>
                        <span className={styles.metricLabel}>Engagement</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {leadership.length > 0 && (
                <div className={styles.leadershipSummary}>
                  <h3>Thought Leadership Summary</h3>
                  <div className={styles.summaryStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Total Reach</span>
                      <span className={styles.statValue}>{leadership.reduce((sum, l) => sum + l.reach, 0).toLocaleString()}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Avg Authority</span>
                      <span className={styles.statValue}>{(leadership.reduce((sum, l) => sum + l.authority, 0) / leadership.length).toFixed(0)}%</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Content Pieces</span>
                      <span className={styles.statValue}>{leadership.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
