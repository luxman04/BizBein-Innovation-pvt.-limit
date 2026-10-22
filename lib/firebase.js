// BizBein Innovations Pvt. Ltd. — Firebase Client Configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBE4gmlHa0e38EYoHH12KeomEMkh-DPyjw',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'bizbein-innovations.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'bizbein-innovations',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'bizbein-innovations.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '809144453242',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:809144453242:web:a09c57097d0f64babd53c3',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-7X3FXLWB4M'
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes('your_') &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

// Initialize Firebase App (Reuses single existing instance)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth & Google Provider with browserLocalPersistence
export const auth = typeof window !== 'undefined' ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Cloud Firestore Database Instance (Reuses the existing Firebase App)
export const db = app ? getFirestore(app) : null;

let persistencePromise = null;

export async function ensureAuthPersistence() {
  if (typeof window === 'undefined' || !auth) return null;
  if (!persistencePromise) {
    persistencePromise = setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('[Firebase Auth] Failed to configure browserLocalPersistence:', err);
    });
  }
  await persistencePromise;
  return auth;
}

if (typeof window !== 'undefined' && auth) {
  ensureAuthPersistence().catch(() => {});
}

// Firebase Analytics (only initialized when user grants analytics consent)
export let analytics = null;

export async function initFirebaseAnalytics() {
  if (typeof window === 'undefined' || !app || analytics) return analytics;
  try {
    const { hasConsent } = await import('./cookies');
    if (!hasConsent('analytics')) return null;

    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  } catch (err) {}
  return analytics;
}

if (typeof window !== 'undefined') {
  initFirebaseAnalytics().catch(() => {});
  window.addEventListener('bizbein_consent_updated', (e) => {
    if (e.detail?.analytics) {
      initFirebaseAnalytics().catch(() => {});
    }
  });
}

export default app;
