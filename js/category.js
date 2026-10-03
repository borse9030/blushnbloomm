/**
 * Bloom&blush - Dedicated Category Page Controller
 * Handles dynamic category switching, SEO titles, product filtering, and WhatsApp consultation.
 */

// Category Metadata Dictionary with Bespoke Editorial Context
const CATEGORY_META = {
  'money-garlands': {
    title: 'The Money Garland Suite',
    eyebrow: 'HERITAGE ORIGAMI CEREMONY',
    lead: 'Bespoke origami currency garlands handcrafted for grooms, baraat entries, and milestone ceremonies using proprietary damage-free folding techniques and gold zari brocade.',
    image: 'assets/images/money_garland.jpg',
    scriptText: 'Groom<br>Heritage<br>Garlands',
    metrics: [
      { text: '100% Zero-Damage Origami Folding', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
      { text: 'Choice of ₹10 to ₹500 Notes', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Pimpri-Chinchwad Studio Delivery', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' }
    ],
    waPrompt: 'Hello Siddhi, I am exploring your Money Garlands collection on Bloom&blush and would love to consult for my upcoming celebration!',
    guide: [
      { num: '01', title: 'Choose Denomination & Length', desc: 'Select note denomination (₹10 to ₹500), garland drape length (24" to 36"), and color theme.' },
      { num: '02', title: 'Damage-Free Artistry', desc: 'Notes are folded using our zero-pinhole origami technique, accented with velvet roses and zari neckbands.' },
      { num: '03', title: 'Preserved Packaging & Delivery', desc: 'Nestled in our signature luxury presentation box, ready for the grand ceremony in Pune or Maharashtra.' }
    ]
  },
  'bouquets': {
    title: 'Artisanal Bouquets & Eternal Florals',
    eyebrow: 'FRESH & PRESERVED FLORAL ART',
    lead: 'Romantic hand-tied bridal bouquets, fresh English garden roses, and eternal preserved florals crafted with cascading hand-dyed velvet ribbons.',
    image: 'assets/images/editorial_bouquet.jpg',
    scriptText: 'Blooms<br>Bridal<br>Eternal',
    metrics: [
      { text: 'Fresh Seasonal & 3-Year Preserved Roses', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
      { text: 'Trailing Silk Velvet Ribbons', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Custom Palette Color Matching', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }
    ],
    waPrompt: 'Hello Siddhi, I saw your Artisanal Bouquets collection on Bloom&blush and would love to enquire about ordering a bridal bouquet or floral arrangement!',
    guide: [
      { num: '01', title: 'Select Floral Palette', desc: 'Choose fresh seasonal garden blooms or 3-year eternal preserved florals matching your lehenga or event colors.' },
      { num: '02', title: 'Handcrafted Composition', desc: 'Personally designed and bound by Siddhi with trailing hand-dyed ribbons and hydration packaging.' },
      { num: '03', title: 'Direct Studio Handover', desc: 'Delivered fresh across Pimpri-Chinchwad and Pune with complete floral care instructions.' }
    ]
  },
  'customized-hampers': {
    title: 'Customized Celebration Hampers',
    eyebrow: 'EXPERIENTIAL LUXURY GIFTING',
    lead: 'Rich burgundy velvet gift trunks paired with brass dry fruit canisters, artisanal soy candles, gourmet delicacies, and personalized wax-sealed greetings.',
    image: 'assets/images/luxury_hamper.jpg',
    scriptText: 'Luxury<br>Hampers<br>Curations',
    metrics: [
      { text: 'Opulent Velvet Presentation Trunks', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.65-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z' },
      { text: 'Brass Canisters & Scented Soy Candles', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Custom Foil Monogramming Available', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }
    ],
    waPrompt: 'Hello Siddhi, I would like to consult about your Customized Hampers on Bloom&blush for our upcoming occasion!',
    guide: [
      { num: '01', title: 'Curate Contents & Budget', desc: 'Select trunk size, dry fruit varieties, candle fragrances, and optional luxury sweets or keepsakes.' },
      { num: '02', title: 'Custom Monogram & Wax Stamp', desc: 'We personalize the gift box lid with your family name/monogram and hand-script your greeting.' },
      { num: '03', title: 'Flawless Presentation', desc: 'Delivered securely packaged for VIP corporate gifting, wedding welcomes, or festive occasions.' }
    ]
  },
  'wedding-gifting': {
    title: 'Wedding & Celebration Gifting',
    eyebrow: 'ROYAL TROUSSEAU PRESENTATION',
    lead: 'Opulent velvet trousseau presentation trays, zardozi batwas, brass jewelry caskets, and bespoke ceremonial gift packaging designed for royal Indian weddings.',
    image: 'assets/images/wedding_trousseau.jpg',
    scriptText: 'Royal<br>Trousseau<br>Suites',
    metrics: [
      { text: 'Heavy Gold Zari & Micro-Velvet Craft', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Bespoke Compartment Sizing', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
      { text: 'Complete Ring, Saree & Jewelry Suites', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.65-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z' }
    ],
    waPrompt: 'Hello Siddhi, I am preparing for a wedding and would love to consult about your Royal Trousseau Trays and celebration gifting!',
    guide: [
      { num: '01', title: 'Trousseau Assessment', desc: 'Share your saree, jewelry, watch, or gifting dimensions with Siddhi on WhatsApp.' },
      { num: '02', title: 'Custom Tray Crafting', desc: 'Trays are built with solid hardwood frames, royal velvet lining, and heritage lace trims.' },
      { num: '03', title: 'Grand Wedding Presentation', desc: 'Complete coordinated suite delivered with protective dust bags across Pune and Maharashtra.' }
    ]
  },
  'customized-gifts': {
    title: 'Customized Keepsake Gifts',
    eyebrow: 'HEIRLOOM SENTIMENTAL TOKENS',
    lead: 'Hand-carved wooden keepsake boxes paired with authentic dip-pen calligraphy letters, botanical floral seals, and cherished personalized keepsakes.',
    image: 'assets/images/customized_gifts.jpg',
    scriptText: 'Heirloom<br>Keepsake<br>Gifts',
    metrics: [
      { text: 'Hand-Carved Solid Seasoned Wood', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Real Hand-Written Calligraphy on Cotton Paper', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
      { text: 'Custom Floral Wax Seal Stamps', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' }
    ],
    waPrompt: 'Hello Siddhi, I would like to order a personalized Customized Keepsake Gift from Bloom&blush!',
    guide: [
      { num: '01', title: 'Select Box & Inscription', desc: 'Choose natural seasoned wood or velvet finishes with custom carved initials or names.' },
      { num: '02', title: 'Scripting Your Letter', desc: 'Provide your heartfelt letter, beautifully transcribed in archival ink on deckle-edge paper.' },
      { num: '03', title: 'Wax Sealed Delivery', desc: 'Sealed with hot wax stamp and tied with hand-dyed satin ribbon for an unforgettable gift.' }
    ]
  },
  'luxury-addons': {
    title: 'Luxury Add-ons & Everlasting Florals',
    eyebrow: 'EVERLASTING FLORAL ACCENTS',
    lead: 'Real preserved Ecuadorian rose cloches that last 3+ years without water, fragrance vials, and boutique display accents to accompany any grand gift.',
    image: 'assets/images/floral_dome.jpg',
    scriptText: 'Everlasting<br>Floral<br>Art',
    metrics: [
      { text: '100% Real Preserved Roses (3+ Years)', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
      { text: 'Crystal-Clear Glass Cloche Domes', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Warm Micro-Fairy Light Integration', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }
    ],
    waPrompt: 'Hello Siddhi, I would like to enquire about your Luxury Add-ons and Preserved Rose Cloches on Bloom&blush!',
    guide: [
      { num: '01', title: 'Choose Cloche Style', desc: 'Select dome height, antique brass pedestal finish, and rose color combination.' },
      { num: '02', title: 'Engraving & Lighting', desc: 'Add personalized brass plaque engraving and subtle ambient warm micro-fairy lights.' },
      { num: '03', title: 'Keepsake Gifting Box', desc: 'Delivered in signature ivory archival gift box with padded velvet base.' }
    ]
  }
};

let CURRENT_CAT_ID = 'money-garlands';

document.addEventListener('DOMContentLoaded', () => {
  initCategoryPage();
});

function initCategoryPage() {
  // 1. Sync custom products / collections from localStorage if available
  try {
    const cProd = localStorage.getItem('bloom_custom_products');
    if (cProd !== null) {
      const parsed = JSON.parse(cProd);
      if (Array.isArray(parsed)) {
        PRODUCTS = parsed.filter(p => typeof isFakeProduct === 'function' ? !isFakeProduct(p) : true);
      }
    }
    const cCols = localStorage.getItem('bloom_custom_collections');
    if (cCols) {
      const parsedCols = JSON.parse(cCols);
      if (Array.isArray(parsedCols) && parsedCols.length > 0) COLLECTIONS = parsedCols;
    }
  } catch (e) {}

  // 2. Parse URL query params or preset category ID
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('id') || (typeof window !== 'undefined' && window.PRESET_CATEGORY_ID);

  if (catParam && (CATEGORY_META[catParam] || COLLECTIONS.some(c => c.id === catParam))) {
    CURRENT_CAT_ID = catParam;
  } else {
    CURRENT_CAT_ID = 'money-garlands';
  }

  // 3. Render page for this category
  renderCategory(CURRENT_CAT_ID, false);

  // 4. Setup modal & navigation listeners
  initProductModal();
  initMobileDrawer();
  setupHeaderWhatsAppLinks();

  // 5. Setup Popstate listener for back/forward browser buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.catId) {
      renderCategory(e.state.catId, false);
    } else {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('id') || 'money-garlands';
      renderCategory(cat, false);
    }
  });

  // 6. Realtime Firestore Sync (if available)
  initFirestoreSync();
}

function renderCategory(catId, updateUrl = true) {
  CURRENT_CAT_ID = catId;

  if (updateUrl) {
    const newUrl = `${window.location.pathname}?id=${catId}`;
    history.pushState({ catId }, '', newUrl);
  }

  const meta = CATEGORY_META[catId] || {
    title: catId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    eyebrow: 'SIGNATURE BOUTIQUE COLLECTION',
    lead: 'Bespoke floral and celebration creations handcrafted by Siddhi Kokate in Pimpri-Chinchwad, Pune.',
    image: 'assets/images/hero.jpg',
    scriptText: 'Handcrafted<br>In<br>Pune',
    metrics: [
      { text: '100% Handcrafted Artistry', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Bespoke Customization', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
      { text: 'Direct WhatsApp Consultation', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' }
    ],
    waPrompt: `Hello Siddhi, I am exploring your ${catId} collection on Bloom&blush and would love to enquire!`,
    guide: [
      { num: '01', title: 'Consult & Choose', desc: 'Discuss your celebration requirements directly on WhatsApp.' },
      { num: '02', title: 'Handcrafted With Love', desc: 'Individually created with premium materials in Pimpri-Chinchwad.' },
      { num: '03', title: 'Safely Delivered', desc: 'Safely packaged and delivered for your special celebration.' }
    ]
  };

  // Find matching collection record
  const colObj = COLLECTIONS.find(c => c.id === catId);
  const displayTitle = colObj ? colObj.title : meta.title;
  const displayImage = colObj ? colObj.image : meta.image;

  // 1. Update Head metadata & Canonical
  document.title = `${displayTitle} | Bloom&blush Boutique Studio Pune`;
  const metaDescEl = document.getElementById('page-meta-desc');
  if (metaDescEl) metaDescEl.content = meta.lead;

  const canonicalEl = document.getElementById('canonical-link');
  if (canonicalEl) {
    canonicalEl.href = `https://blushnbloomm.in/category.html?id=${catId}`;
  }
  const ogTitleEl = document.getElementById('og-title');
  if (ogTitleEl) ogTitleEl.content = `${displayTitle} | Bloom&blush Pune`;
  const ogDescEl = document.getElementById('og-desc');
  if (ogDescEl) ogDescEl.content = meta.lead;

  // Update Dynamic JSON-LD Structured Data
  const jsonLdEl = document.getElementById('category-json-ld');
  if (jsonLdEl) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${displayTitle} Collection | Bloom&blush`,
      "description": meta.lead,
      "url": `https://blushnbloomm.in/category.html?id=${catId}`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Bloom&blush",
        "url": "https://blushnbloomm.in"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://blushnbloomm.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": displayTitle,
            "item": `https://blushnbloomm.in/category.html?id=${catId}`
          }
        ]
      }
    };
    jsonLdEl.textContent = JSON.stringify(structuredData, null, 2);
  }

  // 2. Update Breadcrumb
  const bcEl = document.getElementById('bc-current-name');
  if (bcEl) bcEl.textContent = displayTitle;

  // 3. Update Hero Details
  const heroTitle = document.getElementById('cat-hero-title');
  const heroLead = document.getElementById('cat-hero-lead');
  const heroImg = document.getElementById('cat-hero-img');
  const heroBadge = document.getElementById('cat-hero-pill-badge');
  const scriptRibbon = document.getElementById('cat-script-ribbon');
  const heroWaBtn = document.getElementById('cat-hero-wa-btn');
  const bannerWaBtn = document.getElementById('cat-banner-wa-btn');

  if (heroTitle) heroTitle.textContent = displayTitle;
  if (heroLead) heroLead.textContent = colObj?.shortDesc || meta.lead;
  if (heroBadge) heroBadge.textContent = meta.eyebrow;
  if (heroImg) {
    heroImg.src = displayImage;
    heroImg.alt = `${displayTitle} - Bloom&blush Pune`;
  }
  if (scriptRibbon) scriptRibbon.innerHTML = meta.scriptText;

  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(meta.waPrompt)}`;
  if (heroWaBtn) heroWaBtn.href = waUrl;
  if (bannerWaBtn) bannerWaBtn.href = waUrl;

  // 4. Update Trust Metrics
  const metricsRow = document.getElementById('cat-metrics-row');
  if (metricsRow && meta.metrics) {
    metricsRow.innerHTML = meta.metrics.map(m => `
      <div class="cat-metric-item">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="${m.icon}"/></svg>
        <span>${escapeHtml(m.text)}</span>
      </div>
    `).join('');
  }

  // 5. Render Switcher Pills Bar
  renderSwitcherPills(catId);

  // 6. Render Products for this Category
  renderCategoryProducts(catId, displayTitle);

  // 7. Render 3-step Bespoke Guide
  renderCategoryGuide(meta.guide);

  // 8. Re-init 3D Tilt for rich depth
  if (typeof init3DTilt === 'function') init3DTilt();
}

function renderSwitcherPills(activeId) {
  const container = document.getElementById('category-pills-bar');
  if (!container) return;

  const defaultCollections = [
    { id: 'money-garlands', title: 'Money Garlands' },
    { id: 'bouquets', title: 'Artisanal Bouquets' },
    { id: 'customized-hampers', title: 'Customized Hampers' },
    { id: 'wedding-gifting', title: 'Wedding & Celebration Gifting' },
    { id: 'customized-gifts', title: 'Customized Keepsakes' },
    { id: 'luxury-addons', title: 'Luxury Add-ons' }
  ];

  const cols = (Array.isArray(COLLECTIONS) && COLLECTIONS.length > 0) ? COLLECTIONS : defaultCollections;

  container.innerHTML = cols.map(c => {
    const isActive = c.id === activeId;
    return `
      <button type="button" class="cat-pill-btn ${isActive ? 'active' : ''}" data-cat-id="${c.id}">
        <span>${escapeHtml(c.title)}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.catId;
      if (targetId && targetId !== CURRENT_CAT_ID) {
        renderCategory(targetId, true);
        const heroSection = document.getElementById('category-hero');
        if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function renderCategoryProducts(catId, categoryName) {
  const grid = document.getElementById('cat-products-grid');
  const catalogTitle = document.getElementById('cat-catalog-title');
  const catalogSubtitle = document.getElementById('cat-catalog-subtitle');
  if (!grid) return;

  if (catalogTitle) {
    catalogTitle.textContent = `${categoryName} Designs`;
  }

  // Filter products by collectionId or category name match
  let items = PRODUCTS.filter(p => {
    if (p.collectionId && p.collectionId === catId) return true;
    const cat = (p.category || '').toLowerCase();
    const target = catId.toLowerCase().replace(/-/g, ' ');
    return cat.includes(target) || target.includes(cat);
  });

  // Bespoke consultation state if no products are in this category yet
  if (items.length === 0) {
    if (catalogSubtitle) {
      catalogSubtitle.textContent = `All ${categoryName} creations are custom designed & handcrafted to order by Founder Siddhi Kokate.`;
    }
    const waCategoryUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hello Siddhi, I would like to consult with you for custom ${categoryName} designs for my upcoming occasion.`)}`;
    grid.innerHTML = `
      <div class="empty-category-notice" style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1.5rem; background: rgba(253, 248, 247, 0.75); border-radius: 20px; border: 1px dashed rgba(160, 44, 90, 0.25); max-width: 680px; margin: 2rem auto;">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🌸</div>
        <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--burgundy-deep); margin-bottom: 0.75rem; font-weight: 500;">Bespoke ${escapeHtml(categoryName)} Atelier</h3>
        <p style="max-width: 540px; margin: 0 auto 1.5rem; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
          Every ${escapeHtml(categoryName).toLowerCase()} piece is handcrafted to order by Founder Siddhi Kokate with personalized colors, motifs, and details tailored to your auspicious ceremony.
        </p>
        <a href="${waCategoryUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
          <span>Inquire via WhatsApp</span>
          <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.86L2.87 22l4.27-1.12C8.66 21.58 10.28 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
        </a>
      </div>
    `;
    return;
  }

  if (catalogSubtitle) {
    catalogSubtitle.textContent = `Showing ${items.length} bespoke handcrafted ${items.length === 1 ? 'creation' : 'creations'} in this collection. Every piece is individually styled by Siddhi Kokate upon order.`;
  }

  grid.innerHTML = items.map(p => {
    const priceText = p.priceFormatted || (p.price && Number(p.price) > 0 ? `₹${Number(p.price).toLocaleString('en-IN')}` : 'Price on Request');
    const hasSpecificPrice = p.priceFormatted && p.priceFormatted !== 'Price on Request';
    const priceSnippet = hasSpecificPrice ? ` (${p.priceFormatted})` : (p.price && Number(p.price) > 0 ? ` (₹${Number(p.price).toLocaleString('en-IN')})` : '');
    const waProductText = `Hello Siddhi, I saw "${p.name}"${priceSnippet} in your ${categoryName} collection on Bloom&blush and would love to enquire!`;
    const waItemUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waProductText)}`;

    return `
      <article class="cat-product-card js-tilt-card js-open-product" data-product-id="${p.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(p.name)}">
        <div class="cat-product-media">
          ${p.badge ? `<span class="featured-badge-overlay">${escapeHtml(p.badge)}</span>` : ''}
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)} - Bloom&blush" loading="lazy" onerror="this.src='assets/images/hero.jpg'">
          <div class="cat-product-hover-overlay">
            <span class="btn-editorial-pill" style="pointer-events: none;">
              <span>View Specifications &rarr;</span>
            </span>
          </div>
        </div>

        <div class="cat-product-info">
          <div class="cat-product-tag-row">
            <span class="compact-category">${escapeHtml(p.category)}</span>
            ${p.priceNote ? `<span class="cat-product-pricenote">${escapeHtml(p.priceNote)}</span>` : ''}
          </div>

          <h3 class="cat-product-name">${escapeHtml(p.name)}</h3>
          <p class="cat-product-desc">${escapeHtml(p.shortDesc)}</p>

          <div class="cat-product-footer">
            <div class="cat-product-price-box">
              <span class="cat-product-price-val">${escapeHtml(priceText)}</span>
            </div>

            <div class="cat-product-actions">
              <a href="${waItemUrl}" target="_blank" rel="noopener noreferrer" class="btn-cat-wa js-direct-wa" title="Instant WhatsApp Enquiry" aria-label="WhatsApp Enquiry for ${escapeHtml(p.name)}">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/></svg>
                <span>WhatsApp</span>
              </a>
              <button type="button" class="btn-circle-arrow js-open-product-arrow" data-product-id="${p.id}" aria-label="View Details for ${escapeHtml(p.name)}">
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach click handler for product details modal
  grid.querySelectorAll('.js-open-product').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked directly on direct WhatsApp button
      if (e.target.closest('.js-direct-wa')) return;
      const pid = card.dataset.productId;
      if (pid) openProductModal(pid);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const pid = card.dataset.productId;
        if (pid) openProductModal(pid);
      }
    });
  });
}

