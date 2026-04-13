import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root = null;

/**
 * Mount this micro frontend into a container element.
 * Called by the shell when navigating to this route.
 */
export function mount(container) {
  const mountPoint = document.createElement('div');
  mountPoint.id = 'mfe-react-root';
  container.appendChild(mountPoint);

  root = ReactDOM.createRoot(mountPoint);
  root.render(<App />);

  // Notify shell via event bus
  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('react:mounted', { timestamp: Date.now() });
  }
}

/**
 * Unmount this micro frontend. Called by the shell before
 * mounting a different MFE.
 */
export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('react:unmounted', {});
  }
}

// Standalone mode — when running independently (npm start in mfe-react/)
const standaloneRoot = document.getElementById('mfe-react-root');
if (standaloneRoot) {
  root = ReactDOM.createRoot(standaloneRoot);
  root.render(<App />);
}
