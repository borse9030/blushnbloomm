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
  instagramHandle: "@blushnbloomm",
  instagramUrl: "https://www.instagram.com/blushnbloomm/",
  businessHours: "Monday to Sunday: 10:00 AM – 8:00 PM IST",
  // Configurable endpoint for syncing with your alternate admin website
  productsApiUrl: "products.json",
  serviceArea: "Pimpri-Chinchwad, Pune & Delivery across India for Select Creations",
  leadTimeNotice: "Each creation is handcrafted on order. Advance booking is recommended."
};

const COLLECTIONS = [
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
  }
];

let PRODUCTS = [
  {
    id: "royal-sovereign-money-garland",
    name: "The Royal Sovereign Money Garland",
    collectionId: "money-garlands",
    category: "Money Garlands",
    badge: "Signature Creation",
    price: 4500,
    priceFormatted: "Starting at ₹4,500",
    priceNote: "+ Currency face value (Choice of ₹10 to ₹500 notes)",
    shortDesc: "Majestic origami-pleated currency garland with deep burgundy velvet roses and gold zari borders.",
    detailedDesc: "A breathtaking masterpiece handcrafted for grooms and grand celebration ceremonies. Each currency note is meticulously pleated using proprietary origami folding techniques that preserve the notes while creating an opulent ceremonial drape. Finished with deep burgundy velvet roses, antique gold brocade neckband, and shimmering pearl drop tassels.",
    customizationOptions: [
      "Choice of currency denomination (₹10, ₹20, ₹50, ₹100, ₹200, ₹500)",
      "Flower color palette (Burgundy & Gold, Blush & Ivory, or Classic Maroon)",
      "Neckband trim style (Zari embroidery, Velvet border, or Golden Brocade)",
      "Custom name or initials tag in brass calligraphy"
    ],
    suitableOccasions: ["Weddings & Baraat", "Engagement / Roka", "Milestone 50th / 60th Birthdays", "Thread Ceremonies"],
    details: {
      "Price Guidance": "Starting at ₹4,500 crafting charge + selected currency amount",
      "Crafting Time": "3 - 5 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Presentation": "Packaged in luxury archival preservation box",
      "Note Safety": "Zero pinholes or adhesive damage to currency notes"
    },
    image: "assets/images/money_garland.jpg"
  },
  {
    id: "blush-petal-bridal-bouquet",
    name: "The Blush & Wine Bridal Bouquet",
    collectionId: "bouquets",
    category: "Artisanal Bouquets",
    badge: "Bridal Favorite",
    price: 2450,
    priceFormatted: "₹2,450",
    priceNote: "Fresh & Preserved Floral Arrangement",
    shortDesc: "Opulent hand-tied bridal bouquet with deep wine garden roses, cream ranunculus, and flowing velvet ribbon.",
    detailedDesc: "Designed for the modern romantic bride and grand celebratory entries. An artistic composition of deep wine garden roses, ruffled blush ranunculus, delicate anemones, and silvery seeded eucalyptus. Bound with long, trailing hand-dyed burgundy silk velvet ribbons that catch the breeze beautifully in wedding photography.",
    customizationOptions: [
      "Fresh seasonal blooms or eternal preserved florals",
      "Color tuning to match bridal lehenga or gown palette",
      "Ribbon selection (Hand-dyed silk velvet, raw-edge chiffon, or satin)",
      "Matching groom's boutonniere and bridesmaid posies available on request"
    ],
    suitableOccasions: ["Bridal Entry & Reception", "Wedding Proposals", "Anniversary Milestones", "Luxury Photoshoots"],
    details: {
      "Price Guidance": "₹2,450 (includes hydration pack & satin keepsake ribbon)",
      "Crafting Time": "24 - 48 Hours notice recommended",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Floral Care": "Delivered with hydration pack & care instructions",
      "Dimensions": "Approx. 14 inches width × 16 inches height"
    },
    image: "assets/images/editorial_bouquet.jpg"
  },
  {
    id: "velvet-reverie-luxury-hamper",
    name: "The Velvet Reverie Celebration Hamper",
    collectionId: "customized-hampers",
    category: "Customized Hampers",
    badge: "Bespoke Curation",
    price: 3850,
    priceFormatted: "₹3,850",
    priceNote: "Complete Gourmet & Fragrance Trunk",
    shortDesc: "Velvet burgundy presentation box with brass dry fruit canisters, scented soy candle, and dried florals.",
    detailedDesc: "An experiential luxury gift box created for distinguished celebration gifting. Crafted inside a rich burgundy velvet box with gold foil embossing, featuring hand-hammered brass canisters filled with gourmet roasted almonds and cashews, an artisanal wood-wick soy candle, a delicate preserved flower posy, and a personalized calligraphy greeting with wax seal.",
    customizationOptions: [
      "Custom name / crest foil-stamped on the box lid",
      "Choice of candle fragrance (Royal Oud, Damask Rose, or Amber Vanilla)",
      "Selection of gourmet delicacies or sweet confectionery",
      "Personalized handwritten calligraphy message card with wax stamp"
    ],
    suitableOccasions: ["Diwali & Festive Gifting", "Wedding Welcome Hampers", "Corporate VIP Gifting", "New Home Housewarming"],
    details: {
      "Price Guidance": "₹3,850 inclusive of gourmet dry fruits, candle & trunk",
      "Crafting Time": "2 - 4 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Box Finish": "High-density rigid velvet trunk with brass lock latch",
      "Dimensions": "12 × 10 × 4.5 inches"
    },
    image: "assets/images/luxury_hamper.jpg"
  },
  {
    id: "raas-bridal-trousseau-tray",
    name: "The Raas Royal Trousseau Tray",
    collectionId: "wedding-gifting",
    category: "Wedding & Celebration Gifting",
    badge: "Heritage Craft",
    price: 5200,
    priceFormatted: "Starting at ₹5,200",
    priceNote: "Custom Sized for Trousseau Exchange",
    shortDesc: "Opulent burgundy velvet ceremonial tray with heavy gold zari border, zardozi pouches, and jewelry casket.",
    detailedDesc: "A regal presentation tray designed for Indian wedding trousseau displays and ceremonial exchange. Lined in royal burgundy velvet with an antique gold zardozi border, this tray includes an embossed brass jewelry casket, embroidered velvet batwas (potli pouches), fragrant gajra accents with miniature burgundy roses, and Kundan brooch pins.",
    customizationOptions: [
      "Tray dimensions & compartment layouts customized to trousseau items",
      "Color coordination with bridal trousseau theme (Burgundy, Emerald, or Ivory)",
      "Personalized acrylic or brass bride & groom monogram plaque",
      "Full trousseau packaging suite (ring trays, saree trays, watch hampers)"
    ],
    suitableOccasions: ["Wedding Trousseau Exchange", "Engagement Ring Ceremony", "Sangeet & Mehendi Gifting", "Bridal Welcome"],
    details: {
      "Price Guidance": "Starting at ₹5,200 per tray (set discounts for 5+ trays)",
      "Crafting Time": "4 - 7 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Materials": "Hardwood frame, micro-velvet lining, heritage zari lace",
      "Care": "Includes protective dust cover for long-term preservation"
    },
    image: "assets/images/wedding_trousseau.jpg"
  },
  {
    id: "eternal-rose-glass-cloche",
    name: "The Eternal Burgundy Rose Cloche",
    collectionId: "bouquets",
    category: "Artisanal Bouquets",
    badge: "Everlasting",
    price: 2800,
    priceFormatted: "₹2,800",
    priceNote: "Lasts 3+ Years without water",
    shortDesc: "Real preserved Ecuadorian burgundy and blush roses under an antique brass glass cloche dome.",
    detailedDesc: "A timeless token of romance that lasts for over 3 years without water or sunlight. A 100% natural, preserved deep burgundy rose and blush companion rose are delicately arranged with preserved baby's breath and eucalyptus inside a crystal-clear glass cloche dome on a solid walnut and antique brass pedestal.",
    customizationOptions: [
      "Engraved brass plaque on the base with date and custom message",
      "Rose color combination (Burgundy, Dusty Rose, Champagne, or Royal White)",
      "Addition of subtle warm micro-fairy lights with hidden battery switch"
    ],
    suitableOccasions: ["Anniversaries", "Valentine's & Proposals", "Birthday Keepsakes", "Luxury Desk / Bedside Decor"],
    details: {
      "Price Guidance": "₹2,800 (includes glass cloche, walnut base & gift box)",
      "Longevity": "Preserved to remain pristine for 3+ years",
      "Crafting Time": "Ready to dispatch in 24 - 48 Hours",
      "Dimensions": "Height 8.5 inches × Diameter 5.5 inches",
      "Packaging": "Delivered in signature Bloom&blush ivory gift box with satin bow"
    },
    image: "assets/images/floral_dome.jpg"
  },
  {
    id: "pastel-bliss-ceremony-garland",
    name: "The Pastel Pearl Ceremony Garland",
    collectionId: "money-garlands",
    category: "Money Garlands",
    badge: "New Arrival",
    price: 3800,
    priceFormatted: "Starting at ₹3,800",
    priceNote: "+ Currency face value (Soft pastel aesthetic)",
    shortDesc: "Delicate baby pink and soft gold currency garland with silk rosebuds and cascading pearl drops.",
    detailedDesc: "Designed with a lighter, ethereal aesthetic for intimate ceremonies, morning celebrations, and baby milestones. Features origami pleated currency notes harmonized with delicate blush pink silk rosebuds, soft gold scallop lace, and cascading pearl clusters that drape effortlessly.",
    customizationOptions: [
      "Choice of denomination (₹10, ₹20, ₹50, ₹100, ₹200, ₹500)",
      "Pastel tone customization (Soft Pink, Mint Green, Peach, or Lilac)",
      "Single garland or matching couple set for bride & groom"
    ],
    suitableOccasions: ["Baby Naming Ceremonies (Barse)", "Dohale Jevan / Baby Showers", "Intimate Engagements", "Graduations"],
    details: {
      "Price Guidance": "Starting at ₹3,800 crafting charge + selected currency amount",
      "Crafting Time": "3 - 4 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Drape Length": "Customizable from 24 to 36 inches",
      "Note Safety": "Guaranteed damage-free origami technique"
    },
    image: "assets/images/pastel_garland.jpg"
  },
  {
    id: "bespoke-sandalwood-keepsake-box",
    name: "The Heirloom Carved Keepsake Box",
    collectionId: "customized-gifts",
    category: "Customized Gifts",
    badge: "Personalized",
    price: 1950,
    priceFormatted: "₹1,950",
    priceNote: "Includes custom calligraphy letter",
    shortDesc: "Hand-carved wooden keepsake box tied with deep wine silk ribbon, personalized calligraphy letter, and wax seal.",
    detailedDesc: "A gift of enduring sentiment. Hand-carved from solid seasoned wood with floral jaali filigree, tied with an opulent burgundy satin ribbon, and paired with an authentic hand-lettered calligraphy letter on deckle-edge cotton paper sealed with our signature floral wax stamp.",
    customizationOptions: [
      "Custom initials or names carved onto the lid panel",
      "Custom letter message scripted by hand in gold or walnut ink",
      "Interior lining (Burgundy velvet, cream raw silk, or natural wood)"
    ],
    suitableOccasions: ["Wedding Morning Letters", "Father of the Bride Gifts", "Keepsake Jewelry Storage", "Milestone Anniversaries"],
    details: {
      "Price Guidance": "₹1,950 (includes wooden keepsake box & custom calligraphy letter)",
      "Crafting Time": "3 - 5 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Dimensions": "9 × 6 × 3.5 inches",
      "Finish": "Hand-buffed natural wax with floral filigree"
    },
    image: "assets/images/customized_gifts.jpg"
  },
  {
    id: "celebration-floral-gift-suite",
    name: "The Bloom&blush Signature Suite",
    collectionId: "customized-hampers",
    category: "Customized Hampers",
    badge: "Grand Ensemble",
    price: 4900,
    priceFormatted: "₹4,900",
    priceNote: "Luxury Centerpiece & Gift Suite",
    shortDesc: "Complete festive suite featuring fresh garden roses, luxury gift box, perfume vial, and golden accents.",
    detailedDesc: "The quintessential Bloom&blush experience. A masterfully composed gifting suite that pairs an editorial fresh flower arrangement of burgundy English garden roses and cream ranunculus with a gold-trimmed gift box, artisanal fragrance, and bespoke greeting card on a warm linen presentation mat.",
    customizationOptions: [
      "Custom floral selection based on recipient's favorite flowers",
      "Inclusion of luxury perfume, artisanal chocolates, or precious trinkets",
      "Theme styling for birthdays, corporate appreciation, or wedding anniversaries"
    ],
    suitableOccasions: ["Grand Milestone Birthdays", "Golden Anniversaries", "Festive Celebrations", "Proposal Surprises"],
    details: {
      "Price Guidance": "₹4,900 complete ensemble",
      "Crafting Time": "2 Business Days",
      "Handcrafted In": "Pimpri-Chinchwad, Pune",
      "Includes": "Floral centerpiece, gold foil gift box, fragrance vial, greeting card"
    },
    image: "assets/images/hero.jpg"
  }
];

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

