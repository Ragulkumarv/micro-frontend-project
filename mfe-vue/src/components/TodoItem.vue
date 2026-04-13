<template>
  <li class="todo-item" :class="{ done: todo.done }" @click="$emit('toggle')">
    <div class="checkbox">
      <span v-if="todo.done" class="check-mark">✓</span>
    </div>
    <span class="todo-text">{{ todo.text }}</span>
    <button class="remove-btn" @click.stop="$emit('remove')">×</button>
  </li>
</template>

<script setup>
defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

defineEmits(['toggle', 'remove']);
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 1rem;
  background: #1a1a25;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.25s;
  cursor: pointer;
  color: #e4e4ef;
}

.todo-item:hover {
  transform: translateX(4px);
}

.todo-item.done {
  opacity: 0.4;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
}

.checkbox {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #42b883;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.todo-item.done .checkbox {
  background: #42b883;
}

.check-mark {
  color: #fff;
  font-size: 0.6rem;
}

.todo-text {
  flex: 1;
}

.remove-btn {
  background: none;
  border: none;
  color: #6b6b80;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 0.3rem;
  transition: color 0.2s;
  line-height: 1;
}

.remove-btn:hover {
  color: #f85149;
}
</style>
