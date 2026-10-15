'use client';

import React, { useState } from 'react';
import { X, Truck, Search, CheckCircle, PackageCheck, Clock } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [orderQuery, setOrderQuery] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setTrackingResult({
        orderId: orderQuery.toUpperCase().startsWith('BB-') ? orderQuery.toUpperCase() : `BB-${orderQuery.toUpperCase()}`,
        status: 'In Transit with V-Trans Industrial Logistics',
        currentLocation: 'Ambala Central Hub, Haryana',
        estimatedDelivery: 'Within 24 - 48 Hours',
        items: 'Modular Conveyor System Section & Fast-Dry Inks',
        steps: [
          { title: 'Order Confirmed & QC Passed', date: 'Yesterday 11:30 AM', done: true },
          { title: 'Dispatched from Zirakpur Works', date: 'Yesterday 04:45 PM', done: true },
          { title: 'In Transit to Destination Hub', date: 'Today 08:20 AM', done: true },
          { title: 'Out for Final Delivery to Factory', date: 'Expected Tomorrow', done: false }
        ]
      });
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Truck size={22} className="modal-title-icon" />
            <h3>Track Equipment & Spares Dispatch</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleTrack} className="track-form">
            <label htmlFor="order-input" className="track-label">
              Enter Order ID, AWB Waybill or Mobile Number
            </label>
            <div className="input-row">
              <input
                id="order-input"
                type="text"
                placeholder="e.g. BB-89240 or 9915856540"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                required
              />
              <button type="submit" className="track-btn">
                <Search size={16} />
                <span>Track</span>
              </button>
            </div>
          </form>

          {loading && <div className="loading-state">Looking up dispatch docket...</div>}

          {trackingResult && !loading && (
            <div className="tracking-result">
              <div className="status-badge">
                <span className="dot"></span>
                <span>{trackingResult.status}</span>
              </div>

              <div className="summary-grid">
                <div className="summary-col">
                  <span className="label">Docket / Order:</span>
                  <strong>{trackingResult.orderId}</strong>
                </div>
                <div className="summary-col">
                  <span className="label">Current Hub:</span>
                  <strong>{trackingResult.currentLocation}</strong>
                </div>
                <div className="summary-col">
                  <span className="label">Estimated Delivery:</span>
                  <strong>{trackingResult.estimatedDelivery}</strong>
                </div>
              </div>

              <div className="timeline-wrap">
                <span className="timeline-heading">Shipment Milestones</span>
                {trackingResult.steps.map((st, i) => (
                  <div key={i} className={`timeline-item ${st.done ? 'done' : 'pending'}`}>
                    <div className="timeline-node">
                      {st.done ? <CheckCircle size={14} /> : <Clock size={14} />}
                    </div>
                    <div className="timeline-content">
                      <span className="step-name">{st.title}</span>
                      <span className="step-time">{st.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
        }

        .modal-title-icon {
          color: #F8B50E;
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

        .track-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        .input-row {
          display: flex;
          gap: 8px;
        }

        .input-row input {
          flex: 1;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
        }

        .input-row input:focus {
          border-color: #F8B50E;
        }

        .track-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #F8B50E;
          color: #0b1526;
          border: none;
          padding: 0 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .loading-state {
          padding: 20px;
          text-align: center;
          color: #64748b;
        }

        .tracking-result {
          margin-top: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #dcfce7;
          color: #15803d;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
          margin-bottom: 14px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #16a34a;
          border-radius: 50%;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px dashed #cbd5e1;
        }

        .summary-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .summary-col .label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
        }

        .summary-col strong {
          font-size: 12.5px;
          color: #1e293b;
        }

        .timeline-heading {
          display: block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 10px;
        }

        .timeline-item {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .timeline-node {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .timeline-item.done .timeline-node {
          background: #dcfce7;
          color: #16a34a;
        }

        .timeline-item.pending .timeline-node {
          background: #e2e8f0;
          color: #94a3b8;
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
        }

        .step-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .step-time {
          font-size: 11px;
          color: #64748b;
        }

        @media (max-width: 540px) {
          .modal-header {
            padding: 14px 16px;
          }
          .modal-body {
            padding: 16px;
          }
          .summary-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .input-row {
            flex-direction: column;
          }
          .track-btn {
            padding: 10px 16px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
