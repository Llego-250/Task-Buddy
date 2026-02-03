<template>
<div class="main-container" :class="{ blurred: calendarVisible }">
  <div class="header">
    <h1 class="title">TaskBuddy</h1>
    <h2 class="subtitle">Hello Beautiful User❤️, this is the personal task manager</h2>
    
    <div class="input-section">
      <button @click="showTaskForm" class="create-task-btn">+ Create New Task</button>
      <button @click="showCalendar" class="calendar-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      </button>
    </div>

    <!-- Task Creation Modal -->
    <div v-if="showingTaskForm" class="task-overlay" @click="hideTaskForm">
      <div class="task-modal" @click.stop>
        <div class="task-header">
          <h3>Create New Task</h3>
          <button @click="hideTaskForm" class="close-btn">×</button>
        </div>
        <div class="task-form">
          <input v-model="newTask" type="text" placeholder="Task name" class="task-input">
          <input v-model="taskDate" type="date" class="task-input">
          
          <div class="subtasks-section">
            <h4>Subtasks</h4>
            <div v-for="(subtask, index) in newSubtasks" :key="index" class="subtask-input">
              <input v-model="subtask.title" type="text" placeholder="Subtask name">
              <input v-model="subtask.hours" type="number" placeholder="Hours" min="0" step="0.5">
              <button @click="removeSubtask(index)" class="remove-btn">×</button>
            </div>
            <button @click="addSubtask" class="add-subtask-btn">+ Add Subtask</button>
          </div>
          
          <div class="task-actions">
            <button @click="hideTaskForm" class="cancel-btn">Cancel</button>
            <button @click="addTask" class="save-btn">Create Task</button>
          </div>
        </div>
      </div>
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
          <div class="task-meta">
            <span class="task-date">Created: {{ formatDate(task.createdAt) }}</span>
            <span class="task-hours">{{ task.estimatedHours }}h</span>
          </div>
          <div v-if="expandedTask.type === 'completed' && expandedTask.index === index" class="task-description">
            <div class="subtasks">
              <div v-for="subtask in task.subtasks" :key="subtask.id" class="subtask-item">
                <span :class="{ 'completed': subtask.completed }">{{ subtask.title }}</span>
                <span class="subtask-hours">{{ subtask.hours }}h</span>
              </div>
            </div>
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
          <div class="task-header">
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
              <div class="task-meta">
                <span class="task-date">Due: {{ formatDate(task.dueDate) }}</span>
                <span class="task-hours">{{ task.estimatedHours }}h</span>
              </div>
            </div>
            <button v-if="expandedTask.type === 'active' && expandedTask.index === index" 
                    @click.stop="toggleEdit('active', index)" class="edit-btn">✏️</button>
          </div>
          <div v-if="expandedTask.type === 'active' && expandedTask.index === index" class="task-description">
            <div v-if="editingTask && editingTask.type === 'active' && editingTask.index === index" class="edit-form">
              <input v-model="editForm.title" placeholder="Task title" class="edit-input">
              <textarea v-model="editForm.description" placeholder="Task description" class="edit-textarea"></textarea>
              <div class="edit-actions">
                <button @click.stop="saveEdit" class="save-btn">Save</button>
                <button @click.stop="cancelEdit" class="cancel-btn">Cancel</button>
              </div>
            </div>
            <div v-else>
              <div class="subtasks">
                <div v-for="subtask in task.subtasks" :key="subtask.id" class="subtask-item">
                  <input type="checkbox" v-model="subtask.completed" @click.stop>
                  <span :class="{ 'completed': subtask.completed }">{{ subtask.title }}</span>
                  <span class="subtask-hours">{{ subtask.hours }}h</span>
                </div>
              </div>
              <button @click.stop="completeTask(task.id)" class="complete-btn">✓</button>
            </div>
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
          <div class="task-meta">
            <span class="task-date">Due: {{ formatDate(task.dueDate) }}</span>
            <span class="task-hours">{{ task.estimatedHours }}h</span>
          </div>
          <div v-if="expandedTask.type === 'delayed' && expandedTask.index === index" class="task-description">
            <div class="subtasks">
              <div v-for="subtask in task.subtasks" :key="subtask.id" class="subtask-item">
                <input type="checkbox" v-model="subtask.completed" @click.stop>
                <span :class="{ 'completed': subtask.completed }">{{ subtask.title }}</span>
                <span class="subtask-hours">{{ subtask.hours }}h</span>
              </div>
            </div>
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
      editingTask: null,
      editForm: {},
      newTask: '',
      taskDate: '',
      showingTaskForm: false,
      newSubtasks: [],
      calendarVisible: false,
      currentDate: new Date(),
      notifications: [],
      visibleTasks: { completed: 3, active: 3, overdue: 3 },
      tasks: [
        { 
          id: 1, 
          title: 'Working on final project', 
          dueDate: new Date(2024, 11, 25), 
          createdAt: new Date(2024, 11, 15), 
          completed: false,
          estimatedHours: 8,
          subtasks: [
            { id: 11, title: 'Setup Vue components', completed: false, hours: 2 },
            { id: 12, title: 'Implement task management', completed: false, hours: 4 },
            { id: 13, title: 'Add calendar integration', completed: false, hours: 2 }
          ]
        },
        { 
          id: 2, 
          title: 'Study for exam', 
          dueDate: new Date(2024, 11, 30), 
          createdAt: new Date(2024, 11, 10), 
          completed: false,
          estimatedHours: 6,
          subtasks: [
            { id: 21, title: 'Review chapters 1-5', completed: false, hours: 3 },
            { id: 22, title: 'Practice problems', completed: false, hours: 2 },
            { id: 23, title: 'Mock exam', completed: false, hours: 1 }
          ]
        },
        { 
          id: 3, 
          title: 'Complete Vue.js tutorial', 
          dueDate: new Date(2024, 11, 28), 
          createdAt: new Date(2024, 11, 12), 
          completed: false,
          estimatedHours: 4,
          subtasks: [
            { id: 31, title: 'Watch tutorial videos', completed: false, hours: 2 },
            { id: 32, title: 'Build sample app', completed: false, hours: 2 }
          ]
        },
        { 
          id: 4, 
          title: 'Setup project structure', 
          dueDate: new Date(2024, 11, 5), 
          createdAt: new Date(2024, 11, 1), 
          completed: true,
          estimatedHours: 2,
          subtasks: [
            { id: 41, title: 'Create folders', completed: true, hours: 0.5 },
            { id: 42, title: 'Initialize Git', completed: true, hours: 0.5 },
            { id: 43, title: 'Setup package.json', completed: true, hours: 1 }
          ]
        },
        { 
          id: 5, 
          title: 'Design UI mockups', 
          dueDate: new Date(2024, 11, 8), 
          createdAt: new Date(2024, 11, 3), 
          completed: true,
          estimatedHours: 3,
          subtasks: [
            { id: 51, title: 'Wireframes', completed: true, hours: 1 },
            { id: 52, title: 'High-fidelity designs', completed: true, hours: 2 }
          ]
        },
        { 
          id: 6, 
          title: 'Install dependencies', 
          dueDate: new Date(2024, 11, 10), 
          createdAt: new Date(2024, 11, 5), 
          completed: true,
          estimatedHours: 1,
          subtasks: [
            { id: 61, title: 'Install Vue 3', completed: true, hours: 0.5 },
            { id: 62, title: 'Setup build tools', completed: true, hours: 0.5 }
          ]
        },
        { 
          id: 7, 
          title: 'Update portfolio website', 
          dueDate: new Date(2024, 11, 20), 
          createdAt: new Date(2024, 11, 8), 
          completed: false,
          estimatedHours: 5,
          subtasks: [
            { id: 71, title: 'Add new projects', completed: false, hours: 2 },
            { id: 72, title: 'Update resume section', completed: false, hours: 2 },
            { id: 73, title: 'Improve responsive design', completed: false, hours: 1 }
          ]
        },
        { 
          id: 8, 
          title: 'Prepare presentation slides', 
          dueDate: new Date(2024, 11, 22), 
          createdAt: new Date(2024, 11, 10), 
          completed: false,
          estimatedHours: 3,
          subtasks: [
            { id: 81, title: 'Create outline', completed: false, hours: 1 },
            { id: 82, title: 'Design slides', completed: false, hours: 2 }
          ]
        },
        { 
          id: 9, 
          title: 'Submit assignment report', 
          dueDate: new Date(2024, 11, 18), 
          createdAt: new Date(2024, 11, 5), 
          completed: false,
          estimatedHours: 4,
          subtasks: [
            { id: 91, title: 'Write introduction', completed: false, hours: 1 },
            { id: 92, title: 'Document methodology', completed: false, hours: 2 },
            { id: 93, title: 'Review and edit', completed: false, hours: 1 }
          ]
        }
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
        const totalHours = this.newSubtasks.reduce((sum, subtask) => sum + (parseFloat(subtask.hours) || 0), 0)
        this.tasks.push({
          id: Date.now(),
          title: this.newTask,
          dueDate: new Date(this.taskDate),
          createdAt: new Date(),
          completed: false,
          estimatedHours: totalHours,
          subtasks: this.newSubtasks.map((subtask, index) => ({
            id: Date.now() + index,
            title: subtask.title,
            completed: false,
            hours: parseFloat(subtask.hours) || 0
          }))
        })
        this.newTask = ''
        this.taskDate = ''
        this.newSubtasks = []
        this.showingTaskForm = false
      }
    },
    showTaskForm() {
      this.showingTaskForm = true
      this.addSubtask()
    },
    hideTaskForm() {
      this.showingTaskForm = false
      this.newTask = ''
      this.taskDate = ''
      this.newSubtasks = []
    },
    addSubtask() {
      this.newSubtasks.push({ title: '', hours: 1 })
    },
    removeSubtask(index) {
      this.newSubtasks.splice(index, 1)
    },
    saveSubtasks() {
      // Not needed anymore
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
.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.3rem;
}

