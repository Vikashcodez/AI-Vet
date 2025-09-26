const { Pool } = require('pg');
require('dotenv').config();

// Neon PostgreSQL connection string format
// postgresql://username:password@host:port/database?options
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Schema SQL
const schemaSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User tokens table (for email verification, password reset, etc.)
CREATE TABLE IF NOT EXISTS user_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  token_type VARCHAR(50) NOT NULL, -- 'email_verification', 'password_reset'
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_user_tokens_token ON user_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
`;

// Function to initialize database schema
const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking database schema...');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const usersTableExists = tableCheck.rows[0].exists;
    
    if (!usersTableExists) {
      console.log('📦 Creating database schema...');
      
      // Execute schema creation
      await client.query(schemaSQL);
      
      console.log('✅ Database schema created successfully!');
      
      // Insert a test user (optional - remove in production)
      if (process.env.NODE_ENV === 'development') {
        try {
          const bcrypt = require('bcryptjs');
          const testPasswordHash = await bcrypt.hash('test123', 12);
          
          await client.query(`
            INSERT INTO users (first_name, last_name, email, phone, password_hash, email_verified) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO NOTHING
          `, ['Test', 'User', 'test@aivet.com', '+1234567890', testPasswordHash, true]);
          
          console.log('👤 Test user created: test@aivet.com / test123');
        } catch (error) {
          console.log('⚠️ Test user already exists or could not be created');
        }
      }
    } else {
      console.log('✅ Database schema already exists');
    }
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Test database connection and initialize schema
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully at:', result.rows[0].current_time);
    client.release();
    
    // Initialize schema after successful connection
    await initializeDatabase();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Event listeners
pool.on('connect', () => {
  console.log('🔌 New database connection established');
});

pool.on('error', (err) => {
  console.error('💥 Database connection error:', err);
});

// Export the pool and initialization function
module.exports = {
  pool,
  initializeDatabase,
  testConnection
};