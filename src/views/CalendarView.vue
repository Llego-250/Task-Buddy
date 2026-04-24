<template>
  <div class="calendar-page">
    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="previousMonth" class="nav-btn">‹</button>
        <h2>{{ currentMonthYear }}</h2>
        <button @click="nextMonth" class="nav-btn">›</button>
      </div>
      
      <div class="calendar-grid">
        <div class="day-header" v-for="day in dayHeaders" :key="day">{{ day }}</div>
        <div v-for="date in calendarDates" :key="date.date" 
             :class="['calendar-day', { 'has-task': date.hasTasks, 'other-month': !date.isCurrentMonth }]"
             @click="showTasksForDate(date.date)">
          <span class="day-number">{{ date.day }}</span>
          <div v-if="date.hasTasks" class="task-indicator">{{ date.taskCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()
onMounted(() => { if (!store.tasks.length) store.fetchTasks() })
const currentDate = ref(new Date())

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const dates = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    // Access store.tasks
    const tasksForDate = store.tasks.filter(task => 
      new Date(task.dueDate).toDateString() === date.toDateString()
    )
    dates.push({
      date: new Date(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      hasTasks: tasksForDate.length > 0,
      taskCount: tasksForDate.length
    })
  }
  return dates
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const showTasksForDate = (date) => {
  const tasksForDate = store.tasks.filter(task => 
    new Date(task.dueDate).toDateString() === date.toDateString()
  )
  if (tasksForDate.length > 0) {
    alert(`Tasks for ${date.toDateString()}:\n${tasksForDate.map(t => t.title).join('\n')}`)
  }
}
</script>

<style scoped>
.calendar-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.calendar-container {
  background: var(--bg-secondary, rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-header h2 {
  margin: 0;
  color: var(--text-primary, white);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-primary, white);
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-header {
  text-align: center;
  font-weight: bold;
  color: var(--text-secondary, #ccc);
  padding-bottom: 10px;
}

.calendar-day {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid transparent;
  position: relative;
  transition: all 0.2s;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.day-number {
  font-size: 1.1rem;
  font-weight: 500;
}

.other-month {
  opacity: 0.4;
}

.has-task {
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.1);
}

.task-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ef4444;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
