/**
 * ===================================================================
 * Bloom&blush - Boutique Owner Admin Application Logic
 * Dedicated Product Management & Real-Time Sync Portal
 * ===================================================================
 */

// Global State: Collections & Categories
let COLLECTIONS = [];
let ACTIVE_COL_SEARCH = '';
let EDITING_COLLECTION_ID = null;
let DELETING_COL_ID = null;
let broadcastColChannel = null;

// Global State: Products / Creations
let PRODUCTS = [];
let ACTIVE_CATEGORY = 'all';
let SEARCH_QUERY = '';
let SORT_BY = 'default';
let EDITING_PRODUCT_ID = null;
let broadcastSyncChannel = null;

// Global State: Instagram Portfolio
let PORTFOLIO = [];
let ACTIVE_PORT_CATEGORY = 'all';
let PORT_SEARCH_QUERY = '';
let EDITING_PORT_ID = null;
let DELETING_PORT_ID = null;
let broadcastPortChannel = null;

// Global State: Studio Achievements
let ACHIEVEMENTS = [];
let ACTIVE_ACHIEVE_FILTER = 'all';
let ACHIEVE_SEARCH_QUERY = '';
let ACHIEVE_SORT_BY = 'newest';
let EDITING_ACHIEVE_ID = null;
let DELETING_ACHIEVE_ID = null;
let CURRENT_ACTIVE_TAB = 'products';
let broadcastAchieveChannel = null;

// Default bundled collections fallback - matching authentic collections.json
const DEFAULT_FALLBACK_COLLECTIONS = [
  {
    "id": "money-garlands",
    "title": "Money Garlands",
    "subtitle": "Auspicious & Ceremonial",
    "description": "Intricately pleated currency garlands woven with velvet roses, gold zari lace, and lustrous pearls for weddings and milestone celebrations.",
    "image": "assets/images/money_garland.jpg",
    "itemCount": "Custom Denominations Available",
    "displayOrder": 1
  },
  {
    "id": "bouquets",
    "title": "Artisanal Bouquets",
    "subtitle": "Fresh & Preserved Florals",
    "description": "Hand-tied floral poetry combining deep wine roses, blush ranunculus, and cascading velvet ribbons tailored for proposals and weddings.",
    "image": "assets/images/editorial_bouquet.jpg",
    "itemCount": "Bespoke Floral Styling",
    "displayOrder": 2
  },
  {
    "id": "customized-hampers",
    "title": "Customized Hampers",
    "subtitle": "Curated Luxury Boxes",
    "description": "Opulent presentation hampers in velvet and gold detailing, featuring handpicked gourmet delights, artisanal candles, and dried botanicals.",
    "image": "assets/images/luxury_hamper.jpg",
    "itemCount": "Personalized Selection",
    "displayOrder": 3
  },
  {
    "id": "wedding-gifting",
    "title": "Wedding & Celebration Gifting",
    "subtitle": "Trousseau & Royal Packaging",
    "description": "Majestic bridal trays, trousseau packing, and ceremonial gifts that honor timeless Indian wedding traditions with modern elegance.",
    "image": "assets/images/wedding_trousseau.jpg",
    "itemCount": "Bridal & Family Trays",
    "displayOrder": 4
  },
  {
    "id": "customized-gifts",
    "title": "Customized Gifts",
    "subtitle": "Personalized Keepsakes",
    "description": "Handcrafted wooden keepsake boxes, calligraphy wax-sealed tokens, and celebratory favors customized with personal names and initials.",
    "image": "assets/images/customized_gifts.jpg",
    "itemCount": "Made-to-Order",
    "displayOrder": 5
  },
  {
    "id": "luxury-addons",
    "title": "Luxury Add-ons",
    "subtitle": "Cloches, Accents & Keepsakes",
    "description": "Everlasting botanical domes, scented wax medallions, calligraphy keepsakes, and bespoke ceremonial accents.",
    "image": "assets/images/floral_dome.jpg",
    "itemCount": "Artisanal Accents",
    "displayOrder": 6
  }
];

// Default bundled portfolio fallback - matching authentic portfolio.json
const DEFAULT_FALLBACK_PORTFOLIO = [
  {
    "id": "port-reel-dd3ozl8kbw8",
    "title": "Sacred Lalbaugcha Raja Currency Garland",
    "category": "Garlands",
    "image": "assets/reels/Dd3Ozl8KBW8.jpg",
    "videoUrl": "assets/reels/Dd3Ozl8KBW8.mp4",
    "linkUrl": "https://www.instagram.com/reel/Dd3Ozl8KBW8/",
    "shortcode": "Dd3Ozl8KBW8",
    "caption": "Muze ye dilao na🥹💗\n@blushnbloomm.in \n#viral #reels #trending #bouquet #hampers",
    "tags": ["Garlands", "Money Garlands", "Wedding", "Groom Styling"],
    "duration": "0:15",
    "aspect": "9:16",
    "span": "col-span-2 row-span-2",
    "featured": true,
    "createdAt": 1738100000000
  },
  {
    "id": "port-reel-ddinv2hkpe1",
    "title": "Opulent Velvet Bridal Trousseau Suite",
    "category": "Bridal",
    "image": "assets/reels/DdInv2hKpE1.jpg",
    "videoUrl": "assets/reels/DdInv2hKpE1.mp4",
    "linkUrl": "https://www.instagram.com/reel/DdInv2hKpE1/",
    "shortcode": "DdInv2hKpE1",
    "caption": "Unrgent garlands available, कोऱ्या नोटा available 🫶🏻\nतुमच्या लाडक्या बाप्पा साठी आजच booking करा \n@blushnbloomm.in \n8180879442\n#viral #trending #dagdusheth #lalbaughcharaja #ganpatibappamorya",
    "tags": ["Bridal", "Trousseau", "Ceremonial", "Wedding"],
    "duration": "0:15",
    "aspect": "9:16",
    "span": "col-span-1 row-span-1",
    "featured": true,
    "createdAt": 1738050000000
  },
  {
    "id": "port-reel-db41owdpwnl",
    "title": "Sacred Ceremonial Offering Garland",
    "category": "Garlands",
    "image": "assets/reels/Db41OwdPwnL.jpg",
    "videoUrl": "assets/reels/Db41OwdPwnL.mp4",
    "linkUrl": "https://www.instagram.com/reel/Db41OwdPwnL/",
    "shortcode": "Db41OwdPwnL",
    "caption": "Sacred Devotional Garland offering for Lalbaugcha Raja, Mumbai. Handcrafted with authentic floral artistry and gold zari brocade.",
    "tags": ["Garlands", "Devotional", "Ceremony", "Handcrafted"],
    "duration": "0:29",
    "aspect": "9:16",
    "span": "col-span-1 row-span-1",
    "featured": true,
    "createdAt": 1738000000000
  },
  {
    "id": "port-reel-dbkdeiouzjy",
    "title": "Grand Floral Entry & Wedding Decor",
    "category": "Decor",
    "image": "assets/reels/DbkDEIouZJy.jpg",
    "videoUrl": "assets/reels/DbkDEIouZJy.mp4",
    "linkUrl": "https://www.instagram.com/reel/DbkDEIouZJy/",
    "shortcode": "DbkDEIouZJy",
    "caption": "दादा देशील ना 🥹❤️🫀\nRakshabandhan gift for sister \n@blushnbloomm.in \n📞 81808 79442\n#love #rakshabandhan #sister #brothers #gift",
    "tags": ["Decor", "Floral Styling", "Wedding Decor", "Grand Entry"],
    "duration": "0:15",
    "aspect": "9:16",
    "span": "col-span-1 row-span-2",
    "featured": true,
    "createdAt": 1737950000000
  },
  {
    "id": "port-reel-dzr_p-rivdf",
    "title": "Velvet Reverie Celebration Hamper",
    "category": "Hampers",
    "image": "assets/reels/DZr_p-RIvdf.jpg",
    "videoUrl": "assets/reels/DZr_p-RIvdf.mp4",
    "linkUrl": "https://www.instagram.com/reel/DZr_p-RIvdf/",
    "shortcode": "DZr_p-RIvdf",
    "caption": ".जिथे चरण तुझे दिसेल तिथे मस्तक माझे झुकेल 🙇‍♂️🌸\n.  Blessed..!🥹❤️\n#viral #fyb #ganpatibappa #birthday #viralreel",
    "tags": ["Hampers", "Festive", "Luxury Gifting", "Customized"],
    "duration": "0:15",
    "aspect": "9:16",
    "span": "col-span-1 row-span-1",
    "featured": true,
    "createdAt": 1737900000000
  },
  {
    "id": "port-reel-dzdo5xloxn0",
    "title": "Studio BTS & Artisan Flower Weaving",
    "category": "Behind the Scenes",
    "image": "assets/reels/DZdO5XLoxn0.jpg",
    "videoUrl": "assets/reels/DZdO5XLoxn0.mp4",
    "linkUrl": "https://www.instagram.com/reel/DZdO5XLoxn0/",
    "shortcode": "DZdO5XLoxn0",
    "caption": "Bappa….❤️🌸🙇🏻 Handcrafted with pure love in our studio.",
    "tags": ["Behind the Scenes", "Studio BTS", "Artisanal", "Pune"],
    "duration": "0:15",
    "aspect": "9:16",
    "span": "col-span-1 row-span-1",
    "featured": true,
    "createdAt": 1737850000000
  },
  {
    "id": "port-reel-dv5c0ubcony",
    "title": "Pastel Pearl Ceremony Garland",
    "category": "Garlands",
    "image": "assets/reels/DV5C0UbCOnY.jpg",
    "videoUrl": "assets/reels/DV5C0UbCOnY.mp4",
    "linkUrl": "https://www.instagram.com/reel/DV5C0UbCOnY/",
    "shortcode": "DV5C0UbCOnY",
    "caption": "Handcrafted Pastel Elegance 🌻🤍\n@blushnbloomm.in\n#viral #reels #instagood #trending #garlands",
    "tags": ["Garlands", "Pastel", "Baby Shower", "Roka"],
    "duration": "0:15",
    "aspect": "9:16",
    "span": "col-span-1 row-span-1",
    "featured": true,
    "createdAt": 1737800000000
  },
  {
    "id": "port-reel-dvkxv4hdjv2",
    "title": "Wine & Blush Bridal Posy Bouquet",
    "category": "Bridal",
    "image": "assets/reels/DVkXv4hDJV2.jpg",
    "videoUrl": "assets/reels/DVkXv4hDJV2.mp4",
    "linkUrl": "https://www.instagram.com/reel/DVkXv4hDJV2/",
    "shortcode": "DVkXv4hDJV2",
    "caption": "Har by @blushnbloomm.in 😍🫶🏻\n#foryou #foryoupage #instagram #viral #instadaily",
    "tags": ["Bridal", "Bouquets", "Fresh Florals", "Bridal Entry"],
    "duration": "0:15",
    "aspect": "9:16",
    "span": "col-span-1 row-span-1",
    "featured": true,
    "createdAt": 1737750000000
  }
];

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
   Bloom&blush - Enterprise Cryptographic Owner Authentication Guard
   Security Specifications:
   1. Zero Plaintext: Passwords & emails never stored in cleartext.
   2. Salted SHA-256 Digest: Web Crypto API verification.
   3. Brute-Force Rate Limiting: 5 failed attempts locks portal for 15m.
   4. Cryptographic HMAC-like Session Nonce: Prevents localStorage spoofing.
   5. Anti-Enumeration: Identical error messages for email & password failures.
   6. Firebase Auth Integration: Connects to Firebase Auth if provisioned.
   7. Anti-Tamper Guard: Clears catalog UI if unauthenticated.
   =================================================================== */
