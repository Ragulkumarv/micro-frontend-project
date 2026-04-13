<template>
  <div class="stats">
    <span>Total: <strong class="num">{{ total }}</strong></span>
    <span>Done: <strong class="num">{{ done }}</strong></span>
    <span>Pending: <strong class="num">{{ pending }}</strong></span>
  </div>
</template>

<script setup>
defineProps({
  total: { type: Number, default: 0 },
  done: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },
});
</script>

<style scoped>
.stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #6b6b80;
}

.num {
  color: #42b883;
  font-weight: 600;
}
</style>
