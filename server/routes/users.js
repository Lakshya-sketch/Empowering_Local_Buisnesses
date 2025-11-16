const express = require('express');
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await db.getRow(
            'SELECT id, full_name, username, email, phone, created_at FROM users WHERE id = ?',
            [req.userId]
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { full_name, phone } = req.body;

        await db.update('users', 
            { full_name, phone },
            { id: req.userId }
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

// Get all users (admin only)
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const users = await db.getRows('SELECT id, full_name, username, email, phone, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get user by ID (admin only)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await db.getRow(
            'SELECT id, full_name, username, email, phone, created_at FROM users WHERE id = ?',
            [req.params.id]
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await db.deleteRow('users', { id: req.params.id });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

module.exports = router;
