<template>
  <div>
    <div class="badge badge-vue">◆ Rendered by Vue 3</div>
    <h1 class="pg-title">Vue Todo App</h1>
    <p class="pg-sub">Built with Vue 3 Composition API — ref(), reactive(), computed(), watch(), and single-file components compiled by vue-loader.</p>
    <div class="g2">
      <div class="card">
        <div class="card-title">Task Manager</div>
        <div class="card-sub">v-model · v-for · computed · watch · TransitionGroup</div>
        <div style="display:flex;gap:0.5rem;margin-bottom:1rem">
          <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a new task..." class="vue-input" />
          <button @click="addTodo" class="vue-btn">Add</button>
        </div>
        <div style="display:flex;gap:0.3rem;margin-bottom:0.8rem">
          <button v-for="f in ['all','pending','done']" :key="f" @click="filter=f" class="vue-filter" :class="{active:filter===f}">{{f}}</button>
        </div>
        <TransitionGroup name="list" tag="div" style="display:flex;flex-direction:column;gap:0.45rem">
          <TodoItem v-for="todo in filtered" :key="todo.id" :todo="todo" @toggle="toggleTodo(todo)" @remove="removeTodo(todo.id)" />
        </TransitionGroup>
        <TodoStats :total="total" :done="doneCount" :pending="pendingCount" />
      </div>
      <div class="card">
        <div class="card-title">Vue 3 APIs Active</div>
        <div class="card-sub">Composition API running in this MFE</div>
        <div style="display:flex;flex-direction:column;gap:0.5rem">
          <div v-for="f in features" :key="f.fn" class="vue-feature">
            <code class="vue-code">{{f.fn}}</code>
            <span style="color:var(--dim);font-size:0.75rem">{{f.d}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import TodoItem from './components/TodoItem.vue';
import TodoStats from './components/TodoStats.vue';

const newTodo = ref('');
const filter = ref('all');
let nextId = 5;
const todos = reactive([
  { id:1, text:'Build micro frontend shell', done:true },
  { id:2, text:'Integrate Vue 3 Composition API', done:true },
  { id:3, text:'Connect shared event bus', done:false },
  { id:4, text:'Deploy to Vercel', done:false },
]);

const total = computed(() => todos.length);
const doneCount = computed(() => todos.filter(t => t.done).length);
const pendingCount = computed(() => todos.filter(t => !t.done).length);
const filtered = computed(() => {
  if (filter.value === 'done') return todos.filter(t => t.done);
  if (filter.value === 'pending') return todos.filter(t => !t.done);
  return todos;
});

const features = [
  { fn:'ref()', d:'Reactive primitives (newTodo, filter)' },
  { fn:'reactive()', d:'Reactive array (todos list)' },
  { fn:'computed()', d:'Derived values (total, done, filtered)' },
  { fn:'watch()', d:'Side effect on todoCount change' },
  { fn:'onMounted()', d:'Lifecycle — emit bus event' },
  { fn:'v-model', d:'Two-way binding on input' },
  { fn:'TransitionGroup', d:'List enter/leave animations' },
];

function addTodo() {
  const text = newTodo.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, done: false });
  newTodo.value = '';
  window.__MFE_EVENT_BUS__?.emit('vue:todo-added', { text });
}
function toggleTodo(todo) { todo.done = !todo.done; }
function removeTodo(id) { const i = todos.findIndex(t => t.id === id); if (i > -1) todos.splice(i, 1); }

watch(total, (c) => window.__MFE_SHARED_STORE__?.set('todoCount', c));
onMounted(() => window.__MFE_SHARED_STORE__?.set('todoCount', total.value));
</script>

<style scoped>
.vue-input{flex:1;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:0.6rem 1rem;font-family:Sora,sans-serif;font-size:0.83rem;color:var(--text);outline:none;transition:border-color 0.3s}
.vue-input:focus{border-color:#42b883}
.vue-btn{font-family:'JetBrains Mono',monospace;font-size:0.72rem;padding:0.6rem 1.1rem;border-radius:8px;border:none;background:#42b883;color:#fff;cursor:pointer;text-transform:uppercase;letter-spacing:0.06em;transition:box-shadow 0.2s}
.vue-btn:hover{box-shadow:0 0 20px rgba(66,184,131,0.2)}
.vue-filter{font-family:'JetBrains Mono',monospace;font-size:0.6rem;padding:0.25rem 0.6rem;border-radius:4px;border:1px solid var(--border);background:none;color:var(--dim);cursor:pointer;text-transform:uppercase;letter-spacing:0.06em;transition:all 0.2s}
.vue-filter.active{border-color:#42b883;background:rgba(66,184,131,0.1);color:#42b883}
.vue-feature{display:flex;align-items:center;gap:0.7rem;padding:0.65rem 1rem;border-radius:8px;background:var(--surface-2);font-size:0.8rem;border-left:2px solid #42b883;transition:all 0.2s}
.vue-feature:hover{transform:translateX(4px);background:rgba(66,184,131,0.06)}
.vue-code{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:#42b883;background:rgba(66,184,131,0.08);padding:0.12rem 0.45rem;border-radius:4px;white-space:nowrap}
.list-enter-active,.list-leave-active{transition:all 0.3s ease}
.list-enter-from{opacity:0;transform:translateX(-20px)}
.list-leave-to{opacity:0;transform:translateX(20px)}
</style>
