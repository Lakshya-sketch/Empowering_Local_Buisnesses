document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        window.location.href = 'Login.html';
        return;
    }

    // Load user data
    loadUserProfile();
    loadUserBookings();

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

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserEmail');
            localStorage.removeItem('currentUserFullName');
            localStorage.removeItem('rememberMe');
            window.location.href = '../index.html';
        }
    });
});

function loadUserProfile() {
    const currentUser = localStorage.getItem('currentUser');
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const currentUserFullName = localStorage.getItem('currentUserFullName');

    document.getElementById('displayUsername').textContent = currentUser || 'N/A';
    document.getElementById('displayEmail').textContent = currentUserEmail || 'N/A';
    document.getElementById('displayName').textContent = currentUserFullName || 'N/A';

    // Get user registration date
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === currentUser);
    
    if (user && user.createdAt) {
        const createdDate = new Date(user.createdAt);
        document.getElementById('displayMemberSince').textContent = createdDate.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function loadUserBookings() {
    const currentUser = localStorage.getItem('currentUser');
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsList = document.getElementById('bookingsList');

    // Filter bookings for current user only
    const userBookings = bookings.filter(b => b.username === currentUser);

    if (userBookings.length === 0) {
        bookingsList.innerHTML = '<p style="text-align: center; color: #ccc;">No bookings yet.</p>';
        return;
    }

    bookingsList.innerHTML = '';

    userBookings.reverse().forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        bookingItem.innerHTML = `
            <h3>${capitalize(booking.serviceType)} Service</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Date & Time:</strong> ${formatDate(booking.date)} at ${formatTime(booking.time)}</p>
            <p><strong>Address:</strong> ${booking.address}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Work Description:</strong> ${booking.workDescription || booking.description || 'N/A'}</p>
        `;
        bookingsList.appendChild(bookingItem);
    });
}

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
