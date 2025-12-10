// ========================================
// SHARED PRODUCT PAGE JAVASCRIPT
// ========================================

/**
 * Product Page Initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeProductPage();
});

/**
 * Initialize all product page functionality
 */
function initializeProductPage() {
    // Mobile navigation
    initMobileNavigation();
    
    // Search functionality
    initSearchFunctionality();
    
    // Cart icon
    initCartIcon();
    
    // Quantity selector
    initQuantitySelector();
    
    // Image thumbnail switching
    initImageThumbnails();
    
    // Action buttons
    initActionButtons();
    
    // Wishlist functionality
    initWishlist();
    
    // Cart functionality
    initCart();
    
    // Image zoom
    initImageZoom();
    
    // Smooth scroll
    initSmoothScroll();
    
    // Initialize compare (removed)
    // initComparison();
    
    // Initialize explore more products
    initExploreMoreProducts();
}

// ========================================
// QUANTITY SELECTOR
// ========================================

function initQuantitySelector() {
    const quantityInput = document.getElementById('quantity-input');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    if (!quantityInput || !decreaseBtn || !increaseBtn) return;
    
    // Decrease quantity
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateQuantityDisplay();
        }
    });
    
    // Increase quantity
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        let maxValue = parseInt(quantityInput.getAttribute('max')) || 10;
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
            updateQuantityDisplay();
        }
    });
    
    // Direct input
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        let maxValue = parseInt(this.getAttribute('max')) || 10;
        
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > maxValue) {
            this.value = maxValue;
        }
        updateQuantityDisplay();
    });
    
    // Prevent non-numeric input
    quantityInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
}

function updateQuantityDisplay() {
    const quantityInput = document.getElementById('quantity-input');
    const quantity = parseInt(quantityInput.value);
    
    // Visual feedback when quantity changes
    quantityInput.style.opacity = '0.8';
    setTimeout(() => {
        quantityInput.style.opacity = '1';
    }, 100);
}

// ========================================
// IMAGE THUMBNAIL SWITCHING
// ========================================

function initImageThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    // Store original image sources for restoration
    const originalImageUrls = new Map();
    const activeThumbnail = document.querySelector('.thumbnail.active');
    const initialImageUrl = activeThumbnail ? activeThumbnail.getAttribute('data-image') : mainImage.src;
    
    thumbnails.forEach(thumbnail => {
        const imageUrl = thumbnail.getAttribute('data-image');
        originalImageUrls.set(thumbnail, imageUrl);
        
        // Click handler - Update main image with smooth transition
        thumbnail.addEventListener('click', function(e) {
            e.stopPropagation();
            const imageUrl = this.getAttribute('data-image');
            
            // Fade out
            mainImage.style.opacity = '0';
            mainImage.style.transition = 'opacity 0.3s ease-in-out';
            
            setTimeout(() => {
                mainImage.src = imageUrl;
                mainImage.style.opacity = '1';
            }, 150);
            
            // Update active thumbnail
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Touch support for mobile
        thumbnail.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.click();
        }, { passive: false });
    });
}

// ========================================
// ACTION BUTTONS
// ========================================

function initActionButtons() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', handleBuyNow);
    }
}

function handleAddToCart(e) {
    e.preventDefault();
    
    const quantity = parseInt(document.getElementById('quantity-input').value);
    
    // Get product details from page data attributes
    const productId = document.body.getAttribute('data-product-id') || 'product1';
    const productName = document.querySelector('.product-title')?.textContent || 'Product';
    const priceAmount = document.querySelector('.price .amount')?.textContent?.replace(/,/g, '') || '0';
    const mainImage = document.getElementById('main-product-image').src;
    
    const productData = {
        id: productId,
        name: productName,
        price: parseFloat(priceAmount),
        quantity: quantity,
        image: mainImage
    };
    
    // Add to cart using CartManager
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productData.id);
    
    if (existingProduct) {
        // If product exists, increment its quantity
        existingProduct.quantity += quantity;
    } else {
        // If product doesn't exist, add it to cart (maintain insertion order)
        cart.push(productData);
    }
    
    // Save to storage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback with cart count
    const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    showNotification(`✓ ${productName} added to cart! (Total items: ${totalQuantity})`, 'success');
    
    // Animate button
    animateButton(e.target);
}

