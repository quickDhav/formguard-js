/**
 * FormGuard.js
 * Simple, lightweight and reusable JavaScript form validation library.
 *
 * @license MIT
 */

import { validateEmail } from './email.js';
import { validatePhone } from './phone.js';
import { validatePassword } from './password.js';
import { validateRequired } from './required.js';
import { validateLength } from './length.js';
import { validateURL } from './url.js';
import { validateCustom } from './custom.js';
import { validateForm } from './form.js';

export {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateLength,
  validateURL,
  validateCustom,
  validateForm
};

const FormGuard = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateLength,
  validateURL,
  validateCustom,
  validateForm
};

export default FormGuard;
