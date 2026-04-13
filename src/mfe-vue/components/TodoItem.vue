<template>
  <div class="todo-item" :class="{done:todo.done}" @click="$emit('toggle')">
    <div class="checkbox"><span v-if="todo.done" style="color:#fff;font-size:0.55rem">✓</span></div>
    <span style="flex:1">{{todo.text}}</span>
    <button class="remove-btn" @click.stop="$emit('remove')">×</button>
  </div>
</template>
<script setup>
defineProps({ todo: { type: Object, required: true } });
defineEmits(['toggle', 'remove']);
</script>
<style scoped>
.todo-item{display:flex;align-items:center;gap:0.7rem;padding:0.7rem 1rem;background:var(--surface-2);border-radius:8px;font-size:0.83rem;cursor:pointer;transition:all 0.25s}
.todo-item:hover{transform:translateX(4px)}
.todo-item.done{opacity:0.4;text-decoration:line-through}
.checkbox{width:16px;height:16px;border-radius:50%;border:2px solid #42b883;background:transparent;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s}
.todo-item.done .checkbox{background:#42b883}
.remove-btn{background:none;border:none;color:var(--dim);cursor:pointer;font-size:1rem;padding:0 0.3rem;transition:color 0.2s}
.remove-btn:hover{color:#f85149}
</style>
