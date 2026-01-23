import { useState, useEffect } from 'react'
import styles from './SocialMedia.module.css'

// ============================================================================
// TYPES
// ============================================================================

interface Post {
  id: string
  content: string
  caption: string
  platforms: string[]
  scheduledDate: string
  status: 'draft' | 'scheduled' | 'published'
  performance?: {
    reach: number
    saves: number
    shares: number
    ctr: number
    profileVisits: number
    watchTime: number
    followerGrowth: number
  }
  mood?: string
  viralScore?: number
  qualityScore?: number
}

interface ContentIdea {
  id: string
  hook: string
  format: string
  platform: string
  category: string
  savedDate: string
  trending: boolean
}

interface HashtagCluster {
  id: string
  name: string
  hashtags: string[]
  relevance: number
  difficulty: number
  niche: string
}

interface Competitor {
  id: string
  name: string
  platform: string
  postingFrequency: number
  engagementRate: number
  trendingPosts: string[]
  lastChecked: string
}

interface TrendItem {
  id: string
  type: 'audio' | 'format' | 'challenge' | 'topic' | 'hashtag'
  title: string
  platform: string
  viralityScore: number
  dateSpotted: string
}

interface ABTest {
  id: string
  postId: string
  variantA: string
  variantB: string
  type: 'caption' | 'hook' | 'thumbnail' | 'time'
  resultsA?: any
  resultsB?: any
  winner?: 'A' | 'B'
  status: 'running' | 'completed'
}

interface ContentBrief {
  id: string
  title: string
  hook: string
  structure: string
  cta: string
  platform: string
  assignedTo: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
}

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  tasks: string[]
  approved: number
}

interface Comment {
  id: string
  postId: string
  author: string
  content: string
  sentiment: 'positive' | 'neutral' | 'negative'
  replied: boolean
  platform: string
}

interface DM {
  id: string
  from: string
  message: string
  priority: 'high' | 'medium' | 'low'
  isLead: boolean
  replied: boolean
  tags: string[]
  platform: string
}

interface Influencer {
  id: string
  name: string
  niche: string
  followers: number
  engagementRate: number
  contactEmail: string
  status: 'prospect' | 'contacted' | 'negotiating' | 'contracted' | 'delivered'
  deliverables: string
  payment: number
}

interface AdCampaign {
  id: string
  name: string
  creative: string
  copy: string
  budget: number
  targeting: string
  expectedROI: number
  platform: string
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'paused' | 'completed'
}

interface Template {
  id: string
  name: string
  type: 'caption' | 'hashtag' | 'grid' | 'story' | 'reel'
  content: string
  category: string
}

interface Asset {
  id: string
  name: string
  type: 'video' | 'image' | 'audio' | 'thumbnail' | 'template'
  url: string
  tags: string[]
  uploadDate: string
}

interface Alert {
  id: string
  type: 'spike' | 'drop' | 'competitor' | 'trending'
  message: string
  timestamp: string
  read: boolean
}

interface Persona {
  id: string
  name: string
  age: string
  interests: string[]
  painPoints: string[]
  contentPreference: string[]
}

interface ContentSeries {
  id: string
  name: string
  theme: string
  posts: string[]
  schedule: string[]
  currentEpisode: number
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SocialMedia() {
  const [activeSection, setActiveSection] = useState<string>('overview')

  // State for all features
  const [posts, setPosts] = useState<Post[]>([])
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([])
  const [hashtagClusters, setHashtagClusters] = useState<HashtagCluster[]>([])
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [abTests, setABTests] = useState<ABTest[]>([])
  const [contentBriefs, setContentBriefs] = useState<ContentBrief[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [dms, setDMs] = useState<DM[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [contentSeries, setContentSeries] = useState<ContentSeries[]>([])

  // UI States
  const [showPostForm, setShowPostForm] = useState(false)
  const [showIdeaForm, setShowIdeaForm] = useState(false)
  const [showHashtagForm, setShowHashtagForm] = useState(false)
  const [showCompetitorForm, setShowCompetitorForm] = useState(false)
  const [showBriefForm, setShowBriefForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showInfluencerForm, setShowInfluencerForm] = useState(false)
  const [showAdForm, setShowAdForm] = useState(false)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [showAssetForm, setShowAssetForm] = useState(false)
  const [showPersonaForm, setShowPersonaForm] = useState(false)
  const [showSeriesForm, setShowSeriesForm] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const loadData = (key: string) => {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    }

    setPosts(loadData('social_posts'))
    setContentIdeas(loadData('social_ideas'))
    setHashtagClusters(loadData('social_hashtags'))
    setCompetitors(loadData('social_competitors'))
    setTrends(loadData('social_trends'))
    setABTests(loadData('social_abtests'))
    setContentBriefs(loadData('social_briefs'))
    setTeamMembers(loadData('social_team'))
    setComments(loadData('social_comments'))
    setDMs(loadData('social_dms'))
    setInfluencers(loadData('social_influencers'))
    setAdCampaigns(loadData('social_ads'))
    setTemplates(loadData('social_templates'))
    setAssets(loadData('social_assets'))
    setAlerts(loadData('social_alerts'))
    setPersonas(loadData('social_personas'))
    setContentSeries(loadData('social_series'))
  }, [])

  // Save to localStorage
  useEffect(() => { localStorage.setItem('social_posts', JSON.stringify(posts)) }, [posts])
  useEffect(() => { localStorage.setItem('social_ideas', JSON.stringify(contentIdeas)) }, [contentIdeas])
  useEffect(() => { localStorage.setItem('social_hashtags', JSON.stringify(hashtagClusters)) }, [hashtagClusters])
  useEffect(() => { localStorage.setItem('social_competitors', JSON.stringify(competitors)) }, [competitors])
  useEffect(() => { localStorage.setItem('social_trends', JSON.stringify(trends)) }, [trends])
  useEffect(() => { localStorage.setItem('social_abtests', JSON.stringify(abTests)) }, [abTests])
  useEffect(() => { localStorage.setItem('social_briefs', JSON.stringify(contentBriefs)) }, [contentBriefs])
  useEffect(() => { localStorage.setItem('social_team', JSON.stringify(teamMembers)) }, [teamMembers])
  useEffect(() => { localStorage.setItem('social_comments', JSON.stringify(comments)) }, [comments])
  useEffect(() => { localStorage.setItem('social_dms', JSON.stringify(dms)) }, [dms])
  useEffect(() => { localStorage.setItem('social_influencers', JSON.stringify(influencers)) }, [influencers])
  useEffect(() => { localStorage.setItem('social_ads', JSON.stringify(adCampaigns)) }, [adCampaigns])
  useEffect(() => { localStorage.setItem('social_templates', JSON.stringify(templates)) }, [templates])
  useEffect(() => { localStorage.setItem('social_assets', JSON.stringify(assets)) }, [assets])
  useEffect(() => { localStorage.setItem('social_alerts', JSON.stringify(alerts)) }, [alerts])
  useEffect(() => { localStorage.setItem('social_personas', JSON.stringify(personas)) }, [personas])
  useEffect(() => { localStorage.setItem('social_series', JSON.stringify(contentSeries)) }, [contentSeries])

  // CRUD Functions
  const addPost = (post: Omit<Post, 'id'>) => {
    const newPost: Post = { ...post, id: Date.now().toString() }
    setPosts([newPost, ...posts])
    setShowPostForm(false)
  }

  const deletePost = (id: string) => setPosts(posts.filter(p => p.id !== id))

  const addIdea = (idea: Omit<ContentIdea, 'id' | 'savedDate'>) => {
    const newIdea: ContentIdea = { ...idea, id: Date.now().toString(), savedDate: new Date().toISOString() }
    setContentIdeas([newIdea, ...contentIdeas])
    setShowIdeaForm(false)
  }

  const deleteIdea = (id: string) => setContentIdeas(contentIdeas.filter(i => i.id !== id))

  const addHashtagCluster = (cluster: Omit<HashtagCluster, 'id'>) => {
    const newCluster: HashtagCluster = { ...cluster, id: Date.now().toString() }
    setHashtagClusters([newCluster, ...hashtagClusters])
    setShowHashtagForm(false)
  }

  const deleteHashtagCluster = (id: string) => setHashtagClusters(hashtagClusters.filter(h => h.id !== id))

  const addCompetitor = (competitor: Omit<Competitor, 'id' | 'lastChecked'>) => {
    const newCompetitor: Competitor = { ...competitor, id: Date.now().toString(), lastChecked: new Date().toISOString() }
    setCompetitors([newCompetitor, ...competitors])
    setShowCompetitorForm(false)
  }

  const deleteCompetitor = (id: string) => setCompetitors(competitors.filter(c => c.id !== id))

  const addBrief = (brief: Omit<ContentBrief, 'id'>) => {
    const newBrief: ContentBrief = { ...brief, id: Date.now().toString() }
    setContentBriefs([newBrief, ...contentBriefs])
    setShowBriefForm(false)
  }

  const deleteBrief = (id: string) => setContentBriefs(contentBriefs.filter(b => b.id !== id))

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = { ...member, id: Date.now().toString() }
    setTeamMembers([newMember, ...teamMembers])
    setShowTeamForm(false)
  }

