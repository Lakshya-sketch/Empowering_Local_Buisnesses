const express = require('express');
const db = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await db.getRows('SELECT * FROM products WHERE active = true');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get products by provider
router.get('/provider/:providerId', async (req, res) => {
    try {
        const products = await db.getRows(
            'SELECT * FROM products WHERE provider_id = ? AND active = true',
            [req.params.providerId]
        );
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await db.getRow('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get variants
        const variants = await db.getRows(
            'SELECT * FROM product_variants WHERE product_id = ?',
            [req.params.id]
        );

        res.json({ ...product, variants });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// Create product (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { provider_id, category_id, name, description, price, stock } = req.body;

        if (!name || !provider_id) {
            return res.status(400).json({ message: 'Name and provider_id are required' });
        }

        const productId = await db.insert('products', {
            provider_id,
            category_id,
            name,
            description,
            price,
            stock: stock || 0,
            active: true
        });

        res.status(201).json({
            message: 'Product created successfully',
            id: productId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// Update product (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, stock, active } = req.body;

        await db.update('products',
            { name, description, price, stock, active },
            { id: req.params.id }
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.deleteRow('products', { id: req.params.id });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Create product variant (admin only)
router.post('/:productId/variants', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        const variantId = await db.insert('product_variants', {
            product_id: req.params.productId,
            name,
            price,
            stock: stock || 0,
            active: true
        });

        res.status(201).json({
            message: 'Variant created successfully',
            id: variantId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating variant', error: error.message });
    }
});

// Update product variant (admin only)
router.put('/:productId/variants/:variantId', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, price, stock, active } = req.body;

        await db.update('product_variants',
            { name, price, stock, active },
            { id: req.params.variantId }
        );

        res.json({ message: 'Variant updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating variant', error: error.message });
    }
});

// Delete product variant (admin only)
router.delete('/:productId/variants/:variantId', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.deleteRow('product_variants', { id: req.params.variantId });
        res.json({ message: 'Variant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting variant', error: error.message });
    }
});

module.exports = router;
