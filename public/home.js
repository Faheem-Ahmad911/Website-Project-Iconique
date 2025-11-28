/* ========================================
   HOME PAGE - JAVASCRIPT FUNCTIONALITY
   Handles: Carousels, Mobile Navigation, Search, Responsive behavior
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
    // ========================================
    // MOBILE NAVIGATION TOGGLE
    // ========================================
    
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
    
    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    
    const searchIcon = document.querySelector(".search-icon");
    const searchOverlay = document.querySelector(".search-overlay");
    const searchClose = document.querySelector(".search-close");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.querySelector(".search-btn");
    
    if (searchIcon) {
        searchIcon.addEventListener("click", function() {
            searchOverlay.classList.add("active");
            if (searchInput) searchInput.focus();
        });
    }
    
    if (searchClose) {
        searchClose.addEventListener("click", function() {
            searchOverlay.classList.remove("active");
        });
    }
    
    if (searchOverlay) {
        searchOverlay.addEventListener("click", function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove("active");
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener("click", function() {
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            console.log("Searching for:", query);
            // Add your search logic here
        }
    }
    
    // ========================================
    // CART FUNCTIONALITY
    // ========================================
    
    const cartIcon = document.querySelector(".cart-icon");
    const cartCount = document.querySelector(".cart-count");
    
    if (cartIcon) {
        cartIcon.addEventListener("click", function() {
            console.log("Cart clicked");
            // Add cart functionality here
        }
        );
    }
    
    // ========================================
    // HEADER SCROLL BEHAVIOR
    // ========================================
    
    const header = document.querySelector(".header");
    let lastScrollTop = 0;
    
    window.addEventListener("scroll", function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
    
    // ========================================
    // PRODUCTS CAROUSEL - Featured Products
    // ========================================
    
    const productCarousel = document.querySelector(".products-carousel");
    const productTrack = document.querySelector(".products-track");
    const productCards = document.querySelectorAll(".featured-products .product-card");
    const productDots = document.querySelectorAll(".featured-products .carousel-dot");
    const arrowLeft = document.querySelector(".featured-products .arrow-left");
    const arrowRight = document.querySelector(".featured-products .arrow-right");
    
    if (productCarousel && productTrack && productCards.length > 0) {
        let currentProductIndex = 0;
        
        // Check if mobile/tablet
        function isMobile() {
            return window.innerWidth <= 768;
        }
        
        // Get cards to show based on screen size
        function getCardsToShow() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth > 768) return 2;
            return 1;
        }
        
        // Scroll to specific index
        function scrollProductToIndex(index) {
            const cardWidth = productCards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(productCarousel).gap) || 0;
            const scrollAmount = (cardWidth + gap) * index;
            
            productCarousel.scrollTo({
                left: scrollAmount,
                behavior: "smooth"
            });
        }
        
        // Update active dot
        function updateProductDots(index) {
            const cardsToShow = getCardsToShow();
            const maxIndex = Math.max(0, productCards.length - cardsToShow);
            
            productDots.forEach((dot, i) => {
                dot.classList.toggle("active", i === (index % productDots.length));
            });
        }
        
        // Arrow click handlers
        if (arrowLeft) {
            arrowLeft.addEventListener("click", function() {
                const cardsToShow = getCardsToShow();
                currentProductIndex = Math.max(0, currentProductIndex - 1);
                scrollProductToIndex(currentProductIndex);
                updateProductDots(currentProductIndex);
            });
        }
        
        if (arrowRight) {
            arrowRight.addEventListener("click", function() {
                const cardsToShow = getCardsToShow();
                const maxIndex = Math.max(0, productCards.length - cardsToShow);
                currentProductIndex = Math.min(maxIndex, currentProductIndex + 1);
                scrollProductToIndex(currentProductIndex);
                updateProductDots(currentProductIndex);
            });
        }
        
        // Dot click handlers
        productDots.forEach((dot, index) => {
            dot.addEventListener("click", function() {
                currentProductIndex = index;
                scrollProductToIndex(currentProductIndex);
                updateProductDots(currentProductIndex);
            });
        });
        
        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        productCarousel.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        productCarousel.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleProductSwipe();
        }, false);
        
        function handleProductSwipe() {
            const cardsToShow = getCardsToShow();
            const maxIndex = Math.max(0, productCards.length - cardsToShow);
            const swipeThreshold = 50;
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swiped left, go to next
                currentProductIndex = Math.min(currentProductIndex + 1, maxIndex);
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swiped right, go to previous
                currentProductIndex = Math.max(currentProductIndex - 1, 0);
            }
            
            scrollProductToIndex(currentProductIndex);
            updateProductDots(currentProductIndex);
        }
        
        // Handle window resize
        window.addEventListener("resize", () => {
            scrollProductToIndex(currentProductIndex);
        });
        
        // Initialize dots
        updateProductDots(currentProductIndex);
    }
    
    // ========================================
    // BUNDLES CAROUSEL - Exclusive Bundles
    // ========================================
    
    const bundlesCarousel = document.querySelector(".bundles-carousel");
    const bundlesTrack = document.querySelector(".bundles-track");
    const bundleCards = document.querySelectorAll(".bundles-section .bundle-card");
    const bundleDots = document.querySelectorAll(".bundles-section .carousel-dot");
    const bundleArrowLeft = document.querySelector(".bundles-section .arrow-left");
    const bundleArrowRight = document.querySelector(".bundles-section .arrow-right");
    
    if (bundlesCarousel && bundlesTrack && bundleCards.length > 0) {
        let currentBundleIndex = 0;
        
        // Get cards to show based on screen size
        function getBundleCardsToShow() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth > 768) return 2;
            return 1;
        }
        
        // Scroll to specific index
        function scrollBundleToIndex(index) {
            const cardWidth = bundleCards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(bundlesCarousel).gap) || 0;
            const scrollAmount = (cardWidth + gap) * index;
            
            bundlesCarousel.scrollTo({
                left: scrollAmount,
                behavior: "smooth"
            });
        }
        
        // Update active dot
        function updateBundleDots(index) {
            const cardsToShow = getBundleCardsToShow();
            const maxIndex = Math.max(0, bundleCards.length - cardsToShow);
            
            bundleDots.forEach((dot, i) => {
                dot.classList.toggle("active", i === (index % bundleDots.length));
            });
        }
        
        // Arrow click handlers
        if (bundleArrowLeft) {
            bundleArrowLeft.addEventListener("click", function() {
                const cardsToShow = getBundleCardsToShow();
                currentBundleIndex = Math.max(0, currentBundleIndex - 1);
                scrollBundleToIndex(currentBundleIndex);
                updateBundleDots(currentBundleIndex);
            });
        }
        
        if (bundleArrowRight) {
            bundleArrowRight.addEventListener("click", function() {
                const cardsToShow = getBundleCardsToShow();
                const maxIndex = Math.max(0, bundleCards.length - cardsToShow);
                currentBundleIndex = Math.min(maxIndex, currentBundleIndex + 1);
                scrollBundleToIndex(currentBundleIndex);
                updateBundleDots(currentBundleIndex);
            });
        }
        
        // Dot click handlers
        bundleDots.forEach((dot, index) => {
            dot.addEventListener("click", function() {
                currentBundleIndex = index;
                scrollBundleToIndex(currentBundleIndex);
                updateBundleDots(currentBundleIndex);
            });
        });
        
        // Touch swipe support for mobile
        let bundleTouchStartX = 0;
        let bundleTouchEndX = 0;
        
        bundlesCarousel.addEventListener("touchstart", (e) => {
            bundleTouchStartX = e.changedTouches[0].screenX;
        }, false);
        
        bundlesCarousel.addEventListener("touchend", (e) => {
            bundleTouchEndX = e.changedTouches[0].screenX;
            handleBundleSwipe();
        }, false);
        
        function handleBundleSwipe() {
            const cardsToShow = getBundleCardsToShow();
            const maxIndex = Math.max(0, bundleCards.length - cardsToShow);
            const swipeThreshold = 50;
            
            if (bundleTouchStartX - bundleTouchEndX > swipeThreshold) {
                // Swiped left, go to next
                currentBundleIndex = Math.min(currentBundleIndex + 1, maxIndex);
            } else if (bundleTouchEndX - bundleTouchStartX > swipeThreshold) {
                // Swiped right, go to previous
                currentBundleIndex = Math.max(currentBundleIndex - 1, 0);
            }
            
            scrollBundleToIndex(currentBundleIndex);
            updateBundleDots(currentBundleIndex);
        }
        
        // Handle window resize
        window.addEventListener("resize", () => {
            scrollBundleToIndex(currentBundleIndex);
        });
        
        // Initialize dots
        updateBundleDots(currentBundleIndex);
    }
    
    // ========================================
    // NEWSLETTER FORM SUBMISSION
    // ========================================
    
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterMessage = document.getElementById("newsletterMessage");
    
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const email = newsletterEmail.value.trim();
            
            if (!email) {
                showNewsletterMessage("Please enter a valid email", "error");
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterMessage("Please enter a valid email address", "error");
                return;
            }
            
            // Simulate form submission
            const submitBtn = newsletterForm.querySelector(".btn-subscribe");
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Subscribing...";
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNewsletterMessage("✓ Successfully subscribed! Check your email.", "success");
                newsletterForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    function showNewsletterMessage(message, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = message;
            newsletterMessage.className = "newsletter-message show";
            newsletterMessage.style.color = type === "success" ? "#4caf50" : "#ff6b6b";
            
            setTimeout(() => {
                newsletterMessage.classList.remove("show");
            }, 5000);
        }
    }
    
    // ========================================
    // VIEW MORE BUTTON FUNCTIONALITY
    // ========================================
    
    const viewMoreButtons = document.querySelectorAll(".btn-view-more");
    viewMoreButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            // This is handled by onclick attribute in HTML
            // But you can add additional logic here if needed
            console.log("View more clicked");
        });
    });
    
    // ========================================
    // PRODUCT CARD ANIMATION ON LOAD
    // ========================================
    
    const animateOnLoadElements = document.querySelectorAll(".animate-on-load");
    
    function animateElementsOnLoad() {
        animateOnLoadElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }, index * 100);
        });
    }
    
    // Trigger animations after page load
    window.addEventListener("load", animateElementsOnLoad);
    
    // ========================================
    // DISABLED LINKS BEHAVIOR
    // ========================================
    
    const disabledLinks = document.querySelectorAll("a.disabled");
    disabledLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            // Optionally show a message
            console.log("This feature is coming soon");
        });
    });
    
    // ========================================
    // RESPONSIVE CAROUSEL INDICATORS
    // ========================================
    
    // Removed - dots are now hidden on mobile via CSS
    
    // ========================================
    // HERO IMAGE LOADED STATE
    // ========================================
    
    const heroImages = document.querySelectorAll(".hero-image");
    const heroImageContainer = document.querySelector(".hero-image-container");
    
    heroImages.forEach(img => {
        img.addEventListener("load", function() {
            if (heroImageContainer) {
                heroImageContainer.classList.add("loaded");
            }
        });
        
        // If image is already cached, it may not trigger load event
        if (img.complete) {
            if (heroImageContainer) {
                heroImageContainer.classList.add("loaded");
            }
        }
    });
    
    // ========================================
    // SCROLL TO TOP FUNCTIONALITY (Optional)
    // ========================================
    
    window.addEventListener("scroll", function() {
        // Add any scroll-based animations here
    });
    
});

// ========================================
// PREVENT PINCH ZOOM ON MOBILE (Optional)
// ========================================

document.addEventListener("touchmove", function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });
