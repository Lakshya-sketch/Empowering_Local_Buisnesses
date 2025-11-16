import React, { useState, useEffect } from 'react';
import '../css/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      const userName = localStorage.getItem('currentUser');
      const userEmail = localStorage.getItem('currentUserEmail');
      const userFullName = localStorage.getItem('currentUserFullName');
      
      setUser({
        fullName: userFullName || 'User',
        username: userName || 'username',
        email: userEmail || 'user@example.com',
        memberSince: new Date(localStorage.getItem('memberSince') || Date.now()).toLocaleDateString()
      });

      // Load bookings from localStorage or use sample data
      const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      setBookings(savedBookings);
    } else {
      window.location.href = '/login';
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUserFullName');
    localStorage.removeItem('memberSince');
    alert('You have been logged out successfully!');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  if (!user) {
    return <div className="profile-container"><p>Not logged in</p></div>;
  }

  return (
    <div className="profile-container">
      <section className="profile-hero">
        <h1>My Profile</h1>
        <p>Manage your account and bookings</p>
      </section>

      <section className="profile-content">
        {/* Account Info Card */}
        <div className="profile-card account-info">
          <h2>Account Information</h2>
          <div className="profile-avatar">
            <img src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png" alt="Profile Icon" />
            <span className="online-dot"></span>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <strong>Full Name:</strong>
              <span>{user.fullName}</span>
            </div>
            <div className="info-item">
              <strong>Username:</strong>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <strong>Member Since:</strong>
              <span>{user.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="profile-card">
          <h2>My Bookings</h2>
          <div id="bookingsList">
            {bookings.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#ccc' }}>No bookings yet</p>
            ) : (
              bookings.map((booking, index) => (
                <div key={index} className="booking-item">
                  <h3>{booking.service}</h3>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Address:</strong> {booking.address}</p>
                  <p><strong>Status:</strong> {booking.status || 'Pending'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
