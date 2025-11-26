/* ========================================
   CART PAGE FUNCTIONALITY
   ======================================== */

// Cart Manager Class
class CartManager {
    constructor() {
        this.storageKey = 'cart'; // Using same key as products.js
        this.cart = this.getCartFromStorage() || [];
        this.taxRate = 0.18; // 18% GST
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCart();
        this.updateCartCount();
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.cart = JSON.parse(e.newValue) || [];
                this.renderCart();
                this.updateCartCount();
            }
        });
    }

    // Get cart from localStorage (synchronized with products.js)
    getCartFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save cart to localStorage
    saveCartToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        this.updateCartCount();
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.storageKey,
            newValue: JSON.stringify(this.cart),
            oldValue: JSON.stringify(this.cart),
            storageArea: localStorage
        }));
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        // Calculate total quantity of all items in cart
        const count = this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountElements.forEach(el => {
            el.textContent = count;
            // Add animation
            if (count > 0) {
                el.classList.add('bounce');
                setTimeout(() => el.classList.remove('bounce'), 300);
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Remove item buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove')) {
                const row = e.target.closest('tr') || e.target.closest('[data-item-index]');
                const index = row?.dataset.index !== undefined ? row.dataset.index : row?.dataset.itemIndex;
                if (index !== undefined) {
                    this.removeItem(parseInt(index));
                }
            }
        });

        // Quantity change
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const row = e.target.closest('tr') || e.target.closest('[data-item-index]');
                const index = row?.dataset.index !== undefined ? row.dataset.index : row?.dataset.itemIndex;
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0 && index !== undefined) {
                    this.updateQuantity(parseInt(index), newQuantity);
                }
            }
        });

        // Quantity buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                const isIncrease = e.target.textContent.trim() === '+';
                const row = e.target.closest('tr') || e.target.closest('[data-item-index]');
                const index = row?.dataset.index !== undefined ? row.dataset.index : row?.dataset.itemIndex;
                
                if (index !== undefined) {
                    const item = this.cart[parseInt(index)];
                    const newQuantity = item.quantity + (isIncrease ? 1 : -1);
                    
                    if (newQuantity > 0) {
                        this.updateQuantity(parseInt(index), newQuantity);
                    }
                }
            }
        });

        // Apply promo code
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Cart icon navigation - redirect to cart page from header
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon && !window.location.pathname.includes('/cart/')) {
            cartIcon.addEventListener('click', () => {
                window.location.href = 'cart/cart.html';
            });
        }
    }

    // Remove item from cart
    removeItem(index) {
        const itemName = this.cart[index].name;
        this.cart.splice(index, 1);
        this.saveCartToStorage();
        this.renderCart();
        this.showNotification(`${itemName} removed from cart`, 'success');
    }

    // Update quantity
    updateQuantity(index, quantity) {
        if (this.cart[index]) {
            this.cart[index].quantity = Math.max(1, quantity);
            this.saveCartToStorage();
            this.renderCart();
            this.updateSummary();
        }
    }

    // Calculate subtotal
    calculateSubtotal() {
        return this.cart.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    }

    // Calculate tax
    calculateTax(subtotal) {
        return subtotal * this.taxRate;
    }

    // Apply promo code
    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const code = promoInput.value.trim().toUpperCase();
        const messageDiv = document.getElementById('promoMessage');

        // Sample promo codes
        const promoCodes = {
            'WELCOME10': 0.10,
            'SAVE20': 0.20,
            'BEAUTY15': 0.15,
            'PINK50': 0.50 // 50% off
        };

        messageDiv.textContent = '';
        messageDiv.className = 'promo-message';

        if (!code) {
            messageDiv.textContent = 'Please enter a promo code';
            messageDiv.className = 'promo-message error';
            return;
        }

        if (promoCodes[code]) {
            const discount = promoCodes[code];
            localStorage.setItem('promo_discount', discount.toString());
            messageDiv.textContent = `✓ Promo code applied! ${(discount * 100)}% off`;
            messageDiv.className = 'promo-message success';
            promoInput.value = '';
            this.renderCart();
        } else {
            messageDiv.textContent = 'Invalid promo code';
            messageDiv.className = 'promo-message error';
        }
    }

    // Render cart
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTableWrapper = document.getElementById('cartTableWrapper');
        const cartSummary = document.getElementById('cartSummary');
        const emptyCart = document.getElementById('emptyCart');

        if (this.cart.length === 0) {
            // Show empty state
            if (emptyCart) {
                emptyCart.style.display = 'block';
            }
            if (cartTableWrapper) cartTableWrapper.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        // Hide empty state, show cart table
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartTableWrapper) cartTableWrapper.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';

        // Render table rows
        const tableBody = document.getElementById('cartTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';

        this.cart.forEach((item, index) => {
            const itemTotal = parseFloat(item.price) * item.quantity;
            const row = document.createElement('tr');
            row.dataset.index = index;
            row.innerHTML = `
                <td data-label="Product">
                    <div class="cart-item-product">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='../images/bundleimages/default.png'">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-sku">SKU: ${item.id || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="price-cell" data-label="Price">Rs. ${parseFloat(item.price).toFixed(2)}</td>
                <td data-label="Quantity">
                    <div class="quantity-controls">
                        <button class="qty-btn" type="button">−</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1">
                        <button class="qty-btn" type="button">+</button>
                    </div>
                </td>
                <td class="total-cell" data-label="Total">Rs. ${itemTotal.toFixed(2)}</td>
                <td data-label="Action">
                    <button class="btn-remove" type="button" title="Remove item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Update summary
        this.updateSummary();
    }

    // Update order summary
    updateSummary() {
        const subtotal = this.calculateSubtotal();
        const promoDiscount = parseFloat(localStorage.getItem('promo_discount') || 0);
        const discountAmount = subtotal * promoDiscount;
        const discountedSubtotal = subtotal - discountAmount;
        const tax = this.calculateTax(discountedSubtotal);
        const total = discountedSubtotal + tax;

        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `Rs. ${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `Rs. ${total.toFixed(2)}`;

        // Show discount if applied
        const summaryDiv = document.querySelector('.summary-card');
        if (!summaryDiv) return;

        let discountRow = summaryDiv.querySelector('.discount-row');

        if (promoDiscount > 0) {
            if (!discountRow) {
                discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount-row';
                discountRow.style.color = '#4caf50';
                const divider = summaryDiv.querySelector('.summary-divider');
                if (divider) {
                    divider.parentElement.insertBefore(discountRow, divider);
                }
            }
            discountRow.innerHTML = `
                <span>Discount:</span>
                <span>- Rs. ${discountAmount.toFixed(2)}</span>
            `;
        } else if (discountRow) {
            discountRow.remove();
        }
    }

    // Checkout function
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        this.showNotification('Proceeding to checkout...', 'success');
        
        // Store cart for checkout page
        localStorage.setItem('checkout_cart', JSON.stringify(this.cart));
        
        // Redirect to checkout page (create this page later)
        setTimeout(() => {
            window.location.href = '../checkout/checkout.html';
        }, 1000);
    }

    // Show notification
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
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
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartManager();

    // Handle mobile navigation and search (from main script.js)
    setupMobileNavigation();
    setupSearchFunctionality();
});

// Mobile Navigation Setup
function setupMobileNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
            mobileNavOverlay.classList.add('active');
        });
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
        });
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
        });
    }

    // Close on link click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
        });
    });
}

// Search Functionality Setup
function setupSearchFunctionality() {
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');

    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            searchOverlay.classList.add('active');
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    // Cart icon navigation - already on cart page
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            // Already on cart page, so just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
