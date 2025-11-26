/* ========================================
   LOADING ANIMATIONS & SCROLL EFFECTS
   ======================================== */

// Animation observer for scroll-triggered animations
class AnimationObserver {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Create intersection observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.observeElements());
        } else {
            this.observeElements();
        }
    }

    observeElements() {
        // Elements to animate on scroll
        const animatedElements = document.querySelectorAll(`
            .section-title,
            .product-card,
            .bundle-card,
            .view-more-section,
            .bundles-section,
            .footer
        `);

        animatedElements.forEach(element => {
            // Add initial animation class
            element.classList.add('animate-on-load');
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        // Remove the initial hidden state
        element.classList.remove('animate-on-load');
        
        // Add appropriate animation based on element type
        if (element.classList.contains('section-title')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        } else if (element.classList.contains('product-card')) {
            element.style.animation = 'scaleIn 0.8s ease-out forwards';
        } else if (element.classList.contains('bundle-card')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        } else if (element.classList.contains('view-more-section')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        } else {
            element.style.animation = 'fadeIn 0.8s ease-out forwards';
        }
    }
}

// Page loading animation
function initPageAnimations() {
    // Add loading class to body
    document.body.classList.add('page-loading');
    
    // Remove loading class after initial animations
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
        }, 500);
    });
}

/* ========================================
   FIREBASE CONFIGURATION & INITIALIZATION
   ======================================== */

// Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase initialization with error handling
let db = null;
let auth = null;

function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            auth = firebase.auth();
            console.log("✅ Firebase initialized successfully");
            return true;
        } else {
            console.warn("⚠️ Firebase SDK not loaded");
            return false;
        }
    } catch (error) {
        console.warn("⚠️ Firebase initialization failed:", error.message);
        return false;
    }
}

/* ========================================
   RESPONSIVE UTILITIES & DEVICE DETECTION
   ======================================== */

class ResponsiveHelper {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isDesktop = window.innerWidth > 1024;
        this.touchDevice = 'ontouchstart' in window;
        
        // Update on resize
        window.addEventListener('resize', this.updateBreakpoints.bind(this));
    }
    
    updateBreakpoints() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isDesktop = window.innerWidth > 1024;
    }
    
    getVisibleCards(containerWidth, cardWidth, minCards = 1) {
        if (this.isMobile) return 1;
        if (this.isTablet) return Math.max(2, Math.floor(containerWidth / cardWidth));
        return Math.max(3, Math.floor(containerWidth / cardWidth));
    }
}

const responsive = new ResponsiveHelper();

/* ========================================
   ENHANCED HERO SECTION SLIDER
   Continuous left-to-right sliding with 1 second initial delay
   No pause on hover - slides continuously
   ======================================== */

class HeroImage {
    constructor() {
        this.heroImage = document.querySelector('.hero-image');
        this.heroContainer = document.querySelector('.hero-image-container');
        
        if (!this.heroImage || !this.heroContainer) {
            console.warn('Hero image elements not found');
            return;
        }
        
        this.init();
    }
    
    init() {
        // Handle image loading
        if (this.heroImage.complete && this.heroImage.naturalHeight !== 0) {
            this.onImageLoad();
        } else {
            this.heroImage.addEventListener('load', () => {
                this.onImageLoad();
            });
            
            this.heroImage.addEventListener('error', () => {
                this.onImageError();
            });
        }
        
        // Add hover effect for desktop only
        if (window.innerWidth > 768 && !('ontouchstart' in window)) {
            this.heroImage.addEventListener('mouseenter', () => {
                this.heroImage.style.transform = 'scale(1.02)';
            });
            
            this.heroImage.addEventListener('mouseleave', () => {
                this.heroImage.style.transform = 'scale(1)';
            });
        }
    }
    
    onImageLoad() {
        this.heroContainer.classList.add('loaded');
        console.log('Hero image loaded successfully');
    }
    
    onImageError() {
        console.error('Hero image failed to load:', this.heroImage.src);
        // Keep the background gradient visible as fallback
        this.heroImage.style.display = 'none';
    }
}


/* ========================================
   ENHANCED CAROUSEL CLASS
   Universal carousel for products and bundles with responsive behavior
   ======================================== */