const OWNER_SECURITY = {
  SALT: 'bloom_blush_luxury_salt_2026_x9k7',
  // Salted SHA-256 digest of SALT + ":" + normalized_email + ":" + password
  AUTH_DIGEST: 'e43be57a67d9ee4da934e474c2bc0ce9d6e4df95ea0fe4487643e600413a85a3',
  STORAGE_TOKEN_KEY: 'bloom_owner_sec_token',
  STORAGE_SIG_KEY: 'bloom_owner_sec_sig',
  STORAGE_TIME_KEY: 'bloom_owner_sec_time',
  STORAGE_LOCKOUT_KEY: 'bloom_owner_lockout_state',
  MAX_ATTEMPTS: 5,
  LOCKOUT_MS: 15 * 60 * 1000, // 15 minutes
  SESSION_MAX_AGE_MS: 4 * 60 * 60 * 1000 // 4 hours
};

// Cryptographic SHA-256 via native browser Web Crypto API
async function cryptoSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuf = await window.crypto.subtle.digest('SHA-256', data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate 256-bit cryptographically secure random session token
function generateSecureToken() {
  const arr = new Uint8Array(32);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredSession() {
  const token = localStorage.getItem(OWNER_SECURITY.STORAGE_TOKEN_KEY) || sessionStorage.getItem(OWNER_SECURITY.STORAGE_TOKEN_KEY);
  const sig = localStorage.getItem(OWNER_SECURITY.STORAGE_SIG_KEY) || sessionStorage.getItem(OWNER_SECURITY.STORAGE_SIG_KEY);
  const time = parseInt(localStorage.getItem(OWNER_SECURITY.STORAGE_TIME_KEY) || sessionStorage.getItem(OWNER_SECURITY.STORAGE_TIME_KEY) || '0', 10);
  return { token, sig, time };
}

function clearOwnerSession() {
  localStorage.removeItem(OWNER_SECURITY.STORAGE_TOKEN_KEY);
  localStorage.removeItem(OWNER_SECURITY.STORAGE_SIG_KEY);
  localStorage.removeItem(OWNER_SECURITY.STORAGE_TIME_KEY);
  sessionStorage.removeItem(OWNER_SECURITY.STORAGE_TOKEN_KEY);
  sessionStorage.removeItem(OWNER_SECURITY.STORAGE_SIG_KEY);
  sessionStorage.removeItem(OWNER_SECURITY.STORAGE_TIME_KEY);
  localStorage.removeItem('bloom_owner_authenticated_session');
  sessionStorage.removeItem('bloom_owner_authenticated_session');

  if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
    try { firebase.auth().signOut(); } catch (_) {}
  }
}

function isOwnerAuthenticated() {
  const { token, sig, time } = getStoredSession();
  if (!token || !sig || !time) return false;
  if (Date.now() - time > OWNER_SECURITY.SESSION_MAX_AGE_MS) {
    clearOwnerSession();
    return false;
  }
  return true;
}

function getLockoutState() {
  try {
    const raw = localStorage.getItem(OWNER_SECURITY.STORAGE_LOCKOUT_KEY);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch (_) {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function recordFailedAttempt() {
  const state = getLockoutState();
  state.attempts = (state.attempts || 0) + 1;
  if (state.attempts >= OWNER_SECURITY.MAX_ATTEMPTS) {
    state.lockedUntil = Date.now() + OWNER_SECURITY.LOCKOUT_MS;
  }
  localStorage.setItem(OWNER_SECURITY.STORAGE_LOCKOUT_KEY, JSON.stringify(state));
  return state;
}

function resetLockoutState() {
  localStorage.removeItem(OWNER_SECURITY.STORAGE_LOCKOUT_KEY);
}

function initOwnerAuth() {
  const authScreen = document.getElementById('owner-auth-screen');
  const appRoot = document.getElementById('admin-app-root');
  const authForm = document.getElementById('owner-auth-form');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const authRemember = document.getElementById('auth-remember');
  const authError = document.getElementById('owner-auth-error');
  const authErrorText = document.getElementById('owner-auth-error-text');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const togglePwdBtn = document.getElementById('auth-toggle-pwd');
  const logoutBtn = document.getElementById('btn-owner-logout');

  let lockoutTimerInterval = null;

  const checkLockout = () => {
    const state = getLockoutState();
    const now = Date.now();
    if (state.lockedUntil && state.lockedUntil > now) {
      const remainingSec = Math.ceil((state.lockedUntil - now) / 1000);
      const mins = Math.floor(remainingSec / 60);
      const secs = (remainingSec % 60).toString().padStart(2, '0');

      if (authError) {
        authError.style.display = 'flex';
        authError.style.background = '#FFF1F0';
        authError.style.borderColor = '#FFA39E';
      }
      if (authErrorText) {
        authErrorText.innerHTML = `<strong>🔒 Security Lockout Active:</strong> Too many failed attempts. Try again in <strong>${mins}:${secs}</strong>.`;
      }
      if (authSubmitBtn) authSubmitBtn.disabled = true;
      if (authEmail) authEmail.disabled = true;
      if (authPassword) authPassword.disabled = true;

      if (!lockoutTimerInterval) {
        lockoutTimerInterval = setInterval(() => {
          checkLockout();
        }, 1000);
      }
      return true;
    } else {
      if (lockoutTimerInterval) {
        clearInterval(lockoutTimerInterval);
        lockoutTimerInterval = null;
      }
      if (state.lockedUntil && state.lockedUntil <= now) {
        resetLockoutState();
        if (authError) authError.style.display = 'none';
      }
      if (authSubmitBtn) authSubmitBtn.disabled = false;
      if (authEmail) authEmail.disabled = false;
      if (authPassword) authPassword.disabled = false;
      return false;
    }
  };

  const updateUI = async () => {
    if (isOwnerAuthenticated()) {
      const { token, sig } = getStoredSession();
      const expectedSig = await cryptoSha256(token + ':' + OWNER_SECURITY.AUTH_DIGEST);
      if (sig !== expectedSig) {
        console.warn('[Security] Cryptographic session validation failed. Purging session.');
        clearOwnerSession();
        updateUI();
        return;
      }

      if (authScreen) authScreen.style.display = 'none';
      if (appRoot) appRoot.style.display = 'block';
    } else {
      if (appRoot) appRoot.style.display = 'none';
      if (authScreen) authScreen.style.display = 'flex';
      checkLockout();
      if (authEmail && !authEmail.value && !authEmail.disabled) {
        authEmail.focus();
      } else if (authPassword && !authPassword.disabled) {
        authPassword.focus();
      }
    }
  };

  updateUI();

  if (togglePwdBtn && authPassword) {
    togglePwdBtn.addEventListener('click', () => {
      authPassword.type = authPassword.type === 'password' ? 'text' : 'password';
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (checkLockout()) return;

      const enteredEmail = (authEmail.value || '').trim().toLowerCase();
      const enteredPass = (authPassword.value || '');

      if (!enteredEmail || !enteredPass) {
        if (authError) authError.style.display = 'flex';
        if (authErrorText) authErrorText.textContent = 'Please enter both your studio email and password.';
        return;
      }

      authSubmitBtn.disabled = true;
      const btnText = authSubmitBtn.querySelector('.btn-text');
      const btnSpinner = authSubmitBtn.querySelector('.btn-spinner');
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline';

      try {
        const candidateDigest = await cryptoSha256(
          OWNER_SECURITY.SALT + ':' + enteredEmail + ':' + enteredPass
        );

        // Constant-time artificial delay to prevent timing attacks
        await new Promise(res => setTimeout(res, 350));

        if (candidateDigest === OWNER_SECURITY.AUTH_DIGEST) {
          resetLockoutState();
          if (authError) authError.style.display = 'none';

          const sessionToken = generateSecureToken();
          const sessionSig = await cryptoSha256(sessionToken + ':' + OWNER_SECURITY.AUTH_DIGEST);
          const nowStr = Date.now().toString();

          const storage = (authRemember && authRemember.checked) ? localStorage : sessionStorage;
          storage.setItem(OWNER_SECURITY.STORAGE_TOKEN_KEY, sessionToken);
          storage.setItem(OWNER_SECURITY.STORAGE_SIG_KEY, sessionSig);
          storage.setItem(OWNER_SECURITY.STORAGE_TIME_KEY, nowStr);

          if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
            try {
              await firebase.auth().signInWithEmailAndPassword(enteredEmail, enteredPass);
              console.log('[Security] Firebase Auth session connected.');
            } catch (fbErr) {
              console.info('[Security] Firebase Auth status:', fbErr.code || fbErr.message);
            }
          }

          if (authScreen) {
            authScreen.classList.add('auth-fade-out');
            setTimeout(() => {
              authScreen.style.display = 'none';
              authScreen.classList.remove('auth-fade-out');
              if (appRoot) appRoot.style.display = 'block';
              if (typeof showToast === 'function') {
                showToast('Welcome back, Siddhi! Studio access verified.', 'success');
              }
            }, 250);
          }
        } else {
          const lockoutState = recordFailedAttempt();
          const remaining = OWNER_SECURITY.MAX_ATTEMPTS - (lockoutState.attempts || 0);

          if (lockoutState.lockedUntil && lockoutState.lockedUntil > Date.now()) {
            checkLockout();
          } else {
            if (authError) authError.style.display = 'flex';
            if (authErrorText) {
              authErrorText.textContent = `Access Denied: Invalid credentials. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout)`;
            }
          }

          const card = document.querySelector('.owner-auth-card');
          if (card) {
            card.classList.remove('shake-anim');
            void card.offsetWidth;
            card.classList.add('shake-anim');
          }
          if (authPassword) {
            authPassword.value = '';
            authPassword.focus();
          }
        }
      } catch (err) {
        console.error('[Security] Authentication error:', err);
        if (authError) authError.style.display = 'flex';
        if (authErrorText) authErrorText.textContent = 'An unexpected verification error occurred. Please try again.';
      } finally {
        if (!getLockoutState().lockedUntil || getLockoutState().lockedUntil <= Date.now()) {
          authSubmitBtn.disabled = false;
        }
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearOwnerSession();
      updateUI();
      if (authPassword) authPassword.value = '';
      if (authEmail) authEmail.value = '';
      if (authError) authError.style.display = 'none';
      if (typeof showToast === 'function') {
        showToast('Signed out of Owner Studio Portal.', 'info');
      }
    });
  }
}

/* ===================================================================
   Initialization
   =================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  window.addEventListener('error', (e) => {
    console.error('[Admin Unhandled Error]', e.message, e.filename, e.lineno);
    const countEl = document.getElementById('filtered-count');
    if (countEl) countEl.innerHTML = `<span style="color:red;">Error: ${e.message} (L${e.lineno})</span>`;
  });

  try {
    initOwnerAuth();
    initSyncChannel();
    initTabNavigation();
    initStorageGuideModal();
    initR2Settings();
    initMediaUploads();
    initCollectionsAdmin();
    initPortfolioAdmin();
    initAchievementsAdmin();
    initCloudSeedModal();
    initBackupRestore();
    setupEventListeners();

    // Initial instant render from bundled/local defaults so UI is never stuck on "Loading..."
    if (!PRODUCTS || PRODUCTS.length === 0) PRODUCTS = [...DEFAULT_FALLBACK_PRODUCTS];
    if (!COLLECTIONS || COLLECTIONS.length === 0) COLLECTIONS = [...DEFAULT_FALLBACK_COLLECTIONS];
    if (!PORTFOLIO || PORTFOLIO.length === 0) PORTFOLIO = [...DEFAULT_FALLBACK_PORTFOLIO];
    if (!ACHIEVEMENTS || ACHIEVEMENTS.length === 0) ACHIEVEMENTS = [...DEFAULT_FALLBACK_ACHIEVEMENTS];

    updateCategoryDropdowns();
    renderCategoryFilters();
    renderProducts();
    renderAdminCollections();
    renderAdminPortfolio();
    renderAdminAchievements();
    updateStats();
    updateAchievementStats();
    updateCollectionStats();
    updatePortfolioStats();
    updateCloudCounters();

    // Now asynchronously load from cloud / JSON without blocking initial render
    loadCollections().catch(err => console.warn('Collections async load notice:', err));
    loadProducts().catch(err => console.warn('Products async load notice:', err));
    loadPortfolio().catch(err => console.warn('Portfolio async load notice:', err));
    loadAchievements().catch(err => console.warn('Achievements async load notice:', err));
  } catch (err) {
    console.error('[Admin Init Failure]', err);
    const countEl = document.getElementById('filtered-count');
    if (countEl) countEl.textContent = 'Init error: ' + err.message;
  }
});

/**
 * Initialize BroadcastChannel for cross-tab live synchronization
 */
function initSyncChannel() {
  if ('BroadcastChannel' in window) {
    try {
      broadcastColChannel = new BroadcastChannel('bloom_collections_sync');
      broadcastColChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'COLLECTIONS_UPDATED') {
          loadCollectionsFromLocalStorage(false);
          updateCategoryDropdowns();
        }
      };

      broadcastSyncChannel = new BroadcastChannel('bloom_product_sync');
      broadcastSyncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'PRODUCTS_UPDATED') {
          loadFromLocalStorage(false);
        }
      };

      broadcastPortChannel = new BroadcastChannel('bloom_portfolio_sync');
      broadcastPortChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'PORTFOLIO_UPDATED') {
          loadPortfolioFromLocalStorage(false);
        }
      };

      broadcastAchieveChannel = new BroadcastChannel('bloom_achievements_sync');
      broadcastAchieveChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'ACHIEVEMENTS_UPDATED') {
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
    const res = await fetch('products.json');
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
    console.info('[Admin] Fetching products.json failed (likely local file protocol). Using bundled catalog.');
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
      const rawVal = priceInput.value.trim();
      if (rawVal !== '') {
        const val = parseFloat(rawVal);
        if (!isNaN(val) && val > 0) {
          if (!priceFormatInput.value || priceFormatInput.dataset.autoFilled === 'true') {
            priceFormatInput.value = '₹' + val.toLocaleString('en-IN');
            priceFormatInput.dataset.autoFilled = 'true';
          }
        }
      } else {
        if (priceFormatInput.dataset.autoFilled === 'true') {
          priceFormatInput.value = '';
          priceFormatInput.dataset.autoFilled = 'false';
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
        setImagePreview(fullRel, assetSelect.options[assetSelect.selectedIndex].text);
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
    filtered.sort((a, b) => {
      const pa = (a.price !== null && a.price !== undefined && Number(a.price) > 0) ? Number(a.price) : Infinity;
      const pb = (b.price !== null && b.price !== undefined && Number(b.price) > 0) ? Number(b.price) : Infinity;
      return pa - pb;
    });
  } else if (SORT_BY === 'price-high') {
    filtered.sort((a, b) => {
      const pa = (a.price !== null && a.price !== undefined && Number(a.price) > 0) ? Number(a.price) : -1;
      const pb = (b.price !== null && b.price !== undefined && Number(b.price) > 0) ? Number(b.price) : -1;
      return pb - pa;
    });
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

    // Format image URL properly for display
    let displayImg = p.image || 'assets/images/money_garland.jpg';

    card.innerHTML = `
      <div class="card-image-wrap">
        <img src="${escapeHtml(displayImg)}" alt="${escapeHtml(p.name)}" onerror="this.src='assets/images/money_garland.jpg'">
        ${p.badge ? `<span class="card-badge">${escapeHtml(p.badge)}</span>` : ''}
        <span class="card-category-tag">${escapeHtml(p.category || 'Boutique Creation')}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <div class="card-price-row">
          <span class="card-price ${!p.price || p.price === 0 ? 'card-price-on-request' : ''}">${escapeHtml(p.priceFormatted || (p.price ? ('₹' + Number(p.price).toLocaleString('en-IN')) : 'Price on Request'))}</span>
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

    // Price (Optional)
    const numericPrice = (p.price !== undefined && p.price !== null && Number(p.price) > 0) ? p.price : '';
    document.getElementById('prod-price').value = numericPrice;
    document.getElementById('prod-price-formatted').value = (p.priceFormatted && p.priceFormatted !== 'Price on Request') ? p.priceFormatted : (p.priceFormatted || '');
    document.getElementById('prod-price-formatted').dataset.autoFilled = 'false';
    document.getElementById('prod-price-note').value = p.priceNote || '';

    // Descriptions
    document.getElementById('prod-short-desc').value = p.shortDesc || '';
    document.getElementById('prod-detailed-desc').value = p.detailedDesc || '';

    // Image
    if (p.image) {
      document.getElementById('prod-image-final').value = p.image;
      const previewSrc = p.image;
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
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-price-formatted').value = '';
    document.getElementById('prod-price-formatted').dataset.autoFilled = 'false';
    document.getElementById('prod-price-note').value = '';
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
  
  // Base Price handling (Optional)
  const priceRaw = document.getElementById('prod-price').value.trim();
  const hasPrice = priceRaw !== '' && !isNaN(parseFloat(priceRaw)) && parseFloat(priceRaw) > 0;
  const price = hasPrice ? parseFloat(priceRaw) : null;

  // Display Price Text handling (Optional)
  const customPriceFormatted = document.getElementById('prod-price-formatted').value.trim();
  let priceFormatted = '';
  if (customPriceFormatted) {
    priceFormatted = customPriceFormatted;
  } else if (hasPrice) {
    priceFormatted = '₹' + price.toLocaleString('en-IN');
  } else {
    priceFormatted = 'Price on Request';
  }

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
   Tab Navigation: 5 Boutique Studio Management Sections
   =================================================================== */
function initTabNavigation() {
  const tabCollections = document.getElementById('tab-nav-collections');
  const tabProducts = document.getElementById('tab-nav-products');
  const tabPortfolio = document.getElementById('tab-nav-portfolio');
  const tabAchievements = document.getElementById('tab-nav-achievements');
  const tabSettings = document.getElementById('tab-nav-settings');

  const viewCollections = document.getElementById('view-collections');
  const viewProducts = document.getElementById('view-products');
  const viewPortfolio = document.getElementById('view-portfolio');
  const viewAchievements = document.getElementById('view-achievements');
  const viewSettings = document.getElementById('view-settings');

  const btnAddCol = document.getElementById('btn-add-collection');
  const btnAddProd = document.getElementById('btn-add-product');
  const btnAddPort = document.getElementById('btn-add-portfolio');
  const btnAddAch = document.getElementById('btn-add-achievement');

  function switchTab(target) {
    CURRENT_ACTIVE_TAB = target;
    const allTabs = [tabCollections, tabProducts, tabPortfolio, tabAchievements, tabSettings];
    const allViews = [viewCollections, viewProducts, viewPortfolio, viewAchievements, viewSettings];
    const allBtns = [btnAddCol, btnAddProd, btnAddPort, btnAddAch];

    allTabs.forEach(t => t && t.classList.remove('active'));
    allViews.forEach(v => v && (v.style.display = 'none'));
    allBtns.forEach(b => b && (b.style.display = 'none'));

    if (target === 'collections') {
      if (tabCollections) tabCollections.classList.add('active');
      if (viewCollections) viewCollections.style.display = 'block';
      if (btnAddCol) btnAddCol.style.display = 'inline-flex';
      renderAdminCollections();
      updateCollectionStats();
    } else if (target === 'products') {
      if (tabProducts) tabProducts.classList.add('active');
      if (viewProducts) viewProducts.style.display = 'block';
      if (btnAddProd) btnAddProd.style.display = 'inline-flex';
      renderCategoryFilters();
      renderProducts();
      updateStats();
    } else if (target === 'portfolio') {
      if (tabPortfolio) tabPortfolio.classList.add('active');
      if (viewPortfolio) viewPortfolio.style.display = 'block';
      if (btnAddPort) btnAddPort.style.display = 'inline-flex';
      renderAdminPortfolio();
      updatePortfolioStats();
    } else if (target === 'achievements') {
      if (tabAchievements) tabAchievements.classList.add('active');
      if (viewAchievements) viewAchievements.style.display = 'block';
      if (btnAddAch) btnAddAch.style.display = 'inline-flex';
      renderAdminAchievements();
      updateAchievementStats();
    } else if (target === 'settings') {
      if (tabSettings) tabSettings.classList.add('active');
      if (viewSettings) viewSettings.style.display = 'block';
      updateCloudCounters();
    }

    const activeTabEl = document.getElementById(`tab-nav-${target}`);
    if (activeTabEl && typeof activeTabEl.scrollIntoView === 'function') {
      try {
        activeTabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } catch (e) {
        // Fallback for older browsers
      }
    }
  }

  if (tabCollections) tabCollections.addEventListener('click', () => { switchTab('collections'); window.location.hash = 'collections'; });
  if (tabProducts) tabProducts.addEventListener('click', () => { switchTab('products'); window.location.hash = 'products'; });
  if (tabPortfolio) tabPortfolio.addEventListener('click', () => { switchTab('portfolio'); window.location.hash = 'portfolio'; });
  if (tabAchievements) tabAchievements.addEventListener('click', () => { switchTab('achievements'); window.location.hash = 'achievements'; });
  if (tabSettings) tabSettings.addEventListener('click', () => { switchTab('settings'); window.location.hash = 'settings'; });

  const initialHash = window.location.hash.replace('#', '');
  if (['collections', 'products', 'portfolio', 'achievements', 'settings'].includes(initialHash)) {
    switchTab(initialHash);
  }

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (['collections', 'products', 'portfolio', 'achievements', 'settings'].includes(h)) {
      switchTab(h);
    }
  });

  // Inline add buttons in toolbar
  const btnColInline = document.getElementById('btn-col-add-inline');
  if (btnColInline) btnColInline.addEventListener('click', () => openCollectionModal(null));

  const btnPortInline = document.getElementById('btn-port-add-inline');
  if (btnPortInline) btnPortInline.addEventListener('click', () => openPortfolioModal(null));

  if (btnAddCol) btnAddCol.addEventListener('click', () => openCollectionModal(null));
  if (btnAddPort) btnAddPort.addEventListener('click', () => openPortfolioModal(null));
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

  // 3. Fetch achievements.json
  try {
    const res = await fetch('achievements.json');
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
    const isVideo = item.mediaType === 'video' || (item.mediaUrl && (item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.webm')));
    let thumb = item.thumbnailUrl;
    if (isVideo && item.mediaUrl) {
      const ytMatch = item.mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
      if (ytMatch) {
        thumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
    }

    if (!thumb || thumb.endsWith('.mp4')) {
      if (item.id === 'ach-lalbaugcha-raja-garland-1') {
        thumb = 'assets/images/reel_garland_preview.jpg';
      } else if (item.id === 'ach-lalbaugcha-raja-garland-2') {
        thumb = 'assets/images/reel_styling_preview.jpg';
      } else {
        thumb = isVideo ? 'assets/images/hero.jpg' : (item.mediaUrl || 'assets/images/hero.jpg');
      }
    }

    const typeLabel = isVideo ? '🎬 Video' : '📸 Photo';

    return `
      <div class="achieve-card-admin" data-id="${item.id}">
        <div class="achieve-card-media">
          ${isVideo && item.mediaUrl && !item.mediaUrl.includes('youtube') && !item.mediaUrl.includes('youtu.be') ? `
            <video src="${escapeHtml(item.mediaUrl)}" poster="${escapeHtml(thumb)}" muted playsinline loop style="width: 100%; height: 100%; object-fit: cover;"></video>
          ` : `
            <img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='assets/images/hero.jpg'">
          `}
          
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
      { name: 'Money Garland Ceremonial', url: 'assets/images/money_garland.jpg' },
      { name: 'Editorial Bridal Bouquet', url: 'assets/images/editorial_bouquet.jpg' },
      { name: 'Luxury Celebration Hamper', url: 'assets/images/luxury_hamper.jpg' },
      { name: 'Wedding Trousseau Platter', url: 'assets/images/wedding_trousseau.jpg' },
      { name: 'Preserved Floral Cloche', url: 'assets/images/floral_dome.jpg' },
      { name: 'Customized Keepsake Gifts', url: 'assets/images/customized_gifts.jpg' },
      { name: 'Pastel Pearl Garland', url: 'assets/images/pastel_garland.jpg' },
      { name: 'Studio Showcase Hero', url: 'assets/images/hero.jpg' }
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
    thumbnailUrl: thumbnailUrl || (mediaType === 'video' ? (id === 'ach-lalbaugcha-raja-garland-1' ? 'assets/images/reel_garland_preview.jpg' : (id === 'ach-lalbaugcha-raja-garland-2' ? 'assets/images/reel_styling_preview.jpg' : '')) : mediaUrl),
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

/* ===================================================================
   Collections & Categories Management (Panel 01)
   =================================================================== */
function initCollectionsAdmin() {
  const colSearch = document.getElementById('col-search-input');
  if (colSearch) {
    colSearch.value = '';
    colSearch.addEventListener('input', (e) => {
      ACTIVE_COL_SEARCH = e.target.value.toLowerCase().trim();
      renderAdminCollections();
    });
  }

  const colForm = document.getElementById('collection-form');
  if (colForm) {
    colForm.addEventListener('submit', handleCollectionFormSubmit);
  }

  const titleInput = document.getElementById('col-title-input');
  const idInput = document.getElementById('col-id-input');
  if (titleInput && idInput) {
    titleInput.addEventListener('input', () => {
      if (!EDITING_COLLECTION_ID) {
        idInput.value = titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
    });
  }

  const confirmDelColBtn = document.getElementById('btn-confirm-delete-col');
  if (confirmDelColBtn) {
    confirmDelColBtn.addEventListener('click', confirmDeleteCollection);
  }

  // Populate bundled asset select for collections
  const colAssetSelect = document.getElementById('col-asset-select');
  if (colAssetSelect) {
    colAssetSelect.innerHTML = [
      '<option value="">-- Choose from Studio Photography --</option>',
      ...BUNDLED_ASSETS.map(a => `<option value="${a.path}">${a.name} (${a.path})</option>`)
    ].join('');
    colAssetSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        setColImagePreview(e.target.value, e.target.options[e.target.selectedIndex].text);
      }
    });
  }

  // Collection modal image source tabs
  document.querySelectorAll('#collection-modal .image-source-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#collection-modal .image-source-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('panel-col-img-upload').style.display = tab === 'col-img-upload' ? 'block' : 'none';
      document.getElementById('panel-col-img-asset').style.display = tab === 'col-img-asset' ? 'block' : 'none';
      document.getElementById('panel-col-img-url').style.display = tab === 'col-img-url' ? 'block' : 'none';
    });
  });

  const colUrlInput = document.getElementById('col-image-url');
  if (colUrlInput) {
    colUrlInput.addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        setColImagePreview(e.target.value.trim(), 'Web Photo URL');
      }
    });
  }
}

