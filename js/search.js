/**
 * ===================================================================
 * Bloom&blush - Boutique Studio Universal Live Search Controller
 * Fully functional search for Desktop and Mobile views
 * Supports instant search, keyboard shortcuts (Ctrl+K, /),
 * collection matching, product details modal, and WhatsApp queries.
 * ===================================================================
 */

(function () {
  'use strict';

  let searchBackdrop = null;
  let searchInput = null;
  let searchClearBtn = null;
  let searchCloseBtn = null;
  let searchResultsContainer = null;
  let searchQuickTags = null;
  let searchCustomWaBtn = null;
  let selectedResultIndex = -1;

  // Initialize Search when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }

  function initSearch() {
    searchBackdrop = document.getElementById('search-modal-backdrop');
    searchInput = document.getElementById('search-main-input');
    searchClearBtn = document.getElementById('search-clear-btn');
    searchCloseBtn = document.getElementById('search-close-btn');
    searchResultsContainer = document.getElementById('search-results-container');
    searchQuickTags = document.getElementById('search-quick-tags');
    searchCustomWaBtn = document.getElementById('search-custom-wa-btn');

    // 1. Bind all search trigger buttons across Desktop & Mobile
    document.querySelectorAll('.js-search-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        // If drawer is open, close it
        const drawer = document.getElementById('mobile-nav-drawer');
        const overlay = document.getElementById('mobile-drawer-overlay');
        if (drawer && drawer.classList.contains('open')) {
          drawer.classList.remove('open');
          if (overlay) overlay.classList.remove('open');
        }
        openSearchModal();
      });
    });

    // 2. Close events
    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', closeSearchModal);
    }

    if (searchBackdrop) {
      searchBackdrop.addEventListener('click', (e) => {
        if (e.target === searchBackdrop) {
          closeSearchModal();
        }
      });
    }

    // 3. Search input events (Live Search)
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const val = searchInput.value;
        if (searchClearBtn) {
          searchClearBtn.style.display = val.trim() ? 'flex' : 'none';
        }
        performSearch(val);
      });

      searchInput.addEventListener('keydown', handleSearchKeyboard);
    }

    // 4. Clear button
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClearBtn.style.display = 'none';
        performSearch('');
      });
    }

    // 5. Quick suggestion pills
    if (searchQuickTags) {
      searchQuickTags.querySelectorAll('.search-tag-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const query = pill.dataset.query || pill.textContent.trim();
          if (searchInput) {
            searchInput.value = query;
            searchInput.focus();
            if (searchClearBtn) searchClearBtn.style.display = 'flex';
          }
          searchQuickTags.querySelectorAll('.search-tag-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          performSearch(query);
        });
      });
    }

    // 6. Global Keyboard Shortcuts: Ctrl+K / Cmd+K or "/" to open, ESC to close
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (isSearchOpen()) {
          closeSearchModal();
        } else {
          openSearchModal();
        }
        return;
      }

      // "/" opens search if not currently typing in an input/textarea/select
      if (e.key === '/' && !isSearchOpen()) {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          e.preventDefault();
          openSearchModal();
          return;
        }
      }

      // Escape closes search modal
      if (e.key === 'Escape' && isSearchOpen()) {
        e.preventDefault();
        closeSearchModal();
      }
    });
  }

  function isSearchOpen() {
    return searchBackdrop && searchBackdrop.classList.contains('open');
  }

  function openSearchModal(initialQuery = '') {
    if (!searchBackdrop) return;
    searchBackdrop.classList.add('open');
    document.body.classList.add('modal-open');
    selectedResultIndex = -1;

    if (searchInput) {
      if (initialQuery) {
        searchInput.value = initialQuery;
        if (searchClearBtn) searchClearBtn.style.display = 'flex';
      }
      setTimeout(() => {
        searchInput.focus();
        if (initialQuery) {
          performSearch(initialQuery);
        } else {
          performSearch(searchInput.value || '');
        }
      }, 50);
    }
  }

  function closeSearchModal() {
    if (!searchBackdrop) return;
    searchBackdrop.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  /**
   * Core Search Logic across PRODUCTS and COLLECTIONS
   */
  function performSearch(query) {
    if (!searchResultsContainer) return;
    selectedResultIndex = -1;

    const trimmed = (query || '').trim().toLowerCase();
    const products = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];
    const collections = (typeof COLLECTIONS !== 'undefined' && Array.isArray(COLLECTIONS)) ? COLLECTIONS : [];

    // Update bottom WhatsApp custom inquiry link
    if (searchCustomWaBtn) {
      const waNumber = (typeof CONFIG !== 'undefined' && CONFIG.whatsappNumber) ? CONFIG.whatsappNumber : '918180879442';
      const waMsg = trimmed
        ? `Hello Siddhi, I was searching for "${trimmed}" on Bloom&blush and would love to consult on a custom design.`
        : `Hello Siddhi, I would like to consult with Bloom&blush about bespoke creations.`;
      searchCustomWaBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;
    }

    // 1. If query is empty, show curated highlights & categories
    if (!trimmed) {
      renderDefaultDiscovery(products, collections);
      return;
    }

    // 2. Score & rank matching products
    const keywords = trimmed.split(/\s+/).filter(Boolean);
    const scoredProducts = [];

    products.forEach(p => {
      let score = 0;
      const nameLower = (p.name || '').toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      const colIdLower = (p.collectionId || '').toLowerCase();
      const shortDescLower = (p.shortDesc || '').toLowerCase();
      const detailedDescLower = (p.detailedDesc || '').toLowerCase();
      const badgeLower = (p.badge || '').toLowerCase();
      const occasionsStr = Array.isArray(p.suitableOccasions) ? p.suitableOccasions.join(' ').toLowerCase() : '';
      const customStr = Array.isArray(p.customizationOptions) ? p.customizationOptions.join(' ').toLowerCase() : '';

      // Direct exact match in name
      if (nameLower === trimmed) score += 200;
      else if (nameLower.includes(trimmed)) score += 100;

      // Category matches
      if (catLower.includes(trimmed) || colIdLower.includes(trimmed)) score += 80;

      // Occasion matches (e.g. wedding, anniversary, birthday)
      if (occasionsStr.includes(trimmed)) score += 60;

      // Keywords match
      keywords.forEach(kw => {
        if (nameLower.includes(kw)) score += 35;
        if (catLower.includes(kw)) score += 25;
        if (badgeLower.includes(kw)) score += 20;
        if (occasionsStr.includes(kw)) score += 20;
        if (shortDescLower.includes(kw)) score += 15;
        if (detailedDescLower.includes(kw)) score += 10;
        if (customStr.includes(kw)) score += 10;
      });

      if (score > 0) {
        scoredProducts.push({ product: p, score });
      }
    });

    scoredProducts.sort((a, b) => b.score - a.score);
    const matchedProducts = scoredProducts.map(sp => sp.product);

    // 3. Check for matching collections
    const matchedCollections = collections.filter(c => {
      const titleLower = (c.title || '').toLowerCase();
      const idLower = (c.id || '').toLowerCase();
      const descLower = (c.description || '').toLowerCase();
      return titleLower.includes(trimmed) || idLower.includes(trimmed) || descLower.includes(trimmed);
    });

    renderSearchResults(trimmed, matchedProducts, matchedCollections);
  }

  /**
   * Render Search Results
   */
  function renderSearchResults(query, matchedProducts, matchedCollections) {
    if (matchedProducts.length === 0 && matchedCollections.length === 0) {
      renderEmptyState(query);
      return;
    }

    const waNumber = (typeof CONFIG !== 'undefined' && CONFIG.whatsappNumber) ? CONFIG.whatsappNumber : '918180879442';

    let html = `
      <div class="search-results-meta">
        <span>Found <span class="search-count-highlight">${matchedProducts.length} creation${matchedProducts.length === 1 ? '' : 's'}</span> for &ldquo;${escapeHtml(query)}&rdquo;</span>
        <span style="font-size: 0.74rem; color: var(--text-muted);">Use &uarr;&darr; keys to navigate &bull; Enter to select</span>
      </div>
    `;

    // 1. If any Collection matched directly, display an editorial collection jump banner
    if (matchedCollections.length > 0) {
      const topCol = matchedCollections[0];
      html += `
        <div class="search-collection-banner">
          <div class="search-col-info">
            <span class="search-item-tag" style="color: var(--accent-gold-dark);">Matching Dedicated Collection</span>
            <h4>${highlightText(topCol.title, query)}</h4>
            <p>${escapeHtml(topCol.description || topCol.subtitle || '')}</p>
          </div>
          <a href="category.html?id=${encodeURIComponent(topCol.id)}" class="search-col-link">
            <span>Explore Collection &rarr;</span>
          </a>
        </div>
      `;
    }

    // 2. Render Product Result Cards
    if (matchedProducts.length > 0) {
      html += `<div class="search-results-list" role="listbox">`;
      html += matchedProducts.map((p, idx) => {
        const occasions = Array.isArray(p.suitableOccasions) ? p.suitableOccasions.slice(0, 2).join(' &bull; ') : '';
        const priceLabel = p.priceFormatted || (p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'Custom Order');

        return `
          <div 
            class="search-item-card" 
            role="option" 
            data-index="${idx}" 
            data-id="${escapeHtml(p.id)}"
            data-col="${escapeHtml(p.collectionId || '')}"
            tabindex="0"
          >
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="search-item-img" loading="lazy">
            <div class="search-item-details">
              <span class="search-item-tag">${escapeHtml(p.category || 'Bloom&blush')}</span>
              <h3 class="search-item-name">${highlightText(p.name, query)}</h3>
              <div class="search-item-price">
                <strong>${priceLabel}</strong>
                ${p.priceNote ? `<span style="font-size: 0.74rem; color: var(--text-muted); margin-left: 0.35rem;">${escapeHtml(p.priceNote)}</span>` : ''}
              </div>
              ${occasions ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">Ideal for: ${highlightText(occasions, query)}</div>` : ''}
            </div>
            <div class="search-item-action">
              <button type="button" class="search-view-btn" aria-label="View details for ${escapeHtml(p.name)}">
                View &rarr;
              </button>
            </div>
          </div>
        `;
      }).join('');
      html += `</div>`;
    }

    searchResultsContainer.innerHTML = html;

    // Attach click & keyboard listeners to result cards
    searchResultsContainer.querySelectorAll('.search-item-card').forEach((card) => {
      card.addEventListener('click', () => {
        const pid = card.dataset.id;
        handleProductSelection(pid);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const pid = card.dataset.id;
          handleProductSelection(pid);
        }
      });
    });
  }

  /**
   * Action when a product is clicked or selected from search
   */
  function handleProductSelection(productId) {
    if (!productId) return;
    closeSearchModal();

    // Check if openProductModal is available on current page (both app.js and category.js define it)
    if (typeof openProductModal === 'function') {
      openProductModal(productId);
    } else {
      // If on an alternate page without modal, redirect to homepage product anchor or category page
      const products = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];
      const prod = products.find(p => p.id === productId);
      if (prod && prod.collectionId) {
        window.location.href = `category.html?id=${encodeURIComponent(prod.collectionId)}`;
      } else {
        window.location.href = `index.html#featured`;
      }
    }
  }

  /**
   * Empty State View with direct WhatsApp consultation
   */
  function renderEmptyState(query) {
    const waNumber = (typeof CONFIG !== 'undefined' && CONFIG.whatsappNumber) ? CONFIG.whatsappNumber : '918180879442';
    const waMsg = `Hello Siddhi, I was searching for "${query}" on Bloom&blush and couldn't find an exact match. Could you help create this bespoke creation?`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;

    searchResultsContainer.innerHTML = `
      <div class="search-empty-state">
        <div class="search-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>
        <h3 class="search-empty-title">No creations found for &ldquo;${escapeHtml(query)}&rdquo;</h3>
        <p class="search-empty-desc">
          Every love story and celebration is one-of-a-kind. Siddhi Kokate specializes in 100% custom-crafted garlands, personalized floral arrangements, and bespoke trousseau hampers.
        </p>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="search-empty-wa-btn">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/></svg>
          <span>Chat with Siddhi about &ldquo;${escapeHtml(query)}&rdquo; on WhatsApp &rarr;</span>
        </a>
      </div>
    `;
  }

  /**
   * Default View when query is empty: Shows curated highlights & collections
   */
  function renderDefaultDiscovery(products, collections) {
    const featured = products.slice(0, 4);

    let html = `
      <div class="search-results-meta">
        <span style="font-weight: 600; color: var(--burgundy-deep); font-size: 0.85rem;">CURATED STUDIO CREATIONS</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">Type to search across our full catalog</span>
      </div>
      <div class="search-results-list" role="listbox">
    `;

    html += featured.map((p, idx) => {
      const priceLabel = p.priceFormatted || (p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'Custom Order');
      return `
        <div class="search-item-card" role="option" data-index="${idx}" data-id="${escapeHtml(p.id)}" tabindex="0">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="search-item-img" loading="lazy">
          <div class="search-item-details">
            <span class="search-item-tag">${escapeHtml(p.category || 'Bloom&blush')}</span>
            <h3 class="search-item-name">${escapeHtml(p.name)}</h3>
            <div class="search-item-price">
              <strong>${priceLabel}</strong>
              ${p.priceNote ? `<span style="font-size: 0.74rem; color: var(--text-muted); margin-left: 0.35rem;">${escapeHtml(p.priceNote)}</span>` : ''}
            </div>
          </div>
          <div class="search-item-action">
            <button type="button" class="search-view-btn">View &rarr;</button>
          </div>
        </div>
      `;
    }).join('');

    html += `</div>`;
    searchResultsContainer.innerHTML = html;

    searchResultsContainer.querySelectorAll('.search-item-card').forEach((card) => {
      card.addEventListener('click', () => {
        handleProductSelection(card.dataset.id);
      });
    });
  }

  /**
   * Keyboard Navigation (Up / Down arrows & Enter)
   */
  function handleSearchKeyboard(e) {
    if (!searchResultsContainer) return;
    const cards = searchResultsContainer.querySelectorAll('.search-item-card');
    if (!cards || cards.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex + 1) % cards.length;
      updateActiveCard(cards);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedResultIndex = (selectedResultIndex - 1 + cards.length) % cards.length;
      updateActiveCard(cards);
    } else if (e.key === 'Enter') {
      if (selectedResultIndex >= 0 && selectedResultIndex < cards.length) {
        e.preventDefault();
        const selectedCard = cards[selectedResultIndex];
        const pid = selectedCard.dataset.id;
        handleProductSelection(pid);
      }
    }
  }

  function updateActiveCard(cards) {
    cards.forEach((card, i) => {
      if (i === selectedResultIndex) {
        card.style.borderColor = 'var(--burgundy-rich)';
        card.style.background = 'var(--cream-warm)';
        card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        card.focus();
      } else {
        card.style.borderColor = '';
        card.style.background = '';
      }
    });
  }

  /**
   * Safe text highlighter
   */
  function highlightText(text, query) {
    if (!text) return '';
    if (!query || !query.trim()) return escapeHtml(text);

    const safeText = String(text);
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');

    return safeText.replace(regex, '<mark class="search-highlight">$1</mark>');
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

  // Expose global methods for external triggers
  window.BloomSearch = {
    open: openSearchModal,
    close: closeSearchModal,
    search: performSearch
  };

})();
