<template>
<div class="main-container">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <div class="header">
    <h1 class="title">TaskBuddy</h1>
    <h2 class="subtitle">Hello Beautiful User❤️, this is the personal task manager</h2>
    
    <div class="input-section">
      <input type="text" name="New task" placeholder="new task">
      <button>ADD</button>
    </div>
  </div>

  <div class="card-container">
    <div class="card completed">
      <div class="card-title">Completed Tasks</div>
      <div class="task">
        <div class="task-item completed-item" @click="toggleTask('completed', 0)" :class="{expanded: expandedTask.type === 'completed' && expandedTask.index === 0}">
          Setup project structure
          <div v-if="expandedTask.type === 'completed' && expandedTask.index === 0" class="task-description">
            Created folder structure, initialized Git repository, and set up basic Vue.js configuration files.
          </div>
        </div>
        <div class="task-item completed-item" @click="toggleTask('completed', 1)" :class="{expanded: expandedTask.type === 'completed' && expandedTask.index === 1}">
          Design UI mockups
          <div v-if="expandedTask.type === 'completed' && expandedTask.index === 1" class="task-description">
            Created wireframes and high-fidelity mockups for all main pages using Figma.
          </div>
        </div>
        <div class="task-item completed-item" @click="toggleTask('completed', 2)" :class="{expanded: expandedTask.type === 'completed' && expandedTask.index === 2}">
          Install dependencies
          <div v-if="expandedTask.type === 'completed' && expandedTask.index === 2" class="task-description">
            Installed Vue 3, Vue Router, and other necessary packages for the project.
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Tasks</div>
      <div class="task">
        <div class="task-item" @click="toggleTask('active', 0)" :class="{expanded: expandedTask.type === 'active' && expandedTask.index === 0}">
          Working on final project
          <div v-if="expandedTask.type === 'active' && expandedTask.index === 0" class="task-description">
            Developing the main features of the task management application with Vue.js components.
          </div>
        </div>
        <div class="task-item" @click="toggleTask('active', 1)" :class="{expanded: expandedTask.type === 'active' && expandedTask.index === 1}">
          Study for exam
          <div v-if="expandedTask.type === 'active' && expandedTask.index === 1" class="task-description">
            Review chapters 5-8 of the web development textbook and practice coding exercises.
          </div>
        </div>
        <div class="task-item" @click="toggleTask('active', 2)" :class="{expanded: expandedTask.type === 'active' && expandedTask.index === 2}">
          Complete Vue.js tutorial
          <div v-if="expandedTask.type === 'active' && expandedTask.index === 2" class="task-description">
            Finish the official Vue.js tutorial series and build the sample todo application.
          </div>
        </div>
        <div class="task-item" @click="toggleTask('active', 3)" :class="{expanded: expandedTask.type === 'active' && expandedTask.index === 3}">
          Review code documentation
          <div v-if="expandedTask.type === 'active' && expandedTask.index === 3" class="task-description">
            Go through project documentation and update comments for better code maintainability.
          </div>
        </div>
      </div>
    </div>

    <div class="card delayed">
      <div class="card-title">Delayed Tasks</div>
      <div class="task">
        <div class="task-item delayed-item" @click="toggleTask('delayed', 0)" :class="{expanded: expandedTask.type === 'delayed' && expandedTask.index === 0}">
          Update portfolio website
          <div v-if="expandedTask.type === 'delayed' && expandedTask.index === 0" class="task-description">
            Add recent projects, update resume section, and improve responsive design.
          </div>
        </div>
        <div class="task-item delayed-item" @click="toggleTask('delayed', 1)" :class="{expanded: expandedTask.type === 'delayed' && expandedTask.index === 1}">
          Prepare presentation slides
          <div v-if="expandedTask.type === 'delayed' && expandedTask.index === 1" class="task-description">
            Create PowerPoint presentation for the final project demo with screenshots and explanations.
          </div>
        </div>
        <div class="task-item delayed-item" @click="toggleTask('delayed', 2)" :class="{expanded: expandedTask.type === 'delayed' && expandedTask.index === 2}">
          Submit assignment report
          <div v-if="expandedTask.type === 'delayed' && expandedTask.index === 2" class="task-description">
            Write comprehensive report documenting the development process and technical decisions.
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="calendar-section">
    <div class="calendar-card">
      <div class="calendar-header">
        <i class="fas fa-calendar-alt"></i>
        <h3>Task Calendar</h3>
      </div>
      <div class="calendar">
        <div class="calendar-nav">
          <button @click="prevMonth" class="nav-btn"><i class="fas fa-chevron-left"></i></button>
          <span class="month-year">{{ currentMonthYear }}</span>
          <button @click="nextMonth" class="nav-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar-grid">
          <div class="day-header" v-for="day in dayHeaders" :key="day">{{ day }}</div>
          <div v-for="date in calendarDates" :key="date.key" 
               :class="['calendar-date', { 'other-month': !date.currentMonth, 'today': date.isToday, 'has-task': date.hasTask }]">
            {{ date.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      expandedTask: { type: null, index: null },
      currentDate: new Date(),
      dayHeaders: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },
    calendarDates() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const dates = []
      const today = new Date()
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        dates.push({
          day: date.getDate(),
          currentMonth: date.getMonth() === month,
          isToday: date.toDateString() === today.toDateString(),
          hasTask: [15, 20, 25].includes(date.getDate()) && date.getMonth() === month,
          key: date.toISOString()
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
    prevMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    }
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
.completed-item {
  text-decoration: line-through;
  opacity: 0.8;
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

.calendar-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
.calendar-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
}
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.calendar-header i {
  font-size: 1.5rem;
  color: #60a5fa;
}
.calendar-header h3 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}
.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
.month-year {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.day-header {
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  color: #60a5fa;
  font-size: 0.9rem;
}
.calendar-date {
  text-align: center;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s;
}
.calendar-date:hover {
  background: rgba(255, 255, 255, 0.1);
}
.calendar-date.other-month {
  color: rgba(255, 255, 255, 0.3);
}
.calendar-date.today {
  background: #60a5fa;
  font-weight: bold;
}
.calendar-date.has-task {
  background: #f59e0b;
  font-weight: bold;
}
</style>