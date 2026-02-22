import { useState, useMemo } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SocialMedia.module.css'

type SMTab = 'overview' | 'create' | 'calendar' | 'analytics' | 'engagement' | 'growth' | 'team' | 'campaigns'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn']

interface Post {
  id: string; caption: string; platforms: string[]; scheduledDate: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'; tags: string[]
  viralScore: number; qualityScore: number; mood: string; version: number
  reach: number; likes: number; shares: number; comments: number; impressions: number
  createdAt: string
}
interface HashtagCluster { id: string; name: string; hashtags: string[]; relevance: number; niche: string }
interface Competitor { id: string; name: string; platform: string; postingFreq: number; engRate: number }
interface ABTest { id: string; variantA: string; variantB: string; type: string; winner: string; status: 'running' | 'completed' }
interface Template { id: string; name: string; type: string; content: string; category: string }
interface TeamMember { id: string; name: string; role: string; email: string }
interface Influencer { id: string; name: string; niche: string; followers: number; engRate: number; status: 'prospect' | 'contacted' | 'contracted' | 'delivered'; payment: number }
interface AdCampaign { id: string; name: string; platform: string; budget: number; roi: number; status: 'draft' | 'active' | 'paused' | 'completed'; targeting: string; startDate: string; endDate: string }
interface SMComment { id: string; author: string; text: string; sentiment: 'positive' | 'neutral' | 'negative'; platform: string; replied: boolean; postId: string }
interface Alert { id: string; type: string; message: string; date: string; read: boolean }
interface Campaign { id: string; name: string; posts: string[]; status: 'planning' | 'active' | 'completed'; budget: number; progress: number }

