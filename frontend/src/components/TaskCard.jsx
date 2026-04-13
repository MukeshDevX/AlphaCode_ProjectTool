const PRIORITY = {
  high:   { icon: '🔴', label: 'High' },
  medium: { icon: '🟡', label: 'Medium' },
  low:    { icon: '🟢', label: 'Low' },
}

function TaskCard({ task, onClick }) {
  const priority  = PRIORITY[task.priority] || PRIORITY.medium
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <span className="task-priority" title={priority.label}>{priority.icon}</span>
        {task.comments_count > 0 && <span className="comment-count">💬 {task.comments_count}</span>}
      </div>

      <h4 className="task-title">{task.title}</h4>

      {task.description && (
        <p className="task-desc">
          {task.description.substring(0, 80)}{task.description.length > 80 ? '...' : ''}
        </p>
      )}

      <div className="task-card-footer">
        {task.assigned_to && (
          <div className="assigned-chip" title={`Assigned: ${task.assigned_to.username}`}>
            {task.assigned_to.username[0].toUpperCase()}
          </div>
        )}
        {task.due_date && (
          <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
            📅 {new Date(task.due_date).toLocaleDateString('en-IN')}
          </span>
        )}
      </div>
    </div>
  )
}

export default TaskCard
