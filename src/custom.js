/**
 * FormGuard.js - validateCustom
 * Simple, lightweight and reusable JavaScript form validation library.
 */

/**
 * Validates a value using a developer-provided custom validator function.
 *
 * The validator function can return:
 * - A boolean (`true` for valid, `false` for invalid)
 * - An object `{ isValid: boolean, message?: string }`
 *
 * @param {*} value - The input value to validate.
 * @param {Function} validator - Function receiving `(value)` and returning boolean or result object.
 * @param {string} [customMessage="Validation failed."] - Fallback error message if invalid.
 * @returns {{ isValid: boolean, message: string }} Validation result object.
 *
 * @example
 * validateCustom(age, (val) => val >= 18, "Must be at least 18 years old.");
 */
export function validateCustom(value, validator, customMessage = 'Validation failed.') {
  if (typeof validator !== 'function') {
    return {
      isValid: false,
      message: 'A valid validator function must be provided.'
    };
  }

  try {
    const result = validator(value);

    // If validator returns an object with isValid property
    if (result && typeof result === 'object' && typeof result.isValid === 'boolean') {
      return {
        isValid: result.isValid,
        message: result.isValid ? '' : (result.message || customMessage)
      };
    }

    // If validator returns a boolean
    if (typeof result === 'boolean') {
      return {
        isValid: result,
        message: result ? '' : customMessage
      };
    }

    // Treat truthy/falsy fallback
    const isValid = Boolean(result);
    return {
      isValid,
      message: isValid ? '' : customMessage
    };
  } catch (error) {
    return {
      isValid: false,
      message: error instanceof Error ? error.message : customMessage
    };
  }
}
