/* ================================================================
   VisionQast — Public site interactions + Firebase content
   Page-aware: every loader is guarded by element presence,
   so this single file works across all pages.
   ================================================================ */

/* Gradients reused for fallback icons / placeholders */
const GRADS = [
  'linear-gradient(135deg,#F85000,#FF7A2F)',
  'linear-gradient(135deg,#06B6D4,#F85000)',
  'linear-gradient(135deg,#C2410C,#F43F5E)',
  'linear-gradient(135deg,#F59E0B,#F43F5E)',
  'linear-gradient(135deg,#10B981,#06B6D4)',
  'linear-gradient(135deg,#FB923C,#C2410C)',
];

function reveal(scope) {
  const obs = window.__revealObs;
  (scope || document).querySelectorAll('[data-reveal]').forEach(el => obs && obs.observe(el));
}

/* ── Typing animation (home hero) ───────────────────────────── */
(function typing() {
  const el = document.getElementById('type');
  if (!el) return;
  const words = ['Websites', 'Custom Software', 'Meta Ad Campaigns', 'Google Ads', 'LinkedIn Growth', 'Google Rankings', 'AI Search Visibility'];
  let w = 0, c = 0, del = false;
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    if (!del) {
      if (c < word.length) { c++; setTimeout(tick, 75); }
      else { del = true; setTimeout(tick, 1600); }
    } else {
      if (c > 0) { c--; setTimeout(tick, 35); }
      else { del = false; w = (w + 1) % words.length; setTimeout(tick, 280); }
    }
  })();
})();

/* ── Animated counters ──────────────────────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1700, start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (Math.round(target * ease)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
    counterObs.unobserve(el);
  });
}, { threshold: 0.4 });
function registerCounters(scope) {
  (scope || document).querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));
}

/* ── Services ───────────────────────────────────────────────── */
async function loadServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  let items = [];
  if (typeof db !== 'undefined' && db) {
    try {
      let snap;
      try { snap = await db.collection('services').where('status', '==', 'active').orderBy('order').get(); }
      catch { snap = await db.collection('services').where('status', '==', 'active').get(); }
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) { /* fall back */ }
  }
  if (!items.length) items = STATIC_SERVICES;

  const limit = grid.dataset.limit ? parseInt(grid.dataset.limit) : items.length;
  grid.innerHTML = items.slice(0, limit).map((s, i) => `
    <article class="svc-card" data-reveal data-delay="${(i % 3) + 1}">
      <div class="svc-ic" style="background:${escapeHtml(s.gradient || GRADS[i % GRADS.length])}">${escapeHtml(s.icon || '⚙️')}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.description)}</p>
      <div class="svc-tags">${(s.features || []).slice(0, 4).map(f => `<span class="svc-tag">${escapeHtml(f)}</span>`).join('')}</div>
    </article>`).join('');
  reveal(grid);
}

const STATIC_SERVICES = [
  { icon:'🌐', title:'Web Development',                 gradient:'linear-gradient(135deg,#F85000,#FF7A2F)', description:'Fast, modern, mobile-first websites and web applications — business sites, e-commerce, portals, and custom CMS builds that convert visitors into customers.', features:['Business Websites','E-Commerce','Custom CMS','Responsive'] },
  { icon:'💻', title:'Software Development',            gradient:'linear-gradient(135deg,#06B6D4,#F85000)', description:'Custom software built around your workflow — admin dashboards, CRM & booking systems, billing tools, and internal apps that remove manual work.', features:['Custom Software','CRM & Dashboards','Booking Systems','APIs'] },
  { icon:'📈', title:'Digital Marketing',               gradient:'linear-gradient(135deg,#C2410C,#F43F5E)', description:'Complete digital marketing that grows your brand — social media management, content strategy, campaigns, and analytics-driven growth.', features:['Social Media','Content Strategy','Campaigns','Analytics'] },
  { icon:'🎯', title:'Meta Ads (Facebook & Instagram)', gradient:'linear-gradient(135deg,#F59E0B,#F43F5E)', description:'High-converting Meta ad campaigns — precise audience targeting, creatives, A/B testing, and continuous optimisation for maximum return on ad spend.', features:['Facebook Ads','Instagram Ads','Retargeting','ROAS Focus'] },
  { icon:'🔍', title:'SEO & Google Visibility',         gradient:'linear-gradient(135deg,#10B981,#06B6D4)', description:'Get found on Google — technical SEO, on-page optimisation, local SEO, and Google Business Profile management that brings steady organic enquiries.', features:['On-Page SEO','Local SEO','Google Business','Schema'] },
  { icon:'🛠️', title:'Website Maintenance & Support',   gradient:'linear-gradient(135deg,#FB923C,#C2410C)', description:'Keep your website fast, secure, and up to date — hosting management, content updates, backups, security, and priority support when you need it.', features:['Hosting','Updates','Security','Priority Support'] },
];

