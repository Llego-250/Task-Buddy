<template>
  <div class="drag-drop-container">
    <div 
      v-for="(task, index) in tasks" 
      :key="task.id"
      :draggable="true"
      @dragstart="handleDragStart(task, index, $event)"
      @dragover.prevent
      @drop="handleDrop(index, $event)"
      @dragend="handleDragEnd"
      :class="['draggable-task', { 'dragging': draggingTask?.id === task.id }]"
    >
      <div class="drag-handle">⋮⋮</div>
      <slot :task="task" :index="index"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DragDropTasks',
  props: {
    tasks: {
      type: Array,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  emits: ['reorder', 'move-category'],
  data() {
    return {
      draggingTask: null,
      dragStartIndex: null
    }
  },
  methods: {
    handleDragStart(task, index, event) {
      this.draggingTask = task
      this.dragStartIndex = index
      event.dataTransfer.setData('text/plain', JSON.stringify({
        task,
        sourceCategory: this.category,
        sourceIndex: index
      }))
      event.dataTransfer.effectAllowed = 'move'
    },
    handleDrop(dropIndex, event) {
      event.preventDefault()
      const data = JSON.parse(event.dataTransfer.getData('text/plain'))
      
      if (data.sourceCategory === this.category) {
        // Reordering within same category
        if (data.sourceIndex !== dropIndex) {
          this.$emit('reorder', {
            from: data.sourceIndex,
            to: dropIndex,
            category: this.category
          })
        }
      } else {
        // Moving between categories
        this.$emit('move-category', {
          task: data.task,
          fromCategory: data.sourceCategory,
          toCategory: this.category,
          toIndex: dropIndex
        })
      }
    },
    handleDragEnd() {
      this.draggingTask = null
      this.dragStartIndex = null
    }
  }
}
</script>

<style scoped>
.drag-drop-container {
  min-height: 50px;
}
.draggable-task {
  position: relative;
  cursor: move;
  transition: all 0.3s ease;
  border: 2px dashed transparent;
}
.draggable-task:hover {
  border-color: rgba(255, 255, 255, 0.3);
}
.draggable-task.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}
.drag-handle {
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
</style>