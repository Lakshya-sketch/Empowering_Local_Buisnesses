document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('show-menu');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('show-menu');
        });
    });

    // Check if already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // User is already logged in, redirect to home
        window.location.href = '../index.html';
        return;
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if any users exist
        if (users.length === 0) {
            errorMsg.textContent = 'No users found. Please sign up first.';
            errorMsg.classList.remove('hidden');
            
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 5000);
            return;
        }

        // Find user with matching credentials
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Successful login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            localStorage.setItem('currentUserEmail', user.email);
            localStorage.setItem('currentUserFullName', user.fullName);

            // If remember me is checked, set a flag
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            console.log('User logged in:', username);
            
            // Show success message briefly
            errorMsg.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
            errorMsg.style.borderColor = '#28a745';
            errorMsg.style.color = '#28a745';
            errorMsg.textContent = 'Login successful! Redirecting...';
            errorMsg.classList.remove('hidden');

            // Redirect to homepage after brief delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            // Show error
            errorMsg.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
            errorMsg.style.borderColor = '#dc3545';
            errorMsg.style.color = '#dc3545';
            errorMsg.textContent = 'Invalid username or password';
            errorMsg.classList.remove('hidden');

            // Hide error after 5 seconds
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 5000);
        }
    });
});
