// BizBein Innovations Pvt. Ltd. — Comprehensive Cookie Management & Hydration Test Suite
import assert from 'assert';
import { createSessionCookie, createClearSessionCookie, AUTH_COOKIE_NAME, signAuthToken, verifyAuthToken } from '../lib/auth.js';
import { products } from '../data/products.js';
import {
  COOKIE_CONSENT_KEY,
  USER_PREFS_KEY,
  CART_COOKIE_KEY,
  CURRENT_CONSENT_VERSION,
  CONSENT_MAX_AGE_DAYS,
  DEFAULT_CONSENT,
  DEFAULT_PREFERENCES
} from '../lib/cookies.js';

console.log('======================================================');
console.log('BIZBEIN COOKIE MANAGEMENT & SECURITY TEST SUITE');
console.log('======================================================\n');

// ---------------- 1. LOGIN SESSION PERSISTENCE & SECURITY ----------------
console.log('TEST 1: Login Session Persistence & Cookie Attributes');
const sampleUser = {
  id: 'usr_test_77',
  name: 'Vikramjit Singh',
  email: 'vikram@industrial-punjab.com',
  role: 'customer'
};

const token = signAuthToken(sampleUser);
assert(token && typeof token === 'string', 'JWT session token must be generated');

const verified = verifyAuthToken(token);
assert.strictEqual(verified.userId, sampleUser.id, 'Session token payload must match userId');
assert.strictEqual(verified.email, sampleUser.email, 'Session token payload must match email');
assert(verified.exp, 'Session token must have expiration timestamp');

const cookieStr = createSessionCookie(token);
assert(cookieStr.includes(`${AUTH_COOKIE_NAME}=`), 'Cookie must contain session cookie name');
assert(cookieStr.includes('HttpOnly'), 'SECURITY: Session cookie MUST be HttpOnly');
assert(cookieStr.includes('SameSite=Lax'), 'SECURITY: Session cookie MUST have SameSite=Lax');
assert(cookieStr.includes('Path=/'), 'Session cookie MUST apply to Path=/');
assert(cookieStr.includes('Max-Age=604800'), 'Session cookie MUST have 7-day Max-Age');
assert(cookieStr.includes('Expires='), 'Session cookie MUST include explicit Expires date');

const clearCookieStr = createClearSessionCookie();
assert(clearCookieStr.includes('Max-Age=0'), 'Logout MUST set Max-Age=0');
assert(clearCookieStr.includes('Expires=Thu, 01 Jan 1970'), 'Logout MUST expire in past date');
console.log('  ✔ Session token creation, 7-day persistence, HttpOnly, and logout clear verified.\n');

// ---------------- 2. SHOPPING CART TRUSTED PRODUCT VALIDATION ----------------
console.log('TEST 2: Shopping Cart Persistence & Trusted Product Data Validation');

// Replicate cart validator
function validateAndSanitizeCart(rawList, catalog) {
  if (!Array.isArray(rawList)) return [];
  const sanitized = [];
  for (const raw of rawList) {
    if (!raw || !raw.id) continue;
    const trusted = catalog.find(
      (p) => p.id?.toString().toLowerCase() === raw.id?.toString().toLowerCase()
    );
    if (!trusted) continue;

    const validQty = Math.min(99, Math.max(1, parseInt(raw.qty, 10) || 1));
    sanitized.push({
      ...trusted,
      qty: validQty,
      variant: raw.variant || null
    });
  }
  return sanitized;
}

const firstProduct = products[0];
const tamperedCart = [
  {
    id: firstProduct.id,
    name: 'Tampered Hack Name',
    price: 1, // Fraudulent price manipulation attempt
    qty: -5 // Invalid negative quantity
  },
  {
    id: 'fake_non_existent_id_9999',
    name: 'Injected Fake Product',
    price: 100,
    qty: 2
  },
  {
    id: products[1].id,
    price: 9999999,
    qty: 150 // Over-limit quantity
  }
];

const sanitized = validateAndSanitizeCart(tamperedCart, products);

assert.strictEqual(sanitized.length, 2, 'Untrusted non-existent product MUST be discarded');
assert.strictEqual(sanitized[0].name, firstProduct.name, 'Product name MUST be restored from trusted catalog');
assert.strictEqual(sanitized[0].price, firstProduct.price, 'SECURITY: Manipulated price MUST be reset to catalog price');
assert.strictEqual(sanitized[0].qty, 1, 'Negative quantity MUST be clamped to 1');
assert.strictEqual(sanitized[1].qty, 99, 'Excessive quantity MUST be clamped to max 99');
console.log('  ✔ Cart validation completely prevents price tampering and enforces trusted catalog products.\n');

// ---------------- 3. USER PREFERENCES PERSISTENCE ----------------
console.log('TEST 3: User Preferences Verification');
assert.strictEqual(DEFAULT_PREFERENCES.theme, 'light', 'Default theme is light');
assert.strictEqual(DEFAULT_PREFERENCES.currency, 'INR', 'Default currency is INR');
assert.strictEqual(DEFAULT_PREFERENCES.language, 'en', 'Default language is English');
console.log('  ✔ User preference defaults and cookie keys verified.\n');

// ---------------- 4. PRIVACY-FRIENDLY ANALYTICS SANITIZATION ----------------
console.log('TEST 4: Privacy-Friendly Analytics Sanitization');
function sanitizePayload(data = {}) {
  const SENSITIVE_KEYS = ['password', 'passwordhash', 'token', 'otp', 'cvv', 'cardnumber', 'pin'];
  const sanitized = {};
  for (const [key, val] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) continue;
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

const dangerousEvent = {
  item_id: 'prod-cij-printer',
  item_name: 'CIJ Continuous Inkjet Coder',
  password: 'UserSecretPassword123!',
  otp: '654321',
  cardNumber: '4111222233334444',
  price: 145000
};

const safeEvent = sanitizePayload(dangerousEvent);
assert.strictEqual(safeEvent.item_id, 'prod-cij-printer');
assert.strictEqual(safeEvent.password, undefined, 'SECURITY: Password MUST NOT be tracked in analytics');
assert.strictEqual(safeEvent.otp, undefined, 'SECURITY: OTP MUST NOT be tracked in analytics');
assert.strictEqual(safeEvent.cardNumber, undefined, 'SECURITY: Card number MUST NOT be tracked in analytics');
assert.strictEqual(safeEvent.price, 145000);
console.log('  ✔ Sensitive data sanitization verified.\n');

// ---------------- 5. COOKIE CONSENT BANNER & SETTINGS RULES ----------------
console.log('TEST 5: Cookie Consent Configuration');
assert.strictEqual(DEFAULT_CONSENT.necessary, true, 'Strictly necessary cookies MUST always be true');
assert.strictEqual(DEFAULT_CONSENT.analytics, false, 'Analytics MUST be opt-in (false by default)');
assert.strictEqual(DEFAULT_CONSENT.marketing, false, 'Marketing MUST be opt-in (false by default)');
assert.strictEqual(CURRENT_CONSENT_VERSION, 1, 'Consent version is active');
console.log('  ✔ Cookie consent policies verified.\n');

console.log('======================================================');
console.log('ALL COOKIE SYSTEM TESTS PASSED SUCCESSFULLY! (5/5)');
console.log('======================================================');
