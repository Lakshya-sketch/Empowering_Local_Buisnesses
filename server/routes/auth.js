const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

const router = express.Router();

// Admin Login
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === 'admin@admin' && password === 'admin') {
            const token = jwt.sign(
                { userId: 'admin', role: 'admin' },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '24h' }
            );

            return res.json({
                message: 'Admin login successful',
                token,
                user: { id: 'admin', email: 'admin@admin', role: 'admin' }
            });
        }

        res.status(401).json({ message: 'Invalid admin credentials' });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

// User Signup
router.post('/signup', async (req, res) => {
    try {
        const { full_name, username, email, password, phone } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Email, username, and password are required' });
        }

        // Check if user already exists
        const existingUser = await db.getRow(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const userId = await db.insert('users', {
            full_name,
            username,
            email,
            password_hash: hashedPassword,
            phone
        });

        const token = jwt.sign(
            { userId, role: 'user' },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: userId, email, username, role: 'user' }
        });
    } catch (error) {
        res.status(500).json({ message: 'Signup error', error: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await db.getRow(
            'SELECT id, password_hash, role FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, role: 'user' },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email, role: 'user' }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

module.exports = router;
