const API_URL = 'http://localhost:5500/api';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

async function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName')?.value || document.querySelector('input[name="fullName"]')?.value;
    const username = document.getElementById('username')?.value || document.querySelector('input[name="username"]')?.value;
    const email = document.getElementById('email')?.value || document.querySelector('input[name="email"]')?.value;
    const phone = document.getElementById('phone')?.value || document.querySelector('input[name="phone"]')?.value;
    const password = document.getElementById('password')?.value || document.querySelector('input[name="password"]')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value || document.querySelector('input[name="confirmPassword"]')?.value;
    const termsAccepted = document.getElementById('terms')?.checked || document.querySelector('input[name="terms"]')?.checked;

    // Clear previous errors
    clearErrors();

    // Validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
        showError('All fields are required');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }

    if (!termsAccepted) {
        showError('Please accept the Terms & Conditions');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Show loading
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating Account...';
    submitButton.disabled = true;

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: fullName,
                username: username,
                email: email,
                phone: phone || null,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        // Store user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', data.user.username);
        localStorage.setItem('currentUserEmail', data.user.email);
        localStorage.setItem('currentUserFullName', data.user.full_name);
        localStorage.setItem('currentUserPhone', data.user.phone || '');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'user');

        // Show success message
        showSuccess('Account created successfully! Redirecting...');

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        showError(error.message || 'Failed to create account. Please try again.');
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #dc3545;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin: 15px 0;
        text-align: center;
        font-size: 14px;
        animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;

    // Insert before submit button
    const form = document.getElementById('signupForm');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(errorDiv, submitButton);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    // Remove existing messages
    clearErrors();

    // Create success element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background-color: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin: 15px 0;
        text-align: center;
        font-size: 14px;
        animation: slideDown 0.3s ease;
    `;
    successDiv.textContent = message;

    // Insert before submit button
    const form = document.getElementById('signupForm');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(successDiv, submitButton);
}

function clearErrors() {
    const errors = document.querySelectorAll('.error-message, .success-message');
    errors.forEach(error => error.remove());
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
