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
      searchQuery: ''
    }
  },
  methods: {
    updateFilters() {
      let filtered = [...this.tasks]
      
      if (this.searchQuery) {
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      this.$emit('filtered-tasks', filtered)
    },
    
    clearFilters() {
      this.searchQuery = ''
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
  margin-bottom: 1.3rem;
  background: var(--bg-secondary);
  border-radius: 40px;
  border: 1px solid var(--border-color);
  max-width: 455px;
  margin-left: auto;
  margin-right: auto;
}

.search-bar {
  display: flex;
  gap: 8px;
  align-items: center;
  border-radius: 30px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 30px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
}
</style>