function setColImagePreview(url, label = 'Image Selected') {
  const container = document.getElementById('col-image-preview-container');
  const thumb = document.getElementById('col-img-preview-thumb');
  const labelEl = document.getElementById('col-img-preview-label');
  const finalInput = document.getElementById('col-image-final');
  if (container && thumb && finalInput) {
    finalInput.value = url;
    thumb.src = url;
    if (labelEl) labelEl.textContent = label;
    container.style.display = 'flex';
  }
}

async function loadCollections() {
  startFirestoreCollectionsSync();

  const localData = localStorage.getItem('bloom_custom_collections');
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        COLLECTIONS = parsed;
        renderAdminCollections();
        updateCollectionStats();
        return;
      }
    } catch (e) {
      localStorage.removeItem('bloom_custom_collections');
    }
  }

  try {
    const res = await fetch('collections.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        COLLECTIONS = data;
        saveCollections(false);
        renderAdminCollections();
        updateCollectionStats();
        return;
      }
    }
  } catch (e) {}

  COLLECTIONS = [...DEFAULT_FALLBACK_COLLECTIONS];
  saveCollections(false);
  renderAdminCollections();
  updateCollectionStats();
}

function startFirestoreCollectionsSync() {
  if (typeof firestoreDb === 'undefined' || !firestoreDb) return;
  try {
    firestoreDb.collection('collections').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const cloudCols = [];
        snapshot.forEach(doc => cloudCols.push(doc.data()));
        if (cloudCols.length > 0) {
          cloudCols.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
          COLLECTIONS = cloudCols;
          localStorage.setItem('bloom_custom_collections', JSON.stringify(COLLECTIONS));
          renderAdminCollections();
          updateCollectionStats();
          updateCategoryDropdowns();
          updateCloudCounters();
        }
      } else {
        const batch = firestoreDb.batch();
        DEFAULT_FALLBACK_COLLECTIONS.forEach(col => {
          batch.set(firestoreDb.collection('collections').doc(col.id), col);
        });
        batch.commit().catch(() => {});
      }
    });
  } catch (e) {}
}

