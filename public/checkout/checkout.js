/* ========================================
   CHECKOUT PAGE JAVASCRIPT
   ======================================== */

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutData();
    setupEventListeners();
    updateOrderSummary();
});

// ========================================
// LOAD CHECKOUT DATA FROM CART
// ========================================

function loadCheckoutData() {
    const cart = getCartFromStorage();
    
    if (!cart || cart.length === 0) {
        showEmptyCart();
        return;
    }

    displayCartItems(cart);
}

function getCartFromStorage() {
    try {
        // Try to get the cart from different storage keys
        let cart = localStorage.getItem('cart');
        if (!cart) {
            cart = localStorage.getItem('checkout_cart');
        }
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

function showEmptyCart() {
    const summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = `
        <div class="empty-summary">
            <p>Your cart is empty</p>
            <a href="../cart/cart.html" class="btn btn-secondary btn-small">Go to Cart</a>
        </div>
    `;
    
    // Disable checkout button
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    completeOrderBtn.disabled = true;
    completeOrderBtn.style.opacity = '0.5';
    completeOrderBtn.style.cursor = 'not-allowed';
}

function displayCartItems(cart) {
    const summaryItems = document.getElementById('summaryItems');
    let itemsHTML = '';

    cart.forEach(item => {
        // Ensure image path is correct for checkout page location
        let imagePath = item.image || '../images/productimages/product1.jpg';
        
        // If image path is relative from product page, adjust for checkout page
        if (imagePath && !imagePath.startsWith('http')) {
            // If it starts with '../', it's relative from checkout, keep as is
            // If it doesn't start with '../', it might be from product page, so prepend ../
            if (!imagePath.startsWith('../')) {
                imagePath = '../' + imagePath;
            }
        }
        
        itemsHTML += `
            <div class="summary-item">
                <img src="${imagePath}" alt="${item.name}" class="summary-item-image" onerror="this.src='../images/productimages/product1.jpg'">
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-variant">Qty: ${item.quantity}</div>
                    <div class="summary-item-price">Rs. ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            </div>
        `;
    });

    summaryItems.innerHTML = itemsHTML;
}

// ========================================
// UPDATE ORDER SUMMARY
// ========================================

function updateOrderSummary() {
    const cart = getCartFromStorage();
    
    // Calculate subtotal
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    // Get applied discount if any
    let discountAmount = 0;
    const appliedDiscount = sessionStorage.getItem('appliedDiscount');
    if (appliedDiscount) {
        const discount = JSON.parse(appliedDiscount);
        discountAmount = discount.amount;
    }

    // Calculate discounted subtotal
    const discountedSubtotal = subtotal - discountAmount;

    // Calculate shipping fee based on discounted subtotal
    // Rs. 250 shipping if subtotal >= 3000, otherwise FREE
    const shippingFee = discountedSubtotal >= 3000 ? 250 : 0;
    const total = discountedSubtotal + shippingFee;

    // Update display
    document.getElementById('subtotalAmount').textContent = `Rs. ${subtotal.toFixed(2)}`;
    
    if (shippingFee > 0) {
        document.getElementById('shippingAmount').textContent = `Rs. ${shippingFee.toFixed(2)}`;
    } else {
        document.getElementById('shippingAmount').textContent = 'FREE';
    }
    
    document.getElementById('totalAmount').textContent = `Rs. ${total.toFixed(2)}`;
}

// ========================================
// FORM VALIDATION AND SUBMISSION
// ========================================

function setupEventListeners() {
    // Complete Order Button
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    completeOrderBtn.addEventListener('click', handleCheckoutSubmission);

    // Apply Discount Button
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    applyDiscountBtn.addEventListener('click', applyDiscount);

    // Discount Code Enter Key
    const discountCode = document.getElementById('discountCode');
    discountCode.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyDiscount();
        }
    });

    // Cart Icon Navigation
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            window.location.href = '../cart/cart.html';
        });
    }
}