class EnhancedCarousel {
    constructor(config) {
        this.carousel = document.querySelector(config.carouselSelector);
        this.track = document.querySelector(config.trackSelector);
        this.leftArrow = document.querySelector(config.leftArrowSelector);
        this.rightArrow = document.querySelector(config.rightArrowSelector);
        this.carouselType = config.type || 'product';
        
        if (!this.carousel || !this.track) return;
        
        // Enable carousel functionality on both mobile and desktop
        this.isMobile = () => window.innerWidth <= 768;
        this.currentIndex = 0;
        this.visibleCards = this.getVisibleCards();
        this.totalCards = this.track.children.length;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isAnimating = false;
        this.gap = 0;
        this.initialized = false;
        
        this.init();
    }
    

    
    init() {
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateArrows();
        this.initialized = true;
        
        // Smooth transitions with faster mobile timing
        const transitionSpeed = this.isMobile() ? '0.15s' : '0.5s';
        this.track.style.transition = `transform ${transitionSpeed} cubic-bezier(0.4, 0, 0.2, 1)`;
        
        // Add resize listener for responsive behavior
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.calculateDimensions();
                const newTransitionSpeed = this.isMobile() ? '0.15s' : '0.5s';
                this.track.style.transition = `transform ${newTransitionSpeed} cubic-bezier(0.4, 0, 0.2, 1)`;
            }, 150);
        });
    }
    
    getVisibleCards() {
        const width = window.innerWidth;
        if (width < 768) {
            // Mobile: 1 card for bundles (with partial second visible), 1 for products
            return this.carouselType === 'bundles' ? 1 : 1;
        }
        if (width < 1024) return 2;     // Tablet: 2 cards
        return 3;                        // Desktop: 3 cards
    }
    
    calculateDimensions() {
        const firstCard = this.track.children[0];
        if (!firstCard) return;
        
        // Get gap from CSS
        const trackStyle = window.getComputedStyle(this.track);
        this.gap = parseInt(trackStyle.gap) || 24;
        
        // Update visible cards based on viewport
        this.visibleCards = this.getVisibleCards();
        
        // Ensure we don't exceed available cards
        this.visibleCards = Math.min(this.visibleCards, this.totalCards);
        
        // Reset index if needed
        const maxIndex = Math.max(0, this.totalCards - this.visibleCards);
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
            this.updatePosition();
        }
        
        this.updateArrows();
    }
    
    setupEventListeners() {
        // Arrow click handlers - work on all devices
        if (this.leftArrow) {
            this.leftArrow.addEventListener('click', () => this.slideLeft());
        }
        
        if (this.rightArrow) {
            this.rightArrow.addEventListener('click', () => this.slideRight());
        }
        
        // Touch/swipe support for all touch devices
        if (responsive.touchDevice || this.isMobile()) {
            this.addTouchSupport();
        }
        
        // Keyboard support for accessibility
        this.carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.slideLeft();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.slideRight();
            }
        });
    }
    
    addTouchSupport() {
        let startY = 0;
        let startX = 0;
        let isHorizontalSwipe = false;
        let touchStartTime = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            if (this.isAnimating) return; // Don't start new touch if animation is in progress
            
            this.touchStartX = e.changedTouches[0].screenX;
            startY = e.changedTouches[0].screenY;
            startX = e.changedTouches[0].screenX;
            touchStartTime = Date.now();
            isHorizontalSwipe = false;
        }, { passive: true });
        
        this.carousel.addEventListener('touchmove', (e) => {
            const currentX = e.changedTouches[0].screenX;
            const currentY = e.changedTouches[0].screenY;
            const deltaX = Math.abs(currentX - startX);
            const deltaY = Math.abs(currentY - startY);
            
            // Determine if this is a horizontal swipe (more horizontal movement than vertical)
            if (deltaX > deltaY && deltaX > 5) {
                isHorizontalSwipe = true;
                // Prevent vertical scrolling during horizontal swipe
                e.preventDefault();
            }
        }, { passive: false });
        
        this.carousel.addEventListener('touchend', (e) => {
            if (isHorizontalSwipe && e.changedTouches.length > 0 && !this.isAnimating) {
                this.touchEndX = e.changedTouches[0].screenX;
                const touchDuration = Date.now() - touchStartTime;
                
                // Only process swipe if touch duration is between 50-500ms (quick swipe, not drag)
                // This ensures only 1 card is scrolled at a time and prevents accidental multiple scrolls
                if (touchDuration >= 50 && touchDuration < 500) {
                    this.handleSwipe();
                }
            }
        }, { passive: true });
    }
    
    handleSwipe() {
        // In mobile mode, always scroll exactly 1 card at a time
        const swipeThreshold = this.isMobile() ? 20 : 30; // Stricter threshold on mobile for single card scroll
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Swipe left (negative diff) = move right/next card
            // Swipe right (positive diff) = move left/previous card
            // Each swipe advances by exactly 1 card
            if (diff > 0) {
                this.slideLeft(); // Swiped right, show previous card (one card only)
            } else {
                this.slideRight(); // Swiped left, show next card (one card only)
            }
        }
    }
    

    
    slideLeft() {
        if (this.currentIndex > 0 && !this.isAnimating) {
            this.isAnimating = true;
            this.currentIndex--;
            this.updatePosition();
            this.updateArrows();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 400);
        }
    }
    
    slideRight() {
        const maxIndex = Math.max(0, this.totalCards - this.visibleCards);
        if (this.currentIndex < maxIndex && !this.isAnimating) {
            this.isAnimating = true;
            this.currentIndex++;
            this.updatePosition();
            this.updateArrows();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 400);
        }
    }
    
    updatePosition() {
        const firstCard = this.track.children[0];
        if (!firstCard) return;
        
        const cardWidth = firstCard.offsetWidth;
        let translateX;
        
        if (this.carouselType === 'bundles' && this.isMobile()) {
            // For bundles on mobile, slide by card width + gap to show complete cards
            translateX = -(this.currentIndex * (cardWidth + this.gap));
        } else {
            translateX = -(this.currentIndex * (cardWidth + this.gap));
        }
        
        this.track.style.transform = `translateX(${translateX}px)`;
    }
    
    updateArrows() {
        // Update left arrow
        if (this.leftArrow) {
            if (this.currentIndex === 0) {
                this.leftArrow.disabled = true;
                this.leftArrow.setAttribute('aria-disabled', 'true');
                this.carousel.classList.remove('has-overflow-left');
            } else {
                this.leftArrow.disabled = false;
                this.leftArrow.setAttribute('aria-disabled', 'false');
                this.carousel.classList.add('has-overflow-left');
            }
        }
        
        // Update right arrow
        if (this.rightArrow) {
            const maxIndex = Math.max(0, this.totalCards - this.visibleCards);
            if (this.currentIndex >= maxIndex || this.totalCards <= this.visibleCards) {
                this.rightArrow.disabled = true;
                this.rightArrow.setAttribute('aria-disabled', 'true');
                this.carousel.classList.remove('has-overflow-right');
            } else {
                this.rightArrow.disabled = false;
                this.rightArrow.setAttribute('aria-disabled', 'false');
                this.carousel.classList.add('has-overflow-right');
            }
        }
    }
}

