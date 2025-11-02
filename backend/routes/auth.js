const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');

const passport = require("../services/googleAuth");


// Public routes
router.post('/register', validateRegistration, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

// Remove the problematic routes for now - we'll add them back later
// router.put('/profile', authenticateToken, updateUserProfile);
// router.put('/change-password', authenticateToken, changePassword);

router.get("/google", (req, res, next) => {
  const redirectUrl = req.query.redirect || "";
  const state = encodeURIComponent(JSON.stringify({ redirectUrl }));
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state,
  })(req, res, next);
});


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URLS?.split(",")[0]}/login?error=oauth_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const { token, user } = req.user;
      console.log('Google OAuth successful for user:', user.id, user.email);
      const allowedUrls = process.env.FRONTEND_URLS
        ? process.env.FRONTEND_URLS.split(",").map((u) => u.trim())
        : ["http://localhost:8080"];
      let frontendUrl = allowedUrls[0];
      if (req.query.state) {
        try {
          const state = JSON.parse(decodeURIComponent(req.query.state));
          if (state.redirectUrl) frontendUrl = state.redirectUrl;
        } catch {
          // Use default URL if state parsing fails
        }
      }
      const redirectUrl = new URL("/auth/callback", frontendUrl);
      redirectUrl.searchParams.set("token", token);
      redirectUrl.searchParams.set(
        "user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role || "patient",
          firstName: user.firstName,
          lastName: user.lastName,
        })
      );
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const allowedUrls = process.env.CLIENT_URLS
        ? process.env.CLIENT_URLS.split(",").map((u) => u.trim())
        : ["http://localhost:8080"];
      res.redirect(`${allowedUrls[0]}/login?error=callback_failed`);
    }
  }
);


module.exports = router;