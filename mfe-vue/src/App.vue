<template>
  <div class="vue-app">
    <div class="fw-badge">◆ Rendered by Vue 3</div>
    <h1 class="page-title">Vue Todo App</h1>
    <p class="page-sub">
      Built with Vue 3 Composition API — reactive refs, computed properties,
      watchers, and single-file components. Each module deployed independently.
    </p>

    <div class="grid-2">
      <!-- Todo List -->
      <div class="card">
        <h3 class="card-title">Task Manager</h3>
        <p class="card-sub">v-model · v-for · computed — all Vue reactivity</p>

        <div class="input-row">
          <input
            v-model="newTodo"
            @keyup.enter="addTodo"
            class="todo-input"
            placeholder="Add a new task..."
          />
          <button class="add-btn" @click="addTodo">Add</button>
        </div>

        <TransitionGroup name="todo" tag="ul" class="todo-list">
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @toggle="toggleTodo(todo)"
            @remove="removeTodo(todo.id)"
          />
        </TransitionGroup>

        <TodoStats :total="totalCount" :done="doneCount" :pending="pendingCount" />
      </div>

      <!-- Vue Features -->
      <div class="card">
        <h3 class="card-title">Vue 3 Features Used</h3>
        <p class="card-sub">Composition API patterns in this MFE</p>

        <ul class="features-list">
          <li v-for="feature in features" :key="feature.name" class="feature-item">
            <code class="feature-code">{{ feature.name }}</code>
            <span class="feature-desc">{{ feature.desc }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import TodoItem from './components/TodoItem.vue';
import TodoStats from './components/TodoStats.vue';

const newTodo = ref('');
let nextId = 5;

const todos = reactive([
  { id: 1, text: 'Build micro frontend shell', done: true },
  { id: 2, text: 'Integrate Vue 3 composition API', done: true },
  { id: 3, text: 'Connect to shared event bus', done: false },
  { id: 4, text: 'Deploy independently', done: false },
]);

const features = [
  { name: 'ref()', desc: 'Reactive primitive values' },
  { name: 'reactive()', desc: 'Reactive object/array state' },
  { name: 'computed()', desc: 'Derived reactive values' },
  { name: 'watch()', desc: 'Side effects on state change' },
  { name: 'onMounted()', desc: 'Lifecycle hook' },
  { name: '<script setup>', desc: 'Compiler sugar for Composition API' },
  { name: 'TransitionGroup', desc: 'List animation component' },
];

const totalCount = computed(() => todos.length);
const doneCount = computed(() => todos.filter((t) => t.done).length);
const pendingCount = computed(() => todos.filter((t) => !t.done).length);

function addTodo() {
  const text = newTodo.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, done: false });
  newTodo.value = '';

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('vue:todo-added', { text });
  }
}

function toggleTodo(todo) {
  todo.done = !todo.done;
}

function removeTodo(id) {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx > -1) todos.splice(idx, 1);
}

// Sync todo count to shared store
watch(totalCount, (count) => {
  if (window.__MFE_SHARED_STORE__) {
    window.__MFE_SHARED_STORE__.set('todoCount', count);
  }
});

onMounted(() => {
  if (window.__MFE_SHARED_STORE__) {
    window.__MFE_SHARED_STORE__.set('todoCount', totalCount.value);
  }
});
</script>

<style scoped>
.vue-app {
  font-family: 'Sora', sans-serif;
}

.fw-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  border: 1px solid #42b883;
  color: #42b883;
  background: rgba(66, 184, 131, 0.08);
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  color: #e4e4ef;
}

.page-sub {
  font-size: 0.9rem;
  color: #6b6b80;
  margin-bottom: 2rem;
  font-weight: 300;
  line-height: 1.6;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.card {
  background: #12121a;
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  padding: 1.5rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #e4e4ef;
}

.card-sub {
  font-size: 0.72rem;
  color: #6b6b80;
  margin-bottom: 1.2rem;
}

.input-row {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.todo-input {
  flex: 1;
  background: #1a1a25;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  color: #e4e4ef;
  outline: none;
  transition: border-color 0.3s;
}

.todo-input:focus {
  border-color: #42b883;
}

.add-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  padding: 0.65rem 1.2rem;
  border-radius: 8px;
  border: none;
  background: #42b883;
  color: #fff;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: box-shadow 0.2s;
}

.add-btn:hover {
  box-shadow: 0 0 20px rgba(66, 184, 131, 0.2);
}

.todo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
}

.features-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background: #1a1a25;
  font-size: 0.82rem;
  border-left: 2px solid #42b883;
  transition: all 0.2s;
}

.feature-item:hover {
  background: rgba(66, 184, 131, 0.06);
  transform: translateX(4px);
}

.feature-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #42b883;
  background: rgba(66, 184, 131, 0.08);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.feature-desc {
  color: #6b6b80;
  font-size: 0.78rem;
}

/* Transition animations */
.todo-enter-active {
  transition: all 0.3s ease;
}

.todo-leave-active {
  transition: all 0.3s ease;
}

.todo-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.todo-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
