/**
 * FormGuard.js - validateEmail
 * Simple, lightweight and reusable JavaScript form validation library.
 */

// RFC 5322 compliant standard email regex pattern
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates whether an email address has a valid format.
 * Rejects empty, null, undefined, or incorrectly formatted emails.
 *
 * @param {*} email - The email string to validate.
 * @param {string} [customMessage] - Optional custom error message.
 * @returns {{ isValid: boolean, message: string }} Validation result object.
 *
 * @example
 * validateEmail("student@university.edu"); // { isValid: true, message: "" }
 * validateEmail("invalid-email"); // { isValid: false, message: "Please enter a valid email address." }
 */
export function validateEmail(email, customMessage) {
  const defaultInvalidMessage = 'Please enter a valid email address (e.g., user@example.com).';
  const defaultEmptyMessage = 'Email address is required.';

  // Check for empty or non-string inputs
  if (email === null || email === undefined || typeof email !== 'string') {
    return {
      isValid: false,
      message: customMessage || defaultEmptyMessage
    };
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      message: customMessage || defaultEmptyMessage
    };
  }

  // Reject emails containing whitespace
  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  // Ensure there is exactly one '@' symbol
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  const [localPart, domainPart] = parts;

  // Local part cannot be empty or start/end with dot or exceed 64 chars
  if (
    !localPart ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    localPart.length > 64
  ) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  // Domain part must contain at least one dot, cannot start/end with dot, no consecutive dots
  if (
    !domainPart ||
    !domainPart.includes('.') ||
    domainPart.startsWith('.') ||
    domainPart.endsWith('.') ||
    domainPart.includes('..') ||
    domainPart.length > 255
  ) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  // Top-Level Domain (TLD) must have at least 2 alphabetical characters
  const domainLabels = domainPart.split('.');
  const tld = domainLabels[domainLabels.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  // Test against standard email regex
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }

  return {
    isValid: true,
    message: ''
  };
}
