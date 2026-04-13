export class ValidationService {
  required(v) { return v.trim() ? null : 'This field is required'; }
  email(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email address'; }
  minLength(n) { return (v) => v.length >= n ? null : `Minimum ${n} characters`; }
}
