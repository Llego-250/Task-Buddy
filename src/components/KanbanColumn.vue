<template>
  <div
    class="kanban-column flex flex-col flex-1 min-w-[280px] max-w-[340px] rounded-2xl p-4 transition-all"
    :class="isDragOver ? 'bg-blue-50 ring-2 ring-blue-200 ring-inset' : 'bg-white/30'"
    @dragover.prevent="isDragOver = true"
    @dragleave.self="isDragOver = false"
    @drop.prevent="onDrop($event)"
  >
    <!-- Column Header -->
    <div class="flex items-center justify-between mb-5 px-1">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-sm" :class="column.color">{{ column.label }}</span>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white shadow-sm" :class="countClass">
          {{ String(tasks.length).padStart(2, '0') }}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          @click="$emit('add', column.id)"
          class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-base leading-none font-light"
        >+</button>
        <button class="flex items-center gap-0.5 p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <span class="w-1 h-1 rounded-full bg-gray-300"></span>
          <span class="w-1 h-1 rounded-full bg-gray-300"></span>
          <span class="w-1 h-1 rounded-full bg-gray-300"></span>
        </button>
      </div>
    </div>

    <!-- Cards -->
    <div class="flex flex-col gap-3.5 min-h-[80px]">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :dark="dark"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
      <!-- Empty state -->
      <div
        v-if="tasks.length === 0 && !isDragOver"
        class="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 text-xs"
      >
        Drop tasks here
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({ column: Object, tasks: Array, dark: Boolean })
const emit = defineEmits(['add', 'edit', 'delete', 'drop'])

const isDragOver = ref(false)

const countClass = computed(() => ({
  'text-gray-700':   props.column.id === 'todo',
  'text-blue-500':   props.column.id === 'inprogress',
  'text-orange-500': props.column.id === 'inreview',
  'text-green-500':  props.column.id === 'done',
}))

function onDrop(e) {
  isDragOver.value = false
  const taskId = parseInt(e.dataTransfer.getData('taskId'))
  if (taskId) emit('drop', { taskId, colId: props.column.id })
}
</script>
