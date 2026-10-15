import React from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Clock, Navigation, ExternalLink, ShieldCheck, Truck, Wrench } from "lucide-react";
import ContactWithGlobe from "@/components/ui/contact-with-globe";
import { companyDetails } from "@/data/products";

export const metadata = {
  title: "Contact Us & Global Works | BizBein Innovations",
  description: "Connect with BizBein Innovations for industrial conveyor systems, continuous inkjet coders, vertical band sealers, and custom plant automation quotes.",
};

export default function ContactPage() {
  return (
    <div className="contact-page-wrapper">
      {/* 1. Breadcrumb navigation strip */}
      <div className="breadcrumb-strip">
        <div className="contact-container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">Home</Link>
            <ChevronRight size={13} className="crumb-sep" />
            <span className="crumb-active">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* 2. Interactive Contact with Rotating Wireframe Globe */}
      <ContactWithGlobe
        title="Contact BizBein Innovations"
        subtitle="Global Machinery Works & Engineering Desk"
        description="Connect directly with our senior industrial engineers for conveyor configurations, CIJ/TIJ batch coders, band sealing equipment, or turnkey plant line quotes."
      />

      {/* 3. Physical Plant Works & Navigation Section */}
      <section className="facility-details-section">
        <div className="contact-container">
          <div className="section-header-wrap">
            <span className="badge-plant">HEADQUARTERS & MANUFACTURING WORKS</span>
            <h2 className="facility-title">Visit Our Works Facility in Zirakpur</h2>
            <p className="facility-desc">
              Experience live demonstrations of motorized conveyor systems, high-speed batch coding printers, and continuous packaging machinery at our factory showroom.
            </p>
          </div>

          <div className="facility-grid">
            {/* Left: Contact & Working Hours Info Cards */}
            <div className="facility-info-column">
              <div className="info-card">
                <div className="info-card-header">
                  <div className="icon-badge"><MapPin size={20} /></div>
                  <div>
                    <h3 className="card-heading">Factory & Office Address</h3>
                    <span className="card-sub">{companyDetails.division}</span>
                  </div>
                </div>
                <p className="address-text">{companyDetails.address}</p>
                <a
                  href={companyDetails.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-map-nav"
                >
                  <Navigation size={15} />
                  <span>Open in Google Maps</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <div className="icon-badge"><Phone size={20} /></div>
                  <div>
                    <h3 className="card-heading">Direct Phone Lines</h3>
                    <span className="card-sub">Commercial & Technical Support</span>
                  </div>
                </div>
                <div className="contact-pills-list">
                  <a href={`tel:${companyDetails.primaryPhone.replace(/[^0-9+]/g, '')}`} className="phone-link-card">
                    <span className="link-label">Commercial Orders Desk:</span>
                    <strong className="link-val">{companyDetails.primaryPhone}</strong>
                  </a>
                  <a href={`tel:${companyDetails.secondaryPhone.replace(/[^0-9+]/g, '')}`} className="phone-link-card">
                    <span className="link-label">Technical Engineer Line:</span>
                    <strong className="link-val">{companyDetails.secondaryPhone}</strong>
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <div className="icon-badge"><Mail size={20} /></div>
                  <div>
                    <h3 className="card-heading">Email Desks</h3>
                    <span className="card-sub">Inquiries & Proforma Invoices</span>
                  </div>
                </div>
                <div className="contact-pills-list">
                  <a href={`mailto:${companyDetails.salesEmail}`} className="phone-link-card">
                    <span className="link-label">Sales & Quotations:</span>
                    <strong className="link-val">{companyDetails.salesEmail}</strong>
                  </a>
                  <a href={`mailto:${companyDetails.infoEmail}`} className="phone-link-card">
                    <span className="link-label">General Operations:</span>
                    <strong className="link-val">{companyDetails.infoEmail}</strong>
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <div className="icon-badge"><Clock size={20} /></div>
                  <div>
                    <h3 className="card-heading">Operating Hours</h3>
                    <span className="card-sub">Factory Dispatch Schedule</span>
                  </div>
                </div>
                <p className="hours-text">
                  <strong>Monday to Saturday:</strong> 9:00 AM – 7:00 PM IST<br />
                  <em>(Sunday: On-call breakdown engineering support for continuous manufacturing lines)</em>
                </p>
              </div>
            </div>

            {/* Right: Embedded Interactive Google Map */}
            <div className="facility-map-column">
              <div className="map-card-wrapper">
                <div className="map-top-bar">
                  <span className="map-badge">LIVE GPS LOCATION</span>
                  <span className="map-city">Zirakpur, Punjab (PIN: 140603)</span>
                </div>
                <iframe
                  title="BizBein Works Location"
                  src={companyDetails.googleMapsEmbedUrl}
                  className="interactive-map-frame"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
                <div className="map-bottom-guarantee">
                  <div className="guarantee-chip">
                    <ShieldCheck size={16} className="text-gold" />
                    <span>ISO Quality Assurance</span>
                  </div>
                  <div className="guarantee-chip">
                    <Truck size={16} className="text-gold" />
                    <span>Pan-India Logistics</span>
                  </div>
                  <div className="guarantee-chip">
                    <Wrench size={16} className="text-gold" />
                    <span>Engineer On-Site Commissioning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-page-wrapper {
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .contact-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .breadcrumb-strip {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 0;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .crumb-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .crumb-link:hover {
          color: #F8B50E;
        }

        .crumb-sep {
          color: #94a3b8;
        }

        .crumb-active {
          color: #0f172a;
          font-weight: 600;
        }

        .facility-details-section {
          padding: 60px 0 80px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .section-header-wrap {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 44px;
        }

        .badge-plant {
          display: inline-block;
          background-color: #eff6ff;
          color: #1e40af;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 12px;
        }

        .facility-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
          letter-spacing: -0.01em;
        }

        .facility-desc {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .facility-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 36px;
          align-items: start;
        }

        .facility-info-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .info-card:hover {
          border-color: #F8B50E;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #eff6ff;
          color: #1e40af;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-heading {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .card-sub {
          font-size: 12px;
          color: #64748b;
        }

        .address-text, .hours-text {
          font-size: 13.5px;
          color: #334155;
          line-height: 1.5;
          margin: 0 0 14px;
        }

        .hours-text {
          margin-bottom: 0;
        }

        .btn-map-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0f172a;
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .btn-map-nav:hover {
          background: #1e293b;
        }

        .contact-pills-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .phone-link-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-decoration: none;
          transition: border-color 0.15s ease;
        }

        .phone-link-card:hover {
          border-color: #F8B50E;
          background: #fefcf6;
        }

        .link-label {
          font-size: 12px;
          color: #64748b;
        }

        .link-val {
          font-size: 13px;
          color: #0f172a;
        }

        .map-card-wrapper {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
        }

        .map-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: #0f172a;
          color: #ffffff;
        }

        .map-badge {
          background: #16a34a;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .map-city {
          font-size: 12.5px;
          color: #94a3b8;
          font-weight: 500;
        }

        .interactive-map-frame {
          width: 100%;
          height: 380px;
          border: none;
          display: block;
        }

        .map-bottom-guarantee {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 16px 14px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 12px;
        }

        .guarantee-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .text-gold {
          color: #F8B50E;
        }

        @media (max-width: 960px) {
          .facility-grid {
            grid-template-columns: 1fr;
          }
          .interactive-map-frame {
            height: 300px;
          }
        }

        @media (max-width: 600px) {
          .facility-details-section {
            padding: 36px 0 50px;
          }
          .facility-title {
            font-size: 24px;
          }
          .contact-container {
            padding: 0 14px;
          }
          .map-bottom-guarantee {
            flex-direction: column;
            align-items: flex-start;
          }
          .phone-link-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
        }
      `}</style>
    </div>
  );
}
