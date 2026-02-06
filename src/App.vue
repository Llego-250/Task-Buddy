<template>
<div class="main-container" :class="{ blurred: calendarVisible }">
  <div class="header">
    <h1 class="title">TaskBuddy</h1>
    <h2 class="subtitle">Hello Beautiful User❤️, this is the personal task manager</h2>
    
    <div class="input-section">
      <button @click="showTaskForm" class="create-task-btn">+</button>
      <button @click="showCalendar" class="calendar-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      </button>
      <button @click="showShortcutsHelp = true" class="help-btn" title="Keyboard Shortcuts (?)">
        ?
      </button>
      <button @click="showTimeReports = true" class="reports-btn" title="Time Reports">
        📊
      </button>
      <button @click="showAnalytics = true" class="analytics-btn" title="Analytics Dashboard">
        📈
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
          <select v-model="newTaskPriority" class="task-input">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <select v-model="newTaskCategory" class="task-input">
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="project">Project</option>
          </select>
          
          <div class="subtasks-section">
            <h4>Subtasks</h4>
            <div v-for="(subtask, index) in newSubtasks" :key="index" class="subtask-input">
              <input v-model="subtask.title" type="text" placeholder="Subtask name">
              <input v-model="subtask.hours" type="number" placeholder="Hours" min="0" step="0.5">
              <button @click="removeSubtask(index)" class="remove-btn">×</button>
            </div>
            <button @click="addSubtask" class="add-subtask-btn">+ Add Subtask</button>
          </div>
          
          <RecurringTasks v-model="newRecurring" />
          
          <TaskDependencies 
            v-model="newDependencies" 
            :available-tasks="activeTasks" 
            :current-task-id="null"
          />
          
          <div class="task-actions">
            <button @click="hideTaskForm" class="cancel-btn">Cancel</button>
            <button @click="addTask" class="save-btn">Create Task</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SearchFilter :tasks="tasks" @filtered-tasks="handleFilteredTasks" />

  <div class="card-container">
    <div class="card completed">
      <div class="card-title">Completed Tasks</div>
      <div class="task">
        <div v-for="(task, index) in visibleCompletedTasks" :key="task.id" 
             class="task-item completed-item" 
             @click="toggleTask('completed', index)" 
             :class="{expanded: expandedTask.type === 'completed' && expandedTask.index === index}">
          <div class="task-header">
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
              <div class="task-meta">
                <span class="priority-badge" :class="`priority-${task.priority || 'medium'}`">{{ (task.priority || 'medium').toUpperCase() }}</span>
                <span class="category-badge" :class="`category-${task.category || 'work'}`">{{ task.category || 'work' }}</span>
                <span class="task-date">Completed: {{ formatDate(task.createdAt) }}</span>
                <span class="task-hours">{{ task.estimatedHours }}h</span>
              </div>
            </div>
            <div class="task-actions">
              <button @click.stop="deleteTask('completed', index)" class="delete-btn" title="Delete Task">🗑️</button>
            </div>
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
      <div class="card-title">
        Active Tasks
        <button @click="bulkMode = !bulkMode" class="bulk-toggle-btn">
          {{ bulkMode ? 'Exit Bulk' : 'Bulk Actions' }}
        </button>
      </div>
      <div class="task">
        <BulkActions 
          v-if="bulkMode" 
          :tasks="visibleActiveTasks"
          @bulk-complete="handleBulkComplete"
          @bulk-delete="handleBulkDelete"
          @bulk-category-change="handleBulkCategoryChange"
        >
          <template #default="{ task, index, selected }">
            <DragDropTasks 
              :tasks="[task]" 
              category="active"
              @reorder="handleReorder"
              @move-category="handleMoveCategory"
            >
              <template #default="{ task: dragTask }">
                <div :class="['task-item', { selected }]" @click="toggleTask('active', index)">
                  <div class="task-header">
                    <div class="task-info">
                      <span class="task-title">{{ dragTask.title }}</span>
                      <div class="task-meta">
                        <span class="priority-badge" :class="`priority-${dragTask.priority || 'medium'}`">{{ (dragTask.priority || 'medium').toUpperCase() }}</span>
                        <span class="category-badge" :class="`category-${dragTask.category || 'work'}`">{{ dragTask.category || 'work' }}</span>
                        <span class="task-date">Due: {{ formatDate(dragTask.dueDate) }}</span>
                        <span class="task-hours">{{ dragTask.estimatedHours }}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </DragDropTasks>
          </template>
        </BulkActions>
        
        <DragDropTasks 
          v-else
          :tasks="visibleActiveTasks" 
          category="active"
          @reorder="handleReorder"
          @move-category="handleMoveCategory"
        >
          <template #default="{ task, index }">
            <div 
              class="task-item" 
              @click="toggleTask('active', index)" 
              :class="{expanded: expandedTask.type === 'active' && expandedTask.index === index}"
              tabindex="0"
              @keydown.enter="toggleTask('active', index)"
              @keydown.space.prevent="toggleTask('active', index)"
              role="button"
              :aria-expanded="expandedTask.type === 'active' && expandedTask.index === index"
              :aria-label="`Task: ${task.title}, Priority: ${task.priority}, Due: ${formatDate(task.dueDate)}`"
            >
              <div class="task-header">
                <div class="task-info">
                  <span class="task-title">{{ task.title }}</span>
                  <div class="task-meta">
                    <span class="priority-badge" :class="`priority-${task.priority || 'medium'}`">{{ (task.priority || 'medium').toUpperCase() }}</span>
                    <span class="category-badge" :class="`category-${task.category || 'work'}`">{{ task.category || 'work' }}</span>
                    <span class="task-date">Due: {{ formatDate(task.dueDate) }}</span>
                    <span class="task-hours">{{ task.estimatedHours }}h</span>
                  </div>
                </div>
                <div class="task-actions">
                  <button @click.stop="toggleEdit('active', index)" class="edit-btn" title="Edit Task">✏️</button>
                  <button @click.stop="deleteTask('active', index)" class="delete-btn" title="Delete Task">🗑️</button>
                </div>
              </div>
              <div v-if="expandedTask.type === 'active' && expandedTask.index === index" class="task-description">
                <div v-if="editingTask && editingTask.type === 'active' && editingTask.index === index" class="edit-form">
                  <input v-model="editForm.title" placeholder="Task title" class="edit-input" required>
                  <textarea v-model="editForm.description" placeholder="Task description" class="edit-textarea"></textarea>
                  <input v-model="editForm.dueDate" type="date" class="edit-input">
                  <select v-model="editForm.priority" class="edit-select">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <select v-model="editForm.category" class="edit-select">
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="project">Project</option>
                  </select>
                  <div class="subtasks-edit">
                    <h5>Subtasks</h5>
                    <div v-for="(subtask, subIndex) in editForm.subtasks" :key="subtask.id" class="subtask-edit-item">
                      <input v-model="subtask.title" placeholder="Subtask name" class="subtask-edit-input">
                      <input v-model.number="subtask.hours" type="number" placeholder="Hours" min="0" step="0.5" class="subtask-hours-input">
                      <button @click.stop="removeEditSubtask(subIndex)" class="remove-subtask-btn">×</button>
                    </div>
                    <button @click.stop="addEditSubtask" class="add-edit-subtask-btn">+ Add Subtask</button>
                  </div>
                  <div class="edit-actions">
                    <button @click.stop="saveEdit" class="save-btn">Save Changes</button>
                    <button @click.stop="cancelEdit" class="cancel-btn">Cancel</button>
                  </div>
                </div>
                <div v-else>
                  <ProgressBar 
                    :subtasks="task.subtasks" 
                    :estimated-hours="task.estimatedHours"
                    :actual-seconds="task.actualSeconds || 0"
                  />
                  <TimeTracker 
                    :task-id="task.id"
                    :initial-time="task.actualSeconds || 0"
                    @time-update="updateTaskTime"
                  />
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
          </template>
        </DragDropTasks>
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
          <div class="task-header">
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
              <div class="task-meta">
                <span class="priority-badge" :class="`priority-${task.priority || 'medium'}`">{{ (task.priority || 'medium').toUpperCase() }}</span>
                <span class="category-badge" :class="`category-${task.category || 'work'}`">{{ task.category || 'work' }}</span>
                <span class="task-date overdue-date">Due: {{ formatDate(task.dueDate) }}</span>
                <span class="task-hours">{{ task.estimatedHours }}h</span>
              </div>
            </div>
            <div class="task-actions">
              <button @click.stop="toggleEdit('delayed', index)" class="edit-btn" title="Edit Task">✏️</button>
              <button @click.stop="deleteTask('delayed', index)" class="delete-btn" title="Delete Task">🗑️</button>
            </div>
          </div>
          <div v-if="expandedTask.type === 'delayed' && expandedTask.index === index" class="task-description">
            <div v-if="editingTask && editingTask.type === 'delayed' && editingTask.index === index" class="edit-form">
              <input v-model="editForm.title" placeholder="Task title" class="edit-input" required>
              <textarea v-model="editForm.description" placeholder="Task description" class="edit-textarea"></textarea>
              <input v-model="editForm.dueDate" type="date" class="edit-input">
              <select v-model="editForm.priority" class="edit-select">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select v-model="editForm.category" class="edit-select">
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="project">Project</option>
              </select>
              <div class="edit-actions">
                <button @click.stop="saveEdit" class="save-btn">Save Changes</button>
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

