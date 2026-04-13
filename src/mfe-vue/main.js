import { createApp } from 'vue';
import App from './App.vue';

let app = null;

export function mount(container) {
  const el = document.createElement('div');
  container.appendChild(el);
  app = createApp(App);
  app.mount(el);
  window.__MFE_EVENT_BUS__?.emit('vue:mounted', {});
}

export function unmount() {
  if (app) { app.unmount(); app = null; }
  window.__MFE_EVENT_BUS__?.emit('vue:unmounted', {});
}
