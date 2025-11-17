const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all products or filter by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const db = req.app.locals.db;

    let query = 'SELECT * FROM products WHERE active = TRUE';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [products] = await db.query(query, params);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: products[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Create product (Admin/Provider only)
router.post('/', authenticateToken, authorizeRole('admin', 'provider'), async (req, res) => {
  try {
    const { name, category, price, description, image_url, stock } = req.body;
    const db = req.app.locals.db;

    const [result] = await db.query(
      `INSERT INTO products (name, category, price, description, image_url, stock, provider_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category, price, description, image_url, stock, req.user.providerId || null]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      productId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// Update product
router.put('/:id', authenticateToken, authorizeRole('admin', 'provider'), async (req, res) => {
  try {
    const { name, category, price, description, image_url, stock, active } = req.body;
    const db = req.app.locals.db;

    await db.query(
      `UPDATE products SET name = ?, category = ?, price = ?, description = ?, 
       image_url = ?, stock = ?, active = ? WHERE id = ?`,
      [name, category, price, description, image_url, stock, active, req.params.id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// Delete product
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

module.exports = router;
