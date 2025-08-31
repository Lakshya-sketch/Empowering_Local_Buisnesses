document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    
    // Function to show an error message and style the input
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.classList.remove('valid');
        input.classList.add('invalid');
    }

    // Function to show a success state (valid input)
    function showSuccess(input, errorElement) {
        errorElement.textContent = ''; // Clear the error message
        input.classList.remove('invalid');
        input.classList.add('valid');
    }

    // --- Inline Username Validation ---
    usernameInput.addEventListener('input', () => {
        const username = usernameInput.value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.username === username);

        if (username.length < 4) {
            showError(usernameInput, usernameError, 'Username must be at least 4 characters long.');
        } else if (userExists) {
            showError(usernameInput, usernameError, 'Username is already taken.');
        } else {
            showSuccess(usernameInput, usernameError);
        }
    });

    // --- Inline Password Validation ---
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;

        if (password.length < 8) {
            showError(passwordInput, passwordError, 'Password must be at least 8 characters long.');
        } else {
            showSuccess(passwordInput, passwordError);
        }
    });

    // --- Form Submission Logic ---
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Re-check all validations on submit to be safe
            const isUsernameValid = !usernameError.textContent && usernameInput.value.length > 0;
            const isPasswordValid = !passwordError.textContent && passwordInput.value.length > 0;

            if (isUsernameValid && isPasswordValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                users.push({ username: usernameInput.value, password: passwordInput.value });
                localStorage.setItem('users', JSON.stringify(users));
                
                alert('Signup successful! Please log in.');
                window.location.href = 'Login.html';
            } else {
                // If the user tries to submit with invalid fields, ensure errors are shown
                if (usernameInput.value.length === 0) showError(usernameInput, usernameError, 'Username is required.');
                if (passwordInput.value.length === 0) showError(passwordInput, passwordError, 'Password is required.');
                
                alert('Please fix the errors before submitting.');
            }
        });
    }
});
