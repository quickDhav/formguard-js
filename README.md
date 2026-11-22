# FormGuard.js 🛡️

> **Simple, lightweight and reusable JavaScript form validation library.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/tests-58%20passing-success.svg)](test)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

FormGuard.js is an open-source, zero-dependency, modern JavaScript library designed to make client-side and server-side form validation clean, reliable, and beginner-friendly. Built using native ES Modules, it works seamlessly across modern browsers, modern Node.js environments, and frontend frameworks like React, Vue, and Svelte.

---

## 📋 Features

- ⚡ **Zero Dependencies** – Ultra-lightweight (~10 KB unpacked), fast, and self-contained.
- 🌐 **Modern ES Modules** – Native `import` syntax ready for Vite, Next.js, Webpack, and Node.js.
- 📧 **Built-in Email Validation** – RFC 5322 compliant email format validation.
- 📱 **International Phone Validation** – Supports E.164 (`+` prefixed) standards, dashes, parentheses, spaces, and custom digit counts.
- 🔐 **Password Security Scoring** – Validates uppercase, lowercase, numbers, special characters, length, and outputs strength ratings (`weak`, `medium`, `strong`).
- 📏 **Flexible Length Boundaries** – Check string, array, or numeric length against minimum and maximum boundaries.
- 🌐 **Robust URL Validation** – Safe web address validation with protocol checks.
- 📝 **Multi-field Form Validation** – Single function `validateForm` to validate entire forms with custom rule objects or shorthand syntax.
- 🧩 **Custom Validators** – Inject your own business logic functions or regex rules easily.
- 🧪 **100% Native Tests** – Fully covered using Node.js built-in `node:test` and `node:assert/strict`.

---

## 💻 Requirements

- **Node.js**: version `18.0.0` or higher
- **Module type**: ES Modules (`"type": "module"`)

---

## 📦 Installation

Install FormGuard.js into your project using NPM:

```bash
npm install formguard-js
```

Or using Yarn / PNPM:

```bash
yarn add formguard-js
# or
pnpm add formguard-js
```

---

## 🚀 Import Instructions

FormGuard.js supports named imports for tree-shaking, as well as default namespace import:

### Named Imports (Recommended)

```javascript
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateLength,
  validateURL,
  validateCustom,
  validateForm
} from "formguard-js";
```

### Default Import

```javascript
import FormGuard from "formguard-js";

FormGuard.validateEmail("user@example.com");
```

---

## 📖 API Reference & Examples

Every validation function returns a predictable result object containing at least:
- `isValid` *(boolean)*: `true` if valid, `false` otherwise.
- `message` *(string)*: An empty string `""` if valid, or a descriptive error message if invalid.

---

### 1. `validateEmail(email, [customMessage])`

Checks whether an email address has a valid format according to standard RFC specifications. Rejects empty, non-string, or malformed addresses.

- **Parameters:**
  - `email` *(\*)*: The email string to validate.
  - `customMessage` *(string, optional)*: Custom error message.
- **Returns:** `{ isValid: boolean, message: string }`

```javascript
import { validateEmail } from "formguard-js";

validateEmail("student@university.edu");
// => { isValid: true, message: "" }

validateEmail("invalid-email-address");
// => { isValid: false, message: "Please enter a valid email address (e.g., user@example.com)." }

validateEmail("", "Email cannot be empty.");
// => { isValid: false, message: "Email cannot be empty." }
```

---

### 2. `validatePhone(phone, [options])`

Validates phone numbers supporting common international formats (E.164, country codes like `+1`, `+44`, `+91`, parentheses, dashes, spaces) and allows configuring expected digit length.

- **Parameters:**
  - `phone` *(\*)*: Phone number string or number.
  - `options` *(object, optional)*:
    - `minLength` *(number, default: 7)*: Minimum digit count.
    - `maxLength` *(number, default: 15)*: Maximum digit count (ITU-T E.164 standard).
    - `exactLength` *(number, optional)*: Required exact digit count.
    - `message` *(string, optional)*: Custom error message.
- **Returns:** `{ isValid: boolean, message: string, digits?: string }`

