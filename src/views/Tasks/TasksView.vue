<template>
  <div class="flex flex-col h-full" :class="store.darkMode ? 'bg-gray-900' : 'bg-[#f6f7fb]'">
    <ServerDown v-if="store.serverError" />

    <template v-else>
    <!-- Sub-header -->
    <div class="flex items-center justify-between px-8 pt-4 pb-3 border-b shrink-0 flex-wrap gap-3 transition-colors" :class="store.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-[#f6f7fb] border-gray-200'">
      <!-- View Tabs -->
      <div class="flex items-center gap-1 rounded-xl p-1" :class="store.darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-sm'">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id
            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
            : store.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <div class="px-3 py-1.5 rounded-full text-sm font-semibold text-gray-600 bg-white border border-gray-200">
          My Workspace
        </div>
        <button @click="openCreate" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
          <span class="text-lg leading-none">+</span>
          Create Task
        </button>
      </div>
    </div>

    <!-- KANBAN VIEW -->
    <div v-if="activeTab === 'table'" class="flex gap-6 px-6 py-5 overflow-x-auto flex-1">
      <KanbanColumn
        v-for="col in COLUMNS"
        :key="col.id"
        :column="col"
        :tasks="store.tasksByColumn[col.id] || []"
        :dark="store.darkMode"
        @add="openCreate(col.id)"
        @edit="openEdit"
        @delete="store.deleteTask($event)"
        @preview="openPreview"
        @drop="onDrop"
      />
    </div>

    <!-- LIST VIEW -->
    <div v-else-if="activeTab === 'list'" class="flex-1 overflow-y-auto p-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 text-left">
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in store.allFiltered" :key="task.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <span class="font-medium text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" @click="openPreview(task)">{{ task.title || 'Untitled' }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="colClass(task.columnId)">{{ colLabel(task.columnId) }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold" :class="priorityClass(task.priority)">{{ task.priority }}</span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500">{{ task.category }}</td>
              <td class="px-4 py-3 text-xs text-gray-400">{{ task.date }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button @click="openEdit(task)" class="text-gray-400 hover:text-blue-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="store.deleteTask(task.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!store.allFiltered.length">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 text-sm">No tasks found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- KANBAN (same as table but labeled differently) -->
    <div v-else class="flex gap-6 px-6 py-5 overflow-x-auto flex-1">
      <KanbanColumn
        v-for="col in COLUMNS"
        :key="col.id"
        :column="col"
        :tasks="store.tasksByColumn[col.id] || []"
        :dark="store.darkMode"
        @add="openCreate(col.id)"
        @edit="openEdit"
        @delete="store.deleteTask($event)"
        @preview="openPreview"
        @drop="onDrop"
      />
    </div>

    <!-- CREATE / EDIT MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 modal-backdrop" @click.self="showModal = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl modal-content">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-gray-800">{{ editId ? 'Edit Task' : 'Create Task' }}</h2>
          <button @click="showModal = false" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <input v-model="form.title" placeholder="Task title" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          <textarea v-model="form.description" placeholder="Description (optional)" rows="3" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"></textarea>
          <div class="grid grid-cols-2 gap-3">
            <select v-model="form.columnId" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option v-for="col in COLUMNS" :key="col.id" :value="col.id">{{ col.label }}</option>
            </select>
            <select v-model="form.priority" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option v-for="p in PRIORITIES" :key="p" :value="p">{{ p }} Priority</option>
            </select>
            <select v-model="form.category" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="">No Category</option>
              <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
            </select>
            <input v-model="form.dueDate" type="date" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
        </div>
        <div class="flex gap-2 mt-5 justify-end">
          <button @click="showModal = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium">Cancel</button>
          <button @click="submitTask" class="px-5 py-2 text-sm bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            {{ editId ? 'Save Changes' : 'Create Task' }}
          </button>
        </div>
      </div>
    </div>

    <!-- TASK PREVIEW -->
    <div v-if="previewTask" class="fixed inset-0 bg-black/35 flex items-center justify-center z-50 modal-backdrop" @click.self="previewTask = null">
      <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl modal-content">
        <div class="flex items-start justify-between mb-4 gap-3">
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ previewTask.title || 'Untitled Task' }}</h2>
            <p class="text-xs text-gray-400 mt-1">{{ previewTask.date }}</p>
          </div>
          <button @click="previewTask = null" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs px-2 py-1 rounded-full font-semibold" :class="priorityClass(previewTask.priority)">{{ previewTask.priority }}</span>
          <span v-if="previewTask.category" class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{{ previewTask.category }}</span>
          <span class="text-xs px-2 py-1 rounded-full font-medium" :class="colClass(previewTask.columnId)">{{ colLabel(previewTask.columnId) }}</span>
        </div>

        <img v-if="previewTask.image" :src="previewTask.image" :alt="previewTask.title" class="w-full h-52 object-cover rounded-xl mb-4" />

        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p class="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{{ previewTask.description || 'No description added for this task yet.' }}</p>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { COLUMNS, PRIORITIES, CATEGORIES } from '../../services/taskService'
import KanbanColumn from '../../components/KanbanColumn.vue'
import ServerDown from '../../components/ServerDown.vue'

const store = useTaskStore()
const activeTab = ref('table')
const showModal = ref(false)
const editId = ref(null)
const previewTask = ref(null)

const defaultForm = () => ({ title: '', description: '', columnId: 'todo', priority: 'Medium', category: '', dueDate: '' })
const form = ref(defaultForm())

// Tab icons
const TableIcon  = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M3 14h18M10 4v16M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z' })]) }
const ListIcon   = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 10h16M4 14h16M4 18h16' })]) }
const KanbanIcon = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' })]) }

const tabs = [
  { id: 'table',  label: 'Table',     icon: TableIcon },
  { id: 'list',   label: 'List View', icon: ListIcon },
  { id: 'kanban', label: 'Kanban',    icon: KanbanIcon },
]

const colMap = {
  todo:       { label: 'To Do',       cls: 'bg-gray-100 text-gray-600' },
  inprogress: { label: 'In Progress', cls: 'bg-blue-100 text-blue-600' },
  inreview:   { label: 'In Review',   cls: 'bg-orange-100 text-orange-600' },
  done:       { label: 'Done',        cls: 'bg-green-100 text-green-600' },
}
const colLabel = id => colMap[id]?.label || id
const colClass  = id => colMap[id]?.cls || ''
const priorityClass = p => ({ High: 'bg-red-100 text-red-600', Medium: 'bg-yellow-100 text-yellow-600', Low: 'bg-green-100 text-green-600' }[p] || '')

function openCreate(colId = 'todo') {
  editId.value = null
  form.value = defaultForm()
  form.value.columnId = colId
  showModal.value = true
}

function openEdit(task) {
  editId.value = task.id
  form.value = {
    title: task.title || '',
    description: task.description || '',
    columnId: task.columnId,
    priority: task.priority || 'Medium',
    category: task.category || '',
    dueDate: task.dueDate || '',
  }
  showModal.value = true
}

function submitTask() {
  if (!form.value.title.trim()) return
  if (editId.value) {
    store.updateTask(editId.value, {
      title: form.value.title,
      description: form.value.description || null,
      columnId: form.value.columnId,
      priority: form.value.priority,
      category: form.value.category,
      dueDate: form.value.dueDate,
    })
  } else {
    store.addTask({
      title: form.value.title,
      description: form.value.description || null,
      columnId: form.value.columnId,
      priority: form.value.priority,
      category: form.value.category,
      dueDate: form.value.dueDate,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) + '  ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      channel: { name: 'GitHub', icon: 'github' },
      image: null,
    })
  }
  showModal.value = false
}

function openPreview(task) {
  previewTask.value = task
}

function onDrop({ taskId, colId }) {
  store.moveTask(taskId, colId)
}
</script>
