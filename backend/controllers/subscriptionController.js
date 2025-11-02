const razorpay = require('../config/razorpay');
const pool = require('../config/database');

// Create Razorpay order for subscription
const createSubscriptionOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { planType, currency = 'INR' } = req.body;
    const userId = req.user.id;

    // Plan pricing configuration
    const planPrices = {
      monthly: {
        INR: 39900, // 399 INR in paise
        USD: 499,   // 4.99 USD in cents
        EUR: 449,   // 4.49 EUR in cents
        GBP: 399    // 3.99 GBP in pence
      },
      yearly: {
        INR: 450000, // 4500 INR in paise
        USD: 5499,   // 54.99 USD in cents
        EUR: 4999,   // 49.99 EUR in cents
        GBP: 4399    // 43.99 GBP in pence
      }
    };

    const amount = planPrices[planType]?.[currency];
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type or currency'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: currency,
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        planType: planType,
        description: `AI Vet ${planType} subscription`
      }
    };

    const order = await razorpay.orders.create(options);

    // Store order details temporarily (you can use Redis or database)
    await client.query(
      'INSERT INTO user_tokens (user_id, token, token_type, expires_at) VALUES ($1, $2, $3, $4)',
      [userId, order.id, 'razorpay_order', new Date(Date.now() + 30 * 60 * 1000)] // 30 minutes expiry
    );

    res.json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  } finally {
    client.release();
  }
};

// Verify payment and create subscription
const verifyPayment = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get order details from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);

    // Check if this order was created for this user
    const orderCheck = await client.query(
      'SELECT * FROM user_tokens WHERE user_id = $1 AND token = $2 AND token_type = $3 AND used = false AND expires_at > NOW()',
      [userId, razorpay_order_id, 'razorpay_order']
    );

    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Invalid order'
      });
    }

    const planType = order.notes.planType;
    
    // Calculate subscription dates
    const startDate = new Date();
    let endDate = new Date();
    
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Define subscription features based on plan
    const subscriptionIncludes = {
      monthly: [
        "AI Symptom Checker (Unlimited)",
        "Disease Prediction Analysis",
        "Diet Evaluation & Planning",
        "Preventive Healthcare Tips",
        "Health Risk Predictor",
        "AI Veterinary Assistant",
        "Activity Level Assessment",
        "Digital Prescription Generator",
        "24/7 Support"
      ],
      yearly: [
        "AI Symptom Checker (Unlimited)",
        "Disease Prediction Analysis",
        "Diet Evaluation & Planning",
        "Preventive Healthcare Tips",
        "Health Risk Predictor",
        "AI Veterinary Assistant",
        "Activity Level Assessment",
        "Digital Prescription Generator",
        "Advanced Health Analytics",
        "Priority Support & Updates",
        "24/7 Support"
      ]
    };

    // Create subscription record
    const subscriptionResult = await client.query(
      `INSERT INTO subscriptions (
        user_id, sub_plan, sub_includes, transaction_id, 
        transaction_date, status, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING sub_id, sub_plan, start_date, end_date, status`,
      [
        userId,
        planType,
        JSON.stringify(subscriptionIncludes[planType]),
        razorpay_payment_id,
        new Date(),
        'active',
        startDate,
        endDate
      ]
    );

    // Mark order token as used
    await client.query(
      'UPDATE user_tokens SET used = true WHERE token = $1',
      [razorpay_order_id]
    );

    // Update user's current subscription status if needed
    await client.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Payment verified and subscription activated successfully',
      data: {
        subscription: subscriptionResult.rows[0],
        paymentId: razorpay_payment_id,
        planType: planType
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  } finally {
    client.release();
  }
};

