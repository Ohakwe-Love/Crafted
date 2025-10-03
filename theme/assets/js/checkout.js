// Copy to clipboard functionality
function copyToClipboard(text, button) {
    // Use the Clipboard API to copy text
    navigator.clipboard.writeText(text).then(() => {
        // Add 'copied' class for visual feedback
        button.classList.add('copied');
        
        // Change icon temporarily to checkmark
        const originalSVG = button.innerHTML;
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalSVG;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please copy manually.');
    });
}

// Card number formatting - adds space every 4 digits
const cardNumberInput = document.getElementById('card-number');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, ''); // Remove existing spaces
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value; // Add space every 4 digits
        e.target.value = formattedValue;
    });
    
    // Only allow numbers
    cardNumberInput.addEventListener('keypress', function(e) {
        if (!/[0-9\s]/.test(e.key)) {
            e.preventDefault();
        }
    });
}

// Card expiry date formatting and validation (MM/DD/YYYY)
const cardExpiryInput = document.getElementById('card-expiry');
if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        let formattedValue = '';
        
        if (value.length > 0) {
            // Month validation (01-12)
            let month = value.substring(0, 2);
            if (value.length >= 1) {
                // If first digit > 1, prepend 0
                if (parseInt(value[0]) > 1) {
                    month = '0' + value[0];
                    value = month + value.substring(1);
                }
                
                // Validate month is between 01-12
                if (value.length >= 2) {
                    let monthNum = parseInt(month);
                    if (monthNum > 12) {
                        month = '12';
                    } else if (monthNum < 1) {
                        month = '01';
                    }
                }
            }
            formattedValue = month;
        }
        
        if (value.length >= 3) {
            // Day validation (01-31)
            let day = value.substring(2, 4);
            if (value.length >= 3) {
                // If first digit of day > 3, prepend 0
                if (parseInt(value[2]) > 3) {
                    day = '0' + value[2];
                    value = value.substring(0, 2) + day + value.substring(3);
                }
                
                // Validate day is between 01-31
                if (value.length >= 4) {
                    let dayNum = parseInt(day);
                    if (dayNum > 31) {
                        day = '31';
                    } else if (dayNum < 1) {
                        day = '01';
                    }
                }
            }
            formattedValue += '/' + day;
        }
        
        if (value.length >= 5) {
            // Year (YYYY)
            let year = value.substring(4, 8);
            formattedValue += '/' + year;
        }
        
        e.target.value = formattedValue;
    });
    
    // Only allow numbers and forward slash
    cardExpiryInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key) && e.key !== '/') {
            e.preventDefault();
        }
    });
}

// CVV validation - only numbers, max 4 digits
const cardCVVInput = document.getElementById('card-cvv');
if (cardCVVInput) {
    cardCVVInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    
    cardCVVInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Card name validation - only letters and spaces
const cardNameInput = document.getElementById('card-name');
if (cardNameInput) {
    cardNameInput.addEventListener('keypress', function(e) {
        if (!/[a-zA-Z\s]/.test(e.key)) {
            e.preventDefault();
        }
    });
}

// Shipping selection functionality
function selectShipping(shippingType) {
    // Update radio button
    document.getElementById('shipping-' + shippingType).checked = true;

    // Remove selected class from all shipping options
    const allShipping = document.querySelectorAll('.shipping-radio');
    allShipping.forEach(option => option.classList.remove('selected'));

    // Add selected class to clicked option
    event.currentTarget.classList.add('selected');
}

// Form validation on submit
document.querySelector('.payment-button').addEventListener('click', function (e) {
    e.preventDefault();

    // Check if payment method is selected
    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    if (!paymentSelected) {
        alert('Please select a payment method');
        return;
    }

    // If credit card is selected, validate card details
    if (paymentSelected.value === 'credit') {
        const cardName = document.getElementById('card-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVV = document.getElementById('card-cvv').value;
        
        if (!cardName) {
            alert('Please enter the name on the card');
            document.getElementById('card-name').focus();
            return;
        }
        
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            alert('Please enter a valid card number');
            document.getElementById('card-number').focus();
            return;
        }
        
        if (cardExpiry.length !== 10) {
            alert('Please enter a valid expiry date (MM/DD/YYYY)');
            document.getElementById('card-expiry').focus();
            return;
        }
        
        // Validate expiry date is not in the past
        const [month, day, year] = cardExpiry.split('/').map(num => parseInt(num));
        const expiryDate = new Date(year, month - 1, day);
        const today = new Date();
        
        if (expiryDate < today) {
            alert('Card expiry date cannot be in the past');
            document.getElementById('card-expiry').focus();
            return;
        }
        
        if (cardCVV.length < 3 || cardCVV.length > 4) {
            alert('Please enter a valid CVV (3 or 4 digits)');
            document.getElementById('card-cvv').focus();
            return;
        }
    }

    // Check if terms are accepted
    const termsAccepted = document.getElementById('terms').checked;
    if (!termsAccepted) {
        alert('Please accept the terms and conditions');
        return;
    }

    // If all validations pass
    alert('Order submitted successfully!');
    // Here you would normally submit the form to your server
});