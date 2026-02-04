<template>
  <div v-if="showReports" class="reports-overlay" @click="hideReports">
    <div class="reports-modal" @click.stop>
      <div class="reports-header">
        <h3>Time Reports</h3>
        <div class="report-tabs">
          <button 
            @click="activeTab = 'daily'" 
            :class="{ active: activeTab === 'daily' }"
          >
            Daily
          </button>
          <button 
            @click="activeTab = 'weekly'" 
            :class="{ active: activeTab === 'weekly' }"
          >
            Weekly
          </button>
        </div>
        <button @click="hideReports" class="close-btn">×</button>
      </div>
      
      <div class="reports-content">
        <div v-if="activeTab === 'daily'" class="daily-report">
          <h4>Today's Summary</h4>
          <div class="summary-stats">
            <div class="stat">
              <span class="stat-value">{{ todayStats.totalHours.toFixed(1) }}h</span>
              <span class="stat-label">Total Time</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ todayStats.completedTasks }}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ todayStats.activeTasks }}</span>
              <span class="stat-label">Active</span>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'weekly'" class="weekly-report">
          <h4>This Week's Summary</h4>
          <div class="summary-stats">
            <div class="stat">
              <span class="stat-value">{{ weeklyStats.totalHours.toFixed(1) }}h</span>
              <span class="stat-label">Total Time</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ weeklyStats.completedTasks }}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ weeklyStats.avgDaily.toFixed(1) }}h</span>
              <span class="stat-label">Daily Avg</span>
            </div>
          </div>
          <div class="weekly-chart">
            <div v-for="day in weeklyChart" :key="day.name" class="day-bar">
              <div class="bar" :style="{ height: (day.hours / maxDayHours * 100) + '%' }"></div>
              <span class="day-name">{{ day.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeReports',
  props: {
    showReports: Boolean,
    tasks: Array
  },
  emits: ['hide-reports'],
  data() {
    return {
      activeTab: 'daily'
    }
  },
  computed: {
    todayStats() {
      const today = new Date().toDateString()
      const todayTasks = this.tasks.filter(task => 
        new Date(task.createdAt).toDateString() === today
      )
      return {
        totalHours: todayTasks.reduce((sum, task) => sum + (task.actualSeconds || 0), 0) / 3600,
        completedTasks: todayTasks.filter(task => task.completed).length,
        activeTasks: todayTasks.filter(task => !task.completed).length
      }
    },
    weeklyStats() {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const weekTasks = this.tasks.filter(task => 
        new Date(task.createdAt) >= weekAgo
      )
      const totalHours = weekTasks.reduce((sum, task) => sum + (task.actualSeconds || 0), 0) / 3600
      return {
        totalHours,
        completedTasks: weekTasks.filter(task => task.completed).length,
        avgDaily: totalHours / 7
      }
    },
    weeklyChart() {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const chart = days.map(name => ({ name, hours: 0 }))
      
      this.tasks.forEach(task => {
        const dayIndex = new Date(task.createdAt).getDay()
        chart[dayIndex].hours += (task.actualSeconds || 0) / 3600
      })
      
      return chart
    },
    maxDayHours() {
      return Math.max(...this.weeklyChart.map(day => day.hours), 1)
    }
  },
  methods: {
    hideReports() {
      this.$emit('hide-reports')
    }
  }
}
</script>

<style scoped>
.reports-overlay {
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
.reports-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  color: var(--text-primary);
}
.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.report-tabs {
  display: flex;
  gap: 8px;
}
.report-tabs button {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.report-tabs button.active {
  background: var(--accent-color);
  color: white;
}
.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}
.stat {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}
.stat-value {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  color: var(--accent-color);
}
.stat-label {
  font-size: 0.8em;
  opacity: 0.7;
}
.weekly-chart {
  display: flex;
  justify-content: space-between;
  align-items: end;
  height: 100px;
  margin-top: 1rem;
  padding: 0 1rem;
}
.day-bar {
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
.day-name {
  font-size: 10px;
  opacity: 0.7;
}
</style>