  const deleteTeamMember = (id: string) => setTeamMembers(teamMembers.filter(t => t.id !== id))

  const addInfluencer = (influencer: Omit<Influencer, 'id'>) => {
    const newInfluencer: Influencer = { ...influencer, id: Date.now().toString() }
    setInfluencers([newInfluencer, ...influencers])
    setShowInfluencerForm(false)
  }

  const deleteInfluencer = (id: string) => setInfluencers(influencers.filter(i => i.id !== id))

  const addAdCampaign = (ad: Omit<AdCampaign, 'id'>) => {
    const newAd: AdCampaign = { ...ad, id: Date.now().toString() }
    setAdCampaigns([newAd, ...adCampaigns])
    setShowAdForm(false)
  }

  const deleteAdCampaign = (id: string) => setAdCampaigns(adCampaigns.filter(a => a.id !== id))

  const addTemplate = (template: Omit<Template, 'id'>) => {
    const newTemplate: Template = { ...template, id: Date.now().toString() }
    setTemplates([newTemplate, ...templates])
    setShowTemplateForm(false)
  }

  const deleteTemplate = (id: string) => setTemplates(templates.filter(t => t.id !== id))

  const addAsset = (asset: Omit<Asset, 'id' | 'uploadDate'>) => {
    const newAsset: Asset = { ...asset, id: Date.now().toString(), uploadDate: new Date().toISOString() }
    setAssets([newAsset, ...assets])
    setShowAssetForm(false)
  }

  const deleteAsset = (id: string) => setAssets(assets.filter(a => a.id !== id))

  const addPersona = (persona: Omit<Persona, 'id'>) => {
    const newPersona: Persona = { ...persona, id: Date.now().toString() }
    setPersonas([newPersona, ...personas])
    setShowPersonaForm(false)
  }

  const deletePersona = (id: string) => setPersonas(personas.filter(p => p.id !== id))

  const addSeries = (series: Omit<ContentSeries, 'id'>) => {
    const newSeries: ContentSeries = { ...series, id: Date.now().toString() }
    setContentSeries([newSeries, ...contentSeries])
    setShowSeriesForm(false)
  }

  const deleteSeries = (id: string) => setContentSeries(contentSeries.filter(s => s.id !== id))

  // AI Functions
  const generateAIPost = (platform: string, goal: string, voice: string) => {
    const templates = {
      instagram: {
        growth: `🚀 Ready to level up? Here's what I learned...\n\n✨ [Key Insight]\n💡 [Action Step]\n🎯 [Call to Action]\n\n${voice === 'professional' ? 'Let me know your thoughts below.' : 'Drop a 🔥 if you agree!'}`,
        engagement: `Hey fam! 👋\n\nQuick question: [Engaging Question]?\n\nI've been thinking about [Topic] and here's my take...\n\n[Your Opinion]\n\nWhat do YOU think? Comment below! 👇`,
        sales: `🎉 ANNOUNCEMENT TIME!\n\nI'm so excited to share [Product/Service] with you.\n\nHere's why you'll love it:\n✅ [Benefit 1]\n✅ [Benefit 2]\n✅ [Benefit 3]\n\n🔗 Link in bio!\n\n${voice === 'casual' ? 'Slide in my DMs if you have questions!' : 'Feel free to reach out with any questions.'}`
      },
      tiktok: {
        growth: `POV: You just discovered [Topic] 😱\n\n*show hook*\n*explain value*\n*deliver payoff*\n\nFollow for more ${voice === 'fun' ? '✨vibes✨' : 'tips'}!`,
        engagement: `Wait for it... 👀\n\n[Build tension]\n[Deliver surprise]\n\nDid you see that coming?! 🤯\n\nLike if you want part 2!`,
        sales: `Things I wish I knew before buying [Product]:\n\n1. [Benefit]\n2. [Feature]\n3. [Result]\n\nLink in bio 🔗`
      },
      twitter: {
        growth: `${voice === 'thought_leader' ? '🧵 Thread:' : 'Real talk:'}\n\n[Bold Statement]\n\nHere's what most people miss:\n\n[Insight 1]\n[Insight 2]\n[Insight 3]\n\nRT if this helped!`,
        engagement: `Hot take: [Controversial Opinion]\n\nChange my mind. 💭`,
        sales: `You don't need [Expensive Solution].\n\nYou need [Your Solution].\n\nHere's why: [Value Prop]\n\nGet it here: [Link]`
      }
    }

    const generated = templates[platform as keyof typeof templates]?.[goal as keyof typeof templates.instagram] || 
                     'Generated post content based on your brand voice and platform best practices.'
    
    return {
      caption: generated,
      structure: `Hook → Value → CTA`,
      mood: voice === 'professional' ? 'Authoritative' : voice === 'casual' ? 'Friendly' : 'Engaging'
    }
  }

  const generateAIComment = (commentText: string, sentiment: string, voice: string) => {
    if (sentiment === 'positive') {
      return voice === 'professional' 
        ? 'Thank you so much for your support! We really appreciate it.'
        : 'Thanks so much! 🙏 Appreciate you!'
    }
    if (sentiment === 'negative') {
      return voice === 'professional'
        ? 'Thank you for your feedback. We take this seriously and would love to make it right. Can you DM us?'
        : 'Oh no! We are sorry to hear that. Let us fix this - DM us!'
    }
    return voice === 'professional'
      ? 'Thank you for your comment! We appreciate you engaging with our content.'
      : 'Thanks for stopping by! 😊'
  }

