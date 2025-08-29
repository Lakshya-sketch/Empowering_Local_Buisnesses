document.addEventListener('DOMContentLoaded', () => {
    // --- Sample User Credentials Dictionary ---
    // In a real application, this data would come from a secure backend server.
    const userCredentials = {
        "user@example.com": "password123",
        "admin@example.com": "adminpass",
        "test@example.com": "test"
    };

    // Get references to the form and other elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageElement = document.getElementById('message');

    // Add a 'submit' event listener to the form
    loginForm.addEventListener('submit', (event) => {
        // Prevent the form from submitting the traditional way
        event.preventDefault();

        // Get the values entered by the user
        const email = emailInput.value;
        const password = passwordInput.value;

        // --- Validation Logic ---
        if (userCredentials.hasOwnProperty(email)) {
            if (userCredentials[email] === password) {
                // SUCCESS: Credentials are correct
                messageElement.textContent = 'Login successful! Redirecting...';
                messageElement.className = 'message success';

                // --- REDIRECTION LOGIC ADDED ---
                // Wait 1.5 seconds to allow the user to see the success message,
                // then redirect them to the services.html page.
                setTimeout(() => {
                    window.location.href = 'services.html';
                }, 1500); // 1500 milliseconds = 1.5 seconds

            } else {
                // ERROR: Email is correct, but password is wrong
                messageElement.textContent = 'Incorrect password. Please try again.';
                messageElement.className = 'message error';
            }
        } else {
            // ERROR: Email does not exist
            messageElement.textContent = 'User not found. Please check the email address.';
            messageElement.className = 'message error';
        }
    });
});
