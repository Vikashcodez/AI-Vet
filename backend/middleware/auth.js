const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Direct import

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's admin
    if (decoded.userId === 'admin') {
      req.user = {
        id: 'admin',
        email: process.env.ADMIN_EMAIL,
        first_name: 'Admin',
        last_name: 'User',
        phone: null,
        role: 'admin'
      };
      return next();
    }

    // Existing user check
    const userResult = await client.query(
      'SELECT id, email, first_name, last_name, phone, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = { ...userResult.rows[0], role: 'user' };
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  } finally {
    client.release();
  }
};

module.exports = { authenticateToken };