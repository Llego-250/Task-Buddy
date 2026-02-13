<template>
  <div class="home-container">
    <div class="input-section">
      <button @click="showTaskForm" class="create-task-btn">+</button>
      <button @click="showShortcutsHelp = true" class="help-btn" title="Keyboard Shortcuts (?)">
        ?
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
            :available-tasks="store.activeTasks" 
            :current-task-id="null"
          />
          
          <div class="task-actions">
            <button @click="hideTaskForm" class="cancel-btn">Cancel</button>
            <button @click="addTask" class="save-btn">Create Task</button>
          </div>
        </div>
      </div>
    </div>

    <SearchFilter :tasks="store.tasks" @filtered-tasks="handleFilteredTasks" />

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
          <button v-if="store.completedTasks.length > visibleTasks.completed" 
                  @click="loadMoreTasks('completed')" class="view-more-btn">
            View More ({{ store.completedTasks.length - visibleTasks.completed }} remaining)
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
            @bulk-complete="store.bulkComplete"
            @bulk-delete="store.bulkDelete"
            @bulk-category-change="store.bulkCategoryChange"
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
          <button v-if="store.activeTasks.length > visibleTasks.active" 
                  @click="loadMoreTasks('active')" class="view-more-btn">
            View More ({{ store.activeTasks.length - visibleTasks.active }} remaining)
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
          <button v-if="store.overdueTasks.length > visibleTasks.overdue" 
                  @click="loadMoreTasks('overdue')" class="view-more-btn">
            View More ({{ store.overdueTasks.length - visibleTasks.overdue }} remaining)
          </button>
        </div>
      </div>
    </div>
    
    <KeyboardShortcuts 
      :show-help="showShortcutsHelp"
      @hide-help="showShortcutsHelp = false"
      @new-task="showTaskForm"
      @search="focusSearch"
      @bulk-toggle="bulkMode = !bulkMode"
      @theme-toggle="$emit('toggle-theme')"
    />
    <TaskSearch 
      :show-search="showSearch"
      :tasks="store.tasks"
      @hide-search="showSearch = false"
      @task-selected="handleTaskSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import RecurringTasks from '../components/RecurringTasks.vue'
import TaskDependencies from '../components/TaskDependencies.vue'
import DragDropTasks from '../components/DragDropTasks.vue'
import BulkActions from '../components/BulkActions.vue'
import SearchFilter from '../components/SearchFilter.vue'
import KeyboardShortcuts from '../components/KeyboardShortcuts.vue'
import TaskSearch from '../components/TaskSearch.vue'

const store = useTaskStore()
const emit = defineEmits(['toggle-theme'])

// UI State
const expandedTask = ref({ type: null, index: null })
const editingTask = ref(null)
const editForm = ref({})
const newTask = ref('')
const taskDate = ref('')
const newTaskPriority = ref('medium')
const newTaskCategory = ref('work')
const showingTaskForm = ref(false)
const newSubtasks = ref([])
const newRecurring = ref({ enabled: false, type: 'daily', interval: 1 })
const newDependencies = ref([])
const bulkMode = ref(false)
const showShortcutsHelp = ref(false)
const showSearch = ref(false)
const filteredTasks = ref([])
const visibleTasks = ref({ completed: 3, active: 3, overdue: 3 })

// Computed
const activeTasksSource = computed(() => filteredTasks.value.length ? filteredTasks.value.filter(t => !t.completed && new Date(t.dueDate) >= new Date().setHours(0,0,0,0)) : store.activeTasks)
const completedTasksSource = computed(() => filteredTasks.value.length ? filteredTasks.value.filter(t => t.completed) : store.completedTasks)
const overdueTasksSource = computed(() => filteredTasks.value.length ? filteredTasks.value.filter(t => !t.completed && new Date(t.dueDate) < new Date().setHours(0,0,0,0)) : store.overdueTasks)

const visibleActiveTasks = computed(() => activeTasksSource.value.slice(0, visibleTasks.value.active))
const visibleCompletedTasks = computed(() => completedTasksSource.value.slice(0, visibleTasks.value.completed))
const visibleOverdueTasks = computed(() => overdueTasksSource.value.slice(0, visibleTasks.value.overdue))

// Methods
const formatDate = (date) => new Date(date).toLocaleDateString()

const toggleTask = (type, index) => {
  if (expandedTask.value.type === type && expandedTask.value.index === index) {
    expandedTask.value = { type: null, index: null }
  } else {
    expandedTask.value = { type, index }
  }
  editingTask.value = null
}

const getTaskByTypeAndIndex = (type, index) => {
  if (type === 'active') return visibleActiveTasks.value[index]
  if (type === 'completed') return visibleCompletedTasks.value[index]
  if (type === 'delayed') return visibleOverdueTasks.value[index]
}

const toggleEdit = (type, index) => {
  const task = getTaskByTypeAndIndex(type, index)
  if (!task) return
  editingTask.value = { type, index }
  editForm.value = { 
    ...task, 
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    subtasks: task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : []
  }
}

const saveEdit = () => {
  if (!editForm.value.title || !editForm.value.title.trim()) {
    alert('Task title is required!')
    return
  }
  
  const validSubtasks = (editForm.value.subtasks || []).filter(s => s.title && s.title.trim())
  const updatedTask = {
    ...editForm.value,
    dueDate: new Date(editForm.value.dueDate),
    subtasks: validSubtasks,
    estimatedHours: validSubtasks.reduce((sum, subtask) => sum + (parseFloat(subtask.hours) || 0), 0)
  }
  
  store.updateTask(updatedTask)
  editingTask.value = null
  editForm.value = {}
}