function renderCategoryGuide(guideSteps) {
  const container = document.getElementById('cat-guide-steps');
  if (!container || !guideSteps) return;

  container.innerHTML = guideSteps.map(s => `
    <div class="cat-step-card js-tilt-card">
      <div class="step-num-badge">${s.num}</div>
      <h4>${escapeHtml(s.title)}</h4>
      <p>${escapeHtml(s.desc)}</p>
    </div>
  `).join('');
}

/**
 * Product Details Modal Controller
 */
function initProductModal() {
  const backdrop = document.getElementById('product-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeProductModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
      closeProductModal();
    }
  });
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalPriceNote = document.getElementById('modal-price-note');
  const modalDesc = document.getElementById('modal-desc');
  const modalCustomizationList = document.getElementById('modal-customization-list');
  const modalOccasionsTags = document.getElementById('modal-occasions-tags');
  const modalSpecsTable = document.getElementById('modal-specs-table');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  if (modalImg) {
    modalImg.src = product.image;
    modalImg.alt = `${product.name} - Bloom&blush`;
  }
  if (modalCategory) modalCategory.textContent = product.category;
  if (modalBadge) {
    if (product.badge) {
      modalBadge.textContent = product.badge;
      modalBadge.style.display = 'inline-block';
    } else {
      modalBadge.style.display = 'none';
    }
  }
  if (modalTitle) modalTitle.textContent = product.name;

  const formattedPrice = product.priceFormatted || (product.price && Number(product.price) > 0 ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'Price on Request');
  if (modalPrice) modalPrice.textContent = formattedPrice;
  if (modalPriceNote) modalPriceNote.textContent = product.priceNote || (product.price && Number(product.price) > 0 ? 'Handcrafted on order' : 'Bespoke pricing on WhatsApp consultation');
  if (modalDesc) modalDesc.textContent = product.detailedDesc;

  if (modalCustomizationList && product.customizationOptions) {
    modalCustomizationList.innerHTML = product.customizationOptions.map(opt => `<li>${opt}</li>`).join('');
  }

  if (modalOccasionsTags && product.suitableOccasions) {
    modalOccasionsTags.innerHTML = product.suitableOccasions.map(occ => `<span class="modal-occasion-pill">${occ}</span>`).join('');
  }

  if (modalSpecsTable && product.details) {
    modalSpecsTable.innerHTML = Object.entries(product.details).map(([k, v]) => `
      <tr>
        <td>${k}</td>
        <td>${v}</td>
      </tr>
    `).join('');
  }

  const hasSpecificPrice = formattedPrice && formattedPrice !== 'Price on Request';
  const priceSnippet = hasSpecificPrice ? ` (${formattedPrice})` : '';
  const enquiryAspect = hasSpecificPrice ? 'availability & consultation' : 'pricing, availability & consultation';
  const waMsg = `Hello Siddhi, I am interested in ordering/customizing "${product.name}"${priceSnippet} from Bloom&blush. Please share ${enquiryAspect}.`;
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
  if (modalWaBtn) modalWaBtn.href = waUrl;

  const backdrop = document.getElementById('product-modal-backdrop');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeProductModal() {
  const backdrop = document.getElementById('product-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('modal-open');
}

/**
 * Mobile Drawer Menu
 */
function initMobileDrawer() {
  const btnOpen = document.getElementById('mobile-menu-btn') || document.getElementById('btn-mobile-menu');
  const btnClose = document.getElementById('mobile-close-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('modal-open');
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'false');
  }

  if (btnOpen) btnOpen.addEventListener('click', openDrawer);
  if (btnClose) btnClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
}

