/* ========================================
   FIREBASE CONFIGURATION
   ======================================== */

// TODO: Replace with your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.warn("Firebase not configured. Newsletter emails will not be saved.", error);
}

/* ========================================
   MOBILE NAVIGATION TOGGLE
   ======================================== */

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileNavClose = document.querySelector('.mobile-nav-close');

// Open mobile navigation
function openMobileNav() {
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
}

// Close mobile navigation
function closeMobileNav() {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore body scroll
}

// Event listeners for mobile navigation
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileNav);
}

if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
}

if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
}

// Close mobile nav when clicking a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!link.classList.contains('disabled')) {
            closeMobileNav();
        }
    });
});

/* ========================================
   HERO CAROUSEL - Continuous Auto-Scrolling Slideshow
   Automatically cycles through hero images continuously from left to right
   Starts after 1 second delay with smooth transitions
   Never pauses - keeps moving even on hover for uninterrupted visual flow
   ======================================== */

const heroSection = document.querySelector('.hero-section');
const heroTrack = document.querySelector('.hero-track');
const heroSlides = document.querySelectorAll('.hero-slide');

if (heroSection && heroTrack && heroSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = 5; // Total number of hero images
    const slideInterval = 3000; // Change slide every 3 seconds
    const initialDelay = 1000; // 1 second delay before starting
    let autoSlide;
    let isTransitioning = false;
    
    // Function to show specific slide with smooth transitions
    function showSlide(index, instant = false) {
        if (isTransitioning && !instant) return;
        
        const slideWidth = heroSlides[0].offsetWidth;
        const translateX = -index * slideWidth;
        
        if (instant) {
            heroTrack.style.transition = 'none';
            heroTrack.style.transform = `translateX(${translateX}px)`;
            // Force reflow
            heroTrack.offsetHeight;
            heroTrack.style.transition = 'transform 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
        } else {
            heroTrack.style.transform = `translateX(${translateX}px)`;
        }
        
        currentSlide = index;
    }
    
    // Function to go to next slide with smooth infinite loop
    function nextSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentSlide++;
        
        if (currentSlide >= totalSlides) {
            // Show transition to next slide, then instantly reset to first
            showSlide(currentSlide);
            
            setTimeout(() => {
                currentSlide = 0;
                showSlide(0, true);
                isTransitioning = false;
            }, 1000); // Wait for transition to complete
        } else {
            showSlide(currentSlide);
            setTimeout(() => {
                isTransitioning = false;
            }, 1000);
        }
    }
    
    // Start auto-advance (continuous - never stops)
    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, slideInterval);
    }
    
    // Handle window resize to recalculate positions
    window.addEventListener('resize', () => {
        showSlide(currentSlide, true);
    });
    
    // Initialize carousel with 1 second delay
    showSlide(0, true);
    setTimeout(() => {
        startAutoSlide();
    }, initialDelay);
}

/* ========================================
   FEATURED PRODUCTS CAROUSEL
   ======================================== */

class ProductCarousel {
    constructor(carouselSelector, trackSelector, leftArrowSelector, rightArrowSelector) {
        this.carousel = document.querySelector(carouselSelector);
        this.track = document.querySelector(trackSelector);
        this.leftArrow = document.querySelector(leftArrowSelector);
        this.rightArrow = document.querySelector(rightArrowSelector);
        
        if (!this.carousel || !this.track) return;
        
        this.currentPosition = 0;
        this.cardWidth = 0;
        this.visibleCards = 0;
        this.totalCards = this.track.children.length;
        
        this.init();
    }
    
    init() {
        // Calculate dimensions
        this.calculateDimensions();
        
        // Initially hide left arrow
        if (this.leftArrow) {
            this.leftArrow.classList.add('hidden');
        }
        
        // Event listeners for arrows
        if (this.leftArrow) {
            this.leftArrow.addEventListener('click', () => this.slideLeft());
        }
        
        if (this.rightArrow) {
            this.rightArrow.addEventListener('click', () => this.slideRight());
        }
        
        // Recalculate on window resize
        window.addEventListener('resize', () => this.calculateDimensions());
        
        // Update arrow visibility
        this.updateArrows();
    }
    
