import { ValidationService } from './services/ValidationService';
import { FormService } from './services/FormService';
import './styles.css';

let formService = null;
let container = null;
let unsub = null;
let bound = false;
let submitted = null;

function renderStateRows() {
  return Object.entries(formService.fields)
    .map(([name, f]) => {
      const v = !f.touched ? 'pend' : f.errors.length ? 'inv' : 'ok';
      return `<div class="ang-state-row">
        <span class="ang-state-field">${name}</span>
        <span class="ang-state-badge ${f.touched ? 'touched' : ''}">${f.touched ? 'touched' : 'pristine'}</span>
        <span class="ang-state-badge ${v === 'ok' ? 'valid' : v === 'inv' ? 'invalid-badge' : ''}">${v === 'ok' ? 'valid' : v === 'inv' ? 'invalid' : 'pending'}</span>
      </div>`;
    })
    .join('');
}

function fieldHTML(name, type, placeholder) {
  const f = formService.fields[name];
  const hasError = f.touched && f.errors.length > 0;
  const isTextarea = type === 'textarea';
  return `<div style="margin-bottom:1rem">
    <label class="ang-label">${name}</label>
    ${isTextarea
      ? `<textarea class="ang-input${hasError ? ' invalid' : ''}" data-field="${name}" rows="3" placeholder="${placeholder}">${f.value}</textarea>`
      : `<input class="ang-input${hasError ? ' invalid' : ''}" data-field="${name}" type="${type}" value="${f.value}" placeholder="${placeholder}"/>`}
    <div data-error-for="${name}">${hasError ? `<div class="ang-error">⚠ ${f.errors[0]}</div>` : ''}</div>
  </div>`;
}

const SERVICES = [
  { i: '⚙', n: 'ValidationService', d: 'Reusable validators (required, email, minLength)' },
  { i: '📋', n: 'FormService', d: 'Reactive form state, mirrors ReactiveFormsModule' },
  { i: '💉', n: 'Injector (DI)', d: 'Services resolved via dependency injection' },
  { i: '🔄', n: 'Change Detection', d: 'Targeted DOM patching on state change' },
  { i: '🧩', n: 'Component Class', d: 'template() + patch() + lifecycle hooks' },
  { i: '📦', n: 'Code Splitting', d: 'Webpack chunk loaded on demand' },
];

function fullRender() {
  container.innerHTML = `<div>
    <div class="badge badge-angular">▲ Rendered Angular-Style</div>
    <h1 class="pg-title">Angular Forms</h1>
    <p class="pg-sub">Implements Angular's architecture — ValidationService, FormService with dependency injection, reactive form validation, and targeted change detection.</p>
    <div class="g2">
      <div class="card">
        <div class="card-title">Contact Form</div>
        <div class="card-sub">FormService + ValidationService (DI pattern)</div>
        ${fieldHTML('name', 'text', 'Your full name')}
        ${fieldHTML('email', 'email', 'you@example.com')}
        ${fieldHTML('subject', 'text', 'What is this about?')}
        ${fieldHTML('message', 'textarea', 'Your message (min 10 chars)...')}
        <button class="ang-submit" id="ang-submit-btn" ${formService.isValid ? '' : 'disabled'} style="opacity:${formService.isValid ? 1 : 0.3}">Submit Form</button>
        <div id="ang-result-slot"></div>
      </div>
      <div class="card">
        <div class="card-title">Angular Patterns Used</div>
        <div class="card-sub">Architecture concepts in this MFE</div>
        <div style="display:flex;flex-direction:column;gap:0.5rem">
          ${SERVICES.map((s) => `<div class="ang-service"><div class="ang-service-icon">${s.i}</div><div><div class="ang-service-name">${s.n}</div><div class="ang-service-desc">${s.d}</div></div></div>`).join('')}
        </div>
        <div class="card-title" style="margin-top:1.3rem;font-size:0.82rem">Live Form State</div>
        <div id="ang-state-display" style="display:flex;flex-direction:column;gap:0.35rem;margin-top:0.6rem">${renderStateRows()}</div>
      </div>
    </div>
  </div>`;
}

// Targeted patch — never destroys input elements
function patch() {
  if (!container) return;

  Object.entries(formService.fields).forEach(([name, f]) => {
    const input = container.querySelector(`[data-field="${name}"]`);
    if (!input) return;
    const hasError = f.touched && f.errors.length > 0;
    input.classList.toggle('invalid', hasError);
    const slot = container.querySelector(`[data-error-for="${name}"]`);
    if (slot) slot.innerHTML = hasError ? `<div class="ang-error">⚠ ${f.errors[0]}</div>` : '';
  });

  const btn = container.querySelector('#ang-submit-btn');
  if (btn) { btn.disabled = !formService.isValid; btn.style.opacity = formService.isValid ? '1' : '0.3'; }

  const stateEl = container.querySelector('#ang-state-display');
  if (stateEl) stateEl.innerHTML = renderStateRows();
}

function bindEvents() {
  if (bound) return;
  container.addEventListener('input', (e) => {
    const f = e.target.dataset?.field;
    if (f && formService.fields[f]) formService.setValue(f, e.target.value);
  });
  container.addEventListener('focusout', (e) => {
    const f = e.target.dataset?.field;
    if (f && formService.fields[f]) formService.markTouched(f);
  });
  container.addEventListener('click', (e) => {
    if (e.target.id === 'ang-submit-btn' || e.target.closest('#ang-submit-btn')) {
      if (formService.isValid) {
        submitted = formService.getData();
        const slot = container.querySelector('#ang-result-slot');
        if (slot) {
          slot.innerHTML = `<div class="ang-result"><div class="ang-result-title">✓ Form Submitted</div>${Object.entries(submitted).map(([k, v]) => `<div><span class="ang-result-key">${k}:</span> "${v}"</div>`).join('')}</div>`;
        }
        window.__MFE_EVENT_BUS__?.emit('angular:form-submitted', submitted);
      }
    }
  });
  bound = true;
}

export function mount(el) {
  container = el;
  const vs = new ValidationService();
  formService = new FormService(vs);
  formService.registerField('name', ['required']);
  formService.registerField('email', ['required', 'email']);
  formService.registerField('subject', ['required']);
  formService.registerField('message', ['required', vs.minLength(10)]);

  fullRender();
  bindEvents();
  unsub = formService.onChange(() => patch());
  window.__MFE_EVENT_BUS__?.emit('angular:mounted', {});
}

export function unmount() {
  if (unsub) unsub();
  bound = false;
  container = null;
  formService = null;
  submitted = null;
}
