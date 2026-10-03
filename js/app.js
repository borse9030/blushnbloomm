/**
 * ===================================================================
 * Bloom&blush - Boutique Gifting & Floral Studio
 * Client-Side Application Logic & Luxury Editorial Experience
 * Location: Pimpri-Chinchwad, Pune, Maharashtra
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Restore cached local state before initial DOM paint to prevent flicker
  restoreCachedData();

  // Initialize Core Application Components
  initBrandMeta();
  initHeroSlider();
  renderCollections();
  renderProducts('all');
  initCategoryFilters();
  renderOccasions();
  renderPortfolio('all');
  initPortfolioFilters();
  renderAchievements('all');
  initProductModal();
  initAchievementModal();
  initMobileNav();
  initScrollEffects();
  initWhatsAppButtons();
  initConsultationForm();
  initCounters();
  init3DTilt();
  initAboutVideoTrigger();
  handleUrlHashRouting();
  initScrollToning();
  initButtonPops();

  // Load & Sync collections, products, portfolio, and achievements dynamically
  loadCollectionsData();
  loadProductsData();
  loadPortfolioData();
  loadAchievementsData();
  setupSyncListeners();
});

/**
 * 01. Hero Slider Component (01 / 03 Controls)
 */
function initHeroSlider() {
  const slides = [
    'assets/images/hero.jpg',
    'assets/images/wedding_trousseau.jpg',
    'assets/images/money_garland_model.jpg'
  ];

  let currentSlide = 0;
  const imgEl = document.getElementById('hero-carousel-img');
  const counterEl = document.getElementById('hero-slide-counter');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');

  if (!imgEl || !counterEl) return;

  function setSlide(idx) {
    currentSlide = (idx + slides.length) % slides.length;
    imgEl.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    imgEl.style.opacity = '0.3';
    imgEl.style.transform = 'scale(0.98)';
    setTimeout(() => {
      imgEl.src = slides[currentSlide];
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1)';
    }, 200);
    counterEl.textContent = `0${currentSlide + 1} / 03`;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => setSlide(currentSlide - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => setSlide(currentSlide + 1));
  }

  // Auto advance every 7s
  let timer = setInterval(() => setSlide(currentSlide + 1), 7000);
  const frame = document.getElementById('hero-media-frame');
  if (frame) {
    frame.addEventListener('mouseenter', () => clearInterval(timer));
    frame.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = setInterval(() => setSlide(currentSlide + 1), 7000);
    });
  }
}

/**
 * 02. Curated Collections Rendering (Panel 02)
 */
function renderCollections() {
  const container = document.getElementById('collections-grid');
  const filterBar = document.getElementById('collections-filter-bar');
  if (!container) return;

  // Render Filter Pills in Collections Bar
  if (filterBar) {
    filterBar.innerHTML = [
      `<button type="button" class="col-filter-pill active" data-col="all">All Collections</button>`,
      ...COLLECTIONS.map(c => `
        <button type="button" class="col-filter-pill" data-col="${c.id}">${c.title}</button>
      `)
    ].join('');

    filterBar.querySelectorAll('.col-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.col-filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const colId = btn.dataset.col;
        renderCollectionsGrid(colId);
      });
    });
  }

  renderCollectionsGrid('all');
}

