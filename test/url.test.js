import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateURL } from '../src/url.js';

describe('validateURL', () => {
  it('should accept valid standard URLs', () => {
    const validUrls = [
      'https://example.com',
      'http://subdomain.example.org/path/to/page',
      'https://github.com/developer/project?tab=readme&v=1.0',
      'https://api.service.io:8080/v1/users',
      'http://localhost:3000'
    ];

    for (const url of validUrls) {
      const result = validateURL(url);
      assert.strictEqual(result.isValid, true, `Expected "${url}" to be valid`);
      assert.strictEqual(result.message, '');
    }
  });

  it('should reject invalid URLs', () => {
    const invalidUrls = [
      'not a url',
      'https://',
      'http://.com',
      'ftp://example.com',
      'https://exam ple.com',
      'htp://example.com'
    ];

    for (const url of invalidUrls) {
      const result = validateURL(url);
      assert.strictEqual(result.isValid, false, `Expected "${url}" to be invalid`);
    }
  });

  it('should support requireProtocol: false', () => {
    const result = validateURL('example.com', { requireProtocol: false });
    assert.strictEqual(result.isValid, true);
  });

  it('should restrict protocols when specified', () => {
    const onlyHttps = validateURL('http://example.com', { protocols: ['https'] });
    assert.strictEqual(onlyHttps.isValid, false);
    assert.match(onlyHttps.message, /protocol must be one of: https/);

    const validHttps = validateURL('https://example.com', { protocols: ['https'] });
    assert.strictEqual(validHttps.isValid, true);
  });

  it('should reject null, undefined, or empty values', () => {
    assert.strictEqual(validateURL(null).isValid, false);
    assert.strictEqual(validateURL(undefined).isValid, false);
    assert.strictEqual(validateURL('').isValid, false);
    assert.strictEqual(validateURL('   ').isValid, false);
    assert.strictEqual(validateURL(12345).isValid, false);
  });

  it('should use custom error message when provided', () => {
    const result = validateURL('invalid', { message: 'Must be a valid portfolio link.' });
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.message, 'Must be a valid portfolio link.');
  });
});
