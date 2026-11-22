import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validatePhone } from '../src/phone.js';

describe('validatePhone', () => {
  it('should accept valid international and local phone numbers', () => {
    const validPhones = [
      '+1 (555) 123-4567',
      '+44 20 7946 0958',
      '+91 98765 43210',
      '123-456-7890',
      '(123) 456-7890',
      '1234567890',
      '+61.491.570.156'
    ];

    for (const phone of validPhones) {
      const result = validatePhone(phone);
      assert.strictEqual(result.isValid, true, `Expected "${phone}" to be valid`);
      assert.strictEqual(result.message, '');
      assert.ok(result.digits.length >= 7);
    }
  });

  it('should accept number types and extract digits', () => {
    const result = validatePhone(1234567890);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.digits, '1234567890');
  });

  it('should reject letters and illegal characters', () => {
    const invalidPhones = [
      '123-456-CALL',
      '+1 (555) 123-4567 ext 9',
      'phone#12345',
      'abcdefgh'
    ];

    for (const phone of invalidPhones) {
      const result = validatePhone(phone);
      assert.strictEqual(result.isValid, false, `Expected "${phone}" to be invalid`);
    }
  });

  it('should reject mismatched parentheses', () => {
    assert.strictEqual(validatePhone('(123-456-7890').isValid, false);
    assert.strictEqual(validatePhone('123)-456-7890').isValid, false);
  });

  it('should enforce exactLength option', () => {
    const valid = validatePhone('123-456-7890', { exactLength: 10 });
    assert.strictEqual(valid.isValid, true);

    const invalid = validatePhone('+1 123-456-7890', { exactLength: 10 }); // 11 digits
    assert.strictEqual(invalid.isValid, false);
    assert.match(invalid.message, /exactly 10 digits/);
  });

  it('should enforce minLength and maxLength options', () => {
    const tooShort = validatePhone('12345', { minLength: 7 });
    assert.strictEqual(tooShort.isValid, false);
    assert.match(tooShort.message, /at least 7 digits/);

    const tooLong = validatePhone('12345678901234567890', { maxLength: 15 });
    assert.strictEqual(tooLong.isValid, false);
    assert.match(tooLong.message, /cannot exceed 15 digits/);
  });

  it('should reject empty, null, or undefined values', () => {
    assert.strictEqual(validatePhone('').isValid, false);
    assert.strictEqual(validatePhone(null).isValid, false);
    assert.strictEqual(validatePhone(undefined).isValid, false);
  });

  it('should respect custom error message', () => {
    const result = validatePhone('bad', { message: 'Invalid mobile number.' });
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'Invalid mobile number.');
  });
});
