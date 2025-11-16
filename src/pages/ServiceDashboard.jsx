import React, { useState, useEffect } from 'react';
import '../css/ServiceDashboard.css';

function ServiceDashboard() {
  const [service, setService] = useState('plumber');
  const [providers, setProviders] = useState([]);
  const [title, setTitle] = useState('Our Services');
  const [description, setDescription] = useState('Browse our list of trusted service providers');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const services = [
    { id: 'plumber', name: 'Plumbers', icon: '🔧' },
    { id: 'electrician', name: 'Electricians', icon: '⚡' },
    { id: 'carpenter', name: 'Carpenters', icon: '🔨' },
    { id: 'grocery', name: 'Grocery', icon: '🛒' },
    { id: 'medicine', name: 'Medicine', icon: '💊' },
    { id: 'ready-to-eat', name: 'Ready-to-Eat', icon: '🍲' },
  ];

  useEffect(() => {
    // Get service from URL query params
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get('service') || 'plumber';
    setService(selectedService);
  }, []);

  useEffect(() => {
    loadServiceData(service);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const loadServiceData = async (serviceName) => {
    setLoading(true);
    setError(null);
    try {
      const isOrderable = ['grocery', 'medicine', 'ready-to-eat'].includes(serviceName);
      
      if (isOrderable) {
        await loadOrderData(serviceName);
      } else {
        await loadBookingData(serviceName);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(`Unable to load ${serviceName} data`);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBookingData = async (serviceName) => {
    try {
      const response = await fetch(`/data/${serviceName}-data.json`);
      if (!response.ok) throw new Error('Data not found');
      
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setProviders(data.providers.map(p => ({ ...p, type: 'booking', serviceName })));
    } catch (err) {
      throw err;
    }
  };

  const loadOrderData = async (category) => {
    try {
      const response = await fetch('/data/grocery-menus.json');
      if (!response.ok) throw new Error('Data not found');
      
      const allShops = await response.json();
      const categoryName = category.replace('-', '').replace(' ', '').toLowerCase();
      const filteredShops = allShops.filter(
        shop => shop.category.toLowerCase() === categoryName
      );

      const categoryTitles = {
        grocery: 'Grocery Delivery',
        medicine: 'Medicine Delivery',
        'ready-to-eat': 'Ready-to-Eat Services'
      };

      setTitle(categoryTitles[category] || category);
      setDescription(`Browse trusted ${category} shops near you`);
      setProviders(filteredShops.map(s => ({ ...s, type: 'order', category })));
    } catch (err) {
      throw err;
    }
  };

  const handleServiceClick = (serviceId) => {
    setService(serviceId);
    window.history.pushState({}, '', `?service=${serviceId}`);
  };

  const handleOrderClick = (shop) => {
    window.location.href = `/order?shop=${shop.id}&category=${service}`;
  };

  const handleBookClick = (provider) => {
    window.location.href = `/booking?service=${provider.serviceName}`;
  };

  return (
    <main className="main-content">
      <section className="services-hero">
        <div className="service-filter">
          {services.map(svc => (
            <button
              key={svc.id}
              onClick={() => handleServiceClick(svc.id)}
              className={`filter-card ${service === svc.id ? 'active' : ''}`}
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >
              <div style={{
                background: service === svc.id ? 'rgba(255, 217, 61, 0.15)' : 'rgba(1, 35, 77, 0.6)',
                border: service === svc.id ? '2px solid #FFD93D' : '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px 10px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{svc.icon}</div>
                <span style={{
                  display: 'block',
                  color: service === svc.id ? '#FFD93D' : '#ccc',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {svc.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#FFD93D', marginBottom: '10px' }}>
          {title}
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>
          {description}
        </p>
      </section>

      <section className="provider-listings">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#FFD93D' }}>
            Loading providers...
          </div>
        ) : error ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#ccc' }}>
            <h3>{error}</h3>
            <p>Please try again later.</p>
          </div>
        ) : providers.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#ccc' }}>
            No providers available at the moment.
          </div>
        ) : (
          providers.map((provider, idx) => (
            <ProviderCard
              key={idx}
              provider={provider}
              onBook={provider.type === 'booking' ? handleBookClick : handleOrderClick}
            />
          ))
        )}
      </section>
    </main>
  );
}

function ProviderCard({ provider, onBook }) {
  const isBooking = provider.type === 'booking';
  const isAvailable = isBooking 
    ? provider.status === 'available' 
    : (provider.status.toLowerCase() === 'available' || provider.status.toLowerCase() === 'open');

  const buttonText = isBooking
    ? (provider.status === 'available' ? 'Book Now' : 'Notify Me')
    : (provider.status.toLowerCase() === 'available' || provider.status.toLowerCase() === 'open' ? 'Order Now' : 'Closed');

  const skillsData = isBooking ? provider.skills : (provider.Specialities || provider.Speciality || ['General']);

  return (
    <div className="provider-card">
      <div className="profile-section">
        <img src={provider.image} alt={provider.name} />
        <div className="profile-info">
          <h3>{provider.name}</h3>
          <p className="location">{isBooking ? provider.location : provider.city}</p>
        </div>
      </div>

      <div className="details-section">
        <div className={`detail-item availability ${isAvailable ? 'available' : 'busy'}`}>
          <strong>Status:</strong> <span>{isAvailable ? 'Available' : 'Busy'}</span>
        </div>
        {isBooking ? (
          <>
            <div className="detail-item">
              <strong>Experience:</strong> {provider.experience}
            </div>
            <div className="detail-item">
              <strong>Hiring Cost:</strong> {provider.cost}
            </div>
          </>
        ) : (
          <>
            <div className="detail-item">
              <strong>Delivery:</strong> {provider.delivery}
            </div>
          </>
        )}
        <div className="detail-item skills">
          <strong>{isBooking ? 'Skills' : 'Specialities'}:</strong>
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skillsData.map((skill, idx) => (
              <span key={idx} style={{
                background: 'rgba(255, 217, 61, 0.1)',
                border: '1px solid rgba(255, 217, 61, 0.3)',
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '0.85rem',
                color: '#FFD93D'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="action-section">
        <button
          onClick={() => onBook(provider)}
          disabled={!isAvailable}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            background: isAvailable ? '#FFD93D' : '#666',
            color: isAvailable ? '#001122' : '#ccc',
            transition: 'all 0.3s ease',
            width: '100%'
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ServiceDashboard;