// Get user's current subscription
const getCurrentSubscription = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const userId = req.user.id;

    const subscriptionResult = await client.query(
      `SELECT s.*, u.first_name, u.last_name, u.email 
       FROM subscriptions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.user_id = $1 AND s.status = 'active' 
       ORDER BY s.created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.json({
        success: true,
        message: 'No active subscription found',
        data: {
          hasSubscription: false,
          plan: 'free'
        }
      });
    }

    const subscription = subscriptionResult.rows[0];
    
    // Check if subscription is expired
    if (subscription.end_date && new Date() > new Date(subscription.end_date)) {
      await client.query(
        'UPDATE subscriptions SET status = $1 WHERE sub_id = $2',
        ['expired', subscription.sub_id]
      );
      
      return res.json({
        success: true,
        message: 'Subscription has expired',
        data: {
          hasSubscription: false,
          plan: 'free'
        }
      });
    }

    res.json({
      success: true,
      data: {
        hasSubscription: true,
        subscription: {
          id: subscription.sub_id,
          plan: subscription.sub_plan,
          includes: subscription.sub_includes,
          startDate: subscription.start_date,
          endDate: subscription.end_date,
          status: subscription.status,
          transactionId: subscription.transaction_id
        }
      }
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription details'
    });
  } finally {
    client.release();
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const userId = req.user.id;
    const { subscriptionId } = req.body;

    // Update subscription status to canceled
    const result = await client.query(
      'UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE sub_id = $2 AND user_id = $3 RETURNING *',
      ['canceled', subscriptionId, userId]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Subscription canceled successfully',
      data: {
        subscription: result.rows[0]
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  } finally {
    client.release();
  }
};
// Get subscription by user ID
const getSubscriptionByUserId = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const userId = req.params.userId;

    const subscriptionResult = await client.query(
      `SELECT s.*, u.first_name, u.last_name, u.email 
       FROM subscriptions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.user_id = $1 
       ORDER BY s.created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.json({
        success: true,
        message: 'No subscription found for this user',
        data: null
      });
    }

    const subscription = subscriptionResult.rows[0];
    
    res.json({
      success: true,
      data: {
        subscription: {
          id: subscription.sub_id,
          userId: subscription.user_id,
          plan: subscription.sub_plan,
          includes: subscription.sub_includes,
          transactionId: subscription.transaction_id,
          transactionDate: subscription.transaction_date,
          status: subscription.status,
          startDate: subscription.start_date,
          endDate: subscription.end_date,
          createdAt: subscription.created_at,
          updatedAt: subscription.updated_at
        },
        user: {
          firstName: subscription.first_name,
          lastName: subscription.last_name,
          email: subscription.email
        }
      }
    });

  } catch (error) {
    console.error('Get subscription by user ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription details'
    });
  } finally {
    client.release();
  }
};

// Get all subscriptions
const getAllSubscriptions = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { page = 1, limit = 10, status, planType } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, u.first_name, u.last_name, u.email, u.phone 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id 
    `;
    
    let countQuery = `
      SELECT COUNT(*) 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id 
    `;

    const queryParams = [];
    const whereConditions = [];

    // Add filters if provided
    if (status) {
      whereConditions.push(`s.status = $${queryParams.length + 1}`);
      queryParams.push(status);
    }

    if (planType) {
      whereConditions.push(`s.sub_plan = $${queryParams.length + 1}`);
      queryParams.push(planType);
    }

    // Add WHERE clause if filters exist
    if (whereConditions.length > 0) {
      const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
      query += whereClause;
      countQuery += whereClause;
    }

    // Add ordering and pagination
    query += ` ORDER BY s.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    // Execute queries
    const subscriptionsResult = await client.query(query, queryParams);
    const countResult = await client.query(countQuery, queryParams.slice(0, -2)); // Remove limit and offset for count

    const totalSubscriptions = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalSubscriptions / limit);

    const subscriptions = subscriptionsResult.rows.map(sub => ({
      id: sub.sub_id,
      userId: sub.user_id,
      user: {
        firstName: sub.first_name,
        lastName: sub.last_name,
        email: sub.email,
        phone: sub.phone
      },
      plan: sub.sub_plan,
      includes: sub.sub_includes,
      transactionId: sub.transaction_id,
      transactionDate: sub.transaction_date,
      status: sub.status,
      startDate: sub.start_date,
      endDate: sub.end_date,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at
    }));

    res.json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalSubscriptions,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createSubscriptionOrder,
  verifyPayment,
  getCurrentSubscription,
  getSubscriptionByUserId,
  cancelSubscription,
  getAllSubscriptions
};