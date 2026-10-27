/* ================================================================
   VisionQast — Shared Layout (navbar + footer + chrome)
   Injected on every public page so markup stays consistent.
   ================================================================ */

const NAV_ITEMS = [
  { label: 'Home',     href: '/index.html',    match: ['/', '/index.html'] },
  { label: 'Services', href: '/services.html', match: ['/services.html'] },
  { label: 'Portfolio', href: '/work.html',     match: ['/work.html'] },
  { label: 'About',    href: '/about.html',    match: ['/about.html'] },
  { label: 'Blog',     href: '/blog.html',     match: ['/blog.html'] },
  { label: 'Contact',  href: '/contact.html',  match: ['/contact.html'] },
];

/* Single source for the service catalogue shown in the nav mega-menu,
   mobile menu, footer and contact form. Detail copy lives in services.html
   under the matching #slug anchors. */
const SERVICE_GROUPS = [
  { name: 'Build', items: [
    { slug: 'web-development',      icon: '🌐', title: 'Website Development' },
    { slug: 'ui-ux-design',         icon: '🎨', title: 'Website Design (UI/UX)' },
    { slug: 'software-development', icon: '💻', title: 'Custom Software Development' },
    { slug: 'mobile-apps',          icon: '📱', title: 'Mobile App Development' },
    { slug: 'ecommerce',            icon: '🛒', title: 'E-Commerce Development' },
  ]},
  { name: 'Grow', items: [
    { slug: 'digital-marketing',    icon: '📣', title: 'Digital & Social Media Marketing' },
    { slug: 'meta-ads',             icon: '🎯', title: 'Meta Ads (Facebook & Instagram)' },
    { slug: 'google-ads',           icon: '💰', title: 'Google Ads (PPC)' },
    { slug: 'linkedin',             icon: '💼', title: 'LinkedIn Management & Ads' },
  ]},
  { name: 'Get Found', items: [
    { slug: 'seo',                  icon: '🔍', title: 'SEO (Search Engine Optimisation)' },
    { slug: 'aeo',                  icon: '💬', title: 'AEO (Answer Engine Optimisation)' },
    { slug: 'geo',                  icon: '🤖', title: 'GEO (Generative Engine Optimisation)' },
    { slug: 'local-seo',            icon: '📍', title: 'Local SEO & Google Business Profile' },
  ]},
  { name: 'Support', items: [
    { slug: 'branding',             icon: '✏️', title: 'Branding & Graphic Design' },
    { slug: 'maintenance',          icon: '🛠️', title: 'Website Maintenance & Hosting' },
  ]},
];

const CONTACT = { phone: '+917249395515', whatsapp: '917249395515' };

const BRAND_LOGO = `<img class="brand-logo-full" src="/assets/images/logo.png" alt="VisionQast" width="176" height="48" />`;

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
function buildMega() {
  return `
    <div class="mega">
      <div class="mega-in">
        ${SERVICE_GROUPS.map(g => `
          <div class="mega-col">
            <h6>${g.name}</h6>
            ${g.items.map(it => `<a href="/services.html#${it.slug}"><span class="mega-ic">${it.icon}</span>${it.title}</a>`).join('')}
          </div>`).join('')}
      </div>
      <div class="mega-foot">
        <span>Not sure where to start? Get a free growth audit.</span>
        <a href="/contact.html">Book a free call →</a>
      </div>
    </div>`;
}

