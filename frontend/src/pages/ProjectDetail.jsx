import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, createTask, deleteTask, addMember } from '../api'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import Modal from '../components/Modal'

const COLUMNS = [
  { key: 'todo',        label: '📋 To Do',       color: '#6b7280' },
  { key: 'in_progress', label: '⚡ In Progress',  color: '#f59e0b' },
  { key: 'done',        label: '✅ Done',          color: '#10b981' },
]

function ProjectDetail({ token, user }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject]             = useState(null)
  const [loading, setLoading]             = useState(true)
  const [selectedTask, setSelectedTask]   = useState(null)
  const [showAddTask, setShowAddTask]     = useState(false)
  const [addToColumn, setAddToColumn]     = useState('todo')
  const [showMemberModal, setShowMember]  = useState(false)
  const [memberUsername, setMemberName]   = useState('')
  const [memberMsg, setMemberMsg]         = useState('')

  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', due_date: ''
  })

  useEffect(() => { fetchProject() }, [id])

  const fetchProject = async () => {
    const data = await getProject(token, id)
    setProject(data)
    setLoading(false)
    if (selectedTask) {
      const updated = data.tasks?.find(t => t.id === selectedTask.id)
      if (updated) setSelectedTask(updated)
    }
  }

  const getByStatus = (s) => project?.tasks?.filter(t => t.status === s) || []

  const handleAddTask = async (e) => {
    e.preventDefault()
    const data = await createTask(token, id, { ...taskForm, status: addToColumn })
    if (data.id) {
      setShowAddTask(false)
      setTaskForm({ title: '', description: '', priority: 'medium', due_date: '' })
      fetchProject()
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    await deleteTask(token, id, taskId)
    setSelectedTask(null)
    fetchProject()
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    const data = await addMember(token, id, memberUsername)
    setMemberMsg(data.message || data.error || 'Something went wrong')
    if (data.message) { setMemberName(''); fetchProject() }
  }

  if (loading) return <div className="loading-state">Loading project...</div>
  if (!project) return <div className="loading-state">Project not found 😕</div>

  const isOwner = project.owner?.id === user?.id
  const progress = project.tasks_count > 0
    ? Math.round((project.completed_tasks_count / project.tasks_count) * 100)
    : 0

  return (
    <div className="project-detail">
      <div className="project-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Go Back</button>
        <div className="project-title-row">
          <div>
            <h1>{project.name}</h1>
            {project.description && <p className="project-desc">{project.description}</p>}
          </div>
          <div className="project-actions">
            {isOwner && (
              <button className="btn-secondary" onClick={() => setShowMember(true)}>👥 Add Member</button>
            )}
            <button className="btn-primary" onClick={() => { setAddToColumn('todo'); setShowAddTask(true) }}>
              + Add Task
            </button>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span>{project.completed_tasks_count}/{project.tasks_count} tasks completed</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {project.members?.length > 0 && (
          <div className="members-row">
            <span className="members-label">Team:</span>
            <div className="member-chip owner-chip" title={project.owner?.username}>
              {project.owner?.username[0].toUpperCase()}
            </div>
            {project.members.map(m => (
              <div key={m.id} className="member-chip" title={m.username}>
                {m.username[0].toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="kanban-board">
        {COLUMNS.map(col => (
          <div key={col.key} className="kanban-col">
            <div className="col-header" style={{ borderTopColor: col.color }}>
              <span>{col.label}</span>
              <span className="task-count">{getByStatus(col.key).length}</span>
            </div>
            <div className="col-tasks">
              {getByStatus(col.key).map(task => (
                <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
              ))}
            </div>
            <button className="add-task-btn" onClick={() => { setAddToColumn(col.key); setShowAddTask(true) }}>
              + Task
            </button>
          </div>
        ))}
      </div>

      {showAddTask && (
        <Modal title="Add New Task" onClose={() => setShowAddTask(false)}>
          <form onSubmit={handleAddTask} className="modal-form">
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="What needs to be done?"
                required autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={taskForm.description}
                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Describe the task..."
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add Task</button>
            </div>
          </form>
        </Modal>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          token={token}
          projectId={id}
          user={user}
          project={project}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
          onRefresh={fetchProject}
        />
      )}

      {showMemberModal && (
        <Modal title="Add Team Member" onClose={() => { setShowMember(false); setMemberMsg('') }}>
          <form onSubmit={handleAddMember} className="modal-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={memberUsername}
                onChange={e => setMemberName(e.target.value)}
                placeholder="Enter exact username"
                required autoFocus
              />
            </div>
            {memberMsg && (
              <div className={memberMsg.toLowerCase().includes('added') ? 'success-msg' : 'error-msg'}>
                {memberMsg}
              </div>
            )}
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Add Member</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ProjectDetail
