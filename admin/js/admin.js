/**
 * ===================================================================
 * Bloom&blush - Boutique Owner Admin Application Logic
 * Dedicated Product Management & Real-Time Sync Portal
 * ===================================================================
 */

// Global State
let PRODUCTS = [];
let ACTIVE_CATEGORY = 'all';
let SEARCH_QUERY = '';
let SORT_BY = 'default';
let EDITING_PRODUCT_ID = null;
let broadcastSyncChannel = null;

// Default bundled product fallback in case of local file:// fetch restrictions
const DEFAULT_FALLBACK_PRODUCTS = [
  {
    "id": "royal-sovereign-money-garland",
    "name": "The Royal Sovereign Money Garland",
    "collectionId": "money-garlands",
    "category": "Money Garlands",
    "badge": "Signature Creation",
    "price": 4500,
    "priceFormatted": "Starting at ₹4,500",
    "priceNote": "+ Currency face value (Choice of ₹10 to ₹500 notes)",
    "shortDesc": "Majestic origami-pleated currency garland with deep burgundy velvet roses and gold zari borders.",
    "detailedDesc": "A breathtaking masterpiece handcrafted for grooms and grand celebration ceremonies. Each currency note is meticulously pleated using proprietary origami folding techniques that preserve the notes while creating an opulent ceremonial drape. Finished with deep burgundy velvet roses, antique gold brocade neckband, and shimmering pearl drop tassels.",
    "customizationOptions": [
      "Choice of currency denomination (₹10, ₹20, ₹50, ₹100, ₹200, ₹500)",
      "Flower color palette (Burgundy & Gold, Blush & Ivory, or Classic Maroon)",
      "Neckband trim style (Zari embroidery, Velvet border, or Golden Brocade)",
      "Custom name or initials tag in brass calligraphy"
    ],
    "suitableOccasions": ["Weddings & Baraat", "Engagement / Roka", "Milestone 50th / 60th Birthdays", "Thread Ceremonies"],
    "details": {
      "Price Guidance": "Starting at ₹4,500 crafting charge + selected currency amount",
      "Crafting Time": "3 - 5 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Presentation": "Packaged in luxury archival preservation box",
      "Note Safety": "Zero pinholes or adhesive damage to currency notes"
    },
    "image": "assets/images/money_garland.jpg"
  },
  {
    "id": "blush-petal-bridal-bouquet",
    "name": "The Blush & Wine Bridal Bouquet",
    "collectionId": "bouquets",
    "category": "Artisanal Bouquets",
    "badge": "Bridal Favorite",
    "price": 2450,
    "priceFormatted": "₹2,450",
    "priceNote": "Fresh & Preserved Floral Arrangement",
    "shortDesc": "Opulent hand-tied bridal bouquet with deep wine garden roses, cream ranunculus, and flowing velvet ribbon.",
    "detailedDesc": "Designed for the modern romantic bride and grand celebratory entries. An artistic composition of deep wine garden roses, ruffled blush ranunculus, delicate anemones, and silvery seeded eucalyptus. Bound with long, trailing hand-dyed burgundy silk velvet ribbons that catch the breeze beautifully in wedding photography.",
    "customizationOptions": [
      "Fresh seasonal blooms or eternal preserved florals",
      "Color tuning to match bridal lehenga or gown palette",
      "Ribbon selection (Hand-dyed silk velvet, raw-edge chiffon, or satin)",
      "Matching groom's boutonniere and bridesmaid posies available on request"
    ],
    "suitableOccasions": ["Bridal Entry & Reception", "Wedding Proposals", "Anniversary Milestones", "Luxury Photoshoots"],
    "details": {
      "Price Guidance": "₹2,450 (includes hydration pack & satin keepsake ribbon)",
      "Crafting Time": "24 - 48 Hours notice recommended",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Floral Care": "Delivered with hydration pack & care instructions",
      "Dimensions": "Approx. 14 inches width × 16 inches height"
    },
    "image": "assets/images/editorial_bouquet.jpg"
  },
  {
    "id": "velvet-reverie-luxury-hamper",
    "name": "The Velvet Reverie Celebration Hamper",
    "collectionId": "customized-hampers",
    "category": "Customized Hampers",
    "badge": "Bespoke Curation",
    "price": 3850,
    "priceFormatted": "₹3,850",
    "priceNote": "Complete Gourmet & Fragrance Trunk",
    "shortDesc": "Velvet burgundy presentation box with brass dry fruit canisters, scented soy candle, and dried florals.",
    "detailedDesc": "An experiential luxury gift box created for distinguished celebration gifting. Crafted inside a rich burgundy velvet box with gold foil embossing, featuring hand-hammered brass canisters filled with gourmet roasted almonds and cashews, an artisanal wood-wick soy candle, a delicate preserved flower posy, and a personalized calligraphy greeting with wax seal.",
    "customizationOptions": [
      "Custom name / crest foil-stamped on the box lid",
      "Choice of candle fragrance (Royal Oud, Damask Rose, or Amber Vanilla)",
      "Selection of gourmet delicacies or sweet confectionery",
      "Personalized handwritten calligraphy message card with wax stamp"
    ],
    "suitableOccasions": ["Diwali & Festive Gifting", "Wedding Welcome Hampers", "Corporate VIP Gifting", "New Home Housewarming"],
    "details": {
      "Price Guidance": "₹3,850 inclusive of gourmet dry fruits, candle & trunk",
      "Crafting Time": "2 - 4 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Box Finish": "High-density rigid velvet trunk with brass lock latch",
      "Dimensions": "12 × 10 × 4.5 inches"
    },
    "image": "assets/images/luxury_hamper.jpg"
  },
  {
    "id": "raas-bridal-trousseau-tray",
    "name": "The Raas Royal Trousseau Tray",
    "collectionId": "wedding-gifting",
    "category": "Wedding & Celebration Gifting",
    "badge": "Heritage Craft",
    "price": 5200,
    "priceFormatted": "Starting at ₹5,200",
    "priceNote": "Custom Sized for Trousseau Exchange",
    "shortDesc": "Opulent burgundy velvet ceremonial tray with heavy gold zari border, zardozi pouches, and jewelry casket.",
    "detailedDesc": "A regal presentation tray designed for Indian wedding trousseau displays and ceremonial exchange. Lined in royal burgundy velvet with an antique gold zardozi border, this tray includes an embossed brass jewelry casket, embroidered velvet batwas (potli pouches), fragrant gajra accents with miniature burgundy roses, and Kundan brooch pins.",
    "customizationOptions": [
      "Tray dimensions & compartment layouts customized to trousseau items",
      "Color coordination with bridal trousseau theme (Burgundy, Emerald, or Ivory)",
      "Personalized acrylic or brass bride & groom monogram plaque",
      "Full trousseau packaging suite (ring trays, saree trays, watch hampers)"
    ],
    "suitableOccasions": ["Wedding Trousseau Exchange", "Engagement Ring Ceremony", "Sangeet & Mehendi Gifting", "Bridal Welcome"],
    "details": {
      "Price Guidance": "Starting at ₹5,200 for standard bridal trousseau suite",
      "Crafting Time": "5 - 7 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Base Structure": "Engineered wood with pure silk velvet padding",
      "Inclusions": "Tray + 2 Embroidered Batwas + Acrylic Monogram Crest"
    },
    "image": "assets/images/wedding_trousseau.jpg"
  },
  {
    "id": "gold-leaf-keepsake-box",
    "name": "The Royal Monogram Keepsake Box",
    "collectionId": "customized-gifts",
    "category": "Customized Gifts",
    "badge": "Personalized Keepsake",
    "price": 1850,
    "priceFormatted": "₹1,850",
    "priceNote": "Personalized Laser Engraving Included",
    "shortDesc": "Artisanal wooden keepsake treasure box with 24K gold foil trim, personalized initials, and velvet lining.",
    "detailedDesc": "A heartfelt bespoke gift crafted in polished seasoned teakwood with hand-applied 24K gold foil leaf accents. Inside, the box is lined in plush champagne blush velvet with a discreet brass hinge and lock. The lid is custom engraved with the recipient's initials or a personalized message in elegant vintage script.",
    "customizationOptions": [
      "Custom laser engraving of names, wedding dates, or monograms",
      "Wood finish choice (Natural Teak, Antique Walnut, or Rosewood)",
      "Interior lining (Blush Champagne Velvet or Royal Burgundy Silk)",
      "Complimentary wax-sealed personalized message parchment"
    ],
    "suitableOccasions": ["Bride & Groom Keepsake", "Bridesmaid Proposal Gift", "Anniversary Treasure", "Corporate Memento"],
    "details": {
      "Price Guidance": "₹1,850 inclusive of custom engraving & velvet gift pouch",
      "Crafting Time": "2 - 3 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Dimensions": "8 × 6 × 3.5 inches",
      "Care": "Wipe with soft dry microfiber cloth"
    },
    "image": "assets/images/customized_gifts.jpg"
  },
  {
    "id": "eternal-rose-glass-cloche",
    "name": "The Eternal Burgundy Rose Cloche",
    "collectionId": "bouquets",
    "category": "Artisanal Bouquets",
    "badge": "Preserved Florals",
    "price": 2800,
    "priceFormatted": "₹2,800",
    "priceNote": "Lasts 3+ Years with Zero Water",
    "shortDesc": "Real preserved Ecuadorian deep wine rose preserved under a luxury borosilicate glass dome with micro fairy lights.",
    "detailedDesc": "A timeless symbol of enduring affection inspired by fairytale romance. An authentic Grade-A Ecuadorian rose preserved at the absolute peak of bloom using bio-friendly preservation methods, enclosed under a crystal-clear borosilicate glass bell jar on a solid polished mahogany wooden pedestal. Features delicate warm fairy lights battery operated inside.",
    "customizationOptions": [
      "Rose color choice (Deep Burgundy Wine, Blush Pink, or Champagne Gold)",
      "Engraved brass plaque on wooden pedestal with custom date or quote",
      "Addition of fallen rose petal arrangement at base",
      "Gift packaging in satin ribboned luxury cylinder box"
    ],
    "suitableOccasions": ["Romantic Proposals", "Valentine Celebrations", "Anniversary Milestones", "Bedside Décor Accent"],
    "details": {
      "Price Guidance": "₹2,800 inclusive of dome, LED lights & batteries",
      "Lifespan": "3 to 5 years (Keep away from direct sunlight & high humidity)",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Dimensions": "6.5 inches diameter × 9 inches height"
    },
    "image": "assets/images/floral_dome.jpg"
  }
];

