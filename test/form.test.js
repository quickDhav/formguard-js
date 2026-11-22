import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateForm } from '../src/form.js';

describe('validateForm', () => {
  it('should validate a complete valid form successfully', () => {
    const formData = {
      username: 'johndoe',
      email: 'john@example.com',
      phone: '+1 555-123-4567',
      password: 'Secure#Pass123',
      confirmPassword: 'Secure#Pass123',
      website: 'https://example.com'
    };

    const rules = {
      username: [
        { rule: 'required' },
        { rule: 'length', min: 3, max: 20 }
      ],
      email: [
        { rule: 'required' },
        { rule: 'email' }
      ],
      phone: [
        { rule: 'required' },
        { rule: 'phone' }
      ],
      password: [
        { rule: 'required' },
        { rule: 'password', options: { minLength: 8 } }
      ],
      confirmPassword: [
        { rule: 'required' },
        {
          rule: 'custom',
          validator: (val, data) => val === data.password,
          message: 'Passwords must match.'
        }
      ],
      website: [
        { rule: 'url' }
      ]
    };

    const result = validateForm(formData, rules);
    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.errors, {});
    assert.ok(result.results.password.strength === 'strong');
  });

  it('should return errors for invalid fields', () => {
    const formData = {
      username: 'a',
      email: 'bad-email',
      phone: '123',
      password: 'weak',
      confirmPassword: 'different'
    };

    const rules = {
      username: [
        { rule: 'required' },
        { rule: 'length', min: 3, max: 15, message: 'Username too short' }
      ],
      email: [{ rule: 'email', message: 'Invalid email' }],
      phone: [{ rule: 'phone', options: { minLength: 7 } }],
      password: [{ rule: 'password' }],
      confirmPassword: [
        {
          rule: 'custom',
          validator: (val, data) => val === data.password,
          message: 'Passwords do not match.'
        }
      ]
    };

    const result = validateForm(formData, rules);
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.errors.username, 'Username too short');
    assert.strictEqual(result.errors.email, 'Invalid email');
    assert.ok(result.errors.phone.length > 0);
    assert.ok(result.errors.password.length > 0);
    assert.strictEqual(result.errors.confirmPassword, 'Passwords do not match.');
  });

  it('should support pipe-separated shorthand rule strings', () => {
    const formData = {
      email: 'not-valid'
    };
    const rules = {
      email: 'required|email'
    };

    const result = validateForm(formData, rules);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.email.length > 0);
  });

  it('should support direct function validator in rules', () => {
    const formData = {
      code: 'ABC'
    };
    const rules = {
      code: (val) => (val === 'SECRET' ? true : 'Incorrect secret code.')
    };

    const result = validateForm(formData, rules);
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.errors.code, 'Incorrect secret code.');
  });

  it('should handle missing or empty inputs gracefully', () => {
    const result1 = validateForm();
    assert.strictEqual(result1.isValid, true);

    const result2 = validateForm(null, null);
    assert.strictEqual(result2.isValid, true);
  });
});
