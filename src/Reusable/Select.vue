<template>
  <div class="select-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="select-field"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    options: { type: Array, required: true },
    placeholder: { type: String, default: '' },
    id: { type: String, default: () => `select-${Math.random().toString(36).substr(2, 9)}` }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.select-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.9rem; font-weight: 500; color: #333; }
.select-field {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}
.select-field:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>