// Available bundled media assets for quick selection
const BUNDLED_ASSETS = [
  { name: 'Money Garland', path: 'assets/images/money_garland.jpg' },
  { name: 'Pastel Garland', path: 'assets/images/pastel_garland.jpg' },
  { name: 'Editorial Bouquet', path: 'assets/images/editorial_bouquet.jpg' },
  { name: 'Floral Cloche Dome', path: 'assets/images/floral_dome.jpg' },
  { name: 'Luxury Hamper', path: 'assets/images/luxury_hamper.jpg' },
  { name: 'Wedding Trousseau', path: 'assets/images/wedding_trousseau.jpg' },
  { name: 'Customized Keepsake', path: 'assets/images/customized_gifts.jpg' },
  { name: 'Hero Showcase', path: 'assets/images/hero.jpg' }
];

// Presets for categories
const CATEGORY_PRESETS = [
  { id: 'money-garlands', name: 'Money Garlands' },
  { id: 'bouquets', name: 'Artisanal Bouquets' },
  { id: 'customized-hampers', name: 'Customized Hampers' },
  { id: 'wedding-gifting', name: 'Wedding & Celebration Gifting' },
  { id: 'customized-gifts', name: 'Customized Gifts' }
];

// Presets for badges
const BADGE_PRESETS = [
  'Signature Creation',
  'Bridal Favorite',
  'Bespoke Curation',
  'Heritage Craft',
  'Personalized Keepsake',
  'Preserved Florals',
  'New Arrival',
  'Festive Special'
];

