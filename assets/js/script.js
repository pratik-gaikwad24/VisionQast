/* ================================================================
   VisionQast — Public site interactions + Firebase content
   Page-aware: every loader is guarded by element presence,
   so this single file works across all pages.
   ================================================================ */

/* Gradients reused for fallback icons / placeholders */
const GRADS = [
  'linear-gradient(135deg,#6C5CE7,#9333EA)',
  'linear-gradient(135deg,#06B6D4,#6C5CE7)',
  'linear-gradient(135deg,#C026D3,#F43F5E)',
  'linear-gradient(135deg,#F59E0B,#F43F5E)',
  'linear-gradient(135deg,#10B981,#06B6D4)',
  'linear-gradient(135deg,#8B5CF6,#C026D3)',
];

function reveal(scope) {
  const obs = window.__revealObs;
  (scope || document).querySelectorAll('[data-reveal]').forEach(el => obs && obs.observe(el));
}

/* ── Typing animation (home hero) ───────────────────────────── */
(function typing() {
  const el = document.getElementById('type');
  if (!el) return;
  const words = ['Websites', 'Web Applications', 'Custom Software', 'Digital Marketing', 'Meta Ad Campaigns', 'Google Rankings'];
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
  { icon:'🌐', title:'Web Development',                 gradient:'linear-gradient(135deg,#6C5CE7,#9333EA)', description:'Fast, modern, mobile-first websites and web applications — business sites, e-commerce, portals, and custom CMS builds that convert visitors into customers.', features:['Business Websites','E-Commerce','Custom CMS','Responsive'] },
  { icon:'💻', title:'Software Development',            gradient:'linear-gradient(135deg,#06B6D4,#6C5CE7)', description:'Custom software built around your workflow — admin dashboards, CRM & booking systems, billing tools, and internal apps that remove manual work.', features:['Custom Software','CRM & Dashboards','Booking Systems','APIs'] },
  { icon:'📈', title:'Digital Marketing',               gradient:'linear-gradient(135deg,#C026D3,#F43F5E)', description:'Complete digital marketing that grows your brand — social media management, content strategy, campaigns, and analytics-driven growth.', features:['Social Media','Content Strategy','Campaigns','Analytics'] },
  { icon:'🎯', title:'Meta Ads (Facebook & Instagram)', gradient:'linear-gradient(135deg,#F59E0B,#F43F5E)', description:'High-converting Meta ad campaigns — precise audience targeting, creatives, A/B testing, and continuous optimisation for maximum return on ad spend.', features:['Facebook Ads','Instagram Ads','Retargeting','ROAS Focus'] },
  { icon:'🔍', title:'SEO & Google Visibility',         gradient:'linear-gradient(135deg,#10B981,#06B6D4)', description:'Get found on Google — technical SEO, on-page optimisation, local SEO, and Google Business Profile management that brings steady organic enquiries.', features:['On-Page SEO','Local SEO','Google Business','Schema'] },
  { icon:'🛠️', title:'Website Maintenance & Support',   gradient:'linear-gradient(135deg,#8B5CF6,#C026D3)', description:'Keep your website fast, secure, and up to date — hosting management, content updates, backups, security, and priority support when you need it.', features:['Hosting','Updates','Security','Priority Support'] },
];

/* ── Portfolio ──────────────────────────────────────────────── */
let WORK_ITEMS = [];
async function loadWork() {
  const grid = document.getElementById('work-grid');
  if (!grid) return;

  let items = [];
  if (typeof db !== 'undefined' && db) {
    try {
      const snap = await db.collection('projects').where('status', '==', 'published').get();
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) { /* fall back */ }
  }
  if (!items.length) items = STATIC_WORK;

  /* featured first */
  items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  WORK_ITEMS = items;

  const limit = grid.dataset.limit ? parseInt(grid.dataset.limit) : items.length;
  renderWork(items.slice(0, limit));
  wireFilters();
}

function renderWork(items) {
  const grid = document.getElementById('work-grid');
  grid.innerHTML = items.map((p, i) => `
    <article class="work-card" data-cat="${(p.category || '').toLowerCase()}" data-reveal data-delay="${(i % 3) + 1}">
      <div class="work-img">
        ${p.imageURL ? `<img src="${safeUrl(p.imageURL)}" alt="${escapeHtml(p.title)}" loading="lazy">`
          : `<div class="work-fallback" style="background:${GRADS[i % GRADS.length]}">${escapeHtml((p.title || '?')[0])}</div>`}
        ${p.category ? `<span class="work-cat">${escapeHtml(p.category)}</span>` : ''}
        ${p.featured ? `<span class="work-star">★ Featured</span>` : ''}
      </div>
      <div class="work-body">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.shortDescription || (p.description || '').slice(0, 110))}</p>
        <div class="work-tech">${(p.technologies || []).slice(0, 4).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <div class="work-links">
          ${p.demoURL ? `<a href="${safeUrl(p.demoURL)}" target="_blank" rel="noopener" class="work-link">↗ Live Demo</a>` : ''}
          ${p.githubURL ? `<a href="${safeUrl(p.githubURL)}" target="_blank" rel="noopener" class="work-link">GitHub</a>` : ''}
        </div>
      </div>
    </article>`).join('');
  reveal(grid);
}

function wireFilters() {
  const filters = document.querySelectorAll('.filter');
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

const STATIC_WORK = [
  { title:'VisionQast', category:'SaaS', featured:true,
    shortDescription:'Our own multi-page agency platform with a full admin CMS/CRM dashboard, leads pipeline, and Firebase-powered content management.',
    technologies:['JavaScript','Firebase','CMS/CRM','Responsive'],
    demoURL:'https://visionqast.com' },

  { title:'Kardile Buro Nursing Home', category:'Web', featured:true,
    shortDescription:'A nursing-home & training institute site with Firebase live data, dynamic courses and gallery, branding, and community links.',
    technologies:['JavaScript','Firebase','Dynamic CMS','Responsive'],
    demoURL:'https://ysinstitutes.com' },

  { title:'The Rising Star School', category:'Web', featured:true,
    shortDescription:'A vibrant school website featuring an announcement slider, programs, gallery, and a complete mobile-responsive overhaul.',
    technologies:['HTML5','CSS3','JavaScript','Responsive'],
    demoURL:'https://the-rising-star-school.vercel.app' },

  { title:'The Family Dental', category:'Web', featured:true,
    shortDescription:'SEO-optimised dental practice site for Dr. Swapnil Bade with structured-data schemas, ratings, and an image gallery.',
    technologies:['HTML5','CSS3','SEO','Schema.org'],
    demoURL:'https://drswapnilbade.com' },

  { title:'Robotics Studio', category:'Web', featured:false,
    shortDescription:'An engaging robotics & STEM education studio website presenting courses, programs, and student projects.',
    technologies:['HTML5','CSS3','JavaScript','Responsive'],
    demoURL:'https://roboticsstudio.in' },

  { title:'Gajanan Laboratory', category:'Web', featured:false,
    shortDescription:'A pathology laboratory website with a full test catalog and a WhatsApp-based test enquiry flow.',
    technologies:['HTML5','CSS3','JavaScript','WhatsApp API'],
    demoURL:'https://gajanan-laboratory-website.vercel.app' },

  { title:'NIDA Pathology Lab', category:'Web', featured:false,
    shortDescription:'Multi-branch pathology lab website with test catalog, branch cards, working hours, and online enquiry.',
    technologies:['HTML5','CSS3','JavaScript','SEO'],
    demoURL:'https://nidapathologylab.in' },

  { title:'Shree Pathology Lab', category:'Web', featured:false,
    shortDescription:'A pathology lab site featuring health packages, transparent pricing, and easy contact for bookings.',
    technologies:['HTML5','CSS3','JavaScript','Responsive'],
    demoURL:'https://shreepathlab.com' },

  { title:'Ashoka Labs', category:'Web', featured:false,
    shortDescription:'A diagnostic lab website with an optimised gallery and clear service presentation for patients.',
    technologies:['HTML5','CSS3','JavaScript','SEO'],
    demoURL:'https://ashokalab.in' },

  { title:'Be Well Clinic', category:'Web', featured:false,
    shortDescription:'A clean, trust-building website for a multi-speciality clinic with services, appointment enquiry, and responsive layouts.',
    technologies:['HTML5','CSS3','JavaScript','Vercel'],
    demoURL:'https://be-well-clinic.vercel.app' },

  { title:'S4S Coatings', category:'Web', featured:false,
    shortDescription:'A bold industrial brand site for a coatings manufacturer showcasing products, capabilities, and enquiries.',
    technologies:['HTML5','CSS3','JavaScript','Vercel'],
    demoURL:'https://s4s-coatings.vercel.app' },

  { title:'AP Copiers', category:'Web', featured:false,
    shortDescription:'Business website for a copier & printing solutions company, with a PWA favicon/manifest and branded tab identity.',
    technologies:['HTML5','CSS3','PWA','SEO'],
    demoURL:'https://apcopiers.in' },
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

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  loadWork();
  loadTestimonials();
  loadBlog();
  initContact();
  registerCounters();
});
