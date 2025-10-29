// modal-overlay
const modalOverlay = document.getElementById("modalOverlay");

// drop down logic
class SmoothDropdown {
    constructor() {
        this.dropdownContainers = document.querySelectorAll('.dropdown-container');
        this.backdrop = document.querySelector('.dropdown-backdrop');
        this.activeDropdown = null;
        if (this.dropdownContainers && this.backdrop) {
            this.init();
        }
    }

    init() {

        if (!this.dropdownContainers) return;
        this.dropdownContainers.forEach(container => {
            if (!container) return;
            const trigger = container.querySelector('span');
            const dropdown = container.querySelector('.top-bar-dropdown');
            const items = dropdown ? dropdown.querySelectorAll('.top-bar-item') : null;

            // Click event for dropdown trigger
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown(container);
                });
            }
            // Click events for dropdown items
            if (items) {
                items.forEach(item => {
                    if (!item) return;
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectItem(container, item);
                    });
                });
            }
        });

        // Backdrop click to close dropdowns
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.closeAllDropdowns();
            });
        }

        // Escape key to close dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }

    toggleDropdown(container) {
        if (this.activeDropdown === container) {
            this.closeDropdown(container);
        } else {
            this.closeAllDropdowns();
            this.openDropdown(container);
        }
    }

    openDropdown(container) {
        if (container) container.classList.add('active');
        if (this.backdrop) this.backdrop.classList.add('active');
        if (container) this.activeDropdown = container;
    }

    closeDropdown(container) {
        if (container) container.classList.remove('active');
        if (this.activeDropdown === container) {
            this.activeDropdown = null;
            if (this.backdrop) this.backdrop.classList.remove('active');
        }
    }

    closeAllDropdowns() {
        if (!this.dropdownContainers) return;
        this.dropdownContainers.forEach(container => {
            if (container) container.classList.remove('active');
        });
        if (this.backdrop) this.backdrop.classList.remove('active');
        this.activeDropdown = null;
    }

    selectItem(container, item) {
        if (!container || !item) return;
        const trigger = container.querySelector('span');
        if (!trigger) return;

        if (container.classList.contains('country')) {
            // Update country/currency selection
            const currency = item.dataset.currency;
            const flagImg = item.querySelector('img') ? item.querySelector('img').src : '';
            if (trigger.querySelector('img')) trigger.querySelector('img').src = flagImg;
            if (trigger.querySelector('em')) trigger.querySelector('em').textContent = currency;
            console.log('Selected currency:', currency);
        } else if (container.classList.contains('language')) {
            // Update language selection
            const language = item.textContent ? item.textContent.trim() : '';
            if (trigger.querySelector('em')) trigger.querySelector('em').textContent = language;
            console.log('Selected language:', language);
        }

        // Close dropdown after selection
        this.closeDropdown(container);

        // Add a subtle animation to show selection
        trigger.style.transform = 'scale(0.98)';
        setTimeout(() => {
            trigger.style.transform = 'scale(1)';
        }, 100);
    }
}

// Initialize dropdown functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmoothDropdown();
});


// mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const cancelMobileMenuBtn = document.getElementById('closeMobileMenu');
const navMobile = document.getElementById('navMobile');

