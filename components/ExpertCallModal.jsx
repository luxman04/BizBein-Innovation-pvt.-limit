'use client';

import React, { useState } from 'react';
import { X, Headphones, Phone, Mail, CheckCircle2, Clock } from 'lucide-react';
import { companyDetails } from '../data/products';

export default function ExpertCallModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', topic: 'Conveyor Solutions' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Headphones size={22} className="modal-title-icon" />
            <h3>Talk to an Industrial Expert</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div className="success-box">
              <CheckCircle2 size={46} className="text-success" />
              <h4>Callback Requested!</h4>
              <p>Our senior packaging & conveying systems engineer will call you shortly at <strong>{formData.phone}</strong>.</p>
            </div>
          ) : (
            <>
              <div className="direct-call-banner">
                <span className="banner-sub">Call Us Directly for Instant Engineering Advice:</span>
                <div className="phone-badges">
                  <a href={`tel:${companyDetails.phone1.replace(/[^0-9+]/g, '')}`} className="phone-pill">
                    <Phone size={15} />
                    <span>{companyDetails.phone1}</span>
                  </a>
                  <a href={`tel:${companyDetails.phone2.replace(/[^0-9+]/g, '')}`} className="phone-pill">
                    <Phone size={15} />
                    <span>{companyDetails.phone2}</span>
                  </a>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="callback-form">
                <span className="form-subheading">Or Request an Immediate Callback:</span>
                
                <div className="form-group">
                  <label htmlFor="expert-name">Your Full Name</label>
                  <input
                    id="expert-name"
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expert-phone">Mobile / WhatsApp Number</label>
                  <input
                    id="expert-phone"
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expert-topic">Machinery Requirement</label>
                  <select
                    id="expert-topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  >
                    <option value="Conveyor Solutions">Conveyor Belts & Systems</option>
                    <option value="CIJ & TIJ Inkjet Coders">Continuous Inkjet & Batch Coders</option>
                    <option value="Band Sealer & Packaging">Vertical Band Sealer & Packaging</option>
                    <option value="Air Curtains & PVC Curtains">Air Curtains & PVC Strip Curtains</option>
                    <option value="Industrial Gear Motors & Automation">Motors, Sensors & Automation</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn">
                  <span>Connect With Technical Specialist</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid #e2e8f0;
          background: #0b1526;
          color: #ffffff;
        }

        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-title-wrap h3 {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
        }

        .modal-title-icon {
          color: #f5a623;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
        }

        .modal-body {
          padding: 22px;
        }

        .direct-call-banner {
          background: #fff8eb;
          border: 1px solid #fed7aa;
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 20px;
        }

        .banner-sub {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #9a3412;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .phone-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .phone-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f5a623;
          color: #0b1526;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .phone-pill:hover {
          background: #e59a18;
        }

        .form-subheading {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 14px;
        }

        .callback-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        .form-group input,
        .form-group select {
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 13.5px;
          outline: none;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #f5a623;
        }

        .submit-btn {
          margin-top: 6px;
          background-color: #f5a623;
          color: #0b1526;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s ease;
        }

        .submit-btn:hover {
          background-color: #e59a18;
        }

        .success-box {
          text-align: center;
          padding: 30px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .text-success {
          color: #16a34a;
        }

        .success-box h4 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .success-box p {
          font-size: 14px;
          color: #475569;
        }
      `}</style>
    </div>
  );
}
