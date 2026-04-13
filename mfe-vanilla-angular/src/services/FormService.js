/**
 * FormService
 *
 * Mirrors Angular's ReactiveFormsModule pattern:
 * - registerField() → FormControl equivalent
 * - setValue() → patchValue equivalent
 * - validate() → runs validators, populates errors
 * - isValid → form-level validity check
 */
export class FormService {
  constructor(validationService) {
    this.validator = validationService;
    this.fields = {};
    this._changeCallbacks = [];
  }

  /**
   * Register a form field with its validators.
   * Validators can be method names on ValidationService (strings)
   * or direct validator functions.
   */
  registerField(name, validators = []) {
    this.fields[name] = {
      value: '',
      validators,
      errors: [],
      touched: false,
      dirty: false,
    };
  }

  /**
   * Set the value of a field and run validation.
   */
  setValue(name, value) {
    const field = this.fields[name];
    if (!field) return;

    field.value = value;
    field.dirty = true;
    field.touched = true;
    this._validate(name);
    this._notifyChange();
  }

  /**
   * Mark a field as touched (e.g., on blur).
   */
  markTouched(name) {
    const field = this.fields[name];
    if (field) {
      field.touched = true;
      this._validate(name);
      this._notifyChange();
    }
  }

  /**
   * Run validators for a single field.
   */
  _validate(name) {
    const field = this.fields[name];
    field.errors = field.validators
      .map((v) => {
        if (typeof v === 'string') {
          // Built-in validator by name (e.g., 'required', 'email')
          return this.validator[v](field.value);
        }
        // Custom validator function
        return v(field.value);
      })
      .filter(Boolean);
  }

  /**
   * Check if the entire form is valid.
   */
  get isValid() {
    return Object.values(this.fields).every(
      (f) => f.errors.length === 0 && f.touched
    );
  }

  /**
   * Get all form data as a plain object.
   */
  getData() {
    const data = {};
    Object.entries(this.fields).forEach(([key, field]) => {
      data[key] = field.value;
    });
    return data;
  }

  /**
   * Reset all fields.
   */
  reset() {
    Object.values(this.fields).forEach((field) => {
      field.value = '';
      field.errors = [];
      field.touched = false;
      field.dirty = false;
    });
    this._notifyChange();
  }

  /**
   * Subscribe to form changes (like Angular's valueChanges).
   */
  onChange(callback) {
    this._changeCallbacks.push(callback);
    return () => {
      this._changeCallbacks = this._changeCallbacks.filter(
        (fn) => fn !== callback
      );
    };
  }

  _notifyChange() {
    const state = {
      fields: { ...this.fields },
      isValid: this.isValid,
      data: this.getData(),
    };
    this._changeCallbacks.forEach((fn) => fn(state));
  }
}