function openMobileMenu() {
    if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
    if (navMobile) navMobile.classList.add('active');
    if (modalOverlay) modalOverlay.classList.add('active');
    if (navMobile && document.body) document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    if (navMobile) navMobile.classList.remove('active');
    if (modalOverlay) modalOverlay.classList.remove('active');
    if (document.body) document.body.style.overflow = '';
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (cancelMobileMenuBtn) {
    cancelMobileMenuBtn.addEventListener('click', closeMobileMenu)
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking on a link
let mobileLinks = [];
if (navMobile) {
    mobileLinks = navMobile.querySelectorAll('a');
    if (mobileLinks) {
        mobileLinks.forEach(link => {
            if (!link) return;
            link.addEventListener('click', () => {
                setTimeout(closeMobileMenu, 150);
            });
        });
    }
}

const delayMs = 80;
document.querySelectorAll('.fancy-link').forEach(link => {
    // Determine color scheme based on parent .blog-card
    if (!link) return;
    const inBlogCard = link.closest('.blog-card');
    const baseColor = inBlogCard ? 'var(--primary-color)' : 'var(--secondary-color)';
    const hoverColor = inBlogCard ? 'var(--accent-color)' : 'var(--dark-brown)';

    // Build spans for each character (preserve spaces)
    const text = link.textContent;
    const chars = Array.from(text);
    link.innerHTML = '';

    const spans = chars.map(ch => {
        const s = document.createElement('span');
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        s.style.color = baseColor;
        s.style.transition = 'color 200ms ease';
        link.appendChild(s);
        return s;
    });

    link._fancyTimeouts = [];

    function clearPending() {
        while (link._fancyTimeouts.length) {
            clearTimeout(link._fancyTimeouts.shift());
        }
    }

    link.addEventListener('mouseenter', () => {
        clearPending();
        spans.forEach((s, i) => {
            if (!s) return;
            const t = setTimeout(() => s.style.color = hoverColor, i * delayMs);
            link._fancyTimeouts.push(t);
        });
    });

    link.addEventListener('mouseleave', () => {
        clearPending();
        spans.forEach((s, i) => {
            if (!s) return;
            const reverseDelay = (spans.length - 1 - i) * delayMs;
            const t = setTimeout(() => s.style.color = baseColor, reverseDelay);
            link._fancyTimeouts.push(t);
        });
    });

    link.addEventListener('focus', () => link.dispatchEvent(new Event('mouseenter')));
    link.addEventListener('blur', () => link.dispatchEvent(new Event('mouseleave')));
});


//  * Scroll to Top Button with Progress Indicator


(function () {
    // Cache DOM elements to avoid repeated queries
    const goTopBtn = document.getElementById('goTop');
    const borderProgress = goTopBtn.querySelector('.border-progress');

    // Configuration
    const SHOW_AFTER_PX = (window.innerHeight / 2); // Show after scrolling one viewport height (one section)

    /**
     * Calculate scroll progress as a percentage
     * @returns {number} Progress from 0 to 100
     */
    function calculateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return (scrollTop / scrollHeight) * 100;
    }

    /**
     * Update button visibility and progress indicator
     */
    function updateScrollButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show/hide button based on scroll position
        if (scrollTop > SHOW_AFTER_PX) {
            goTopBtn.classList.add('show');
        } else {
            goTopBtn.classList.remove('show');
        }

        // Calculate and update progress angle (0-360 degrees)
        const progress = calculateScrollProgress();
        const progressAngle = (progress / 100) * 360;

        // Update CSS custom property for conic-gradient mask
        borderProgress.style.setProperty('--progress-angle', `${progressAngle}deg`);
    }

    /**
     * Smooth scroll to top of page
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event Listeners
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', updateScrollButton, { passive: true });
    goTopBtn.addEventListener('click', scrollToTop);

    // Initial check on page load
    updateScrollButton();
})();

// Search Modal logic
const openSearchBtns = document.querySelectorAll('.search-btn');
const closeSearchBtn = document.getElementById('closeSearchModal');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const clearSearchHistory = document.getElementById("clearSearchHistory");
const searchedItems = document.querySelectorAll(".searchedItem");
const noSearchFound = document.querySelector(".noSearchFound");

function closeAllMenusExceptSearch() {
    document.querySelectorAll('.sidebar, .nav-mobile, .other-modal, .dropdown, .preview')
        .forEach(el => el.classList.remove('active', 'open', 'show', 'preview'));
    document.body.classList.remove('modal-available');
}

function openSearchModal(e) {
    if (e) e.preventDefault();
    closeAllMenusExceptSearch();
    if (searchModal) searchModal.style.display = 'block';
    if (modalOverlay) modalOverlay.classList.add('active');
    if (document.body) document.body.style.overflow = 'hidden';
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 100);
}

function closeSearchModal() {
    if (searchModal) searchModal.style.display = 'none';
    if (modalOverlay) modalOverlay.classList.remove('active');
    if (document.body) document.body.style.overflow = '';
}

if (openSearchBtns) {
    openSearchBtns.forEach(function (btn) {
        if (!btn) return;
        btn.addEventListener('click', openSearchModal);
    });
}

if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearchModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeSearchModal);
}

document.addEventListener('keydown', function (e) {
    if (searchModal && searchModal.classList.contains('active') && e.key === 'Escape') closeSearchModal();
});

// Prevent form submit default
const searchForm = document.getElementById('searchForm');

if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeSearchModal();
        alert('Searching for: ' + (searchInput ? searchInput.value : ''));
    });
}

if (!searchedItems) {
    clearSearchHistory.classList.add("disabled");
    noSearchFound.classList.add("active");
} else {
    clearSearchHistory.addEventListener("click", () => {
        searchedItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.remove();
                    // After the last item is removed, update classes
                    if (index === searchedItems.length - 1) {
                        clearSearchHistory.classList.add("disabled");
                        noSearchFound.classList.add("active");
                    }
                }, 600);
            }, index * 100);
        });
    });
}

// Utility Functions
function handlePreviewToggle(openMenu, menu) {
    const closeMenu = menu.querySelector('.close-menu');

    openMenu.addEventListener('click', () => {
        // Hide any open preview before previewing the new one
        hideAllPreview()

        menu.classList.add('preview')
        document.body.classList.add('modal-available')
    });

    closeMenu.addEventListener('click', () => {
        menu.classList.remove('preview')
        document.body.classList.remove('modal-available')
    })

    menu.addEventListener('click', (e) => {
        if (!e.target.closest('[class*="content"]')) {
            menu.classList.remove('preview')
            document.body.classList.remove('modal-available')
        }
    })
}

function hideAllPreview() {
    const openPreview = document.querySelector('[class*="preview"]')

    if (openPreview) {
        openPreview.classList.remove('preview');
        document.body.classList.remove('modal-available')
    }
}

// cart function
const FREE_SHIPPING_THRESHOLD = 150;

function updateCartTotals() {
    const items = document.querySelectorAll('.cart-menu .cart-menu-item');    
    let totalAmount = 0;
    let totalItems = 0;
    if (items) {
        items.forEach(item => {
            const unitPrice = parseFloat(item.dataset.price);
            const quantity = parseInt(item.querySelector('.cart-menu .qty-value').textContent);
            const itemTotal = unitPrice * quantity;

            // Update item price display
            item.querySelector('.cart-menu .cart-menu-item-price').textContent = `${itemTotal.toFixed(2)}`;

            totalAmount += itemTotal;
            totalItems += quantity;
            
        });

        // Update subtotal

        document.querySelector('.cart-menu .cart-menu-subtotal-amount') ? document.querySelector('.cart-menu .cart-menu-subtotal-amount').textContent = `${totalAmount.toFixed(2)}` : null;
        document.querySelector('.cart-menu .cart-menu-subtotal-count') ? document.querySelector('.cart-menu .cart-menu-subtotal-count').textContent = `(${totalItems} item${totalItems !== 1 ? 's' : ''})` : null;
    }

    // Update progress bar
    const remaining = FREE_SHIPPING_THRESHOLD - totalAmount;
    const progressPercentage = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);

    document.querySelector('.cart-menu-progress-fill').style.width = `${progressPercentage}%`;

    if (remaining > 0) {
        document.querySelector('.cart-menu-progress-text').innerHTML =
            `Add <span class="cart-menu-progress-amount">${remaining.toFixed(2)}</span> to cart and get free shipping!`;
    } else {
        document.querySelector('.cart-menu-progress-text').innerHTML =
            `<span class="cart-menu-progress-amount">You qualify for free shipping!</span>`;
    }
}

function toggleCart() {
    const cartMenu = document.querySelector('.cart-menu');
    modalOverlay.classList.toggle('active');
    cartMenu.classList.toggle('active');
}

modalOverlay.addEventListener('click', function () {
    const cartMenu = document.querySelector('.cart-menu');
    if (cartMenu.classList.contains('active')) {
        cartMenu.classList.remove('active');
        modalOverlay.classList.remove('active');
    }
});

// Close cart when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // const overlay = document.querySelector('.cart-overlay');
        const cartMenu = document.querySelector('.cart-menu');

        if (modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
            cartMenu.classList.remove('active');
        }
    }
});

// Quantity increase/decrease functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-increase') || e.target.closest('.qty-increase')) {
        const btn = e.target.classList.contains('qty-increase') ? e.target : e.target.closest('.qty-increase');
        const qtyValue = btn.parentElement.querySelector('.qty-value');
        const decreaseBtn = btn.parentElement.querySelector('.qty-decrease');

        let quantity = parseInt(qtyValue.textContent);
        quantity++;
        qtyValue.textContent = quantity;

        // Enable decrease button
        decreaseBtn.disabled = false;

        // Update totals
        updateCartTotals();
    }

    if (e.target.classList.contains('qty-decrease') || e.target.closest('.qty-decrease')) {
        const btn = e.target.classList.contains('qty-decrease') ? e.target : e.target.closest('.qty-decrease');
        const qtyValue = btn.parentElement.querySelector('.qty-value');

        let quantity = parseInt(qtyValue.textContent);

        if (quantity > 1) {
            quantity--;
            qtyValue.textContent = quantity;

            // Disable button if quantity is 1
            if (quantity === 1) {
                btn.disabled = true;
            }

            // Update totals
            updateCartTotals();
        }
    }
});

// Remove item functionality
document.querySelectorAll('.cart-menu-item-remove').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const item = this.closest('.cart-menu-item');

        // Smooth slide out animation
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateX(100%)';
        item.style.marginBottom = '0';
        item.style.paddingBottom = '0';
        item.style.maxHeight = item.offsetHeight + 'px';

        setTimeout(() => {
            item.style.maxHeight = '0';
        }, 50);

        setTimeout(() => {
            item.remove();
            updateCartTotals();

            // Check if cart is empty
            const remainingItems = document.querySelectorAll('.cart-menu-item');
            if (remainingItems.length === 0) {
                document.querySelector('.cart-menu-items').innerHTML = `
                            <div style="text-align: center; padding: 60px 20px; color: var(--text-color);">
                                <svg style="width: 80px; height: 80px; margin-bottom: 20px; opacity: 0.3;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                <h3 style="font-size: 20px; color: var(--primary-btn); margin-bottom: 8px;">Your cart is empty</h3>
                                <p style="font-size: 14px;">Add some products to get started!</p>
                            </div>
                        `;
            }
        }, 350);
    });
});

// Initialize totals on page load
updateCartTotals();

// Disable all decrease buttons that are at quantity 1
document.querySelectorAll('.qty-decrease').forEach(btn => {
    const qtyValue = btn.parentElement.querySelector('.qty-value');
    if (parseInt(qtyValue.textContent) === 1) {
        btn.disabled = true;
    }
});

// Mobile Accordion Functionality
function initMobileAccordion() {
    if (window.innerWidth <= 767) {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            // Remove any previous click listeners by cloning
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
        });
        // Now re-select headers after cloning
        const freshHeaders = document.querySelectorAll('.accordion-header');
        freshHeaders.forEach(header => {
            header.addEventListener('click', function () {
                const section = this.closest('.collapsible-section');
                const isActive = section.classList.contains('active');
                // Close all sections
                document.querySelectorAll('.collapsible-section').forEach(s => {
                    s.classList.remove('active');
                    s.setAttribute('aria-expanded', 'false');
                });
                // Toggle current section
                if (!isActive) {
                    section.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
}

// Initialize accordion on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    initMobileAccordion();
});

// Re-initialize on window resize
window.addEventListener('resize', function () {
    if (window.innerWidth <= 767) {
        initMobileAccordion();
    } else {
        // Remove mobile accordion classes on desktop
        document.querySelectorAll('.collapsible-section').forEach(section => {
            section.classList.remove('active');
        });
    }
});