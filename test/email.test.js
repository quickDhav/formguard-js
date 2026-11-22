import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateEmail } from '../src/email.js';

describe('validateEmail', () => {
  it('should accept valid standard email formats', () => {
    const validEmails = [
      'user@example.com',
      'john.doe@company.org',
      'student123@university.edu',
      'developer+newsletter@domain.co.uk',
      'support_desk@sub.domain.io'
    ];

    for (const email of validEmails) {
      const result = validateEmail(email);
      assert.strictEqual(result.isValid, true, `Expected "${email}" to be valid`);
      assert.strictEqual(result.message, '');
    }
  });

  it('should reject improperly formatted emails', () => {
    const invalidEmails = [
      'plainaddress',
      'missingatsign.com',
      '@nodomain.com',
      'user@.com',
      'user@domain..com',
      'user@domain',
      'user with spaces@domain.com',
      'user@domain .com'
    ];

    for (const email of invalidEmails) {
      const result = validateEmail(email);
      assert.strictEqual(result.isValid, false, `Expected "${email}" to be invalid`);
      assert.ok(result.message.length > 0);
    }
  });

  it('should reject empty, null, and undefined values', () => {
    assert.strictEqual(validateEmail('').isValid, false);
    assert.strictEqual(validateEmail('   ').isValid, false);
    assert.strictEqual(validateEmail(null).isValid, false);
    assert.strictEqual(validateEmail(undefined).isValid, false);
    assert.strictEqual(validateEmail(12345).isValid, false);
  });

  it('should use custom error message when supplied', () => {
    const custom = 'Invalid campus email address.';
    const result = validateEmail('not-an-email', custom);
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, custom);
  });
});
