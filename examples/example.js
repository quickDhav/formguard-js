/**
 * FormGuard.js - Comprehensive Usage Example
 * Run this example directly using: node examples/example.js
 */

import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateLength,
  validateURL,
  validateCustom,
  validateForm
} from '../src/index.js';

console.log('='.repeat(60));
console.log('🛡️  FormGuard.js - Demonstration & Examples');
console.log('='.repeat(60));

// 1. Email Validation
console.log('\n--- 1. Email Validation ---');
const email1 = validateEmail('student@university.edu');
console.log('Valid email ("student@university.edu"):', email1);

const email2 = validateEmail('invalid-email-address');
console.log('Invalid email ("invalid-email-address"):', email2);

// 2. Phone Validation
console.log('\n--- 2. Phone Validation ---');
const phone1 = validatePhone('+1 (555) 123-4567');
console.log('International phone ("+1 (555) 123-4567"):', phone1);

const phone2 = validatePhone('12345', { minLength: 7 });
console.log('Short phone ("12345"):', phone2);

// 3. Password Validation & Strength Assessment
console.log('\n--- 3. Password Validation ---');
const passWeak = validatePassword('mypassword');
console.log('Weak password ("mypassword"):', {
  isValid: passWeak.isValid,
  strength: passWeak.strength,
  score: passWeak.score,
  feedback: passWeak.feedback
});

const passStrong = validatePassword('CodeSafely#2026!');
console.log('Strong password ("CodeSafely#2026!"):', {
  isValid: passStrong.isValid,
  strength: passStrong.strength,
  score: passStrong.score,
  details: passStrong.details
});

// 4. Required Field Validation
console.log('\n--- 4. Required Validation ---');
console.log('Filled string ("Alex"):', validateRequired('Alex'));
console.log('Empty string ("   "):', validateRequired('   '));

// 5. Length Validation
console.log('\n--- 5. Length Validation ---');
console.log('Username ("dev", min: 3, max: 15):', validateLength('dev', 3, 15));
console.log('Username ("a", min: 3, max: 15):', validateLength('a', 3, 15));

// 6. URL Validation
console.log('\n--- 6. URL Validation ---');
console.log('Portfolio ("https://github.com/developer"):', validateURL('https://github.com/developer'));
console.log('Bad URL ("not a url"):', validateURL('not a url'));

// 7. Custom Validation
console.log('\n--- 7. Custom Validation ---');
const adultCheck = validateCustom(
  20,
  (age) => age >= 18,
  'Applicant must be at least 18 years old.'
);
console.log('Age 20 check (>= 18):', adultCheck);

// 8. Complete Form Validation
console.log('\n--- 8. Complete Form Validation ---');
const studentRegistrationData = {
  fullName: 'Ada Lovelace',
  email: 'ada@computing.org',
  phone: '+1 555-019-2834',
  password: 'Secret123#Password',
  confirmPassword: 'Secret123#Password',
  portfolioUrl: 'https://adalovelace.dev',
  agreedToTerms: true
};

const registrationRules = {
  fullName: [
    { rule: 'required', message: 'Full name is required.' },
    { rule: 'length', min: 2, max: 50, message: 'Name must be 2 to 50 characters.' }
  ],
  email: [
    { rule: 'required' },
    { rule: 'email', message: 'Please enter a valid academic/work email.' }
  ],
  phone: [
    { rule: 'required' },
    { rule: 'phone', options: { minLength: 10 } }
  ],
  password: [
    { rule: 'required' },
    { rule: 'password', options: { minLength: 8 } }
  ],
  confirmPassword: [
    { rule: 'required' },
    {
      rule: 'custom',
      validator: (val, allData) => val === allData.password,
      message: 'Passwords do not match.'
    }
  ],
  portfolioUrl: [
    { rule: 'url', message: 'Portfolio must be a valid URL.' }
  ],
  agreedToTerms: [
    { rule: 'required', message: 'You must agree to the Terms of Service.' }
  ]
};

const formResult = validateForm(studentRegistrationData, registrationRules);
console.log('Complete Form Valid?:', formResult.isValid);
console.log('Form Errors:', formResult.errors);
console.log('Password Strength Result:', formResult.results.password.strength);

console.log('\n' + '='.repeat(60));
console.log('✅ All examples executed successfully!');
console.log('='.repeat(60));
