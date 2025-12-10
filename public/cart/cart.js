/* ========================================
   CART PAGE FUNCTIONALITY
   ======================================== */

// Cart Manager Class
class CartManager {
    constructor() {
        this.storageKey = 'cart';
        this.cart = this.getCartFromStorage() || [];
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartCount();
        this.updateWishlistCount();
        this.setupEventListeners();
        
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.cart = JSON.parse(e.newValue) || [];
                this.renderCart();
                this.updateCartCount();
            } else if (e.key === 'wishlist') {
                this.updateWishlistCount();
            }
        });
    }

    // Get cart from localStorage
    getCartFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save cart to localStorage
    saveCartToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountElements.forEach(el => {
            el.textContent = count;
            if (count > 0) {
                el.classList.add('bounce');
                setTimeout(() => el.classList.remove('bounce'), 300);
            }
        });
    }

    // Update wishlist count in header
    updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        const count = wishlist.length;
        wishlistCountElements.forEach(el => {
            el.textContent = count;
            if (count > 0) {
                el.classList.add('bounce');
                setTimeout(() => el.classList.remove('bounce'), 300);
            }
        });
    }

    // Setup event listeners using event delegation
    setupEventListeners() {
        const tableBody = document.getElementById('cartTableBody');
        if (!tableBody) return;

        // Use event delegation on the table body for better performance
        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            
            // Handle quantity decrease button
            if (target.classList.contains('qty-decrease')) {
                e.preventDefault();
                const index = parseInt(target.dataset.index);
                this.decreaseQuantity(index);
                return;
            }
            
            // Handle quantity increase button
            if (target.classList.contains('qty-increase')) {
                e.preventDefault();
                const index = parseInt(target.dataset.index);
                this.increaseQuantity(index);
                return;
            }
            
            // Handle remove button
            if (target.closest('.btn-remove')) {
                const index = parseInt(target.closest('.btn-remove').dataset.index);
                this.removeItem(index);
                return;
            }
        });

        // Handle direct quantity input changes
        tableBody.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                this.updateQuantity(index, newQuantity);
            }
        });

        // Handle input validation
        tableBody.addEventListener('input', (e) => {
            if (e.target.classList.contains('qty-input')) {
                let value = e.target.value;
                // Remove non-numeric characters
                value = value.replace(/[^0-9]/g, '');
                // Ensure minimum value is 1
                if (value === '' || parseInt(value) < 1) {
                    value = '1';
                }
                e.target.value = value;
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
    }

    // Increase quantity by 1
    increaseQuantity(index) {
        if (this.cart[index]) {
            this.cart[index].quantity += 1;
            this.saveCartToStorage();
            this.renderCart();
        }
    }

    // Decrease quantity by 1
    decreaseQuantity(index) {
        if (this.cart[index] && this.cart[index].quantity > 1) {
            this.cart[index].quantity -= 1;
            this.saveCartToStorage();
            this.renderCart();
        }
    }

    // Remove item from cart
    removeItem(index) {
        if (this.cart[index]) {
            const itemName = this.cart[index].name;
            this.cart.splice(index, 1);
            this.saveCartToStorage();
            this.renderCart();
            this.showNotification(`${itemName} removed from cart`, 'success');
        }
    }

    // Update quantity to specific value
    updateQuantity(index, quantity) {
        if (this.cart[index]) {
            this.cart[index].quantity = Math.max(1, quantity);
            this.saveCartToStorage();
            this.renderCart();
        }
    }

    // Calculate subtotal
    calculateSubtotal() {
        return this.cart.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    }

    // Apply promo code
    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const code = promoInput.value.trim().toUpperCase();
        const messageDiv = document.getElementById('promoMessage');

        const promoCodes = {
            'WELCOME10': 0.10,
            'SAVE20': 0.20,
            'BEAUTY15': 0.15,
            'PINK50': 0.50
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
        const cartTableWrapper = document.getElementById('cartTableWrapper');
        const cartSummary = document.getElementById('cartSummary');
        const emptyCart = document.getElementById('emptyCart');
        const tableBody = document.getElementById('cartTableBody');

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartTableWrapper) cartTableWrapper.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartTableWrapper) cartTableWrapper.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';

        if (!tableBody) return;
        
        // Clear existing content
        tableBody.innerHTML = '';

        // Render each cart item
        this.cart.forEach((item, index) => {
            const itemTotal = parseFloat(item.price) * item.quantity;
            const row = document.createElement('tr');
            
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
                        <button class="qty-btn qty-decrease" type="button" data-index="${index}">−</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="qty-btn qty-increase" type="button" data-index="${index}">+</button>
                    </div>
                </td>
                <td class="total-cell" data-label="Total">Rs. ${itemTotal.toFixed(2)}</td>
                <td data-label="Action">
                    <button class="btn-remove" type="button" title="Remove item" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        this.updateSummary();
    }

    // Update order summary
    updateSummary() {
        const subtotal = this.calculateSubtotal();
        const promoDiscount = parseFloat(localStorage.getItem('promo_discount') || 0);
        const discountAmount = subtotal * promoDiscount;
        const discountedSubtotal = subtotal - discountAmount;
        const shippingFee = discountedSubtotal <= 3000 ? 250 : 0;
        const total = discountedSubtotal + shippingFee;

        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = shippingFee > 0 ? `Rs. ${shippingFee.toFixed(2)}` : 'Free';
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
        localStorage.setItem('checkout_cart', JSON.stringify(this.cart));
        
        setTimeout(() => {
            window.location.href = '../checkout/checkout.html';
        }, 1000);
    }

    // Show notification
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInUp 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            info: 'info-circle',
            warning: 'exclamation-circle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }
}

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

    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cartManager = new CartManager();
    window.cartManager = cartManager;
    
    setupMobileNavigation();
    setupSearchFunctionality();
});
