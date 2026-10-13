'use client';

import React from 'react';
import { ShieldCheck, Truck, Wrench, Award } from 'lucide-react';

export default function TrustFeatures() {
  const features = [
    {
      icon: <Award size={28} className="text-gold" />,
      title: 'ISO Quality Standards',
      desc: 'All packaging and conveyor machinery undergoes rigorous 48-hour continuous QA testing prior to factory dispatch.'
    },
    {
      icon: <Truck size={28} className="text-gold" />,
      title: 'Pan-India Dispatch',
      desc: 'Stock machinery, CIJ inks, and make-up fluids dispatched within 24 to 48 hours across industrial hubs.'
    },
    {
      icon: <Wrench size={28} className="text-gold" />,
      title: 'Engineer Commissioning',
      desc: 'On-site installation, line integration, and operational training provided by BizBein factory engineers.'
    },
    {
      icon: <ShieldCheck size={28} className="text-gold" />,
      title: '12-Month Comprehensive Warranty',
      desc: 'Full OEM coverage on motors, electronic controllers, and high-precision printheads.'
    }
  ];

  return (
    <section className="trust-section" aria-label="Why Choose BizBein Innovations">
      <div className="container">
        <div className="trust-grid">
          {features.map((f, idx) => (
            <div key={idx} className="trust-card">
              <div className="icon-wrapper">{f.icon}</div>
              <div className="trust-content">
                <h3 className="trust-title">{f.title}</h3>
                <p className="trust-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .trust-section {
          background-color: #ffffff;
          padding: 40px 0;
          border-top: 1px solid var(--color-border-subtle);
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .trust-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          border-radius: var(--radius-lg);
          background-color: var(--color-surface-alt);
          border: 1px solid var(--color-border-subtle);
          transition: border-color 0.15s ease, transform 0.15s ease;
        }

        .trust-card:hover {
          border-color: var(--bizbein-navy-700);
          transform: translateY(-2px);
        }

        .icon-wrapper {
          background: #ffffff;
          padding: 12px;
          border-radius: var(--radius-md);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .text-gold {
          color: var(--bizbein-gold-600);
        }

        .trust-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .trust-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--bizbein-navy-900);
        }

        .trust-desc {
          font-size: 12px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
