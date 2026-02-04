<template>
  <div class="bulk-actions-container">
    <div class="bulk-header">
      <label class="select-all">
        <input 
          type="checkbox" 
          :checked="allSelected" 
          @change="toggleSelectAll"
          :indeterminate.prop="someSelected"
        >
        Select All ({{ selectedTasks.length }})
      </label>
      <div v-if="selectedTasks.length" class="bulk-actions">
        <button @click="bulkComplete" class="bulk-btn complete">
          ✓ Complete ({{ selectedTasks.length }})
        </button>
        <button @click="bulkDelete" class="bulk-btn delete">
          🗑️ Delete ({{ selectedTasks.length }})
        </button>
        <select v-model="bulkCategory" class="bulk-select">
          <option value="">Change Category...</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="project">Project</option>
        </select>
        <button @click="bulkChangeCategory" :disabled="!bulkCategory" class="bulk-btn category">
          Update Category
        </button>
      </div>
    </div>
    <div class="tasks-list">
      <div 
        v-for="(task, index) in tasks" 
        :key="task.id"
        :class="['bulk-task-item', { selected: selectedTasks.includes(task.id) }]"
      >
        <label class="task-checkbox">
          <input 
            type="checkbox" 
            :value="task.id" 
            v-model="selectedTasks"
          >
        </label>
        <slot :task="task" :index="index" :selected="selectedTasks.includes(task.id)"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BulkActions',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  emits: ['bulk-complete', 'bulk-delete', 'bulk-category-change'],
  data() {
    return {
      selectedTasks: [],
      bulkCategory: ''
    }
  },
  computed: {
    allSelected() {
      return this.tasks.length > 0 && this.selectedTasks.length === this.tasks.length
    },
    someSelected() {
      return this.selectedTasks.length > 0 && this.selectedTasks.length < this.tasks.length
    }
  },
  methods: {
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedTasks = []
      } else {
        this.selectedTasks = this.tasks.map(task => task.id)
      }
    },
    bulkComplete() {
      if (this.selectedTasks.length && confirm(`Complete ${this.selectedTasks.length} tasks?`)) {
        this.$emit('bulk-complete', this.selectedTasks)
        this.selectedTasks = []
      }
    },
    bulkDelete() {
      if (this.selectedTasks.length && confirm(`Delete ${this.selectedTasks.length} tasks permanently?`)) {
        this.$emit('bulk-delete', this.selectedTasks)
        this.selectedTasks = []
      }
    },
    bulkChangeCategory() {
      if (this.selectedTasks.length && this.bulkCategory) {
        this.$emit('bulk-category-change', {
          taskIds: this.selectedTasks,
          category: this.bulkCategory
        })
        this.selectedTasks = []
        this.bulkCategory = ''
      }
    }
  }
}
</script>

<style scoped>
.bulk-actions-container {
  margin-bottom: 1rem;
}
.bulk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 1rem;
}
.select-all {
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.bulk-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.bulk-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}
.bulk-btn.complete {
  background: #22c55e;
}
.bulk-btn.delete {
  background: #ef4444;
}
.bulk-btn.category {
  background: #3b82f6;
}
.bulk-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.bulk-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 12px;
}
.bulk-task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}
.bulk-task-item.selected {
  background: rgba(59, 130, 246, 0.2);
  border-radius: 8px;
}
.task-checkbox {
  display: flex;
  align-items: center;
}
.task-checkbox input {
  transform: scale(1.2);
}
</style>