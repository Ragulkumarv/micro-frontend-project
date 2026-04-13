import { createApp } from 'vue';
import App from './App.vue';

let app = null;

/**
 * Mount this Vue micro frontend into a container.
 * Called by the shell when navigating to the Vue route.
 */
export function mount(container) {
  const mountPoint = document.createElement('div');
  mountPoint.id = 'mfe-vue-root';
  container.appendChild(mountPoint);

  app = createApp(App);
  app.mount(mountPoint);

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('vue:mounted', { timestamp: Date.now() });
  }
}

/**
 * Unmount this Vue micro frontend.
 * Called by the shell before mounting a different MFE.
 */
export function unmount() {
  if (app) {
    app.unmount();
    app = null;
  }

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('vue:unmounted', {});
  }
}

// Standalone mode
const standaloneRoot = document.getElementById('mfe-vue-root');
if (standaloneRoot) {
  app = createApp(App);
  app.mount(standaloneRoot);
}
