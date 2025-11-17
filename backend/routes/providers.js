const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get all providers or filter by service
router.get('/', async (req, res) => {
  try {
    const { service } = req.query;
    const db = req.app.locals.db;

    let query = `
      SELECT p.*, u.name, u.email, u.phone 
      FROM providers p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.verified = TRUE
    `;

    const params = [];
    if (service && service !== 'all') {
      query += ' AND p.service_type = ?';
      params.push(service);
    }

    query += ' ORDER BY p.rating DESC';

    const [providers] = await db.query(query, params);

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch providers'
    });
  }
});

// Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [providers] = await db.query(
      `SELECT p.*, u.name, u.email, u.phone 
       FROM providers p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (providers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.json({
      success: true,
      provider: providers[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider'
    });
  }
});

// Create provider (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { service_type, experience, price_per_hour, bio } = req.body;
    const db = req.app.locals.db;

    const [result] = await db.query(
      'INSERT INTO providers (user_id, service_type, experience, price_per_hour, bio) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, service_type, experience, price_per_hour, bio]
    );

    res.status(201).json({
      success: true,
      message: 'Provider profile created successfully',
      providerId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create provider profile'
    });
  }
});

module.exports = router;
