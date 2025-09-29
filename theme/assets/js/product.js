
// Thumbnail gallery functionality
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-product-image');

if (thumbnails && mainImage) {
    thumbnails.forEach(thumbnail => {
        if (!thumbnail) return;
        thumbnail.addEventListener('click', function () {
            // Update active state
            thumbnails.forEach(item => { if (item) item.classList.remove('active'); });
            this.classList.add('active');

            // Update main image
            const img = this.querySelector('img');
            if (img && mainImage) {
                const imageSrc = img.src;
                mainImage.src = imageSrc;
            }
        });
    });
}

// Quantity selector functionality
const decreaseBtn = document.getElementById('decrease-qty');
const increaseBtn = document.getElementById('increase-qty');
const qtyInput = document.getElementById('qty-input');

if (decreaseBtn && qtyInput) {
    decreaseBtn.addEventListener('click', function () {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });
}

if (increaseBtn && qtyInput) {
    increaseBtn.addEventListener('click', function () {
        const currentValue = parseInt(qtyInput.value);
        qtyInput.value = currentValue + 1;
    });
}

// Tab functionality
const tabItems = document.querySelectorAll('.tab-item');
const tabPanels = document.querySelectorAll('.tab-panel');

if (tabItems && tabPanels) {
    tabItems.forEach(item => {
        if (!item) return;
        item.addEventListener('click', function () {
            // Update active tab
            tabItems.forEach(tab => { if (tab) tab.classList.remove('active'); });
            this.classList.add('active');

            // Show active panel
            const tabId = this.getAttribute('data-tab');
            tabPanels.forEach(panel => { if (panel) panel.classList.remove('active'); });
            const targetPanel = document.getElementById(tabId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}


const openReviewBtn = document.getElementById('openReviewModal');

const closeReviewBtn = document.getElementById('closeReviewModal');
const reviewModal = document.getElementById('reviewModal');
// const modalOverlay = document.getElementById('modalOverlay');

function openReviewModal() {
    if (reviewModal) reviewModal.style.display = 'block';
    if (modalOverlay) modalOverlay.classList.add("active");
    if (document.body) document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
    if (reviewModal) reviewModal.style.display = 'none';
    if (modalOverlay) modalOverlay.classList.remove("active");
    if (document.body) document.body.style.overflow = '';
}

if (openReviewBtn) openReviewBtn.addEventListener('click', openReviewModal);

if (closeReviewBtn) closeReviewBtn.addEventListener('click', closeReviewModal);

if (modalOverlay) modalOverlay.addEventListener('click', closeReviewModal);

document.addEventListener('keydown', function (e) {
    if (e && e.key === 'Escape') closeReviewModal();
});

// Prevent form submit default (for demo)
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeReviewModal();
        alert('Thank you for your review!');
    });
}