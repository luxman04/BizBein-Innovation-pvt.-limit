// BizBein Innovations Pvt. Ltd. — Client & Browser Cookie Management Service
// Strictly enforces privacy regulations, cookie categories, and secure attributes.

export const COOKIE_CONSENT_KEY = 'bizbein_cookie_consent';
export const USER_PREFS_KEY = 'bizbein_user_prefs';
export const CART_COOKIE_KEY = 'bizbein_cart';
export const AUTH_COOKIE_NAME = 'bizbein_session_token';

export const CURRENT_CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180; // 6 months

export const DEFAULT_CONSENT = {
  version: CURRENT_CONSENT_VERSION,
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: null,
  consentGiven: false
};

export const DEFAULT_PREFERENCES = {
  theme: 'light',
  language: 'en',
  currency: 'INR',
  reducedMotion: false
};

// Safe document.cookie reader
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Safe document.cookie writer
export function setCookie(name, value, options = {}) {
  if (typeof document === 'undefined') return;

  const {
    days = 180,
    path = '/',
    sameSite = 'Lax',
    secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  } = options;

  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;

  if (days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    cookieStr += `; Max-Age=${days * 24 * 60 * 60}; Expires=${expires.toUTCString()}`;
  }

  if (secure) {
    cookieStr += '; Secure';
  }

  document.cookie = cookieStr;
}

// Safe document.cookie deleter
export function deleteCookie(name, path = '/') {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

// ----------------- CONSENT MANAGEMENT -----------------
export function getStoredConsent() {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;

  try {
    // 1. Try Cookie first
    const cookieVal = getCookie(COOKIE_CONSENT_KEY);
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal);
      if (parsed && typeof parsed === 'object') {
        // Validate expiration (180 days)
        if (parsed.timestamp && Date.now() - parsed.timestamp > CONSENT_MAX_AGE_DAYS * 86400000) {
          return DEFAULT_CONSENT;
        }
        // Validate version
        if (parsed.version === CURRENT_CONSENT_VERSION) {
          return {
            ...DEFAULT_CONSENT,
            ...parsed,
            necessary: true, // Always locked
            consentGiven: true
          };
        }
      }
    }

    // 2. Fallback to localStorage
    const localVal = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (localVal) {
      const parsed = JSON.parse(localVal);
      if (parsed && parsed.version === CURRENT_CONSENT_VERSION) {
        if (parsed.timestamp && Date.now() - parsed.timestamp <= CONSENT_MAX_AGE_DAYS * 86400000) {
          return {
            ...DEFAULT_CONSENT,
            ...parsed,
            necessary: true,
            consentGiven: true
          };
        }
      }
    }
  } catch (e) {
    console.warn('[CookieService] Failed to read stored consent:', e);
  }

  return DEFAULT_CONSENT;
}

export function saveStoredConsent(consent) {
  if (typeof window === 'undefined') return;

  const payload = {
    version: CURRENT_CONSENT_VERSION,
    necessary: true, // Strictly necessary is immutable
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
    timestamp: Date.now(),
    consentGiven: true
  };

  const serialized = JSON.stringify(payload);

  // Write to both cookie and localStorage for reliability
  setCookie(COOKIE_CONSENT_KEY, serialized, { days: CONSENT_MAX_AGE_DAYS });
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
  } catch (e) {}

  // Dispatch custom event so listeners (analytics, marketing) react immediately
  window.dispatchEvent(new CustomEvent('bizbein_consent_updated', { detail: payload }));

  return payload;
}

export function hasConsent(category) {
  if (category === 'necessary') return true;
  const current = getStoredConsent();
  return Boolean(current.consentGiven && current[category]);
}

// ----------------- USER PREFERENCES -----------------
export function getStoredPreferences() {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  try {
    const cookieVal = getCookie(USER_PREFS_KEY);
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    }

    const localVal = localStorage.getItem(USER_PREFS_KEY);
    if (localVal) {
      const parsed = JSON.parse(localVal);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    }
  } catch (e) {}

  return DEFAULT_PREFERENCES;
}

export function saveStoredPreferences(prefs) {
  if (typeof window === 'undefined') return;

  const updated = {
    ...DEFAULT_PREFERENCES,
    ...getStoredPreferences(),
    ...prefs
  };

  const serialized = JSON.stringify(updated);
  setCookie(USER_PREFS_KEY, serialized, { days: 365 });
  try {
    localStorage.setItem(USER_PREFS_KEY, serialized);
  } catch (e) {}

  window.dispatchEvent(new CustomEvent('bizbein_preferences_updated', { detail: updated }));
  return updated;
}