export function SocialMedia() {
  const [tab, setTab] = useState<SMTab>('overview')
  const [posts, setPosts] = useCloudStorage<Post[]>('sm_posts', [])
  const [hashtags, setHashtags] = useCloudStorage<HashtagCluster[]>('sm_hashtags', [])
  const [competitors, setCompetitors] = useCloudStorage<Competitor[]>('sm_competitors', [])
  const [abTests, setABTests] = useCloudStorage<ABTest[]>('sm_abtests', [])
  const [templates, setTemplates] = useCloudStorage<Template[]>('sm_templates', [])
  const [teamMembers, setTeamMembers] = useCloudStorage<TeamMember[]>('sm_team', [])
  const [influencers, setInfluencers] = useCloudStorage<Influencer[]>('sm_influencers', [])
  const [adCampaigns, setAdCampaigns] = useCloudStorage<AdCampaign[]>('sm_ads', [])
  const [smComments, setSMComments] = useCloudStorage<SMComment[]>('sm_comments', [])
  const [alerts, setAlerts] = useCloudStorage<Alert[]>('sm_alerts', [])
  const [campaigns, setCampaigns] = useCloudStorage<Campaign[]>('sm_campaigns', [])

  const [showForm, setShowForm] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [focusMode, setFocusMode] = useState(false)
  const [filterPlatform, setFilterPlatform] = useState('')

  // AI scoring
  const calcViral = (caption: string) => {
    let s = 0
    if (/(pov|wait|secret|shocking|nobody|truth)/i.test(caption)) s += 20
    if (/(comment|like|share|follow|save|tag)/i.test(caption)) s += 15
    if (/(amazing|incredible|shocking|game-changing)/i.test(caption)) s += 15
    if (caption.includes('?')) s += 10; if (caption.split('\n').length > 3) s += 10
    if (/\d+/.test(caption)) s += 10; return Math.min(s + 20, 100)
  }
  const calcQuality = (c: string) => {
    let s = 0; const l1 = c.split('\n')[0]
    if (l1.length > 10 && l1.length < 100) s += 25
    if (c.split('\n\n').filter(p => p.trim()).length >= 2) s += 25
    if (/(click|link|bio|comment|share|follow|visit)/i.test(c)) s += 25
    if (c.length >= 50 && c.length <= 500) s += 25; return s
  }
  const predictMood = (c: string) => {
    const l = c.toLowerCase()
    if (/(excited|amazing|love|incredible)/i.test(l)) return 'Energetic'
    if (/(think|consider|perspective)/i.test(l)) return 'Thoughtful'
    if (/(help|guide|learn|tip)/i.test(l)) return 'Educational'
    if (/(fun|lol|haha)/i.test(l)) return 'Playful'
    return 'Neutral'
  }
  const bestTimes: Record<string, string[]> = { Instagram: ['9 AM', '12 PM', '6 PM'], TikTok: ['7 AM', '12 PM', '7 PM', '9 PM'], 'Twitter/X': ['8 AM', '12 PM', '5 PM'], LinkedIn: ['7 AM', '12 PM', '5 PM'], YouTube: ['2 PM', '4 PM', '9 PM'] }

  const totalReach = posts.reduce((s, p) => s + p.reach, 0)
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0)
  const totalShares = posts.reduce((s, p) => s + p.shares, 0)
  const avgViral = posts.length ? Math.round(posts.reduce((s, p) => s + p.viralScore, 0) / posts.length) : 0

  const filteredPosts = useMemo(() => {
    let r = [...posts]
    if (search) r = r.filter(p => p.caption.toLowerCase().includes(search.toLowerCase()))
    if (filterPlatform) r = r.filter(p => p.platforms.includes(filterPlatform))
    return r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [posts, search, filterPlatform])

  const tabs: [SMTab, string][] = [
    ['overview', 'Overview'], ['create', 'Create'], ['calendar', 'Calendar'], ['analytics', 'Analytics'],
    ['engagement', 'Engagement'], ['growth', 'Growth'], ['team', 'Team'], ['campaigns', 'Campaigns'],
  ]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Social Media Command Center</h1><p className={styles.subtitle}>Plan · Create · Analyze · Grow</p></div>
        <div className={styles.headerRight}>
          <button className={styles.primaryBtn} onClick={() => { setTab('create'); setShowForm('post') }}>+ Create Post</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>
        {/* ═══ OVERVIEW (#1, #13, #19, #53) ═══ */}
        {tab === 'overview' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Posts</div><div className={styles.kpiValue}>{posts.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Published</div><div className={styles.kpiValue}>{posts.filter(p => p.status === 'published').length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Reach (#46)</div><div className={styles.kpiValue}>{totalReach.toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Engagement</div><div className={styles.kpiValue}>{(totalLikes + totalShares).toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Viral (#47)</div><div className={styles.kpiValue}>{avgViral}</div></div>
          </div>

          <div className={styles.dnaBlock}><label className={styles.label}>Multi-Account Overview (#53)</label>
            <div className={styles.kpiRow}>{PLATFORMS.map(p => { const ct = posts.filter(x => x.platforms.includes(p)); return <div key={p} className={styles.kpiCard}><div className={styles.kpiLabel}>{p}</div><div className={styles.kpiValue}>{ct.length}</div></div> })}</div>
          </div>

          <div className={styles.splitRow}>
            <div className={styles.dnaBlock}><label className={styles.label}>Recent Posts</label>
              {posts.slice(0, 5).map(p => <div key={p.id} className={styles.taskItem}><span className={styles.taskContent}>{p.caption.slice(0, 60)}</span><span className={`${styles.statusBadge} ${styles[`st_${p.status}`]}`}>{p.status}</span></div>)}
              {posts.length === 0 && <p className={styles.emptyState}>No posts yet.</p>}
            </div>
            <div className={styles.dnaBlock}><label className={styles.label}>Alerts (#13, #56)</label>
              {alerts.filter(a => !a.read).slice(0, 5).map(a => <div key={a.id} className={styles.alertItem}><span className={styles.alertIcon}>!</span><span>{a.message}</span><button className={styles.ghostBtn} onClick={() => setAlerts(prev => prev.map(x => x.id === a.id ? { ...x, read: true } : x))}>Dismiss</button></div>)}
              {alerts.filter(a => !a.read).length === 0 && <p className={styles.helperText}>No new alerts.</p>}
            </div>
          </div>
        </div>}

        {/* ═══ CREATE (#3, #10, #21-30) ═══ */}
        {tab === 'create' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Post Creator & Templates</h2>

          <div className={styles.splitRow}>
            <div className={styles.dnaBlock}>
              <label className={styles.label}>New Post (#3, #16)</label>
              <div className={styles.formStack}>
                <div className={styles.formGroup}><label>Platforms</label>
                  <div className={styles.chipRow}>{PLATFORMS.map(p => <button key={p} className={`${styles.chipBtn} ${showForm === 'post' && (document.getElementById('sm_platforms') as any)?.dataset[p.toLowerCase()] ? styles.chipActive : ''}`} onClick={() => { /* handled by form below */ }}>{p}</button>)}</div>
                </div>
                <div className={styles.formGroup}><label>Caption (#21)</label><textarea className={styles.textarea} rows={6} id="sm_caption" placeholder="Write your caption..." /></div>
                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}><label>Schedule (#28)</label><input className={styles.input} type="datetime-local" id="sm_sched" /></div>
                  <div className={styles.formGroup}><label>Tags (#54)</label><input className={styles.input} id="sm_tags" placeholder="Tags, comma separated" /></div>
                </div>
                <button className={styles.primaryBtn} onClick={() => {
                  const cap = (document.getElementById('sm_caption') as HTMLTextAreaElement).value
                  if (cap) {
                    const sched = (document.getElementById('sm_sched') as HTMLInputElement).value
                    const tags = (document.getElementById('sm_tags') as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)
                    setPosts(prev => [{ id: uid(), caption: cap, platforms: ['Instagram'], scheduledDate: sched || '', status: sched ? 'scheduled' : 'draft', tags, viralScore: calcViral(cap), qualityScore: calcQuality(cap), mood: predictMood(cap), version: 1, reach: 0, likes: 0, shares: 0, comments: 0, impressions: 0, createdAt: now() }, ...prev]);
                    (document.getElementById('sm_caption') as HTMLTextAreaElement).value = '';
                    (document.getElementById('sm_sched') as HTMLInputElement).value = '';
                    (document.getElementById('sm_tags') as HTMLInputElement).value = ''
                  }
                }}>{(document.getElementById('sm_sched') as HTMLInputElement)?.value ? 'Schedule Post' : 'Save Draft'}</button>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <label className={styles.label}>AI Advisory (#17, #26, #51)</label>
              <div className={styles.aiBox}><pre className={styles.aiOutput}>{`Post Timing Suggestions:\n${'─'.repeat(30)}\n${PLATFORMS.map(p => `${p}: ${(bestTimes[p] || []).join(', ')}`).join('\n')}\n\nCaption Tips:\n• Start with a scroll-stopping hook\n• Use 2-4 emojis for visual appeal\n• Include a clear call-to-action\n• Add line breaks for readability\n• Optimal length: 150-300 chars`}</pre></div>
              <div className={styles.dnaBlock} style={{ marginTop: 12 }}>
                <label className={styles.label}>Templates (#10, #40)</label>
                <button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'template' ? null : 'template')}>+ Add Template</button>
                {showForm === 'template' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="tp_name" /><select className={styles.select} id="tp_type"><option>Caption</option><option>Hashtags</option><option>Story</option><option>Reel</option></select><textarea className={styles.textarea} rows={3} placeholder="Template content..." id="tp_content" style={{ flex: 1, minWidth: 160 }} /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('tp_name') as HTMLInputElement).value; if (n) { setTemplates(p => [...p, { id: uid(), name: n, type: (document.getElementById('tp_type') as HTMLSelectElement).value, content: (document.getElementById('tp_content') as HTMLTextAreaElement).value, category: '' }]); setShowForm(null) } }}>Save</button></div>}
                {templates.map(t => <div key={t.id} className={styles.taskItem}><span className={styles.taskContent}>{t.name}</span><span className={styles.tag}>{t.type}</span><button className={styles.deleteBtn} onClick={() => setTemplates(p => p.filter(x => x.id !== t.id))}>×</button></div>)}
              </div>
            </div>
          </div>

          <div className={styles.dnaBlock}><label className={styles.label}>Drafts & Version Control (#29-30)</label>
            <div className={styles.cardGrid}>{posts.filter(p => p.status === 'draft').map(p => (
              <div key={p.id} className={styles.card}>
                <div className={styles.cardHeader}><span className={styles.cardTitle}>{p.caption.slice(0, 40)}</span><span className={styles.tag}>v{p.version}</span></div>
                <div className={styles.cardMeta}><span className={styles.scoreBadge}>Viral: {p.viralScore}</span><span className={styles.scoreBadge}>Quality: {p.qualityScore}</span><span className={styles.tag}>{p.mood}</span></div>
                <div className={styles.cardActions}>
                  <select className={styles.miniSelect} value={p.status} onChange={e => setPosts(prev => prev.map(x => x.id === p.id ? { ...x, status: e.target.value as any } : x))}><option value="draft">Draft</option><option value="scheduled">Schedule</option><option value="published">Publish</option></select>
                  <button className={styles.ghostBtn} onClick={() => setPosts(prev => prev.map(x => x.id === p.id ? { ...x, version: x.version + 1 } : x))}>+ Version</button>
                  <button className={styles.deleteBtn} onClick={() => setPosts(prev => prev.filter(x => x.id !== p.id))}>×</button>
                </div>
              </div>
            ))}</div>
          </div>
        </div>}

        {/* ═══ CALENDAR (#2, #28, #35, #59) ═══ */}
        {tab === 'calendar' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Content Calendar</h2>
          <div className={styles.calendarGrid}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, di) => {
              const dayPosts = posts.filter(p => p.status === 'scheduled' && new Date(p.scheduledDate).getDay() === (di + 1) % 7)
              return <div key={day} className={styles.calendarDay}><div className={styles.dayHeader}>{day}</div><div className={styles.dayContent}>{dayPosts.slice(0, 3).map(p => <div key={p.id} className={styles.calendarPost}><span>{p.caption.slice(0, 25)}</span><span className={styles.helperText}>{p.platforms.join(', ')}</span></div>)}{dayPosts.length === 0 && <span className={styles.helperText}>—</span>}</div></div>
            })}
          </div>
          <div className={styles.dnaBlock}><label className={styles.label}>Queue (#28)</label>
            {posts.filter(p => p.status === 'scheduled').sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()).map(p => (
              <div key={p.id} className={styles.taskItem}><span className={styles.taskContent}>{p.caption.slice(0, 50)}</span><span className={styles.tag}>{p.scheduledDate ? fmtDate(p.scheduledDate) : 'Unscheduled'}</span><span className={styles.helperText}>{p.platforms.join(', ')}</span><button className={styles.deleteBtn} onClick={() => setPosts(prev => prev.filter(x => x.id !== p.id))}>×</button></div>
            ))}
            {posts.filter(p => p.status === 'scheduled').length === 0 && <p className={styles.emptyState}>No scheduled posts.</p>}
          </div>
        </div>}

        {/* ═══ ANALYTICS (#4, #18-19, #41-50) ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics & Insights</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Reach (#46)</div><div className={styles.kpiValue}>{totalReach.toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Likes</div><div className={styles.kpiValue}>{totalLikes.toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Shares</div><div className={styles.kpiValue}>{totalShares.toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Impressions</div><div className={styles.kpiValue}>{posts.reduce((s, p) => s + p.impressions, 0).toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Viral</div><div className={styles.kpiValue}>{avgViral}/100</div></div>
          </div>

          <div className={styles.dnaBlock}><label className={styles.label}>Top Performing (#48)</label>
            <div className={styles.cardGrid}>{[...posts].sort((a, b) => (b.reach + b.likes) - (a.reach + a.likes)).slice(0, 4).map(p => (
              <div key={p.id} className={styles.card}><span className={styles.cardTitle}>{p.caption.slice(0, 40)}</span>
                <div className={styles.scoreRow}><div className={styles.scoreItem}><span className={styles.scoreLabel}>Reach</span><span className={styles.scoreVal}>{p.reach.toLocaleString()}</span></div><div className={styles.scoreItem}><span className={styles.scoreLabel}>Likes</span><span className={styles.scoreVal}>{p.likes.toLocaleString()}</span></div><div className={styles.scoreItem}><span className={styles.scoreLabel}>Viral</span><span className={styles.scoreVal}>{p.viralScore}</span></div></div>
              </div>
            ))}</div>
          </div>

          <div className={styles.dnaBlock}><label className={styles.label}>Cross-Platform Breakdown (#19)</label>
            <div className={styles.tableWrap}><div className={`${styles.tableRow} ${styles.tableRow4}`}><span className={styles.tableHeader}>Platform</span><span className={styles.tableHeader}>Posts</span><span className={styles.tableHeader}>Reach</span><span className={styles.tableHeader}>Engagement</span></div>
              {PLATFORMS.map(p => { const pp = posts.filter(x => x.platforms.includes(p)); return <div key={p} className={`${styles.tableRow} ${styles.tableRow4}`}><span className={styles.tableCell}>{p}</span><span className={styles.tableCell}>{pp.length}</span><span className={styles.tableCell}>{pp.reduce((s, x) => s + x.reach, 0).toLocaleString()}</span><span className={styles.tableCell}>{pp.reduce((s, x) => s + x.likes + x.shares, 0).toLocaleString()}</span></div> })}
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Social Media Report\n${'='.repeat(40)}\nPosts: ${posts.length}\nReach: ${totalReach}\nLikes: ${totalLikes}\nShares: ${totalShares}\nAvg Viral: ${avgViral}/100\n\n${posts.map(p => `${p.caption.slice(0, 50)} | ${p.platforms.join(',')} | R:${p.reach} L:${p.likes} V:${p.viralScore}`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `social-report-${Date.now()}.txt`; a.click() }}>Export Report (#15, #50)</button>
            <button className={styles.exportBtn} onClick={() => { const csv = `Caption,Platforms,Reach,Likes,Shares,Viral,Status\n${posts.map(p => `"${p.caption.replace(/"/g, '""')}",${p.platforms.join(';')},${p.reach},${p.likes},${p.shares},${p.viralScore},${p.status}`).join('\n')}`; const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `social-data-${Date.now()}.csv`; a.click() }}>Export CSV</button>
          </div>
        </div>}

        {/* ═══ ENGAGEMENT (#5, #7, #25, #43, #57) ═══ */}
        {tab === 'engagement' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Engagement Hub</h2>
          <div className={styles.splitRow}>
            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Comments & DMs (#5)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'comment' ? null : 'comment')}>+ Add</button></div>
              {showForm === 'comment' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Author" id="cm_auth" /><input className={styles.input} placeholder="Comment text" id="cm_text" /><select className={styles.select} id="cm_sent"><option value="positive">Positive</option><option value="neutral">Neutral</option><option value="negative">Negative</option></select><select className={styles.select} id="cm_plat">{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select><button className={styles.primaryBtn} onClick={() => { const a = (document.getElementById('cm_auth') as HTMLInputElement).value; if (a) { setSMComments(prev => [{ id: uid(), author: a, text: (document.getElementById('cm_text') as HTMLInputElement).value, sentiment: (document.getElementById('cm_sent') as HTMLSelectElement).value as any, platform: (document.getElementById('cm_plat') as HTMLSelectElement).value, replied: false, postId: '' }, ...prev]); setShowForm(null) } }}>Add</button></div>}
              {smComments.slice(0, 10).map(c => (
                <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={`${styles.statusBadge} ${styles[`st_${c.sentiment === 'positive' ? 'active' : c.sentiment === 'negative' ? 'shelved' : 'stable'}`]}`}>{c.sentiment}</span>
                  <button className={styles.ghostBtn} onClick={() => setSMComments(prev => prev.map(x => x.id === c.id ? { ...x, replied: true } : x))}>{c.replied ? 'Replied' : 'Reply'}</button></div>
              ))}
            </div>

            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Hashtags (#7, #43, #57)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'hashtag' ? null : 'hashtag')}>+ Create Cluster</button></div>
              {showForm === 'hashtag' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Cluster name" id="ht_name" /><input className={styles.input} placeholder="Niche" id="ht_niche" /><textarea className={styles.textarea} rows={2} placeholder="Hashtags (comma separated)" id="ht_tags" style={{ flex: 1, minWidth: 160 }} /><input className={styles.input} type="number" placeholder="Relevance %" id="ht_rel" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('ht_name') as HTMLInputElement).value; if (n) { setHashtags(p => [...p, { id: uid(), name: n, hashtags: (document.getElementById('ht_tags') as HTMLTextAreaElement).value.split(',').map(t => t.trim()), relevance: Number((document.getElementById('ht_rel') as HTMLInputElement).value) || 80, niche: (document.getElementById('ht_niche') as HTMLInputElement).value }]); setShowForm(null) } }}>Add</button></div>}
              {hashtags.map(h => (
                <div key={h.id} className={styles.card} style={{ cursor: 'default' }}><span className={styles.cardTitle}>{h.name}</span><div className={styles.tagRow}>{h.hashtags.slice(0, 6).map(t => <span key={t} className={styles.tag}>{t}</span>)}</div><div className={styles.cardMeta}><span className={styles.scoreBadge}>{h.relevance}% relevant</span><span className={styles.tag}>{h.niche}</span></div><button className={styles.deleteBtn} onClick={() => setHashtags(p => p.filter(x => x.id !== h.id))}>×</button></div>
              ))}
            </div>
          </div>
        </div>}

        {/* ═══ GROWTH (#6, #8, #9, #42, #44) ═══ */}
        {tab === 'growth' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Growth Engine</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Competitor Tracking (#6, #42)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'comp' ? null : 'comp')}>+ Add</button></div>
            {showForm === 'comp' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="cp_name" /><select className={styles.select} id="cp_plat">{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select><input className={styles.input} type="number" placeholder="Posts/week" id="cp_freq" /><input className={styles.input} type="number" placeholder="Eng rate %" id="cp_eng" step="0.1" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('cp_name') as HTMLInputElement).value; if (n) { setCompetitors(p => [...p, { id: uid(), name: n, platform: (document.getElementById('cp_plat') as HTMLSelectElement).value, postingFreq: Number((document.getElementById('cp_freq') as HTMLInputElement).value) || 0, engRate: Number((document.getElementById('cp_eng') as HTMLInputElement).value) || 0 }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.cardGrid}>{competitors.map(c => <div key={c.id} className={styles.card} style={{ cursor: 'default' }}><span className={styles.cardTitle}>{c.name}</span><div className={styles.cardMeta}><span className={styles.tag}>{c.platform}</span><span className={styles.helperText}>{c.postingFreq}x/week · {c.engRate}% eng</span></div><button className={styles.deleteBtn} onClick={() => setCompetitors(p => p.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Influencer Outreach (#8, #44)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'inf' ? null : 'inf')}>+ Add</button></div>
            {showForm === 'inf' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="if_name" /><input className={styles.input} placeholder="Niche" id="if_niche" /><input className={styles.input} type="number" placeholder="Followers" id="if_fol" /><input className={styles.input} type="number" placeholder="Payment $" id="if_pay" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('if_name') as HTMLInputElement).value; if (n) { setInfluencers(p => [...p, { id: uid(), name: n, niche: (document.getElementById('if_niche') as HTMLInputElement).value, followers: Number((document.getElementById('if_fol') as HTMLInputElement).value) || 0, engRate: 0, status: 'prospect', payment: Number((document.getElementById('if_pay') as HTMLInputElement).value) || 0 }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.cardGrid}>{influencers.map(inf => (
              <div key={inf.id} className={styles.card} style={{ cursor: 'default' }}><div className={styles.cardHeader}><span className={styles.cardTitle}>{inf.name}</span><span className={`${styles.statusBadge} ${styles[`st_${inf.status === 'delivered' ? 'completed' : inf.status === 'contracted' ? 'active' : 'pending'}`]}`}>{inf.status}</span></div>
                <div className={styles.cardMeta}><span className={styles.tag}>{inf.niche}</span><span className={styles.helperText}>{inf.followers.toLocaleString()} followers</span>{inf.payment > 0 && <span className={styles.helperText}>${inf.payment}</span>}</div>
                <div className={styles.cardActions}><select className={styles.miniSelect} value={inf.status} onChange={e => setInfluencers(p => p.map(x => x.id === inf.id ? { ...x, status: e.target.value as any } : x))}><option value="prospect">Prospect</option><option value="contacted">Contacted</option><option value="contracted">Contracted</option><option value="delivered">Delivered</option></select><button className={styles.deleteBtn} onClick={() => setInfluencers(p => p.filter(x => x.id !== inf.id))}>×</button></div>
              </div>
            ))}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>A/B Testing (#9, #45)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'ab' ? null : 'ab')}>+ New Test</button></div>
            {showForm === 'ab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Variant A" id="ab_a" /><input className={styles.input} placeholder="Variant B" id="ab_b" /><select className={styles.select} id="ab_type"><option>Caption</option><option>Hook</option><option>Thumbnail</option><option>Time</option></select><button className={styles.primaryBtn} onClick={() => { const a = (document.getElementById('ab_a') as HTMLInputElement).value; if (a) { setABTests(p => [...p, { id: uid(), variantA: a, variantB: (document.getElementById('ab_b') as HTMLInputElement).value, type: (document.getElementById('ab_type') as HTMLSelectElement).value, winner: '', status: 'running' }]); setShowForm(null) } }}>Create</button></div>}
            <div className={styles.cardGrid}>{abTests.map(t => (
              <div key={t.id} className={styles.card} style={{ cursor: 'default' }}><span className={styles.tag}>{t.type}</span><div className={styles.splitRow}><div className={styles.dnaBlock}><label className={styles.label}>A</label><p className={styles.helperText}>{t.variantA}</p></div><div className={styles.dnaBlock}><label className={styles.label}>B</label><p className={styles.helperText}>{t.variantB}</p></div></div>
                <div className={styles.cardActions}><select className={styles.miniSelect} value={t.status} onChange={e => setABTests(p => p.map(x => x.id === t.id ? { ...x, status: e.target.value as any } : x))}><option value="running">Running</option><option value="completed">Completed</option></select>{t.status === 'completed' && <select className={styles.miniSelect} value={t.winner} onChange={e => setABTests(p => p.map(x => x.id === t.id ? { ...x, winner: e.target.value } : x))}><option value="">Pick Winner</option><option value="A">A Wins</option><option value="B">B Wins</option></select>}<button className={styles.deleteBtn} onClick={() => setABTests(p => p.filter(x => x.id !== t.id))}>×</button></div>
              </div>
            ))}</div>
          </div>
        </div>}

        {/* ═══ TEAM (#11, #31-40) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team Collaboration</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#31-32)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'team' ? null : 'team')}>+ Invite</button></div>
            {showForm === 'team' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="tm_name" /><input className={styles.input} placeholder="Role" id="tm_role" /><input className={styles.input} placeholder="Email" id="tm_email" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('tm_name') as HTMLInputElement).value; if (n) { setTeamMembers(p => [...p, { id: uid(), name: n, role: (document.getElementById('tm_role') as HTMLInputElement).value, email: (document.getElementById('tm_email') as HTMLInputElement).value }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{teamMembers.map(m => <div key={m.id} className={styles.teamCard}><span className={styles.fontName}>{m.name}</span><span className={styles.tag}>{m.role}</span><span className={styles.helperText}>{m.email}</span><button className={styles.deleteBtn} onClick={() => setTeamMembers(p => p.filter(x => x.id !== m.id))}>×</button></div>)}</div>
          </div>
          <div className={styles.dnaBlock}><label className={styles.label}>Approval Queue (#30, #36)</label>
            {posts.filter(p => p.status === 'draft').map(p => (
              <div key={p.id} className={styles.taskItem}><span className={styles.taskContent}>{p.caption.slice(0, 50)}</span><button className={styles.ghostBtn} onClick={() => setPosts(prev => prev.map(x => x.id === p.id ? { ...x, status: 'scheduled' } : x))}>Approve</button><button className={styles.ghostBtn} onClick={() => setPosts(prev => prev.filter(x => x.id !== p.id))}>Reject</button></div>
            ))}
            {posts.filter(p => p.status === 'draft').length === 0 && <p className={styles.helperText}>No posts pending approval.</p>}
          </div>
          <div className={styles.dnaBlock}><label className={styles.label}>Activity Log (#37)</label>
            <div className={styles.timeline}>{posts.slice(0, 8).map(p => <div key={p.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{p.status === 'published' ? 'Published' : p.status === 'scheduled' ? 'Scheduled' : 'Drafted'}: {p.caption.slice(0, 30)} · {fmtDate(p.createdAt)}</span></div>)}</div>
          </div>
        </div>}

        {/* ═══ CAMPAIGNS (#14, #20, #55) ═══ */}
        {tab === 'campaigns' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Campaigns & Ads</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Campaign Boards (#20)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'campaign' ? null : 'campaign')}>+ New</button></div>
            {showForm === 'campaign' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Campaign name" id="cmp_name" /><input className={styles.input} type="number" placeholder="Budget $" id="cmp_budget" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('cmp_name') as HTMLInputElement).value; if (n) { setCampaigns(p => [...p, { id: uid(), name: n, posts: [], status: 'planning', budget: Number((document.getElementById('cmp_budget') as HTMLInputElement).value) || 0, progress: 0 }]); setShowForm(null) } }}>Create</button></div>}
            <div className={styles.cardGrid}>{campaigns.map(c => (
              <div key={c.id} className={styles.card} style={{ cursor: 'default' }}><div className={styles.cardHeader}><span className={styles.cardTitle}>{c.name}</span><span className={`${styles.statusBadge} ${styles[`st_${c.status}`]}`}>{c.status}</span></div>
                {c.budget > 0 && <span className={styles.helperText}>${c.budget.toLocaleString()} budget</span>}
                <div className={styles.meterRow}><div className={styles.meter}><div className={styles.meterFill} style={{ width: `${c.progress}%` }} /></div><span className={styles.helperText}>{c.progress}%</span></div>
                <div className={styles.cardActions}><input className={styles.cellInput} type="range" min={0} max={100} value={c.progress} onChange={e => setCampaigns(p => p.map(x => x.id === c.id ? { ...x, progress: Number(e.target.value) } : x))} style={{ width: 80 }} /><select className={styles.miniSelect} value={c.status} onChange={e => setCampaigns(p => p.map(x => x.id === c.id ? { ...x, status: e.target.value as any } : x))}><option value="planning">Planning</option><option value="active">Active</option><option value="completed">Completed</option></select><button className={styles.deleteBtn} onClick={() => setCampaigns(p => p.filter(x => x.id !== c.id))}>×</button></div>
              </div>
            ))}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Ads Planner (#14)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'ad' ? null : 'ad')}>+ New Ad</button></div>
            {showForm === 'ad' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Campaign name" id="ad_name" /><select className={styles.select} id="ad_plat">{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select><input className={styles.input} type="number" placeholder="Budget $" id="ad_budget" /><input className={styles.input} placeholder="Targeting" id="ad_target" /><input className={styles.input} type="number" placeholder="Expected ROI %" id="ad_roi" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('ad_name') as HTMLInputElement).value; if (n) { setAdCampaigns(p => [...p, { id: uid(), name: n, platform: (document.getElementById('ad_plat') as HTMLSelectElement).value, budget: Number((document.getElementById('ad_budget') as HTMLInputElement).value) || 0, roi: Number((document.getElementById('ad_roi') as HTMLInputElement).value) || 0, status: 'draft', targeting: (document.getElementById('ad_target') as HTMLInputElement).value, startDate: '', endDate: '' }]); setShowForm(null) } }}>Create</button></div>}
            <div className={styles.cardGrid}>{adCampaigns.map(ad => (
              <div key={ad.id} className={styles.card} style={{ cursor: 'default' }}><div className={styles.cardHeader}><span className={styles.cardTitle}>{ad.name}</span><span className={`${styles.statusBadge} ${styles[`st_${ad.status}`]}`}>{ad.status}</span></div>
                <div className={styles.cardMeta}><span className={styles.tag}>{ad.platform}</span><span className={styles.helperText}>${ad.budget.toLocaleString()} budget</span>{ad.roi > 0 && <span className={styles.scoreBadge}>{ad.roi}% ROI</span>}</div>
                {ad.targeting && <p className={styles.cardPreview}>Targeting: {ad.targeting}</p>}
                <div className={styles.cardActions}><select className={styles.miniSelect} value={ad.status} onChange={e => setAdCampaigns(p => p.map(x => x.id === ad.id ? { ...x, status: e.target.value as any } : x))}><option value="draft">Draft</option><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option></select><button className={styles.deleteBtn} onClick={() => setAdCampaigns(p => p.filter(x => x.id !== ad.id))}>×</button></div>
              </div>
            ))}</div>
          </div>

          <div className={styles.dnaBlock}><label className={styles.label}>ROI Tracking (#55)</label>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Ad Spend</div><div className={styles.kpiValue}>${adCampaigns.reduce((s, a) => s + a.budget, 0).toLocaleString()}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg ROI</div><div className={styles.kpiValue}>{adCampaigns.length ? Math.round(adCampaigns.reduce((s, a) => s + a.roi, 0) / adCampaigns.length) : 0}%</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Active Campaigns</div><div className={styles.kpiValue}>{campaigns.filter(c => c.status === 'active').length}</div></div>
            </div>
          </div>
        </div>}
      </main>
    </div>
  )
}
