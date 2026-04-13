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
      try { fn(data); } catch (err) { console.error(`[EventBus] ${event}:`, err); }
    });
  }
}

if (!window.__MFE_EVENT_BUS__) {
  window.__MFE_EVENT_BUS__ = new EventBus();
}

export const eventBus = window.__MFE_EVENT_BUS__;
