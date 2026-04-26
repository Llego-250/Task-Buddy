const API_BASE = 'http://localhost:8080/api'

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
    const response = await fetch(`${API_BASE}/tasks`)
    return response.json()
  },

  async getKanban() {
    const response = await fetch(`${API_BASE}/tasks/kanban`)
    return response.json()
  },

  async create(task) {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    return response.json()
  },

  async update(id, task) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    return response.json()
  },

  async move(id, columnId) {
    const response = await fetch(`${API_BASE}/tasks/${id}/move?columnId=${columnId}`, {
      method: 'PATCH'
    })
    return response.json()
  },

  async delete(id) {
    await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
  },

  async search(query) {
    const response = await fetch(`${API_BASE}/tasks/search?q=${encodeURIComponent(query)}`)
    return response.json()
  },

  async filter(params) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE}/tasks/filter?${query}`)
    return response.json()
  }
}

export const INITIAL_TASKS = [
  {
    id: 1, columnId: 'todo',
    title: null,
    assigneeName: 'Darlene Robertson', assigneeAvatar: 'https://i.pravatar.cc/32?img=1',
    date: '02/24  12:11 PM', dueDate: '',
    description: 'Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...',
    channelName: 'GitHub', channelIcon: 'github',
    memberAvatars: ['https://i.pravatar.cc/24?img=2','https://i.pravatar.cc/24?img=3'],
    extraMembers: 5, image: null,
    priority: 'High', category: 'Development',
  },
  {
    id: 2, columnId: 'todo',
    title: null,
    assigneeName: 'Savannah Nguyen', assigneeAvatar: 'https://i.pravatar.cc/32?img=5',
    date: '04/24  1:14 PM', dueDate: '',
    description: null,
    channelName: 'Gmail', channelIcon: 'gmail',
    memberAvatars: ['https://i.pravatar.cc/24?img=6'],
    extraMembers: 0, image: null,
    priority: 'Medium', category: 'Marketing',
  },
  {
    id: 3, columnId: 'todo',
    title: null,
    assigneeName: 'Darlene Robertson', assigneeAvatar: 'https://i.pravatar.cc/32?img=1',
    date: '11/23  2:44 AM', dueDate: '',
    description: 'Lorem Ipsum is simply dummy text into a printing and typesetting.',
    channelName: 'Discord', channelIcon: 'discord',
    memberAvatars: ['https://i.pravatar.cc/24?img=7','https://i.pravatar.cc/24?img=8'],
    extraMembers: 3, image: null,
    priority: 'Low', category: 'Other',
  },
  {
    id: 4, columnId: 'inprogress',
    title: null,
    assigneeName: 'Leslie Alexander', assigneeAvatar: 'https://i.pravatar.cc/32?img=9',
    date: '02/22  09:33 AM', dueDate: '',
    description: 'Do the best password option when login & send email for doting this...',
    channelName: 'Slack', channelIcon: 'slack',
    memberAvatars: ['https://i.pravatar.cc/24?img=10'],
    extraMembers: 0, image: null,
    priority: 'High', category: 'Development',
  },
  {
    id: 5, columnId: 'inprogress',
    title: 'Graphic Design Work',
    assigneeName: null, assigneeAvatar: null,
    date: '02/22  09:33 AM', dueDate: '',
    description: null,
    channelName: 'Messenger', channelIcon: 'messenger',
    memberAvatars: ['https://i.pravatar.cc/24?img=11','https://i.pravatar.cc/24?img=12'],
    extraMembers: 0,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=160&fit=crop',
    priority: 'Medium', category: 'Design',
  },
  {
    id: 6, columnId: 'inreview',
    title: 'Brand Guideline Design',
    assigneeName: null, assigneeAvatar: null,
    date: '02/22  09:33 AM', dueDate: '',
    description: null,
    channelName: 'Gmail', channelIcon: 'gmail',
    memberAvatars: ['https://i.pravatar.cc/24?img=13'],
    extraMembers: 0, image: null,
    priority: 'High', category: 'Design',
  },
  {
    id: 7, columnId: 'inreview',
    title: 'Competitor Analysis',
    assigneeName: null, assigneeAvatar: null,
    date: '02/22  09:33 AM', dueDate: '',
    description: 'Do the best password option when login & send email for doting this...',
    channelName: 'GitHub', channelIcon: 'github',
    memberAvatars: ['https://i.pravatar.cc/24?img=14'],
    extraMembers: 0, image: null,
    priority: 'Medium', category: 'Research',
  },
  {
    id: 8, columnId: 'inreview',
    title: 'Design System Work',
    assigneeName: null, assigneeAvatar: null,
    date: '02/22  09:33 AM', dueDate: '',
    description: null,
    channelName: 'Messenger', channelIcon: 'messenger',
    memberAvatars: ['https://i.pravatar.cc/24?img=15'],
    extraMembers: 0,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=160&fit=crop',
    priority: 'Low', category: 'Design',
  },
  {
    id: 9, columnId: 'done',
    title: 'Component Making Work',
    assigneeName: null, assigneeAvatar: null,
    date: '12/22  6:16 PM', dueDate: '',
    description: null,
    channelName: 'Microsoft Team', channelIcon: 'teams',
    memberAvatars: ['https://i.pravatar.cc/24?img=16'],
    extraMembers: 0,
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=160&fit=crop',
    priority: 'High', category: 'Development',
  },
  {
    id: 10, columnId: 'done',
    title: null,
    assigneeName: 'Brooklyn Simmons', assigneeAvatar: 'https://i.pravatar.cc/32?img=17',
    date: '11/23  4:28 PM', dueDate: '',
    description: 'Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...',
    channelName: 'Slack', channelIcon: 'slack',
    memberAvatars: ['https://i.pravatar.cc/24?img=18','https://i.pravatar.cc/24?img=19'],
    extraMembers: 2, image: null,
    priority: 'Low', category: 'Marketing',
  },
]

export const MESSAGES = [
  { id: 1, name: 'Microsoft Team', icon: 'teams',     badge: 0 },
  { id: 2, name: 'Slack',          icon: 'slack',     badge: 0 },
  { id: 3, name: 'GitHub',         icon: 'github',    badge: 2 },
  { id: 4, name: 'Messenger',      icon: 'messenger', badge: 0 },
  { id: 5, name: 'Gmail',          icon: 'gmail',     badge: 0 },
  { id: 6, name: 'Discord',        icon: 'discord',   badge: 0 },
]
