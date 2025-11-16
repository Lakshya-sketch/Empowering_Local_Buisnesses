import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Shared.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setUserName(localStorage.getItem('currentUser') || 'User');
    }

    // Listen for storage changes
    window.addEventListener('storage', () => {
      const updated = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(updated);
    });
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUserFullName');
    setIsLoggedIn(false);
    setMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>LocalBizConnect</Link>
        </div>
        <nav className="nav-links" style={{ display: 'flex', listStyle: 'none', gap: '30px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: '500', transition: 'color 0.3s' }}>Home</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#fff', fontWeight: '500', transition: 'color 0.3s' }}>About</Link>
          <Link to="/services?service=plumber" style={{ textDecoration: 'none', color: '#fff', fontWeight: '500', transition: 'color 0.3s' }}>Services</Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" style={{ textDecoration: 'none', color: '#fff', fontWeight: '500', transition: 'color 0.3s' }}>{userName}</Link>
              <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ textDecoration: 'none', color: '#fff', fontWeight: '500', cursor: 'pointer', transition: 'color 0.3s' }}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#fff', fontWeight: '500', transition: 'color 0.3s' }}>Login</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#fff', fontWeight: '500', transition: 'color 0.3s' }}>Register</Link>
            </>
          )}
        </nav>
        <div className={`hamburger-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" style={{ position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', background: '#000814', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px', gap: '25px', zIndex: 99 }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '500' }}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '500' }}>About</Link>
          <Link to="/services?service=plumber" onClick={() => setMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '500' }}>Services</Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '500' }}>{userName}</Link>
              <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '500', cursor: 'pointer' }}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '500' }}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '500' }}>Register</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
