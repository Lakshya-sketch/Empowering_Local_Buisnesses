const API_URL = 'http://localhost:5500/api';

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

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('show-menu');
        });
    });

    // Signup form
    const signupForm = document.getElementById('signupForm');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const signupError = document.getElementById('signupError');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        usernameError.classList.add('hidden');
        passwordError.classList.add('hidden');
        signupError.classList.add('hidden');

        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const termsChecked = document.getElementById('terms').checked;

        // Frontend validation
        let hasError = false;

        if (username.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters';
            usernameError.classList.remove('hidden');
            hasError = true;
        }

        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordError.classList.remove('hidden');
            hasError = true;
        }

        if (password !== confirmPassword) {
            passwordError.textContent = 'Passwords do not match';
            passwordError.classList.remove('hidden');
            hasError = true;
        }

        if (!termsChecked) {
            signupError.textContent = 'You must agree to the terms and conditions';
            signupError.classList.remove('hidden');
            hasError = true;
        }

        if (hasError) return;

        // Send to MySQL backend
        const userData = {
            full_name: fullName,
            username: username,
            email: email,
            phone: '', // Add phone field if you have it
            password: password
        };

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                signupError.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                signupError.style.borderColor = '#28a745';
                signupError.style.color = '#28a745';
                signupError.textContent = 'Account created successfully! Redirecting to login...';
                signupError.classList.remove('hidden');

                setTimeout(() => {
                    window.location.href = 'Login.html';
                }, 2000);
            } else {
                // Handle specific errors
                if (data.message.includes('username')) {
                    usernameError.textContent = data.message;
                    usernameError.classList.remove('hidden');
                } else if (data.message.includes('email')) {
                    signupError.textContent = 'Email already registered';
                    signupError.classList.remove('hidden');
                } else {
                    signupError.textContent = data.message || 'Registration failed';
                    signupError.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            signupError.textContent = 'Registration failed. Please check your connection.';
            signupError.classList.remove('hidden');
        }
    });
});
