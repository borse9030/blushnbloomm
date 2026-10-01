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

// Global State: Studio Achievements
let ACHIEVEMENTS = [];
let ACTIVE_ACHIEVE_FILTER = 'all';
let ACHIEVE_SEARCH_QUERY = '';
let ACHIEVE_SORT_BY = 'newest';
let EDITING_ACHIEVE_ID = null;
let DELETING_ACHIEVE_ID = null;
let CURRENT_ACTIVE_TAB = 'products';
let broadcastAchieveChannel = null;

// Default bundled achievements fallback - strictly authentic milestones
const DEFAULT_FALLBACK_ACHIEVEMENTS = [
  {
    "id": "ach-lalbaugcha-raja-garland-1",
    "title": "Sacred Garland Offering at Lalbaugcha Raja, Mumbai",
    "category": "Milestone Reel",
    "mediaType": "video",
    "mediaUrl": "assets/videos/snapgram.io_398718527598.mp4",
    "thumbnailUrl": "assets/images/reel_garland_preview.jpg",
    "date": "Ganesh Utsav Milestone",
    "badge": "👑 Divine Milestone",
    "description": "An unforgettable blessed honor for Bloom&blush — our handcrafted auspicious ceremonial garland adorned on the sacred idol of Lalbaugcha Raja, Mumbai in the presence of millions of devotees.",
    "featured": true,
    "duration": "0:29",
    "aspect": "9:16",
    "linkUrl": "https://www.instagram.com/blushnbloomm.in?stkn=MTJxbzE1bHU5czRwNA==",
    "createdAt": 1738000000000
  },
  {
    "id": "ach-lalbaugcha-raja-garland-2",
    "title": "3rd Auspicious Garland Adorned on Lalbaugcha Raja (तिसरा हार अर्पित)",
    "category": "Milestone Reel",
    "mediaType": "video",
    "mediaUrl": "assets/videos/snapgram.io_399154073737.mp4",
    "thumbnailUrl": "assets/images/reel_styling_preview.jpg",
    "date": "Special Studio Dispatch",
    "badge": "🌸 Sacred Devotion",
    "description": "Handcrafted with heartfelt devotion and artisanal perfection in Pimpri-Chinchwad, Pune — our third ceremonial garland offering gracefully draped on Mumbai's iconic Lalbaugcha Raja.",
    "featured": true,
    "duration": "0:45",
    "aspect": "9:16",
    "linkUrl": "https://www.instagram.com/blushnbloomm.in?stkn=MTJxbzE1bHU5czRwNA==",
    "createdAt": 1737900000000
  }
];

// Helper to identify and purge obsolete fake/mock achievement records
const FAKE_ACHIEVE_IDS = new Set([
  'ach-money-garlands-500',
  'ach-bridal-masterclass-reel',
  'ach-pune-wedding-expo',
  'ach-luxury-hampers-curation',
  'ach-preserved-roses-100',
  'ach-artisan-workshop'
]);

function isFakeAchievement(item) {
  if (!item) return true;
  if (FAKE_ACHIEVE_IDS.has(item.id)) return true;
  if (item.mediaUrl && (item.mediaUrl.includes('commondatastorage.googleapis.com') || item.mediaUrl.includes('ForBigger'))) return true;
  return false;
}