    calculateDimensions() {
        const firstCard = this.track.children[0];
        if (!firstCard) return;
        
        // Get card width including gap
        const cardStyle = window.getComputedStyle(firstCard);
        this.cardWidth = firstCard.offsetWidth + parseInt(cardStyle.marginRight || 0);
        
        // Calculate visible cards
        this.visibleCards = Math.floor(this.carousel.offsetWidth / this.cardWidth);
        
        // Reset position if needed
        const maxPosition = Math.max(0, this.totalCards - this.visibleCards);
        if (this.currentPosition > maxPosition) {
            this.currentPosition = maxPosition;
            this.updatePosition();
        }
    }
    
    slideLeft() {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            this.updatePosition();
            this.updateArrows();
        }
    }
    
    slideRight() {
        const maxPosition = this.totalCards - this.visibleCards;
        if (this.currentPosition < maxPosition) {
            this.currentPosition++;
            this.updatePosition();
            this.updateArrows();
        }
    }
    
    updatePosition() {
        const translateX = -this.currentPosition * this.cardWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
    }
    
    updateArrows() {
        // Show/hide left arrow
        if (this.leftArrow) {
            if (this.currentPosition === 0) {
                this.leftArrow.classList.add('hidden');
            } else {
                this.leftArrow.classList.remove('hidden');
            }
        }
        
        // Show/hide right arrow
        if (this.rightArrow) {
            const maxPosition = this.totalCards - this.visibleCards;
            if (this.currentPosition >= maxPosition || this.totalCards <= this.visibleCards) {
                this.rightArrow.classList.add('hidden');
            } else {
                this.rightArrow.classList.remove('hidden');
            }
        }
    }
}

// Initialize Featured Products Carousel
const productsCarousel = new ProductCarousel(
    '.products-carousel',
    '.products-track',
    '.arrow-left',
    '.arrow-right'
);

/* ========================================
   BUNDLES CAROUSEL
   ======================================== */

// Initialize Bundles Carousel
const bundlesCarousel = new ProductCarousel(
    '.bundles-carousel',
    '.bundles-track',
    '.bundle-arrow-left',
    '.bundle-arrow-right'
);

/* ========================================
   PRODUCT CARD INTERACTIONS
   ======================================== */

// Add click handlers to product cards (currently disabled for cart functionality)
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent default behavior
        e.preventDefault();
        
        // Show message that cart functionality is coming soon
        console.log('Add to cart functionality will be implemented in next phase');
        
        // Optional: Add visual feedback
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
    
    // Add pointer cursor to indicate interactivity
    card.style.cursor = 'pointer';
});

// Same for bundle cards
const bundleCards = document.querySelectorAll('.bundle-card');
bundleCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add bundle to cart functionality will be implemented in next phase');
        
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
    
    card.style.cursor = 'pointer';
});

/* ========================================
   NEWSLETTER FORM - Firebase Integration
   ======================================== */

const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMessage = document.getElementById('newsletterMessage');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = newsletterEmail.value.trim();
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Check if Firebase is configured
        if (!db) {
            showNewsletterMessage('Firebase not configured. Please set up Firebase to save emails.', 'error');
            return;
        }
        
        try {
            // Show loading state
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            // Save email to Firebase Firestore
            await db.collection('newsletter_subscribers').add({
                email: email,
                subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
                source: 'homepage'
            });
            
            // Success message
            showNewsletterMessage('Thank you for subscribing! 🎉', 'success');
            newsletterEmail.value = '';
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
        } catch (error) {
            console.error('Error saving email:', error);
            showNewsletterMessage('An error occurred. Please try again later.', 'error');
            
            // Reset button
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Subscribe';
            submitButton.disabled = false;
        }
    });
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show newsletter message helper function
function showNewsletterMessage(message, type) {
    if (!newsletterMessage) return;
    
    newsletterMessage.textContent = message;
    newsletterMessage.style.color = type === 'success' ? '#4CAF50' : '#f44336';
    newsletterMessage.style.fontWeight = '600';
    
    // Clear message after 5 seconds
    setTimeout(() => {
        newsletterMessage.textContent = '';
    }, 5000);
}

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && !this.classList.contains('disabled')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* ========================================
   LAZY LOADING FOR IMAGES - REMOVED
   ======================================== */