/* ── Portfolio ──────────────────────────────────────────────── */
/* Real client projects live in STATIC_WORK (always shown). Anything else
   published from /admin/ is appended; duplicates are matched by title or
   domain so a project never shows twice. */
let WORK_ITEMS = [];
const normTitle = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

async function loadWork() {
  const grid = document.getElementById('work-grid');
  if (!grid) return;

  let extra = [];
  if (typeof db !== 'undefined' && db) {
    try {
      const snap = await db.collection('projects').where('status', '==', 'published').get();
      extra = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) { /* static only */ }
  }
  const titles = new Set(STATIC_WORK.map(p => normTitle(p.title)));
  const hosts = new Set(STATIC_WORK.map(p => hostOf(p.demoURL)));
  hosts.add('visionqast.com'); /* our own site is not a client project */
  extra = extra.filter(p => !titles.has(normTitle(p.title)) && !hosts.has(hostOf(p.demoURL)));

  const items = [...STATIC_WORK, ...extra];
  items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  WORK_ITEMS = items;

  const limit = grid.dataset.limit ? parseInt(grid.dataset.limit) : items.length;
  renderWork(items.slice(0, limit));
  wireFilters();
}

function renderWork(items) {
  const grid = document.getElementById('work-grid');
  grid.innerHTML = items.map((p, i) => {
    const url = p.demoURL ? safeUrl(p.demoURL) : '';
    const tag = url ? 'a' : 'article';
    const linkAttrs = url ? ` href="${url}" target="_blank" rel="noopener" aria-label="Visit ${escapeHtml(p.title)} website"` : '';
    return `
    <${tag} class="work-card" data-cat="${escapeHtml((p.category || '').toLowerCase())}"${linkAttrs} data-reveal data-delay="${(i % 3) + 1}">
      <div class="work-img">
        ${p.imageURL ? `<img src="${safeUrl(p.imageURL)}" alt="${escapeHtml(p.title)} website screenshot" loading="lazy" width="880" height="550">`
          : `<div class="work-fallback" style="background:${GRADS[i % GRADS.length]}">${escapeHtml((p.title || '?')[0])}</div>`}
        ${p.category ? `<span class="work-cat">${escapeHtml(p.category)}</span>` : ''}
        ${p.featured ? `<span class="work-star">★ Featured</span>` : ''}
        ${url ? `<span class="work-visit">Visit live site ↗</span>` : ''}
      </div>
      <div class="work-body">
        ${p.location ? `<div class="work-loc">📍 ${escapeHtml(p.location)}</div>` : ''}
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.shortDescription || (p.description || '').slice(0, 110))}</p>
        <div class="work-tech">${(p.technologies || []).slice(0, 4).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        ${url ? `<div class="work-links"><span class="work-link">🌐 ${escapeHtml(hostOf(p.demoURL))} ↗</span></div>` : ''}
      </div>
    </${tag}>`;
  }).join('');
  reveal(grid);
}

function wireFilters() {
  /* Portfolio filters only — service filters carry data-filter-scope */
  const filters = document.querySelectorAll('.filters:not([data-filter-scope]) .filter');
  if (!filters.length) return;
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => {
      card.style.display = (f === 'all' || card.dataset.cat === f.toLowerCase()) ? '' : 'none';
    });
  }));
}

