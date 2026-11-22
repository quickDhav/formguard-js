import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateCustom } from '../src/custom.js';

describe('validateCustom', () => {
  it('should pass when custom function returns true', () => {
    const isAdult = (val) => val >= 18;
    const result = validateCustom(21, isAdult, 'Must be an adult.');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.message, '');
  });

  it('should fail with custom message when function returns false', () => {
    const isAdult = (val) => val >= 18;
    const result = validateCustom(16, isAdult, 'Must be 18 or older.');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'Must be 18 or older.');
  });

  it('should support validator returning result object', () => {
    const customValidator = (val) => {
      if (!val.startsWith('CS')) {
        return { isValid: false, message: 'Student ID must start with CS.' };
      }
      return { isValid: true };
    };

    const valid = validateCustom('CS101', customValidator);
    assert.strictEqual(valid.isValid, true);

    const invalid = validateCustom('EE101', customValidator);
    assert.strictEqual(invalid.isValid, false);
    assert.strictEqual(invalid.message, 'Student ID must start with CS.');
  });

  it('should gracefully catch exceptions thrown by validator', () => {
    const buggyValidator = () => {
      throw new Error('Database lookup failed');
    };
    const result = validateCustom('test', buggyValidator, 'Fallback message');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'Database lookup failed');
  });

  it('should handle non-function validator gracefully', () => {
    const result = validateCustom('test', null);
    assert.strictEqual(result.isValid, false);
    assert.match(result.message, /valid validator function/);
  });
});
