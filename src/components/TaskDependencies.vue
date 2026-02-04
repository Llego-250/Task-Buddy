<template>
  <div class="dependencies-section">
    <h4>Task Dependencies</h4>
    <div class="dependency-controls">
      <select v-model="selectedDependency" class="dependency-select">
        <option value="">Select a dependency...</option>
        <option v-for="task in availableTasks" :key="task.id" :value="task.id">
          {{ task.title }}
        </option>
      </select>
      <button @click="addDependency" :disabled="!selectedDependency" class="add-dep-btn">
        Add Dependency
      </button>
    </div>
    <div v-if="dependencies.length" class="dependencies-list">
      <div v-for="dep in dependencyTasks" :key="dep.id" class="dependency-item">
        <span>{{ dep.title }}</span>
        <span :class="['status', dep.completed ? 'completed' : 'pending']">
          {{ dep.completed ? '✓' : '⏳' }}
        </span>
        <button @click="removeDependency(dep.id)" class="remove-dep-btn">×</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskDependencies',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    availableTasks: {
      type: Array,
      default: () => []
    },
    currentTaskId: {
      type: [Number, String],
      default: null
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selectedDependency: '',
      dependencies: [...this.modelValue]
    }
  },
  computed: {
    dependencyTasks() {
      return this.dependencies.map(depId => 
        this.availableTasks.find(task => task.id === depId)
      ).filter(Boolean)
    }
  },
  methods: {
    addDependency() {
      if (this.selectedDependency && !this.dependencies.includes(this.selectedDependency)) {
        this.dependencies.push(this.selectedDependency)
        this.selectedDependency = ''
        this.updateValue()
      }
    },
    removeDependency(taskId) {
      this.dependencies = this.dependencies.filter(id => id !== taskId)
      this.updateValue()
    },
    updateValue() {
      this.$emit('update:modelValue', this.dependencies)
    }
  }
}
</script>

<style scoped>
.dependencies-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}
.dependency-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}
.dependency-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.add-dep-btn {
  padding: 8px 16px;
  background: #8b5cf6;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
.add-dep-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.dependencies-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dependency-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
}
.status.completed {
  color: #22c55e;
}
.status.pending {
  color: #f59e0b;
}
.remove-dep-btn {
  background: #ef4444;
  border: none;
  border-radius: 4px;
  color: white;
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>