```javascript
import { validatePhone } from "formguard-js";

// International phone format
validatePhone("+1 (555) 123-4567");
// => { isValid: true, message: "", digits: "15551234567" }

// Enforce exact 10-digit mobile number
validatePhone("9876543210", { exactLength: 10 });
// => { isValid: true, message: "", digits: "9876543210" }

// Reject short numbers
validatePhone("12345", { minLength: 7 });
// => { isValid: false, message: "Phone number must contain at least 7 digits.", digits: "12345" }
```

---

### 3. `validatePassword(password, [options])`

Validates password complexity against configurable security criteria and assesses password strength (`weak`, `medium`, `strong`).

- **Parameters:**
  - `password` *(\*)*: Password string to evaluate.
  - `options` *(object, optional)*:
    - `minLength` *(number, default: 8)*
    - `maxLength` *(number, default: 128)*
    - `requireUppercase` *(boolean, default: true)*
    - `requireLowercase` *(boolean, default: true)*
    - `requireNumbers` *(boolean, default: true)*
    - `requireSpecial` *(boolean, default: true)*
    - `message` *(string, optional)*: Custom error message.
- **Returns:**
  ```typescript
  {
    isValid: boolean,
    strength: 'weak' | 'medium' | 'strong',
    score: number, // 0 to 4
    feedback: string[],
    message: string,
    details: {
      length: boolean,
      uppercase: boolean,
      lowercase: boolean,
      number: boolean,
      special: boolean
    }
  }
  ```

```javascript
import { validatePassword } from "formguard-js";

const result = validatePassword("SuperSecret#2026");
console.log(result.isValid);   // true
console.log(result.strength);  // "strong"
console.log(result.score);     // 4

const weak = validatePassword("mypassword");
console.log(weak.isValid);     // false
console.log(weak.strength);    // "weak"
console.log(weak.feedback);
// [
//   "Password must contain at least one uppercase letter (A-Z).",
//   "Password must contain at least one numeric digit (0-9).",
//   "Password must contain at least one special character (e.g. !@#$%^&*)."
// ]
```

---

### 4. `validateRequired(value, [optionsOrMessage])`

Checks whether a value is provided and not empty. Correctly handles empty strings, whitespace, empty arrays, empty objects, `null`, `undefined`, and unselected checkboxes (`false`).

- **Parameters:**
  - `value` *(\*)*: Input value to verify.
  - `optionsOrMessage` *(string | object, optional)*: Custom message or `{ message, allowFalse }`.
- **Returns:** `{ isValid: boolean, message: string }`

```javascript
import { validateRequired } from "formguard-js";

validateRequired("John Doe"); // { isValid: true, message: "" }
validateRequired("   ");      // { isValid: false, message: "This field is required." }
validateRequired(null);       // { isValid: false, message: "This field is required." }
validateRequired([]);         // { isValid: false, message: "This field is required." }
validateRequired(false);      // { isValid: false, message: "This field is required." } (e.g. Terms checkbox)
validateRequired(0);          // { isValid: true, message: "" } (0 is a valid number)
```

---

### 5. `validateLength(value, minOrOptions, [max], [customMessage])`

Validates that the length of a string, array, number, or object keys falls within a specified range.

- **Parameters:**
  - `value` *(\*)*: Value to check length of.
  - `minOrOptions` *(number | object)*: Minimum length or options `{ min, max, message }`.
  - `max` *(number, optional)*: Maximum length.
  - `customMessage` *(string, optional)*: Custom error message.
- **Returns:** `{ isValid: boolean, message: string, length: number }`

```javascript
import { validateLength } from "formguard-js";

// Positional parameters (min, max)
validateLength("alex", 3, 10);
// => { isValid: true, message: "", length: 4 }

// Minimum length only
validateLength("hi", 3);
// => { isValid: false, message: "Length must be at least 3 characters.", length: 2 }

// Options object format
validateLength("username", { min: 3, max: 8, message: "Invalid username length." });
// => { isValid: true, message: "", length: 8 }
```

---

### 6. `validateURL(url, [options])`

Validates web URLs using the WHATWG standard URL specification.

- **Parameters:**
  - `url` *(\*)*: URL string to test.
  - `options` *(object, optional)*:
    - `protocols` *(string[], default: ['http', 'https'])*: Allowed protocols.
    - `requireProtocol` *(boolean, default: true)*: Require `http://` or `https://`.
    - `message` *(string, optional)*: Custom error message.