// Occasion presets for one-click add
const OCCASION_PRESETS = [
  'Weddings & Baraat',
  'Engagement / Roka',
  'Anniversary Milestones',
  'Diwali & Festive Gifting',
  'Milestone Birthdays',
  'Corporate VIP Gifting',
  'Bridal Welcome',
  'Romantic Proposals'
];

/* ===================================================================
   Initialization
   =================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  initSyncChannel();
  await loadProducts();
  setupEventListeners();
  renderCategoryFilters();
  renderProducts();
  updateStats();
});

/**
 * Initialize BroadcastChannel for cross-tab live synchronization
 */
function initSyncChannel() {
  if ('BroadcastChannel' in window) {
    try {
      broadcastSyncChannel = new BroadcastChannel('bloom_product_sync');
      broadcastSyncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'PRODUCTS_UPDATED') {
          console.log('[Admin] Received sync update from another window');
          loadFromLocalStorage(false);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }
  }
}

/**
 * Load Products: Priority 1 = LocalStorage, Priority 2 = products.json, Priority 3 = Default bundled
 */
async function loadProducts() {
  // 0. Connect to Firebase Firestore in real time with auto-sync
  startFirestoreSync();

  // 1. Check localStorage first (fast local display)
  const localData = localStorage.getItem('bloom_custom_products');
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        PRODUCTS = parsed;
        console.log('[Admin] Loaded from localStorage:', PRODUCTS.length, 'creations');
        return;
      }
    } catch (e) {
      console.warn('Failed parsing localStorage products');
    }
  }

  // 2. Fetch products.json
  try {
    const res = await fetch('../products.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        PRODUCTS = data;
        saveProducts(false); // save to localStorage for subsequent fast edits
        console.log('[Admin] Loaded from products.json:', PRODUCTS.length, 'creations');
        return;
      }
    }
  } catch (err) {
    console.info('[Admin] Fetching ../products.json failed (likely local file protocol). Using bundled catalog.');
  }

  // 3. Fallback to bundled
  PRODUCTS = [...DEFAULT_FALLBACK_PRODUCTS];
  saveProducts(false);
}

/**
 * Persist PRODUCTS to localStorage and notify other tabs
 */
function saveProducts(notify = true) {
  try {
    localStorage.setItem('bloom_custom_products', JSON.stringify(PRODUCTS));
    if (notify) {
      if (broadcastSyncChannel) {
        broadcastSyncChannel.postMessage({ type: 'PRODUCTS_UPDATED', products: PRODUCTS });
      }
      // Also dispatch storage event on window
      window.dispatchEvent(new Event('storage'));
    }
    updateStats();
  } catch (err) {
    console.error('Error saving products:', err);
    showToast('Failed to save to browser storage. Local storage might be full.', 'error');
  }
}

function loadFromLocalStorage(render = true) {
  const localData = localStorage.getItem('bloom_custom_products');
  if (localData) {
    try {
      PRODUCTS = JSON.parse(localData);
      if (render) {
        renderProducts();
        updateStats();
      }
    } catch (e) {}
  }
}

/* ===================================================================
   Event Listeners & Controls
   =================================================================== */
function setupEventListeners() {
  // Search input - explicitly reset value so browser autocomplete does not filter out creations
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = '';
    SEARCH_QUERY = '';
    searchInput.addEventListener('input', (e) => {
      SEARCH_QUERY = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      SORT_BY = e.target.value;
      renderProducts();
    });
  }

  // Open "Add Product" modal
  const addBtn = document.getElementById('btn-add-product');
  if (addBtn) {
    addBtn.addEventListener('click', () => openProductModal(null));
  }

  // Modal close buttons
  document.querySelectorAll('.js-close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Modal overlay click outside to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Product Form Submit
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }

  // Auto-generate slug ID from name
  const nameInput = document.getElementById('prod-name');
  const idInput = document.getElementById('prod-id');
  if (nameInput && idInput) {
    nameInput.addEventListener('input', () => {
      if (!EDITING_PRODUCT_ID) {
        idInput.value = nameInput.value.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
    });
  }

  // Auto-format price display
  const priceInput = document.getElementById('prod-price');
  const priceFormatInput = document.getElementById('prod-price-formatted');
  if (priceInput && priceFormatInput) {
    priceInput.addEventListener('input', () => {
      const val = parseFloat(priceInput.value);
      if (!isNaN(val) && val > 0) {
        if (!priceFormatInput.value || priceFormatInput.dataset.autoFilled === 'true') {
          priceFormatInput.value = '₹' + val.toLocaleString('en-IN');
          priceFormatInput.dataset.autoFilled = 'true';
        }
      }
    });
    priceFormatInput.addEventListener('input', () => {
      priceFormatInput.dataset.autoFilled = 'false';
    });
  }

  // Category select change (for custom category input)
  const catSelect = document.getElementById('prod-category-select');
  const customCatWrap = document.getElementById('custom-category-wrapper');
  if (catSelect && customCatWrap) {
    catSelect.addEventListener('change', () => {
      if (catSelect.value === '__custom__') {
        customCatWrap.style.display = 'block';
        document.getElementById('prod-custom-category').focus();
      } else {
        customCatWrap.style.display = 'none';
      }
    });
  }

  // Image source tabs
  setupImageTabs();

  // Customization Options Tag Input
  setupTagInput('customization-input', 'btn-add-customization', 'customization-tags-list', 'customization-values');

  // Occasion Tag Input
  setupTagInput('occasion-input', 'btn-add-occasion', 'occasion-tags-list', 'occasion-values');

  // Occasion quick presets clicks
  setupOccasionPresets();

  // Details Table Add Row
  const addSpecBtn = document.getElementById('btn-add-spec-row');
  if (addSpecBtn) {
    addSpecBtn.addEventListener('click', () => addSpecRow('', ''));
  }

  // Sync / Export buttons
  setupSyncDrawerActions();
}

