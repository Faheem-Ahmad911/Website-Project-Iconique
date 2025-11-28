/* ========================================
   GLOBAL JAVASCRIPT FUNCTIONALITY
   Handles: Mobile Navigation, Search, Cart Count Updates
   ======================================== */

// Setup Mobile Navigation (used across all pages)
function setupMobileNavigation() {
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
    const mobileNavClose = document.querySelector(".mobile-nav-close");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-menu a");
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", function() {
            mobileNav.classList.add("active");
            mobileNavOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener("click", function() {
            mobileNav.classList.remove("active");
            mobileNavOverlay.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }
    
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener("click", function() {
            mobileNav.classList.remove("active");
            mobileNavOverlay.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }
    
    // Close mobile nav when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener("click", function() {
            if (!link.classList.contains("disabled")) {
                mobileNav.classList.remove("active");
                mobileNavOverlay.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    });
}

// Setup Search Functionality (used across all pages)
function setupSearchFunctionality() {
    const searchIcon = document.querySelector(".search-icon");
    const searchOverlay = document.querySelector(".search-overlay");
    const searchClose = document.querySelector(".search-close");
    
    if (searchIcon) {
        searchIcon.addEventListener("click", function() {
            searchOverlay.classList.add("active");
            document.getElementById("searchInput").focus();
            document.body.style.overflow = "hidden";
        });
    }
    
    if (searchClose) {
        searchClose.addEventListener("click", function() {
            searchOverlay.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }
    
    if (searchOverlay) {
        searchOverlay.addEventListener("click", function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    }
    
    // Search input functionality
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.querySelector(".search-btn");
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener("click", function() {
            const query = searchInput.value.trim();
            if (query) {
                console.log("Searching for:", query);
                // Add your search logic here
            }
        });
        
        searchInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                const query = searchInput.value.trim();
                if (query) {
                    console.log("Searching for:", query);
                    // Add your search logic here
                }
            }
        });
    }
}

// Update cart count from localStorage
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    cartCountElements.forEach(el => {
        el.textContent = count;
        if (count > 0) {
            el.classList.add('bounce');
            setTimeout(() => el.classList.remove('bounce'), 300);
        }
    });
}

// Setup Cart Icon Navigation
function setupCartNavigation() {
    const cartIcons = document.querySelectorAll(".cart-icon");
    
    cartIcons.forEach(cartIcon => {
        cartIcon.addEventListener("click", function(e) {
            e.preventDefault();
            const currentPath = window.location.pathname;
            
            // Determine the correct path to cart.html based on current page
            if (currentPath.includes('/cart/')) {
                // Already on cart page
                return;
            } else if (currentPath.includes('/products/')) {
                // On product page
                window.location.href = '../../cart/cart.html';
            } else {
                // On home or about page
                window.location.href = 'cart/cart.html';
            }
        });
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    setupMobileNavigation();
    setupSearchFunctionality();
    setupCartNavigation();
    updateCartCount();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });
});
