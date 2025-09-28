const express = require('express');
const router = express.Router();
const {
  createSubscriptionOrder,
  verifyPayment,
  getCurrentSubscription,
  cancelSubscription
} = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes
router.post('/create-order', authenticateToken, createSubscriptionOrder);
router.post('/verify-payment', authenticateToken, verifyPayment);
router.get('/current', authenticateToken, getCurrentSubscription);
router.post('/cancel', authenticateToken, cancelSubscription);

module.exports = router;