// Default bundled product fallback matching the authentic 8 creations in products.json
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
      "Price Guidance": "Starting at ₹5,200 per tray (set discounts for 5+ trays)",
      "Crafting Time": "4 - 7 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Materials": "Hardwood frame, micro-velvet lining, heritage zari lace",
      "Care": "Includes protective dust cover for long-term preservation"
    },
    "image": "assets/images/wedding_trousseau.jpg"
  },
  {
    "id": "eternal-rose-glass-cloche",
    "name": "The Eternal Burgundy Rose Cloche",
    "collectionId": "bouquets",
    "category": "Artisanal Bouquets",
    "badge": "Everlasting",
    "price": 2800,
    "priceFormatted": "₹2,800",
    "priceNote": "Lasts 3+ Years without water",
    "shortDesc": "Real preserved Ecuadorian burgundy and blush roses under an antique brass glass cloche dome.",
    "detailedDesc": "A timeless token of romance that lasts for over 3 years without water or sunlight. A 100% natural, preserved deep burgundy rose and blush companion rose are delicately arranged with preserved baby's breath and eucalyptus inside a crystal-clear glass cloche dome on a solid walnut and antique brass pedestal.",
    "customizationOptions": [
      "Engraved brass plaque on the base with date and custom message",
      "Rose color combination (Burgundy, Dusty Rose, Champagne, or Royal White)",
      "Addition of subtle warm micro-fairy lights with hidden battery switch"
    ],
    "suitableOccasions": ["Anniversaries", "Valentine's & Proposals", "Birthday Keepsakes", "Luxury Desk / Bedside Decor"],
    "details": {
      "Price Guidance": "₹2,800 (includes glass cloche, walnut base & gift box)",
      "Longevity": "Preserved to remain pristine for 3+ years",
      "Crafting Time": "Ready to dispatch in 24 - 48 Hours",
      "Dimensions": "Height 8.5 inches × Diameter 5.5 inches",
      "Packaging": "Delivered in signature Bloom&blush ivory gift box with satin bow"
    },
    "image": "assets/images/floral_dome.jpg"
  },
  {
    "id": "pastel-bliss-ceremony-garland",
    "name": "The Pastel Pearl Ceremony Garland",
    "collectionId": "money-garlands",
    "category": "Money Garlands",
    "badge": "New Arrival",
    "price": 3800,
    "priceFormatted": "Starting at ₹3,800",
    "priceNote": "+ Currency face value (Soft pastel aesthetic)",
    "shortDesc": "Delicate baby pink and soft gold currency garland with silk rosebuds and cascading pearl drops.",
    "detailedDesc": "Designed with a lighter, ethereal aesthetic for intimate ceremonies, morning celebrations, and baby milestones. Features origami pleated currency notes harmonized with delicate blush pink silk rosebuds, soft gold scallop lace, and cascading pearl clusters that drape effortlessly.",
    "customizationOptions": [
      "Choice of denomination (₹10, ₹20, ₹50, ₹100, ₹200, ₹500)",
      "Pastel tone customization (Soft Pink, Mint Green, Peach, or Lilac)",
      "Single garland or matching couple set for bride & groom"
    ],
    "suitableOccasions": ["Baby Naming Ceremonies (Barse)", "Dohale Jevan / Baby Showers", "Intimate Engagements", "Graduations"],
    "details": {
      "Price Guidance": "Starting at ₹3,800 crafting charge + selected currency amount",
      "Crafting Time": "3 - 4 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Drape Length": "Customizable from 24 to 36 inches",
      "Note Safety": "Guaranteed damage-free origami technique"
    },
    "image": "assets/images/pastel_garland.jpg"
  },
  {
    "id": "bespoke-sandalwood-keepsake-box",
    "name": "The Heirloom Carved Keepsake Box",
    "collectionId": "customized-gifts",
    "category": "Customized Gifts",
    "badge": "Personalized",
    "price": 1950,
    "priceFormatted": "₹1,950",
    "priceNote": "Includes custom calligraphy letter",
    "shortDesc": "Hand-carved wooden keepsake box tied with deep wine silk ribbon, personalized calligraphy letter, and wax seal.",
    "detailedDesc": "A gift of enduring sentiment. Hand-carved from solid seasoned wood with floral jaali filigree, tied with an opulent burgundy satin ribbon, and paired with an authentic hand-lettered calligraphy letter on deckle-edge cotton paper sealed with our signature floral wax stamp.",
    "customizationOptions": [
      "Custom initials or names carved onto the lid panel",
      "Custom letter message scripted by hand in gold or walnut ink",
      "Interior lining (Burgundy velvet, cream raw silk, or natural wood)"
    ],
    "suitableOccasions": ["Wedding Morning Letters", "Father of the Bride Gifts", "Keepsake Jewelry Storage", "Milestone Anniversaries"],
    "details": {
      "Price Guidance": "₹1,950 (includes wooden keepsake box & custom calligraphy letter)",
      "Crafting Time": "3 - 5 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Dimensions": "9 × 6 × 3.5 inches",
      "Finish": "Hand-buffed natural wax with floral filigree"
    },
    "image": "assets/images/customized_gifts.jpg"
  },
  {
    "id": "celebration-floral-gift-suite",
    "name": "The Bloom&blush Signature Suite",
    "collectionId": "customized-hampers",
    "category": "Customized Hampers",
    "badge": "Grand Ensemble",
    "price": 4900,
    "priceFormatted": "₹4,900",
    "priceNote": "Luxury Centerpiece & Gift Suite",
    "shortDesc": "Complete festive suite featuring fresh garden roses, luxury gift box, perfume vial, and golden accents.",
    "detailedDesc": "The quintessential Bloom&blush experience. A masterfully composed gifting suite that pairs an editorial fresh flower arrangement of burgundy English garden roses and cream ranunculus with a gold-trimmed gift box, artisanal fragrance, and bespoke greeting card on a warm linen presentation mat.",
    "customizationOptions": [
      "Custom floral selection based on recipient's favorite flowers",
      "Inclusion of luxury perfume, artisanal chocolates, or precious trinkets",
      "Theme styling for birthdays, corporate appreciation, or wedding anniversaries"
    ],
    "suitableOccasions": ["Grand Milestone Birthdays", "Golden Anniversaries", "Festive Celebrations", "Proposal Surprises"],
    "details": {
      "Price Guidance": "₹4,900 complete ensemble",
      "Crafting Time": "2 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Includes": "Floral centerpiece, gold foil gift box, fragrance vial, greeting card"
    },
    "image": "assets/images/hero.jpg"
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
  initTabNavigation();
  initStorageGuideModal();
  initAchievementsAdmin();
  await loadProducts();
  await loadAchievements();
  setupEventListeners();
  renderCategoryFilters();
  renderProducts();
  updateStats();
  updateAchievementStats();
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
          console.log('[Admin] Received product sync update from another window');
          loadFromLocalStorage(false);
        }
      };

      broadcastAchieveChannel = new BroadcastChannel('bloom_achievements_sync');
      broadcastAchieveChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'ACHIEVEMENTS_UPDATED') {
          console.log('[Admin] Received achievement sync update from another window');
          loadAchievementsFromLocalStorage(false);
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

  // 1. Check localStorage first (and purge any legacy test items)
  const localData = localStorage.getItem('bloom_custom_products');
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If local storage has test/fake items from previous sessions, clear it
        if (parsed.some(p => p.id === 'gold-leaf-keepsake-box' || p.id.includes('copy') || p.id.includes('heritage-flora'))) {
          console.log('[Admin] Sanitizing stale test products from local storage cache');
          localStorage.removeItem('bloom_custom_products');
        } else {
          PRODUCTS = parsed;
          console.log('[Admin] Loaded from localStorage cache:', PRODUCTS.length, 'creations');
          return;
        }
      }
    } catch (e) {
      localStorage.removeItem('bloom_custom_products');
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

/* ===================================================================
   Tab Navigation (Creations vs Achievements)
   =================================================================== */
function initTabNavigation() {
  const tabProducts = document.getElementById('tab-nav-products');
  const tabAchievements = document.getElementById('tab-nav-achievements');
  const viewProducts = document.getElementById('view-products');
  const viewAchievements = document.getElementById('view-achievements');
  const btnAddProduct = document.getElementById('btn-add-product');
  const btnAddAchievement = document.getElementById('btn-add-achievement');

  function switchTab(target) {
    CURRENT_ACTIVE_TAB = target;
    if (target === 'products') {
      if (tabProducts) tabProducts.classList.add('active');
      if (tabAchievements) tabAchievements.classList.remove('active');
      if (viewProducts) viewProducts.style.display = 'block';
      if (viewAchievements) viewAchievements.style.display = 'none';
      if (btnAddProduct) btnAddProduct.style.display = 'inline-flex';
      if (btnAddAchievement) btnAddAchievement.style.display = 'none';
    } else {
      if (tabAchievements) tabAchievements.classList.add('active');
      if (tabProducts) tabProducts.classList.remove('active');
      if (viewAchievements) viewAchievements.style.display = 'block';
      if (viewProducts) viewProducts.style.display = 'none';
      if (btnAddAchievement) btnAddAchievement.style.display = 'inline-flex';
      if (btnAddProduct) btnAddProduct.style.display = 'none';
      renderAdminAchievements();
      updateAchievementStats();
    }
  }

  if (tabProducts) tabProducts.addEventListener('click', () => switchTab('products'));
  if (tabAchievements) tabAchievements.addEventListener('click', () => switchTab('achievements'));
}

/* ===================================================================
   Free Media Storage Guide Modal
   =================================================================== */
function initStorageGuideModal() {
  const guideModal = document.getElementById('storage-guide-modal');
  const btnStorageGuide = document.getElementById('btn-storage-guide');

  if (btnStorageGuide && guideModal) {
    btnStorageGuide.addEventListener('click', () => {
      guideModal.classList.add('active');
    });
  }

  document.querySelectorAll('.js-open-storage-guide').forEach(btn => {
    btn.addEventListener('click', () => {
      if (guideModal) guideModal.classList.add('active');
    });
  });
}

/* ===================================================================
   Studio Achievements Data Management & Sync
   =================================================================== */
async function loadAchievements() {
  // 1. Connect Firestore collection in real-time
  startFirestoreAchievementsSync();

  // 2. Check localStorage
  const localData = localStorage.getItem('bloom_custom_achievements');
  if (localData) {
    try {
      let parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize out any fake achievements cached in localStorage
        parsed = parsed.filter(item => !isFakeAchievement(item));
        DEFAULT_FALLBACK_ACHIEVEMENTS.forEach(def => {
          if (!parsed.some(p => p.id === def.id)) {
            parsed.unshift(def);
          }
        });
        ACHIEVEMENTS = parsed;
        saveAchievements(false);
        renderAdminAchievements();
        updateAchievementStats();
        return;
      }
    } catch (e) {
      localStorage.removeItem('bloom_custom_achievements');
    }
  }

  // 3. Fetch ../achievements.json
  try {
    const res = await fetch('../achievements.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        ACHIEVEMENTS = data.filter(item => !isFakeAchievement(item));
        saveAchievements(false);
        renderAdminAchievements();
        updateAchievementStats();
        return;
      }
    }
  } catch (err) {
    console.info('[Admin] achievements.json fetch note: using fallback');
  }

  // 4. Fallback to bundled authentic achievements
  ACHIEVEMENTS = [...DEFAULT_FALLBACK_ACHIEVEMENTS];
  saveAchievements(false);
  renderAdminAchievements();
  updateAchievementStats();
}

