// Hamplee — Shared Navigation Component

function loadNavigation() {
  const navHTML = `
    <div class="announcement-bar">
      Crafting luxury gifting experiences for B2B &amp; B2C &nbsp;·&nbsp;
      <a href="mailto:hamplee.gifting@gmail.com">hamplee.gifting@gmail.com</a> &nbsp;·&nbsp;
      <a href="https://wa.me/917970765884" target="_blank">+91 79707 65884</a>
    </div>

    <nav id="mainNav">
      <div class="nav-inner">

        <button class="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <a href="index.html" class="nav-logo">HAMPLEE</a>

        <ul class="nav-menu">
          <li><a href="hampers.html">Our Hampers</a></li>
          <li><a href="mood-board.html">Custom Order</a></li>
        </ul>

        <div class="nav-icons">
          <a href="liked-wishlist.html" class="nav-wish-icon" id="navWishIcon" title="Wishlist" aria-label="View wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="nav-wish-badge" id="navWishBadge" style="display:none">0</span>
          </a>
        </div>
      </div>

      <!-- Mobile Overlay -->
      <div class="nav-overlay" onclick="closeMobileMenu()"></div>

      <!-- Mobile Drawer -->
      <div class="nav-drawer" id="navDrawer">
        <button class="drawer-close" onclick="closeMobileMenu()" aria-label="Close menu">×</button>
        <a href="index.html" class="drawer-logo">HAMPLEE</a>
        <ul class="drawer-menu">
          <li><a href="hampers.html"     onclick="closeMobileMenu()">Our Hampers</a></li>
          <li><a href="mood-board.html"  onclick="closeMobileMenu()">Custom Order</a></li>
          <li><a href="liked-wishlist.html" onclick="closeMobileMenu()">My Wishlist</a></li>
        </ul>
        <div class="drawer-contact">
          <a href="https://wa.me/917970765884" target="_blank" class="drawer-contact-link">
            <svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16z"/></svg>
            +91 79707 65884
          </a>
          <a href="mailto:hamplee.gifting@gmail.com" class="drawer-contact-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            hamplee.gifting@gmail.com
          </a>
        </div>
      </div>
    </nav>
  `;

  const placeholder = document.querySelector('.nav-placeholder');
  if (placeholder) {
    placeholder.insertAdjacentHTML('afterend', navHTML);
  } else {
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  document.body.classList.add('nav-loaded');

  // Defer non-critical init
  setTimeout(() => {
    highlightActiveNavLink();
    updateWishlistBadge();
  }, 0);
}

// ── Mobile Menu ──────────────────────────────────
function toggleMobileMenu() {
  const isOpen = document.body.classList.toggle('nav-open');
  const btn = document.querySelector('.nav-hamburger');
  if (btn) btn.setAttribute('aria-expanded', isOpen);
}

function closeMobileMenu() {
  document.body.classList.remove('nav-open');
  const btn = document.querySelector('.nav-hamburger');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) closeMobileMenu();
});

// ── Wishlist Badge ───────────────────────────────
function updateWishlistBadge() {
  const items = JSON.parse(localStorage.getItem('likedWishlist') || '[]');
  const badge = document.getElementById('navWishBadge');
  if (!badge) return;
  badge.textContent  = items.length;
  badge.style.display = items.length > 0 ? 'flex' : 'none';
}

// Public aliases
window.updateLikedWishlistCount = updateWishlistBadge;
window.updateWishlistCount      = updateWishlistBadge;

// ── Active Link ───────────────────────────────────
function highlightActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .drawer-menu a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page);
  });
}

// ── Boot ──────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
  loadNavigation();
}
