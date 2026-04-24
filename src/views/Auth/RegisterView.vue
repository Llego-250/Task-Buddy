<template>
  <div class="auth-page">
    <div class="auth-shell">
      <section class="auth-hero">
        <div class="auth-hero-top">
          <div class="auth-logo">TaskBuddy</div>
          <button type="button" class="auth-back-btn">Back to website</button>
        </div>
        <div class="auth-hero-copy">
          <h3>Planning Future,</h3>
          <h3>Tremendous Progres</h3>
          <div class="auth-slider-dots">
            <span></span><span></span><span class="active"></span>
          </div>
        </div>
      </section>

      <section class="auth-panel">
        <h1 class="auth-title">Create an account</h1>
        <p class="auth-subtitle">
          Already have an account?
          <RouterLink to="/login" class="auth-inline-link">Log in</RouterLink>
        </p>

        <form class="auth-form auth-form-dark" @submit.prevent="submit">
          <div class="auth-row">
            <input v-model="form.firstName" type="text" required class="auth-input auth-input-dark" placeholder="First name" />
            <input v-model="form.lastName" type="text" required class="auth-input auth-input-dark" placeholder="Last name" />
          </div>

          <input v-model="form.email" type="email" required class="auth-input auth-input-dark" placeholder="Email" />
          <input v-model="form.password" type="password" required minlength="6" class="auth-input auth-input-dark" placeholder="Enter your password" />

          <label class="auth-check">
            <input v-model="form.acceptTerms" type="checkbox" required />
            <span>I agree to the <a href="#" @click.prevent>Terms & Conditions</a></span>
          </label>

          <p v-if="error" class="auth-error">{{ error }}</p>
          <button type="submit" class="auth-button auth-button-purple">
            Create account
          </button>
        </form>

        <div class="auth-divider"><span>Or register with</span></div>

        <div class="auth-socials">
          <button type="button" class="auth-social-btn">Google</button>
          <button type="button" class="auth-social-btn">Apple</button>
        </div>
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
const form = reactive({ firstName: '', lastName: '', email: '', password: '', acceptTerms: false })

function submit() {
  error.value = ''
  try {
    auth.register({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password: form.password,
    })
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  }
}
</script>
