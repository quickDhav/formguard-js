/**
 * FormGuard.js - validatePhone
 * Simple, lightweight and reusable JavaScript form validation library.
 */

/**
 * Validates a phone number, supporting common international and local formats.
 *
 * Supported formats:
 * - "+1 (555) 123-4567"
 * - "+44 20 7946 0958"
 * - "+91 98765 43210"
 * - "123-456-7890"
 * - "(123) 456-7890"
 * - "1234567890"
 *
 * Configurable options:
 * - minLength: Minimum digit count (default 7).
 * - maxLength: Maximum digit count according to ITU-T E.164 (default 15).
 * - exactLength: Exact digit count required (optional).
 * - message: Custom error message.
 *
 * @param {*} phone - The phone number string or number to validate.
 * @param {Object} [options={}] - Configuration options.
 * @param {number} [options.minLength=7] - Minimum digit count.
 * @param {number} [options.maxLength=15] - Maximum digit count.
 * @param {number} [options.exactLength] - Exact digit count expected.
 * @param {string} [options.message] - Custom error message.
 * @returns {{ isValid: boolean, message: string, digits?: string }} Validation result object.
 */
export function validatePhone(phone, options = {}) {
  const {
    minLength = 7,
    maxLength = 15,
    exactLength,
    message: customMessage
  } = options;

  const defaultInvalidMessage = 'Please enter a valid phone number.';
  const defaultEmptyMessage = 'Phone number is required.';

  // Check for empty or invalid types
  if (phone === null || phone === undefined) {
    return {
      isValid: false,
      message: customMessage || defaultEmptyMessage
    };
  }

  const phoneStr = String(phone).trim();
  if (phoneStr.length === 0) {
    return {
      isValid: false,
      message: customMessage || defaultEmptyMessage
    };
  }

  // Allowed characters: leading '+', digits, spaces, dashes, dots, parentheses
  // E.g. +1 (555) 123-4567 or 020 7946 0958
  const phoneCharRegex = /^\+?[0-9\s\-().]+$/;
  if (!phoneCharRegex.test(phoneStr)) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  // Ensure parentheses are balanced if present
  const openParens = (phoneStr.match(/\(/g) || []).length;
  const closeParens = (phoneStr.match(/\)/g) || []).length;
  if (openParens !== closeParens || openParens > 1) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  // Extract only numeric digits
  const digits = phoneStr.replace(/\D/g, '');

  if (digits.length === 0) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  // Validate exact digit count if specified
  if (typeof exactLength === 'number' && digits.length !== exactLength) {
    return {
      isValid: false,
      message: customMessage || `Phone number must contain exactly ${exactLength} digits.`,
      digits
    };
  }

  // Validate digit count range (E.164 standard: 7 to 15 digits)
  if (digits.length < minLength) {
    return {
      isValid: false,
      message: customMessage || `Phone number must contain at least ${minLength} digits.`,
      digits
    };
  }

  if (digits.length > maxLength) {
    return {
      isValid: false,
      message: customMessage || `Phone number cannot exceed ${maxLength} digits.`,
      digits
    };
  }

  return {
    isValid: true,
    message: '',
    digits
  };
}
