/**
 * SharedStore — Global state accessible by all micro frontends
 *
 * Usage:
 *   import { sharedStore } from '@shared/store';
 *
 *   sharedStore.set('user', { name: 'Dev' });
 *   const user = sharedStore.get('user');
 *
 *   const unsub = sharedStore.subscribe((state) => {
 *     console.log('State changed:', state);
 *   });
 */

class SharedStore {
  constructor(initialState = {}) {
    this._state = { ...initialState };
    this._subscribers = [];
  }

  /**
   * Get a value by key
   */
  get(key) {
    return this._state[key];
  }

  /**
   * Set a value by key — notifies all subscribers
   */
  set(key, value) {
    const oldValue = this._state[key];
    this._state[key] = value;

    this._subscribers.forEach((fn) => {
      try {
        fn(this._state, { key, value, oldValue });
      } catch (err) {
        console.error('[SharedStore] Subscriber error:', err);
      }
    });
  }

  /**
   * Get all state
   */
  getAll() {
    return { ...this._state };
  }

  /**
   * Subscribe to state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this._subscribers.push(callback);
    return () => {
      this._subscribers = this._subscribers.filter((fn) => fn !== callback);
    };
  }

  /**
   * Delete a key from state
   */
  delete(key) {
    const oldValue = this._state[key];
    delete this._state[key];
    this._subscribers.forEach((fn) => fn(this._state, { key, value: undefined, oldValue }));
  }

  /**
   * Reset entire store
   */
  reset(newState = {}) {
    this._state = { ...newState };
    this._subscribers.forEach((fn) => fn(this._state, { key: '*', value: newState }));
  }
}

// Singleton — shared across all MFEs via window
if (!window.__MFE_SHARED_STORE__) {
  window.__MFE_SHARED_STORE__ = new SharedStore({
    user: 'Developer',
    theme: 'dark',
    notifications: 0,
  });
}

export const sharedStore = window.__MFE_SHARED_STORE__;
export default sharedStore;
