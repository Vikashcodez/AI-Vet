const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const pool = require("../config/database.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const client = await pool.connect();

      try {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";

        console.log("🔑 Google login attempt for:", email);

        if (!email) {
          throw new Error("Google profile missing email address.");
        }

        // Check if user exists
        const userResult = await client.query(
          `SELECT id, first_name, last_name, email, phone, email_verified, phone_verified, is_active, last_login, created_at, updated_at 
           FROM users WHERE email = $1`,
          [email]
        );

        let user;

        if (userResult.rows.length > 0) {
          // Existing user
          user = userResult.rows[0];
          console.log("✅ Existing user found:", user.id);

          // Update last login timestamp
          await client.query(
            `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
            [user.id]
          );
        } else {
          // New user creation
          const insertResult = await client.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, email_verified)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, first_name, last_name, email, phone, email_verified, phone_verified, is_active, last_login, created_at, updated_at`,
            [firstName, lastName, email, "oauth_google", true]
          );

          user = insertResult.rows[0];
          console.log("🆕 New user created with ID:", user.id);
        }

        // Generate JWT
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // Construct user data for frontend
        const userData = {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone || null,
          emailVerified: user.email_verified,
          phoneVerified: user.phone_verified,
          isActive: user.is_active,
          lastLogin: user.last_login,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        };

        console.log("✅ Google OAuth login successful for:", email);
        return done(null, { token, user: userData });
      } catch (error) {
        console.error("❌ Google authentication error:", error);
        return done(error, null);
      } finally {
        client.release();
      }
    }
  )
);

module.exports = passport;