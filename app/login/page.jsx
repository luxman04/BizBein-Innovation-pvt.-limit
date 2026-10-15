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
  CheckCircle,
  Eye,
  EyeOff,
  ShoppingBag
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register, showToast } = useStore();

  const redirectUrl = searchParams.get('redirect') || '/';
  const isPendingAdd = searchParams.get('pendingAdd') === '1';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email.');
        if (!phone.trim()) throw new Error('Please enter your contact phone number.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');

        await register(name, email, phone, password);
      }

      // Successful auth -> redirect to destination
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
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
              <span>Sign in or register below to automatically complete adding your selected equipment to your cart.</span>
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
            Existing Customer Sign In
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
            New Account Registration
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate autoComplete="off">
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

          <button type="submit" disabled={loading} className="btn-auth-submit">
            {loading ? (
              <span>Processing Securely...</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In & Continue</span>
                <ArrowRight size={17} />
              </>
            ) : (
              <>
                <span>Create Account & Continue</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="auth-security-footnote">
          <ShieldCheck size={15} className="text-gold" />
          <span>Protected with industry-standard bcrypt encryption and secure session tokens.</span>
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

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .auth-tab {
          background: transparent;
          border: none;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .auth-tab.active {
          background: #ffffff;
          color: #13192B;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
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
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading authentication portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
