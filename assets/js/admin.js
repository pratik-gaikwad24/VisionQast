/* ================================================================
   VisionQast Admin — Shared Utilities
   Auth guard, sidebar injection, toasts, modals, image upload
   ================================================================ */

/* ── Sidebar HTML ────────────────────────────────────────────── */
const SIDEBAR_HTML = `
<div class="sidebar-logo">
  <div class="sidebar-logo-mark">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" fill-opacity="0.9"/>
      <path d="M2 17l10 5 10-5" stroke="white" stroke-width="2" stroke-opacity="0.6"/>
      <path d="M2 12l10 5 10-5" stroke="white" stroke-width="2"/>
    </svg>
  </div>
  <span class="sidebar-brand">Vision<span>Qast</span></span>
  <span class="sidebar-badge">Admin</span>
</div>
<nav class="sidebar-nav">
  <span class="nav-section-label">Overview</span>
  <a href="/admin/dashboard.html" class="nav-item" data-page="dashboard">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    </span>
    Dashboard
  </a>

  <span class="nav-section-label">Content</span>
  <a href="/admin/projects.html" class="nav-item" data-page="projects">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z"/>
        <path d="M16 3l-4 4-4-4"/>
      </svg>
    </span>
    Projects
  </a>
  <a href="/admin/services.html" class="nav-item" data-page="services">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    </span>
    Services
  </a>
  <a href="/admin/blog.html" class="nav-item" data-page="blog">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>
      </svg>
    </span>
    Blog
  </a>
  <a href="/admin/testimonials.html" class="nav-item" data-page="testimonials">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    </span>
    Testimonials
  </a>

  <span class="nav-section-label">CRM</span>
  <a href="/admin/leads.html" class="nav-item" data-page="leads" id="sidebar-leads">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </span>
    Leads / CRM
    <span class="nav-badge" id="new-leads-count" style="display:none">0</span>
  </a>

  <div class="nav-divider"></div>

  <a href="/admin/settings.html" class="nav-item" data-page="settings">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    </span>
    Settings
  </a>
  <a href="/" target="_blank" class="nav-item">
    <span class="nav-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </span>
    View Website
  </a>
</nav>

<div class="sidebar-footer">
  <div class="sidebar-user" onclick="adminLogout()">
    <div class="user-avatar" id="user-avatar">A</div>
    <div class="user-info">
      <span class="user-name" id="user-name">Admin User</span>
      <span class="user-role">Administrator</span>
    </div>
    <button class="logout-btn" title="Logout">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </button>
  </div>
</div>`;

/* ── Inject sidebar + header ─────────────────────────────────── */
function initAdminLayout(pageId, pageTitle, breadcrumb) {
  /* Sidebar */
  const sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) sidebarEl.innerHTML = SIDEBAR_HTML;

  /* Mobile overlay */
  document.body.insertAdjacentHTML('beforeend',
    '<div class="sidebar-overlay" id="sidebar-overlay" onclick="closeSidebar()"></div>');

  /* Toast container */
  document.body.insertAdjacentHTML('beforeend', '<div id="toast-container"></div>');

  /* Highlight active nav */
  document.querySelectorAll('.nav-item[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === pageId) link.classList.add('active');
  });

  /* Header */
  const headerEl = document.getElementById('admin-header');
  if (headerEl) {
    headerEl.innerHTML = `
      <button class="header-menu-btn" onclick="toggleSidebar()" aria-label="Menu">&#9776;</button>
      <div>
        <div class="header-title">${pageTitle}</div>
        ${breadcrumb ? `<div class="header-breadcrumb">${breadcrumb}</div>` : ''}
      </div>
      <div class="header-spacer"></div>
      <div class="header-search">
        <span class="header-search-icon">⌕</span>
        <input type="search" placeholder="Quick search…" id="global-search" autocomplete="off" />
      </div>
      <div class="header-actions">
        <button class="header-btn" onclick="window.location.href='/admin/leads.html'" title="New leads">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span class="header-notif-dot" id="notif-dot" style="display:none"></span>
        </button>
      </div>`;
  }
}

