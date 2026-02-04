// NotificationService.js - Utility for managing task notifications

class NotificationService {
  constructor() {
    this.reminders = new Map()
    this.settings = this.loadSettings()
  }

  loadSettings() {
    const saved = localStorage.getItem('notificationSettings')
    return saved ? JSON.parse(saved) : {
      soundEnabled: true,
      emailEnabled: false,
      email: '',
      defaultReminder: 30
    }
  }

  saveSettings(settings) {
    this.settings = settings
    localStorage.setItem('notificationSettings', JSON.stringify(settings))
  }

  // Set custom reminder for a task
  setCustomReminder(taskId, reminderTime, message) {
    const reminderId = `${taskId}-${Date.now()}`
    const reminder = {
      id: reminderId,
      taskId,
      time: new Date(reminderTime),
      message,
      active: true
    }
    
    this.reminders.set(reminderId, reminder)
    this.scheduleReminder(reminder)
    return reminderId
  }

  // Schedule a reminder using setTimeout
  scheduleReminder(reminder) {
    const now = new Date()
    const delay = reminder.time.getTime() - now.getTime()
    
    if (delay > 0) {
      setTimeout(() => {
        if (this.reminders.has(reminder.id) && this.reminders.get(reminder.id).active) {
          this.triggerNotification(reminder)
        }
      }, delay)
    }
  }

  // Trigger notification
  triggerNotification(reminder) {
    // Play sound if enabled
    if (this.settings.soundEnabled) {
      this.playNotificationSound()
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification('TaskBuddy Reminder', {
        body: reminder.message,
        icon: '/vite.svg',
        tag: reminder.id
      })
    }

    // Emit custom event for UI components
    window.dispatchEvent(new CustomEvent('taskReminder', {
      detail: reminder
    }))
  }

  // Play notification sound
  playNotificationSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      const audioContext = new (AudioContext || webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  // Cancel a reminder
  cancelReminder(reminderId) {
    if (this.reminders.has(reminderId)) {
      this.reminders.get(reminderId).active = false
      this.reminders.delete(reminderId)
    }
  }

  // Get all active reminders for a task
  getTaskReminders(taskId) {
    return Array.from(this.reminders.values()).filter(
      reminder => reminder.taskId === taskId && reminder.active
    )
  }

  // Send email notification (mock implementation)
  sendEmailNotification(taskTitle, message, email) {
    // In a real application, this would call an email service API
    console.log('Email notification sent:', {
      to: email,
      subject: `TaskBuddy Reminder: ${taskTitle}`,
      body: message
    })
    
    return Promise.resolve({ success: true, message: 'Email sent successfully' })
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }

  // Check for due notifications
  checkDueNotifications(tasks) {
    const now = new Date()
    const notifications = []

    tasks.forEach(task => {
      if (task.completed) return

      const dueTime = new Date(task.dueDate)
      const reminderTime = new Date(dueTime.getTime() - (this.settings.defaultReminder * 60000))

      // Check for upcoming reminders
      if (now >= reminderTime && now < dueTime) {
        notifications.push({
          type: 'reminder',
          task,
          message: `Due in ${this.settings.defaultReminder} minutes`
        })
      }

      // Check for overdue tasks
      if (now >= dueTime) {
        notifications.push({
          type: 'overdue',
          task,
          message: 'Task is overdue!'
        })
      }
    })

    return notifications
  }
}

// Create singleton instance
const notificationService = new NotificationService()

export default notificationService