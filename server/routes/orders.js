const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all orders
router.get('/', verifyToken, (req, res) => {
  const isAdmin = req.user.role === 'admin';
  
  let query = `
    SELECT o.*, u.username, u.email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (!isAdmin) {
    query += ' AND o.user_id = ?';
    params.push(req.user.id);
  }
  
  query += ' ORDER BY o.created_at DESC';
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get user orders
router.get('/user/:email', verifyToken, (req, res) => {
  const query = `
    SELECT o.*
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE u.email = ?
    ORDER BY o.created_at DESC
  `;
  
  db.query(query, [req.params.email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      count: results.length,
      orders: results
    });
  });
});

// Create order
router.post('/', verifyToken, (req, res) => {
  const {
    provider_id,
    total_amount,
    delivery_address,
    items
  } = req.body;
  
  const order_id = uuidv4();
  
  const query = `
    INSERT INTO orders 
    (order_id, user_id, provider_id, total_amount, delivery_address, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;
  
  db.query(
    query,
    [order_id, req.user.id, provider_id, total_amount, delivery_address],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: 'Order created successfully',
        orderId: order_id
      });
    }
  );
});

// Update order
router.put('/:id', verifyToken, (req, res) => {
  const { status } = req.body;
  
  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  
  db.query(query, [status, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully' });
  });
});

// Cancel order
router.post('/:id/cancel', verifyToken, (req, res) => {
  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  
  db.query(query, ['cancelled', req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order cancelled successfully' });
  });
});

module.exports = router;
