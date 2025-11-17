const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get all bookings (requires authentication)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    let query = `
      SELECT b.*, u.name as user_name, u.email, u.phone as user_phone,
             p.service_type, prov_user.name as provider_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN providers p ON b.provider_id = p.id
      LEFT JOIN users prov_user ON p.user_id = prov_user.id
    `;

    const params = [];

    // If not admin, only show user's own bookings
    if (req.user.role !== 'admin') {
      query += ' WHERE b.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY b.created_at DESC';

    const [bookings] = await db.query(query, params);

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [bookings] = await db.query(
      `SELECT b.*, u.name as user_name, u.email, u.phone as user_phone,
              p.service_type, prov_user.name as provider_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       LEFT JOIN providers p ON b.provider_id = p.id
       LEFT JOIN users prov_user ON p.user_id = prov_user.id
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (bookings[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      booking: bookings[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
});

// Create booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      provider_id,
      service_type,
      booking_date,
      booking_time,
      address,
      phone,
      notes,
      total_amount
    } = req.body;

    const db = req.app.locals.db;

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, provider_id, service_type, booking_date, 
       booking_time, address, phone, notes, total_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, provider_id, service_type, booking_date, booking_time, 
       address, phone, notes, total_amount]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Update booking status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const db = req.app.locals.db;

    // Verify booking exists and user has permission
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only booking owner or admin can update
    if (bookings[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
});

// Delete booking
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Verify booking exists and user has permission
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (bookings[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking'
    });
  }
});

module.exports = router;
