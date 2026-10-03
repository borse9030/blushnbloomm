const fs = require('fs');
const path = require('path');

// Read templates and data
const baseTemplate = fs.readFileSync('category.html', 'utf-8');
const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
const collections = JSON.parse(fs.readFileSync('collections.json', 'utf-8'));

const CATEGORY_META = {
  'money-garlands': {
    title: 'The Money Garland Suite',
    seoTitle: 'Bespoke Groom Money Garlands & Currency Haar | Bloom&blush Pune',
    eyebrow: 'HERITAGE ORIGAMI CEREMONY',
    lead: 'Bespoke origami currency garlands handcrafted for grooms, baraat entries, and milestone ceremonies in Pune using proprietary zero-damage folding techniques and gold zari brocade.',
    image: 'https://blushnbloomm.in/assets/images/money_garland.jpg',
    scriptText: 'Groom<br>Heritage<br>Garlands',
    metrics: [
      { text: '100% Zero-Damage Origami Folding', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
      { text: 'Choice of ₹10 to ₹500 Notes', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Pimpri-Chinchwad Studio Delivery', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' }
    ],
    waPrompt: 'Hello Siddhi, I am exploring your Money Garlands collection on Bloom&blush and would love to consult for my upcoming celebration!'
  },
  'bouquets': {
    title: 'Artisanal Bouquets & Eternal Florals',
    seoTitle: 'Artisanal Bridal Bouquets & Preserved Florals Pune | Bloom&blush',
    eyebrow: 'FRESH & PRESERVED FLORAL ART',
    lead: 'Romantic hand-tied bridal bouquets, fresh English garden roses, and eternal preserved florals crafted with cascading hand-dyed velvet ribbons in Pimpri-Chinchwad, Pune.',
    image: 'https://blushnbloomm.in/assets/images/editorial_bouquet.jpg',
    scriptText: 'Blooms<br>Bridal<br>Eternal',
    metrics: [
      { text: 'Fresh Seasonal & 3-Year Preserved Roses', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
      { text: 'Trailing Silk Velvet Ribbons', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Custom Palette Color Matching', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }
    ],
    waPrompt: 'Hello Siddhi, I saw your Artisanal Bouquets collection on Bloom&blush and would love to enquire about ordering a bridal bouquet or floral arrangement!'
  },
  'customized-hampers': {
    title: 'Customized Celebration Hampers',
    seoTitle: 'Luxury Celebration Hampers & Velvet Trunks Pune | Bloom&blush',
    eyebrow: 'EXPERIENTIAL LUXURY GIFTING',
    lead: 'Rich burgundy velvet gift trunks paired with brass dry fruit canisters, artisanal soy candles, gourmet delicacies, and personalized wax-sealed greetings in Pune.',
    image: 'https://blushnbloomm.in/assets/images/luxury_hamper.jpg',
    scriptText: 'Luxury<br>Hampers<br>Curations',
    metrics: [
      { text: 'Opulent Velvet Presentation Trunks', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.65-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z' },
      { text: 'Brass Canisters & Scented Soy Candles', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Custom Foil Monogramming Available', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }
    ],
    waPrompt: 'Hello Siddhi, I would like to consult about your Customized Hampers on Bloom&blush for our upcoming occasion!'
  },
  'wedding-gifting': {
    title: 'Wedding & Celebration Gifting',
    seoTitle: 'Bridal Trousseau Packing & Wedding Platters Pune | Bloom&blush',
    eyebrow: 'ROYAL TROUSSEAU PRESENTATION',
    lead: 'Opulent velvet trousseau presentation trays, zardozi batwas, brass jewelry caskets, and bespoke ceremonial gift packaging designed for Indian weddings in Pune.',
    image: 'https://blushnbloomm.in/assets/images/wedding_trousseau.jpg',
    scriptText: 'Royal<br>Trousseau<br>Suites',
    metrics: [
      { text: 'Heavy Gold Zari & Micro-Velvet Craft', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Bespoke Compartment Sizing', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
      { text: 'Complete Ring, Saree & Jewelry Suites', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.65-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z' }
    ],
    waPrompt: 'Hello Siddhi, I am preparing for a wedding and would love to consult about your Royal Trousseau Trays and celebration gifting!'
  },
  'customized-gifts': {
    title: 'Customized Keepsake Gifts',
    seoTitle: 'Wedding Flower Varmala Resin Preservation Pune | Bloom&blush',
    eyebrow: 'HEIRLOOM SENTIMENTAL TOKENS',
    lead: 'Hand-carved wooden keepsake boxes, authentic dip-pen calligraphy letters, and archival wedding varmala flower preservation in clear epoxy resin in Pune.',
    image: 'https://blushnbloomm.in/assets/images/customized_gifts.jpg',
    scriptText: 'Heirloom<br>Keepsake<br>Gifts',
    metrics: [
      { text: 'Hand-Carved Solid Seasoned Wood', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Real Hand-Written Calligraphy on Cotton Paper', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
      { text: 'Custom Floral Wax Seal Stamps', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' }
    ],
    waPrompt: 'Hello Siddhi, I would like to order a personalized Customized Keepsake Gift from Bloom&blush!'
  },
  'luxury-addons': {
    title: 'Luxury Add-ons & Everlasting Florals',
    seoTitle: 'Preserved Forever Rose Glass Cloches Pune | Bloom&blush',
    eyebrow: 'EVERLASTING FLORAL ACCENTS',
    lead: 'Real preserved Ecuadorian rose cloches lasting 3+ years without water, fragrance vials, and boutique display accents handcrafted in Pimpri-Chinchwad, Pune.',
    image: 'https://blushnbloomm.in/assets/images/floral_dome.jpg',
    scriptText: 'Everlasting<br>Floral<br>Art',
    metrics: [
      { text: '100% Real Preserved Roses (3+ Years)', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
      { text: 'Crystal-Clear Glass Cloche Domes', icon: 'M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' },
      { text: 'Warm Micro-Fairy Light Integration', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }
    ],
    waPrompt: 'Hello Siddhi, I would like to enquire about your Luxury Add-ons and Preserved Rose Cloches on Bloom&blush!'
  }
};

const categoryIds = Object.keys(CATEGORY_META);

categoryIds.forEach(catId => {
  const meta = CATEGORY_META[catId];
  const catProducts = products.filter(p => p.collectionId === catId);
  const targetUrl = `https://blushnbloomm.in/${catId}.html`;

  let html = baseTemplate;

  // 1. Replace Title & Meta Description
  html = html.replace(/<title id="page-title">.*?<\/title>/, `<title id="page-title">${meta.seoTitle}</title>`);
  html = html.replace(/<meta name="description" id="page-meta-desc" content=".*?">/, `<meta name="description" id="page-meta-desc" content="${meta.lead}">`);

  // 2. Canonical URL
  html = html.replace(/<link rel="canonical" id="canonical-link" href=".*?">/, `<link rel="canonical" id="canonical-link" href="${targetUrl}">`);

  // 3. OpenGraph tags
  html = html.replace(/<meta property="og:title" id="og-title" content=".*?">/, `<meta property="og:title" id="og-title" content="${meta.seoTitle}">`);
  html = html.replace(/<meta property="og:description" id="og-desc" content=".*?">/, `<meta property="og:description" id="og-desc" content="${meta.lead}">`);
  html = html.replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${meta.image}">\n  <meta property="og:image:secure_url" content="${meta.image}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">`);
  html = html.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${targetUrl}">\n  <meta property="og:locale" content="en_IN">`);

  // 4. Twitter Card
  html = html.replace(/<!-- Google Fonts -->/, `<!-- Mobile Manifest & Theme -->\n  <link rel="manifest" href="site.webmanifest">\n  <meta name="theme-color" content="#5E1624">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="${meta.seoTitle}">\n  <meta name="twitter:description" content="${meta.lead}">\n  <meta name="twitter:image" content="${meta.image}">\n\n  <!-- Google Fonts -->`);

  // 5. Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": meta.title,
    "description": meta.lead,
    "url": targetUrl,
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
          "name": meta.title,
          "item": targetUrl
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": catProducts.map((p, idx) => ({
        "@type": "Product",
        "position": idx + 1,
        "name": p.name,
        "description": p.shortDesc,
        "image": `https://blushnbloomm.in/${p.image}`,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": p.price || 4500,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Florist",
            "name": "Bloom&blush"
          }
        }
      }))
    }
  };

  html = html.replace(/<script type="application\/ld\+json" id="category-json-ld">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="category-json-ld">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>`);

  // 6. Pre-render initial Hero in HTML
  html = html.replace(/<h1 class="cat-hero-title" id="cat-hero-title">.*?<\/h1>/, `<h1 class="cat-hero-title" id="cat-hero-title">${meta.title}</h1>`);
  html = html.replace(/<p class="cat-hero-lead" id="cat-hero-lead">[\s\S]*?<\/p>/, `<p class="cat-hero-lead" id="cat-hero-lead">${meta.lead}</p>`);
  html = html.replace(/<span class="cat-hero-pill-badge" id="cat-hero-pill-badge">.*?<\/span>/, `<span class="cat-hero-pill-badge" id="cat-hero-pill-badge">${meta.eyebrow}</span>`);
  html = html.replace(/<img src=".*?" alt=".*?" class="cat-hero-img" id="cat-hero-img">/, `<img src="${meta.image.replace('https://blushnbloomm.in/', '')}" alt="${meta.title} - Bloom&amp;blush Pune" class="cat-hero-img" id="cat-hero-img" width="580" height="720" fetchpriority="high">`);
  html = html.replace(/<div class="cat-script-ribbon" id="cat-script-ribbon">.*?<\/div>/, `<div class="cat-script-ribbon" id="cat-script-ribbon">${meta.scriptText}</div>`);
  html = html.replace(/<span id="bc-current-name">.*?<\/span>/, `<span id="bc-current-name">${meta.title}</span>`);

  // 7. Inject initial Category ID bootstrap in inline script before category.js
  const bootstrapScript = `\n  <script>\n    window.PRESET_CATEGORY_ID = '${catId}';\n  </script>\n  <script src="js/category.js?v=reel2"></script>`;
  html = html.replace(/<script src="js\/category\.js\?v=reel2"><\/script>/, bootstrapScript);

  const outFile = path.join(process.cwd(), `${catId}.html`);
  fs.writeFileSync(outFile, html, 'utf-8');
  console.log(`Generated pre-rendered landing page: ${catId}.html`);
});

console.log('All 6 standalone category landing pages created successfully!');
