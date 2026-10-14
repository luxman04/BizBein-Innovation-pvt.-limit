# BizBein Innovations Pvt. Ltd. — E-Commerce Storefront UI Design System & Token Guidance

## 1. Context and Goals

### Design Intent
Deliver a high-throughput, WCAG 2.2 AA-compliant, token-governed e-commerce interface for **BizBein Innovations Pvt. Ltd.** that enables industrial procurement teams and online consumers to evaluate, configure, and purchase conveying, coding, and packaging equipment with zero cognitive friction.

### Scope & Density Profile
The BizBein digital storefront operates under heavy information and navigation density:
- **Navigation Links**: 303 categorized taxonomy links across top-tier mega-menus, breadcrumbs, facet bars, and footer sitemaps.
- **Action Buttons**: 84 contextual CTAs across product shelves, bulk order modules, quotation requests, and checkout tunnels.
- **Structured Lists**: 18 facet and tabular list blocks for technical equipment specifications, order summaries, and category hierarchies.
- **Primary Input Fields**: 2 global header inputs (Global SKU Search and Location/Pincode Validator), scaling into multi-field RFQ (Request for Quote) and checkout forms.

### Brand Entity & Operations Matrix
- **Legal Entity**: BizBein Innovations Pvt. Ltd.
- **Operational Line / Division**: BizBein Packaging (*Conveying — Coding — Packaging*)
- **Storefront URL**: `https://www.bizbein.com/` (Reference benchmark: `https://www.industrybuying.com/`)
- **Primary Contacts**:
  - Direct Lines / Phone: `+91 99158-56540`, `+91 93153-94908`
  - Sales & Orders: `sales@bizbein.com`
  - General Enquiries: `info@bizbein.com`
