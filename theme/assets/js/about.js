const storiesTrack = document.querySelector(".storiesTrack");

if (storiesTrack) {
    const stories = document.querySelectorAll(".story");
    const storyDotsContainer = document.querySelector(".story-dots");

    let storyPerPage = 1;
    let storyWidth = 0;
    let totalPages = 0;
    let currentPage = 0;

    function updateStoriesLayout() {
        const screenWidth = window.innerWidth;

        // Set storys per page based on screen size
        if (screenWidth <= 608) {
            storyPerPage = 1;
        } else if (screenWidth <= 1024) {
            storyPerPage = 2;
        } else {
            storyPerPage = 3;
        }

        // Get the computed gap from CSS
        const style = getComputedStyle(storiesTrack);
        const gap = parseInt(style.gap || 0, 10);

        // Calculate width per story including gap
        const containerWidth = storiesTrack.clientWidth;
        const totalGap = gap * (storyPerPage - 1);
        storyWidth = (containerWidth - totalGap) / storyPerPage;

        // Set width for each story
        stories.forEach(story => {
            story.style.minWidth = `${storyWidth}px`;
            story.style.maxWidth = `${storyWidth}px`;
        });

        // Calculate total pages
        totalPages = Math.ceil(stories.length / storyPerPage);

        // Render pagination dots
        renderStoryDots();

        // Reset to first page
        currentPage = 0;
        goToStoryPage(currentPage, false);
    }

    function renderStoryDots() {
        storyDotsContainer.innerHTML = "";

        // Only show dots if there's more than one page
        if (totalPages <= 1) return;

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement("span");
            dot.classList.add("story-dot");
            if (i === currentPage) dot.classList.add("active");

            dot.addEventListener("click", () => {
                goToStoryPage(i);
            });

            storyDotsContainer.appendChild(dot);
        }
    }

    function goToStoryPage(pageIndex, smooth = true) {
        if (pageIndex < 0 || pageIndex >= totalPages) return;

        currentPage = pageIndex;

        // Calculate scroll position
        const scrollX = pageIndex * (storyWidth + 20) * storyPerPage;

        storiesTrack.scrollTo({
            left: scrollX,
            behavior: smooth ? "smooth" : "instant"
        });

        updateStoryDots();
    }

    function updateStoryDots() {
        const storyDots = document.querySelectorAll(".story-dot");
        storyDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentPage);
        });
    }

    // Navigation functions
    // function prevCategory() {
    //     if (currentPage > 0) {
    //         goToStoryPage(currentPage - 1);
    //     }
    // }

    // function nextCategory() {
    //     if (currentPage < totalPages - 1) {
    //         goToStoryPage(currentPage + 1);
    //     }
    // }

    // Sync dots when user scrolls manually
    let scrollTimeout;
    storiesTrack.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = storiesTrack.scrollLeft;
            const pageWidth = (storyWidth + 20) * storyPerPage;
            const newPage = Math.round(scrollLeft / pageWidth);

            if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
                currentPage = newPage;
                updateStoryDots();
            }
        }, 100);
    });

    // Initialize on load and resize
    window.addEventListener("resize", updateStoriesLayout);
    window.addEventListener("load", updateStoriesLayout);

    // Initial setup
    updateStoriesLayout();
}
// Simple review carousel functionality
const reviews = document.querySelectorAll('.review');
const avatars = document.querySelectorAll('.avatar');

avatars.forEach(avatar => {
    avatar.addEventListener('click', () => {
        let i = avatar.dataset.index;

        // remove all active
        reviews.forEach(r => r.classList.remove('active'));
        avatars.forEach(a => a.classList.remove('active'));

        // activate clicked
        reviews[i].classList.add('active');
        avatar.classList.add('active');
    });
});