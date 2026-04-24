import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '../views/Tasks/TasksView.vue'
import DashboardView from '../views/Dashboard/DashboardView.vue'
import SettingsView from '../views/Settings/SettingsView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import RegisterView from '../views/Auth/RegisterView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/tasks', component: TasksView, meta: { requiresAuth: true } },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/settings', component: SettingsView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAuthenticated = !!JSON.parse(localStorage.getItem('pt_auth_user') || 'null')

  if (to.meta.requiresAuth && !isAuthenticated) return '/login'
  if (to.meta.guestOnly && isAuthenticated) return '/dashboard'
  return true
})

export default router