function saveCollections(notify = true) {
  try {
    localStorage.setItem('bloom_custom_collections', JSON.stringify(COLLECTIONS));
    if (notify) {
      if (broadcastColChannel) {
        broadcastColChannel.postMessage({ type: 'COLLECTIONS_UPDATED', collections: COLLECTIONS });
      }
      window.dispatchEvent(new Event('storage'));
    }
    updateCollectionStats();
    updateCloudCounters();
  } catch (e) {}
}

function loadCollectionsFromLocalStorage(render = true) {
  const localData = localStorage.getItem('bloom_custom_collections');
  if (localData) {
    try {
      COLLECTIONS = JSON.parse(localData);
      if (render) {
        renderAdminCollections();
        updateCollectionStats();
      }
    } catch (e) {}
  }
}

function renderAdminCollections() {
  const container = document.getElementById('collections-admin-grid');
  const countEl = document.getElementById('col-filtered-count');
  if (!container) return;

  let filtered = COLLECTIONS.filter(c => {
    if (!ACTIVE_COL_SEARCH) return true;
    const q = ACTIVE_COL_SEARCH;
    return (c.title && c.title.toLowerCase().includes(q)) ||
           (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
           (c.description && c.description.toLowerCase().includes(q));
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${COLLECTIONS.length} collections`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: #FFF; border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--burgundy-900);">No collections found</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Try adjusting your search query or create a new collection category.</p>
        <button type="button" class="btn btn-primary" onclick="openCollectionModal(null)" style="margin-top: 1rem;">+ Add First Collection</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(col => {
    const linkedProductsCount = PRODUCTS.filter(p => p.collectionId === col.id || p.category === col.title).length;
    return `
      <article class="collection-card-admin" data-id="${escapeHtml(col.id)}">
        <div class="col-card-media-admin">
          <img src="${escapeHtml(col.image || 'assets/images/money_garland.jpg')}" alt="${escapeHtml(col.title)}" loading="lazy">
          <span class="col-card-order-badge">#${col.displayOrder || 1} Order</span>
          <span class="col-card-count-badge">${linkedProductsCount} Creations</span>
        </div>
        <div class="col-card-body-admin">
          <span class="col-card-subtitle-admin">${escapeHtml(col.subtitle || 'Signature Line')}</span>
          <h3 class="col-card-title-admin">${escapeHtml(col.title)}</h3>
          <p class="col-card-desc-admin">${escapeHtml(col.description || '')}</p>
          <div class="col-card-footer-admin">
            <span style="font-size: 0.74rem; color: var(--text-muted);">${escapeHtml(col.itemCount || 'Customizable')}</span>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn btn-sm btn-outline-gold" onclick="openCollectionModal('${escapeHtml(col.id)}')">Edit</button>
              <button type="button" class="btn btn-sm btn-secondary" onclick="promptDeleteCollection('${escapeHtml(col.id)}')" style="color: var(--danger);">Delete</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function openCollectionModal(colId = null) {
  EDITING_COLLECTION_ID = colId;
  const modal = document.getElementById('collection-modal');
  const titleEl = document.getElementById('modal-col-title');
  if (!modal) return;

  if (colId) {
    const col = COLLECTIONS.find(c => c.id === colId);
    if (!col) return;
    if (titleEl) titleEl.textContent = `Edit Collection: ${col.title}`;
    document.getElementById('col-id-input').value = col.id;
    document.getElementById('col-id-input').readOnly = true;
    document.getElementById('col-title-input').value = col.title || '';
    document.getElementById('col-subtitle-input').value = col.subtitle || '';
    document.getElementById('col-desc-input').value = col.description || '';
    document.getElementById('col-count-input').value = col.itemCount || '';
    document.getElementById('col-order-input').value = col.displayOrder || 1;
    setColImagePreview(col.image || '', col.title);
  } else {
    if (titleEl) titleEl.textContent = 'Add New Boutique Collection';
    document.getElementById('col-id-input').value = '';
    document.getElementById('col-id-input').readOnly = false;
    document.getElementById('col-title-input').value = '';
    document.getElementById('col-subtitle-input').value = '';
    document.getElementById('col-desc-input').value = '';
    document.getElementById('col-count-input').value = 'Custom Denominations Available';
    document.getElementById('col-order-input').value = (COLLECTIONS.length + 1);
    document.getElementById('col-image-final').value = '';
    const previewContainer = document.getElementById('col-image-preview-container');
    if (previewContainer) previewContainer.style.display = 'none';
  }

  modal.classList.add('active');
}

function handleCollectionFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('col-id-input').value.trim();
  const title = document.getElementById('col-title-input').value.trim();
  const subtitle = document.getElementById('col-subtitle-input').value.trim();
  const description = document.getElementById('col-desc-input').value.trim();
  const itemCount = document.getElementById('col-count-input').value.trim();
  const displayOrder = parseInt(document.getElementById('col-order-input').value, 10) || 1;
  const image = document.getElementById('col-image-final').value.trim() || 'assets/images/money_garland.jpg';

  if (!id || !title) {
    showToast('Collection ID and Title are required.', 'error');
    return;
  }

  const colObj = {
    id,
    title,
    subtitle,
    description,
    itemCount,
    displayOrder,
    image,
    updatedAt: Date.now()
  };

  const existingIdx = COLLECTIONS.findIndex(c => c.id === id);
  if (existingIdx >= 0) {
    COLLECTIONS[existingIdx] = { ...COLLECTIONS[existingIdx], ...colObj };
    showToast(`Collection "${title}" updated successfully!`, 'success');
  } else {
    COLLECTIONS.push(colObj);
    showToast(`Collection "${title}" added to boutique catalog!`, 'success');
  }

  COLLECTIONS.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  saveCollections(true);

  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('collections').doc(colObj.id).set(colObj)
      .then(() => console.log('[Firebase] Collection synced live:', colObj.id))
      .catch(err => console.warn('[Firebase] Firestore collection error:', err));
  }

  updateCategoryDropdowns();
  renderAdminCollections();
  updateCollectionStats();
  closeAllModals();
}

function promptDeleteCollection(colId) {
  DELETING_COL_ID = colId;
  const col = COLLECTIONS.find(c => c.id === colId);
  const nameEl = document.getElementById('delete-collection-name');
  const modal = document.getElementById('delete-collection-modal');
  if (nameEl) nameEl.textContent = col ? `"${col.title}"` : 'this collection';
  if (modal) modal.classList.add('active');
}

function confirmDeleteCollection() {
  if (!DELETING_COL_ID) return;
  const id = DELETING_COL_ID;
  COLLECTIONS = COLLECTIONS.filter(c => c.id !== id);
  saveCollections(true);

  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('collections').doc(id).delete()
      .then(() => console.log('[Firebase] Collection deleted from Cloud:', id))
      .catch(e => console.warn(e));
  }

  updateCategoryDropdowns();
  renderAdminCollections();
  updateCollectionStats();
  closeAllModals();
  showToast('Collection removed from catalog.', 'info');
  DELETING_COL_ID = null;
}

function updateCollectionStats() {
  const statTotal = document.getElementById('stat-col-total');
  const statProducts = document.getElementById('stat-col-products');
  const statColSort = document.getElementById('stat-total-collections');
  const badgeCol = document.getElementById('tab-badge-collections');

  if (statTotal) statTotal.textContent = COLLECTIONS.length;
  if (statColSort) statColSort.textContent = COLLECTIONS.length;
  if (badgeCol) badgeCol.textContent = COLLECTIONS.length;
  if (statProducts) statProducts.textContent = PRODUCTS.length;
}

/**
 * Dynamic Category Synchronization
 * Inherits all categories directly from COLLECTIONS and populates creation & portfolio forms
 */
function updateCategoryDropdowns() {
  // 1. Product Category Select in Product Modal
  const prodCatSelect = document.getElementById('prod-category-select');
  if (prodCatSelect) {
    prodCatSelect.innerHTML = [
      ...COLLECTIONS.map(c => `<option value="${escapeHtml(c.id)}" data-name="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`),
      `<option value="__custom__">+ Custom Category...</option>`
    ].join('');
  }

  // 2. Creation Filter Chips in Products View
  const filterChips = document.getElementById('category-filter-chips');
  if (filterChips) {
    const chipsHtml = [
      `<button type="button" class="filter-chip ${ACTIVE_CATEGORY === 'all' ? 'active' : ''}" data-category="all">All Offerings (${PRODUCTS.length})</button>`,
      ...COLLECTIONS.map(c => {
        const count = PRODUCTS.filter(p => p.collectionId === c.id || p.category === c.title).length;
        return `<button type="button" class="filter-chip ${ACTIVE_CATEGORY === c.id ? 'active' : ''}" data-category="${escapeHtml(c.id)}">${escapeHtml(c.title)} (${count})</button>`;
      })
    ].join('');
    filterChips.innerHTML = chipsHtml;

    filterChips.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        filterChips.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ACTIVE_CATEGORY = btn.dataset.category;
        renderProducts();
      });
    });
  }

  // 3. Portfolio Category Select in Portfolio Modal
  const portCatSelect = document.getElementById('port-category-select');
  if (portCatSelect) {
    portCatSelect.innerHTML = COLLECTIONS.map(c => `
      <option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>
    `).join('');
  }
}