/* ── Mobile sidebar ──────────────────────────────────────────── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

/* ── Auth guard ──────────────────────────────────────────────── */
function requireAdmin(callback) {
  if (typeof auth === 'undefined') {
    console.warn('Firebase not configured. Fill in firebase-config.js with your project credentials.');
    /* Allow dashboard to load in demo mode */
    if (typeof callback === 'function') callback(null);
    return;
  }

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = '/admin/';
      return;
    }

    try {
      const adminDoc = await db.collection(COLLECTIONS.admins).doc(user.uid).get();
      if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
        await auth.signOut();
        window.location.href = '/admin/';
        return;
      }

      /* Show user info in sidebar */
      const nameEl  = document.getElementById('user-name');
      const avatarEl = document.getElementById('user-avatar');
      if (nameEl) nameEl.textContent = user.displayName || user.email.split('@')[0];
      if (avatarEl) avatarEl.textContent = (user.displayName || user.email)[0].toUpperCase();

      /* Check new leads count */
      checkNewLeads();

      if (typeof callback === 'function') callback(user);
    } catch (err) {
      console.error('Admin check failed:', err);
      window.location.href = '/admin/';
    }
  });
}

/* ── Logout ──────────────────────────────────────────────────── */
async function adminLogout() {
  try {
    await auth.signOut();
    window.location.href = '/admin/';
  } catch (e) {
    showToast('Logout failed', 'error');
  }
}

/* ── Check new leads for badge ───────────────────────────────── */
async function checkNewLeads() {
  if (typeof db === 'undefined') return;
  try {
    const snap = await db.collection(COLLECTIONS.contacts)
      .where('status', '==', 'new').get();
    const count = snap.size;
    const badge = document.getElementById('new-leads-count');
    const dot   = document.getElementById('notif-dot');
    if (count > 0) {
      if (badge) { badge.textContent = count > 99 ? '99+' : count; badge.style.display = 'inline'; }
      if (dot) dot.style.display = 'block';
    }
  } catch (e) { /* quiet fail */ }
}

/* ── Toast Notifications ─────────────────────────────────────── */
function showToast(message, type = 'success') {
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span> ${message}`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

/* ── Modal ───────────────────────────────────────────────────── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

/* Close modal on overlay click */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── Confirm dialog ──────────────────────────────────────────── */
function confirmAction(message, onConfirm) {
  const id = 'confirm-modal-' + Date.now();
  const html = `
    <div class="modal-overlay open" id="${id}">
      <div class="modal modal-sm" style="margin:auto">
        <div class="modal-body" style="padding:2rem;text-align:center">
          <div class="confirm-icon">🗑</div>
          <div class="confirm-title">Are you sure?</div>
          <p class="confirm-text">${message}</p>
          <div style="display:flex;gap:.5rem;justify-content:center;margin-top:1.5rem">
            <button class="btn btn-secondary" onclick="document.getElementById('${id}').remove();document.body.style.overflow=''">Cancel</button>
            <button class="btn btn-danger" id="${id}-confirm">Delete</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById(`${id}-confirm`).onclick = () => {
    document.getElementById(id).remove();
    document.body.style.overflow = '';
    onConfirm();
  };
  document.getElementById(id).onclick = e => {
    if (e.target.id === id) {
      document.getElementById(id).remove();
      document.body.style.overflow = '';
    }
  };
}

/* ── Base64 image upload ─────────────────────────────────────── */
function setupImageUpload(inputId, previewId, dataRef) {
  const inputEl   = document.getElementById(inputId);
  const previewEl = document.getElementById(previewId);
  if (!inputEl) return;

  inputEl.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;

    const kb = Math.round(file.size / 1024);
    if (file.size > 4 * 1024 * 1024) {
      showToast('Image too large (max 4 MB)', 'error');
      return;
    }

    showToast(kb > 500 ? 'Compressing image…' : 'Processing image…', 'info');

    try {
      const b64 = await compressImage(file, 900, 0.78);
      if (previewEl) {
        previewEl.src = b64;
        previewEl.style.display = 'block';
      }
      if (dataRef) dataRef.value = b64;

      const sizeKb = Math.round((b64.length * 3) / 4 / 1024);
      showToast(`Image ready (${sizeKb} KB)`, 'success');
    } catch (err) {
      showToast('Image error: ' + err.message, 'error');
    }
  });

  /* Drag-and-drop */
  const zone = inputEl.closest('.img-upload-zone');
  if (zone) {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      inputEl.files = dt.files;
      inputEl.dispatchEvent(new Event('change'));
    });
  }
}

