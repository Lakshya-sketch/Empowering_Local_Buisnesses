const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// User Signup
router.post('/signup', async (req, res) => {
    try {
        const { full_name, username, email, password, phone } = req.body;

        // Validation
        if (!full_name || !username || !email || !password) {
            return res.status(400).json({ 
                message: 'All fields are required',
                success: false 
            });
        }

        // Check if user already exists
        const existingUser = await db.getRow(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email or username',
                success: false 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const userId = await db.insert('users', {
            full_name,
            username,
            email,
            password: hashedPassword,
            phone: phone || null
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId, 
                email, 
                username,
                role: 'user' 
            },
            process.env.JWT_SECRET || 'your-secret-key-123456789',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                full_name,
                username,
                email,
                phone,
                role: 'user'
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            message: 'Error creating user account',
            error: error.message,
            success: false 
        });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!password || (!email && !username)) {
            return res.status(400).json({ 
                message: 'Email/Username and password are required',
                success: false 
            });
        }

        // Find user by email or username
        const user = await db.getRow(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email || username, username || email]
        );

        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials',
                success: false 
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid credentials',
                success: false 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                username: user.username,
                role: 'user' 
            },
            process.env.JWT_SECRET || 'your-secret-key-123456789',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: 'user'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error logging in',
            error: error.message,
            success: false 
        });
    }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hardcoded admin credentials
        if (email === 'admin@admin' && password === 'admin') {
            const token = jwt.sign(
                { 
                    userId: 'admin', 
                    email: 'admin@admin', 
                    role: 'admin' 
                },
                process.env.JWT_SECRET || 'your-secret-key-123456789',
                { expiresIn: '24h' }
            );

            return res.json({
                success: true,
                message: 'Admin login successful',
                token,
                user: {
                    id: 'admin',
                    email: 'admin@admin',
                    name: 'Administrator',
                    role: 'admin'
                }
            });
        }

        res.status(401).json({ 
            message: 'Invalid admin credentials',
            success: false 
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ 
            message: 'Error logging in',
            error: error.message,
            success: false 
        });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                message: 'No token provided',
                success: false 
            });
        }

        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'your-secret-key-123456789'
        );

        const user = await db.getRow(
            'SELECT id, full_name, username, email, phone, created_at FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found',
                success: false 
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            message: 'Error fetching profile',
            error: error.message,
            success: false 
        });
    }
});

module.exports = router;
