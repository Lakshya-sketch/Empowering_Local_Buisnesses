const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all bookings (user sees their own, admin sees all)
router.get('/', verifyToken, (req, res) => {
  const isAdmin = req.user.role === 'admin';
  
  let query = `
    SELECT b.*, u.username, u.email, s.name as service_name, p.name as provider_name
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN services s ON b.service_id = s.id
    LEFT JOIN providers p ON b.provider_id = p.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (!isAdmin) {
    query += ' AND b.user_id = ?';
    params.push(req.user.id);
  }
  
  query += ' ORDER BY b.created_at DESC';
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get user bookings
router.get('/user/:email', verifyToken, (req, res) => {
  const query = `
    SELECT b.*, s.name as service_name, p.name as provider_name
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN services s ON b.service_id = s.id
    LEFT JOIN providers p ON b.provider_id = p.id
    WHERE u.email = ?
    ORDER BY b.created_at DESC
  `;
  
  db.query(query, [req.params.email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      count: results.length,
      bookings: results
    });
  });
});

// Create booking
router.post('/', verifyToken, (req, res) => {
  const {
    service_id,
    provider_id,
    scheduled_date,
    scheduled_time,
    work_description,
    total_amount
  } = req.body;
  
  const booking_id = uuidv4();
  
  const query = `
    INSERT INTO bookings 
    (booking_id, user_id, service_id, provider_id, scheduled_date, 
     scheduled_time, work_description, total_amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;
  
  db.query(
    query,
    [booking_id, req.user.id, service_id, provider_id, scheduled_date,
     scheduled_time, work_description, total_amount],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: 'Booking created successfully',
        booking_id: booking_id
      });
    }
  );
});

// Update booking status
router.put('/:id', verifyToken, (req, res) => {
  const { status } = req.body;
  
  const query = 'UPDATE bookings SET status = ? WHERE id = ?';
  
  db.query(query, [status, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking updated successfully' });
  });
});

// Cancel booking
router.post('/:id/cancel', verifyToken, (req, res) => {
  const query = 'UPDATE bookings SET status = ? WHERE id = ?';
  
  db.query(query, ['cancelled', req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled successfully' });
  });
});

module.exports = router;
