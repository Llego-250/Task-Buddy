<template>
  <div class="search-filter-container">
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search tasks..." 
        class="search-input"
        @input="updateFilters"
      >
      <button @click="toggleFilters" class="filter-toggle-btn">
        🔍 {{ showFilters ? 'Hide' : 'Filters' }}
      </button>
    </div>
    
    <div v-if="showFilters" class="filters-panel">
      <div class="filter-row">
        <select v-model="filters.priority" @change="updateFilters" class="filter-select">
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select v-model="filters.category" @change="updateFilters" class="filter-select">
          <option value="">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="project">Project</option>
        </select>
        
        <select v-model="filters.status" @change="updateFilters" class="filter-select">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      
      <div class="filter-row">
        <input 
          v-model="filters.dateFrom" 
          type="date" 
          @change="updateFilters"
          class="date-filter"
          placeholder="From date"
        >
        <input 
          v-model="filters.dateTo" 
          type="date" 
          @change="updateFilters"
          class="date-filter"
          placeholder="To date"
        >
        
        <select v-model="sortBy" @change="updateFilters" class="sort-select">
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="createdAt">Sort by Created</option>
          <option value="title">Sort Alphabetically</option>
        </select>
        
        <button @click="clearFilters" class="clear-btn">Clear</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilter',
  props: {
    tasks: Array
  },
  emits: ['filtered-tasks'],
  data() {
    return {
      searchQuery: '',
      showFilters: false,
      sortBy: 'dueDate',
      filters: {
        priority: '',
        category: '',
        status: '',
        dateFrom: '',
        dateTo: ''
      }
    }
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters
    },
    
    updateFilters() {
      let filtered = [...this.tasks]
      
      // Search filter
      if (this.searchQuery) {
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      // Priority filter
      if (this.filters.priority) {
        filtered = filtered.filter(task => task.priority === this.filters.priority)
      }
      
      // Category filter
      if (this.filters.category) {
        filtered = filtered.filter(task => task.category === this.filters.category)
      }
      
      // Status filter
      if (this.filters.status) {
        if (this.filters.status === 'completed') {
          filtered = filtered.filter(task => task.completed)
        } else if (this.filters.status === 'active') {
          filtered = filtered.filter(task => !task.completed && new Date(task.dueDate) >= new Date().setHours(0,0,0,0))
        } else if (this.filters.status === 'overdue') {
          filtered = filtered.filter(task => !task.completed && new Date(task.dueDate) < new Date().setHours(0,0,0,0))
        }
      }
      
      // Date range filter
      if (this.filters.dateFrom) {
        filtered = filtered.filter(task => new Date(task.dueDate) >= new Date(this.filters.dateFrom))
      }
      if (this.filters.dateTo) {
        filtered = filtered.filter(task => new Date(task.dueDate) <= new Date(this.filters.dateTo))
      }
      
      // Sort
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium']
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'title':
            return a.title.localeCompare(b.title)
          default: // dueDate
            return new Date(a.dueDate) - new Date(b.dueDate)
        }
      })
      
      this.$emit('filtered-tasks', filtered)
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.filters = {
        priority: '',
        category: '',
        status: '',
        dateFrom: '',
        dateTo: ''
      }
      this.sortBy = 'dueDate'
      this.updateFilters()
    }
  },
  
  mounted() {
    this.updateFilters()
  }
}
</script>

<style scoped>
.search-filter-container {
  margin-bottom: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-bar {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  flex: none;
  width: 300px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
}

.filter-toggle-btn {
  padding: 8px 16px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.filters-panel {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.filter-select, .sort-select, .date-filter {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 12px;
  min-width: 120px;
}

.clear-btn {
  padding: 6px 12px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }
  
  .filter-select, .sort-select, .date-filter {
    min-width: unset;
    width: 100%;
  }
}
</style>