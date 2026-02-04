<template>
  <div class="notifications-demo">
    <div class="demo-header">
      <h3>🔔 Enhanced Notifications Demo</h3>
      <p>Test all notification features</p>
    </div>
    
    <div class="demo-controls">
      <div class="control-group">
        <h4>Sound Alerts</h4>
        <button @click="testSound" class="demo-btn sound-btn">🔊 Test Sound</button>
      </div>
      
      <div class="control-group">
        <h4>Custom Reminders</h4>
        <div class="reminder-test">
          <input v-model="testReminderTime" type="number" min="1" max="60" placeholder="Minutes">
          <button @click="setTestReminder" class="demo-btn reminder-btn">⏰ Set Reminder</button>
        </div>
      </div>
      
      <div class="control-group">
        <h4>Email Notifications</h4>
        <div class="email-test">
          <input v-model="testEmail" type="email" placeholder="test@example.com">
          <button @click="testEmailNotification" class="demo-btn email-btn">📧 Test Email</button>
        </div>
      </div>
      
      <div class="control-group">
        <h4>Snooze Options</h4>
        <button @click="createSnoozeableNotification" class="demo-btn snooze-btn">😴 Create Snoozeable Alert</button>
      </div>
      
      <div class="control-group">
        <h4>Priority Notifications</h4>
        <div class="priority-buttons">
          <button @click="createPriorityNotification('high')" class="demo-btn priority-high">🚨 High Priority</button>
          <button @click="createPriorityNotification('medium')" class="demo-btn priority-medium">⚠️ Medium Priority</button>
          <button @click="createPriorityNotification('low')" class="demo-btn priority-low">ℹ️ Low Priority</button>
        </div>
      </div>
    </div>
    
    <div class="demo-status">
      <h4>Demo Status</h4>
      <div class="status-items">
        <div class="status-item">
          <span class="status-label">Browser Notifications:</span>
          <span :class="['status-value', notificationPermission]">{{ notificationPermission }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Audio Context:</span>
          <span :class="['status-value', audioSupported ? 'granted' : 'denied']">{{ audioSupported ? 'Supported' : 'Not Supported' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Active Reminders:</span>
          <span class="status-value">{{ activeReminders }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotificationService from '../services/NotificationService.js'

export default {
  name: 'NotificationsDemo',
  data() {
    return {
      testReminderTime: 1,
      testEmail: '',
      notificationPermission: Notification.permission,
      audioSupported: false,
      activeReminders: 0
    }
  },
  mounted() {
    this.checkAudioSupport()
    this.updateActiveReminders()
  },
  methods: {
    checkAudioSupport() {
      this.audioSupported = !!(window.AudioContext || window.webkitAudioContext)
    },
    
    updateActiveReminders() {
      // This would normally get the count from the notification service
      this.activeReminders = NotificationService.reminders.size
    },
    
    testSound() {
      NotificationService.playNotificationSound()
      this.$emit('demo-action', 'Sound alert played')
    },
    
    setTestReminder() {
      if (this.testReminderTime > 0) {
        const reminderTime = new Date(Date.now() + this.testReminderTime * 60000)
        NotificationService.setCustomReminder(
          'demo-task',
          reminderTime,
          `Demo reminder set for ${this.testReminderTime} minute(s)`
        )
        this.updateActiveReminders()
        this.$emit('demo-action', `Reminder set for ${this.testReminderTime} minute(s)`)
      }
    },
    
    testEmailNotification() {
      if (this.testEmail) {
        NotificationService.sendEmailNotification(
          'Demo Task',
          'This is a test email notification from TaskBuddy',
          this.testEmail
        )
        this.$emit('demo-action', `Test email sent to ${this.testEmail}`)
      }
    },
    
    createSnoozeableNotification() {
      const notification = {
        id: Date.now(),
        title: 'Demo Snoozeable Task',
        message: 'This notification can be snoozed',
        type: 'demo',
        priority: 'medium',
        dueTime: new Date(),
        createdAt: new Date()
      }
      
      this.$emit('create-notification', notification)
      this.$emit('demo-action', 'Snoozeable notification created')
    },
    
    createPriorityNotification(priority) {
      const messages = {
        high: 'Urgent task requires immediate attention!',
        medium: 'Task reminder - moderate priority',
        low: 'Gentle reminder about your task'
      }
      
      const notification = {
        id: Date.now(),
        title: `${priority.toUpperCase()} Priority Demo`,
        message: messages[priority],
        type: 'demo',
        priority,
        dueTime: new Date(),
        createdAt: new Date()
      }
      
      this.$emit('create-notification', notification)
      NotificationService.playNotificationSound()
      this.$emit('demo-action', `${priority} priority notification created`)
    }
  }
}
</script>

<style scoped>
.notifications-demo {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.demo-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5em;
}

.demo-header p {
  margin: 0;
  opacity: 0.8;
}

.demo-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.control-group {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-group h4 {
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1em;
  text-align: center;
}

.demo-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 8px;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.sound-btn {
  background: linear-gradient(135deg, #10b981, #059669);
}

.reminder-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.email-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.snooze-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.priority-high {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.priority-medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.priority-low {
  background: linear-gradient(135deg, #10b981, #059669);
}

.reminder-test, .email-test {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-test input, .email-test input {
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
}

.reminder-test input::placeholder, .email-test input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.priority-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-status {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.demo-status h4 {
  color: white;
  margin: 0 0 1rem 0;
  text-align: center;
}

.status-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.status-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.status-value {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status-value.granted {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status-value.denied {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status-value.default {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

@media (max-width: 768px) {
  .demo-controls {
    grid-template-columns: 1fr;
  }
  
  .priority-buttons {
    flex-direction: column;
  }
  
  .status-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>