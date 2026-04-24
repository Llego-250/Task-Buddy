<template>
  <div class="flex flex-col gap-6 p-6 flex-1 overflow-y-auto" :class="store.darkMode ? 'bg-gray-900' : 'bg-gray-50'">

    <!-- Stats row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-400 font-medium">{{ stat.label }}</p>
          <span class="text-lg">{{ stat.icon }}</span>
        </div>
        <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
        <div class="w-full bg-gray-100 rounded-full h-1.5">
          <div class="h-1.5 rounded-full transition-all" :class="stat.barColor" :style="{ width: stat.pct + '%' }"></div>
        </div>
        <p class="text-xs" :class="stat.textColor">{{ stat.sub }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Priority Breakdown -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 class="font-semibold text-gray-700 mb-4 text-sm">Priority Breakdown</h2>
        <div class="flex flex-col gap-3">
          <div v-for="p in priorityBreakdown" :key="p.label" class="flex items-center gap-3">
            <span class="text-xs font-semibold w-14" :class="p.color">{{ p.label }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-2">
              <div class="h-2 rounded-full" :class="p.bar" :style="{ width: p.pct + '%' }"></div>
            </div>
            <span class="text-xs text-gray-500 w-4 text-right">{{ p.count }}</span>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 class="font-semibold text-gray-700 mb-4 text-sm">By Category</h2>
        <div class="flex flex-col gap-2">
          <div v-for="c in categoryBreakdown" :key="c.label" class="flex items-center justify-between">
            <span class="text-xs text-gray-600">{{ c.label }}</span>
            <div class="flex items-center gap-2">
              <div class="w-20 bg-gray-100 rounded-full h-1.5">
                <div class="h-1.5 rounded-full bg-blue-400" :style="{ width: c.pct + '%' }"></div>
              </div>
              <span class="text-xs text-gray-400 w-4 text-right">{{ c.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Completion Rate -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3">
        <h2 class="font-semibold text-gray-700 text-sm self-start">Completion Rate</h2>
        <div class="relative w-28 h-28">
          <svg class="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" stroke-width="3"
              stroke-dasharray="100" :stroke-dashoffset="100 - completionRate"
              stroke-linecap="round" style="transition: stroke-dashoffset 0.6s ease"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-2xl font-bold text-gray-800">{{ completionRate }}%</span>
            <span class="text-xs text-gray-400">Done</span>
          </div>
        </div>
        <p class="text-xs text-gray-400">{{ store.tasksByColumn['done']?.length || 0 }} of {{ store.tasks.length }} tasks</p>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="font-semibold text-gray-700 text-sm">Recent Tasks</h2>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-50 text-left">
            <th class="px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Task</th>
            <th class="px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
            <th class="px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Priority</th>
            <th class="px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in recentTasks" :key="task.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td class="px-5 py-3">
              <div class="flex items-center gap-2">
                <img v-if="task.assignee" :src="task.assignee.avatar" class="w-6 h-6 rounded-full object-cover" />
                <span class="font-medium text-gray-700">{{ task.title || task.assignee?.name || 'Untitled' }}</span>
              </div>
            </td>
            <td class="px-5 py-3">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="colClass(task.columnId)">{{ colLabel(task.columnId) }}</span>
            </td>
            <td class="px-5 py-3">
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold" :class="priorityClass(task.priority)">{{ task.priority }}</span>
            </td>
            <td class="px-5 py-3 text-xs text-gray-400">{{ task.category || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'

const store = useTaskStore()
const total = computed(() => store.tasks.length || 1)
const recentTasks = computed(() => store.tasks.slice(0, 8))

const completionRate = computed(() =>
  Math.round(((store.tasksByColumn['done']?.length || 0) / total.value) * 100)
)

const stats = computed(() => [
  { label: 'Total Tasks',  value: store.tasks.length, icon: '📋', pct: 100, barColor: 'bg-blue-400', textColor: 'text-blue-500', sub: 'All tasks' },
  { label: 'To Do',        value: store.tasksByColumn['todo']?.length || 0, icon: '📌', pct: Math.round(((store.tasksByColumn['todo']?.length||0)/total.value)*100), barColor: 'bg-gray-400', textColor: 'text-gray-500', sub: 'Pending' },
  { label: 'In Progress',  value: store.tasksByColumn['inprogress']?.length || 0, icon: '⚡', pct: Math.round(((store.tasksByColumn['inprogress']?.length||0)/total.value)*100), barColor: 'bg-blue-500', textColor: 'text-blue-500', sub: 'Active' },
  { label: 'Done',         value: store.tasksByColumn['done']?.length || 0, icon: '✅', pct: completionRate.value, barColor: 'bg-green-400', textColor: 'text-green-500', sub: `${completionRate.value}% complete` },
])

const priorityBreakdown = computed(() => {
  const counts = { High: 0, Medium: 0, Low: 0 }
  store.tasks.forEach(t => { if (counts[t.priority] !== undefined) counts[t.priority]++ })
  const max = Math.max(...Object.values(counts), 1)
  return [
    { label: 'High',   count: counts.High,   pct: Math.round((counts.High/max)*100),   color: 'text-red-500',    bar: 'bg-red-400' },
    { label: 'Medium', count: counts.Medium, pct: Math.round((counts.Medium/max)*100), color: 'text-yellow-500', bar: 'bg-yellow-400' },
    { label: 'Low',    count: counts.Low,    pct: Math.round((counts.Low/max)*100),    color: 'text-green-500',  bar: 'bg-green-400' },
  ]
})

const categoryBreakdown = computed(() => {
  const counts = {}
  store.tasks.forEach(t => { if (t.category) counts[t.category] = (counts[t.category] || 0) + 1 })
  const max = Math.max(...Object.values(counts), 1)
  return Object.entries(counts).map(([label, count]) => ({ label, count, pct: Math.round((count/max)*100) }))
})

const colMap = {
  todo:       { label: 'To Do',       cls: 'bg-gray-100 text-gray-600' },
  inprogress: { label: 'In Progress', cls: 'bg-blue-100 text-blue-600' },
  inreview:   { label: 'In Review',   cls: 'bg-orange-100 text-orange-600' },
  done:       { label: 'Done',        cls: 'bg-green-100 text-green-600' },
}
const colLabel = id => colMap[id]?.label || id
const colClass  = id => colMap[id]?.cls || ''
const priorityClass = p => ({ High: 'bg-red-100 text-red-600', Medium: 'bg-yellow-100 text-yellow-600', Low: 'bg-green-100 text-green-600' }[p] || '')
</script>
