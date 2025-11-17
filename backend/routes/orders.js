const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    let query = `
      SELECT o.*, u.name as user_name, u.email, u.phone as user_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;

    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE o.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await db.query(query, params);

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get order by ID with items
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Get order details
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email, u.phone as user_phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Check permission
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get order items
    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    order.items = items;

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      items,
      total_amount,
      delivery_address,
      phone,
      payment_method
    } = req.body;

    const db = req.app.locals.db;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Create order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, total_amount, delivery_address, phone, payment_method, status) 
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [req.user.id, total_amount, delivery_address, phone, payment_method]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Update product stock
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Update order status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const db = req.app.locals.db;

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

module.exports = router;