/* Kept in sync with REAL_PROJECTS in /admin/seed.html */
const W = '/assets/images/work/';
const STATIC_WORK = [
  { title:'The Family Dental Clinic', category:'Healthcare', featured:true, location:'Ravet, Pune',
    shortDescription:'SEO-optimised dental clinic website for Dr. Swapnil Bade: dental implants & painless RCT, Google rating, gallery and appointment booking.',
    technologies:['SEO','Schema.org','Local SEO','Responsive'],
    demoURL:'https://drswapnilbade.com', imageURL: W + 'family-dental.webp' },

  { title:'Ashmak Media', category:'Media & Creative', featured:true, location:'Dubai, UAE & India',
    shortDescription:'Portfolio website for a Dubai & India creative studio offering video production, photography and graphic design, with showreel and project gallery.',
    technologies:['Portfolio','Video Showreel','Animations','Responsive'],
    demoURL:'https://www.ashmakmedia.com', imageURL: W + 'ashmak-media.webp' },

  { title:'Robotics Studio Automation', category:'Industrial', featured:true, location:'Pune',
    shortDescription:'Industrial automation website for a robotics company supplying industrial & refurbished robots and turnkey automation across India.',
    technologies:['B2B','Lead Gen','SEO','Responsive'],
    demoURL:'https://roboticsstudio.in', imageURL: W + 'robotics-studio.webp' },

  { title:'Yugveer Child Clinic', category:'Healthcare', featured:false, location:'Moshi, Pune',
    shortDescription:'Warm, parent-friendly paediatric clinic website for Dr. Prashant Patil, covering newborn to adolescent care with easy appointment booking.',
    technologies:['Healthcare','Appointment CTA','SEO','Responsive'],
    demoURL:'https://drwebsite-pi.vercel.app', imageURL: W + 'yugveer-child-clinic.webp' },

  { title:'Ashoka Lab', category:'Pathology Lab', featured:false, location:'Pune',
    shortDescription:'24/7 pathology lab website with popular tests, home sample collection, centres and one-tap call & WhatsApp booking.',
    technologies:['Local SEO','Test Catalog','WhatsApp','Responsive'],
    demoURL:'https://www.ashokalab.in', imageURL: W + 'ashoka-lab.webp' },

  { title:'Shree Pathology Lab', category:'Pathology Lab', featured:false, location:'Pimpri, Pune',
    shortDescription:'ISO-certified diagnostic lab website with health packages, transparent pricing, timings and home collection booking.',
    technologies:['Health Packages','Local SEO','Booking','Responsive'],
    demoURL:'https://shreepathlab.com', imageURL: W + 'shree-pathology-lab.webp' },

  { title:'Gajanan Laboratory', category:'Pathology Lab', featured:false, location:'Chikhali, Pimpri-Chinchwad',
    shortDescription:'Pathology lab website with full test catalogue, packages, updates and a WhatsApp-based test enquiry flow.',
    technologies:['Test Catalog','WhatsApp','Local SEO','Responsive'],
    demoURL:'https://gajananlaboratory.com', imageURL: W + 'gajanan-laboratory.webp' },

  { title:'NIDA Pathology Laboratory', category:'Pathology Lab', featured:false, location:'Pune',
    shortDescription:'ISO 9001:2015 certified lab website with doorstep sample collection, multi-branch info, test catalogue and online booking.',
    technologies:['Multi-branch','Booking','SEO','Responsive'],
    demoURL:'https://nidapathologylab.in', imageURL: W + 'nida-pathology-lab.webp' },

  { title:'Be Well Clinic', category:'Healthcare', featured:false, location:'Pimpri, Pune',
    shortDescription:'Ayurvedic wellness clinic website presenting Panchakarma therapies and treatments, with appointment booking and reviews.',
    technologies:['Healthcare','Booking','SEO','Vercel'],
    demoURL:'https://be-well-clinic.vercel.app', imageURL: W + 'be-well-clinic.webp' },

  { title:'Kardile Buro Healthcare Foundation', category:'Education', featured:false, location:'Ahilyanagar, Maharashtra',
    shortDescription:'Website for an ISO-certified group of paramedical, nursing and allied health colleges, with live courses, gallery and announcements.',
    technologies:['Firebase','Dynamic CMS','Admissions','Responsive'],
    demoURL:'https://ysinstitutes.com', imageURL: W + 'kardile-buro.webp' },

  { title:'The Rising Star School', category:'Education', featured:false, location:'Pune',
    shortDescription:'Vibrant school website with admissions banner, programmes, events, gallery and a complete mobile-responsive overhaul.',
    technologies:['Admissions','Gallery','Animations','Responsive'],
    demoURL:'https://the-rising-star-school.vercel.app', imageURL: W + 'rising-star-school.webp' },

  { title:'S4S Coatings', category:'Industrial', featured:false, location:'Pimpri-Chinchwad, Pune',
    shortDescription:'Bold industrial brand site for an epoxy, PU & ESD floor-coating manufacturer, showcasing products, capabilities and quote requests.',
    technologies:['B2B','Lead Gen','Gallery','Vercel'],
    demoURL:'https://s4s-coatings.vercel.app', imageURL: W + 's4s-coatings.webp' },

  { title:'AP Copiers', category:'Business', featured:false, location:'Pimpri, Pune',
    shortDescription:'Business website for a one-stop xerox, printing & stationery centre, with services, reviews and WhatsApp enquiries.',
    technologies:['Local SEO','PWA','WhatsApp','Responsive'],
    demoURL:'https://apcopiers.in', imageURL: W + 'ap-copiers.webp' },
];

