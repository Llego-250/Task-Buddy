<template>
  <div class="notifications-container">
    <!-- Notification Settings Modal -->
    <div v-if="showSettings" class="notification-overlay" @click="hideSettings">
      <div class="notification-modal" @click.stop>
        <div class="modal-header">
          <h3>Notification Settings</h3>
          <button @click="hideSettings" class="close-btn">×</button>
        </div>
        <div class="settings-form">
          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="settings.soundEnabled"> 
              Enable Sound Alerts
            </label>
          </div>
          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="settings.emailEnabled"> 
              Enable Email Notifications
            </label>
            <input v-if="settings.emailEnabled" v-model="settings.email" type="email" placeholder="Enter email address" class="email-input">
          </div>
          <div class="setting-group">
            <label>Default Reminder Time (minutes before due):</label>
            <select v-model="settings.defaultReminder" class="reminder-select">
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="1440">1 day</option>
            </select>
          </div>
          <button @click="saveSettings" class="save-btn">Save Settings</button>
        </div>
      </div>
    </div>

    <!-- Active Notifications -->
    <div class="active-notifications">
      <div v-for="notification in activeNotifications" :key="notification.id" 
           :class="['notification-item', `priority-${notification.priority}`]">
        <div class="notification-content">
          <div class="notification-icon">🔔</div>
          <div class="notification-text">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.dueTime) }}</div>
          </div>
        </div>
        <div class="notification-actions">
          <button @click="snoozeNotification(notification.id)" class="snooze-btn">⏰</button>
          <button @click="dismissNotification(notification.id)" class="dismiss-btn">×</button>
        </div>
      </div>
    </div>

    <!-- Snooze Options Modal -->
    <div v-if="showSnoozeOptions" class="notification-overlay" @click="hideSnoozeOptions">
      <div class="snooze-modal" @click.stop>
        <h4>Snooze for:</h4>
        <div class="snooze-options">
          <button @click="confirmSnooze(5)" class="snooze-option">5 min</button>
          <button @click="confirmSnooze(15)" class="snooze-option">15 min</button>
          <button @click="confirmSnooze(30)" class="snooze-option">30 min</button>
          <button @click="confirmSnooze(60)" class="snooze-option">1 hour</button>
        </div>
      </div>
    </div>

    <!-- Settings Button -->
    <button @click="showSettings = true" class="settings-btn" title="Notification Settings">⚙️</button>
  </div>
</template>

