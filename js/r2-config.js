/**
 * ===================================================================
 * Bloom&blush - Cloudflare R2 Global Configuration Bridge
 * ===================================================================
 */

const CLOUDFLARE_R2_CONFIG = {
  defaultBucket: 'blushnbloomm-media',
  publicDomain: 'https://media.blushnbloomm.in'
};

if (typeof window !== 'undefined') {
  window.CLOUDFLARE_R2_CONFIG = CLOUDFLARE_R2_CONFIG;
}