/* ── Testimonials slider ────────────────────────────────────── */
let tIdx = 0, tTotal = 0, tAuto;
async function loadTestimonials() {
  const track = document.getElementById('t-track');
  if (!track) return;

  let items = [];
  if (typeof db !== 'undefined' && db) {
    try {
      const snap = await db.collection('testimonials').where('status', '==', 'active').get();
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) { /* fall back */ }
  }
  if (!items.length) items = STATIC_TESTI;

  track.innerHTML = items.map((t, i) => {
    const stars = Array.from({ length: 5 }, (_, k) => `<span class="${k >= (t.rating || 5) ? 'off' : ''}">★</span>`).join('');
    const av = t.profileImage
      ? `<img class="tav" src="${safeUrl(t.profileImage)}" alt="${escapeHtml(t.name)}">`
      : `<div class="tav-ph" style="background:${GRADS[i % GRADS.length]}">${escapeHtml((t.name || '?')[0])}</div>`;
    return `<div class="tslide"><div class="tcard">
      <span class="quote">"</span>
      <div class="tstars">${stars}</div>
      <p class="tmsg">${escapeHtml(t.message)}</p>
      <div class="tauthor">${av}<div style="text-align:left"><div class="nm">${escapeHtml(t.name)}</div><div class="rl">${escapeHtml([t.role, t.company].filter(Boolean).join(' · '))}</div></div></div>
    </div></div>`;
  }).join('');

  const dots = document.getElementById('t-dots');
  if (dots) dots.innerHTML = items.map((_, i) => `<span class="tdot ${i === 0 ? 'active' : ''}" data-i="${i}"></span>`).join('');

  tTotal = items.length;
  tIdx = 0; updateT();
  clearInterval(tAuto);
  tAuto = setInterval(() => goT(tIdx + 1), 5500);

  dots?.querySelectorAll('.tdot').forEach(d => d.addEventListener('click', () => { clearInterval(tAuto); goT(+d.dataset.i); }));
}
function updateT() {
  const track = document.getElementById('t-track');
  if (track) track.style.transform = `translateX(-${tIdx * 100}%)`;
  document.querySelectorAll('.tdot').forEach((d, i) => d.classList.toggle('active', i === tIdx));
}
function goT(i) { tIdx = (i + tTotal) % tTotal; updateT(); }
function nextT() { clearInterval(tAuto); goT(tIdx + 1); }
function prevT() { clearInterval(tAuto); goT(tIdx - 1); }

const STATIC_TESTI = [
  { name:'Rahul Sharma', role:'CEO', company:'TechVentures', message:'VisionQast delivered our SaaS platform on time and far exceeded expectations. Their attention to detail and communication throughout was simply outstanding.', rating:5 },
  { name:'Priya Patel', role:'Founder', company:'StyleShop', message:'The mobile app they built increased our sales by 45% in the first month. A deeply professional team with real technical depth.', rating:5 },
  { name:'Arjun Mehta', role:'CTO', company:'DataFlow', message:'They delivered exactly what we needed on our AI project, and suggested smart improvements we hadn\'t even considered. Highly recommended.', rating:5 },
  { name:'Sneha Kulkarni', role:'Director', company:'HealthFirst', message:'Our clinic management system completely transformed how we operate. Responsive, knowledgeable, and a genuinely polished final product.', rating:5 },
];

