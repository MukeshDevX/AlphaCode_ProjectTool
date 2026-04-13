import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject, deleteProject } from '../api'
import ProjectCard from '../components/ProjectCard'
import Modal from '../components/Modal'

function Dashboard({ token, user }) {
  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [searchQuery, setSearch]    = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [form, setForm]             = useState({ name: '', description: '', status: 'active' })
  const navigate = useNavigate()

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const data = await getProjects(token)
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const data = await createProject(token, form)
    if (data.id) {
      setShowModal(false)
      setForm({ name: '', description: '', status: 'active' })
      fetchProjects()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await deleteProject(token, id)
    setProjects(projects.filter(p => p.id !== id))
  }

  const filtered = projects.filter(p => {
    const q = searchQuery.toLowerCase()
    return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
  })

  const totalTasks = projects.reduce((sum, p) => sum + (p.tasks_count || 0), 0)
  const doneTasks  = projects.reduce((sum, p) => sum + (p.completed_tasks_count || 0), 0)

  return (
    <div className="dashboard">
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">{projects.length}</span>
          <span className="stat-label">Projects</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{totalTasks}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{doneTasks}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="section-header">
        <h2>My Projects</h2>
        <div className="header-actions">
          <div className={`search-wrapper ${showSearch ? 'open' : ''}`}>
            {showSearch && (
              <input
                type="text"
                className="search-input"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            )}
            <button
              className="search-toggle-btn"
              onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearch('') }}
              title={showSearch ? 'Close search' : 'Search'}
            >
              {showSearch ? '✕' : '🔍'}
            </button>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
        </div>
      </div>

      {searchQuery && (
        <p className="search-result-info">{filtered.length} result(s) for "{searchQuery}"</p>
      )}

      {loading ? (
        <div className="loading-state">Loading projects...</div>
      ) : filtered.length === 0 && searchQuery ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No projects found</h3>
          <p>No match for "{searchQuery}"</p>
          <button className="btn-secondary" onClick={() => setSearch('')}>Clear search</button>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No projects yet</h3>
          <p>Create your first project and get started!</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Create Project</button>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUser={user}
              onClick={() => navigate(`/project/${project.id}`)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Create New Project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="modal-form">
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Website Redesign"
                required autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Briefly describe the project..."
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create 🚀</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Dashboard
