/**
 * FormGuard.js - validateRequired
 * Simple, lightweight and reusable JavaScript form validation library.
 */

/**
 * Validates whether a value is provided and not empty.
 *
 * Handles:
 * - null and undefined (invalid)
 * - Strings (invalid if empty or contains only whitespace)
 * - Numbers (0, negative, and positive numbers are valid; NaN is invalid)
 * - Booleans (true is valid; false is treated as invalid by default for checkboxes like Terms of Service)
 * - Arrays (invalid if empty)
 * - Objects (invalid if empty plain object)
 *
 * @param {*} value - The input value to check.
 * @param {string|Object} [optionsOrMessage] - Custom error message string or configuration options.
 * @param {string} [optionsOrMessage.message] - Custom error message.
 * @param {boolean} [optionsOrMessage.allowFalse=false] - If true, boolean false is considered valid.
 * @returns {{ isValid: boolean, message: string }} Validation result object.
 */
export function validateRequired(value, optionsOrMessage) {
  let customMessage;
  let allowFalse = false;

  if (typeof optionsOrMessage === 'string') {
    customMessage = optionsOrMessage;
  } else if (optionsOrMessage && typeof optionsOrMessage === 'object') {
    customMessage = optionsOrMessage.message;
    allowFalse = Boolean(optionsOrMessage.allowFalse);
  }

  const defaultMessage = 'This field is required.';
  const message = customMessage || defaultMessage;

  // 1. Check null and undefined
  if (value === null || value === undefined) {
    return { isValid: false, message };
  }

  // 2. Check strings
  if (typeof value === 'string') {
    return value.trim().length > 0
      ? { isValid: true, message: '' }
      : { isValid: false, message };
  }

  // 3. Check numbers (0 is valid, NaN is invalid)
  if (typeof value === 'number') {
    return !Number.isNaN(value)
      ? { isValid: true, message: '' }
      : { isValid: false, message };
  }

  // 4. Check booleans (e.g. required checkboxes default to requiring true)
  if (typeof value === 'boolean') {
    if (allowFalse) {
      return { isValid: true, message: '' };
    }
    return value
      ? { isValid: true, message: '' }
      : { isValid: false, message };
  }

  // 5. Check arrays
  if (Array.isArray(value)) {
    return value.length > 0
      ? { isValid: true, message: '' }
      : { isValid: false, message };
  }

  // 6. Check plain objects
  if (typeof value === 'object') {
    return Object.keys(value).length > 0
      ? { isValid: true, message: '' }
      : { isValid: false, message };
  }

  return { isValid: true, message: '' };
}
