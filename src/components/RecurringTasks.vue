<template>
  <div class="recurring-section">
    <h4>Recurring Settings</h4>
    <div class="recurring-controls">
      <label>
        <input type="checkbox" v-model="isRecurring" @change="toggleRecurring">
        Make this task recurring
      </label>
      <div v-if="isRecurring" class="recurring-options">
        <select v-model="recurringType" class="recurring-select">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input v-model.number="recurringInterval" type="number" min="1" max="30" class="recurring-interval">
        <span>{{ intervalText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecurringTasks',
  props: {
    modelValue: {
      type: Object,
      default: () => ({ enabled: false, type: 'daily', interval: 1 })
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isRecurring: this.modelValue.enabled,
      recurringType: this.modelValue.type,
      recurringInterval: this.modelValue.interval
    }
  },
  computed: {
    intervalText() {
      const unit = this.recurringType === 'daily' ? 'day' : 
                   this.recurringType === 'weekly' ? 'week' : 'month'
      return this.recurringInterval === 1 ? unit : `${unit}s`
    }
  },
  methods: {
    toggleRecurring() {
      this.updateValue()
    },
    updateValue() {
      this.$emit('update:modelValue', {
        enabled: this.isRecurring,
        type: this.recurringType,
        interval: this.recurringInterval
      })
    }
  },
  watch: {
    recurringType() { this.updateValue() },
    recurringInterval() { this.updateValue() }
  }
}
</script>

<style scoped>
.recurring-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}
.recurring-controls label {
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
}
.recurring-options {
  display: flex;
  gap: 8px;
  align-items: center;
  color: white;
}
.recurring-select, .recurring-interval {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.recurring-interval {
  width: 60px;
}
</style>