import { useState, useEffect } from 'react'
import { addComment, deleteComment, updateTask } from '../api'

const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' }

const STATUS_OPTIONS = [
  { value: 'todo',        label: '📋 To Do' },
  { value: 'in_progress', label: '⚡ In Progress' },
  { value: 'done',        label: '✅ Done' },
]

function TaskModal({ task, token, projectId, user, onClose, onDelete, onRefresh }) {
  const [localTask, setLocalTask]   = useState(task)
  const [commentText, setComment]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving]         = useState(false)

  useEffect(() => { setLocalTask(task) }, [task])

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const handleStatusChange = async (newStatus) => {
    if (newStatus === localTask.status) return
    setSaving(true)
    setLocalTask(prev => ({ ...prev, status: newStatus }))
    await updateTask(token, projectId, task.id, { status: newStatus })
    setSaving(false)
    onRefresh()
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    const newComment = await addComment(token, projectId, task.id, commentText)
    if (newComment.id) {
      setLocalTask(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }))
      setComment('')
    }
    setSubmitting(false)
    onRefresh()
  }

  const handleDeleteComment = async (commentId) => {
    await deleteComment(token, projectId, task.id, commentId)
    setLocalTask(prev => ({ ...prev, comments: prev.comments.filter(c => c.id !== commentId) }))
    onRefresh()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="task-modal-title">
            <span className="task-modal-priority">{PRIORITY_LABELS[localTask.priority]}</span>
            <h2>{localTask.title}</h2>
          </div>
          <div className="task-modal-header-actions">
            <button className="btn-danger-sm" onClick={() => onDelete(task.id)}>🗑️</button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="task-modal-body">
          <div className="task-modal-left">
            {localTask.description && (
              <div className="task-section">
                <h4>Description</h4>
                <p>{localTask.description}</p>
              </div>
            )}

            <div className="task-section">
              <h4>Status {saving && <span style={{ color: '#6366f1' }}>saving...</span>}</h4>
              <div className="status-buttons">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`status-btn ${localTask.status === opt.value ? 'active' : ''}`}
                    onClick={() => handleStatusChange(opt.value)}
                    disabled={saving}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="task-meta">
              {localTask.assigned_to && (
                <div className="meta-item">
                  <span className="meta-label">Assigned to:</span>
                  <span>{localTask.assigned_to.username}</span>
                </div>
              )}
              {localTask.due_date && (
                <div className="meta-item">
                  <span className="meta-label">Due date:</span>
                  <span>{new Date(localTask.due_date).toLocaleDateString('en-IN')}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Created by:</span>
                <span>{localTask.created_by?.username}</span>
              </div>
            </div>
          </div>

          <div className="task-modal-right">
            <h4>Comments ({localTask.comments?.length || 0})</h4>

            <div className="comments-list">
              {!localTask.comments?.length ? (
                <p className="no-comments">No comments yet. Be the first! 💬</p>
              ) : (
                localTask.comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-avatar">{comment.author?.username[0].toUpperCase()}</div>
                      <div className="comment-meta">
                        <span className="comment-author">{comment.author?.username}</span>
                        <span className="comment-time">{new Date(comment.created_at).toLocaleString('en-IN')}</span>
                      </div>
                      {comment.author?.id === user?.id && (
                        <button className="comment-delete" onClick={() => handleDeleteComment(comment.id)}>✕</button>
                      )}
                    </div>
                    <p className="comment-body">{comment.body}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={commentText}
                onChange={e => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
              />
              <button type="submit" className="btn-primary" disabled={submitting || !commentText.trim()}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
