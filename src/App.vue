<template>
<div class="main-container" :class="{ blurred: calendarVisible }">
  <div class="header">
    <h1 class="title">TaskBuddy</h1>
    <h2 class="subtitle">Hello Beautiful User❤️, this is the personal task manager</h2>
    
    <div class="input-section">
      <input v-model="newTask" type="text" placeholder="New task" @keyup.enter="addTask">
      <input v-model="taskDate" type="date" class="date-input">
      <button @click="addTask">ADD</button>
      <button @click="showCalendar" class="calendar-btn">📅</button>
    </div>
  </div>

  <div class="card-container">
    <div class="card completed">
      <div class="card-title">Completed Tasks</div>
      <div class="task">
        <div v-for="(task, index) in visibleCompletedTasks" :key="task.id" 
             class="task-item completed-item" 
             @click="toggleTask('completed', index)" 
             :class="{expanded: expandedTask.type === 'completed' && expandedTask.index === index}">
          {{ task.title }}
          <div class="task-date">Created: {{ formatDate(task.createdAt) }}</div>
          <div v-if="expandedTask.type === 'completed' && expandedTask.index === index" class="task-description">
            Task completed successfully
          </div>
        </div>
        <button v-if="completedTasks.length > visibleTasks.completed" 
                @click="loadMoreTasks('completed')" class="view-more-btn">
          View More ({{ completedTasks.length - visibleTasks.completed }} remaining)
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Active Tasks</div>
      <div class="task">
        <div v-for="(task, index) in visibleActiveTasks" :key="task.id" 
             class="task-item" 
             @click="toggleTask('active', index)" 
             :class="{expanded: expandedTask.type === 'active' && expandedTask.index === index}">
          {{ task.title }}
          <div class="task-date">Due: {{ formatDate(task.dueDate) }}</div>
          <div v-if="expandedTask.type === 'active' && expandedTask.index === index" class="task-description">
            Click to mark as complete
            <button @click.stop="completeTask(task.id)" class="complete-btn">✓</button>
          </div>
        </div>
        <button v-if="activeTasks.length > visibleTasks.active" 
                @click="loadMoreTasks('active')" class="view-more-btn">
          View More ({{ activeTasks.length - visibleTasks.active }} remaining)
        </button>
      </div>
    </div>

    <div class="card delayed">
      <div class="card-title">Overdue Tasks</div>
      <div class="task">
        <div v-for="(task, index) in visibleOverdueTasks" :key="task.id" 
             class="task-item delayed-item" 
             @click="toggleTask('delayed', index)" 
             :class="{expanded: expandedTask.type === 'delayed' && expandedTask.index === index}">
          {{ task.title }}
          <div class="task-date">Due: {{ formatDate(task.dueDate) }}</div>
          <div v-if="expandedTask.type === 'delayed' && expandedTask.index === index" class="task-description">
            This task is overdue!
            <button @click.stop="completeTask(task.id)" class="complete-btn">✓</button>
          </div>
        </div>
        <button v-if="overdueTasks.length > visibleTasks.overdue" 
                @click="loadMoreTasks('overdue')" class="view-more-btn">
          View More ({{ overdueTasks.length - visibleTasks.overdue }} remaining)
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Calendar Modal -->
<div v-if="calendarVisible" class="calendar-overlay" @click="hideCalendar">
  <div class="calendar-modal" @click.stop>
    <div class="calendar-header">
      <button @click="previousMonth">‹</button>
      <span>{{ currentMonthYear }}</span>
      <button @click="nextMonth">›</button>
      <button @click="hideCalendar" class="close-btn">×</button>
    </div>
    <div class="calendar-grid">
      <div class="day-header" v-for="day in dayHeaders" :key="day">{{ day }}</div>
      <div v-for="date in calendarDates" :key="date.date" 
           :class="['calendar-day', { 'has-task': date.hasTasks, 'other-month': !date.isCurrentMonth }]"
           @click="showTasksForDate(date.date)">
        {{ date.day }}
        <div v-if="date.hasTasks" class="task-indicator">{{ date.taskCount }}</div>
      </div>
    </div>
  </div>
