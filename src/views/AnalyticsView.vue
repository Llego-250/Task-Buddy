<template>
  <div class="page-container">
    <div class="view-header">
      <h2>Analytics Dashboard</h2>
    </div>
    <AnalyticsDashboard 
      :show-dashboard="true"
      :tasks="store.tasks"
      @hide-dashboard="$router.push('/')"
    />
  </div>
</template>

<script setup>
import { useTaskStore } from '../stores/taskStore'
import AnalyticsDashboard from '../components/AnalyticsDashboard.vue'

const store = useTaskStore()
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.view-header {
  margin-bottom: 2rem;
  text-align: center;
}
</style>