function setupHeaderWhatsAppLinks() {
  const generalWaMsg = `Hello Siddhi, I would like to consult about bespoke gifting & floral creations from Bloom&blush.`;
  const generalWaUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(generalWaMsg)}`;

  const headerWa = document.getElementById('header-wa-btn');
  const drawerWa = document.getElementById('drawer-wa-btn');
  const floatingWa = document.getElementById('floating-wa-btn');
  const mobileStickyWa = document.getElementById('mobile-sticky-wa-btn');

  if (headerWa) headerWa.href = generalWaUrl;
  if (drawerWa) drawerWa.href = generalWaUrl;
  if (floatingWa) floatingWa.href = generalWaUrl;
  if (mobileStickyWa) mobileStickyWa.href = generalWaUrl;
}

function initFirestoreSync() {
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    try {
      firestoreDb.collection('products').onSnapshot((snapshot) => {
        const cloudProducts = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          const isFake = (typeof isFakeProduct === 'function' && isFakeProduct(d)) || 
                         (typeof FAKE_PRODUCT_IDS !== 'undefined' && FAKE_PRODUCT_IDS.has(doc.id));
          if (!isFake) {
            cloudProducts.push(d);
          }
        });
        PRODUCTS = cloudProducts;
        renderCategory(CURRENT_CAT_ID, false);
      });
    } catch (e) {}
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