</div>

<!-- Notifications -->
<div v-if="notifications.length" class="notifications">
  <div v-for="notification in notifications" :key="notification.id" class="notification">
    🔔 {{ notification.message }}
    <button @click="dismissNotification(notification.id)">×</button>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      expandedTask: { type: null, index: null },
      newTask: '',
      taskDate: '',
      calendarVisible: false,
      currentDate: new Date(),
      notifications: [],
      visibleTasks: { completed: 3, active: 3, overdue: 3 },
      tasks: [
        { id: 1, title: 'Working on final project', dueDate: new Date(2024, 11, 25), createdAt: new Date(2024, 11, 15), completed: false },
        { id: 2, title: 'Study for exam', dueDate: new Date(2024, 11, 30), createdAt: new Date(2024, 11, 10), completed: false },
        { id: 3, title: 'Complete Vue.js tutorial', dueDate: new Date(2024, 11, 28), createdAt: new Date(2024, 11, 12), completed: false },
        { id: 4, title: 'Review code documentation', dueDate: new Date(2024, 11, 27), createdAt: new Date(2024, 11, 14), completed: false },
        { id: 5, title: 'Learn React basics', dueDate: new Date(2025, 0, 5), createdAt: new Date(2024, 11, 16), completed: false },
        { id: 6, title: 'Practice JavaScript algorithms', dueDate: new Date(2025, 0, 8), createdAt: new Date(2024, 11, 17), completed: false },
        { id: 7, title: 'Build personal blog', dueDate: new Date(2025, 0, 15), createdAt: new Date(2024, 11, 18), completed: false },
        { id: 8, title: 'Setup project structure', dueDate: new Date(2024, 11, 5), createdAt: new Date(2024, 11, 1), completed: true },
        { id: 9, title: 'Design UI mockups', dueDate: new Date(2024, 11, 8), createdAt: new Date(2024, 11, 3), completed: true },
        { id: 10, title: 'Install dependencies', dueDate: new Date(2024, 11, 10), createdAt: new Date(2024, 11, 5), completed: true },
        { id: 11, title: 'Write unit tests', dueDate: new Date(2024, 11, 15), createdAt: new Date(2024, 11, 1), completed: true },
        { id: 12, title: 'Deploy to production', dueDate: new Date(2024, 11, 12), createdAt: new Date(2024, 11, 2), completed: true },
        { id: 13, title: 'Code review session', dueDate: new Date(2024, 11, 14), createdAt: new Date(2024, 11, 3), completed: true },
        { id: 14, title: 'Update portfolio website', dueDate: new Date(2024, 11, 20), createdAt: new Date(2024, 11, 8), completed: false },
        { id: 15, title: 'Prepare presentation slides', dueDate: new Date(2024, 11, 22), createdAt: new Date(2024, 11, 10), completed: false },
        { id: 16, title: 'Submit assignment report', dueDate: new Date(2024, 11, 18), createdAt: new Date(2024, 11, 5), completed: false }
      ]
    }
  },
  computed: {
    activeTasks() {
      return this.tasks.filter(task => !task.completed && new Date(task.dueDate) >= new Date().setHours(0,0,0,0))
    },
    completedTasks() {
      return this.tasks.filter(task => task.completed)
    },
    overdueTasks() {
      return this.tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date().setHours(0,0,0,0))
    },
    visibleActiveTasks() {
      return this.activeTasks.slice(0, this.visibleTasks.active)
    },
    visibleCompletedTasks() {
      return this.completedTasks.slice(0, this.visibleTasks.completed)
    },
    visibleOverdueTasks() {
      return this.overdueTasks.slice(0, this.visibleTasks.overdue)
    },
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },
    dayHeaders() {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    calendarDates() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const dates = []
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        const tasksForDate = this.tasks.filter(task => 
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
    }
  },
  methods: {
    toggleTask(type, index) {
      if (this.expandedTask.type === type && this.expandedTask.index === index) {
        this.expandedTask = { type: null, index: null }
      } else {
        this.expandedTask = { type, index }
      }
    },
    loadMoreTasks(type) {
      this.visibleTasks[type] += 3
    },
    addTask() {
      if (this.newTask.trim() && this.taskDate) {
        this.tasks.push({
          id: Date.now(),
          title: this.newTask,
          dueDate: new Date(this.taskDate),
          createdAt: new Date(),
          completed: false
        })
        this.newTask = ''
        this.taskDate = ''
      }
    },
    completeTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task) {
        task.completed = true
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    showCalendar() {
      this.calendarVisible = true
    },
    hideCalendar() {
      this.calendarVisible = false
    },
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },
    showTasksForDate(date) {
      const tasksForDate = this.tasks.filter(task => 
        new Date(task.dueDate).toDateString() === date.toDateString()
      )
      if (tasksForDate.length > 0) {
        alert(`Tasks for ${date.toDateString()}:\n${tasksForDate.map(t => t.title).join('\n')}`)
      }
    },
    dismissNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }
  },
  mounted() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const upcomingTasks = this.tasks.filter(task => 
      !task.completed && new Date(task.dueDate).toDateString() === tomorrow.toDateString()
    )
    upcomingTasks.forEach(task => {
      this.notifications.push({
        id: Date.now() + Math.random(),
        message: `Reminder: "${task.title}" is due tomorrow!`
      })
    })
  }
}
</script>