function startFirestoreAchievementsSync() {
  if (typeof firestoreDb === 'undefined' || !firestoreDb) return;

  try {
    firestoreDb.collection('achievements').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const cloudAchievements = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (isFakeAchievement(data) || FAKE_ACHIEVE_IDS.has(doc.id)) {
            // Delete obsolete fake achievement doc from Firestore cloud database
            doc.ref.delete().catch(() => {});
          } else {
            cloudAchievements.push(data);
          }
        });
        if (cloudAchievements.length > 0) {
          ACHIEVEMENTS = cloudAchievements;
          localStorage.setItem('bloom_custom_achievements', JSON.stringify(ACHIEVEMENTS));
          renderAdminAchievements();
          updateAchievementStats();
          console.log('[Firebase] Achievements auto-sync:', cloudAchievements.length, 'active');
          return;
        }
      } else {
        // Auto-seed initial achievements if empty
        console.log('[Firebase] Empty achievements collection detected. Auto-seeding initial achievements...');
        const batch = firestoreDb.batch();
        const catalogToUpload = (ACHIEVEMENTS && ACHIEVEMENTS.length > 0) ? ACHIEVEMENTS : DEFAULT_FALLBACK_ACHIEVEMENTS;
        catalogToUpload.forEach(item => {
          if (!isFakeAchievement(item)) {
            batch.set(firestoreDb.collection('achievements').doc(item.id), item);
          }
        });
        batch.commit().catch(err => console.warn('[Firebase] Achievements auto-seed error:', err));
      }
    }, (err) => {
      console.warn('[Admin] Firestore achievements sync warning:', err);
    });
  } catch (e) {
    console.warn('[Admin] startFirestoreAchievementsSync exception:', e);
  }
}