function handleCheckoutSubmission(e) {
    e.preventDefault();

    // Validate form
    if (!validateCheckoutForm()) {
        return;
    }

    // Collect form data
    const orderData = collectOrderData();

    // Save order and clear cart
    saveOrder(orderData);

    // Show success message
    showOrderSuccess();

    // Redirect after delay
    setTimeout(function() {
        window.location.href = '../index.html';
    }, 3000);
}

function validateCheckoutForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value.trim();
    const address = document.getElementById('address').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const agreeCheckbox = document.getElementById('saveInfo').checked;

    // First Name validation
    if (!firstName) {
        showErrorMessage('Please enter your first name');
        return false;
    }
    if (firstName.length < 2) {
        showErrorMessage('First name must be at least 2 characters long');
        return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
        showErrorMessage('First name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
    }

    // Last Name validation
    if (!lastName) {
        showErrorMessage('Please enter your last name');
        return false;
    }
    if (lastName.length < 2) {
        showErrorMessage('Last name must be at least 2 characters long');
        return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
        showErrorMessage('Last name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
    }

    // Phone validation
    if (!phone) {
        showErrorMessage('Please enter your phone number');
        return false;
    }
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
        showErrorMessage('Please enter a valid phone number');
        return false;
    }
    if (phone.replace(/\D/g, '').length < 10) {
        showErrorMessage('Phone number must have at least 10 digits');
        return false;
    }

    // Email validation
    if (!email) {
        showErrorMessage('Please enter your email address');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showErrorMessage('Please enter a valid email address');
        return false;
    }

    // Country validation
    if (!country) {
        showErrorMessage('Please select your country/region');
        return false;
    }

    // City validation
    if (!city) {
        showErrorMessage('Please enter your city');
        return false;
    }
    if (city.length < 2) {
        showErrorMessage('City name must be at least 2 characters long');
        return false;
    }

    // Address validation
    if (!address) {
        showErrorMessage('Please enter your address');
        return false;
    }
    if (address.length < 5) {
        showErrorMessage('Address must be at least 5 characters long');
        return false;
    }

    // Postal Code validation (optional but if provided, should be valid)
    if (postalCode) {
        // Basic postal code validation - allow numbers, letters, spaces, and hyphens
        if (!/^[a-zA-Z0-9\s\-]{2,10}$/.test(postalCode)) {
            showErrorMessage('Please enter a valid postal code');
            return false;
        }
    }

    // Check if user agreed to terms and policies
    if (!agreeCheckbox) {
        showErrorMessage('Please agree with our Terms and Policies to proceed');
        return false;
    }

    // Check if cart is empty
    const cart = getCartFromStorage();
    if (!cart || cart.length === 0) {
        showErrorMessage('Your cart is empty. Please add items before checkout');
        return false;
    }

    return true;
}

function collectOrderData() {
    const cart = getCartFromStorage();
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    // Get applied discount if any
    let discountAmount = 0;
    const appliedDiscount = sessionStorage.getItem('appliedDiscount');
    if (appliedDiscount) {
        const discount = JSON.parse(appliedDiscount);
        discountAmount = discount.amount;
    }

    // Calculate discounted subtotal
    const discountedSubtotal = subtotal - discountAmount;

    // Calculate shipping fee based on discounted subtotal
    // Rs. 250 shipping if subtotal >= 3000, otherwise FREE
    const shippingFee = discountedSubtotal >= 3000 ? 250 : 0;
    const total = discountedSubtotal + shippingFee;

    return {
        orderId: generateOrderId(),
        email: document.getElementById('contactEmail').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        address: document.getElementById('address').value.trim(),
        apartment: document.getElementById('apartment').value.trim(),
        city: document.getElementById('city').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim(),
        country: document.getElementById('country').value,
        phone: document.getElementById('phone').value.trim(),
        items: cart,
        subtotal: subtotal,
        discount: discountAmount,
        shipping: shippingFee,
        total: total,
        paymentMethod: 'cash_on_delivery',
        orderDate: new Date().toISOString(),
        status: 'pending'
    };
}

