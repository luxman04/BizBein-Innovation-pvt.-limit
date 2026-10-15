// BizBein Innovations Pvt. Ltd. — Product Detail Enricher
// Provides multi-angle gallery, style variants, configuration add-ons, 
// and Amazon-style technical bullet points for industrial machinery.

export function getEnrichedProductDetails(product) {
  if (!product) return null;

  const basePrice = product.price || 45000;
  const categoryId = product.categoryId || '';

  // 1. Multi-angle Gallery Images based on machinery type
  const gallery = [
    {
      id: 'main',
      url: product.image,
      label: 'Main Machine View',
      type: 'photo'
    }
  ];

  if (categoryId.includes('conveyor')) {
    gallery.push(
      { id: 'angle-1', url: '/cat-conveyor-modular.jpg', label: 'Isometric Angle View', type: 'photo' },
      { id: 'angle-2', url: '/hero-conveyor-line.jpg', label: 'Factory Line Integration', type: 'photo' },
      { id: 'angle-3', url: '/prod-roller-conveyor.jpg', label: 'Bed & Drive Assembly', type: 'photo' },
      { id: 'angle-4', url: '/prod-gear-motor.jpg', label: 'Motor & Gearbox Drive', type: 'photo' }
    );
  } else if (categoryId.includes('coding')) {
    gallery.push(
      { id: 'angle-1', url: '/cat-coding.jpg', label: 'Printhead & Nozzle Assembly', type: 'photo' },
      { id: 'angle-2', url: '/cat-sensors.jpg', label: 'Sensor Trigger Module', type: 'photo' },
      { id: 'angle-3', url: '/prod-modular-belt.jpg', label: 'Mounted on Conveyor Line', type: 'photo' }
    );
  } else if (categoryId.includes('packaging')) {
    gallery.push(
      { id: 'angle-1', url: '/cat-packaging.jpg', label: 'Sealing Jaws & Conveyor Bed', type: 'photo' },
      { id: 'angle-2', url: '/prod-vertical-band-sealer.jpg', label: 'Control Console & Temp Meter', type: 'photo' },
      { id: 'angle-3', url: '/cat-conveyor.jpg', label: 'Infeed & Outfeed Track', type: 'photo' }
    );
  } else if (categoryId.includes('material')) {
    gallery.push(
      { id: 'angle-1', url: '/cat-forklift.jpg', label: 'Hydraulic Cylinder & Mast', type: 'photo' },
      { id: 'angle-2', url: '/hero-conveyor-line.jpg', label: 'Warehouse Dispatch View', type: 'photo' }
    );
  } else if (categoryId.includes('air-curtain')) {
    gallery.push(
      { id: 'angle-1', url: '/cat-air-curtain.jpg', label: 'Blower & Air Louvers', type: 'photo' },
      { id: 'angle-2', url: '/prod-air-curtain.jpg', label: 'Mounting Plate & Grille', type: 'photo' }
    );
  } else if (categoryId.includes('pvc')) {
    gallery.push(
      { id: 'angle-1', url: '/cat-pvc-curtains.jpg', label: 'Suspension Clamp System', type: 'photo' },
      { id: 'angle-2', url: '/cat-air-curtain.jpg', label: 'Thermal Cold-Storage Setup', type: 'photo' }
    );
  } else {
    gallery.push(
      { id: 'angle-1', url: '/cat-industrial-equipment.jpg', label: 'Industrial Housing & Flange', type: 'photo' },
      { id: 'angle-2', url: '/prod-gear-motor.jpg', label: 'Terminal Box & Drive Shaft', type: 'photo' }
    );
  }

  // 2. Style / Model Variants (with dynamic price modifiers)
  let variants = [];
  if (categoryId.includes('conveyor')) {
    variants = [
      {
        id: 'var-standard',
        name: '1.5M Length | 200mm Belt',
        shortTitle: '1.5M × 200mm',
        price: basePrice,
        mrp: Math.round(basePrice * 1.15),
        specsSummary: 'Compact packaging line feed'
      },
      {
        id: 'var-medium',
        name: '2.0M Length | 300mm Belt',
        shortTitle: '2.0M × 300mm',
        price: Math.round(basePrice * 1.25),
        mrp: Math.round(basePrice * 1.42),
        specsSummary: 'High-throughput carton transfer'
      },
      {
        id: 'var-large',
        name: '3.0M Length | 500mm Belt',
        shortTitle: '3.0M × 500mm',
        price: Math.round(basePrice * 1.65),
        mrp: Math.round(basePrice * 1.88),
        specsSummary: 'Heavy accumulation & palletizing'
      }
    ];
  } else if (categoryId.includes('coding')) {
    variants = [
      {
        id: 'var-std-12',
        name: 'Standard 12.7mm Head (Single Line)',
        shortTitle: '12.7mm Single',
        price: basePrice,
        mrp: Math.round(basePrice * 1.18),
        specsSummary: 'Batch, MRP & Expiry coding'
      },
      {
        id: 'var-dual-25',
        name: 'Dual Head 25.4mm (Multi-Line Barcode)',
        shortTitle: '25.4mm Dual',
        price: Math.round(basePrice * 1.4),
        mrp: Math.round(basePrice * 1.6),
        specsSummary: 'Large barcodes, logos & QR codes'
      },
      {
        id: 'var-ultra-high',
        name: 'High-Speed Continuous CIJ Unit',
        shortTitle: 'High-Speed CIJ',
        price: Math.round(basePrice * 1.85),
        mrp: Math.round(basePrice * 2.1),
        specsSummary: 'Up to 300 meters/min line speed'
      }
    ];
  } else if (categoryId.includes('packaging')) {
    variants = [
      {
        id: 'var-std-sealer',
        name: 'Standard Horizontal Feed (0-12m/min)',
        shortTitle: 'Horizontal Feed',
        price: basePrice,
        mrp: Math.round(basePrice * 1.15),
        specsSummary: 'Standard pouch packaging'
      },
      {
        id: 'var-vert-heavy',
        name: 'Heavy-Duty Vertical Stand (Liquid / Grain)',
        shortTitle: 'Vertical Heavy Stand',
        price: Math.round(basePrice * 1.28),
        mrp: Math.round(basePrice * 1.45),
        specsSummary: 'Spill-free vertical pouch sealing'
      },
      {
        id: 'var-gas-flush',
        name: 'Continuous Sealer with Nitrogen Flush',
        shortTitle: 'Nitrogen Flush Kit',
        price: Math.round(basePrice * 1.6),
        mrp: Math.round(basePrice * 1.85),
        specsSummary: 'MAP food packaging shelf-life extender'
      }
    ];
  } else {
    variants = [
      {
        id: 'var-standard',
        name: 'Standard Industrial Capacity',
        shortTitle: 'Standard Model',
        price: basePrice,
        mrp: Math.round(basePrice * 1.15),
        specsSummary: 'Factory standard configuration'
      },
      {
        id: 'var-heavyduty',
        name: 'Heavy-Duty Reinforced Model',
        shortTitle: 'Heavy-Duty Spec',
        price: Math.round(basePrice * 1.3),
        mrp: Math.round(basePrice * 1.5),
        specsSummary: 'Severe duty continuous cycle'
      }
    ];
  }

  // 3. Configuration / Automation Options (Like "With/Without Care" in Amazon)
  const configurations = [
    {
      id: 'cfg-standalone',
      name: 'Standard Standalone Unit',
      priceDelta: 0,
      description: 'Factory complete machinery ready for manual or manual-infeed line placement.'
    },
    {
      id: 'cfg-sensor',
      name: 'With Sensor & Automated Stop Kit (+₹4,500)',
      priceDelta: 4500,
      description: 'Includes industrial photoelectric sensor bracket and automated line-stop logic.'
    },
    {
      id: 'cfg-turnkey',
      name: 'Turnkey Line Pack with Side Guides (+₹8,500)',
      priceDelta: 8500,
      description: 'Includes adjustable UHMW-PE guide rails, anti-vibration mountings, and spare kit.'
    }
  ];

  // 4. "About this item" Technical Highlights
  const aboutPoints = [
    {
      title: 'Drive & Motor Engineering',
      content: `Powered by an energy-efficient industrial gear motor engineered for continuous S1 duty cycles with minimal thermal rise and low acoustic emission.`
    },
    {
      title: 'Structural Metallurgy & Frame',
      content: `Constructed from heavy-gauge laser-cut SS 304 or structural mild steel finished with anti-corrosive multi-stage electrostatic powder coating.`
    },
    {
      title: 'Throughput & Electronic Speed Control',
      content: `Features an integrated variable speed control interface compatible with standard line speeds and upstream/downstream automation synchronization.`
    },
    {
      title: 'Safety Interlocks & CE Compliance',
      content: `Equipped with accessible emergency stop switches, thermal overload breakers, and IP55-sealed electrical junction enclosures.`
    },
    {
      title: 'All-India Factory Warranty & On-Site Support',
      content: `Backed by BizBein Innovations 12-month comprehensive warranty with direct technical commissioning support from our Zirakpur works.`
    }
  ];

  // 5. Frequently Bought / Inquired Together Bundle
  const bundleItems = [
    {
      id: product.id,
      name: product.name,
      price: basePrice,
      image: product.image,
      isPrimary: true
    },
    {
      id: 'bundle-sensor',
      name: 'High-Precision Photoelectric Sensor Kit with Bracket',
      price: 4500,
      image: '/cat-sensors.jpg',
      isPrimary: false
    },
    {
      id: 'bundle-coder',
      name: 'Online Continuous Batch Coder Infeed Bracket',
      price: 18500,
      image: '/cat-coding.jpg',
      isPrimary: false
    }
  ];

  return {
    gallery,
    variants,
    configurations,
    aboutPoints,
    bundleItems
  };
}
