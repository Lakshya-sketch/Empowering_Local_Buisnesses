import React, { useState, useEffect } from 'react';
import '../css/Checkout.css';

function Checkout() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);

    // Pre-fill name from localStorage if available
    const userName = localStorage.getItem('currentUserFullName');
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userName) setFormData(prev => ({ ...prev, name: userName }));
    if (userEmail) setFormData(prev => ({ ...prev, email: userEmail }));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.address) {
      alert('Please fill in all fields');
      return;
    }

    // Save order to localStorage
    const order = {
      items: cart,
      customer: formData,
      total: getTotalPrice(),
      date: new Date().toLocaleDateString(),
      orderId: Math.random().toString(36).substr(2, 9)
    };

    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');

    alert(`Order placed successfully! Order ID: ${order.orderId}`);
    window.location.href = '/';
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <main className="checkout-container">
      <h1>Checkout Summary</h1>
      
      <div className="order-list">
        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc' }}>Your cart is empty</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="order-item">
              <span className="order-item-name">
                {item.name} × {item.quantity}
              </span>
              <span className="order-item-price">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="order-total">Total: ₹{getTotalPrice()}</div>

      <section className="checkout-details">
        <h2>Enter Delivery Details</h2>
        <form id="checkoutForm" onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="name" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
          <input 
            type="email" 
            id="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <textarea 
            id="address" 
            placeholder="Delivery Address" 
            value={formData.address}
            onChange={handleChange}
            required 
          ></textarea>
          <button type="submit" className="place-order-btn">Place Order</button>
        </form>
      </section>
    </main>
  );
}

export default Checkout;
