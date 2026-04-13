export class FormService {
  constructor(validator) {
    this.validator = validator;
    this.fields = {};
    this._cbs = [];
  }

  registerField(name, rules) {
    this.fields[name] = { value: '', rules, errors: [], touched: false };
  }

  setValue(name, val) {
    const f = this.fields[name];
    if (!f) return;
    f.value = val;
    f.touched = true;
    f.errors = f.rules
      .map((r) => (typeof r === 'string' ? this.validator[r](val) : r(val)))
      .filter(Boolean);
    this._cbs.forEach((fn) => fn());
  }

  markTouched(name) {
    const f = this.fields[name];
    if (!f) return;
    f.touched = true;
    f.errors = f.rules
      .map((r) => (typeof r === 'string' ? this.validator[r](f.value) : r(f.value)))
      .filter(Boolean);
    this._cbs.forEach((fn) => fn());
  }

  get isValid() {
    return Object.values(this.fields).every((f) => !f.errors.length && f.touched);
  }

  getData() {
    const d = {};
    Object.entries(this.fields).forEach(([k, f]) => (d[k] = f.value));
    return d;
  }

  onChange(fn) {
    this._cbs.push(fn);
    return () => { this._cbs = this._cbs.filter((f) => f !== fn); };
  }
}
