import React, { useState, useEffect } from 'react';
import '../css/Shared.css';
import '../css/Home.css'; 
import { Link } from 'react-router-dom';

function Home() {
  const [slideIndex, setSlideIndex] = useState(1);

  const slides = [
    { src: "/images/Support Local Businesses.webp", alt: "Support Local Businesses" },
    { src: "/images/1607611402-GettyImages-1223488572.jpg", alt: "Professional Services" },
    { src: "/images/3-Possible-Careers-after-Plumbing-School.jpg", alt: "Plumbing Services" },
    { src: "/images/3-Possible-Careers-after-Plumbing-School copy.jpg", alt: "Expert Plumbers" },
    { src: "/images/tim-mossholder-qvWnGmoTbik-unsplash.jpg", alt: "Community Connection" },
    { src: "/images/download.jpg", alt: "Local Business Support" }
  ];

  useEffect(() => {
    const autoSlideTimer = setInterval(() => {
      setSlideIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex > slides.length ? 1 : nextIndex;
      });
    }, 5000);

    return () => clearInterval(autoSlideTimer);
  }, [slides.length]);

  const changeSlide = (n) => {
    let newIndex = slideIndex + n;
    if (newIndex > slides.length) newIndex = 1;
    if (newIndex < 1) newIndex = slides.length;
    setSlideIndex(newIndex);
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  const scrollToCategories = () => {
    document.querySelector('.categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Animated Stars Background */}
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <span key={i} className="star"></span>
        ))}
      </div>

      <main style={{ width: '100%', minHeight: '100vh' }}>
        {/* Giant Slideshow Hero Section */}
        <section className="giant-slideshow-hero">
          <div className="slideshow-wrapper">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide-item fade ${index + 1 === slideIndex ? 'active' : ''}`}
                style={{ display: index + 1 === slideIndex ? 'block' : 'none' }}
              >
                <img src={slide.src} alt={slide.alt} />
              </div>
            ))}

            {/* Navigation Buttons */}
            <button className="prev-button" onClick={() => changeSlide(-1)}>
              &#10094;
            </button>
            <button className="next-button" onClick={() => changeSlide(1)}>
              &#10095;
            </button>

            {/* Dots Navigation */}
            <div className="dots-navigation">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className="dot"
                  style={{
                    backgroundColor: index + 1 === slideIndex ? '#FFD93D' : 'rgba(255, 255, 255, 0.5)'
                  }}
                  onClick={() => currentSlide(index + 1)}
                ></span>
              ))}
            </div>

            {/* Hero Overlay */}
            <div className="slideshow-overlay">
              <h1>Welcome to LocalBizConnect</h1>
              <p>Connecting you with trusted local service providers</p>
              <button className="cta-button-hero" onClick={scrollToCategories}>
                Explore Services
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories">
          <Link to="/service-dashboard?service=plumber" className="category-card">
            <img src="https://img.icons8.com/ios/100/plumbing.png" alt="Plumber" />
            <h2>Plumbers</h2>
            <p>Expert plumbing services</p>
          </Link>

          <Link to="/service-dashboard?service=electrician" className="category-card">
            <img src="https://img.icons8.com/ios/100/screwdriver.png" alt="Electrician" />
            <h2>Electricians</h2>
            <p>Professional electrical work</p>
          </Link>

          <Link to="/service-dashboard?service=carpenter" className="category-card">
            <img src="https://img.icons8.com/ios/100/hammer.png" alt="Carpenter" />
            <h2>Carpenters</h2>
            <p>Quality carpentry services</p>
          </Link>

          <Link to="/service-dashboard?service=grocery" className="category-card">
            <img src="https://img.icons8.com/ios/50/shopping-basket-2.png" alt="Grocery" />
            <h2>Grocery</h2>
            <p>Fresh groceries delivered</p>
          </Link>

          <Link to="/service-dashboard?service=medicine" className="category-card">
            <img src="https://img.icons8.com/ios/100/pill.png" alt="Medicine" />
            <h2>Medicine</h2>
            <p>Quick pharmacy delivery</p>
          </Link>

          <Link to="/service-dashboard?service=ready-to-eat" className="category-card">
            <img src="https://img.icons8.com/dotty/80/food-and-wine.png" alt="Ready to Eat" />
            <h2>Ready-to-Eat</h2>
            <p>Delicious meals ready</p>
          </Link>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2>How It Works</h2>
          <p className="subtitle">Simple steps to connect with local service providers</p>
          <div className="steps">
            <div className="step">
              <div className="icon">1</div>
              <h3>Browse Services</h3>
              <p>Explore our categories and find the service you need</p>
            </div>
            <div className="step">
              <div className="icon">2</div>
              <h3>Choose Provider</h3>
              <p>Review providers, their experience, and availability</p>
            </div>
            <div className="step">
              <div className="icon">3</div>
              <h3>Book Appointment</h3>
              <p>Select date, time, and confirm your booking</p>
            </div>
            <div className="step">
              <div className="icon">4</div>
              <h3>Get Service</h3>
              <p>Trusted professionals arrive at your doorstep</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>&copy; 2025 LocalBizConnect | Empowering Communities</p>
        </footer>
      </main>
    </>
  );
}

export default Home;