/* ── Blog ───────────────────────────────────────────────────── */
async function loadBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  let items = [];
  if (typeof db !== 'undefined' && db) {
    try {
      let snap;
      try { snap = await db.collection('blogs').where('status', '==', 'published').orderBy('createdAt', 'desc').get(); }
      catch { snap = await db.collection('blogs').where('status', '==', 'published').get(); }
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) { /* fall back */ }
  }
  if (!items.length) items = STATIC_BLOG;

  const limit = grid.dataset.limit ? parseInt(grid.dataset.limit) : items.length;
  grid.innerHTML = items.slice(0, limit).map((p, i) => `
    <article class="blog-card" data-reveal data-delay="${(i % 3) + 1}">
      <div class="blog-img">
        ${p.coverImage ? `<img src="${safeUrl(p.coverImage)}" alt="${escapeHtml(p.title)}" loading="lazy">`
          : `<div class="blog-fallback" style="background:${GRADS[i % GRADS.length]}">✦</div>`}
        ${p.category ? `<span class="blog-cat">${escapeHtml(p.category)}</span>` : ''}
      </div>
      <div class="blog-body">
        <div class="blog-tags">${(p.tags || []).slice(0, 3).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.excerpt || '')}</p>
        <div class="blog-meta"><span>${escapeHtml(p.author || 'VisionQast')}</span><span>${escapeHtml(String(p.readTime || 5))} min read</span></div>
      </div>
    </article>`).join('');
  reveal(grid);
}

const STATIC_BLOG = [
  { title:'How We Built a Scalable AI Platform in 6 Weeks', category:'Engineering', excerpt:'A behind-the-scenes look at architecting a production-ready AI platform under tight deadlines.', author:'VisionQast Team', readTime:8, tags:['AI','Next.js','Engineering'] },
  { title:'Why We Chose Firebase for Startup MVPs', category:'Tech Stack', excerpt:'Firebase offers unique advantages for early-stage products. Our honest take after 20+ launches.', author:'VisionQast Team', readTime:6, tags:['Firebase','Backend','MVP'] },
  { title:'React Native vs Flutter in 2025', category:'Mobile', excerpt:'After shipping production apps with both, here are the real trade-offs every founder should know.', author:'VisionQast Team', readTime:10, tags:['Mobile','React Native','Flutter'] },
  { title:'Designing for Conversion: A Practical Guide', category:'Design', excerpt:'Small UX decisions that compound into big revenue. Lessons from redesigning 30+ landing pages.', author:'VisionQast Team', readTime:7, tags:['Design','UX','Conversion'] },
  { title:'The Real Cost of Technical Debt', category:'Engineering', excerpt:'Why cutting corners early always costs more later — and how we keep codebases healthy.', author:'VisionQast Team', readTime:9, tags:['Engineering','Quality'] },
  { title:'Shipping Faster Without Breaking Things', category:'Process', excerpt:'Our CI/CD playbook for zero-downtime deploys and confident, frequent releases.', author:'VisionQast Team', readTime:6, tags:['DevOps','CI/CD'] },
];

/* ── Contact form ───────────────────────────────────────────── */
function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const g = id => form.querySelector('#' + id);
    const name = g('cf-name').value.trim();
    const email = g('cf-email').value.trim();
    const message = g('cf-message').value.trim();

    form.querySelectorAll('.f-input').forEach(i => i.classList.remove('err'));
    let ok = true;
    if (!name) { g('cf-name').classList.add('err'); ok = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { g('cf-email').classList.add('err'); ok = false; }
    if (!message) { g('cf-message').classList.add('err'); ok = false; }
    if (!ok) return;

    const btn = form.querySelector('[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Sending…';

    const data = {
      name, email, message,
      phone:   g('cf-phone')?.value.trim() || '',
      company: g('cf-company')?.value.trim() || '',
      service: g('cf-service')?.value || '',
      budget:  g('cf-budget')?.value || '',
      status: 'new',
    };

    try {
      if (typeof db !== 'undefined' && db) {
        await db.collection('contacts').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      } else { await new Promise(r => setTimeout(r, 900)); }
      form.style.display = 'none';
      const successEl = document.getElementById('form-success');
      if (successEl) successEl.style.display = 'block';
    } catch (err) {
      btn.disabled = false; btn.textContent = txt;
      alert('Something went wrong. Please email us directly at visionqast@gmail.com');
    }
  });
}

