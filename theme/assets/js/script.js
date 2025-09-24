document.addEventListener('DOMContentLoaded', () => {
    const delayMs = 80; // stagger per letter (ms) — tweak to taste

    document.querySelectorAll('.fancy-link').forEach(link => {
        // Determine color scheme based on parent .blog-card
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
                const t = setTimeout(() => s.style.color = hoverColor, i * delayMs);
                link._fancyTimeouts.push(t);
            });
        });

        link.addEventListener('mouseleave', () => {
            clearPending();
            spans.forEach((s, i) => {
                const reverseDelay = (spans.length - 1 - i) * delayMs;
                const t = setTimeout(() => s.style.color = baseColor, reverseDelay);
                link._fancyTimeouts.push(t);
            });
        });

        link.addEventListener('focus', () => link.dispatchEvent(new Event('mouseenter')));
        link.addEventListener('blur', () => link.dispatchEvent(new Event('mouseleave')));
    });
});

// drop-down
class SmoothDropdown {
    constructor() {
        this.dropdownContainers = document.querySelectorAll('.dropdown-container');
        this.backdrop = document.querySelector('.dropdown-backdrop');
        this.activeDropdown = null;
        this.init();
    }

    init() {
        this.dropdownContainers.forEach(container => {
            const trigger = container.querySelector('span');
            const dropdown = container.querySelector('.top-bar-dropdown');
            const items = dropdown.querySelectorAll('.top-bar-item');

            // Click event for dropdown trigger
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(container);
            });

            // Click events for dropdown items
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectItem(container, item);
                });
            });
        });

        // Backdrop click to close dropdowns
        this.backdrop.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

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
        container.classList.add('active');
        this.backdrop.classList.add('active');
        this.activeDropdown = container;
    }

    closeDropdown(container) {
        container.classList.remove('active');
        if (this.activeDropdown === container) {
            this.activeDropdown = null;
            this.backdrop.classList.remove('active');
        }
    }

    closeAllDropdowns() {
        this.dropdownContainers.forEach(container => {
            container.classList.remove('active');
        });
        this.backdrop.classList.remove('active');
        this.activeDropdown = null;
    }

    selectItem(container, item) {
        const trigger = container.querySelector('span');

        if (container.classList.contains('country')) {
            // Update country/currency selection
            const currency = item.dataset.currency;
            const flagImg = item.querySelector('img').src;

            trigger.querySelector('img').src = flagImg;
            trigger.querySelector('em').textContent = currency;

            console.log('Selected currency:', currency);
        } else if (container.classList.contains('language')) {
            // Update language selection
            const language = item.textContent.trim();
            trigger.querySelector('em').textContent = language;

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
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    navMobile.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
cancelMobileMenuBtn.addEventListener('click', toggleMobileMenu)
mobileOverlay.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
const mobileLinks = navMobile.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(toggleMobileMenu, 150);
    });
});

// Handle scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        // Add click events to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });

        // Start autoplay
        this.startAutoPlay();

        // Pause on hover
        const slider = document.querySelector('.hero-slider');
        slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
        slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000); // Change slide every 6 seconds
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});

// Add smooth scrolling for better UX
document.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const slider = document.querySelector('.hero-slider');
    slider.style.transform = `translateY(${scrolled * 0.5}px)`;
});



let currentSlide = 0;
const track = document.getElementById('categoriesTrack');
const dots = document.querySelectorAll('.dot');
const totalSlides = 3; // 6 items, 2 per slide = 3 slides

function updateCarousel() {
    const slideWidth = 100;
    track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Dot click handlers
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

// Touch/swipe functionality
let startX = 0;
let isDragging = false;

track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
});

track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0 && currentSlide < totalSlides - 1) {
            currentSlide++;
        } else if (diff < 0 && currentSlide > 0) {
            currentSlide--;
        }
        updateCarousel();
    }
});

// Mouse drag functionality for desktop testing
let mouseStartX = 0;
let isMouseDragging = false;

track.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    isMouseDragging = true;
    track.style.cursor = 'grabbing';
});

track.addEventListener('mousemove', (e) => {
    if (!isMouseDragging) return;
    e.preventDefault();
});

track.addEventListener('mouseup', (e) => {
    if (!isMouseDragging) return;
    isMouseDragging = false;
    track.style.cursor = 'grab';

    const endX = e.clientX;
    const diff = mouseStartX - endX;

    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSlide < totalSlides - 1) {
            currentSlide++;
        } else if (diff < 0 && currentSlide > 0) {
            currentSlide--;
        }
        updateCarousel();
    }
});

