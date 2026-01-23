import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './MusicStudio.module.css'

interface StoryArc {
  id: string
  title: string
  protagonist: string
  conflict: string
  resolution: string
  acts: {act: number, description: string, duration: number}[]
  emotionalCurve: number[]
  genre: string
}

interface CharacterProfile {
  id: string
  name: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  motivation: string
  backstory: string
  arc: string
  traits: string[]
  relationships: {character: string, relationship: string}[]
}

interface PlotStructure {
  id: string
  structure: '3-act' | '5-act' | 'hero-journey' | 'kishōtenketsu'
  beats: {beat: string, description: string, timing: number}[]
  tension: number[]
  pacing: 'slow' | 'medium' | 'fast'
}

interface DialogueBank {
  id: string
  character: string
  line: string
  context: string
  tone: string
  subtext: string
  impact: number
}

interface WorldBuilding {
  id: string
  world: string
  rules: string[]
  history: string
  geography: string
  culture: string
  technology: string
  consistency: number
}

interface ThemeMapping {
  id: string
  theme: string
  symbols: string[]
  motifs: string[]
  examples: string[]
  depth: number
}

interface NarrativeDevice {
  id: string
  device: string
  purpose: string
  example: string
  effectiveness: number
  overused: boolean
}

interface SceneStructure {
  id: string
  scene: string
  goal: string
  conflict: string
  disaster: string
  emotionalShift: string
  purpose: 'plot' | 'character' | 'world' | 'theme'
}

interface POVAnalysis {
  id: string
  pov: 'first-person' | 'second-person' | 'third-limited' | 'third-omniscient'
  narrator: string
  reliability: number
  advantages: string[]
  limitations: string[]
}

interface ConflictTypes {
  id: string
  type: 'person-person' | 'person-self' | 'person-society' | 'person-nature' | 'person-technology'
  description: string
  stakes: string
  escalation: number[]
  resolution: string
}

interface ForeshadowingLog {
  id: string
  hint: string
  payoff: string
  subtlety: number
  location: string
  effective: boolean
}

interface PacingAnalysis {
  id: string
  section: string
  wordCount: number
  actionLevel: number
  tensionLevel: number
  pacing: 'too-slow' | 'perfect' | 'too-fast'
  suggestion: string
}

interface VoiceConsistency {
  id: string
  character: string
  samples: string[]
  consistency: number
  distinctiveness: number
  issues: string[]
}

interface EmotionalBeats {
  id: string
  beat: string
  emotion: string
  intensity: number
  duration: string
  trigger: string
}

interface TensionCurve {
  id: string
  narrative: string
  points: {chapter: number, tension: number, event: string}[]
  peaks: number
  valleys: number
  balanced: boolean
}

