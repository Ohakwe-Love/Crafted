// FAQ Accordion Functionality
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const icon = item.querySelector('.faq-icon');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    otherIcon.textContent = '+';
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                icon.textContent = '+';
            } else {
                item.classList.add('active');
                icon.textContent = '−';
            }
        });
    });

    // Category link interactions
    const links = document.querySelectorAll('.category-link');


    // Function to handle smooth scrolling on link click
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            // console.log(targetSection);
            

            links.forEach(link => link.classList.remove('active'))

            link.classList.add('active');

            
            if (targetSection) {
                console.log(targetSection.offsetTop);
                if (window.innerWidth >= 992) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    hideAllPreview();
                    modalOverlay.classList.remove("active")
                } else {
                    window.scrollTo({
                        top: targetSection.offsetTop - 50,
                        behavior: 'smooth'
                    });
                    hideAllPreview();
                    modalOverlay.classList.remove("active")
                }
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.faq-search-input');
    const searchBtn = document.querySelector('.faq-search-btn');

    searchBtn.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
        }
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// side bar function
const openSidebarMenu = document.querySelector('.open-sidebar-menu');
const faqSidebar = document.getElementById('faq-sidebar');
// const sidebarOverlay = document.getElementById('modalOverlay');
const closeSidebarBtn = document.getElementById('closeFaqSideBar');

function openSidebar() {
    faqSidebar.classList.add('preview');
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        modalOverlay.style.pointerEvents = 'auto';
    }
}

function closeSidebar() {
    faqSidebar.classList.remove('preview');
    if (modalOverlay) {
        modalOverlay.classList.remove("active")
        modalOverlay.style.pointerEvents = 'none';
    }
}

if (openSidebarMenu && faqSidebar) {
    openSidebarMenu.addEventListener('click', openSidebar);

    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeSidebar);
        modalOverlay.classList.remove('active');
    }
}