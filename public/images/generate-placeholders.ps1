# Script to generate placeholder images for products and bundles
# This creates simple SVG placeholders that can be replaced with real images later

$productsPath = "e:\TheIconique-Website\home\images"

# Product placeholders
$products = @(
    @{name="Luxe Lipstick"; num=1; color="#ff69b4"},
    @{name="Radiant Foundation"; num=2; color="#ffb6c1"},
    @{name="Glow Serum"; num=3; color="#ffc0cb"},
    @{name="Eyeshadow Palette"; num=4; color="#ff69b4"},
    @{name="Mascara Pro"; num=5; color="#ffb6c1"},
    @{name="Blush Duo"; num=6; color="#ffc0cb"},
    @{name="Setting Spray"; num=7; color="#ff69b4"},
    @{name="Highlighter Stick"; num=8; color="#ffb6c1"}
)

foreach ($product in $products) {
    $svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
        <linearGradient id="prodGrad$($product.num)" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:$($product.color);stop-opacity:0.7" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#prodGrad$($product.num))"/>
    <circle cx="300" cy="250" r="80" fill="white" opacity="0.8"/>
    <text x="300" y="400" font-family="Poppins, sans-serif" font-size="28" font-weight="600" fill="#333" text-anchor="middle">$($product.name)</text>
    <text x="300" y="440" font-family="Poppins, sans-serif" font-size="18" fill="#666" text-anchor="middle">Product $($product.num)</text>
</svg>
"@
    $svgContent | Out-File -FilePath "$productsPath\product$($product.num).svg" -Encoding UTF8
}

# Bundle placeholders
$bundles = @(
    @{name="Everyday Essentials"; num=1; color="#ff6b6b"},
    @{name="Glow Up Bundle"; num=2; color="#ff69b4"},
    @{name="Eye Perfection"; num=3; color="#ffb6c1"},
    @{name="Complete Makeup Kit"; num=4; color="#ffc0cb"},
    @{name="Skincare Starter"; num=5; color="#ff69b4"},
    @{name="Party Ready"; num=6; color="#ff6b6b"}
)

foreach ($bundle in $bundles) {
    $svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
        <linearGradient id="bundleGrad$($bundle.num)" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:$($bundle.color);stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bundleGrad$($bundle.num))"/>
    <rect x="200" y="150" width="120" height="120" rx="10" fill="white" opacity="0.7"/>
    <rect x="340" y="150" width="120" height="120" rx="10" fill="white" opacity="0.7"/>
    <rect x="480" y="150" width="120" height="120" rx="10" fill="white" opacity="0.7"/>
    <text x="400" y="350" font-family="Playfair Display, serif" font-size="32" font-weight="bold" fill="#333" text-anchor="middle">$($bundle.name)</text>
    <text x="400" y="390" font-family="Poppins, sans-serif" font-size="20" fill="#666" text-anchor="middle">Bundle $($bundle.num)</text>
</svg>
"@
    $svgContent | Out-File -FilePath "$productsPath\bundle$($bundle.num).svg" -Encoding UTF8
}

Write-Host "✅ Created placeholder images for products and bundles" -ForegroundColor Green
Write-Host "📁 Location: $productsPath" -ForegroundColor Cyan
Write-Host "⚠️  Replace these SVG files with actual product photos before launch" -ForegroundColor Yellow