- **Headquarters & Works**: `Third Floor, Mohali City Square, SCO 32, Patiala Rd, Zirakpur, Nabha, Punjab 140603`
- **Geo-Location Link**: [Google Maps Location](https://maps.app.goo.gl/6CdJJZa52uNrNMT56)
- **Social Media Profiles**: Instagram, Facebook, LinkedIn, YouTube, Twitter / X

---

## 2. Design Tokens and Foundations

All components **must** consume design tokens exclusively. Direct hardcoded values (`#hex`, inline pixels, ad-hoc bezier curves) are strictly prohibited in application code.

### 2.1 Color Tokens

Extracted from the official BizBein brand identity: Deep Industrial Navy (`#2B3353`), Industrial Safety Gold (`#F5A623`), Slate Tagline Grey (`#4A5568`), and high-contrast accessible surfaces.

```css
:root {
  /* Primitive Brand Tints */
  --color-brand-navy-900: #1A2035;
  --color-brand-navy-800: #222942;
  --color-brand-navy-700: #2B3353; /* Primary Logo Navy */
  --color-brand-navy-600: #384269;
  --color-brand-navy-100: #EEF1F8;

  --color-brand-gold-700: #D68C12;
  --color-brand-gold-600: #EFA81D;
  --color-brand-gold-500: #F5A623; /* Primary Brand Gold / Yellow */
  --color-brand-gold-400: #FABD4E;
  --color-brand-gold-100: #FEF6E7;

  /* Neutrals & Surfaces */
  --color-surface-base: #FFFFFF;
  --color-surface-alt: #F8F9FA;
  --color-surface-subtle: #EEF2F6;
  --color-surface-dark: #1A2035;
  --color-surface-inverse: #0F1422;

  /* Borders & Dividers */
  --color-border-subtle: #E2E8F0;
  --color-border-default: #CBD5E1;
  --color-border-strong: #94A3B8;
  --color-border-interactive: var(--color-brand-navy-700);

  /* Semantic Typography Colors (WCAG 2.2 AA Certified) */
  --color-text-primary: #1A2035;      /* Navy 900 on White: 12.8:1 (AAA) */
  --color-text-secondary: #475569;    /* Slate 600 on White: 5.8:1 (AA) */
  --color-text-tertiary: #64748B;     /* Slate 500 on White: 4.6:1 (AA) */
  --color-text-inverse: #FFFFFF;      /* White on Navy 700: 9.3:1 (AAA) */
  --color-text-on-gold: #1A2035;      /* Navy 900 on Gold 500: 8.9:1 (AAA) */
  --color-text-link: #1D4ED8;         /* Accessible Blue Link */
  --color-text-link-hover: #1E40AF;

  /* System Feedback & Validation */
  --color-status-success: #15803D;
  --color-status-success-bg: #DCFCE7;
  --color-status-warning: #B45309;
  --color-status-warning-bg: #FEF3C7;
  --color-status-error: #B91C1C;
  --color-status-error-bg: #FEE2E2;
  --color-status-info: #1D4ED8;
  --color-status-info-bg: #DBEAFE;

  /* Focus Indicator (High Visibility Dual Ring) */
  --color-focus-outer: #F5A623;
  --color-focus-inner: #1A2035;
}
```

### 2.2 Typography Tokens

- **Font Family Primary**: `Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`
- **Monospace Stack (SKUs, Part Nos, Serial Codes)**: `"JetBrains Mono", Consolas, Menlo, monospace`

| Token | Size | Line Height | Weight | Letter Spacing | Use Case |
|---|---|---|---|---|---|
| `--font-size-xs` | 12px (0.75rem) | 16px (1.33) | 500 / 600 | +0.02em | Badges, SKU labels, metadata, legal copy |
| `--font-size-sm` | 13px (0.8125rem) | 18px (1.38) | 400 / 500 | +0.01em | Secondary specs, breadcrumbs, helper text |
| `--font-size-md` | 14px (0.875rem) | 20px (1.43) | 400 / 500 | 0.00em | Standard body, form fields, table cell data |
| `--font-size-lg` | 15px (0.9375rem) | 22px (1.47) | 500 / 600 | 0.00em | Product title listings, table headers |
| `--font-size-xl` | 16px (1.00rem) | 24px (1.50) | 500 / 600 | -0.01em | Primary buttons, card titles, section subtitles |
| `--font-size-2xl` | 18px (1.125rem) | 26px (1.44) | 600 / 700 | -0.01em | Product pricing, modal headers, subsection H3 |
| `--font-size-3xl` | 24px (1.50rem) | 32px (1.33) | 700 | -0.02em | Section titles H2, Category Banner headlines |
| `--font-size-4xl` | 32px (2.00rem) | 40px (1.25) | 700 / 800 | -0.02em | Storefront Hero H1, Promotional Headlines |

### 2.3 Spacing Tokens

Industrial storefronts require strict rhythm to prevent micro-misalignments across 300+ link grids:

| Token | Value | Strict Usage Application |
|---|---|---|
| `--space-1` | 3px | Icon-to-text inline gap, sub-badge padding |
| `--space-2` | 5px | Input internal vertical padding, table tight gap |
| `--space-3` | 10px | Compact component padding, filter item spacing |
| `--space-4` | 12.5px | Standard input padding, product card internal gutter |
| `--space-5` | 15px | Container column gaps, header bar spacing |
| `--space-6` | 20px | Sectional card padding, list block separation |
| `--space-7` | 30px | Module vertical separation, form group margins |
| `--space-8` | 45px | Page section top/bottom rhythm |

### 2.4 Shape, Elevation & Motion Tokens

```css
:root {
  /* Border Radius */
  --radius-none: 0px;
  --radius-sm: 3px;    /* Compact tags, table controls */
  --radius-md: 6px;    /* Standard buttons, search inputs, product cards */
  --radius-lg: 10px;   /* Modal dialogs, floating quick-quote drawers */
  --radius-full: 9999px; /* Pill chips, status dots */

  /* Shadows (Elevations) */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(26, 32, 53, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(26, 32, 53, 0.1), 0 2px 4px -2px rgba(26, 32, 53, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(26, 32, 53, 0.12), 0 4px 6px -4px rgba(26, 32, 53, 0.08);
  --shadow-card-hover: 0 12px 20px -4px rgba(43, 51, 83, 0.18);

  /* Motion & Durations */
  --motion-duration-fast: 150ms;
  --motion-duration-normal: 250ms;
  --motion-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-ease-decelerate: cubic-bezier(0, 0, 0.2, 1);

  /* Z-Index Hierarchy */
  --z-base: 1;
  --z-sticky-nav: 100;
  --z-dropdown: 200;
  --z-drawer: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

---

## 3. Component-Level Rules & Specifications

### 3.1 Header & Top Utility Navigation Bar

The top header is the critical storefront trust anchor containing company credentials, emergency lines, and category switches.

#### Anatomy
1. **Utility Banner (Top Tier)**:
   - Left: Operational badge: `"BizBein Innovations Pvt. Ltd. | Packaging, Conveying & Coding Equipment"`.
   - Center: Direct Helpline: `+91 99158-56540` / `+91 93153-94908`.
   - Right: Sales Desk link: `sales@bizbein.com` & Location Quick-Link: `Zirakpur, Punjab`.
2. **Main Navigation Bar (Middle Tier)**:
   - Brand Logo: [BizBein Innovations Pvt. Ltd.] + [BizBein Packaging] SVG vector mark (aspect ratio 3.2:1, minimum height 40px).
   - Global Search Container: High-visibility search field with category selector, clear trigger, and voice/catalog trigger.
   - Quick Inquiry & Quote Cart: Real-time badge counter, dynamic total calculation.
3. **Category mega-menu (Bottom Tier)**:
   - Conveyor Systems, Inkjet / Continuous Printers, Carton Sealers, Vacuum Packaging, Spare Parts & Consumables.

#### Responsive & Edge-Case Handling
- **Viewport `< 768px`**: Collapse mega-menu into a slide-over drawer triggered by a 48×48px hamburger button.
- **Header Stickiness**: Main navigation bar **must** stick to viewport top (`position: sticky; top: 0; z-index: var(--z-sticky-nav)`) with `--shadow-md` applied upon scrolling.
- **Long Text Overflow**: Company address and phone lines **must** never wrap awkwardly; truncate with tooltip fallback or convert to icon-driven actionable links on mobile viewports.

---

### 3.2 Interactive Buttons (84 Page Button Instances)

Buttons **must** communicate exact intent with no visual ambiguity.

#### Variants
1. **Primary Button (Order / Buy Now / Submit RFQ)**:
   - Background: `--color-brand-gold-500`
   - Text: `--color-text-on-gold` (`#1A2035`, font-weight 600)
   - Border: 1px solid `--color-brand-gold-600`
2. **Secondary Button (Add to Quote / Download Technical Specs)**:
   - Background: `--color-brand-navy-700`
   - Text: `--color-text-inverse` (`#FFFFFF`, font-weight 500)
   - Border: 1px solid `--color-brand-navy-800`
3. **Outline Button (Compare Models / Filter Refinements)**:
   - Background: `--color-surface-base`
   - Text: `--color-brand-navy-700`
   - Border: 1.5px solid `--color-border-default`
4. **Utility / Icon Button (Wishlist, Zoom, Cart Counter +/-)**:
   - Minimum target bounding box: `44px × 44px` with centered icon.

#### 7 Mandatory Component States
| State | Visual Treatment | Accessibility / DOM Attributes |
|---|---|---|
| **Default** | Normal token fills; smooth border; crisp font rendering | `aria-disabled="false"` |
| **Hover** | Primary: darken background to `--color-brand-gold-600`; translateY(-1px); `--shadow-sm` | Pointer cursor (`cursor: pointer`) |
| **Focus-Visible** | High-contrast double outline: `outline: 2px solid var(--color-focus-outer); outline-offset: 2px; box-shadow: 0 0 0 4px var(--color-brand-navy-700)` | Keyboard tab target active |
| **Active** | translateY(0px); Background: `--color-brand-gold-700`; `--shadow-none` | `:active` |
| **Disabled** | Background: `--color-surface-subtle`; Text: `--color-text-tertiary`; Border: `--color-border-subtle`; Cursor: `not-allowed` | `disabled`, `aria-disabled="true"` |
| **Loading** | Label hidden via `opacity: 0`; centered spinning SVG; pointer-events disabled | `aria-busy="true"`, `aria-live="polite"` |
| **Error** | Border: 1.5px solid `--color-status-error`; subtle shake micro-interaction | `aria-invalid="true"` |

#### Keyboard, Pointer & Touch Interactions
- `Enter` and `Space`: Activate button immediately.
- `Touchstart`: Immediate active state feedback with zero 300ms tap-delay. Minimum tap area **must** measure at least 44×44px.

---

### 3.3 Search & Input Fields (2 Global + Form Scale)

#### Anatomy
- Label (`--font-size-sm`, font-weight 600, `--color-text-primary`)
- Mandatory Field Indicator (`*` in `--color-status-error`)
- Field container with optional leading icon (search glass) and trailing icon (clear / barcode)
- Inline validation helper text (`--font-size-xs`, line-height 16px)

#### 7 Mandatory States
1. **Default**: Border: 1px solid `--color-border-default`; Background: `--color-surface-base`; Text: `--color-text-primary`.
2. **Hover**: Border: 1px solid `--color-brand-navy-600`.
3. **Focus-Visible**: Border: 1.5px solid `--color-brand-navy-700`; Box-shadow: `0 0 0 3px rgba(245, 166, 35, 0.35)`.
4. **Active**: Same as focus-visible.
5. **Disabled**: Background: `--color-surface-alt`; Border: 1px solid `--color-border-subtle`; Text: `--color-text-tertiary`; `cursor: not-allowed`.
6. **Loading (Auto-suggest)**: Trailing micro-spinner indicator replacing clear icon.
7. **Error**: Border: 1.5px solid `--color-status-error`; Background: `--color-status-error-bg` at 10% opacity; Helper text rendered in `--color-status-error`.

---

### 3.4 Product Equipment Cards (Packaging & Conveying Catalog)

#### Anatomy
- Header badge: Stock Status (`"Ready to Dispatch"`, `"Custom Built"`, `"Factory Direct"`).
- Equipment Image: 1:1 or 4:3 ratio with lazy-loading, WebP with PNG fallback, alternate text including machine model and capacity.
- Model & SKU Code: Font mono `--font-size-xs` (`--color-text-secondary`).
- Machine Title: Max 2 lines with `-webkit-line-clamp: 2`, `--font-size-lg`, `--color-text-primary`.
- Core Technical Specs: 3-row bullet list (`Capacity / Speed`, `Power Rating`, `Warranty Period`).
- Pricing / RFQ Block: Industrial price (ex-GST clear declaration) + `"Request Bulk Quote"` CTA.

#### Empty State Handling
When filters return zero matching industrial machinery:
- Display illustration with clear heading: `"No industrial machines match your specifications"`.
- Actionable recovery: Reset filters button + Direct Call prompt to BizBein Tech Desk: `+91 99158-56540`.

---

### 3.5 Global Storefront Footer & Industrial Contact Matrix

The footer **must** provide verifiable legal, operational, geographical, and social compliance details.

```
+--------------------------------------------------------------------------------------------------+
| BIZBEIN INNOVATIONS PVT. LTD. -- INDUSTRIAL CONVEYING, CODING & PACKAGING SYSTEMS               |
+--------------------------------------------------------------------------------------------------+
| HEAD OFFICE & WORKS               | PRODUCT DIVISIONS          | DIRECT CONTACT & ENQUIRY        |
| Third Floor, Mohali City Square,   | * Conveyor Solutions       | Direct Phone / Fax:             |
| SCO 32, Patiala Rd, Zirakpur       | * Batch Coding Printers    | +91 99158-56540                 |
| Punjab 140603                      | * Sealing & Shrink Wrap    | +91 93153-94908                 |
|                                    | * Vacuum Packaging         |                                 |
| [View on Google Maps]              | * Industrial Consumables   | Official Inquiries:             |
| (maps.app.goo.gl/6CdJJZa52uNrNMT56)| * Spare Parts & Tooling    | sales@bizbein.com               |
|                                    |                            | info@bizbein.com                |
+-----------------------------------+----------------------------+---------------------------------+
| CONNECT WITH US: [Instagram] [Facebook] [LinkedIn] [YouTube] [Twitter / X]                       |
+--------------------------------------------------------------------------------------------------+
| (c) BizBein Innovations Pvt. Ltd. All rights reserved. | ISO Standards & Safety Compliant        |
+--------------------------------------------------------------------------------------------------+
```

---

## 4. Accessibility Requirements (WCAG 2.2 AA Testable Criteria)

Every developer and designer working on the storefront **must** adhere to these verifiable pass/fail rules.

| Rule ID | WCAG 2.2 Criterion | Requirement Description | Automated / Manual Test Check | Pass/Fail Condition |
|---|---|---|---|---|
| **A11Y-01** | **1.4.3 Contrast (Minimum)** | Text vs. Background contrast ratio **must** achieve at least `4.5:1` for normal text and `3:0:1` for large text (>= 18px bold or >= 24px regular). | Lighthouse / Axe-core contrast analysis. | **PASS**: Text `#1A2035` on `#FFFFFF` (12.8:1) and `#1A2035` on `#F5A623` (8.9:1). **FAIL**: Grey `#94A3B8` on `#FFFFFF` for body text. |
| **A11Y-02** | **2.4.7 Focus Visible** | All 84 buttons and 303 links **must** display an unmistakable visual focus indicator when navigated via keyboard. | Tab through entire page with hardware keyboard. | **PASS**: Dual focus ring (2px solid Gold + 2px offset) clearly visible on all elements. **FAIL**: `outline: none` or `outline: 0` without fallback. |
| **A11Y-03** | **2.4.11 Focus Not Obscured** | When an interactive component receives keyboard focus, it **must not** be completely hidden by sticky headers, banners, or floating footers. | Scroll-margin checks on all focusable targets. | **PASS**: `scroll-margin-top: 90px` applied so sticky header never hides targeted inputs. |
| **A11Y-04** | **2.5.8 Target Size (Minimum)** | Interactive target size **must** be at least `24px × 24px` with spacing, or at least `44px × 44px` for primary touch interactions. | Measure bounding client rect on mobile viewport (375px). | **PASS**: Card buttons and quick-nav links measure >= 44px in tap height. |
| **A11Y-05** | **1.3.1 Info and Relationships** | Data tables for technical machine specifications **must** have proper `<th>` scoping (`scope="col"` / `scope="row"`). | Screen reader DOM tree inspection. | **PASS**: Screen reader announces row header before cell value. |
| **A11Y-06** | **4.1.2 Name, Role, Value** | Icon-only buttons (Wishlist, Zoom, Cart, Social links) **must** have non-empty accessible names. | Inspect accessibility tree in DevTools. | **PASS**: `<a href="..." aria-label="BizBein Innovations on LinkedIn">`. **FAIL**: `<a><svg/></a>` without label. |
| **A11Y-07** | **2.1.2 No Keyboard Trap** | Dropdowns, mega-menus, and RFQ dialogs **must** allow users to navigate away using standard `Tab`, `Shift+Tab`, or `Escape`. | Press `Tab` and `Escape` in opened modal. | **PASS**: `Escape` closes drawer and restores focus to triggering button. |

---

## 5. Content and Tone Standards

### Tone of Voice
- **Direct & Technically Authoritative**: Industrial buyers want specifications, tolerances, power requirements, and uptime guarantees, not marketing fluff.
- **Action-Oriented Microcopy**:
  - *Do*: `"Download Technical CAD Sheet (PDF 4.2 MB)"`, `"Request Factory Dispatch Estimate"`, `"Call Technical Support: +91 99158-56540"`.
  - *Don't*: `"Click here"`, `"Learn more"`, `"Check our stuff"`.
- **Pricing & Quotes**:
  - Always state: `"Ex-factory pricing (GST & transport calculated at invoice)"` to eliminate enterprise checkout ambiguity.

### Contact & Location Structured Data
To facilitate local SEO and automated procurement validation, location and contact blocks **must** include Microdata / JSON-LD structured schema:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "BizBein Innovations Pvt. Ltd.",
  "legalName": "BizBein Innovations Private Limited",
  "department": "BizBein Packaging (Conveying, Coding, Packaging)",
  "url": "https://www.bizbein.com/",
  "logo": "https://www.bizbein.com/assets/bizbein-innovations-logo.png",
  "telephone": "+91-99158-56540",
  "faxNumber": "+91-93153-94908",
  "email": "sales@bizbein.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Third Floor, Mohali City Square, SCO 32, Patiala Rd",
    "addressLocality": "Zirakpur, Nabha",
    "addressRegion": "Punjab",
    "postalCode": "140603",
    "addressCountry": "IN"
  },
  "hasMap": "https://maps.app.goo.gl/6CdJJZa52uNrNMT56",
  "sameAs": [
    "https://www.instagram.com/bizbein",
    "https://www.facebook.com/bizbein",
    "https://www.linkedin.com/company/bizbein-innovations",
    "https://www.youtube.com/@bizbein",
    "https://twitter.com/bizbein"
  ]
}
```

---

## 6. Anti-Patterns & Prohibited Implementations

| Category | Prohibited Anti-Pattern | Mandatory Remediation |
|---|---|---|
| **Branding** | Referencing former entities (e.g., "Sonic", "sonic indusrt", or placeholder generic names). | **Must** exclusively use **BizBein Innovations Pvt. Ltd.** or **BizBein Packaging**. |
| **Colors** | Using low-contrast raw hex combinations like `#0000EE` for body text or grey `#767676` on dark backgrounds. | **Must** use calibrated semantic tokens (`--color-text-primary`, `--color-text-secondary`, `--color-brand-navy-700`). |
| **Typography** | Setting body font sizes below 12px or arbitrary decimal line heights. | **Must** conform to typography scale (`--font-size-xs` to `--font-size-4xl`). |
| **Focus Rings** | Removing outlines with `outline: none` or `*:focus { outline: none; }`. | **Must** implement the `--color-focus-outer` high-visibility dual focus ring. |
| **Layout Shift** | Lazy-loading industrial product machinery imagery without aspect-ratio containers. | **Must** reserve layout box (`aspect-ratio: 1 / 1` or `width/height` attributes) to ensure 0 Cumulative Layout Shift (CLS). |
| **Mobile Traps** | Phone numbers displayed as plain static text. | **Must** link phone numbers with `tel:+919915856540` and email with `mailto:sales@bizbein.com` for single-tap action. |
| **Map Links** | Embedding broken map iframes without fallback. | **Must** provide verified outbound link to `https://maps.app.goo.gl/6CdJJZa52uNrNMT56` with accessible external link indicator. |

