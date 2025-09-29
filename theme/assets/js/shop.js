
// Global variables
let activeFilters = {};
let currentView = 'grid-3';
let allProducts = [];
let filteredProducts = [];
let showSaleOnly = false;
let currentSort = 'best-selling';
// const sidebar = document.getElementById('filterSidebar');

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializeProducts();
    initializeFilters();
    initializeCountdownTimers();
    updateActiveFiltersDisplay();
    updateResultsCount();
});

// Initialize products data
function initializeProducts() {
    allProducts = Array.from(document.querySelectorAll('.product-card')).map(card => {
        const productId = card.dataset.productId;
        const title = card.querySelector('.product-title').textContent;
        const category = card.getAttribute('category');
        const brand = card.getAttribute('brand');
        const currentPrice = parseFloat(card.querySelector('.current-price').textContent);
        const originalPrice = card.querySelector('.original-price') ?
            parseFloat(card.querySelector('.original-price').textContent) : currentPrice;
        const badges = Array.from(card.querySelectorAll('.product-badge')).map(badge => badge.textContent.toLowerCase());

        return {
            id: productId,
            element: card,
            title: title,
            currentPrice: currentPrice,
            originalPrice: originalPrice,
            onSale: originalPrice > currentPrice,
            badges: badges,
            category: category,
            brand: brand, // Helper function to determine brand
            colors: Array.from(card.querySelectorAll('.color-variant')).map(color => color.className.split(' ')[1]),
            sizes: ['S', 'M', 'L', 'XL'] // Default sizes
        };
    });
    filteredProducts = [...allProducts];
}

// Initialize filter event listeners
function initializeFilters() {
    const sidebar = document.getElementById('filterSidebar');
    // Add event listeners to all filter checkboxes
    const filterInputs = sidebar.querySelectorAll('input[type="checkbox"]');

    filterInputs.forEach(input => {
        input.addEventListener('change', handleFilterChange);
    });

    // Initialize price range
    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceSlider = document.getElementById('maxPrice');

    minPriceSlider.addEventListener('input', updatePriceRange);
    maxPriceSlider.addEventListener('input', updatePriceRange);
}

// Handle filter changes
function handleFilterChange(event) {
    const filterType = event.target.name;
    const filterValue = event.target.value;
    const isChecked = event.target.checked;

    if (!activeFilters[filterType]) {
        activeFilters[filterType] = [];
    }

    if (isChecked) {
        if (!activeFilters[filterType].includes(filterValue)) {
            activeFilters[filterType].push(filterValue);
        }
    } else {
        activeFilters[filterType] = activeFilters[filterType].filter(value => value !== filterValue);
        if (activeFilters[filterType].length === 0) {
            delete activeFilters[filterType];
        }
    }

    applyFilters();
    updateActiveFiltersDisplay();
}

// Apply all active filters
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Check category filter
        if (activeFilters.category && activeFilters.category.length > 0) {
            if (!activeFilters.category.includes(product.category)) {
                return false;
            }
        }

        // Check brand filter
        if (activeFilters.brand && activeFilters.brand.length > 0) {
            if (!activeFilters.brand.includes(product.brand)) {
                return false;
            }
        }

        // Check availability filter
        if (activeFilters.availability && activeFilters.availability.length > 0) {
            // Assume all products are in stock for demo
            if (!activeFilters.availability.includes('in-stock')) {
                return false;
            }
        }

        // Check price range
        const minPrice = parseInt(document.getElementById('minPrice').value);
        const maxPrice = parseInt(document.getElementById('maxPrice').value);
        if (product.currentPrice < minPrice || product.currentPrice > maxPrice) {
            return false;
        }

        // Check sale only filter
        if (showSaleOnly && !product.onSale) {
            return false;
        }

        return true;
    });

    updateProductDisplay();
    updateResultsCount();
}

// Update product display
function updateProductDisplay() {
    const productsGrid = document.getElementById('productsGrid');

    // Hide all products first
    allProducts.forEach(product => {
        product.element.style.display = 'none';
    });

    // Show filtered products
    filteredProducts.forEach(product => {
        product.element.style.display = 'block';
    });

    // Sort products if needed
    if (currentSort !== 'best-selling') {
        sortDisplayedProducts();
    }
}

