<template>
  <aside
    class="w-64 min-h-screen flex flex-col py-6 px-4 shrink-0 transition-colors"
    :class="store.darkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-100'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2.5 mb-10 px-2">
      <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 10h16M4 14h8"/>
        </svg>
      </div>
      <span class="font-bold text-blue-600 text-xl tracking-tight">TaskBuddy</span>
    </div>

    <!-- MENU -->
    <p class="text-[10px] font-bold tracking-[0.14em] mb-2 px-2" :class="store.darkMode ? 'text-gray-600' : 'text-gray-400'">MENU</p>
    <nav class="flex flex-col gap-1 mb-7">
      <router-link
        v-for="item in menuItems" :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all"
        :class="$route.path === item.to
          ? 'bg-blue-600 text-white shadow-sm'
          : store.darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <component :is="item.icon" class="w-4 h-4 shrink-0" />
        {{ item.label }}
      </router-link>
    </nav>

    <!-- MESSAGES -->
    <p class="text-[10px] font-bold tracking-[0.14em] mb-2 px-2" :class="store.darkMode ? 'text-gray-600' : 'text-gray-400'">MESSAGES</p>
    <nav class="flex flex-col gap-1 flex-1 overflow-y-auto">
      <button
        v-for="msg in messages" :key="msg.id"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all w-full text-left"
        :class="store.darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <ChannelIcon :icon="msg.icon" :name="msg.name" :show-name="false" />
        <span class="flex-1 truncate">{{ msg.name }}</span>
        <span v-if="msg.badge" class="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shrink-0">{{ msg.badge }}</span>
      </button>
    </nav>

    <!-- Bottom -->
    <div class="flex flex-col gap-1 mt-5 pt-5 border-t" :class="store.darkMode ? 'border-gray-800' : 'border-gray-100'">
      <router-link
        to="/settings"
        class="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all"
        :class="$route.path === '/settings'
          ? 'bg-blue-600 text-white'
          : store.darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        Settings
      </router-link>

      <button
        @click="store.toggleDark()"
        class="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all w-full text-left"
        :class="store.darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
        <span>Dark Mode</span>
        <div class="ml-auto w-9 h-5 rounded-full transition-colors relative shrink-0" :class="store.darkMode ? 'bg-blue-600' : 'bg-gray-200'">
          <div class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" :class="store.darkMode ? 'translate-x-4' : 'translate-x-0.5'"></div>
        </div>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'
import ChannelIcon from './ChannelIcon.vue'
import { MESSAGES } from '../services/taskService'
import { h } from 'vue'

const store = useTaskStore()
const $route = useRoute()
const messages = MESSAGES

const DashboardIcon = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z' })
]) }

const TasksIcon = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
]) }

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/tasks',     label: 'Tasks',     icon: TasksIcon },
]
</script>
