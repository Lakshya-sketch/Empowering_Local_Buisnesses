const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const [services] = await db.query('SELECT * FROM services');
console.log('SERVICES::', services);
res.json({ success: true, count: services.length, services });


// Get all services
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [services] = await db.query('SELECT * FROM services WHERE active = TRUE');

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get service by category
router.get('/category/:category', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [services] = await db.query(
      'SELECT * FROM services WHERE category = ? AND active = TRUE',
      [req.params.category]
    );

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Create service (Admin only)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, category, description, icon_url } = req.body;
    const db = req.app.locals.db;

    const [result] = await db.query(
      'INSERT INTO services (name, category, description, icon_url) VALUES (?, ?, ?, ?)',
      [name, category, description, icon_url]
    );

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      serviceId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
});

// Update service (Admin only)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, category, description, icon_url, active } = req.body;
    const db = req.app.locals.db;

    await db.query(
      'UPDATE services SET name = ?, category = ?, description = ?, icon_url = ?, active = ? WHERE id = ?',
      [name, category, description, icon_url, active, req.params.id]
    );

    res.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

module.exports = router;
