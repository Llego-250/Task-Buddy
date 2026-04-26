import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authAPI } from '../services/authService'

const TOKEN_KEY = 'pt_token'
const USER_KEY = 'pt_auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || null)
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  function persist(data) {
    token.value = data.token
    user.value = { id: data.id, name: data.name, email: data.email }
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  async function register(payload) {
    const data = await authAPI.register(payload)
    persist(data)
  }

  async function login(payload) {
    const data = await authAPI.login(payload)
    persist(data)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, user, isAuthenticated, register, login, logout }
})
