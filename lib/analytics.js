// BizBein Innovations Pvt. Ltd. — Privacy-Friendly Analytics Service
// Strictly enforces consent before collecting any interaction data.
// NEVER tracks passwords, OTPs, tokens, payment credentials, or personal identities.

import { hasConsent } from './cookies';

// In-memory session tracking queue
let isInitialized = false;
let sessionAnalyticsId = null;

function getSessionAnalyticsId() {
  if (typeof window === 'undefined') return null;
  if (!sessionAnalyticsId) {
    try {
      sessionAnalyticsId = sessionStorage.getItem('bizbein_anon_aid');
      if (!sessionAnalyticsId) {
        sessionAnalyticsId = 'aid_' + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem('bizbein_anon_aid', sessionAnalyticsId);
      }
    } catch (e) {
      sessionAnalyticsId = 'aid_ephemeral';
    }
  }
  return sessionAnalyticsId;
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  // React to consent changes dynamically
  if (!isInitialized) {
    window.addEventListener('bizbein_consent_updated', (e) => {
      const consent = e.detail;
      if (!consent?.analytics) {
        // User withdrew consent: purge session analytics ID
        try {
          sessionStorage.removeItem('bizbein_anon_aid');
          sessionAnalyticsId = null;
        } catch (err) {}
      }
    });
    isInitialized = true;
  }
}

// Sanitize any payload to prevent accidental leakage of sensitive keys
function sanitizePayload(data = {}) {
  const SENSITIVE_KEYS = [
    'password',
    'passwordhash',
    'token',
    'otp',
    'cvv',
    'cardnumber',
    'accountnumber',
    'creditcard',
    'pin'
  ];

  const sanitized = {};
  for (const [key, val] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
      continue; // Skip sensitive key entirely
    }
    // Only accept primitives or safe strings
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  // STRICT CONSENT GATE
  if (!hasConsent('analytics')) {
    return;
  }

  const safeParams = sanitizePayload({
    ...params,
    anon_session: getSessionAnalyticsId(),
    ts: Date.now()
  });

  // Forward to Firebase Analytics if configured and consent granted
  try {
    import('./firebase').then(({ analytics }) => {
      if (analytics) {
        import('firebase/analytics').then(({ logEvent }) => {
          logEvent(analytics, eventName, safeParams);
        }).catch(() => {});
      }
    }).catch(() => {});
  } catch (err) {}

  // Lightweight in-browser dispatch for developer diagnostics
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[Analytics Tracked] ${eventName}`, safeParams);
  }
}

export function trackPageView(pagePath, title = '') {
  if (!hasConsent('analytics')) return;
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: title || (typeof document !== 'undefined' ? document.title : '')
  });
}

export function trackProductView(product) {
  if (!hasConsent('analytics') || !product) return;
  trackEvent('view_item', {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price
  });
}

export function trackAddToCart(product, qty = 1) {
  if (!hasConsent('analytics') || !product) return;
  trackEvent('add_to_cart', {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    quantity: qty
  });
}

export function trackQuoteRequest(product) {
  if (!hasConsent('analytics') || !product) return;
  trackEvent('generate_lead', {
    lead_type: 'machinery_quote',
    item_id: product.id,
    item_name: product.name
  });
}

export function trackSearch(query) {
  if (!hasConsent('analytics') || !query) return;
  trackEvent('search', {
    search_term: query.substring(0, 100)
  });
}