function handleBuyNow(e) {
    e.preventDefault();
    
    const quantity = parseInt(document.getElementById('quantity-input').value);
    const productId = document.body.getAttribute('data-product-id') || 'product1';
    const productName = document.querySelector('.product-title')?.textContent || 'Product';
    const priceAmount = document.querySelector('.price .amount')?.textContent?.replace(/,/g, '') || '0';
    const mainImage = document.getElementById('main-product-image').src;
    
    const productData = {
        id: productId,
        name: productName,
        price: parseFloat(priceAmount),
        quantity: quantity,
        image: mainImage
    };
    
    // Create a cart with only the selected product
    const cart = [productData];
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success notification
    showNotification(`✓ Proceeding to checkout...`, 'success');
    
    // Redirect to checkout page
    // Calculate relative path based on current location
    const currentPath = window.location.pathname;
    let checkoutPath = '';
    
    // Determine relative path to checkout
    if (currentPath.includes('/products/product')) {
        checkoutPath = '../../checkout/checkout.html';
    } else {
        checkoutPath = '../checkout/checkout.html';
    }
    
    setTimeout(() => {
        window.location.href = checkoutPath;
    }, 500);
}

// ========================================
// WISHLIST FUNCTIONALITY
// ========================================

function initWishlist() {
    const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');
    
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', handleAddToWishlist);
    }
    
    // Update wishlist status from localStorage
    updateWishlistStatus();
}

function handleAddToWishlist(e) {
    e.preventDefault();
    
    const productId = document.body.getAttribute('data-product-id') || 'product1';
    const productName = document.querySelector('.product-title')?.textContent || 'Product';
    const priceAmount = document.querySelector('.price .amount')?.textContent?.replace(/,/g, '') || '0';
    const mainImage = document.getElementById('main-product-image').src;
    
    const productData = {
        id: productId,
        name: productName,
        price: parseFloat(priceAmount),
        image: mainImage,
        timestamp: new Date().getTime()
    };
    
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product already exists in wishlist
    const existingProduct = wishlist.find(item => item.id === productData.id);
    
    if (existingProduct) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== productData.id);
        this.classList.remove('active');
        showNotification('Removed from wishlist', 'info');
    } else {
        // Add to wishlist
        wishlist.push(productData);
        this.classList.add('active');
        showNotification('Added to wishlist!', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    animateButton(this);
}

function updateWishlistStatus() {
    const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');
    if (!addToWishlistBtn) return;
    
    const productId = document.body.getAttribute('data-product-id') || 'product1';
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.some(item => item.id === productId);
    
    if (isInWishlist) {
        addToWishlistBtn.classList.add('active');
    }
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    
    wishlistCountElements.forEach(el => {
        el.textContent = wishlist.length;
        if (wishlist.length > 0) {
            el.classList.add('bounce');
            setTimeout(() => el.classList.remove('bounce'), 300);
        }
    });
}

// ========================================
// CART FUNCTIONALITY
// ========================================

function initCart() {
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    // Calculate total quantity of all items in cart
    const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalQuantity;
        
        // Add bounce animation
        if (totalQuantity > 0) {
            el.classList.add('bounce');
            setTimeout(() => {
                el.classList.remove('bounce');
            }, 300);
        }
    });
}

// ========================================
// COMPARISON FUNCTIONALITY
// ========================================

// ========================================
// COMPARISON FUNCTIONALITY - REMOVED
// ========================================
// Compare functionality has been removed from this product page

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        info: 'info-circle',
        warning: 'exclamation-circle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// ========================================
// BUTTON ANIMATION
// ========================================

function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#checkout' || href.startsWith('#external')) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// PRODUCT IMAGE ZOOM (Enhanced)
// ========================================

function initImageZoom() {
    const zoomIcon = document.querySelector('.image-zoom-icon');
    const mainImage = document.getElementById('main-product-image');
    
    if (!zoomIcon || !mainImage) return;
    
    zoomIcon.addEventListener('click', openImageZoom);
    mainImage.addEventListener('click', openImageZoom);
}

