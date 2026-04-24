<template>
  <div
  class="task-card bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer group relative select-none"
  :class="dark ? 'bg-gray-800 border-gray-700' : ''"
    draggable="true"
    :data-task-id="task.id"
    @click="$emit('preview', task)"
    @dragstart.stop="onDragStart"
  >
    <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

    <!-- Image card -->
    <template v-if="task.image">
      <img :src="task.image" :alt="task.title" class="w-full h-36 object-cover rounded-xl mb-3 shadow-sm" />
      <h3 class="font-semibold text-gray-800 text-[20px] leading-tight mb-2 line-clamp-2" :class="dark ? 'text-gray-100' : ''">{{ task.title }}</h3>
      <p class="text-xs text-[#7f8ba4] mb-3 font-semibold">{{ task.date }}</p>
    </template>

    <!-- Title-only card -->
    <template v-else>
      <h3 class="font-semibold text-[20px] leading-tight mb-2 line-clamp-2" :class="dark ? 'text-gray-100' : 'text-gray-800'">{{ task.title }}</h3>
      <p class="text-xs text-[#7f8ba4] font-semibold mb-2">{{ task.date }}</p>
      <p v-if="task.description" class="text-sm leading-relaxed line-clamp-2 mb-3" :class="dark ? 'text-gray-400' : 'text-gray-500'">{{ task.description }}</p>
    </template>

    <!-- Due date -->
    <p v-if="task.dueDate" class="text-xs text-orange-400 mb-2.5 flex items-center gap-1 font-medium">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      Due {{ task.dueDate }}
    </p>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-2 pt-3 border-t" :class="dark ? 'border-gray-700' : 'border-gray-100'">
      <ChannelIcon :icon="task.channel.icon" :name="task.channel.name" />
      <div class="flex items-center gap-2 text-xs font-semibold text-gray-400">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1"/>
        </svg>
        Personal
      </div>
    </div>
  </div>
</template>

<script setup>
import ChannelIcon from './ChannelIcon.vue'

const props = defineProps({ task: Object, dark: Boolean })
defineEmits(['edit', 'delete', 'preview'])

function onDragStart(e) {
  e.dataTransfer.setData('taskId', String(props.task.id))
  e.dataTransfer.effectAllowed = 'move'
}
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
