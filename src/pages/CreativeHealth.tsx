import { useState } from 'react'
import { useCloudStorage } from '../hooks/useCloudStorage'
import styles from './SystemPages.module.css'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

/* ═══════════════════════════════════════════════════════════
   CREATIVE HEALTH — Features: 191-200
   Energy, focus, burnout prevention, workload balance
   ═══════════════════════════════════════════════════════════ */

interface CheckIn { id: string; energy: number; focus: number; mood: string; notes: string; date: string }
interface Reminder { id: string; text: string; time: string; active: boolean }

export default function CreativeHealth() {
  const [checkins, setCheckins] = useCloudStorage<CheckIn[]>('ch_checkins', [])
  const [reminders, setReminders] = useCloudStorage<Reminder[]>('ch_reminders', [])
  const [showForm, setShowForm] = useState<string | null>(null)

  const latest = checkins[0]
  const avgEnergy = checkins.length ? Math.round(checkins.reduce((a, c) => a + c.energy, 0) / checkins.length) : 0
  const avgFocus = checkins.length ? Math.round(checkins.reduce((a, c) => a + c.focus, 0) / checkins.length) : 0
  const burnoutRisk = avgEnergy < 40 || avgFocus < 40 ? 'High' : avgEnergy < 60 ? 'Moderate' : 'Low'

  return (
    <div className={styles.container}>
      <header className={styles.header}><div className={styles.headerLeft}><h1 className={styles.title}>Creative Health</h1><p className={styles.subtitle}>Energy · Focus · Burnout Prevention (#191-200)</p></div>
        <div className={styles.headerRight}><button className={styles.primaryBtn} onClick={() => setShowForm(showForm === 'checkin' ? null : 'checkin')}>+ Check In (#194)</button></div></header>

      {showForm === 'checkin' && <div className={styles.inlineForm}>
        <div className={styles.formGroup}><label>Energy (#191): {(document.getElementById('ch_energy') as HTMLInputElement)?.value || 50}</label><input className={styles.range} type="range" min={0} max={100} defaultValue={50} id="ch_energy" /></div>
        <div className={styles.formGroup}><label>Focus (#191): {(document.getElementById('ch_focus') as HTMLInputElement)?.value || 50}</label><input className={styles.range} type="range" min={0} max={100} defaultValue={50} id="ch_focus" /></div>
        <select className={styles.select} id="ch_mood"><option>Energized</option><option>Focused</option><option>Calm</option><option>Tired</option><option>Stressed</option><option>Burned Out</option></select>
        <input className={styles.input} placeholder="Notes (#196)" id="ch_notes" />
        <button className={styles.primaryBtn} onClick={() => { setCheckins(p => [{ id: uid(), energy: Number((document.getElementById('ch_energy') as HTMLInputElement).value) || 50, focus: Number((document.getElementById('ch_focus') as HTMLInputElement).value) || 50, mood: (document.getElementById('ch_mood') as HTMLSelectElement).value, notes: (document.getElementById('ch_notes') as HTMLInputElement).value, date: now() }, ...p]); setShowForm(null) }}>Log</button>
      </div>}

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>Energy</div><div className={styles.kpiValue}>{latest?.energy || '—'}</div></div>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>Focus</div><div className={styles.kpiValue}>{latest?.focus || '—'}</div></div>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>Burnout Risk (#192)</div><div className={styles.kpiValue}>{burnoutRisk}</div></div>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>Check-ins</div><div className={styles.kpiValue}>{checkins.length}</div></div>
        <div className={styles.kpiCard}><div className={styles.kpiLabel}>Avg Energy</div><div className={styles.kpiValue}>{avgEnergy}</div></div>
      </div>

      <div className={styles.splitRow}>
        <div className={styles.dnaBlock}>
          <label className={styles.label}>Energy Trend (#199)</label>
          <div className={styles.timeline}>{checkins.slice(0, 10).map(c => (
            <div key={c.id} className={styles.timelineItem}><span className={styles.timelineDot} /><div><span className={styles.fontName}>{c.mood}</span><span className={styles.helperText}> — E:{c.energy} F:{c.focus} · {fmtDate(c.date)}</span>{c.notes && <p className={styles.cardPreview}>{c.notes}</p>}</div></div>
          ))}</div>
        </div>
        <div className={styles.dnaBlock}>
          <div className={styles.blockHeader}><label className={styles.label}>Reminders (#195)</label><button className={styles.ghostBtn} onClick={() => setShowForm(showForm === 'reminder' ? null : 'reminder')}>+ Add</button></div>
          {showForm === 'reminder' && <div className={styles.inlineForm}><input className={styles.input} placeholder="Reminder text" id="cr_text" /><input className={styles.input} type="time" id="cr_time" /><button className={styles.primaryBtn} onClick={() => { const t = (document.getElementById('cr_text') as HTMLInputElement).value; if (t) { setReminders(p => [...p, { id: uid(), text: t, time: (document.getElementById('cr_time') as HTMLInputElement).value, active: true }]); setShowForm(null) } }}>Add</button></div>}
          <div className={styles.taskList}>{reminders.map(r => (
            <div key={r.id} className={`${styles.taskItem} ${!r.active ? styles.taskDone : ''}`}><button className={styles.checkBtn} onClick={() => setReminders(p => p.map(x => x.id === r.id ? { ...x, active: !x.active } : x))}>{r.active ? '●' : '○'}</button><span className={styles.taskContent}>{r.text}</span>{r.time && <span className={styles.tag}>{r.time}</span>}<button className={styles.deleteBtn} onClick={() => setReminders(p => p.filter(x => x.id !== r.id))}>×</button></div>
          ))}</div>
        </div>
      </div>

      <div className={styles.aiBox}><div className={styles.aiBoxHeader}>Personal Insights (#200)</div><pre className={styles.aiOutput}>{`Creative Health Dashboard:\n${'─'.repeat(35)}\n• ${checkins.length} check-ins logged\n• Avg energy: ${avgEnergy}/100\n• Avg focus: ${avgFocus}/100\n• Burnout risk: ${burnoutRisk}\n• Most common mood: ${checkins.length ? (() => { const f: Record<string, number> = {}; checkins.forEach(c => f[c.mood] = (f[c.mood] || 0) + 1); return Object.entries(f).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' })() : 'N/A'}\n• ${burnoutRisk === 'High' ? 'Take a break. Your energy and focus are consistently low.' : burnoutRisk === 'Moderate' ? 'Consider reducing workload or taking short breaks.' : 'Healthy creative state. Maintain your rhythm.'}`}</pre></div>
    </div>
  )
}
