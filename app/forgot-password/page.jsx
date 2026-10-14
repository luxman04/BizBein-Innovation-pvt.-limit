'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request.');
      setSuccessData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page-container">
      <div className="forgot-card">
        <div className="forgot-header">
          <div className="icon-badge">
            <KeyRound size={24} className="text-gold" />
          </div>
          <h1>Password Recovery</h1>
          <p>Enter the email address registered with your BizBein account to receive recovery instructions.</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successData ? (
          <div className="success-view">
            <CheckCircle size={36} className="text-green" />
            <h3>Recovery Instructions Generated</h3>
            <p>If an account exists for <strong>{email}</strong>, password reset instructions have been generated.</p>

            {successData.resetToken && (
              <div className="token-test-box">
                <span className="token-label">Direct Reset Access Link (Testing / Demo):</span>
                <Link
                  href={`/reset-password?token=${successData.resetToken}`}
                  className="btn-direct-reset"
                >
                  Click Here to Set New Password
                </Link>
              </div>
            )}

            <Link href="/login" className="back-link">
              <ArrowLeft size={15} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label htmlFor="recovery-email">Account Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="recovery-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? <span>Generating Link...</span> : <span>Send Recovery Instructions</span>}
              <ArrowRight size={16} />
            </button>

            <div className="form-footer">
              <Link href="/login" className="back-link">
                <ArrowLeft size={15} />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .forgot-page-container {
          min-height: calc(100vh - 140px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          background: #f8fafc;
        }

        .forgot-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          padding: 32px;
        }

        .forgot-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .icon-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #fef7ea;
          margin-bottom: 12px;
        }

        .text-gold {
          color: #d97706;
        }

        .text-green {
          color: #16a34a;
        }

        .forgot-header h1 {
          font-size: 20px;
          font-weight: 800;
          color: #13192B;
          margin: 0 0 6px;
        }

        .forgot-header p {
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

        .forgot-form {
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
          padding: 11px 14px 11px 36px;
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

        .btn-submit {
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
          transition: background-color 0.15s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background: #e5a407;
        }

        .form-footer {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
        }

        .back-link:hover {
          color: #13192B;
        }

        .success-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }

        .success-view h3 {
          margin: 0;
          color: #13192B;
          font-size: 17px;
        }

        .success-view p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        .token-test-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          width: 100%;
          margin: 8px 0;
        }

        .token-label {
          display: block;
          font-size: 11.5px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .btn-direct-reset {
          display: block;
          background: #13192B;
          color: #ffffff;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }

        .btn-direct-reset:hover {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
}