function buildNav() {
  const links = NAV_ITEMS.map(i => i.label === 'Services'
    ? `<div class="nav-drop"><a href="${i.href}" class="${isActive(i) ? 'active' : ''}" aria-haspopup="true">${i.label} <span class="caret">▾</span></a>${buildMega()}</div>`
    : `<a href="${i.href}" class="${isActive(i) ? 'active' : ''}">${i.label}</a>`
  ).join('');

  return `
  <header id="nav">
    <div class="nav-in">
      <a href="/index.html" class="brand" aria-label="VisionQast home">
        ${BRAND_LOGO}
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
    ${NAV_ITEMS.map(i => i.label === 'Services'
      ? `<details class="m-svc"><summary>${i.label}</summary><div class="m-svc-list">${SERVICE_GROUPS.flatMap(g => g.items).map(it => `<a href="/services.html#${it.slug}">${it.icon} ${it.title}</a>`).join('')}<a href="/services.html" class="m-svc-all">All services →</a></div></details>`
      : `<a href="${i.href}" class="${isActive(i) ? 'active' : ''}">${i.label}</a>`).join('')}
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
            <img class="brand-logo-full brand-logo-footer" src="/assets/images/logo-light.png" alt="VisionQast" width="168" height="46" />
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
          <a href="/work.html">Portfolio</a>
          <a href="/services.html">Services</a>
          <a href="/blog.html">Blog</a>
          <a href="/contact.html">Contact</a>
        </div>

        <div class="footer-col">
          <h5>Build</h5>
          ${SERVICE_GROUPS[0].items.map(it => `<a href="/services.html#${it.slug}">${it.title}</a>`).join('')}
        </div>

        <div class="footer-col">
          <h5>Grow &amp; Get Found</h5>
          ${[...SERVICE_GROUPS[1].items, ...SERVICE_GROUPS[2].items].map(it => `<a href="/services.html#${it.slug}">${it.title.replace(/ \(.*\)$/, '')}</a>`).join('')}
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

/* ── Chrome (back-to-top, WhatsApp/call) ─────────────────────────────── */
function buildChrome() {
  return `
  <button id="totop" aria-label="Back to top">↑</button>
  <div class="float-cta">
    <a href="https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hi VisionQast, I would like to discuss a project.')}" target="_blank" rel="noopener" class="fc-wa" aria-label="Chat on WhatsApp">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zM20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.4z"/></svg>
    </a>
    <a href="tel:${CONTACT.phone}" class="fc-call" aria-label="Call us">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>
    </a>
  </div>`;
}

/* ── Mount ──────────────────────────────────────────────────── */
(function mountLayout() {
  /* Chrome first */
  document.body.insertAdjacentHTML('afterbegin', buildChrome());

  const navMount = document.getElementById('site-nav');
  if (navMount) navMount.innerHTML = buildNav();

  const footMount = document.getElementById('site-footer');
  if (footMount) footMount.innerHTML = buildFooter();

  wireLayout();
  fillServiceSelect();
})();

/* Contact form service list mirrors the catalogue; ?service=<slug> preselects */
function fillServiceSelect() {
  const want = new URLSearchParams(location.search).get('service');
  const hit = SERVICE_GROUPS.flatMap(g => g.items).find(it => it.slug === want);
  document.querySelectorAll('#cf-service, [data-service-select]').forEach(sel => {
    sel.innerHTML = '<option value="">Select a service</option>' +
      SERVICE_GROUPS.map(g => `<optgroup label="${g.name}">${g.items.map(it => `<option value="${it.title}">${it.title}</option>`).join('')}</optgroup>`).join('') +
      '<option value="Multiple / Not sure">Multiple / Not sure yet</option>';
    if (hit) sel.value = hit.title;
  });
}

function wireLayout() {

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

  /* Newsletter (footer + blog) → WhatsApp + Firestore `newsletter` */
  document.querySelectorAll('#newsletter-form, #newsletter-cta').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const inp = form.querySelector('input');
    const btn = form.querySelector('button');
    const email = inp.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { inp.focus(); return; }
    /* Opened synchronously inside the submit handler, or popup blockers stop it */
    const text = `*New newsletter subscriber from VisionQast website*\n\n*Email:* ${email}\n*Page:* ${location.pathname}`;
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
    const w = window.open(url, '_blank');
    if (w) w.opener = null; else window.location.href = url;
    window.dbReady?.then(d => d && d.collection('newsletter').add({ email, createdAt: firebase.firestore.FieldValue.serverTimestamp() })).catch(() => {});
    const label = btn.textContent;
    btn.textContent = '✓ Subscribed!';
    inp.value = '';
    setTimeout(() => btn.textContent = label, 3000);
  }));

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