const cancelEdit = () => {
  editingTask.value = null
  editForm.value = {}
}

const addEditSubtask = () => {
  if (!editForm.value.subtasks) editForm.value.subtasks = []
  editForm.value.subtasks.push({ id: Date.now(), title: '', completed: false, hours: 1 })
}

const removeEditSubtask = (index) => {
  editForm.value.subtasks.splice(index, 1)
}

const completeTask = (id) => store.completeTask(id)

const deleteTask = (type, index) => {
  const task = getTaskByTypeAndIndex(type, index)
  if (!task) return
  if (confirm(`Are you sure you want to permanently delete "${task.title}"?`)) {
    store.deleteTask(task.id)
    expandedTask.value = { type: null, index: null }
    editingTask.value = null
  }
}

const loadMoreTasks = (type) => {
  visibleTasks.value[type] += 3
}

const showTaskForm = () => {
  showingTaskForm.value = true
  newSubtasks.value = []
}

const hideTaskForm = () => {
  showingTaskForm.value = false
  newTask.value = ''
  taskDate.value = ''
  newSubtasks.value = []
  newTaskPriority.value = 'medium'
  newTaskCategory.value = 'work'
  newRecurring.value = { enabled: false, type: 'daily', interval: 1 }
  newDependencies.value = []
}

const addSubtask = () => {
  newSubtasks.value.push({ title: '', hours: 1 })
}

const removeSubtask = (index) => {
  newSubtasks.value.splice(index, 1)
}

const addTask = () => {
  if (!newTask.value.trim()) {
    alert('Task name is required!')
    return
  }
  if (!taskDate.value) {
    alert('Due date is required!')
    return
  }
  
  const validSubtasks = newSubtasks.value.filter(s => s.title && s.title.trim())
  const totalHours = validSubtasks.reduce((sum, subtask) => sum + (parseFloat(subtask.hours) || 0), 0)
  const dueDate = new Date(taskDate.value + 'T12:00:00')
  
  const task = {
    id: Date.now(),
    title: newTask.value,
    dueDate: dueDate,
    createdAt: new Date(),
    completed: false,
    estimatedHours: totalHours || 0,
    actualSeconds: 0,
    description: '',
    priority: newTaskPriority.value,
    category: newTaskCategory.value,
    recurring: { ...newRecurring.value },
    dependencies: [...newDependencies.value],
    subtasks: validSubtasks.map((subtask, index) => ({
      id: Date.now() + index + 1,
      title: subtask.title,
      completed: false,
      hours: parseFloat(subtask.hours) || 0
    }))
  }
  
  store.addTask(task)
  hideTaskForm()
}

const handleFilteredTasks = (filtered) => {
  filteredTasks.value = filtered
}

const handleReorder = (payload) => {
  store.handleReorder(payload)
}

const handleMoveCategory = (payload) => {
  // Logic needs to be in store or here. Store has updateTaskCategory?
  // We need to implement handleMoveCategory in store properly if we want it there.
  // Or just update the task properties.
  const { task, toCategory } = payload
  if (toCategory === 'completed') {
    task.completed = true
  } else {
    task.completed = false
    if (payload.fromCategory === 'overdue' && toCategory === 'active') {
      task.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  }
  store.updateTask(task)
}

const handleTaskSelected = (task) => {
  const activeIndex = store.activeTasks.findIndex(t => t.id === task.id)
  const completedIndex = store.completedTasks.findIndex(t => t.id === task.id)
  const overdueIndex = store.overdueTasks.findIndex(t => t.id === task.id)
  
  if (activeIndex !== -1) {
    expandedTask.value = { type: 'active', index: activeIndex }
  } else if (completedIndex !== -1) {
    expandedTask.value = { type: 'completed', index: completedIndex }
  } else if (overdueIndex !== -1) {
    expandedTask.value = { type: 'delayed', index: overdueIndex }
  }
}

const focusSearch = () => {
  showSearch.value = true
}

onMounted(() => {
  store.checkUpcomingDeadlines()
})
</script>

<style scoped>
/* Copy relevant styles from App.vue */
.home-container {
  max-width: 100%;
}
.input-section {
  position: fixed;
  left: 0;
  top: 150px;
  height: 300px;
  width: 70px;
  border-radius: 0 50px 50px 0;
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
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 1rem;
}
.card {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
}
.card.completed {
  background: linear-gradient(rgb(34, 197, 94), rgba(82, 108, 96, 0.3), rgb(21, 128, 61));
}
.card.delayed {
  background: linear-gradient(rgb(239, 68, 68), rgba(108, 82, 82, 0.3), rgb(185, 28, 28));
}
.card-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.create-task-btn, .help-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
}
.create-task-btn {
  background: linear-gradient(135deg, #10b981, #059669);
}
.help-btn {
  background: rgba(255, 255, 255, 0.2);
}
/* Add other necessary styles from App.vue or ensure they are global */
/* ... Task Modal Styles ... */
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
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}
.task-input, .edit-input, .edit-select, .edit-textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.task-actions, .edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}
</style>
