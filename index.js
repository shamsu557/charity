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

// Navbar toggler and cancel button functionality
const toggler = document.getElementById("navbar-toggler");
const cancel = document.getElementById("navbar-cancel");
const navbarNav = document.getElementById("navbarNav");
const navLinks = document.querySelectorAll(".nav-link"); // Select all navbar links

toggler.addEventListener("click", function () {
    toggler.style.display = "none"; 
    cancel.style.display = "block"; 
});

cancel.addEventListener("click", function () {
    toggler.style.display = "block"; 
    cancel.style.display = "none"; 
    navbarNav.classList.remove("show"); // Collapse the navbar
});

// Close the navbar when a nav-link is clicked (on mobile)
navLinks.forEach(link => {
    link.addEventListener("click", function () {
        toggler.style.display = "block"; // Show toggler
        cancel.style.display = "none"; // Hide cancel button
        navbarNav.classList.remove("show"); // Collapse the navbar
    });
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