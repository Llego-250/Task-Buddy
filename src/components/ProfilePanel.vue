<template>
  <!-- Full-screen overlay -->
  <div class="profile-overlay" @click.self="$emit('close')">
    <div class="profile-root">

      <!-- ── LEFT SIDEBAR ── -->
      <aside class="profile-sidebar">
        <div class="sidebar-avatar-wrap">
          <div class="sidebar-avatar">{{ initial }}</div>
        </div>
        <h3 class="sidebar-name">{{ user.name }}</h3>
        <p class="sidebar-role">Task Buddy Member</p>

        <nav class="sidebar-nav">
          <button class="nav-item" :class="{ active: tab === 'overview' }" @click="tab = 'overview'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Overview
          </button>
          <button class="nav-item" :class="{ active: tab === 'tasks' }" @click="tab = 'tasks'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            My Tasks
          </button>
          <button class="nav-item" :class="{ active: tab === 'settings' }" @click="tab = 'settings'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Settings
          </button>
        </nav>

        <button class="sidebar-logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign Out
        </button>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <main class="profile-main">

        <!-- Breadcrumb + close -->
        <div class="main-topbar">
          <div class="breadcrumb">
            <span>Home</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span>Profile</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="bc-active">{{ user.name }}</span>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Profile card -->
        <div class="profile-card">
          <div class="profile-card-left">
            <div class="profile-big-avatar">{{ initial }}</div>
            <h2 class="profile-fullname">{{ user.name }}</h2>
            <p class="profile-email">{{ user.email }}</p>
            <button class="edit-btn">Edit Profile</button>
          </div>
          <div class="profile-card-divider"></div>
          <div class="profile-info-grid">
            <div class="info-cell">
              <span class="info-label">Member Since</span>
              <span class="info-value">{{ joinDate }}</span>
            </div>
            <div class="info-cell">
              <span class="info-label">Total Tasks</span>
              <span class="info-value">{{ stats.total }}</span>
            </div>
            <div class="info-cell">
              <span class="info-label">Status</span>
              <span class="info-value status-active">Active</span>
            </div>
            <div class="info-cell">
              <span class="info-label">Completed</span>
              <span class="info-value">{{ stats.done }}</span>
            </div>
            <div class="info-cell">
              <span class="info-label">Completion Rate</span>
              <span class="info-value">{{ stats.completionRate }}%</span>
            </div>
            <div class="info-cell">
              <span class="info-label">Overdue</span>
              <span class="info-value">{{ stats.overdue }}</span>
            </div>
          </div>
        </div>

        <!-- Task Stats cards -->
        <p class="section-title">Task Overview</p>
        <div class="vitals-row">
          <div class="vital-card">
            <span class="vital-label">To Do</span>
            <span class="vital-value">{{ stats.todo }}</span>
            <span class="vital-sub" :class="stats.todo > 5 ? 'warn' : 'ok'">{{ stats.todo > 5 ? 'High load' : 'On track' }}</span>
          </div>
          <div class="vital-card">
            <span class="vital-label">In Progress</span>
            <span class="vital-value">{{ stats.inProgress }}</span>
            <span class="vital-sub" :class="stats.inProgress > 3 ? 'warn' : 'ok'">{{ stats.inProgress > 3 ? 'Busy' : 'Normal' }}</span>
          </div>
          <div class="vital-card">
            <span class="vital-label">In Review</span>
            <span class="vital-value">{{ stats.inReview }}</span>
            <span class="vital-sub ok">Pending review</span>
          </div>
          <div class="vital-card">
            <span class="vital-label">Done</span>
            <span class="vital-value">{{ stats.done }}</span>
            <span class="vital-sub ok">Completed</span>
          </div>
        </div>

        <!-- Recent tasks table -->
        <div class="history-header">
          <p class="section-title" style="margin:0">Recent Tasks</p>
          <span class="history-total">Total {{ stats.total }} tasks</span>
        </div>
        <div class="history-table">
          <div class="ht-head">
            <span>Title</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Due Date</span>
            <span>Status</span>
          </div>
          <div class="ht-row" v-for="task in recentTasks" :key="task.id">
            <span class="ht-title">{{ task.title }}</span>
            <span class="ht-cat">{{ task.category || '—' }}</span>
            <span><em class="priority-badge" :class="`p-${(task.priority||'').toLowerCase()}`">{{ task.priority || '—' }}</em></span>
            <span class="ht-date">{{ task.dueDate ? task.dueDate.slice(0,10) : '—' }}</span>
            <span><em class="status-badge" :class="`s-${task.columnId}`">{{ columnLabel(task.columnId) }}</em></span>
          </div>
          <div v-if="!recentTasks.length" class="ht-empty">No tasks found.</div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTaskStore } from '../stores/taskStore'

