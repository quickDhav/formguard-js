/**
 * FormGuard.js - validateURL
 * Simple, lightweight and reusable JavaScript form validation library.
 */

/**
 * Validates whether a given string is a valid web URL.
 *
 * Supported options:
 * - protocols: Array of allowed protocols (default: ['http', 'https']).
 * - requireProtocol: Whether a protocol is required (default: true).
 * - message: Custom error message.
 *
 * @param {*} url - The URL string to validate.
 * @param {Object} [options={}] - Configurable options.
 * @param {string[]} [options.protocols=['http', 'https']] - Allowed protocols.
 * @param {boolean} [options.requireProtocol=true] - Require http:// or https:// protocol.
 * @param {string} [options.message] - Custom error message.
 * @returns {{ isValid: boolean, message: string }} Validation result object.
 */
export function validateURL(url, options = {}) {
  const {
    protocols = ['http', 'https'],
    requireProtocol = true,
    message: customMessage
  } = options;

  const defaultInvalidMessage = 'Please enter a valid URL (e.g., https://example.com).';
  const defaultEmptyMessage = 'URL is required.';

  // Check for non-string / null / undefined
  if (url === null || url === undefined || typeof url !== 'string') {
    return {
      isValid: false,
      message: customMessage || defaultEmptyMessage
    };
  }

  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      message: customMessage || defaultEmptyMessage
    };
  }

  // Handle URL with or without protocol
  let urlToTest = trimmed;
  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed);

  if (!hasProtocol) {
    if (requireProtocol) {
      return {
        isValid: false,
        message: customMessage || 'URL must include a protocol (e.g., https://).'
      };
    }
    urlToTest = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(urlToTest);

    // Verify protocol is in allowed list
    const protocolClean = parsed.protocol.replace(':', '').toLowerCase();
    if (!protocols.map((p) => p.toLowerCase()).includes(protocolClean)) {
      return {
        isValid: false,
        message:
          customMessage ||
          `URL protocol must be one of: ${protocols.join(', ')}.`
      };
    }

    // Hostname must be present and valid
    if (!parsed.hostname) {
      return {
        isValid: false,
        message: customMessage || defaultInvalidMessage
      };
    }

    if (parsed.hostname !== 'localhost') {
      if (
        parsed.hostname.startsWith('.') ||
        parsed.hostname.endsWith('.') ||
        parsed.hostname.includes('..') ||
        !parsed.hostname.includes('.')
      ) {
        return {
          isValid: false,
          message: customMessage || defaultInvalidMessage
        };
      }

      // Check valid domain label format
      const labels = parsed.hostname.split('.');
      const validLabels = labels.every(
        (lbl) => lbl.length > 0 && /^[a-zA-Z0-9-]+$/.test(lbl) && !lbl.startsWith('-') && !lbl.endsWith('-')
      );
      if (!validLabels) {
        return {
          isValid: false,
          message: customMessage || defaultInvalidMessage
        };
      }
    }

    return {
      isValid: true,
      message: ''
    };
  } catch {
    return {
      isValid: false,
      message: customMessage || defaultInvalidMessage
    };
  }
}
