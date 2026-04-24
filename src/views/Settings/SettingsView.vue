<template>
  <div class="p-6 bg-gray-50 flex-1">
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg">
      <h2 class="font-semibold text-gray-800 mb-4">Settings</h2>
      <div class="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <p class="text-sm font-medium text-gray-700">Dark Mode</p>
          <p class="text-xs text-gray-400">Toggle dark/light theme</p>
        </div>
        <button @click="store.toggleDark()" class="w-11 h-6 rounded-full transition-colors relative" :class="store.darkMode ? 'bg-blue-600' : 'bg-gray-200'">
          <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" :class="store.darkMode ? 'translate-x-6' : 'translate-x-1'"></div>
        </button>
      </div>
      <div class="flex items-center justify-between py-3">
        <div>
          <p class="text-sm font-medium text-gray-700">Clear All Tasks</p>
          <p class="text-xs text-gray-400">Remove all tasks from the board</p>
        </div>
        <button @click="clearTasks" class="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors">Clear</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '../../stores/taskStore'
const store = useTaskStore()
function clearTasks() {
  if (confirm('Clear all tasks?')) { store.tasks = []; localStorage.removeItem('pt_tasks') }
}
</script>
