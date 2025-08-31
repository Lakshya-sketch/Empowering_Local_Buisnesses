document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageElement = document.getElementById('message');

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from submitting right away

        // Get user input
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // --- Form Validation ---

        // 1. Check if any fields are empty
        if (!fullName || !email || !password || !confirmPassword) {
            showMessage('All fields are required.', 'error');
            return; // Stop execution
        }

        // 2. Validate email format (simple check)
        if (!email.includes('@') || !email.includes('.')) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // 3. Check password length
        if (password.length < 8) {
            showMessage('Password must be at least 8 characters long.', 'error');
            return;
        }

        // 4. Check if passwords match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match. Please try again.', 'error');
            return;
        }

        // --- If all validation passes ---
        showMessage('Account created successfully! Redirecting to login...', 'success');

        // Simulate saving the new user and then redirecting to the login page
        // In a real app, you would send this data to your server.
        setTimeout(() => {
            window.location.href = 'login.html'; // Redirect to the login page
        }, 2000); // Wait 2 seconds
    });

    // Helper function to display messages to the user
    function showMessage(message, type) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`; // e.g., 'message error'
    }
});