function openImageZoom() {
    const mainImage = document.getElementById('main-product-image');
    if (!mainImage) return;
    
    // Create zoom modal
    const modal = document.createElement('div');
    modal.className = 'image-zoom-modal';
    modal.innerHTML = `
        <div class="zoom-modal-content">
            <button class="zoom-close" aria-label="Close zoom">
                <i class="fas fa-times"></i>
            </button>
            <img src="${mainImage.src}" alt="Zoomed product image" style="cursor: zoom-out;">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.zoom-close');
    const modalImg = modal.querySelector('.zoom-modal-content img');
    
    const closeZoom = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    };
    
    closeBtn.addEventListener('click', closeZoom);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeZoom();
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeZoom();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Click on image to close
    modalImg.addEventListener('click', closeZoom);
}

// ========================================
// PAGE VISIBILITY
// ========================================

// Update cart count when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateCartCount();
        updateWishlistCount();
    }
});

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', function(e) {
    const quantityInput = document.getElementById('quantity-input');
    
    if (e.key === 'ArrowUp' && document.activeElement === quantityInput) {
        e.preventDefault();
        document.getElementById('increase-qty').click();
    } else if (e.key === 'ArrowDown' && document.activeElement === quantityInput) {
        e.preventDefault();
        document.getElementById('decrease-qty').click();
    }
});

// ========================================
// EXPLORE MORE PRODUCTS
// ========================================

/**
 * Sample product database - can be replaced with API call
 */
const relatedProducts = [
    {
        id: 'product2',
        name: 'Radiant Foundation',
        price: 'Rs. 3,500.00',
        originalPrice: 'Rs. 5,200.00',
        image: '../../images/productimages/product2.jpg',
        link: '../product2/product2.html'
    },
    {
        id: 'product3',
        name: 'Glow Serum',
        price: 'Rs. 2,800.00',
        originalPrice: 'Rs. 4,200.00',
        image: '../../images/productimages/product3.jpg',
        link: '../product3/product3.html'
    },
    {
        id: 'product4',
        name: 'Eyeshadow Palette',
        price: 'Rs. 1,999.00',
        originalPrice: 'Rs. 3,500.00',
        image: '../../images/productimages/product4.jpg',
        link: '../product4/product4.html'
    },
    {
        id: 'product5',
        name: 'Mascara Pro',
        price: 'Rs. 1,499.00',
        originalPrice: 'Rs. 2,500.00',
        image: '../../images/productimages/product5.jpg',
        link: '../product5/product5.html'
    },
    {
        id: 'product6',
        name: 'Luxury Lipstick',
        price: 'Rs. 1,799.00',
        originalPrice: 'Rs. 2,800.00',
        image: '../../images/productimages/product1.jpg',
        link: '../product6/product6.html'
    }
];

function initExploreMoreProducts() {
    const exploreTrack = document.getElementById('explore-products-track');
    const exploreDots = document.getElementById('explore-dots');
    const arrowLeft = document.querySelector('.explore-more-section .explore-arrow.arrow-left');
    const arrowRight = document.querySelector('.explore-more-section .explore-arrow.arrow-right');
    
    if (!exploreTrack || !exploreDots) return;
    
    // Clear previous content
    exploreTrack.innerHTML = '';
    exploreDots.innerHTML = '';
    
    // Populate products
    relatedProducts.forEach((product, index) => {
        // Create product card
        const productCard = document.createElement('div');
        productCard.className = 'explore-product-card';
        productCard.innerHTML = `
            <div class="explore-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="explore-product-info">
                <h3 class="explore-product-name">${product.name}</h3>
                <span class="explore-product-original-price">${product.originalPrice}</span>
                <p class="explore-product-price">${product.price}</p>
                <button class="explore-quick-view" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i> View Product
                </button>
            </div>
        `;
        
        // Add click handler for view product button
        const viewBtn = productCard.querySelector('.explore-quick-view');
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = product.link;
        });
        
        // Add click handler for card
        productCard.addEventListener('click', () => {
            window.location.href = product.link;
        });
        
        exploreTrack.appendChild(productCard);
        
        // Create dot indicator
        const dot = document.createElement('span');
        dot.className = `explore-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => scrollToProduct(index));
        exploreDots.appendChild(dot);
    });
    
    // Carousel navigation
    if (arrowLeft && arrowRight) {
        arrowLeft.addEventListener('click', () => scrollExploreCarousel('left'));
        arrowRight.addEventListener('click', () => scrollExploreCarousel('right'));
    }
    
    // Initialize carousel with proper responsive behavior
    const exploreCarousel = document.querySelector('.explore-carousel');
    if (exploreCarousel) {
        // Calculate card dimensions on load
        setTimeout(() => {
            calculateExploreCardDimensions();
            updateExploreArrowStates();
        }, 100);
        
        // Handle scroll for dot indicators
        exploreCarousel.addEventListener('scroll', updateExploreActiveDot, { passive: true });
        
        // Recalculate on window resize
        window.addEventListener('resize', () => {
            calculateExploreCardDimensions();
            updateExploreArrowStates();
        });
        
        // Initialize gesture/touch support
        setupExploreGestureHandlers(exploreCarousel);
    }
}

