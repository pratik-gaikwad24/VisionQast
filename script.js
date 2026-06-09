/* =========================================================
   VisionQast — script.js
   ========================================================= */

/* ── Theme Toggle (Light / Dark) ────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const body = document.body;
  const meta = document.getElementById('theme-color-meta');
  const saved = localStorage.getItem('vq-theme');

  function applyTheme(isLight) {
    body.classList.toggle('light-mode', isLight);
    /* Sync browser theme-color meta */
    if (meta) meta.content = isLight ? '#f0f4ff' : '#050810';
    localStorage.setItem('vq-theme', isLight ? 'light' : 'dark');
  }

  /* Apply saved preference immediately (before paint) */
  applyTheme(saved === 'light');

  btn.addEventListener('click', () => {
    const isLight = !body.classList.contains('light-mode');
    applyTheme(isLight);
    btn.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => { btn.style.transform = ''; }, 400);
  });

  /* Respect OS preference if no saved value */
  if (!saved) {
    const preferLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(preferLight);
  }
})();

/* ── Loading Screen ─────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

/* ── Custom Cursor ───────────────────────────────────────── */
(function initCursor() {
  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  const glow  = document.getElementById('cursor-glow');

  /* Only activate on real mouse devices */
  if (!dot || !ring || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  /* Dot & glow snap immediately */
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
    glow.style.left = mouseX + 'px';
    glow.style.top  = mouseY + 'px';
  });

  /* Ring follows with smooth lag */
  function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Hover effect on interactive elements */
  const hoverTargets = 'a, button, .btn, .btn-ghost, .service-card, .portfolio-card, .filter-btn, .faq-question, .nav-link, .slider-btn, .social-link, .why-card, .pricing-card, #theme-toggle, #scroll-top, .hamburger';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  /* Click effect */
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  /* Hide cursor when leaving window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ── Particles Canvas ───────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    const colors = ['99,102,241', '168,85,247', '0,198,255', '236,72,153'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  };

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }

  resize();
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  animate();
  window.addEventListener('resize', resize);
})();

/* ── Sticky Navbar ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNavLink();
  toggleScrollTop();
});

/* ── Hamburger Menu ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link, .nav-cta-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Active Nav Link on Scroll ──────────────────────────── */
function updateActiveNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + navbar.offsetHeight + 50;

  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navItems.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}

/* ── Scroll to Top ──────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scroll-top');

function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Typing Text Hero ────────────────────────────────────── */
(function typingAnimation() {
  const el    = document.getElementById('typing-text');
  const words = ['Digital Reality', 'Powerful Software', 'Secure Systems', 'Beautiful Experiences', 'Cloud Solutions'];
  let wIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = words[wIdx];
    if (deleting) {
      el.textContent = current.substring(0, cIdx--);
      if (cIdx < 0) { deleting = false; wIdx = (wIdx + 1) % words.length; setTimeout(type, 500); return; }
      setTimeout(type, 60);
    } else {
      el.textContent = current.substring(0, cIdx++);
      if (cIdx > current.length) { deleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 100);
    }
  }
  setTimeout(type, 1000);
})();

/* ── Stat Counter (Hero) ─────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

/* ── Intersection Observer (AOS + counters) ─────────────── */
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };

const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      aosObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

/* Hero stat counters */
const heroStatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count));
      });
      heroStatObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroStatObserver.observe(heroStats);

/* About counters */
const aboutStatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count));
      });
      aboutStatObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutStatsRow = document.querySelector('.about-stats-row');
if (aboutStatsRow) aboutStatObserver.observe(aboutStatsRow);

/* ── Portfolio Filter ───────────────────────────────────── */
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.opacity    = '0';
      card.style.transform  = 'scale(0.9)';
      card.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        card.style.display = show ? 'block' : 'none';
        if (show) {
          requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
          });
        }
      }, 300);
    });
  });
});

