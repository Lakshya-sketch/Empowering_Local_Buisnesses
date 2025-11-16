const API_URL = 'http://localhost:5500/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username')?.value || 
                     document.getElementById('email')?.value;
    const password = document.getElementById('password').value;
    
    // Remove any previous error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    try {
        // Check if admin credentials
        if (username === 'admin@admin' && password === 'admin') {
            await loginAsAdmin(username, password);
        } else {
            await loginAsUser(username, password);
        }
    } catch (error) {
        showError(error.message || 'Login failed. Please try again.');
    }
}

async function loginAsAdmin(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/admin-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store admin credentials
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('adminName', 'Admin');
            localStorage.setItem('currentUser', username);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to admin panel
            window.location.href = './admin.html';
        } else {
            throw new Error(data.message || 'Admin login failed');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        throw new Error('Admin login failed. Please check your credentials.');
    }
}

async function loginAsUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store user credentials
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', data.user.username || username);
            localStorage.setItem('currentUserEmail', data.user.email);
            localStorage.setItem('currentUserFullName', data.user.full_name || data.user.username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'user');
            
            // Redirect to home page
            window.location.href = '../index.html';
        } else {
            throw new Error(data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error('User login error:', error);
        throw new Error('Login failed. Please check your credentials.');
    }
}

function showError(message) {
    const form = document.getElementById('loginForm');
    
    // Remove existing error
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #ff4444;
        color: white;
        padding: 12px;
        border-radius: 8px;
        margin: 15px 0;
        text-align: center;
        font-size: 14px;
    `;
    errorDiv.textContent = message;
    
    // Insert before submit button
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(errorDiv, submitButton);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