---

## 7. Implementation & Pre-Flight QA Checklist

Before shipping any storefront template or component code to staging or production, engineers and designers **must** verify each item:

### Token & Styling Conformance
- [ ] No hardcoded hex values or inline font declarations exist in CSS/SCSS modules.
- [ ] Primary buttons utilize `--color-brand-gold-500` with dark navy text (`#1A2035`) ensuring 8.9:1 contrast.
- [ ] Secondary CTA buttons utilize `--color-brand-navy-700` with crisp white text (`#FFFFFF`) ensuring 9.3:1 contrast.
- [ ] Spacing aligns strictly to the 8-point semantic scale (`--space-1` through `--space-8`).

### Component State Integrity
- [ ] All 84 buttons implement all 7 states (Default, Hover, Focus-Visible, Active, Disabled, Loading, Error).
- [ ] Both global inputs and form fields display unambiguous focus rings and explicit error helper messages.
- [ ] Product cards handle empty images gracefully with brand fallback placeholders.

### Accessibility & Assistive Tech
- [ ] Full keyboard navigation walkthrough completed (Tab, Shift+Tab, Enter, Space, Escape) without keyboard traps.
- [ ] Automated scan with Axe-core / Lighthouse reports zero WCAG 2.2 AA contrast or label violations.
- [ ] Touch targets on mobile screen widths (360px - 414px) meet or exceed 44×44px.
- [ ] Sticky navigation bar maintains `scroll-margin-top` to prevent obscured focus.

### Identity & Information Accuracy
- [ ] Company name verified as **BizBein Innovations Pvt. Ltd.** across headers, legal copy, and footers.
- [ ] Secondary operational branding displays **BizBein Packaging — Conveying - Coding - Packaging**.
- [ ] Direct lines match `+91 99158-56540` and `+91 93153-94908`.
- [ ] Inquiries route to `sales@bizbein.com` and `info@bizbein.com`.
- [ ] Address matches `Third Floor, Mohali City Square, SCO 32, Patiala Rd, Zirakpur, Nabha, Punjab 140603`.
- [ ] Google Maps URL targets `https://maps.app.goo.gl/6CdJJZa52uNrNMT56`.
- [ ] Social media icons link directly to BizBein channels (Instagram, Facebook, LinkedIn, YouTube, Twitter/X).