<!-- UI/UX Enhancement Components -->
<ThemeToggle />
<KeyboardShortcuts 
  :show-help="showShortcutsHelp"
  @hide-help="showShortcutsHelp = false"
  @new-task="showTaskForm"
  @search="showSearch = true"
  @bulk-toggle="bulkMode = !bulkMode"
  @theme-toggle="$refs.themeToggle?.toggleTheme()"
/>
<TaskSearch 
  :show-search="showSearch"
  :tasks="filteredTasks.length ? filteredTasks : tasks"
  @hide-search="showSearch = false"
  @task-selected="handleTaskSelected"
/>
<TimeReports 
  :show-reports="showTimeReports"
  :tasks="filteredTasks.length ? filteredTasks : tasks"
  @hide-reports="showTimeReports = false"
/>
<AnalyticsDashboard 
  :show-dashboard="showAnalytics"
  :tasks="tasks"
  @hide-dashboard="showAnalytics = false"
/>
</template>

<script>
import RecurringTasks from './components/RecurringTasks.vue'
import TaskDependencies from './components/TaskDependencies.vue'
import DragDropTasks from './components/DragDropTasks.vue'
import BulkActions from './components/BulkActions.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import KeyboardShortcuts from './components/KeyboardShortcuts.vue'
import TaskSearch from './components/TaskSearch.vue'
import TimeTracker from './components/TimeTracker.vue'
import ProgressBar from './components/ProgressBar.vue'
import TimeReports from './components/TimeReports.vue'
import SearchFilter from './components/SearchFilter.vue'
import AnalyticsDashboard from './components/AnalyticsDashboard.vue'

