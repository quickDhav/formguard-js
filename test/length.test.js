import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateLength } from '../src/length.js';

describe('validateLength', () => {
  it('should pass strings within length range', () => {
    const result = validateLength('hello', 3, 10);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.length, 5);
    assert.strictEqual(result.message, '');
  });

  it('should accept boundary values (exact min and exact max)', () => {
    assert.strictEqual(validateLength('abc', 3, 5).isValid, true);
    assert.strictEqual(validateLength('abcde', 3, 5).isValid, true);
  });

  it('should reject string shorter than min', () => {
    const result = validateLength('ab', 3, 10);
    assert.strictEqual(result.isValid, false);
    assert.match(result.message, /between 3 and 10 characters/);
  });

  it('should reject string longer than max', () => {
    const result = validateLength('abcdefghijk', 3, 10);
    assert.strictEqual(result.isValid, false);
    assert.match(result.message, /between 3 and 10 characters/);
  });

  it('should support minimum length only', () => {
    assert.strictEqual(validateLength('hello', 3).isValid, true);
    const fail = validateLength('hi', 3);
    assert.strictEqual(fail.isValid, false);
    assert.match(fail.message, /at least 3 characters/);
  });

  it('should support options object format', () => {
    const valid = validateLength('hello', { min: 2, max: 8 });
    assert.strictEqual(valid.isValid, true);

    const invalid = validateLength('hi', { min: 5, max: 10, message: 'Too short!' });
    assert.strictEqual(invalid.isValid, false);
    assert.strictEqual(invalid.message, 'Too short!');
  });

  it('should validate array lengths', () => {
    assert.strictEqual(validateLength([1, 2, 3], 2, 5).isValid, true);
    assert.strictEqual(validateLength([1], 2, 5).isValid, false);
  });

  it('should validate number string representation length', () => {
    assert.strictEqual(validateLength(12345, 3, 6).isValid, true);
    assert.strictEqual(validateLength(12, 3, 6).isValid, false);
  });

  it('should reject null and undefined values', () => {
    assert.strictEqual(validateLength(null, 1, 5).isValid, false);
    assert.strictEqual(validateLength(undefined, 1, 5).isValid, false);
  });
});
