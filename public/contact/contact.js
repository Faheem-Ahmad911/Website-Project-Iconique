/* ========================================
   CONTACT PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Real-time validation on input
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('focus', clearFieldError);
        });
    }
    
    // Setup cart functionality
    setupCartNavigation();
    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });
});

/**
 * Handle contact form submission
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');
    const formMessage = document.getElementById('formMessage');
    
    // Clear previous messages
    clearAllErrors();
    
    // Validate all fields
    const isNameValid = validateField({ target: nameInput });
    const isEmailValid = validateField({ target: emailInput });
    const isPhoneValid = validateField({ target: phoneInput });
    const isMessageValid = validateField({ target: messageInput });
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
        showMessage(formMessage, 'Please fix the errors above', 'error');
        return;
    }
    
    // Prepare form data
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate sending (replace with actual backend call)
    setTimeout(() => {
        // For now, we'll just show a success message
        // In a real scenario, you would send this to a backend server
        
        showMessage(formMessage, 'Thank you for reaching out! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Restore button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        // Log the data (for development purposes)
        console.log('Contact Form Data:', formData);
    }, 1500);
}

/**
 * Validate individual field
 */
function validateField(e) {
    const field = e.target;
    const fieldValue = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error state
    field.classList.remove('error');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
    
    // Validation rules
    switch (fieldName) {
        case 'name':
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (fieldValue.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            } else if (!/^[a-zA-Z\s]*$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Name can only contain letters and spaces';
            }
            break;
            
        case 'email':
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!validateEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'phone':
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!/^[0-9\-\+\s\(\)]*$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Phone number can only contain numbers, spaces, and symbols like - + ( )';
            } else if (fieldValue.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Phone number must be at least 10 digits';
            }
            break;
            
        case 'message':
            if (!fieldValue) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (fieldValue.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    // Show error if validation failed
    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }
    
    return isValid;
}

/**
 * Clear error for specific field on focus
 */
function clearFieldError(e) {
    const field = e.target;
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    field.classList.remove('error');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

/**
 * Clear all error messages
 */
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const errorInputs = document.querySelectorAll('.form-input.error, .form-textarea.error');
    
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    errorInputs.forEach(input => {
        input.classList.remove('error');
    });
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form message (success or error)
 */
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.classList.add('show', type);
    
    // Remove the opposite class if it exists
    const oppositeType = type === 'success' ? 'error' : 'success';
    element.classList.remove(oppositeType);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

/* ========================================
   CART FUNCTIONALITY
   ======================================== */

/**
 * Update cart count from localStorage
 */
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    cartCountElements.forEach(el => {
        el.textContent = count;
        if (count > 0) {
            el.classList.add('bounce');
            setTimeout(() => el.classList.remove('bounce'), 300);
        }
    });
}

/**
 * Setup Cart Icon Navigation
 */
function setupCartNavigation() {
    const cartIcons = document.querySelectorAll(".cart-icon");
    
    cartIcons.forEach(cartIcon => {
        cartIcon.addEventListener("click", function(e) {
            e.preventDefault();
            // From contact page, go to cart
            window.location.href = '../cart/cart.html';
        });
    });
}