track.addEventListener('mouseleave', () => {
    isMouseDragging = false;
    track.style.cursor = 'grab';
});

// Auto-play (optional)
setInterval(() => {
    if (window.innerWidth <= 768) { // Only on mobile
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
}, 5000);


// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const productGrids = document.querySelectorAll('.products-grid');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide product grids
        productGrids.forEach(grid => {
            grid.style.display = 'none';
        });

        document.getElementById(targetTab + '-products').style.display = 'grid';
    });
});

// Countdown Timer
let countdownEndDate = null;

function updateCountdown() {
    const countdownElements = document.querySelectorAll('.countdown-display');

    // Set the end date only once
    if (!countdownEndDate) {
        const now = new Date().getTime();
        countdownEndDate = now + (24 * 60 * 60 * 1000); // 24 hours from now
    }

    countdownElements.forEach(element => {
        const now = new Date().getTime();
        const timeLeft = countdownEndDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            element.querySelector('.days').textContent = String(days).padStart(2, '0');
            element.querySelector('.hours').textContent = String(hours).padStart(2, '0');
            element.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
            element.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            // Reset the countdown when it reaches zero
            countdownEndDate = new Date().getTime() + (24 * 60 * 60 * 1000);
        }
    });
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Wishlist functionality
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const svg = btn.querySelector('svg');

        if (svg.style.fill === 'currentColor') {
            svg.style.fill = 'none';
            btn.style.color = '';
        } else {
            svg.style.fill = 'currentColor';
            btn.style.color = 'var(--primary)';
        }
    });
});

// Quick view functionality
document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        alert('Quick view functionality would open a modal here');
    });
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const originalText = btn.textContent;
        btn.textContent = 'Added! ✓';
        btn.style.background = 'var(--success)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
});


// testimonials 
class ReviewsCarousel {
    constructor() {
        this.track = document.getElementById('reviewsTrack');
        this.prevArrow = document.getElementById('prevArrow');
        this.nextArrow = document.getElementById('nextArrow');
        this.cards = this.track.children;
        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);

        this.init();
    }

    getCardsToShow() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1199) return 2;
        return 3;
    }

    init() {
        this.updateArrows();
        this.prevArrow.addEventListener('click', () => this.prevSlide());
        this.nextArrow.addEventListener('click', () => this.nextSlide());

        // Handle resize
        window.addEventListener('resize', () => {
            this.cardsToShow = this.getCardsToShow();
            this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updatePosition();
            this.updateArrows();
        });

        // Touch/swipe support
        this.initTouchSupport();
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updatePosition();
            this.updateArrows();
        }
    }

    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updatePosition();
            this.updateArrows();
        }
    }

    updatePosition() {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 30; // Match CSS gap
        const translateX = -(this.currentIndex * (cardWidth + gap));
        this.track.style.transform = `translateX(${translateX}px)`;
    }

    updateArrows() {
        // Show/hide and enable/disable arrows based on position
        this.prevArrow.disabled = this.currentIndex === 0;
        this.nextArrow.disabled = this.currentIndex >= this.maxIndex;

        // Add active class for visual feedback
        this.prevArrow.classList.toggle('active', this.currentIndex > 0);
        this.nextArrow.classList.toggle('active', this.currentIndex < this.maxIndex);
    }

    initTouchSupport() {
        let startX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });

        // Mouse support for desktop testing
        let mouseStartX = 0;
        let isMouseDragging = false;

        this.track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.track.style.cursor = 'grabbing';
        });

        this.track.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });

        this.track.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            this.track.style.cursor = 'grab';

            const endX = e.clientX;
            const diff = mouseStartX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });

        this.track.addEventListener('mouseleave', () => {
            isMouseDragging = false;
            this.track.style.cursor = 'grab';
        });

        this.track.style.cursor = 'grab';
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReviewsCarousel();
});

// scroll-to-top
window.addEventListener('scroll', function () {
    const btn = document.querySelector('.scroll-to-top');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight ? scrollTop / docHeight : 0;
    // Border grows from 0deg to 360deg
    btn.style.setProperty('--scroll-border', `${percent * 360}deg`);
    if (scrollTop === 0) {
        btn.classList.add('hide');
    } else {
        btn.classList.remove('hide');
    }
});