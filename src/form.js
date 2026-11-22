/**
 * FormGuard.js - validateForm
 * Simple, lightweight and reusable JavaScript form validation library.
 */

import { validateRequired } from './required.js';
import { validateEmail } from './email.js';
import { validatePhone } from './phone.js';
import { validatePassword } from './password.js';
import { validateLength } from './length.js';
import { validateURL } from './url.js';
import { validateCustom } from './custom.js';

/**
 * Validates an entire form object containing multiple fields against schema rules.
 *
 * Rules can be:
 * 1. Array of rule objects:
 *    [
 *      { rule: 'required', message: 'Custom message' },
 *      { rule: 'email' },
 *      { rule: 'length', min: 3, max: 20 },
 *      { rule: 'phone', options: { minLength: 10 } },
 *      { rule: 'password', options: { minLength: 8 } },
 *      { rule: 'url' },
 *      { rule: 'custom', validator: (val, allData) => val === allData.password, message: 'Does not match' }
 *    ]
 *
 * 2. Pipe-separated string shorthand:
 *    "required|email"
 *
 * 3. Direct function validator:
 *    (val, allData) => val === allData.password ? true : 'Passwords do not match'
 *
 * @param {Object} [data={}] - Form values key-value map.
 * @param {Object} [rules={}] - Validation rules key-value map.
 * @returns {{
 *   isValid: boolean,
 *   errors: Record<string, string>,
 *   results: Record<string, any>
 * }} Validation result with overall status, field error map, and detailed results.
 *
 * @example
 * const result = validateForm(
 *   { email: 'user@test.com', age: 20 },
 *   {
 *     email: [{ rule: 'required' }, { rule: 'email' }],
 *     age: [{ rule: 'custom', validator: (val) => val >= 18, message: 'Must be 18+' }]
 *   }
 * );
 */
export function validateForm(data = {}, rules = {}) {
  const safeData = data && typeof data === 'object' ? data : {};
  const safeRules = rules && typeof rules === 'object' ? rules : {};

  const errors = {};
  const results = {};
  let overallValid = true;

  for (const [field, fieldRules] of Object.entries(safeRules)) {
    const value = safeData[field];
    const normalizedRules = normalizeFieldRules(fieldRules);

    let fieldError = '';
    let fieldResult = null;

    for (const ruleDef of normalizedRules) {
      const res = executeRule(ruleDef, value, safeData);
      fieldResult = res;

      if (!res.isValid) {
        fieldError = res.message;
        break; // Stop at first failing rule for this field
      }
    }

    if (fieldError) {
      errors[field] = fieldError;
      overallValid = false;
    }

    results[field] = fieldResult || { isValid: true, message: '' };
  }

  return {
    isValid: overallValid,
    errors,
    results
  };
}

/**
 * Normalizes varied rule formats into an array of standard rule objects.
 *
 * @private
 * @param {*} rules
 * @returns {Array<Object|Function>}
 */
function normalizeFieldRules(rules) {
  if (!rules) return [];

  // If a single function is provided
  if (typeof rules === 'function') {
    return [{ rule: 'custom', validator: rules }];
  }

  // If pipe-separated string shorthand: e.g. "required|email"
  if (typeof rules === 'string') {
    return rules
      .split('|')
      .map((r) => r.trim())
      .filter(Boolean)
      .map((ruleName) => ({ rule: ruleName }));
  }

  // If array of rules
  if (Array.isArray(rules)) {
    return rules
      .map((item) => {
        if (typeof item === 'string') {
          return { rule: item };
        }
        if (typeof item === 'function') {
          return { rule: 'custom', validator: item };
        }
        return item;
      })
      .filter(Boolean);
  }

  // Single rule object
  if (typeof rules === 'object') {
    return [rules];
  }

  return [];
}

/**
 * Executes a single validation rule definition.
 *
 * @private
 * @param {Object} ruleDef
 * @param {*} value
 * @param {Object} allData
 * @returns {{ isValid: boolean, message: string }}
 */
function executeRule(ruleDef, value, allData) {
  const ruleName = (ruleDef.rule || '').toLowerCase();
  const customMessage = ruleDef.message;

  switch (ruleName) {
    case 'required':
      return validateRequired(value, {
        message: customMessage,
        allowFalse: ruleDef.allowFalse
      });

    case 'email':
      return validateEmail(value, customMessage);

    case 'phone': {
      const opts = {
        ...(ruleDef.options || {}),
        minLength: ruleDef.minLength ?? ruleDef.options?.minLength,
        maxLength: ruleDef.maxLength ?? ruleDef.options?.maxLength,
        exactLength: ruleDef.exactLength ?? ruleDef.options?.exactLength,
        message: customMessage || ruleDef.options?.message
      };
      return validatePhone(value, opts);
    }

    case 'password': {
      const opts = {
        ...(ruleDef.options || {}),
        minLength: ruleDef.minLength ?? ruleDef.options?.minLength,
        maxLength: ruleDef.maxLength ?? ruleDef.options?.maxLength,
        requireUppercase: ruleDef.requireUppercase ?? ruleDef.options?.requireUppercase,
        requireLowercase: ruleDef.requireLowercase ?? ruleDef.options?.requireLowercase,
        requireNumbers: ruleDef.requireNumbers ?? ruleDef.options?.requireNumbers,
        requireSpecial: ruleDef.requireSpecial ?? ruleDef.options?.requireSpecial,
        message: customMessage || ruleDef.options?.message
      };
      return validatePassword(value, opts);
    }

    case 'length': {
      const min = ruleDef.min ?? ruleDef.options?.min;
      const max = ruleDef.max ?? ruleDef.options?.max;
      return validateLength(value, min, max, customMessage);
    }

    case 'url': {
      const opts = {
        ...(ruleDef.options || {}),
        protocols: ruleDef.protocols ?? ruleDef.options?.protocols,
        requireProtocol: ruleDef.requireProtocol ?? ruleDef.options?.requireProtocol,
        message: customMessage || ruleDef.options?.message
      };
      return validateURL(value, opts);
    }

    case 'custom': {
      const validator = ruleDef.validator;
      if (typeof validator !== 'function') {
        return {
          isValid: false,
          message: customMessage || 'Invalid custom validator.'
        };
      }
      try {
        const result = validator(value, allData);
        if (typeof result === 'boolean') {
          return {
            isValid: result,
            message: result ? '' : (customMessage || 'Validation failed.')
          };
        }
        if (result && typeof result === 'object' && typeof result.isValid === 'boolean') {
          return {
            isValid: result.isValid,
            message: result.isValid ? '' : (result.message || customMessage || 'Validation failed.')
          };
        }
        if (typeof result === 'string') {
          return {
            isValid: false,
            message: result
          };
        }
        const isValid = Boolean(result);
        return {
          isValid,
          message: isValid ? '' : (customMessage || 'Validation failed.')
        };
      } catch (err) {
        return {
          isValid: false,
          message: err instanceof Error ? err.message : (customMessage || 'Validation failed.')
        };
      }
    }

    default:
      return {
        isValid: true,
        message: ''
      };
  }
}