- **Returns:** `{ isValid: boolean, message: string }`

```javascript
import { validateURL } from "formguard-js";

validateURL("https://github.com/developer");
// => { isValid: true, message: "" }

validateURL("not-a-url");
// => { isValid: false, message: "URL must include a protocol (e.g., https://)." }

// Allow domain without explicit protocol
validateURL("example.com", { requireProtocol: false });
// => { isValid: true, message: "" }
```

---

### 7. `validateCustom(value, validator, [customMessage])`

Allows developers to write custom validation logic using a custom function.

- **Parameters:**
  - `value` *(\*)*: Input value.
  - `validator` *(function)*: Function receiving `(value)` returning boolean or `{ isValid, message }`.
  - `customMessage` *(string, optional)*: Fallback error message (default: `"Validation failed."`).
- **Returns:** `{ isValid: boolean, message: string }`

```javascript
import { validateCustom } from "formguard-js";

// Age verification
const ageCheck = validateCustom(20, (age) => age >= 18, "Must be at least 18 years old.");
console.log(ageCheck.isValid); // true

// Custom format check with result object
const studentIdCheck = validateCustom("CS2026", (id) => {
  if (!id.startsWith("CS")) {
    return { isValid: false, message: "Student ID must begin with 'CS'." };
  }
  return { isValid: true };
});
console.log(studentIdCheck.isValid); // true
```

---

### 8. `validateForm(data, rules)`

Orchestrates multi-field form validation. Accepts an object containing form data and validation rules. Returns the overall validity, an object with field-specific error messages, and detailed field results.

- **Parameters:**
  - `data` *(object)*: Key-value map representing the form fields.
  - `rules` *(object)*: Key-value map of validation rules per field.
- **Returns:**
  ```typescript
  {
    isValid: boolean,
    errors: Record<string, string>,
    results: Record<string, any>
  }
  ```

#### Complete Form Example:

```javascript
import { validateForm } from "formguard-js";

const formData = {
  fullName: "Ada Lovelace",
  email: "ada@computing.org",
  phone: "+1 (555) 019-2834",
  password: "Secure#Password2026",
  confirmPassword: "Secure#Password2026",
  portfolio: "https://adalovelace.dev",
  agreeTerms: true
};

const formRules = {
  fullName: [
    { rule: "required", message: "Full name is required." },
    { rule: "length", min: 2, max: 50, message: "Name must be 2-50 characters." }
  ],
  email: [
    { rule: "required" },
    { rule: "email", message: "Please enter a valid academic/work email." }
  ],
  phone: [
    { rule: "required" },
    { rule: "phone", options: { minLength: 10 } }
  ],
  password: [
    { rule: "required" },
    { rule: "password", options: { minLength: 8 } }
  ],
  confirmPassword: [
    { rule: "required", message: "Please confirm your password." },
    {
      rule: "custom",
      validator: (val, allData) => val === allData.password,
      message: "Passwords do not match."
    }
  ],
  portfolio: [
    { rule: "url", message: "Portfolio must be a valid web URL." }
  ],
  agreeTerms: [
    { rule: "required", message: "You must accept the terms of service." }
  ]
};

const result = validateForm(formData, formRules);

if (!result.isValid) {
  console.log("Validation Errors:", result.errors);
} else {
  console.log("Form is valid and ready to submit!");
}
```

---

## 🧪 Testing

FormGuard.js uses Node.js's native test runner (`node:test`) and assertion library (`node:assert/strict`) — no heavy testing frameworks like Jest or Mocha are required.

To run the complete test suite:

```bash
npm test
```

To run the comprehensive usage example:

```bash
npm run example
```

---

## 🤝 Contributing

Contributions are warmly welcomed!

1. Fork the repository on GitHub.
2. Clone your fork locally (`git clone https://github.com/your-username/formguard-js.git`).
3. Create a feature branch (`git checkout -b feature/awesome-validator`).
4. Commit your changes (`git commit -m 'Add awesome validator'`).
5. Ensure all tests pass (`npm test`).
6. Push to GitHub (`git push origin feature/awesome-validator`).
7. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
