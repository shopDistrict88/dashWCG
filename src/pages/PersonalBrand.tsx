import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './PersonalBrand.module.css'

type PBTab = 'profile' | 'content' | 'analytics' | 'team' | 'advanced'

const SOCIAL_PLATFORMS = ['LinkedIn', 'Twitter/X', 'Instagram', 'TikTok', 'YouTube']
const INDUSTRIES = ['Technology', 'Design', 'Marketing', 'Finance', 'Creative', 'Education', 'Fashion', 'Health']
const PERSONAS = ['Thought Leader', 'Creator', 'Entrepreneur', 'Influencer', 'Consultant', 'Artist', 'Executive']
const CONTENT_CATS = ['Blog', 'Video', 'Photo', 'Audio', 'Design', 'Case Study', 'Project']

interface BrandProfile {
  displayName: string; tagline: string; bio: string; extendedBio: string
  website: string; publicUrl: string; isPublic: boolean; industry: string
  persona: string; photoUrl: string; coverUrl: string
  brandColor: string; brandFont: string
}
interface SocialAccount { id: string; platform: string; username: string; followers: number; verified: boolean; connected: boolean; lastSync: string }
interface PortfolioItem { id: string; title: string; type: string; description: string; tags: string[]; url: string; featured: boolean; pinned: boolean; views: number; likes: number; shares: number; createdAt: string }
interface ExternalLink { id: string; label: string; url: string; clicks: number; createdAt: string }
interface Collaboration { id: string; name: string; type: string; status: 'active' | 'completed' | 'pending'; notes: string; createdAt: string }
interface BrandMilestone { id: string; title: string; date: string; description: string; isBadge: boolean }
interface Collaborator { id: string; name: string; role: 'owner' | 'editor' | 'viewer'; email: string }
interface PBComment { id: string; author: string; text: string; date: string }
interface ChangeLog { id: string; field: string; oldValue: string; newValue: string; date: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

export function PersonalBrand() {
  const { addToast } = useApp()
  const [tab, setTab] = useState<PBTab>('profile')
  const [showForm, setShowForm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [focusMode, setFocusMode] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [profile, setProfile] = useCloudStorage<BrandProfile>('pb_profile', {
    displayName: 'Your Name', tagline: 'Design × Strategy × Growth', bio: 'Creative entrepreneur building the future',
    extendedBio: '', website: 'www.yoursite.com', publicUrl: '', isPublic: true, industry: 'Creative', persona: 'Creator',
    photoUrl: '', coverUrl: '', brandColor: '#ffffff', brandFont: 'Inter',
  })
  const [accounts, setAccounts] = useCloudStorage<SocialAccount[]>('pb_accounts', [])
  const [portfolio, setPortfolio] = useCloudStorage<PortfolioItem[]>('pb_portfolio', [])
  const [links, setLinks] = useCloudStorage<ExternalLink[]>('pb_links', [])
  const [collaborations, setCollaborations] = useCloudStorage<Collaboration[]>('pb_collabs', [])
  const [milestones, setMilestones] = useCloudStorage<BrandMilestone[]>('pb_milestones', [])
  const [collaborators, setCollaborators] = useCloudStorage<Collaborator[]>('pb_team', [])
  const [comments, setComments] = useCloudStorage<PBComment[]>('pb_comments', [])
  const [changeLogs, setChangeLogs] = useCloudStorage<ChangeLog[]>('pb_changelog', [])

  const updateProfile = (field: keyof BrandProfile, value: string | boolean) => {
    const old = String(profile[field])
    setProfile(prev => ({ ...prev, [field]: value }))
    setChangeLogs(prev => [{ id: uid(), field, oldValue: old, newValue: String(value), date: now() }, ...prev])
  }

  const totalFollowers = accounts.reduce((s, a) => s + a.followers, 0)
  const connectedCount = accounts.filter(a => a.connected).length

  const brandScore = useMemo(() => {
    let s = 20
    if (profile.bio.length > 50) s += 8
    if (profile.extendedBio.length > 50) s += 5
    if (profile.tagline.length > 10) s += 5
    if (profile.website) s += 5
    if (profile.photoUrl) s += 7
    if (profile.coverUrl) s += 3
    if (connectedCount > 0) s += 8
    if (connectedCount >= 3) s += 5
    if (portfolio.length > 0) s += 8
    if (portfolio.filter(p => p.featured).length > 0) s += 5
    if (totalFollowers > 100) s += 5
    if (totalFollowers > 1000) s += 5
    if (milestones.length > 0) s += 5
    if (links.length > 0) s += 3
    if (profile.isPublic) s += 3
    return Math.min(100, s)
  }, [profile, connectedCount, portfolio, totalFollowers, milestones, links])

  const filteredPortfolio = useMemo(() => {
    let r = [...portfolio]
    if (searchQuery) r = r.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    if (filterType) r = r.filter(p => p.type === filterType)
    r.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return r
  }, [portfolio, searchQuery, filterType])

  const tabs: [PBTab, string][] = [['profile', 'Profile'], ['content', 'Content'], ['analytics', 'Analytics'], ['team', 'Team'], ['advanced', 'Advanced']]

  return (
    <div className={`${styles.container} ${focusMode ? styles.focusMode : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.title}>Personal Brand</h1><p className={styles.subtitle}>Profile · Content · Analytics · Growth</p></div>
        <div className={styles.headerRight}>
          <button className={styles.secondaryBtn} onClick={() => setPreviewMode(!previewMode)}>{previewMode ? 'Edit' : 'Preview'}</button>
          <button className={styles.secondaryBtn} onClick={() => setFocusMode(!focusMode)}>{focusMode ? 'Exit Focus' : 'Focus'}</button>
        </div>
      </header>

      <nav className={styles.tabNav}>{tabs.map(([key, label]) => <button key={key} className={`${styles.tabBtn} ${tab === key ? styles.tabActive : ''}`} onClick={() => setTab(key)}>{label}</button>)}</nav>

      <main className={styles.mainContent}>

        {/* ═══ PROFILE (#1-10) ═══ */}
        {tab === 'profile' && <div className={styles.section}>
          {previewMode ? (
            <div className={styles.previewCard}>
              {profile.coverUrl && <div className={styles.coverImage} style={{ backgroundImage: `url(${profile.coverUrl})` }} />}
              <div className={styles.profilePreview}>
                <div className={styles.avatarCircle}>{profile.photoUrl ? <img src={profile.photoUrl} alt="" className={styles.avatarImg} /> : <span className={styles.avatarPlaceholder}>👤</span>}</div>
                <h2 className={styles.previewName}>{profile.displayName}</h2>
                <p className={styles.previewTagline}>{profile.tagline}</p>
                <p className={styles.previewBio}>{profile.bio}</p>
                {profile.extendedBio && <p className={styles.previewBio}>{profile.extendedBio}</p>}
                <div className={styles.previewMeta}>
                  <span className={styles.tag}>{profile.industry}</span>
                  <span className={styles.tag}>{profile.persona}</span>
                  {profile.website && <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className={styles.previewLink}>{profile.website}</a>}
                </div>
                <div className={styles.previewStats}>
                  <div><strong>{totalFollowers.toLocaleString()}</strong><span>Followers</span></div>
                  <div><strong>{portfolio.length}</strong><span>Portfolio</span></div>
                  <div><strong>{connectedCount}</strong><span>Platforms</span></div>
                </div>
                {portfolio.filter(p => p.featured).length > 0 && <div className={styles.featuredRow}><label className={styles.label}>Featured Projects (#9)</label><div className={styles.portfolioGrid}>{portfolio.filter(p => p.featured).slice(0, 3).map(p => <div key={p.id} className={styles.portfolioCard}><span className={styles.cardTitle}>{p.title}</span><span className={styles.tag}>{p.type}</span></div>)}</div></div>}
              </div>
            </div>
          ) : (<>
            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Brand Score</div><div className={styles.kpiValue}>{brandScore}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Followers</div><div className={styles.kpiValue}>{totalFollowers.toLocaleString()}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Portfolio</div><div className={styles.kpiValue}>{portfolio.length}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Platforms</div><div className={styles.kpiValue}>{connectedCount}</div></div>
              <div className={styles.kpiCard}><div className={styles.kpiLabel}>Links</div><div className={styles.kpiValue}>{links.length}</div></div>
            </div>

            <div className={styles.splitRow}>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Identity (#1-3, #6-7)</label>
                <div className={styles.formStack}>
                  <div className={styles.formGroup}><label>Profile Photo URL (#2)</label><input className={styles.input} value={profile.photoUrl} onChange={e => updateProfile('photoUrl', e.target.value)} placeholder="https://..." /></div>
                  <div className={styles.formGroup}><label>Cover Image URL (#2)</label><input className={styles.input} value={profile.coverUrl} onChange={e => updateProfile('coverUrl', e.target.value)} placeholder="https://..." /></div>
                  <div className={styles.formGroup}><label>Display Name (#1)</label><input className={styles.input} value={profile.displayName} onChange={e => updateProfile('displayName', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Tagline (#6) <span className={styles.charCount}>{profile.tagline.length}/50</span></label><input className={styles.input} maxLength={50} value={profile.tagline} onChange={e => updateProfile('tagline', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Short Bio (#6) <span className={styles.charCount}>{profile.bio.length}/200</span></label><textarea className={styles.textarea} maxLength={200} rows={2} value={profile.bio} onChange={e => updateProfile('bio', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Extended Bio (#7)</label><textarea className={styles.textarea} rows={3} value={profile.extendedBio} onChange={e => updateProfile('extendedBio', e.target.value)} placeholder="Tell your full story..." /></div>
                </div>
              </div>
              <div className={styles.dnaBlock}>
                <label className={styles.label}>Settings (#3-5)</label>
                <div className={styles.formStack}>
                  <div className={styles.formGroup}><label>Website</label><input className={styles.input} value={profile.website} onChange={e => updateProfile('website', e.target.value)} /></div>
                  <div className={styles.formGroup}><label>Public URL (#3)</label><input className={styles.input} value={profile.publicUrl} onChange={e => updateProfile('publicUrl', e.target.value)} placeholder="yourname" /></div>
                  <div className={styles.formGroup}><label>Industry</label><select className={styles.select} value={profile.industry} onChange={e => updateProfile('industry', e.target.value)}>{INDUSTRIES.map(i => <option key={i}>{i}</option>)}</select></div>
                  <div className={styles.formGroup}><label>Brand Persona</label><select className={styles.select} value={profile.persona} onChange={e => updateProfile('persona', e.target.value)}>{PERSONAS.map(p => <option key={p}>{p}</option>)}</select></div>
                  <div className={styles.formGroup}><label>Visibility (#4)</label><button className={`${styles.toggleBtn} ${profile.isPublic ? styles.toggleOn : ''}`} onClick={() => updateProfile('isPublic', !profile.isPublic)}>{profile.isPublic ? 'Public' : 'Private'}</button></div>
                </div>
              </div>
            </div>

            <div className={styles.dnaBlock}>
              <div className={styles.blockHeader}><label className={styles.label}>Social Accounts (#5)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'account' ? null : 'account')}>+ Connect</button></div>
              {showForm === 'account' && <div className={styles.inlineForm}><select className={styles.select} id="sa_plat">{SOCIAL_PLATFORMS.map(p => <option key={p}>{p}</option>)}</select><input className={styles.input} placeholder="Username" id="sa_user" /><input className={styles.input} type="number" placeholder="Followers" id="sa_fol" /><button className={styles.primaryBtn} onClick={() => { const u = (document.getElementById('sa_user') as HTMLInputElement).value; if (u) { setAccounts(prev => [...prev, { id: uid(), platform: (document.getElementById('sa_plat') as HTMLSelectElement).value, username: u, followers: Number((document.getElementById('sa_fol') as HTMLInputElement).value) || 0, verified: false, connected: true, lastSync: now() }]); setShowForm(null); addToast('Account connected', 'success') } }}>Connect</button></div>}
              <div className={styles.accountGrid}>{accounts.map(a => <div key={a.id} className={styles.accountCard}>
                <div className={styles.cardHeader}><span className={styles.cardTitle}>{a.platform}</span><span className={`${styles.connectionDot} ${a.connected ? styles.connected : styles.disconnected}`} /></div>
                <span className={styles.username}>@{a.username}</span>
                <span className={styles.followerCount}>{a.followers.toLocaleString()} followers</span>
                {a.verified && <span className={styles.verifiedBadge}>Verified</span>}
                <div className={styles.cardActions}>
                  <button className={styles.ghostBtn} onClick={() => setAccounts(prev => prev.map(x => x.id === a.id ? { ...x, connected: !x.connected } : x))}>{a.connected ? 'Disconnect' : 'Reconnect'}</button>
                  <button className={styles.ghostBtn} onClick={() => setAccounts(prev => prev.map(x => x.id === a.id ? { ...x, verified: !x.verified } : x))}>{a.verified ? 'Unverify' : 'Verify'}</button>
                  <button className={styles.deleteBtn} onClick={() => setAccounts(prev => prev.filter(x => x.id !== a.id))}>×</button>
                </div>
              </div>)}</div>
            </div>
          </>)}
        </div>}

        {/* ═══ CONTENT (#11-20) ═══ */}
        {tab === 'content' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Content & Portfolio</h2>

          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search portfolio..." />
            <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types (#46)</option>{CONTENT_CATS.map(c => <option key={c}>{c}</option>)}</select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'portfolio' ? null : 'portfolio')}>+ Add Item (#8)</button>
          </div>

          {showForm === 'portfolio' && <div className={styles.formPanel}><div className={styles.formStack}>
            <div className={styles.fieldRow}><div className={styles.formGroup}><label>Title</label><input className={styles.input} id="pi_title" /></div><div className={styles.formGroup}><label>Type</label><select className={styles.select} id="pi_type">{CONTENT_CATS.map(c => <option key={c}>{c}</option>)}</select></div></div>
            <div className={styles.fieldRow}><div className={styles.formGroup}><label>URL</label><input className={styles.input} placeholder="Link to content" id="pi_url" /></div><div className={styles.formGroup}><label>Tags (comma-separated)</label><input className={styles.input} placeholder="design, branding" id="pi_tags" /></div></div>
            <div className={styles.formGroup}><label>Description</label><textarea className={styles.textarea} rows={2} placeholder="What is this about?" id="pi_desc" /></div>
            <div className={styles.fieldRow}><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('pi_title') as HTMLInputElement).value; if (t) { setPortfolio(prev => [...prev, { id: uid(), title: t, type: (document.getElementById('pi_type') as HTMLSelectElement).value, description: (document.getElementById('pi_desc') as HTMLTextAreaElement).value, tags: (document.getElementById('pi_tags') as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean), url: (document.getElementById('pi_url') as HTMLInputElement).value, featured: false, pinned: false, views: 0, likes: 0, shares: 0, createdAt: now() }]); setShowForm(null); addToast('Item added', 'success') } }}>Add</button><button className={styles.secondaryBtn} onClick={() => setShowForm(null)}>Cancel</button></div>
          </div></div>}

          {portfolio.filter(p => p.pinned).length > 0 && <div className={styles.dnaBlock}><label className={styles.label}>Pinned Highlights (#14)</label><div className={styles.portfolioGrid}>{portfolio.filter(p => p.pinned).map(p => <div key={p.id} className={styles.portfolioCard}><span className={styles.featuredBadge}>Pinned</span><span className={styles.cardTitle}>{p.title}</span><span className={styles.tag}>{p.type}</span></div>)}</div></div>}

          <div className={styles.portfolioGrid}>{filteredPortfolio.map(p => <div key={p.id} className={styles.portfolioCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>{p.title}</span><span className={styles.tag}>{p.type}</span></div>
            {p.tags.length > 0 && <div className={styles.cardMeta}>{p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}</div>}
            {p.description && <p className={styles.cardPreview}>{p.description.slice(0, 80)}</p>}
            <div className={styles.engagementRow}><span>{p.views} views (#19)</span><span>{p.likes} likes</span><span>{p.shares} shares</span></div>
            <div className={styles.cardActions}>
              <button className={`${styles.ghostBtn} ${p.featured ? styles.featuredActive : ''}`} onClick={() => setPortfolio(prev => prev.map(x => x.id === p.id ? { ...x, featured: !x.featured } : x))}>{p.featured ? '★' : '☆'}</button>
              <button className={styles.ghostBtn} onClick={() => setPortfolio(prev => prev.map(x => x.id === p.id ? { ...x, pinned: !x.pinned } : x))}>{p.pinned ? 'Unpin' : 'Pin (#14)'}</button>
              <button className={styles.deleteBtn} onClick={() => setPortfolio(prev => prev.filter(x => x.id !== p.id))}>×</button>
            </div>
          </div>)}</div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>External Links (#11)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'link' ? null : 'link')}>+ Add</button></div>
            {showForm === 'link' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Label" id="el_label" /><input className={styles.input} placeholder="URL" id="el_url" /><button className={styles.primaryBtn} onClick={() => { const l = (document.getElementById('el_label') as HTMLInputElement).value; if (l) { setLinks(prev => [...prev, { id: uid(), label: l, url: (document.getElementById('el_url') as HTMLInputElement).value, clicks: 0, createdAt: now() }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.linkList}>{links.map(l => <div key={l.id} className={styles.linkItem}><span className={styles.cardTitle}>{l.label}</span><span className={styles.helperText}>{l.url}</span><span className={styles.helperText}>{l.clicks} clicks (#23)</span><button className={styles.deleteBtn} onClick={() => setLinks(prev => prev.filter(x => x.id !== l.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Collaborations & Partnerships (#16)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'collab' ? null : 'collab')}>+ Add</button></div>
            {showForm === 'collab' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="cb_name" /><input className={styles.input} placeholder="Type" id="cb_type" /><textarea className={styles.textarea} rows={1} placeholder="Notes..." id="cb_notes" style={{ flex: 1, minWidth: 200 }} /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('cb_name') as HTMLInputElement).value; if (n) { setCollaborations(prev => [...prev, { id: uid(), name: n, type: (document.getElementById('cb_type') as HTMLInputElement).value, status: 'active', notes: (document.getElementById('cb_notes') as HTMLTextAreaElement).value, createdAt: now() }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.portfolioGrid}>{collaborations.map(c => <div key={c.id} className={styles.portfolioCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{c.name}</span><span className={`${styles.statusBadge} ${styles[`st_${c.status}`]}`}>{c.status}</span></div>
              {c.type && <span className={styles.tag}>{c.type}</span>}
              {c.notes && <p className={styles.cardPreview}>{c.notes}</p>}
              <div className={styles.cardActions}><select className={styles.miniSelect} value={c.status} onChange={e => setCollaborations(prev => prev.map(x => x.id === c.id ? { ...x, status: e.target.value as Collaboration['status'] } : x))}><option value="active">Active</option><option value="completed">Completed</option><option value="pending">Pending</option></select><button className={styles.deleteBtn} onClick={() => setCollaborations(prev => prev.filter(x => x.id !== c.id))}>×</button></div>
            </div>)}</div>
          </div>
        </div>}

        {/* ═══ ANALYTICS (#21-30) ═══ */}
        {tab === 'analytics' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analytics & Metrics</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Brand Score</div><div className={styles.kpiValue}>{brandScore}/100</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Followers (#25)</div><div className={styles.kpiValue}>{totalFollowers.toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Total Views (#21)</div><div className={styles.kpiValue}>{portfolio.reduce((s, p) => s + p.views, 0).toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Engagement (#26)</div><div className={styles.kpiValue}>{portfolio.reduce((s, p) => s + p.likes + p.shares, 0).toLocaleString()}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Link Clicks (#23)</div><div className={styles.kpiValue}>{links.reduce((s, l) => s + l.clicks, 0)}</div></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Platform Breakdown (#22)</label>
            <div className={styles.kpiRow}>{accounts.map(a => <div key={a.id} className={styles.kpiCard}><div className={styles.kpiLabel}>{a.platform}</div><div className={styles.kpiValue}>{a.followers.toLocaleString()}</div><div className={styles.helperText}>@{a.username}</div></div>)}</div>
            {accounts.length === 0 && <p className={styles.helperText}>Connect social accounts on the Profile tab.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Top Content (#19, #24)</label>
            <div className={styles.tableWrap}>
              <div className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableHeader}>Item</span><span className={styles.tableHeader}>Type</span><span className={styles.tableHeader}>Views</span><span className={styles.tableHeader}>Likes</span><span className={styles.tableHeader}>Shares</span></div>
              {[...portfolio].sort((a, b) => (b.views + b.likes + b.shares) - (a.views + a.likes + a.shares)).slice(0, 8).map(p => <div key={p.id} className={`${styles.tableRow} ${styles.tableRow5}`}><span className={styles.tableCell}>{p.title}</span><span className={styles.tableCell}><span className={styles.tag}>{p.type}</span></span><span className={styles.tableCell}>{p.views}</span><span className={styles.tableCell}>{p.likes}</span><span className={styles.tableCell}>{p.shares}</span></div>)}
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Engagement Heatmap (#30)</label>
            <div className={styles.heatmapGrid}>{CONTENT_CATS.map(cat => { const items = portfolio.filter(p => p.type === cat); const total = items.reduce((s, p) => s + p.views + p.likes + p.shares, 0); return <div key={cat} className={styles.heatCell} style={{ opacity: Math.min(1, 0.2 + total / Math.max(portfolio.reduce((s, p) => s + p.views + p.likes + p.shares, 0), 1)) }}><span className={styles.heatLabel}>{cat}</span><span className={styles.heatValue}>{total}</span></div> })}</div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const d = `Personal Brand Report\n${'='.repeat(40)}\nName: ${profile.displayName}\nTagline: ${profile.tagline}\nBrand Score: ${brandScore}/100\nFollowers: ${totalFollowers}\nPortfolio: ${portfolio.length} items\nPlatforms: ${connectedCount}\n\n${accounts.map(a => `${a.platform}: @${a.username} (${a.followers})`).join('\n')}\n\nTop Content:\n${[...portfolio].sort((a, b) => b.views - a.views).slice(0, 5).map(p => `  ${p.title} — ${p.views} views`).join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `brand-analytics-${Date.now()}.txt`; a.click(); addToast('Report exported', 'success') }}>Export Analytics (#28)</button>
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>Growth Advisory (#43)</div>
            <pre className={styles.aiOutput}>{`Brand Intelligence\n${'─'.repeat(35)}\n• Score: ${brandScore}/100\n• ${connectedCount} platforms, ${totalFollowers.toLocaleString()} total followers\n• ${portfolio.length} portfolio items (${portfolio.filter(p => p.featured).length} featured)\n• ${collaborations.length} collaborations (${collaborations.filter(c => c.status === 'active').length} active)\n• ${links.length} external links, ${links.reduce((s, l) => s + l.clicks, 0)} total clicks\n• Top content type: ${(() => { const f: Record<string, number> = {}; portfolio.forEach(p => f[p.type] = (f[p.type] || 0) + p.views); return Object.entries(f).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' })()}\n• Recommendation: ${brandScore < 50 ? 'Complete your profile and connect social accounts.' : brandScore < 75 ? 'Add more portfolio items and grow engagement.' : 'Leverage your audience through partnerships.'}`}</pre>
          </div>
        </div>}

        {/* ═══ TEAM (#31-40) ═══ */}
        {tab === 'team' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Team & Collaboration</h2>
          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Team Members (#31-32)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'team' ? null : 'team')}>+ Invite</button></div>
            {showForm === 'team' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="tm_name" /><input className={styles.input} placeholder="Email" id="tm_email" /><select className={styles.select} id="tm_role"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('tm_name') as HTMLInputElement).value; if (n) { setCollaborators(prev => [...prev, { id: uid(), name: n, email: (document.getElementById('tm_email') as HTMLInputElement).value, role: (document.getElementById('tm_role') as HTMLSelectElement).value as Collaborator['role'] }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.teamGrid}>{collaborators.map(c => <div key={c.id} className={styles.teamCard}><span className={styles.fontName}>{c.name}</span><span className={styles.tag}>{c.role}</span><span className={styles.helperText}>{c.email}</span><button className={styles.deleteBtn} onClick={() => setCollaborators(prev => prev.filter(x => x.id !== c.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Discussion (#33, #39)</label>
            <div className={styles.commentList}>{comments.slice(0, 15).map(c => <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>)}</div>
            <div className={styles.inlineForm}><input className={styles.input} placeholder="Add comment..." id="pb_com" style={{ flex: 1 }} /><button className={styles.ghostBtn} onClick={() => { const t = (document.getElementById('pb_com') as HTMLInputElement).value; if (t) { setComments(prev => [{ id: uid(), author: 'You', text: t, date: now() }, ...prev]); (document.getElementById('pb_com') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Change History (#37-38)</label>
            <div className={styles.changeLog}>{changeLogs.slice(0, 20).map(c => <div key={c.id} className={styles.logItem}><span className={styles.helperText}>{fmtDate(c.date)}</span><span><strong>{c.field}</strong> changed</span></div>)}</div>
            {changeLogs.length === 0 && <p className={styles.helperText}>No changes logged yet.</p>}
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Tasks (#40)</label>
            <p className={styles.helperText}>Quick actions for content updates:</p>
            <div className={styles.taskGrid}>
              {portfolio.filter(p => p.views === 0).slice(0, 5).map(p => <div key={p.id} className={styles.taskItem}><span className={styles.taskContent}>Add views/engagement data for "{p.title}"</span></div>)}
              {!profile.coverUrl && <div className={styles.taskItem}><span className={styles.taskContent}>Upload a cover image to complete your profile</span></div>}
              {accounts.length < 3 && <div className={styles.taskItem}><span className={styles.taskContent}>Connect at least 3 social platforms</span></div>}
              {portfolio.filter(p => p.featured).length === 0 && <div className={styles.taskItem}><span className={styles.taskContent}>Feature at least 1 portfolio item</span></div>}
            </div>
          </div>
        </div>}

        {/* ═══ ADVANCED (#41-50) ═══ */}
        {tab === 'advanced' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Advanced Features</h2>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Custom Branding (#41)</label>
            <div className={styles.fieldRow}>
              <div className={styles.formGroup}><label>Brand Color</label><input className={styles.input} type="color" value={profile.brandColor} onChange={e => updateProfile('brandColor', e.target.value)} style={{ width: 60, height: 36, padding: 2 }} /></div>
              <div className={styles.formGroup}><label>Brand Font</label><select className={styles.select} value={profile.brandFont} onChange={e => updateProfile('brandFont', e.target.value)}><option>Inter</option><option>Helvetica</option><option>Georgia</option><option>Courier</option><option>System</option></select></div>
            </div>
          </div>

          <div className={styles.dnaBlock}>
            <div className={styles.blockHeader}><label className={styles.label}>Milestones & Badges (#44-45)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'milestone' ? null : 'milestone')}>+ Add</button></div>
            {showForm === 'milestone' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Title" id="ml_title" /><input className={styles.input} type="date" id="ml_date" /><input className={styles.input} placeholder="Description" id="ml_desc" /><label className={styles.helperText}><input type="checkbox" id="ml_badge" /> Badge</label><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ml_title') as HTMLInputElement).value; if (t) { setMilestones(prev => [...prev, { id: uid(), title: t, date: (document.getElementById('ml_date') as HTMLInputElement).value, description: (document.getElementById('ml_desc') as HTMLInputElement).value, isBadge: (document.getElementById('ml_badge') as HTMLInputElement).checked }]); setShowForm(null) } }}>Add</button></div>}
            <div className={styles.timeline}>{milestones.map(m => <div key={m.id} className={styles.timelineItem}><span className={styles.timelineDot} /><div><strong>{m.title}</strong>{m.isBadge && <span className={styles.verifiedBadge}>Badge</span>}<span className={styles.helperText}> · {fmtDate(m.date)}</span>{m.description && <p className={styles.cardPreview}>{m.description}</p>}</div><button className={styles.deleteBtn} onClick={() => setMilestones(prev => prev.filter(x => x.id !== m.id))}>×</button></div>)}</div>
          </div>

          <div className={styles.dnaBlock}>
            <label className={styles.label}>Brand Timeline</label>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}><span className={styles.timelineDot} /><span>Profile created</span></div>
              {accounts.map(a => <div key={a.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>Connected {a.platform}</span></div>)}
              {portfolio.slice(0, 5).map(p => <div key={p.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>Added: {p.title}</span></div>)}
              {milestones.map(m => <div key={m.id} className={styles.timelineItem}><span className={styles.timelineDot} /><span>{m.title}</span></div>)}
            </div>
          </div>

          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} onClick={() => { const kit = `Media Kit — ${profile.displayName}\n${'='.repeat(40)}\n\n${profile.tagline}\n${profile.bio}\n\nIndustry: ${profile.industry} | Persona: ${profile.persona}\nWebsite: ${profile.website}\n\nSocial:\n${accounts.map(a => `${a.platform}: @${a.username} (${a.followers.toLocaleString()})`).join('\n')}\n\nFeatured Work:\n${portfolio.filter(p => p.featured).map(p => `• ${p.title} (${p.type})`).join('\n') || 'None featured'}\n\nMilestones:\n${milestones.map(m => `• ${m.title} — ${fmtDate(m.date)}`).join('\n') || 'None'}\n\nGenerated: ${new Date().toLocaleDateString()}`; const b = new Blob([kit], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `media-kit-${Date.now()}.txt`; a.click(); addToast('Media kit generated', 'success') }}>Media Kit (#15)</button>
            <button className={styles.exportBtn} onClick={() => { const d = `Profile Snapshot — ${profile.displayName}\n${'='.repeat(40)}\nBrand Score: ${brandScore}/100\nFollowers: ${totalFollowers}\nPortfolio: ${portfolio.length} items\nPlatforms: ${connectedCount}\nLinks: ${links.length}\nCollaborations: ${collaborations.length}\nMilestones: ${milestones.length}`; const b = new Blob([d], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `profile-snapshot-${Date.now()}.txt`; a.click() }}>Export Snapshot (#48)</button>
          </div>

          <div className={styles.aiBox}>
            <div className={styles.aiBoxHeader}>Brand Intelligence (#43, #49)</div>
            <pre className={styles.aiOutput}>{`Personal Brand Health Report\n${'─'.repeat(35)}\n• Score: ${brandScore}/100\n• Profile: ${profile.displayName} — ${profile.persona}\n• Visibility: ${profile.isPublic ? 'Public' : 'Private'}\n• ${connectedCount} platforms, ${totalFollowers.toLocaleString()} followers\n• ${portfolio.length} portfolio items (${portfolio.filter(p => p.featured).length} featured, ${portfolio.filter(p => p.pinned).length} pinned)\n• ${collaborations.length} collaborations (${collaborations.filter(c => c.status === 'active').length} active)\n• ${links.length} external links\n• ${milestones.length} milestones (${milestones.filter(m => m.isBadge).length} badges)\n• Growth path: ${brandScore < 50 ? 'Build — focus on profile and content.' : brandScore < 75 ? 'Grow — increase engagement and partnerships.' : 'Scale — leverage audience and monetize.'}`}</pre>
          </div>
        </div>}

      </main>
    </div>
  )
}