/* ── Service catalogue filters (services page) + home tabs ──── */
function initServiceFilters() {
  document.querySelectorAll('[data-filter-scope]').forEach(scope => {
    const btns = scope.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll(scope.dataset.filterScope);
    const apply = f => {
      btns.forEach(b => b.classList.toggle('active', b.dataset.filter === f));
      cards.forEach(c => { c.hidden = f !== 'all' && c.dataset.cat !== f; });
    };
    btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter)));
    /* Deep links (#seo etc.) must never land on a filtered-out card */
    const showHash = () => {
      const t = location.hash && document.getElementById(location.hash.slice(1));
      if (t && t.hidden) { apply('all'); t.scrollIntoView(); }
      if (t) { t.classList.add('in', 'sd-flash'); setTimeout(() => t.classList.remove('sd-flash'), 1800); }
    };
    window.addEventListener('hashchange', showHash);
    showHash();
  });
}

/* ── Home: service category tabs ────────────────────────────── */
function initServiceTabs() {
  const tabs = document.querySelectorAll('.stab');
  if (!tabs.length) return;
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => { const on = x === t; x.classList.toggle('active', on); x.setAttribute('aria-selected', on); });
    document.querySelectorAll('.stab-panel').forEach(p => {
      const on = p.dataset.panel === t.dataset.tab;
      p.hidden = !on; p.classList.toggle('active', on);
    });
  }));
}

/* ── Short lead forms (home hero audit) → Firestore `contacts` ─ */
function initLeadForms() {
  document.querySelectorAll('form.lead-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const f = n => form.elements[n];
      const name = f('name').value.trim();
      const email = f('email').value.trim();
      form.querySelectorAll('.f-input').forEach(i => i.classList.remove('err'));
      let ok = true;
      if (!name) { f('name').classList.add('err'); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { f('email').classList.add('err'); ok = false; }
      if (!ok) return;

      const site = f('website')?.value.trim();
      const data = {
        name, email,
        phone: f('phone')?.value.trim() || '',
        service: f('service')?.value || '',
        message: `${form.dataset.source || 'Website lead'}${site ? ` · Website: ${site}` : ''}`,
        status: 'new',
      };
      const btn = form.querySelector('[type="submit"]');
      const txt = btn.textContent;
      btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Sending…';
      try {
        if (typeof db !== 'undefined' && db) {
          await db.collection('contacts').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        } else { await new Promise(r => setTimeout(r, 900)); }
        [...form.children].forEach(el => { if (!el.classList.contains('lead-success')) el.hidden = true; });
        form.querySelector('.lead-success').hidden = false;
      } catch (err) {
        btn.disabled = false; btn.textContent = txt;
        alert('Something went wrong. Please WhatsApp us at +91 72493 95515 or email visionqast@gmail.com');
      }
    });
  });
}

/* ── Home: ad-budget ROI calculator ─────────────────────────── */
function initCalc() {
  const ids = ['budget', 'cpl', 'conv', 'value'];
  const inp = Object.fromEntries(ids.map(k => [k, document.getElementById('c-' + k)]));
  if (!inp.budget) return;
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const set = (id, v) => { document.getElementById(id).textContent = v; };
  const run = () => {
    const b = +inp.budget.value, cpl = +inp.cpl.value, conv = +inp.conv.value, val = +inp.value.value;
    set('o-budget', inr(b)); set('o-cpl', inr(cpl)); set('o-conv', conv + '%'); set('o-value', inr(val));
    const leads = b / cpl, cust = leads * conv / 100, rev = cust * val;
    set('r-leads', Math.round(leads).toLocaleString('en-IN'));
    set('r-cust', (cust < 10 ? cust.toFixed(1) : Math.round(cust)).toLocaleString('en-IN'));
    set('r-rev', inr(rev));
    set('r-roas', (rev / b).toFixed(1) + 'x');
    ids.forEach(k => inp[k].style.setProperty('--p', ((inp[k].value - inp[k].min) / (inp[k].max - inp[k].min) * 100) + '%'));
  };
  ids.forEach(k => inp[k].addEventListener('input', run));
  run();
}

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initServiceTabs();
  initLeadForms();
  initCalc();
  initServiceFilters();
  loadServices();
  loadWork();
  loadTestimonials();
  loadBlog();
  initContact();
  registerCounters();
});
