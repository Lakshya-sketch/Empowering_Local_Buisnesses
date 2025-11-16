import React, { useState } from 'react';
import '../css/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Save login info to localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', formData.username);
    localStorage.setItem('memberSince', new Date().toISOString());

    console.log('Login data:', formData);
    setError('');
    
    // Redirect to home
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-option">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <div className="signup-link">
          <p>Don't have an account? <a href="/register">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
