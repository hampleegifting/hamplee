// Reusable Navigation Component for Hamplee

function loadNavigation() {
    const navHTML = `
    <!-- Top Announcement Bar -->
    <div class="announcement-bar">
        <a href="mood-board.html">Enquire Now</a> For Bulk & Corporate Gifting
    </div>

    <!-- Navigation -->
    <nav>
        <div class="nav-wrapper">
            <div class="nav-main">
                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Toggle Menu">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
                
                <a href="index.html" class="logo">HAMPLEE</a>
                
                <div class="nav-right">
                    <a href="liked-wishlist.html" class="nav-icon" id="likedWishlistIcon" title="Liked Wishlist">
                        ♥
                        <span class="liked-wishlist-badge" id="likedWishlistBadge">0</span>
                    </a>
                    <a href="#" class="nav-icon" onclick="alert('User profile coming soon!'); return false;" title="User Profile">
                        👤
                    </a>
                </div>
            </div>
            
            <!-- Search Box - Separate for mobile positioning -->
            <div class="search-box">
                <input type="text" placeholder="Search for gifts..." id="navSearch">
                <button class="search-clear-btn" id="searchClearBtn" onclick="clearNavSearch()" style="display: none;">×</button>
                <span class="search-divider" id="searchDivider" style="display: none;"></span>
                <button class="search-btn" onclick="performNavSearch()">🔍</button>
            </div>
        </div>
        
        <!-- Mobile Drawer Overlay -->
        <div class="mobile-drawer-overlay" onclick="toggleMobileMenu()"></div>
        
        <!-- Navigation Links (Desktop) & Mobile Drawer -->
        <div class="nav-links-wrapper">
            <!-- Close button inside drawer -->
            <button class="drawer-close-btn" onclick="toggleMobileMenu()" aria-label="Close Menu">×</button>
            
            <!-- Drawer Header -->
            <div class="drawer-header">
                <a href="index.html" class="drawer-logo">HAMPLEE</a>
            </div>
            
            <!-- Navigation Menu -->
            <div class="drawer-section">
                <ul class="nav-links">
                    <li><a href="index.html#collections" onclick="closeMobileMenu()">CURATED COLLECTIONS</a></li>
                    <li><a href="curated-hampers.html" onclick="closeMobileMenu()">CURATED HAMPERS</a></li>
                    <li><a href="products.html" onclick="closeMobileMenu()">ALL PRODUCTS</a></li>
                    <li><a href="mood-board.html" onclick="closeMobileMenu()">CRAFT YOUR SIGNATURE CORPORATE GIFT</a></li>
                    <li><a href="index.html#about" onclick="closeMobileMenu()">ABOUT</a></li>
                    <li><a href="index.html#contact" onclick="closeMobileMenu()">CONTACT</a></li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    // Insert navigation at the beginning of body
    const navPlaceholder = document.querySelector('.nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.insertAdjacentHTML('afterend', navHTML);
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    
    // Mark navigation as loaded immediately
    document.body.classList.add('nav-loaded');
    
    // Initialize navigation functionality
    setTimeout(() => {
        // Highlight active navigation link
        highlightActiveNavLink();
        
        // Update liked basket count
        updateLikedWishlistCount();
        
        // Restore search term from URL if present
        restoreSearchTerm();
        
        // Add search functionality
        const searchInput = document.getElementById('navSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performNavSearch();
                }
            });
            
            // Show/hide clear button based on input
            searchInput.addEventListener('input', function() {
                toggleClearButton();
            });
        }
        
        // Add smooth scroll for anchor links
        document.querySelectorAll('a[href*="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Check if it's an anchor link to index.html
                if (href.includes('index.html#')) {
                    const targetId = href.split('#')[1];
                    const currentPage = window.location.pathname.split('/').pop();
                    
                    // If we're on index.html, smooth scroll
                    if (currentPage === 'index.html' || currentPage === '') {
                        e.preventDefault();
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            // Calculate offset for fixed navigation (nav height + announcement bar)
                            const navHeight = document.querySelector('nav')?.offsetHeight || 0;
                            const announcementHeight = document.querySelector('.announcement-bar')?.offsetHeight || 0;
                            const offset = navHeight + announcementHeight + 20; // 20px extra padding
                            
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                    // Otherwise, let the browser navigate normally
                }
            });
        });
    }, 0);
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    document.body.classList.toggle('mobile-menu-open');
}

// Close Mobile Menu
function closeMobileMenu() {
    document.body.classList.remove('mobile-menu-open');
}

// Close mobile menu on window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 1000 && document.body.classList.contains('mobile-menu-open')) {
        closeMobileMenu();
    }
});

// Restore search term from URL parameters
function restoreSearchTerm() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const searchInput = document.getElementById('navSearch');
    
    if (searchTerm && searchInput) {
        searchInput.value = searchTerm;
        toggleClearButton();
    }
}

// Toggle clear button visibility
function toggleClearButton() {
    const searchInput = document.getElementById('navSearch');
    const clearBtn = document.getElementById('searchClearBtn');
    const divider = document.getElementById('searchDivider');
    
    if (searchInput && clearBtn && divider) {
        const hasValue = searchInput.value.trim();
        clearBtn.style.display = hasValue ? 'flex' : 'none';
        divider.style.display = hasValue ? 'block' : 'none';
    }
}

// Clear search
function clearNavSearch() {
    const searchInput = document.getElementById('navSearch');
    if (searchInput) {
        searchInput.value = '';
        toggleClearButton();
        searchInput.focus();
    }
    
    // If we're on a search results page, reload without search parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
        const currentPage = window.location.pathname.split('/').pop();
        window.location.href = currentPage || 'index.html';
    }
}

// Search functionality
function performNavSearch() {
    const searchInput = document.getElementById('navSearch');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (searchTerm) {
        // Determine which page to search on based on current page
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'curated-hampers.html' || currentPage === '') {
            window.location.href = `curated-hampers.html?search=${encodeURIComponent(searchTerm)}`;
        } else if (currentPage === 'products.html') {
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        } else {
            // Default to products page
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
}

// Update liked basket count badge
function updateLikedWishlistCount() {
    const likedItems = JSON.parse(localStorage.getItem('likedWishlist') || '[]');
    const badge = document.getElementById('likedWishlistBadge');
    if (badge) {
        badge.textContent = likedItems.length;
        badge.style.display = likedItems.length > 0 ? 'flex' : 'none';
    }
}

// Alias for backward compatibility
window.updateWishlistCount = updateLikedWishlistCount;
window.updateLikedWishlistCount = updateLikedWishlistCount;

// Highlight active navigation link based on current page
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        let isActive = false;
        
        // Only highlight for separate pages, not anchor links
        if (href === currentPage) {
            isActive = true;
        } else if (href === 'index.html' && (currentPage === '' || currentPage === 'index.html')) {
            isActive = true;
        } else if (href === 'products.html' && currentPage === 'products.html') {
            isActive = true;
        } else if (href === 'curated-hampers.html' && currentPage === 'curated-hampers.html') {
            isActive = true;
        } else if (href === 'mood-board.html' && currentPage === 'mood-board.html') {
            isActive = true;
        } else if (href === 'liked-wishlist.html' && currentPage === 'liked-wishlist.html') {
            isActive = true;
        }
        // Don't highlight ABOUT/CONTACT anchor links
        
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Load navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
    loadNavigation();
}