function saveAchievements(notify = true) {
  try {
    localStorage.setItem('bloom_custom_achievements', JSON.stringify(ACHIEVEMENTS));

    if (notify) {
      if (broadcastAchieveChannel) {
        broadcastAchieveChannel.postMessage({ type: 'ACHIEVEMENTS_UPDATED', achievements: ACHIEVEMENTS });
      }
      window.dispatchEvent(new Event('storage'));
    }
    updateAchievementStats();
  } catch (err) {
    console.error('Error saving achievements:', err);
    showToast('Failed to save achievements to browser cache. Storage might be full.', 'error');
  }
}

function loadAchievementsFromLocalStorage(render = true) {
  const localData = localStorage.getItem('bloom_custom_achievements');
  if (localData) {
    try {
      let parsed = JSON.parse(localData);
      if (Array.isArray(parsed)) {
        ACHIEVEMENTS = parsed.filter(item => !isFakeAchievement(item));
      }
      if (render) {
        renderAdminAchievements();
        updateAchievementStats();
      }
    } catch (e) {}
  }
}

function updateAchievementStats() {
  const totalEl = document.getElementById('stat-achieve-total');
  const videosEl = document.getElementById('stat-achieve-videos');
  const photosEl = document.getElementById('stat-achieve-photos');
  const spotlightEl = document.getElementById('stat-achieve-spotlight');
  const badgeAchieve = document.getElementById('tab-badge-achievements');
  const badgeProducts = document.getElementById('tab-badge-products');

  if (totalEl) totalEl.textContent = ACHIEVEMENTS.length;
  if (videosEl) videosEl.textContent = ACHIEVEMENTS.filter(a => a.mediaType === 'video').length;
  if (photosEl) photosEl.textContent = ACHIEVEMENTS.filter(a => a.mediaType === 'image').length;
  if (spotlightEl) spotlightEl.textContent = ACHIEVEMENTS.filter(a => !!a.featured).length;

  if (badgeAchieve) badgeAchieve.textContent = ACHIEVEMENTS.length;
  if (badgeProducts) badgeProducts.textContent = PRODUCTS.length;
}

/* ===================================================================
   Admin Achievements Rendering & Controls
   =================================================================== */
