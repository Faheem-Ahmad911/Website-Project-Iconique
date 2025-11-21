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

class HeroSlider {
    constructor() {
        this.track = document.querySelector('.hero-track');
        this.slides = document.querySelectorAll('.hero-slide');

        if (!this.track || this.slides.length === 0) return;

        this.currentIndex = 0;
        this.slideWidth = this.slides[0].offsetWidth;
        this.speed = 3000; // slide change every 3 seconds

        this.cloneSlides();
        this.startSlider();
        window.addEventListener('resize', () => this.handleResize());
    }

    cloneSlides() {
        // Append all slides again to make an infinite loop
        this.slides.forEach(slide => {
            let clone = slide.cloneNode(true);
            this.track.appendChild(clone);
        });
    }

    startSlider() {
        setInterval(() => {
            this.currentIndex++;

            this.track.style.transition = "transform 0.6s ease";
            this.track.style.transform = `translateX(-${this.slideWidth * this.currentIndex}px)`;

            // Reset after reaching original slide length
            if (this.currentIndex >= this.slides.length) {
                setTimeout(() => {
                    this.track.style.transition = "none";
                    this.currentIndex = 0;
                    this.track.style.transform = `translateX(0px)`;
                }, 600);
            }

        }, this.speed);
    }

    handleResize() {
        this.slideWidth = this.slides[0].offsetWidth;
        this.track.style.transition = "none";
        this.track.style.transform = `translateX(-${this.slideWidth * this.currentIndex}px)`;
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
        
        this.currentPosition = 0;
        this.cardWidth = 0;
        this.visibleCards = 0;
        this.totalCards = this.track.children.length;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateArrows();
        
        // Add CSS for smooth transitions
        this.track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    calculateDimensions() {
        const firstCard = this.track.children[0];
        if (!firstCard) return;
        
        const cardStyle = window.getComputedStyle(firstCard);
        const marginRight = parseInt(cardStyle.marginRight || 0);
        this.cardWidth = firstCard.offsetWidth + marginRight;
        
        // Responsive visible cards calculation
        this.visibleCards = responsive.getVisibleCards(
            this.carousel.offsetWidth, 
            this.cardWidth, 
            1
        );
        
        // Ensure we don't exceed available cards
        this.visibleCards = Math.min(this.visibleCards, this.totalCards);
        
        // Reset position if needed
        const maxPosition = Math.max(0, this.totalCards - this.visibleCards);
        if (this.currentPosition > maxPosition) {
            this.currentPosition = maxPosition;
            this.updatePosition();
        }
        
        this.updateArrows();
    }
    
    setupEventListeners() {
        // Arrow click handlers
        if (this.leftArrow) {
            this.leftArrow.addEventListener('click', () => this.slideLeft());
        }
        
        if (this.rightArrow) {
            this.rightArrow.addEventListener('click', () => this.slideRight());
        }
        
        // Touch support
        if (responsive.touchDevice) {
            this.addTouchSupport();
        }
        
        // Keyboard support
        this.carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.slideLeft();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.slideRight();
            }
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.calculateDimensions();
            }, 150);
        });
    }
    
    addTouchSupport() {
        this.carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            // Prevent default scrolling while swiping
            if (Math.abs(e.changedTouches[0].screenX - this.touchStartX) > 10) {
                e.preventDefault();
            }
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.slideRight();
            } else {
                this.slideLeft();
            }
        }
    }
    
    slideLeft() {
        if (this.currentPosition > 0 && !this.isAnimating) {
            this.isAnimating = true;
            this.currentPosition--;
            this.updatePosition();
            this.updateArrows();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        }
    }
    
    slideRight() {
        const maxPosition = Math.max(0, this.totalCards - this.visibleCards);
        if (this.currentPosition < maxPosition && !this.isAnimating) {
            this.isAnimating = true;
            this.currentPosition++;
            this.updatePosition();
            this.updateArrows();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        }
    }
    
    updatePosition() {
        const translateX = -this.currentPosition * this.cardWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
    }
    
    updateArrows() {
        // Update left arrow
        if (this.leftArrow) {
            if (this.currentPosition === 0) {
                this.leftArrow.classList.add('disabled');
                this.leftArrow.style.opacity = '0.3';
                this.leftArrow.disabled = true;
            } else {
                this.leftArrow.classList.remove('disabled');
                this.leftArrow.style.opacity = '1';
                this.leftArrow.disabled = false;
            }
        }
        
        // Update right arrow
        if (this.rightArrow) {
            const maxPosition = Math.max(0, this.totalCards - this.visibleCards);
            if (this.currentPosition >= maxPosition || this.totalCards <= this.visibleCards) {
                this.rightArrow.classList.add('disabled');
                this.rightArrow.style.opacity = '0.3';
                this.rightArrow.disabled = true;
            } else {
                this.rightArrow.classList.remove('disabled');
                this.rightArrow.style.opacity = '1';
                this.rightArrow.disabled = false;
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
        this.cartCount = 0;
        
        this.init();
    }
    
    init() {
        this.setupProductCardHandlers();
        this.setupBundleCardHandlers();
        this.setupCartHandler();
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
            }, 600);
        }
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
            this.components.heroSlider = new HeroSlider();
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