  const calculateViralScore = (post: Post) => {
    let score = 0
    const content = post.caption.toLowerCase()
    
    // Hook words
    if (/(pov|wait|secret|shocking|nobody talks about|truth)/i.test(content)) score += 20
    
    // Engagement words
    if (/(comment|like|share|follow|save|tag)/i.test(content)) score += 15
    
    // Emotional words
    if (/(amazing|incredible|shocking|unbelievable|game-changing)/i.test(content)) score += 15
    
    // Structure
    if (content.includes('?')) score += 10 // Questions
    if (content.split('\n').length > 3) score += 10 // Multi-line structure
    if (/\d+/.test(content)) score += 10 // Numbers/lists
    
    // Emoji usage
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu) || []).length
    if (emojiCount >= 2 && emojiCount <= 5) score += 10
    
    // Platform optimization
    if (post.platforms.includes('tiktok') || post.platforms.includes('instagram')) score += 10
    
    return Math.min(score, 100)
  }

  const calculateQualityScore = (content: string) => {
    let score = 0
    
    // Has clear hook (first line)
    const firstLine = content.split('\n')[0]
    if (firstLine.length > 10 && firstLine.length < 100) score += 25
    
    // Has structure (multiple paragraphs)
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    if (paragraphs.length >= 2) score += 25
    
    // Has CTA
    if (/(click|link|bio|comment|share|follow|visit|check out)/i.test(content)) score += 25
    
    // Proper length
    if (content.length >= 50 && content.length <= 500) score += 25
    
    return score
  }

  const predictMood = (content: string) => {
    const lowerContent = content.toLowerCase()
    
    if (/(excited|amazing|love|incredible|awesome)/i.test(lowerContent)) return 'Energetic'
    if (/(think|consider|perspective|view|opinion)/i.test(lowerContent)) return 'Thoughtful'
    if (/(help|guide|learn|teach|tip)/i.test(lowerContent)) return 'Educational'
    if (/(fun|lol|haha|😂|🤣)/i.test(lowerContent)) return 'Playful'
    if (/(urgent|now|today|limited|hurry)/i.test(lowerContent)) return 'Urgent'
    
    return 'Neutral'
  }

  const analyzeSentiment = (caption: string) => {
    const positive = /(love|amazing|great|awesome|incredible|best|perfect|wonderful)/gi
    const negative = /(hate|worst|terrible|awful|bad|horrible|disappointed)/gi
    
    const positiveCount = (caption.match(positive) || []).length
    const negativeCount = (caption.match(negative) || []).length
    
    if (positiveCount > negativeCount) return 'Positive ✅'
    if (negativeCount > positiveCount) return 'Negative ⚠️ - Consider revising'
    return 'Neutral'
  }

  const getBestTimeToPost = (platform: string) => {
    const times = {
      instagram: ['9:00 AM', '12:00 PM', '6:00 PM'],
      tiktok: ['7:00 AM', '12:00 PM', '7:00 PM', '9:00 PM'],
      twitter: ['8:00 AM', '12:00 PM', '5:00 PM'],
      linkedin: ['7:00 AM', '12:00 PM', '5:00 PM'],
      facebook: ['9:00 AM', '1:00 PM', '3:00 PM']
    }
    return times[platform as keyof typeof times] || ['9:00 AM', '3:00 PM', '7:00 PM']
  }

  const repurposePost = (originalPost: Post) => {
    const variations = [
      {
        platform: 'Instagram',
        caption: `${originalPost.caption}\n\n🔗 Link in bio!\n\n#creative #content #creator`
      },
      {
        platform: 'TikTok',
        caption: `Quick version:\n\n${originalPost.caption.split('\n')[0]}\n\n✨ Part 2 coming soon!`
      },
      {
        platform: 'Twitter',
        caption: originalPost.caption.substring(0, 250) + '...\n\n🧵 Thread below:'
      },
      {
        platform: 'LinkedIn',
        caption: `Professional insight:\n\n${originalPost.caption}\n\n#industry #professional #growth`
      }
    ]
    return variations
  }

  // ============================================================================
  // SECTIONS
  // ============================================================================

  const OverviewSection = () => {
    const totalFollowers = 54400
    const totalEngagement = posts.reduce((sum, p) => sum + (p.performance?.reach || 0), 0)
    const avgEngagementRate = 3.8

    return (
      <div>
        <h2 className={styles.sectionTitle}>Social Media Command Center</h2>
        <p className={styles.sectionSubtitle}>Your complete growth engine</p>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Followers</div>
            <div className={styles.statValue}>{totalFollowers.toLocaleString()}</div>
            <div className={styles.statChange}>+12.5% this month</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Reach</div>
            <div className={styles.statValue}>{totalEngagement.toLocaleString()}</div>
            <div className={styles.statChange}>+18.3% this week</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Engagement Rate</div>
            <div className={styles.statValue}>{avgEngagementRate}%</div>
            <div className={styles.statChange}>+0.4% vs last month</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Posts This Month</div>
            <div className={styles.statValue}>{posts.filter(p => p.status === 'published').length}</div>
            <div className={styles.statChange}>{Math.round(posts.length / 30 * 100) / 100} per day</div>
          </div>
        </div>

        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button className={styles.actionBtn} onClick={() => setActiveSection('post-creator')}>
              ✏️ Create Post
            </button>
            <button className={styles.actionBtn} onClick={() => setActiveSection('analytics')}>
              📊 View Analytics
            </button>
            <button className={styles.actionBtn} onClick={() => setActiveSection('calendar')}>
              📅 Schedule Content
            </button>
            <button className={styles.actionBtn} onClick={() => setActiveSection('trends')}>
              🔥 Check Trends
            </button>
          </div>
        </div>

        <div className={styles.recentAlerts}>
          <h3>Recent Alerts</h3>
          {alerts.slice(0, 5).map(alert => (
            <div key={alert.id} className={styles.alertItem}>
              <span className={styles.alertIcon}>
                {alert.type === 'spike' ? '📈' : alert.type === 'drop' ? '📉' : alert.type === 'competitor' ? '👀' : '🔥'}
              </span>
              <span className={styles.alertMessage}>{alert.message}</span>
              <span className={styles.alertTime}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {alerts.length === 0 && <p className={styles.emptyState}>No alerts yet. We'll notify you of important events.</p>}
        </div>
      </div>
    )
  }

  const CalendarSection = () => {
    const scheduledPosts = posts.filter(p => p.status === 'scheduled')
    
    return (
      <div>
        <h2 className={styles.sectionTitle}>Smart Content Calendar</h2>
        <p className={styles.sectionSubtitle}>AI-powered scheduling and gap detection</p>

        <div className={styles.calendarActions}>
          <button className={styles.primaryBtn} onClick={() => setShowPostForm(true)}>
            + Schedule New Post
          </button>
          <button className={styles.secondaryBtn}>
            🤖 Auto-Fill Gaps
          </button>
          <button className={styles.secondaryBtn}>
            ⚡ Suggest Best Times
          </button>
        </div>

        <div className={styles.calendarGrid}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className={styles.calendarDay}>
              <div className={styles.dayHeader}>{day}</div>
              <div className={styles.dayContent}>
                {scheduledPosts
                  .filter(p => new Date(p.scheduledDate).getDay() === ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(day))
                  .slice(0, 2)
                  .map(post => (
                    <div key={post.id} className={styles.calendarPost}>
                      <div className={styles.postTime}>{new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div className={styles.postPreview}>{post.caption.substring(0, 30)}...</div>
                      <div className={styles.postPlatforms}>{post.platforms.join(', ')}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.scheduledList}>
          <h3>Upcoming Posts ({scheduledPosts.length})</h3>
          {scheduledPosts.map(post => (
            <div key={post.id} className={styles.scheduledItem}>
              <div className={styles.scheduledInfo}>
                <div className={styles.scheduledDate}>{new Date(post.scheduledDate).toLocaleString()}</div>
                <div className={styles.scheduledCaption}>{post.caption}</div>
                <div className={styles.scheduledPlatforms}>
                  {post.platforms.map(p => <span key={p} className={styles.platformBadge}>{p}</span>)}
                </div>
              </div>
              <div className={styles.scheduledActions}>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            </div>
          ))}
          {scheduledPosts.length === 0 && <p className={styles.emptyState}>No scheduled posts. Create your first one!</p>}
        </div>
      </div>
    )
  }

  const PostCreatorSection = () => {
    const [postForm, setPostForm] = useState({
      caption: '',
      platforms: [] as string[],
      scheduledDate: '',
      goal: 'growth',
      voice: 'professional'
    })

    const [generatedPost, setGeneratedPost] = useState<any>(null)

    const handleGeneratePost = () => {
      const result = generateAIPost(postForm.platforms[0] || 'instagram', postForm.goal, postForm.voice)
      setGeneratedPost(result)
      setPostForm({ ...postForm, caption: result.caption })
    }

    const handleCreatePost = () => {
      if (!postForm.caption || postForm.platforms.length === 0) return

      const viralScore = calculateViralScore({ ...postForm, id: '', status: 'draft', content: '' } as Post)
      const qualityScore = calculateQualityScore(postForm.caption)
      const mood = predictMood(postForm.caption)

      addPost({
        content: postForm.caption,
        caption: postForm.caption,
        platforms: postForm.platforms,
        scheduledDate: postForm.scheduledDate || new Date().toISOString(),
        status: postForm.scheduledDate ? 'scheduled' : 'draft',
        viralScore,
        qualityScore,
        mood
      })

      setPostForm({ caption: '', platforms: [], scheduledDate: '', goal: 'growth', voice: 'professional' })
      setGeneratedPost(null)
    }

    const sentiment = postForm.caption ? analyzeSentiment(postForm.caption) : ''
    const qualityScore = postForm.caption ? calculateQualityScore(postForm.caption) : 0

    return (
      <div>
        <h2 className={styles.sectionTitle}>AI Post Creator</h2>
        <p className={styles.sectionSubtitle}>Generate viral-ready content in seconds</p>

        <div className={styles.postCreatorGrid}>
          <div className={styles.creatorForm}>
            <div className={styles.formGroup}>
              <label>Platform</label>
              <div className={styles.platformGrid}>
                {['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook'].map(platform => (
                  <button
                    key={platform}
                    className={`${styles.platformSelectBtn} ${postForm.platforms.includes(platform) ? styles.selected : ''}`}
                    onClick={() => {
                      const newPlatforms = postForm.platforms.includes(platform)
                        ? postForm.platforms.filter(p => p !== platform)
                        : [...postForm.platforms, platform]
                      setPostForm({ ...postForm, platforms: newPlatforms })
                    }}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Goal</label>
              <select value={postForm.goal} onChange={(e) => setPostForm({ ...postForm, goal: e.target.value })} className={styles.select}>
                <option value="growth">Growth</option>
                <option value="engagement">Engagement</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Brand Voice</label>
              <select value={postForm.voice} onChange={(e) => setPostForm({ ...postForm, voice: e.target.value })} className={styles.select}>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="fun">Fun</option>
                <option value="thought_leader">Thought Leader</option>
              </select>
            </div>

            <button className={styles.generateBtn} onClick={handleGeneratePost}>
              🤖 Generate AI Post
            </button>

            <div className={styles.formGroup}>
              <label>Caption</label>
              <textarea
                className={styles.textarea}
                value={postForm.caption}
                onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })}
                rows={8}
                placeholder="Write your caption or generate one with AI..."
              />
            </div>

            {postForm.caption && (
              <div className={styles.postMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Quality Score:</span>
                  <div className={styles.scoreBar}>
                    <div className={styles.scoreBarFill} style={{ width: `${qualityScore}%` }} />
                  </div>
                  <span className={styles.metricValue}>{qualityScore}/100</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Sentiment:</span>
                  <span className={styles.metricValue}>{sentiment}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Predicted Mood:</span>
                  <span className={styles.metricValue}>{predictMood(postForm.caption)}</span>
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Schedule Date & Time (Optional)</label>
              <input
                type="datetime-local"
                className={styles.input}
                value={postForm.scheduledDate}
                onChange={(e) => setPostForm({ ...postForm, scheduledDate: e.target.value })}
              />
            </div>

            {postForm.platforms[0] && (
              <div className={styles.bestTimes}>
                <strong>Best times for {postForm.platforms[0]}:</strong>
                <div className={styles.timeChips}>
                  {getBestTimeToPost(postForm.platforms[0]).map(time => (
                    <span key={time} className={styles.timeChip}>{time}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formActions}>
              <button className={styles.primaryBtn} onClick={handleCreatePost}>
                {postForm.scheduledDate ? '📅 Schedule Post' : '💾 Save as Draft'}
              </button>
              <button className={styles.secondaryBtn} onClick={() => setPostForm({ caption: '', platforms: [], scheduledDate: '', goal: 'growth', voice: 'professional' })}>
                Clear
              </button>
            </div>
          </div>

          <div className={styles.creatorSidebar}>
            <div className={styles.sidebarSection}>
              <h3>💡 Tips</h3>
              <ul className={styles.tipsList}>
                <li>Start with a hook that stops the scroll</li>
                <li>Use 2-4 emojis for visual appeal</li>
                <li>Include a clear call-to-action</li>
                <li>Add line breaks for readability</li>
                <li>Test different formats with A/B testing</li>
              </ul>
            </div>

            {generatedPost && (
              <div className={styles.sidebarSection}>
                <h3>📝 Generated Structure</h3>
                <p><strong>Structure:</strong> {generatedPost.structure}</p>
                <p><strong>Mood:</strong> {generatedPost.mood}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'overview' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('overview')}>
            Overview
          </button>
          <button className={`${styles.navItem} ${activeSection === 'calendar' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('calendar')}>
            Calendar
          </button>
          <button className={`${styles.navItem} ${activeSection === 'post-creator' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('post-creator')}>
            Post Creator
          </button>
          <button className={`${styles.navItem} ${activeSection === 'analytics' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('analytics')}>
            Analytics
          </button>
          <button className={`${styles.navItem} ${activeSection === 'comments' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('comments')}>
            Comments & DMs
          </button>
          <button className={`${styles.navItem} ${activeSection === 'trends' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('trends')}>
            Trends & Competitors
          </button>
          <button className={`${styles.navItem} ${activeSection === 'hashtags' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('hashtags')}>
            Hashtags
          </button>
          <button className={`${styles.navItem} ${activeSection === 'influencers' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('influencers')}>
            Influencer Outreach
          </button>
          <button className={`${styles.navItem} ${activeSection === 'abtesting' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('abtesting')}>
            A/B Testing
          </button>
          <button className={`${styles.navItem} ${activeSection === 'templates' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('templates')}>
            Templates
          </button>
          <button className={`${styles.navItem} ${activeSection === 'team' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('team')}>
            Team Collaboration
          </button>
          <button className={`${styles.navItem} ${activeSection === 'vault' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('vault')}>
            Content Vault
          </button>
          <button className={`${styles.navItem} ${activeSection === 'alerts' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('alerts')}>
            Alerts
          </button>
          <button className={`${styles.navItem} ${activeSection === 'ads' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('ads')}>
            Ads Planner
          </button>
          <button className={`${styles.navItem} ${activeSection === 'reports' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('reports')}>
            Reports
          </button>
        </nav>

        <div className={styles.mainContent}>
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'calendar' && <CalendarSection />}
          {activeSection === 'post-creator' && <PostCreatorSection />}
          {activeSection === 'analytics' && <AnalyticsSection posts={posts} />}
          {activeSection === 'comments' && <CommentsSection comments={comments} setComments={setComments} generateAIComment={generateAIComment} />}
          {activeSection === 'trends' && <TrendsSection trends={trends} competitors={competitors} addCompetitor={addCompetitor} deleteCompetitor={deleteCompetitor} showCompetitorForm={showCompetitorForm} setShowCompetitorForm={setShowCompetitorForm} />}
          {activeSection === 'hashtags' && <HashtagsSection hashtagClusters={hashtagClusters} addHashtagCluster={addHashtagCluster} deleteHashtagCluster={deleteHashtagCluster} showHashtagForm={showHashtagForm} setShowHashtagForm={setShowHashtagForm} />}
          {activeSection === 'influencers' && <InfluencersSection influencers={influencers} addInfluencer={addInfluencer} deleteInfluencer={deleteInfluencer} showInfluencerForm={showInfluencerForm} setShowInfluencerForm={setShowInfluencerForm} />}
          {activeSection === 'abtesting' && <ABTestingSection abTests={abTests} setABTests={setABTests} />}
          {activeSection === 'templates' && <TemplatesSection templates={templates} addTemplate={addTemplate} deleteTemplate={deleteTemplate} showTemplateForm={showTemplateForm} setShowTemplateForm={setShowTemplateForm} />}
          {activeSection === 'team' && <TeamSection teamMembers={teamMembers} contentBriefs={contentBriefs} addTeamMember={addTeamMember} deleteTeamMember={deleteTeamMember} addBrief={addBrief} deleteBrief={deleteBrief} showTeamForm={showTeamForm} setShowTeamForm={setShowTeamForm} showBriefForm={showBriefForm} setShowBriefForm={setShowBriefForm} />}
          {activeSection === 'vault' && <VaultSection assets={assets} contentIdeas={contentIdeas} addAsset={addAsset} deleteAsset={deleteAsset} addIdea={addIdea} deleteIdea={deleteIdea} showAssetForm={showAssetForm} setShowAssetForm={setShowAssetForm} showIdeaForm={showIdeaForm} setShowIdeaForm={setShowIdeaForm} />}
          {activeSection === 'alerts' && <AlertsSection alerts={alerts} setAlerts={setAlerts} />}
          {activeSection === 'ads' && <AdsSection adCampaigns={adCampaigns} addAdCampaign={addAdCampaign} deleteAdCampaign={deleteAdCampaign} showAdForm={showAdForm} setShowAdForm={setShowAdForm} />}
          {activeSection === 'reports' && <ReportsSection posts={posts} />}
        </div>
      </div>
    </div>
  )
}

// Additional section components (continuing...)
const AnalyticsSection = ({ posts }: { posts: Post[] }) => (
  <div>
    <h2 className={styles.sectionTitle}>Post Performance Dashboard</h2>
    <p className={styles.sectionSubtitle}>Track reach, saves, shares, CTR, and more</p>

    <div className={styles.performanceGrid}>
      {posts.filter(p => p.performance).slice(0, 6).map(post => (
        <div key={post.id} className={styles.performanceCard}>
          <div className={styles.performanceHeader}>
            <span className={styles.postDate}>{new Date(post.scheduledDate).toLocaleDateString()}</span>
            {post.viralScore && post.viralScore > 70 && <span className={styles.viralBadge}>🔥 Viral</span>}
          </div>
          <p className={styles.performanceCaption}>{post.caption.substring(0, 80)}...</p>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Reach</span>
              <span className={styles.metricValue}>{post.performance?.reach.toLocaleString()}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Saves</span>
              <span className={styles.metricValue}>{post.performance?.saves.toLocaleString()}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Shares</span>
              <span className={styles.metricValue}>{post.performance?.shares.toLocaleString()}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>CTR</span>
              <span className={styles.metricValue}>{post.performance?.ctr}%</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Profile Visits</span>
              <span className={styles.metricValue}>{post.performance?.profileVisits}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Watch Time</span>
              <span className={styles.metricValue}>{post.performance?.watchTime}s</span>
            </div>
          </div>

          {post.viralScore && (
            <div className={styles.scoreDisplay}>
              <span>Viral Score: {post.viralScore}/100</span>
              <div className={styles.scoreBar}>
                <div className={styles.scoreBarFill} style={{ width: `${post.viralScore}%` }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    {posts.filter(p => p.performance).length === 0 && (
      <p className={styles.emptyState}>No performance data yet. Publish posts to see analytics.</p>
    )}
  </div>
)

const CommentsSection = ({ comments, setComments, generateAIComment }: any) => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleAIReply = (comment: Comment) => {
    const aiReply = generateAIComment(comment.content, comment.sentiment, 'casual')
    setReplyText(aiReply)
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Comments & DM Manager</h2>
      <p className={styles.sectionSubtitle}>AI-powered responses and lead management</p>

      <div className={styles.commentsGrid}>
        <div className={styles.commentsList}>
          <h3>Recent Comments</h3>
          {comments.map((comment: Comment) => (
            <div key={comment.id} className={`${styles.commentItem} ${comment.sentiment === 'negative' ? styles.negative : ''}`}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.author}</span>
                <span className={`${styles.sentimentBadge} ${styles[comment.sentiment]}`}>
                  {comment.sentiment === 'positive' ? '😊' : comment.sentiment === 'negative' ? '😞' : '😐'}
                </span>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
              <div className={styles.commentActions}>
                <button className={styles.replyBtn} onClick={() => { setSelectedComment(comment); handleAIReply(comment) }}>
                  🤖 AI Reply
                </button>
                <button className={styles.secondaryBtn}>Mark as Replied</button>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className={styles.emptyState}>No comments to manage.</p>}
        </div>

        {selectedComment && (
          <div className={styles.replyPanel}>
            <h3>Reply to @{selectedComment.author}</h3>
            <p className={styles.originalComment}>{selectedComment.content}</p>
            <textarea
              className={styles.textarea}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Write your reply..."
            />
            <div className={styles.replyActions}>
              <button className={styles.primaryBtn}>Send Reply</button>
              <button className={styles.secondaryBtn} onClick={() => handleAIReply(selectedComment)}>
                🔄 Regenerate AI Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const TrendsSection = ({ trends, competitors, addCompetitor, deleteCompetitor, showCompetitorForm, setShowCompetitorForm }: any) => {
  const [competitorForm, setCompetitorForm] = useState({
    name: '',
    platform: 'instagram',
    postingFrequency: 0,
    engagementRate: 0,
    trendingPosts: [] as string[]
  })

  const handleAddCompetitor = () => {
    if (!competitorForm.name) return
    addCompetitor(competitorForm)
    setCompetitorForm({ name: '', platform: 'instagram', postingFrequency: 0, engagementRate: 0, trendingPosts: [] })
  }

  // Generate sample trends
  const sampleTrends: TrendItem[] = [
    { id: '1', type: 'audio', title: 'Viral Dance Beat 2026', platform: 'TikTok', viralityScore: 95, dateSpotted: new Date().toISOString() },
    { id: '2', type: 'format', title: 'POV: You just discovered...', platform: 'Instagram', viralityScore: 88, dateSpotted: new Date().toISOString() },
    { id: '3', type: 'challenge', title: '#GlowUpChallenge', platform: 'TikTok', viralityScore: 92, dateSpotted: new Date().toISOString() },
    { id: '4', type: 'topic', title: 'Sustainable Living', platform: 'All Platforms', viralityScore: 78, dateSpotted: new Date().toISOString() },
    { id: '5', type: 'hashtag', title: '#CreatorEconomy', platform: 'LinkedIn', viralityScore: 85, dateSpotted: new Date().toISOString() }
  ]

  const displayTrends = trends.length > 0 ? trends : sampleTrends

  return (
    <div>
      <h2 className={styles.sectionTitle}>Trends & Competitor Spy</h2>
      <p className={styles.sectionSubtitle}>Stay ahead of the curve</p>

      <div className={styles.trendsGrid}>
        <div className={styles.trendsSection}>
          <h3>🔥 Trending Now</h3>
          {displayTrends.map((trend: TrendItem) => (
            <div key={trend.id} className={styles.trendItem}>
              <div className={styles.trendIcon}>
                {trend.type === 'audio' ? '🎵' : trend.type === 'format' ? '📝' : trend.type === 'challenge' ? '🏆' : trend.type === 'topic' ? '💬' : '#'}
              </div>
              <div className={styles.trendInfo}>
                <div className={styles.trendTitle}>{trend.title}</div>
                <div className={styles.trendMeta}>{trend.platform} • Virality: {trend.viralityScore}/100</div>
              </div>
              <button className={styles.useBtn}>Use This</button>
            </div>
          ))}
        </div>

        <div className={styles.competitorsSection}>
          <div className={styles.sectionHeader}>
            <h3>👀 Competitor Tracking</h3>
            <button className={styles.addBtn} onClick={() => setShowCompetitorForm(!showCompetitorForm)}>
              + Add Competitor
            </button>
          </div>

          {showCompetitorForm && (
            <div className={styles.form}>
              <input
                className={styles.input}
                placeholder="Competitor name"
                value={competitorForm.name}
                onChange={(e) => setCompetitorForm({ ...competitorForm, name: e.target.value })}
              />
              <select
                className={styles.select}
                value={competitorForm.platform}
                onChange={(e) => setCompetitorForm({ ...competitorForm, platform: e.target.value })}
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <input
                type="number"
                className={styles.input}
                placeholder="Posts per week"
                value={competitorForm.postingFrequency}
                onChange={(e) => setCompetitorForm({ ...competitorForm, postingFrequency: parseFloat(e.target.value) })}
              />
              <input
                type="number"
                step="0.1"
                className={styles.input}
                placeholder="Engagement rate %"
                value={competitorForm.engagementRate}
                onChange={(e) => setCompetitorForm({ ...competitorForm, engagementRate: parseFloat(e.target.value) })}
              />
              <div className={styles.formActions}>
                <button className={styles.primaryBtn} onClick={handleAddCompetitor}>Add</button>
                <button className={styles.secondaryBtn} onClick={() => setShowCompetitorForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {competitors.map((comp: Competitor) => (
            <div key={comp.id} className={styles.competitorCard}>
              <div className={styles.competitorHeader}>
                <span className={styles.competitorName}>{comp.name}</span>
                <span className={styles.competitorPlatform}>{comp.platform}</span>
              </div>
              <div className={styles.competitorStats}>
                <div>📊 {comp.postingFrequency}x/week</div>
                <div>❤️ {comp.engagementRate}% engagement</div>
              </div>
              <button className={styles.deleteBtn} onClick={() => deleteCompetitor(comp.id)}>Remove</button>
            </div>
          ))}

          {competitors.length === 0 && !showCompetitorForm && (
            <p className={styles.emptyState}>Add competitors to track their activity.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const HashtagsSection = ({ hashtagClusters, addHashtagCluster, deleteHashtagCluster, showHashtagForm, setShowHashtagForm }: any) => {
  const [hashtagForm, setHashtagForm] = useState({
    name: '',
    hashtags: '',
    relevance: 85,
    difficulty: 50,
    niche: ''
  })

  const handleAdd = () => {
    if (!hashtagForm.name || !hashtagForm.hashtags) return
    addHashtagCluster({
      ...hashtagForm,
      hashtags: hashtagForm.hashtags.split(',').map(h => h.trim())
    })
    setHashtagForm({ name: '', hashtags: '', relevance: 85, difficulty: 50, niche: '' })
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Hashtag Research & Generator</h2>
      <p className={styles.sectionSubtitle}>Create high-performing hashtag clusters</p>

      <button className={styles.primaryBtn} onClick={() => setShowHashtagForm(!showHashtagForm)}>
        + Create Hashtag Cluster
      </button>

      {showHashtagForm && (
        <div className={styles.form}>
          <input className={styles.input} placeholder="Cluster name (e.g., 'Fashion Launch')" value={hashtagForm.name} onChange={(e) => setHashtagForm({ ...hashtagForm, name: e.target.value })} />
          <input className={styles.input} placeholder="Niche (e.g., 'Fashion')" value={hashtagForm.niche} onChange={(e) => setHashtagForm({ ...hashtagForm, niche: e.target.value })} />
          <textarea className={styles.textarea} placeholder="Hashtags (comma-separated): #fashion, #style, #ootd" value={hashtagForm.hashtags} onChange={(e) => setHashtagForm({ ...hashtagForm, hashtags: e.target.value })} rows={3} />
          <div className={styles.sliderGroup}>
            <label>Relevance: {hashtagForm.relevance}%</label>
            <input type="range" min="0" max="100" value={hashtagForm.relevance} onChange={(e) => setHashtagForm({ ...hashtagForm, relevance: parseInt(e.target.value) })} className={styles.slider} />
          </div>
          <div className={styles.sliderGroup}>
            <label>Difficulty: {hashtagForm.difficulty}%</label>
            <input type="range" min="0" max="100" value={hashtagForm.difficulty} onChange={(e) => setHashtagForm({ ...hashtagForm, difficulty: parseInt(e.target.value) })} className={styles.slider} />
          </div>
          <div className={styles.formActions}>
            <button className={styles.primaryBtn} onClick={handleAdd}>Create Cluster</button>
            <button className={styles.secondaryBtn} onClick={() => setShowHashtagForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.hashtagGrid}>
        {hashtagClusters.map((cluster: HashtagCluster) => (
          <div key={cluster.id} className={styles.hashtagCard}>
            <div className={styles.hashtagHeader}>
              <span className={styles.hashtagName}>{cluster.name}</span>
              <span className={styles.hashtagNiche}>{cluster.niche}</span>
            </div>
            <div className={styles.hashtagTags}>
              {cluster.hashtags.map((tag, i) => (
                <span key={i} className={styles.hashtagTag}>{tag}</span>
              ))}
            </div>
            <div className={styles.hashtagMetrics}>
              <div>Relevance: <strong>{cluster.relevance}%</strong></div>
              <div>Difficulty: <strong>{cluster.difficulty}%</strong></div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.copyBtn}>📋 Copy All</button>
              <button className={styles.deleteBtn} onClick={() => deleteHashtagCluster(cluster.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {hashtagClusters.length === 0 && !showHashtagForm && (
        <p className={styles.emptyState}>No hashtag clusters yet. Create your first one!</p>
      )}
    </div>
  )
}

const InfluencersSection = ({ influencers, addInfluencer, deleteInfluencer, showInfluencerForm, setShowInfluencerForm }: any) => {
  const [influencerForm, setInfluencerForm] = useState({
    name: '',
    niche: '',
    followers: 0,
    engagementRate: 0,
    contactEmail: '',
    status: 'prospect' as 'prospect' | 'contacted' | 'negotiating' | 'contracted' | 'delivered',
    deliverables: '',
    payment: 0
  })

  const handleAdd = () => {
    if (!influencerForm.name) return
    addInfluencer(influencerForm)
    setInfluencerForm({ name: '', niche: '', followers: 0, engagementRate: 0, contactEmail: '', status: 'prospect', deliverables: '', payment: 0 })
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Influencer Outreach Module</h2>
      <p className={styles.sectionSubtitle}>Manage collaborations, contracts, and payments</p>

      <button className={styles.primaryBtn} onClick={() => setShowInfluencerForm(!showInfluencerForm)}>
        + Add Influencer
      </button>

      {showInfluencerForm && (
        <div className={styles.form}>
          <input className={styles.input} placeholder="Influencer name" value={influencerForm.name} onChange={(e) => setInfluencerForm({ ...influencerForm, name: e.target.value })} />
          <input className={styles.input} placeholder="Niche" value={influencerForm.niche} onChange={(e) => setInfluencerForm({ ...influencerForm, niche: e.target.value })} />
          <input type="number" className={styles.input} placeholder="Followers" value={influencerForm.followers} onChange={(e) => setInfluencerForm({ ...influencerForm, followers: parseInt(e.target.value) })} />
          <input type="number" step="0.1" className={styles.input} placeholder="Engagement rate %" value={influencerForm.engagementRate} onChange={(e) => setInfluencerForm({ ...influencerForm, engagementRate: parseFloat(e.target.value) })} />
          <input className={styles.input} placeholder="Contact email" value={influencerForm.contactEmail} onChange={(e) => setInfluencerForm({ ...influencerForm, contactEmail: e.target.value })} />
          <textarea className={styles.textarea} placeholder="Deliverables" value={influencerForm.deliverables} onChange={(e) => setInfluencerForm({ ...influencerForm, deliverables: e.target.value })} rows={2} />
          <input type="number" className={styles.input} placeholder="Payment amount" value={influencerForm.payment} onChange={(e) => setInfluencerForm({ ...influencerForm, payment: parseFloat(e.target.value) })} />
          <div className={styles.formActions}>
            <button className={styles.primaryBtn} onClick={handleAdd}>Add Influencer</button>
            <button className={styles.secondaryBtn} onClick={() => setShowInfluencerForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.influencerGrid}>
        {influencers.map((inf: Influencer) => (
          <div key={inf.id} className={styles.influencerCard}>
            <div className={styles.influencerHeader}>
              <span className={styles.influencerName}>{inf.name}</span>
              <span className={`${styles.statusBadge} ${styles[inf.status]}`}>{inf.status}</span>
            </div>
            <div className={styles.influencerInfo}>
              <div>📊 {inf.followers.toLocaleString()} followers</div>
              <div>❤️ {inf.engagementRate}% engagement</div>
              <div>💼 {inf.niche}</div>
            </div>
            {inf.deliverables && <div className={styles.deliverables}>{inf.deliverables}</div>}
            {inf.payment > 0 && <div className={styles.payment}>💰 ${inf.payment.toLocaleString()}</div>}
            <div className={styles.cardActions}>
              <button className={styles.editBtn}>Update Status</button>
              <button className={styles.deleteBtn} onClick={() => deleteInfluencer(inf.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {influencers.length === 0 && !showInfluencerForm && (
        <p className={styles.emptyState}>No influencers tracked yet.</p>
      )}
    </div>
  )
}

const ABTestingSection = ({ abTests, setABTests }: any) => (
  <div>
    <h2 className={styles.sectionTitle}>A/B Testing Suite</h2>
    <p className={styles.sectionSubtitle}>Test hooks, captions, thumbnails, and posting times</p>

    <button className={styles.primaryBtn}>+ Create New A/B Test</button>

    <div className={styles.abTestGrid}>
      {abTests.map((test: ABTest) => (
        <div key={test.id} className={styles.abTestCard}>
          <div className={styles.abTestHeader}>
            <span>Testing: {test.type}</span>
            <span className={`${styles.statusBadge} ${styles[test.status]}`}>{test.status}</span>
          </div>
          <div className={styles.variants}>
            <div className={styles.variant}>
              <strong>Variant A:</strong>
              <p>{test.variantA}</p>
            </div>
            <div className={styles.variant}>
              <strong>Variant B:</strong>
              <p>{test.variantB}</p>
            </div>
          </div>
          {test.winner && <div className={styles.winner}>🏆 Winner: Variant {test.winner}</div>}
        </div>
      ))}
    </div>

    {abTests.length === 0 && (
      <p className={styles.emptyState}>No A/B tests running. Create your first test!</p>
    )}
  </div>
)

const TemplatesSection = ({ templates, addTemplate, deleteTemplate, showTemplateForm, setShowTemplateForm }: any) => {
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'caption' as 'caption' | 'hashtag' | 'grid' | 'story' | 'reel',
    content: '',
    category: ''
  })

  const handleAdd = () => {
    if (!templateForm.name || !templateForm.content) return
    addTemplate(templateForm)
    setTemplateForm({ name: '', type: 'caption', content: '', category: '' })
  }

  const sampleTemplates: Template[] = [
    { id: '1', name: 'Daily Motivation', type: 'caption', content: '✨ Your daily reminder:\n\n[Insert message]\n\n💪 Keep pushing!\n\n#motivation #growth', category: 'Engagement' },
    { id: '2', name: 'Product Launch', type: 'caption', content: '🚀 LAUNCHING NOW!\n\n[Product name] is finally here.\n\nWhat you get:\n✅ [Feature 1]\n✅ [Feature 2]\n✅ [Feature 3]\n\n🔗 Link in bio!', category: 'Sales' },
    { id: '3', name: 'Trending Hashtags', type: 'hashtag', content: '#viral #trending #fyp #foryou #explore #creative #content #creator', category: 'Growth' }
  ]

  const displayTemplates = templates.length > 0 ? templates : sampleTemplates

  return (
    <div>
      <h2 className={styles.sectionTitle}>Templates Library</h2>
      <p className={styles.sectionSubtitle}>Pre-built templates for faster content creation</p>

      <button className={styles.primaryBtn} onClick={() => setShowTemplateForm(!showTemplateForm)}>
        + Create Template
      </button>

      {showTemplateForm && (
        <div className={styles.form}>
          <input className={styles.input} placeholder="Template name" value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} />
          <select className={styles.select} value={templateForm.type} onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value as any })}>
            <option value="caption">Caption</option>
            <option value="hashtag">Hashtags</option>
            <option value="grid">Grid Layout</option>
            <option value="story">Story</option>
            <option value="reel">Reel</option>
          </select>
          <input className={styles.input} placeholder="Category" value={templateForm.category} onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })} />
          <textarea className={styles.textarea} placeholder="Template content..." value={templateForm.content} onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })} rows={5} />
          <div className={styles.formActions}>
            <button className={styles.primaryBtn} onClick={handleAdd}>Save Template</button>
            <button className={styles.secondaryBtn} onClick={() => setShowTemplateForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.templateGrid}>
        {displayTemplates.map((template: Template) => (
          <div key={template.id} className={styles.templateCard}>
            <div className={styles.templateHeader}>
              <span className={styles.templateName}>{template.name}</span>
              <span className={styles.templateType}>{template.type}</span>
            </div>
            <div className={styles.templateCategory}>{template.category}</div>
            <div className={styles.templateContent}>{template.content}</div>
            <div className={styles.cardActions}>
              <button className={styles.useBtn}>Use Template</button>
              {template.id !== '1' && template.id !== '2' && template.id !== '3' && (
                <button className={styles.deleteBtn} onClick={() => deleteTemplate(template.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TeamSection = ({ teamMembers, contentBriefs, addTeamMember, deleteTeamMember, addBrief, deleteBrief, showTeamForm, setShowTeamForm, showBriefForm, setShowBriefForm }: any) => {
  const [memberForm, setMemberForm] = useState({ name: '', role: '', email: '', tasks: [] as string[], approved: 0 })
  const [briefForm, setBriefForm] = useState({ title: '', hook: '', structure: '', cta: '', platform: 'instagram', assignedTo: '', dueDate: '', status: 'pending' as 'pending' | 'in-progress' | 'completed' })

  return (
    <div>
      <h2 className={styles.sectionTitle}>Team Collaboration Hub</h2>
      <p className={styles.sectionSubtitle}>Assign tasks, approve content, and manage workflows</p>

      <div className={styles.teamGrid}>
        <div>
          <div className={styles.sectionHeader}>
            <h3>Team Members</h3>
            <button className={styles.addBtn} onClick={() => setShowTeamForm(!showTeamForm)}>+ Add Member</button>
          </div>

          {showTeamForm && (
            <div className={styles.form}>
              <input className={styles.input} placeholder="Name" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
              <input className={styles.input} placeholder="Role" value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} />
              <input className={styles.input} placeholder="Email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
              <div className={styles.formActions}>
                <button className={styles.primaryBtn} onClick={() => { if (memberForm.name) { addTeamMember(memberForm); setMemberForm({ name: '', role: '', email: '', tasks: [], approved: 0 }) } }}>Add</button>
                <button className={styles.secondaryBtn} onClick={() => setShowTeamForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {teamMembers.map((member: TeamMember) => (
            <div key={member.id} className={styles.memberCard}>
              <div><strong>{member.name}</strong></div>
              <div>{member.role}</div>
              <div>📧 {member.email}</div>
              <div>✅ {member.approved} approved</div>
              <button className={styles.deleteBtn} onClick={() => deleteTeamMember(member.id)}>Remove</button>
            </div>
          ))}

          {teamMembers.length === 0 && !showTeamForm && <p className={styles.emptyState}>No team members yet.</p>}
        </div>

        <div>
          <div className={styles.sectionHeader}>
            <h3>Content Briefs</h3>
            <button className={styles.addBtn} onClick={() => setShowBriefForm(!showBriefForm)}>+ Create Brief</button>
          </div>

          {showBriefForm && (
            <div className={styles.form}>
              <input className={styles.input} placeholder="Brief title" value={briefForm.title} onChange={(e) => setBriefForm({ ...briefForm, title: e.target.value })} />
              <input className={styles.input} placeholder="Hook" value={briefForm.hook} onChange={(e) => setBriefForm({ ...briefForm, hook: e.target.value })} />
              <input className={styles.input} placeholder="Structure" value={briefForm.structure} onChange={(e) => setBriefForm({ ...briefForm, structure: e.target.value })} />
              <input className={styles.input} placeholder="CTA" value={briefForm.cta} onChange={(e) => setBriefForm({ ...briefForm, cta: e.target.value })} />
              <input className={styles.input} placeholder="Assigned to" value={briefForm.assignedTo} onChange={(e) => setBriefForm({ ...briefForm, assignedTo: e.target.value })} />
              <input type="date" className={styles.input} value={briefForm.dueDate} onChange={(e) => setBriefForm({ ...briefForm, dueDate: e.target.value })} />
              <div className={styles.formActions}>
                <button className={styles.primaryBtn} onClick={() => { if (briefForm.title) { addBrief(briefForm); setBriefForm({ title: '', hook: '', structure: '', cta: '', platform: 'instagram', assignedTo: '', dueDate: '', status: 'pending' }) } }}>Create</button>
                <button className={styles.secondaryBtn} onClick={() => setShowBriefForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {contentBriefs.map((brief: ContentBrief) => (
            <div key={brief.id} className={styles.briefCard}>
              <div className={styles.briefHeader}>
                <strong>{brief.title}</strong>
                <span className={`${styles.statusBadge} ${styles[brief.status]}`}>{brief.status}</span>
              </div>
              <div>Hook: {brief.hook}</div>
              <div>Assigned: {brief.assignedTo}</div>
              <div>Due: {brief.dueDate}</div>
              <button className={styles.deleteBtn} onClick={() => deleteBrief(brief.id)}>Delete</button>
            </div>
          ))}

          {contentBriefs.length === 0 && !showBriefForm && <p className={styles.emptyState}>No content briefs yet.</p>}
        </div>
      </div>
    </div>
  )
}

const VaultSection = ({ assets, contentIdeas, addAsset, deleteAsset, addIdea, deleteIdea, showAssetForm, setShowAssetForm, showIdeaForm, setShowIdeaForm }: any) => {
  const [assetForm, setAssetForm] = useState({ name: '', type: 'video' as 'video' | 'image' | 'audio' | 'thumbnail' | 'template', url: '', tags: [] as string[] })
  const [ideaForm, setIdeaForm] = useState({ hook: '', format: '', platform: 'instagram', category: '', trending: false })

  return (
    <div>
      <h2 className={styles.sectionTitle}>Content Vault & Idea Library</h2>
      <p className={styles.sectionSubtitle}>Store assets and save trending ideas</p>

      <div className={styles.vaultGrid}>
        <div>
          <div className={styles.sectionHeader}>
            <h3>Assets</h3>
            <button className={styles.addBtn} onClick={() => setShowAssetForm(!showAssetForm)}>+ Add Asset</button>
          </div>

          {showAssetForm && (
            <div className={styles.form}>
              <input className={styles.input} placeholder="Asset name" value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} />
              <select className={styles.select} value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value as any })}>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="thumbnail">Thumbnail</option>
                <option value="template">Template</option>
              </select>
              <input className={styles.input} placeholder="URL or file path" value={assetForm.url} onChange={(e) => setAssetForm({ ...assetForm, url: e.target.value })} />
              <div className={styles.formActions}>
                <button className={styles.primaryBtn} onClick={() => { if (assetForm.name) { addAsset(assetForm); setAssetForm({ name: '', type: 'video', url: '', tags: [] }) } }}>Save</button>
                <button className={styles.secondaryBtn} onClick={() => setShowAssetForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {assets.map((asset: Asset) => (
            <div key={asset.id} className={styles.assetCard}>
              <div><strong>{asset.name}</strong></div>
              <div>{asset.type}</div>
              <button className={styles.deleteBtn} onClick={() => deleteAsset(asset.id)}>Delete</button>
            </div>
          ))}

          {assets.length === 0 && !showAssetForm && <p className={styles.emptyState}>No assets stored.</p>}
        </div>

        <div>
          <div className={styles.sectionHeader}>
            <h3>Content Ideas</h3>
            <button className={styles.addBtn} onClick={() => setShowIdeaForm(!showIdeaForm)}>+ Save Idea</button>
          </div>

          {showIdeaForm && (
            <div className={styles.form}>
              <input className={styles.input} placeholder="Hook" value={ideaForm.hook} onChange={(e) => setIdeaForm({ ...ideaForm, hook: e.target.value })} />
              <input className={styles.input} placeholder="Format" value={ideaForm.format} onChange={(e) => setIdeaForm({ ...ideaForm, format: e.target.value })} />
              <input className={styles.input} placeholder="Category" value={ideaForm.category} onChange={(e) => setIdeaForm({ ...ideaForm, category: e.target.value })} />
              <select className={styles.select} value={ideaForm.platform} onChange={(e) => setIdeaForm({ ...ideaForm, platform: e.target.value })}>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter</option>
              </select>
              <div className={styles.formActions}>
                <button className={styles.primaryBtn} onClick={() => { if (ideaForm.hook) { addIdea(ideaForm); setIdeaForm({ hook: '', format: '', platform: 'instagram', category: '', trending: false }) } }}>Save</button>
                <button className={styles.secondaryBtn} onClick={() => setShowIdeaForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {contentIdeas.map((idea: ContentIdea) => (
            <div key={idea.id} className={styles.ideaCard}>
              <div><strong>{idea.hook}</strong></div>
              <div>{idea.format} • {idea.platform}</div>
              <div>{idea.category}</div>
              <button className={styles.deleteBtn} onClick={() => deleteIdea(idea.id)}>Delete</button>
            </div>
          ))}

          {contentIdeas.length === 0 && !showIdeaForm && <p className={styles.emptyState}>No saved ideas.</p>}
        </div>
      </div>
    </div>
  )
}

const AlertsSection = ({ alerts, setAlerts }: any) => (
  <div>
    <h2 className={styles.sectionTitle}>Performance Alerts</h2>
    <p className={styles.sectionSubtitle}>Get notified of spikes, drops, and opportunities</p>

    <div className={styles.alertsList}>
      {alerts.map((alert: Alert) => (
        <div key={alert.id} className={`${styles.alertItem} ${!alert.read ? styles.unread : ''}`}>
          <span className={styles.alertIcon}>
            {alert.type === 'spike' ? '📈' : alert.type === 'drop' ? '📉' : alert.type === 'competitor' ? '👀' : '🔥'}
          </span>
          <div className={styles.alertContent}>
            <div className={styles.alertMessage}>{alert.message}</div>
            <div className={styles.alertTime}>{new Date(alert.timestamp).toLocaleString()}</div>
          </div>
          <button className={styles.markReadBtn} onClick={() => setAlerts(alerts.map((a: Alert) => a.id === alert.id ? { ...a, read: true } : a))}>
            Mark Read
          </button>
        </div>
      ))}
    </div>

    {alerts.length === 0 && <p className={styles.emptyState}>No alerts. We'll notify you of important events.</p>}
  </div>
)

const AdsSection = ({ adCampaigns, addAdCampaign, deleteAdCampaign, showAdForm, setShowAdForm }: any) => {
  const [adForm, setAdForm] = useState({
    name: '',
    creative: '',
    copy: '',
    budget: 0,
    targeting: '',
    expectedROI: 0,
    platform: 'instagram',
    startDate: '',
    endDate: '',
    status: 'draft' as 'draft' | 'active' | 'paused' | 'completed'
  })

  const handleAdd = () => {
    if (!adForm.name) return
    addAdCampaign(adForm)
    setAdForm({ name: '', creative: '', copy: '', budget: 0, targeting: '', expectedROI: 0, platform: 'instagram', startDate: '', endDate: '', status: 'draft' })
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Paid Ads Planner</h2>
      <p className={styles.sectionSubtitle}>Plan ad campaigns and track ROI</p>

      <button className={styles.primaryBtn} onClick={() => setShowAdForm(!showAdForm)}>
        + Create Ad Campaign
      </button>

      {showAdForm && (
        <div className={styles.form}>
          <input className={styles.input} placeholder="Campaign name" value={adForm.name} onChange={(e) => setAdForm({ ...adForm, name: e.target.value })} />
          <select className={styles.select} value={adForm.platform} onChange={(e) => setAdForm({ ...adForm, platform: e.target.value })}>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="google">Google</option>
          </select>
          <textarea className={styles.textarea} placeholder="Ad copy" value={adForm.copy} onChange={(e) => setAdForm({ ...adForm, copy: e.target.value })} rows={3} />
          <input className={styles.input} placeholder="Creative URL" value={adForm.creative} onChange={(e) => setAdForm({ ...adForm, creative: e.target.value })} />
          <input type="number" className={styles.input} placeholder="Budget ($)" value={adForm.budget} onChange={(e) => setAdForm({ ...adForm, budget: parseFloat(e.target.value) })} />
          <input className={styles.input} placeholder="Targeting (e.g., 18-35, Fashion)" value={adForm.targeting} onChange={(e) => setAdForm({ ...adForm, targeting: e.target.value })} />
          <input type="number" className={styles.input} placeholder="Expected ROI (%)" value={adForm.expectedROI} onChange={(e) => setAdForm({ ...adForm, expectedROI: parseFloat(e.target.value) })} />
          <input type="date" className={styles.input} placeholder="Start date" value={adForm.startDate} onChange={(e) => setAdForm({ ...adForm, startDate: e.target.value })} />
          <input type="date" className={styles.input} placeholder="End date" value={adForm.endDate} onChange={(e) => setAdForm({ ...adForm, endDate: e.target.value })} />
          <div className={styles.formActions}>
            <button className={styles.primaryBtn} onClick={handleAdd}>Create Campaign</button>
            <button className={styles.secondaryBtn} onClick={() => setShowAdForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.adsGrid}>
        {adCampaigns.map((ad: AdCampaign) => (
          <div key={ad.id} className={styles.adCard}>
            <div className={styles.adHeader}>
              <strong>{ad.name}</strong>
              <span className={`${styles.statusBadge} ${styles[ad.status]}`}>{ad.status}</span>
            </div>
            <div>{ad.platform}</div>
            <div>💰 Budget: ${ad.budget.toLocaleString()}</div>
            <div>📈 Expected ROI: {ad.expectedROI}%</div>
            <div>🎯 {ad.targeting}</div>
            <div className={styles.cardActions}>
              <button className={styles.editBtn}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => deleteAdCampaign(ad.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {adCampaigns.length === 0 && !showAdForm && (
        <p className={styles.emptyState}>No ad campaigns yet.</p>
      )}
    </div>
  )
}

const ReportsSection = ({ posts }: { posts: Post[] }) => {
  const totalPosts = posts.length
  const published = posts.filter(p => p.status === 'published').length
  const avgViralScore = posts.reduce((sum, p) => sum + (p.viralScore || 0), 0) / (totalPosts || 1)

  const exportPDF = () => {
    const reportHTML = `
      <html>
        <head>
          <title>Social Media Report</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            h1 { color: #000; }
            .stat { margin: 20px 0; padding: 15px; background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Social Media Performance Report</h1>
          <div class="stat"><strong>Total Posts:</strong> ${totalPosts}</div>
          <div class="stat"><strong>Published:</strong> ${published}</div>
          <div class="stat"><strong>Average Viral Score:</strong> ${avgViralScore.toFixed(1)}/100</div>
          <div class="stat"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
        </body>
      </html>
    `
    const win = window.open('', '', 'width=800,height=600')
    if (win) {
      win.document.write(reportHTML)
      win.document.close()
      win.print()
    }
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Analytics Reports</h2>
      <p className={styles.sectionSubtitle}>Export performance data as PDF or CSV</p>

      <div className={styles.reportStats}>
        <div className={styles.reportStat}>
          <div className={styles.reportLabel}>Total Posts</div>
          <div className={styles.reportValue}>{totalPosts}</div>
        </div>
        <div className={styles.reportStat}>
          <div className={styles.reportLabel}>Published</div>
          <div className={styles.reportValue}>{published}</div>
        </div>
        <div className={styles.reportStat}>
          <div className={styles.reportLabel}>Avg Viral Score</div>
          <div className={styles.reportValue}>{avgViralScore.toFixed(1)}/100</div>
        </div>
      </div>

      <div className={styles.exportActions}>
        <button className={styles.primaryBtn} onClick={exportPDF}>📄 Export PDF</button>
        <button className={styles.secondaryBtn}>📊 Export CSV</button>
      </div>
    </div>
  )
}
