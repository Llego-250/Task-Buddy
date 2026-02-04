<template>
  <div class="progress-container">
    <div class="progress-info">
      <span class="progress-text">{{ completedCount }}/{{ totalCount }} subtasks</span>
      <span class="progress-percentage">{{ percentage }}%</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: percentage + '%' }"
        :class="{ complete: percentage === 100 }"
      ></div>
    </div>
    <div class="time-comparison" v-if="estimatedHours && actualHours">
      <span class="estimated">Est: {{ estimatedHours }}h</span>
      <span class="actual" :class="{ over: actualHours > estimatedHours }">
        Act: {{ actualHours.toFixed(1) }}h
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    subtasks: { type: Array, default: () => [] },
    estimatedHours: { type: Number, default: 0 },
    actualSeconds: { type: Number, default: 0 }
  },
  computed: {
    completedCount() {
      return this.subtasks.filter(task => task.completed).length
    },
    totalCount() {
      return this.subtasks.length
    },
    percentage() {
      return this.totalCount === 0 ? 0 : Math.round((this.completedCount / this.totalCount) * 100)
    },
    actualHours() {
      return this.actualSeconds / 3600
    }
  }
}
</script>

<style scoped>
.progress-container {
  margin: 8px 0;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
  color: var(--text-secondary);
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
  border-radius: 4px;
}
.progress-fill.complete {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}
.time-comparison {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-top: 4px;
  color: var(--text-secondary);
}
.actual.over {
  color: #ef4444;
  font-weight: bold;
}
</style>