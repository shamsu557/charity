document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.carousel-item');
    const heroSection = document.querySelector('.hero-section');
    const captions = document.createElement('div');
    captions.classList.add('carousel-caption');
    heroSection.appendChild(captions);

    let index = 0;

    const updateCaption = () => {
        const currentItem = items[index];
        const imageUrl = currentItem.getAttribute('data-image'); // Fetch image URL
        
        // Update hero section background
        heroSection.style.backgroundImage = `url(${imageUrl})`;

        // Update captions directly below the image
        captions.innerHTML = `
            <h2>${currentItem.getAttribute('data-message')}</h2>
            <p>${currentItem.getAttribute('data-subtext')}</p>
        `;

        index = (index + 1) % items.length;
    };

    updateCaption();
    setInterval(() => {
        updateCaption();
    }, 8000); // Match animation duration
});

document.addEventListener('DOMContentLoaded', () => {
    const toggler = document.getElementById("navbar-toggler");
    const cancel = document.getElementById("navbar-cancel");
    const navbarNav = document.getElementById("navbarNav");
    const navLinks = document.querySelectorAll(".nav-link");
    const dropdownToggle = document.getElementById("aboutDropdown");
    const dropdownMenu = dropdownToggle ? dropdownToggle.nextElementSibling : null; // Ensure dropdown exists

    // Navbar toggler and cancel button functionality
    toggler.addEventListener("click", function () {
        toggler.style.display = "none"; // Hide toggler
        cancel.style.display = "block"; // Show cancel button
        navbarNav.classList.add("show"); // Open the navbar
    });

    cancel.addEventListener("click", function () {
        toggler.style.display = "block"; // Show toggler
        cancel.style.display = "none"; // Hide cancel button
        navbarNav.classList.remove("show"); // Collapse the navbar
    });

    // Close navbar when a nav-link is clicked (on mobile)
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            toggler.style.display = "block"; // Show toggler
            cancel.style.display = "none"; // Hide cancel button
            navbarNav.classList.remove("show"); // Collapse the navbar
        });
    });

    // Dropdown functionality for large screens (hover)
    if (dropdownToggle) {
        dropdownToggle.addEventListener("mouseenter", function () {
            const allItems = dropdownMenu.querySelectorAll(".dropdown-item");
            allItems.forEach(dropdownItem => {
                dropdownItem.style.display = "block"; // Show dropdown items on hover
            });
        });

        // Hide dropdown items when clicked on a dropdown item
        document.querySelectorAll(".dropdown-item").forEach(item => {
            item.addEventListener("click", function () {
                const allItems = dropdownMenu.querySelectorAll(".dropdown-item");
                allItems.forEach(dropdownItem => {
                    dropdownItem.style.display = "none"; // Hide dropdown items when clicked
                });
            });
        });
    }
});


// Back to top button functionality
window.onscroll = function () {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
        } else {
            document.getElementById("myBtn").style.display = "none";
        }
    }

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }