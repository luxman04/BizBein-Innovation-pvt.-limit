'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag
} from 'lucide-react';

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authLoading, login, register, loginWithGoogle } = useStore();

  const redirectParam = searchParams.get('redirect');
  const redirectUrl = redirectParam || '/';
  const isPendingAdd = searchParams.get('pendingAdd') === '1';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, authLoading, redirectUrl, router]);

  if (authLoading) {
    return (
      <div className="auth-loading-portal">
        <div className="spinner"></div>
        <p>Restoring authenticated session...</p>
        <style jsx>{`
          .auth-loading-portal {
            min-height: 50vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            color: #64748b;
            font-size: 14px;
          }
          .spinner {
            width: 36px;
            height: 36px;
            border: 3.5px solid #e2e8f0;
            border-top-color: #f8b50e;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Google Sign-In with Firebase
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push(redirectUrl);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User voluntarily closed the popup - no critical error
        setError('Google sign-in was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('The sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        setError(
          'Google sign-in is not authorized for this domain yet. Please add this domain to Firebase Console > Authentication > Settings > Authorized domains, or sign in below with your email & password.'
        );
      } else {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Submit Credentials (Direct login or Direct registration without OTP)
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        await login(email, password);
        router.push(redirectUrl);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name / username.');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address.');
        if (!phone.trim()) throw new Error('Please enter your contact phone number.');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');

        await register(name, email, phone, password);
        router.push(redirectUrl);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Top Notice for Add to Cart Redirection */}
        {isPendingAdd && (
          <div className="pending-add-banner">
            <ShoppingBag size={18} className="text-gold" />
            <div className="pending-text">
              <strong>Pending Item in Queue</strong>
              <span>Complete authentication below to automatically add your selected equipment to your cart.</span>
            </div>
          </div>
        )}

        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <img
              src="/bizbein-innovations-logo.png"
              alt="BizBein Innovations"
              className="auth-logo-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="auth-title">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create Industrial Client Account'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Access factory pricing, live order tracking, and equipment cart.'
              : 'Direct procurement portal for packaging, conveying & coding machinery.'}
          </p>
        </div>

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="btn-google-auth"
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        {/* Auth Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">OR CONTINUE WITH EMAIL</span>
          <span className="auth-divider-line" />
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setError('');
            }}
          >
            Email Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setError('');
            }}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="auth-form" noValidate autoComplete="off">
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="reg-name">Full Name / Business Representative *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Corporate / Personal Email *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="reg-phone">Phone / WhatsApp Number *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="+91 98765-43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="auth-password">Password *</label>
                {mode === 'login' && (
                  <Link href="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="auth-confirm-password">Confirm Password *</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-auth-submit">
              {loading ? (
                <span>{mode === 'login' ? 'Signing In...' : 'Registering Account...'}</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
        </form>

        {/* Security Footnote */}
        <div className="auth-security-footnote">
          <ShieldCheck size={15} className="text-gold" />
          <span>Protected with industry-grade bcrypt encryption and secure HTTP-only sessions.</span>
        </div>
      </div>

      <style jsx>{`
        .auth-page-container {
          min-height: calc(100vh - 140px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          background: #f8fafc;
        }

        .auth-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0;
          padding: 32px;
        }

        .pending-add-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #fef7ea;
          border: 1px solid #fed7aa;
          border-left: 4px solid #F8B50E;
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 24px;
        }

        .text-gold {
          color: #d97706;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pending-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12.5px;
          color: #78350f;
          line-height: 1.4;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-logo-badge {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .auth-logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .auth-title {
          font-size: 20px;
          font-weight: 800;
          color: #13192B;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }

        .auth-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        .btn-google-auth {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          color: #1e293b;
          font-size: 13.5px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }

        .btn-google-auth:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #94a3b8;
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .btn-google-auth:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .google-icon {
          flex-shrink: 0;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .auth-divider-text {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .auth-tab {
          background: transparent;
          border: none;
          padding: 9px 6px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
          text-align: center;
          white-space: nowrap;
        }

        .auth-tab.active {
          background: #ffffff;
          color: #13192B;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
        }

        .field-hint {
          display: block;
          font-size: 11.5px;
          color: #64748b;
          margin-top: 6px;
        }

        .otp-sent-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          margin-bottom: 18px;
        }

        .change-phone-link {
          background: none;
          border: none;
          color: #b45309;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .resend-row {
          text-align: center;
          margin-top: 14px;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #64748b;
          font-size: 12.5px;
          cursor: pointer;
          text-decoration: underline;
        }

        .resend-btn:hover {
          color: #13192B;
        }

        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 18px;
          line-height: 1.4;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
        }

        .password-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-password-link {
          font-size: 12px;
          color: #d97706;
          text-decoration: none;
          font-weight: 600;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .input-with-icon input {
          width: 100%;
          padding: 11px 40px 11px 36px;
          font-size: 13.5px;
          font-family: inherit;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          background: #ffffff;
          color: #0f172a;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .input-with-icon input:focus {
          border-color: #F8B50E;
          box-shadow: 0 0 0 3px rgba(248, 181, 14, 0.2);
        }

        .toggle-password-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .toggle-password-btn:hover {
          color: #334155;
        }

        .btn-auth-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px 20px;
          background: #F8B50E;
          color: #0f172a;
          font-size: 14.5px;
          font-weight: 700;
          font-family: inherit;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
          margin-top: 6px;
        }

        .btn-auth-submit:hover:not(:disabled) {
          background: #e5a407;
          transform: translateY(-1px);
        }

        .btn-auth-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .auth-security-footnote {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11px;
          color: #64748b;
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        @media (max-width: 480px) {
          .auth-page-container {
            padding: 24px 12px;
          }
          .auth-card {
            padding: 20px 14px;
          }
          .auth-tabs {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

