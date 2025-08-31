
document.addEventListener('DOMContentLoaded', () => {

    // --- DUMMY USER SEEDER ---
    // This function adds test users to localStorage if they don't already exist.
    function seedDummyUsers() {
        if (!localStorage.getItem('users')) {
            const dummyUsers = [
                { username: 'testuser@user', password: 'password123' },
                { username: 'admin@test', password: 'admin@test' }
            ];
            localStorage.setItem('users', JSON.stringify(dummyUsers));
            console.log('Dummy users have been seeded for testing.');
        }
    }

    // Run the seeder function on page load to ensure data is available.
    seedDummyUsers();


    // --- LOGIN FORM HANDLING ---
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Make sure the login form actually exists on the page.
    if (loginForm) {
        // Add a listener for the 'submit' event.
        loginForm.addEventListener('submit', (event) => {
            
            // CRITICAL STEP: Prevent the form from submitting and reloading the page.
            // This is the most important fix.
            event.preventDefault();

            // Get the values entered by the user.
            const username = event.target.username.value;
            const password = event.target.password.value;

            // Clear any previous error messages for a clean UI.
            loginError.textContent = '';

            // Retrieve the stored users from localStorage.
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if there is a user that matches the entered credentials.
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // --- LOGIN SUCCESS ---
                // 1. Set the session flag in localStorage.
                localStorage.setItem('isLoggedIn', 'true');
                
                // 2. Redirect to the homepage. This will now execute without interruption.
                window.location.href = 'home_page.html';

            } else {
                // --- LOGIN FAILURE ---
                // Display an error message if no match was found.
                loginError.textContent = 'Invalid username or password. Please try again.';
            }
        });
    }
});
