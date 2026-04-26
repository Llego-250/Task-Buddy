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
            <p>Understand your productive and workload.</p>
          </div>
          <button class="dot-btn">...</button>
        </div>
        <div class="activity-rate">{{ completionRate }}%</div>
        <div class="activity-grid">
          <div
            v-for="(cell, idx) in activityHeatmap"
            :key="idx"
            class="activity-cell"
            :style="{ opacity: cell }"
          ></div>
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
  high: analytics.value?.byPriority?.HIGH || analytics.value?.byPriority?.High || 0,
  medium: analytics.value?.byPriority?.MEDIUM || analytics.value?.byPriority?.Medium || 0,
  low: analytics.value?.byPriority?.LOW || analytics.value?.byPriority?.Low || 0,
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

const activityHeatmap = [0.2, 0.35, 0.8, 0.75, 0.5, 0.65, 0.7, 0.28, 0.72, 0.5, 0.76, 0.9, 0.78, 0.82, 0.32, 0.75, 0.81, 0.84, 0.69, 0.88, 0.74, 0.6, 0.78, 0.82, 0.85, 0.3, 0.42, 0.2, 0.67, 0.88, 0.23, 0.91, 0.4, 0.37, 0.53]
const embers = [
  { name: 'Mark Chen', role: 'Product Manager', active: 12, overdue: 5, state: 'On Track', stateClass: 'state-red' },
  { name: 'Emily Davis', role: 'UX Researcher', active: 10, overdue: 2, state: 'Under Pressure', stateClass: 'state-green' },
  { name: 'John Smith', role: 'Frontend Developer', active: 15, overdue: 4, state: 'Sustained', stateClass: 'state-green' },
  { name: 'Linda Johnson', role: 'Backend Developer', active: 9, overdue: 1, state: 'Overloaded', stateClass: 'state-red' },
  { name: 'Michael Brown', role: 'QA Specialist', active: 20, overdue: 6, state: 'Balanced', stateClass: 'state-green' },
]
</script>
