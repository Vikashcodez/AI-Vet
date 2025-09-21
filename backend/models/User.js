const { pool } = require('../config/database');

class User {
  static async findByGoogleId(googleId) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE google_id = $1',
        [googleId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by Google ID:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { google_id, name, email, avatar } = userData;
      const result = await pool.query(
        `INSERT INTO users (google_id, name, email, avatar) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [google_id, name, email, avatar]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const { name, email, avatar } = userData;
      const result = await pool.query(
        `UPDATE users 
         SET name = $2, email = COALESCE($3, email), avatar = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id, name, email, avatar]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getAllUsers(limit = 50, offset = 0) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, avatar, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}

module.exports = User;
