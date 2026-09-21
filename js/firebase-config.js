/**
 * ===================================================================
 * Bloom&blush - Central Firebase Configuration & Initialization
 * Project: blushnbloomm-4c7b9
 * ===================================================================
 */

const firebaseConfig = {
  apiKey: "AIzaSyA6en4qQh2MyxwQ_0x-6YlHZiAedUGfgXI",
  authDomain: "blushnbloomm-4c7b9.firebaseapp.com",
  projectId: "blushnbloomm-4c7b9",
  storageBucket: "blushnbloomm-4c7b9.firebasestorage.app",
  messagingSenderId: "716561085361",
  appId: "1:716561085361:web:5794977f685fa090ae0390",
  measurementId: "G-24GFKD25EN"
};

// Initialize Firebase (Compat SDK)
let firebaseApp = null;
let firestoreDb = null;

try {
  if (typeof firebase !== 'undefined') {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firestoreDb = firebase.firestore();
    if (typeof firebase.analytics === 'function') {
      firebase.analytics();
    }
    console.log('[Firebase] Successfully initialized Firestore for Bloom&blush');
  }
} catch (err) {
  console.warn('[Firebase] Initialization error or already initialized:', err);
}