function renderCollectionsGrid(selectedId = 'all') {
  const container = document.getElementById('collections-grid');
  if (!container) return;

  const items = selectedId === 'all' 
    ? COLLECTIONS 
    : COLLECTIONS.filter(c => c.id === selectedId);

  container.innerHTML = items.map(col => `
    <article class="collection-editorial-card js-tilt-card js-explore-col" data-collection="${col.id}">
      <div class="col-card-media">
        <img src="${col.image}" alt="${col.title} - Bloom&blush Pune" loading="lazy">
      </div>
      <div class="col-card-footer">
        <h3 class="col-card-title">${col.title}</h3>
        <button type="button" class="btn-circle-arrow js-col-arrow" data-collection="${col.id}" aria-label="Explore ${col.title}">
          &rarr;
        </button>
      </div>
    </article>
  `).join('');

  // Handle click on collection card -> scroll to featured and filter creations
  container.querySelectorAll('.js-explore-col, .js-col-arrow').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const colId = el.dataset.collection || (el.closest('.collection-editorial-card') ? el.closest('.collection-editorial-card').dataset.collection : null);
      if (colId) {
        filterProductsByCollection(colId);
        const featuredSec = document.getElementById('featured');
        if (featuredSec) {
          featuredSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  init3DTilt();
  refreshScrollToning();
}

/**
 * 03. Featured Creations Rendering (Panel 03 - Asymmetric Editorial Showcase)
 */
function renderProducts(filterCollectionId = 'all') {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = filterCollectionId === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.collectionId === filterCollectionId);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem;">
        <p style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--burgundy-deep);">No creations found in this collection.</p>
        <p style="font-size: 0.92rem; color: var(--text-muted); margin-top: 0.5rem;">Select "All Creations" above or chat with Siddhi Kokate on WhatsApp for bespoke orders.</p>
      </div>
    `;
    return;
  }

  // When "All Creations" is selected, render the signature Asymmetric Editorial Showcase matching Panel 03
  if (filterCollectionId === 'all') {
    // 1. Featured left item: "The Blush & Wine Bridal Bouquet" (or first item with 'Bridal Favorite' / featured)
    const featuredProduct = filtered.find(p => p.id === 'blush-petal-bridal-bouquet' || (p.badge && p.badge.toLowerCase().includes('bridal'))) || filtered[0];
    
    // 2. Three right stacked compact items matching Panel 03:
    // "The Heirloom Keepsake Box", "Royal Wedding Mandap Decor", "Elegant Currency Garland"
    const compactProducts = [
      filtered.find(p => p.id === 'bespoke-sandalwood-keepsake-box') || filtered.find(p => p.category === 'Customized Gifts') || filtered[1],
      filtered.find(p => p.id === 'royal-wedding-mandap-decor') || filtered.find(p => p.category.includes('Wedding')) || filtered[2],
      filtered.find(p => p.id === 'grand-rajputana-money-garland') || filtered.find(p => p.category === 'Money Garlands') || filtered[3]
    ].filter(Boolean);

    container.innerHTML = `
      <div class="featured-creations-editorial-grid">
        <!-- Left: Large Featured Highlight -->
        <article class="creation-featured-large js-tilt-card js-open-product" data-product-id="${featuredProduct.id}">
          <div class="creation-featured-media">
            <span class="featured-badge-overlay">${featuredProduct.badge || 'Bridal Favorite'}</span>
            <img src="${featuredProduct.image}" alt="${featuredProduct.name} - Bloom&blush" loading="lazy">
          </div>
          <div class="creation-card-info">
            <h3 class="creation-card-title">${featuredProduct.name}</h3>
            <p class="creation-card-desc">${featuredProduct.shortDesc}</p>
            <button type="button" class="btn-editorial-pill js-open-product-btn" data-product-id="${featuredProduct.id}">
              <span>View Details</span>
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </article>

        <!-- Right: 3 Stacked Editorial Creations -->
        <div class="creations-sub-grid">
          ${compactProducts.map(p => `
            <article class="creation-editorial-compact js-tilt-card js-open-product" data-product-id="${p.id}">
              <img src="${p.image}" alt="${p.name} - Bloom&blush" class="compact-thumb" loading="lazy">
              <div class="compact-info">
                <span class="compact-category">${p.category}</span>
                <h4 class="compact-title">${p.name}</h4>
              </div>
              <button type="button" class="btn-circle-arrow js-open-product-btn" data-product-id="${p.id}" aria-label="View ${p.name}">
                &rarr;
              </button>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // When filtered by specific collection, render a spacious editorial 3-column grid
    container.innerHTML = `
      <div class="creations-filtered-grid">
        ${filtered.map(p => `
          <article class="collection-editorial-card js-tilt-card js-open-product" data-product-id="${p.id}">
            <div class="col-card-media">
              ${p.badge ? `<span class="featured-badge-overlay" style="top:10px;left:10px;">${p.badge}</span>` : ''}
              <img src="${p.image}" alt="${p.name} - Bloom&blush" loading="lazy">
            </div>
            <div class="col-card-footer" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
              <span class="compact-category">${p.category}</span>
              <h3 class="col-card-title">${p.name}</h3>
              <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-top: 0.5rem;">
                <span style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--burgundy-deep); font-weight: 600;">
                  ${p.priceFormatted || (p.price ? '₹' + p.price : 'Custom')}
                </span>
                <button type="button" class="btn-circle-arrow js-open-product-btn" data-product-id="${p.id}" aria-label="View details of ${p.name}">
                  &rarr;
                </button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  // Bind Open Product triggers on cards and buttons
  container.querySelectorAll('.js-open-product, .js-open-product-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const pId = el.dataset.productId || (el.closest('[data-product-id]') ? el.closest('[data-product-id]').dataset.productId : null);
      if (pId) openProductModal(pId);
    });
  });

  init3DTilt();
  refreshScrollToning();
}

/**
 * Filter button interactions for Featured Creations
 */
function initCategoryFilters() {
  const filterContainer = document.getElementById('filter-bar');
  if (!filterContainer) return;

  const buttonsHtml = [
    `<button type="button" class="filter-btn active" data-filter="all">All Creations</button>`,
    ...COLLECTIONS.map(col => `
      <button type="button" class="filter-btn" data-filter="${col.id}">${col.title}</button>
    `)
  ].join('');

  filterContainer.innerHTML = buttonsHtml;

  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderProducts(filter);
    });
  });
}

function filterProductsByCollection(colId) {
  const filterContainer = document.getElementById('filter-bar');
  if (filterContainer) {
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.dataset.filter === colId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  renderProducts(colId);
}

/**
 * 05. Occasions Section (Panel 05 - 5 Tall Portrait Cards)
 */
function renderOccasions() {
  const container = document.getElementById('occasions-grid');
  if (!container) return;

  // 5 Canonical Occasions matching Panel 05
  const displayOccasions = [
    { title: 'Weddings & Baraat', image: 'assets/images/money_garland.jpg' },
    { title: 'Engagements & Roka', image: 'assets/images/editorial_bouquet.jpg' },
    { title: 'Milestone Birthdays', image: 'assets/images/luxury_hamper.jpg' },
    { title: 'Anniversaries', image: 'assets/images/floral_dome.jpg' },
    { title: 'Festive Celebrations', image: 'assets/images/pastel_garland.jpg' }
  ];

  container.innerHTML = displayOccasions.map(occ => `
    <article class="occasion-editorial-card js-tilt-card js-occasion-action" data-occasion="${occ.title}">
      <div class="occasion-card-media">
        <img src="${occ.image}" alt="${occ.title} - Bloom&blush Gifting Pune" loading="lazy">
      </div>
      <div class="occasion-card-footer">
        <h3 class="occasion-card-title">${occ.title}</h3>
        <button type="button" class="btn-circle-arrow js-occ-btn" data-occasion="${occ.title}" aria-label="Enquire for ${occ.title}">
          &rarr;
        </button>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.js-occasion-action, .js-occ-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const occName = el.dataset.occasion || (el.closest('[data-occasion]') ? el.closest('[data-occasion]').dataset.occasion : '');
      const text = `Hello Siddhi, I am planning for a *${occName}* celebration and would love to enquire about Bloom&blush bespoke creations.`;
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  });

  init3DTilt();
  refreshScrollToning();
}

/**
 * 06. Portfolio / Instagram Section (Panel 06 - Visual Stories)
 */
function initPortfolioFilters() {
  const filterBar = document.getElementById('portfolio-filter-bar');
  if (!filterBar) return;

  filterBar.querySelectorAll('.port-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.port-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderPortfolio(filter);
    });
  });
}

