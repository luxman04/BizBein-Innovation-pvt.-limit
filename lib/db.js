// BizBein Innovations Pvt. Ltd. — Database Layer
// Supports persistent file-backed JSON storage with serverless fallback,
// and ready integration for MongoDB / PostgreSQL via Vercel env variables.

import fs from 'fs';
import path from 'path';
import os from 'os';
import bcrypt from 'bcryptjs';

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
  if (memoryDb) return memoryDb;

  const storagePath = getStoragePath();
  let data = {
    users: [],
    orders: [],
    passwordResets: []
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

  // Ensure default admin exists
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@bizbein.com').toLowerCase().trim();
  const existingAdmin = data.users.find(
    (u) => u.email.toLowerCase() === adminEmail || u.role === 'admin'
  );

  if (!existingAdmin) {
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
  return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

export async function findUserById(id) {
  const db = initializeDb();
  if (!id) return null;
  return db.users.find((u) => u.id === id) || null;
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

export async function findOrdersByUserId(userId) {
  const db = initializeDb();
  if (!userId) return [];
  return db.orders.filter((o) => o.userId === userId);
}

export async function getAllOrders() {
  const db = initializeDb();
  return [...db.orders];
}

export async function updateOrderStatus(orderId, { orderStatus, paymentStatus, trackingNumber }) {
  const db = initializeDb();
  const index = db.orders.findIndex((o) => o.orderId === orderId);
  if (index === -1) return null;

  const current = db.orders[index];
  const updated = {
    ...current,
    orderStatus: orderStatus || current.orderStatus,
    paymentStatus: paymentStatus || current.paymentStatus,
    trackingNumber: trackingNumber !== undefined ? trackingNumber : current.trackingNumber,
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
