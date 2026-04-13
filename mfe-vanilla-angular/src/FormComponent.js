/**
 * FormComponent
 *
 * Mirrors Angular's @Component pattern:
 * - template() for initial render only
 * - patch() for targeted change detection (no DOM destruction)
 * - Services injected via constructor
 * - Event delegation bound once, survives across patches
 */
export class FormComponent {
  constructor(formService) {
    this.formService = formService;
    this.container = null;
    this.submittedData = null;
    this._bound = false;

    // Register form fields with validators
    this.formService.registerField('name', ['required']);
    this.formService.registerField('email', ['required', 'email']);
    this.formService.registerField('subject', ['required']);
    this.formService.registerField('message', [
      'required',
      this.formService.validator.minLength(10),
    ]);
  }

  /**
   * Full template — only used for initial render.
   */
  template() {
    const { fields } = this.formService;

    const fieldHTML = (name, type = 'text', placeholder = '') => {
      const f = fields[name];
      const hasError = f.touched && f.errors.length > 0;
      const isTextarea = type === 'textarea';

      return `
        <div class="ang-form-group" data-group="${name}">
          <label class="ang-label">${name}</label>
          ${
            isTextarea
              ? `<textarea
                  class="ang-input${hasError ? ' invalid' : ''}"
                  data-field="${name}"
                  rows="4"
                  placeholder="${placeholder}"
                >${f.value}</textarea>`
              : `<input
                  class="ang-input${hasError ? ' invalid' : ''}"
                  data-field="${name}"
                  type="${type}"
                  value="${f.value}"
                  placeholder="${placeholder}"
                />`
          }
          <div class="ang-error-slot" data-error-for="${name}">
            ${hasError ? `<div class="ang-error">⚠ ${f.errors[0]}</div>` : ''}
          </div>
        </div>
      `;
    };

    return `
      <div class="angular-app">
        <div class="fw-badge">▲ Rendered Angular-Style</div>
        <h1 class="page-title">Angular Forms</h1>
        <p class="page-sub">
          Implements Angular's architecture patterns — services with dependency injection,
          reactive form validation, change detection, and component lifecycle.
          In production, this would be a compiled Angular CLI app loaded via Module Federation.
        </p>

        <div class="grid-2">
          <div class="card">
            <h3 class="card-title">Contact Form</h3>
            <p class="card-sub">FormService + ValidationService (DI pattern)</p>

            ${fieldHTML('name', 'text', 'Your full name')}
            ${fieldHTML('email', 'email', 'you@example.com')}
            ${fieldHTML('subject', 'text', 'What is this about?')}
            ${fieldHTML('message', 'textarea', 'Your message (min 10 chars)...')}

            <button
              class="ang-submit"
              id="ang-submit-btn"
              ${this.formService.isValid ? '' : 'disabled'}
              style="opacity:${this.formService.isValid ? '1' : '0.3'}"
            >
              Submit Form
            </button>

            <div id="ang-result-slot"></div>
          </div>

          <div class="card">
            <h3 class="card-title">Angular Patterns Used</h3>
            <p class="card-sub">Architecture concepts in this MFE</p>

            <div class="ang-services-grid">
              ${[
                { icon: '⚙', name: 'ValidationService', desc: 'Reusable validation rules (required, email, minLength)' },
                { icon: '📋', name: 'FormService', desc: 'Reactive form state, mirrors ReactiveFormsModule' },
                { icon: '💉', name: 'Dependency Injection', desc: 'Services injected into component constructor' },
                { icon: '🔄', name: 'Change Detection', desc: 'Targeted DOM patching on state change' },
                { icon: '🧩', name: 'Component Pattern', desc: 'template() + patch() + lifecycle hooks' },
                { icon: '📦', name: 'Module Federation', desc: 'Exposed as remote entry for shell loading' },
              ]
                .map(
                  (s) => `
                <div class="ang-service">
                  <div class="ang-service-icon">${s.icon}</div>
                  <div class="ang-service-info">
                    <div class="ang-service-name">${s.name}</div>
                    <div class="ang-service-desc">${s.desc}</div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="ang-form-state">
              <div class="card-title" style="margin-top:1.5rem;margin-bottom:0.8rem;font-size:0.85rem">
                Live Form State
              </div>
              <div id="ang-state-display">
                ${this._renderStateRows()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render the form state badges.
   */
  _renderStateRows() {
    return Object.entries(this.formService.fields)
      .map(
        ([name, f]) => `
        <div class="ang-state-row">
          <span class="ang-state-field">${name}</span>
          <span class="ang-state-badge ${f.touched ? 'touched' : ''}">
            ${f.touched ? 'touched' : 'pristine'}
          </span>
          <span class="ang-state-badge ${f.errors.length === 0 && f.touched ? 'valid' : 'invalid-badge'}">
            ${f.errors.length === 0 && f.touched ? 'valid' : f.errors.length > 0 ? 'invalid' : 'pending'}
          </span>
        </div>
      `
      )
      .join('');
  }

  /**
   * TARGETED DOM PATCH — updates only the parts that changed.
   * Inputs are never destroyed, so focus and cursor position are preserved.
   */
  patch() {
    if (!this.container) return;

    const { fields } = this.formService;

    // 1. Patch each field's error state and CSS class
    Object.entries(fields).forEach(([name, f]) => {
      const input = this.container.querySelector(`[data-field="${name}"]`);
      if (!input) return;

      const hasError = f.touched && f.errors.length > 0;

      if (hasError) {
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
      }

      // Update error message slot (only this small div changes)
      const errorSlot = this.container.querySelector(`[data-error-for="${name}"]`);
      if (errorSlot) {
        errorSlot.innerHTML = hasError
          ? `<div class="ang-error">⚠ ${f.errors[0]}</div>`
          : '';
      }
    });

    // 2. Patch submit button
    const submitBtn = this.container.querySelector('#ang-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = !this.formService.isValid;
      submitBtn.style.opacity = this.formService.isValid ? '1' : '0.3';
    }

    // 3. Patch form state display
    const stateDisplay = this.container.querySelector('#ang-state-display');
    if (stateDisplay) {
      stateDisplay.innerHTML = this._renderStateRows();
    }
  }

  /**
   * Bind event listeners ONCE via event delegation on the container.
   * Since inputs are never destroyed, these persist across patches.
   */
  _bindEvents() {
    if (this._bound) return;

    // Delegated input handler
    this.container.addEventListener('input', (e) => {
      const field = e.target.dataset?.field;
      if (field && this.formService.fields[field]) {
        this.formService.setValue(field, e.target.value);
      }
    });

    // Delegated blur handler
    this.container.addEventListener('focusout', (e) => {
      const field = e.target.dataset?.field;
      if (field && this.formService.fields[field]) {
        this.formService.markTouched(field);
      }
    });

    // Submit button (delegated click)
    this.container.addEventListener('click', (e) => {
      if (e.target.id === 'ang-submit-btn' || e.target.closest('#ang-submit-btn')) {
        this.onSubmit();
      }
    });

    this._bound = true;
  }

  /**
   * Handle form submission.
   */
  onSubmit() {
    if (this.formService.isValid) {
      this.submittedData = this.formService.getData();

      const resultSlot = this.container.querySelector('#ang-result-slot');
      if (resultSlot) {
        resultSlot.innerHTML = `
          <div class="ang-result">
            <div class="ang-result-title">✓ Form Submitted Successfully</div>
            <div class="ang-result-row"><span class="ang-result-key">name:</span> "${this.submittedData.name}"</div>
            <div class="ang-result-row"><span class="ang-result-key">email:</span> "${this.submittedData.email}"</div>
            <div class="ang-result-row"><span class="ang-result-key">subject:</span> "${this.submittedData.subject}"</div>
            <div class="ang-result-row"><span class="ang-result-key">message:</span> "${this.submittedData.message}"</div>
          </div>
        `;
      }

      if (window.__MFE_EVENT_BUS__) {
        window.__MFE_EVENT_BUS__.emit('angular:form-submitted', this.submittedData);
      }
    }
  }

  /**
   * Mount lifecycle.
   */
  onInit(container) {
    this.container = container;

    // Initial full render (once)
    this.container.innerHTML = this.template();

    // Bind delegated events (once)
    this._bindEvents();

    // Subscribe to form changes → targeted patch (not full re-render)
    this._unsubForm = this.formService.onChange(() => {
      this.patch();
    });
  }

  /**
   * Destroy lifecycle.
   */
  onDestroy() {
    if (this._unsubForm) {
      this._unsubForm();
    }
    this._bound = false;
    this.container = null;
  }
}
