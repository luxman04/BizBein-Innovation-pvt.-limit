// BizBein Innovations Pvt. Ltd. — Database Layer
// Supports persistent file-backed JSON storage with serverless fallback,
// and ready integration for MongoDB / PostgreSQL via Vercel env variables.

import fs from 'fs';
import path from 'path';
import os from 'os';
import bcrypt from 'bcryptjs';
import { products as seedProducts, categories as catalogCategories } from '../data/products.js';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');
const FALLBACK_FILE = path.join(os.tmpdir(), 'bizbein_database.json');

// Memory cache for active process
let memoryDb = null;

function getStoragePath() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Test write
    fs.writeFileSync(path.join(DATA_DIR, '.test'), 'ok');
    fs.unlinkSync(path.join(DATA_DIR, '.test'));
    return DATA_FILE;
  } catch (err) {
    return FALLBACK_FILE;
  }
}

function initializeDb() {
  const storagePath = getStoragePath();
  let data = {
    users: [],
    orders: [],
    passwordResets: [],
    otpChallenges: [],
    rateLimits: [],
    products: []
  };

  try {
    if (fs.existsSync(storagePath)) {
      const content = fs.readFileSync(storagePath, 'utf8');
      if (content.trim()) {
        data = JSON.parse(content);
      }
    }
  } catch (err) {
    console.warn('[DB] Could not read existing DB file, initializing fresh:', err.message);
  }

  if (!data.otpChallenges) data.otpChallenges = [];
  if (!data.rateLimits) data.rateLimits = [];

  // 1. Ensure Super Administrator exists (configured with fallback defaults)
  const superAdminEmails = [
    (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim(),
    'luxmankumar628@gmail.com',
    'luxmank628@gmail.com'
  ].filter(Boolean);
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD || '2.0@superadmin@';

  if (superAdminEmails.length > 0 && superAdminPassword) {
    if (!data.users) data.users = [];
    const salt = bcrypt.genSaltSync(10);
    const superPasswordHash = bcrypt.hashSync(superAdminPassword, salt);

    // Remove any non-root duplicate user that had any of these emails
    data.users = data.users.filter(
      (u) => !(u.id !== 'usr_superadmin_root' && u.email && superAdminEmails.includes(u.email.toLowerCase()))
    );

    const existingSuperAdminIndex = data.users.findIndex(
      (u) => u.id === 'usr_superadmin_root' || u.role === 'superadmin' || (u.email && superAdminEmails.includes(u.email.toLowerCase()))
    );

    if (existingSuperAdminIndex === -1) {
      data.users.unshift({
        id: 'usr_superadmin_root',
        name: 'Luxman Kumar',
        email: 'luxmankumar628@gmail.com',
        phone: '+91 99158-56540',
        passwordHash: superPasswordHash,
        role: 'superadmin',
        status: 'active',
        createdAt: new Date().toISOString()
      });
      saveDb(data);
    } else {
      const superUser = data.users[existingSuperAdminIndex];
      let needsSave = false;
      if (superUser.role !== 'superadmin') {
        superUser.role = 'superadmin';
        needsSave = true;
      }
      if (superUser.status !== 'active') {
        superUser.status = 'active';
        needsSave = true;
      }
      if (!bcrypt.compareSync(superAdminPassword, superUser.passwordHash)) {
        superUser.passwordHash = superPasswordHash;
        needsSave = true;
      }
      if (needsSave) {
        saveDb(data);
      }
    }
  }

  // 2. Ensure default operations admin exists
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@bizbein.com').toLowerCase().trim();
  const existingAdmin = (data.users || []).find(
    (u) => u.email.toLowerCase() === adminEmail || u.role === 'admin'
  );

  if (!existingAdmin) {
    if (!data.users) data.users = [];
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@12345';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(adminPassword, salt);
    data.users.push({
      id: 'usr_admin_001',
      name: 'BizBein Operations Admin',
      email: adminEmail,
      phone: '+91 99158-56540',
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    saveDb(data);
  }

  // Ensure default catalog products exist
  if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
    data.products = JSON.parse(JSON.stringify(seedProducts));
    saveDb(data);
  }

  memoryDb = data;
  return memoryDb;
}

function saveDb(data) {
  memoryDb = data;
  try {
    const storagePath = getStoragePath();
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Failed to persist database:', err.message);
  }
}

// ----------------- USER REPOSITORY -----------------

export async function findUserByEmail(email) {
  const db = initializeDb();
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();
  const superAdminEmails = [
    (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim(),
    'luxmankumar628@gmail.com',
    'luxmank628@gmail.com'
  ].filter(Boolean);

  const found = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (found) return found;

  // Synthesize or return root superadmin user if querying any superadmin alias
  if (superAdminEmails.includes(cleanEmail)) {
    const rootUser = db.users.find((u) => u.id === 'usr_superadmin_root' || u.role === 'superadmin');
    if (rootUser) {
      return { ...rootUser, email: cleanEmail };
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(process.env.SUPERADMIN_PASSWORD || '2.0@superadmin@', salt);
    return {
      id: 'usr_superadmin_root',
      name: 'Luxman Kumar',
      email: cleanEmail,
      phone: '+91 99158-56540',
      passwordHash,
      role: 'superadmin',
      status: 'active'
    };
  }

  return null;
}

export async function findUserById(id) {
  const db = initializeDb();
  if (!id) return null;
  return db.users.find((u) => u.id === id) || null;
}

export async function findUserByPhone(phone) {
  const db = initializeDb();
  if (!phone) return null;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone) return null;
  return db.users.find((u) => u.phone && u.phone.replace(/[^0-9]/g, '') === cleanPhone) || null;
}

export async function createUser({ name, email, phone, passwordHash, role = 'customer' }) {
  const db = initializeDb();
  const cleanEmail = email.toLowerCase().trim();

  // Prevent duplicate accounts
  if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: cleanEmail,
    phone: (phone || '').trim(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export async function updateUser(id, updates) {
  const db = initializeDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  db.users[index] = {
    ...db.users[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  return db.users[index];
}

export async function getAllUsersForAdmin(requesterRole) {
  const db = initializeDb();
  const superAdminEmails = [
    (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim(),
    'luxmankumar628@gmail.com',
    'luxmank628@gmail.com'
  ].filter(Boolean);

  // Never expose or show superadmin user details on the admin panel
  return (db.users || [])
    .filter((u) => {
      if (u.role === 'superadmin') return false;
      if (u.email && superAdminEmails.includes(u.email.toLowerCase())) return false;
      return true;
    })
    .map(({ passwordHash, ...safeUser }) => safeUser);
}

export async function setUserRole(targetUserId, newRole, requesterUser) {
  if (!requesterUser || requesterUser.role !== 'superadmin') {
    throw new Error('Forbidden. Only Super Administrator can grant or revoke admin access.');
  }

  if (newRole !== 'admin' && newRole !== 'customer') {
    throw new Error('Invalid role specified. Only "admin" and "customer" are valid.');
  }

  const db = initializeDb();
  const superAdminEmail = (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim();
  const index = db.users.findIndex((u) => u.id === targetUserId);

  if (index === -1) {
    throw new Error('User not found.');
  }

  const target = db.users[index];
  if (target.role === 'superadmin' || (superAdminEmail && target.email.toLowerCase() === superAdminEmail)) {
    throw new Error('Root Super Administrator privileges cannot be modified.');
  }

  target.role = newRole;
  target.updatedAt = new Date().toISOString();
  saveDb(db);

  const { passwordHash, ...safeUser } = target;
  return safeUser;
}

export async function createAdminAccount({ name, email, phone, password }, requesterUser) {
  if (!requesterUser || requesterUser.role !== 'superadmin') {
    throw new Error('Forbidden. Only Super Administrator can create new administrators.');
  }

  if (!email || !password || !name) {
    throw new Error('Name, email, and password are required.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const db = initializeDb();
  const cleanEmail = email.toLowerCase().trim();

  if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newAdmin = {
    id: `usr_adm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: cleanEmail,
    phone: (phone || '').trim(),
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(newAdmin);
  saveDb(db);

  const { passwordHash: _, ...safeAdmin } = newAdmin;
  return safeAdmin;
}

// ----------------- ORDER REPOSITORY -----------------

export async function createOrder(orderData) {
  const db = initializeDb();
  const newOrder = {
    ...orderData,
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveDb(db);
  return newOrder;
}

export async function findOrderById(orderId) {
  const db = initializeDb();
  if (!orderId) return null;
  return db.orders.find((o) => o.orderId === orderId) || null;
}

export async function findOrdersByUserId(userId, userEmail = null) {
  const db = initializeDb();
  if (!userId && !userEmail) return [];
  const cleanEmail = userEmail ? userEmail.toLowerCase().trim() : null;
  return db.orders.filter((o) =>
    (userId && o.userId === userId) ||
    (cleanEmail && o.customerEmail && o.customerEmail.toLowerCase().trim() === cleanEmail)
  );
}

export async function getAllOrders() {
  const db = initializeDb();
  return [...db.orders];
}

export async function updateOrderStatus(orderId, updates = {}) {
  const db = initializeDb();
  const index = db.orders.findIndex((o) => o.orderId === orderId);
  if (index === -1) return null;

  const current = db.orders[index];
  const updated = {
    ...current,
    ...updates,
    orderStatus: updates.orderStatus || current.orderStatus,
    paymentStatus: updates.paymentStatus || current.paymentStatus,
    trackingNumber: updates.trackingNumber !== undefined ? updates.trackingNumber : current.trackingNumber,
    updatedAt: new Date().toISOString()
  };

  db.orders[index] = updated;
  saveDb(db);
  return updated;
}

// ----------------- PASSWORD RECOVERY -----------------

export async function savePasswordResetToken(email, token, expiresAt) {
  const db = initializeDb();
  const cleanEmail = email.toLowerCase().trim();

  // Remove any existing tokens for this email
  db.passwordResets = db.passwordResets.filter((pr) => pr.email !== cleanEmail);

  db.passwordResets.push({
    email: cleanEmail,
    token,
    expiresAt,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
}

export async function findPasswordResetToken(token) {
  const db = initializeDb();
  if (!token) return null;
  const record = db.passwordResets.find((pr) => pr.token === token);
  if (!record) return null;

  // Check expiration
  if (new Date(record.expiresAt) < new Date()) {
    return null;
  }
  return record;
}

export async function deletePasswordResetToken(token) {
  const db = initializeDb();
  db.passwordResets = db.passwordResets.filter((pr) => pr.token !== token);
  saveDb(db);
}

// ----------------- OTP CHALLENGE REPOSITORY -----------------

export async function saveOtpChallenge(challenge) {
  const db = initializeDb();
  if (!db.otpChallenges) db.otpChallenges = [];

  const cleanEmail = (challenge.email || '').toLowerCase().trim();

  // Invalidate any existing unverified OTP challenges for this email
  db.otpChallenges = db.otpChallenges.map((ch) => {
    if (ch.email.toLowerCase() === cleanEmail && !ch.verified) {
      return { ...ch, invalidated: true };
    }
    return ch;
  });

  db.otpChallenges.push(challenge);
  saveDb(db);
  return challenge;
}

export async function findOtpChallenge(challengeId, email) {
  const db = initializeDb();
  if (!challengeId || !email) return null;
  const cleanEmail = email.toLowerCase().trim();

  return (
    (db.otpChallenges || []).find(
      (ch) => ch.challengeId === challengeId && ch.email.toLowerCase() === cleanEmail
    ) || null
  );
}

export async function recordOtpAttempt(challengeId) {
  const db = initializeDb();
  const index = (db.otpChallenges || []).findIndex((ch) => ch.challengeId === challengeId);
  if (index === -1) return null;

  const current = db.otpChallenges[index];
  const newAttempts = (current.attempts || 0) + 1;
  const invalidated = newAttempts >= (current.maxAttempts || 5);

  db.otpChallenges[index] = {
    ...current,
    attempts: newAttempts,
    invalidated: current.invalidated || invalidated
  };

  saveDb(db);
  return db.otpChallenges[index];
}

export async function consumeOtpChallenge(challengeId) {
  const db = initializeDb();
  const index = (db.otpChallenges || []).findIndex((ch) => ch.challengeId === challengeId);
  if (index === -1) return null;

  const consumed = {
    ...db.otpChallenges[index],
    verified: true,
    invalidated: true,
    verifiedAt: new Date().toISOString()
  };

  db.otpChallenges[index] = consumed;
  saveDb(db);
  return consumed;
}

export async function invalidateOtpChallenge(challengeId) {
  const db = initializeDb();
  const index = (db.otpChallenges || []).findIndex((ch) => ch.challengeId === challengeId);
  if (index === -1) return false;

  db.otpChallenges[index].invalidated = true;
  saveDb(db);
  return true;
}

export async function getOtpCooldownSeconds(email) {
  const db = initializeDb();
  if (!email) return 0;
  const cleanEmail = email.toLowerCase().trim();

  const challenges = (db.otpChallenges || [])
    .filter((ch) => ch.email.toLowerCase() === cleanEmail && !ch.invalidated)
    .sort((a, b) => (b.lastSentAt || 0) - (a.lastSentAt || 0));

  if (challenges.length === 0) return 0;

  const latest = challenges[0];
  const elapsed = Date.now() - (latest.lastSentAt || 0);
  const cooldownMs = 60 * 1000;

  if (elapsed < cooldownMs) {
    return Math.ceil((cooldownMs - elapsed) / 1000);
  }
  return 0;
}

// ----------------- RATE LIMITING -----------------

export async function checkRateLimit({ key, limit = 5, windowMs = 15 * 60 * 1000 }) {
  const db = initializeDb();
  if (!db.rateLimits) db.rateLimits = [];

  const now = Date.now();
  let record = db.rateLimits.find((r) => r.key === key);

  if (!record) {
    record = { key, timestamps: [] };
    db.rateLimits.push(record);
  }

  // Filter out timestamps older than window
  record.timestamps = (record.timestamps || []).filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  record.timestamps.push(now);
  saveDb(db);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: limit - record.timestamps.length
  };
}

// ----------------- PRODUCT REPOSITORY -----------------

export async function getAllDbProducts() {
  const db = initializeDb();
  return db.products || [];
}

export async function findDbProductById(id) {
  const db = initializeDb();
  if (!id) return null;
  const cleanId = id.toString().toLowerCase().trim();
  return (db.products || []).find((p) => p.id.toLowerCase() === cleanId) || null;
}

export async function createDbProduct(productData) {
  const db = initializeDb();
  if (!db.products) db.products = [];

  const rawName = (productData.name || 'Untitled Equipment').trim();
  const slug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = productData.id || `prod-${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

  const numPrice = parseFloat(productData.price) || 0;
  const priceDisplay = productData.priceDisplay && productData.priceDisplay.trim()
    ? productData.priceDisplay.trim()
    : `₹${numPrice.toLocaleString('en-IN')} onwards`;

  const cat = catalogCategories.find((c) => c.id === productData.categoryId);
  const categoryName = cat ? cat.name : (productData.category || 'Industrial Equipment');
  const assignedImage = productData.image && productData.image.trim()
    ? productData.image.trim()
    : ((cat && cat.image) ? cat.image : '/prod-modular-belt.jpg');

  const additionalImages = Array.isArray(productData.additionalImages)
    ? productData.additionalImages.filter(Boolean).map((u) => String(u).trim()).slice(0, 4)
    : (Array.isArray(productData.images) ? productData.images.slice(1, 5).filter(Boolean).map((u) => String(u).trim()) : []);

  const allImages = [assignedImage, ...additionalImages].slice(0, 5);

  const newProduct = {
    id,
    name: rawName,
    brand: productData.brand ? productData.brand.trim() : 'BizBein',
    category: categoryName,
    categoryId: productData.categoryId || 'conveyor-systems',
    badge: productData.badge || '',
    badgeType: productData.badgeType || (productData.badge ? 'popular' : ''),
    price: numPrice,
    priceDisplay,
    image: assignedImage,
    additionalImages,
    images: allImages,
    unit: productData.unit ? productData.unit.trim() : 'Per Unit',
    rating: productData.rating !== undefined ? (parseFloat(productData.rating) || 4.9) : 4.9,
    reviews: productData.reviews !== undefined ? (parseInt(productData.reviews, 10) || 1) : 1,
    description: productData.description ? productData.description.trim() : `${rawName} engineered and built by BizBein Innovations.`,
    specs: Array.isArray(productData.specs) ? productData.specs : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  saveDb(db);
  return newProduct;
}

export async function updateDbProduct(id, updates) {
  const db = initializeDb();
  if (!db.products) db.products = [];

  const cleanId = id.toString().toLowerCase().trim();
  const index = db.products.findIndex((p) => p.id.toLowerCase() === cleanId);
  if (index === -1) {
    throw new Error(`Product with ID "${id}" was not found.`);
  }

  const current = db.products[index];
  const numPrice = updates.price !== undefined ? parseFloat(updates.price) : current.price;
  const priceDisplay = updates.priceDisplay && updates.priceDisplay.trim()
    ? updates.priceDisplay.trim()
    : (updates.price !== undefined ? `₹${numPrice.toLocaleString('en-IN')} onwards` : current.priceDisplay);

  let categoryName = current.category;
  if (updates.categoryId && updates.categoryId !== current.categoryId) {
    const cat = catalogCategories.find((c) => c.id === updates.categoryId);
    if (cat) categoryName = cat.name;
  }

  const nextMainImage = updates.image !== undefined && String(updates.image).trim()
    ? String(updates.image).trim()
    : current.image;

  let nextAdditional = Array.isArray(current.additionalImages) ? current.additionalImages : [];
  if (updates.additionalImages !== undefined) {
    nextAdditional = Array.isArray(updates.additionalImages)
      ? updates.additionalImages.filter(Boolean).map((u) => String(u).trim()).slice(0, 4)
      : [];
  } else if (updates.images !== undefined && Array.isArray(updates.images)) {
    nextAdditional = updates.images.slice(1, 5).filter(Boolean).map((u) => String(u).trim());
  }

  const nextAllImages = [nextMainImage, ...nextAdditional].slice(0, 5);

  const updated = {
    ...current,
    ...updates,
    name: updates.name !== undefined ? updates.name.trim() : current.name,
    brand: updates.brand !== undefined ? updates.brand.trim() : current.brand,
    unit: updates.unit !== undefined ? updates.unit.trim() : current.unit,
    badge: updates.badge !== undefined ? updates.badge : current.badge,
    badgeType: updates.badgeType !== undefined ? updates.badgeType : (updates.badge ? 'popular' : ''),
    rating: updates.rating !== undefined ? (parseFloat(updates.rating) || current.rating) : current.rating,
    reviews: updates.reviews !== undefined ? (parseInt(updates.reviews, 10) || current.reviews) : current.reviews,
    description: updates.description !== undefined ? updates.description.trim() : current.description,
    image: nextMainImage,
    additionalImages: nextAdditional,
    images: nextAllImages,
    price: numPrice,
    priceDisplay,
    category: categoryName,
    specs: Array.isArray(updates.specs) ? updates.specs : current.specs,
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updated;
  saveDb(db);
  return updated;
}

export async function deleteDbProduct(id) {
  const db = initializeDb();
  if (!db.products) return true;

  const cleanId = id.toString().toLowerCase().trim();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id.toLowerCase() !== cleanId);

  if (db.products.length === initialLength) {
    throw new Error(`Product with ID "${id}" was not found.`);
  }

  saveDb(db);
  return true;
}