// Sort displayed products
function sortDisplayedProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const sortedProducts = [...filteredProducts];

    switch (currentSort) {
        case 'alphabetical-az':
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'alphabetical-za':
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'price-low-high':
            sortedProducts.sort((a, b) => a.currentPrice - b.currentPrice);
            break;
        case 'price-high-low':
            sortedProducts.sort((a, b) => b.currentPrice - a.currentPrice);
            break;
    }

    // Reorder elements in DOM
    sortedProducts.forEach(product => {
        productsGrid.appendChild(product.element);
    });
}

// Update active filters display
function updateActiveFiltersDisplay() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    activeFiltersContainer.innerHTML = '';

    let hasFilters = false;

    // Add filter tags for each active filter
    Object.keys(activeFilters).forEach(filterType => {
        activeFilters[filterType].forEach(filterValue => {
            hasFilters = true;
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.innerHTML = `
                        ${getFilterDisplayName(filterType, filterValue)}
                        <button class="remove-filter" onclick="removeFilter('${filterType}', '${filterValue}')" aria-label="Remove filter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </button>
                    `;
            activeFiltersContainer.appendChild(filterTag);
        });
    });

    // Add price range filter if not default
    const minPrice = parseInt(document.getElementById('minPrice').value);
    const maxPrice = parseInt(document.getElementById('maxPrice').value);
    if (minPrice > 0 || maxPrice < 500) {
        hasFilters = true;
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.innerHTML = `
                    Price: ${minPrice} - ${maxPrice}
                    <button class="remove-filter" onclick="resetPriceRange()" aria-label="Remove price filter">
                        ×
                    </button>
                `;
        activeFiltersContainer.appendChild(filterTag);
    }

    // Add clear all button if there are filters
    if (hasFilters) {
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'clear-all-btn';
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.onclick = clearAllFilters;
        activeFiltersContainer.appendChild(clearAllBtn);
    }
}

// Get display name for filter
function getFilterDisplayName(filterType, filterValue) {
    const displayNames = {
        'category': {
            't-shirts': 'T-shirts',
            'footwear': 'Footwear',
            'skirts': 'Skirts',
            'dresses': 'Dresses',
            'underwear': 'Underwear',
            'accessories': 'Accessories'
        },
        'brand': {
            'autonet': 'AUTONET',
            'trendy-queen': 'Trendy Queen',
            'whroll': 'WHROLL',
            'real-essentials': 'Real Essentials',
            'dolatoo': 'Dolatoo'
        },
        'size': {
            'xs': 'XS',
            's': 'S',
            'm': 'M',
            'l': 'L',
            'xl': 'XL',
            '2xl': '2XL',
            'over-size': 'Over size'
        }
    };

    if (displayNames[filterType] && displayNames[filterType][filterValue]) {
        return displayNames[filterType][filterValue];
    }

    return filterValue.charAt(0).toUpperCase() + filterValue.slice(1);
}

