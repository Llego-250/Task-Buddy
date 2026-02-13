<template>
  <div class="main-container">
    <div class="header">
      <h1 class="title">TaskBuddy</h1>
      <h2 class="subtitle">Hello Beautiful User❤️, this is the personal task manager</h2>
      
      <nav class="main-nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/analytics" class="nav-link">Analytics</router-link>
        <router-link to="/calendar" class="nav-link">Calendar</router-link>
        <router-link to="/reports" class="nav-link">Reports</router-link>
      </nav>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <ThemeToggle />
    
    <div class="notifications">
      <transition-group name="list">
        <div v-for="notification in store.notifications" :key="notification.id" class="notification">
          {{ notification.message }}
          <button @click="store.dismissNotification(notification.id)">×</button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from './stores/taskStore'
import ThemeToggle from './components/ThemeToggle.vue'

const store = useTaskStore()
</script>

<style>
/* Global Styles from original App.vue */
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Theme Variables */
:root[data-theme="light"] {
  --bg-primary: linear-gradient(135deg, #e0f2fe, #b3e5fc);
  --bg-secondary: rgba(255, 255, 255, 0.9);
  --bg-hover: rgba(0, 0, 0, 0.1);
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --border-color: rgba(0, 0, 0, 0.2);
  --accent-color: #2196f3;
}

:root[data-theme="dark"] {
  --bg-primary: linear-gradient(135deg, rgb(30, 58, 138), rgb(6, 182, 212));
  --bg-secondary: rgba(255, 255, 255, 0.1);
  --bg-hover: rgba(255, 255, 255, 0.2);
  --text-primary: rgba(255, 255, 255, 0.87);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.3);
  --accent-color: #64b5f6;
}

body {
  font-family: Arial, sans-serif;
  margin: 0px;
  background: var(--bg-primary);
  min-width: 320px;
  min-height: 100vh;
  padding: 0;
  display: flex;
  color: var(--text-primary);
  overflow-x: hidden;
}

/* Nav Styles */
.main-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.router-link-active {
  background: var(--accent-color);
  color: white;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Keeping Global Styles for Child Views */
.main-container {
  transition: filter 0.3s ease;
  flex: 1;
  /* margin-left: 70px; Removed as sidebar is gone/moved */
  margin: 0 auto;
  max-width: 1280px;
  padding: 2rem;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.title {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: var(--text-primary);
  font-size: 1rem;
  margin: 0 1rem 1rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
  }
  .subtitle {
    font-size: 1rem;
    margin: 0 1rem 1.5rem;
  }
  .main-nav {
    flex-wrap: wrap;
  }
}

/* Notifications */
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}

.notification {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.notification button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  margin-left: 10px;
}

/* Shared Component Styles (needed for Views) */
.card-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3.5rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 0.5rem;
}
.card{
  flex: 1;
  min-width: 220px;
  max-width: 320px;
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  color: var(--text-primary);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
}
.card.completed {
  background: linear-gradient(rgb(34, 197, 94), rgba(82, 108, 96, 0.299), rgb(21, 128, 61));
}
.card.delayed {
  background: linear-gradient(rgb(239, 68, 68), rgba(108, 82, 82, 0.299), rgb(185, 28, 28));
}
.card-title{
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.8rem;
  text-align: center;
}
.task{
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  padding: 0.8rem;
}
.task-item{
  padding: 0.5rem;
  margin: 0.4rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}
.task-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
.task-item.expanded {
  background: rgba(255, 255, 255, 0.15);
}
.task-description {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.9em;
  opacity: 0.9;
}
.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.2rem;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.task-hours {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.65em;
  font-weight: bold;
}

.subtasks {
  margin-top: 1rem;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 0;
  font-size: 0.9em;
}

.subtask-item input[type="checkbox"] {
  margin: 0;
  transform: scale(1.2);
}

.subtask-item span.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.subtask-hours {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.15);
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 0.8em;
}
.completed-item {
  text-decoration: line-through;
  opacity: 0.8;
}
.complete-btn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}
</style>