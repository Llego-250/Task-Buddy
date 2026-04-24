<template>
  <aside class="w-64 h-screen bg-white border-r flex flex-col justify-between" :style="fontFamily">
    <div>
      <!-- Logo -->
      <div class="flex items-center gap-2 px-6 py-5">
        <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white">
          <Menu class="w-4 h-4" />
        </div>
        <h1 class="text-lg font-semibold text-gray-800">ProTasks</h1>
      </div>

      <!-- Menu -->
      <div class="px-4">
        <p class="text-xs text-gray-400 uppercase mb-3">Menu</p>

        <SidebarItem icon="LayoutDashboard" label="Dashboard" />
        <SidebarItem icon="CheckSquare" label="Tasks" active />
      </div>

      <!-- Messages -->
      <div class="px-4 mt-6">
        <p class="text-xs text-gray-400 uppercase mb-3">Messages</p>

        <SidebarItem icon="Building2" label="Microsoft Team" />
        <SidebarItem icon="Slack" label="Slack" />
        <SidebarItem icon="Github" label="GitHub" badge="2" />
        <SidebarItem icon="MessageCircle" label="Messenger" />
        <SidebarItem icon="Mail" label="Gmail" />
        <SidebarItem icon="Gamepad2" label="Discord" />
      </div>
    </div>

    <!-- Bottom -->
    <div class="px-4 py-4 border-t">
      <SidebarItem icon="Settings" label="Settings" />

      <div class="flex items-center justify-between mt-4 px-2">
        <div class="flex items-center gap-2 text-gray-600">
          <Moon class="w-4 h-4" />
          <span class="text-sm">Dark Mode</span>
        </div>
        <button class="w-10 h-5 bg-gray-200 rounded-full relative">
          <span class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow"></span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import * as Icons from 'lucide-vue-next'

const fontFamily = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
}

const SidebarItem = {
  props: {
    icon: String,
    label: String,
    active: Boolean,
    badge: String,
  },
  components: Icons,
  template: `
    <div :class="[
      'flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer mb-2',
      active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
    ]">
      <div class="flex items-center gap-3">
        <component :is="iconComponent" class="w-4 h-4" />
        <span class="text-sm">{{ label }}</span>
      </div>
      <span v-if="badge" class="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
        {{ badge }}
      </span>
    </div>
  `,
  computed: {
    iconComponent() {
      return Icons[this.icon]
    },
  },
}
</script>

<style scoped>
/* Optional scrollbar or tweaks */
</style>
