'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing reset token. Please use the link provided in your recovery email.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password.');

      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page-container">
      <div className="reset-card">
        <div className="reset-header">
          <h1>Set New Password</h1>
          <p>Please enter and confirm your new secure password for your BizBein account.</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="success-view">
            <CheckCircle size={40} className="text-green" />
            <h3>Password Reset Successfully</h3>
            <p>Your account password has been updated. You can now sign in with your new credentials.</p>
            <Link href="/login" className="btn-signin-now">
              <span>Go to Sign In</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reset-form">
            <div className="form-group">
              <label htmlFor="new-pwd">New Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="new-pwd"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-pwd">Confirm New Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="confirm-pwd"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? <span>Updating Password...</span> : <span>Save New Password</span>}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .reset-page-container {
          min-height: calc(100vh - 140px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          background: #f8fafc;
        }

        .reset-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          padding: 32px;
        }

        .reset-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .reset-header h1 {
          font-size: 20px;
          font-weight: 800;
          color: #13192B;
          margin: 0 0 6px;
        }

        .reset-header p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }

        .error-alert {
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

        .reset-form {
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
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
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

        .btn-submit,
        .btn-signin-now {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          background: #F8B50E;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        .btn-submit:hover:not(:disabled),
        .btn-signin-now:hover {
          background: #e5a407;
        }

        .success-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }

        .text-green {
          color: #16a34a;
        }

        .success-view h3 {
          margin: 0;
          color: #13192B;
          font-size: 18px;
        }

        .success-view p {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
