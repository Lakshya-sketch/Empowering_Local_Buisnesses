import React, { useState, useEffect } from 'react';
import '../css/Order.css';

function Order() {
  const [items, setItems] = useState([]);
  const [storeName, setStoreName] = useState('Loading Shop...');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Get service from URL params
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service') || 'grocery';
    
    setStoreName(service.charAt(0).toUpperCase() + service.slice(1) + ' Shop');
    
    // Load items (sample data)
    const sampleItems = [
      { id: 1, name: 'Item 1', price: 100, quantity: 0 },
      { id: 2, name: 'Item 2', price: 150, quantity: 0 },
      { id: 3, name: 'Item 3', price: 200, quantity: 0 },
    ];
    setItems(sampleItems);

    // Restore cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateItemQuantity = (id, delta) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    );
    setItems(updated);
    updateCart(updated);
  };

  const updateCart = (itemList) => {
    const cart = itemList.filter(item => item.quantity > 0);
    setCartItems(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    window.location.href = '/checkout';
  };

  return (
    <>
      <section className="order-hero">
        <h1>{storeName}</h1>
        <p className="order-subtitle">Select items and add them to your cart</p>
      </section>

      <main className="order-container">
        <div className="item-list">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>Fresh and quality products</p>
              </div>
              <div className="item-price">₹{item.price}</div>
              <div className="item-quantity">
                <button 
                  className="qty-btn"
                  onClick={() => updateItemQuantity(item.id, -1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => updateItemQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Button */}
      <button 
        className="cart-btn"
        onClick={() => setCartOpen(!cartOpen)}
      >
        🛒 {cartItems.length}
      </button>

      {/* Cart Popup */}
      <div className={`cart-popup ${cartOpen ? 'active' : ''}`}>
        <h3>Your Cart</h3>
        <div id="cartItems">
          {cartItems.length === 0 ? (
            <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Cart is empty</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))
          )}
        </div>
        <div className="cart-total">Total: ₹{getTotalPrice()}</div>
        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
      </div>
    </>
  );
}

export default Order;
