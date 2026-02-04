<template>
  <div class="time-tracker">
    <div class="timer-display">
      {{ formatTime(currentTime) }}
    </div>
    <div class="timer-controls">
      <button 
        @click="toggleTimer" 
        :class="['timer-btn', isRunning ? 'stop' : 'start']"
        :aria-label="isRunning ? 'Stop timer' : 'Start timer'"
      >
        {{ isRunning ? '⏸️' : '▶️' }}
      </button>
      <button @click="resetTimer" class="reset-btn" :disabled="currentTime === 0">
        🔄
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeTracker',
  props: {
    taskId: [Number, String],
    initialTime: { type: Number, default: 0 }
  },
  emits: ['time-update'],
  data() {
    return {
      currentTime: this.initialTime,
      isRunning: false,
      interval: null,
      startTime: null
    }
  },
  methods: {
    toggleTimer() {
      if (this.isRunning) {
        this.stopTimer()
      } else {
        this.startTimer()
      }
    },
    startTimer() {
      this.isRunning = true
      this.startTime = Date.now() - (this.currentTime * 1000)
      this.interval = setInterval(() => {
        this.currentTime = Math.floor((Date.now() - this.startTime) / 1000)
        this.$emit('time-update', { taskId: this.taskId, time: this.currentTime })
      }, 1000)
    },
    stopTimer() {
      this.isRunning = false
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    },
    resetTimer() {
      this.stopTimer()
      this.currentTime = 0
      this.$emit('time-update', { taskId: this.taskId, time: 0 })
    },
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  },
  beforeUnmount() {
    this.stopTimer()
  }
}
</script>

<style scoped>
.time-tracker {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 8px 0;
}
.timer-display {
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
  min-width: 80px;
}
.timer-controls {
  display: flex;
  gap: 4px;
}
.timer-btn {
  background: #22c55e;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 12px;
}
.timer-btn.stop {
  background: #ef4444;
}
.reset-btn {
  background: #6b7280;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 12px;
}
.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>