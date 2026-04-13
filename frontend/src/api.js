const BASE_URL = 'http://localhost:8000/api'

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Token ${token}`,
})


export const registerUser = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  return res.json()
}

export const loginUser = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return res.json()
}

export const logoutUser = async (token) => {
  await fetch(`${BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: authHeaders(token),
  })
}

// project


export const getProjects = async (token) => {
  const res = await fetch(`${BASE_URL}/projects/`, { headers: authHeaders(token) })
  return res.json()
}

export const getProject = async (token, id) => {
  const res = await fetch(`${BASE_URL}/projects/${id}/`, { headers: authHeaders(token) })
  return res.json()
}

export const createProject = async (token, data) => {
  const res = await fetch(`${BASE_URL}/projects/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const updateProject = async (token, id, data) => {
  const res = await fetch(`${BASE_URL}/projects/${id}/`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteProject = async (token, id) => {
  await fetch(`${BASE_URL}/projects/${id}/`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export const addMember = async (token, projectId, username) => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/add-member/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ username }),
  })
  return res.json()
}

// task!


export const getTasks = async (token, projectId) => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/`, { headers: authHeaders(token) })
  return res.json()
}

export const createTask = async (token, projectId, data) => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const updateTask = async (token, projectId, taskId, data) => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}/`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteTask = async (token, projectId, taskId) => {
  await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}/`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}


export const addComment = async (token, projectId, taskId, body) => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ body }),
  })
  return res.json()
}

export const deleteComment = async (token, projectId, taskId, commentId) => {
  await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}/`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}
