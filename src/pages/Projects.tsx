import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Project } from '../types'
import styles from './Projects.module.css'

const PROJECT_TYPES = [
  'Business',
  'Social Media',
  'Product',
  'Service',
  'Content',
  'Music',
  'Visual Art',
  'Experiment',
]

const HELP_OPTIONS = [
  'Design',
  'Development',
  'Marketing',
  'Photography',
  'Video',
  'Music production',
  'Branding',
  'Strategy',
]

export function Projects() {
  const { dashboard, updateDashboard, addToast } = useApp()
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [helpNeeded, setHelpNeeded] = useState<string[]>([])

  const projects = dashboard.projects

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !type) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      description,
      helpNeeded,
      status: 'idea',
      createdAt: new Date().toISOString(),
    }

    updateDashboard({
      projects: [...projects, newProject],
    })

    setName('')
    setType('')
    setDescription('')
    setHelpNeeded([])
    addToast('Project created!', 'success')
  }

  const handleToggleHelp = (help: string) => {
    setHelpNeeded((prev) =>
      prev.includes(help) ? prev.filter((h) => h !== help) : [...prev, help]
    )
  }

  const handleDeleteProject = (id: string) => {
    updateDashboard({
      projects: projects.filter((p) => p.id !== id),
    })
    addToast('Project deleted', 'success')
  }

  const handleUpdateStatus = (id: string, status: 'idea' | 'active' | 'completed') => {
    updateDashboard({
      projects: projects.map((p) => (p.id === id ? { ...p, status } : p)),
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects & Ideas</h1>
        <p className={styles.subtitle}>
          Start your next idea or manage existing projects
        </p>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>New Project</h2>
        <form onSubmit={handleAddProject} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Project Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Social Media Campaign"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Type *</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select a type</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <label>What help do you need?</label>
            <div className={styles.checkboxGrid}>
              {HELP_OPTIONS.map((option) => (
                <label key={option} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={helpNeeded.includes(option)}
                    onChange={() => handleToggleHelp(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Project
          </button>
        </form>
      </div>

      <div className={styles.projectsSection}>
        <h2 className={styles.sectionTitle}>Your Projects</h2>
        {projects.length === 0 ? (
          <p className={styles.empty}>No projects yet. Create one above!</p>
        ) : (
          <div className={styles.projectsList}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <div>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <p className={styles.projectType}>{project.type}</p>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    ✕
                  </button>
                </div>

                {project.description && (
                  <p className={styles.description}>{project.description}</p>
                )}

                <div className={styles.meta}>
                  <select
                    className={styles.statusSelect}
                    value={project.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        project.id,
                        e.target.value as 'idea' | 'active' | 'completed'
                      )
                    }
                  >
                    <option value="idea">Idea</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {project.helpNeeded.length > 0 && (
                  <div className={styles.helpTags}>
                    {project.helpNeeded.map((help) => (
                      <span key={help} className={styles.tag}>
                        {help}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