/* ── Testimonial Slider ─────────────────────────────────── */
(function initSlider() {
  const track    = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('slider-dots');
  const prevBtn  = document.getElementById('prev-btn');
  const nextBtn  = document.getElementById('next-btn');
  const cards    = track ? track.querySelectorAll('.testimonial-card') : [];

  if (!cards.length) return;

  let current  = 0;
  let autoTimer;
  const visible = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  const total   = cards.length;
  const max     = Math.max(0, total - visible);

  /* Build dots */
  const dotCount = max + 1;
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot-indicator' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function getCardWidth() {
    return cards[0] ? cards[0].offsetWidth + 24 : 0; // 24 = gap (1.5rem)
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, max));
    track.style.transform = `translateX(-${current * getCardWidth()}px)`;
    dotsWrap.querySelectorAll('.dot-indicator').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current >= max ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? max : current - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  function startAuto() { autoTimer = setInterval(next, 4000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  startAuto();

  window.addEventListener('resize', () => goTo(current));
})();

/* ── FAQ Accordion ──────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    /* Close all */
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });

    /* Open clicked if was closed */
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ── Contact Form Validation ────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    function validateField(id, errId, msg) {
      const field = document.getElementById(id);
      const err   = document.getElementById(errId);
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        err.textContent = msg;
        group.classList.add('error');
        valid = false;
      } else {
        err.textContent = '';
        group.classList.remove('error');
      }
    }

    function validateEmail(id, errId) {
      const field = document.getElementById(id);
      const err   = document.getElementById(errId);
      const group = field.closest('.form-group');
      const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!field.value.trim()) {
        err.textContent = 'Email is required.';
        group.classList.add('error');
        valid = false;
      } else if (!re.test(field.value)) {
        err.textContent = 'Please enter a valid email address.';
        group.classList.add('error');
        valid = false;
      } else {
        err.textContent = '';
        group.classList.remove('error');
      }
    }

    validateField('name',    'name-error',    'Name is required.');
    validateEmail('email',   'email-error');
    validateField('subject', 'subject-error', 'Subject is required.');
    validateField('message', 'message-error', 'Message is required.');

    if (valid) {
      const btn = contactForm.querySelector('button[type="submit"]');
      const successEl = document.getElementById('form-success');
      btn.disabled = true;
      btn.innerHTML = '<span>Sending...</span>';

      setTimeout(() => {
        contactForm.reset();
        btn.disabled = false;
        btn.innerHTML = '<span>Send Message</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        successEl.classList.add('show');
        setTimeout(() => successEl.classList.remove('show'), 5000);
      }, 1500);
    }
  });

  /* Remove error on input */
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      const errId = field.id + '-error';
      const err   = document.getElementById(errId);
      if (err) err.textContent = '';
      group.classList.remove('error');
    });
  });
}

/* ── Newsletter Form ────────────────────────────────────── */
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const success    = document.getElementById('newsletter-success');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput.value.trim() || !re.test(emailInput.value)) {
      success.style.color = '#f87171';
      success.textContent = 'Please enter a valid email.';
    } else {
      success.style.color = '#22c55e';
      success.textContent = 'Subscribed! Thank you.';
      emailInput.value = '';
    }
    setTimeout(() => { success.textContent = ''; }, 4000);
  });
}

/* ── Smooth Scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── Lazy Image Loading ──────────────────────────────── */
(function initLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.add('loaded');
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    /* Fallback: load all immediately */
    lazyImages.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
})();

/* ── Keyboard Trap Prevention for Mobile Menu ────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.focus();
  }
});

/* ── Performance: log Web Vitals to console (dev) ────── */
if (window.performance && process?.env?.NODE_ENV !== 'production') {
  window.addEventListener('load', () => {
    const [nav] = performance.getEntriesByType('navigation');
    if (nav) {
      console.groupCollapsed('%cVisionQast Performance', 'color:#6366f1;font-weight:bold');
      console.log('DOM Content Loaded:', Math.round(nav.domContentLoadedEventEnd) + 'ms');
      console.log('Page Load Time:',     Math.round(nav.loadEventEnd) + 'ms');
      console.log('DNS Lookup:',         Math.round(nav.domainLookupEnd - nav.domainLookupStart) + 'ms');
      console.groupEnd();
    }
  });
}

/* ── Preload next likely page on hover ───────────────── */
document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.addEventListener('mouseenter', () => {
    const hint = document.createElement('link');
    hint.rel  = 'prefetch';
    hint.href = link.href;
    if (!document.querySelector(`link[rel="prefetch"][href="${link.href}"]`)) {
      document.head.appendChild(hint);
    }
  }, { once: true });
});
