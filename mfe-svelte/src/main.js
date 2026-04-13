import App from './App.svelte';

let component = null;

/**
 * Mount this Svelte micro frontend into a container.
 */
export function mount(container) {
  const mountPoint = document.createElement('div');
  mountPoint.id = 'mfe-svelte-root';
  container.appendChild(mountPoint);

  component = new App({
    target: mountPoint,
  });

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('svelte:mounted', { timestamp: Date.now() });
  }
}

/**
 * Unmount this Svelte micro frontend.
 */
export function unmount() {
  if (component) {
    component.$destroy();
    component = null;
  }

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('svelte:unmounted', {});
  }
}

// Standalone mode
const standaloneRoot = document.getElementById('mfe-svelte-root');
if (standaloneRoot) {
  component = new App({ target: standaloneRoot });
}