/* ===================================================================
   Image Handling (Upload / Asset Gallery / URL)
   =================================================================== */
function setupImageTabs() {
  const tabs = document.querySelectorAll('.image-source-tabs .tab-btn');
  const panels = {
    'upload': document.getElementById('img-panel-upload'),
    'asset': document.getElementById('img-panel-asset'),
    'url': document.getElementById('img-panel-url')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      Object.keys(panels).forEach(key => {
        if (panels[key]) panels[key].style.display = (key === target) ? 'block' : 'none';
      });
    });
  });

  // 1. File Upload handler
  const fileInput = document.getElementById('prod-image-file');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2.5 * 1024 * 1024) {
          showToast('Image is larger than 2.5MB. Compressing or smaller image recommended.', 'info');
        }
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          setImagePreview(loadEvt.target.result, file.name);
          document.getElementById('prod-image-final').value = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 2. Asset Gallery selector
  const assetSelect = document.getElementById('prod-asset-select');
  if (assetSelect) {
    // Populate bundled options
    assetSelect.innerHTML = '<option value="">-- Choose from existing photography --</option>';
    BUNDLED_ASSETS.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.path;
      opt.textContent = `${item.name} (${item.path})`;
      assetSelect.appendChild(opt);
    });
    assetSelect.addEventListener('change', () => {
      if (assetSelect.value) {
        const fullRel = assetSelect.value.startsWith('assets/') ? assetSelect.value : assetSelect.value;
        setImagePreview('../' + fullRel, assetSelect.options[assetSelect.selectedIndex].text);
        document.getElementById('prod-image-final').value = fullRel;
      }
    });
  }

  // 3. Web URL input
  const urlInput = document.getElementById('prod-image-url');
  if (urlInput) {
    urlInput.addEventListener('input', () => {
      if (urlInput.value.trim().startsWith('http')) {
        setImagePreview(urlInput.value.trim(), 'Web Image URL');
        document.getElementById('prod-image-final').value = urlInput.value.trim();
      }
    });
  }
}

function setImagePreview(src, label = 'Image selected') {
  const imgThumb = document.getElementById('prod-img-preview-thumb');
  const labelEl = document.getElementById('prod-img-preview-label');
  const container = document.getElementById('prod-image-preview-container');
  if (imgThumb && labelEl && container) {
    imgThumb.src = src;
    labelEl.textContent = label;
    container.style.display = 'flex';
  }
}

/* ===================================================================
   Dynamic Tag Inputs (Customization & Occasions)
   =================================================================== */
function setupTagInput(inputId, btnId, listId, hiddenValuesId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const list = document.getElementById(listId);
  const hidden = document.getElementById(hiddenValuesId);

  function addTag(text) {
    text = text.trim();
    if (!text) return;

    let current = [];
    try { current = JSON.parse(hidden.value || '[]'); } catch (e) {}
    if (!current.includes(text)) {
      current.push(text);
      hidden.value = JSON.stringify(current);
      renderTags(current, list, hidden);
    }
    input.value = '';
    input.focus();
  }

  if (btn) {
    btn.addEventListener('click', () => addTag(input.value));
  }
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(input.value);
      }
    });
  }
}

function renderTags(items, listEl, hiddenEl) {
  listEl.innerHTML = '';
  items.forEach((item, idx) => {
    const badge = document.createElement('span');
    badge.className = 'tag-badge';
    badge.innerHTML = `
      <span>${escapeHtml(item)}</span>
      <button type="button" aria-label="Remove">&times;</button>
    `;
    badge.querySelector('button').addEventListener('click', () => {
      items.splice(idx, 1);
      hiddenEl.value = JSON.stringify(items);
      renderTags(items, listEl, hiddenEl);
    });
    listEl.appendChild(badge);
  });
}

function setupOccasionPresets() {
  const presetsContainer = document.getElementById('occasion-presets');
  const occasionHidden = document.getElementById('occasion-values');
  const occasionList = document.getElementById('occasion-tags-list');
  if (!presetsContainer || !occasionHidden || !occasionList) return;

  presetsContainer.innerHTML = '';
  OCCASION_PRESETS.forEach(occ => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-secondary';
    btn.style.padding = '0.2rem 0.6rem';
    btn.style.fontSize = '0.74rem';
    btn.textContent = '+ ' + occ;
    btn.addEventListener('click', () => {
      let current = [];
      try { current = JSON.parse(occasionHidden.value || '[]'); } catch (e) {}
      if (!current.includes(occ)) {
        current.push(occ);
        occasionHidden.value = JSON.stringify(current);
        renderTags(current, occasionList, occasionHidden);
      }
    });
    presetsContainer.appendChild(btn);
  });
}

/* ===================================================================
   Key-Value Specifications Editor
   =================================================================== */
