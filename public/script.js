// ========================================
// MAIN SCRIPT - SHARED ACROSS ALL PAGES
// ========================================

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

/**
 * Main initialization function
 */
function initializePage() {
    // Header and navigation
    initMobileNavigation();
    initHeaderScroll();
    initNavigation();
    
    // Search functionality
    initSearchFunctionality();
    
    // Cart functionality
    initCart();
    
    // Hero section
    initHeroSection();
    
    // Product carousels
    initProductCarousels();
    
    // Bundle carousels
    initBundleCarousels();
    
    // Smooth scroll animations
    initScrollAnimations();
    
    // Newsletter form
    initNewsletterForm();
    
    // About us page specific
    if (document.querySelector('.aboutus-section')) {
        initFormulasCarousel();
        initValuesAccordion();
    }
}

// ========================================
// MOBILE NAVIGATION
// ========================================

function initMobileNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');

    if (!mobileMenuToggle) return;

    // Open mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close mobile menu
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close on close button
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }

    // Close on overlay click
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close on link click
    mobileNavLinks.forEach(link => {
        if (!link.classList.contains('disabled')) {
            link.addEventListener('click', closeMobileMenu);
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========================================
// NAVIGATION ACTIVE STATE
// ========================================

function initNavigation() {
    const currentUrl = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !link.classList.contains('disabled')) {
            if (currentUrl.includes(href) || (href === 'index.html' && currentUrl.includes('index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

function initSearchFunctionality() {
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchTags = document.querySelectorAll('.search-tag');

    if (!searchIcon || !searchOverlay) return;

    // Open search overlay
    searchIcon.addEventListener('click', function() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 100);
    });

    // Close search overlay
    function closeSearch() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (searchInput) searchInput.value = '';
    }

    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    // Close on overlay click
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSearch();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // Search functionality
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Search tags
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = this.textContent;
                performSearch();
            }
        });
    });
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;

    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm.length === 0) {
        searchResults.innerHTML = '';
        return;
    }

    // Sample product data for search
    const products = [
        { id: 1, name: 'Luxe Lipstick', price: '$29.99', image: 'images/productimages/product1.jpg', category: 'lips' },
        { id: 2, name: 'Radiant Foundation', price: '$45.99', image: 'images/productimages/product2.jpg', category: 'face' },
        { id: 3, name: 'Glow Serum', price: '$59.99', image: 'images/productimages/product3.jpg', category: 'skincare' },
        { id: 4, name: 'Eyeshadow Palette', price: '$39.99', image: 'images/productimages/product4.jpg', category: 'eyes' },
        { id: 5, name: 'Mascara Pro', price: '$24.99', image: 'images/productimages/product5.jpg', category: 'eyes' }
    ];

    // Filter products
    const results = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    // Display results
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <p>No products found for "${searchTerm}"</p>
                <p>Try searching for: lipstick, foundation, serum, eyeshadow, or mascara</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(product => `
            <div class="search-result-item">
                <img src="${product.image}" alt="${product.name}" class="search-result-image">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.price}</p>
                </div>
            </div>
        `).join('');
    }
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

    const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);

    cartCountElements.forEach(el => {
        el.textContent = totalQuantity;

        if (totalQuantity > 0) {
            el.classList.add('animate-pulse');
        }
    });
}

// ========================================
// HERO SECTION
// ========================================

function initHeroSection() {
    const heroImageContainer = document.querySelector('.hero-image-container');
    const heroImages = document.querySelectorAll('.hero-image');

    if (!heroImageContainer || heroImages.length === 0) return;

    // Add loaded class when images are loaded
    heroImages.forEach(img => {
        if (img.complete) {
            heroImageContainer.classList.add('loaded');
        }
        img.addEventListener('load', function() {
            heroImageContainer.classList.add('loaded');
        });
    });

    // Parallax effect on scroll (optional)
    window.addEventListener('scroll', function() {
        if (window.innerWidth > 768) {
            const scrollY = window.scrollY;
            heroImages.forEach(img => {
                img.style.transform = `translateY(${scrollY * 0.5}px)`;
            });
        }
    });
}

