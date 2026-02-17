<template>
  <div class="input-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input-field"
    />
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.input-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.9rem; font-weight: 500; color: #333; }
.input-field {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
}
.input-field:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>
