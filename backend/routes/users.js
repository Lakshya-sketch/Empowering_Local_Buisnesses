const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [users] = await db.query('SELECT id, name, email, phone, address, role, created_at FROM users');

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [users] = await db.query(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const db = req.app.locals.db;

    await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

module.exports = router;
