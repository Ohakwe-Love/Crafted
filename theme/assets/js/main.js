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
        borderProgress.style.setProperty('--progress-angle', `${ progressAngle }deg`);
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