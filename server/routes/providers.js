const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all providers or filter by category
router.get('/', async (req, res) => {
    try {
        const { category_id } = req.query;
        
        let query = 'SELECT * FROM providers WHERE 1=1';
        const params = [];
        
        if (category_id) {
            query += ' AND category_id = ?';
            params.push(category_id);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const providers = await db.getRows(query, params);
        
        res.json(providers);
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ 
            message: 'Error fetching providers', 
            error: error.message 
        });
    }
});

// Get single provider
router.get('/:id', async (req, res) => {
    try {
        const provider = await db.getRow(
            'SELECT * FROM providers WHERE id = ?',
            [req.params.id]
        );
        
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        
        res.json(provider);
    } catch (error) {
        console.error('Error fetching provider:', error);
        res.status(500).json({ 
            message: 'Error fetching provider', 
            error: error.message 
        });
    }
});

// Create new provider
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, category_id, business_address, hourly_rate, experience, profile_image, status, description } = req.body;
        
        if (!name || !category_id) {
            return res.status(400).json({ message: 'Name and category are required' });
        }
        
        const id = await db.insert('providers', {
            name,
            email,
            phone,
            category_id,
            business_address,
            hourly_rate: hourly_rate || 0,
            experience,
            profile_image,
            status: status || 'active',
            description
        });
        
        res.status(201).json({
            message: 'Provider created successfully',
            id
        });
    } catch (error) {
        console.error('Error creating provider:', error);
        res.status(500).json({ 
            message: 'Error creating provider', 
            error: error.message 
        });
    }
});

// Update provider
router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone, category_id, business_address, hourly_rate, experience, profile_image, status, description } = req.body;
        
        await db.update('providers', {
            name,
            email,
            phone,
            category_id,
            business_address,
            hourly_rate,
            experience,
            profile_image,
            status,
            description
        }, {
            id: req.params.id
        });
        
        res.json({ message: 'Provider updated successfully' });
    } catch (error) {
        console.error('Error updating provider:', error);
        res.status(500).json({ 
            message: 'Error updating provider', 
            error: error.message 
        });
    }
});

// Delete provider
router.delete('/:id', async (req, res) => {
    try {
        await db.deleteRow('providers', { id: req.params.id });
        
        res.json({ message: 'Provider deleted successfully' });
    } catch (error) {
        console.error('Error deleting provider:', error);
        res.status(500).json({ 
            message: 'Error deleting provider', 
            error: error.message 
        });
    }
});

module.exports = router;
