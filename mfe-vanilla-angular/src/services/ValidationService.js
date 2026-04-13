/**
 * ValidationService
 *
 * Mirrors Angular's validator pattern — each method returns
 * a validator function: (value) => errorString | null
 */
export class ValidationService {
  required(value) {
    return value.trim().length > 0 ? null : 'This field is required';
  }

  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : 'Please enter a valid email address';
  }

  minLength(min) {
    return (value) =>
      value.length >= min ? null : `Must be at least ${min} characters`;
  }

  maxLength(max) {
    return (value) =>
      value.length <= max ? null : `Must be no more than ${max} characters`;
  }

  pattern(regex, message) {
    return (value) => (regex.test(value) ? null : message);
  }
}
