import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const AUTH_USER_KEY = 'pt_auth_user'
const USERS_KEY = 'pt_users'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null'))
  const users = ref(JSON.parse(localStorage.getItem(USERS_KEY) || '[]'))

  const isAuthenticated = computed(() => !!user.value)

  function persistUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users.value))
  }

  function persistUserSession() {
    if (user.value) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user.value))
    else localStorage.removeItem(AUTH_USER_KEY)
  }

  function register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const exists = users.value.some(u => u.email === normalizedEmail)
    if (exists) throw new Error('Email already exists')

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    }
    users.value.push(newUser)
    persistUsers()
    user.value = { id: newUser.id, name: newUser.name, email: newUser.email }
    persistUserSession()
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.value.find(u => u.email === normalizedEmail && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    user.value = { id: found.id, name: found.name, email: found.email }
    persistUserSession()
  }

  function logout() {
    user.value = null
    persistUserSession()
  }

  return { user, isAuthenticated, register, login, logout }
})
