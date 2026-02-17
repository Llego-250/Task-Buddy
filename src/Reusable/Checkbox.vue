<template>
  <label class="checkbox-container">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="checkmark"></span>
    <span v-if="label" class="label">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 28px;
}
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
.checkmark {
  position: absolute;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
  border: 2px solid #ddd;
}
.checkbox-container:hover input ~ .checkmark { background-color: #ccc; }
.checkbox-container input:checked ~ .checkmark {
  background-color: #4CAF50;
  border-color: #4CAF50;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.checkbox-container input:checked ~ .checkmark:after { display: block; }
.label { margin-left: 8px; }
</style>
