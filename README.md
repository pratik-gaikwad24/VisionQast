# VisionQast — Website & Admin CMS

Premium digital studio site: multi-page public website + Firebase-backed admin CMS/CRM.
Live at **[visionqast.com](https://visionqast.com)**.

## Project structure

```
/                       Site root (pages served from here — URLs depend on this)
├── index.html          Home
├── services.html       Services (loaded from Firestore `services`)
├── work.html           Portfolio (loaded from Firestore `projects`)
├── about.html          About
├── blog.html           Blog (Firestore `blogs`)
├── contact.html        Contact form (writes to Firestore `contacts`)
├── privacy.html · terms.html · 404.html
├── favicon.ico         Orange brand mark (browsers request this at root)
├── manifest.json       PWA manifest (icons under assets/icons/)
├── robots.txt · sitemap.xml · sw.js · .htaccess
│
├── admin/              Admin panel (Firebase Auth, role-gated)
│   ├── index.html      Login
│   ├── dashboard.html · projects.html · services.html · blog.html
│   ├── testimonials.html · leads.html · settings.html
│   └── seed.html       One-click re-seed of the 12 real portfolio projects
│
├── assets/
│   ├── css/            style.css (public) · admin.css (admin)
│   ├── js/
│   │   ├── firebase-config.js   Firebase init + shared helpers (escapeHtml, safeUrl…)
│   │   ├── layout.js            Shared navbar/footer/chrome injected on every page
│   │   ├── script.js            Public-site loaders (Firestore with static fallbacks)
│   │   └── admin.js             Admin shared logic (auth guard, CRUD helpers)
│   ├── images/         logo.png (full logo) · logo-mark.png (orange mark, transparent)
│   └── icons/          favicon PNGs, apple-touch-icon, PWA icons, browserconfig.xml
│
├── firebase.json       Hosting headers/rewrites + Firestore config
├── firestore.rules     Security rules (public read of published content; admin CRUD)
└── firestore.indexes.json
```

## Content model

Public pages read Firestore first and fall back to static content in
`assets/js/script.js` when a collection is empty. Manage real content via `/admin/`:
`projects`, `services`, `blogs`, `testimonials` (status-gated), `contacts` (leads).

## Icons

All icons are generated from the orange mark in `assets/images/logo.png`
(favicon.ico at root + PNG set in `assets/icons/`, referenced by every page
and `manifest.json`).
