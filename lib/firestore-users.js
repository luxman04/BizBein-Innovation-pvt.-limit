// BizBein Innovations Pvt. Ltd. — Cloud Firestore User & Admin Role Service
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase.js';

const SUPERADMIN_EMAILS = [
  (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim(),
  'luxmankumar628@gmail.com',
  'luxmank628@gmail.com'
].filter(Boolean);

/**
 * Normalizes a Firestore user document snapshot into a clean application object.
 */
export function normalizeFirestoreUser(docSnap) {
  const data = docSnap.data();
  if (!data) return null;

  let createdAtIso = new Date().toISOString();
  if (data.createdAt) {
    if (typeof data.createdAt.toDate === 'function') {
      createdAtIso = data.createdAt.toDate().toISOString();
    } else if (data.createdAt instanceof Date) {
      createdAtIso = data.createdAt.toISOString();
    } else if (typeof data.createdAt === 'string') {
      createdAtIso = data.createdAt;
    }
  }

  let updatedAtIso = createdAtIso;
  if (data.updatedAt) {
    if (typeof data.updatedAt.toDate === 'function') {
      updatedAtIso = data.updatedAt.toDate().toISOString();
    } else if (data.updatedAt instanceof Date) {
      updatedAtIso = data.updatedAt.toISOString();
    } else if (typeof data.updatedAt === 'string') {
      updatedAtIso = data.updatedAt;
    }
  }

  const cleanEmail = (data.email || '').toLowerCase().trim();
  const isSuper = SUPERADMIN_EMAILS.includes(cleanEmail) || data.role === 'superadmin' || data.id === 'usr_superadmin_root';
  const resolvedRole = isSuper ? 'superadmin' : (data.role || 'customer');

  return {
    id: data.id || docSnap.id,
    firebaseUid: data.firebaseUid || docSnap.id,
    name: data.name || cleanEmail.split('@')[0] || 'User',
    email: cleanEmail,
    phone: data.phone || '',
    role: resolvedRole,
    status: data.status || 'active',
    passwordHash: data.passwordHash || '',
    createdAt: createdAtIso,
    updatedAt: updatedAtIso,
    _source: 'firestore'
  };
}

function withTimeout(promise, ms = 4000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore operation timed out')), ms))
  ]);
}

/**
 * Retrieves a user document by userId (or Firebase UID) from Cloud Firestore.
 */
export async function getUserFromFirestore(userId) {
  if (!db || !userId) return null;

  try {
    const docRef = doc(db, 'users', String(userId));
    const docSnap = await withTimeout(getDoc(docRef), 4000);
    if (!docSnap.exists()) return null;
    return normalizeFirestoreUser(docSnap);
  } catch (err) {
    console.warn('[Firestore Users] Failed to get user by ID:', err.message);
    return null;
  }
}

/**
 * Retrieves a user document by email from Cloud Firestore.
 */
export async function getUserByEmailFromFirestore(email) {
  if (!db || !email) return null;
  const cleanEmail = email.toLowerCase().trim();

  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('email', '==', cleanEmail));
    const snapshot = await withTimeout(getDocs(q), 4000);

    if (snapshot.empty) {
      // Also try fetching by root superadmin ID if searching superadmin email
      if (SUPERADMIN_EMAILS.includes(cleanEmail)) {
        const rootDoc = await getUserFromFirestore('usr_superadmin_root');
        if (rootDoc) return rootDoc;
      }
      return null;
    }

    const firstDoc = snapshot.docs[0];
    return normalizeFirestoreUser(firstDoc);
  } catch (err) {
    console.warn('[Firestore Users] Failed to query user by email:', err.message);
    return null;
  }
}

/**
 * Persists or updates a user document in Cloud Firestore `users` collection.
 */
export async function saveUserToFirestore(userData) {
  if (!db) {
    throw new Error('Cloud Firestore is not initialized.');
  }

  const cleanEmail = (userData.email || '').toLowerCase().trim();
  const docId = String(userData.id || userData.firebaseUid || (userData.email ? cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_') : `usr_${Date.now()}`));

  const isSuper = SUPERADMIN_EMAILS.includes(cleanEmail) || userData.role === 'superadmin' || docId === 'usr_superadmin_root';
  const role = isSuper ? 'superadmin' : (userData.role || 'customer');

  const payload = {
    id: docId,
    firebaseUid: userData.firebaseUid || docId,
    name: String(userData.name || cleanEmail.split('@')[0] || 'User').trim(),
    email: cleanEmail,
    phone: String(userData.phone || '').trim(),
    role,
    status: userData.status || 'active',
    updatedAt: serverTimestamp()
  };

  if (userData.passwordHash) {
    payload.passwordHash = userData.passwordHash;
  }

  if (!userData.createdAt) {
    payload.createdAt = serverTimestamp();
  }

  const docRef = doc(db, 'users', docId);
  await withTimeout(setDoc(docRef, payload, { merge: true }), 4000);

  return {
    ...payload,
    createdAt: userData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _source: 'firestore'
  };
}

/**
 * Updates a target user's role in Cloud Firestore `users` collection.
 * Enforces security: SuperAdmin privileges cannot be modified.
 */
export async function updateUserRoleInFirestore(targetUserId, newRole) {
  if (!db || !targetUserId) {
    throw new Error('Target userId is required.');
  }

  if (newRole !== 'admin' && newRole !== 'customer') {
    throw new Error('Invalid role specified. Only "admin" and "customer" are valid.');
  }

  const docRef = doc(db, 'users', String(targetUserId));
  const docSnap = await withTimeout(getDoc(docRef), 4000);

  if (!docSnap.exists()) {
    throw new Error(`User document "${targetUserId}" not found in Firestore.`);
  }

  const current = docSnap.data();
  const cleanEmail = (current.email || '').toLowerCase().trim();

  if (SUPERADMIN_EMAILS.includes(cleanEmail) || current.role === 'superadmin' || targetUserId === 'usr_superadmin_root') {
    throw new Error('Master Super Administrator privileges cannot be modified.');
  }

  await withTimeout(updateDoc(docRef, {
    role: newRole,
    updatedAt: serverTimestamp()
  }), 4000);

  return {
    ...current,
    id: targetUserId,
    role: newRole,
    updatedAt: new Date().toISOString(),
    _source: 'firestore'
  };
}

/**
 * Retrieves all users from Cloud Firestore for the SuperAdmin Access Control portal.
 * Filters out SuperAdmin user data so credentials and root accounts remain concealed.
 */
export async function getAllUsersForAdminFromFirestore() {
  if (!db) return [];

  try {
    const usersCol = collection(db, 'users');
    const snapshot = await withTimeout(getDocs(usersCol), 4000);
    const users = [];

    snapshot.forEach((docSnap) => {
      const parsed = normalizeFirestoreUser(docSnap);
      if (parsed) {
        if (parsed.role === 'superadmin' || SUPERADMIN_EMAILS.includes(parsed.email)) {
          return;
        }
        const { passwordHash, ...safeUser } = parsed;
        users.push(safeUser);
      }
    });

    users.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return users;
  } catch (err) {
    console.warn('[Firestore Users] Failed to retrieve all users:', err.message);
    return [];
  }
}
