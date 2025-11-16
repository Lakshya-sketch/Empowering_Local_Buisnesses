const API_URL = 'http://localhost:5000/api';

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const providerId = params.get("provider");
    const service = params.get("service") || "plumber";
    
    // Update page title
    const titleElement = document.getElementById("serviceTitle");
    titleElement.textContent = `Book a ${capitalize(service)} Service`;

    // Check authentication
    const token = localStorage.getItem('authToken');
    const currentUserFullName = localStorage.getItem('currentUserFullName');
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    if (!token) {
        alert("Please login to book a service");
        window.location.href = 'Login.html';
        return;
    }

    // Load provider details if ID is provided
    if (providerId) {
        loadProviderDetails(providerId);
    }

    // Auto-fill user data
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

    // Set minimum date to today
    const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('show-menu');
        });
    }

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('show-menu');
        });
    });

    // Form submission
    document.getElementById("bookingForm").addEventListener("submit", handleBookingSubmit);
});

// Load provider details from MySQL
async function loadProviderDetails(providerId) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/providers/${providerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load provider details');
        }

        const provider = await response.json();
        
        // Display provider info if you have elements for it
        if (document.getElementById('providerName')) {
            document.getElementById('providerName').textContent = provider.name;
        }
        if (document.getElementById('providerRate')) {
            document.getElementById('providerRate').textContent = `₹${provider.hourly_rate}/hr`;
        }
    } catch (error) {
        console.error('Error loading provider:', error);
    }
}

// Handle booking submission
async function handleBookingSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(window.location.search);
    const providerId = params.get("provider");
    const service = params.get("service") || "plumber";

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

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 10-digit phone number!");
        return;
    }

    // Create booking data
    const bookingData = {
        provider_id: parseInt(providerId) || null,
        scheduled_date: date,
        scheduled_time: time,
        work_description: workDescription,
        total_amount: 0 // Will be calculated by backend or you can add an amount field
    };

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            // Show confirmation
            const confirmation = document.getElementById("confirmationMsg");
            confirmation.innerHTML = `
                <strong>Booking Confirmed!</strong><br>
                Booking ID: ${result.booking_id}<br>
                Your ${capitalize(service)} service is scheduled for ${formatDate(date)} at ${formatTime(time)}.
            `;
            confirmation.classList.remove("hidden");

            // Reset form fields
            document.getElementById("phone").value = '';
            document.getElementById("address").value = '';
            document.getElementById("date").value = '';
            document.getElementById("time").value = '';
            document.getElementById("workDescription").value = '';

            // Scroll to confirmation
            confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Hide after 10 seconds
            setTimeout(() => {
                confirmation.classList.add("hidden");
            }, 10000);
        } else {
            alert(`❌ Error: ${result.message || 'Booking failed'}`);
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Failed to create booking. Please try again.');
    }
}

// Helper functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}