function addSpecRow(key = '', val = '') {
  const tbody = document.getElementById('spec-table-body');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm spec-key" value="${escapeHtml(key)}" placeholder="e.g. Crafting Time"></td>
    <td><input type="text" class="form-control form-control-sm spec-val" value="${escapeHtml(val)}" placeholder="e.g. 2 - 3 Days"></td>
    <td style="width: 40px; text-align: center;">
      <button type="button" class="btn btn-sm btn-danger-outline btn-icon-only" title="Remove row">&times;</button>
    </td>
  `;
  tr.querySelector('button').addEventListener('click', () => tr.remove());
  tbody.appendChild(tr);
}

function getSpecData() {
  const specs = {};
  document.querySelectorAll('#spec-table-body tr').forEach(tr => {
    const key = tr.querySelector('.spec-key')?.value.trim();
    const val = tr.querySelector('.spec-val')?.value.trim();
    if (key && val) {
      specs[key] = val;
    }
  });
  return specs;
}

function setSpecData(specsObj = {}) {
  const tbody = document.getElementById('spec-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const defaultKeys = [
    { key: 'Price Guidance', def: '' },
    { key: 'Crafting Time', def: '2 - 3 Business Days' },
    { key: 'Handcrafted In', def: 'Pimpri-Chinchwad, Pune' }
  ];

  if (!specsObj || Object.keys(specsObj).length === 0) {
    defaultKeys.forEach(item => addSpecRow(item.key, item.def));
  } else {
    Object.entries(specsObj).forEach(([k, v]) => {
      addSpecRow(k, v);
    });
  }
}

/* ===================================================================
   Rendering Functions
   =================================================================== */
function renderCategoryFilters() {
  const container = document.getElementById('category-filter-chips');
  if (!container) return;

  // Extract unique categories
  const categoryMap = new Map();
  categoryMap.set('all', 'All Creations');

  // Standard presets first
  CATEGORY_PRESETS.forEach(c => categoryMap.set(c.id, c.name));

  // Any custom ones from PRODUCTS
  PRODUCTS.forEach(p => {
    if (p.collectionId && p.category && !categoryMap.has(p.collectionId)) {
      categoryMap.set(p.collectionId, p.category);
    }
  });

  container.innerHTML = '';
  categoryMap.forEach((name, id) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `filter-chip ${ACTIVE_CATEGORY === id ? 'active' : ''}`;
    chip.textContent = name;
    chip.addEventListener('click', () => {
      ACTIVE_CATEGORY = id;
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderProducts();
    });
    container.appendChild(chip);
  });
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('filtered-count');
  if (!grid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchCategory = (ACTIVE_CATEGORY === 'all') || (p.collectionId === ACTIVE_CATEGORY);
    const matchSearch = !SEARCH_QUERY || 
      (p.name && p.name.toLowerCase().includes(SEARCH_QUERY)) ||
      (p.category && p.category.toLowerCase().includes(SEARCH_QUERY)) ||
      (p.badge && p.badge.toLowerCase().includes(SEARCH_QUERY)) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(SEARCH_QUERY));
    return matchCategory && matchSearch;
  });

  // Sort
  if (SORT_BY === 'price-low') {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (SORT_BY === 'price-high') {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (SORT_BY === 'name-asc') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} creation${filtered.length === 1 ? '' : 's'} displayed`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/></svg>
        <h3>No creations found</h3>
        <p>No products match your current search or category filter. Try changing your search query or add a new piece to your boutique.</p>
        <button type="button" class="btn btn-primary" onclick="openProductModal(null)">+ Add First Creation</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-admin-card';

    // Format image URL properly for display inside admin folder
    let displayImg = p.image || 'assets/images/money_garland.jpg';
    if (!displayImg.startsWith('http') && !displayImg.startsWith('data:') && !displayImg.startsWith('../')) {
      displayImg = '../' + displayImg;
    }

    card.innerHTML = `
      <div class="card-image-wrap">
        <img src="${escapeHtml(displayImg)}" alt="${escapeHtml(p.name)}" onerror="this.src='../assets/images/money_garland.jpg'">
        ${p.badge ? `<span class="card-badge">${escapeHtml(p.badge)}</span>` : ''}
        <span class="card-category-tag">${escapeHtml(p.category || 'Boutique Creation')}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <div class="card-price-row">
          <span class="card-price">${escapeHtml(p.priceFormatted || ('₹' + p.price))}</span>
          ${p.priceNote ? `<span class="card-price-note">${escapeHtml(p.priceNote)}</span>` : ''}
        </div>
        <p class="card-desc">${escapeHtml(p.shortDesc || p.detailedDesc || 'Handcrafted bespoke piece designed for celebration occasions.')}</p>
        
        <div class="card-meta-chips">
          ${p.suitableOccasions && p.suitableOccasions.length > 0 ? 
            p.suitableOccasions.slice(0, 2).map(occ => `<span class="card-meta-chip">${escapeHtml(occ)}</span>`).join('') : ''}
          ${p.customizationOptions && p.customizationOptions.length > 0 ? 
            `<span class="card-meta-chip">+${p.customizationOptions.length} Customizations</span>` : ''}
        </div>

        <div class="card-actions">
          <div class="card-actions-left">
            <button type="button" class="btn btn-sm btn-burgundy js-edit-btn" title="Edit this creation">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              <span>Edit</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary js-duplicate-btn" title="Duplicate product">
              <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
              <span>Duplicate</span>
            </button>
          </div>
          <button type="button" class="btn btn-sm btn-danger-outline btn-icon-only js-delete-btn" title="Delete product">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    `;

    card.querySelector('.js-edit-btn').addEventListener('click', () => openProductModal(p.id));
    card.querySelector('.js-duplicate-btn').addEventListener('click', () => duplicateProduct(p.id));
    card.querySelector('.js-delete-btn').addEventListener('click', () => promptDeleteProduct(p.id));

    grid.appendChild(card);
  });
}

