/**
         * Scroll to Top Button with Progress Indicator
         * 
         * Technical Approach:
         * 1. Show button after scrolling past first section (100vh)
         * 2. Calculate scroll progress as percentage
         * 3. Convert percentage to degrees (0-360) for conic-gradient
         * 4. Update CSS custom property --progress-angle dynamically
         * 5. Smooth scroll to top on click
         */

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

function openSearchModal(e) {
    if (e) e.preventDefault();
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