// ========================================
// PRODUCT CAROUSEL
// ========================================

function initProductCarousels() {
    const carousel = document.querySelector('.products-carousel');
    const track = document.querySelector('.products-track');
    const cards = document.querySelectorAll('.product-card');
    const leftArrow = document.querySelector('.featured-products .arrow-left');
    const rightArrow = document.querySelector('.featured-products .arrow-right');
    const dots = document.querySelectorAll('#products-dots .carousel-dot');

    if (!carousel || !track || cards.length === 0) return;

    let currentIndex = 0;
    let isMobileView = window.innerWidth <= 768;

    // Determine visible cards based on screen width
    function getVisibleCards() {
        const width = window.innerWidth;
        if (width < 480) return 1;
        if (width < 768) return 1; // Mobile shows 1 card with scroll snap
        if (width < 1024) return 3;
        return 4;
    }

    // Get actual card width from DOM
    function getCardWidth() {
        if (cards.length === 0) return 0;
        const card = cards[0];
        const style = window.getComputedStyle(card);
        const width = card.offsetWidth;
        const marginRight = parseFloat(style.marginRight) || 0;
        const gap = 16; // var(--spacing-md) = 2rem = 32px, divided by 2
        return width + gap;
    }

    function updateArrowStates() {
        if (isMobileView) {
            // Hide arrows on mobile
            if (leftArrow) leftArrow.style.display = 'none';
            if (rightArrow) rightArrow.style.display = 'none';
            return;
        }

        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        if (leftArrow) {
            leftArrow.disabled = currentIndex === 0;
            leftArrow.style.display = '';
        }
        if (rightArrow) {
            rightArrow.disabled = currentIndex >= maxIndex;
            rightArrow.style.display = '';
        }
    }

    function scrollToIndex(index) {
        if (isMobileView) return; // Mobile uses native scroll snap

        const cardWidth = getCardWidth();
        const scrollAmount = index * cardWidth;

        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateArrowStates();
        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Arrow click handlers (desktop only)
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            if (currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            }
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            const maxIndex = Math.max(0, cards.length - visibleCards);
            if (currentIndex < maxIndex) {
                scrollToIndex(currentIndex + 1);
            }
        });
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isMobileView) {
                scrollToIndex(index);
            }
        });
    });

    // Update on resize
    window.addEventListener('resize', () => {
        const wasMobile = isMobileView;
        isMobileView = window.innerWidth <= 768;
        
        if (wasMobile !== isMobileView) {
            currentIndex = 0;
            updateArrowStates();
            updateDots();
        }
    });

    updateArrowStates();
}

// ========================================
// BUNDLE CAROUSEL
// ========================================

function initBundleCarousels() {
    const carousel = document.querySelector('.bundles-carousel');
    const track = document.querySelector('.bundles-track');
    const cards = document.querySelectorAll('.bundle-card');
    const leftArrow = document.querySelector('.bundles-section .arrow-left');
    const rightArrow = document.querySelector('.bundles-section .arrow-right');
    const dots = document.querySelectorAll('#bundles-dots .carousel-dot');

    if (!carousel || !track || cards.length === 0) return;

    let currentIndex = 0;
    let isMobileView = window.innerWidth <= 768;

    function getVisibleCards() {
        const width = window.innerWidth;
        if (width < 480) return 1;
        if (width < 768) return 1; // Mobile shows 1 card with scroll snap
        if (width < 1024) return 3;
        return 4;
    }

    // Get actual card width from DOM
    function getCardWidth() {
        if (cards.length === 0) return 0;
        const card = cards[0];
        const width = card.offsetWidth;
        const gap = 16; // var(--spacing-md) = 2rem = 32px, divided by 2
        return width + gap;
    }

    function updateArrowStates() {
        if (isMobileView) {
            // Hide arrows on mobile
            if (leftArrow) leftArrow.style.display = 'none';
            if (rightArrow) rightArrow.style.display = 'none';
            return;
        }

        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        if (leftArrow) {
            leftArrow.disabled = currentIndex === 0;
            leftArrow.style.display = '';
        }
        if (rightArrow) {
            rightArrow.disabled = currentIndex >= maxIndex;
            rightArrow.style.display = '';
        }
    }

    function scrollToIndex(index) {
        if (isMobileView) return; // Mobile uses native scroll snap

        const cardWidth = getCardWidth();
        const scrollAmount = index * cardWidth;

        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateArrowStates();
        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            if (currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            }
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            const maxIndex = Math.max(0, cards.length - visibleCards);
            if (currentIndex < maxIndex) {
                scrollToIndex(currentIndex + 1);
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isMobileView) {
                scrollToIndex(index);
            }
        });
    });

    window.addEventListener('resize', () => {
        const wasMobile = isMobileView;
        isMobileView = window.innerWidth <= 768;
        
        if (wasMobile !== isMobileView) {
            currentIndex = 0;
            updateArrowStates();
            updateDots();
        }
    });

    updateArrowStates();
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Observer can stop observing after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animate-on-scroll elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .section-title');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// NEWSLETTER FORM
// ========================================