function updateStats() {
  const totalCountEl = document.getElementById('stat-total-products');
  const collectionCountEl = document.getElementById('stat-total-collections');
  const avgPriceEl = document.getElementById('stat-avg-price');
  const signatureCountEl = document.getElementById('stat-signature-count');

  if (totalCountEl) totalCountEl.textContent = PRODUCTS.length;

  if (collectionCountEl) {
    const uniqueCats = new Set(PRODUCTS.map(p => p.collectionId || p.category));
    collectionCountEl.textContent = uniqueCats.size;
  }

  if (avgPriceEl) {
    const validPrices = PRODUCTS.map(p => Number(p.price) || 0).filter(p => p > 0);
    if (validPrices.length > 0) {
      const minPrice = Math.min(...validPrices);
      const maxPrice = Math.max(...validPrices);
      avgPriceEl.textContent = `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
    } else {
      avgPriceEl.textContent = 'Custom';
    }
  }

  if (signatureCountEl) {
    const sigs = PRODUCTS.filter(p => p.badge && p.badge.toLowerCase().includes('signature')).length;
    signatureCountEl.textContent = sigs || '2';
  }
}

/* ===================================================================
   Product Modal Form Handling (Add / Edit)
   =================================================================== */
function openProductModal(productId = null) {
  EDITING_PRODUCT_ID = productId;
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-form-title');
  const form = document.getElementById('product-form');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('prod-image-final').value = '';
  document.getElementById('prod-image-preview-container').style.display = 'none';

  // Category select options
  const catSelect = document.getElementById('prod-category-select');
  catSelect.innerHTML = '';
  CATEGORY_PRESETS.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.dataset.name = cat.name;
    opt.textContent = cat.name;
    catSelect.appendChild(opt);
  });
  // Add option for custom
  const customOpt = document.createElement('option');
  customOpt.value = '__custom__';
  customOpt.textContent = '+ Create New Custom Category...';
  catSelect.appendChild(customOpt);

  // Badge presets
  const badgeSelect = document.getElementById('prod-badge');
  badgeSelect.innerHTML = '<option value="">-- No Badge --</option>';
  BADGE_PRESETS.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    badgeSelect.appendChild(opt);
  });

  if (productId) {
    // EDIT MODE
    const p = PRODUCTS.find(item => item.id === productId);
    if (!p) return;

    modalTitle.textContent = 'Edit Creation: ' + p.name;
    document.getElementById('prod-name').value = p.name || '';
    document.getElementById('prod-id').value = p.id || '';
    document.getElementById('prod-id').readOnly = true;

    // Set category
    if (CATEGORY_PRESETS.some(c => c.id === p.collectionId)) {
      catSelect.value = p.collectionId;
      document.getElementById('custom-category-wrapper').style.display = 'none';
    } else {
      catSelect.value = '__custom__';
      document.getElementById('custom-category-wrapper').style.display = 'block';
      document.getElementById('prod-custom-category').value = p.category || '';
    }

    // Set badge
    badgeSelect.value = p.badge || '';

    // Price
    document.getElementById('prod-price').value = p.price || '';
    document.getElementById('prod-price-formatted').value = p.priceFormatted || '';
    document.getElementById('prod-price-note').value = p.priceNote || '';

    // Descriptions
    document.getElementById('prod-short-desc').value = p.shortDesc || '';
    document.getElementById('prod-detailed-desc').value = p.detailedDesc || '';

    // Image
    if (p.image) {
      document.getElementById('prod-image-final').value = p.image;
      const previewSrc = (!p.image.startsWith('http') && !p.image.startsWith('data:') && !p.image.startsWith('../')) ? '../' + p.image : p.image;
      setImagePreview(previewSrc, p.name);
    }

    // Customization tags
    const custOptions = p.customizationOptions || [];
    document.getElementById('customization-values').value = JSON.stringify(custOptions);
    renderTags(custOptions, document.getElementById('customization-tags-list'), document.getElementById('customization-values'));

    // Occasions tags
    const occasions = p.suitableOccasions || [];
    document.getElementById('occasion-values').value = JSON.stringify(occasions);
    renderTags(occasions, document.getElementById('occasion-tags-list'), document.getElementById('occasion-values'));

    // Details specs table
    setSpecData(p.details || {});

  } else {
    // ADD MODE
    modalTitle.textContent = 'Add New Boutique Creation';
    document.getElementById('prod-id').readOnly = false;
    document.getElementById('custom-category-wrapper').style.display = 'none';
    document.getElementById('customization-values').value = '[]';
    document.getElementById('occasion-values').value = '[]';
    document.getElementById('customization-tags-list').innerHTML = '';
    document.getElementById('occasion-tags-list').innerHTML = '';
    setSpecData({});
  }

  modal.classList.add('active');
}

function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('prod-name').value.trim();
  let id = document.getElementById('prod-id').value.trim();
  const price = parseFloat(document.getElementById('prod-price').value) || 0;
  const priceFormatted = document.getElementById('prod-price-formatted').value.trim() || ('₹' + price.toLocaleString('en-IN'));
  const priceNote = document.getElementById('prod-price-note').value.trim();
  const badge = document.getElementById('prod-badge').value.trim();
  const shortDesc = document.getElementById('prod-short-desc').value.trim();
  const detailedDesc = document.getElementById('prod-detailed-desc').value.trim();

  // Category resolution
  const catSelect = document.getElementById('prod-category-select');
  let collectionId = catSelect.value;
  let categoryName = catSelect.options[catSelect.selectedIndex].dataset.name || catSelect.options[catSelect.selectedIndex].text;

  if (collectionId === '__custom__') {
    categoryName = document.getElementById('prod-custom-category').value.trim() || 'Custom Creations';
    collectionId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  // ID validation
  if (!id) {
    id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // Final image path/URL
  let imagePath = document.getElementById('prod-image-final').value.trim();
  if (!imagePath) {
    imagePath = 'assets/images/money_garland.jpg'; // fallback
  }

  // Parse arrays
  let customizationOptions = [];
  try { customizationOptions = JSON.parse(document.getElementById('customization-values').value || '[]'); } catch (e) {}

  let suitableOccasions = [];
  try { suitableOccasions = JSON.parse(document.getElementById('occasion-values').value || '[]'); } catch (e) {}

  const details = getSpecData();

  const productObj = {
    id,
    name,
    collectionId,
    category: categoryName,
    badge,
    price,
    priceFormatted,
    priceNote,
    shortDesc,
    detailedDesc,
    customizationOptions,
    suitableOccasions,
    details,
    image: imagePath
  };

  if (EDITING_PRODUCT_ID) {
    // Update existing
    const idx = PRODUCTS.findIndex(p => p.id === EDITING_PRODUCT_ID);
    if (idx >= 0) {
      PRODUCTS[idx] = productObj;
      showToast(`Updated "${name}" successfully!`, 'success');
    }
  } else {
    // Add new product at top
    // Check if ID already exists
    if (PRODUCTS.some(p => p.id === id)) {
      productObj.id = id + '-' + Math.floor(Math.random() * 1000);
    }
    PRODUCTS.unshift(productObj);
    showToast(`Added "${name}" to your creations catalog!`, 'success');
  }

  saveProducts(true);

  // Save creation to Firebase Cloud in real time
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('products').doc(productObj.id).set(productObj)
      .then(() => {
        console.log('[Firebase] Creation saved to Cloud:', productObj.name);
        showToast(`"${name}" live on Firebase Cloud for all customers!`, 'success');
      })
      .catch((err) => {
        console.error('[Firebase] Firestore save error:', err);
        showToast('Saved locally, but Firebase error: ' + err.message, 'error');
      });
  }

  renderCategoryFilters();
  renderProducts();
  closeAllModals();
}

/* ===================================================================
   Duplicate & Delete Product Actions
   =================================================================== */
function duplicateProduct(productId) {
  const p = PRODUCTS.find(item => item.id === productId);
  if (!p) return;

  const clone = JSON.parse(JSON.stringify(p));
  clone.name = clone.name + ' (Copy)';
  clone.id = clone.id + '-copy-' + Math.floor(Math.random() * 1000);
  if (clone.badge) clone.badge = 'New Variant';

  PRODUCTS.unshift(clone);
  saveProducts(true);

  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('products').doc(clone.id).set(clone).catch(e => console.warn(e));
  }

  renderProducts();
  showToast(`Duplicated "${p.name}" as a new creation.`, 'info');
}

let PRODUCT_ID_TO_DELETE = null;

function promptDeleteProduct(productId) {
  PRODUCT_ID_TO_DELETE = productId;
  const p = PRODUCTS.find(item => item.id === productId);
  if (!p) return;

  const modal = document.getElementById('delete-confirm-modal');
  const nameEl = document.getElementById('delete-product-name');
  if (modal && nameEl) {
    nameEl.textContent = `"${p.name}"`;
    modal.classList.add('active');
  }
}

function confirmDeleteProduct() {
  if (!PRODUCT_ID_TO_DELETE) return;

  const idx = PRODUCTS.findIndex(p => p.id === PRODUCT_ID_TO_DELETE);
  if (idx >= 0) {
    const deletedName = PRODUCTS[idx].name;
    const deletedId = PRODUCTS[idx].id;
    PRODUCTS.splice(idx, 1);
    saveProducts(true);

    if (typeof firestoreDb !== 'undefined' && firestoreDb) {
      firestoreDb.collection('products').doc(deletedId).delete()
        .then(() => console.log('[Firebase] Deleted from Cloud:', deletedId))
        .catch(e => console.warn('[Firebase] Delete error:', e));
    }

    renderProducts();
    showToast(`Removed "${deletedName}" from catalog.`, 'info');
  }
  PRODUCT_ID_TO_DELETE = null;
  closeAllModals();
}

/* ===================================================================
   Sync & Export Drawer / GitHub Direct Publish
   =================================================================== */
function openSyncDrawer() {
  const modal = document.getElementById('sync-drawer-modal');
  if (modal) {
    // Check if GitHub token is saved in localStorage
    const savedToken = localStorage.getItem('bloom_github_token') || '';
    const tokenInput = document.getElementById('gh-token-input');
    if (tokenInput) tokenInput.value = savedToken;
    modal.classList.add('active');
  }
}

function setupSyncDrawerActions() {
  // Confirm delete button
  const confirmDeleteBtn = document.getElementById('btn-confirm-delete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', confirmDeleteProduct);
  }

  // 0. Firebase Seed & Pull
  const seedFirebaseBtn = document.getElementById('btn-seed-firebase');
  if (seedFirebaseBtn) {
    seedFirebaseBtn.addEventListener('click', seedCatalogToFirebase);
  }

  const pullFirebaseBtn = document.getElementById('btn-pull-firebase');
  if (pullFirebaseBtn) {
    pullFirebaseBtn.addEventListener('click', pullCatalogFromFirebase);
  }

  // 1. Download products.json
  const downloadBtn = document.getElementById('btn-download-json');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadProductsJson);
  }

  // 2. Import products.json
  const importFile = document.getElementById('import-json-file');
  if (importFile) {
    importFile.addEventListener('change', handleImportJson);
  }

  // 3. Reset to default products
  const resetBtn = document.getElementById('btn-reset-defaults');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all products back to the original default catalog? Any custom products you created will be replaced.')) {
        PRODUCTS = [...DEFAULT_FALLBACK_PRODUCTS];
        saveProducts(true);
        renderCategoryFilters();
        renderProducts();
        showToast('Reset catalog to original default products.', 'info');
        closeAllModals();
      }
    });
  }

  // 4. GitHub API Direct Publish
  const publishGithubBtn = document.getElementById('btn-publish-github');
  if (publishGithubBtn) {
    publishGithubBtn.addEventListener('click', publishToGitHub);
  }
}

function downloadProductsJson() {
  try {
    const jsonStr = JSON.stringify(PRODUCTS, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded "products.json"! Replace it in your project folder or commit to GitHub.', 'success');
  } catch (e) {
    showToast('Failed generating products.json file download.', 'error');
  }
}

function handleImportJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (Array.isArray(parsed) && parsed.length > 0) {
        PRODUCTS = parsed;
        saveProducts(true);
        renderCategoryFilters();
        renderProducts();
        showToast(`Imported ${parsed.length} products successfully!`, 'success');
        closeAllModals();
      } else {
        showToast('Invalid JSON structure: Expected an array of products.', 'error');
      }
    } catch (err) {
      showToast('Error reading JSON file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

/**
 * Optional Pro Feature: Commit directly to GitHub repository via GitHub REST API
 */
async function publishToGitHub() {
  const tokenInput = document.getElementById('gh-token-input');
  const token = tokenInput ? tokenInput.value.trim() : '';
  const statusEl = document.getElementById('gh-publish-status');

  if (!token) {
    showToast('Please enter your GitHub Personal Access Token (PAT) first.', 'error');
    if (tokenInput) tokenInput.focus();
    return;
  }

  // Save token in owner's browser storage
  localStorage.setItem('bloom_github_token', token);

  const owner = 'borse9030';
  const repo = 'blushnbloomm';
  const path = 'products.json';
  const branch = 'main';

  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = '<span style="color: var(--burgundy-700);">Connecting to GitHub & fetching latest commit...</span>';
  }

  try {
    // 1. Get existing file sha
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha = '';
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Encode products array to Base64
    const contentStr = JSON.stringify(PRODUCTS, null, 2);
    // Safe unicode base64
    const encodedContent = btoa(unescape(encodeURIComponent(contentStr)));

    // 3. Put new commit
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update products catalog (${PRODUCTS.length} creations) via Owner Admin Portal`,
        content: encodedContent,
        branch: branch,
        sha: sha || undefined
      })
    });

    if (putRes.ok) {
      if (statusEl) {
        statusEl.innerHTML = '<span style="color: #22863A; font-weight: 600;">Published live to GitHub successfully! GitHub Pages will update in ~1-2 minutes.</span>';
      }
      showToast('Published live to GitHub successfully!', 'success');
    } else {
      const errorData = await putRes.json();
      throw new Error(errorData.message || 'GitHub API error');
    }
  } catch (err) {
    console.error('GitHub publish error:', err);
    if (statusEl) {
      statusEl.innerHTML = `<span style="color: #D73A49;">Publish failed: ${escapeHtml(err.message)}</span>`;
    }
    showToast('Failed to publish to GitHub: ' + err.message, 'error');
  }
}

