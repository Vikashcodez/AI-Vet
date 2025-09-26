const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// User registration
const registerUser = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await client.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, first_name, last_name, email, phone, created_at`,
      [firstName, lastName, email, phone, passwordHash]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Update last login
    await client.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [newUser.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          phone: newUser.phone,
          createdAt: newUser.created_at
        },
        token
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  } finally {
    client.release();
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userResult = await pool.query(
      `SELECT id, first_name, last_name, email, phone, password_hash, is_active 
       FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          firstName: req.user.first_name,
          lastName: req.user.last_name,
          email: req.user.email,
          phone: req.user.phone
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { firstName, lastName, phone } = req.body;
    const userId = req.user.id;

    const result = await client.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3 
       WHERE id = $4 
       RETURNING first_name, last_name, email, phone, updated_at`,
      [firstName, lastName, phone, userId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          firstName: result.rows[0].first_name,
          lastName: result.rows[0].last_name,
          email: result.rows[0].email,
          phone: result.rows[0].phone,
          updatedAt: result.rows[0].updated_at
        }
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during profile update'
    });
  } finally {
    client.release();
  }
};

// Change password
const changePassword = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current password hash
    const userResult = await client.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      await client.query('ROLLBACK');
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await client.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, userId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password change'
    });
  } finally {
    client.release();
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword
};