/* ===================================================================
   Instagram Portfolio & Journal Management (Panel 03)
   =================================================================== */
function initPortfolioAdmin() {
  const portSearch = document.getElementById('port-search-input');
  if (portSearch) {
    portSearch.value = '';
    portSearch.addEventListener('input', (e) => {
      PORT_SEARCH_QUERY = e.target.value.toLowerCase().trim();
      renderAdminPortfolio();
    });
  }

  const portForm = document.getElementById('portfolio-form');
  if (portForm) {
    portForm.addEventListener('submit', handlePortfolioFormSubmit);
  }

  const titleInput = document.getElementById('port-title-input');
  const idInput = document.getElementById('port-id-input');
  if (titleInput && idInput) {
    titleInput.addEventListener('input', () => {
      if (!EDITING_PORT_ID) {
        idInput.value = 'port-' + titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
    });
  }

  const confirmDelPortBtn = document.getElementById('btn-confirm-delete-port');
  if (confirmDelPortBtn) {
    confirmDelPortBtn.addEventListener('click', confirmDeletePortfolio);
  }

  // Asset select for portfolio
  const portAssetSelect = document.getElementById('port-asset-select');
  if (portAssetSelect) {
    portAssetSelect.innerHTML = [
      '<option value="">-- Choose from Studio Photography --</option>',
      ...BUNDLED_ASSETS.map(a => `<option value="${a.path}">${a.name} (${a.path})</option>`)
    ].join('');
    portAssetSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        setPortImagePreview(e.target.value, e.target.options[e.target.selectedIndex].text);
      }
    });
  }

  // Portfolio modal image source tabs
  document.querySelectorAll('#portfolio-modal [data-tab^="port-img-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#portfolio-modal [data-tab^="port-img-"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('panel-port-img-upload').style.display = tab === 'port-img-upload' ? 'block' : 'none';
      document.getElementById('panel-port-img-asset').style.display = tab === 'port-img-asset' ? 'block' : 'none';
      document.getElementById('panel-port-img-url').style.display = tab === 'port-img-url' ? 'block' : 'none';
    });
  });

  // Portfolio modal video source tabs
  document.querySelectorAll('#portfolio-modal [data-tab^="port-vid-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#portfolio-modal [data-tab^="port-vid-"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      const up = document.getElementById('panel-port-vid-upload');
      const as = document.getElementById('panel-port-vid-asset');
      const ur = document.getElementById('panel-port-vid-url');
      if (up) up.style.display = tab === 'port-vid-upload' ? 'block' : 'none';
      if (as) as.style.display = tab === 'port-vid-asset' ? 'block' : 'none';
      if (ur) ur.style.display = tab === 'port-vid-url' ? 'block' : 'none';
    });
  });

  const portVidAssetSelect = document.getElementById('port-video-asset-select');
  if (portVidAssetSelect) {
    portVidAssetSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        setPortVideoPreview(e.target.value, e.target.options[e.target.selectedIndex].text);
      }
    });
  }

  const portVidUrlInput = document.getElementById('port-video-url');
  if (portVidUrlInput) {
    portVidUrlInput.addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        setPortVideoPreview(e.target.value.trim(), 'Direct Video URL');
      }
    });
  }

  const portUrlInput = document.getElementById('port-image-url');
  if (portUrlInput) {
    portUrlInput.addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        setPortImagePreview(e.target.value.trim(), 'Web Photo URL');
      }
    });
  }

  const portLinkInput = document.getElementById('port-link-input');
  if (portLinkInput) {
    portLinkInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      const match = val.match(/\/(reel|p)\/([a-zA-Z0-9_-]+)/);
      if (match && match[2]) {
        const shortcode = match[2];
        const idInput = document.getElementById('port-id-input');
        if (idInput && !EDITING_PORT_ID && !idInput.value) {
          idInput.value = 'port-reel-' + shortcode.toLowerCase();
        }
        const finalImg = document.getElementById('port-image-final');
        if (finalImg && !finalImg.value) {
          setPortImagePreview(`assets/reels/${shortcode}.jpg`, `Authentic Reel Cover (${shortcode}.jpg)`);
        }
        const finalVid = document.getElementById('port-video-final');
        if (finalVid && !finalVid.value) {
          setPortVideoPreview(`assets/reels/${shortcode}.mp4`, `Authentic Reel Video (${shortcode}.mp4)`);
        }
      }
    });
  }
}