/* ===================================================================
   Modals & UI Helpers
   =================================================================== */
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button type="button" style="background:none;border:none;color:#FFF;cursor:pointer;font-size:1.1rem;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ===================================================================
   Firebase Automated Real-Time Synchronization
   =================================================================== */
function startFirestoreSync() {
  if (typeof firestoreDb === 'undefined' || !firestoreDb) return;

  try {
    firestoreDb.collection('products').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const cloudProducts = [];
        snapshot.forEach(doc => {
          cloudProducts.push(doc.data());
        });
        if (cloudProducts.length > 0) {
          PRODUCTS = cloudProducts;
          localStorage.setItem('bloom_custom_products', JSON.stringify(PRODUCTS));
          renderCategoryFilters();
          renderProducts();
          updateStats();
          updateFirebaseBadge(true, cloudProducts.length);
          console.log('[Firebase] Automated sync:', cloudProducts.length, 'creations active');
          return;
        }
      } else {
        // If collection is completely empty, automatically seed it without any manual click
        console.log('[Firebase] Empty collection detected. Automatically seeding initial catalog...');
        const batch = firestoreDb.batch();
        const catalogToUpload = (PRODUCTS && PRODUCTS.length > 0) ? PRODUCTS : DEFAULT_FALLBACK_PRODUCTS;
        catalogToUpload.forEach(prod => {
          batch.set(firestoreDb.collection('products').doc(prod.id), prod);
        });
        batch.commit().then(() => {
          console.log('[Firebase] Automatically populated Firestore cloud with initial catalog.');
          updateFirebaseBadge(true, catalogToUpload.length);
        }).catch(err => console.warn('[Firebase] Auto-seed note:', err));
      }
    }, (err) => {
      console.warn('[Admin] Firestore auto-sync error, will retry:', err);
      updateFirebaseBadge(false, 0, err.message);
      // Automatically retry in 4 seconds
      setTimeout(startFirestoreSync, 4000);
    });
  } catch (e) {
    console.warn('[Admin] startFirestoreSync exception:', e);
  }
}

function updateFirebaseBadge(connected, count = 0, errorMsg = '') {
  const badgeEl = document.getElementById('firebase-cloud-badge');
  const pulseEl = document.getElementById('sync-pulse-indicator');
  const textEl = document.getElementById('sync-status-text');

  if (!badgeEl) return;

  if (connected) {
    badgeEl.innerHTML = `<span style="font-size: 0.78rem; font-weight: 600; color: #2E7D32; background: #E8F5E9; padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid #A5D6A7;">Live Cloud: Automated</span>`;
    if (pulseEl) pulseEl.style.backgroundColor = '#28A745';
    if (textEl) textEl.innerHTML = `<strong>Automated Cloud Sync Active:</strong> All creations update live in real-time. Any changes you make here are automatically published to your live website.`;
  } else {
    badgeEl.innerHTML = `<span style="font-size: 0.78rem; font-weight: 600; color: #FFA000; background: #FFF8E1; padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid #FFE082;">Cloud: Connecting...</span>`;
    if (pulseEl) pulseEl.style.backgroundColor = '#FFA000';
  }
}
