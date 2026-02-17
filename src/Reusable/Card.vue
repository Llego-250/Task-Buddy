<template>
  <div :class="['card', { 'card-hover': hover }]">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    hover: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}
.card-hover { transition: transform 0.3s, box-shadow 0.3s; }
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.card-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
}
.card-body { padding: 1rem; }
.card-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
}
</style>
