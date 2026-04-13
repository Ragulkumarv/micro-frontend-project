# Micro Frontend — Multi-Framework (Vercel-Deployable)

A single-build micro frontend app where **each page uses a different framework**,
code-split into separate chunks and lazy-loaded on navigation.

## Frameworks

| Route | Framework | Page | Chunk |
|-------|-----------|------|-------|
| `#react` | React 18 | Dashboard (hooks, components) | `mfe-react.js` |
| `#vue` | Vue 3 | Todos (Composition API, SFCs) | `mfe-vue.js` |
| `#svelte` | Svelte 4 | Motion Lab (stores, compiled) | `mfe-svelte.js` |
| `#angular` | Angular-style | Forms (DI, services, patching) | `mfe-angular.js` |

## Architecture

```
src/
├── index.js              ← Shell: router, lazy-loads MFEs
├── index.html
├── shared/               ← Cross-MFE communication
│   ├── eventBus.js
│   └── store.js
├── shell/
│   └── styles.css
├── mfe-react/            ← React 18 (JSX, hooks)
│   ├── index.jsx         ← mount() / unmount()
│   ├── App.jsx
│   └── components/
├── mfe-vue/              ← Vue 3 (SFCs, Composition API)
│   ├── main.js           ← mount() / unmount()
│   ├── App.vue
│   └── components/
├── mfe-svelte/           ← Svelte 4 (compiled, stores)
│   ├── main.js           ← mount() / unmount()
│   ├── App.svelte
│   ├── stores.js
│   └── components/
└── mfe-angular/          ← Angular-style (DI, services)
    ├── index.js          ← mount() / unmount()
    ├── styles.css
    └── services/
```

Each MFE exports `mount(container)` and `unmount()`. The shell lazy-loads
them via `import()` — webpack splits each into its own chunk.

## Run Locally

```bash
npm install
npm run dev       # http://localhost:3000
```

## Deploy to Vercel

```bash
# Option 1: Vercel CLI
npx vercel

# Option 2: Connect GitHub repo
# Vercel auto-detects: build → "npm run build", output → "dist/"
```

Or push to GitHub and connect the repo in Vercel dashboard.
Settings are in `vercel.json`.

## Build

```bash
npm run build     # Outputs to dist/
npm run start     # Serves dist/ locally
```
