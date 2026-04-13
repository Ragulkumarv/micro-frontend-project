import { ValidationService } from './services/ValidationService';
import { FormService } from './services/FormService';
import { FormComponent } from './FormComponent';
import './styles.css';

/**
 * Injector — simplified Angular-style dependency injection container.
 * Services are registered and resolved here.
 */
class Injector {
  constructor() {
    this._providers = new Map();
  }

  register(token, factory) {
    this._providers.set(token, { factory, instance: null });
  }

  get(token) {
    const provider = this._providers.get(token);
    if (!provider) throw new Error(`No provider for ${token}`);
    if (!provider.instance) {
      provider.instance = provider.factory(this);
    }
    return provider.instance;
  }
}

// ============================================================
//  BOOTSTRAP — wire up DI and create component
// ============================================================

let injector = null;
let component = null;

/**
 * Mount this Angular-style micro frontend.
 * Called by the shell via Module Federation.
 */
export function mount(container) {
  const mountPoint = document.createElement('div');
  mountPoint.id = 'mfe-angular-root';
  container.appendChild(mountPoint);

  // Create DI container
  injector = new Injector();

  // Register services (Angular's @Injectable equivalent)
  injector.register('ValidationService', () => new ValidationService());
  injector.register('FormService', (inj) => {
    const validator = inj.get('ValidationService');
    return new FormService(validator);
  });

  // Create component with injected dependencies
  const formService = injector.get('FormService');
  component = new FormComponent(formService);

  // Call component lifecycle
  component.onInit(mountPoint);

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('angular:mounted', { timestamp: Date.now() });
  }
}

/**
 * Unmount this Angular-style micro frontend.
 */
export function unmount() {
  if (component) {
    component.onDestroy();
    component = null;
  }
  injector = null;

  if (window.__MFE_EVENT_BUS__) {
    window.__MFE_EVENT_BUS__.emit('angular:unmounted', {});
  }
}

// Standalone mode
const standaloneRoot = document.getElementById('mfe-angular-root');
if (standaloneRoot) {
  mount(standaloneRoot.parentElement || document.body);
}
