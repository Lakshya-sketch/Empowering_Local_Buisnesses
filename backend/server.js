const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection Pool for LocalBiz
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'LocalBiz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make pool available to routes
app.locals.db = pool;

// Test Database Connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to LocalBiz database successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ LocalBiz database connection failed:', err.message);
  });

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const providerRoutes = require('./routes/providers');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', database: 'LocalBiz' });
});

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'LocalBizConnect API Server', database: 'LocalBiz' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: LocalBiz`);
});