function renderAdminAchievements() {
  const grid = document.getElementById('achievements-admin-grid');
  const countEl = document.getElementById('achieve-filtered-count');
  if (!grid) return;

  let items = [...ACHIEVEMENTS];

  // 1. Filter by category / type
  if (ACTIVE_ACHIEVE_FILTER === 'video') {
    items = items.filter(a => a.mediaType === 'video');
  } else if (ACTIVE_ACHIEVE_FILTER === 'image') {
    items = items.filter(a => a.mediaType === 'image');
  } else if (ACTIVE_ACHIEVE_FILTER !== 'all') {
    items = items.filter(a => (a.category || '').toLowerCase() === ACTIVE_ACHIEVE_FILTER.toLowerCase());
  }

  // 2. Filter by search query
  if (ACHIEVE_SEARCH_QUERY) {
    items = items.filter(a => {
      const q = ACHIEVE_SEARCH_QUERY.toLowerCase();
      return (
        (a.title || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.badge || '').toLowerCase().includes(q)
      );
    });
  }

  // 3. Sort
  if (ACHIEVE_SORT_BY === 'newest') {
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (ACHIEVE_SORT_BY === 'oldest') {
    items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  } else if (ACHIEVE_SORT_BY === 'title-asc') {
    items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  if (countEl) {
    countEl.textContent = `Showing ${items.length} of ${ACHIEVEMENTS.length} highlights`;
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; background: #FFF; border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; color: var(--burgundy-800); font-weight: 600;">No achievements found.</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Click "+ Add Achievement" to publish your first studio highlight.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => {
    const isVideo = item.mediaType === 'video';
    let thumb = item.thumbnailUrl || item.mediaUrl;
    if (isVideo && item.mediaUrl) {
      const ytMatch = item.mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
      if (ytMatch && (!item.thumbnailUrl || item.thumbnailUrl.includes('assets/images/'))) {
        thumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
    }

    const typeLabel = isVideo ? '🎬 Video' : '📸 Photo';

    return `
      <div class="achieve-card-admin" data-id="${item.id}">
        <div class="achieve-card-media">
          <img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='../assets/images/hero.jpg'">
          
          <div class="achieve-card-badges">
            <span class="achieve-card-badge">${typeLabel}</span>
            ${item.featured ? `<span class="achieve-card-featured">Spotlight</span>` : ''}
            ${item.badge ? `<span class="achieve-card-badge" style="background: rgba(128,35,54,0.9);">${escapeHtml(item.badge)}</span>` : ''}
          </div>

          ${item.date ? `<span class="achieve-card-date">${escapeHtml(item.date)}</span>` : ''}
        </div>

        <div class="achieve-card-body">
          <span class="achieve-card-category">${escapeHtml(item.category || 'Milestone')}</span>
          <h3 class="achieve-card-title">${escapeHtml(item.title)}</h3>
          <p class="achieve-card-desc">${escapeHtml(item.description || '')}</p>

          <div class="achieve-card-footer">
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              ID: <code>${escapeHtml(item.id)}</code>
            </div>

            <div class="achieve-card-actions">
              <button type="button" class="btn btn-outline-gold btn-sm js-edit-achieve" data-id="${item.id}" title="Edit achievement details">
                Edit
              </button>
              <button type="button" class="btn btn-sm js-delete-achieve" data-id="${item.id}" style="color: var(--danger); border-color: var(--border-subtle); background: none;" title="Delete achievement">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach event handlers
  grid.querySelectorAll('.js-edit-achieve').forEach(btn => {
    btn.addEventListener('click', () => {
      openAchievementForm(btn.dataset.id);
    });
  });

  grid.querySelectorAll('.js-delete-achieve').forEach(btn => {
    btn.addEventListener('click', () => {
      confirmDeleteAchievement(btn.dataset.id);
    });
  });
}

function initAchievementsAdmin() {
  setupAchievementEventListeners();
}

function setupAchievementEventListeners() {
  // Search
  const searchInput = document.getElementById('achieve-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      ACHIEVE_SEARCH_QUERY = e.target.value.toLowerCase().trim();
      renderAdminAchievements();
    });
  }

  // Sort
  const sortSelect = document.getElementById('achieve-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      ACHIEVE_SORT_BY = e.target.value;
      renderAdminAchievements();
    });
  }

  // Filter chips
  const chipsContainer = document.getElementById('achieve-filter-chips');
  if (chipsContainer) {
    chipsContainer.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        chipsContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ACTIVE_ACHIEVE_FILTER = btn.dataset.filter;
        renderAdminAchievements();
      });
    });
  }

  // Add Achievement button
  const btnAdd = document.getElementById('btn-add-achievement');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      openAchievementForm();
    });
  }

  // Media Type buttons (Photo vs Video)
  const btnTypePhoto = document.getElementById('btn-type-photo');
  const btnTypeVideo = document.getElementById('btn-type-video');
  const panelPhoto = document.getElementById('panel-media-photo');
  const panelVideo = document.getElementById('panel-media-video');
  const inputMediaType = document.getElementById('achieve-media-type');

  function setMediaType(type) {
    if (inputMediaType) inputMediaType.value = type;
    if (type === 'image') {
      if (btnTypePhoto) btnTypePhoto.classList.add('active');
      if (btnTypeVideo) btnTypeVideo.classList.remove('active');
      if (panelPhoto) panelPhoto.style.display = 'block';
      if (panelVideo) panelVideo.style.display = 'none';
    } else {
      if (btnTypeVideo) btnTypeVideo.classList.add('active');
      if (btnTypePhoto) btnTypePhoto.classList.remove('active');
      if (panelVideo) panelVideo.style.display = 'block';
      if (panelPhoto) panelPhoto.style.display = 'none';
    }
    updateAchieveLivePreview();
  }

  if (btnTypePhoto) btnTypePhoto.addEventListener('click', () => setMediaType('image'));
  if (btnTypeVideo) btnTypeVideo.addEventListener('click', () => setMediaType('video'));

  // Photo Source Tabs
  if (panelPhoto) {
    panelPhoto.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        panelPhoto.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('subpanel-photo-upload').style.display = (tab === 'photo-upload') ? 'block' : 'none';
        document.getElementById('subpanel-photo-url').style.display = (tab === 'photo-url') ? 'block' : 'none';
        document.getElementById('subpanel-photo-asset').style.display = (tab === 'photo-asset') ? 'block' : 'none';
      });
    });
  }

  // Video Source Tabs
  if (panelVideo) {
    panelVideo.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        panelVideo.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('subpanel-video-yt').style.display = (tab === 'video-yt') ? 'block' : 'none';
        document.getElementById('subpanel-video-url').style.display = (tab === 'video-url') ? 'block' : 'none';
        document.getElementById('subpanel-video-file').style.display = (tab === 'video-file') ? 'block' : 'none';
      });
    });
  }

  // Auto-generate Slug ID from Title
  const titleInput = document.getElementById('achieve-title-input');
  const idInput = document.getElementById('achieve-id-input');
  if (titleInput && idInput) {
    titleInput.addEventListener('input', () => {
      if (!EDITING_ACHIEVE_ID) {
        idInput.value = 'ach-' + titleInput.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
    });
  }

  // Custom Category Toggle
  const catSelect = document.getElementById('achieve-category-select');
  const customCatWrap = document.getElementById('achieve-custom-category-wrapper');
  if (catSelect && customCatWrap) {
    catSelect.addEventListener('change', () => {
      customCatWrap.style.display = (catSelect.value === '__custom__') ? 'block' : 'none';
    });
  }

  // Populate Studio Asset Dropdown for Achievements
  const photoAssetSelect = document.getElementById('achieve-photo-asset-select');
  if (photoAssetSelect) {
    const assets = [
      { name: 'Money Garland Ceremonial', url: '../assets/images/money_garland.jpg' },
      { name: 'Editorial Bridal Bouquet', url: '../assets/images/editorial_bouquet.jpg' },
      { name: 'Luxury Celebration Hamper', url: '../assets/images/luxury_hamper.jpg' },
      { name: 'Wedding Trousseau Platter', url: '../assets/images/wedding_trousseau.jpg' },
      { name: 'Preserved Floral Cloche', url: '../assets/images/floral_dome.jpg' },
      { name: 'Customized Keepsake Gifts', url: '../assets/images/customized_gifts.jpg' },
      { name: 'Pastel Pearl Garland', url: '../assets/images/pastel_garland.jpg' },
      { name: 'Studio Showcase Hero', url: '../assets/images/hero.jpg' }
    ];
    photoAssetSelect.innerHTML = assets.map(a => `<option value="${a.url}">${a.name}</option>`).join('');
    photoAssetSelect.addEventListener('change', updateAchieveLivePreview);
  }

  // Inputs live preview triggers
  const photoUrlInput = document.getElementById('achieve-photo-url');
  const ytInput = document.getElementById('achieve-video-yt-input');
  const directVideoInput = document.getElementById('achieve-video-direct-url');
  const photoFileInput = document.getElementById('achieve-photo-file');
  const videoFileInput = document.getElementById('achieve-video-file');

  if (photoUrlInput) photoUrlInput.addEventListener('input', updateAchieveLivePreview);
  if (ytInput) ytInput.addEventListener('input', updateAchieveLivePreview);
  if (directVideoInput) directVideoInput.addEventListener('input', updateAchieveLivePreview);

  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          document.getElementById('achieve-media-final').value = re.target.result;
          updateAchieveLivePreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (videoFileInput) {
    videoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        document.getElementById('achieve-media-final').value = url;
        updateAchieveLivePreview();
      }
    });
  }

  // Achievement Form Submit
  const achieveForm = document.getElementById('achievement-form');
  if (achieveForm) {
    achieveForm.addEventListener('submit', handleAchievementFormSubmit);
  }

  // Confirm delete achievement button
  const btnConfirmDelete = document.getElementById('btn-confirm-delete-achieve');
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', executeDeleteAchievement);
  }
}

function updateAchieveLivePreview() {
  const previewBox = document.getElementById('achieve-preview-box');
  const previewRender = document.getElementById('achieve-preview-render');
  const mediaType = document.getElementById('achieve-media-type')?.value || 'image';

  if (!previewBox || !previewRender) return;

  let mediaUrl = '';

  if (mediaType === 'image') {
    const activeTab = document.querySelector('#panel-media-photo .tab-btn.active')?.dataset.tab;
    if (activeTab === 'photo-upload') {
      mediaUrl = document.getElementById('achieve-media-final')?.value || '';
    } else if (activeTab === 'photo-url') {
      mediaUrl = document.getElementById('achieve-photo-url')?.value.trim() || '';
    } else {
      mediaUrl = document.getElementById('achieve-photo-asset-select')?.value || '';
    }

    if (mediaUrl) {
      previewBox.style.display = 'block';
      previewRender.innerHTML = `<img src="${escapeHtml(mediaUrl)}" style="max-height: 220px; width: 100%; object-fit: contain;">`;
    } else {
      previewBox.style.display = 'none';
    }
  } else {
    // Video
    const activeTab = document.querySelector('#panel-media-video .tab-btn.active')?.dataset.tab;
    if (activeTab === 'video-yt') {
      const ytUrl = document.getElementById('achieve-video-yt-input')?.value.trim() || '';
      const ytMatch = ytUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
      if (ytMatch) {
        previewBox.style.display = 'block';
        previewRender.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="width: 100%; aspect-ratio: 16/9; min-height: 200px; border: none;" allowfullscreen></iframe>
        `;
        // Auto-suggest thumbnail if blank
        const thumbInput = document.getElementById('achieve-video-thumb-input');
        if (thumbInput && !thumbInput.value) {
          thumbInput.placeholder = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
        }
      } else {
        previewBox.style.display = 'none';
      }
    } else if (activeTab === 'video-url') {
      const url = document.getElementById('achieve-video-direct-url')?.value.trim() || '';
      if (url) {
        previewBox.style.display = 'block';
        previewRender.innerHTML = `<video src="${escapeHtml(url)}" controls style="max-height: 220px; width: 100%;"></video>`;
      } else {
        previewBox.style.display = 'none';
      }
    } else {
      const localUrl = document.getElementById('achieve-media-final')?.value || '';
      if (localUrl) {
        previewBox.style.display = 'block';
        previewRender.innerHTML = `<video src="${escapeHtml(localUrl)}" controls style="max-height: 220px; width: 100%;"></video>`;
      } else {
        previewBox.style.display = 'none';
      }
    }
  }
}

function openAchievementForm(achieveId = null) {
  EDITING_ACHIEVE_ID = achieveId;
  const modal = document.getElementById('achievement-modal');
  const modalTitle = document.getElementById('modal-achieve-title');
  const idInput = document.getElementById('achieve-id-input');
  const titleInput = document.getElementById('achieve-title-input');
  const catSelect = document.getElementById('achieve-category-select');
  const customCatWrap = document.getElementById('achieve-custom-category-wrapper');
  const customCatInput = document.getElementById('achieve-custom-category');
  const dateInput = document.getElementById('achieve-date-input');
  const badgeInput = document.getElementById('achieve-badge-input');
  const descInput = document.getElementById('achieve-desc-input');
  const linkInput = document.getElementById('achieve-link-input');
  const featuredCheck = document.getElementById('achieve-featured-check');
  const finalMediaInput = document.getElementById('achieve-media-final');
  const previewBox = document.getElementById('achieve-preview-box');

  if (!modal) return;

  if (achieveId) {
    const item = ACHIEVEMENTS.find(a => a.id === achieveId);
    if (!item) return;

    if (modalTitle) modalTitle.textContent = 'Edit Studio Achievement';
    if (idInput) {
      idInput.value = item.id;
      idInput.readOnly = true;
    }
    if (titleInput) titleInput.value = item.title || '';
    if (dateInput) dateInput.value = item.date || '';
    if (badgeInput) badgeInput.value = item.badge || '';
    if (descInput) descInput.value = item.description || '';
    if (linkInput) linkInput.value = item.linkUrl || '';
    if (featuredCheck) featuredCheck.checked = !!item.featured;
    if (finalMediaInput) finalMediaInput.value = item.mediaUrl || '';

    // Category
    if (catSelect) {
      const match = Array.from(catSelect.options).some(o => o.value === item.category);
      if (match) {
        catSelect.value = item.category;
        if (customCatWrap) customCatWrap.style.display = 'none';
      } else {
        catSelect.value = '__custom__';
        if (customCatWrap) customCatWrap.style.display = 'block';
        if (customCatInput) customCatInput.value = item.category || '';
      }
    }

    // Media Type
    const isVideo = item.mediaType === 'video';
    const btnTypePhoto = document.getElementById('btn-type-photo');
    const btnTypeVideo = document.getElementById('btn-type-video');
    const panelPhoto = document.getElementById('panel-media-photo');
    const panelVideo = document.getElementById('panel-media-video');
    const inputMediaType = document.getElementById('achieve-media-type');

    if (inputMediaType) inputMediaType.value = isVideo ? 'video' : 'image';
    if (isVideo) {
      if (btnTypeVideo) btnTypeVideo.classList.add('active');
      if (btnTypePhoto) btnTypePhoto.classList.remove('active');
      if (panelVideo) panelVideo.style.display = 'block';
      if (panelPhoto) panelPhoto.style.display = 'none';

      const ytMatch = (item.mediaUrl || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
      if (ytMatch) {
        document.getElementById('achieve-video-yt-input').value = item.mediaUrl;
      } else {
        document.getElementById('achieve-video-direct-url').value = item.mediaUrl || '';
      }
      if (item.thumbnailUrl) {
        document.getElementById('achieve-video-thumb-input').value = item.thumbnailUrl;
      }
    } else {
      if (btnTypePhoto) btnTypePhoto.classList.add('active');
      if (btnTypeVideo) btnTypeVideo.classList.remove('active');
      if (panelPhoto) panelPhoto.style.display = 'block';
      if (panelVideo) panelVideo.style.display = 'none';
      if (document.getElementById('achieve-photo-url')) {
        document.getElementById('achieve-photo-url').value = item.mediaUrl || '';
      }
    }
  } else {
    // New item
    if (modalTitle) modalTitle.textContent = 'Add Studio Achievement';
    if (idInput) {
      idInput.value = 'ach-' + Date.now();
      idInput.readOnly = false;
    }
    if (titleInput) titleInput.value = '';
    if (dateInput) dateInput.value = '2026';
    if (badgeInput) badgeInput.value = 'Milestone Highlight';
    if (descInput) descInput.value = '';
    if (linkInput) linkInput.value = '';
    if (featuredCheck) featuredCheck.checked = false;
    if (finalMediaInput) finalMediaInput.value = '';

    if (catSelect) catSelect.value = 'Milestone';
    if (customCatWrap) customCatWrap.style.display = 'none';

    // Reset to photo default
    const btnTypePhoto = document.getElementById('btn-type-photo');
    const btnTypeVideo = document.getElementById('btn-type-video');
    const panelPhoto = document.getElementById('panel-media-photo');
    const panelVideo = document.getElementById('panel-media-video');
    const inputMediaType = document.getElementById('achieve-media-type');

    if (inputMediaType) inputMediaType.value = 'image';
    if (btnTypePhoto) btnTypePhoto.classList.add('active');
    if (btnTypeVideo) btnTypeVideo.classList.remove('active');
    if (panelPhoto) panelPhoto.style.display = 'block';
    if (panelVideo) panelVideo.style.display = 'none';

    if (previewBox) previewBox.style.display = 'none';
  }

  updateAchieveLivePreview();
  modal.classList.add('active');
}

function handleAchievementFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('achieve-id-input').value.trim();
  const title = document.getElementById('achieve-title-input').value.trim();
  const catSelectVal = document.getElementById('achieve-category-select').value;
  const customCatVal = document.getElementById('achieve-custom-category')?.value.trim();
  const category = (catSelectVal === '__custom__' && customCatVal) ? customCatVal : catSelectVal;
  const date = document.getElementById('achieve-date-input').value.trim();
  const badge = document.getElementById('achieve-badge-input').value.trim();
  const description = document.getElementById('achieve-desc-input').value.trim();
  const linkUrl = document.getElementById('achieve-link-input').value.trim();
  const featured = document.getElementById('achieve-featured-check').checked;
  const mediaType = document.getElementById('achieve-media-type').value;

  let mediaUrl = '';
  let thumbnailUrl = '';

  if (mediaType === 'image') {
    const activeTab = document.querySelector('#panel-media-photo .tab-btn.active')?.dataset.tab;
    if (activeTab === 'photo-upload') {
      mediaUrl = document.getElementById('achieve-media-final')?.value || '';
    } else if (activeTab === 'photo-url') {
      mediaUrl = document.getElementById('achieve-photo-url')?.value.trim() || '';
    } else {
      mediaUrl = document.getElementById('achieve-photo-asset-select')?.value || '';
    }
    thumbnailUrl = mediaUrl;
  } else {
    // Video
    const activeTab = document.querySelector('#panel-media-video .tab-btn.active')?.dataset.tab;
    if (activeTab === 'video-yt') {
      mediaUrl = document.getElementById('achieve-video-yt-input')?.value.trim() || '';
      const ytMatch = mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
      if (ytMatch) {
        thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
    } else if (activeTab === 'video-url') {
      mediaUrl = document.getElementById('achieve-video-direct-url')?.value.trim() || '';
    } else {
      mediaUrl = document.getElementById('achieve-media-final')?.value || '';
    }

    const customThumb = document.getElementById('achieve-video-thumb-input')?.value.trim();
    if (customThumb) {
      thumbnailUrl = customThumb;
    }
  }

  if (!mediaUrl) {
    showToast('Please provide a photo or video URL/file.', 'error');
    return;
  }

  const achievementObj = {
    id: id || ('ach-' + Date.now()),
    title: title,
    category: category,
    mediaType: mediaType,
    mediaUrl: mediaUrl,
    thumbnailUrl: thumbnailUrl || mediaUrl,
    date: date,
    badge: badge,
    description: description,
    featured: featured,
    linkUrl: linkUrl,
    createdAt: Date.now()
  };

  const existingIdx = ACHIEVEMENTS.findIndex(a => a.id === achievementObj.id);
  if (existingIdx >= 0) {
    achievementObj.createdAt = ACHIEVEMENTS[existingIdx].createdAt || Date.now();
    ACHIEVEMENTS[existingIdx] = achievementObj;
    showToast(`Achievement "${title}" updated successfully!`, 'success');
  } else {
    ACHIEVEMENTS.unshift(achievementObj);
    showToast(`Achievement "${title}" added to showcase!`, 'success');
  }

  // Persist
  saveAchievements(true);

  // Sync to Firestore
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('achievements').doc(achievementObj.id).set(achievementObj)
      .then(() => console.log('[Firebase] Achievement synced live:', achievementObj.id))
      .catch(err => console.warn('[Firebase] Firestore achievement error:', err));
  }

  renderAdminAchievements();
  updateAchievementStats();
  closeAllModals();
}

function confirmDeleteAchievement(achieveId) {
  DELETING_ACHIEVE_ID = achieveId;
  const item = ACHIEVEMENTS.find(a => a.id === achieveId);
  const nameEl = document.getElementById('delete-achieve-name');
  const modal = document.getElementById('delete-achieve-modal');

  if (nameEl) nameEl.textContent = item ? `"${item.title}"` : 'this achievement';
  if (modal) modal.classList.add('active');
}

function executeDeleteAchievement() {
  if (!DELETING_ACHIEVE_ID) return;

  const id = DELETING_ACHIEVE_ID;
  ACHIEVEMENTS = ACHIEVEMENTS.filter(a => a.id !== id);

  saveAchievements(true);

  // Delete from Firestore
  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('achievements').doc(id).delete()
      .then(() => console.log('[Firebase] Achievement doc deleted:', id))
      .catch(err => console.warn('[Firebase] Delete achievement error:', err));
  }

  renderAdminAchievements();
  updateAchievementStats();
  closeAllModals();
  showToast('Achievement removed from showcase.', 'info');
  DELETING_ACHIEVE_ID = null;
}

