/* ================================================================
   VisionQast — Firebase Configuration
   ================================================================
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Create or open your project
   3. Project Settings → Your apps → Add app (Web)
   4. Copy your config values below
   5. In Firebase Console → Authentication → Get Started → Enable Email/Password
   6. In Firebase Console → Firestore Database → Create database (production mode)
   7. Deploy firestore.rules from project root
   ================================================================ */
/* Your web app's Firebase configuration.
   NOTE: This project uses the Firebase "compat" SDKs loaded via <script> tags
   (the global `firebase` object) — NOT the ES-module `import` style. Do not add
   `import ... from "firebase/app"` here; just keep this plain config object. */
const firebaseConfig = {
  apiKey:            "AIzaSyCKPC5FMm9zdozOFxT7h2xf5_8cBJGnOmE",
  authDomain:        "visionqast-bae12.firebaseapp.com",
  projectId:         "visionqast-bae12",
  storageBucket:     "visionqast-bae12.firebasestorage.app",
  messagingSenderId: "926039731146",
  appId:             "1:926039731146:web:f4dc284855d47e2f50fd33"
};

/* Detect whether real credentials have been filled in.
   While the placeholders are still present, we DO NOT initialize Firestore —
   otherwise queries hang forever against an invalid project and the public
   site gets stuck on "Loading…". In that state the site renders its built-in
   demo content instead. Replace the values above to go live. */
const FIREBASE_CONFIGURED =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'YOUR_PROJECT_ID';

/* Initialize Firebase (guard against double-init from HMR or includes) */
var db = null;
var auth = null;

function initFirebaseApp() {
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db   = firebase.firestore();
  auth = firebase.auth ? firebase.auth() : null;

  /* Enable offline persistence so admin works with intermittent connections */
  if (window.location.pathname.startsWith('/admin')) {
    db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
  }
  return db;
}

/* window.dbReady resolves to the Firestore instance (or null when unavailable).
   Admin pages include the SDK <script> tags, so Firebase initialises right away.
   Public pages don't: the SDK (~300 KB) is fetched in the background so it never
   blocks the first render. */
const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = false;
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

if (!FIREBASE_CONFIGURED) {
  window.dbReady = Promise.resolve(null);
  console.info('[VisionQast] Firebase not configured yet — showing built-in demo content. Add your credentials in assets/js/firebase-config.js to go live.');
} else if (typeof firebase !== 'undefined' && firebase.firestore) {
  window.dbReady = Promise.resolve(initFirebaseApp());
} else {
  window.dbReady = loadScript(FIREBASE_SDK + 'firebase-app-compat.js')
    .then(() => loadScript(FIREBASE_SDK + 'firebase-firestore-compat.js'))
    .then(initFirebaseApp)
    .catch(() => null);
}

/* ── Collection names ────────────────────────────────────────── */
const COLLECTIONS = {
  projects:     'projects',
  services:     'services',
  blogs:        'blogs',
  testimonials: 'testimonials',
  contacts:     'contacts',
  admins:       'admins',
  settings:     'settings',
};

/* ── Image compression helper (used in admin) ────────────────── */
async function compressImage(file, maxWidth = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg', quality);
        /* Warn if > 900 KB (Firestore doc limit is 1 MB) */
        const kb = Math.round((dataURL.length * 3) / 4 / 1024);
        if (kb > 900) {
          resolve(canvas.toDataURL('image/jpeg', 0.5)); /* force lower quality */
        } else {
          resolve(dataURL);
        }
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

/* ── HTML escaping (XSS protection) ──────────────────────────────
   Use for ANY value that originates from user input or Firestore when
   inserting it into innerHTML — both element text and double-quoted
   attribute values. Prevents stored XSS (e.g. a malicious contact-form
   submission executing script in the admin's session). */
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Sanitize a URL for safe use in href/src — blocks javascript:, data:
   (except images), vbscript: and similar script-bearing schemes. */
function safeUrl(value) {
  const url = String(value || '').trim();
  if (!url) return '';
  const lower = url.replace(/[\x00-\x1f]/g, '').toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return '';
  if (lower.startsWith('data:') && !lower.startsWith('data:image/')) return '';
  return escapeHtml(url);
}

/* ── Slug generator ─────────────────────────────────────────── */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

/* ── Timestamp formatter ─────────────────────────────────────── */
function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Time ago ─────────────────────────────────────────────────── */
function timeAgo(ts) {
  if (!ts) return '';
  const d  = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(ts);
}
