'use client';

import React from 'react';
import { ArrowRight, Wrench, Zap, ShieldCheck } from 'lucide-react';

export default function PromoBanner({ onOpenQuote }) {
  return (
    <section className="promo-section" aria-label="Industrial Partner Banner">
      <div className="promo-container">
        <div className="promo-banner-card">
          {/* Background Industrial Image on Right */}
          <div className="banner-bg-visual"></div>
          
          {/* Diagonal Yellow Accent Stripe */}
          <div className="banner-diagonal-accent"></div>

          {/* Left Dark Industrial Box */}
          <div className="banner-left-content">
            <h3 className="banner-title">
              YOUR TRUSTED PARTNER IN INDUSTRIAL AUTOMATION & MATERIAL HANDLING
            </h3>
            
            <p className="banner-desc">
              From conveyor belts to complete material handling systems, we deliver solutions that keep your business moving.
            </p>

            <button
              type="button"
              className="banner-cta-btn"
              onClick={onOpenQuote}
            >
              <span>Get a Custom Quote</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Center Features */}
          <div className="banner-features-column">
            <div className="feature-item">
              <div className="feature-icon-ring">
                <Wrench size={18} />
              </div>
              <span className="feature-text">Custom Design</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon-ring">
                <Zap size={18} />
              </div>
              <span className="feature-text">High Efficiency</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon-ring">
                <ShieldCheck size={18} />
              </div>
              <span className="feature-text">Durable Build</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .promo-section {
          padding: 12px 0 28px;
          background-color: #f8fafc;
        }

        .promo-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .promo-banner-card {
          position: relative;
          background-color: #0b1526;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 36px;
          box-shadow: 0 10px 25px rgba(11, 21, 38, 0.12);
          border: 1px solid rgba(248, 181, 14, 0.25);
        }

        .banner-bg-visual {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 50%;
          background-image: url('/hero-conveyor-line.jpg');
          background-size: cover;
          background-position: center;
          opacity: 0.85;
          z-index: 1;
        }

        .banner-diagonal-accent {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 48%;
          width: 44px;
          background: #F8B50E;
          transform: skewX(-22deg);
          z-index: 3;
          box-shadow: 0 0 25px rgba(248, 181, 14, 0.5);
        }

        .banner-left-content {
          position: relative;
          z-index: 5;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: #ffffff;
        }

        .banner-title {
          font-size: 17px;
          font-weight: 800;
          color: #F8B50E;
          line-height: 1.3;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .banner-desc {
          font-size: 13.5px;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .banner-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #F8B50E;
          color: #0b1526;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          width: fit-content;
          margin-top: 4px;
          transition: all 0.2s ease;
        }

        .banner-cta-btn:hover {
          background-color: #E5A407;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(248, 181, 14, 0.4);
        }

        .banner-features-column {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-right: 40px;
          background: rgba(11, 21, 38, 0.85);
          backdrop-filter: blur(8px);
          padding: 14px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feature-icon-ring {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid #F8B50E;
          color: #F8B50E;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 181, 14, 0.1);
        }

        .feature-text {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .banner-diagonal-accent {
            display: none;
          }
          .banner-bg-visual {
            width: 100%;
            opacity: 0.2;
          }
          .promo-banner-card {
            flex-direction: column;
            gap: 22px;
            padding: 24px 20px;
            align-items: flex-start;
          }
          .banner-features-column {
            margin-right: 0;
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
          }
        }

        @media (max-width: 600px) {
          .banner-features-column {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  );
}
