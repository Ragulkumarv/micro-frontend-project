import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root = null;

export function mount(container) {
  const el = document.createElement('div');
  container.appendChild(el);
  root = ReactDOM.createRoot(el);
  root.render(<App />);
  window.__MFE_EVENT_BUS__?.emit('react:mounted', {});
}

export function unmount() {
  if (root) { root.unmount(); root = null; }
  window.__MFE_EVENT_BUS__?.emit('react:unmounted', {});
}
