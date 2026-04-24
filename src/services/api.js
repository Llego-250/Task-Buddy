import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
})

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const taskApi = {
    getAll:       ()            => http.get('/tasks'),
    getById:      (id)          => http.get(`/tasks/${id}`),
    create:       (payload)     => http.post('/tasks', payload),
    update:       (id, payload) => http.put(`/tasks/${id}`, payload),
    remove:       (id)          => http.delete(`/tasks/${id}`),
    toggle:       (id)          => http.patch(`/tasks/${id}/toggle`),
    updateTimer:  (id, seconds) => http.patch(`/tasks/${id}/timer`, null, { params: { seconds } }),
    search:       (q)           => http.get('/tasks/search', { params: { q } }),
    filter:       (params)      => http.get('/tasks/filter', { params }),
    getOverdue:   ()            => http.get('/tasks/overdue'),
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationApi = {
    create:    (payload) => http.post('/notifications', payload),
    getUnread: ()        => http.get('/notifications/unread'),
    getDue:    ()        => http.get('/notifications/due'),
    markRead:  (id)      => http.patch(`/notifications/${id}/read`),
    remove:    (id)      => http.delete(`/notifications/${id}`),
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsApi = {
    getSummary: () => http.get('/analytics/summary'),
}
