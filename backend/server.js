const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const pool = require('./config/database');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// ✅ FIXED CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:3000',
      ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : []),
      ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [])
    ].filter(url => url.trim() !== '');

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route (enhanced)
app.get('/health', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const dbResult = await client.query('SELECT NOW() as db_time, version() as db_version');
    
    res.status(200).json({
      success: true,
      message: 'AI Vet Backend is running successfully',
      timestamp: new Date().toISOString(),
      environment: {
        port: PORT,
        node_env: process.env.NODE_ENV,
        client_url: process.env.CLIENT_URL,
        frontend_urls: process.env.FRONTEND_URLS,
        google_client_id: process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Missing'
      },
      database: {
        status: 'connected',
        time: dbResult.rows[0].db_time,
        version: dbResult.rows[0].db_version.split(' ')[1]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI Vet Backend is running but database connection failed',
      timestamp: new Date().toISOString(),
      environment: {
        port: PORT,
        node_env: process.env.NODE_ENV,
        client_url: process.env.CLIENT_URL,
        frontend_urls: process.env.FRONTEND_URLS
      },
      database: {
        status: 'disconnected',
        error: error.message
      }
    });
  } finally {
    client.release();
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    
    // ✅ Check critical environment variables
    console.log('🔍 Environment Check:');
    console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Missing');
    console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Configured' : '✗ Missing');
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✓ Configured' : '✗ Missing');
    console.log('   FRONTEND_URLS:', process.env.FRONTEND_URLS || 'Using default (localhost:8080)');
    console.log('   CLIENT_URL:', process.env.CLIENT_URL || 'Using default (localhost:3000)');
    
    app.listen(PORT, () => {
      console.log(`\n🚀 AI Vet Backend server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Google OAuth: http://localhost:${PORT}/api/auth/google`);
      console.log(`💰 Subscription routes: /api/subscriptions`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;