import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '../views/Tasks/TasksView.vue'
import DashboardView from '../views/Dashboard/DashboardView.vue'
import SettingsView from '../views/Settings/SettingsView.vue'

const routes = [
  { path: '/', redirect: '/tasks' },
  { path: '/tasks', component: TasksView },
  { path: '/dashboard', component: DashboardView },
  { path: '/settings', component: SettingsView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
