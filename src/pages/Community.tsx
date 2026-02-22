import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

/* ═══════════════════════════════════════════════════════════
   COMMUNITY & SERVICES — merged
   Community + Services Marketplace
   Features: 161-180
   ═══════════════════════════════════════════════════════════ */

type ComTab = 'community' | 'marketplace' | 'events'

interface Member { id: string; name: string; skills: string[]; industry: string; connected: boolean }
interface ServiceListing { id: string; title: string; category: string; provider: string; budget: string; rating: number; status: 'available' | 'booked'; description: string }
interface CommunityEvent { id: string; title: string; date: string; type: string; notes: string }
interface Post { id: string; author: string; content: string; type: 'opportunity' | 'discussion' | 'collaboration'; date: string }

const SERVICE_CATS = ['Design', 'Development', 'Photography', 'Video', 'Content', 'Marketing', 'Music', 'Strategy']

export function Community() {
  const { addToast } = useApp()
  const [tab, setTab] = useState<ComTab>('community')
  const [members, setMembers] = useCloudStorage<Member[]>('com_members', [
    { id: '1', name: 'Sarah Chen', skills: ['Design', 'Branding'], industry: 'Creative', connected: true },
    { id: '2', name: 'Marcus Johnson', skills: ['Development', 'Marketing'], industry: 'Technology', connected: false },
    { id: '3', name: 'Elena Rodriguez', skills: ['Content', 'SEO'], industry: 'Marketing', connected: true },
  ])
  const [services, setServices] = useCloudStorage<ServiceListing[]>('com_services', [
    { id: '1', title: 'Brand Identity Design', category: 'Design', provider: 'Design Studio Pro', budget: '$1,500-$3,000', rating: 4.8, status: 'available', description: 'Full brand identity package.' },
    { id: '2', title: 'Website Development', category: 'Development', provider: 'Tech Squad', budget: '$3,000-$8,000', rating: 4.6, status: 'available', description: 'Custom website build.' },
  ])
  const [events, setEvents] = useCloudStorage<CommunityEvent[]>('com_events', [])
  const [posts, setPosts] = useCloudStorage<Post[]>('com_posts', [])
  const [showForm, setShowForm] = useState<string | null>(null)
  const [search, setSearch] = useState(''); const [filterCat, setFilterCat] = useState('')

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Community & Services</h1><p className={styles.subtitle}>Networking · Marketplace · Events</p></div></header>
      <nav className={styles.tabNav}>{(['community', 'marketplace', 'events'] as ComTab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      <main className={styles.mainContent}>
        {tab === 'community' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Members</div><div className={styles.kpiValue}>{members.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Connected</div><div className={styles.kpiValue}>{members.filter(m => m.connected).length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Posts</div><div className={styles.kpiValue}>{posts.length}</div></div>
          </div>
          <div className={styles.dnaBlock}><div className={styles.blockHeader}><label className={styles.label}>Activity Feed (#170)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'post' ? null : 'post')}>+ Post (#164)</button></div>
            {showForm === 'post' && <div className={styles.inlineForm}><input className={styles.input} placeholder="What's on your mind?" id="cp_content" /><select className={styles.select} id="cp_type"><option value="discussion">Discussion</option><option value="opportunity">Opportunity</option><option value="collaboration">Collaboration</option></select><button className={styles.primaryBtn} onClick={() => { const c = (document.getElementById('cp_content') as HTMLInputElement).value; if (c) { setPosts(p => [{ id: uid(), author: 'You', content: c, type: (document.getElementById('cp_type') as HTMLSelectElement).value as any, date: now() }, ...p]); setShowForm(null) } }}>Post</button></div>}
            <div className={styles.commentList}>{posts.slice(0, 10).map(p => <div key={p.id} className={styles.commentItem}><span className={styles.fontName}>{p.author}</span><span>{p.content}</span><span className={styles.tag}>{p.type}</span><span className={styles.helperText}>{fmtDate(p.date)}</span></div>)}</div>
          </div>
          <div className={styles.dnaBlock}><label className={styles.label}>Members (#165)</label>
            <div className={styles.controlsRow}><input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." /></div>
            <div className={styles.teamGrid}>{members.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase())).map(m => (
              <div key={m.id} className={styles.teamCard}><span className={styles.fontName}>{m.name}</span><div className={styles.tagRow}>{m.skills.map(s => <span key={s} className={styles.tag}>{s}</span>)}</div><span className={styles.helperText}>{m.industry}</span>
                <button className={styles.ghostBtn} onClick={() => { setMembers(p => p.map(x => x.id === m.id ? { ...x, connected: !x.connected } : x)); addToast(m.connected ? 'Disconnected' : `Connected with ${m.name}`, 'success') }}>{m.connected ? 'Connected' : 'Connect (#169)'}</button>
              </div>
            ))}</div>
          </div>
        </div>}

        {tab === 'marketplace' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Services Marketplace (#171)</h2>
          <div className={styles.controlsRow}><select className={styles.select} value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ maxWidth: 160 }}><option value="">All Categories</option>{SERVICE_CATS.map(c => <option key={c}>{c}</option>)}</select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'service' ? null : 'service')}>+ Add Service (#172)</button></div>
          {showForm === 'service' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Service title" id="sv_title" /><select className={styles.select} id="sv_cat">{SERVICE_CATS.map(c => <option key={c}>{c}</option>)}</select><input className={styles.input} placeholder="Provider" id="sv_prov" /><input className={styles.input} placeholder="Budget range" id="sv_budget" /><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('sv_title') as HTMLInputElement).value; if (t) { setServices(p => [...p, { id: uid(), title: t, category: (document.getElementById('sv_cat') as HTMLSelectElement).value, provider: (document.getElementById('sv_prov') as HTMLInputElement).value, budget: (document.getElementById('sv_budget') as HTMLInputElement).value, rating: 0, status: 'available', description: '' }]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.grid}>{services.filter(s => !filterCat || s.category === filterCat).map(s => (
            <div key={s.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{s.title}</span><span className={`${styles.statusBadge} ${s.status === 'available' ? styles.st_active : styles.st_pending}`}>{s.status}</span></div>
              <div className={styles.cardMeta}><span className={styles.tag}>{s.category}</span><span className={styles.helperText}>{s.provider}</span></div>
              <p className={styles.cardPreview}>{s.budget}</p>
              {s.rating > 0 && <span className={styles.scoreBadge}>{'★'.repeat(Math.round(s.rating))} {s.rating}</span>}
              <div className={styles.cardActions}><button className={styles.primaryBtn} style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => { addToast(`Booking: ${s.title}`, 'success'); setServices(p => p.map(x => x.id === s.id ? { ...x, status: 'booked' as const } : x)) }}>Book (#177)</button><button className={styles.deleteBtn} onClick={() => setServices(p => p.filter(x => x.id !== s.id))}>×</button></div>
            </div>
          ))}</div>
        </div>}

        {tab === 'events' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Events & Calendar (#168)</h2>
          <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'event' ? null : 'event')}>+ Add Event</button>
          {showForm === 'event' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Event title" id="ce_title" /><input className={styles.input} type="date" id="ce_date" /><select className={styles.select} id="ce_type"><option>Meetup</option><option>Workshop</option><option>Webinar</option><option>Collab Call</option></select><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('ce_title') as HTMLInputElement).value; if (t) { setEvents(p => [...p, { id: uid(), title: t, date: (document.getElementById('ce_date') as HTMLInputElement).value, type: (document.getElementById('ce_type') as HTMLSelectElement).value, notes: '' }]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.grid}>{events.map(e => <div key={e.id} className={styles.card}><span className={styles.cardTitle}>{e.title}</span><div className={styles.cardMeta}><span className={styles.tag}>{e.type}</span><span className={styles.helperText}>{fmtDate(e.date)}</span></div><button className={styles.deleteBtn} onClick={() => setEvents(p => p.filter(x => x.id !== e.id))}>×</button></div>)}</div>
        </div>}
      </main>
    </div>
  )
}
