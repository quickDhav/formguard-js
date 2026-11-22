import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequired } from '../src/required.js';

describe('validateRequired', () => {
  it('should return isValid: true for non-empty string', () => {
    const result = validateRequired('Hello world');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.message, '');
  });

  it('should return isValid: false for empty string', () => {
    const result = validateRequired('');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'This field is required.');
  });

  it('should return isValid: false for whitespace-only string', () => {
    const result = validateRequired('   ');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'This field is required.');
  });

  it('should return isValid: false for null and undefined', () => {
    assert.strictEqual(validateRequired(null).isValid, false);
    assert.strictEqual(validateRequired(undefined).isValid, false);
  });

  it('should return isValid: true for number 0 and negative numbers', () => {
    assert.strictEqual(validateRequired(0).isValid, true);
    assert.strictEqual(validateRequired(-42).isValid, true);
    assert.strictEqual(validateRequired(100).isValid, true);
  });

  it('should return isValid: false for NaN', () => {
    assert.strictEqual(validateRequired(NaN).isValid, false);
  });

  it('should treat boolean true as valid and false as invalid by default', () => {
    assert.strictEqual(validateRequired(true).isValid, true);
    assert.strictEqual(validateRequired(false).isValid, false);
  });

  it('should allow boolean false when allowFalse is enabled', () => {
    const result = validateRequired(false, { allowFalse: true });
    assert.strictEqual(result.isValid, true);
  });

  it('should validate arrays correctly', () => {
    assert.strictEqual(validateRequired([1, 2]).isValid, true);
    assert.strictEqual(validateRequired([]).isValid, false);
  });

  it('should validate objects correctly', () => {
    assert.strictEqual(validateRequired({ name: 'Alex' }).isValid, true);
    assert.strictEqual(validateRequired({}).isValid, false);
  });

  it('should use custom error message when provided', () => {
    const result = validateRequired('', 'Please fill out this field!');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'Please fill out this field!');
  });
});
