document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.classList.remove('valid');
        input.classList.add('invalid');
    }

    function showSuccess(input, errorElement) {
        errorElement.textContent = '';
        input.classList.remove('invalid');
        input.classList.add('valid');
    }

    // Username inline validation
    function validateUsername() {
        const username = usernameInput.value.trim();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.username === username);

        if (username.length < 4) {
            showError(usernameInput, usernameError, 'Username must be at least 4 characters long.');
        } else if (userExists) {
            showError(usernameInput, usernameError, 'Username is already taken.');
        } else {
            showSuccess(usernameInput, usernameError);
        }
    }

    // Password inline validation
    function validatePassword() {
        const password = passwordInput.value;

        if (password.length < 8) {
            showError(passwordInput, passwordError, 'Password must be at least 8 characters long.');
        } else {
            showSuccess(passwordInput, passwordError);
        }
    }

    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // RE-RUN all validations on submit to be sure
            validateUsername();
            validatePassword();

            const isUsernameValid = !usernameError.textContent && usernameInput.value.length > 0;
            const isPasswordValid = !passwordError.textContent && passwordInput.value.length > 0;

            if (isUsernameValid && isPasswordValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                users.push({ username: usernameInput.value.trim(), password: passwordInput.value });
                localStorage.setItem('users', JSON.stringify(users));

                alert('Signup successful! Please log in.');
                window.location.href = 'Login.html';
            } else {
                if (usernameInput.value.length === 0) showError(usernameInput, usernameError, 'Username is required.');
                if (passwordInput.value.length === 0) showError(passwordInput, passwordError, 'Password is required.');
                alert('Please fix the errors before submitting.');
            }
        });
    }
});
