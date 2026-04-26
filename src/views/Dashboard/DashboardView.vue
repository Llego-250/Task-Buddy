<template>
  <div class="dashboard-page p-4 md:p-5">
    <ServerDown v-if="store.serverError" />

    <template v-else>
    <div class="dashboard-topbar">
      <div>
        <h2 class="dashboard-welcome">Welcome back, {{ userName }}! 👋</h2>
        <p class="dashboard-subtitle">Here's what's happening with your today</p>
      </div>
      <div class="dashboard-toolbar">
        <div class="dashboard-search">
          <input v-model="search" placeholder="Search here..." />
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <section class="dashboard-card">
        <div class="dashboard-metrics">
          <div class="metric-card" v-for="metric in metrics" :key="metric.label" :class="metric.tone">
            <p class="metric-value">{{ metric.value }}</p>
            <p class="metric-label">{{ metric.label }}</p>
          </div>
        </div>
      </section>

      <section class="dashboard-card">
        <div class="dashboard-card-head">
          <div>
            <h3>Task Priority</h3>
            <p>Distribution by priority level</p>
          </div>
          <button class="dot-btn">...</button>
        </div>
        <div class="priority-visual">
          <div class="donut-chart"></div>
          <div class="priority-legend">
            <span><i class="dot high"></i>High Priority: {{ counts.high }}</span>
            <span><i class="dot medium"></i>Medium Priority: {{ counts.medium }}</span>
            <span><i class="dot low"></i>Low Priority: {{ counts.low }}</span>
          </div>
        </div>
      </section>

      <section class="dashboard-card">
        <div class="dashboard-card-head">
          <div>
            <h3>Task Status Distribution</h3>
          </div>
          <button class="dot-btn">...</button>
        </div>
        <div class="status-distribution">
          <div class="status-item">
            <p>In Progress</p>
            <strong>{{ statusRates.inProgress }}%</strong>
          </div>
          <div class="status-item">
            <p>Completed</p>
            <strong>{{ statusRates.completed }}%</strong>
          </div>
          <div class="status-item">
            <p>Overdue</p>
            <strong>{{ statusRates.overdue }}%</strong>
          </div>
        </div>
      </section>

      <section class="dashboard-card">
        <div class="dashboard-card-head">
          <div class="cal-nav">
            <button class="cal-arrow" @click="prevMonth">&#8249;</button>
            <div>
              <h3>Activity</h3>
              <p>{{ calendarTitle }}</p>
            </div>
            <button class="cal-arrow" @click="nextMonth" :disabled="isCurrentMonth">&#8250;</button>
          </div>
          <div class="activity-rate">{{ completionRate }}%</div>
        </div>

        <div class="cal-grid">
          <span class="cal-dow" v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{ d }}</span>
          <div
            v-for="(cell, i) in calendarCells"
            :key="i"
            class="cal-cell"
            :class="[
              cell ? `due-${cell.topPriority}` : 'cal-empty',
              cell?.isToday ? 'cal-today' : '',
              cell?.isOverdue ? 'cal-overdue' : ''
            ]"
            @mouseenter="hoveredCell = cell"
            @mouseleave="hoveredCell = null"
          >
            <span v-if="cell" class="cal-day-num">{{ cell.day }}</span>
            <span v-if="cell?.tasks.length" class="cal-dot-row">
              <i v-for="t in cell.tasks.slice(0, 3)" :key="t.id" :class="`pdot-${t.priority.toLowerCase()}`"></i>
            </span>

            <!-- Tooltip -->
            <div v-if="hoveredCell === cell && cell?.tasks.length" class="cal-tooltip">
              <p class="cal-tooltip-date">{{ cell.date }}</p>
              <div v-for="t in cell.tasks" :key="t.id" class="cal-tooltip-task">
                <em :class="`pdot-${t.priority.toLowerCase()}`"></em>
                <span>{{ t.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="cal-legend">
          <i class="pdot-high"></i><span>High</span>
          <i class="pdot-medium"></i><span>Medium</span>
          <i class="pdot-low"></i><span>Low</span>
          <i class="cal-overdue-dot"></i><span>Overdue</span>
        </div>
      </section>

      <section class="dashboard-card">
        <div class="dashboard-card-head">
          <div>
            <h3>Workload</h3>
          </div>
          <span class="workload-count">{{ workloadTasks.length }} tasks</span>
        </div>
        <div class="workload-table">
          <div class="workload-row head">
            <span>Task</span><span>Assignee</span><span>Priority</span><span>Status</span>
          </div>
          <div class="workload-row" v-for="task in workloadTasks" :key="task.id">
            <span class="name">{{ task.title }}<small>{{ task.category }}</small></span>
            <span>{{ task.assigneeName || '—' }}</span>
            <span><em :class="`priority-${(task.priority || '').toLowerCase()}`">{{ task.priority }}</em></span>
            <span><em :class="`col-${task.columnId}`">{{ columnLabel(task.columnId) }}</em></span>
          </div>
          <div v-if="!workloadTasks.length" class="workload-empty">No tasks found.</div>
        </div>
      </section>
    </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { analyticsAPI } from '../../services/taskService'
import { useTaskStore } from '../../stores/taskStore'
import ServerDown from '../../components/ServerDown.vue'

const store = useTaskStore()

const search = ref('')
const userName = 'Be'
const analytics = ref(null)

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed

onMounted(async () => {
  try {
    analytics.value = await analyticsAPI.getSummary()
  } catch (e) {
    console.error('Failed to load analytics:', e)
  }
})

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (isCurrentMonth.value) return
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

const isCurrentMonth = computed(() =>
  viewYear.value === today.getFullYear() && viewMonth.value === today.getMonth()
)

const calendarTitle = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' })
)

const hoveredCell = ref(null)

const calendarCells = computed(() => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = today.toISOString().slice(0, 10)

  // Group tasks by their dueDate for this month
  const byDay = {}
  store.tasks.forEach(t => {
    if (!t.dueDate) return
    const d = t.dueDate.slice(0, 10)
    if (!d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) return
    if (!byDay[d]) byDay[d] = []
    byDay[d].push(t)
  })

  const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const tasks = (byDay[dateStr] || []).sort((a, b) =>
      (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
    )
    const topPriority = tasks.length ? tasks[0].priority.toLowerCase() : 'none'
    const isOverdue = dateStr < todayStr && tasks.some(t => !t.completed)
    cells.push({ day: d, date: dateStr, tasks, topPriority, isOverdue, isToday: dateStr === todayStr })
  }

  return cells
})

