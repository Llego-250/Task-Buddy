<template>
  <div class="auth-page">
    <div class="auth-shell">
      <section class="auth-hero">
        <div class="auth-hero-top">
          <div class="auth-logo">TaskBuddy</div>
          <button type="button" class="auth-back-btn">Back to website</button>
        </div>
        <div class="auth-hero-copy">
          <h3>Welcome back to your</h3>
          <h3>Plan you Activities</h3>
          <div class="auth-slider-dots">
            <span></span><span class="active"></span><span></span>
          </div>
        </div>
      </section>

      <section class="auth-panel">
        <h1 class="auth-title">Sign in</h1>
        <p class="auth-subtitle">
          New here?
          <RouterLink to="/register" class="auth-inline-link">Create account</RouterLink>
        </p>

        <form class="auth-form auth-form-dark" @submit.prevent="submit">
          <input v-model="form.email" type="email" required class="auth-input auth-input-dark" placeholder="Email" />
          <input v-model="form.password" type="password" required class="auth-input auth-input-dark" placeholder="Enter your password" />

          <p v-if="error" class="auth-error">{{ error }}</p>
          <button type="submit" class="auth-button auth-button-purple">
            Sign in
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const error = ref('')
const form = reactive({ email: '', password: '' })

function submit() {
  error.value = ''
  try {
    auth.login(form)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  }
}
</script>
