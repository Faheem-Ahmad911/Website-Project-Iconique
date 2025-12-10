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

// Update wishlist count from localStorage
function updateWishlistCount() {
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const count = wishlist.length;
    
    wishlistCountElements.forEach(el => {
        el.textContent = count;
        if (count > 0) {
            el.classList.add('bounce');
            setTimeout(() => el.classList.remove('bounce'), 300);
        }
    });
}

// Make updateWishlistCount globally accessible
window.updateWishlistCount = updateWishlistCount;

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
            } else if (currentPath.includes('/collection-products/')) {
                // On collection products page
                window.location.href = '../cart/cart.html';
            } else if (currentPath.includes('/checkout/')) {
                // On checkout page
                window.location.href = '../cart/cart.html';
            } else if (currentPath.includes('/contact/')) {
                // On contact page
                window.location.href = '../cart/cart.html';
            } else {
                // On home or about page
                window.location.href = 'cart/cart.html';
            }
        });
    });
}

// Setup Wishlist Icon Navigation
function setupWishlistNavigation() {
    const wishlistIcons = document.querySelectorAll(".wishlist-icon");
    const wishlistOverlay = document.querySelector(".wishlist-overlay");
    const wishlistClose = document.querySelector(".wishlist-close");
    
    if (!wishlistOverlay) return;
    
    wishlistIcons.forEach(wishlistIcon => {
        wishlistIcon.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            openWishlistModal();
        });
    });
    
    if (wishlistClose) {
        wishlistClose.addEventListener("click", closeWishlistModal);
    }
    
    if (wishlistOverlay) {
        wishlistOverlay.addEventListener("click", function(e) {
            if (e.target === wishlistOverlay) {
                closeWishlistModal();
            }
        });
    }
}

// Open Wishlist Modal
function openWishlistModal() {
    const wishlistOverlay = document.querySelector(".wishlist-overlay");
    if (wishlistOverlay) {
        wishlistOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        renderWishlistItems();
    }
}

// Close Wishlist Modal
function closeWishlistModal() {
    const wishlistOverlay = document.querySelector(".wishlist-overlay");
    if (wishlistOverlay) {
        wishlistOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

// Render Wishlist Items in Modal
function renderWishlistItems() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistContent = document.getElementById("wishlistContent");
    
    if (!wishlistContent) return;
    
    if (wishlist.length === 0) {
        wishlistContent.innerHTML = `
            <div class="wishlist-empty">
                <i class="far fa-heart"></i>
                <p>Your wishlist is empty</p>
            </div>
        `;
        return;
    }
    
    let itemsHTML = '';
    wishlist.forEach(item => {
        // Extract product ID from the id field (e.g., "product1" -> "1")
        const productNum = item.id.replace('product', '');
        itemsHTML += `
            <div class="wishlist-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                <div class="wishlist-item-info">
                    <h3 class="wishlist-item-name">${item.name}</h3>
                    <div class="wishlist-item-price">Rs. ${item.price}</div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-view-btn" data-product-id="${productNum}">View Product</button>
                        <button class="wishlist-remove-btn" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    wishlistContent.innerHTML = itemsHTML;
    
    // Add event listeners to buttons
    attachWishlistItemListeners();
}

// Make renderWishlistItems globally accessible
window.renderWishlistItems = renderWishlistItems;

// Attach event listeners to wishlist item buttons
function attachWishlistItemListeners() {
    // Remove button listeners
    document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id');
            removeFromWishlistModal(productId);
        });
    });
    
    // View Product button listeners
    document.querySelectorAll('.wishlist-view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productNum = this.getAttribute('data-product-id');
            viewWishlistProduct(productNum);
        });
    });
}

// Make attachWishlistItemListeners globally accessible
window.attachWishlistItemListeners = attachWishlistItemListeners;

// Remove item from wishlist in modal
window.removeFromWishlistModal = function(productId) {
    try {
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        // productId can be either "product1" format or just the ID
        const fullProductId = productId.startsWith('product') ? productId : `product${productId}`;
        wishlist = wishlist.filter(item => item.id !== fullProductId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        renderWishlistItems();
    } catch (error) {
        console.error('Error removing from wishlist:', error);
    }
}

// View product from wishlist modal
window.viewWishlistProduct = function(productNum) {
    try {
        // Close the modal first
        closeWishlistModal();
        
        // Determine current page and navigate appropriately
        const currentPath = window.location.pathname;
        
        // Product path mapping based on current location
        let productPath = '';
        
        if (currentPath.includes('/products/product1/')) {
            // Already on a product page - navigate to the product file
            productPath = `product${productNum}.html`;
        } else if (currentPath.includes('/collection-products/')) {
            // On collection-products page
            productPath = `../products/product1/product${productNum}.html`;
        } else if (currentPath.includes('/cart/')) {
            // On cart page
            productPath = `products/product1/product${productNum}.html`;
        } else if (currentPath.includes('/checkout/')) {
            // On checkout page
            productPath = `../products/product1/product${productNum}.html`;
        } else if (currentPath.includes('/contact/')) {
            // On contact page
            productPath = `../products/product1/product${productNum}.html`;
        } else {
            // On home, collections, or aboutus page
            productPath = `products/product1/product${productNum}.html`;
        }
        
        // Navigate to product
        window.location.href = productPath;
    } catch (error) {
        console.error('Error viewing wishlist product:', error);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    setupMobileNavigation();
    setupSearchFunctionality();
    setupCartNavigation();
    setupWishlistNavigation();
    updateCartCount();
    updateWishlistCount();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
        } else if (e.key === 'wishlist') {
            updateWishlistCount();
        }
    });
});
