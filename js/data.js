/**
 * ===================================================================
 * Bloom&blush - Boutique Gifting & Floral Studio
 * Central Data & Configuration File
 * Founder: Siddhi Kokate | Location: Pimpri-Chinchwad, Pune
 * ===================================================================
 * 
 * OWNER NOTE:
 * You can easily update your phone number, Instagram handle, and business details
 * right here. No database or coding knowledge required!
 */

const CONFIG = {
  brandName: "Bloom&blush",
  tagline: "Thoughtfully Crafted. Beautifully Presented.",
  founder: "Siddhi Kokate",
  location: "Pimpri-Chinchwad, Pune, Maharashtra",
  addressShort: "Pimpri-Chinchwad, Pune",
  // Active WhatsApp number (+91 81808 79442)
  whatsappNumber: "918180879442", 
  instagramHandle: "@blushnbloomm.in",
  instagramUrl: "https://www.instagram.com/blushnbloomm.in?stkn=MTJxbzE1bHU5czRwNA==",
  businessHours: "Monday to Sunday: 10:00 AM – 8:00 PM IST",
  // Configurable endpoint for syncing with your alternate admin website
  productsApiUrl: "products.json",
  serviceArea: "Pimpri-Chinchwad, Pune & Delivery across India for Select Creations",
  leadTimeNotice: "Each creation is handcrafted on order. Advance booking is recommended."
};

let COLLECTIONS = [
  {
    id: "money-garlands",
    title: "Money Garlands",
    subtitle: "Auspicious & Ceremonial",
    description: "Intricately pleated currency garlands woven with velvet roses, gold zari lace, and lustrous pearls for weddings and milestone celebrations.",
    image: "assets/images/money_garland.jpg",
    itemCount: "Custom Denominations Available"
  },
  {
    id: "bouquets",
    title: "Artisanal Bouquets",
    subtitle: "Fresh & Preserved Florals",
    description: "Hand-tied floral poetry combining deep wine roses, blush ranunculus, and cascading velvet ribbons tailored for proposals and weddings.",
    image: "assets/images/editorial_bouquet.jpg",
    itemCount: "Bespoke Floral Styling"
  },
  {
    id: "customized-hampers",
    title: "Customized Hampers",
    subtitle: "Curated Luxury Boxes",
    description: "Opulent presentation hampers in velvet and gold detailing, featuring handpicked gourmet delights, artisanal candles, and dried botanicals.",
    image: "assets/images/luxury_hamper.jpg",
    itemCount: "Personalized Selection"
  },
  {
    id: "wedding-gifting",
    title: "Wedding & Celebration Gifting",
    subtitle: "Trousseau & Royal Packaging",
    description: "Majestic bridal trays, trousseau packing, and ceremonial gifts that honor timeless Indian wedding traditions with modern elegance.",
    image: "assets/images/wedding_trousseau.jpg",
    itemCount: "Bridal & Family Trays"
  },
  {
    id: "customized-gifts",
    title: "Customized Gifts",
    subtitle: "Personalized Keepsakes",
    description: "Handcrafted wooden keepsake boxes, calligraphy wax-sealed tokens, and celebratory favors customized with personal names and initials.",
    image: "assets/images/customized_gifts.jpg",
    itemCount: "Made-to-Order"
  },
  {
    id: "luxury-addons",
    title: "Luxury Add-ons",
    subtitle: "Cloches, Accents & Keepsakes",
    description: "Everlasting botanical domes, scented wax medallions, calligraphy keepsakes, and bespoke ceremonial accents.",
    image: "assets/images/floral_dome.jpg",
    itemCount: "Artisanal Accents"
  }
];

let PRODUCTS = [];

// Production safety filter: Ensures obsolete mock products never re-appear anywhere
const FAKE_PRODUCT_IDS = new Set([
  'royal-sovereign-money-garland',
  'blush-petal-bridal-bouquet',
  'velvet-reverie-luxury-hamper',
  'raas-bridal-trousseau-tray',
  'eternal-rose-glass-cloche',
  'pastel-bliss-ceremony-garland',
  'bespoke-sandalwood-keepsake-box',
  'celebration-floral-gift-suite',
  'royal-wedding-mandap-decor',
  'grand-rajputana-money-garland',
  'gold-leaf-keepsake-box'
]);

function isFakeProduct(prod) {
  if (!prod) return true;
  if (typeof prod === 'string') return FAKE_PRODUCT_IDS.has(prod);
  if (prod.id && FAKE_PRODUCT_IDS.has(prod.id)) return true;
  if (typeof prod.id === 'string' && (prod.id.includes('copy') || prod.id.includes('heritage-flora') || prod.id.includes('test-'))) return true;
  return false;
}


