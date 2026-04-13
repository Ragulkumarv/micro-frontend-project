import App from './App.svelte';

let component = null;

export function mount(container) {
  const el = document.createElement('div');
  container.appendChild(el);
  component = new App({ target: el });
  window.__MFE_EVENT_BUS__?.emit('svelte:mounted', {});
}

export function unmount() {
  if (component) { component.$destroy(); component = null; }
  window.__MFE_EVENT_BUS__?.emit('svelte:unmounted', {});
}
