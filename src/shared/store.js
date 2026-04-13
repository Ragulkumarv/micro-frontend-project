class SharedStore {
  constructor(initial = {}) {
    this._state = { ...initial };
    this._subs = [];
  }

  get(key) { return this._state[key]; }

  set(key, value) {
    this._state[key] = value;
    this._subs.forEach((fn) => fn(this._state, { key, value }));
  }

  getAll() { return { ...this._state }; }

  subscribe(fn) {
    this._subs.push(fn);
    return () => { this._subs = this._subs.filter((f) => f !== fn); };
  }
}

if (!window.__MFE_SHARED_STORE__) {
  window.__MFE_SHARED_STORE__ = new SharedStore({ user: 'Developer', theme: 'dark' });
}

export const sharedStore = window.__MFE_SHARED_STORE__;
