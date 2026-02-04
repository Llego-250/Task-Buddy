<template>
  <div class="custom-reminders">
    <div class="reminders-header">
      <h4>Custom Reminders</h4>
      <button @click="addReminder" class="add-reminder-btn">+ Add Reminder</button>
    </div>
    
    <div v-if="reminders.length === 0" class="no-reminders">
      No custom reminders set
    </div>
    
    <div v-for="(reminder, index) in reminders" :key="reminder.id" class="reminder-item">
      <div class="reminder-inputs">
        <input 
          v-model="reminder.time" 
          type="datetime-local" 
          class="reminder-time-input"
          :min="minDateTime"
        >
        <input 
          v-model="reminder.message" 
          type="text" 
          placeholder="Reminder message (optional)"
          class="reminder-message-input"
        >
        <select v-model="reminder.type" class="reminder-type-select">
          <option value="notification">Browser Notification</option>
          <option value="email">Email</option>
          <option value="both">Both</option>
        </select>
      </div>
      <button @click="removeReminder(index)" class="remove-reminder-btn">×</button>
    </div>
    
    <div v-if="reminders.length > 0" class="reminder-preview">
      <h5>Active Reminders:</h5>
      <div v-for="reminder in validReminders" :key="reminder.id" class="preview-item">
        <span class="preview-time">{{ formatDateTime(reminder.time) }}</span>
        <span class="preview-message">{{ reminder.message || 'Default reminder' }}</span>
        <span class="preview-type">{{ reminder.type }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomReminders',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    taskDueDate: {
      type: [String, Date],
      default: null
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      reminders: []
    }
  },
  computed: {
    minDateTime() {
      return new Date().toISOString().slice(0, 16)
    },
    validReminders() {
      return this.reminders.filter(reminder => 
        reminder.time && new Date(reminder.time) > new Date()
      )
    }
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.reminders = newValue.map(reminder => ({
          ...reminder,
          id: reminder.id || this.generateId()
        }))
      },
      immediate: true,
      deep: true
    },
    reminders: {
      handler() {
        this.$emit('update:modelValue', this.validReminders)
      },
      deep: true
    }
  },
  methods: {
    addReminder() {
      const defaultTime = this.taskDueDate 
        ? new Date(new Date(this.taskDueDate).getTime() - 30 * 60000) // 30 minutes before due date
        : new Date(Date.now() + 60 * 60000) // 1 hour from now
      
      this.reminders.push({
        id: this.generateId(),
        time: defaultTime.toISOString().slice(0, 16),
        message: '',
        type: 'notification'
      })
    },
    
    removeReminder(index) {
      this.reminders.splice(index, 1)
    },
    
    generateId() {
      return Date.now() + Math.random().toString(36).substr(2, 9)
    },
    
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString()
    }
  }
}
</script>

<style scoped>
.custom-reminders {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
}

.reminders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reminders-header h4 {
  color: white;
  margin: 0;
  font-size: 1.1em;
  font-weight: 600;
}

.add-reminder-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-reminder-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-1px);
}

.no-reminders {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 1rem;
  font-style: italic;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.reminder-inputs {
  display: flex;
  flex: 1;
  gap: 8px;
  flex-wrap: wrap;
}

.reminder-time-input,
.reminder-message-input,
.reminder-type-select {
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 13px;
  outline: none;
  transition: all 0.3s ease;
}

.reminder-time-input {
  min-width: 180px;
}

.reminder-message-input {
  flex: 1;
  min-width: 150px;
}

.reminder-type-select {
  min-width: 120px;
}

.reminder-time-input:focus,
.reminder-message-input:focus,
.reminder-type-select:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.reminder-message-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.remove-reminder-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-reminder-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: scale(1.1);
}

.reminder-preview {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.reminder-preview h5 {
  color: white;
  margin: 0 0 0.8rem 0;
  font-size: 0.9em;
  font-weight: 600;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 0.85em;
}

.preview-time {
  color: #60a5fa;
  font-weight: 500;
}

.preview-message {
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
  text-align: center;
}

.preview-type {
  color: #34d399;
  font-size: 0.8em;
  text-transform: capitalize;
  background: rgba(52, 211, 153, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .reminder-inputs {
    flex-direction: column;
  }
  
  .reminder-time-input,
  .reminder-message-input,
  .reminder-type-select {
    min-width: unset;
    width: 100%;
  }
  
  .preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .preview-message {
    text-align: left;
  }
}
</style>