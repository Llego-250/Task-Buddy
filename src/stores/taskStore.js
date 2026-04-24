import { defineStore } from 'pinia'
import { taskApi, notificationApi } from '../services/api'

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        tasks: [],
        notifications: [],
        loading: false,
        error: null,
    }),

    getters: {
        activeTasks: (state) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return state.tasks.filter(t => {
                if (t.completed) return false
                return new Date(t.dueDate) >= today
            })
        },
        completedTasks: (state) => state.tasks.filter(t => t.completed),
        overdueTasks: (state) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return state.tasks.filter(t => {
                if (t.completed) return false
                return new Date(t.dueDate) < today
            })
        },
    },

    actions: {
        // ── CRUD ──────────────────────────────────────────────────────────────
        async fetchTasks() {
            this.loading = true
            try {
                const { data } = await taskApi.getAll()
                this.tasks = data
            } catch (e) {
                this.error = e.message
            } finally {
                this.loading = false
            }
        },

        async addTask(taskPayload) {
            const { data } = await taskApi.create(this._toRequest(taskPayload))
            this.tasks.push(data)
            if (taskPayload.recurring?.enabled) this._createRecurringTasks(data)
        },

        async updateTask(updatedTask) {
            const { data } = await taskApi.update(updatedTask.id, this._toRequest(updatedTask))
            const idx = this.tasks.findIndex(t => t.id === updatedTask.id)
            if (idx !== -1) this.tasks.splice(idx, 1, data)
        },

        async deleteTask(taskId) {
            await taskApi.remove(taskId)
            this.tasks = this.tasks.filter(t => t.id !== taskId)
        },

        async completeTask(taskId) {
            const { data } = await taskApi.toggle(taskId)
            const idx = this.tasks.findIndex(t => t.id === taskId)
            if (idx !== -1) this.tasks.splice(idx, 1, data)
        },

        async updateTaskTime(taskId, seconds) {
            const { data } = await taskApi.updateTimer(taskId, seconds)
            const idx = this.tasks.findIndex(t => t.id === taskId)
            if (idx !== -1) this.tasks.splice(idx, 1, data)
        },

        // ── Bulk ──────────────────────────────────────────────────────────────
        async bulkComplete(taskIds) {
            await Promise.all(taskIds.map(id => taskApi.toggle(id)))
            await this.fetchTasks()
        },

        async bulkDelete(taskIds) {
            await Promise.all(taskIds.map(id => taskApi.remove(id)))
            this.tasks = this.tasks.filter(t => !taskIds.includes(t.id))
        },

        async bulkCategoryChange(taskIds, category) {
            const updates = taskIds.map(id => {
                const task = this.tasks.find(t => t.id === id)
                return task ? taskApi.update(id, this._toRequest({ ...task, category })) : null
            }).filter(Boolean)
            await Promise.all(updates)
            await this.fetchTasks()
        },

        // ── Notifications ─────────────────────────────────────────────────────
        async checkUpcomingDeadlines() {
            try {
                const { data } = await notificationApi.getDue()
                data.forEach(n => this.notifications.push({ id: n.id, message: n.message }))
            } catch {
                // fallback: local check
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                this.tasks
                    .filter(t => !t.completed && new Date(t.dueDate).toDateString() === tomorrow.toDateString())
                    .forEach(t => this.notifications.push({ id: Date.now() + Math.random(), message: `Reminder: "${t.title}" is due tomorrow!` }))
            }
        },

        addNotification(message) {
            this.notifications.push({ id: Date.now() + Math.random(), message })
        },

        dismissNotification(id) {
            this.notifications = this.notifications.filter(n => n.id !== id)
        },

        // ── Misc ──────────────────────────────────────────────────────────────
        handleReorder() { /* visual only — no backend order field */ },

        async updateTaskCategory(taskId, category) {
            const task = this.tasks.find(t => t.id === taskId)
            if (!task) return
            const updated = { ...task, category, completed: category === 'completed' }
            await this.updateTask(updated)
        },

        // ── Helpers ───────────────────────────────────────────────────────────
        _toRequest(task) {
            return {
                title:          task.title,
                description:    task.description || '',
                priority:       (task.priority || 'medium').toUpperCase(),
                category:       task.category || 'work',
                dueDate:        task.dueDate ? new Date(task.dueDate).toISOString() : null,
                estimatedHours: task.estimatedHours || 0,
                recurring:      task.recurring || { enabled: false, type: 'daily', interval: 1 },
                dependencies:   task.dependencies || [],
                subtasks:       (task.subtasks || []).map(s => ({
                    title:     s.title,
                    completed: s.completed || false,
                    hours:     s.hours || 0,
                })),
            }
        },

        async _createRecurringTasks(baseTask) {
            const { type, interval } = baseTask.recurring
            const baseDate = new Date(baseTask.dueDate)
            for (let i = 1; i <= 5; i++) {
                const newDate = new Date(baseDate)
                if (type === 'daily')        newDate.setDate(baseDate.getDate() + i * interval)
                else if (type === 'weekly')  newDate.setDate(baseDate.getDate() + i * interval * 7)
                else if (type === 'monthly') newDate.setMonth(baseDate.getMonth() + i * interval)
                await taskApi.create(this._toRequest({ ...baseTask, dueDate: newDate }))
            }
            await this.fetchTasks()
        },
    },
})
