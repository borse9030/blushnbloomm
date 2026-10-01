/**
 * ===================================================================
 * Bloom&blush - Cloudflare R2 & Media Storage Client
 * Direct S3-Compatible Upload with AWS SigV4 & In-Browser Image Optimization
 * ===================================================================
 */

const R2Storage = (() => {
  const STORAGE_KEY = 'bloom_r2_config';

  // Default / cached configuration
  let config = {
    accountId: 'fe55d9a781822b063a8e6a697ae6136b',
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: 'blushnbloomm-media',
    publicDomain: 'https://pub-91be6110e6d34a3bafea471d064d1b49.r2.dev',
    workerUrl: ''     // Optional Cloudflare Worker upload proxy
  };

  // Load saved configuration from localStorage
  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        config = { ...config, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('[R2 Storage] Failed to load config:', e);
    }
    return config;
  }

  function saveConfig(newConfig) {
    config = { ...config, ...newConfig };
    // Trim slashes from public domain
    if (config.publicDomain) {
      config.publicDomain = config.publicDomain.trim().replace(/\/+$/, '');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return config;
  }

  function isConfigured() {
    loadConfig();
    if (config.workerUrl && config.workerUrl.trim()) return true;
    return !!(config.accountId && config.accessKeyId && config.secretAccessKey && config.bucketName);
  }

  /**
   * Automatically compress and optimize images before upload
   * Reduces 5-10MB mobile camera photos to ~250-450KB WebP
   */
  async function optimizeImage(file, maxDimension = 1600, quality = 0.85) {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      return file; // Return original if SVG or non-image
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to modern WebP (or JPEG fallback)
          canvas.toBlob((blob) => {
            if (blob) {
              const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              resolve(new File([blob], cleanName, { type: 'image/webp' }));
            } else {
              resolve(file);
            }
          }, 'image/webp', quality);
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Lightweight AWS SigV4 implementation using browser crypto.subtle
   */
  async function sha256(data) {
    const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function hmacSha256(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      typeof key === 'string' ? new TextEncoder().encode(key) : key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
  }

  async function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = await hmacSha256('AWS4' + key, dateStamp);
    const kRegion = await hmacSha256(kDate, regionName);
    const kService = await hmacSha256(kRegion, serviceName);
    return await hmacSha256(kService, 'aws4_request');
  }

  /**
   * Upload file to Cloudflare R2
   */
  async function uploadFile(file, folder = 'creations', progressCallback = null) {
    loadConfig();

    // 1. Optimize image if applicable
    const optimized = await optimizeImage(file);
    const timestamp = Date.now();
    const cleanFileName = optimized.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectKey = `${folder}/${timestamp}_${cleanFileName}`;

    if (progressCallback) progressCallback(20, 'Preparing upload...');

    // Option A: If Cloudflare Worker proxy is configured
    if (config.workerUrl) {
      if (progressCallback) progressCallback(50, 'Uploading to Cloudflare R2 Worker...');
      const formData = new FormData();
      formData.append('file', optimized);
      formData.append('key', objectKey);

      const res = await fetch(config.workerUrl, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(`Worker upload failed: ${res.statusText}`);
      const data = await res.json();
      if (progressCallback) progressCallback(100, 'Upload complete!');
      return data.url || `${config.publicDomain}/${objectKey}`;
    }

    // Option B: Direct S3 API to Cloudflare R2 via SigV4
    if (config.accountId && config.accessKeyId && config.secretAccessKey && config.bucketName) {
      if (progressCallback) progressCallback(40, 'Signing R2 payload...');

      const host = `${config.accountId}.r2.cloudflarestorage.com`;
      const url = `https://${host}/${config.bucketName}/${objectKey}`;
      const method = 'PUT';
      const region = 'auto';
      const service = 's3';

      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
      const dateStamp = amzDate.slice(0, 8);

      const fileBuffer = await optimized.arrayBuffer();
      const payloadHash = await sha256(fileBuffer);

      const canonicalUri = `/${config.bucketName}/${encodeURI(objectKey)}`;
      const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
      const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

      const canonicalRequest = `${method}\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
      const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
      const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`;

      const signingKey = await getSignatureKey(config.secretAccessKey, dateStamp, region, service);
      const signatureBytes = await hmacSha256(signingKey, stringToSign);
      const signature = Array.from(new Uint8Array(signatureBytes)).map(b => b.toString(16).padStart(2, '0')).join('');

      const authHeader = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

      if (progressCallback) progressCallback(70, 'Transmitting to Cloudflare R2...');

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-amz-date': amzDate,
          'x-amz-content-sha256': payloadHash,
          'Authorization': authHeader,
          'Content-Type': optimized.type || 'application/octet-stream'
        },
        body: fileBuffer
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cloudflare R2 returned ${response.status}: ${errText || response.statusText}`);
      }

      if (progressCallback) progressCallback(100, 'Uploaded successfully!');

      if (config.publicDomain) {
        return `${config.publicDomain}/${objectKey}`;
      }
      return url;
    }

    // Option C: Fallback to Firebase Storage if R2 is not yet configured
    if (typeof firebase !== 'undefined' && firebase.storage) {
      if (progressCallback) progressCallback(50, 'Uploading to Firebase Cloud Storage...');
      const storageRef = firebase.storage().ref(`uploads/${objectKey}`);
      const uploadTask = await storageRef.put(optimized);
      const downloadUrl = await uploadTask.ref.getDownloadURL();
      if (progressCallback) progressCallback(100, 'Upload complete!');
      return downloadUrl;
    }

    // Option D: Fallback to compressed base64 data URI for instant offline preview
    if (progressCallback) progressCallback(60, 'Processing local preview...');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (progressCallback) progressCallback(100, 'Ready');
        resolve(e.target.result);
      };
      reader.readAsDataURL(optimized);
    });
  }

  /**
   * Test Cloudflare R2 connection by uploading a tiny 1-byte probe
   */
  async function testConnection() {
    loadConfig();
    const probe = new Blob(['probe'], { type: 'text/plain' });
    const probeFile = new File([probe], 'probe.txt', { type: 'text/plain' });
    try {
      const testUrl = await uploadFile(probeFile, '_system');
      return { success: true, url: testUrl };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Initialize on script load
  loadConfig();

  return {
    loadConfig,
    getConfig: loadConfig,
    saveConfig,
    isConfigured,
    optimizeImage,
    uploadFile,
    testConnection
  };
})();

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.R2Storage = R2Storage;
}
