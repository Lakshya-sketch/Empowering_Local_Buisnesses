const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get all services
router.get('/', (req, res) => {
  const { provider_id, category_id } = req.query;
  
  let query = `
    SELECT s.*, p.name as provider_name, c.name as category_name
    FROM services s
    LEFT JOIN providers p ON s.provider_id = p.id
    LEFT JOIN categories c ON s.category_id = c.id
    WHERE 1=1
  `;
  const params = [];
  
  if (provider_id) {
    query += ' AND s.provider_id = ?';
    params.push(provider_id);
  }
  
  if (category_id) {
    query += ' AND s.category_id = ?';
    params.push(category_id);
  }
  
  query += ' ORDER BY s.created_at DESC';
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get single service
router.get('/:id', (req, res) => {
  const query = `
    SELECT s.*, p.name as provider_name, c.name as category_name
    FROM services s
    LEFT JOIN providers p ON s.provider_id = p.id
    LEFT JOIN categories c ON s.category_id = c.id
    WHERE s.id = ?
  `;
  
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(results[0]);
  });
});

// Create service (admin only)
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  const { 
    provider_id,
    category_id,
    name,
    description,
    base_price,
    duration_minutes,
    is_available = true
  } = req.body;
  
  const query = `
    INSERT INTO services 
    (provider_id, category_id, name, description, base_price, duration_minutes, is_available)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(
    query,
    [provider_id, category_id, name, description, base_price, duration_minutes, is_available],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: 'Service created successfully',
        id: result.insertId
      });
    }
  );
});

// Update service (admin only)
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
  const { name, description, base_price, duration_minutes, is_available } = req.body;
  
  const query = `
    UPDATE services 
    SET name = ?, description = ?, base_price = ?, 
        duration_minutes = ?, is_available = ?
    WHERE id = ?
  `;
  
  db.query(
    query,
    [name, description, base_price, duration_minutes, is_available, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json({ message: 'Service updated successfully' });
    }
  );
});

// Delete service (admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  const query = 'DELETE FROM services WHERE id = ?';
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  });
});

module.exports = router;
