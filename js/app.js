/**
 * ===================================================================
 * Bloom&blush - Boutique Gifting & Floral Studio
 * Client-Side Application Logic & WhatsApp Integration
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Application Components
  initBrandMeta();
  renderCollections();
  renderProducts('all');
  renderOccasions();
  renderPortfolio();
  initCategoryFilters();
  initProductModal();
  initMobileNav();
  initScrollEffects();
  initWhatsAppButtons();
  handleUrlHashRouting();

  // Load / Sync products dynamically from products.json or alternate website
  loadProductsData();
  setupSyncListeners();
});

/**
 * Sync with alternate website / products.json
 */
async function loadProductsData() {
  try {
    // 1. Check if alternate admin website saved products into localStorage
    const localData = localStorage.getItem('bloom_custom_products');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        PRODUCTS = parsed;
        renderProducts('all');
        initCategoryFilters();
        return;
      }
    }

    // 2. Fetch from products.json or configured API endpoint
    const endpoint = CONFIG.productsApiUrl || 'products.json';
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        PRODUCTS = data;
        renderProducts('all');
        initCategoryFilters();
      }
    }
  } catch (err) {
    // Fall back gracefully to PRODUCTS in data.js
    console.info('Using bundled PRODUCTS data.');
  }
}

/**
 * Listen for live updates from alternate website via localStorage or postMessage
 */
function setupSyncListeners() {
  window.addEventListener('storage', (e) => {
    if (e.key === 'bloom_custom_products' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          PRODUCTS = parsed;
          renderProducts('all');
          initCategoryFilters();
        }
      } catch (err) {}
    }
  });

  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'SYNC_PRODUCTS' && Array.isArray(e.data.products)) {
      PRODUCTS = e.data.products;
      localStorage.setItem('bloom_custom_products', JSON.stringify(PRODUCTS));
      renderProducts('all');
      initCategoryFilters();
    }
  });

  // Global programmatic sync API for alternate website, headless CMS, or admin panel
  window.bloomSyncProducts = function(newProducts) {
    if (Array.isArray(newProducts)) {
      PRODUCTS = newProducts;
      localStorage.setItem('bloom_custom_products', JSON.stringify(PRODUCTS));
      renderProducts('all');
      initCategoryFilters();
      console.log('Bloom&blush products synced successfully:', PRODUCTS.length, 'items');
      return true;
    }
    return false;
  };

  window.bloomAddProduct = function(newProduct) {
    if (newProduct && newProduct.name) {
      if (!newProduct.id) {
        newProduct.id = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      const existingIdx = PRODUCTS.findIndex(p => p.id === newProduct.id);
      if (existingIdx >= 0) {
        PRODUCTS[existingIdx] = newProduct;
      } else {
        PRODUCTS.unshift(newProduct);
      }
      localStorage.setItem('bloom_custom_products', JSON.stringify(PRODUCTS));
      renderProducts('all');
      initCategoryFilters();
      console.log('Bloom&blush product added/updated:', newProduct.name);
      return true;
    }
    return false;
  };
}

/**
 * Populate dynamic brand metadata from CONFIG
 */
function initBrandMeta() {
  // Update year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Update Instagram handles
  document.querySelectorAll('.js-instagram-handle').forEach(el => {
    el.textContent = CONFIG.instagramHandle;
  });

  // Update Instagram links
  document.querySelectorAll('.js-instagram-link').forEach(el => {
    el.href = CONFIG.instagramUrl;
  });

  // Update WhatsApp numbers & display
  document.querySelectorAll('.js-whatsapp-number').forEach(el => {
    el.textContent = `+${CONFIG.whatsappNumber.replace(/(\d{2})(\d{5})(\d{5})/, '$1 $2 $3')}`;
  });

  // Update short address
  document.querySelectorAll('.js-business-location').forEach(el => {
    el.textContent = CONFIG.location;
  });
}

/**
 * Generate standard WhatsApp URL with pre-filled message including price
 */