<script>
export default {
  name: 'EnhancedNotifications',
  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showSettings: false,
      showSnoozeOptions: false,
      currentSnoozeId: null,
      activeNotifications: [],
      settings: {
        soundEnabled: true,
        emailEnabled: false,
        email: '',
        defaultReminder: 30
      },
      checkInterval: null,
      audioContext: null,
      customReminders: new Map()
    }
  },
  mounted() {
    this.loadSettings()
    this.initAudio()
    this.startNotificationCheck()
    this.setupCustomReminders()
  },
  beforeUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
  },
  watch: {
    tasks: {
      handler() {
        this.setupCustomReminders()
      },
      deep: true
    }
  },
  methods: {
    loadSettings() {
      const saved = localStorage.getItem('notificationSettings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    },
    saveSettings() {
      localStorage.setItem('notificationSettings', JSON.stringify(this.settings))
      this.showSettings = false
      this.$emit('settings-updated', this.settings)
    },
    hideSettings() {
      this.showSettings = false
    },
    initAudio() {
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        this.audioContext = new (AudioContext || webkitAudioContext)()
      }
    },
    playNotificationSound() {
      if (!this.settings.soundEnabled || !this.audioContext) return
      
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    },
    startNotificationCheck() {
      this.checkInterval = setInterval(() => {
        this.checkForDueNotifications()
      }, 60000) // Check every minute
      
      // Initial check
      this.checkForDueNotifications()
    },
    checkForDueNotifications() {
      const now = new Date()
      
      this.tasks.forEach(task => {
        if (task.completed) return
        
        const dueTime = new Date(task.dueDate)
        const reminderTime = new Date(dueTime.getTime() - (this.settings.defaultReminder * 60000))
        
        if (now >= reminderTime && now < dueTime) {
          const existingNotification = this.activeNotifications.find(n => n.taskId === task.id)
          if (!existingNotification) {
            this.createNotification(task, 'reminder')
          }
        }
        
        if (now >= dueTime) {
          const existingOverdue = this.activeNotifications.find(n => n.taskId === task.id && n.type === 'overdue')
          if (!existingOverdue) {
            this.createNotification(task, 'overdue')
          }
        }
      })
    },
    createNotification(task, type) {
      const notification = {
        id: Date.now() + Math.random(),
        taskId: task.id,
        type,
        title: task.title,
        message: type === 'reminder' 
          ? `Due in ${this.settings.defaultReminder} minutes`
          : 'Task is overdue!',
        dueTime: task.dueDate,
        priority: task.priority || 'medium',
        createdAt: new Date()
      }
      
      this.activeNotifications.push(notification)
      this.playNotificationSound()
      
      if (this.settings.emailEnabled && this.settings.email) {
        this.sendEmailNotification(notification)
      }
      
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification(`TaskBuddy: ${notification.title}`, {
          body: notification.message,
          icon: '/vite.svg'
        })
      }
    },
    sendEmailNotification(notification) {
      // Simulate email sending (in real app, this would call an API)
      console.log('Email notification sent:', {
        to: this.settings.email,
        subject: `TaskBuddy Reminder: ${notification.title}`,
        body: `Your task "${notification.title}" ${notification.message}`
      })
      
      // Show confirmation
      this.activeNotifications.push({
        id: Date.now() + Math.random(),
        title: 'Email Sent',
        message: `Reminder email sent to ${this.settings.email}`,
        type: 'info',
        priority: 'low',
        createdAt: new Date()
      })
    },
    snoozeNotification(id) {
      this.currentSnoozeId = id
      this.showSnoozeOptions = true
    },
    confirmSnooze(minutes) {
      const notification = this.activeNotifications.find(n => n.id === this.currentSnoozeId)
      if (notification) {
        // Remove current notification
        this.dismissNotification(this.currentSnoozeId)
        
        // Schedule new notification
        setTimeout(() => {
          this.activeNotifications.push({
            ...notification,
            id: Date.now() + Math.random(),
            message: `${notification.message} (Snoozed)`,
            createdAt: new Date()
          })
          this.playNotificationSound()
        }, minutes * 60000)
      }
      
      this.hideSnoozeOptions()
    },
    hideSnoozeOptions() {
      this.showSnoozeOptions = false
      this.currentSnoozeId = null
    },
    dismissNotification(id) {
      this.activeNotifications = this.activeNotifications.filter(n => n.id !== id)
    },
    setupCustomReminders() {
      // Allow users to set custom reminder times for specific tasks
      this.tasks.forEach(task => {
        if (task.customReminders) {
          task.customReminders.forEach(reminder => {
            const reminderTime = new Date(reminder.time)
            if (reminderTime > new Date()) {
              this.customReminders.set(`${task.id}-${reminder.id}`, {
                taskId: task.id,
                time: reminderTime,
                message: reminder.message || `Custom reminder for ${task.title}`
              })
            }
          })
        }
      })
    },
    formatTime(dateTime) {
      return new Date(dateTime).toLocaleString()
    },
    requestNotificationPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  },
  created() {
    this.requestNotificationPermission()
  }
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.notification-modal, .snooze-modal {
  background: linear-gradient(135deg, rgb(30, 58, 138), rgb(6, 182, 212));
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  color: white;
  min-width: 300px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5em;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.email-input, .reminder-select {
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  outline: none;
}

.email-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.save-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
}

.active-notifications {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
}

.notification-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease;
  border-left: 4px solid;
}

.notification-item.priority-high {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255, 255, 255, 0.95));
}

.notification-item.priority-medium {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255, 255, 255, 0.95));
}

.notification-item.priority-low {
  border-left-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255, 255, 255, 0.95));
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-icon {
  font-size: 1.5em;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.notification-message {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 4px;
}

.notification-time {
  color: #888;
  font-size: 0.8em;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

.snooze-btn, .dismiss-btn {
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.snooze-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  transform: scale(1.1);
}

.dismiss-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.snooze-modal h4 {
  margin: 0 0 1rem 0;
  text-align: center;
}

.snooze-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.snooze-option {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.snooze-option:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.settings-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.settings-btn:hover {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .notifications-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .notification-modal {
    margin: 1rem;
    min-width: unset;
  }
  
  .notification-item {
    padding: 0.8rem;
  }
  
  .notification-content {
    gap: 8px;
  }
}
</style>