/* ========================================
   MOBILE NAVIGATION WITH ENHANCED ANIMATIONS
   ======================================== */

class MobileNavigation {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
        this.mobileNavClose = document.querySelector('.mobile-nav-close');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.addAnimationDelays();
    }
    
    setupEventListeners() {
        // Open mobile navigation
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.openNav());
        }
        
        // Close mobile navigation
        if (this.mobileNavClose) {
            this.mobileNavClose.addEventListener('click', () => this.closeNav());
        }
        
        if (this.mobileNavOverlay) {
            this.mobileNavOverlay.addEventListener('click', () => this.closeNav());
        }
        
        // Close nav when clicking links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('disabled')) {
                    this.closeNav();
                }
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeNav();
            }
        });
    }
    
    addAnimationDelays() {
        this.mobileNavLinks.forEach((link, index) => {
            link.style.setProperty('--animation-delay', `${index * 0.1}s`);
        });
    }
    
    openNav() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.mobileNav.classList.add('active');
        this.mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add active class to toggle button for animation
        this.mobileMenuToggle.classList.add('active');
    }
    
    closeNav() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.mobileNav.classList.remove('active');
        this.mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove active class from toggle button
        this.mobileMenuToggle.classList.remove('active');
    }
}

/* ========================================
   FIREBASE NEWSLETTER INTEGRATION 
   Enhanced with better UX and error handling
   ======================================== */

class NewsletterManager {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.emailInput = document.getElementById('newsletterEmail');
        this.messageElement = document.getElementById('newsletterMessage');
        this.submitButton = null;
        
