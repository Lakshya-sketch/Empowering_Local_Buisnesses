const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.userId = decoded.userId;
        req.user = decoded; // Add this
        req.role = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
};

// Alias: verifyAdmin (same as isAdmin)
const verifyAdmin = isAdmin;

// Export all three
module.exports = { verifyToken, isAdmin, verifyAdmin };
