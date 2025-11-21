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

/* ========================================
   ENHANCED CAROUSEL CLASS
   With proper mobile swipe/gesture support
   ======================================== */

class EnhancedCarousel {
    constructor(config) {
        this.carousel = document.querySelector(config.carouselSelector);
        this.track = document.querySelector(config.trackSelector);
        this.leftArrow = document.querySelector(config.leftArrowSelector);
        this.rightArrow = document.querySelector(config.rightArrowSelector);
        this.carouselType = config.type || 'product';
        
        if (!this.carousel || !this.track) {
            console.warn('Carousel elements not found');
            return;
        }
        
        this.cards = Array.from(this.track.children);
        this.totalCards = this.cards.length;
        
        if (this.totalCards === 0) {
            console.warn('No cards found in carousel');
            return;
        }
        
        this.currentIndex = 0;
        this.gap = 16;
        this.cardWidth = 0;
        
        // Touch/swipe state
        this.isDragging = false;
        this.startX = 0;
        this.startTranslate = 0;
        this.currentTranslate = 0;
        
        this.init();
    }
    
    getVisibleCards() {
        const w = window.innerWidth;
        if (w <= 768) return 1;
        if (w <= 1024) return 2;
        return 3;
    }
    
    init() {
        // Wait for images to load to get correct dimensions
        this.waitForImages().then(() => {
            this.calculateDimensions();
            this.setupTouchEvents();
            this.setupArrowEvents();
            this.setupResizeHandler();
            this.updateArrows();
            
            // Set initial cursor
            this.track.style.cursor = 'grab';
            
            console.log(`✅ Carousel initialized: ${this.totalCards} cards, ${this.cardWidth}px width`);
        });
    }
    
