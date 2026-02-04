<template>
  <div v-if="showSearch" class="search-overlay" @click="hideSearch">
    <div class="search-modal" @click.stop>
      <input 
        ref="searchInput"
        v-model="searchQuery" 
        type="text" 
        placeholder="Search tasks..." 
        class="search-input"
        @keydown.escape="hideSearch"
        aria-label="Search tasks"
      >
      <div v-if="filteredTasks.length" class="search-results">
        <div 
          v-for="task in filteredTasks.slice(0, 10)" 
          :key="task.id"
          class="search-result"
          @click="selectTask(task)"
          tabindex="0"
          @keydown.enter="selectTask(task)"
          role="button"
          :aria-label="`Select task: ${task.title}`"
        >
          <span class="task-title">{{ task.title }}</span>
          <span class="task-category">{{ task.category }}</span>
        </div>
      </div>
      <div v-else-if="searchQuery" class="no-results">
        No tasks found
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskSearch',
  props: {
    showSearch: Boolean,
    tasks: Array
  },
  emits: ['hide-search', 'task-selected'],
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredTasks() {
      if (!this.searchQuery) return []
      return this.tasks.filter(task => 
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  watch: {
    showSearch(show) {
      if (show) {
        this.$nextTick(() => {
          this.$refs.searchInput?.focus()
        })
      } else {
        this.searchQuery = ''
      }
    }
  },
  methods: {
    hideSearch() {
      this.$emit('hide-search')
    },
    selectTask(task) {
      this.$emit('task-selected', task)
      this.hideSearch()
    }
  }
}
</script>

<style scoped>
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
  z-index: 2000;
}
.search-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 70vh;
  overflow-y: auto;
}
.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  outline: none;
}
.search-results {
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
}
.search-result {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.search-result:hover, .search-result:focus {
  background: var(--bg-hover);
  outline: 2px solid var(--accent-color);
}
.task-category {
  font-size: 12px;
  opacity: 0.7;
  text-transform: capitalize;
}
.no-results {
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
}
</style>