const total = computed(() => analytics.value?.totalTasks || 1)

const counts = computed(() => ({
  high: analytics.value?.byPriority?.High || analytics.value?.byPriority?.HIGH || 0,
  medium: analytics.value?.byPriority?.Medium || analytics.value?.byPriority?.MEDIUM || 0,
  low: analytics.value?.byPriority?.Low || analytics.value?.byPriority?.LOW || 0,
}))

const completionRate = computed(() => Math.round(analytics.value?.completionRate || 0))

const statusRates = computed(() => {
  const t = total.value
  const completed = analytics.value?.completedTasks || 0
  const overdue = analytics.value?.overdueTasks || 0
  const active = analytics.value?.activeTasks || 0
  return {
    inProgress: Math.round((active / t) * 100),
    completed: Math.round((completed / t) * 100),
    overdue: Math.round((overdue / t) * 100),
  }
})

const metrics = computed(() => [
  { value: analytics.value?.activeTasks ?? '—', label: 'Active Tasks', tone: 'tone-blue' },
  { value: completionRate.value + '%', label: 'Completion Rate', tone: 'tone-indigo' },
  { value: analytics.value?.totalTasks ?? '—', label: 'Total Tasks', tone: 'tone-green' },
  { value: analytics.value?.overdueTasks ?? '—', label: 'Overdue Tasks', tone: 'tone-pink' },
])

const COLUMN_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  inreview: 'In Review',
  done: 'Done',
}
function columnLabel(id) { return COLUMN_LABELS[id] || id }

const workloadTasks = computed(() =>
  store.tasks
    .filter(t => t.columnId !== 'done')
    .slice(0, 10)
)
</script>

<style scoped>
.cal-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cal-arrow {
  background: none;
  border: 1px solid var(--border, #ddd);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: var(--text, #333);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.activity-rate {
  font-size: 22px;
  font-weight: 700;
  margin: 4px 0 8px;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal-dow {
  font-size: 10px;
  text-align: center;
  color: var(--text-muted, #888);
  padding-bottom: 2px;
}

.cal-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  cursor: default;
  position: relative;
  background: var(--heat-0, #f1f5f9);
  color: #555;
  overflow: visible;
}

.cal-day-num {
  line-height: 1;
}

.cal-dot-row {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}

.cal-empty {
  background: transparent;
}

.cal-today {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.cal-overdue {
  background: #fff1f2 !important;
  color: #be123c;
}

/* Cell background by top priority */
.due-high   { background: #fee2e2; color: #991b1b; }
.due-medium { background: #fef9c3; color: #854d0e; }
.due-low    { background: #dcfce7; color: #166534; }
.due-none   { background: var(--heat-0, #f1f5f9); color: #555; }

/* Priority dots */
.pdot-high, .pdot-medium, .pdot-low {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.pdot-high   { background: #dc2626; }
.pdot-medium { background: #ca8a04; }
.pdot-low    { background: #16a34a; }

/* Tooltip */
.cal-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #f8fafc;
  border-radius: 6px;
  padding: 8px 10px;
  min-width: 160px;
  max-width: 220px;
  z-index: 50;
  font-size: 11px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  pointer-events: none;
}

.cal-tooltip-date {
  font-weight: 700;
  margin-bottom: 4px;
  color: #94a3b8;
}

.cal-tooltip-task {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted, #888);
}

.cal-legend i, .cal-overdue-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.cal-overdue-dot { background: #fda4af; }

.workload-count {
  font-size: 12px;
  color: var(--text-muted, #888);
}

.workload-empty {
  padding: 12px 0;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted, #888);
}

.workload-row em {
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.priority-high   { background: #fee2e2; color: #dc2626; }
.priority-medium { background: #fef9c3; color: #ca8a04; }
.priority-low    { background: #dcfce7; color: #16a34a; }

.col-todo       { background: #f1f5f9; color: #64748b; }
.col-inprogress { background: #dbeafe; color: #2563eb; }
.col-inreview   { background: #ffedd5; color: #ea580c; }
.col-done       { background: #dcfce7; color: #16a34a; }
</style>
