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
        if (slider) {
            slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    goToSlide(index) {
        // Remove active class from current slide and dot
        if (this.slides.length > 0) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');

            // Update current slide
            this.currentSlide = index;

            // Add active class to new slide and dot
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
        }
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

const categoriesTrack = document.querySelector(".categories-track");

if (categoriesTrack) {
    const categoryItems = document.querySelectorAll(".category-item");
    const catDotsContainer = document.querySelector(".cat-dots");

    let itemsPerPage = 1;
    let itemWidth = 0;
    let totalPages = 0;
    let currentPage = 0;

    function updateCategoriesLayout() {
        const screenWidth = window.innerWidth;

        // Set items per page based on screen size
        if (screenWidth <= 608) {
            itemsPerPage = 1;
        } else if (screenWidth <= 1024) {
            itemsPerPage = 3;
        } else {
            itemsPerPage = 6;
        }

        // Get the computed gap from CSS
        const style = getComputedStyle(categoriesTrack);
        const gap = parseInt(style.gap || 0, 10);

        // Calculate width per item including gap
        const containerWidth = categoriesTrack.clientWidth;
        const totalGap = gap * (itemsPerPage - 1);
        itemWidth = (containerWidth - totalGap) / itemsPerPage;

        // Set width for each item
        categoryItems.forEach(item => {
            item.style.minWidth = `${itemWidth}px`;
            item.style.maxWidth = `${itemWidth}px`;
        });

        // Calculate total pages
        totalPages = Math.ceil(categoryItems.length / itemsPerPage);

        // Render pagination dots
        renderCatDots();

        // Reset to first page
        currentPage = 0;
        goToCategoryPage(currentPage, false);
    }

    function renderCatDots() {
        catDotsContainer.innerHTML = "";

        // Only show dots if there's more than one page
        if (totalPages <= 1) return;

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement("span");
            dot.classList.add("cat-dot");

            if (dot) {
                if (i === currentPage) dot.classList.add("active");

                dot.addEventListener("click", () => {
                    goToCategoryPage(i);
                });

                catDotsContainer.appendChild(dot);
            }
        }
    }

    function goToCategoryPage(pageIndex, smooth = true) {
        if (pageIndex < 0 || pageIndex >= totalPages) return;

        currentPage = pageIndex;

        // Calculate scroll position
        const scrollX = pageIndex * (itemWidth + 20) * itemsPerPage;

        categoriesTrack.scrollTo({
            left: scrollX,
            behavior: smooth ? "smooth" : "instant"
        });

        updateCatDots();
    }

    function updateCatDots() {
        const catDots = document.querySelectorAll(".cat-dot");
        catDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentPage);
        });
    }

    // Navigation functions
    function prevCategory() {
        if (currentPage > 0) {
            goToCategoryPage(currentPage - 1);
        }
    }

    function nextCategory() {
        if (currentPage < totalPages - 1) {
            goToCategoryPage(currentPage + 1);
        }
    }

    // Sync dots when user scrolls manually
    let scrollTimeout;
    categoriesTrack.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = categoriesTrack.scrollLeft;
            const pageWidth = (itemWidth + 20) * itemsPerPage;
            const newPage = Math.round(scrollLeft / pageWidth);

            if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
                currentPage = newPage;
                updateCatDots();
            }
        }, 100);
    });

    // Initialize on load and resize
    window.addEventListener("resize", updateCategoriesLayout);
    window.addEventListener("load", updateCategoriesLayout);

    // Initial setup
    updateCategoriesLayout();
}

// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const productGrids = document.querySelectorAll('.products-grid');

tabBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        if (!targetTab) return;

        // Update active tab
        tabBtns.forEach(b => { if (b) b.classList.remove('active'); });
        btn.classList.add('active');

        // Show/hide product grids
        productGrids.forEach(grid => {
            if (grid) grid.style.display = 'none';
        });

        const targetGrid = document.getElementById(targetTab + '-products');
        if (targetGrid) targetGrid.style.display = 'grid';
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
        if (!element) return;
        const now = new Date().getTime();
        const timeLeft = countdownEndDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            if (element.querySelector('.days')) element.querySelector('.days').textContent = String(days).padStart(2, '0');
            if (element.querySelector('.hours')) element.querySelector('.hours').textContent = String(hours).padStart(2, '0');
            if (element.querySelector('.minutes')) element.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
            if (element.querySelector('.seconds')) element.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
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
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const svg = btn.querySelector('svg');
        if (!svg) return;

        if (svg.style.fill === 'currentColor') {
            svg.style.fill = 'none';
            btn.style.color = '';
        } else {
            svg.style.fill = 'currentColor';
            btn.style.color = 'var(--primary)';
        }
    });
});

// testimonials 
class ReviewsCarousel {
    constructor() {
        this.track = document.getElementById('reviewsTrack');
        this.prevArrow = document.getElementById('prevArrow');
        this.nextArrow = document.getElementById('nextArrow');
        this.cards = document.querySelectorAll(".review-card");
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
        if (this.prevArrow && this.nextArrow) {
            this.prevArrow.addEventListener('click', () => this.prevSlide());
            this.nextArrow.addEventListener('click', () => this.nextSlide());
        }

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
        if (this.prevArrow && this.nextArrow) {
            // Show/hide and enable/disable arrows based on position
            this.prevArrow.disabled = this.currentIndex === 0;
            this.nextArrow.disabled = this.currentIndex >= this.maxIndex;

            // Add active class for visual feedback
            this.prevArrow.classList.toggle('active', this.currentIndex > 0);
            this.nextArrow.classList.toggle('active', this.currentIndex < this.maxIndex);
        }
    }

    initTouchSupport() {
        let startX = 0;
        let isDragging = false;

        if (this.track) {

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
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReviewsCarousel();
});