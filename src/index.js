import './shell/styles.css';
import './shared/eventBus';
import './shared/store';

// ============================================================
//  MFE REGISTRY — lazy-loaded via dynamic import (code splitting)
//  Each MFE gets its own chunk, loaded only when navigated to.
// ============================================================

const MFE_CONFIG = {
  react: {
    label: 'Dashboard',
    framework: 'React 18',
    // Webpack code-splits this into a separate chunk
    load: () => import(/* webpackChunkName: "mfe-react" */ './mfe-react/index.jsx'),
  },
  vue: {
    label: 'Todos',
    framework: 'Vue 3',
    load: () => import(/* webpackChunkName: "mfe-vue" */ './mfe-vue/main.js'),
  },
  angular: {
    label: 'Forms',
    framework: 'Angular',
    load: () => import(/* webpackChunkName: "mfe-angular" */ './mfe-angular/index.js'),
  },
  svelte: {
    label: 'Motion',
    framework: 'Svelte',
    load: () => import(/* webpackChunkName: "mfe-svelte" */ './mfe-svelte/main.js'),
  },
};

// ============================================================
//  RENDER SHELL NAV
// ============================================================

function renderNav() {
  document.getElementById('shell-root').innerHTML = `
    <nav class="shell-nav">
      <div class="shell-logo">
        <div class="logo-hex">μ</div> μFE SHELL
      </div>
      <div class="nav-tabs">
        ${Object.entries(MFE_CONFIG)
          .map(
            ([key, cfg]) => `
          <div class="nav-tab" data-fw="${key}">
            <div class="dot"></div>
            ${cfg.label}
            <span class="fw-tag">${cfg.framework}</span>
          </div>`
          )
          .join('')}
      </div>
      <div class="shell-status">
        <div class="pulse-dot"></div>
        <span id="fw-label">—</span>
      </div>
    </nav>
  `;

  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => router.navigate(tab.dataset.fw));
  });
}

// ============================================================
//  ROUTER — lazy loads MFE chunks, manages mount/unmount
// ============================================================

const router = {
  current: null,
  currentModule: null,

  async navigate(name) {
    if (!MFE_CONFIG[name] || name === this.current) return;

    const viewport = document.getElementById('mfe-viewport');

    // Unmount current
    if (this.currentModule && typeof this.currentModule.unmount === 'function') {
      this.currentModule.unmount(viewport);
    }

    // Loading state
    viewport.innerHTML = '<div class="mfe-loading">Loading micro frontend…</div>';

    // Update nav immediately
    document.querySelectorAll('.nav-tab').forEach((t) =>
      t.classList.toggle('active', t.dataset.fw === name)
    );
    document.getElementById('fw-label').textContent = MFE_CONFIG[name].framework;
    window.location.hash = name;

    try {
      // Dynamic import — webpack splits each MFE into its own chunk
      const raw = await MFE_CONFIG[name].load();

      // Handle both named exports and default exports
      const mod =
        typeof raw.mount === 'function'
          ? raw
          : typeof raw.default === 'object' && typeof raw.default.mount === 'function'
            ? raw.default
            : typeof raw.default === 'function'
              ? { mount: raw.default, unmount: raw.defaultUnmount || (() => {}) }
              : null;

      if (!mod || typeof mod.mount !== 'function') {
        throw new Error(`MFE "${name}" did not export a mount() function. Keys: [${Object.keys(raw)}]`);
      }

      // Mount
      viewport.innerHTML = '';
      viewport.style.animation = 'none';
      viewport.offsetHeight;
      viewport.style.animation = 'fadeIn 0.4s ease';

      mod.mount(viewport);
      this.currentModule = mod;
      this.current = name;

      window.__MFE_EVENT_BUS__.emit('shell:navigate', { to: name });
    } catch (err) {
      viewport.innerHTML = `
        <div style="padding:3rem;text-align:center">
          <p style="color:var(--angular);font-family:'JetBrains Mono',monospace;font-size:0.85rem">
            Failed to load ${MFE_CONFIG[name].framework} MFE
          </p>
          <p style="margin-top:0.5rem;font-size:0.75rem;color:var(--dim)">${err.message}</p>
        </div>
      `;
      console.error(`[Shell] Failed to load "${name}":`, err);
    }
  },
};

// ============================================================
//  BOOT
// ============================================================

renderNav();
const initial = window.location.hash.slice(1) || 'react';
router.navigate(MFE_CONFIG[initial] ? initial : 'react');

window.addEventListener('hashchange', () => {
  const r = window.location.hash.slice(1);
  if (r && MFE_CONFIG[r]) router.navigate(r);
});
