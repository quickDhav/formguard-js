/**
 * FormGuard.js - validatePassword
 * Simple, lightweight and reusable JavaScript form validation library.
 */

// Default special characters regex
const SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?~`\\]/;

/**
 * Validates a password against security rules and assesses strength.
 *
 * Rules checked by default:
 * - Minimum length: 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*...)
 *
 * @param {*} password - The password string to validate.
 * @param {Object} [options={}] - Configurable validation criteria.
 * @param {number} [options.minLength=8] - Minimum character length.
 * @param {number} [options.maxLength=128] - Maximum character length.
 * @param {boolean} [options.requireUppercase=true] - Require uppercase letter.
 * @param {boolean} [options.requireLowercase=true] - Require lowercase letter.
 * @param {boolean} [options.requireNumbers=true] - Require number digit.
 * @param {boolean} [options.requireSpecial=true] - Require special character.
 * @param {string} [options.message] - Custom fallback error message.
 * @returns {{
 *   isValid: boolean,
 *   strength: 'weak' | 'medium' | 'strong',
 *   score: number,
 *   feedback: string[],
 *   message: string,
 *   details: {
 *     length: boolean,
 *     uppercase: boolean,
 *     lowercase: boolean,
 *     number: boolean,
 *     special: boolean
 *   }
 * }} Validation result with strength score and actionable feedback.
 */
export function validatePassword(password, options = {}) {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true,
    message: customMessage
  } = options;

  const defaultEmptyMessage = 'Password is required.';

  // Check for non-string / null / undefined inputs
  if (password === null || password === undefined || typeof password !== 'string') {
    return {
      isValid: false,
      strength: 'weak',
      score: 0,
      feedback: ['Password must be a non-empty string.'],
      message: customMessage || defaultEmptyMessage,
      details: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    };
  }

  if (password.length === 0) {
    return {
      isValid: false,
      strength: 'weak',
      score: 0,
      feedback: ['Password cannot be empty.'],
      message: customMessage || defaultEmptyMessage,
      details: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    };
  }

  const feedback = [];
  const details = {
    length: password.length >= minLength && password.length <= maxLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: SPECIAL_CHARS_REGEX.test(password)
  };

  // Evaluate requirements
  if (password.length < minLength) {
    feedback.push(`Password must be at least ${minLength} characters long.`);
  } else if (password.length > maxLength) {
    feedback.push(`Password cannot exceed ${maxLength} characters.`);
  }

  if (requireUppercase && !details.uppercase) {
    feedback.push('Password must contain at least one uppercase letter (A-Z).');
  }

  if (requireLowercase && !details.lowercase) {
    feedback.push('Password must contain at least one lowercase letter (a-z).');
  }

  if (requireNumbers && !details.number) {
    feedback.push('Password must contain at least one numeric digit (0-9).');
  }

  if (requireSpecial && !details.special) {
    feedback.push('Password must contain at least one special character (e.g. !@#$%^&*).');
  }

  // Calculate strength score (0 to 4)
  let score = 0;
  if (details.length) score++;
  if (details.uppercase && details.lowercase) score++;
  if (details.number) score++;
  if (details.special) score++;
  if (password.length >= 12 && score === 4) score = 4; // bonus reassurance for long passwords

  let strength = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }

  const isValid = feedback.length === 0;
  const message = isValid ? '' : (customMessage || feedback[0]);

  return {
    isValid,
    strength,
    score,
    feedback,
    message,
    details
  };
}
