const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route with database status
app.get('/health', async (req, res) => {
  try {
    const { pool } = require('./config/database');
    // Test database connection
    const client = await pool.connect();
    const dbResult = await client.query('SELECT NOW() as db_time, version() as db_version');
    client.release();
    
    res.status(200).json({
      success: true,
      message: 'AI Vet Backend is running successfully',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        time: dbResult.rows[0].db_time,
        version: dbResult.rows[0].db_version.split(' ')[1] // Extract PostgreSQL version
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI Vet Backend is running but database connection failed',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        error: error.message
      }
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler - FIXED: Use proper path matching
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
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server with database initialization
const startServer = async () => {
  try {
    // Test database connection and initialize schema
    await testConnection();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 AI Vet Backend server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
      console.log(`🗄️  Database: Neon PostgreSQL`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;