// BizBein OTP Authentication Test Suite
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const DB_PATH = path.join(process.cwd(), '.data', 'database.json');

function readDb() {
  if (fs.existsSync(DB_PATH)) {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }
  return null;
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('\n============================================================');
  console.log('BIZBEIN EMAIL OTP AUTHENTICATION TEST SUITE');
  console.log('============================================================\n');

  // -------------------------------------------------------------------------
  // TEST 1: Account Enumeration Protection on Login
  // -------------------------------------------------------------------------
  console.log('--- TEST 1: Account Enumeration & Credential Validation ---');
  {
    // Unknown email
    const resUnknown = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent_user_999@bizbein.com', password: 'Password123' })
    });
    const dataUnknown = await resUnknown.json();
    assert(resUnknown.status === 401, 'Unknown email returns 401');
    assert(dataUnknown.error === 'Invalid email or password.', 'Unknown email returns generic error');

    // Known email (admin@bizbein.com) with wrong password
    const resBadPass = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bizbein.com', password: 'WrongPassword999' })
    });
    const dataBadPass = await resBadPass.json();
    assert(resBadPass.status === 401, 'Incorrect password returns 401');
    assert(dataBadPass.error === 'Invalid email or password.', 'Incorrect password returns identical error (no enumeration)');
  }

  // -------------------------------------------------------------------------
  // TEST 2: Existing User Login Requires OTP (No Session Cookie Granted)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 2: Existing User Login Triggers OTP (No Direct Session) ---');
  let loginChallengeId = null;
  let adminEmail = 'admin@bizbein.com';
  {
    const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: 'Admin@12345' })
    });

    const cookies = resLogin.headers.get('set-cookie') || '';
    const data = await resLogin.json();

    assert(resLogin.status === 200, 'Login credentials accepted (status 200)');
    assert(data.otpRequired === true, 'Response specifies otpRequired: true');
    assert(!!data.challengeId, 'Response includes challengeId');
    assert(data.cooldownSeconds === 60, 'Response includes 60s cooldown');
    assert(!cookies.includes('bizbein_session_token'), 'SECURITY: NO session cookie issued before OTP verification!');

    loginChallengeId = data.challengeId;

    // Verify challenge in DB is securely hashed
    const db = readDb();
    const challengeInDb = db.otpChallenges.find((c) => c.challengeId === loginChallengeId);
    assert(!!challengeInDb, 'Challenge recorded in database');
    assert(!!challengeInDb.otpHash && challengeInDb.otpHash.length === 64, 'OTP is stored as SHA-256 hash (64 hex chars)');
    assert(!challengeInDb.plainOtp, 'Plain OTP is NOT stored in DB');
    assert(challengeInDb.attempts === 0, 'Initial attempts count is 0');
    assert(challengeInDb.maxAttempts === 5, 'Max attempts limit is 5');
  }

  // -------------------------------------------------------------------------
  // TEST 3: Resend Cooldown (Enforce 60 Seconds)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 3: Resend OTP 60-Second Cooldown ---');
  {
    const resResendTooFast = await fetch(`${BASE_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: loginChallengeId, email: adminEmail })
    });
    const dataResend = await resResendTooFast.json();
    assert(resResendTooFast.status === 429, 'Immediate resend is rejected with 429 Too Many Requests');
    assert(dataResend.error.includes('Please wait'), 'Rejection message instructs user to wait for cooldown');
    assert(dataResend.cooldownRemaining > 0, 'Remaining cooldown seconds returned');
  }

  // -------------------------------------------------------------------------
  // TEST 4: Invalid OTP Attempt Limits (Lockout After 5 Failures)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 4: Incorrect OTP Attempts Limit (Max 5 & Invalidation) ---');
  {
    // Try 4 incorrect codes
    for (let i = 1; i <= 4; i++) {
      const resBadCode = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: loginChallengeId, email: adminEmail, otp: '000000' })
      });
      const dataBadCode = await resBadCode.json();
      assert(resBadCode.status === 400, `Attempt ${i}: Rejected with 400`);
      assert(dataBadCode.attemptsRemaining === 5 - i, `Attempt ${i}: ${5 - i} attempts remaining returned`);
    }

    // 5th incorrect attempt -> should invalidate the challenge
    const res5th = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: loginChallengeId, email: adminEmail, otp: '000000' })
    });
    const data5th = await res5th.json();
    assert(res5th.status === 400, 'Attempt 5: Rejected with 400');
    assert(data5th.attemptsRemaining === 0, 'Attempt 5: 0 attempts remaining');
    assert(data5th.error.includes('Maximum attempts exceeded'), 'Attempt 5: Invalidation message returned');

    // 6th attempt -> challenge must be completely rejected as invalidated
    const res6th = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: loginChallengeId, email: adminEmail, otp: '123456' })
    });
    const data6th = await res6th.json();
    assert(res6th.status === 400, 'Attempt 6: Inactive challenge rejected');
  }

  // -------------------------------------------------------------------------
  // TEST 5: Resend Invalidation & Fresh Challenge
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 5: Resend Invalidation of Previous OTP ---');
  let freshChallengeId = null;
  {
    // Simulate cooldown passed by updating lastSentAt in DB
    const db = readDb();
    const oldIndex = db.otpChallenges.findIndex((c) => c.challengeId === loginChallengeId);
    if (oldIndex !== -1) {
      db.otpChallenges[oldIndex].lastSentAt = Date.now() - 65 * 1000;
      writeDb(db);
    }

    const resResend = await fetch(`${BASE_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: loginChallengeId, email: adminEmail })
    });
    const dataResend = await resResend.json();
    assert(resResend.status === 200, 'Resend succeeded after cooldown');
    assert(!!dataResend.challengeId, 'New challenge ID generated');
    assert(dataResend.challengeId !== loginChallengeId, 'New challenge ID is unique from old one');

    freshChallengeId = dataResend.challengeId;

    // Check DB: old challenge must be invalidated
    const updatedDb = readDb();
    const oldCh = updatedDb.otpChallenges.find((c) => c.challengeId === loginChallengeId);
    assert(oldCh.invalidated === true, 'Previous OTP challenge marked invalidated');
  }

  // -------------------------------------------------------------------------
  // TEST 6: Expired OTP Rejection (> 5 Minutes)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 6: Expired OTP Rejection (> 5 Minutes) ---');
  {
    // Temporarily set expiresAt to past
    const db = readDb();
    const chIndex = db.otpChallenges.findIndex((c) => c.challengeId === freshChallengeId);
    db.otpChallenges[chIndex].expiresAt = Date.now() - 1000;
    writeDb(db);

    const resExpired = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: freshChallengeId, email: adminEmail, otp: '123456' })
    });
    const dataExpired = await resExpired.json();
    assert(resExpired.status === 400, 'Expired OTP rejected with 400');
    assert(dataExpired.error.includes('expired'), 'Error message confirms expiration');
  }

  // -------------------------------------------------------------------------
  // TEST 7: Registration Flow with OTP Verification & Account Creation
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 7: Customer Signup Flow with Email OTP ---');
  const testCustomerEmail = `customer_${Date.now()}@industrial-client.in`;
  let registerChallengeId = null;
  let customerSessionCookie = null;
  let customerUser = null;

  {
    // Step A: Register request
    const resReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Harpreet Singh',
        email: testCustomerEmail,
        phone: '+91 98888-12345',
        password: 'SecurePassword123'
      })
    });
    const regData = await resReg.json();
    const regCookies = resReg.headers.get('set-cookie') || '';

    assert(resReg.status === 200, 'Registration accepted (status 200)');
    assert(regData.otpRequired === true, 'Registration returns otpRequired: true');
    assert(!regCookies.includes('bizbein_session_token'), 'SECURITY: No session cookie granted before registration OTP verification');
    assert(!!regData.challengeId, 'Received registration challengeId');

    registerChallengeId = regData.challengeId;

    // Verify user is not in users list yet until verified
    const db = readDb();
    const userInDbBefore = db.users.find((u) => u.email === testCustomerEmail);
    assert(!userInDbBefore, 'User is not written to permanent user list before OTP verification');

    // For testing verification, retrieve the salt and hash from DB and compute known OTP match
    // Or set a known OTP hash in challenge for testing:
    import('crypto').then(async ({ default: crypto }) => {});
    const crypto = await import('crypto');
    const testOtp = '849201';
    const challengeIdx = db.otpChallenges.findIndex((c) => c.challengeId === registerChallengeId);
    const testSalt = db.otpChallenges[challengeIdx].salt;
    db.otpChallenges[challengeIdx].otpHash = crypto
      .createHash('sha256')
      .update(`${testSalt}:${testOtp}`)
      .digest('hex');
    db.otpChallenges[challengeIdx].expiresAt = Date.now() + 5 * 60 * 1000;
    writeDb(db);

    // Step B: Submit correct OTP
    const resVerify = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: registerChallengeId, email: testCustomerEmail, otp: testOtp })
    });
    const verifyData = await resVerify.json();
    const setCookieHeader = resVerify.headers.get('set-cookie') || '';

    assert(resVerify.status === 200, 'OTP verified successfully (status 200)');
    assert(verifyData.success === true, 'Verification success: true');
    assert(verifyData.user.name === 'Harpreet Singh', 'User account created with correct name');
    assert(verifyData.user.email === testCustomerEmail, 'User account created with correct email');
    assert(setCookieHeader.includes('bizbein_session_token'), 'Session cookie bizbein_session_token issued after verification');

    // Extract session cookie for subsequent protected requests
    customerSessionCookie = setCookieHeader.split(';')[0];
    customerUser = verifyData.user;

    // Check user now in DB
    const dbAfter = readDb();
    const userInDbAfter = dbAfter.users.find((u) => u.email === testCustomerEmail);
    assert(!!userInDbAfter, 'User permanently stored in database after verification');
    assert(userInDbAfter.role === 'customer', 'User role assigned as customer');

    // Step C: Try to replay the same OTP verification
    const resReplay = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: registerChallengeId, email: testCustomerEmail, otp: testOtp })
    });
    assert(resReplay.status === 400, 'Replay of consumed OTP challenge is rejected (atomic single-use)');
  }

  // -------------------------------------------------------------------------
  // TEST 8: Existing User Login Flow with Correct OTP Verification
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 8: Full Existing Customer Login & Verification Flow ---');
  let loggedInCookie = null;
  {
    // Step A: Login
    const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testCustomerEmail, password: 'SecurePassword123' })
    });
    const loginData = await resLogin.json();
    assert(resLogin.status === 200 && loginData.otpRequired === true, 'Existing customer login initiated OTP challenge');

    // Set known OTP in DB for test
    const crypto = await import('crypto');
    const testLoginOtp = '615243';
    const db = readDb();
    const chIdx = db.otpChallenges.findIndex((c) => c.challengeId === loginData.challengeId);
    const salt = db.otpChallenges[chIdx].salt;
    db.otpChallenges[chIdx].otpHash = crypto
      .createHash('sha256')
      .update(`${salt}:${testLoginOtp}`)
      .digest('hex');
    writeDb(db);

    // Step B: Verify
    const resVerify = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: loginData.challengeId, email: testCustomerEmail, otp: testLoginOtp })
    });
    const verifyData = await resVerify.json();
    const cookies = resVerify.headers.get('set-cookie') || '';

    assert(resVerify.status === 200, 'Existing customer OTP verified');
    assert(cookies.includes('bizbein_session_token'), 'Session cookie issued');
    loggedInCookie = cookies.split(';')[0];
  }

  // -------------------------------------------------------------------------
  // TEST 9: Protected Route & API Enforcement
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 9: Protected Route & API Enforcement ---');
  {
    // A. Unauthenticated API request to /api/orders
    const resOrdersNoAuth = await fetch(`${BASE_URL}/api/orders`);
    assert(resOrdersNoAuth.status === 401, 'Unauthenticated request to /api/orders returns 401 Unauthorized');

    // B. Authenticated API request with customer cookie
    const resOrdersAuth = await fetch(`${BASE_URL}/api/orders`, {
      headers: { Cookie: loggedInCookie }
    });
    assert(resOrdersAuth.status === 200, 'Authenticated request to /api/orders returns 200 OK');

    // C. Server Middleware route protection: /checkout without cookie
    const resCheckoutNoAuth = await fetch(`${BASE_URL}/checkout`, {
      redirect: 'manual'
    });
    assert(
      resCheckoutNoAuth.status === 307 || resCheckoutNoAuth.status === 302,
      `Unauthenticated visit to /checkout is redirected by middleware (status ${resCheckoutNoAuth.status})`
    );
    const location = resCheckoutNoAuth.headers.get('location') || '';
    assert(location.includes('/login'), 'Redirect points to /login');

    // D. Server Middleware route protection: /admin/orders with customer cookie (role !== admin)
    const resAdminAsCustomer = await fetch(`${BASE_URL}/admin/orders`, {
      headers: { Cookie: loggedInCookie },
      redirect: 'manual'
    });
    assert(
      resAdminAsCustomer.status === 307 || resAdminAsCustomer.status === 302,
      'Customer accessing /admin/orders is blocked by server middleware'
    );

    // E. Verify /api/auth/me returns authenticated user
    const resMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: loggedInCookie }
    });
    const meData = await resMe.json();
    assert(meData.authenticated === true, '/api/auth/me reports authenticated: true');
    assert(meData.user.email === testCustomerEmail, '/api/auth/me returns correct user profile');
  }

  // -------------------------------------------------------------------------
  // TEST 10: Logout & Session Invalidation
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 10: Logout & Session Invalidation ---');
  {
    const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: loggedInCookie }
    });
    const logoutCookies = resLogout.headers.get('set-cookie') || '';
    assert(resLogout.status === 200, 'Logout succeeds with 200');
    assert(
      logoutCookies.includes('bizbein_session_token=;') || logoutCookies.includes('Max-Age=0'),
      'Logout response clears session cookie with Max-Age=0'
    );

    // Call /api/orders with cleared cookie
    const resAfterLogout = await fetch(`${BASE_URL}/api/orders`, {
      headers: { Cookie: 'bizbein_session_token=;' }
    });
    assert(resAfterLogout.status === 401, 'Subsequent request with cleared session is rejected (401)');
  }

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test error:', err);
  process.exit(1);
});