const PORTFOLIO_ITEMS = [
  {
    title: "Bespoke Groom's Currency Garland",
    category: "Money Garlands",
    image: "assets/images/money_garland.jpg",
    span: "col-span-2 row-span-2"
  },
  {
    title: "Velvet Bridal Trousseau Suite",
    category: "Wedding Gifting",
    image: "assets/images/wedding_trousseau.jpg",
    span: "col-span-1 row-span-1"
  },
  {
    title: "Eternal Rose Antique Cloche",
    category: "Preserved Florals",
    image: "assets/images/floral_dome.jpg",
    span: "col-span-1 row-span-1"
  },
  {
    title: "Luxe Dryfruit & Scented Hamper",
    category: "Customized Hampers",
    image: "assets/images/luxury_hamper.jpg",
    span: "col-span-1 row-span-2"
  },
  {
    title: "Wine & Blush Bridal Posy",
    category: "Bouquets",
    image: "assets/images/editorial_bouquet.jpg",
    span: "col-span-1 row-span-1"
  },
  {
    title: "Pastel Pearl Garland Drape",
    category: "Money Garlands",
    image: "assets/images/pastel_garland.jpg",
    span: "col-span-1 row-span-1"
  },
  {
    title: "Hand-Carved Keepsake Letter Box",
    category: "Customized Gifts",
    image: "assets/images/customized_gifts.jpg",
    span: "col-span-1 row-span-1"
  }
];