function renderPortfolio(categoryFilter = 'all') {
  const container = document.getElementById('portfolio-gallery');
  if (!container) return;

  let items = [...PORTFOLIO_ITEMS];
  if (categoryFilter !== 'all') {
    items = items.filter(item => {
      const cat = (item.category || '').toLowerCase();
      const tag = (item.tags || []).map(t => t.toLowerCase());
      const f = categoryFilter.toLowerCase();
      return cat.includes(f) || tag.includes(f);
    });
  }

  // Fallback to all items if filtered subset is empty
  if (items.length === 0) items = PORTFOLIO_ITEMS;

  const instaIcon = `<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

  container.innerHTML = items.slice(0, 8).map(item => {
    const isReel = !!(item.videoUrl || (item.linkUrl && item.linkUrl.includes('/reel/')) || (item.tags && item.tags.some(t => t.toLowerCase().includes('reel') || t.toLowerCase().includes('video'))));
    const duration = item.duration || '0:15';
    return `
    <div class="portfolio-journal-card js-tilt-card js-portfolio-item" data-id="${item.id}" role="button" tabindex="0" aria-label="${escapeHtml(item.title)} on Instagram">
      <img src="${item.image}" alt="${escapeHtml(item.title)} - Bloom&blush" loading="lazy">
      
      <!-- Top badges: Reel Indicator + Instagram Icon -->
      <div class="portfolio-card-top-badges">
        <span class="portfolio-pill-badge">
          ${isReel ? `
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4h3l-2-4H3c-.6 0-1 .4-1 1v3h2zm5 0h4l-2-4H9l2 4zm6 0h4l-2-4h-2l2 4zM4 10v8h16v-8H4z"/></svg>
            <span>Reel</span>
          ` : `
            <span>Story</span>
          `}
        </span>
        <div class="portfolio-insta-badge" aria-hidden="true">${instaIcon}</div>
      </div>

      <!-- Center Play Icon Hover Effect -->
      <div class="portfolio-play-center-btn" aria-hidden="true">
        <div class="play-btn-circle">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFFFFF"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>

      <!-- Card Bottom Overlay -->
      <div class="portfolio-card-overlay">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span class="portfolio-overlay-cat">${escapeHtml(item.category || 'Handcrafted')}</span>
          <span style="font-size: 0.7rem; color: var(--accent-gold-light); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> ${duration}
          </span>
        </div>
        <h4 class="portfolio-overlay-title">${escapeHtml(item.title)}</h4>
        <div style="margin-top: 0.45rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.74rem; color: #FFFFFF; font-weight: 600; text-shadow: 0 1px 3px rgba(0,0,0,0.8); display: inline-flex; align-items: center; gap: 4px;">
            ▶ Play Reel on Website
          </span>
          <span style="font-size: 0.68rem; color: var(--accent-gold-light); opacity: 0.85;">@blushnbloomm.in</span>
        </div>
      </div>
    </div>
  `}).join('');

  // Bind click on portfolio cards to open Instagram modal
  container.querySelectorAll('.js-portfolio-item').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const found = items.find(it => it.id === id);
      if (found) openInstagramModal(found);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.dataset.id;
        const found = items.find(it => it.id === id);
        if (found) openInstagramModal(found);
      }
    });
  });

  init3DTilt();
  refreshScrollToning();
}

function openInstagramModal(item) {
  const modal = document.getElementById('insta-post-modal');
  const body = document.getElementById('insta-modal-body');
  if (!modal || !body) return;

  const instaUrl = item.linkUrl || 'https://www.instagram.com/blushnbloomm.in?stkn=MTJxbzE1bHU5czRwNA==';
  const match = instaUrl.match(/\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  const shortcode = item.shortcode || (match ? match[2] : '');
  const videoSrc = item.videoUrl || (shortcode ? `assets/reels/${shortcode}.mp4` : null);
  const isVideo = !!videoSrc;

  const waMsg = encodeURIComponent(`Hello Siddhi! I was watching your reel "${item.title}" on Bloom&blush website and would love to customize an order. Could you share pricing, crafting time, and dispatch options for Pimpri-Chinchwad / Pune?`);
  const waUrl = `https://wa.me/918180879442?text=${waMsg}`;

  body.innerHTML = `
    <!-- Left Media Column: Native In-Site Video Player or Image -->
    <div style="flex: 1.15; background: #000000; display: flex; align-items: center; justify-content: center; min-height: 440px; position: relative; overflow: hidden;">
      ${isVideo ? `
        <div class="reel-player-stage" id="reel-player-stage">
          <video id="reel-native-video"
                 src="${videoSrc}"
                 poster="${item.image}"
                 playsinline
                 loop
                 autoplay
                 muted
                 preload="auto"
                 class="reel-video-element"
                 aria-label="${escapeHtml(item.title)} reel video">
          </video>

          <!-- Floating Sound Toggle Button -->
          <button type="button" class="reel-sound-pill" id="btn-reel-sound" title="Toggle Sound">
            <svg id="reel-sound-svg-muted" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <svg id="reel-sound-svg-unmuted" viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style="display: none;">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <span id="reel-sound-label">Unmute Audio</span>
          </button>

          <!-- Top-Right Floating Controls (Fullscreen) -->
          <div class="reel-floating-controls">
            <button type="button" class="reel-ctrl-btn" id="btn-reel-fullscreen" title="Fullscreen View">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>
          </div>

          <!-- Centered Play / Pause Animation Icon -->
          <div class="reel-center-play-badge" id="reel-center-play-badge" style="display: none;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFFFFF"><path d="M8 5v14l11-7z"/></svg>
          </div>

          <!-- Scrubbing Timeline Progress Bar -->
          <div class="reel-progress-wrap" id="reel-progress-wrap" title="Seek video">
            <div class="reel-progress-fill" id="reel-progress-fill"></div>
          </div>
        </div>
      ` : `
        <img src="${item.image}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: contain; max-height: 70vh;">
      `}
    </div>

    <!-- Right Content Column: Studio Metadata & Authentic Caption -->
    <div style="flex: 1; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; background: #FFFFFF; min-width: 320px;">
      <div>
        <!-- Instagram Profile Banner Header -->
        <div style="display: flex; align-items: center; gap: 0.75rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(0,0,0,0.08); margin-bottom: 1.25rem;">
          <div style="width: 44px; height: 44px; border-radius: 50%; padding: 2px; background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF); display: flex;">
            <img src="assets/images/web_logo.png" alt="Siddhi Kokate" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #FFF;">
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="font-weight: 700; font-size: 0.95rem; color: var(--burgundy-deep);">@blushnbloomm.in</span>
              <svg viewBox="0 0 24 24" width="15" height="15" style="color: #0095F6;"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Siddhi Kokate &bull; Floral &amp; Gifting Studio &bull; Pune</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
          <span style="display: inline-block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-gold); font-weight: 700;">
            ${escapeHtml(item.category || 'Handcrafted')}
          </span>
          <span style="font-size: 0.7rem; background: rgba(94, 13, 24, 0.08); color: var(--burgundy-deep); padding: 2px 7px; border-radius: 8px; font-weight: 600;">
            ▶ Authentic Reel
          </span>
        </div>

        <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--burgundy-deep); margin-bottom: 0.85rem; line-height: 1.3;">
          ${escapeHtml(item.title)}
        </h3>

        <!-- Full Authentic Caption with Marathi/Hindi lines preserved -->
        <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem; white-space: pre-line; max-height: 160px; overflow-y: auto; padding-right: 0.5rem;">
          ${escapeHtml(item.caption || 'Handcrafted bespoke piece designed with fine floral artistry, zardozi brocade, and ceremonial grandeur at Bloom&blush studio in Pimpri-Chinchwad, Pune.')}
        </div>

        ${Array.isArray(item.tags) && item.tags.length > 0 ? `
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            ${item.tags.map(t => `<span style="font-size: 0.74rem; background: var(--cream-ivory); border: 1px solid rgba(197, 168, 128, 0.3); padding: 3px 9px; border-radius: 12px; color: var(--text-secondary);">#${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Action Buttons: Direct WhatsApp Customization + Instagram Post -->
      <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 1rem; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 1.25rem;">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; justify-content: center; text-align: center; gap: 0.5rem; background: #25D366; border-color: #25D366; color: #FFF; font-weight: 600;">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
          <span>Enquire About This Reel on WhatsApp</span>
        </a>

        <a href="${instaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary js-instagram-link" style="width: 100%; justify-content: center; text-align: center; gap: 0.5rem; font-size: 0.84rem;">
          <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <span>View on Instagram (@blushnbloomm.in)</span>
        </a>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Wire up native video player interactive features
  if (isVideo) {
    const video = document.getElementById('reel-native-video');
    const soundBtn = document.getElementById('btn-reel-sound');
    const soundMutedSvg = document.getElementById('reel-sound-svg-muted');
    const soundUnmutedSvg = document.getElementById('reel-sound-svg-unmuted');
    const soundLabel = document.getElementById('reel-sound-label');
    const centerBadge = document.getElementById('reel-center-play-badge');
    const progressFill = document.getElementById('reel-progress-fill');
    const progressWrap = document.getElementById('reel-progress-wrap');
    const fsBtn = document.getElementById('btn-reel-fullscreen');

    if (video) {
      video.play().catch(() => {
        // Autoplay policy prevented playback, keep muted
        video.muted = true;
        video.play().catch(() => {});
      });

      // Click video to toggle Play / Pause
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          if (centerBadge) {
            centerBadge.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="#FFFFFF"><path d="M8 5v14l11-7z"/></svg>';
            centerBadge.style.display = 'flex';
            setTimeout(() => { centerBadge.style.display = 'none'; }, 350);
          }
        } else {
          video.pause();
          if (centerBadge) {
            centerBadge.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="#FFFFFF"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            centerBadge.style.display = 'flex';
          }
        }
      });

      // Sound toggle button
      if (soundBtn) {
        soundBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          if (video.muted) {
            soundMutedSvg.style.display = 'block';
            soundUnmutedSvg.style.display = 'none';
            soundLabel.textContent = 'Unmute Audio';
          } else {
            soundMutedSvg.style.display = 'none';
            soundUnmutedSvg.style.display = 'block';
            soundLabel.textContent = 'Mute Audio';
          }
        });
      }

      // Progress bar updates
      video.addEventListener('timeupdate', () => {
        if (progressFill && video.duration) {
          const pct = (video.currentTime / video.duration) * 100;
          progressFill.style.width = `${pct}%`;
        }
      });

      // Seek on progress bar click
      if (progressWrap) {
        progressWrap.addEventListener('click', (e) => {
          e.stopPropagation();
          const rect = progressWrap.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(1, clickX / rect.width));
          if (video.duration) {
            video.currentTime = pct * video.duration;
          }
        });
      }

      // Fullscreen
      if (fsBtn) {
        fsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!document.fullscreenElement) {
            const stage = document.getElementById('reel-player-stage');
            if (stage && stage.requestFullscreen) stage.requestFullscreen();
            else if (video.requestFullscreen) video.requestFullscreen();
          } else {
            if (document.exitFullscreen) document.exitFullscreen();
          }
        });
      }
    }
  }

  const closeBtn = document.getElementById('btn-close-insta-modal');
  if (closeBtn) {
    closeBtn.onclick = closeInstagramModal;
  }
  modal.onclick = (e) => {
    if (e.target === modal) closeInstagramModal();
  };
}

function closeInstagramModal() {
  const modal = document.getElementById('insta-post-modal');
  if (modal) {
    const video = modal.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const body = document.getElementById('insta-modal-body');
    if (body) body.innerHTML = '';
  }
  document.body.style.overflow = '';
}

// Global escape listener for modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeInstagramModal();
});

function normalizeMediaUrl(url, defaultType = 'image') {
  if (!url) return '';
  url = url.trim();
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  let clean = url.replace(/^\/+/, '');
  const base = clean.split('/').pop();
  if (base.endsWith('.mp4') || base.endsWith('.webm') || base.endsWith('.ogg')) {
    return 'assets/videos/' + base;
  }
  if (base.endsWith('.jpg') || base.endsWith('.png') || base.endsWith('.jpeg') || base.endsWith('.webp') || base.endsWith('.svg')) {
    return 'assets/images/' + base;
  }
  if (clean.startsWith('public/')) {
    clean = clean.replace(/^public\//, 'assets/');
  }
  return clean;
}

/**
 * 07. Achievements Section (Panel 07 - KPI Stats & Milestone Reels)
 */
function renderAchievements(filter = 'all') {
  const container = document.getElementById('achievements-grid');
  if (!container) return;

  const dataset = (Array.isArray(ACHIEVEMENTS) && ACHIEVEMENTS.length > 0)
    ? ACHIEVEMENTS 
    : (typeof DEFAULT_ACHIEVEMENTS !== 'undefined' ? DEFAULT_ACHIEVEMENTS : []);

  const displayItems = filter === 'all' 
    ? dataset 
    : dataset.filter(item => {
        const cat = (item.category || '').toLowerCase();
        const f = filter.toLowerCase();
        return cat.includes(f);
      });

  const itemsToRender = displayItems.length > 0 ? displayItems : dataset;
  container.dataset.count = itemsToRender.length;

  container.innerHTML = itemsToRender.map(item => {
    const isVideo = item.mediaType === 'video' || (item.mediaUrl && (item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.webm')));
    const mediaUrl = normalizeMediaUrl(item.mediaUrl, 'video');
    let poster = normalizeMediaUrl(item.thumbnailUrl, 'image');

    if (!poster || poster.endsWith('.mp4')) {
      if (item.id === 'ach-lalbaugcha-raja-garland-1' || (mediaUrl && mediaUrl.includes('398718527598'))) {
        poster = 'assets/images/reel_garland_preview.jpg';
      } else if (item.id === 'ach-lalbaugcha-raja-garland-2' || (mediaUrl && mediaUrl.includes('399154073737'))) {
        poster = 'assets/images/reel_styling_preview.jpg';
      } else {
        poster = 'assets/images/hero.jpg';
      }
    }

    if (isVideo && mediaUrl) {
      return `
        <article class="milestone-editorial-card milestone-video-card js-tilt-card js-open-achieve" data-achieve-id="${item.id}" role="button" tabindex="0" aria-label="Watch ${escapeHtml(item.title)}">
          <div class="milestone-media milestone-video-media">
            <video 
              class="milestone-card-video" 
              src="${escapeHtml(mediaUrl)}" 
              poster="${escapeHtml(poster)}" 
              muted 
              playsinline 
              loop 
              preload="metadata"
            ></video>
            <div class="milestone-media-shade" aria-hidden="true"></div>

            <div class="milestone-top-badges">
              ${item.badge ? `<span class="milestone-badge-pill">${escapeHtml(item.badge)}</span>` : ''}
              <span class="milestone-format-pill">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4h3l-2-4H3c-.6 0-1 .4-1 1v3h2zm5 0h4l-2-4H9l2 4zm6 0h4l-2-4h-2l2 4zM4 10v8h16v-8H4z"/></svg>
                <span>Reel ${escapeHtml(item.duration || '')}</span>
              </span>
            </div>

            <div class="milestone-play-center" aria-hidden="true">
              <div class="milestone-play-circle">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span class="milestone-play-label">Watch Full Reel</span>
            </div>

            <div class="milestone-inline-controls">
              <button type="button" class="btn-video-sound-toggle js-sound-toggle" data-achieve-id="${item.id}" aria-label="Toggle Sound" title="Sound On / Off">
                <svg class="icon-muted" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                <svg class="icon-unmuted" viewBox="0 0 24 24" width="16" height="16" style="display:none;"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              </button>
            </div>
          </div>
          <div class="milestone-body">
            <div class="milestone-meta-row">
              <span class="milestone-cat">${escapeHtml(item.category || 'Studio Milestone')}</span>
              ${item.date ? `<span class="milestone-date">${escapeHtml(item.date)}</span>` : ''}
            </div>
            <h4 class="milestone-title">${escapeHtml(item.title)}</h4>
            ${item.description ? `<p class="milestone-desc">${escapeHtml(item.description)}</p>` : ''}
            <div class="milestone-footer-row">
              <span class="milestone-cta-link">
                <span>View Ceremony Highlight</span>
                <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </article>
      `;
    }

    return `
      <article class="milestone-editorial-card js-tilt-card js-open-achieve" data-achieve-id="${item.id}" role="button" tabindex="0" aria-label="${escapeHtml(item.title)}">
        <div class="milestone-media">
          <img src="${escapeHtml(poster)}" alt="${escapeHtml(item.title)} - Bloom&blush" loading="lazy" onerror="this.src='assets/images/hero.jpg'">
          ${item.badge ? `<div class="milestone-top-badges"><span class="milestone-badge-pill">${escapeHtml(item.badge)}</span></div>` : ''}
        </div>
        <div class="milestone-body">
          <div class="milestone-meta-row">
            <span class="milestone-cat">${escapeHtml(item.category || 'Studio Milestone')}</span>
            ${item.date ? `<span class="milestone-date">${escapeHtml(item.date)}</span>` : ''}
          </div>
          <h4 class="milestone-title">${escapeHtml(item.title)}</h4>
          ${item.description ? `<p class="milestone-desc">${escapeHtml(item.description)}</p>` : ''}
          <div class="milestone-footer-row">
            <span class="milestone-cta-link">
              <span>View Milestone</span>
              <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Wire up video card interactive controls
  container.querySelectorAll('.milestone-video-card').forEach(card => {
    const video = card.querySelector('video.milestone-card-video');
    const soundBtn = card.querySelector('.js-sound-toggle');
    if (!video) return;

    // Hover muted preview
    card.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          card.classList.add('is-playing');
        }).catch(() => {});
      }
    });

    card.addEventListener('mouseleave', () => {
      if (video.muted) {
        video.pause();
        card.classList.remove('is-playing');
      }
    });

    // Sound toggle button on card
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const iconMuted = soundBtn.querySelector('.icon-muted');
        const iconUnmuted = soundBtn.querySelector('.icon-unmuted');

        if (video.muted) {
          // Pause and mute other videos on page
          document.querySelectorAll('.milestone-card-video').forEach(v => {
            if (v !== video) {
              v.muted = true;
              v.pause();
              const otherCard = v.closest('.milestone-video-card');
              if (otherCard) {
                otherCard.classList.remove('is-playing');
                const btn = otherCard.querySelector('.js-sound-toggle');
                if (btn) {
                  const m = btn.querySelector('.icon-muted');
                  const u = btn.querySelector('.icon-unmuted');
                  if (m) m.style.display = 'block';
                  if (u) u.style.display = 'none';
                }
              }
            }
          });

          video.muted = false;
          video.play().then(() => {
            card.classList.add('is-playing');
            if (iconMuted) iconMuted.style.display = 'none';
            if (iconUnmuted) iconUnmuted.style.display = 'block';
          }).catch(() => {});
        } else {
          video.muted = true;
          if (iconMuted) iconMuted.style.display = 'block';
          if (iconUnmuted) iconUnmuted.style.display = 'none';
        }
      });
    }
  });

  // Card click opens modal
  container.querySelectorAll('.js-open-achieve').forEach(el => {
    el.addEventListener('click', () => {
      const achId = el.dataset.achieveId;
      document.querySelectorAll('.milestone-card-video').forEach(v => v.pause());
      if (achId) openAchievementModal(achId);
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const achId = el.dataset.achieveId;
        document.querySelectorAll('.milestone-card-video').forEach(v => v.pause());
        if (achId) openAchievementModal(achId);
      }
    });
  });

  init3DTilt();
  refreshScrollToning();
}

