/* ========================================
   COLLECTION PRODUCTS - JAVASCRIPT
   ======================================== */

// Product Data by Collection
const collectionProducts = {
    'sunscreen-protection': {
        name: 'Sunscreen & Protection',
        products: [
            { id: 1, name: 'Moisturizer', price: 1899.00, original: 3200.00, rating: 5, reviews: 42, image: '../images/productimages/product1.jpg', badge: 'New', description: 'Premium hydrating moisturizer' },
            { id: 2, name: 'Face Wash', price: 980.00, original: 1500.00, rating: 4, reviews: 28, image: '../images/productimages/product2.jpg', description: 'Gentle facial cleanser' },
            { id: 3, name: 'Hand feet Cream', price: 1990.00, original: 2500.00, rating: 5, reviews: 65, image: '../images/productimages/product3.jpg', description: 'Nourishing hand and feet cream' },
            { id: 4, name: 'Hair Oil', price: 1870.00, original: 2300.00, rating: 4, reviews: 51, image: '../images/productimages/product4.jpg', badge: 'Sale', description: 'Enriched hair care oil' },
            { id: 5, name: 'Whitening Cream', price: 1449.00, original: 2000.00, rating: 5, reviews: 73, image: '../images/productimages/product5.jpg', description: 'Brightening skin cream' },
            { id: 1, name: 'Moisturizer', price: 1899.00, original: 3200.00, rating: 5, reviews: 89, image: '../images/productimages/product1.jpg', badge: 'Exclusive', description: 'Premium hydrating moisturizer' }
        ]
    },
    'hydrating-skincare': {
        name: 'Hydrating Skincare',
        products: [
            { id: 2, name: 'Face Wash', price: 980.00, original: 1500.00, rating: 5, reviews: 112, image: '../images/productimages/product2.jpg', badge: 'New', description: 'Gentle facial cleanser' },
            { id: 3, name: 'Hand feet Cream', price: 1990.00, original: 2500.00, rating: 4, reviews: 95, image: '../images/productimages/product3.jpg', description: 'Nourishing hand and feet cream' },
            { id: 4, name: 'Hair Oil', price: 1870.00, original: 2300.00, rating: 5, reviews: 78, image: '../images/productimages/product4.jpg', description: 'Enriched hair care oil' },
            { id: 5, name: 'Whitening Cream', price: 1449.00, original: 2000.00, rating: 5, reviews: 134, image: '../images/productimages/product5.jpg', badge: 'Sale', description: 'Brightening skin cream' },
            { id: 1, name: 'Moisturizer', price: 1899.00, original: 3200.00, rating: 4, reviews: 88, image: '../images/productimages/product1.jpg', description: 'Premium hydrating moisturizer' },
            { id: 2, name: 'Face Wash', price: 980.00, original: 1500.00, rating: 5, reviews: 156, image: '../images/productimages/product2.jpg', badge: 'Exclusive', description: 'Gentle facial cleanser' }
        ]
    },
    'beauty-essentials': {
        name: 'Beauty Essentials',
        products: [
            { id: 3, name: 'Hand feet Cream', price: 1990.00, original: 2500.00, rating: 5, reviews: 203, image: '../images/productimages/product3.jpg', badge: 'New', description: 'Nourishing hand and feet cream' },
            { id: 4, name: 'Hair Oil', price: 1870.00, original: 2300.00, rating: 4, reviews: 167, image: '../images/productimages/product4.jpg', description: 'Enriched hair care oil' },
            { id: 5, name: 'Whitening Cream', price: 1449.00, original: 2000.00, rating: 5, reviews: 245, image: '../images/productimages/product5.jpg', description: 'Brightening skin cream' },
            { id: 1, name: 'Moisturizer', price: 1899.00, original: 3200.00, rating: 5, reviews: 89, image: '../images/productimages/product1.jpg', badge: 'Sale', description: 'Premium hydrating moisturizer' },
            { id: 2, name: 'Face Wash', price: 980.00, original: 1500.00, rating: 4, reviews: 178, image: '../images/productimages/product2.jpg', description: 'Gentle facial cleanser' },
            { id: 3, name: 'Hand feet Cream', price: 1990.00, original: 2500.00, rating: 5, reviews: 234, image: '../images/productimages/product3.jpg', badge: 'Exclusive', description: 'Nourishing hand and feet cream' }
        ]
    },
    'makeup-magic': {
        name: 'Makeup Magic',
        products: [
            { id: 4, name: 'Hair Oil', price: 1870.00, original: 2300.00, rating: 5, reviews: 456, image: '../images/productimages/product4.jpg', badge: 'New', description: 'Enriched hair care oil' },
            { id: 5, name: 'Whitening Cream', price: 1449.00, original: 2000.00, rating: 5, reviews: 345, image: '../images/productimages/product5.jpg', description: 'Brightening skin cream' },
            { id: 1, name: 'Moisturizer', price: 1899.00, original: 3200.00, rating: 5, reviews: 289, image: '../images/productimages/product1.jpg', description: 'Premium hydrating moisturizer' },
            { id: 2, name: 'Face Wash', price: 980.00, original: 1500.00, rating: 5, reviews: 512, image: '../images/productimages/product2.jpg', badge: 'Sale', description: 'Gentle facial cleanser' },
            { id: 3, name: 'Hand feet Cream', price: 1990.00, original: 2500.00, rating: 4, reviews: 198, image: '../images/productimages/product3.jpg', description: 'Nourishing hand and feet cream' },
            { id: 4, name: 'Hair Oil', price: 1870.00, original: 2300.00, rating: 5, reviews: 267, image: '../images/productimages/product4.jpg', badge: 'Exclusive', description: 'Enriched hair care oil' }
        ]
    }
};


// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('collection') || 'sunscreen-protection';
    
    const collection = collectionProducts[collectionId];
    if (collection) {
        document.getElementById('collectionTitle').textContent = collection.name;
        document.title = collection.name + ' - The Iconique.';
        renderProducts(collection.products);
    }
});

// Generate star rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

// Render products
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    // Map product IDs to their file paths
    const productPaths = {
        1: '../products/product1/product1.html',
        2: '../products/product1/product2.html',
        3: '../products/product1/product3.html',
        4: '../products/product1/product4.html',
        5: '../products/product1/product5.html'
    };
    
    grid.innerHTML = products.map((product, index) => `
        <a href="${productPaths[product.id]}" class="collection-card" style="text-decoration: none; color: inherit;">
            <div class="collection-card-bg" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFEB99 100%); position: relative;">
                <div class="collection-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="collection-image">
                </div>
                ${product.badge ? `<span style="position: absolute; top: 12px; right: 12px; background: #e91e63; color: white; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; z-index: 10;">${product.badge}</span>` : ''}
            </div>
            <div class="collection-card-content">
                <h3 class="collection-name">${product.name}</h3>
                <p class="collection-description">${product.description}</p>
                <p style="font-size: 0.9rem; color: #666; margin: 8px 0;">
                    <span style="color: #ffc107;">★ ${product.rating.toFixed(1)}</span> • (${product.reviews} reviews)
                </p>
                <p style="font-size: 1.1rem; font-weight: 700; color: #e91e63; margin: 8px 0;">
                    Rs. ${product.price.toFixed(2)} 
                    <span style="font-size: 0.85rem; color: #999; text-decoration: line-through; margin-left: 8px;">Rs. ${product.original.toFixed(2)}</span>
                </p>
                <span class="collection-link" style="pointer-events: none;">View Product <i class="fas fa-arrow-right"></i></span>
            </div>
        </a>
    `).join('');
}
