// BizBein Innovations Pvt. Ltd. — Cloud Firestore Order Persistence Service
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';

/**
 * Persists a validated commercial order to Cloud Firestore `orders` collection.
 * Conforms to secure Firestore rules by binding the document to `user.uid`.
 *
 * @param {Object} order - Verified server-side order object
 * @param {Object} firebaseUser - Authenticated Firebase User (auth.currentUser)
 * @returns {Promise<Object>} Result of Firestore write
 */
export async function saveOrderToFirestore(order, firebaseUser = null) {
  if (!db) {
    console.warn('[Firestore] Database instance is not initialized.');
    return { success: false, reason: 'firestore_uninitialized' };
  }

  // 1. Resolve authenticated Firebase UID
  const activeUser = firebaseUser || (auth ? auth.currentUser : null);
  const uid = activeUser?.uid || order.userId;

  if (!uid) {
    console.warn('[Firestore] Cannot save order: missing authenticated Firebase UID.');
    return { success: false, reason: 'missing_uid' };
  }

  if (!order || !order.orderId) {
    throw new Error('[Firestore] Invalid order payload: missing orderId.');
  }

  // 2. Extract structured product arrays required by schema
  const items = Array.isArray(order.items) ? order.items : [];
  const productIds = items.map((item) => String(item.id || item.productId || ''));
  const productNames = items.map((item) => String(item.name || 'Industrial Equipment'));
  const imageUrls = items.map((item) => String(item.image || ''));
  const quantities = items.map((item) => Number(item.qty || item.quantity || 1));
  const prices = items.map((item) => Number(item.price || 0));

  const totalAmount = Number(order.total || order.totalAmount || 0);
  const subtotal = Number(order.subtotal || 0);
  const gst = Number(order.gst || 0);

  // 3. Assemble document payload
  const orderDocData = {
    orderId: String(order.orderId),
    uid: String(uid),
    userId: String(uid),
    customerName: String(order.customerName || activeUser?.displayName || 'Client'),
    customerEmail: String(order.customerEmail || activeUser?.email || '').toLowerCase().trim(),
    customerPhone: String(order.customerPhone || activeUser?.phoneNumber || ''),
    companyName: String(order.companyName || ''),
    gstin: String(order.gstin || ''),
    productIds,
    productNames,
    imageUrls,
    quantities,
    prices,
    items: items.map((item) => ({
      id: item.id || '',
      name: item.name || '',
      brand: item.brand || 'BizBein',
      category: item.category || 'Industrial Machinery',
      image: item.image || '',
      unit: item.unit || 'Per Unit',
      price: Number(item.price || 0),
      qty: Number(item.qty || 1),
      subtotal: Number(item.subtotal || (Number(item.price || 0) * Number(item.qty || 1)))
    })),
    subtotal,
    gst,
    freight: Number(order.freight || 0),
    totalAmount,
    total: totalAmount,
    orderStatus: String(order.orderStatus || 'Confirmed'),
    paymentMethod: String(order.paymentMethod || 'Direct Bank Transfer (NEFT/RTGS)'),
    paymentStatus: String(order.paymentStatus || 'Pending Verification'),
    orderNotes: String(order.orderNotes || ''),
    shippingAddress: order.shippingAddress ? {
      fullName: String(order.shippingAddress.fullName || order.customerName || ''),
      phone: String(order.shippingAddress.phone || order.customerPhone || ''),
      address: String(order.shippingAddress.address || ''),
      city: String(order.shippingAddress.city || ''),
      state: String(order.shippingAddress.state || ''),
      pincode: String(order.shippingAddress.pincode || ''),
      companyName: String(order.shippingAddress.companyName || order.companyName || ''),
      gstin: String(order.shippingAddress.gstin || order.gstin || '')
    } : {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = doc(db, 'orders', order.orderId);
    // Note: Security rules enforce `allow update: if false`.
    // If the order already exists, do not attempt to overwrite/update as it will trigger permission-denied.
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      return { success: true, orderId: order.orderId, alreadyExisted: true };
    }
    await setDoc(docRef, orderDocData);
    return { success: true, orderId: order.orderId };
  } catch (error) {
    console.error('[Firestore] Failed to save order document:', error);
    throw error;
  }
}

/**
 * Normalizes a raw Firestore order snapshot into an application-ready object.
 */
function normalizeFirestoreOrder(docSnap) {
  const data = docSnap.data();
  if (!data) return null;

  // Format timestamps into ISO string dates for UI compatibility
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

  return {
    ...data,
    id: docSnap.id,
    orderId: data.orderId || docSnap.id,
    total: data.totalAmount || data.total || 0,
    createdAt: createdAtIso,
    updatedAt: updatedAtIso,
    _source: 'firestore'
  };
}

/**
 * Retrieves all orders belonging to a specific Firebase UID.
 * Securely constrained to `where('uid', '==', uid)`.
 *
 * @param {string} uid - Authenticated Firebase user UID
 * @returns {Promise<Array>} List of user orders
 */
export async function getUserOrdersFromFirestore(uid) {
  if (!db || !uid) return [];

  try {
    const ordersCol = collection(db, 'orders');
    const q = query(
      ordersCol,
      where('uid', '==', String(uid))
    );

    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach((d) => {
      const parsed = normalizeFirestoreOrder(d);
      if (parsed) results.push(parsed);
    });

    // Sort descending by creation date
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return results;
  } catch (err) {
    console.error('[Firestore] Error fetching user orders:', err);
    return [];
  }
}

/**
 * Sets up a real-time listener for the user's orders collection.
 *
 * @param {string} uid - Authenticated Firebase user UID
 * @param {Function} onOrdersChanged - Callback when orders are added or updated
 * @returns {Function} Unsubscribe handler
 */
export function subscribeToUserOrders(uid, onOrdersChanged) {
  if (!db || !uid || typeof onOrdersChanged !== 'function') {
    return () => {};
  }

  try {
    const ordersCol = collection(db, 'orders');
    const q = query(
      ordersCol,
      where('uid', '==', String(uid))
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const results = [];
        snapshot.forEach((d) => {
          const parsed = normalizeFirestoreOrder(d);
          if (parsed) results.push(parsed);
        });
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onOrdersChanged(results);
      },
      (error) => {
        console.warn('[Firestore] Realtime subscription notice:', error.message);
      }
    );
  } catch (e) {
    console.error('[Firestore] Failed to establish listener:', e);
    return () => {};
  }
}

/**
 * Retrieves a single order by orderId from Firestore.
 */
export async function getOrderFromFirestore(orderId) {
  if (!db || !orderId) return null;

  try {
    const docRef = doc(db, 'orders', String(orderId));
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return normalizeFirestoreOrder(docSnap);
  } catch (err) {
    console.warn('[Firestore] Error retrieving single order:', err.message);
    return null;
  }
}
