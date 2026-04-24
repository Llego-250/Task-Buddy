<template>
  <div
  class="task-card bg-white rounded-2xl p-5 border border-gray-100 cursor-pointer group relative select-none"
  :class="dark ? 'bg-gray-800 border-gray-700' : ''"
    draggable="true"
    :data-task-id="task.id"
    @dragstart.stop="onDragStart"
  >
    <!-- Priority + Category + Actions row -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="priorityClass">{{ task.priority }}</span>
      <span v-if="task.category" class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ task.category }}</span>
      <div class="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click.stop="$emit('edit', task)"
          class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
        <button
          @click.stop="$emit('delete', task.id)"
          class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Image card -->
    <template v-if="task.image">
      <img :src="task.image" :alt="task.title" class="w-full h-40 object-cover rounded-xl mb-3 shadow-sm" />
      <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2" :class="dark ? 'text-gray-100' : ''">{{ task.title }}</h3>
      <p class="text-xs text-purple-500 mb-3 font-medium">{{ task.date }}</p>
    </template>

    <!-- Assignee card -->
    <template v-else-if="task.assignee">
      <div class="flex items-center gap-3 mb-2">
        <img :src="task.assignee.avatar" :alt="task.assignee.name" class="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" />
        <div>
          <p class="text-sm font-semibold leading-tight" :class="dark ? 'text-gray-100' : 'text-gray-800'">{{ task.assignee.name }}</p>
          <p class="text-xs text-purple-500 font-medium">{{ task.date }}</p>
        </div>
      </div>
      <p v-if="task.description" class="text-xs leading-relaxed line-clamp-2 mb-3" :class="dark ? 'text-gray-400' : 'text-gray-500'">{{ task.description }}</p>
    </template>

    <!-- Title-only card -->
    <template v-else>
      <h3 class="font-semibold text-sm mb-1 line-clamp-2" :class="dark ? 'text-gray-100' : 'text-gray-800'">{{ task.title }}</h3>
      <p class="text-xs text-purple-500 font-medium mb-1">{{ task.date }}</p>
      <p v-if="task.description" class="text-xs leading-relaxed line-clamp-2 mb-3" :class="dark ? 'text-gray-400' : 'text-gray-500'">{{ task.description }}</p>
    </template>

    <!-- Due date -->
    <p v-if="task.dueDate" class="text-xs text-orange-400 mb-2.5 flex items-center gap-1 font-medium">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      Due {{ task.dueDate }}
    </p>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-2 pt-2 border-t" :class="dark ? 'border-gray-700' : 'border-gray-50'">
      <ChannelIcon :icon="task.channel.icon" :name="task.channel.name" />
      <div class="flex items-center gap-2">
        <div class="flex -space-x-1.5">
          <img
            v-for="(m, i) in task.members.slice(0, 2)" :key="i"
            :src="m"
            class="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
          />
        </div>
        <span v-if="task.extraMembers > 0" class="text-xs text-gray-500 font-semibold ml-0.5">+{{ task.extraMembers }}</span>
        <div v-else-if="task.members.length === 0" class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ChannelIcon from './ChannelIcon.vue'

const props = defineProps({ task: Object, dark: Boolean })
defineEmits(['edit', 'delete'])

function onDragStart(e) {
  e.dataTransfer.setData('taskId', String(props.task.id))
  e.dataTransfer.effectAllowed = 'move'
}

const priorityClass = computed(() => ({
  High:   'bg-red-100 text-red-600',
  Medium: 'bg-yellow-100 text-yellow-600',
  Low:    'bg-green-100 text-green-600',
}[props.task.priority] || 'bg-gray-100 text-gray-500'))
</script>

<style scoped>
.task-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
}
</style>
