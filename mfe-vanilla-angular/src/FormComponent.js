/**
 * FormComponent
 *
 * Mirrors Angular's @Component pattern:
 * - template() method returns HTML string (like Angular templates)
 * - render() acts as change detection cycle
 * - Services are injected via constructor
 * - Event binding via data attributes + delegated listeners
 */
export class FormComponent {
  constructor(formService) {
    this.formService = formService;
    this.container = null;
    this.submittedData = null;

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
   * Component template — mirrors Angular's inline template.
   */
  template() {
    const { fields, isValid } = this.formService;

    const fieldHTML = (name, type = 'text', placeholder = '') => {
      const f = fields[name];
      const hasError = f.touched && f.errors.length > 0;
      const isTextarea = type === 'textarea';

      return `
        <div class="ang-form-group">
          <label class="ang-label">${name}</label>
          ${
            isTextarea
              ? `<textarea
                  class="ang-input ${hasError ? 'invalid' : ''}"
                  data-field="${name}"
                  rows="4"
                  placeholder="${placeholder}"
                >${f.value}</textarea>`
              : `<input
                  class="ang-input ${hasError ? 'invalid' : ''}"
                  data-field="${name}"
                  type="${type}"
                  value="${f.value}"
                  placeholder="${placeholder}"
                />`
          }
          ${hasError ? `<div class="ang-error">⚠ ${f.errors[0]}</div>` : ''}
        </div>
      `;
    };

    const submittedHTML = this.submittedData
      ? `
        <div class="ang-result">
          <div class="ang-result-title">✓ Form Submitted Successfully</div>
          <div class="ang-result-row"><span class="ang-result-key">name:</span> "${this.submittedData.name}"</div>
          <div class="ang-result-row"><span class="ang-result-key">email:</span> "${this.submittedData.email}"</div>
          <div class="ang-result-row"><span class="ang-result-key">subject:</span> "${this.submittedData.subject}"</div>
          <div class="ang-result-row"><span class="ang-result-key">message:</span> "${this.submittedData.message}"</div>
        </div>
      `
      : '';

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
              ${isValid ? '' : 'disabled'}
            >
              Submit Form
            </button>

            ${submittedHTML}
          </div>

          <div class="card">
            <h3 class="card-title">Angular Patterns Used</h3>
            <p class="card-sub">Architecture concepts in this MFE</p>

            <div class="ang-services-grid">
              ${[
                {
                  icon: '⚙',
                  name: 'ValidationService',
                  desc: 'Reusable validation rules (required, email, minLength)',
                },
                {
                  icon: '📋',
                  name: 'FormService',
                  desc: 'Reactive form state, mirrors ReactiveFormsModule',
                },
                {
                  icon: '💉',
                  name: 'Dependency Injection',
                  desc: 'Services injected into component constructor',
                },
                {
                  icon: '🔄',
                  name: 'Change Detection',
                  desc: 'Re-render on state mutation via onChange()',
                },
                {
                  icon: '🧩',
                  name: 'Component Pattern',
                  desc: 'template() + render() + lifecycle hooks',
                },
                {
                  icon: '📦',
                  name: 'Module Federation',
                  desc: 'Exposed as remote entry for shell loading',
                },
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
              ${Object.entries(fields)
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
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render the component into its container (change detection cycle).
   */
  render() {
    if (!this.container) return;

    // Save scroll position and focused element
    const focusedField = document.activeElement?.dataset?.field;
    const cursorPos = document.activeElement?.selectionStart;

    this.container.innerHTML = this.template();

    // Bind input events (delegated)
    this.container.querySelectorAll('.ang-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        this.formService.setValue(e.target.dataset.field, e.target.value);
      });
      input.addEventListener('blur', (e) => {
        this.formService.markTouched(e.target.dataset.field);
      });
    });

    // Bind submit
    const submitBtn = this.container.querySelector('#ang-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.onSubmit());
    }

    // Restore focus
    if (focusedField) {
      const el = this.container.querySelector(`[data-field="${focusedField}"]`);
      if (el) {
        el.focus();
        if (cursorPos !== undefined && el.setSelectionRange) {
          el.setSelectionRange(cursorPos, cursorPos);
        }
      }
    }
  }

  /**
   * Handle form submission.
   */
  onSubmit() {
    if (this.formService.isValid) {
      this.submittedData = this.formService.getData();
      this.render();

      if (window.__MFE_EVENT_BUS__) {
        window.__MFE_EVENT_BUS__.emit('angular:form-submitted', this.submittedData);
      }
    }
  }

  /**
   * Mount lifecycle — called when shell loads this MFE.
   */
  onInit(container) {
    this.container = container;

    // Subscribe to form changes → trigger change detection
    this._unsubForm = this.formService.onChange(() => {
      this.render();
    });

    this.render();
  }

  /**
   * Destroy lifecycle — called when shell unloads this MFE.
   */
  onDestroy() {
    if (this._unsubForm) {
      this._unsubForm();
    }
    this.container = null;
  }
}