defineEmits(['close'])

const authStore = useAuthStore()
const taskStore = useTaskStore()
const router = useRouter()
const tab = ref('overview')

const user = computed(() => authStore.user || { name: 'User', email: '' })
const initial = computed(() => (user.value.name || 'U')[0].toUpperCase())
const joinDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })

const stats = computed(() => {
  const tasks = taskStore.tasks
  const total = tasks.length
  const done = tasks.filter(t => t.columnId === 'done').length
  const inProgress = tasks.filter(t => t.columnId === 'inprogress').length
  const inReview = tasks.filter(t => t.columnId === 'inreview').length
  const todo = tasks.filter(t => t.columnId === 'todo').length
  const today = new Date().toISOString().slice(0, 10)
  const overdue = tasks.filter(t => t.dueDate && t.dueDate.slice(0, 10) < today && t.columnId !== 'done').length
  return { total, done, inProgress, inReview, todo, overdue, completionRate: total ? Math.round((done / total) * 100) : 0 }
})

const recentTasks = computed(() => taskStore.tasks.slice(0, 8))

function columnLabel(id) {
  return { todo: 'To Do', inprogress: 'In Progress', inreview: 'In Review', done: 'Done' }[id] || id
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ── Overlay ── */
.profile-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* ── Root card ── */
.profile-root {
  display: flex;
  width: 100%;
  max-width: 1020px;
  height: 88vh;
  background: #f5f6fa;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
}

/* ── Sidebar ── */
.profile-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px 24px;
  border-right: 1px solid #f0f0f0;
}

.sidebar-avatar-wrap {
  position: relative;
  margin-bottom: 14px;
}

.sidebar-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #22c55e;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #dcfce7;
}

.sidebar-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
  margin: 0 0 4px;
}

.sidebar-role {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 0 0 28px;
}

.sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
  width: 100%;
}

.nav-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.nav-item:hover { background: #f3f4f6; color: #111; }
.nav-item.active { background: #f0fdf4; color: #16a34a; font-weight: 600; }

.sidebar-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
  background: #fff1f2;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}

.sidebar-logout svg { width: 16px; height: 16px; }
.sidebar-logout:hover { background: #fee2e2; }

/* ── Main ── */
.profile-main {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Breadcrumb */
.main-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9ca3af;
}

.breadcrumb svg { width: 14px; height: 14px; }
.bc-active { color: #1a1a2e; font-weight: 600; }

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.15s;
}

.close-btn svg { width: 16px; height: 16px; }
.close-btn:hover { background: #f3f4f6; }

/* Profile card */
.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: flex-start;
  gap: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.profile-card-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 200px;
  padding-right: 28px;
}

.profile-big-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #22c55e;
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  border: 4px solid #dcfce7;
}

.profile-fullname {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px;
}

.profile-email {
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 16px;
}

.edit-btn {
  padding: 7px 20px;
  border-radius: 20px;
  border: 1.5px solid #22c55e;
  background: transparent;
  color: #16a34a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.edit-btn:hover { background: #f0fdf4; }

.profile-card-divider {
  width: 1px;
  background: #f0f0f0;
  align-self: stretch;
  margin: 0 28px;
}

.profile-info-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 16px;
}

.info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #9ca3af;
}

.info-value {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
}

.status-active {
  color: #16a34a;
}

/* Section title */
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

/* Vitals row */
.vitals-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.vital-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.vital-label {
  font-size: 12px;
  color: #9ca3af;
}

.vital-value {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.1;
}

.vital-sub {
  font-size: 11px;
  font-weight: 600;
}

.vital-sub.ok { color: #16a34a; }
.vital-sub.warn { color: #ef4444; }

/* History */
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-total {
  font-size: 12px;
  color: #9ca3af;
}

.history-table {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.ht-head {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.ht-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 13px 20px;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  align-items: center;
  transition: background 0.1s;
}

.ht-row:last-child { border-bottom: none; }
.ht-row:hover { background: #f9fafb; }

.ht-title {
  font-weight: 500;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}

.ht-cat { color: #6b7280; font-size: 12px; }
.ht-date { color: #6b7280; font-size: 12px; }

.ht-empty {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}

/* Badges */
.priority-badge, .status-badge {
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.p-high   { background: #fee2e2; color: #dc2626; }
.p-medium { background: #fef9c3; color: #ca8a04; }
.p-low    { background: #dcfce7; color: #16a34a; }

.s-todo       { background: #f1f5f9; color: #64748b; }
.s-inprogress { background: #dbeafe; color: #2563eb; }
.s-inreview   { background: #ffedd5; color: #ea580c; }
.s-done       { background: #dcfce7; color: #16a34a; }
</style>
