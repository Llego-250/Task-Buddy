<template>
  <div class="profile-overlay" @click.self="$emit('close')">
    <div class="profile-root" :class="{ dark: isDark }">

      <!-- ── LEFT SIDEBAR ── -->
      <aside class="p-sidebar">
        <div class="p-sidebar-avatar">{{ initial }}</div>
        <h3 class="p-sidebar-name">{{ user.name }}</h3>
        <p class="p-sidebar-role">Task Buddy Member</p>

        <nav class="p-sidebar-nav">
          <button class="p-nav-item" :class="{ active: tab === 'overview' }" @click="tab = 'overview'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
            Overview
          </button>
          <button class="p-nav-item" :class="{ active: tab === 'tasks' }" @click="tab = 'tasks'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            My Tasks
          </button>
          <button class="p-nav-item" :class="{ active: tab === 'settings' }" @click="tab = 'settings'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Settings
          </button>
        </nav>

        <button class="p-logout-btn" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign Out
        </button>
      </aside>

      <!-- ── MAIN ── -->
      <main class="p-main">

        <!-- Topbar -->
        <div class="p-topbar">
          <div class="p-breadcrumb">
            <span>Home</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span>Profile</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="p-bc-active">{{ user.name }}</span>
          </div>
          <button class="p-close-btn" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Profile card -->
        <div class="p-card">
          <div class="p-card-left">
            <div class="p-big-avatar">{{ initial }}</div>
            <h2 class="p-fullname">{{ user.name }}</h2>
            <p class="p-email">{{ user.email }}</p>
            <button class="p-edit-btn">Edit Profile</button>
          </div>
          <div class="p-card-divider"></div>
          <div class="p-info-grid">
            <div class="p-info-cell">
              <span class="p-info-label">Member Since</span>
              <span class="p-info-value">{{ joinDate }}</span>
            </div>
            <div class="p-info-cell">
              <span class="p-info-label">Total Tasks</span>
              <span class="p-info-value">{{ stats.total }}</span>
            </div>
            <div class="p-info-cell">
              <span class="p-info-label">Status</span>
              <span class="p-info-value p-status-active">Active</span>
            </div>
            <div class="p-info-cell">
              <span class="p-info-label">Completed</span>
              <span class="p-info-value">{{ stats.done }}</span>
            </div>
            <div class="p-info-cell">
              <span class="p-info-label">Completion Rate</span>
              <span class="p-info-value">{{ stats.completionRate }}%</span>
            </div>
            <div class="p-info-cell">
              <span class="p-info-label">Overdue</span>
              <span class="p-info-value">{{ stats.overdue }}</span>
            </div>
          </div>
        </div>

        <!-- Task overview cards -->
        <p class="p-section-title">Task Overview</p>
        <div class="p-vitals-row">
          <div class="p-vital-card tone-blue">
            <span class="p-vital-label">To Do</span>
            <span class="p-vital-value">{{ stats.todo }}</span>
            <span class="p-vital-sub" :class="stats.todo > 5 ? 'sub-warn' : 'sub-ok'">{{ stats.todo > 5 ? 'High load' : 'On track' }}</span>
          </div>
          <div class="p-vital-card tone-indigo">
            <span class="p-vital-label">In Progress</span>
            <span class="p-vital-value">{{ stats.inProgress }}</span>
            <span class="p-vital-sub" :class="stats.inProgress > 3 ? 'sub-warn' : 'sub-ok'">{{ stats.inProgress > 3 ? 'Busy' : 'Normal' }}</span>
          </div>
          <div class="p-vital-card tone-pink">
            <span class="p-vital-label">In Review</span>
            <span class="p-vital-value">{{ stats.inReview }}</span>
            <span class="p-vital-sub sub-ok">Pending review</span>
          </div>
          <div class="p-vital-card tone-green">
            <span class="p-vital-label">Done</span>
            <span class="p-vital-value">{{ stats.done }}</span>
            <span class="p-vital-sub sub-ok">Completed</span>
          </div>
        </div>

        <!-- Recent tasks table -->
        <div class="p-table-header">
          <p class="p-section-title">Recent Tasks</p>
          <span class="p-table-total">Total {{ stats.total }} tasks</span>
        </div>
        <div class="p-table">
          <div class="p-th">
            <span>Title</span><span>Category</span><span>Priority</span><span>Due Date</span><span>Status</span>
          </div>
          <div class="p-tr" v-for="task in recentTasks" :key="task.id">
            <span class="p-td-title">{{ task.title }}</span>
            <span class="p-td-muted">{{ task.category || '—' }}</span>
            <span><em class="p-badge" :class="`pri-${(task.priority||'').toLowerCase()}`">{{ task.priority || '—' }}</em></span>
            <span class="p-td-muted">{{ task.dueDate ? task.dueDate.slice(0,10) : '—' }}</span>
            <span><em class="p-badge" :class="`col-${task.columnId}`">{{ columnLabel(task.columnId) }}</em></span>
          </div>
          <div v-if="!recentTasks.length" class="p-empty">No tasks found.</div>
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