    waitForImages() {
        const images = this.track.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        });
        return Promise.all(promises);
    }
    
    calculateDimensions() {
        const firstCard = this.cards[0];
        if (!firstCard) return;
        
        // Get computed gap
        const trackStyle = window.getComputedStyle(this.track);
        this.gap = parseInt(trackStyle.gap) || parseInt(trackStyle.columnGap) || 16;
        
        // Get card width including any margins
        const cardStyle = window.getComputedStyle(firstCard);
        const marginLeft = parseInt(cardStyle.marginLeft) || 0;
        const marginRight = parseInt(cardStyle.marginRight) || 0;
        this.cardWidth = firstCard.offsetWidth + marginLeft + marginRight;
        
        // If cardWidth is still 0, use a fallback
        if (this.cardWidth === 0) {
            this.cardWidth = this.carousel.offsetWidth * 0.85; // 85% of container
        }
        
        this.visibleCards = this.getVisibleCards();
        
        // Clamp current index
        const maxIndex = this.getMaxIndex();
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
        }
        
        this.updatePosition(false);
    }
    
    getMaxIndex() {
        return Math.max(0, this.totalCards - this.visibleCards);
    }
    
    setupTouchEvents() {
        // Touch events for mobile
        this.track.addEventListener('touchstart', (e) => this.onDragStart(e.touches[0].clientX), { passive: true });
        this.track.addEventListener('touchmove', (e) => {
            this.onDragMove(e.touches[0].clientX);
            // Prevent page scroll when swiping carousel
            if (this.isDragging) {
                e.preventDefault();
            }
        }, { passive: false });
        this.track.addEventListener('touchend', () => this.onDragEnd());
        this.track.addEventListener('touchcancel', () => this.onDragEnd());
        
        // Mouse events for desktop
        this.track.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.onDragStart(e.clientX);
        });
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.onDragMove(e.clientX);
            }
        });
        document.addEventListener('mouseup', () => this.onDragEnd());
        
        // Prevent image dragging
        this.cards.forEach(card => {
            card.querySelectorAll('img').forEach(img => {
                img.draggable = false;
            });
            // Prevent click events during drag
            card.addEventListener('click', (e) => {
                if (this.wasDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);
        });
    }
    
    setupArrowEvents() {
        if (this.leftArrow) {
            this.leftArrow.addEventListener('click', () => this.slidePrev());
        }
        if (this.rightArrow) {
            this.rightArrow.addEventListener('click', () => this.slideNext());
        }
    }
    
    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.calculateDimensions();
                this.updateArrows();
            }, 150);
        });
    }
    
    onDragStart(clientX) {
        this.isDragging = true;
        this.wasDragging = false;
        this.startX = clientX;
        this.startTranslate = this.currentTranslate;
        
        // Remove transition during drag
        this.track.style.transition = 'none';
        this.track.style.cursor = 'grabbing';
    }
    
    onDragMove(clientX) {
        if (!this.isDragging) return;
        
        const diff = clientX - this.startX;
        
        // Mark as dragging if moved more than 5px
        if (Math.abs(diff) > 5) {
            this.wasDragging = true;
        }
        
        let newTranslate = this.startTranslate + diff;
        
        // Calculate bounds
        const minTranslate = -(this.getMaxIndex() * (this.cardWidth + this.gap));
        const maxTranslate = 0;
        
        // Add rubber band effect at edges
        if (newTranslate > maxTranslate) {
            const overscroll = newTranslate - maxTranslate;
            newTranslate = maxTranslate + overscroll * 0.3;
        } else if (newTranslate < minTranslate) {
            const overscroll = minTranslate - newTranslate;
            newTranslate = minTranslate - overscroll * 0.3;
        }
        
        this.currentTranslate = newTranslate;
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    onDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        
        const movedBy = this.currentTranslate - this.startTranslate;
        
        // Lower threshold for easier swiping (15% of card width or 50px minimum)
        const threshold = Math.min(this.cardWidth * 0.15, 50);
        
        console.log(`Swipe: moved ${movedBy}px, threshold ${threshold}px, cardWidth ${this.cardWidth}px`);
        
        if (movedBy < -threshold && this.currentIndex < this.getMaxIndex()) {
            // Swiped left - go to next
            this.currentIndex++;
            console.log('Sliding to next:', this.currentIndex);
        } else if (movedBy > threshold && this.currentIndex > 0) {
            // Swiped right - go to prev
            this.currentIndex--;
            console.log('Sliding to prev:', this.currentIndex);
        }
        
        // Snap to position with animation
        this.updatePosition(true);
        this.updateArrows();
    }
    
    slidePrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updatePosition(true);
            this.updateArrows();
        }
    }
    
    slideNext() {
        if (this.currentIndex < this.getMaxIndex()) {
            this.currentIndex++;
            this.updatePosition(true);
            this.updateArrows();
        }
    }
    
    updatePosition(animate = true) {
        if (animate) {
            this.track.style.transition = 'transform 0.3s ease-out';
        } else {
            this.track.style.transition = 'none';
        }
        
        this.currentTranslate = -(this.currentIndex * (this.cardWidth + this.gap));
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        
        console.log(`Position updated: index ${this.currentIndex}, translate ${this.currentTranslate}px`);
    }
    
    updateArrows() {
        const maxIndex = this.getMaxIndex();
        
        if (this.leftArrow) {
            const isDisabled = this.currentIndex === 0;
            this.leftArrow.disabled = isDisabled;
            this.leftArrow.style.opacity = isDisabled ? '0.3' : '1';
            this.leftArrow.style.pointerEvents = isDisabled ? 'none' : 'auto';
        }
        
        if (this.rightArrow) {
            const isDisabled = this.currentIndex >= maxIndex;
            this.rightArrow.disabled = isDisabled;
            this.rightArrow.style.opacity = isDisabled ? '0.3' : '1';
            this.rightArrow.style.pointerEvents = isDisabled ? 'none' : 'auto';
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
        
        // Animate click feedback
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            if (!card.matches(':hover') || responsive.touchDevice) {
                card.style.transform = '';
            }
        }, 150);
        
        // Show coming soon message with better UX
        this.showComingSoonNotification(type);
        
        console.log(`${type} card clicked - Add to cart functionality coming soon`);
    }
    
    showComingSoonNotification(type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'coming-soon-notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Shopping cart coming soon!</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
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
                this.showComingSoonNotification('cart');
                console.log('Cart page will be implemented in next phase');
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
                leftArrowSelector: '.bundle-arrow-left',
                rightArrowSelector: '.bundle-arrow-right',
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new TheIconiqueApp();
        app.init();
    });


    
} else {
    // DOM already loaded
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
   CONSOLE BRANDING
   ======================================== */

console.log('%c🌸 TheIconique Enhanced! 🌸', 'color: #c4899a; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cPremium Cosmetics with Enhanced User Experience', 'color: #d4a5b0; font-size: 16px; font-weight: 600;');
console.log('%c✨ Features: Responsive Design | Touch Support | Firebase Integration | Smooth Animations', 'color: #8a6b7a; font-size: 12px;');
console.log('%cDeveloped with ❤️ by DevPy Technologies', 'color: #666; font-size: 11px; font-style: italic;');
