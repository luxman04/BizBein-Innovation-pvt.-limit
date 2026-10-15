'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Settings,
  Truck,
  Headphones,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react';

export default function HeroBanner({ onExploreClick, onOpenQuote }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const slides = [
    {
      id: 1,
      subtitle: "INDIA'S TRUSTED INDUSTRIAL EQUIPMENT SUPPLIER",
      titleLine1: "CONVEYOR BELT &",
      titleLine2: "MATERIAL HANDLING",
      titleHighlight: "SOLUTIONS",
      desc: "Durable | Efficient | Customized for Your Industry",
      buttonText: "Explore Our Conveyor Solutions",
      targetCategory: "conveyor-systems",
      badgeText: "SMART SOLUTIONS FOR A STRONGER SUPPLY CHAIN",
      bgImage: "/hero-conveyor-line.jpg"
    },
    {
      id: 2,
      subtitle: "HIGH-SPEED PACKAGING & PHARMA AUTOMATION",
      titleLine1: "CONTINUOUS INKJET &",
      titleLine2: "BATCH CODING",
      titleHighlight: "PRINTERS",
      desc: "Zero Maintenance | 600 DPI | Fast-Dry Non-Smudge Inks",
      buttonText: "Discover CIJ & TIJ Coders",
      targetCategory: "coding-printing",
      badgeText: "24/7 PRODUCTION UPTIME & INSTANT COMMISSIONING",
      bgImage: "/hero-slide-2.jpg"
    },
    {
      id: 3,
      subtitle: "AUTOMATED SECONDARY PACKAGING LINES",
      titleLine1: "AUTOMATIC CARTON &",
      titleLine2: "VERTICAL BAND",
      titleHighlight: "SEALERS",
      desc: "Heavy Duty | Up to 1000 Boxes/Hour | Hermetic Heat Seals",
      buttonText: "Explore Packaging Machinery",
      targetCategory: "packaging-machinery",
      badgeText: "ENGINEERED FOR SEAMLESS HIGH-OUTPUT PLANTS",
      bgImage: "/hero-slide-3.jpg"
    },
    {
      id: 4,
      subtitle: "WAREHOUSE & LOGISTICS EFFICIENCY",
      titleLine1: "POWERED ROLLER &",
      titleLine2: "MODULAR PLASTIC",
      titleHighlight: "CONVEYORS",
      desc: "Food Grade POM Belts | Adjustable Speeds | 400 kg/m Load",
      buttonText: "Custom Roller Systems",
      targetCategory: "conveyor-systems",
      badgeText: "CUSTOM ENGINEERED RUNS FOR YOUR FACILITY",
      bgImage: "/hero-slide-4.jpg"
    },
    {
      id: 5,
      subtitle: "CLEANROOM & COLD STORAGE PROTECTION",
      titleLine1: "INDUSTRIAL AIR &",
      titleLine2: "PVC STRIP",
      titleHighlight: "CURTAINS",
      desc: "18-21 m/s Velocity | Temperature Retention | Insect Barrier",
      buttonText: "Browse Industrial Curtains",
      targetCategory: "air-curtains",
      badgeText: "CERTIFIED ENERGY SAVING CLIMATE BARRIERS",
      bgImage: "/hero-slide-5.jpg"
    }
  ];

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setSlideIndex(index);
  };

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const currentSlide = slides[slideIndex];

  return (
    <section
      className="hero-section"
      aria-label="Hero Equipment Showcase"
    >
      <div className="hero-wrapper">
        {/* 5 Background Slide Images with Cross-Fade & Slow Pan */}
        <div className="hero-slides-viewport">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`hero-bg-visual ${idx === slideIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.bgImage})` }}
              aria-hidden={idx !== slideIndex}
            />
          ))}
        </div>

        {/* Diagonal Yellow Accent Band */}
        <div className="hero-diagonal-band"></div>

        {/* Left Dark Industrial Geometric Polygon Mask */}
        <div className="hero-left-overlay"></div>

        {/* Content Container */}
        <div className="hero-container">
          {/* Left Text Content */}
          <div className="hero-left-content" key={slideIndex}>
            <div className="hero-kicker">
              <span className="kicker-flag"></span>
              <span className="kicker-text">{currentSlide.subtitle}</span>
            </div>

            <h1 className="hero-headline">
              <span>{currentSlide.titleLine1}</span>
              <span>{currentSlide.titleLine2}</span>
              <span className="gold-text">{currentSlide.titleHighlight}</span>
            </h1>

            <p className="hero-tagline">
              {currentSlide.desc}
            </p>

            <div className="hero-cta-row">
              <button
                type="button"
                className="hero-primary-cta"
                onClick={() => {
                  const el = document.getElementById('featured-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  if (onExploreClick) onExploreClick(currentSlide.targetCategory);
                }}
              >
                <span>{currentSlide.buttonText}</span>
                <ArrowRight size={18} className="cta-arrow" />
              </button>
            </div>

            {/* 4 Trust Feature Badges */}
            <div className="hero-trust-bar">
              <div className="trust-badge-item">
                <ShieldCheck size={20} className="trust-icon" />
                <div className="trust-text">
                  <span className="trust-title">High Quality</span>
                  <span className="trust-sub">Products</span>
                </div>
              </div>

              <div className="trust-badge-item">
                <Settings size={20} className="trust-icon" />
                <div className="trust-text">
                  <span className="trust-title">Custom</span>
                  <span className="trust-sub">Solutions</span>
                </div>
              </div>

              <div className="trust-badge-item">
                <Truck size={20} className="trust-icon" />
                <div className="trust-text">
                  <span className="trust-title">On-Time</span>
                  <span className="trust-sub">Delivery</span>
                </div>
              </div>

              <div className="trust-badge-item">
                <Headphones size={20} className="trust-icon" />
                <div className="trust-text">
                  <span className="trust-title">Expert</span>
                  <span className="trust-sub">Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Floating Badge, Slide Controls & Indicators */}
          <div className="hero-right-content">
            {/* Top Right Floating Yellow Angled Badge */}
            <div className="hero-floating-badge" key={`badge-${slideIndex}`}>
              <span className="badge-highlight-text">{currentSlide.badgeText}</span>
            </div>

            {/* Bottom Right Carousel Controls & 5 Dots */}
            <div className="hero-controls-panel">
              {/* Slide Counter */}
              <div className="slide-counter-badge">
                <span className="counter-curr">0{slideIndex + 1}</span>
                <span className="counter-divider">/</span>
                <span className="counter-total">0{slides.length}</span>
              </div>

              {/* 5 Indicator Bars */}
              <div className="slide-progress-dots">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`progress-bar-btn ${idx === slideIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span className="bar-fill"></span>
                  </button>
                ))}
              </div>

              {/* Prev / Next Circular Arrows */}
              <div className="carousel-arrow-buttons">
                <button
                  type="button"
                  className="carousel-nav-btn"
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  title="Previous image"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  className="carousel-nav-btn"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  title="Next image"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          background-color: #0b1526;
          overflow: hidden;
          width: 100%;
        }

        .hero-wrapper {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
        }

        /* Viewport containing all 5 background slide images */
        .hero-slides-viewport {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .hero-bg-visual {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center right;
          filter: brightness(0.92);
          opacity: 0;
          transform: scale(1.04);
          transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 5s linear;
          will-change: opacity, transform;
        }

        .hero-bg-visual.active {
          opacity: 1;
          transform: scale(1);
        }

        /* Diagonal Yellow Accent Band */
        .hero-diagonal-band {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 45%;
          width: 70px;
          background: #F8B50E;
          transform: skewX(-24deg);
          z-index: 3;
          box-shadow: 0 0 35px rgba(248, 181, 14, 0.4);
          pointer-events: none;
        }

        /* Left Dark Industrial Polygon Mask */
        .hero-left-overlay {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 47%;
          background: linear-gradient(135deg, #091322 0%, #0d1a2d 85%, #102139 100%);
          transform: skewX(-24deg);
          transform-origin: top left;
          z-index: 2;
          pointer-events: none;
        }

        .hero-left-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          right: 99%;
          width: 400px;
          background: #091322;
        }

        /* Content Container */
        .hero-container {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 48px 20px 40px;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
        }

        /* Left Content */
        .hero-left-content {
          max-width: 580px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          color: #ffffff;
          animation: slideFadeIn 0.5s ease-out;
        }

        @keyframes slideFadeIn {
          from {
            opacity: 0.2;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .kicker-flag {
          width: 4px;
          height: 14px;
          background: #F8B50E;
          border-radius: 2px;
        }

        .hero-headline {
          display: flex;
          flex-direction: column;
          font-size: 40px;
          font-weight: 900;
          line-height: 1.12;
          color: #ffffff;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .gold-text {
          color: #F8B50E;
          text-shadow: 0 0 20px rgba(248, 181, 14, 0.3);
        }

        .hero-tagline {
          font-size: 14.5px;
          font-weight: 500;
          color: #cbd5e1;
          letter-spacing: 0.02em;
        }

        .hero-cta-row {
          margin-top: 6px;
        }

        .hero-primary-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #F8B50E;
          color: #0f172a;
          border: none;
          padding: 13px 26px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(248, 181, 14, 0.4);
          transition: all 0.2s ease;
        }

        .hero-primary-cta:hover {
          background-color: #E5A407;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(248, 181, 14, 0.55);
        }

        .cta-arrow {
          transition: transform 0.2s ease;
        }

        .hero-primary-cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* 4 Feature Badges */
        .hero-trust-bar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 22px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .trust-badge-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trust-icon {
          color: #F8B50E;
          flex-shrink: 0;
        }

        .trust-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .trust-title {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .trust-sub {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Right Content */
        .hero-right-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          min-height: 400px;
          padding: 10px 0;
        }

        .hero-floating-badge {
          background: #F8B50E;
          color: #0b1526;
          padding: 10px 22px;
          clip-path: polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          animation: badgePulse 3s infinite alternate;
        }

        @keyframes badgePulse {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }

        .badge-highlight-text {
          font-size: 12.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
        }

        /* Controls Panel */
        .hero-controls-panel {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(11, 21, 38, 0.82);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .slide-counter-badge {
          display: flex;
          align-items: baseline;
          gap: 2px;
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
        }

        .counter-curr {
          color: #F8B50E;
        }

        .counter-divider {
          color: #64748b;
        }

        .counter-total {
          color: #94a3b8;
        }

        /* 5 Indicator Bars */
        .slide-progress-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .progress-bar-btn {
          width: 24px;
          height: 5px;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          border-radius: 3px;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .progress-bar-btn:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .progress-bar-btn.active {
          width: 38px;
          background: #F8B50E;
          box-shadow: 0 0 8px rgba(248, 181, 14, 0.6);
        }

        .carousel-arrow-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .carousel-nav-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .carousel-nav-btn:hover {
          background: #F8B50E;
          color: #0b1526;
          border-color: #F8B50E;
          transform: scale(1.08);
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .hero-headline {
            font-size: 34px;
          }
          .hero-left-overlay {
            width: 55%;
          }
          .hero-diagonal-band {
            left: 52%;
          }
        }

        @media (max-width: 860px) {
          .hero-wrapper {
            min-height: auto;
          }
          .hero-diagonal-band {
            display: none;
          }
          .hero-left-overlay {
            width: 100%;
            transform: none;
            background: linear-gradient(180deg, rgba(9, 19, 34, 0.95) 0%, rgba(13, 26, 45, 0.9) 100%);
          }
          .hero-left-overlay::before {
            display: none;
          }
          .hero-container {
            flex-direction: column;
            gap: 24px;
            padding: 32px 16px 28px;
          }
          .hero-headline {
            font-size: clamp(22px, 6vw, 30px);
          }
          .hero-right-content {
            min-height: auto;
            align-items: center;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            flex-wrap: wrap;
            gap: 14px;
          }
          .hero-floating-badge {
            clip-path: none;
            border-radius: 6px;
            padding: 8px 14px;
          }
          .badge-highlight-text {
            font-size: 11px;
          }
          .hero-trust-bar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-top: 18px;
          }
        }

        @media (max-width: 580px) {
          .hero-right-content {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .hero-floating-badge {
            text-align: center;
          }
          .hero-controls-panel {
            align-self: center;
            max-width: 100%;
            gap: 8px;
            padding: 6px 12px;
          }
          .progress-bar-btn {
            width: 16px;
          }
          .progress-bar-btn.active {
            width: 24px;
          }
          .carousel-nav-btn {
            width: 30px;
            height: 30px;
          }
        }

        @media (max-width: 400px) {
          .hero-trust-bar {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .hero-primary-cta {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
