<template>
  <button :class="['btn', `btn-${variant}`, { 'btn-icon': icon }]" :disabled="disabled" @click="$emit('click')">
    <span v-if="icon" class="icon">{{ icon }}</span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: { type: String, default: 'primary' }, // primary, secondary, danger, success
    icon: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['click']
}
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}
.btn-primary { background: #4CAF50; color: white; }
.btn-primary:hover { background: #45a049; }
.btn-secondary { background: #6c757d; color: white; }
.btn-secondary:hover { background: #5a6268; }
.btn-danger { background: #f44336; color: white; }
.btn-danger:hover { background: #da190b; }
.btn-success { background: #28a745; color: white; }
.btn-success:hover { background: #218838; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-icon { display: flex; align-items: center; gap: 0.5rem; }
</style>
