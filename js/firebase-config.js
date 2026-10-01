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
let firebaseStorage = null;
let firebaseAnalytics = null;

try {
  if (typeof firebase !== 'undefined') {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    if (typeof firebase.firestore === 'function') {
      firestoreDb = firebase.firestore();
    }
    if (typeof firebase.storage === 'function') {
      firebaseStorage = firebase.storage();
    }
    if (typeof firebase.analytics === 'function') {
      firebaseAnalytics = firebase.analytics();
    }
    console.log('[Firebase] Successfully initialized Firebase Services (Firestore, Storage, Analytics) for Bloom&blush (blushnbloomm-4c7b9)');
  }
} catch (err) {
  console.warn('[Firebase] Initialization error or already initialized:', err);
}
