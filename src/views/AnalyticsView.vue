<template>
  <div class="page-container">
    <div class="view-header">
      <h2>Analytics Dashboard</h2>
    </div>
    <div v-if="loading" class="loading">Loading analytics...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="summary-cards">
        <div class="stat-card">
          <div class="stat-value">{{ summary.totalTasks }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
        <div class="stat-card completed">
          <div class="stat-value">{{ summary.completedTasks }}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card overdue">
          <div class="stat-value">{{ summary.overdueTasks }}</div>
          <div class="stat-label">Overdue</div>
        </div>
        <div class="stat-card active">
          <div class="stat-value">{{ summary.activeTasks }}</div>
          <div class="stat-label">Active</div>
        </div>
        <div class="stat-card rate">
          <div class="stat-value">{{ summary.completionRate.toFixed(1) }}%</div>
          <div class="stat-label">Completion Rate</div>
        </div>
        <div class="stat-card hours">
          <div class="stat-value">{{ summary.totalActualHours.toFixed(1) }}h</div>
          <div class="stat-label">Actual Hours / {{ summary.totalEstimatedHours.toFixed(1) }}h est.</div>
        </div>
      </div>

      <div class="breakdown-row">
        <div class="breakdown-card">
          <h3>By Priority</h3>
          <div v-for="(count, key) in summary.byPriority" :key="key" class="breakdown-item">
            <span class="breakdown-label" :class="`priority-${key.toLowerCase()}`">{{ key }}</span>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: barWidth(count, summary.totalTasks) }"></div>
            </div>
            <span class="breakdown-count">{{ count }}</span>
          </div>
        </div>
        <div class="breakdown-card">
          <h3>By Category</h3>
          <div v-for="(count, key) in summary.byCategory" :key="key" class="breakdown-item">
            <span class="breakdown-label">{{ key }}</span>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar category-bar" :style="{ width: barWidth(count, summary.totalTasks) }"></div>
            </div>
            <span class="breakdown-count">{{ count }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { analyticsApi } from '../services/api'

const loading = ref(true)
const error = ref(null)
const summary = ref({
  totalTasks: 0, completedTasks: 0, overdueTasks: 0, activeTasks: 0,
  completionRate: 0, totalEstimatedHours: 0, totalActualHours: 0,
  byPriority: {}, byCategory: {}
})

const barWidth = (count, total) => total ? `${(count / total * 100).toFixed(0)}%` : '0%'

onMounted(async () => {
  try {
    const { data } = await analyticsApi.getSummary()
    summary.value = data
  } catch (e) {
    error.value = 'Failed to load analytics: ' + e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
.view-header { margin-bottom: 2rem; text-align: center; }
.loading, .error { text-align: center; padding: 2rem; opacity: 0.7; }
.error { color: #ef4444; }

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1.2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.15);
}
.stat-card.completed { border-color: rgba(34,197,94,0.4); }
.stat-card.overdue   { border-color: rgba(239,68,68,0.4); }
.stat-card.active    { border-color: rgba(59,130,246,0.4); }
.stat-card.rate      { border-color: rgba(168,85,247,0.4); }
.stat-card.hours     { border-color: rgba(251,191,36,0.4); }
.stat-value { font-size: 2rem; font-weight: bold; }
.stat-label { font-size: 0.8rem; opacity: 0.7; margin-top: 0.3rem; }

.breakdown-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.breakdown-card {
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
}
.breakdown-card h3 { margin: 0 0 1rem; font-size: 1rem; opacity: 0.8; }
.breakdown-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
.breakdown-label { width: 80px; font-size: 0.85rem; text-transform: capitalize; }
.breakdown-bar-wrap { flex: 1; background: rgba(255,255,255,0.1); border-radius: 4px; height: 8px; }
.breakdown-bar { height: 8px; border-radius: 4px; background: #3b82f6; transition: width 0.4s; }
.category-bar { background: #10b981; }
.breakdown-count { width: 24px; text-align: right; font-size: 0.85rem; opacity: 0.7; }
.priority-HIGH   { color: #ef4444; }
.priority-MEDIUM { color: #f59e0b; }
.priority-LOW    { color: #22c55e; }
</style>
