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
          <div>
            <h3>Activity</h3>
            <p>Tasks created per day — last 12 weeks</p>
          </div>
          <button class="dot-btn">...</button>
        </div>
        <div class="activity-rate">{{ completionRate }}%</div>
        <div class="heatmap-wrapper">
          <div class="heatmap-month-labels">
            <span
              v-for="m in heatmap.monthLabels"
              :key="m.label + m.col"
              :style="{ gridColumnStart: m.col }"
            >{{ m.label }}</span>
          </div>
          <div class="heatmap-body">
            <div class="heatmap-day-labels">
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>
            <div class="heatmap-grid">
              <div v-for="(week, wi) in heatmap.weeks" :key="wi" class="heatmap-col">
                <div
                  v-for="(day, di) in week"
                  :key="di"
                  class="heatmap-cell"
                  :class="day ? `heat-${day.level}` : 'heat-0'"
                  :title="day ? `${day.date}: ${day.count} task(s)` : ''"
                ></div>
              </div>
            </div>
          </div>
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

onMounted(async () => {
  try {
    analytics.value = await analyticsAPI.getSummary()
  } catch (e) {
    console.error('Failed to load analytics:', e)
  }
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

// Build 12-week calendar heatmap from byDate data
const heatmap = computed(() => {
  const byDate = analytics.value?.byDate || {}
  const WEEKS = 12
  const today = new Date()
  // Align to end of current week (Saturday)
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + (6 - today.getDay()))

  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - WEEKS * 7 + 1)

  // Find max count for level scaling
  const maxCount = Math.max(1, ...Object.values(byDate))

  const weeks = []
  const monthLabels = []
  let seenMonths = new Set()
  let colIndex = 1

  const cursor = new Date(startDate)
  // Align cursor to Sunday (start of week)
  cursor.setDate(cursor.getDate() - cursor.getDay())

  for (let w = 0; w < WEEKS; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const count = byDate[dateStr] || 0
      const inRange = cursor >= startDate && cursor <= endDate
      const level = !inRange || count === 0 ? 0 : Math.ceil((count / maxCount) * 4)

      // Track month label for first occurrence of each month
      const monthKey = `${cursor.getFullYear()}-${cursor.getMonth()}`
      if (inRange && d === 0 && !seenMonths.has(monthKey)) {
        seenMonths.add(monthKey)
        monthLabels.push({
          label: cursor.toLocaleString('default', { month: 'short' }),
          col: colIndex,
        })
      }

      week.push(inRange ? { date: dateStr, count, level } : null)
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
    colIndex++
  }

  return { weeks, monthLabels }
})

const embers = [
  { name: 'Mark Chen', role: 'Product Manager', active: 12, overdue: 5, state: 'On Track', stateClass: 'state-red' },
  { name: 'Emily Davis', role: 'UX Researcher', active: 10, overdue: 2, state: 'Under Pressure', stateClass: 'state-green' },
  { name: 'John Smith', role: 'Frontend Developer', active: 15, overdue: 4, state: 'Sustained', stateClass: 'state-green' },
  { name: 'Linda Johnson', role: 'Backend Developer', active: 9, overdue: 1, state: 'Overloaded', stateClass: 'state-red' },
  { name: 'Michael Brown', role: 'QA Specialist', active: 20, overdue: 6, state: 'Balanced', stateClass: 'state-green' },
]
</script>

<style scoped>
.heatmap-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-x: auto;
  padding-top: 4px;
}

.heatmap-month-labels {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  padding-left: 28px;
  font-size: 11px;
  color: var(--text-muted, #888);
}

.heatmap-body {
  display: flex;
  gap: 4px;
}

.heatmap-day-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted, #888);
  padding-bottom: 2px;
  min-width: 24px;
  text-align: right;
  padding-right: 4px;
}

.heatmap-grid {
  display: flex;
  gap: 3px;
}

.heatmap-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: default;
}

.heat-0 { background-color: var(--heat-0, #e8e8e8); }
.heat-1 { background-color: var(--heat-1, #c6e48b); }
.heat-2 { background-color: var(--heat-2, #7bc96f); }
.heat-3 { background-color: var(--heat-3, #239a3b); }
.heat-4 { background-color: var(--heat-4, #196127); }
</style>
