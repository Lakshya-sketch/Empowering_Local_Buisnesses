import React from 'react';
import '../css/About.css';

function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About LocalBizConnect</h1>
        <p>Connecting communities with trusted local service providers</p>
      </section>

      <section className="about-section">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>LocalBizConnect was founded with a simple yet powerful mission: to bridge the gap between local service providers and the communities that need them. We believe in empowering local businesses while making it easier for residents to find reliable, verified professionals for their everyday needs.</p>
        </div>

        <div className="about-card">
          <h2>What We Do</h2>
          <p>We provide a comprehensive platform where you can discover, compare, and book services from trusted local professionals including plumbers, electricians, carpenters, grocery delivery, medicine delivery, and ready-to-eat meal providers. Every service provider on our platform is verified and rated by real customers.</p>
        </div>

        <div className="about-card">
          <h2>Why Choose Us</h2>
          <ul>
            <li>✓ Verified and trusted service providers</li>
            <li>✓ Transparent pricing with no hidden costs</li>
            <li>✓ Real customer reviews and ratings</li>
            <li>✓ Quick and easy booking process</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ Supporting local businesses and communities</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Trust</h3>
              <p>We verify every service provider to ensure quality and reliability</p>
            </div>
            <div className="value-item">
              <h3>Community</h3>
              <p>We support local businesses and strengthen community connections</p>
            </div>
            <div className="value-item">
              <h3>Excellence</h3>
              <p>We strive for the highest standards in service delivery</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously improve our platform to serve you better</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied customers who trust LocalBizConnect</p>
        <a href="/booking?service=plumber" className="cta-button">Browse Services</a>
      </section>
    </div>
  );
}

export default About;