// Lazy loading removed as images use src attribute directly
// Images will load immediately when page loads

/* ========================================
   SHOPPING CART FUNCTIONALITY (PLACEHOLDER)
   ======================================== */

// Initialize cart count
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

function updateCartCount(count) {
    cartCount = count;
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Cart icon click handler
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        console.log('Shopping cart page will be implemented in next phase');
        // TODO: Navigate to cart page when implemented
    });
}

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
   ======================================== */

// Add keyboard navigation support for carousels
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        const focusedCarousel = document.activeElement.closest('.products-carousel-wrapper, .bundles-carousel-wrapper');
        if (focusedCarousel) {
            const leftArrow = focusedCarousel.querySelector('.arrow-left, .bundle-arrow-left');
            if (leftArrow && !leftArrow.classList.contains('hidden')) {
                leftArrow.click();
            }
        }
    } else if (e.key === 'ArrowRight') {
        const focusedCarousel = document.activeElement.closest('.products-carousel-wrapper, .bundles-carousel-wrapper');
        if (focusedCarousel) {
            const rightArrow = focusedCarousel.querySelector('.arrow-right, .bundle-arrow-right');
            if (rightArrow && !rightArrow.classList.contains('hidden')) {
                rightArrow.click();
            }
        }
    } else if (e.key === 'Escape') {
        closeMobileNav();
    }
});

/* ========================================
   PAGE LOAD ANIMATIONS
   ======================================== */

// Add fade-in animation for sections on page load
window.addEventListener('load', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});

/* ========================================
   SCROLL ANIMATIONS & VISUAL ENHANCEMENTS
   ======================================== */

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Header scroll effect
let lastScrollY = window.scrollY;
const headerElement = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for header styling
    if (currentScrollY > 100) {
        headerElement?.classList.add('scrolled');
    } else {
        headerElement?.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
});

// Product card animations
function animateProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 150);
    });
}

// Initialize animations when DOM is loaded
function initializeAnimations() {
    // Add animate-on-scroll class to elements
    const animatedElements = document.querySelectorAll('.section-title, .newsletter-content');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        scrollObserver.observe(el);
    });
    
    // Animate product cards
    setTimeout(animateProductCards, 800);
}

// Enhanced mobile menu animations
function enhanceMobileMenu() {
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    
    mobileNavLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
    });
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation to images
function addImageLoadingEffects() {
    const images = document.querySelectorAll('img:not(.hero-slide img)');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Set initial state
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Enhanced page initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 TheIconique Enhanced - Loading animations and interactions...');
    
    // Initialize all enhancements
    initializeAnimations();
    enhanceMobileMenu();
    initializeSmoothScroll();
    addImageLoadingEffects();
    
    // Add smooth body reveal
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 200);
});

/* ========================================
   CONSOLE WELCOME MESSAGE
   ======================================== */

console.log('%c🌸 Welcome to TheIconique Enhanced! 🌸', 'color: #c4899a; font-size: 20px; font-weight: bold;');
console.log('%cPremium Cosmetic Products with Beautiful Animations', 'color: #d4a5b0; font-size: 14px;');
console.log('%cDeveloped by DevPy Technologies', 'color: #777; font-size: 12px;');
