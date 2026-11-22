import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validatePassword } from '../src/password.js';

describe('validatePassword', () => {
  it('should pass strong password satisfying all criteria', () => {
    const result = validatePassword('SuperSecret#2026');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.strength, 'strong');
    assert.strictEqual(result.score, 4);
    assert.strictEqual(result.feedback.length, 0);
    assert.strictEqual(result.message, '');
    assert.strictEqual(result.details.uppercase, true);
    assert.strictEqual(result.details.lowercase, true);
    assert.strictEqual(result.details.number, true);
    assert.strictEqual(result.details.special, true);
    assert.strictEqual(result.details.length, true);
  });

  it('should detect missing uppercase letter', () => {
    const result = validatePassword('secret#2026');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.details.uppercase, false);
    assert.ok(result.feedback.some((f) => f.includes('uppercase')));
  });

  it('should detect missing lowercase letter', () => {
    const result = validatePassword('SECRET#2026');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.details.lowercase, false);
    assert.ok(result.feedback.some((f) => f.includes('lowercase')));
  });

  it('should detect missing number', () => {
    const result = validatePassword('SecretSpecial#');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.details.number, false);
    assert.ok(result.feedback.some((f) => f.includes('numeric digit')));
  });

  it('should detect missing special character', () => {
    const result = validatePassword('SecretPass2026');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.details.special, false);
    assert.ok(result.feedback.some((f) => f.includes('special character')));
  });

  it('should reject passwords shorter than minLength', () => {
    const result = validatePassword('S#1a', { minLength: 8 });
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.details.length, false);
    assert.ok(result.feedback.some((f) => f.includes('at least 8 characters')));
  });

  it('should allow configuring requirements', () => {
    const result = validatePassword('simplepassword', {
      minLength: 6,
      requireUppercase: false,
      requireNumbers: false,
      requireSpecial: false
    });
    assert.strictEqual(result.isValid, true);
  });

  it('should correctly classify weak, medium, and strong passwords', () => {
    const weak = validatePassword('abc');
    assert.strictEqual(weak.strength, 'weak');

    const medium = validatePassword('Pass1234', {
      requireSpecial: false
    });
    assert.strictEqual(medium.strength, 'medium');

    const strong = validatePassword('Strong#P@ssword2026');
    assert.strictEqual(strong.strength, 'strong');
  });

  it('should reject null, undefined, or empty values', () => {
    assert.strictEqual(validatePassword(null).isValid, false);
    assert.strictEqual(validatePassword(undefined).isValid, false);
    assert.strictEqual(validatePassword('').isValid, false);
    assert.strictEqual(validatePassword(12345).isValid, false);
  });

  it('should use custom error message when provided', () => {
    const result = validatePassword('weak', { message: 'Password is too weak!' });
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'Password is too weak!');
  });
});
