
// Thumbnail gallery functionality
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-product-image');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
        // Update active state
        thumbnails.forEach(item => item.classList.remove('active'));
        this.classList.add('active');

        // Update main image
        const imageSrc = this.querySelector('img').src;
        mainImage.src = imageSrc;
    });
});

// Quantity selector functionality
const decreaseBtn = document.getElementById('decrease-qty');
const increaseBtn = document.getElementById('increase-qty');
const qtyInput = document.getElementById('qty-input');

decreaseBtn.addEventListener('click', function () {
    const currentValue = parseInt(qtyInput.value);
    if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
    }
});

increaseBtn.addEventListener('click', function () {
    const currentValue = parseInt(qtyInput.value);
    qtyInput.value = currentValue + 1;
});

// Tab functionality
const tabItems = document.querySelectorAll('.tab-item');
const tabPanels = document.querySelectorAll('.tab-panel');

tabItems.forEach(item => {
    item.addEventListener('click', function () {
        // Update active tab
        tabItems.forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');

        // Show active panel
        const tabId = this.getAttribute('data-tab');
        tabPanels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
})


document.addEventListener('DOMContentLoaded', function () {
    var openBtn = document.getElementById('openReviewModal');
    var closeBtn = document.getElementById('closeReviewModal');
    var modal = document.getElementById('reviewModal');
    var overlay = document.getElementById('reviewModalOverlay');

    function openModal() {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
    // Prevent form submit default (for demo)
    var reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeModal();
        alert('Thank you for your review!');
    });
});
