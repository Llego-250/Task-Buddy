<template>
  <header
    class="flex items-center justify-between px-8 py-4 border-b shrink-0 transition-colors"
    :class="store.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
  >
    <h1 class="text-[42px] font-bold tracking-[-0.02em] leading-none" :class="store.darkMode ? 'text-white' : 'text-gray-800'">
      {{ title }}
    </h1>

    <div class="flex items-center gap-2.5">
      <!-- Messages icon -->
      <button
        class="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors"
        :class="store.darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-400 rounded-full ring-2 ring-white"></span>
      </button>

      <!-- Bell icon -->
      <button
        class="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors"
        :class="store.darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
      </button>

      <!-- Avatar -->
      <div
        @click="showProfile = true"
        class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer select-none ring-2 ring-transparent hover:ring-green-300 transition-all ml-1"
      >
        {{ initial }}
      </div>
    </div>

    <ProfilePanel v-if="showProfile" @close="showProfile = false" />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useAuthStore } from '../stores/authStore'
import ProfilePanel from './ProfilePanel.vue'

defineProps({ title: { type: String, default: 'Tasks' } })
const store = useTaskStore()
const authStore = useAuthStore()
const showProfile = ref(false)
const initial = computed(() => (authStore.user?.name || 'U')[0].toUpperCase())
</script>
