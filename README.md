# Micro Frontend — Multi-Framework Architecture

A micro frontend project where **each page is an independent app** built with a different framework, loaded at runtime by a shared shell container.

```
micro-frontend-project/
├── shell/                    # Container app (vanilla JS) — orchestrates everything
│   ├── index.html
│   ├── shell.js              # Router, event bus, MFE loader
│   └── styles.css            # Shell-level styles
│
├── mfe-react/                # React 18 micro frontend
│   ├── package.json
│   ├── src/
│   │   ├── index.jsx         # Bootstrap + mount/unmount lifecycle
│   │   ├── App.jsx           # Dashboard page component
│   │   └── components/
│   │       ├── Counter.jsx
│   │       └── StatCard.jsx
│   └── webpack.config.js     # Module Federation config
│
├── mfe-vue/                  # Vue 3 micro frontend
│   ├── package.json
│   ├── src/
│   │   ├── main.js           # Bootstrap + mount/unmount lifecycle
│   │   ├── App.vue           # Todo page component
│   │   └── components/
│   │       ├── TodoItem.vue
│   │       └── TodoStats.vue
│   └── webpack.config.js     # Module Federation config
│
├── mfe-svelte/               # Svelte micro frontend
│   ├── package.json
│   ├── src/
│   │   ├── main.js           # Bootstrap + mount/unmount lifecycle
│   │   ├── App.svelte        # Motion lab page
│   │   ├── stores.js         # Svelte stores
│   │   └── components/
│   │       ├── MotionBox.svelte
│   │       └── StoreDisplay.svelte
│   └── webpack.config.js     # Module Federation config
│
├── mfe-vanilla-angular/      # Angular-style micro frontend (vanilla JS)
│   ├── package.json
│   ├── src/
│   │   ├── index.js          # Bootstrap + mount/unmount lifecycle
│   │   ├── FormComponent.js  # Form page (Angular patterns)
│   │   └── services/
│   │       ├── ValidationService.js
│   │       └── FormService.js
│   └── webpack.config.js     # Module Federation config
│
├── package.json              # Root workspace scripts
├── README.md                 # This file
└── shared/
    ├── eventBus.js           # Cross-MFE communication
    └── store.js              # Shared global state
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  SHELL (Container)               │
│  ┌───────────┐  ┌──────┐  ┌──────────────────┐  │
│  │  Router    │  │ Nav  │  │  MFE Viewport    │  │
│  │ (hash)     │  │      │  │                  │  │
│  └─────┬─────┘  └──────┘  │  ┌────────────┐  │  │
│        │                   │  │ mounted    │  │  │
│        ├──── #react ──────►│  │ MFE here   │  │  │
│        ├──── #vue ────────►│  │            │  │  │
│        ├──── #angular ────►│  └────────────┘  │  │
│        └──── #svelte ─────►│                  │  │
│                            └──────────────────┘  │
│                                                   │
│  ┌─────────────┐  ┌──────────────┐               │
│  │ Event Bus   │  │ Shared Store │               │
│  │ (pub/sub)   │  │ (key-value)  │               │
│  └─────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────┘
```

## How It Works

1. **Shell** loads and renders the navigation, then uses hash routing to determine which MFE to load.
2. Each **MFE exposes** `mount(container)` and `unmount()` functions via Webpack Module Federation.
3. The shell **dynamically imports** the active MFE's module and calls `mount()`.
4. When navigating away, the shell calls `unmount()` on the current MFE before mounting the next.
5. All MFEs communicate via a **shared Event Bus** and can read/write to a **Shared Store**.

## Running Locally

```bash
# Install all dependencies
npm install

# Start all micro frontends + shell concurrently
npm run dev

# Or start individually:
cd mfe-react && npm start     # http://localhost:3001
cd mfe-vue && npm start       # http://localhost:3002
cd mfe-svelte && npm start    # http://localhost:3003
cd mfe-vanilla-angular && npm start  # http://localhost:3004
cd shell && npm start         # http://localhost:3000
```

## Production Build

```bash
npm run build   # Builds all MFEs and shell
npm run serve   # Serves everything from dist/
```

Each MFE is deployed independently. The shell loads them at runtime via Module Federation remote entries.

## Key Concepts

| Concept | Implementation |
|---------|---------------|
| Runtime Composition | Webpack Module Federation |
| Routing | Hash-based, shell-owned |
| Communication | Custom Event Bus (pub/sub) |
| Shared State | Shared Store (key-value) |
| Isolation | Each MFE has own dependencies, build, deploy |
| Framework Freedom | React 18, Vue 3, Svelte, Vanilla JS |
