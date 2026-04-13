const STATUS_COLORS = {
  active:    { bg: '#dcfce7', text: '#16a34a', label: 'Active' },
  on_hold:   { bg: '#fef9c3', text: '#ca8a04', label: 'On Hold' },
  completed: { bg: '#e0e7ff', text: '#4f46e5', label: 'Completed' },
}

function ProjectCard({ project, currentUser, onClick, onDelete }) {
  const progress    = project.tasks_count > 0 ? Math.round((project.completed_tasks_count / project.tasks_count) * 100) : 0
  const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS.active
  const isOwner     = project.owner?.id === currentUser?.id

  return (
    <div className="project-card" onClick={onClick}>
      <div className="card-top">
        <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.text }}>
          {statusStyle.label}
        </span>
        {isOwner && (
          <button className="delete-btn" onClick={e => { e.stopPropagation(); onDelete() }} title="Delete">
            🗑️
          </button>
        )}
      </div>

      <h3 className="card-title">{project.name}</h3>
      {project.description && <p className="card-desc">{project.description}</p>}

      <div className="card-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">
          {project.completed_tasks_count}/{project.tasks_count} tasks • {progress}%
        </span>
      </div>

      <div className="card-footer">
        <span className="card-owner">by {project.owner?.username}</span>
        <span className="card-date">{new Date(project.created_at).toLocaleDateString('en-IN')}</span>
      </div>
    </div>
  )
}

export default ProjectCard
