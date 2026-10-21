'use client';

import React, { Suspense } from 'react';
import LoginContent from './LoginContent';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: 'calc(100vh - 140px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 16px',
            color: '#64748b',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}
        >
          Loading authentication portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
