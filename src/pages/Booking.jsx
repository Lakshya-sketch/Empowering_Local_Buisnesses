import React, { useState, useEffect } from 'react';
import '../css/Booking.css';

function Booking() {
  const [serviceTitle, setServiceTitle] = useState('Book a Service');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
    workDescription: ''
  });
  const [confirmationMsg, setConfirmationMsg] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Get service from URL params
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service') || 'General';
    setServiceTitle(`Book ${service.charAt(0).toUpperCase() + service.slice(1)} Service`);

    // Pre-fill user info if logged in
    const userName = localStorage.getItem('currentUserFullName');
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userName) setFormData(prev => ({ ...prev, name: userName }));
    if (userEmail) setFormData(prev => ({ ...prev, email: userEmail }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.address || !formData.date || !formData.time || !formData.workDescription) {
      alert('Please fill in all required fields');
      return;
    }

    // Save booking to localStorage
    const booking = {
      ...formData,
      bookingId: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleString(),
      status: 'Pending'
    };

    let bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('userBookings', JSON.stringify(bookings));

    setConfirmationMsg(`✓ Booking confirmed! Booking ID: ${booking.bookingId}`);
    setShowMessage(true);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      date: '',
      time: '',
      workDescription: ''
    });

    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="main-content">
      <section className="booking-hero">
        <h1>{serviceTitle}</h1>
        <p>Fill out the form below to schedule your service appointment</p>
      </section>

      <section className="booking-form-section">
        <form className="booking-form" id="bookingForm" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                placeholder="Enter your full name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                placeholder="+91 98765 43210" 
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Service Address *</label>
            <textarea 
              id="address" 
              name="address"
              rows="3" 
              placeholder="Enter complete address where service is needed"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Preferred Date *</label>
              <input 
                type="date" 
                id="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Preferred Time *</label>
              <input 
                type="time" 
                id="time" 
                name="time"
                value={formData.time}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="workDescription">What work needs to be done? *</label>
            <textarea 
              id="workDescription" 
              name="workDescription"
              rows="5" 
              placeholder="Please describe in detail what work you need done (e.g., Fix leaking tap in kitchen, Install new ceiling fan, Repair broken door hinge)"
              value={formData.workDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="submit-group">
            <button type="submit" className="btn btn-primary">Confirm Booking</button>
            {showMessage && <p className={`confirmation-msg ${!showMessage ? 'hidden' : ''}`}>{confirmationMsg}</p>}
          </div>
        </form>
      </section>
    </div>
  );
}

export default Booking;
