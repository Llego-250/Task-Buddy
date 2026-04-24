<template>
  <div class="flex h-screen overflow-hidden font-sans" :class="store.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'">
    <AppSidebar />
    <div class="flex flex-col flex-1 overflow-hidden">
      <AppHeader :title="routeTitle" />
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from './stores/taskStore'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'

const store = useTaskStore()
const route = useRoute()

const routeTitle = computed(() => {
  const map = { '/tasks': 'Tasks', '/dashboard': 'Dashboard', '/settings': 'Settings' }
  return map[route.path] || 'ProTasks'
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
</style>