const OCCASIONS = [
  {
    title: "Weddings & Baraat",
    description: "Grand money garlands, royal trousseau trays, and showstopping bridal bouquets crafted for Pune's most magnificent weddings.",
    image: "assets/images/money_garland.jpg"
  },
  {
    title: "Engagements & Roka",
    description: "Intimate ring ceremony trays, romantic bouquets, and personalized gift boxes celebrating the beginning of forever.",
    image: "assets/images/editorial_bouquet.jpg"
  },
  {
    title: "Milestone Birthdays",
    description: "Thoughtfully curated celebration hampers and custom currency garlands honoring 25th, 50th, and 75th milestones.",
    image: "assets/images/luxury_hamper.jpg"
  },
  {
    title: "Anniversaries",
    description: "Eternal preserved rose cloches and keepsake boxes that preserve love and memories across the years.",
    image: "assets/images/floral_dome.jpg"
  },
  {
    title: "Baby Showers & Naming",
    description: "Pastel ceremony garlands, customized baby hampers, and delicate floral keepsakes for baby arrival celebrations.",
    image: "assets/images/pastel_garland.jpg"
  },
  {
    title: "Festivals & Poojas",
    description: "Auspicious festive trays, handcrafted dry fruit boxes, and celebratory gifts for Diwali, Ganesh Utsav, and Navratri.",
    image: "assets/images/wedding_trousseau.jpg"
  },
  {
    title: "Traditional Ceremonies",
    description: "Housewarmings (Vastu Shanti), thread ceremonies (Upanayana), and auspicious family ceremonies.",
    image: "assets/images/customized_gifts.jpg"
  },
  {
    title: "Corporate & VIP Gifting",
    description: "Distinguished executive hampers and bespoke festive boxes for Pune businesses seeking artisanal quality.",
    image: "assets/images/hero.jpg"
  }
];

let PORTFOLIO_ITEMS = [
  {
    id: "port-reel-dd3ozl8kbw8",
    title: "Sacred Lalbaugcha Raja Currency Garland",
    category: "Garlands",
    image: "assets/reels/Dd3Ozl8KBW8.jpg",
    videoUrl: "assets/reels/Dd3Ozl8KBW8.mp4",
    linkUrl: "https://www.instagram.com/reel/Dd3Ozl8KBW8/",
    shortcode: "Dd3Ozl8KBW8",
    caption: "Muze ye dilao na🥹💗\n@blushnbloomm.in \n#viral #reels #trending #bouquet #hampers",
    tags: ["Garlands", "Money Garlands", "Wedding", "Groom Styling"],
    duration: "0:15",
    aspect: "9:16",
    span: "col-span-2 row-span-2",
    featured: true,
    createdAt: 1738100000000
  },
  {
    id: "port-reel-ddinv2hkpe1",
    title: "Opulent Velvet Bridal Trousseau Suite",
    category: "Bridal",
    image: "assets/reels/DdInv2hKpE1.jpg",
    videoUrl: "assets/reels/DdInv2hKpE1.mp4",
    linkUrl: "https://www.instagram.com/reel/DdInv2hKpE1/",
    shortcode: "DdInv2hKpE1",
    caption: "Unrgent garlands available, कोऱ्या नोटा available 🫶🏻\nतुमच्या लाडक्या बाप्पा साठी आजच booking करा \n@blushnbloomm.in \n8180879442\n#viral #trending #dagdusheth #lalbaughcharaja #ganpatibappamorya",
    tags: ["Bridal", "Trousseau", "Ceremonial", "Wedding"],
    duration: "0:15",
    aspect: "9:16",
    span: "col-span-1 row-span-1",
    featured: true,
    createdAt: 1738050000000
  },
  {
    id: "port-reel-db41owdpwnl",
    title: "Sacred Ceremonial Offering Garland",
    category: "Garlands",
    image: "assets/reels/Db41OwdPwnL.jpg",
    videoUrl: "assets/reels/Db41OwdPwnL.mp4",
    linkUrl: "https://www.instagram.com/reel/Db41OwdPwnL/",
    shortcode: "Db41OwdPwnL",
    caption: "Sacred Devotional Garland offering for Lalbaugcha Raja, Mumbai. Handcrafted with authentic floral artistry and gold zari brocade.",
    tags: ["Garlands", "Devotional", "Ceremony", "Handcrafted"],
    duration: "0:29",
    aspect: "9:16",
    span: "col-span-1 row-span-1",
    featured: true,
    createdAt: 1738000000000
  },
  {
    id: "port-reel-dbkdeiouzjy",
    title: "Grand Floral Entry & Wedding Decor",
    category: "Decor",
    image: "assets/reels/DbkDEIouZJy.jpg",
    videoUrl: "assets/reels/DbkDEIouZJy.mp4",
    linkUrl: "https://www.instagram.com/reel/DbkDEIouZJy/",
    shortcode: "DbkDEIouZJy",
    caption: "दादा देशील ना 🥹❤️🫀\nRakshabandhan gift for sister \n@blushnbloomm.in \n📞 81808 79442\n#love #rakshabandhan #sister #brothers #gift",
    tags: ["Decor", "Floral Styling", "Wedding Decor", "Grand Entry"],
    duration: "0:15",
    aspect: "9:16",
    span: "col-span-1 row-span-2",
    featured: true,
    createdAt: 1737950000000
  },
  {
    id: "port-reel-dzr_p-rivdf",
    title: "Velvet Reverie Celebration Hamper",
    category: "Hampers",
    image: "assets/reels/DZr_p-RIvdf.jpg",
    videoUrl: "assets/reels/DZr_p-RIvdf.mp4",
    linkUrl: "https://www.instagram.com/reel/DZr_p-RIvdf/",
    shortcode: "DZr_p-RIvdf",
    caption: ".जिथे चरण तुझे दिसेल तिथे मस्तक माझे झुकेल 🙇‍♂️🌸\n.  Blessed..!🥹❤️\n#viral #fyb #ganpatibappa #birthday #viralreel",
    tags: ["Hampers", "Festive", "Luxury Gifting", "Customized"],
    duration: "0:15",
    aspect: "9:16",
    span: "col-span-1 row-span-1",
    featured: true,
    createdAt: 1737900000000
  },
  {
    id: "port-reel-dzdo5xloxn0",
    title: "Studio BTS & Artisan Flower Weaving",
    category: "Behind the Scenes",
    image: "assets/reels/DZdO5XLoxn0.jpg",
    videoUrl: "assets/reels/DZdO5XLoxn0.mp4",
    linkUrl: "https://www.instagram.com/reel/DZdO5XLoxn0/",
    shortcode: "DZdO5XLoxn0",
    caption: "Bappa….❤️🌸🙇🏻 Handcrafted with pure love in our studio.",
    tags: ["Behind the Scenes", "Studio BTS", "Artisanal", "Pune"],
    duration: "0:15",
    aspect: "9:16",
    span: "col-span-1 row-span-1",
    featured: true,
    createdAt: 1737850000000
  },
  {
    id: "port-reel-dv5c0ubcony",
    title: "Pastel Pearl Ceremony Garland",
    category: "Garlands",
    image: "assets/reels/DV5C0UbCOnY.jpg",
    videoUrl: "assets/reels/DV5C0UbCOnY.mp4",
    linkUrl: "https://www.instagram.com/reel/DV5C0UbCOnY/",
    shortcode: "DV5C0UbCOnY",
    caption: "Handcrafted Pastel Elegance 🌻🤍\n@blushnbloomm.in\n#viral #reels #instagood #trending #garlands",
    tags: ["Garlands", "Pastel", "Baby Shower", "Roka"],
    duration: "0:15",
    aspect: "9:16",
    span: "col-span-1 row-span-1",
    featured: true,
    createdAt: 1737800000000
  },
  {
    id: "port-reel-dvkxv4hdjv2",
    title: "Wine & Blush Bridal Posy Bouquet",
    category: "Bridal",
    image: "assets/reels/DVkXv4hDJV2.jpg",
    videoUrl: "assets/reels/DVkXv4hDJV2.mp4",
    linkUrl: "https://www.instagram.com/reel/DVkXv4hDJV2/",
    shortcode: "DVkXv4hDJV2",
    caption: "Har by @blushnbloomm.in 😍🫶🏻\n#foryou #foryoupage #instagram #viral #instadaily",
    tags: ["Bridal", "Bouquets", "Fresh Florals", "Bridal Entry"],
    duration: "0:15",
    aspect: "9:16",
    span: "col-span-1 row-span-1",
    featured: true,
    createdAt: 1737750000000
  }
];