.task-hours {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: bold;
}

.subtasks {
  margin-top: 1rem;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 0;
  font-size: 0.9em;
}

.subtask-item input[type="checkbox"] {
  margin: 0;
  transform: scale(1.2);
}

.subtask-item span.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.subtask-hours {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.15);
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 0.8em;
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
  padding: 12px 16px;
  margin: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

input:focus {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

button {
  padding: 12px 20px;
  margin: 8px;
  background: linear-gradient(135deg, #469cf8, #0056b3);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(70, 156, 248, 0.3);
}

button:hover {
  background: linear-gradient(135deg, #0056b3, #003d82);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(70, 156, 248, 0.4);
}

button:active {
  transform: translateY(0);
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
  margin: 8px;
  color-scheme: dark;
}

.calendar-btn {
  font-size: 1.4em;
  margin-left: 12px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.calendar-btn:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
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

.create-task-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  font-size: 18px;
  padding: 14px 24px;
}

.create-task-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.task-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.task-modal {
  background: linear-gradient(135deg, rgb(30, 58, 138), rgb(6, 182, 212));
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  max-width: 550px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
}

.task-header h3 {
  margin: 0;
  font-size: 1.8em;
  font-weight: 600;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.task-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.task-input:focus {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.subtasks-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.subtasks-section h4 {
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.2em;
  font-weight: 600;
}

.subtask-input {
  display: grid;
  grid-template-columns: 1fr 100px 40px;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}

.subtask-input input {
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.subtask-input input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.subtask-input input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.remove-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: scale(1.1);
}

.add-subtask-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.add-subtask-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-2px);
}

.task-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.save-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.save-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}
</style>