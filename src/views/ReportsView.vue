<template>
  <div class="page-container">
    <div class="view-header">
      <h2>Time Reports</h2>
    </div>
    <TimeReports 
      :show-reports="true"
      :tasks="store.filteredTasks || store.tasks" 
      @hide-reports="$router.push('/')"
    />
  </div>
</template>

<script setup>
import { useTaskStore } from '../stores/taskStore'
import TimeReports from '../components/TimeReports.vue'

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
