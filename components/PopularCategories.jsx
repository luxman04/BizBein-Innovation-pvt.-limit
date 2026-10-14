'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/products';

export default function PopularCategories({ onSelectCategory }) {
  const handleCardClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    const target = document.getElementById('featured-products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="categories-section" id="machinery-catalog" aria-label="Popular Categories">
      <div className="section-container">
        {/* Header Bar */}
        <div className="section-header">
          <div className="title-wrap">
            <h2 className="section-title">Popular Categories</h2>
            <div className="yellow-underline"></div>
          </div>

          <button
            type="button"
            className="view-all-link"
            onClick={() => handleCardClick('all')}
          >
            <span>View All Categories</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 8 Categories Grid */}
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => handleCardClick(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCardClick(cat.id);
              }}
            >
              <div className="cat-img-box">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="cat-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/cat-conveyor.jpg';
                  }}
                />
              </div>

              <div className="cat-label-row">
                <span className="cat-name">{cat.name}</span>
                <ArrowRight size={13} className="cat-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .categories-section {
          padding: 36px 0 28px;
          background-color: #f8fafc;
        }

        .section-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .title-wrap {
          position: relative;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .yellow-underline {
          width: 48px;
          height: 3px;
          background-color: #F8B50E;
          border-radius: 2px;
          margin-top: 6px;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #1e3a8a;
          font-size: 13.5px;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .view-all-link:hover {
          color: #F8B50E;
          transform: translateX(3px);
        }

        /* 8-Card Grid */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 14px;
        }

        .category-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 10px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .category-card:hover {
          border-color: #F8B50E;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(248, 181, 14, 0.15);
        }

        .cat-img-box {
          width: 100%;
          height: 95px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          overflow: hidden;
          background: #f8fafc;
          border-radius: 8px;
          padding: 4px;
        }

        .cat-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .category-card:hover .cat-img {
          transform: scale(1.08);
        }

        .cat-label-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          text-align: center;
        }

        .cat-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.25;
        }

        .cat-arrow {
          color: #F8B50E;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .category-card:hover .cat-arrow {
          transform: translateX(3px);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1280px) {
          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 768px) {
          .categories-section {
            padding: 24px 0 18px;
          }
          .section-title {
            font-size: 20px;
          }
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .cat-img-box {
            height: 85px;
          }
          .cat-name {
            font-size: 11.5px;
          }
        }
      `}</style>
    </section>
  );
}
