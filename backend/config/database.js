const { Pool } = require('pg');
require('dotenv').config();

// Neon PostgreSQL connection string format
const connectionString = process.env.DATABASE_URL;

// Create the pool instance directly
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

-- User tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  token_type VARCHAR(50) NOT NULL,
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

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  sub_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  sub_plan VARCHAR(50) NOT NULL CHECK (sub_plan IN ('monthly', 'yearly', 'free')),
  sub_includes JSONB DEFAULT '[]',
  transaction_id VARCHAR(100) UNIQUE,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'pending')),
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Already exists
  end_date TIMESTAMP,                             -- Already exists
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_user_tokens_token ON user_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_transaction_id ON subscriptions(transaction_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Trigger for subscriptions table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at') THEN
        CREATE TRIGGER update_subscriptions_updated_at 
            BEFORE UPDATE ON subscriptions 
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
      await client.query(schemaSQL);
      console.log('✅ Database schema created successfully!');
    } else {
      console.log('✅ Database schema already exists');
      
      // Check if subscriptions table exists, if not create it
      const subscriptionsCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'subscriptions'
        );
      `);
      
      const subscriptionsTableExists = subscriptionsCheck.rows[0].exists;
      
      if (!subscriptionsTableExists) {
        console.log('📦 Adding subscriptions table...');
        // Extract only the subscriptions table creation part
        const subscriptionsSQL = `
          CREATE TABLE subscriptions (
            sub_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            sub_plan VARCHAR(50) NOT NULL CHECK (sub_plan IN ('monthly', 'yearly', 'free')),
            sub_includes JSONB DEFAULT '[]',
            transaction_id VARCHAR(100) UNIQUE,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'pending')),
            start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            end_date TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
          CREATE INDEX idx_subscriptions_status ON subscriptions(status);
          CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
          CREATE INDEX idx_subscriptions_transaction_id ON subscriptions(transaction_id);
          
          CREATE TRIGGER update_subscriptions_updated_at 
            BEFORE UPDATE ON subscriptions 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
        `;
        
        await client.query(subscriptionsSQL);
        console.log('✅ Subscriptions table added successfully!');
      }
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

// Export the pool directly (not as an object property)
module.exports = pool;

// Also export the functions separately if needed elsewhere
module.exports.initializeDatabase = initializeDatabase;
module.exports.testConnection = testConnection;