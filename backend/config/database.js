const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database with name LocalBiz
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'LocalBiz'}`);
    console.log('✅ Database LocalBiz created/verified');

    await connection.query(`USE ${process.env.DB_NAME || 'LocalBiz'}`);

    // Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        role ENUM('user', 'provider', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Providers Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        service_type VARCHAR(100) NOT NULL,
        experience INT,
        price_per_hour DECIMAL(10,2),
        rating DECIMAL(2,1) DEFAULT 0.0,
        total_reviews INT DEFAULT 0,
        bio TEXT,
        availability JSON,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create Services Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category ENUM('plumber', 'electrician', 'carpenter', 'grocery', 'medicine', 'ready-to-eat') NOT NULL,
        description TEXT,
        icon_url VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Bookings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        provider_id INT,
        service_type VARCHAR(100),
        booking_date DATE,
        booking_time TIME,
        address TEXT,
        phone VARCHAR(20),
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        total_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL
      )
    `);

    // Create Products Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category ENUM('grocery', 'medicine', 'ready-to-eat') NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        stock INT DEFAULT 0,
        provider_id INT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL
      )
    `);

    // Create Orders Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total_amount DECIMAL(10,2),
        delivery_address TEXT,
        phone VARCHAR(20),
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create Order Items Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT,
        price DECIMAL(10,2),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ All tables created/verified in LocalBiz database');

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database setup error:', error);
    throw error;
  }
};

module.exports = { createDatabase };
