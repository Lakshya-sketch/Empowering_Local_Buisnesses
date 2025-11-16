// auth-check.js - Common authentication checker for all pages
const API_URL = 'http://localhost:5500/api';

document.addEventListener("DOMContentLoaded", () => {
    checkAuthStatus();
});

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    // Find nav elements
    const desktopNav = document.querySelector('.nav-links');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!desktopNav) return;

    if (isLoggedIn === 'true' && currentUser) {
        // User is logged in - replace Login/Register with Profile
        updateNavForLoggedInUser(desktopNav, mobileNav, currentUser);
    } else {
        // User is not logged in - show Login/Register
        updateNavForLoggedOutUser(desktopNav, mobileNav);
    }
}

function updateNavForLoggedInUser(desktopNav, mobileNav, username) {
    // Determine correct path based on current page location
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes('/pages/');
    const profilePath = isInPagesFolder ? 'profile.html' : 'pages/profile.html';
    const adminPath = isInPagesFolder ? 'admin.html' : 'pages/admin.html';
    
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'admin';
    
    // Update desktop navigation
    const desktopLoginLink = desktopNav.querySelector('a[href*="Login.html"]');
    const desktopRegisterLink = desktopNav.querySelector('a[href*="Signup.html"]');
    
    if (desktopLoginLink) {
        const li = desktopLoginLink.parentElement;
        if (isAdmin) {
            li.innerHTML = `<a href="${adminPath}">Admin</a>`;
        } else {
            li.innerHTML = `<a href="${profilePath}">Profile (${username})</a>`;
        }
    }
    
    if (desktopRegisterLink) {
        const li = desktopRegisterLink.parentElement;
        li.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;
    }

    // Update mobile navigation
    if (mobileNav) {
        const mobileLoginLink = mobileNav.querySelector('a[href*="Login.html"]');
        const mobileRegisterLink = mobileNav.querySelector('a[href*="Signup.html"]');
        
        if (mobileLoginLink) {
            if (isAdmin) {
                mobileLoginLink.textContent = 'Admin';
                mobileLoginLink.href = adminPath;
            } else {
                mobileLoginLink.textContent = `Profile (${username})`;
                mobileLoginLink.href = profilePath;
            }
        }
        
        if (mobileRegisterLink) {
            mobileRegisterLink.textContent = 'Logout';
            mobileRegisterLink.href = '#';
            mobileRegisterLink.id = 'logoutBtnMobile';
        }
    }

    // Add logout functionality
    setupLogoutHandlers();
}

function updateNavForLoggedOutUser(desktopNav, mobileNav) {
    // Desktop nav should already have Login/Register - no changes needed
    // This function exists for clarity and future enhancements
}

function setupLogoutHandlers() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
    
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('currentUserFullName');
        localStorage.removeItem('rememberMe');
        
        // Determine correct redirect path
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        const homePath = isInPagesFolder ? '../index.html' : 'index.html';
        
        // Redirect to home page
        window.location.href = homePath;
    }
}