/**
 * 08. Contact Section Consultation Form Handler (Panel 08)
 */
function initConsultationForm() {
  const form = document.getElementById('consultation-enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (form.name.value || '').trim();
    const phone = (form.phone.value || '').trim();
    const occasion = form.occasion.value || 'Celebration Gifting';
    const message = (form.message.value || '').trim();

    const formattedMessage = [
      `Hello Siddhi, I would like to enquire about bespoke creations from Bloom&blush:`,
      `• *Name:* ${name}`,
      `• *Phone:* ${phone}`,
      `• *Occasion:* ${occasion}`,
      message ? `• *Message:* ${message}` : null,
      `\nKindly let me know about availability and consultation.`
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, '_blank');
  });

  const contactWaLink = document.getElementById('contact-details-wa-link');
  if (contactWaLink) {
    contactWaLink.href = getWhatsAppGeneralUrl();
  }
}

/**
 * About Craftsmanship Video Lightbox Trigger
 */
function initAboutVideoTrigger() {
  const btnPlay = document.getElementById('btn-about-play');
  if (!btnPlay) return;

  btnPlay.addEventListener('click', () => {
    // Open the studio reel / story modal
    const videoItem = ACHIEVEMENTS.find(a => a.mediaType === 'video') || ACHIEVEMENTS[0];
    if (videoItem) {
      openAchievementModal(videoItem.id);
    } else {
      window.open(CONFIG.instagramUrl, '_blank');
    }
  });
}

