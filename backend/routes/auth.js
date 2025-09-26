const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', validateRegistration, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateUserProfile);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;