const DEFAULT_ACHIEVEMENTS = [
  {
    id: "ach-lalbaugcha-raja-garland-1",
    title: "Sacred Garland Offering at Lalbaugcha Raja, Mumbai",
    category: "Milestone Reel",
    mediaType: "video",
    mediaUrl: "assets/videos/snapgram.io_398718527598.mp4",
    thumbnailUrl: "assets/images/reel_garland_preview.jpg",
    date: "Ganesh Utsav Milestone",
    badge: "👑 Divine Milestone",
    description: "An unforgettable blessed honor for Bloom&blush — our handcrafted auspicious ceremonial garland adorned on the sacred idol of Lalbaugcha Raja, Mumbai in the presence of millions of devotees.",
    featured: true,
    duration: "0:29",
    aspect: "9:16",
    linkUrl: "https://www.instagram.com/blushnbloomm.in?stkn=MTJxbzE1bHU5czRwNA==",
    createdAt: 1738000000000
  },
  {
    id: "ach-lalbaugcha-raja-garland-2",
    title: "3rd Auspicious Garland Adorned on Lalbaugcha Raja (तिसरा हार अर्पित)",
    category: "Milestone Reel",
    mediaType: "video",
    mediaUrl: "assets/videos/snapgram.io_399154073737.mp4",
    thumbnailUrl: "assets/images/reel_styling_preview.jpg",
    date: "Special Studio Dispatch",
    badge: "🌸 Sacred Devotion",
    description: "Handcrafted with heartfelt devotion and artisanal perfection in Pimpri-Chinchwad, Pune — our third ceremonial garland offering gracefully draped on Mumbai's iconic Lalbaugcha Raja.",
    featured: true,
    duration: "0:45",
    aspect: "9:16",
    linkUrl: "https://www.instagram.com/blushnbloomm.in?stkn=MTJxbzE1bHU5czRwNA==",
    createdAt: 1737900000000
  }
];

let ACHIEVEMENTS = [...DEFAULT_ACHIEVEMENTS];