        if (this.form) {
            this.submitButton = this.form.querySelector('button[type="submit"]');
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time email validation
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => this.validateEmailInput());
            this.emailInput.addEventListener('blur', () => this.validateEmailInput());
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        
        // Validate email
        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            this.emailInput.focus();
            return;
        }
        
        // Check Firebase availability
        if (!db) {
            this.showMessage('Service temporarily unavailable. Please try again later.', 'error');
            return;
        }
        
        try {
            this.setLoadingState(true);
            
            // Check if email already exists
            const existingSubscriber = await db.collection('newsletter_subscribers')
                .where('email', '==', email)
                .get();
            
            if (!existingSubscriber.empty) {
                this.showMessage('You are already subscribed to our newsletter! 😊', 'info');
                this.setLoadingState(false);
                return;
            }
            
            // Save new subscriber
            await db.collection('newsletter_subscribers').add({
                email: email,
                subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
                source: 'homepage',
                userAgent: navigator.userAgent,
                ipAddress: null // This would need server-side implementation
            });
            
            this.showMessage('Thank you for subscribing! Welcome to TheIconique family! 🎉', 'success');
            this.emailInput.value = '';
            this.setLoadingState(false);
            
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showMessage('Something went wrong. Please try again later.', 'error');
            this.setLoadingState(false);
        }
    }
    
    validateEmailInput() {
        const email = this.emailInput.value.trim();
        
        if (email && !this.isValidEmail(email)) {
            this.emailInput.classList.add('invalid');
            return false;
        } else {
            this.emailInput.classList.remove('invalid');
            return true;
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    setLoadingState(loading) {
        if (!this.submitButton) return;
        
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            this.emailInput.disabled = true;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Subscribe';
            this.emailInput.disabled = false;
        }
    }
    
    showMessage(message, type) {
        if (!this.messageElement) return;
        
        this.messageElement.textContent = message;
        this.messageElement.className = `newsletter-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.className = 'newsletter-message';
        }, 5000);
    }
}

/* ========================================
   ENHANCED PRODUCT INTERACTIONS
   With responsive feedback and animations
   ======================================== */

class ProductInteractions {
    constructor() {
        this.productCards = document.querySelectorAll('.product-card');
        this.bundleCards = document.querySelectorAll('.bundle-card');
        this.cartIcon = document.querySelector('.cart-icon');
        this.searchIcon = document.querySelector('.search-icon');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.searchModal = document.querySelector('.search-modal');
        this.searchClose = document.querySelector('.search-close');
        this.searchInput = document.querySelector('#searchInput');
        this.searchBtn = document.querySelector('.search-btn');
        this.searchResults = document.querySelector('#searchResults');
        this.cartCount = 0;
        
        // Sample product data for search
        this.products = [
            { id: 1, name: 'Luxe Lipstick', price: '$29.99', image: 'images/productimages/product1.jpg', category: 'lipstick' },
            { id: 2, name: 'Radiant Foundation', price: '$45.99', image: 'images/bundle2.jpg', category: 'foundation' },
            { id: 3, name: 'Glow Serum', price: '$59.99', image: 'images/bundle3.jpg', category: 'serum' },
            { id: 4, name: 'Eyeshadow Palette', price: '$39.99', image: 'images/bundle4.jpg', category: 'eyeshadow' },
            { id: 5, name: 'Mascara Pro', price: '$24.99', image: 'images/bundle5.jpg', category: 'mascara' },
            { id: 6, name: 'Blush Duo', price: '$19.99', image: 'images/bundle6.jpg', category: 'blush' },
            { id: 7, name: 'Setting Spray', price: '$27.99', image: 'images/herosectionimages/1.jpg', category: 'setting' },
            { id: 8, name: 'Highlighter Stick', price: '$22.99', image: 'images/herosectionimages/2.jpg', category: 'highlighter' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupProductCardHandlers();
        this.setupBundleCardHandlers();
        this.setupCartHandler();
        this.setupSearchHandler();
    }
    
    setupProductCardHandlers() {
        this.productCards.forEach((card, index) => {
            // Add hover effects for desktop
            if (!responsive.touchDevice) {
                card.addEventListener('mouseenter', () => this.animateCardHover(card, true));
                card.addEventListener('mouseleave', () => this.animateCardHover(card, false));
            }
            
            // Click handler
            card.addEventListener('click', (e) => this.handleProductClick(e, card, 'product'));
            
            // Add intersection observer for scroll animations
            this.observeCardAnimation(card, index * 100);
        });
    }
    
    setupBundleCardHandlers() {
        this.bundleCards.forEach((card, index) => {
            // Add hover effects for desktop
            if (!responsive.touchDevice) {
                card.addEventListener('mouseenter', () => this.animateCardHover(card, true));
                card.addEventListener('mouseleave', () => this.animateCardHover(card, false));
            }
            
            // Click handler
            card.addEventListener('click', (e) => this.handleProductClick(e, card, 'bundle'));
            
            // Add intersection observer for scroll animations
            this.observeCardAnimation(card, index * 100);
        });
    }
    
    animateCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        }
    }
    
    handleProductClick(e, card, type) {
        e.preventDefault();
        
        // Get product information from card
        const productName = card.querySelector('.product-name, .bundle-name')?.textContent || 'Product';
        const productPrice = card.querySelector('.product-price, .bundle-price')?.textContent?.match(/[\d.,]+/)?.[0] || '0';
        const productImage = card.querySelector('img')?.src || '';
        const productId = card.getAttribute('data-product-id') || `${type}_${Date.now()}`;
        
        // Create product data
        const productData = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice.replace(/,/g, '')),
            image: productImage,
            quantity: 1
        };
        
        // Add to cart using global cart manager
        if (typeof globalCartManager !== 'undefined' && globalCartManager) {
            globalCartManager.addToCart(productData);
        } else {
            // Fallback
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProduct = cart.find(item => item.id === productData.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(productData);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        
        // Animate click feedback
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            if (!card.matches(':hover') || responsive.touchDevice) {
                card.style.transform = '';
            }
        }, 150);
        
        // Show success notification
        this.showNotification(`${productName} added to cart!`, 'success');
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#ff9800'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    observeCardAnimation(card, delay) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, delay);
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(card);
    }
    
    setupCartHandler() {
        if (this.cartIcon) {
            this.cartIcon.addEventListener('click', () => {
                window.location.href = 'cart/cart.html';
            });
        }
    }
    
    updateCartCount(count) {
        this.cartCount = count;
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.cartCount;
            
            // Add bounce animation
            cartCountElement.classList.add('bounce');
            setTimeout(() => {
                cartCountElement.classList.remove('bounce');
            }, 300);
        }
    }
    
    setupSearchHandler() {
        if (this.searchIcon && this.searchOverlay) {
            // Open search modal
            this.searchIcon.addEventListener('click', () => {
                this.openSearchModal();
            });
            
            // Close search modal
            if (this.searchClose) {
                this.searchClose.addEventListener('click', () => {
                    this.closeSearchModal();
                });
            }
            
            // Close on overlay click
            this.searchOverlay.addEventListener('click', (e) => {
                if (e.target === this.searchOverlay) {
                    this.closeSearchModal();
                }
            });
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
                    this.closeSearchModal();
                }
            });
            
            // Search input handler
            if (this.searchInput) {
                this.searchInput.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value);
                });
                
                this.searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleSearch(e.target.value);
                    }
                });
            }
            
            // Search button handler
            if (this.searchBtn) {
                this.searchBtn.addEventListener('click', () => {
                    this.handleSearch(this.searchInput.value);
                });
            }
            
            // Popular search tags
            this.setupSearchTags();
        }
    }
    
    openSearchModal() {
        this.searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on search input
        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.focus();
            }
        }, 300);
        
        console.log('Search modal opened');
    }
    
    closeSearchModal() {
        this.searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear search
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
        
        console.log('Search modal closed');
    }
    
    setupSearchTags() {
        const searchTags = document.querySelectorAll('.search-tag');
        searchTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const query = tag.textContent;
                if (this.searchInput) {
                    this.searchInput.value = query;
                }
                this.handleSearch(query);
            });
        });
    }
    
    handleSearch(query) {
        if (!query || query.trim().length < 2) {
            this.searchResults.innerHTML = '';
            return;
        }
        
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        this.displaySearchResults(filteredProducts, query);
    }
    
    displaySearchResults(products, query) {
        if (products.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>No products found for "${query}"</p>
                    <p>Try searching for: Lipstick, Foundation, Serum, Eyeshadow</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = products.map(product => `
            <div class="search-result-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="search-result-image">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.price}</p>
                </div>
            </div>
        `).join('');
        
        this.searchResults.innerHTML = `
            <h4>Search Results (${products.length})</h4>
            ${resultsHTML}
        `;
        
        // Add click handlers to search results
        const resultItems = this.searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                this.handleProductClick(productId);
            });
        });
    }
    
    handleProductClick(productId) {
        const product = this.products.find(p => p.id == productId);
        if (product) {
            console.log(`Selected product: ${product.name}`);
            this.showProductNotification(product);
            this.closeSearchModal();
        }
    }
    
    showProductNotification(product) {
        const notification = document.createElement('div');
        notification.className = 'product-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h4>${product.name}</h4>
                    <p>${product.price}</p>
                    <small>Product details coming soon!</small>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

/* ========================================
   SCROLL ENHANCEMENTS & HEADER EFFECTS
   ======================================== */

class ScrollEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.setupSmoothScrolling();
    }
    
    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateHeader();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (this.header) {
            // Add scrolled class for styling
            if (currentScrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll (mobile only)
            if (responsive.isMobile) {
                if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                    this.header.classList.add('header-hidden');
                } else {
                    this.header.classList.remove('header-hidden');
                }
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && !anchor.classList.contains('disabled')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = this.header ? this.header.offsetHeight : 0;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

/* ========================================
   PERFORMANCE OPTIMIZATIONS
   ======================================== */

class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.preloadCriticalResources();
    }
    
    optimizeImages() {
        // Image loading optimization
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                img.addEventListener('error', () => {
                    console.warn('Failed to load image:', img.src);
                    img.classList.add('error');
                });
            } else {
                img.classList.add('loaded');
            }
        });
    }
    
    preloadCriticalResources() {
        // Preload next hero image
        const heroImages = document.querySelectorAll('.hero-slide img');
        if (heroImages.length > 1) {
            const nextImage = new Image();
            nextImage.src = heroImages[1].src;
        }
    }
}

/* ========================================
   MAIN APPLICATION INITIALIZATION
   ======================================== */

class TheIconiqueApp {
    constructor() {
        this.isInitialized = false;
        this.components = {};
    }
    
    async init() {
        if (this.isInitialized) return;
        
        console.log('🌸 Initializing TheIconique Enhanced Experience...');
        
        try {
            // Initialize Firebase
            const firebaseReady = initializeFirebase();
            
            // Initialize core components
            this.components.heroImage = new HeroImage();
            this.components.mobileNav = new MobileNavigation();
            this.components.scrollEffects = new ScrollEffects();
            this.components.productInteractions = new ProductInteractions();
            this.components.performanceOptimizer = new PerformanceOptimizer();
            
            // Initialize carousels
            this.components.productsCarousel = new EnhancedCarousel({
                carouselSelector: '.products-carousel',
                trackSelector: '.products-track',
                leftArrowSelector: '.arrow-left',
                rightArrowSelector: '.arrow-right',
                type: 'products'
            });
            
            this.components.bundlesCarousel = new EnhancedCarousel({
                carouselSelector: '.bundles-carousel',
                trackSelector: '.bundles-track',
                leftArrowSelector: '.bundles-section .arrow-left',
                rightArrowSelector: '.bundles-section .arrow-right',
                type: 'bundles'
            });
            
            // Initialize newsletter (requires Firebase)
            if (firebaseReady) {
                this.components.newsletter = new NewsletterManager();
            }
            
            // Add page load animations
            this.addPageLoadAnimations();
            
            this.isInitialized = true;
            console.log('✅ TheIconique Enhanced - All systems ready!');
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
        }
    }
    
    addPageLoadAnimations() {
        // Fade in body
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.6s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // Animate sections on scroll
        const sections = document.querySelectorAll('section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

/* ========================================
   APPLICATION STARTUP
   ======================================== */

/* ========================================
   CART MANAGEMENT & SYNCHRONIZATION
   ======================================== */

// Global Cart Manager for synchronizing cart across pages
class GlobalCartManager {
    constructor() {
        this.storageKey = 'cart'; // Same key used everywhere
        this.init();
    }

    init() {
        // Initialize cart count on page load
        this.updateCartCount();
        
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.updateCartCount();
            }
        });
    }

    // Get cart from localStorage
    getCart() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Add product to cart
    addToCart(product) {
        const cart = this.getCart();
        
        // Check if product already exists
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += product.quantity || 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.updateCartCount();
        return cart;
    }

    // Remove product from cart
    removeFromCart(productId) {
        const cart = this.getCart();
        const index = cart.findIndex(item => item.id === productId);
        if (index > -1) {
            cart.splice(index, 1);
            localStorage.setItem(this.storageKey, JSON.stringify(cart));
            this.updateCartCount();
        }
        return cart;
    }

    // Update cart count display
    updateCartCount() {
        const cart = this.getCart();
        const cartCountElements = document.querySelectorAll('.cart-count');
        // Calculate total quantity of all items in cart
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        
        cartCountElements.forEach(el => {
            el.textContent = count;
            
            // Add bounce animation when count updates
            if (count > 0) {
                el.classList.add('bounce');
                setTimeout(() => el.classList.remove('bounce'), 300);
            }
        });
    }

    // Clear cart
    clearCart() {
        localStorage.removeItem(this.storageKey);
        this.updateCartCount();
    }
}

// Initialize global cart manager
let globalCartManager = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        globalCartManager = new GlobalCartManager();
        
        // Initialize page animations
        initPageAnimations();
        
        // Initialize animation observer
        const animationObserver = new AnimationObserver();
        
        // Initialize carousel controllers for products and bundles
        initializeCarousels();
        
        // Initialize main app
        const app = new TheIconiqueApp();
        app.init();
    });
} else {
    // DOM already loaded
    globalCartManager = new GlobalCartManager();
    initPageAnimations();
    const animationObserver = new AnimationObserver();
    initializeCarousels();
    const app = new TheIconiqueApp();
    app.init();
}

/* ========================================
   GLOBAL ERROR HANDLING
   ======================================== */

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

/* ========================================
   CAROUSEL CONTROLLER - Clean Implementation
   ======================================== */

class CarouselController {
    constructor(config) {
        this.carousel = document.querySelector(config.carouselSelector);
        this.track = document.querySelector(config.trackSelector);
        this.dots = document.querySelectorAll(config.dotsSelector);
        this.cards = this.track ? this.track.querySelectorAll(':scope > *') : [];
        
        if (!this.carousel || !this.track || this.cards.length === 0) {
            console.warn(`Carousel not initialized: ${config.carouselSelector}`);
            return;
        }
        
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupDotClickHandlers();
        this.setupScrollTracking();
        this.setupTouchHandlers();
        this.setupResizeHandler();
        this.updateDots();
    }
    
    isMobile() {
        return window.innerWidth <= 768;
    }
    
    getCardDimensions() {
        if (!this.cards[0]) return { width: 0, gap: 0 };
        
        const cardWidth = this.cards[0].offsetWidth;
        const trackStyle = window.getComputedStyle(this.track);
        const gap = parseInt(trackStyle.gap) || 16;
        
        return { width: cardWidth, gap };
    }
    
    // Update dots to reflect current card
    updateDots() {
        if (!this.isMobile() || this.dots.length === 0) {
            return;
        }
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    // Get the current visible card based on scroll position
    getCurrentCardIndex() {
        const { width, gap } = this.getCardDimensions();
        if (width === 0) return 0;
        
        const scrollLeft = this.carousel.scrollLeft;
        const cardStep = width + gap;
        const index = Math.round(scrollLeft / cardStep);
        
        return Math.max(0, Math.min(index, this.cards.length - 1));
    }
    
    // Scroll to specific card
    scrollToCard(index, smooth = true) {
        if (!this.carousel) return;
        
        this.currentIndex = Math.max(0, Math.min(index, this.cards.length - 1));
        
        const { width, gap } = this.getCardDimensions();
        if (width === 0) return;
        
        const scrollPosition = this.currentIndex * (width + gap);
        
        this.carousel.scrollTo({
            left: scrollPosition,
            behavior: smooth ? 'smooth' : 'auto'
        });
        
        this.updateDots();
    }
    
    // Snap to nearest card
    snapToCard() {
        if (!this.isMobile()) return;
        
        const newIndex = this.getCurrentCardIndex();
        if (newIndex !== this.currentIndex) {
            this.currentIndex = newIndex;
            this.scrollToCard(this.currentIndex, true);
        }
    }
    
    setupDotClickHandlers() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.scrollToCard(index, true);
            });
        });
    }
    
    setupScrollTracking() {
        let scrollTimeout;
        
        this.carousel.addEventListener('scroll', () => {
            // Update current index while scrolling
            this.currentIndex = this.getCurrentCardIndex();
            this.updateDots();
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Snap to card after scroll ends
            scrollTimeout = setTimeout(() => {
                this.snapToCard();
            }, 150);
        }, { passive: true });
    }
    
    setupTouchHandlers() {
        this.carousel.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = this.startX - endX;
            
            // Swipe threshold
            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    // Swipe left - next card
                    this.scrollToCard(this.currentIndex + 1, true);
                } else {
                    // Swipe right - previous card
                    this.scrollToCard(this.currentIndex - 1, true);
                }
            } else {
                // Snap to nearest card
                this.snapToCard();
            }
        }, { passive: true });
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            // Reposition on resize
            this.scrollToCard(this.currentIndex, false);
            this.updateDots();
        });
    }
}

/* ========================================
   INITIALIZE CAROUSELS
   ======================================== */

function initializeCarousels() {
    // Products carousel
    const productsCarousel = new CarouselController({
        carouselSelector: '.products-carousel',
        trackSelector: '.products-track',
        dotsSelector: '#products-dots .carousel-dot'
    });
    
    // Bundles carousel
    const bundlesCarousel = new CarouselController({
        carouselSelector: '.bundles-carousel',
        trackSelector: '.bundles-track',
        dotsSelector: '#bundles-dots .carousel-dot'
    });
}

/* ========================================
   FORMULAS CAROUSEL - Auto Scroll on Mobile
   ======================================== */

class FormulasCarousel {
    constructor() {
        this.carousel = document.querySelector('.formulas-carousel');
        this.scrollInterval = null;
        this.isDragging = false;
        this.lastTouchX = 0;
        
        if (!this.carousel) return;
        
        this.init();
    }
    
    isMobile() {
        return window.innerWidth <= 768;
    }
    
    setupAutoScroll() {
        if (!this.isMobile()) return;
        
        // Detect if user is trying to drag/swipe horizontally
        this.carousel.addEventListener('touchstart', (e) => {
            this.lastTouchX = e.touches[0].clientX;
            this.isDragging = true;
        }, false);
        
        this.carousel.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const currentTouchX = e.touches[0].clientX;
            const diffX = Math.abs(currentTouchX - this.lastTouchX);
            
            // If horizontal movement is detected, prevent it
            if (diffX > 5) {
                e.preventDefault();
            }
        }, { passive: false });
        
        this.carousel.addEventListener('touchend', () => {
            this.isDragging = false;
        }, false);
        
        // Prevent mouse drag scrolling
        let isMouseDown = false;
        this.carousel.addEventListener('mousedown', () => {
            isMouseDown = true;
        });
        
        this.carousel.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                e.preventDefault();
            }
        }, { passive: false });
        
        this.carousel.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        // Allow wheel scrolling to scroll the page (not the carousel)
        this.carousel.addEventListener('wheel', (e) => {
            // Only prevent horizontal wheel scrolling
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Start auto scroll after a delay on initial load
        setTimeout(() => {
            this.startAutoScroll();
        }, 500);
    }
    
    startAutoScroll() {
        const carousel = this.carousel;
        const cardWidth = carousel.querySelector('.formula-card').offsetWidth;
        const gap = parseInt(window.getComputedStyle(carousel).gap) || 0;
        const cardWithGap = cardWidth + gap;
        const visibleCards = Math.ceil(carousel.clientWidth / cardWithGap);
        const totalCards = carousel.querySelectorAll('.formula-card').length;
        
        let currentScroll = carousel.scrollLeft;
        const maxScroll = (totalCards - visibleCards) * cardWithGap;
        
        // Clear any existing interval
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
        }
        
        this.scrollInterval = setInterval(() => {
            if (!this.isMobile()) {
                clearInterval(this.scrollInterval);
                return;
            }
            
            currentScroll += 2;
            
            if (currentScroll > maxScroll) {
                currentScroll = 0;
            }
            
            carousel.scrollLeft = currentScroll;
        }, 50);
    }
    
    init() {
        this.setupAutoScroll();
        
        // Reinitialize on resize
        window.addEventListener('resize', () => {
            this.init();
        });
    }
}

// Initialize formulas carousel when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FormulasCarousel();
    });
} else {
    new FormulasCarousel();
}

/* ========================================
   CONSOLE BRANDING
   ======================================== */

console.log('%c🌸 TheIconique Enhanced! 🌸', 'color: #c4899a; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cPremium Cosmetics with Enhanced User Experience', 'color: #d4a5b0; font-size: 16px; font-weight: 600;');
console.log('%c✨ Features: Responsive Design | Touch Support | Firebase Integration | Smooth Animations', 'color: #8a6b7a; font-size: 12px;');
console.log('%cDeveloped with ❤️ by DevPy Technologies', 'color: #666; font-size: 11px; font-style: italic;');