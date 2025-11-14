document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active'); // Toggles a class 'active' on the nav
            menuToggle.classList.toggle('active'); // Toggles a class 'active' on the toggle button itself (for animation)
            // Optional: Toggle body scroll lock for mobile
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when a nav link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // 2. Smooth Scrolling for Anchor Links
    // This makes clicking on internal links (e.g., #consulting) scroll smoothly
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for fixed header if you have one
                const headerOffset = document.querySelector('.main-header') ? document.querySelector('.main-header').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Optional: Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // 3. Simple Client-Side Form Validation for Contact Form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const message = contactForm.querySelector('#message');

            // Basic validation checks
            if (name.value.trim() === '') {
                alert('Venligst indtast dit navn.');
                name.focus();
                isValid = false;
            } else if (email.value.trim() === '' || !email.value.includes('@')) {
                alert('Venligst indtast en gyldig emailadresse.');
                email.focus();
                isValid = false;
            } else if (message.value.trim() === '') {
                alert('Venligst indtast din besked.');
                message.focus();
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault(); // Prevent form submission if validation fails
            } else {
                // If using AJAX for submission, you'd prevent default and handle it here
                // For now, it will submit normally if valid
                console.log('Formular valideret, sender...');
            }
        });
    }

    // 4. Newsletter Signup Form (Basic client-side validation)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput.value.trim() === '' || !emailInput.value.includes('@')) {
                alert('Venligst indtast en gyldig emailadresse for at tilmelde dig nyhedsbrevet.');
                e.preventDefault(); // Prevent form submission
                emailInput.focus();
            } else {
                console.log('Nyhedsbrev tilmelding valideret, sender...');
                // In a real scenario, you'd likely use AJAX to send this to your email marketing service
                // and give user feedback (e.g., "Tak for din tilmelding!").
                // For now, it will submit normally.
            }
        });
    }

    // 5. Booking System Placeholder Function
    // In a real application, this would either link directly to a third-party booking page
    // or embed a script provided by your booking service (e.g., Calendly widget).
    // This is just a conceptual placeholder.
    function initializeBookingSystem() {
        const bookingButton = document.querySelector('a[href*="[LINK_TIL_DIT_BOOKING_SYSTEM]"]');
        if (bookingButton) {
            bookingButton.addEventListener('click', function(e) {
                // If it's a simple link, just let it navigate
                // If it should open a modal or widget, you'd add that logic here.
                console.log('Booking system link clicked.');
            });
        }
        // Example for embedding a Calendly widget (uncomment and replace URL)
        /*
        if (document.getElementById('calendly-embed-area')) { // Assume an element with this ID exists on your contact page
            Calendly.initInlineWidget({
                url: 'https://calendly.com/YOUR_CALENDLY_USERNAME/YOUR_EVENT_TYPE',
                parentElement: document.getElementById('calendly-embed-area'),
                prefill: {},
                utm: {}
            });
        }
        */
    }
    // Call the booking system initializer if needed (depends on how you integrate)
    // initializeBookingSystem();


    // Initial setup if page loads with a hash (e.g., services.html#managed)
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            // Give it a slight delay to ensure all content is rendered and header height is correct
            setTimeout(() => {
                const headerOffset = document.querySelector('.main-header') ? document.querySelector('.main-header').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }, 100);
        }
    }
});
