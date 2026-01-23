import { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Community.module.css'

interface Member {
  id: string
  name: string
  skills: string[]
  interests: string[]
}

export function Community() {
  const { addToast } = useApp()
  const [members] = useState<Member[]>([
    { id: '1', name: 'Sarah Chen', skills: ['Design', 'Branding'], interests: ['Growth', 'Content'] },
    { id: '2', name: 'Marcus Johnson', skills: ['Development', 'Marketing'], interests: ['Product', 'Strategy'] },
    { id: '3', name: 'Elena Rodriguez', skills: ['Content', 'SEO'], interests: ['Growth', 'Community'] },
  ])
  const [searchSkill, setSearchSkill] = useState('')

  const allSkills = Array.from(new Set(members.flatMap(m => m.skills)))
  const filtered = searchSkill ? members.filter(m => m.skills.some(s => s.toLowerCase().includes(searchSkill.toLowerCase()))) : members

  const handleConnect = (name: string) => {
    addToast(`Connection request sent to ${name}!`, 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Community</h1>
        <p className={styles.subtitle}>Connect, collaborate, and grow together</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span>{members.length}</span>
            <span>Members</span>
          </div>
          <div className={styles.stat}>
            <span>{allSkills.length}</span>
            <span>Unique Skills</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Find Collaborators by Skill</h2>
          <input
            type="text"
            placeholder="Search by skill..."
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            className={styles.searchInput}
          />
          {allSkills.length > 0 && (
            <div className={styles.skillsCloud}>
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSearchSkill(skill)}
                  className={styles.skillTag}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Members ({filtered.length})</h2>
          <div className={styles.membersList}>
            {filtered.map(member => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberAvatar}>👤</div>
                <div className={styles.memberInfo}>
                  <h3>{member.name}</h3>
                  <div className={styles.skillsList}>
                    {member.skills.map(skill => (
                      <span key={skill} className={styles.skill}>{skill}</span>
                    ))}
                  </div>
                  <p className={styles.interests}>
                    Interested in: {member.interests.join(', ')}
                  </p>
                </div>
                <button onClick={() => handleConnect(member.name)} className={styles.connectBtn}>
                  Connect
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
