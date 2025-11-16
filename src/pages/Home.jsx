import React, { useState, useEffect } from 'react';
import '../css/Shared.css';

function Home() {
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    showSlide(slideIndex);
    const timer = setAutoSlide();
    return () => clearTimeout(timer);
  }, [slideIndex]);

  const changeSlide = (n) => {
    setSlideIndex(slideIndex + n);
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  const showSlide = (n) => {
    const slides = document.getElementsByClassName("slide-item");
    const dots = document.getElementsByClassName("dot");

    let index = n;
    if (index > slides.length) {
      index = 1;
      setSlideIndex(1);
    }
    if (index < 1) {
      index = slides.length;
      setSlideIndex(slides.length);
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    if (slides[index - 1]) {
      slides[index - 1].style.display = "block";
      dots[index - 1].className += " active";
    }
  };

  const setAutoSlide = () => {
    return setTimeout(() => {
      let nextIndex = slideIndex + 1;
      const slides = document.getElementsByClassName("slide-item");
      if (nextIndex > slides.length) {
        nextIndex = 1;
      }
      setSlideIndex(nextIndex);
    }, 5000);
  };

  return (
    <div className="home-container">
      {/* Giant Slideshow Hero Section */}
      <div className="giant-slideshow-hero">
        <div className="slideshow-wrapper">
          {/* Slides */}
          <div className="slide-item fade">
            <img src="/images/Support Local Businesses.webp" alt="Support Local Businesses" />
          </div>
          <div className="slide-item fade">
            <img src="/images/1607611402-GettyImages-1223488572.jpg" alt="Services" />
          </div>
          <div className="slide-item fade">
            <img src="/images/3-Possible-Careers-after-Plumbing-School.jpg" alt="Plumbing" />
          </div>
          <div className="slide-item fade">
            <img src="/images/3-Possible-Careers-after-Plumbing-School copy.jpg" alt="Plumbing Services" />
          </div>
          <div className="slide-item fade">
            <img src="/images/tim-mossholder-qvWnGmoTbik-unsplash.jpg" alt="Professional Services" />
          </div>
          <div className="slide-item fade">
            <img src="/images/download.jpg" alt="Services" />
          </div>

          {/* Navigation Buttons */}
          <a className="prev-button" onClick={() => changeSlide(-1)}>❮</a>
          <a className="next-button" onClick={() => changeSlide(1)}>❯</a>

          {/* Dots */}
          <div className="dots-navigation">
            <span className="dot" onClick={() => currentSlide(1)}></span>
            <span className="dot" onClick={() => currentSlide(2)}></span>
            <span className="dot" onClick={() => currentSlide(3)}></span>
            <span className="dot" onClick={() => currentSlide(4)}></span>
            <span className="dot" onClick={() => currentSlide(5)}></span>
            <span className="dot" onClick={() => currentSlide(6)}></span>
          </div>

          {/* Overlay Content */}
          <div className="slideshow-overlay">
            <h1>Welcome to LocalBizConnect</h1>
            <p>Connecting you with trusted local service providers in your community</p>
            <a href="/services" className="cta-button-hero">Browse Services</a>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="categories-section" style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#fff', marginBottom: '50px', fontWeight: '700' }}>
          Popular Services
        </h2>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px'
        }}>
          <CategoryCard icon="🔧" title="Plumbers" description="Expert plumbing services" />
          <CategoryCard icon="⚡" title="Electricians" description="Professional electrical work" />
          <CategoryCard icon="🔨" title="Carpenters" description="Quality carpentry services" />
          <CategoryCard icon="🛒" title="Grocery" description="Fresh groceries delivered" />
          <CategoryCard icon="💊" title="Medicine" description="Quick pharmacy delivery" />
          <CategoryCard icon="🍲" title="Ready-to-Eat" description="Delicious meals ready" />
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '60px 20px', background: 'rgba(1, 35, 77, 0.3)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#FFD93D', marginBottom: '50px', fontWeight: '700' }}>
          How It Works
        </h2>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px'
        }}>
          <StepCard number="1" title="Browse Services" description="Explore a wide range of local services available in your area" />
          <StepCard number="2" title="Choose Provider" description="Review providers, their experience and availability" />
          <StepCard number="3" title="Book Appointment" description="Select date, time, and confirm your booking" />
          <StepCard number="4" title="Get Service" description="Trusted professionals arrive at your doorstep" />
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ icon, title, description }) {
  return (
    <a href="/services" style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'rgba(1, 35, 77, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '30px 20px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#FFD93D';
        e.currentTarget.style.background = 'rgba(1, 35, 77, 0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.background = 'rgba(1, 35, 77, 0.6)';
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{icon}</div>
        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px', margin: '0 0 10px 0' }}>
          {title}
        </h3>
        <p style={{ color: '#ccc', fontSize: '0.95rem', margin: '0' }}>
          {description}
        </p>
      </div>
    </a>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '30px 20px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: '#FFD93D',
        color: '#001122',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 auto 20px'
      }}>
        {number}
      </div>
      <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '10px', margin: '0 0 10px 0' }}>
        {title}
      </h3>
      <p style={{ color: '#ccc', fontSize: '0.9rem', margin: '0' }}>
        {description}
      </p>
    </div>
  );
}

export default Home;
