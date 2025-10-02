// Dashboard Navigation
document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const contentSections = document.querySelectorAll('.content-section');

    // Handle navigation clicks
    navItems.forEach(navItem => {
        navItem.addEventListener('click', function () {
            hideAllPreview();

            const targetSection = this.getAttribute('data-section');

            // Remove active class from all nav items
            navItems.forEach(item => item.classList.remove('active'));

            // Add active class to clicked nav item
            this.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));

            // Show target section
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });

    // Password toggle functionality
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Change profile image 
    const profile = document.querySelector('.dashboard-profile-image');
    const changeProfileBtn = document.querySelector('.camera-btn');
    const imageInput = document.querySelector('.profile-image-input');

    // When the camera button is clicked, trigger the file input
    changeProfileBtn.addEventListener('click', () => {
        imageInput.click();
    });

    // Listen for changes on the file input (when a user selects a file)
    imageInput.addEventListener('change', (event) => {
        // Get the first file from the selected files
        const file = event.target.files[0];

        // Check if a file was actually selected
        if (file) {
            // Create a new FileReader to read the file content
            const reader = new FileReader();

            // When the file is loaded, set the image source
            reader.onload = function (e) {
                profile.src = e.target.result;
            };

            // Read the file as a data URL (Base64 string)
            reader.readAsDataURL(file);
        }
    });



    // Form submission handling
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Handle form submission here
            console.log('Settings saved');
        });
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.nav-item.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            // Handle logout
            if (confirm('Are you sure you want to log out?')) {
                // Redirect to login page or handle logout
                console.log('User logged out');
            }
        });
    }


    // Toggle Dashboard sidebar 
    const showDashboardSidebar = document.querySelector('.show-dashboard-sidebar')
    const dashboardSidebar = document.getElementById('dashboard-sidebar')

    handlePreviewToggle(showDashboardSidebar, dashboardSidebar);
});