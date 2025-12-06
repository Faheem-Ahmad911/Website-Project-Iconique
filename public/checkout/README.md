# Checkout Page Documentation

## Overview
The checkout page is a complete e-commerce checkout system with the following features:

### Files
- **checkout.html** - Main checkout page structure
- **checkout.css** - Styling for the checkout page
- **checkout.js** - JavaScript functionality for checkout processing

## Features

### 1. Contact Section
- Email or mobile phone number input field
- Sign-in link for returning customers

### 2. Delivery Section
- Country/Region selection
- Customer information (First name, Last name)
- Address information (Address, Apartment/Suite)
- City and Postal Code
- Phone number for delivery updates
- Option to save information for next time

### 3. Shipping Method
- Standard shipping (FREE)

### 4. Payment Method
- Cash on Delivery (COD) - Currently the only available payment method
- Clear description of the payment method

### 5. Order Summary
- Display of all items in the cart with images, names, quantities, and prices
- Subtotal calculation
- Shipping cost display
- Discount code application
- Total order amount

### 6. Footer
- Newsletter subscription section
- Social media links
- Footer navigation
- Copyright information

## Integration with Cart

The checkout page receives cart data from the cart page through `localStorage`:
1. User adds items to cart on the product pages
2. User navigates to the cart page (cart.html)
3. User clicks "Proceed to Checkout" button
4. Cart data is saved to `localStorage` with key 'checkout_cart'
5. User is redirected to checkout.html
6. Checkout page loads cart data and displays it in the order summary

## Order Processing

### Form Validation
- Email validation
- All required fields must be filled
- Phone number validation

### Order Submission
When user clicks "Complete Order":
1. Form validation is performed
2. Order data is collected from form inputs
3. Order is saved to `localStorage` under 'orders' key
4. Cart is cleared from localStorage
5. Success message is displayed
6. User is redirected to home page after 3 seconds

### Order Data Structure
```javascript
{
    orderId: "ORD-[timestamp]-[random]",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
    paymentMethod: "cash_on_delivery",
    orderDate: "[ISO timestamp]",
    status: "pending"
}
```

## Discount/Promo Code

Valid test codes (can be customized):
- `WELCOME20` - 20% discount
- `SAVE10` - 10% discount
- `NEWUSER` - 15% discount

## Responsive Design

The checkout page is fully responsive:
- Desktop: Two-column layout (form on left, summary on right)
- Tablet: Adjusts grid layout
- Mobile: Single column layout with sticky summary card

## Header & Navigation

Includes the same header and navigation as other pages:
- Logo and branding
- Main navigation menu
- Search functionality
- Shopping cart icon
- Mobile menu toggle

## Mobile Features

- Mobile-optimized form inputs (font-size: 16px to prevent zoom)
- Touch-friendly form elements
- Sticky order summary on desktop
- Full-width layout on mobile
- Responsive button sizing

## Connected Pages

- **From**: cart/cart.html → "Proceed to Checkout" button
- **To**: checkout/checkout.html
- **Back**: Links to cart page if cart is empty
- **Header**: Links to all main pages (Home, Collections, About Us, Contact)

## Styling

The checkout page uses the existing design system:
- Color scheme from styles.css
- Typography from the main stylesheets
- Consistent spacing and padding
- Animations and transitions matching the website theme
- Pink color palette (#ff69b4 - #e91e63 range)

## Browser Compatibility

Tested and compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)
