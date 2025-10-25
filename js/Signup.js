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

    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const signupError = document.getElementById('signupError');

    signupForm.addEventListener('submit', (e) => {
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

        // Validation
        let hasError = false;

        // Username validation
        if (username.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters';
            usernameError.classList.remove('hidden');
            hasError = true;
        }

        // Password validation
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

        // Get existing users from localStorage (initialize if doesn't exist)
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username already exists
        const userExists = users.some(u => u.username === username);

        if (userExists) {
            usernameError.textContent = 'Username already taken';
            usernameError.classList.remove('hidden');
            return;
        }

        // Check if email already exists
        const emailExists = users.some(u => u.email === email);

        if (emailExists) {
            signupError.textContent = 'Email already registered';
            signupError.classList.remove('hidden');
            return;
        }

        // Create new user object
        const newUser = {
            fullName,
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        // Add new user to array
        users.push(newUser);

        // Save updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Log for debugging
        console.log('New user registered:', { username, email });
        console.log('Total users:', users.length);

        // Show success message
        signupError.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
        signupError.style.borderColor = '#28a745';
        signupError.style.color = '#28a745';
        signupError.textContent = 'Account created successfully! Redirecting to login...';
        signupError.classList.remove('hidden');

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 2000);
    });
});