<style>
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: Arial, sans-serif;
  margin: 0px;
  background: linear-gradient(rgb(14, 10, 111), rgb(20, 209, 211));
  min-width: 320px;
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(30, 58, 138), rgb(6, 182, 212));
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

.main-container {
  transition: filter 0.3s ease;
}

.main-container.blurred {
  filter: blur(5px);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}
.title {
  color: white;
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.subtitle {
  color: white;
  font-size: 1.25rem;
  margin: 0 2.5rem 2rem;
}
.input-section {
  margin-bottom: 2rem;
}
.card-container {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
.card{
  flex: 1;
  min-width: 300px;
  background: linear-gradient(rgb(20, 209, 211), rgba(82, 108, 96, 0.299),rgb(14, 10, 111));
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}
.card.completed {
  background: linear-gradient(rgb(34, 197, 94), rgba(82, 108, 96, 0.299), rgb(21, 128, 61));
}
.card.delayed {
  background: linear-gradient(rgb(239, 68, 68), rgba(108, 82, 82, 0.299), rgb(185, 28, 28));
}
.card-title{
  font-size: 2.1em;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}
.task{
  width: 90%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
}
.task-item{
  padding: 0.8rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}
.task-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
.task-item.expanded {
  background: rgba(255, 255, 255, 0.15);
}
.task-description {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.9em;
  opacity: 0.9;
}
.task-date {
  font-size: 0.8em;
  opacity: 0.7;
  margin-top: 0.3rem;
}
.completed-item {
  text-decoration: line-through;
  opacity: 0.8;
}
.complete-btn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3.2em;
  line-height: 0.1;
  color: #f1f1f1;
  text-align: center;
}
h2{
  color:#2ed2ff;
  margin: 40px;
}

input {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #469cf8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.view-more-btn {
  width: 100%;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.8rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.date-input {
  margin: 5px;
}

.calendar-btn {
  font-size: 1.2em;
  margin-left: 10px;
}

.calendar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.calendar-modal {
  background: linear-gradient(135deg, rgb(30, 58, 138), rgb(6, 182, 212));
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
  font-weight: bold;
}

.calendar-header button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn {
  font-size: 1.5em !important;
  padding: 2px 8px !important;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-header {
  text-align: center;
  font-weight: bold;
  color: white;
  padding: 10px 5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  color: white;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.2);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.has-task {
  background: rgba(34, 197, 94, 0.3);
  border: 2px solid rgba(34, 197, 94, 0.8);
}

.task-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}

.notification {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.notification button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  margin-left: 10px;
}
</style>