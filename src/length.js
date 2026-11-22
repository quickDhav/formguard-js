/**
 * FormGuard.js - validateLength
 * Simple, lightweight and reusable JavaScript form validation library.
 */

/**
 * Validates whether the length of a value falls within the specified min and max range.
 *
 * Supports strings, arrays, numbers (converted to string length), and objects (number of keys).
 *
 * Can be called as:
 * - validateLength(val, 3, 10)
 * - validateLength(val, 3, 10, "Custom message")
 * - validateLength(val, { min: 3, max: 10, message: "Custom message" })
 * - validateLength(val, 3) // min only
 *
 * @param {*} value - The input value to check length of.
 * @param {number|Object} [minOrOptions] - Minimum length or an options object.
 * @param {number} [max] - Maximum length.
 * @param {string} [customMessage] - Optional custom error message.
 * @returns {{ isValid: boolean, message: string, length: number }} Validation result.
 */
export function validateLength(value, minOrOptions, max, customMessage) {
  let min;
  let actualMax;
  let messageOverride;

  if (typeof minOrOptions === 'object' && minOrOptions !== null) {
    min = minOrOptions.min;
    actualMax = minOrOptions.max;
    messageOverride = minOrOptions.message;
  } else {
    min = minOrOptions;
    actualMax = max;
    messageOverride = customMessage;
  }

  // Handle null or undefined
  if (value === null || value === undefined) {
    return {
      isValid: false,
      message: messageOverride || 'Value is required.',
      length: 0
    };
  }

  // Determine length based on value type
  let currentLength = 0;
  if (typeof value === 'string') {
    currentLength = value.length;
  } else if (Array.isArray(value)) {
    currentLength = value.length;
  } else if (typeof value === 'number') {
    currentLength = String(value).length;
  } else if (typeof value === 'object') {
    currentLength = Object.keys(value).length;
  } else {
    currentLength = String(value).length;
  }

  // Check minimum length
  if (typeof min === 'number' && currentLength < min) {
    const defaultMsg =
      typeof actualMax === 'number'
        ? `Length must be between ${min} and ${actualMax} characters.`
        : `Length must be at least ${min} characters.`;
    return {
      isValid: false,
      message: messageOverride || defaultMsg,
      length: currentLength
    };
  }

  // Check maximum length
  if (typeof actualMax === 'number' && currentLength > actualMax) {
    const defaultMsg =
      typeof min === 'number'
        ? `Length must be between ${min} and ${actualMax} characters.`
        : `Length cannot exceed ${actualMax} characters.`;
    return {
      isValid: false,
      message: messageOverride || defaultMsg,
      length: currentLength
    };
  }

  return {
    isValid: true,
    message: '',
    length: currentLength
  };
}