export default {
  components: {
    RecurringTasks,
    TaskDependencies,
    DragDropTasks,
    BulkActions,
    ThemeToggle,
    KeyboardShortcuts,
    TaskSearch,
    TimeTracker,
    ProgressBar,
    TimeReports,
    SearchFilter,
    AnalyticsDashboard
  },
  // I used mockup (Nakoresheje sample task as Fallback)
  data() {
    return {
      expandedTask: { type: null, index: null },
      editingTask: null,
      editForm: {},
      newTask: '',
      taskDate: '',
      newTaskPriority: 'medium',
      newTaskCategory: 'work',
      showingTaskForm: false,
      newSubtasks: [],
      newRecurring: { enabled: false, type: 'daily', interval: 1 },
      newDependencies: [],
      bulkMode: false,
      showShortcutsHelp: false,
      showSearch: false,
      showTimeReports: false,
      filteredTasks: [],
      showAnalytics: false,
      calendarVisible: false,
      currentDate: new Date(),
      notifications: [],
      visibleTasks: { completed: 3, active: 3, overdue: 3 },
      tasks: [
        { 
          id: 1, 
          title: 'Working on final project', 
          description: 'Developing the main features of the task management application with Vue.js components.',
          priority: 'high',
          category: 'project',
          dueDate: new Date(2024, 11, 25), 
          createdAt: new Date(2024, 11, 15), 
          completed: false,
          estimatedHours: 8,
          actualSeconds: 0,
          recurring: { enabled: false, type: 'daily', interval: 1 },
          dependencies: [],
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
          recurring: { enabled: false, type: 'daily', interval: 1 },
          dependencies: [],
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
      const tasks = this.filteredTasks.length ? this.filteredTasks : this.tasks
      return tasks.filter(task => !task.completed && new Date(task.dueDate) >= new Date().setHours(0,0,0,0))
    },
    completedTasks() {
      const tasks = this.filteredTasks.length ? this.filteredTasks : this.tasks
      return tasks.filter(task => task.completed)
    },
    overdueTasks() {
      const tasks = this.filteredTasks.length ? this.filteredTasks : this.tasks
      return tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date().setHours(0,0,0,0))
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
      this.editingTask = null
    },
    toggleEdit(type, index) {
      const task = this.getTaskByTypeAndIndex(type, index)
      this.editingTask = { type, index }
      this.editForm = { 
        ...task, 
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        subtasks: [...task.subtasks]
      }
    },
    saveEdit() {
      if (!this.editForm.title.trim()) {
        alert('Task title is required!')
        return
      }
      const task = this.getTaskByTypeAndIndex(this.editingTask.type, this.editingTask.index)
      const updatedTask = {
        ...this.editForm,
        dueDate: new Date(this.editForm.dueDate),
        estimatedHours: this.editForm.subtasks.reduce((sum, subtask) => sum + (parseFloat(subtask.hours) || 0), 0)
      }
      Object.assign(task, updatedTask)
      this.editingTask = null
      this.editForm = {}
    },
    addEditSubtask() {
      this.editForm.subtasks.push({
        id: Date.now() + Math.random(),
        title: '',
        completed: false,
        hours: 1
      })
    },
    removeEditSubtask(index) {
      this.editForm.subtasks.splice(index, 1)
    },
    cancelEdit() {
      this.editingTask = null
      this.editForm = {}
    },
    getTaskByTypeAndIndex(type, index) {
      if (type === 'active') return this.visibleActiveTasks[index]
      if (type === 'completed') return this.visibleCompletedTasks[index]
      if (type === 'delayed') return this.visibleOverdueTasks[index]
    },
    deleteTask(type, index) {
      const task = this.getTaskByTypeAndIndex(type, index)
      const taskTitle = task.title
      
      if (confirm(`Are you sure you want to permanently delete "${taskTitle}"?\n\nThis action cannot be undone.`)) {
        this.tasks = this.tasks.filter(t => t.id !== task.id)
        this.expandedTask = { type: null, index: null }
        this.editingTask = null
        
        // Show success notification
        this.notifications.push({
          id: Date.now(),
          message: `Task "${taskTitle}" has been deleted successfully`
        })
        
        // Auto-dismiss notification after 3 seconds
        setTimeout(() => {
          this.notifications = this.notifications.filter(n => n.id !== Date.now())
        }, 3000)
      }
    },
    loadMoreTasks(type) {
      this.visibleTasks[type] += 3
    },
    addTask() {
      if (this.newTask.trim() && this.taskDate) {
        const totalHours = this.newSubtasks.reduce((sum, subtask) => sum + (parseFloat(subtask.hours) || 0), 0)
        const newTask = {
          id: Date.now(),
          title: this.newTask,
          dueDate: new Date(this.taskDate),
          createdAt: new Date(),
          completed: false,
          estimatedHours: totalHours,
          description: 'Task description',
          priority: this.newTaskPriority,
          category: this.newTaskCategory,
          recurring: this.newRecurring,
          dependencies: this.newDependencies,
          subtasks: this.newSubtasks.map((subtask, index) => ({
            id: Date.now() + index,
            title: subtask.title,
            completed: false,
            hours: parseFloat(subtask.hours) || 0
          }))
        }
        
        this.tasks.push(newTask)
        
        // Handle recurring task creation
        if (this.newRecurring.enabled) {
          this.createRecurringTasks(newTask)
        }
        
        this.newTask = ''
        this.taskDate = ''
        this.newSubtasks = []
        this.newRecurring = { enabled: false, type: 'daily', interval: 1 }
        this.newDependencies = []
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
    },
    
    // Advanced Features Methods
    createRecurringTasks(baseTask) {
      const { type, interval } = baseTask.recurring
      const baseDate = new Date(baseTask.dueDate)
      
      for (let i = 1; i <= 5; i++) { // Create 5 recurring instances
        const newDate = new Date(baseDate)
        if (type === 'daily') {
          newDate.setDate(baseDate.getDate() + (i * interval))
        } else if (type === 'weekly') {
          newDate.setDate(baseDate.getDate() + (i * interval * 7))
        } else if (type === 'monthly') {
          newDate.setMonth(baseDate.getMonth() + (i * interval))
        }
        
        this.tasks.push({
          ...baseTask,
          id: Date.now() + i,
          dueDate: newDate,
          createdAt: new Date()
        })
      }
    },
    
    handleReorder({ from, to, category }) {
      const tasks = category === 'active' ? this.activeTasks : 
                   category === 'completed' ? this.completedTasks : this.overdueTasks
      const [movedTask] = tasks.splice(from, 1)
      tasks.splice(to, 0, movedTask)
    },
    
    handleMoveCategory({ task, fromCategory, toCategory, toIndex }) {
      // Update task category based on destination
      if (toCategory === 'completed') {
        task.completed = true
      } else {
        task.completed = false
        // Adjust due date if moving to active from overdue
        if (fromCategory === 'overdue' && toCategory === 'active') {
          task.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      }
    },
    
    handleBulkComplete(taskIds) {
      taskIds.forEach(id => {
        const task = this.tasks.find(t => t.id === id)
        if (task) task.completed = true
      })
    },
    
    handleBulkDelete(taskIds) {
      this.tasks = this.tasks.filter(task => !taskIds.includes(task.id))
    },
    
    handleBulkCategoryChange({ taskIds, category }) {
      taskIds.forEach(id => {
        const task = this.tasks.find(t => t.id === id)
        if (task) task.category = category
      })
    },
    
    handleTaskSelected(task) {
      // Find and expand the selected task
      const activeIndex = this.activeTasks.findIndex(t => t.id === task.id)
      const completedIndex = this.completedTasks.findIndex(t => t.id === task.id)
      const overdueIndex = this.overdueTasks.findIndex(t => t.id === task.id)
      
      if (activeIndex !== -1) {
        this.expandedTask = { type: 'active', index: activeIndex }
      } else if (completedIndex !== -1) {
        this.expandedTask = { type: 'completed', index: completedIndex }
      } else if (overdueIndex !== -1) {
        this.expandedTask = { type: 'delayed', index: overdueIndex }
      }
    },
    
    updateTaskTime({ taskId, time }) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task) {
        task.actualSeconds = time
      }
    },
    
    handleFilteredTasks(filtered) {
      this.filteredTasks = filtered
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

/* Theme Variables */
:root[data-theme="light"] {
  --bg-primary: linear-gradient(135deg, #e0f2fe, #b3e5fc);
  --bg-secondary: rgba(255, 255, 255, 0.9);
  --bg-hover: rgba(0, 0, 0, 0.1);
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --border-color: rgba(0, 0, 0, 0.2);
  --accent-color: #2196f3;
}

:root[data-theme="dark"] {
  --bg-primary: linear-gradient(135deg, rgb(30, 58, 138), rgb(6, 182, 212));
  --bg-secondary: rgba(255, 255, 255, 0.1);
  --bg-hover: rgba(255, 255, 255, 0.2);
  --text-primary: rgba(255, 255, 255, 0.87);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.3);
  --accent-color: #64b5f6;
}

body {
  font-family: Arial, sans-serif;
  margin: 0px;
  background: var(--bg-primary);
  min-width: 320px;
  min-height: 100vh;
  padding: 0;
  display: flex;
  color: var(--text-primary);
  overflow-x: hidden;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .input-section {
    width: 100%;
    height: 60px;
    flex-direction: row;
    padding: 0 10px;
    top: auto;
    bottom: 0;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .main-container {
    margin-left: 0;
    margin-bottom: 60px;
  }
  
  body {
    padding: 0.5rem;
  }
  
  .card-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .card {
    min-width: unset;
    width: 100%;
  }
  
  .task-modal {
    max-width: 100%;
    padding: 1.5rem;
  }
  
  .subtask-input {
    grid-template-columns: 1fr 80px 30px;
    gap: 8px;
  }
  
  .bulk-actions {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .task-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

.main-container {
  transition: filter 0.3s ease;
  flex: 1;
  margin-left: 70px;
}

.main-container.blurred {
  filter: blur(5px);
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.title {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: var(--text-primary);
  font-size: 1rem;
  margin: 0 1rem 1rem;
}

/* Mobile responsive title */
@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
  }
  .subtitle {
    font-size: 1rem;
    margin: 0 1rem 1.5rem;
  }
}
.input-section {
  position: fixed;
  left: 0;
  top: 150px;
  height: 300px;
  width: 70px;
  border-radius:50px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 15px;
  z-index: 100;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.card-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3.5rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 0.5rem;
}
.card{
  flex: 1;
  min-width: 220px;
  max-width: 320px;
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  color: var(--text-primary);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
}
.card.completed {
  background: linear-gradient(rgb(34, 197, 94), rgba(82, 108, 96, 0.299), rgb(21, 128, 61));
}
.card.delayed {
  background: linear-gradient(rgb(239, 68, 68), rgba(108, 82, 82, 0.299), rgb(185, 28, 28));
}
.card-title{
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.8rem;
  text-align: center;
}
.task{
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  padding: 0.8rem;
}
.task-item{
  padding: 0.5rem;
  margin: 0.4rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
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
  margin-top: 0.2rem;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.task-hours {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.65em;
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  width: 48px;
  height: 48px;
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
  font-size: 20px;
  padding: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
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

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  flex: 1;
}

.task-title {
  font-weight: bold;
  display: block;
  margin-bottom: 0.3rem;
}

.edit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-input, .edit-textarea {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.edit-textarea {
  min-height: 60px;
  resize: vertical;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.65em;
  font-weight: bold;
  margin-right: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.priority-high { 
  background: linear-gradient(135deg, #ef4444, #dc2626); 
  color: white;
  animation: pulse-high 2s infinite;
}

.priority-medium { 
  background: linear-gradient(135deg, #f59e0b, #d97706); 
  color: white;
}

.priority-low { 
  background: linear-gradient(135deg, #10b981, #059669); 
  color: white;
}

@keyframes pulse-high {
  0%, 100% { box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6); }
}

.category-badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.65em;
  font-weight: bold;
  margin-right: 0.3rem;
  text-transform: capitalize;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.category-work { 
  background: linear-gradient(135deg, #3b82f6, #2563eb); 
  color: white; 
}

.category-personal { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed); 
  color: white; 
}

.category-project { 
  background: linear-gradient(135deg, #f97316, #ea580c); 
  color: white; 
}

.task-actions {
  display: flex;
  gap: 0.3rem;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  margin: 0;
}

.bulk-toggle-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.3s ease;
}

.bulk-toggle-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-1px);
}

.help-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  transition: all 0.3s ease;
}

.help-btn:hover {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  transform: scale(1.1);
}

.reports-btn {
  display:flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  font-size: 16px;
  cursor: pointer;
  margin: 0;
  transition: all 0.3s ease;
}

.reports-btn:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  transform: scale(1.1);
}

.analytics-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  font-size: 16px;
  cursor: pointer;
  margin: 0;
  transition: all 0.3s ease;
}

.analytics-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: scale(1.1);
}

/* Accessibility improvements */
*:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.task-item:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .task-item {
    border: 2px solid var(--text-primary);
  }
  
  button {
    border: 2px solid var(--text-primary);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

</style>