function getWhatsAppProductUrl(productName, price) {
  const priceSnippet = price ? ` (${price})` : '';
  const message = `Hello Siddhi, I am interested in the *${productName}*${priceSnippet} from Bloom&blush. Could you please share details regarding customization options and availability? Thank you!`;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getWhatsAppCollectionUrl(collectionName) {
  const message = `Hello Siddhi, I am interested in exploring your *${collectionName}* collection from Bloom&blush. Could you please share more details, pricing, and availability? Thank you!`;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getWhatsAppGeneralUrl() {
  const message = `Hello Siddhi, I came across Bloom&blush and would love to enquire about your customized gifting and floral arrangements.`;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Setup general WhatsApp CTA buttons
 */
function initWhatsAppButtons() {
  const generalUrl = getWhatsAppGeneralUrl();

  const heroWaBtn = document.getElementById('hero-wa-btn');
  if (heroWaBtn) heroWaBtn.href = generalUrl;

  const headerWaBtn = document.getElementById('header-wa-btn');
  if (headerWaBtn) headerWaBtn.href = generalUrl;

  const contactWaBtn = document.getElementById('contact-wa-btn');
  if (contactWaBtn) contactWaBtn.href = generalUrl;

  const floatingWaBtn = document.getElementById('floating-wa-btn');
  if (floatingWaBtn) floatingWaBtn.href = generalUrl;

  const drawerWaBtn = document.getElementById('drawer-wa-btn');
  if (drawerWaBtn) drawerWaBtn.href = generalUrl;

  const footerWaBtn = document.getElementById('footer-wa-btn');
  if (footerWaBtn) footerWaBtn.href = generalUrl;
}

/**
 * Render Collections Section (Option 1 Clean Boutique Style)
 */
function renderCollections() {
  const container = document.getElementById('collections-grid');
  if (!container) return;

  const waIcon = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/></svg>`;

  container.innerHTML = COLLECTIONS.map(col => `
    <article class="collection-card" data-collection-id="${col.id}">
      <div class="collection-image-box">
        <img src="${col.image}" alt="${col.title} - Bloom&blush Pune" loading="lazy">
        <span class="collection-badge">${col.subtitle}</span>
      </div>
      <div class="collection-body">
        <h3 class="collection-title">${col.title}</h3>
        <p class="collection-desc">${col.description}</p>
        <div class="collection-actions-bar">
          <a href="${getWhatsAppCollectionUrl(col.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-action" title="Enquire about ${col.title}">
            ${waIcon}
            <span>Chat on Enquiry</span>
          </a>
          <button type="button" class="btn-link js-explore-collection" data-collection="${col.id}">
            Explore
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Handle "Explore" click -> filter products and scroll
  container.querySelectorAll('.js-explore-collection').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const colId = btn.dataset.collection;
      filterProductsByCollection(colId);
      const featuredSec = document.getElementById('featured');
      if (featuredSec) {
        featuredSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Render Products in Featured Section (Option 1 Clean Grid Style)
 */
function renderProducts(filterCollectionId = 'all') {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = filterCollectionId === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.collectionId === filterCollectionId);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
        <p style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--burgundy-deep);">No creations found in this collection.</p>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">Please check another category or contact us for bespoke commissions.</p>
      </div>
    `;
    return;
  }

  const waIcon = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/></svg>`;

  container.innerHTML = filtered.map(product => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name} - Bloom&blush" loading="lazy">
        ${product.badge ? `<span class="product-badge-tag">${product.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price-row">
          <span class="product-price">${product.priceFormatted || '₹' + product.price}</span>
          ${product.priceNote ? `<span class="product-price-note">${product.priceNote}</span>` : ''}
        </div>
        <p class="product-short-desc">${product.shortDesc}</p>
        <div class="product-actions-bar">
          <a href="${getWhatsAppProductUrl(product.name, product.priceFormatted)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-card" title="WhatsApp Enquiry for ${product.name}">
            ${waIcon}
            <span>WhatsApp Enquire</span>
          </a>
          <button type="button" class="btn-link js-open-product" data-product-id="${product.id}">
            View Details
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Bind Open Product triggers on button, image, and title for intuitive user experience
  container.querySelectorAll('.js-open-product, .product-media, .product-name').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const card = el.closest('.product-card');
      const pId = el.dataset.productId || (card ? card.dataset.productId : null);
      if (pId) openProductModal(pId);
    });
  });
}

/**
 * Filter button interactions
 */
function initCategoryFilters() {
  const filterContainer = document.getElementById('filter-bar');
  if (!filterContainer) return;

  // Build filter buttons
  const buttonsHtml = [
    `<button class="filter-btn active" data-filter="all">All Creations</button>`,
    ...COLLECTIONS.map(col => `
      <button class="filter-btn" data-filter="${col.id}">${col.title}</button>
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
 * Render Occasions
 */
function renderOccasions() {
  const container = document.getElementById('occasions-grid');
  if (!container) return;

  container.innerHTML = OCCASIONS.map(occ => `
    <div class="occasion-card">
      <div class="occasion-image">
        <img src="${occ.image}" alt="${occ.title} - Bloom&blush Gifting Pune" loading="lazy">
      </div>
      <div class="occasion-content">
        <h3 class="occasion-title">${occ.title}</h3>
        <p class="occasion-desc">${occ.description}</p>
      </div>
    </div>
  `).join('');
}

/**
 * Render Portfolio Gallery
 */
function renderPortfolio() {
  const container = document.getElementById('portfolio-gallery');
  if (!container) return;

  container.innerHTML = PORTFOLIO_ITEMS.map(item => `
    <div class="portfolio-item">
      <img src="${item.image}" alt="${item.title} - Bloom&blush Instagram Portfolio" loading="lazy">
      <div class="portfolio-overlay">
        <span class="portfolio-cat">${item.category}</span>
        <h4 class="portfolio-title">${item.title}</h4>
      </div>
    </div>
  `).join('');
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
      if (e.target === backdrop) {
        closeProductModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
    }
  });
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentOpenProductId = productId;
  window.location.hash = `product-${productId}`;

  // Populate modal data
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
  const mobileStickyBar = document.getElementById('mobile-sticky-enquiry');
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

  // Price & Price Note
  const formattedPrice = product.priceFormatted || (product.price ? `₹${product.price}` : '');
  if (modalPrice) {
    modalPrice.textContent = formattedPrice;
  }
  if (modalPriceNote) {
    modalPriceNote.textContent = product.priceNote || 'Handcrafted on order';
  }

  if (modalDesc) modalDesc.textContent = product.detailedDesc;

  // Customization list
  if (modalCustomizationList) {
    modalCustomizationList.innerHTML = product.customizationOptions.map(opt => `
      <li>${opt}</li>
    `).join('');
  }

  // Occasions pills
  if (modalOccasionsTags) {
    modalOccasionsTags.innerHTML = product.suitableOccasions.map(occ => `
      <span class="modal-occasion-pill">${occ}</span>
    `).join('');
  }

  // Specs Table
  if (modalSpecsTable) {
    modalSpecsTable.innerHTML = Object.entries(product.details).map(([key, val]) => `
      <tr>
        <td>${key}</td>
        <td>${val}</td>
      </tr>
    `).join('');
  }

  // WhatsApp Enquiry Link with Product Name and Price
  const waUrl = getWhatsAppProductUrl(product.name, formattedPrice);
  if (modalWaBtn) modalWaBtn.href = waUrl;
  if (mobileStickyWaBtn) mobileStickyWaBtn.href = waUrl;

  // Show modal
  const backdrop = document.getElementById('product-modal-backdrop');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('modal-open');

  // Show mobile sticky CTA if screen is mobile
  if (mobileStickyBar && window.innerWidth <= 768) {
    mobileStickyBar.style.display = 'block';
  }
}

function closeProductModal() {
  const backdrop = document.getElementById('product-modal-backdrop');
  const mobileStickyBar = document.getElementById('mobile-sticky-enquiry');

  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('modal-open');
  if (mobileStickyBar) mobileStickyBar.style.display = 'none';

  currentOpenProductId = null;
  // Clean hash without causing jump
  if (window.location.hash.startsWith('#product-')) {
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }
}

/**
 * Handle URL hash routing (e.g. direct product links or back button)
 */
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
  // Check on initial page load
  checkHash();
}

/**
 * Mobile Drawer Navigation
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
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close drawer when any mobile nav link is clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * Scroll Effects (Sticky Header Compact & Scroll Spy)
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

  // Active Navigation link highlighter
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

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
