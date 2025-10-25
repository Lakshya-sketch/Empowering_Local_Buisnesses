document.addEventListener("DOMContentLoaded", () => {
    // Get service type from URL parameter
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service") || "plumber";
    
    // Update page title based on service
    const titleElement = document.getElementById("serviceTitle");
    titleElement.textContent = `Book a ${capitalize(service)} Service`;

    // ========== AUTO-FILL USER DATA FROM PROFILE ==========
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUserFullName = localStorage.getItem('currentUserFullName');
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    console.log('Auth Check:', { isLoggedIn, currentUserFullName, currentUserEmail });

    if (isLoggedIn === 'true') {
        // Pre-fill name and email from profile
        if (currentUserFullName) {
            const nameField = document.getElementById("name");
            nameField.value = currentUserFullName;
            nameField.readOnly = true;
            nameField.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            nameField.style.cursor = 'not-allowed';
        }
        if (currentUserEmail) {
            const emailField = document.getElementById("email");
            emailField.value = currentUserEmail;
            emailField.readOnly = true;
            emailField.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            emailField.style.cursor = 'not-allowed';
        }
    } else {
        // If not logged in, redirect to login
        alert("Please login to book a service");
        window.location.href = 'Login.html';
        return;
    }
    // ========== END AUTO-FILL ==========

    // Set minimum date to today
    const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('show-menu');
        });
    }

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('show-menu');
        });
    });

    // Form submission handler
    document.getElementById("bookingForm").addEventListener("submit", (event) => {
        event.preventDefault();

        // Get form values
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const workDescription = document.getElementById("workDescription").value.trim();

        // Validation
        if (!name || !phone || !address || !date || !time || !workDescription) {
            alert("Please fill all required fields!");
            return;
        }

        // Phone number validation (10 digits)
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone)) {
            alert("Please enter a valid 10-digit phone number!");
            return;
        }

        // Create booking object
        const bookingData = {
            name,
            phone,
            email,
            address,
            date,
            time,
            serviceType: service,
            workDescription,
            bookingId: generateBookingId(),
            timestamp: new Date().toISOString(),
            username: localStorage.getItem('currentUser')
        };

        // Get existing bookings from localStorage
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        
        // Add new booking
        bookings.push(bookingData);
        
        // Save to localStorage
        localStorage.setItem("bookings", JSON.stringify(bookings));
        localStorage.setItem("latestBooking", JSON.stringify(bookingData));

        // Show confirmation message
        const confirmation = document.getElementById("confirmationMsg");
        confirmation.innerHTML = `
            <strong>Booking Confirmed!</strong><br>
            Booking ID: ${bookingData.bookingId}<br>
            Your ${capitalize(service)} service is scheduled for ${formatDate(date)} at ${formatTime(time)}.
        `;
        confirmation.classList.remove("hidden");

        // Reset only the editable fields
        document.getElementById("phone").value = '';
        document.getElementById("address").value = '';
        document.getElementById("date").value = '';
        document.getElementById("time").value = '';
        document.getElementById("workDescription").value = '';

        // Scroll to confirmation message
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide confirmation after 10 seconds
        setTimeout(() => {
            confirmation.classList.add("hidden");
        }, 10000);
    });

    // Helper function to capitalize first letter
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Generate unique booking ID
    function generateBookingId() {
        const prefix = "LBC";
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }

    // Format time for display
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
});