// Remove specific filter
function removeFilter(filterType, filterValue) {
    const checkbox = document.querySelector(`input[name="${filterType}"][value="${filterValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        handleFilterChange({ target: checkbox });
    }
}

// Clear all filters
function clearAllFilters() {
    // Clear all checkboxes
    const filterInputs = document.querySelectorAll('input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.checked = false;
    });

    // Reset price range
    resetPriceRange();

    // Clear active filters
    activeFilters = {};
    showSaleOnly = false;
    document.getElementById('show-sale').checked = false;

    applyFilters();
    updateActiveFiltersDisplay();
}

// Reset price range
function resetPriceRange() {
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 500;
    updatePriceRange();
}

// Update price range display and filter
function updatePriceRange() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    document.getElementById('minPriceValue').textContent = minPrice;
    document.getElementById('maxPriceValue').textContent = maxPrice;

    // Apply price filter
    applyFilters();
    updateActiveFiltersDisplay();
}

// Update results count
function updateResultsCount() {
    const count = filteredProducts.length;
    const resultsText = count === 1 ? '1 Product found' : `${count} Products found`;
    document.getElementById('resultsCount').textContent = resultsText;
}

// Toggle filter sections
function toggleFilter(filterName) {
    const filterSection = document.querySelector(`#${filterName}-content`).parentElement;
    const content = document.querySelector(`#${filterName}-content`);
    const toggle = filterSection.querySelector('.filter-toggle ion-icon');

    filterSection.classList.toggle('collapsed');

    if (filterSection.classList.contains('collapsed')) {
        content.style.maxHeight = '0';
        // toggle.style.transform = 'rotate(180deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        // toggle.style.transform = 'rotate(0deg)';
    }
}

// Change product view
function changeViewFunc() {
    const productsGrid = document.getElementById('productsGrid');
    const viewBtns = document.querySelectorAll('.view-btn');

    // Update active button
    viewBtns.forEach((btn, btnIndex) => {
        let currentView = btn.dataset.view;
        btn.addEventListener('click', () => {
            // Update grid class
            updateGridClass(btn, currentView)
        })


        if (window.innerWidth <= 1199) {
            viewBtns[3].style.display = 'none';

            if (viewBtns[3].classList.contains('active')) {
                viewBtns[2].classList.add('active')
                updateGridClass(viewBtns[2], viewBtns[2].dataset.view)
            }

        } else {
            viewBtns[3].style.display = '';
        }

        if (window.innerWidth <= 768) {
            viewBtns[2].style.display = 'none';

            if (viewBtns[2].classList.contains('active')) {
                viewBtns[1].classList.add('active');
                updateGridClass(viewBtns[1], viewBtns[1].dataset.view)
            }
        } else {
            viewBtns[2].style.display = '';
        }
    });


    // Update grid class Func
    function updateGridClass(currentBtn, currentView) {
        viewBtns.forEach(element => {
            element.classList.remove('active');
        });
        currentBtn.classList.add('active');

        productsGrid.className = `products-grid ${currentView}`;
    }
}

changeViewFunc();

window.addEventListener('resize', () => {
    changeViewFunc();
})

// Sort products
function sortProducts(sortType) {
    currentSort = sortType;
    sortDisplayedProducts();
}

// Toggle filter btn
const sidebar = document.getElementById('filterSidebar');
const openFilterBtn = document.querySelector('.filter-toggle-btn');

handlePreviewToggle(openFilterBtn, sidebar)

// Initialize countdown timers
function initializeCountdownTimers() {
    // Set up countdown for products with timers
    const timers = [
        { id: 1, endTime: new Date().getTime() + (5 * 60 * 60 * 1000 + 42 * 60 * 1000 + 11 * 1000) },
        { id: 2, endTime: new Date().getTime() + (5 * 60 * 60 * 1000 + 41 * 60 * 1000 + 23 * 1000) },
        { id: 5, endTime: new Date().getTime() + (5 * 60 * 60 * 1000 + 39 * 60 * 1000 + 13 * 1000) }
    ];

    timers.forEach(timer => {
        updateCountdown(timer.id, timer.endTime);
        setInterval(() => updateCountdown(timer.id, timer.endTime), 1000);
    });
}

// Update countdown timer
function updateCountdown(productId, endTime) {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const daysEl = document.getElementById(`days-${productId}`);
        const hoursEl = document.getElementById(`hours-${productId}`);
        const minsEl = document.getElementById(`mins-${productId}`);
        const secsEl = document.getElementById(`secs-${productId}`);

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minsEl) minsEl.textContent = minutes.toString().padStart(2, '0');
        if (secsEl) secsEl.textContent = seconds.toString().padStart(2, '0');
    }
}

// Initialize all filter sections as expanded by default
document.addEventListener('DOMContentLoaded', function () {
    const filterContents = document.querySelectorAll('.filter-content');
    filterContents.forEach(content => {
        content.style.maxHeight = content.scrollHeight + 'px';
    });
});
