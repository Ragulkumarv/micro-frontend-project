/**
 * EventBus — Cross-MFE communication layer
 *
 * Usage:
 *   import { eventBus } from '@shared/eventBus';
 *
 *   // Subscribe
 *   const unsub = eventBus.on('user:login', (data) => { ... });
 *
 *   // Publish
 *   eventBus.emit('user:login', { userId: 123 });
 *
 *   // Cleanup
 *   unsub();
 */

class EventBus {
  constructor() {
    this._listeners = {};
    this._history = [];
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name (e.g., 'mfe:mounted')
   * @param {Function} callback - Handler function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this._listeners[event] = this._listeners[event].filter(
        (fn) => fn !== callback
      );
    };
  }

  /**
   * Subscribe to an event, but only fire once
   */
  once(event, callback) {
    const unsub = this.on(event, (data) => {
      callback(data);
      unsub();
    });
    return unsub;
  }

  /**
   * Emit an event to all subscribers
   * @param {string} event - Event name
   * @param {*} data - Payload
   */
  emit(event, data) {
    this._history.push({
      event,
      data,
      timestamp: Date.now(),
    });

    // Keep only last 100 events
    if (this._history.length > 100) {
      this._history = this._history.slice(-100);
    }

    const listeners = this._listeners[event];
    if (listeners) {
      listeners.forEach((fn) => {
        try {
          fn(data);
        } catch (err) {
          console.error(`[EventBus] Error in listener for "${event}":`, err);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   */
  off(event) {
    delete this._listeners[event];
  }

  /**
   * Get event history (useful for debugging)
   */
  getHistory() {
    return [...this._history];
  }

  /**
   * Clear all listeners and history
   */
  destroy() {
    this._listeners = {};
    this._history = [];
  }
}

// Singleton — shared across all MFEs via window
if (!window.__MFE_EVENT_BUS__) {
  window.__MFE_EVENT_BUS__ = new EventBus();
}

export const eventBus = window.__MFE_EVENT_BUS__;
export default eventBus;
