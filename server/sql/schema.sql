-- =====================================
-- DATABASE: localbizconnect
-- =====================================
CREATE DATABASE IF NOT EXISTS LocalBiz;
USE LocalBiz;

-- =====================================
-- USERS TABLE
-- =====================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- PROVIDERS TABLE
-- =====================================
CREATE TABLE providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    website VARCHAR(255),
    category_id INT,
    business_address TEXT,
    hourly_rate DECIMAL(10,2),
    experience VARCHAR(50),
    profile_image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- CATEGORIES TABLE
-- =====================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- SERVICES TABLE
-- =====================================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    base_price DECIMAL(10,2),
    duration_minutes INT,
    active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- ADDRESSES TABLE
-- =====================================
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    provider_id INT,
    line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude FLOAT,
    longitude FLOAT,
    type ENUM('Home', 'Work', 'Business') DEFAULT 'Home',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- =====================================
-- BOOKINGS TABLE
-- =====================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT,
    provider_id INT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    scheduled_date DATE,
    scheduled_time TIME,
    total_amount DECIMAL(10,2),
    work_description TEXT,
    booking_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- =====================================
-- BOOKING ITEMS TABLE
-- =====================================
CREATE TABLE booking_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    service_id INT,
    qty INT DEFAULT 1,
    price DECIMAL(10,2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- =====================================
-- PAYMENTS TABLE
-- =====================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- =====================================
-- REFUNDS TABLE
-- =====================================
CREATE TABLE refunds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT,
    reason TEXT,
    refunded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- =====================================
-- REVIEWS TABLE
-- =====================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reviewable_type ENUM('provider', 'service') NOT NULL,
    reviewable_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================
-- PROVIDER STAFF TABLE
-- =====================================
CREATE TABLE provider_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    name VARCHAR(255) NOT NULL,
    staff_type ENUM('Technician', 'Manager', 'Cleaner', 'Electrician', 'Carpenter', 'Admin') DEFAULT 'Technician',
    phone VARCHAR(20),
    email VARCHAR(255),
    hired_at DATE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- =====================================
-- WORK HOURS TABLE
-- =====================================
CREATE TABLE work_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
    open_time TIME,
    close_time TIME,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- =====================================
-- MEDIA TABLE
-- =====================================
CREATE TABLE media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    media_type ENUM('image', 'video') DEFAULT 'image',
    service_id INT,
    provider_id INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- =====================================
-- ORDERS TABLE
-- =====================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE,
    user_id INT,
    provider_id INT,
    total_amount DECIMAL(10,2),
    delivery_address TEXT,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- =====================================
-- PRODUCTS TABLE
-- =====================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT,
    category_id INT,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    stock INT DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    image VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =====================================
-- PRODUCT VARIANTS TABLE
-- =====================================
CREATE TABLE product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    name VARCHAR(255),
    price DECIMAL(10,2),
    stock INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =====================================
-- CARTS TABLE
-- =====================================
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================
-- CART ITEMS TABLE
-- =====================================
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    product_id INT,
    variant_id INT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- =====================================
-- FULFILLMENTS TABLE
-- =====================================
CREATE TABLE fulfillments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    status ENUM('pending', 'in_progress', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    tracking_number VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================
-- ORDER PAYMENTS TABLE
-- =====================================
CREATE TABLE order_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    amount DECIMAL(10,2),
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    method ENUM('cash', 'card', 'upi', 'wallet'),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================
-- INSERT DEFAULT CATEGORIES
-- =====================================
INSERT INTO categories (id, name, description) VALUES
(1, 'Plumbing', 'Plumbing services and repairs'),
(2, 'Electrical', 'Electrical installation and repairs'),
(3, 'Carpentry', 'Carpentry and woodwork services'),
(4, 'Grocery', 'Grocery and food items'),
(5, 'Medicine', 'Medicine and pharmaceutical products'),
(6, 'Ready-to-Eat', 'Ready to eat food and meals');