function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const messageEl = document.getElementById('newsletterMessage');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Simple email validation
        if (!email || !isValidEmail(email)) {
            showMessage(messageEl, 'Please enter a valid email address', 'error');
            return;
        }

        // Simulate subscription
        showMessage(messageEl, 'Thank you for subscribing! Check your email for confirmation.', 'success');
        emailInput.value = '';

        // Clear message after 5 seconds
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.classList.remove('show');
        }, 5000);
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    element.style.color = type === 'success' ? '#28a745' : '#dc3545';
}

// ========================================
// ABOUT US PAGE - FORMULAS CAROUSEL
// ========================================

function initFormulasCarousel() {
    const carousel = document.querySelector('.formulas-carousel');
    const cards = document.querySelectorAll('.formula-card');
    const indicators = document.querySelectorAll('.formulas-indicators .indicator');

    if (!carousel || cards.length === 0) return;

    let currentIndex = 0;
    let autoScrollInterval;
    const autoScrollDelay = 4000;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function getCardsToShow() {
        return isMobile() ? 1 : 2;
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - getCardsToShow());
    }

    function scrollToIndex(index) {
        const cardWidth = cards[0].offsetWidth;
        const gap = 20;
        const scrollAmount = index * (cardWidth + gap);

        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });

        currentIndex = index;
        updateIndicators();
    }

    function updateIndicators() {
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }

    function nextCard() {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            scrollToIndex(currentIndex + 1);
        } else {
            scrollToIndex(0);
        }
    }

    function startAutoScroll() {
        if (!isMobile()) {
            autoScrollInterval = setInterval(nextCard, autoScrollDelay);
        }
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            scrollToIndex(index);
            stopAutoScroll();
            startAutoScroll();
        });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    // Touch swipe
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    });

    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextCard();
            } else {
                const newIndex = Math.max(0, currentIndex - 1);
                scrollToIndex(newIndex);
            }
        }
        startAutoScroll();
    });

    // Window resize
    window.addEventListener('resize', () => {
        stopAutoScroll();
        scrollToIndex(Math.min(currentIndex, getMaxIndex()));
        startAutoScroll();
    });

    startAutoScroll();
}

// ========================================
// ABOUT US PAGE - VALUES ACCORDION
// ========================================

function initValuesAccordion() {
    const headers = document.querySelectorAll('.value-card-header');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            const valueCard = this.closest('.value-card');
            const content = valueCard.querySelector('.value-card-content');
            const isActive = this.classList.contains('active');

            // Close all other cards
            document.querySelectorAll('.value-card-header').forEach(h => {
                if (h !== this) {
                    h.classList.remove('active');
                    h.closest('.value-card').querySelector('.value-card-content').classList.remove('active');
                }
            });

            // Toggle current card
            this.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}

// ========================================
// PAGE LOAD ANIMATIONS
// ========================================

window.addEventListener('load', function() {
    // Add animate-in class to visible elements
    const animateElements = document.querySelectorAll('.product-card, .section-title');
    animateElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, index * 50);
    });

    // Fade in body
    document.body.style.opacity = '1';
});
