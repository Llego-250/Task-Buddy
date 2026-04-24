import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { INITIAL_TASKS, COLUMNS } from '../services/taskService'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref(JSON.parse(localStorage.getItem('pt_tasks') || 'null') || INITIAL_TASKS)
  const darkMode = ref(localStorage.getItem('pt_dark') === 'true')
  const activeView = ref('table')
  const searchQuery = ref('')
  const filterPriority = ref('')
  const filterCategory = ref('')

  const save = () => localStorage.setItem('pt_tasks', JSON.stringify(tasks.value))

  const tasksByColumn = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return COLUMNS.reduce((acc, col) => {
      acc[col.id] = tasks.value.filter(t => {
        if (t.columnId !== col.id) return false
        if (filterPriority.value && t.priority !== filterPriority.value) return false
        if (filterCategory.value && t.category !== filterCategory.value) return false
        if (q) {
          const name = t.title || t.assignee?.name || ''
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
        const name = t.title || t.assignee?.name || ''
        const desc = t.description || ''
        return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
      }
      return true
    })
  })

  function addTask(task) {
    tasks.value.push({ id: Date.now(), ...task })
    save()
  }

  function updateTask(id, patch) {
    const t = tasks.value.find(t => t.id === id)
    if (t) { Object.assign(t, patch); save() }
  }

  function moveTask(taskId, toColumnId) {
    const t = tasks.value.find(t => t.id === taskId)
    if (t) { t.columnId = toColumnId; save() }
  }

  function deleteTask(taskId) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    save()
  }

  function toggleDark() {
    darkMode.value = !darkMode.value
    localStorage.setItem('pt_dark', darkMode.value)
  }

  return {
    tasks, darkMode, activeView,
    searchQuery, filterPriority, filterCategory,
    tasksByColumn, allFiltered,
    addTask, updateTask, moveTask, deleteTask, toggleDark,
  }
})