/**
 * Animated KPI Statistics Counter with Celebratory Pop
 */
function initCounters() {
  const statNumbers = document.querySelectorAll('.kpi-stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let start = 0;
        const step = Math.max(1, Math.floor(target / 25));
        const interval = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = `${target}+`;
            el.classList.add('popped');
            clearInterval(interval);
          } else {
            el.textContent = `${start}+`;
          }
        }, 14);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));

  // Also pop the 4.9★ rating card when visible
  const ratingEl = document.querySelector('.kpi-stat-number:not([data-target])');
  if (ratingEl) {
    const rObs = new IntersectionObserver((entries, obs) => {
      if (entries[0] && entries[0].isIntersecting) {
        ratingEl.classList.add('popped');
        obs.unobserve(ratingEl);
      }
    }, { threshold: 0.5 });
    rObs.observe(ratingEl);
  }
}

/**
 * Subtle 3D Perspective Tilt Interactivity
 */
function init3DTilt() {
  // If device prefers reduced motion or is small mobile, skip heavy transforms
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 768) {
    return;
  }

  const tiltCards = document.querySelectorAll('.js-tilt-card:not(.tilt-bound)');
  tiltCards.forEach(card => {
    card.classList.add('tilt-bound');
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.25s ease-out';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * Smooth Toning Scroll-Triggered Reveal Animations
 */
let toningObserver = null;

function initScrollToning() {
  if (toningObserver) {
    toningObserver.disconnect();
  }

  const elements = document.querySelectorAll(
    '.editorial-section-header, .collection-editorial-card, .creation-featured-large, .creation-editorial-compact, .occasion-editorial-card, .portfolio-journal-card, .kpi-stat-card, .milestone-editorial-card, .contact-editorial-layout, .about-editorial-grid, .hero-trust-bar'
  );

  toningObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('toned-in');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  elements.forEach(el => {
    if (!el.classList.contains('toned-in')) {
      el.classList.add('tone-reveal');
      toningObserver.observe(el);
    }
  });
}

function refreshScrollToning() {
  setTimeout(() => {
    initScrollToning();
  }, 60);
}

/**
 * Spring Popping Micro-interactions for Buttons & Triggers
 */
function initButtonPops() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(
      '.btn, .btn-editorial-primary, .btn-editorial-secondary, .btn-editorial-pill, .btn-circle-arrow, .filter-btn, .col-filter-pill, .port-filter-pill, .btn-header-wa'
    );
    if (!trigger) return;

    trigger.classList.remove('popped');
    void trigger.offsetWidth; // Force DOM reflow to retrigger animation
    trigger.classList.add('popped');
    setTimeout(() => {
      trigger.classList.remove('popped');
    }, 380);
  });
}

