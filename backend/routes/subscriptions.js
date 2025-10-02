const express = require('express');
const router = express.Router();
const {
  createSubscriptionOrder,
  verifyPayment,
  getCurrentSubscription,
  cancelSubscription,
  getSubscriptionByUserId,
  getAllSubscriptions
} = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes
router.get('/', getAllSubscriptions);
router.post('/create-order', authenticateToken, createSubscriptionOrder);
router.post('/verify-payment', authenticateToken, verifyPayment);
router.get('/current', authenticateToken, getCurrentSubscription);
router.post('/cancel', authenticateToken, cancelSubscription);
router.get('/user/:userId', authenticateToken, getSubscriptionByUserId);

module.exports = router;