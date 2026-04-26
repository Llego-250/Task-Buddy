<template>
  <div class="dashboard-page p-4 md:p-5">
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
              cell ? `heat-${cell.level}` : 'cal-empty',
              cell?.isToday ? 'cal-today' : ''
            ]"
            :title="cell ? `${cell.date}: ${cell.count} task(s)` : ''"
          >
            <span v-if="cell">{{ cell.day }}</span>
          </div>
        </div>

        <div class="cal-legend">
          <span>Less</span>
          <i class="heat-0"></i><i class="heat-1"></i><i class="heat-2"></i><i class="heat-3"></i><i class="heat-4"></i>
          <span>More</span>
        </div>
      </section>

      <section class="dashboard-card">
        <div class="dashboard-card-head">
          <div>
            <h3>Workload</h3>
          </div>
          <a href="#" @click.prevent>See All</a>
        </div>
        <div class="workload-table">
          <div class="workload-row head">
            <span>Name</span><span>Active work</span><span>Overdue</span><span>Status</span><span>Action</span>
          </div>
          <div class="workload-row" v-for="person in embers" :key="person.name">
            <span class="name">{{ person.name }}<small>{{ person.role }}</small></span>
            <span>{{ person.active }}</span>
            <span>{{ person.overdue }}</span>
            <span><em :class="person.stateClass">{{ person.state }}</em></span>
            <span>...</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { analyticsAPI } from '../../services/taskService'

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

const calendarCells = computed(() => {
  const byDate = analytics.value?.byDate || {}
  const maxCount = Math.max(1, ...Object.values(byDate).map(Number))

  const year = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month, 1).getDay()   // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = today.toISOString().slice(0, 10)

  const cells = []

  // Leading empty cells
  for (let i = 0; i < firstDay; i++) cells.push(null)

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const count = byDate[dateStr] || 0
    const level = count === 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4))
    cells.push({ day: d, date: dateStr, count, level, isToday: dateStr === todayStr })
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

const embers = [
  { name: 'Mark Chen', role: 'Product Manager', active: 12, overdue: 5, state: 'On Track', stateClass: 'state-red' },
  { name: 'Emily Davis', role: 'UX Researcher', active: 10, overdue: 2, state: 'Under Pressure', stateClass: 'state-green' },
  { name: 'John Smith', role: 'Frontend Developer', active: 15, overdue: 4, state: 'Sustained', stateClass: 'state-green' },
  { name: 'Linda Johnson', role: 'Backend Developer', active: 9, overdue: 1, state: 'Overloaded', stateClass: 'state-red' },
  { name: 'Michael Brown', role: 'QA Specialist', active: 20, overdue: 6, state: 'Balanced', stateClass: 'state-green' },
]
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
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  cursor: default;
  color: #fff;
  position: relative;
}

.cal-empty {
  background: transparent;
}

.cal-today {
  outline: 2px solid #196127;
  outline-offset: 1px;
}

.heat-0 { background-color: var(--heat-0, #e8e8e8); color: #555; }
.heat-1 { background-color: var(--heat-1, #c6e48b); color: #333; }
.heat-2 { background-color: var(--heat-2, #7bc96f); color: #fff; }
.heat-3 { background-color: var(--heat-3, #239a3b); color: #fff; }
.heat-4 { background-color: var(--heat-4, #196127); color: #fff; }

.cal-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted, #888);
}

.cal-legend i {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