/**
 * ===================================================================
 * Modals & Dynamic Data Synchronization
 * ===================================================================
 */

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getWhatsAppProductUrl(productName, price) {
  const priceSnippet = price ? ` (${price})` : '';
  const message = `Hello Siddhi, I am interested in the *${productName}*${priceSnippet} from Bloom&blush. Could you please share details regarding customization options and availability? Thank you!`;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getWhatsAppGeneralUrl() {
  const message = `Hello Siddhi, I came across Bloom&blush and would love to enquire about your customized gifting and floral arrangements in Pune.`;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getWhatsAppAchievementUrl(achievementTitle) {
  const phone = CONFIG.whatsappNumber || '918180879442';
  const text = `Hello Siddhi, I saw your studio highlight "${achievementTitle}" on Bloom&blush and would love to enquire!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function initBrandMeta() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll('.js-instagram-handle').forEach(el => {
    el.textContent = CONFIG.instagramHandle;
  });

  document.querySelectorAll('.js-instagram-link').forEach(el => {
    el.href = CONFIG.instagramUrl;
  });

  document.querySelectorAll('.js-whatsapp-number').forEach(el => {
    el.textContent = `+${CONFIG.whatsappNumber.replace(/(\d{2})(\d{5})(\d{5})/, '$1 $2 $3')}`;
  });

  document.querySelectorAll('.js-business-location').forEach(el => {
    el.textContent = CONFIG.location;
  });
}

function initWhatsAppButtons() {
  const generalUrl = getWhatsAppGeneralUrl();

  const heroWaBtn = document.getElementById('hero-wa-btn');
  if (heroWaBtn) heroWaBtn.href = generalUrl;

  const headerWaBtn = document.getElementById('header-wa-btn');
  if (headerWaBtn) headerWaBtn.href = generalUrl;

  const floatingWaBtn = document.getElementById('floating-wa-btn');
  if (floatingWaBtn) floatingWaBtn.href = generalUrl;

  const drawerWaBtn = document.getElementById('drawer-wa-btn');
  if (drawerWaBtn) drawerWaBtn.href = generalUrl;

  const footerWaBtn = document.getElementById('footer-wa-btn');
  if (footerWaBtn) footerWaBtn.href = generalUrl;

  const mobileStickyWaBtn = document.getElementById('mobile-sticky-wa-btn');
  if (mobileStickyWaBtn) mobileStickyWaBtn.href = generalUrl;
}

/**
 * Product Details Modal Management
 */
let currentOpenProductId = null;

function initProductModal() {
  const backdrop = document.getElementById('product-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', closeProductModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeProductModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductModal();
  });
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentOpenProductId = productId;
  window.location.hash = `product-${productId}`;

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
  const mobileStickyWaBtn = document.getElementById('mobile-sticky-wa-btn');

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

  const formattedPrice = product.priceFormatted || (product.price ? `₹${product.price}` : '');
  if (modalPrice) modalPrice.textContent = formattedPrice;
  if (modalPriceNote) modalPriceNote.textContent = product.priceNote || 'Handcrafted on order';
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

  const waUrl = getWhatsAppProductUrl(product.name, formattedPrice);
  if (modalWaBtn) modalWaBtn.href = waUrl;
  if (mobileStickyWaBtn) mobileStickyWaBtn.href = waUrl;

  const backdrop = document.getElementById('product-modal-backdrop');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeProductModal() {
  const backdrop = document.getElementById('product-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('modal-open');
  currentOpenProductId = null;
  if (window.location.hash.startsWith('#product-')) {
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }
}

/**
 * Achievements Lightbox Modal
 */
function initAchievementModal() {
  const backdrop = document.getElementById('achievement-modal-backdrop');
  const closeBtn = document.getElementById('achieve-modal-close-btn');

  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', closeAchievementModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAchievementModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('active')) {
      closeAchievementModal();
    }
  });
}

function openAchievementModal(achieveId) {
  const item = ACHIEVEMENTS.find(a => a.id === achieveId) || {
    id: achieveId,
    title: 'Studio Milestone',
    category: 'Craftsmanship',
    image: 'assets/images/hero.jpg',
    mediaType: 'image',
    description: 'Bespoke floral and celebration creations hand-delivered across Pune.'
  };

  const backdrop = document.getElementById('achievement-modal-backdrop');
  const mediaWrapper = document.getElementById('achieve-modal-media-wrapper');
  const titleEl = document.getElementById('achieve-modal-title');
  const descEl = document.getElementById('achieve-modal-desc');
  const badgeEl = document.getElementById('achieve-modal-badge');
  const catEl = document.getElementById('achieve-modal-category');
  const dateEl = document.getElementById('achieve-modal-date');
  const waBtn = document.getElementById('achieve-modal-wa-btn');

  if (!backdrop || !mediaWrapper) return;

  const isVideo = item.mediaType === 'video' || (item.mediaUrl && (item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.webm')));
  const mediaUrl = normalizeMediaUrl(item.mediaUrl, 'video');
  let poster = normalizeMediaUrl(item.thumbnailUrl, 'image');

  if (!poster || poster.endsWith('.mp4')) {
    if (item.id === 'ach-lalbaugcha-raja-garland-1' || (mediaUrl && mediaUrl.includes('398718527598'))) {
      poster = 'assets/images/reel_garland_preview.jpg';
    } else if (item.id === 'ach-lalbaugcha-raja-garland-2' || (mediaUrl && mediaUrl.includes('399154073737'))) {
      poster = 'assets/images/reel_styling_preview.jpg';
    } else {
      poster = 'assets/images/hero.jpg';
    }
  }

  if (isVideo && mediaUrl) {
    mediaWrapper.innerHTML = `
      <video src="${escapeHtml(mediaUrl)}" controls autoplay playsinline loop preload="auto" poster="${escapeHtml(poster)}" style="max-height: 520px; width: 100%; border-radius: 12px;"></video>
    `;
  } else {
    mediaWrapper.innerHTML = `
      <img src="${escapeHtml(poster || mediaUrl || item.image)}" alt="${escapeHtml(item.title)} - Bloom&blush" style="max-height: 520px; width: 100%; object-fit: contain; border-radius: 12px;">
    `;
  }

  if (titleEl) titleEl.textContent = item.title || '';
  if (descEl) descEl.textContent = item.description || '';
  if (badgeEl) badgeEl.textContent = item.badge || 'Studio Highlight';
  if (catEl) catEl.textContent = item.category || 'Milestone';
  if (dateEl) dateEl.textContent = item.date || '';

  if (waBtn) waBtn.href = getWhatsAppAchievementUrl(item.title);

  backdrop.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeAchievementModal() {
  const backdrop = document.getElementById('achievement-modal-backdrop');
  const mediaWrapper = document.getElementById('achieve-modal-media-wrapper');

  if (backdrop) backdrop.classList.remove('active');
  document.body.classList.remove('modal-open');

  if (mediaWrapper) {
    const video = mediaWrapper.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
    }
    mediaWrapper.innerHTML = '';
  }
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-close-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (!menuBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    menuBtn.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  };

  const closeDrawer = () => {
    menuBtn.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  menuBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDrawer));
}

/**
 * Scroll Effects: Sticky Header & Nav Spy
 */
function initScrollEffects() {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function handleUrlHashRouting() {
  const checkHash = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#product-')) {
      const pId = hash.replace('#product-', '');
      openProductModal(pId);
    } else if (currentOpenProductId) {
      closeProductModal();
    }
  };

  window.addEventListener('hashchange', checkHash);
  checkHash();
}

/**
 * Data Synchronization (Firestore, localStorage, broadcast)
 */
function restoreCachedData() {
  try {
    const cCol = localStorage.getItem('bloom_custom_collections');
    if (cCol) {
      const parsed = JSON.parse(cCol);
      if (Array.isArray(parsed) && parsed.length > 0) COLLECTIONS = parsed;
    }
  } catch (e) {}

  try {
    const cProd = localStorage.getItem('bloom_custom_products');
    if (cProd) {
      const parsed = JSON.parse(cProd);
      if (Array.isArray(parsed) && parsed.length > 0) PRODUCTS = parsed;
    }
  } catch (e) {}

  try {
    const cPort = localStorage.getItem('bloom_custom_portfolio');
    if (cPort) {
      const parsed = JSON.parse(cPort);
      // Only keep if it is not the old mock data (which lacked videoUrl or used assets/images/)
      const isLegacy = Array.isArray(parsed) && parsed.some(it => 
        it.id === 'port-sovereign-garland' || 
        !(it.linkUrl || '').includes('/reel/') ||
        !it.videoUrl ||
        (it.image && it.image.includes('assets/images/'))
      );
      if (Array.isArray(parsed) && parsed.length > 0 && !isLegacy) {
        PORTFOLIO_ITEMS = parsed;
      } else {
        localStorage.removeItem('bloom_custom_portfolio');
      }
    }
  } catch (e) {}

  try {
    const cAch = localStorage.getItem('bloom_custom_achievements');
    if (cAch) {
      const parsed = JSON.parse(cAch);
      if (Array.isArray(parsed) && parsed.length > 0) {
        ACHIEVEMENTS = parsed.map(item => {
          if (item.id === 'ach-lalbaugcha-raja-garland-1') {
            if (!item.thumbnailUrl || item.thumbnailUrl.endsWith('.mp4')) {
              item.thumbnailUrl = 'assets/images/reel_garland_preview.jpg';
            }
          } else if (item.id === 'ach-lalbaugcha-raja-garland-2') {
            if (!item.thumbnailUrl || item.thumbnailUrl.endsWith('.mp4')) {
              item.thumbnailUrl = 'assets/images/reel_styling_preview.jpg';
            }
          }
          return item;
        });
        localStorage.setItem('bloom_custom_achievements', JSON.stringify(ACHIEVEMENTS));
      }
    }
  } catch (e) {}
}

async function loadCollectionsData() {
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    try {
      firestoreDb.collection('collections').onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const cloudCols = [];
          snapshot.forEach(doc => cloudCols.push(doc.data()));
          if (cloudCols.length > 0) {
            cloudCols.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            COLLECTIONS = cloudCols;
            try {
              localStorage.setItem('bloom_custom_collections', JSON.stringify(COLLECTIONS));
            } catch (err) {}
            renderCollections();
            initCategoryFilters();
            renderProducts('all');
          }
        }
      }, (err) => {
        console.warn('Firestore collections listener notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore collections init notice:', e);
    }
  }
}

async function loadProductsData() {
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    try {
      firestoreDb.collection('products').onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const cloudProducts = [];
          snapshot.forEach(doc => cloudProducts.push(doc.data()));
          if (cloudProducts.length > 0) {
            cloudProducts.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || (b.createdAt || 0) - (a.createdAt || 0));
            PRODUCTS = cloudProducts;
            try {
              localStorage.setItem('bloom_custom_products', JSON.stringify(PRODUCTS));
            } catch (err) {}
            renderProducts('all');
            initCategoryFilters();
          }
        }
      }, (err) => {
        console.warn('Firestore products listener notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore products init notice:', e);
    }
  }
}

async function loadPortfolioData() {
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    try {
      firestoreDb.collection('portfolio').onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const cloudPort = [];
          snapshot.forEach(doc => cloudPort.push(doc.data()));
          if (cloudPort.length > 0) {
            // Ensure authentic covers and videoUrls for all authentic reel stories
            const sanitized = cloudPort.map(item => {
              const match = (item.linkUrl || '').match(/\/(reel|p)\/([a-zA-Z0-9_-]+)/);
              const shortcode = item.shortcode || (match ? match[2] : '');
              const videoUrl = item.videoUrl || (shortcode ? `assets/reels/${shortcode}.mp4` : '');
              const image = (item.image && !item.image.includes('assets/images/')) ? item.image : (shortcode ? `assets/reels/${shortcode}.jpg` : item.image);
              return {
                ...item,
                image,
                videoUrl,
                shortcode
              };
            });
            sanitized.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            PORTFOLIO_ITEMS = sanitized;
            try {
              localStorage.setItem('bloom_custom_portfolio', JSON.stringify(PORTFOLIO_ITEMS));
            } catch (err) {}
            renderPortfolio('all');
            initPortfolioFilters();
          }
        }
      }, (err) => {
        console.warn('Firestore portfolio listener notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore portfolio init notice:', e);
    }
  }

  // Also verify portfolio.json fallback for immediate instant loading
  try {
    const res = await fetch('portfolio.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const local = localStorage.getItem('bloom_custom_portfolio');
        if (!local || !PORTFOLIO_ITEMS || PORTFOLIO_ITEMS.length === 0) {
          PORTFOLIO_ITEMS = data;
          renderPortfolio('all');
          initPortfolioFilters();
        }
      }
    }
  } catch (err) {}
}

async function loadAchievementsData() {
  // 1. Fetch achievements.json fallback for immediate, reliable loading
  try {
    const res = await fetch('achievements.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const local = localStorage.getItem('bloom_custom_achievements');
        const needsSync = !local || !ACHIEVEMENTS || ACHIEVEMENTS.length === 0 || ACHIEVEMENTS.some(a => a.thumbnailUrl && a.thumbnailUrl.endsWith('.mp4'));
        if (needsSync) {
          ACHIEVEMENTS = data;
          try {
            localStorage.setItem('bloom_custom_achievements', JSON.stringify(ACHIEVEMENTS));
          } catch (e) {}
          renderAchievements('all');
        }
      }
    }
  } catch (err) {}

  // 2. Firestore Cloud Database Listener
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    try {
      firestoreDb.collection('achievements').onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const cloudAch = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.id === 'ach-lalbaugcha-raja-garland-1' && (!data.thumbnailUrl || data.thumbnailUrl.endsWith('.mp4'))) {
              data.thumbnailUrl = 'assets/images/reel_garland_preview.jpg';
            } else if (data.id === 'ach-lalbaugcha-raja-garland-2' && (!data.thumbnailUrl || data.thumbnailUrl.endsWith('.mp4'))) {
              data.thumbnailUrl = 'assets/images/reel_styling_preview.jpg';
            }
            cloudAch.push(data);
          });
          if (cloudAch.length > 0) {
            cloudAch.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            ACHIEVEMENTS = cloudAch;
            try {
              localStorage.setItem('bloom_custom_achievements', JSON.stringify(ACHIEVEMENTS));
            } catch (err) {}
            renderAchievements('all');
          }
        }
      }, (err) => {
        console.warn('Firestore achievements listener notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore achievements init notice:', e);
    }
  }
}

function setupSyncListeners() {
  // Cross-tab BroadcastChannel Listeners
  if ('BroadcastChannel' in window) {
    try {
      const bcCol = new BroadcastChannel('bloom_collections_sync');
      bcCol.onmessage = (event) => {
        if (event.data && event.data.type === 'COLLECTIONS_UPDATED' && Array.isArray(event.data.collections)) {
          COLLECTIONS = event.data.collections;
          renderCollections();
          initCategoryFilters();
          renderProducts('all');
        }
      };

      const bcProd = new BroadcastChannel('bloom_product_sync');
      bcProd.onmessage = (event) => {
        if (event.data && event.data.type === 'PRODUCTS_UPDATED' && Array.isArray(event.data.products)) {
          PRODUCTS = event.data.products;
          renderProducts('all');
          initCategoryFilters();
        }
      };

      const bcPort = new BroadcastChannel('bloom_portfolio_sync');
      bcPort.onmessage = (event) => {
        if (event.data && event.data.type === 'PORTFOLIO_UPDATED' && Array.isArray(event.data.portfolio)) {
          PORTFOLIO_ITEMS = event.data.portfolio;
          renderPortfolio('all');
          initPortfolioFilters();
        }
      };

      const bcAch = new BroadcastChannel('bloom_achievements_sync');
      bcAch.onmessage = (event) => {
        if (event.data && event.data.type === 'ACHIEVEMENTS_UPDATED' && Array.isArray(event.data.achievements)) {
          ACHIEVEMENTS = event.data.achievements;
          renderAchievements('all');
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel sync init:', err);
    }
  }

  // Cross-window / Cross-tab Storage Events
  window.addEventListener('storage', (e) => {
    if (e.key === 'bloom_custom_collections' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          COLLECTIONS = parsed;
          renderCollections();
          initCategoryFilters();
          renderProducts('all');
        }
      } catch (err) {}
    } else if (e.key === 'bloom_custom_products' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          PRODUCTS = parsed;
          renderProducts('all');
          initCategoryFilters();
        }
      } catch (err) {}
    } else if (e.key === 'bloom_custom_portfolio' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          PORTFOLIO_ITEMS = parsed;
          renderPortfolio('all');
          initPortfolioFilters();
        }
      } catch (err) {}
    } else if (e.key === 'bloom_custom_achievements' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          ACHIEVEMENTS = parsed;
          renderAchievements('all');
        }
      } catch (err) {}
    }
  });
}
