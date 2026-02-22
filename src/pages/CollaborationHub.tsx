import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

/* ═══════════════════════════════════════════════════════════
   COLLABORATION & MEDIA — merged
   Collaboration Hub + Media Vault
   Features: 201-210
   ═══════════════════════════════════════════════════════════ */

type CHTab = 'team' | 'media' | 'activity'

interface TeamMember { id: string; name: string; role: string; email: string }
interface SharedSpace { id: string; name: string; members: string[]; notes: string; createdAt: string }
interface MediaFile { id: string; name: string; type: 'audio' | 'video' | 'image' | 'design' | 'document'; size: string; version: number; linkedProjects: string[]; createdAt: string }
interface ActivityLog { id: string; action: string; user: string; date: string }
interface HubComment { id: string; spaceId: string; author: string; text: string; date: string }

export function CollaborationHub() {
  const { addToast } = useApp()
  const [tab, setTab] = useState<CHTab>('team')
  const [members, setMembers] = useCloudStorage<TeamMember[]>('ch2_members', [])
  const [spaces, setSpaces] = useCloudStorage<SharedSpace[]>('ch2_spaces', [])
  const [files, setFiles] = useCloudStorage<MediaFile[]>('ch2_files', [])
  const [activity, setActivity] = useCloudStorage<ActivityLog[]>('ch2_activity', [])
  const [comments, setComments] = useCloudStorage<HubComment[]>('ch2_comments', [])
  const [showForm, setShowForm] = useState<string | null>(null)
  const [search, setSearch] = useState(''); const [filterType, setFilterType] = useState('')
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null)

  const logAction = (action: string) => setActivity(p => [{ id: uid(), action, user: 'You', date: now() }, ...p])
  const curComments = selectedSpace ? comments.filter(c => c.spaceId === selectedSpace) : []

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Collaboration & Media</h1><p className={styles.subtitle}>Team · Shared Spaces · Media Vault (#201-210)</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm('member')}>+ Invite (#201)</button></div></header>
      <nav className={styles.tabNav}>{(['team', 'media', 'activity'] as CHTab[]).map(t => <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</nav>

      {showForm === 'member' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Name" id="hm_name" /><input className={styles.input} placeholder="Role (#202)" id="hm_role" /><input className={styles.input} placeholder="Email" id="hm_email" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('hm_name') as HTMLInputElement).value; if (n) { setMembers(p => [...p, { id: uid(), name: n, role: (document.getElementById('hm_role') as HTMLInputElement).value, email: (document.getElementById('hm_email') as HTMLInputElement).value }]); logAction(`Invited ${n}`); setShowForm(null); addToast('Member invited', 'success') } }}>Add</button></div>}

      <main className={styles.mainContent}>
        {tab === 'team' && <div className={styles.section}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Members</div><div className={styles.kpiValue}>{members.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Spaces (#203)</div><div className={styles.kpiValue}>{spaces.length}</div></div>
            <div className={styles.kpiCard}><div className={styles.kpiLabel}>Files</div><div className={styles.kpiValue}>{files.length}</div></div>
          </div>
          <div className={styles.dnaBlock}><label className={styles.label}>Team</label>
            <div className={styles.teamGrid}>{members.map(m => <div key={m.id} className={styles.teamCard}><span className={styles.fontName}>{m.name}</span><span className={styles.tag}>{m.role}</span><span className={styles.helperText}>{m.email}</span><button className={styles.deleteBtn} onClick={() => { setMembers(p => p.filter(x => x.id !== m.id)); logAction(`Removed ${m.name}`) }}>×</button></div>)}</div>
          </div>
          <div className={styles.dnaBlock}><div className={styles.blockHeader}><label className={styles.label}>Shared Spaces (#203)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'space' ? null : 'space')}>+ Create</button></div>
            {showForm === 'space' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Space name" id="hs_name" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('hs_name') as HTMLInputElement).value; if (n) { setSpaces(p => [...p, { id: uid(), name: n, members: [], notes: '', createdAt: now() }]); logAction(`Created space: ${n}`); setShowForm(null) } }}>Create</button></div>}
            <div className={styles.grid}>{spaces.map(s => (
              <div key={s.id} className={`${styles.card} ${selectedSpace === s.id ? styles.cardActive : ''}`} onClick={() => setSelectedSpace(s.id)}>
                <span className={styles.cardTitle}>{s.name}</span><span className={styles.helperText}>{fmtDate(s.createdAt)}</span>
                <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); setSpaces(p => p.filter(x => x.id !== s.id)) }}>×</button>
              </div>
            ))}</div>
          </div>
          {selectedSpace && <div className={styles.dnaBlock}><label className={styles.label}>Comments (#204)</label>
            <div className={styles.commentList}>{curComments.map(c => <div key={c.id} className={styles.commentItem}><span className={styles.fontName}>{c.author}</span><span>{c.text}</span><span className={styles.helperText}>{fmtDate(c.date)}</span></div>)}</div>
            <div className={styles.inlineForm}><input className={styles.input} placeholder="Add comment..." id="hc_text" /><button className={styles.ghostBtn} onClick={() => { const t = (document.getElementById('hc_text') as HTMLInputElement).value; if (t && selectedSpace) { setComments(p => [{ id: uid(), spaceId: selectedSpace, author: 'You', text: t, date: now() }, ...p]); (document.getElementById('hc_text') as HTMLInputElement).value = '' } }}>Post</button></div>
          </div>}
        </div>}

        {tab === 'media' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Media Vault (#205-208)</h2>
          <div className={styles.controlsRow}>
            <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." />
            <select className={styles.select} value={filterType} onChange={e => setFilterType(e.target.value)} style={{ maxWidth: 160 }}><option value="">All Types</option><option>audio</option><option>video</option><option>image</option><option>design</option><option>document</option></select>
            <button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'file' ? null : 'file')}>+ Upload (#206)</button>
          </div>
          {showForm === 'file' && <div className={styles.inlineForm}><input className={styles.input} placeholder="File name" id="hf_name" /><select className={styles.select} id="hf_type"><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option><option value="design">Design</option><option value="document">Document</option></select><input className={styles.input} placeholder="Size (e.g. 2.5 MB)" id="hf_size" /><button className={styles.primaryBtn} onClick={() => { const n = (document.getElementById('hf_name') as HTMLInputElement).value; if (n) { setFiles(p => [...p, { id: uid(), name: n, type: (document.getElementById('hf_type') as HTMLSelectElement).value as any, size: (document.getElementById('hf_size') as HTMLInputElement).value || '—', version: 1, linkedProjects: [], createdAt: now() }]); logAction(`Uploaded ${n}`); setShowForm(null); addToast('File uploaded', 'success') } }}>Upload</button></div>}
          <div className={styles.grid}>{files.filter(f => (!search || f.name.toLowerCase().includes(search.toLowerCase())) && (!filterType || f.type === filterType)).map(f => (
            <div key={f.id} className={styles.card}><div className={styles.cardHeader}><span className={styles.cardTitle}>{f.name}</span><span className={styles.tag}>{f.type} · v{f.version}</span></div>
              <div className={styles.cardMeta}><span className={styles.helperText}>{f.size}</span><span className={styles.helperText}>{fmtDate(f.createdAt)}</span></div>
              <div className={styles.cardActions}><button className={styles.ghostBtn} onClick={() => { setFiles(p => p.map(x => x.id === f.id ? { ...x, version: x.version + 1 } : x)); logAction(`New version: ${f.name}`) }}>+ Version (#205)</button><button className={styles.deleteBtn} onClick={() => setFiles(p => p.filter(x => x.id !== f.id))}>×</button></div>
            </div>
          ))}</div>
        </div>}

        {tab === 'activity' && <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Activity Log (#209)</h2>
          <div className={styles.timeline}>{activity.slice(0, 30).map(a => <div key={a.id} className={styles.timelineItem}><span className={styles.timelineDot} /><div><span className={styles.fontName}>{a.user}</span><span className={styles.helperText}> · {a.action} · {fmtDate(a.date)}</span></div></div>)}</div>
          <div className={styles.exportGrid}><button className={styles.exportBtn} onClick={() => { const d = activity.map(a => `${fmtDate(a.date)} — ${a.user}: ${a.action}`).join('\n'); const b = new Blob([d], { type: 'text/plain' }); const a2 = document.createElement('a'); a2.href = URL.createObjectURL(b); a2.download = `collab-report-${Date.now()}.txt`; a2.click() }}>Export Report (#210)</button></div>
        </div>}
      </main>
    </div>
  )
}
