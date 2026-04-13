<template>
  <div class="stats">
    <span>Total: <strong>{{total}}</strong></span>
    <span>Done: <strong>{{done}}</strong></span>
    <span>Pending: <strong>{{pending}}</strong></span>
  </div>
</template>
<script setup>
defineProps({ total: Number, done: Number, pending: Number });
</script>
<style scoped>
.stats{display:flex;gap:1.5rem;margin-top:1rem;font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:var(--dim)}
.stats strong{color:#42b883;font-weight:600}
</style>
