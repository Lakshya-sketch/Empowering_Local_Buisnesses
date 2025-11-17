import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (login/logout events)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom login event
    window.addEventListener('login', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleStorageChange);
    };
  }, [location]); // Re-check on route change

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('Auth check - Token:', !!token, 'User:', userData); // Debug log
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User logged in:', parsedUser); // Debug log
      } catch (e) {
        console.error('Error parsing user data:', e);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      setMenuOpen(false);
      
      // Dispatch storage event
      window.dispatchEvent(new Event('storage'));
      
      navigate('/');
      
      // Force reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          LocalBizConnect
        </Link>

        <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? 'active' : ''}></span>
          <span className={menuOpen ? 'active' : ''}></span>
          <span className={menuOpen ? 'active' : ''}></span>
        </div>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link" onClick={closeMenu}>
              About
            </Link>
          </li>
          
          {isLoggedIn ? (
            <>
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link" onClick={closeMenu}>
                  Profile
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/order" className="navbar-link" onClick={closeMenu}>
                  My Orders
                </Link>
              </li>
              {user?.role === 'admin' && (
                <li className="navbar-item">
                  <Link to="/admin" className="navbar-link navbar-link-admin" onClick={closeMenu}>
                    Admin
                  </Link>
                </li>
              )}
              <li className="navbar-item navbar-user-info">
                <span className="user-welcome">Hi, {user?.name || 'User'}!</span>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-btn navbar-btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-btn" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-btn navbar-btn-signup" onClick={closeMenu}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
