<template>
  <div v-if="showDashboard" class="dashboard-overlay" @click="hideDashboard">
    <div class="dashboard-modal" @click.stop>
      <div class="dashboard-header">
        <h3>📊 Analytics Dashboard</h3>
        <button @click="hideDashboard" class="close-btn">×</button>
      </div>
      
      <div class="dashboard-content">
        <!-- Productivity Metrics -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">{{ completionRate }}%</div>
            <div class="metric-label">Completion Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ avgTasksPerDay }}</div>
            <div class="metric-label">Avg Tasks/Day</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ totalHours }}h</div>
            <div class="metric-label">Total Hours</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ streakDays }}</div>
            <div class="metric-label">Day Streak</div>
          </div>
        </div>

        <!-- Completion Trends -->
        <div class="chart-section">
          <h4>📈 Completion Trends (Last 7 Days)</h4>
          <div class="trend-chart">
            <div v-for="day in trendData" :key="day.date" class="trend-bar">
              <div class="bar" :style="{ height: (day.completed / maxDaily * 100) + '%' }"></div>
              <span class="day-label">{{ day.label }}</span>
            </div>
          </div>
        </div>

        <!-- Time Analytics -->
        <div class="time-section">
          <h4>⏰ Most Productive Hours</h4>
          <div class="hour-grid">
            <div v-for="hour in productiveHours" :key="hour.time" class="hour-item">
              <span class="hour-time">{{ hour.time }}</span>
              <div class="hour-bar" :style="{ width: (hour.tasks / maxHourTasks * 100) + '%' }"></div>
              <span class="hour-count">{{ hour.tasks }}</span>
            </div>
          </div>
        </div>

        <!-- Goal Setting -->
        <div class="goals-section">
          <h4>🎯 Goals</h4>
          <div class="goal-item">
            <label>Daily Goal:</label>
            <input v-model.number="dailyGoal" type="number" min="1" max="20" class="goal-input">
            <span>tasks/day</span>
            <div class="goal-progress">
              <div class="progress-bar" :style="{ width: (todayCompleted / dailyGoal * 100) + '%' }"></div>
            </div>
            <span class="goal-status">{{ todayCompleted }}/{{ dailyGoal }}</span>
          </div>
          <div class="goal-item">
            <label>Weekly Goal:</label>
            <input v-model.number="weeklyGoal" type="number" min="1" max="100" class="goal-input">
            <span>tasks/week</span>
            <div class="goal-progress">
              <div class="progress-bar" :style="{ width: (weekCompleted / weeklyGoal * 100) + '%' }"></div>
            </div>
            <span class="goal-status">{{ weekCompleted }}/{{ weeklyGoal }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsDashboard',
  props: {
    showDashboard: Boolean,
    tasks: Array
  },
  emits: ['hide-dashboard'],
  data() {
    return {
      dailyGoal: parseInt(localStorage.getItem('dailyGoal')) || 3,
      weeklyGoal: parseInt(localStorage.getItem('weeklyGoal')) || 15
    }
  },
  computed: {
    completionRate() {
      const total = this.tasks.length
      const completed = this.tasks.filter(t => t.completed).length
      return total ? Math.round((completed / total) * 100) : 0
    },
    avgTasksPerDay() {
      const days = 7
      const recentTasks = this.tasks.filter(t => 
        new Date(t.createdAt) >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      )
      return Math.round(recentTasks.length / days * 10) / 10
    },
    totalHours() {
      return Math.round(this.tasks.reduce((sum, t) => sum + (t.actualSeconds || 0), 0) / 3600 * 10) / 10
    },
    streakDays() {
      let streak = 0
      const today = new Date()
      for (let i = 0; i < 30; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        const dayTasks = this.tasks.filter(t => 
          new Date(t.createdAt).toDateString() === date.toDateString() && t.completed
        )
        if (dayTasks.length > 0) streak++
        else break
      }
      return streak
    },
    trendData() {
      const data = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const completed = this.tasks.filter(t => 
          new Date(t.createdAt).toDateString() === date.toDateString() && t.completed
        ).length
        data.push({
          date: date.toDateString(),
          label: date.toLocaleDateString('en', { weekday: 'short' }),
          completed
        })
      }
      return data
    },
    maxDaily() {
      return Math.max(...this.trendData.map(d => d.completed), 1)
    },
    productiveHours() {
      const hours = Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, tasks: 0 }))
      this.tasks.forEach(task => {
        const hour = new Date(task.createdAt).getHours()
        hours[hour].tasks++
      })
      return hours.filter(h => h.tasks > 0).slice(0, 6)
    },
    maxHourTasks() {
      return Math.max(...this.productiveHours.map(h => h.tasks), 1)
    },
    todayCompleted() {
      const today = new Date().toDateString()
      return this.tasks.filter(t => 
        new Date(t.createdAt).toDateString() === today && t.completed
      ).length
    },
    weekCompleted() {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return this.tasks.filter(t => 
        new Date(t.createdAt) >= weekAgo && t.completed
      ).length
    }
  },
  methods: {
    hideDashboard() {
      this.$emit('hide-dashboard')
    }
  },
  watch: {
    dailyGoal(val) {
      localStorage.setItem('dailyGoal', val)
    },
    weeklyGoal(val) {
      localStorage.setItem('weeklyGoal', val)
    }
  }
}
</script>

<style scoped>
.dashboard-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.dashboard-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  color: var(--text-primary);
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.metric-card {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}
.metric-value {
  font-size: 2em;
  font-weight: bold;
  color: var(--accent-color);
}
.metric-label {
  font-size: 0.8em;
  opacity: 0.7;
  margin-top: 0.5rem;
}
.chart-section, .time-section, .goals-section {
  margin-bottom: 2rem;
}
.trend-chart {
  display: flex;
  justify-content: space-between;
  align-items: end;
  height: 100px;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}
.trend-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex: 1;
}
.bar {
  width: 20px;
  background: var(--accent-color);
  border-radius: 2px 2px 0 0;
  margin-bottom: 4px;
  min-height: 2px;
}
.day-label {
  font-size: 10px;
  opacity: 0.7;
}
.hour-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
}
.hour-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hour-time {
  width: 50px;
  font-size: 12px;
}
.hour-bar {
  height: 8px;
  background: var(--accent-color);
  border-radius: 4px;
  min-width: 2px;
  flex: 1;
}
.hour-count {
  width: 30px;
  font-size: 12px;
  text-align: right;
}
.goal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
}
.goal-input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
}
.goal-progress {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: var(--accent-color);
  transition: width 0.3s ease;
}
.goal-status {
  font-size: 12px;
  font-weight: bold;
}
</style>