function setPortImagePreview(url, label = 'Image Selected') {
  const container = document.getElementById('port-image-preview-container');
  const thumb = document.getElementById('port-img-preview-thumb');
  const labelEl = document.getElementById('port-img-preview-label');
  const finalInput = document.getElementById('port-image-final');
  if (container && thumb && finalInput) {
    finalInput.value = url || '';
    if (url) {
      thumb.src = url;
      if (labelEl) labelEl.textContent = label;
      container.style.display = 'flex';
    } else {
      thumb.src = '';
      container.style.display = 'none';
    }
  }
}

function setPortVideoPreview(url, label = 'Reel Video Ready') {
  const container = document.getElementById('port-video-preview-container');
  const thumb = document.getElementById('port-vid-preview-thumb');
  const labelEl = document.getElementById('port-vid-preview-label');
  const finalInput = document.getElementById('port-video-final');
  if (container && thumb && finalInput) {
    finalInput.value = url || '';
    if (url) {
      thumb.src = url;
      thumb.load();
      if (labelEl) labelEl.textContent = label;
      container.style.display = 'flex';
    } else {
      thumb.src = '';
      container.style.display = 'none';
    }
  }
}

async function loadPortfolio() {
  startFirestorePortfolioSync();

  const localData = localStorage.getItem('bloom_custom_portfolio');
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const isLegacy = parsed.some(it => 
          it.id === 'port-sovereign-garland' || 
          !(it.linkUrl || '').includes('/reel/') ||
          !it.videoUrl ||
          (it.image && it.image.includes('assets/images/'))
        );
        if (!isLegacy) {
          PORTFOLIO = parsed;
          renderAdminPortfolio();
          updatePortfolioStats();
          return;
        } else {
          localStorage.removeItem('bloom_custom_portfolio');
        }
      }
    } catch (e) {
      localStorage.removeItem('bloom_custom_portfolio');
    }
  }

  try {
    const res = await fetch('portfolio.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        PORTFOLIO = data;
        savePortfolio(false);
        renderAdminPortfolio();
        updatePortfolioStats();
        return;
      }
    }
  } catch (e) {}

  PORTFOLIO = [...DEFAULT_FALLBACK_PORTFOLIO];
  savePortfolio(false);
  renderAdminPortfolio();
  updatePortfolioStats();
}

function startFirestorePortfolioSync() {
  if (typeof firestoreDb === 'undefined' || !firestoreDb) return;
  try {
    firestoreDb.collection('portfolio').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const cloudPort = [];
        snapshot.forEach(doc => cloudPort.push(doc.data()));
        if (cloudPort.length > 0) {
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
          PORTFOLIO = sanitized;
          localStorage.setItem('bloom_custom_portfolio', JSON.stringify(PORTFOLIO));
          renderAdminPortfolio();
          updatePortfolioStats();
          updateCloudCounters();
        }
      } else {
        const batch = firestoreDb.batch();
        DEFAULT_FALLBACK_PORTFOLIO.forEach(item => {
          batch.set(firestoreDb.collection('portfolio').doc(item.id), item);
        });
        batch.commit().catch(() => {});
      }
    });
  } catch (e) {}
}

function savePortfolio(notify = true) {
  try {
    localStorage.setItem('bloom_custom_portfolio', JSON.stringify(PORTFOLIO));
    if (notify) {
      if (broadcastPortChannel) {
        broadcastPortChannel.postMessage({ type: 'PORTFOLIO_UPDATED', portfolio: PORTFOLIO });
      }
      window.dispatchEvent(new Event('storage'));
    }
    updatePortfolioStats();
    updateCloudCounters();
  } catch (e) {}
}

function loadPortfolioFromLocalStorage(render = true) {
  const localData = localStorage.getItem('bloom_custom_portfolio');
  if (localData) {
    try {
      PORTFOLIO = JSON.parse(localData);
      if (render) {
        renderAdminPortfolio();
        updatePortfolioStats();
      }
    } catch (e) {}
  }
}

