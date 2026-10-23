// BizBein Innovations Pvt. Ltd. — Cloud Firestore Product Catalog Service
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase.js';

/**
 * Normalizes a raw Firestore product document into a clean application object.
 */
export function normalizeFirestoreProduct(docSnap) {
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

  const numPrice = parseFloat(data.price) || 0;
  const mainImage = data.image || (Array.isArray(data.images) && data.images[0]) || '/prod-modular-belt.jpg';
  const additional = Array.isArray(data.additionalImages)
    ? data.additionalImages
    : (Array.isArray(data.images) ? data.images.slice(1, 5) : []);
  const allImages = [mainImage, ...additional].slice(0, 5);

  return {
    ...data,
    id: data.id || docSnap.id,
    name: data.name || 'Industrial Equipment',
    brand: data.brand || 'BizBein',
    category: data.category || 'Industrial Machinery',
    categoryId: data.categoryId || 'conveyor-systems',
    badge: data.badge || '',
    badgeType: data.badgeType || (data.badge ? 'popular' : ''),
    price: numPrice,
    priceDisplay: data.priceDisplay || `₹${numPrice.toLocaleString('en-IN')} onwards`,
    image: mainImage,
    additionalImages: additional,
    images: allImages,
    unit: data.unit || 'Per Unit',
    rating: data.rating !== undefined ? (parseFloat(data.rating) || 4.9) : 4.9,
    reviews: data.reviews !== undefined ? (parseInt(data.reviews, 10) || 1) : 1,
    description: data.description || '',
    specs: Array.isArray(data.specs) ? data.specs : [],
    createdAt: createdAtIso,
    updatedAt: updatedAtIso,
    _source: 'firestore'
  };
}

/**
 * Retrieves all catalog products from Cloud Firestore.
 */
function withTimeout(promise, ms = 4000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore operation timed out')), ms))
  ]);
}

/**
 * Retrieves all catalog products from Cloud Firestore.
 */
export async function getProductsFromFirestore() {
  if (!db) return [];

  try {
    const productsCol = collection(db, 'products');
    const snapshot = await withTimeout(getDocs(productsCol), 4000);
    const results = [];

    snapshot.forEach((docSnap) => {
      const parsed = normalizeFirestoreProduct(docSnap);
      if (parsed) results.push(parsed);
    });

    results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return results;
  } catch (err) {
    console.warn('[Firestore Products] Failed to fetch products:', err.message);
    return [];
  }
}

/**
 * Retrieves a single product by ID from Cloud Firestore.
 */
export async function findProductInFirestore(id) {
  if (!db || !id) return null;

  try {
    const docRef = doc(db, 'products', String(id));
    const docSnap = await withTimeout(getDoc(docRef), 4000);
    if (!docSnap.exists()) return null;
    return normalizeFirestoreProduct(docSnap);
  } catch (err) {
    console.warn('[Firestore Products] Error finding product:', err.message);
    return null;
  }
}

/**
 * Persists a product document to Cloud Firestore `products` collection.
 */
export async function saveProductToFirestore(product) {
  if (!db) {
    throw new Error('Cloud Firestore is not initialized.');
  }

  if (!product || !product.id) {
    throw new Error('Product must have a valid "id".');
  }

  const numPrice = parseFloat(product.price) || 0;
  const mainImage = product.image || (Array.isArray(product.images) && product.images[0]) || '/prod-modular-belt.jpg';
  const additional = Array.isArray(product.additionalImages)
    ? product.additionalImages.filter(Boolean).map(String).slice(0, 4)
    : (Array.isArray(product.images) ? product.images.slice(1, 5).filter(Boolean).map(String) : []);
  const allImages = [mainImage, ...additional].slice(0, 5);

  const payload = {
    id: String(product.id),
    name: String(product.name || '').trim(),
    brand: String(product.brand || 'BizBein').trim(),
    category: String(product.category || 'Industrial Machinery').trim(),
    categoryId: String(product.categoryId || 'conveyor-systems').trim(),
    badge: String(product.badge || ''),
    badgeType: String(product.badgeType || (product.badge ? 'popular' : '')),
    price: numPrice,
    priceDisplay: String(product.priceDisplay || `₹${numPrice.toLocaleString('en-IN')} onwards`).trim(),
    image: mainImage,
    additionalImages: additional,
    images: allImages,
    unit: String(product.unit || 'Per Unit').trim(),
    rating: product.rating !== undefined ? (parseFloat(product.rating) || 4.9) : 4.9,
    reviews: product.reviews !== undefined ? (parseInt(product.reviews, 10) || 1) : 1,
    description: String(product.description || '').trim(),
    specs: Array.isArray(product.specs) ? product.specs : [],
    updatedAt: serverTimestamp()
  };

  // Only assign createdAt timestamp on first creation
  if (!product.createdAt) {
    payload.createdAt = serverTimestamp();
  }

  const docRef = doc(db, 'products', String(product.id));
  await withTimeout(setDoc(docRef, payload, { merge: true }), 4000);

  return {
    ...payload,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _source: 'firestore'
  };
}

/**
 * Removes a product document from Cloud Firestore `products` collection.
 */
export async function deleteProductFromFirestore(id) {
  if (!db || !id) return false;

  const docRef = doc(db, 'products', String(id));
  await withTimeout(deleteDoc(docRef), 4000);
  return true;
}

/**
 * Sets up a real-time listener for the products collection.
 */
export function subscribeToProducts(onProductsChanged) {
  if (!db || typeof onProductsChanged !== 'function') {
    return () => {};
  }

  try {
    const productsCol = collection(db, 'products');
    return onSnapshot(
      productsCol,
      (snapshot) => {
        const results = [];
        snapshot.forEach((d) => {
          const parsed = normalizeFirestoreProduct(d);
          if (parsed) results.push(parsed);
        });
        results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        onProductsChanged(results);
      },
      (error) => {
        console.warn('[Firestore Products] Realtime subscription notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('[Firestore Products] Failed to establish listener:', err.message);
    return () => {};
  }
}

/**
 * Seeds catalog products into Cloud Firestore if the collection is empty.
 */
export async function seedProductsToFirestore(seedList) {
  if (!db || !Array.isArray(seedList) || seedList.length === 0) return 0;

  try {
    const existing = await getProductsFromFirestore();
    if (existing.length > 0) return existing.length;

    let seededCount = 0;
    for (const prod of seedList) {
      try {
        await saveProductToFirestore(prod);
        seededCount++;
      } catch (e) {
        console.warn('[Firestore Products] Seed skipped for:', prod.id, e.message);
      }
    }
    return seededCount;
  } catch (err) {
    console.warn('[Firestore Products] Seed check error:', err.message);
    return 0;
  }
}