/**
 * Setup gesture handlers for explore carousel (touch, swipe, drag)
 */
function setupExploreGestureHandlers(carousel) {
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startScrollLeft = 0;
    
    // Touch start - record initial position
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        startScrollLeft = carousel.scrollLeft;
        isDragging = true;
    }, { passive: true });
    
    // Touch move - allow natural scrolling but track drag
    carousel.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const currentX = e.touches[0].clientX;
            const diff = touchStartX - currentX;
            
            // Optional: Add visual feedback during drag if needed
            // You can add more sophisticated drag logic here if desired
        }
    }, { passive: true });
    
    // Touch end - handle swipe gesture
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        touchEndX = e.changedTouches[0].clientX;
        isDragging = false;
        
        handleExploreSwipe(carousel);
    }, { passive: true });
    
    // Mouse drag support for desktop testing
    let isMouseDown = false;
    let mouseStartX = 0;
    
    carousel.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
        carousel.style.scrollBehavior = 'auto';
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        
        const diff = mouseStartX - e.clientX;
        carousel.scrollLeft = startScrollLeft + diff;
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        carousel.style.scrollBehavior = 'smooth';
        
        // Snap to nearest card after drag
        setTimeout(() => {
            snapExploreCarouselToCard(carousel);
        }, 100);
    });
    
    carousel.addEventListener('mouseleave', (e) => {
        if (isMouseDown) {
            isMouseDown = false;
            carousel.style.scrollBehavior = 'smooth';
            setTimeout(() => {
                snapExploreCarouselToCard(carousel);
            }, 100);
        }
    });
}

/**
 * Handle swipe gesture on explore carousel
 */
function handleExploreSwipe(carousel) {
    const swipeThreshold = 50; // Minimum swipe distance in pixels
    const diff = touchStartX - touchEndX;
    const exploreTrack = document.getElementById('explore-products-track');
    const cards = document.querySelectorAll('.explore-product-card');
    
    if (!exploreTrack || !cards.length) return;
    
    const cardWidth = parseFloat(exploreTrack.dataset.cardWidth) || 300;
    const gap = parseInt(exploreTrack.dataset.gap) || 16;
    const scrollLeft = carousel.scrollLeft;
    const scrollWidth = cardWidth + gap;
    
    // Get current card index
    let currentIndex = Math.round(scrollLeft / scrollWidth);
    currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
    
    // Swipe left - show next card
    if (diff > swipeThreshold) {
        if (currentIndex < cards.length - 1) {
            scrollToProduct(currentIndex + 1);
        } else {
            // Already at last card, snap back
            snapExploreCarouselToCard(carousel);
        }
    }
    // Swipe right - show previous card
    else if (diff < -swipeThreshold) {
        if (currentIndex > 0) {
            scrollToProduct(currentIndex - 1);
        } else {
            // Already at first card, snap back
            snapExploreCarouselToCard(carousel);
        }
    }
    // Swipe too small - snap back to current card
    else {
        snapExploreCarouselToCard(carousel);
    }
}

/**
 * Snap carousel to nearest card after drag or small swipe
 */
function snapExploreCarouselToCard(carousel) {
    const exploreTrack = document.getElementById('explore-products-track');
    const cards = document.querySelectorAll('.explore-product-card');
    
    if (!exploreTrack || !cards.length) return;
    
    const cardWidth = parseFloat(exploreTrack.dataset.cardWidth) || 300;
    const gap = parseInt(exploreTrack.dataset.gap) || 16;
    const scrollLeft = carousel.scrollLeft;
    const scrollWidth = cardWidth + gap;
    
    // Find nearest card
    let nearestIndex = Math.round(scrollLeft / scrollWidth);
    nearestIndex = Math.max(0, Math.min(nearestIndex, cards.length - 1));
    
    // Scroll to nearest card
    scrollToProduct(nearestIndex);
}

