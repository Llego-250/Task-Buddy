import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { INITIAL_TASKS, COLUMNS, taskAPI } from '../services/taskService'

export const useTaskStore = defineStore('task', () => {
  const normalizeTask = (task) => ({
    ...task,
    title: task.title || task.assigneeName || 'Untitled',
    // Convert backend format to frontend format
    assignee: task.assigneeName ? { name: task.assigneeName, avatar: task.assigneeAvatar } : null,
    channel: task.channelName ? { name: task.channelName, icon: task.channelIcon } : null,
    members: task.memberAvatars || [],
    extraMembers: task.extraMembers || 0,
  })

  const tasks = ref([])
  const darkMode = ref(localStorage.getItem('pt_dark') === 'true')
  const activeView = ref('table')
  const searchQuery = ref('')
  const filterPriority = ref('')
  const filterCategory = ref('')
  const loading = ref(false)

  const tasksByColumn = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return COLUMNS.reduce((acc, col) => {
      acc[col.id] = tasks.value.filter(t => {
        if (t.columnId !== col.id) return false
        if (filterPriority.value && t.priority !== filterPriority.value) return false
        if (filterCategory.value && t.category !== filterCategory.value) return false
        if (q) {
          const name = t.title || ''
          const desc = t.description || ''
          return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
        }
        return true
      })
      return acc
    }, {})
  })

  const allFiltered = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return tasks.value.filter(t => {
      if (filterPriority.value && t.priority !== filterPriority.value) return false
      if (filterCategory.value && t.category !== filterCategory.value) return false
      if (q) {
        const name = t.title || ''
        const desc = t.description || ''
        return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
      }
      return true
    })
  })

  async function loadTasks() {
    try {
      loading.value = true
      const data = await taskAPI.getAll()
      tasks.value = data.map(normalizeTask)
    } catch (error) {
      console.error('Failed to load tasks:', error)
      // Fallback to initial tasks if API fails
      tasks.value = INITIAL_TASKS.map(normalizeTask)
    } finally {
      loading.value = false
    }
  }

  async function addTask(task) {
    try {
      loading.value = true
      const newTask = await taskAPI.create({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        columnId: task.columnId,
        dueDate: task.dueDate,
        channelName: 'GitHub',
        channelIcon: 'github'
      })
      tasks.value.push(normalizeTask(newTask))
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id, patch) {
    try {
      loading.value = true
      const updated = await taskAPI.update(id, patch)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = normalizeTask(updated)
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      loading.value = false
    }
  }

  async function moveTask(taskId, toColumnId) {
    try {
      loading.value = true
      const updated = await taskAPI.move(taskId, toColumnId)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = normalizeTask(updated)
      }
    } catch (error) {
      console.error('Failed to move task:', error)
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(taskId) {
    try {
      loading.value = true
      await taskAPI.delete(taskId)
      tasks.value = tasks.value.filter(t => t.id !== taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
    } finally {
      loading.value = false
    }
  }

  function toggleDark() {
    darkMode.value = !darkMode.value
    localStorage.setItem('pt_dark', darkMode.value)
  }

  // Initialize tasks on store creation
  loadTasks()

  return {
    tasks, darkMode, activeView, loading,
    searchQuery, filterPriority, filterCategory,
    tasksByColumn, allFiltered,
    loadTasks, addTask, updateTask, moveTask, deleteTask, toggleDark,
  }
})
