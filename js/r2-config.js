/**
 * ===================================================================
 * Bloom&blush - Cloudflare R2 Global Configuration Bridge
 * ===================================================================
 */

const CLOUDFLARE_R2_CONFIG = {
  accountId: 'fe55d9a781822b063a8e6a697ae6136b',
  defaultBucket: 'blushnbloomm-media',
  publicDomain: 'https://pub-91be6110e6d34a3bafea471d064d1b49.r2.dev'
};

if (typeof window !== 'undefined') {
  window.CLOUDFLARE_R2_CONFIG = CLOUDFLARE_R2_CONFIG;
}