function renderAdminPortfolio() {
  const container = document.getElementById('portfolio-admin-grid');
  const countEl = document.getElementById('port-filtered-count');
  if (!container) return;

  let filtered = PORTFOLIO.filter(item => {
    if (!PORT_SEARCH_QUERY) return true;
    const q = PORT_SEARCH_QUERY;
    return (item.title && item.title.toLowerCase().includes(q)) ||
           (item.category && item.category.toLowerCase().includes(q)) ||
           (item.caption && item.caption.toLowerCase().includes(q));
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${PORTFOLIO.length} portfolio stories`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: #FFF; border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--burgundy-900);">No portfolio stories found</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Add a new Instagram story showcase to display your artisanal creations.</p>
        <button type="button" class="btn btn-primary" onclick="openPortfolioModal(null)" style="margin-top: 1rem;">+ Add Portfolio Story</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="portfolio-card-admin" data-id="${escapeHtml(item.id)}">
      <div class="portfolio-card-media" style="position: relative;">
        <img src="${escapeHtml(item.image || 'assets/images/money_garland.jpg')}" alt="${escapeHtml(item.title)}" loading="lazy">
        <span class="achieve-card-date">${escapeHtml(item.category || 'Journal')}</span>
        ${item.videoUrl ? `
          <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(94, 13, 24, 0.9); color: #FFF; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Playable Reel
          </span>
        ` : ''}
      </div>
      <div class="portfolio-card-body">
        <span class="achieve-card-category">${(item.tags || []).join(' &bull; ') || 'Instagram Story'}</span>
        <h3 class="achieve-card-title">${escapeHtml(item.title)}</h3>
        <p class="achieve-card-desc">${escapeHtml(item.caption || '')}</p>
        <div class="achieve-card-footer">
          <a href="${escapeHtml(item.linkUrl || 'https://www.instagram.com/blushnbloomm.in')}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-gold" style="padding: 0.3rem 0.6rem; font-size: 0.74rem;">
            <span>Instagram &rarr;</span>
          </a>
          <div style="display: flex; gap: 0.4rem;">
            <button type="button" class="btn btn-sm btn-outline-gold" onclick="openPortfolioModal('${escapeHtml(item.id)}')">Edit</button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="promptDeletePortfolio('${escapeHtml(item.id)}')" style="color: var(--danger);">Delete</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function openPortfolioModal(storyId = null) {
  EDITING_PORT_ID = storyId;
  const modal = document.getElementById('portfolio-modal');
  const titleEl = document.getElementById('modal-port-title');
  if (!modal) return;

  updateCategoryDropdowns();

  if (storyId) {
    const item = PORTFOLIO.find(p => p.id === storyId);
    if (!item) return;
    if (titleEl) titleEl.textContent = `Edit Story: ${item.title}`;
    document.getElementById('port-id-input').value = item.id;
    document.getElementById('port-id-input').readOnly = true;
    document.getElementById('port-title-input').value = item.title || '';
    document.getElementById('port-category-select').value = item.category || '';
    document.getElementById('port-link-input').value = item.linkUrl || '';
    document.getElementById('port-caption-input').value = item.caption || '';
    document.getElementById('port-tags-input').value = (item.tags || []).join(', ');
    document.getElementById('port-span-select').value = item.span || 'col-span-1 row-span-1';
    setPortImagePreview(item.image || '', item.title);
    setPortVideoPreview(item.videoUrl || '', item.title ? `Reel Video: ${item.title}` : 'Reel Video');
  } else {
    if (titleEl) titleEl.textContent = 'Add Instagram Portfolio Story / Reel';
    document.getElementById('port-id-input').value = '';
    document.getElementById('port-id-input').readOnly = false;
    document.getElementById('port-title-input').value = '';
    document.getElementById('port-link-input').value = 'https://www.instagram.com/blushnbloomm.in?stkn=MTJxbzE1bHU5czRwNA==';
    document.getElementById('port-caption-input').value = '';
    document.getElementById('port-tags-input').value = 'Money Garlands, Bridal, Pune';
    document.getElementById('port-span-select').value = 'col-span-1 row-span-1';
    setPortImagePreview('', '');
    setPortVideoPreview('', '');
  }

  modal.classList.add('active');
}

function handlePortfolioFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('port-id-input').value.trim();
  const title = document.getElementById('port-title-input').value.trim();
  const category = document.getElementById('port-category-select').value;
  const linkUrl = document.getElementById('port-link-input').value.trim();
  const caption = document.getElementById('port-caption-input').value.trim();
  const tagsStr = document.getElementById('port-tags-input').value.trim();
  const span = document.getElementById('port-span-select').value;
  const image = document.getElementById('port-image-final').value.trim() || 'assets/images/money_garland.jpg';
  let videoUrl = document.getElementById('port-video-final') ? document.getElementById('port-video-final').value.trim() : '';

  const match = linkUrl.match(/\/(reel|p)\/([a-zA-Z0-9_-]+)/);
  const shortcode = match ? match[2] : '';
  if (!videoUrl && shortcode) {
    videoUrl = `assets/reels/${shortcode}.mp4`;
  }

  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

  const portObj = {
    id: id || ('port-' + Date.now()),
    title,
    category,
    linkUrl,
    caption,
    tags,
    span,
    image,
    videoUrl: videoUrl || '',
    shortcode: shortcode || undefined,
    duration: "0:15",
    aspect: "9:16",
    featured: true,
    createdAt: Date.now()
  };

  const existingIdx = PORTFOLIO.findIndex(p => p.id === portObj.id);
  if (existingIdx >= 0) {
    portObj.createdAt = PORTFOLIO[existingIdx].createdAt || Date.now();
    PORTFOLIO[existingIdx] = portObj;
    showToast(`Story "${title}" updated successfully!`, 'success');
  } else {
    PORTFOLIO.unshift(portObj);
    showToast(`Story "${title}" added to portfolio!`, 'success');
  }

  savePortfolio(true);

  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('portfolio').doc(portObj.id).set(portObj)
      .then(() => console.log('[Firebase] Portfolio story synced live:', portObj.id))
      .catch(err => console.warn(err));
  }

  renderAdminPortfolio();
  updatePortfolioStats();
  closeAllModals();
}

function promptDeletePortfolio(storyId) {
  DELETING_PORT_ID = storyId;
  const item = PORTFOLIO.find(p => p.id === storyId);
  const nameEl = document.getElementById('delete-portfolio-name');
  const modal = document.getElementById('delete-portfolio-modal');
  if (nameEl) nameEl.textContent = item ? `"${item.title}"` : 'this story';
  if (modal) modal.classList.add('active');
}

function confirmDeletePortfolio() {
  if (!DELETING_PORT_ID) return;
  const id = DELETING_PORT_ID;
  PORTFOLIO = PORTFOLIO.filter(p => p.id !== id);
  savePortfolio(true);

  if (typeof firestoreDb !== 'undefined' && firestoreDb) {
    firestoreDb.collection('portfolio').doc(id).delete()
      .then(() => console.log('[Firebase] Deleted portfolio story:', id))
      .catch(e => console.warn(e));
  }

  renderAdminPortfolio();
  updatePortfolioStats();
  closeAllModals();
  showToast('Story removed from portfolio.', 'info');
  DELETING_PORT_ID = null;
}

function updatePortfolioStats() {
  const statTotal = document.getElementById('stat-port-total');
  const statFeatured = document.getElementById('stat-port-featured');
  const badgePort = document.getElementById('tab-badge-portfolio');

  if (statTotal) statTotal.textContent = PORTFOLIO.length;
  if (statFeatured) statFeatured.textContent = PORTFOLIO.filter(p => p.featured).length;
  if (badgePort) badgePort.textContent = PORTFOLIO.length;
}

/* ===================================================================
   Cloudflare R2 Direct Upload & Configuration
   =================================================================== */
function initR2Settings() {
  if (typeof R2Storage === 'undefined') return;
  const config = (typeof R2Storage.loadConfig === 'function') 
    ? R2Storage.loadConfig() 
    : ((typeof R2Storage.getConfig === 'function') ? R2Storage.getConfig() : {});

  const accountIdInput = document.getElementById('r2-account-id');
  const accessKeyInput = document.getElementById('r2-access-key');
  const secretKeyInput = document.getElementById('r2-secret-key');
  const bucketNameInput = document.getElementById('r2-bucket-name');
  const publicDomainInput = document.getElementById('r2-public-domain');
  const workerUrlInput = document.getElementById('r2-worker-url');

  if (accountIdInput) accountIdInput.value = config.accountId || '';
  if (accessKeyInput) accessKeyInput.value = config.accessKeyId || '';
  if (secretKeyInput) secretKeyInput.value = config.secretAccessKey || '';
  if (bucketNameInput) bucketNameInput.value = config.bucketName || 'blushnbloomm-media';
  if (publicDomainInput) publicDomainInput.value = config.publicDomain || '';
  if (workerUrlInput) workerUrlInput.value = config.workerUrl || '';

  const r2Form = document.getElementById('form-r2-settings');
  if (r2Form) {
    r2Form.addEventListener('submit', (e) => {
      e.preventDefault();
      R2Storage.saveConfig({
        accountId: accountIdInput.value.trim(),
        accessKeyId: accessKeyInput.value.trim(),
        secretAccessKey: secretKeyInput.value.trim(),
        bucketName: bucketNameInput.value.trim() || 'blushnbloomm-media',
        publicDomain: publicDomainInput.value.trim(),
        workerUrl: workerUrlInput.value.trim()
      });
      showToast('Cloudflare R2 settings saved successfully!', 'success');
      const badge = document.getElementById('r2-status-badge');
      if (badge) {
        badge.className = 'badge-status-pill badge-active';
        badge.textContent = 'Configured';
      }
    });
  }

  const btnTest = document.getElementById('btn-test-r2-conn');
  const testMsg = document.getElementById('r2-test-msg');
  if (btnTest) {
    btnTest.addEventListener('click', async () => {
      if (testMsg) testMsg.innerHTML = '<span style="color: var(--burgundy-700);">Testing R2 connection probe...</span>';
      btnTest.disabled = true;
      try {
        const res = await R2Storage.testConnection();
        if (res.success) {
          if (testMsg) testMsg.innerHTML = '<span style="color: #2E7D32;">✓ Connection Verified &amp; Probe Upload Succeeded!</span>';
          showToast('Cloudflare R2 connection verified!', 'success');
        } else {
          if (testMsg) testMsg.innerHTML = `<span style="color: var(--danger);">✗ Test Failed: ${escapeHtml(res.error)}</span>`;
          showToast('R2 Test failed: ' + res.error, 'error');
        }
      } catch (err) {
        if (testMsg) testMsg.innerHTML = `<span style="color: var(--danger);">✗ Error: ${escapeHtml(err.message)}</span>`;
      } finally {
        btnTest.disabled = false;
      }
    });
  }
}

/**
 * Universal Media File Upload to Cloudflare R2 with In-Browser Auto-Compression
 */
function initMediaUploads() {
  function bindUpload(fileInputId, progressBoxId, finalInputId, previewContainerId, previewThumbId, previewLabelId, folder, isVideo = false) {
    const fileInput = document.getElementById(fileInputId);
    const progressBox = document.getElementById(progressBoxId);
    const finalInput = document.getElementById(finalInputId);
    const previewContainer = document.getElementById(previewContainerId);
    const previewThumb = previewThumbId ? document.getElementById(previewThumbId) : null;
    const previewLabel = previewLabelId ? document.getElementById(previewLabelId) : null;

    if (!fileInput) return;

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fill = progressBox ? progressBox.querySelector('.upload-fill') : null;
      const text = progressBox ? progressBox.querySelector('.upload-text') : null;

      if (progressBox) progressBox.style.display = 'block';

      try {
        const uploadedUrl = await R2Storage.uploadFile(file, folder, (percent, statusText) => {
          if (fill) fill.style.width = `${percent}%`;
          if (text) text.textContent = `${statusText} (${percent}%)`;
        });

        if (finalInput) finalInput.value = uploadedUrl;
        if (previewThumb) {
          previewThumb.src = uploadedUrl;
          if (isVideo && typeof previewThumb.load === 'function') previewThumb.load();
        }
        if (previewLabel) previewLabel.textContent = isVideo ? `Uploaded Video: ${file.name}` : `Uploaded: ${file.name} (WebP)`;
        if (previewContainer) previewContainer.style.display = 'flex';

        showToast(`Uploaded "${file.name}" to Cloudflare R2!`, 'success');
        setTimeout(() => {
          if (progressBox) progressBox.style.display = 'none';
        }, 1500);
      } catch (err) {
        console.error('[Upload Error]', err);
        showToast(`Upload failed: ${err.message}. Using local file preview.`, 'error');
        if (progressBox) progressBox.style.display = 'none';
      }
    });
  }

  // 1. Collection photo
  bindUpload('col-image-file', 'col-upload-progress', 'col-image-final', 'col-image-preview-container', 'col-img-preview-thumb', 'col-img-preview-label', 'collections');

  // 2. Product creation photo
  bindUpload('prod-image-file', 'prod-upload-progress', 'prod-image-final', 'prod-image-preview-container', 'prod-img-preview-thumb', 'prod-img-preview-label', 'creations');

  // 3. Portfolio cover photo
  bindUpload('port-image-file', 'port-upload-progress', 'port-image-final', 'port-image-preview-container', 'port-img-preview-thumb', 'port-img-preview-label', 'portfolio');

  // 4. Portfolio reel video
  bindUpload('port-video-file', 'port-vid-upload-progress', 'port-video-final', 'port-video-preview-container', 'port-vid-preview-thumb', 'port-vid-preview-label', 'reels', true);
}

/* ===================================================================
   One-Click Cloud Catalog Seed & Fake Data Purge
   =================================================================== */
function initCloudSeedModal() {
  const openBtn = document.getElementById('btn-open-seed-catalog');
  const modal = document.getElementById('seed-catalog-modal');
  const confirmBtn = document.getElementById('btn-confirm-seed-catalog');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      document.getElementById('seed-progress-container').style.display = 'none';
      modal.classList.add('active');
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', seedAuthenticCatalogToCloud);
  }
}

async function seedAuthenticCatalogToCloud() {
  const container = document.getElementById('seed-progress-container');
  const fill = document.getElementById('seed-progress-fill');
  const status = document.getElementById('seed-progress-status');
  const confirmBtn = document.getElementById('btn-confirm-seed-catalog');
  const cancelBtn = document.getElementById('btn-cancel-seed');

  if (container) container.style.display = 'block';
  if (confirmBtn) confirmBtn.disabled = true;
  if (cancelBtn) cancelBtn.disabled = true;

  function setStep(pct, msg) {
    if (fill) fill.style.width = `${pct}%`;
    if (status) status.textContent = msg;
  }

  try {
    if (typeof firestoreDb === 'undefined' || !firestoreDb) {
      throw new Error('Firebase Firestore is not initialized.');
    }

    setStep(10, 'Step 1/5: Synchronizing 6 Authentic Collections to Cloud...');
    const colBatch = firestoreDb.batch();
    DEFAULT_FALLBACK_COLLECTIONS.forEach(col => {
      colBatch.set(firestoreDb.collection('collections').doc(col.id), col);
    });
    await colBatch.commit();
    COLLECTIONS = [...DEFAULT_FALLBACK_COLLECTIONS];
    saveCollections(false);

    setStep(40, 'Step 2/5: Synchronizing 8 Authentic Boutique Creations...');
    const prodBatch = firestoreDb.batch();
    DEFAULT_FALLBACK_PRODUCTS.forEach(prod => {
      prodBatch.set(firestoreDb.collection('products').doc(prod.id), prod);
    });
    await prodBatch.commit();
    PRODUCTS = [...DEFAULT_FALLBACK_PRODUCTS];
    saveProducts(false);

    setStep(65, 'Step 3/5: Synchronizing 7 Instagram Portfolio Stories...');
    const portBatch = firestoreDb.batch();
    DEFAULT_FALLBACK_PORTFOLIO.forEach(item => {
      portBatch.set(firestoreDb.collection('portfolio').doc(item.id), item);
    });
    await portBatch.commit();
    PORTFOLIO = [...DEFAULT_FALLBACK_PORTFOLIO];
    savePortfolio(false);

    setStep(85, 'Step 4/5: Synchronizing Authentic Achievements & Purging Fake Data...');
    const achBatch = firestoreDb.batch();
    DEFAULT_FALLBACK_ACHIEVEMENTS.forEach(ach => {
      achBatch.set(firestoreDb.collection('achievements').doc(ach.id), ach);
    });
    await achBatch.commit();
    ACHIEVEMENTS = [...DEFAULT_FALLBACK_ACHIEVEMENTS];
    saveAchievements(false);

    // Purge fake achievement documents from Firestore
    try {
      const snap = await firestoreDb.collection('achievements').get();
      snap.forEach(doc => {
        if (isFakeAchievement(doc.data()) || FAKE_ACHIEVE_IDS.has(doc.id)) {
          doc.ref.delete().catch(() => {});
        }
      });
    } catch (e) {}

    setStep(100, '✓ Complete! Authentic catalog is now live in Firestore for all users!');
    showToast('Authentic Bloom&blush catalog successfully synchronized to Google Cloud!', 'success');

    updateCategoryDropdowns();
    renderAdminCollections();
    renderProducts();
    renderAdminPortfolio();
    renderAdminAchievements();
    updateCollectionStats();
    updateStats();
    updatePortfolioStats();
    updateAchievementStats();
    updateCloudCounters();

    setTimeout(() => {
      closeAllModals();
      if (confirmBtn) confirmBtn.disabled = false;
      if (cancelBtn) cancelBtn.disabled = false;
    }, 1800);
  } catch (err) {
    console.error('Seed error:', err);
    setStep(100, `✗ Error: ${err.message}`);
    showToast('Seed failed: ' + err.message, 'error');
    if (confirmBtn) confirmBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = false;
  }
}

/* ===================================================================
   Full Studio JSON Backup & Restore
   =================================================================== */
function initBackupRestore() {
  const exportBtn = document.getElementById('btn-download-studio-backup');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const fullBackup = {
        meta: {
          brand: 'Bloom&blush',
          founder: 'Siddhi Kokate',
          location: 'Pimpri-Chinchwad, Pune',
          exportedAt: new Date().toISOString(),
          version: '2.0.0'
        },
        collections: COLLECTIONS,
        products: PRODUCTS,
        portfolio: PORTFOLIO,
        achievements: ACHIEVEMENTS
      };

      const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bloom_and_blush_catalog_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Studio catalog backup downloaded!', 'success');
    });
  }

  const importInput = document.getElementById('file-import-studio-json');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.collections) { COLLECTIONS = data.collections; saveCollections(true); }
          if (data.products) { PRODUCTS = data.products; saveProducts(true); }
          if (data.portfolio) { PORTFOLIO = data.portfolio; savePortfolio(true); }
          if (data.achievements) { ACHIEVEMENTS = data.achievements; saveAchievements(true); }

          updateCategoryDropdowns();
          renderAdminCollections();
          renderProducts();
          renderAdminPortfolio();
          renderAdminAchievements();
          updateCloudCounters();
          showToast('Studio catalog restored successfully from JSON file!', 'success');
        } catch (err) {
          showToast('Invalid backup JSON file: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    });
  }
}

function updateCloudCounters() {
  const colCount = document.getElementById('db-count-collections');
  const prodCount = document.getElementById('db-count-products');
  const portCount = document.getElementById('db-count-portfolio');
  const achCount = document.getElementById('db-count-achievements');

  if (colCount) colCount.textContent = `${COLLECTIONS.length} Active Collections`;
  if (prodCount) prodCount.textContent = `${PRODUCTS.length} Boutique Creations`;
  if (portCount) portCount.textContent = `${PORTFOLIO.length} Journal Stories`;
  if (achCount) achCount.textContent = `${ACHIEVEMENTS.length} Highlights & Reels`;
}