const isDark = computed(() => taskStore.darkMode)
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
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ── Root ── */
.profile-root {
  display: flex;
  width: 100%;
  max-width: 1020px;
  height: 88vh;
  background: #f6f7fb;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.16);
  animation: slideUp 0.25s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* dark root */
.profile-root.dark { background: #0f172a; }

/* ── Sidebar ── */
.p-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e8ebf2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 14px 24px;
}

.dark .p-sidebar {
  background: #1e293b;
  border-right-color: #334155;
}

.p-sidebar-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

.p-sidebar-name {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin: 0 0 3px;
}

.dark .p-sidebar-name { color: #e2e8f0; }

.p-sidebar-role {
  font-size: 11px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 24px;
}

.dark .p-sidebar-role { color: #64748b; }

.p-sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.p-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
}

.p-nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }

.p-nav-item:hover {
  background: #f1f5f9;
  color: #1f2937;
}

.dark .p-nav-item:hover {
  background: #334155;
  color: #e2e8f0;
}

.p-nav-item.active {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.p-logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #ef4444;
  background: #fef2f2;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}

.p-logout-btn svg { width: 16px; height: 16px; }
.p-logout-btn:hover { background: #fee2e2; }
.dark .p-logout-btn { background: rgba(239,68,68,0.1); }
.dark .p-logout-btn:hover { background: rgba(239,68,68,0.18); }

/* ── Main ── */
.p-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Topbar */
.p-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p-breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6b7280;
}

.dark .p-breadcrumb { color: #64748b; }
.p-breadcrumb svg { width: 13px; height: 13px; }

.p-bc-active {
  color: #1f2937;
  font-weight: 600;
}

.dark .p-bc-active { color: #e2e8f0; }

.p-close-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #e4e8f0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.15s;
}

.p-close-btn svg { width: 15px; height: 15px; }
.p-close-btn:hover { background: #f1f5f9; }
.dark .p-close-btn { background: #1e293b; border-color: #334155; color: #94a3b8; }
.dark .p-close-btn:hover { background: #334155; }

/* Profile card */
.p-card {
  background: #fff;
  border: 1px solid #e4e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.dark .p-card {
  background: #1e293b;
  border-color: #334155;
}

.p-card-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 190px;
  padding-right: 24px;
}

.p-big-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-size: 34px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.p-fullname {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 3px;
  letter-spacing: -0.01em;
}

.dark .p-fullname { color: #e2e8f0; }

.p-email {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 14px;
}

.dark .p-email { color: #64748b; }

.p-edit-btn {
  padding: 6px 18px;
  border-radius: 999px;
  border: 1.5px solid #2563eb;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.p-edit-btn:hover { background: #eff6ff; }
.dark .p-edit-btn { border-color: #3b82f6; color: #60a5fa; }
.dark .p-edit-btn:hover { background: rgba(59,130,246,0.1); }

.p-card-divider {
  width: 1px;
  background: #e8ebf2;
  align-self: stretch;
  margin: 0 24px;
}

.dark .p-card-divider { background: #334155; }

.p-info-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px 12px;
}

.p-info-cell { display: flex; flex-direction: column; gap: 3px; }

.p-info-label {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dark .p-info-label { color: #64748b; }

.p-info-value {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.dark .p-info-value { color: #e2e8f0; }

.p-status-active { color: #16a34a; }

/* Section title */
.p-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.01em;
}

.dark .p-section-title { color: #e2e8f0; }

/* Vitals */
.p-vitals-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.p-vital-card {
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid transparent;
}

/* reuse dashboard tone classes */
.tone-blue   { background: #eef2f7; border-color: #dde6f3; }
.tone-indigo { background: #f0eff9; border-color: #e2e0f5; }
.tone-green  { background: #eef4ec; border-color: #ddeeda; }
.tone-pink   { background: #f6eef0; border-color: #eedde2; }

.dark .tone-blue   { background: rgba(37,99,235,0.12);  border-color: rgba(37,99,235,0.2); }
.dark .tone-indigo { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.2); }
.dark .tone-green  { background: rgba(22,163,74,0.12);  border-color: rgba(22,163,74,0.2); }
.dark .tone-pink   { background: rgba(236,72,153,0.12); border-color: rgba(236,72,153,0.2); }

.p-vital-label {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dark .p-vital-label { color: #64748b; }

.p-vital-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1.1;
}

.dark .p-vital-value { color: #f1f5f9; }

.p-vital-sub { font-size: 11px; font-weight: 600; }
.sub-ok   { color: #16a34a; }
.sub-warn { color: #ef4444; }

/* Table */
.p-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p-table-total {
  font-size: 12px;
  color: #6b7280;
}

.dark .p-table-total { color: #64748b; }

.p-table {
  background: #fff;
  border: 1px solid #e4e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.dark .p-table {
  background: #1e293b;
  border-color: #334155;
}

.p-th {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 10px 18px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e4e8f0;
  background: #f6f7fb;
}

.dark .p-th {
  background: #0f172a;
  border-bottom-color: #334155;
  color: #64748b;
}

.p-tr {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 12px 18px;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
  transition: background 0.1s;
}

.dark .p-tr {
  color: #cbd5e1;
  border-bottom-color: #1e293b;
}

.p-tr:last-child { border-bottom: none; }
.p-tr:hover { background: #f9fafb; }
.dark .p-tr:hover { background: #0f172a; }

.p-td-title {
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}

.dark .p-td-title { color: #e2e8f0; }

.p-td-muted { color: #6b7280; font-size: 12px; }
.dark .p-td-muted { color: #64748b; }

.p-empty {
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
}

/* Badges — reuse style.css tokens */
.p-badge {
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  white-space: nowrap;
}

.pri-high   { background: #fee2e2; color: #dc2626; }
.pri-medium { background: #fef3c7; color: #d97706; }
.pri-low    { background: #dcfce7; color: #16a34a; }

.col-todo       { background: #f1f5f9; color: #475569; }
.col-inprogress { background: #dbeafe; color: #2563eb; }
.col-inreview   { background: #fed7aa; color: #ea580c; }
.col-done       { background: #dcfce7; color: #16a34a; }
</style>