function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function saveOrder(orderData) {
    try {
        // Get existing orders
        let orders = localStorage.getItem('orders');
        orders = orders ? JSON.parse(orders) : [];

        // Add new order
        orders.push(orderData);

        // Save orders
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');

        // Update cart count in header
        updateCartCount();

    } catch (error) {
        console.error('Error saving order:', error);
    }
}

function showErrorMessage(message) {
    // Create error alert
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ff6b6b;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideDown 0.3s ease-out;
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

function showOrderSuccess() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;

    successDiv.innerHTML = `
        <div style="
            background-color: white;
            padding: 3rem 2rem;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            animation: slideUp 0.3s ease-out;
        ">
            <div style="
                font-size: 3rem;
                color: #4caf50;
                margin-bottom: 1rem;
            ">✓</div>
            <h2 style="
                color: #333;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
            ">Order Confirmed!</h2>
            <p style="
                color: #666;
                margin-bottom: 1rem;
                font-size: 0.95rem;
            ">Thank you for your order. You will receive a call soon for delivery confirmation.</p>
            <p style="
                color: #999;
                font-size: 0.9rem;
            ">Redirecting to home...</p>
        </div>
    `;

    document.body.appendChild(successDiv);
}

// ========================================
// DISCOUNT/PROMO CODE HANDLING
// ========================================

function applyDiscount() {
    const discountCode = document.getElementById('discountCode').value.trim().toUpperCase();
    const discountMessage = document.getElementById('discountMessage');
    
    if (!discountCode) {
        discountMessage.textContent = 'Please enter a discount code';
        discountMessage.style.color = '#ff6b6b';
        return;
    }

    // Dummy discount codes - customize as needed
    const validCodes = {
        'WELCOME20': 0.20,
        'SAVE10': 0.10,
        'NEWUSER': 0.15
    };

    if (validCodes[discountCode]) {
        const discount = validCodes[discountCode];
        applyDiscountToOrder(discount, discountCode);
        discountMessage.textContent = `✓ Discount code applied! ${Math.round(discount * 100)}% off`;
        discountMessage.style.color = '#4caf50';
    } else {
        discountMessage.textContent = '✗ Invalid discount code';
        discountMessage.style.color = '#ff6b6b';
    }
}

function applyDiscountToOrder(discountPercentage, code) {
    const cart = getCartFromStorage();
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const discountAmount = subtotal * discountPercentage;
    const discountedSubtotal = subtotal - discountAmount;

    // Calculate shipping fee based on discounted subtotal
    // Rs. 250 shipping if subtotal >= 3000, otherwise FREE
    const shippingFee = discountedSubtotal >= 3000 ? 250 : 0;
    const newTotal = discountedSubtotal + shippingFee;

    // Update display with discount
    document.getElementById('subtotalAmount').textContent = `Rs. ${subtotal.toFixed(2)}`;
    
    if (shippingFee > 0) {
        document.getElementById('shippingAmount').textContent = `Rs. ${shippingFee.toFixed(2)}`;
    } else {
        document.getElementById('shippingAmount').textContent = 'FREE';
    }
    
    document.getElementById('totalAmount').innerHTML = `
        <span style="text-decoration: line-through; color: #999; font-size: 0.9em; margin-right: 0.5rem;">Rs. ${subtotal.toFixed(2)}</span>
        Rs. ${newTotal.toFixed(2)}
    `;

    // Store discount in sessionStorage for order data
    sessionStorage.setItem('appliedDiscount', JSON.stringify({
        code: code,
        percentage: discountPercentage,
        amount: discountAmount,
        finalTotal: newTotal
    }));
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function updateCartCount() {
    const cart = getCartFromStorage();
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Initial cart count update
updateCartCount();

// ========================================
// ADD ANIMATION STYLES
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
