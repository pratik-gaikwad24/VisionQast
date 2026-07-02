/* ================================================================
   VisionQast — Shared Layout (navbar + footer + chrome)
   Injected on every public page so markup stays consistent.
   ================================================================ */

const NAV_ITEMS = [
  { label: 'Home',     href: '/index.html',    match: ['/', '/index.html'] },
  { label: 'Services', href: '/services.html', match: ['/services.html'] },
  { label: 'Work',     href: '/work.html',     match: ['/work.html'] },
  { label: 'About',    href: '/about.html',    match: ['/about.html'] },
  { label: 'Blog',     href: '/blog.html',     match: ['/blog.html'] },
  { label: 'Contact',  href: '/contact.html',  match: ['/contact.html'] },
];

const BRAND_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" fill-opacity="0.95"/>
  <path d="M2 17l10 5 10-5" stroke="white" stroke-width="2" stroke-opacity="0.55"/>
  <path d="M2 12l10 5 10-5" stroke="white" stroke-width="2"/>
</svg>`;

function currentPath() {
  let p = window.location.pathname;
  if (p.endsWith('/')) p += 'index.html';
  return p;
}

function isActive(item) {
  const p = currentPath();
  return item.match.some(m => p === m || (m !== '/' && p.endsWith(m)));
}

/* ── Navbar ─────────────────────────────────────────────────── */
function buildNav() {
  const links = NAV_ITEMS.map(i =>
    `<a href="${i.href}" class="${isActive(i) ? 'active' : ''}">${i.label}</a>`
  ).join('');

  return `
  <header id="nav">
    <div class="nav-in">
      <a href="/index.html" class="brand" aria-label="VisionQast home">
        <span class="brand-mark">${BRAND_SVG}</span>
        Vision<span class="gradient-text">Qast</span>
      </a>
      <nav class="nav-links" aria-label="Primary">${links}</nav>
      <div class="nav-right">
        <a href="/contact.html" class="nav-cta">Start a Project →</a>
        <button class="burger" id="burger" aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </header>

  <div class="m-menu" id="mMenu" role="dialog" aria-modal="true">
    <button class="m-close" id="mClose" aria-label="Close menu">✕</button>
    ${NAV_ITEMS.map(i => `<a href="${i.href}" class="${isActive(i) ? 'active' : ''}">${i.label}</a>`).join('')}
    <a href="/contact.html" class="btn btn-primary btn-lg" style="margin-top:1.2rem">Start a Project →</a>
  </div>`;
}

/* ── Footer ─────────────────────────────────────────────────── */
function buildFooter() {
  const year = new Date().getFullYear();
  return `
  <footer id="footer">
    <div class="container">
      <div class="footer-top">
        <div>
          <div class="footer-brand">
            <span class="brand-mark" style="width:30px;height:30px;border-radius:9px">${BRAND_SVG}</span>
            Vision<span class="gradient-text">Qast</span>
          </div>
          <p class="footer-desc">Transforming ideas into powerful digital experiences through innovative engineering and creative excellence. Proudly built in Pune, India 🇮🇳</p>
          <div class="footer-social">
            <a href="https://linkedin.com/company/visionqast" target="_blank" rel="noopener" class="fsoc" aria-label="LinkedIn">in</a>
            <a href="https://github.com/visionqast" target="_blank" rel="noopener" class="fsoc" aria-label="GitHub">GH</a>
            <a href="https://twitter.com/visionqast" target="_blank" rel="noopener" class="fsoc" aria-label="Twitter">X</a>
            <a href="https://instagram.com/visionqast" target="_blank" rel="noopener" class="fsoc" aria-label="Instagram">IG</a>
          </div>
        </div>

        <div class="footer-col">
          <h5>Company</h5>
          <a href="/about.html">About Us</a>
          <a href="/work.html">Our Work</a>
          <a href="/services.html">Services</a>
          <a href="/blog.html">Blog</a>
          <a href="/contact.html">Contact</a>
        </div>

        <div class="footer-col">
          <h5>Services</h5>
          <a href="/services.html">Web Development</a>
          <a href="/services.html">Software Development</a>
          <a href="/services.html">Digital Marketing</a>
          <a href="/services.html">Meta Ads</a>
          <a href="/services.html">SEO & Maintenance</a>
        </div>

        <div class="footer-col footer-news">
          <h5>Stay Updated</h5>
          <p>Weekly insights on technology, product, and startup growth. No spam.</p>
          <form class="news-form" id="newsletter-form" novalidate>
            <input type="email" class="news-input" placeholder="your@email.com" aria-label="Email" autocomplete="email" />
            <button type="submit" class="news-btn">Subscribe →</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© ${year} VisionQast. All rights reserved.</span>
        <div style="display:flex;gap:1.5rem;align-items:center">
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="/admin/" style="opacity:0.5">Admin</a>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ── Chrome (loader, cursor, back-to-top) ───────────────────── */
function buildChrome() {
  return `
  <div id="loader"><div class="loader-mark">Vision<span class="gradient-text">Qast</span></div><div class="loader-bar"><div class="loader-fill"></div></div></div>
  <div id="cursor" aria-hidden="true"></div>
  <button id="totop" aria-label="Back to top">↑</button>`;
}

/* ── Mount ──────────────────────────────────────────────────── */
(function mountLayout() {
  /* Chrome first (loader needs to paint immediately) */
  document.body.insertAdjacentHTML('afterbegin', buildChrome());

  const navMount = document.getElementById('site-nav');
  if (navMount) navMount.innerHTML = buildNav();

  const footMount = document.getElementById('site-footer');
  if (footMount) footMount.innerHTML = buildFooter();

  wireLayout();
})();

function wireLayout() {
  /* Loader — hide on load, but also a hard cap so a slow/blocked CDN
     resource can never trap the page behind the full-screen overlay. */
  const hideLoader = () => document.getElementById('loader')?.classList.add('hidden');
  window.addEventListener('load', () => setTimeout(hideLoader, 1100));
  setTimeout(hideLoader, 2800);

  /* Navbar scroll */
  const nav = document.getElementById('nav');
  const top = document.getElementById('totop');
  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 20);
    top?.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  top?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Mobile menu */
  const menu = document.getElementById('mMenu');
  document.getElementById('burger')?.addEventListener('click', () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; });
  document.getElementById('mClose')?.addEventListener('click', () => { menu.classList.remove('open'); document.body.style.overflow = ''; });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); document.body.style.overflow = ''; }));

  /* Cursor (desktop) */
  if (window.matchMedia('(pointer:fine)').matches) {
    const c = document.getElementById('cursor');
    window.addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; });
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => c.style.transform = 'translate(-50%,-50%) scale(2.2)');
      el.addEventListener('mouseleave', () => c.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  } else {
    document.getElementById('cursor')?.remove();
  }

  /* Newsletter */
  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const inp = e.target.querySelector('input');
    const btn = e.target.querySelector('button');
    if (!inp.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) return;
    if (typeof db !== 'undefined' && db) {
      db.collection('newsletter').add({ email: inp.value.trim(), createdAt: firebase.firestore.FieldValue.serverTimestamp() }).catch(() => {});
    }
    btn.textContent = '✓ Subscribed!';
    inp.value = '';
    setTimeout(() => btn.textContent = 'Subscribe →', 3000);
  });

  /* Scroll reveal */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  window.__revealObs = obs; /* expose so dynamic content can register */

  /* Failsafe: never let revealed content stay invisible. If anything is still
     hidden a few seconds after load (observer edge cases, tall viewports,
     async-injected content), force it visible. */
  setTimeout(() => {
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(el => el.classList.add('in'));
  }, 2600);
}
