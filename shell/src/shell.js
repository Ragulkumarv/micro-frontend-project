import './styles.css';

// ============================================================
//  EVENT BUS — Singleton on window for cross-MFE communication
// ============================================================

class EventBus {
  constructor() {
    this._listeners = {};
  }

  on(event, fn) {
    (this._listeners[event] = this._listeners[event] || []).push(fn);
    return () => {
      this._listeners[event] = this._listeners[event].filter((f) => f !== fn);
    };
  }

  emit(event, data) {
    (this._listeners[event] || []).forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error(`[EventBus] Error in "${event}":`, err);
      }
    });
  }
}

if (!window.__MFE_EVENT_BUS__) {
  window.__MFE_EVENT_BUS__ = new EventBus();
}

// ============================================================
//  SHARED STORE — Global state on window
// ============================================================

class SharedStore {
  constructor(initial = {}) {
    this._state = { ...initial };
    this._subs = [];
  }

  get(key) {
    return this._state[key];
  }

  set(key, value) {
    this._state[key] = value;
    this._subs.forEach((fn) => fn(this._state, { key, value }));
  }

  getAll() {
    return { ...this._state };
  }

  subscribe(fn) {
    this._subs.push(fn);
    return () => {
      this._subs = this._subs.filter((f) => f !== fn);
    };
  }
}

if (!window.__MFE_SHARED_STORE__) {
  window.__MFE_SHARED_STORE__ = new SharedStore({
    user: 'Developer',
    theme: 'dark',
  });
}

// ============================================================
//  MFE REGISTRY — maps route names to Module Federation remotes
// ============================================================

const MFE_CONFIG = {
  react: {
    label: 'Dashboard',
    framework: 'React 18',
    color: 'react',
    // Module Federation: import('mfeReact/App')
    load: () => import('mfeReact/App'),
  },
  vue: {
    label: 'Todos',
    framework: 'Vue 3',
    color: 'vue',
    load: () => import('mfeVue/App'),
  },
  angular: {
    label: 'Forms',
    framework: 'Angular',
    color: 'angular',
    load: () => import('mfeAngular/App'),
  },
  svelte: {
    label: 'Motion',
    framework: 'Svelte',
    color: 'svelte',
    load: () => import('mfeSvelte/App'),
  },
};

// ============================================================
//  RENDER SHELL NAVIGATION
// ============================================================

function renderNav() {
  const shellRoot = document.getElementById('shell-root');

  shellRoot.innerHTML = `
    <nav class="shell-nav">
      <div class="shell-logo">
        <div class="logo-hex">μ</div>
        μFE SHELL
      </div>
      <div class="nav-tabs">
        ${Object.entries(MFE_CONFIG)
          .map(
            ([key, config]) => `
          <div class="nav-tab" data-fw="${key}">
            <div class="fw-dot"></div>
            ${config.label}
            <span class="fw-label">${config.framework}</span>
          </div>
        `
          )
          .join('')}
      </div>
      <div class="shell-status">
        <div class="pulse"></div>
        <span id="active-fw-label">—</span>
      </div>
    </nav>
  `;

  // Bind click handlers
  shellRoot.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      router.navigate(tab.dataset.fw);
    });
  });
}

// ============================================================
//  ROUTER — hash-based, manages mount/unmount lifecycle
// ============================================================

const router = {
  current: null,
  currentModule: null,

  async navigate(name) {
    if (!MFE_CONFIG[name]) return;

    const viewport = document.getElementById('mfe-viewport');

    // 1. Unmount current MFE
    if (this.currentModule && typeof this.currentModule.unmount === 'function') {
      this.currentModule.unmount(viewport);
    }

    // 2. Show loading state
    viewport.innerHTML = '<div class="mfe-loading">Loading micro frontend...</div>';
    viewport.classList.add('loading');

    // 3. Update nav
    document.querySelectorAll('.nav-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.fw === name);
    });
    document.getElementById('active-fw-label').textContent =
      MFE_CONFIG[name].framework;
    window.location.hash = name;

    // 4. Dynamically load MFE via Module Federation
    try {
      const module = await MFE_CONFIG[name].load();

      viewport.innerHTML = '';
      viewport.classList.remove('loading');
      viewport.style.animation = 'none';
      viewport.offsetHeight; // trigger reflow
      viewport.style.animation = 'mfeFadeIn 0.4s ease';

      // 5. Mount the new MFE
      module.mount(viewport);
      this.currentModule = module;
      this.current = name;

      window.__MFE_EVENT_BUS__.emit('shell:navigate', { to: name });
    } catch (err) {
      viewport.classList.remove('loading');
      viewport.innerHTML = `
        <div class="mfe-error">
          <p>Failed to load <strong>${MFE_CONFIG[name].framework}</strong> micro frontend.</p>
          <p style="margin-top:0.5rem;font-size:0.75rem;color:var(--text-dim)">
            Make sure the MFE dev server is running on the correct port.<br/>
            Error: ${err.message}
          </p>
        </div>
      `;
      console.error(`[Shell] Failed to load MFE "${name}":`, err);
    }
  },
};

// ============================================================
//  BOOTSTRAP
// ============================================================

renderNav();

// Initial route from hash or default to react
const initial = window.location.hash.slice(1) || 'react';
router.navigate(MFE_CONFIG[initial] ? initial : 'react');

// Handle browser back/forward
window.addEventListener('hashchange', () => {
  const route = window.location.hash.slice(1);
  if (route && MFE_CONFIG[route] && route !== router.current) {
    router.navigate(route);
  }
});
