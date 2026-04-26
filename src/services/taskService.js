const API_BASE = 'http://localhost:8080/api'

function authHeaders() {
  const token = localStorage.getItem('pt_token')
  return token
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

export const COLUMNS = [
  { id: 'todo',       label: 'To Do',       color: 'text-gray-700' },
  { id: 'inprogress', label: 'In Progress', color: 'text-blue-500' },
  { id: 'inreview',   label: 'In Review',   color: 'text-orange-500' },
  { id: 'done',       label: 'Done',        color: 'text-green-500' },
]

export const PRIORITIES = ['High', 'Medium', 'Low']
export const CATEGORIES = ['Design', 'Development', 'Marketing', 'Research', 'Other']

// API Service
export const taskAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE}/tasks`, { headers: authHeaders() })
    if (!response.ok) throw new Error(`Server error: ${response.status}`)
    return response.json()
  },

  async getKanban() {
    const response = await fetch(`${API_BASE}/tasks/kanban`, { headers: authHeaders() })
    return response.json()
  },

  async create(task) {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(task)
    })
    return response.json()
  },

  async update(id, task) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(task)
    })
    return response.json()
  },

  async move(id, columnId) {
    const response = await fetch(`${API_BASE}/tasks/${id}/move?columnId=${columnId}`, {
      method: 'PATCH',
      headers: authHeaders()
    })
    return response.json()
  },

  async delete(id) {
    await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE', headers: authHeaders() })
  },

  async search(query) {
    const response = await fetch(`${API_BASE}/tasks/search?q=${encodeURIComponent(query)}`, { headers: authHeaders() })
    return response.json()
  },

  async filter(params) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE}/tasks/filter?${query}`, { headers: authHeaders() })
    return response.json()
  }
}

export const analyticsAPI = {
  async getSummary() {
    const response = await fetch(`${API_BASE}/analytics/summary`, { headers: authHeaders() })
    return response.json()
  }
}

export const MESSAGES = [
  { id: 1, name: 'Microsoft Team', icon: 'teams',     badge: 0 },
  { id: 2, name: 'Slack',          icon: 'slack',     badge: 0 },
  { id: 3, name: 'GitHub',         icon: 'github',    badge: 2 },
  { id: 4, name: 'Messenger',      icon: 'messenger', badge: 0 },
  { id: 5, name: 'Gmail',          icon: 'gmail',     badge: 0 },
  { id: 6, name: 'Discord',        icon: 'discord',   badge: 0 },
]
