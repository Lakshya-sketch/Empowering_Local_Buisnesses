import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Stars from './components/Stars';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Order from './pages/Order';
import Checkout from './pages/Checkout';
import Booking from './pages/Booking';
import ServiceDashboard from './pages/ServiceDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Stars />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order" element={<Order />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/services" element={<ServiceDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
