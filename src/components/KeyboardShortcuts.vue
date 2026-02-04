<template>
  <div v-if="showHelp" class="shortcuts-overlay" @click="hideHelp">
    <div class="shortcuts-modal" @click.stop>
      <h3>Keyboard Shortcuts</h3>
      <div class="shortcuts-list">
        <div class="shortcut-item">
          <kbd>Ctrl + N</kbd>
          <span>New Task</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl + K</kbd>
          <span>Search Tasks</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl + B</kbd>
          <span>Bulk Actions</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl + T</kbd>
          <span>Toggle Theme</span>
        </div>
        <div class="shortcut-item">
          <kbd>Escape</kbd>
          <span>Close Modal</span>
        </div>
        <div class="shortcut-item">
          <kbd>?</kbd>
          <span>Show Shortcuts</span>
        </div>
      </div>
      <button @click="hideHelp" class="close-btn">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyboardShortcuts',
  props: {
    showHelp: Boolean
  },
  emits: ['hide-help', 'new-task', 'search', 'bulk-toggle', 'theme-toggle'],
  mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleKeydown(e) {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        this.$emit('new-task')
      } else if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        this.$emit('search')
      } else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        this.$emit('bulk-toggle')
      } else if (e.ctrlKey && e.key === 't') {
        e.preventDefault()
        this.$emit('theme-toggle')
      } else if (e.key === 'Escape') {
        this.$emit('hide-help')
      } else if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        this.$emit('hide-help')
      }
    },
    hideHelp() {
      this.$emit('hide-help')
    }
  }
}
</script>

<style scoped>
.shortcuts-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.shortcuts-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  color: var(--text-primary);
}
.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 1rem 0;
}
.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
kbd {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 12px;
}
</style>