/**
 * Calculate proper card dimensions based on screen size and gaps
 */
function calculateExploreCardDimensions() {
    const exploreCarousel = document.querySelector('.explore-carousel');
    const exploreTrack = document.getElementById('explore-products-track');
    const cards = document.querySelectorAll('.explore-product-card');
    
    if (!exploreCarousel || !cards.length) return;
    
    const containerWidth = exploreCarousel.clientWidth;
    
    // Get actual gap from CSS computed styles (more accurate)
    const computedGap = parseInt(window.getComputedStyle(exploreCarousel).gap) || 16;
    
    let cardWidth;
    let cardsPerView = 1;
    
    // Determine cards per view based on screen size
    if (window.innerWidth >= 1024) {
        // Desktop: 4 cards visible
        cardsPerView = 4;
        const totalGapWidth = (cardsPerView - 1) * computedGap;
        cardWidth = (containerWidth - totalGapWidth) / cardsPerView;
    } else if (window.innerWidth >= 768) {
        // Tablet: 2 cards visible
        cardsPerView = 2;
        const totalGapWidth = (cardsPerView - 1) * computedGap;
        cardWidth = (containerWidth - totalGapWidth) / cardsPerView;
    } else {
        // Mobile: 1 card visible - make it fill the screen width minus padding
        cardsPerView = 1;
        // For mobile, make card take up most of the visible width (80% of container)
        cardWidth = Math.floor(containerWidth * 0.9); // 90% of container width
    }
    
    // Apply calculated width to all cards
    cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}px`;
        card.style.minWidth = `${cardWidth}px`;
    });
    
    // Store dimensions for carousel calculations
    exploreTrack.dataset.cardWidth = cardWidth;
    exploreTrack.dataset.cardsPerView = cardsPerView;
    exploreTrack.dataset.containerWidth = containerWidth;
    exploreTrack.dataset.gap = computedGap;
}

function scrollExploreCarousel(direction) {
    const exploreCarousel = document.querySelector('.explore-carousel');
    const exploreTrack = document.getElementById('explore-products-track');
    
    if (!exploreCarousel || !exploreTrack) return;
    
    // Get card dimensions from stored data
    const cardWidth = parseFloat(exploreTrack.dataset.cardWidth) || 300;
    const gap = parseInt(exploreTrack.dataset.gap) || 16;
    
    // Scroll amount should be one card width plus gap
    const scrollAmount = cardWidth + gap;
    const currentScroll = exploreCarousel.scrollLeft;
    
    if (direction === 'left') {
        exploreCarousel.scrollTo({
            left: Math.max(0, currentScroll - scrollAmount),
            behavior: 'smooth'
        });
    } else {
        exploreCarousel.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Update arrows after scroll
    setTimeout(updateExploreArrowStates, 300);
}

function scrollToProduct(index) {
    const exploreCarousel = document.querySelector('.explore-carousel');
    const exploreTrack = document.getElementById('explore-products-track');
    const cards = document.querySelectorAll('.explore-product-card');
    
    if (!cards[index] || !exploreCarousel || !exploreTrack) return;
    
    // Get card dimensions from stored data
    const cardWidth = parseFloat(exploreTrack.dataset.cardWidth) || 300;
    const gap = parseInt(exploreTrack.dataset.gap) || 16;
    
    // Calculate scroll position
    const scrollPosition = (cardWidth + gap) * index;
    
    exploreCarousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    
    updateExploreActiveDot();
}

function updateExploreArrowStates() {
    const exploreCarousel = document.querySelector('.explore-carousel');
    const arrowLeft = document.querySelector('.explore-more-section .explore-arrow.arrow-left');
    const arrowRight = document.querySelector('.explore-more-section .explore-arrow.arrow-right');
    
    if (!exploreCarousel || !arrowLeft || !arrowRight) return;
    
    const canScrollLeft = exploreCarousel.scrollLeft > 0;
    const canScrollRight = 
        exploreCarousel.scrollLeft < (exploreCarousel.scrollWidth - exploreCarousel.clientWidth - 10);
    
    arrowLeft.disabled = !canScrollLeft;
    arrowRight.disabled = !canScrollRight;
}

function updateExploreActiveDot() {
    const exploreCarousel = document.querySelector('.explore-carousel');
    const exploreTrack = document.getElementById('explore-products-track');
    const cards = document.querySelectorAll('.explore-product-card');
    const dots = document.querySelectorAll('.explore-dot');
    
    if (!exploreCarousel || !cards.length || !dots.length || !exploreTrack) return;
    
    // Get card dimensions from stored data
    const cardWidth = parseFloat(exploreTrack.dataset.cardWidth) || 300;
    const gap = parseInt(exploreTrack.dataset.gap) || 16;
    const scrollLeft = exploreCarousel.scrollLeft;
    const scrollWidth = cardWidth + gap;
    
    // Calculate which product is at the start of the visible area
    const activeIndex = Math.round(scrollLeft / scrollWidth);
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === Math.min(activeIndex, dots.length - 1));
    });
    
    updateExploreArrowStates();
}

// ========================================
// NAVIGATION & SEARCH FUNCTIONALITY
// ========================================

/**
 * Initialize mobile navigation
 */
function initMobileNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Open mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close mobile menu
    const closeMobileNav = () => {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
    }
    
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNav);
    }
    
    // Close when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchModal = document.querySelector('.search-modal');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchResults = document.querySelector('#searchResults');
    const searchTags = document.querySelectorAll('.search-tag');
    
    if (!searchIcon || !searchOverlay) return;
    
    // Product data for search (dynamically load from page if available)
    const products = [
        { id: 'product1', name: 'Daily Defence', price: 'Rs. 2,199.00', image: '../../images/productimages/product1.jpg', category: 'sunscreen' },
        { id: 'product2', name: 'Radiant Foundation', price: 'Rs. 45.99', image: '../../images/productimages/product1.jpg', category: 'foundation' },
        { id: 'product3', name: 'Glow Serum', price: 'Rs. 59.99', image: '../../images/productimages/product1.jpg', category: 'serum' },
        { id: 'product4', name: 'Eyeshadow Palette', price: 'Rs. 39.99', image: '../../images/productimages/product1.jpg', category: 'eyeshadow' },
        { id: 'product5', name: 'Moisturizer Cream', price: 'Rs. 24.99', image: '../../images/productimages/product1.jpg', category: 'moisturizer' }
    ];
    
    // Open search modal
    searchIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        openSearchModal();
    });
    
    // Close search modal
    const openSearchModal = () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 300);
    };
    
    const closeSearchModal = () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
    };
    
    if (searchClose) {
        searchClose.addEventListener('click', closeSearchModal);
    }
    
    // Close on overlay click
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearchModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearchModal();
        }
    });
    
    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value, products);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e.target.value, products);
            }
        });
    }
    
    // Search button handler
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            handleSearch(searchInput.value, products);
        });
    }
    
    // Search tags
    searchTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.textContent;
            if (searchInput) {
                searchInput.value = query;
            }
            handleSearch(query, products);
        });
    });
    
    // Search handler function
    function handleSearch(query, productList) {
        if (!query || query.trim().length < 2) {
            if (searchResults) searchResults.innerHTML = '';
            return;
        }
        
        const filteredProducts = productList.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        displaySearchResults(filteredProducts, query);
    }
    
    // Display search results
    function displaySearchResults(filteredProducts, query) {
        if (filteredProducts.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>No products found for "${query}"</p>
                    <p>Try searching for: Sunscreen, Foundation, Serum, Eyeshadow</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = filteredProducts.map(product => `
            <div class="search-result-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="search-result-image">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.price}</p>
                </div>
            </div>
        `).join('');
        
        searchResults.innerHTML = `
            <h4>Search Results (${filteredProducts.length})</h4>
            ${resultsHTML}
        `;
        
        // Add click handlers to search results
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                const product = filteredProducts.find(p => p.id === productId);
                if (product) {
                    // Navigate to product page
                    window.location.href = `../../products/${productId}/${productId}.html`;
                }
            });
        });
    }
}

/**
 * Initialize cart icon
 */
function initCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartIcon) return;
    
    cartIcon.addEventListener('click', () => {
        window.location.href = '../../cart/cart.html';
    });
}

// ========================================
// EXPORT FUNCTIONS FOR EXTERNAL USE
// ========================================

window.ProductPage = {
    addToCart: handleAddToCart,
    buyNow: handleBuyNow,
    addToWishlist: handleAddToWishlist,
    showNotification: showNotification,
    updateCartCount: updateCartCount,
    updateWishlistCount: updateWishlistCount
};