/* ── Tags input ──────────────────────────────────────────────── */
function setupTagsInput(wrapId, hiddenArrayRef) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;

  const inp = wrap.querySelector('.tags-input');
  const tags = hiddenArrayRef;

  function renderTags() {
    wrap.querySelectorAll('.tag-chip').forEach(c => c.remove());
    tags.forEach((tag, i) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `${tag}<button class="tag-remove" data-i="${i}">&times;</button>`;
      wrap.insertBefore(chip, inp);
    });
  }

  wrap.addEventListener('click', e => {
    if (e.target.classList.contains('tag-remove')) {
      tags.splice(+e.target.dataset.i, 1);
      renderTags();
    } else {
      inp.focus();
    }
  });

  inp.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && inp.value.trim()) {
      e.preventDefault();
      const v = inp.value.trim().replace(/,$/, '');
      if (v && !tags.includes(v)) { tags.push(v); renderTags(); }
      inp.value = '';
    }
    if (e.key === 'Backspace' && !inp.value && tags.length) {
      tags.pop(); renderTags();
    }
  });
}

/* ── Rating stars ────────────────────────────────────────────── */
function renderStars(rating, max = 5) {
  let html = '<div class="stars">';
  for (let i = 1; i <= max; i++) {
    html += `<span class="star${i > rating ? ' empty' : ''}">★</span>`;
  }
  return html + '</div>';
}

/* ── Badge HTML ──────────────────────────────────────────────── */
function badgeHTML(status) {
  return `<span class="badge badge-${status}">${capitalize(status)}</span>`;
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/* ── Rich text editor init ───────────────────────────────────── */
function initEditor(toolbarId, editorId) {
  const toolbar = document.getElementById(toolbarId);
  const editor  = document.getElementById(editorId);
  if (!toolbar || !editor) return;

  editor.setAttribute('contenteditable', 'true');

  const cmds = [
    { cmd: 'bold',        icon: '<b>B</b>',    title: 'Bold' },
    { cmd: 'italic',      icon: '<i>I</i>',    title: 'Italic' },
    { cmd: 'underline',   icon: '<u>U</u>',    title: 'Underline' },
    { cmd: 'SEP' },
    { cmd: 'formatBlock', icon: 'H2',          title: 'Heading 2', arg: 'h2' },
    { cmd: 'formatBlock', icon: 'H3',          title: 'Heading 3', arg: 'h3' },
    { cmd: 'formatBlock', icon: '¶',           title: 'Paragraph', arg: 'p' },
    { cmd: 'SEP' },
    { cmd: 'insertUnorderedList', icon: '≡', title: 'Bullet list' },
    { cmd: 'insertOrderedList',   icon: '⋮', title: 'Numbered list' },
    { cmd: 'SEP' },
    { cmd: 'createLink', icon: '🔗', title: 'Insert link' },
    { cmd: 'formatBlock', icon: '❝', title: 'Blockquote', arg: 'blockquote' },
  ];

  cmds.forEach(c => {
    if (c.cmd === 'SEP') {
      toolbar.insertAdjacentHTML('beforeend', '<div class="editor-sep"></div>');
      return;
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'editor-btn';
    btn.title = c.title;
    btn.innerHTML = c.icon;
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      if (c.cmd === 'createLink') {
        const url = prompt('URL:');
        if (url) document.execCommand('createLink', false, url);
      } else {
        document.execCommand(c.cmd, false, c.arg || null);
      }
      editor.focus();
    });
    toolbar.appendChild(btn);
  });
}

/* ── Firestore helpers ───────────────────────────────────────── */
async function fsAdd(collection, data) {
  return db.collection(collection).add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}

async function fsUpdate(collection, id, data) {
  return db.collection(collection).doc(id).update({ ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
}

async function fsDelete(collection, id) {
  return db.collection(collection).doc(id).delete();
}

async function fsGet(collection, id) {
  const doc = await db.collection(collection).doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function fsList(collection, constraints = []) {
  let q = db.collection(collection);
  constraints.forEach(c => { q = q[c[0]](...c.slice(1)); });
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ── Export for module consumers ─────────────────────────────── */
if (typeof module !== 'undefined') {
  module.exports = { showToast, openModal, closeModal, confirmAction, setupImageUpload, setupTagsInput };
}