export function MusicStudio() {
  const { addToast } = useApp()
  
  const [arcs, setArcs] = useState<StoryArc[]>([])
  const [characters, setCharacters] = useState<CharacterProfile[]>([])
  const [plots, setPlots] = useState<PlotStructure[]>([])
  const [dialogue, setDialogue] = useState<DialogueBank[]>([])
  const [worlds, setWorlds] = useState<WorldBuilding[]>([])
  const [themes, setThemes] = useState<ThemeMapping[]>([])
  const [devices, setDevices] = useState<NarrativeDevice[]>([])
  const [scenes, setScenes] = useState<SceneStructure[]>([])
  const [pov, setPov] = useState<POVAnalysis[]>([])
  const [conflicts, setConflicts] = useState<ConflictTypes[]>([])
  const [foreshadowing, setForeshadowing] = useState<ForeshadowingLog[]>([])
  const [pacing, setPacing] = useState<PacingAnalysis[]>([])
  const [voice, setVoice] = useState<VoiceConsistency[]>([])
  const [emotional, setEmotional] = useState<EmotionalBeats[]>([])
  const [tension, setTension] = useState<TensionCurve[]>([])

  const [activeSection, setActiveSection] = useState('arcs')

  useEffect(() => {
    const keys = ['arcs', 'characters', 'plots', 'dialogue', 'worlds', 'themes', 'devices', 'scenes', 'pov', 'conflicts', 'foreshadowing', 'pacing', 'voice', 'emotional', 'tension']
    keys.forEach(key => {
      const loaded = localStorage.getItem(`musicstudio_${key}`)
      if (loaded) {
        const data = JSON.parse(loaded)
        switch(key) {
          case 'arcs': setArcs(data); break
          case 'characters': setCharacters(data); break
          case 'plots': setPlots(data); break
          case 'dialogue': setDialogue(data); break
          case 'worlds': setWorlds(data); break
          case 'themes': setThemes(data); break
          case 'devices': setDevices(data); break
          case 'scenes': setScenes(data); break
          case 'pov': setPov(data); break
          case 'conflicts': setConflicts(data); break
          case 'foreshadowing': setForeshadowing(data); break
          case 'pacing': setPacing(data); break
          case 'voice': setVoice(data); break
          case 'emotional': setEmotional(data); break
          case 'tension': setTension(data); break
        }
      }
    })
  }, [])

  useEffect(() => { localStorage.setItem('musicstudio_arcs', JSON.stringify(arcs)) }, [arcs])
  useEffect(() => { localStorage.setItem('musicstudio_characters', JSON.stringify(characters)) }, [characters])
  useEffect(() => { localStorage.setItem('musicstudio_plots', JSON.stringify(plots)) }, [plots])
  useEffect(() => { localStorage.setItem('musicstudio_dialogue', JSON.stringify(dialogue)) }, [dialogue])
  useEffect(() => { localStorage.setItem('musicstudio_worlds', JSON.stringify(worlds)) }, [worlds])
  useEffect(() => { localStorage.setItem('musicstudio_themes', JSON.stringify(themes)) }, [themes])
  useEffect(() => { localStorage.setItem('musicstudio_devices', JSON.stringify(devices)) }, [devices])
  useEffect(() => { localStorage.setItem('musicstudio_scenes', JSON.stringify(scenes)) }, [scenes])
  useEffect(() => { localStorage.setItem('musicstudio_pov', JSON.stringify(pov)) }, [pov])
  useEffect(() => { localStorage.setItem('musicstudio_conflicts', JSON.stringify(conflicts)) }, [conflicts])
  useEffect(() => { localStorage.setItem('musicstudio_foreshadowing', JSON.stringify(foreshadowing)) }, [foreshadowing])
  useEffect(() => { localStorage.setItem('musicstudio_pacing', JSON.stringify(pacing)) }, [pacing])
  useEffect(() => { localStorage.setItem('musicstudio_voice', JSON.stringify(voice)) }, [voice])
  useEffect(() => { localStorage.setItem('musicstudio_emotional', JSON.stringify(emotional)) }, [emotional])
  useEffect(() => { localStorage.setItem('musicstudio_tension', JSON.stringify(tension)) }, [tension])

  // AI Functions
  const calculateEmotionalCurve = (acts: {act: number, description: string}[]): number[] => {
    const curve: number[] = []
    acts.forEach((act, idx) => {
      const keywords = act.description.toLowerCase()
      let emotion = 50
      
      if (keywords.includes('conflict') || keywords.includes('crisis')) emotion += 30
      if (keywords.includes('resolution') || keywords.includes('climax')) emotion += 40
      if (keywords.includes('setup') || keywords.includes('introduction')) emotion += 10
      
      curve.push(Math.min(100, emotion))
    })
    return curve
  }

  const assessCharacterDepth = (backstory: string, motivation: string, arc: string): number => {
    let score = 0
    if (backstory.length > 50) score += 30
    if (motivation.length > 30) score += 30
    if (arc.length > 30) score += 40
    return Math.min(100, score)
  }

  const calculateDialogueImpact = (line: string, subtext: string, tone: string): number => {
    let impact = 40
    
    if (line.length < 20 && line.length > 5) impact += 20 // Concise is powerful
    if (subtext.length > 20) impact += 20 // Layered dialogue
    if (tone === 'dramatic' || tone === 'intense') impact += 20
    
    return Math.min(100, impact)
  }

  const assessWorldConsistency = (rules: string[]): number => {
    if (rules.length === 0) return 0
    const uniqueRules = new Set(rules)
    return Math.min(100, (uniqueRules.size / rules.length) * 100)
  }

  const calculateThemeDepth = (symbols: number, motifs: number, examples: number): number => {
    let depth = 20
    depth += Math.min(30, symbols * 10)
    depth += Math.min(30, motifs * 10)
    depth += Math.min(20, examples * 5)
    return depth
  }

  const assessDeviceEffectiveness = (device: string, usageCount: number): {effectiveness: number, overused: boolean} => {
    let effectiveness = 70
    
    if (usageCount > 10) {
      effectiveness -= (usageCount - 10) * 5
      return {effectiveness: Math.max(0, effectiveness), overused: true}
    }
    
    if (usageCount >= 3 && usageCount <= 7) effectiveness = 90
    
    return {effectiveness, overused: false}
  }

  const analyzePacing = (wordCount: number, actionLevel: number, tensionLevel: number): {pacing: 'too-slow' | 'perfect' | 'too-fast', suggestion: string} => {
    const averageScore = (actionLevel + tensionLevel) / 2
    const wordsPerIntensity = wordCount / Math.max(averageScore, 1)
    
    if (wordsPerIntensity > 100) {
      return {pacing: 'too-slow', suggestion: 'Add more action or conflict to maintain reader engagement'}
    } else if (wordsPerIntensity < 30) {
      return {pacing: 'too-fast', suggestion: 'Allow moments for reflection and character development'}
    }
    
    return {pacing: 'perfect', suggestion: 'Pacing is well-balanced'}
  }

  const calculateVoiceConsistency = (samples: string[]): number => {
    if (samples.length < 2) return 100
    
    // Simple heuristic: check average sentence length consistency
    const lengths = samples.map(s => s.split(' ').length)
    const avgLength = lengths.reduce((sum, l) => sum + l, 0) / lengths.length
    const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avgLength, 2), 0) / lengths.length
    
    const consistency = Math.max(0, 100 - (variance * 2))
    return Math.round(consistency)
  }

  const assessTensionBalance = (points: {chapter: number, tension: number, event: string}[]): boolean => {
    if (points.length < 3) return true
    
    const peaks = points.filter(p => p.tension >= 80).length
    const valleys = points.filter(p => p.tension <= 30).length
    
    const ratio = peaks / (valleys + 1)
    return ratio >= 0.5 && ratio <= 2 // Balanced if peaks and valleys are proportional
  }

  // CRUD Functions
  const addArc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const acts = [
      {act: 1, description: formData.get('act1') as string || '', duration: 25},
      {act: 2, description: formData.get('act2') as string || '', duration: 50},
      {act: 3, description: formData.get('act3') as string || '', duration: 25}
    ].filter(act => act.description)
    
    const emotionalCurve = calculateEmotionalCurve(acts)
    
    const newArc: StoryArc = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      protagonist: formData.get('protagonist') as string,
      conflict: formData.get('conflict') as string,
      resolution: formData.get('resolution') as string,
      acts,
      emotionalCurve,
      genre: formData.get('genre') as string
    }
    
    setArcs([...arcs, newArc])
    addToast('Story arc created', 'success')
    e.currentTarget.reset()
  }

  const addCharacter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newCharacter: CharacterProfile = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      role: formData.get('role') as CharacterProfile['role'],
      motivation: formData.get('motivation') as string,
      backstory: formData.get('backstory') as string,
      arc: formData.get('arc') as string,
      traits: (formData.get('traits') as string).split(',').map(t => t.trim()),
      relationships: []
    }
    
    setCharacters([...characters, newCharacter])
    addToast('Character created', 'success')
    e.currentTarget.reset()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Narrative Studio</h1>
          <p className={styles.subtitle}>Story structure and narrative development tools</p>
        </div>
      </div>

      <div className={styles.layout}>
        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeSection === 'arcs' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('arcs')}>Story Arcs</button>
          <button className={`${styles.navItem} ${activeSection === 'characters' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('characters')}>Character Profiles</button>
          <button className={`${styles.navItem} ${activeSection === 'plot' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('plot')}>Plot Structure</button>
          <button className={`${styles.navItem} ${activeSection === 'dialogue' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('dialogue')}>Dialogue Bank</button>
          <button className={`${styles.navItem} ${activeSection === 'world' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('world')}>World Building</button>
          <button className={`${styles.navItem} ${activeSection === 'themes' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('themes')}>Theme Mapping</button>
          <button className={`${styles.navItem} ${activeSection === 'devices' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('devices')}>Narrative Devices</button>
          <button className={`${styles.navItem} ${activeSection === 'scenes' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('scenes')}>Scene Structure</button>
          <button className={`${styles.navItem} ${activeSection === 'pov' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('pov')}>POV Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'conflict' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('conflict')}>Conflict Types</button>
          <button className={`${styles.navItem} ${activeSection === 'foreshadow' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('foreshadow')}>Foreshadowing Log</button>
          <button className={`${styles.navItem} ${activeSection === 'pacing' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('pacing')}>Pacing Analysis</button>
          <button className={`${styles.navItem} ${activeSection === 'voice' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('voice')}>Voice Consistency</button>
          <button className={`${styles.navItem} ${activeSection === 'emotional' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('emotional')}>Emotional Beats</button>
          <button className={`${styles.navItem} ${activeSection === 'tension' ? styles.navItemActive : ''}`} onClick={() => setActiveSection('tension')}>Tension Curve</button>
        </nav>

        <main className={styles.mainContent}>
          {activeSection === 'arcs' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Story Arcs</h2>
                <p>Structure your narrative with classic story arc frameworks</p>
              </div>

              <form onSubmit={addArc} className={styles.form}>
                <input name="title" placeholder="Story title" required className={styles.input} />
                <input name="protagonist" placeholder="Protagonist" required className={styles.input} />
                <input name="genre" placeholder="Genre" required className={styles.input} />
                <textarea name="conflict" placeholder="Central conflict" required className={styles.textarea} rows={2}></textarea>
                <textarea name="resolution" placeholder="Resolution" required className={styles.textarea} rows={2}></textarea>
                <input name="act1" placeholder="Act 1: Setup" className={styles.input} />
                <input name="act2" placeholder="Act 2: Confrontation" className={styles.input} />
                <input name="act3" placeholder="Act 3: Resolution" className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Create Arc</button>
              </form>

              <div className={styles.arcsGrid}>
                {arcs.map(arc => (
                  <div key={arc.id} className={styles.arcCard}>
                    <div className={styles.arcHeader}>
                      <h3>{arc.title}</h3>
                      <span className={styles.genre}>{arc.genre}</span>
                    </div>
                    <div className={styles.arcDetails}>
                      <p><strong>Protagonist:</strong> {arc.protagonist}</p>
                      <p><strong>Conflict:</strong> {arc.conflict}</p>
                      <p><strong>Resolution:</strong> {arc.resolution}</p>
                    </div>
                    <div className={styles.acts}>
                      <strong>Structure:</strong>
                      <div className={styles.actList}>
                        {arc.acts.map((act, idx) => (
                          <div key={idx} className={styles.act}>
                            <span className={styles.actNumber}>Act {act.act}</span>
                            <span className={styles.actDesc}>{act.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.emotionalCurve}>
                      <strong>Emotional Curve:</strong>
                      <div className={styles.curve}>
                        {arc.emotionalCurve.map((value, idx) => (
                          <div 
                            key={idx} 
                            className={styles.curvePoint} 
                            style={{height: `${value}%`}}
                            title={`Act ${idx + 1}: ${value}% intensity`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'characters' && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Character Profiles</h2>
                <p>Develop deep, consistent characters with rich backgrounds</p>
              </div>

              <form onSubmit={addCharacter} className={styles.form}>
                <input name="name" placeholder="Character name" required className={styles.input} />
                <select name="role" required className={styles.select}>
                  <option value="">Role</option>
                  <option value="protagonist">Protagonist</option>
                  <option value="antagonist">Antagonist</option>
                  <option value="supporting">Supporting</option>
                  <option value="minor">Minor</option>
                </select>
                <textarea name="motivation" placeholder="Motivation" required className={styles.textarea} rows={2}></textarea>
                <textarea name="backstory" placeholder="Backstory" required className={styles.textarea} rows={3}></textarea>
                <textarea name="arc" placeholder="Character arc" required className={styles.textarea} rows={2}></textarea>
                <input name="traits" placeholder="Traits (comma-separated)" required className={styles.input} />
                <button type="submit" className={styles.primaryBtn}>Create Character</button>
              </form>

              <div className={styles.charactersGrid}>
                {characters.map(char => (
                  <div key={char.id} className={`${styles.characterCard} ${styles[char.role]}`}>
                    <div className={styles.characterHeader}>
                      <h3>{char.name}</h3>
                      <span className={styles.roleBadge}>{char.role}</span>
                    </div>
                    <div className={styles.characterDetails}>
                      <div className={styles.section}>
                        <strong>Motivation:</strong>
                        <p>{char.motivation}</p>
                      </div>
                      <div className={styles.section}>
                        <strong>Backstory:</strong>
                        <p>{char.backstory}</p>
                      </div>
                      <div className={styles.section}>
                        <strong>Arc:</strong>
                        <p>{char.arc}</p>
                      </div>
                      <div className={styles.traits}>
                        <strong>Traits:</strong>
                        <div className={styles.traitList}>
                          {char.traits.map((trait, idx) => (
                            <span key={idx} className={styles.trait}>{trait}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
