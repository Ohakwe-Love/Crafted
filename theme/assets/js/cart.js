// Cart functionality
class ShoppingCart {
    constructor() {
        this.init();
        this.startTimer();
    }

    init() {
        this.attachEventListeners();
        this.calculateTotals();
        this.updateProgress();
    }

    attachEventListeners() {
        // Quantity controls
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.updateQuantity(e, 'increase'));
        });

        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.updateQuantity(e, 'decrease'));
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.removeItem(e));
        });

        // Shipping options
        document.querySelectorAll('input[name="shipping"]').forEach(input => {
            input.addEventListener('change', () => this.calculateTotals());
        });
    }

    updateQuantity(e, action) {
        const cartItem = e.target.closest('.cart-item');
        const quantityElement = cartItem.querySelector('.quantity-value');
        const price = parseFloat(cartItem.dataset.price);
        let quantity = parseInt(quantityElement.textContent);

        if (action === 'increase') {
            quantity++;
        } else if (action === 'decrease' && quantity > 1) {
            quantity--;
        }

        quantityElement.textContent = quantity;

        // Update item total
        const totalPrice = (price * quantity).toFixed(2);
        cartItem.querySelector('.product-total').textContent = `$${totalPrice}`;

        this.calculateTotals();
        this.updateProgress();
    }

    removeItem(e) {
        const cartItem = e.target.closest('.cart-item');
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            cartItem.remove();
            this.calculateTotals();
            this.updateProgress();
            this.checkEmptyCart();
        }, 300);
    }

    calculateTotals() {
        const cartItems = document.querySelectorAll('.cart-item');
        let subtotal = 0;

        cartItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const quantity = parseInt(item.querySelector('.quantity-value').textContent);
            subtotal += price * quantity;
        });

        // Get selected shipping
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        const shippingCost = parseFloat(selectedShipping.value);

        // Calculate discount (15% as shown in active voucher)
        const discount = subtotal * 0.15;

        // Calculate total
        const total = subtotal - discount + shippingCost;

        // Update UI
        document.querySelector('.subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.discount-amount').textContent = `-$${discount.toFixed(2)}`;
        document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
    }

    updateProgress() {
        const cartItems = document.querySelectorAll('.cart-item');
        let subtotal = 0;

        cartItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const quantity = parseInt(item.querySelector('.quantity-value').textContent);
            subtotal += price * quantity;
        });

        const freeShippingThreshold = 150;
        const progressPercentage = Math.min((subtotal / freeShippingThreshold) * 100, 100);

        document.querySelector('.progress-fill').style.width = `${progressPercentage}%`;
    }

    checkEmptyCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        const emptyCart = document.querySelector('.empty-cart');
        const cartItemsContainer = document.querySelector('.cart-items');

        if (cartItems.length === 0) {
            emptyCart.classList.add('show');
            cartItemsContainer.style.display = 'none';
            document.querySelector('.shipping-progress').style.display = 'none';
            document.querySelector('.voucher-section').style.display = 'none';
        } else {
            emptyCart.classList.remove('show');
            cartItemsContainer.style.display = 'block';
        }
    }

    startTimer() {
        let timeLeft = 4 * 60 + 44; // 4 minutes 44 seconds (as shown in design)
        const timerElement = document.querySelector('.timer');

        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeLeft > 0) {
                timeLeft--;
            } else {
                clearInterval(timerInterval);
                // You can add logic here for when timer expires
            }
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});