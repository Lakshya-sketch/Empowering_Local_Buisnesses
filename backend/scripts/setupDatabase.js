require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
};

const DB_NAME = process.env.DB_NAME || 'localbizconnect';

async function setupDatabase() {
  let connection;

  try {
    console.log('🚀 Starting database setup...\n');

    // Connect to MySQL server (without selecting database)
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`✅ Database '${DB_NAME}' created/verified`);

    // Use the database
    await connection.query(`USE ${DB_NAME}`);
    console.log(`✅ Using database '${DB_NAME}'`);

    // ==========================================
    // CREATE TABLES
    // ==========================================
    console.log('\n📋 Creating tables...');

    // 1. Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        address TEXT,
        role ENUM('user', 'admin', 'provider') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username)
      )
    `);
    console.log('  ✓ Users table created');

    // 2. Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      )
    `);
    console.log('  ✓ Categories table created');

    // 3. Providers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        category_id INT,
        description TEXT,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(15),
        address TEXT,
        website VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 0.00,
        status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_category (category_id),
        INDEX idx_status (status)
      )
    `);
    console.log('  ✓ Providers table created');

    // 4. Services table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT PRIMARY KEY AUTO_INCREMENT,
        provider_id INT NOT NULL,
        category_id INT,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration INT COMMENT 'Duration in minutes',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_provider (provider_id),
        INDEX idx_category (category_id),
        INDEX idx_active (active)
      )
    `);
    console.log('  ✓ Services table created');

    // 5. Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        provider_id INT NOT NULL,
        category_id INT,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0,
        image_url VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_provider (provider_id),
        INDEX idx_category (category_id),
        INDEX idx_active (active)
      )
    `);
    console.log('  ✓ Products table created');

    // 6. Bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        service_id INT NOT NULL,
        provider_id INT NOT NULL,
        scheduled_date DATE NOT NULL,
        scheduled_time TIME NOT NULL,
        work_description TEXT,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_provider (provider_id),
        INDEX idx_status (status),
        INDEX idx_date (scheduled_date)
      )
    `);
    console.log('  ✓ Bookings table created');

    // 7. Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        provider_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'processing', 'delivered', 'cancelled') DEFAULT 'pending',
        delivery_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_provider (provider_id),
        INDEX idx_status (status)
      )
    `);
    console.log('  ✓ Orders table created');

    // 8. Order Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_order (order_id)
      )
    `);
    console.log('  ✓ Order Items table created');

    // 9. Reviews table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        provider_id INT NOT NULL,
        service_id INT,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
        INDEX idx_provider (provider_id),
        INDEX idx_rating (rating)
      )
    `);
    console.log('  ✓ Reviews table created');

    // 10. Addresses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        address_type ENUM('home', 'work', 'other') DEFAULT 'home',
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id)
      )
    `);
    console.log('  ✓ Addresses table created');

    // ==========================================
    // INSERT DUMMY DATA
    // ==========================================
    console.log('\n📦 Inserting dummy data...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('Password@123', 10);

    // Insert Users
    await connection.query(`
      INSERT IGNORE INTO users (full_name, username, email, password, phone, address, role) VALUES
      ('Admin User', 'admin', 'admin@localbiz.com', ?, '9999999999', 'Admin Office, Patiala', 'admin'),
      ('John Doe', 'johndoe', 'john@example.com', ?, '9876543210', '123 Main St, Patiala', 'user'),
      ('Jane Smith', 'janesmith', 'jane@example.com', ?, '9876543211', '456 Park Ave, Chandigarh', 'user'),
      ('Robert Johnson', 'robertj', 'robert@example.com', ?, '9876543212', '789 Lake View, Ludhiana', 'user'),
      ('Emily Davis', 'emilyd', 'emily@example.com', ?, '9876543213', '321 River Rd, Amritsar', 'user')
    `, [adminPassword, userPassword, userPassword, userPassword, userPassword]);
    console.log('  ✓ Users inserted');

    // Insert Categories
    await connection.query(`
      INSERT IGNORE INTO categories (name, description) VALUES
      ('Plumbing', 'Professional plumbing services'),
      ('Electrical', 'Electrical repair and installation'),
      ('Carpentry', 'Woodwork and furniture services'),
      ('Grocery', 'Fresh groceries and household items'),
      ('Medicine', 'Pharmacy and medical supplies'),
      ('Ready-to-Eat', 'Prepared meals and food delivery')
    `);
    console.log('  ✓ Categories inserted');

    // Insert Providers
    await connection.query(`
      INSERT IGNORE INTO providers (name, category_id, description, email, phone, address, website, rating, status) VALUES
      ('Quick Fix Plumbing', 1, 'Fast and reliable plumbing services', 'info@quickfixplumbing.com', '9876501001', 'Sector 12, Patiala', 'www.quickfixplumbing.com', 4.5, 'active'),
      ('Pro Plumbers', 1, '24/7 emergency plumbing services', 'contact@proplumbers.com', '9876501002', 'Model Town, Ludhiana', 'www.proplumbers.com', 4.8, 'active'),
      ('Bright Spark Electricals', 2, 'Licensed electricians', 'hello@brightspark.com', '9876502001', 'Civil Lines, Patiala', 'www.brightspark.com', 4.7, 'active'),
      ('Power Solutions', 2, 'Residential and commercial electrical', 'info@powersolutions.com', '9876502002', 'Ranjit Avenue, Amritsar', NULL, 4.6, 'active'),
      ('Master Carpenters', 3, 'Custom furniture and carpentry', 'info@mastercarpenter.com', '9876503001', 'Gandhi Nagar, Jalandhar', 'www.mastercarpenter.com', 4.9, 'active'),
      ('Wood Craft Studios', 3, 'Premium woodwork', 'contact@woodcraft.com', '9876503002', 'Urban Estate, Patiala', 'www.woodcraft.com', 4.4, 'active'),
      ('Fresh Mart', 4, 'Your neighborhood grocery store', 'hello@freshmart.com', '9876504001', 'Main Bazaar, Patiala', NULL, 4.3, 'active'),
      ('Super Grocery', 4, 'Wide range of groceries', 'info@supergrocery.com', '9876504002', 'Mall Road, Ludhiana', 'www.supergrocery.com', 4.5, 'active'),
      ('HealthPlus Pharmacy', 5, '24/7 pharmacy with delivery', 'care@healthplus.com', '9876505001', 'Fountain Chowk, Patiala', 'www.healthplus.com', 4.8, 'active'),
      ('MediCare Drugstore', 5, 'Trusted pharmacy', 'info@medicare.com', '9876505002', 'Model Town, Chandigarh', 'www.medicare.com', 4.7, 'active'),
      ('Tasty Bites', 6, 'Delicious ready-to-eat meals', 'order@tastybites.com', '9876506001', 'Baradari, Patiala', 'www.tastybites.com', 4.6, 'active'),
      ('Quick Meals Express', 6, 'Fast food delivery', 'hello@quickmeals.com', '9876506002', 'Ferozepur Road, Ludhiana', NULL, 4.4, 'active')
    `);
    console.log('  ✓ Providers inserted');

    // Insert Services
    await connection.query(`
      INSERT IGNORE INTO services (provider_id, category_id, name, description, price, duration, active) VALUES
      (1, 1, 'Pipe Repair', 'Fix leaking or broken pipes', 500.00, 60, TRUE),
      (1, 1, 'Drain Cleaning', 'Professional drain cleaning', 800.00, 90, TRUE),
      (2, 1, 'Water Heater Installation', 'Install water heaters', 2500.00, 180, TRUE),
      (3, 2, 'Wiring Installation', 'Complete electrical wiring', 3000.00, 240, TRUE),
      (3, 2, 'Light Fixture Repair', 'Repair and replace lights', 400.00, 45, TRUE),
      (4, 2, 'Ceiling Fan Installation', 'Professional fan installation', 600.00, 60, TRUE),
      (5, 3, 'Custom Furniture', 'Design and build furniture', 15000.00, 720, TRUE),
      (5, 3, 'Door Installation', 'Install wooden doors', 3500.00, 180, TRUE),
      (6, 3, 'Cabinet Making', 'Kitchen cabinets', 8000.00, 360, TRUE)
    `);
    console.log('  ✓ Services inserted');

    // Insert Products
    await connection.query(`
      INSERT IGNORE INTO products (provider_id, category_id, name, description, price, stock, active) VALUES
      (7, 4, 'Fresh Vegetables Pack', 'Assorted vegetables (1kg)', 150.00, 100, TRUE),
      (7, 4, 'Rice (Basmati)', 'Premium basmati (5kg)', 450.00, 50, TRUE),
      (8, 4, 'Dairy Products Combo', 'Milk, butter, cheese', 250.00, 80, TRUE),
      (9, 5, 'Paracetamol (500mg)', 'Pain relief - 10 strips', 50.00, 200, TRUE),
      (9, 5, 'Vitamin C Supplements', '60 tablets', 180.00, 150, TRUE),
      (10, 5, 'First Aid Kit', 'Complete kit', 350.00, 75, TRUE),
      (11, 6, 'Chicken Biryani', 'Authentic biryani', 180.00, 40, TRUE),
      (11, 6, 'Paneer Tikka Meal', 'With rice and naan', 220.00, 35, TRUE),
      (12, 6, 'Burger Combo', 'Burger with fries', 150.00, 50, TRUE)
    `);
    console.log('  ✓ Products inserted');

    // Insert Bookings
    await connection.query(`
      INSERT IGNORE INTO bookings (user_id, service_id, provider_id, scheduled_date, scheduled_time, work_description, total_amount, status) VALUES
      (2, 1, 1, '2025-11-20', '10:00:00', 'Fix bathroom pipe leak', 500.00, 'confirmed'),
      (3, 4, 3, '2025-11-21', '14:00:00', 'Wiring for new room', 3000.00, 'pending'),
      (4, 7, 5, '2025-11-25', '09:00:00', 'Custom bookshelf', 15000.00, 'confirmed')
    `);
    console.log('  ✓ Bookings inserted');

    // Insert Orders
    await connection.query(`
      INSERT IGNORE INTO orders (user_id, provider_id, total_amount, status, delivery_address) VALUES
      (2, 7, 600.00, 'delivered', '123 Main St, Patiala'),
      (3, 9, 230.00, 'processing', '456 Park Ave, Chandigarh'),
      (4, 11, 400.00, 'delivered', '789 Lake View, Ludhiana')
    `);
    console.log('  ✓ Orders inserted');

    // Insert Reviews
    await connection.query(`
      INSERT IGNORE INTO reviews (user_id, provider_id, service_id, rating, comment) VALUES
      (2, 1, 1, 5, 'Excellent service! Fixed quickly.'),
      (3, 3, 4, 5, 'Very professional. Recommended!'),
      (4, 5, 7, 5, 'Amazing craftsmanship!')
    `);
    console.log('  ✓ Reviews inserted');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Test credentials:');
    console.log('   Admin: admin@localbiz.com / Admin@123');
    console.log('   User:  john@example.com / Password@123');

  } catch (error) {
    console.error('\n❌ Error during database setup:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run setup
setupDatabase()
  .then(() => {
    console.log('\n✨ Setup script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error);
    process.exit(1);
  });
